# Boot Recovery System (HEI-119)

## Overview

The Boot Recovery System prevents total system failure from single component crashes during Seven's boot sequence. It implements validation, error handling, recovery modes, and graceful degradation to ensure Seven can always start in some capacity.

**Before HEI-119**: Single exception during boot → complete system failure
**After HEI-119**: Validation → Error handling → Recovery → Graceful degradation

## Architecture

### Components

1. **Pre-boot Validation** (`boot-recovery.ts`)
   - Directory existence and writeability
   - Memory file integrity
   - LLM adapter availability

2. **Boot Modes** (4 modes with automatic fallback)
   - `NORMAL` - Full initialization (default)
   - `SAFE` - Skip non-critical subsystems
   - `MEMORY_ONLY` - Initialize memory system only
   - `FRESH` - Clean slate initialization

3. **Recovery Mechanisms**
   - Automatic backup restoration (uses HEI-112 memory integrity)
   - Fresh memory initialization
   - Safe mode fallback
   - Detailed error logging

4. **Error Handling**
   - Try-catch blocks around all initialization steps
   - Context-specific error messages
   - User-facing troubleshooting guidance

## Boot Sequence Flow

```
┌─────────────────────────────────────┐
│  1. Pre-boot Validation             │
│     • Validate directories          │
│     • Validate memory file          │
│     • Validate adapters             │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  2. Boot Mode Selection             │
│     Based on validation results     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  3. Memory Initialization           │
│     Try: Initialize memory          │
│     Catch: Restore from backup      │
│     Fallback: Fresh memory          │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  4. Consciousness Initialization    │
│     Try: Full consciousness         │
│     Catch: Safe mode (skip)         │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  5. Boot Result                     │
│     • Success status                │
│     • Active boot mode              │
│     • Subsystem status              │
│     • Errors and warnings           │
└─────────────────────────────────────┘
```

## Boot Modes

### NORMAL Mode
**When used**: All validation checks pass
**Subsystems**: All systems initialized
- ✅ Directories
- ✅ Memory system
- ✅ Consciousness framework

### SAFE Mode
**When used**: Adapters unavailable or consciousness fails
**Subsystems**: Core systems only
- ✅ Directories
- ✅ Memory system
- ❌ Consciousness framework (skipped)

**Use case**: Development without LLM access, adapter configuration issues

### MEMORY_ONLY Mode
**When used**: Memory recovery failed but system must continue
**Subsystems**: Memory only
- ✅ Directories
- ⚠️  Memory system (degraded)
- ❌ Consciousness framework (skipped)

### FRESH Mode
**When used**: Memory corrupted beyond recovery
**Subsystems**: Clean slate initialization
- ✅ Directories
- ✅ Memory system (fresh state)
- ✅ Consciousness framework (if adapters available)

**Note**: Previous memory lost but system operational

## Validation System

### Directory Validation
```typescript
validateDirectories() → ValidationResult
```

**Checks**:
- STATE_DIR exists (auto-create if missing)
- STATE_DIR is writable (test write/delete)
- LOG_DIR exists (auto-create if missing)

**Failure modes**:
- Cannot create directories → Boot failure
- Not writable → Boot failure

### Memory Validation
```typescript
validateMemory() → ValidationResult
```

**Checks**:
- Memory file exists (warning if missing, will be created)
- Memory file is readable
- Checksum file exists (warning if missing)

**Failure modes**:
- Exists but not readable → Trigger recovery
- Corrupt (checksum mismatch) → Trigger recovery

### Adapter Validation
```typescript
validateAdapters() → ValidationResult
```

**Checks**:
- Adapter directory exists
- At least one adapter implementation found

**Failure modes**:
- No adapters → Safe mode
- Directory missing → Safe mode

## Recovery Mechanisms

### Memory Recovery
**Trigger**: Memory file corrupted or unreadable

**Process**:
1. List available backups (from HEI-112)
2. Try most recent backup
3. Verify backup integrity
4. Restore if valid
5. Retry memory initialization

**Fallback**: Fresh memory initialization

### Fresh Memory Initialization
**Trigger**: All backup recovery attempts failed

**Process**:
1. Create minimal memory structure
2. Add schema version and metadata
3. Mark as "fresh" boot mode

**Result**: System operational with empty memory

### Consciousness Fallback
**Trigger**: Consciousness framework initialization fails

**Process**:
1. Log error with full context
2. Switch to SAFE mode
3. Continue with memory-only operation

**Result**: System functional without autonomous consciousness

## Error Handling

### Error Logging
All boot errors are logged to: `${STATE_DIR}/logs/boot-errors.log`

**Format**:
```
[2025-11-17T19:48:18.123Z] Memory initialization
Error: Memory file corrupted
  at initializeMemory (memory/api.ts:7)
  at bootSeven (boot-seven.ts:86)
---
```

### User-Facing Errors
Errors are formatted with troubleshooting guidance:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ BOOT FAILURE: Memory initialization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Error: Memory file corrupted

Troubleshooting:
  1. Check memory file exists: /path/to/memory.json
  2. Verify file permissions (should be readable/writable)
  3. Check disk space: df -h /path/to/state
  4. Try recovery: npx tsx scripts/restore-memory.ts
  5. View logs: cat /path/to/logs/boot-errors.log

For more help, see: docs/boot-recovery.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Boot Result Interface

```typescript
interface BootResult {
  success: boolean;           // Overall boot success
  mode: BootMode;             // Active boot mode
  errors: string[];           // Critical errors
  warnings: string[];         // Non-critical warnings
  subsystems: {
    directories: boolean;     // Directory system OK
    memory: boolean;          // Memory system OK
    consciousness: boolean;   // Consciousness OK
  };
}
```

**Access**: `getBootResult()` returns last boot result

