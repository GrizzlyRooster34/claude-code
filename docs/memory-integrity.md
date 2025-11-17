# Memory Integrity System — Checksums, Backups, Corruption Detection

## Overview

The Memory Integrity System protects Seven's consciousness state from data loss caused by:

- **Disk errors** (bad sectors, I/O failures)
- **Partial writes** (power loss, crashes mid-write)
- **Encoding issues** (UTF-8 corruption, JSON parsing errors)
- **Accidental deletion** (user error, file system issues)

This ensures Seven's personality, learning, and user history are **resilient and recoverable**.

---

## Features

### 1. **SHA-256 Checksums**
- Computed on every memory write
- Stored in `.checksum` file alongside data
- Verified on every read
- Detects any data corruption

### 2. **Automatic Backups**
- Created probabilistically on write (10% chance)
- Timestamped backup files
- 7-day retention (automatic cleanup)
- Stored in `/usr/var/seven/backups/`

### 3. **Corruption Detection**
- Read-time verification against checksum
- Automatic restore from backup if corrupted
- Clear error logging for debugging

### 4. **Schema Versioning**
- `_schemaVersion` field in all memory files
- Enables safe migrations across Seven versions
- Future-proofs against breaking changes

### 5. **Manual Restore Tool**
- CLI script for emergency recovery
- Lists all available backups with status
- Verifies backup integrity before restore

---

## Architecture

### File Structure

```
/usr/var/seven/
├── memory.json              # Main memory file
├── memory.json.checksum     # SHA-256 checksum + metadata
└── backups/                 # Backup directory
    ├── memory.json.2025-11-16T23-45-00.bak
    ├── memory.json.2025-11-16T23-45-00.bak.checksum
    ├── memory.json.2025-11-15T12-30-00.bak
    └── memory.json.2025-11-15T12-30-00.bak.checksum
```

### Checksum File Format

```json
{
  "checksum": "a3f5e8d9c4b2a1f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3",
  "timestamp": "2025-11-16T23:45:00.000Z",
  "schemaVersion": "1.0.0"
}
```

### Memory File Format

```json
{
  "_schemaVersion": "1.0.0",
  "_lastModified": "2025-11-16T23:45:00.000Z",
  "key1": {
    "summary": "User preference for dark mode",
    "refs": ["settings", "ui"],
    "ts": "2025-11-16T23:45:00.000Z"
  },
  "key2": {
    "summary": "Conversation context from session abc123",
    "refs": ["chat-history", "context"],
    "ts": "2025-11-16T23:44:30.000Z"
  }
}
```

---

## Usage

### Automatic Operation

The integrity system works **automatically** with no user intervention:

1. **On Write** (`saveMemory()`):
   - Load existing data with checksum verification
   - If corrupted, auto-restore from backup
   - Update data
   - Write with new checksum
   - Probabilistically create backup (10% chance)
   - Cleanup old backups (>7 days)

2. **On Read** (`loadMemory()`):
   - Load data
   - Verify checksum
   - If corrupted, auto-restore from backup
   - Return data or throw error

### Manual Restore

If automatic restore fails or you need to restore a specific backup:

```bash
# List available backups
npx tsx scripts/restore-memory.ts

# Restore specific backup
npx tsx scripts/restore-memory.ts /usr/var/seven/backups/memory.json.2025-11-16T23-45-00.bak
```

### Test Integrity System

Run the test suite to verify all components:

```bash
./scripts/test-memory-integrity.sh
```

Tests:
- ✅ Checksum on write
- ✅ Checksum verification on read
- ✅ Corruption detection
- ✅ Backup creation
- ✅ Schema versioning

---

## API Reference

### Core Functions (memory.ts)

#### `saveMemory(key, summary, refs)`

Save memory entry with integrity protection.

```typescript
await saveMemory("user-preference", "Dark mode enabled", ["ui", "settings"]);
```

**Features**:
- Verifies existing data before update
- Auto-restores from backup if corrupted
- Writes with checksum
- Probabilistic backup creation

#### `loadMemory(key?)`

Load memory entry with integrity verification.

```typescript
// Load single entry
const entry = await loadMemory("user-preference");

// Load all entries
const allEntries = await loadMemory();
```

**Features**:
- Verifies checksum on read
- Auto-restores from backup if corrupted
- Returns null for missing keys

### Integrity Functions (memory-integrity.ts)

#### `computeChecksum(data)`

Compute SHA-256 checksum of string data.

```typescript
const checksum = computeChecksum(JSON.stringify(myData));
```

#### `writeMemoryWithChecksum(filePath, data)`

Write data with schema versioning and checksum.

```typescript
writeMemoryWithChecksum("/path/to/file.json", { key: "value" });
```

#### `readMemoryWithChecksum(filePath)`

Read data with checksum verification.

```typescript
const data = readMemoryWithChecksum("/path/to/file.json");
// Throws Error if corrupted
```

#### `createBackup(filePath)`

Create timestamped backup of file + checksum.

