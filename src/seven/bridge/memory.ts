import fs from "fs";
import { MEM_PATH } from "./paths";
import {
  writeMemoryWithChecksum,
  readMemoryWithChecksum,
  createBackup,
  cleanupOldBackups,
  listBackups,
  restoreFromBackup
} from "./memory-integrity";

/**
 * Save memory entry with integrity protection
 */
export async function saveMemory(key: string, summary: string, refs: string[] = []) {
  let db: any = {};

  // Load existing memory with checksum verification
  try {
    const existingData = readMemoryWithChecksum(MEM_PATH);
    if (existingData) {
      db = existingData;
    }
  } catch (error) {
    console.error("Failed to load memory (may be corrupted):", error);
    // Try to restore from backup
    if (!tryRestoreFromBackup()) {
      console.warn("No backup available, starting with empty memory");
    } else {
      // Retry load after restore
      try {
        const restoredData = readMemoryWithChecksum(MEM_PATH);
        if (restoredData) {
          db = restoredData;
        }
      } catch (retryError) {
        console.error("Failed to load even after restore:", retryError);
      }
    }
  }

  // Update memory entry
  db[key] = { summary, refs, ts: new Date().toISOString() };

  try {
    // Create backup before writing (daily backups handled by cron/systemd)
    const shouldBackup = Math.random() < 0.1; // 10% chance of backup on write
    if (shouldBackup) {
      createBackup(MEM_PATH);
      cleanupOldBackups();
    }

    // Write with checksum
    writeMemoryWithChecksum(MEM_PATH, db);
    return db[key];
  } catch (error) {
    console.error("Failed to save memory:", error);
    throw error;
  }
}

/**
 * Load memory entry with integrity verification
 */
export async function loadMemory(key?: string): Promise<any> {
  try {
    const db = readMemoryWithChecksum(MEM_PATH);
    if (!db) {
      return key ? null : {};
    }
    return key ? db[key] : db;
  } catch (error) {
    console.error("Failed to load memory:", error);
    // Try to restore from backup
    if (tryRestoreFromBackup()) {
      try {
        const db = readMemoryWithChecksum(MEM_PATH);
        return key ? db?.[key] : db || {};
      } catch (retryError) {
        console.error("Failed to load even after restore:", retryError);
        return key ? null : {};
      }
    }
    return key ? null : {};
  }
}

/**
 * Try to restore memory from most recent backup
 * @returns true if restore succeeded, false otherwise
 */
function tryRestoreFromBackup(): boolean {
  try {
    const backups = listBackups("memory.json");

    if (backups.length === 0) {
      return false;
    }

    // Try most recent backup first
    for (const backup of backups) {
      if (restoreFromBackup(backup, MEM_PATH)) {
        console.log(`Successfully restored from backup: ${backup}`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Failed to restore from backup:", error);
    return false;
  }
}
