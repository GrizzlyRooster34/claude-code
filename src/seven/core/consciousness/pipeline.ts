export async function preplan(input: { prompt: string; system?: string; memories?: any[] }) {
  return { prompt: input.prompt, system: input.system || "", primer: "", memories: input.memories || [] };
}
export async function postprocess(data: { input: any; output: string; traceId?: string }) {
  return { memorySummary: data.output.slice(0, 280), refs: [], meta: { traceId: data.traceId } };
}
