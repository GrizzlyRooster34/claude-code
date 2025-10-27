import { v4 as uuid } from "uuid";

export interface Trace {
  id: string;
  hops: number;
  origin: string;
  path: string[];
}

export function newTrace(origin: string): Trace {
  return { id: uuid(), hops: 0, origin, path: [origin] };
}

export function nextHop(t: Trace, node: string): Trace {
  return { ...t, hops: t.hops + 1, path: [...t.path, node] };
}

export function checkLoop(t: Trace, limit = 3): boolean {
  return t.hops >= limit;
}
