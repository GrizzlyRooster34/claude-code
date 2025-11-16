import { spawn } from "child_process";
import fetch from "node-fetch";
const apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";

async function getApiKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    const p = spawn("codex", ["get-api-key"]);
    let out = "";
    p.stdout.on("data", d => out += d.toString());
    p.on("close", code => {
      if (code === 0) {
        resolve(out.trim());
      } else {
        reject("Failed to get OpenAI API key");
      }
    });
  });
}

export async function execOpenAI(data: { prompt: string, model?: string }) {
  const apiKey = await getApiKey();
  if (!apiKey) return { error: "not_authenticated" };

  const model = data.model || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const res = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages: [{ role: "user", content: data.prompt }] })
  });
  return await res.json();
}
