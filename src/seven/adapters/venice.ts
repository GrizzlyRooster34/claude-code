import fetch from "node-fetch";
import { getSecret } from "../bridge/vault";

export async function veniceWrite(key: string, summary: string, refs: string[] = []) {
  const sec = getSecret("venice");
  if (!sec?.api_key) return { error: "not_authenticated" };
  const res = await fetch("https://api.venice.example/memory", {
    method: "POST",
    headers: { "X-API-Key": sec.api_key, "Content-Type": "application/json" },
    body: JSON.stringify({ key, summary, refs })
  });
  return await res.json();
}

export async function veniceRead(key: string) {
  const sec = getSecret("venice");
  if (!sec?.api_key) return { error: "not_authenticated" };
  const res = await fetch(`https://api.venice.example/memory/${encodeURIComponent(key)}`, {
    headers: { "X-API-Key": sec.api_key }
  });
  return await res.json();
}
