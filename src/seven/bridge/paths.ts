// Termux-safe path constants used across bridge modules.
export const TERMUX_PREFIX = "/data/data/com.termux/files/usr";
export const DEFAULT_SOCKET = process.env.SEVEN_SOCKET || `${TERMUX_PREFIX}/tmp/seven_bridge.sock`;

export const STATE_DIR = process.env.SEVEN_STATE_DIR || `${TERMUX_PREFIX}/var/seven`;
export const LOG_DIR   = `${STATE_DIR}/logs`;

export const FUEL_PATH = process.env.SEVEN_FUEL || `${STATE_DIR}/fuel.json`;
export const MEM_PATH  = process.env.SEVEN_MEM  || `${STATE_DIR}/memory.json`;

export function ensureDirs() {
  // Lazy require to avoid ESM complaints in some bundlers
  const fs = require("fs") as typeof import("fs");
  for (const p of [STATE_DIR, LOG_DIR]) {
    try { fs.mkdirSync(p, { recursive: true }); } catch {}
  }
}
