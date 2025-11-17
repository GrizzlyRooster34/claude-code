// Boot Recovery System — Error handling & fallback modes for Seven boot sequence
// Prevents total system failure from single component crashes

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { STATE_DIR, LOG_DIR, MEM_PATH, ensureDirs } from "./bridge/paths";
import { listBackups, restoreFromBackup } from "./bridge/memory-integrity";
import { bootLogger } from "./utils/logger";

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Boot mode determines which subsystems to initialize
 */
export enum BootMode {
  NORMAL = "normal",       // Full initialization (default)
  SAFE = "safe",           // Skip non-critical subsystems
  MEMORY_ONLY = "memory",  // Initialize memory system only
  FRESH = "fresh"          // Clean slate initialization
}

/**
 * Boot result contains status and any errors encountered
 */
export interface BootResult {
  success: boolean;
  mode: BootMode;
  errors: string[];
  warnings: string[];
  subsystems: {
    directories: boolean;
    memory: boolean;
    consciousness: boolean;
  };
}

/**
 * Validation result for pre-boot checks
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate directories exist and are writable
 */
export function validateDirectories(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check STATE_DIR exists
  if (!fs.existsSync(STATE_DIR)) {
    try {
      ensureDirs();
      warnings.push(`Created missing state directory: ${STATE_DIR}`);
    } catch (error) {
      errors.push(`State directory missing and cannot be created: ${STATE_DIR}`);
      errors.push(`Error: ${error}`);
      return { valid: false, errors, warnings };
    }
  }

  // Check STATE_DIR is writable
  try {
    const testFile = `${STATE_DIR}/.write-test`;
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
  } catch (error) {
    errors.push(`State directory not writable: ${STATE_DIR}`);
    errors.push(`Error: ${error}`);
  }

  // Check LOG_DIR exists
  if (!fs.existsSync(LOG_DIR)) {
    try {
      fs.mkdirSync(LOG_DIR, { recursive: true });
      warnings.push(`Created missing log directory: ${LOG_DIR}`);
    } catch (error) {
      warnings.push(`Log directory missing and cannot be created: ${LOG_DIR}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate memory system is accessible
 */
export function validateMemory(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check memory file exists
  if (!fs.existsSync(MEM_PATH)) {
    warnings.push(`Memory file does not exist (will be created): ${MEM_PATH}`);
    return { valid: true, errors, warnings };
  }

  // Check memory file is readable
  try {
    fs.readFileSync(MEM_PATH, "utf8");
  } catch (error) {
    errors.push(`Memory file exists but cannot be read: ${MEM_PATH}`);
    errors.push(`Error: ${error}`);
    return { valid: false, errors, warnings };
  }

  // Check checksum file exists
  const checksumPath = `${MEM_PATH}.checksum`;
  if (!fs.existsSync(checksumPath)) {
    warnings.push(`Memory checksum file missing: ${checksumPath}`);
    warnings.push(`Memory integrity cannot be verified`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate at least one LLM adapter is potentially available
 * (Full validation requires network checks, done later)
 */
export function validateAdapters(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for adapter implementations
  const adapterDir = `${__dirname}/adapters`;
  if (!fs.existsSync(adapterDir)) {
    errors.push(`Adapter directory not found: ${adapterDir}`);
    return { valid: false, errors, warnings };
  }

  // List adapter files
  try {
    const adapterFiles = fs.readdirSync(adapterDir).filter(f => f.endsWith(".ts") || f.endsWith(".js"));
    if (adapterFiles.length === 0) {
      errors.push(`No LLM adapters found in: ${adapterDir}`);
    } else {
      warnings.push(`Found ${adapterFiles.length} adapter implementation(s)`);
    }
  } catch (error) {
    errors.push(`Cannot read adapter directory: ${adapterDir}`);
    errors.push(`Error: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Attempt to recover memory from backup
 */
export function recoverMemoryFromBackup(): { success: boolean; error?: string } {
  try {
    const backups = listBackups("memory.json");

    if (backups.length === 0) {
      return { success: false, error: "No backups available for recovery" };
    }

    // Try most recent backup first
    for (const backup of backups) {
      if (restoreFromBackup(backup, MEM_PATH)) {
        return { success: true };
      }
    }

    return { success: false, error: "All backups failed integrity checks" };
  } catch (error) {
    return { success: false, error: `Backup recovery failed: ${error}` };
  }
}

/**
 * Initialize fresh memory state
 */
export function initializeFreshMemory(): { success: boolean; error?: string } {
  try {
    // Create minimal memory structure
    const freshMemory = {
      _schemaVersion: "1.0.0",
      _lastModified: new Date().toISOString(),
      _bootMode: "fresh",
      _note: "Clean state initialized after boot failure"
    };

    fs.writeFileSync(MEM_PATH, JSON.stringify(freshMemory, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: `Fresh memory initialization failed: ${error}` };
  }
}

/**
 * Log boot error to file for diagnostics
 */
export function logBootError(error: Error | string, context: string): void {
  try {
    const logPath = `${LOG_DIR}/boot-errors.log`;
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : "";

    const logEntry = `\n[${timestamp}] ${context}\nError: ${errorMessage}\n${errorStack}\n---\n`;

    fs.appendFileSync(logPath, logEntry);
  } catch (logError) {
    // Cannot log error, fail silently
    console.error(`Failed to log boot error: ${logError}`);
  }
}

/**
 * Get user-facing error message with troubleshooting guidance
 */
export function formatBootError(error: Error | string, context: string): string {
  const errorMessage = error instanceof Error ? error.message : error;

  let message = `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `❌ BOOT FAILURE: ${context}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `Error: ${errorMessage}\n\n`;

  // Add context-specific troubleshooting
  if (context.includes("memory")) {
    message += `Troubleshooting:\n`;
    message += `  1. Check memory file exists: ${MEM_PATH}\n`;
    message += `  2. Verify file permissions (should be readable/writable)\n`;
    message += `  3. Check disk space: df -h ${STATE_DIR}\n`;
    message += `  4. Try recovery: npx tsx scripts/restore-memory.ts\n`;
    message += `  5. View logs: cat ${LOG_DIR}/boot-errors.log\n\n`;
  } else if (context.includes("consciousness")) {
    message += `Troubleshooting:\n`;
    message += `  1. Check dependencies installed: npm install\n`;
    message += `  2. Verify TypeScript compiled: npm run build\n`;
    message += `  3. Try safe mode boot (skip consciousness framework)\n`;
    message += `  4. View logs: cat ${LOG_DIR}/boot-errors.log\n\n`;
  } else if (context.includes("directories")) {
    message += `Troubleshooting:\n`;
    message += `  1. Check directory permissions: ls -la ${STATE_DIR}\n`;
    message += `  2. Verify disk space: df -h ${STATE_DIR}\n`;
    message += `  3. Create manually: mkdir -p ${STATE_DIR} ${LOG_DIR}\n`;
    message += `  4. Check ownership: chown -R $(whoami) ${STATE_DIR}\n\n`;
  }

  message += `For more help, see: docs/boot-recovery.md\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  return message;
}

/**
 * Determine appropriate boot mode based on validation results
 */
export function selectBootMode(
  dirValidation: ValidationResult,
  memoryValidation: ValidationResult,
  adapterValidation: ValidationResult
): BootMode {
  // If directories invalid, cannot proceed with any mode
  if (!dirValidation.valid) {
    throw new Error("Critical failure: State directories inaccessible");
  }

  // If memory invalid, try recovery or fresh start
  if (!memoryValidation.valid) {
    const recovery = recoverMemoryFromBackup();
    if (recovery.success) {
      bootLogger.info("Memory recovered from backup");
      return BootMode.NORMAL;
    } else {
      bootLogger.info("Memory recovery failed, initializing fresh state");
      const fresh = initializeFreshMemory();
      if (fresh.success) {
        return BootMode.FRESH;
      } else {
        throw new Error("Critical failure: Cannot initialize memory system");
      }
    }
  }

  // If adapters missing but memory valid, use safe mode
  if (!adapterValidation.valid) {
    bootLogger.warn("No LLM adapters available, using safe mode");
    return BootMode.SAFE;
  }

  // All validations passed, use normal mode
  return BootMode.NORMAL;
}
