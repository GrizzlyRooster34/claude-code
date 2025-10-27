import { performance } from "node:perf_hooks";
import fs from "fs";
import { getAuthToken } from "../src/seven/adapters/google-auth"; // you already created this
import fetch from "node-fetch";

const project = process.env.GCLOUD_PROJECT!;
const location = process.env.GCLOUD_REGION || "us-central1";
const current = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const candidate = process.env.EVAL_CANDIDATE || "gemini-1.5-pro";

async function callModel(model: string, prompt: string) {
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`;
  const token = await getAuthToken();
  const t0 = performance.now();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }]}] })
  });
  const t1 = performance.now();
  const json = await res.json();
  const text = JSON.stringify(json);
  return { text, ms: t1 - t0, ok: res.ok };
}

function scoreText(text: string, must: string[]) {
  return must.every(m => text.toLowerCase().includes(m.toLowerCase())) ? 1 : 0;
}

(async function main() {
  const prompts = JSON.parse(fs.readFileSync("eval/prompts.json","utf8"));
  const report: any[] = [];

  for (const p of prompts) {
    const a = await callModel(current, p.prompt);
    const b = await callModel(candidate, p.prompt);

    const aScore = scoreText(a.text, p.expect.must);
    const bScore = scoreText(b.text, p.expect.must);

    report.push({
      id: p.id,
      current: { ms: Math.round(a.ms), score: aScore },
      candidate: { ms: Math.round(b.ms), score: bScore }
    });
  }

  const wins = report.filter(r => r.candidate.score > r.current.score
    || (r.candidate.score === r.current.score && r.candidate.ms < r.current.ms)).length;

  const pass = wins >= Math.ceil(report.length * 0.6); // 60% better or tie+faster
  fs.writeFileSync("eval/eval_report.json", JSON.stringify({ report, pass, current, candidate }, null, 2));
  console.log(pass ? "[EVAL PASS]" : "[EVAL FAIL]");
  process.exit(pass ? 0 : 1);
})();
