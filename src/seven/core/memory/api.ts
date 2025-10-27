const mem: Record<string, any[]> = {};
export async function recall(key: string) { return mem[key] || []; }
export async function commit(key: string, summary: string, refs: string[] = []) {
  mem[key] = (mem[key] || []).concat({ ts: Date.now(), summary, refs });
}