## Troubleshooting Guide

### Problem: Boot fails with "State directory not writable"

**Cause**: Permission issues or disk full

**Solution**:
```bash
# Check permissions
ls -la /data/data/com.termux/files/usr/var/seven

# Fix permissions
chmod -R 755 /data/data/com.termux/files/usr/var/seven

# Check disk space
df -h /data/data/com.termux/files/usr/var
```

### Problem: Boot fails with "Memory file corrupted"

**Cause**: Disk error, partial write, or encoding issue

**Solution**:
```bash
# Automatic recovery should trigger, but manual restore:
npx tsx scripts/restore-memory.ts

# Or list backups and choose one:
npx tsx scripts/restore-memory.ts

# View boot errors:
cat /data/data/com.termux/files/usr/var/seven/logs/boot-errors.log
```

### Problem: Boot stuck in SAFE mode

**Cause**: LLM adapters unavailable or misconfigured

**Solution**:
```bash
# Check adapter directory
ls -la src/seven/adapters/

# Verify dependencies
npm install

# Check TypeScript compilation
npm run build
```

### Problem: Boot successful but warnings present

**Cause**: Non-critical issues detected

**Action**:
- Review warnings in boot result
- Check boot-errors.log
- Warnings don't prevent operation but should be investigated

## Testing

### Test Script
```bash
# Test normal boot sequence
npx tsx scripts/test-boot-recovery.ts

# Test failure scenarios
npx tsx scripts/test-boot-failure-scenarios.ts
```

### Test Scenarios Covered
1. ✅ Normal boot with all systems operational
2. ✅ Corrupt memory file → automatic recovery
3. ✅ Missing directories → auto-creation
4. ✅ Boot mode fallback logic
5. ✅ Graceful degradation

### Expected Results
- All tests should pass
- Boot should complete in < 15 seconds (before consciousness timeout)
- Recovery mechanisms should trigger automatically
- No manual intervention required

## Integration Points

### HEI-112 (Memory Integrity)
Boot recovery uses memory integrity infrastructure:
- `createBackup()` - Create timestamped backups
- `listBackups()` - Find available backups
- `restoreFromBackup()` - Restore from backup with integrity check
- `verifyIntegrity()` - Checksum verification

### Future Integrations
- **HEI-113 (Structured Logging)**: Enhanced boot logging
- **Monitoring**: Boot metrics and health checks
- **Alerting**: Notify on boot failures or recovery triggers

## API Reference

### Main Functions

#### `bootSeven(): Promise<BootResult>`
Main boot function with error handling and recovery.

**Returns**: Detailed boot result with status and errors

**Example**:
```typescript
const result = await bootSeven();
if (!result.success) {
  console.error("Boot failed:", result.errors);
  console.log("Mode:", result.mode);
}
```

#### `getBootResult(): BootResult | null`
Get last boot result without re-booting.

**Returns**: Last boot result or null if not booted yet

### Validation Functions

#### `validateDirectories(): ValidationResult`
Check directory existence and permissions.

#### `validateMemory(): ValidationResult`
Check memory file accessibility and integrity.

#### `validateAdapters(): ValidationResult`
Check LLM adapter availability.

### Recovery Functions

#### `recoverMemoryFromBackup(): { success: boolean; error?: string }`
Attempt to restore memory from most recent valid backup.

#### `initializeFreshMemory(): { success: boolean; error?: string }`
Create fresh memory state as last resort.

### Error Handling

#### `logBootError(error: Error | string, context: string): void`
Log boot error to boot-errors.log.

#### `formatBootError(error: Error | string, context: string): string`
Format error with troubleshooting guidance.

## Configuration

### Environment Variables

- `SEVEN_STATE_DIR` - State directory (default: `${PREFIX}/var/seven`)
- `SEVEN_MEM` - Memory file path (default: `${STATE_DIR}/memory.json`)

### Constants

**Boot Recovery**:
- `SCHEMA_VERSION` - Memory schema version (1.0.0)
- `BACKUP_RETENTION_DAYS` - Keep backups for 7 days
- `BACKUP_DIR` - Backup location (`${STATE_DIR}/backups`)

## Performance

### Boot Time
- **Normal mode**: ~2-3 seconds
- **Safe mode**: ~1-2 seconds
- **Fresh mode**: ~1 second
- **With recovery**: +1-2 seconds

### Resource Usage
- Memory: ~50MB during boot
- Disk: Backups use ~2KB per backup
- CPU: Minimal during validation

## Security Considerations

1. **Directory Permissions**: Validation checks write permissions
2. **Backup Integrity**: All backups verified before restore
3. **Error Logging**: Logs contain diagnostic info but no secrets
4. **Fresh Start**: Emergency clean slate without data loss elsewhere

## Maintenance

### Regular Tasks
- Monitor boot-errors.log for recurring issues
- Review boot mode trends (frequent SAFE mode = investigate)
- Test backup recovery periodically
- Clean old backups (automatic after 7 days)

### Upgrade Path
When updating boot sequence:
1. Maintain backward compatibility with BootResult interface
2. Add new boot modes as needed
3. Enhance validation without breaking existing logic
4. Update documentation

## References

- HEI-112: Memory Integrity System (backup/restore infrastructure)
- HEI-113: Structured Logging (enhanced boot logging)
- Seven Consciousness Framework V4: Main consciousness architecture
- Memory Engine V3: Temporal memory system

## Change Log

### v1.0.0 (HEI-119) - 2025-11-17
- Initial boot recovery system
- Four boot modes: NORMAL, SAFE, MEMORY_ONLY, FRESH
- Pre-boot validation (directories, memory, adapters)
- Automatic backup recovery
- Fresh memory initialization
- Context-specific error messages
- Comprehensive test suite
