import fs from "fs";
import { MEM_PATH } from "./paths";

export async function saveMemory(key: string, summary: string, refs: string[] = []) {
  let db: any = {};
  try { db = JSON.parse(fs.readFileSync(MEM_PATH,"utf8")); } catch {}
  db[key] = { summary, refs, ts: new Date().toISOString() };
  try { fs.writeFileSync(MEM_PATH, JSON.stringify(db, null, 2)); } catch {}
  return db[key];
}
