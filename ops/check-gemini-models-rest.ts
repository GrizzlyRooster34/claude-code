// Termux-safe: lists Vertex models via REST using service-account ADC.
// Usage: bun run ops/check-gemini-models-rest.ts [--apply]
import { readFileSync, writeFileSync, existsSync } from "fs";
import fetch from "node-fetch";
import { GoogleAuth } from "google-auth-library";

const PROJECT = process.env.GCLOUD_PROJECT!;
const REGION  = process.env.GCLOUD_REGION || "us-central1";
const ENV_PATH = process.env.ENV_PATH || ".env";
const ORDER = (process.env.PREFERRED_ORDER || "pro,flash").split(",").map(s=>s.trim().toLowerCase());

function parseVersion(id: string){ // gemini-2.5-pro
  const m = id.match(/^gemini-(\d+)(?:\.(\d+))?-(\w+)/i);
  if (!m) return { major:0, minor:0, tier:"flash" };
  return { major:+m[1], minor: +(m[2]||0), tier: m[3].toLowerCase() };
}
function tierRank(tier: string){ const i=ORDER.indexOf(tier); return i==-1?0:(ORDER.length-i); }
function score(id: string){ const {major,minor,tier}=parseVersion(id); return major*1_000_000+minor*1_000+tierRank(tier); }

async function getToken(){
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"]});
  const client = await auth.getClient();
  const t = await client.getAccessToken();
  if (!t) throw new Error("no token"); return t as string;
}
async function listModels(): Promise<string[]>{
  const token = await getToken();
  const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${REGION}/models`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
  const j = await r.json();
  const names: string[] = (j.models||[]).map((m:any)=>m.name||"");
  const ids = names.map((n)=>n.split("/").pop() || "").filter(id=>id.startsWith("publishers/google/models/gemini-") || id.startsWith("gemini-")).map(id=>{
    return id.startsWith("publishers/") ? id.replace(/^.*\/(gemini-[\w\.\-]+)$/,'$1') : id;
  });
  return Array.from(new Set(ids));
}
function readEnvModel(){ if(!existsSync(ENV_PATH)) return null; const t=readFileSync(ENV_PATH,"utf8"); const m=t.match(/^\s*GEMINI_MODEL\s*=\s*"?([^"]+)"?\s*$/m); return m?m[1].trim():null; }
function writeEnvModel(newModel: string){
  const backup = `${ENV_PATH}.bak`; const t = existsSync(ENV_PATH)? readFileSync(ENV_PATH,"utf8"): "";
  writeFileSync(backup, t);
  let out = t;
  if (out.match(/^\s*GEMINI_MODEL\s*=/m)) out = out.replace(/^\s*GEMINI_MODEL\s*=.*$/m, `GEMINI_MODEL="${newModel}"`);
  else out += (out.endsWith("\n")?"":"\n")+`GEMINI_MODEL="${newModel}"\n`;
  writeFileSync(ENV_PATH, out);
  return backup;
}

(async ()=>{
  const apply = process.argv.includes("--apply");
  const ids = await listModels();
  if (!ids.length) { console.log("No Gemini models visible."); process.exit(0); }
  ids.sort((a,b)=>score(b)-score(a));
  const best = ids[0];
  const current = readEnvModel();

  if (!current) {
    console.log(`[DRY] Recommended: ${best}`);
    if (apply) { const bak=writeEnvModel(best); console.log(`[APPLY] GEMINI_MODEL=${best} (backup ${bak})`); }
    return;
  }
  if (score(best) > score(current)) {
    console.log(`[DRY] Upgrade: ${current} -> ${best}`);
    if (apply) { const bak=writeEnvModel(best); console.log(`[APPLY] GEMINI_MODEL=${best} (backup ${bak})`); }
  } else {
    console.log(`Current (${current}) is optimal.`);
  }
})().catch(e=>{
  console.error(e);
  process.exit(2);
});
