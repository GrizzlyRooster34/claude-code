#!/usr/bin/env tsx
// Memory Restore Script — Manual backup restoration tool
// Usage: npx tsx scripts/restore-memory.ts [backup-path]

import fs from "fs";
import {
  listBackups,
  restoreFromBackup,
  verifyIntegrity
} from "../src/seven/bridge/memory-integrity";
import { MEM_PATH } from "../src/seven/bridge/paths";

const args = process.argv.slice(2);

console.log("========================================");
console.log("Seven Memory Restore Tool");
console.log("========================================\n");

// Check current memory status
console.log(`Current memory file: ${MEM_PATH}`);

if (fs.existsSync(MEM_PATH)) {
  const content = fs.readFileSync(MEM_PATH, "utf8");
  const isValid = verifyIntegrity(MEM_PATH, content);

  if (isValid) {
    console.log("✅ Current memory file is intact\n");
  } else {
    console.log("❌ Current memory file is CORRUPTED\n");
  }
} else {
  console.log("⚠️  Current memory file does not exist\n");
}

// List available backups
const backups = listBackups("memory.json");

if (backups.length === 0) {
  console.log("No backups found.");
  process.exit(1);
}

console.log(`Found ${backups.length} backup(s):\n`);

backups.forEach((backup, index) => {
  const stats = fs.statSync(backup);
  const date = stats.mtime.toISOString();

  // Verify backup integrity
  const backupContent = fs.readFileSync(backup, "utf8");
  const isValid = verifyIntegrity(backup, backupContent);

  const status = isValid ? "✅ Valid" : "❌ Corrupted";

  console.log(`${index + 1}. ${backup}`);
  console.log(`   Created: ${date}`);
  console.log(`   Status: ${status}\n`);
});

// If backup path provided, restore it
if (args.length > 0) {
  const backupPath = args[0];

  console.log(`Attempting to restore from: ${backupPath}\n`);

  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup not found: ${backupPath}`);
    process.exit(1);
  }

  const success = restoreFromBackup(backupPath, MEM_PATH);

  if (success) {
    console.log("\n✅ Memory restored successfully!");
    console.log(`   Backup: ${backupPath}`);
    console.log(`   Target: ${MEM_PATH}`);
    process.exit(0);
  } else {
    console.error("\n❌ Failed to restore memory");
    process.exit(1);
  }
}

// Interactive mode (no backup path provided)
console.log("========================================");
console.log("To restore a backup, run:");
console.log("  npx tsx scripts/restore-memory.ts <backup-path>");
console.log("\nExample:");
console.log(`  npx tsx scripts/restore-memory.ts "${backups[0]}"`);
console.log("========================================");
