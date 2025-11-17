// Memory Integrity System — Checksums, Backups, Corruption Detection
// Prevents consciousness state loss from disk errors, partial writes, encoding issues

import fs from "fs";
import crypto from "crypto";
import path from "path";
import { STATE_DIR } from "./paths";

const SCHEMA_VERSION = "1.0.0";
const BACKUP_DIR = `${STATE_DIR}/backups`;
const BACKUP_RETENTION_DAYS = 7;

/**
 * Compute SHA-256 checksum of a string
 */
export function computeChecksum(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

/**
 * Save checksum to .checksum file alongside data file
 */
export function saveChecksum(filePath: string, checksum: string): void {
  const checksumPath = `${filePath}.checksum`;
  try {
    fs.writeFileSync(checksumPath, JSON.stringify({
      checksum,
      timestamp: new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION
    }, null, 2));
  } catch (error) {
    // Log error but don't throw - checksum save failure shouldn't block data save
    console.error(`Failed to save checksum for ${filePath}:`, error);
  }
}

/**
 * Load and verify checksum from .checksum file
 * @returns checksum if valid, null if missing or invalid
 */
export function loadChecksum(filePath: string): string | null {
  const checksumPath = `${filePath}.checksum`;
  try {
    if (!fs.existsSync(checksumPath)) {
      return null; // No checksum file = first-time write or migration
    }
    const checksumData = JSON.parse(fs.readFileSync(checksumPath, "utf8"));
    return checksumData.checksum || null;
  } catch (error) {
    console.error(`Failed to load checksum for ${filePath}:`, error);
    return null;
  }
}

/**
 * Verify file integrity against stored checksum
 * @returns true if valid, false if corrupted or no checksum
 */
export function verifyIntegrity(filePath: string, fileContent: string): boolean {
  const storedChecksum = loadChecksum(filePath);
  if (!storedChecksum) {
    // No checksum = can't verify (but not necessarily corrupted)
    return true; // Allow read to proceed
  }

  const computedChecksum = computeChecksum(fileContent);
  const isValid = storedChecksum === computedChecksum;

  if (!isValid) {
    console.error(`CORRUPTION DETECTED: ${filePath}`);
    console.error(`  Expected checksum: ${storedChecksum}`);
    console.error(`  Computed checksum: ${computedChecksum}`);
  }

  return isValid;
}

/**
 * Write memory data with checksum
 */
export function writeMemoryWithChecksum(filePath: string, data: any): void {
  // Add schema version to data
  const versionedData = {
    _schemaVersion: SCHEMA_VERSION,
    _lastModified: new Date().toISOString(),
    ...data
  };

  const jsonContent = JSON.stringify(versionedData, null, 2);

  // Write data file
  fs.writeFileSync(filePath, jsonContent, "utf8");

  // Compute and save checksum
  const checksum = computeChecksum(jsonContent);
  saveChecksum(filePath, checksum);
}

/**
 * Read memory data with checksum verification
 * @throws Error if file is corrupted
 */
export function readMemoryWithChecksum(filePath: string): any {
  if (!fs.existsSync(filePath)) {
    return null; // File doesn't exist = no data yet
  }

  const fileContent = fs.readFileSync(filePath, "utf8");

  // Verify integrity
  if (!verifyIntegrity(filePath, fileContent)) {
    throw new Error(`Memory file corrupted: ${filePath}`);
  }

  const data = JSON.parse(fileContent);

  // Strip internal fields before returning
  const { _schemaVersion, _lastModified, ...userData } = data;

  return userData;
}

/**
 * Create backup of memory file with timestamp
 */
export function createBackup(filePath: string): string | null {
  try {
    // Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Create timestamped backup filename
    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");
    const backupPath = `${BACKUP_DIR}/${fileName}.${timestamp}.bak`;

    // Copy file and checksum
    fs.copyFileSync(filePath, backupPath);

    const checksumPath = `${filePath}.checksum`;
    if (fs.existsSync(checksumPath)) {
      fs.copyFileSync(checksumPath, `${backupPath}.checksum`);
    }

    return backupPath;
  } catch (error) {
    console.error(`Failed to create backup for ${filePath}:`, error);
    return null;
  }
}

/**
 * Clean up old backups (retain last N days)
 */
export function cleanupOldBackups(): void {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return;
    }

    const now = Date.now();
    const maxAge = BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000;

    const files = fs.readdirSync(BACKUP_DIR);
    for (const file of files) {
      const filePath = `${BACKUP_DIR}/${file}`;
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old backup: ${file}`);
      }
    }
  } catch (error) {
    console.error("Failed to cleanup old backups:", error);
  }
}

/**
 * List available backups for a file
 */
export function listBackups(fileName: string): string[] {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BACKUP_DIR);
    return files
      .filter(f => f.startsWith(fileName) && f.endsWith(".bak"))
      .map(f => `${BACKUP_DIR}/${f}`)
      .sort()
      .reverse(); // Most recent first
  } catch (error) {
    console.error("Failed to list backups:", error);
    return [];
  }
}

/**
 * Restore from backup
 */
export function restoreFromBackup(backupPath: string, targetPath: string): boolean {
  try {
    // Verify backup exists
    if (!fs.existsSync(backupPath)) {
      console.error(`Backup not found: ${backupPath}`);
      return false;
    }

    // Verify backup integrity
    const backupContent = fs.readFileSync(backupPath, "utf8");
    if (!verifyIntegrity(backupPath, backupContent)) {
      console.error(`Backup file corrupted: ${backupPath}`);
      return false;
    }

    // Create backup of current file before restoring
    if (fs.existsSync(targetPath)) {
      const emergencyBackup = `${targetPath}.emergency.${Date.now()}.bak`;
      fs.copyFileSync(targetPath, emergencyBackup);
      console.log(`Created emergency backup: ${emergencyBackup}`);
    }

    // Restore backup
    fs.copyFileSync(backupPath, targetPath);

    // Restore checksum if exists
    const backupChecksumPath = `${backupPath}.checksum`;
    if (fs.existsSync(backupChecksumPath)) {
      fs.copyFileSync(backupChecksumPath, `${targetPath}.checksum`);
    }

    console.log(`Restored from backup: ${backupPath} -> ${targetPath}`);
    return true;
  } catch (error) {
    console.error(`Failed to restore from backup: ${error}`);
    return false;
  }
}

/**
 * Get schema version from memory file
 */
export function getSchemaVersion(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return data._schemaVersion || null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if schema migration is needed
 */
export function needsMigration(filePath: string): boolean {
  const fileVersion = getSchemaVersion(filePath);
  if (!fileVersion) {
    return false; // No version = fresh file or needs migration, but we'll add version on next write
  }
  return fileVersion !== SCHEMA_VERSION;
}