```typescript
const backupPath = createBackup("/usr/var/seven/memory.json");
// Returns: /usr/var/seven/backups/memory.json.2025-11-16T23-45-00.bak
```

#### `cleanupOldBackups()`

Delete backups older than 7 days.

```typescript
cleanupOldBackups();
```

#### `listBackups(fileName)`

List all backups for a file (most recent first).

```typescript
const backups = listBackups("memory.json");
// Returns: ["/usr/var/seven/backups/memory.json.2025-11-16T23-45-00.bak", ...]
```

#### `restoreFromBackup(backupPath, targetPath)`

Restore file from backup with verification.

```typescript
const success = restoreFromBackup(
  "/usr/var/seven/backups/memory.json.2025-11-16T23-45-00.bak",
  "/usr/var/seven/memory.json"
);
```

**Safety features**:
- Verifies backup integrity before restore
- Creates emergency backup of current file
- Copies checksum file too

---

## Error Handling

### Corruption Detection

When corruption is detected:

```
CORRUPTION DETECTED: /usr/var/seven/memory.json
  Expected checksum: a3f5e8d9c4b2a1f7...
  Computed checksum: b4g6f9e0d5c3b2a8...
```

**Auto-recovery**:
1. System logs corruption error
2. Attempts restore from most recent backup
3. Verifies restored data
4. If restore fails, tries next-most-recent backup
5. If all backups fail, returns empty memory (safe mode)

### Backup Failure

If backup creation fails:

```
Failed to create backup for /usr/var/seven/memory.json: ENOSPC
```

**Impact**: Write still succeeds, but no new backup created. Existing backups remain valid.

### Restore Failure

If restore fails:

```
Failed to restore from backup: Backup file corrupted
```

**Recovery**: Try older backups manually using `scripts/restore-memory.ts`.

---

## Best Practices

### 1. **Monitor Disk Space**

Backups consume disk space. Monitor `/usr/var/seven/backups/`:

```bash
du -sh /usr/var/seven/backups/
```

If space is low:
- Reduce `BACKUP_RETENTION_DAYS` (default: 7)
- Manually delete old backups
- Increase disk allocation

### 2. **Test Restores Regularly**

Verify backups are valid:

```bash
npx tsx scripts/restore-memory.ts
```

Check all backups show "✅ Valid" status.

### 3. **External Backups**

For maximum safety, periodically copy backups to external storage:

```bash
# Copy to cloud storage
rsync -av /usr/var/seven/backups/ /path/to/cloud/seven-backups/

# Copy to external drive
cp -r /usr/var/seven/backups/ /mnt/external/seven-backups/
```

### 4. **Schema Migrations**

When changing memory structure:

1. Update `SCHEMA_VERSION` in `memory-integrity.ts`
2. Add migration logic in `saveMemory()` or `loadMemory()`
3. Test with old and new schema versions

---

## Troubleshooting

### Memory file keeps getting corrupted

**Possible causes**:
- Disk hardware failure
- File system corruption
- Insufficient disk space
- Power loss during writes

**Diagnosis**:
```bash
# Check disk health
dmesg | grep -i error

# Check disk space
df -h /usr/var/seven

# Check file system
fsck /dev/sdX  # Use appropriate device
```

**Solution**:
- Fix hardware issues
- Free disk space
- Use UPS to prevent power loss
- Consider migrating to more reliable storage

### Backup restore fails

**Symptoms**:
```
❌ Backup file corrupted: /usr/var/seven/backups/memory.json.2025-11-16T23-45-00.bak
```

**Diagnosis**:
```bash
# List all backups with status
npx tsx scripts/restore-memory.ts
```

**Solution**:
- Try older backup (if available)
- Check backup file manually: `cat /path/to/backup.bak`
- If all backups corrupted, memory loss occurred (start fresh)

### No backups exist

**Symptoms**:
```
No backups found.
```

**Cause**: Memory writes haven't triggered backup creation yet (10% probability).

**Solution**:
- Force backup creation: `npx tsx -e "import { createBackup } from './src/seven/bridge/memory-integrity.js'; createBackup('/usr/var/seven/memory.json');"`
- Increase backup probability in `memory.ts` (change `Math.random() < 0.1` to `0.5` for 50%)

---

## Future Enhancements

Potential improvements (not yet implemented):

1. **Incremental Backups**: Only backup changed entries (reduces storage)
2. **Compression**: gzip backups to save space
3. **Remote Sync**: Auto-sync backups to cloud (S3, GCS)
4. **Real-time Monitoring**: Prometheus metrics for corruption events
5. **Scheduled Backups**: Daily cron job instead of probabilistic
6. **Multi-file Support**: Extend to episodic, temporal, amalgum memories

---

## Related Files

- `src/seven/bridge/memory.ts` — Memory operations with integrity
- `src/seven/bridge/memory-integrity.ts` — Checksum, backup, restore logic
- `scripts/restore-memory.ts` — Manual restore CLI tool
- `scripts/test-memory-integrity.sh` — Test suite

---

**End of Memory Integrity Documentation**
