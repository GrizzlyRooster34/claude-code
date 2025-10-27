import { spawn } from "child_process";

/**
 * Expect your fork exposes a CLI entry, e.g. `claude-code run --tool default-run --prompt "..."`
 * If not, add a tiny internal CLI wrapper in the fork that execs tool by name.
 */
export async function callClaudeTool(toolName: string, data: { prompt: string, context?: any }) {
  const bin = process.env.CLAUDE_BIN || "./bin/claude-code";
  const args = ["run", "--tool", toolName, "--prompt", data.prompt];
  return new Promise((resolve) => {
    const p = spawn(bin, args);
    let out = "", err = "";
    p.stdout.on("data", d => out += d.toString());
    p.stderr.on("data", d => err += d.toString());
    p.on("close", code => {
      if (code === 0) {
        try { resolve(JSON.parse(out)); } catch { resolve({ raw: out }); }
      } else {
        resolve({ error: err || `claude_exit_${code}`, code });
      }
    });
  });
}
