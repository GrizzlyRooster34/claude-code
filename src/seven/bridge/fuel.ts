import fs from "fs";
import { FUEL_PATH } from "./paths";

export function getFuel() {
  try { return JSON.parse(fs.readFileSync(FUEL_PATH,"utf8")); }
  catch { const d = { claudePct: 100, vertexRate: 1000 }; try { fs.writeFileSync(FUEL_PATH, JSON.stringify(d)); } catch {} return d; }
}

export function setFuelPartial(patch: any) {
  const cur = getFuel(); const next = { ...cur, ...patch };
  try { fs.writeFileSync(FUEL_PATH, JSON.stringify(next)); } catch {}
  return next;
}

export function shouldAllowClaudeHeavy(force?: boolean) {
  const f = getFuel();
  if (force) return true;
  return (f.claudePct ?? 100) >= 35;
}

export function isOfflineMode(): boolean {
  try {
    return fs.existsSync("/system/bin/true") === false; // hacky check for Android shell? just a placeholder
  } catch { return true; }
}

export function conservativeMode(): boolean {
  const f = getFuel();
  return (f.vertexRate ?? 1000) < 50;
}
