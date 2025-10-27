// ops/check-gemini-models.ts
// Usage:
//  - Dry run:  bun run ops/check-gemini-models.ts
//  - Apply:     bun run ops/check-gemini-models.ts --apply
// Env:
//  - GCLOUD_REGION (default: us-central1)
//  - ENV_PATH      (default: .env)
//  - PREFERRED_ORDER (optional): comma list, e.g. "pro,flash"
//
// Requires: gcloud CLI authenticated for the project.

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

type ModelRow = { name: string };
const REGION = process.env.GCLOUD_REGION || "us-central1";
const ENV_PATH = process.env.ENV_PATH || ".env";
const PREFERRED_ORDER = (process.env.PREFERRED_ORDER || "pro,flash")
  .split(",").map(s => s.trim().toLowerCase());

function extractModelId(fullName: string): string | null {
  // publishers/google/models/gemini-1.5-flash -> gemini-1.5-flash
  const m = fullName.match(/publishers\/google\/models\/(gemini-[\w\.\-]+)/i);
  return m ? m[1] : null;
}

function parseVersion(modelId: string) {
  // gemini-2.5-pro  -> {major:2, minor:5, tier:"pro"}
  // gemini-2-pro    -> {major:2, minor:0, tier:"pro"}
  const m = modelId.match(/^gemini-(\d+)\.(\d+)-([a-z0-9\-]+)$/i)
        || modelId.match(/^gemini-(\d+)-([a-z0-9\-]+)$/i);
  if (!m) return { major: 0, minor: 0, tier: "flash" };
  if (m.length === 3) return { major: parseInt(m[1],10), minor: 0, tier: m[2].toLowerCase() };
  return { major: parseInt(m[1],10), minor: parseInt(m[2],10), tier: m[3].toLowerCase() };
}

function tierRank(tier: string) {
  const idx = PREFERRED_ORDER.indexOf(tier);
  return idx === -1 ? 0 : (PREFERRED_ORDER.length - idx); // higher is better
}

function score(modelId: string): number {
  const { major, minor, tier } = parseVersion(modelId);
  return major * 1_000_000 + minor * 1_000 + tierRank(tier);
}

function listModels(): string[] {
  const raw = execSync(`gcloud ai models list --region=${REGION} --format=json`, { encoding: "utf8" });
  const rows: ModelRow[] = JSON.parse(raw);
  const ids = rows
    .map(r => extractModelId(r.name))
    .filter((x): x is string => !!x)
    .filter(id => id.startsWith("gemini-"));
  // Keep unique & stable
  return Array.from(new Set(ids));
}

function readEnvModel(): string | null {
  if (!existsSync(ENV_PATH)) return null;
  const txt = readFileSync(ENV_PATH, "utf8");
  const m = txt.match(/^\s*GEMINI_MODEL\s*=\s*"?([^"\n\r]+)"?\s*$/m);
  return m ? m[1].trim() : null;
}

function writeEnvModel(newModel: string) {
  const backupPath = `${ENV_PATH}.bak`;
  let txt = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
  // backup
  writeFileSync(backupPath, txt);

  if (txt.match(/^\s*GEMINI_MODEL\s*=/m)) {
    txt = txt.replace(/^\s*GEMINI_MODEL\s*=.*$/m, `GEMINI_MODEL="${newModel}"`);
  } else {
    txt += (txt.endsWith("\n") ? "" : "\n") + `GEMINI_MODEL="${newModel}"\n`;
  }
  writeFileSync(ENV_PATH, txt);
  return backupPath;
}

(async function main() {
  const apply = process.argv.includes("--apply");
  let ids: string[] = [];
  try {
    ids = listModels();
  } catch (e: any) {
    console.error("[ERR] gcloud list failed. Is CLI installed/authenticated?");
    console.error(String(e));
    process.exit(2);
  }
  if (ids.length === 0) {
    console.log("No Gemini models visible in Vertex.");
    process.exit(0);
  }

  ids.sort((a, b) => score(b) - score(a));
  const best = ids[0];
  const current = readEnvModel();

  const msgPrefix = apply ? "[APPLY]" : "[DRY]";
  if (!current) {
    console.log(`${msgPrefix} Recommended model: ${best} (no current GEMINI_MODEL)`);
    if (apply) {
      const bak = writeEnvModel(best);
      console.log(`[APPLY] Set GEMINI_MODEL=${best} in ${ENV_PATH} (backup: ${bak})`);
    }
    process.exit(0);
  }

  if (score(best) > score(current)) {
    console.log(`${msgPrefix} Upgrade available: ${current} -> ${best}`);
    if (apply) {
      const bak = writeEnvModel(best);
      console.log(`[APPLY] Updated GEMINI_MODEL=${best} in ${ENV_PATH} (backup: ${bak})`);
    }
  } else {
    console.log(`Current model (${current}) is optimal among available IDs.`);
  }
})();
