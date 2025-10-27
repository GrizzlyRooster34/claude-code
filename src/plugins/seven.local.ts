import { execSeven } from "../seven/adapters/seven";

export const sevenLocalTool = {
  name: "seven.local",
  description: "Run Seven of Nine locally via llama.cpp with consciousness & memory hooks",
  inputSchema: {
    type: "object",
    properties: {
      prompt: { type: "string" },
      system: { type: "string" },
      temperature: { type: "number" },
      top_p: { type: "number" },
      memoryKey: { type: "string" }
    },
    required: ["prompt"]
  },
  async run(input: any, context: any) {
    const traceId = context?.trace?.id || "local";
    return await execSeven({
      prompt: input.prompt, system: input.system, temperature: input.temperature, top_p: input.top_p,
      memoryKey: input.memoryKey || `session:${traceId}`, traceId
    });
  }
};
