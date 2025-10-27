import { spawn } from "child_process";

export async function execDeepAgent(data: { prompt: string, contextRefs?: string[] }) {
  return new Promise((resolve) => {
    const p = spawn("deepagent", ["-p", data.prompt]);
    let out = "";
    let err = "";
    p.stdout.on("data", d => out += d.toString());
    p.stderr.on("data", d => err += d.toString());
    p.on("close", code => {
      if (code === 0) {
        try { resolve(JSON.parse(out)); } catch { resolve({ raw: out }); }
      } else {
        resolve({ error: err || `deepagent_exit_${code}`, code });
      }
    });
  });
}
