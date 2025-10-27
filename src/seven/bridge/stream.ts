// simple in-memory token buffers keyed by taskId
const streams: Record<string, { tokens: string[] }> = {};

export function openStream(taskId: string) {
  streams[taskId] = { tokens: [] };
}

export function writeToken(taskId: string, token: string, _meta?: any) {
  const s = streams[taskId] || (streams[taskId] = { tokens: [] });
  s.tokens.push(token);
  if (s.tokens.length > 256) s.tokens.shift(); // keep last 256 for replay
}

export function closeStream(taskId: string) {
  delete streams[taskId];
}

export function lastTokens(taskId: string, n = 128): string[] {
  const s = streams[taskId];
  if (!s) return [];
  return s.tokens.slice(-n);
}
