import { spawn, SpawnOptions } from "child_process";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const HOME  = process.env.HOME || "/data/data/com.termux/files/home";
const BIN   = path.resolve(process.cwd(), "vendor/llama.cpp/build/bin");
const SRV   = process.env.SEVEN_LLAMA_SERVER || path.join(BIN, "llama-server");
const HOST  = process.env.SEVEN_LLAMA_HOST || "127.0.0.1";
const PORT  = parseInt(process.env.SEVEN_LLAMA_PORT || "8080", 10);
const MODEL = process.env.SEVEN_LLAMA_MODEL || path.join(HOME, "models/llama/default.gguf");
const CTX   = process.env.SEVEN_LLAMA_CTX || "8192";
const THR   = process.env.SEVEN_LLAMA_THREADS || String(Math.max(1, require("os").cpus().length - 1));

let serverProc: ReturnType<typeof spawn> | null = null;
let lastStart = 0;

// --- import your core hooks (Gemini: wire to actual copies from seven-of-nine-core-clean)
import { preplan, postprocess } from "../core/consciousness/pipeline"; // adjust if paths differ
import { recall, commit } from "../core/memory/api";                    // adjust if paths differ

async function isUp(): Promise<boolean> {
  try { const r = await fetch(`http://${HOST}:${PORT}/health`); return r.ok; } catch { return false; }
}
async function ensureServer(): Promise<void> {
  if (await isUp()) return;
  const now = Date.now();
  if (serverProc && now - lastStart < 1500) return;
  if (!fs.existsSync(SRV)) throw new Error("llama-server not found");
  if (!fs.existsSync(MODEL)) throw new Error("SEVEN_LLAMA_MODEL not found");

  const args = ["--host", HOST, "--port", String(PORT), "--model", MODEL, "--ctx-size", CTX, "--parallel", THR, "--no-mmap"];
  const opts: SpawnOptions = { stdio: "ignore" };
  serverProc = spawn(SRV, args, opts);
  lastStart = now;
  for (let i=0;i<80;i++) { if (await isUp()) return; await new Promise(r => setTimeout(r, 100)); }
  throw new Error("llama-server failed to start");
}

export async function execSeven(data: {
  prompt: string; system?: string; temperature?: number; top_p?: number;
  stream?: boolean; memoryKey?: string; traceId?: string;
}) {
  await ensureServer();

  const memories = data.memoryKey ? await recall(data.memoryKey) : [];
  const plan = await preplan({ prompt: data.prompt, system: data.system, memories });

  const body = {
    model: "local-gguf",
    temperature: data.temperature ?? 0.6,
    top_p: data.top_p ?? 0.95,
    stream: false,
    messages: [
      ...(plan.system ? [{ role: "system", content: plan.system }] : []),
      ...(plan.primer ? [{ role: "system", content: plan.primer }] : []),
      { role: "user", content: plan.prompt }
    ]
  };

  const r = await fetch(`http://${HOST}:${PORT}/v1/chat/completions`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  const j = await r.json();
  if (!r.ok) return { error: "seven_local_llm_error", status: r.status, out: j };

  const text = j?.choices?.[0]?.message?.content || "";
  const post = await postprocess({ input: plan, output: text, traceId: data.traceId });
  if (data.memoryKey) commit(data.memoryKey, post.memorySummary || "", post.refs || []).catch(()=>{});

  return { text, meta: { usage: j?.usage, core: post.meta } };
}
