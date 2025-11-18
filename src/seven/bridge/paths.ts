// Termux-safe path constants used across bridge modules.
export const TERMUX_PREFIX = "/data/data/com.termux/files/usr";
export const DEFAULT_SOCKET = process.env.SEVEN_SOCKET || `${TERMUX_PREFIX}/tmp/seven_bridge.sock`;

export const STATE_DIR = process.env.SEVEN_STATE_DIR || `${TERMUX_PREFIX}/var/seven`;
export const LOG_DIR   = `${STATE_DIR}/logs`;
export const IPC_DIR   = `${STATE_DIR}/ipc`;
export const VAULT_DIR = `${STATE_DIR}/vault`;
export const TMP_DIR   = `${STATE_DIR}/tmp`;
export const MEMORY_DIR = `${STATE_DIR}/memory`;
export const BACKUP_DIR = `${STATE_DIR}/backups`;
export const AUDIT_DIR = `${STATE_DIR}/audit`;
export const CHECKPOINT_DIR = `${STATE_DIR}/checkpoints`;

export const FUEL_PATH = process.env.SEVEN_FUEL || `${STATE_DIR}/fuel.json`;
export const MEM_PATH  = process.env.SEVEN_MEM  || `${STATE_DIR}/memory.json`;

export function ensureDirs() {
  // Lazy require to avoid ESM complaints in some bundlers
  const fs = require("fs") as typeof import("fs");
  const dirs = [
    STATE_DIR,
    LOG_DIR,
    IPC_DIR,
    VAULT_DIR,
    TMP_DIR,
    MEMORY_DIR,
    BACKUP_DIR,
    AUDIT_DIR,
    CHECKPOINT_DIR
  ];
  for (const p of dirs) {
    try {
      fs.mkdirSync(p, { recursive: true, mode: 0o700 });
    } catch {}
  }
}
