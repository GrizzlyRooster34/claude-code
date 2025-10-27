import { getSecret } from "./vault";
import { getModule } from "./modules";
import { execDeepAgent } from "../adapters/deepAgent";
import { execOpenAI } from "../adapters/openai";
import { shouldAllowClaudeHeavy, getFuel, isOfflineMode, conservativeMode } from "./fuel";
import { execGemini } from "../adapters/gemini";
import { callClaudeTool } from "../adapters/claude";
import { nextHop, checkLoop, newTrace } from "./trace";
import { evaluate } from "./eval-lite";

// helper: is agent ready?
import fs from "fs";

function isReady(agent: string): boolean {
  const spec = getModule(agent); if (!spec) return false;
  if (spec.auth.mode === "local" || spec.auth.mode === "gcp_adc") return true;
  if (agent === "deepAgent") {
    const configPath = `${process.env.HOME}/.deepagent/config.json`;
    return fs.existsSync(configPath);
  }
  const sec = getSecret(agent);
  if (spec.auth.mode === "api_key" || spec.auth.mode === "cli_login") return !!(sec?.api_key);
  if (spec.auth.mode === "oauth_device" || spec.auth.mode === "pkce") return !!(sec?.access_token);
  return false;
}

export async function routeTask(data: { prompt: string; flags?: { force?: boolean }, trace?: { id?: string, hops?: number }}) {
  if (data.trace && checkLoop(data.trace)) {
    return { error: "loop_guard", trace: data.trace };
  }
  const trace = nextHop(data.trace || newTrace("seven"), "router");

  if (isOfflineMode() || conservativeMode()) {
    return callClaudeTool("default-run", { prompt: data.prompt });
  }

  const p = data.prompt.toLowerCase();
  const fuel = getFuel();

  // Example: if long-running workflow, prefer DeepAgent when authenticated
  const wantsWorkflow = /run|workflow|schedule|long/.test(p);
  if (wantsWorkflow && isReady("deepAgent")) {
    return await execDeepAgent({ prompt: data.prompt, contextRefs: data.contextRefs });
  }
  // If “judge”/“write”, prefer OpenAI when authenticated
  else if (/(judge|score|narrate|rewrite|expand)/.test(p) && isReady("openai")) {
    return await execOpenAI({ prompt: data.prompt });
  }

  const useGemini = /search|google|drive|sheet|fact|verify|crawl|url|doc/.test(p);
  const useClaude = /code|refactor|test|lint|fix|explain|git|review|build/.test(p);

  // Budget/Quota guard (example: low Vertex rate -> avoid Gemini)
  if ((fuel.vertexRate ?? 1000) < 50 && useGemini && !data.flags?.force) {
    return callClaudeTool("default-run", { prompt: data.prompt });
  }

  if (useGemini) {
    const out = await execGemini(data);
    if (!evaluate(out.text || JSON.stringify(out), { maxLen: 10000 })) {
      // fallback to Claude or retry
      return callClaudeTool("default-run", { prompt: data.prompt + "\n(Refine this result)" });
    }
    return out;
  }
  if (!shouldAllowClaudeHeavy(data.flags?.force)) return execGemini(data);

  return callClaudeTool("default-run", { prompt: data.prompt });
}
