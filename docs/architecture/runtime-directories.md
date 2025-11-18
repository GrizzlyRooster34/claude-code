# Seven Runtime Directory Structure

## Overview

Seven maintains a structured runtime state directory at `/usr/var/seven/` (Termux: `/data/data/com.termux/files/usr/var/seven/`) for persistent state, logs, memory, and operational artifacts.

All directories use **0700 permissions** (owner-only access) for security.

## Directory Structure

```
/usr/var/seven/
├── state/          # Runtime state persistence
├── memory/         # Memory snapshots
├── logs/           # System logs + audit trails
├── ipc/            # Bridge daemon socket
├── vault/          # Encrypted credentials
├── tmp/            # Temporary artifacts
├── audit/          # Audit logs
├── backups/        # Memory integrity backups (HEI-112)
└── checkpoints/    # System checkpoints
```

## Directory Purposes

### `state/`
**Purpose**: Runtime state persistence
**Contents**: Session data, operational state, system metadata
**Retention**: Until explicitly cleared
**Used by**: Core runtime, bridge daemon

### `memory/`
**Purpose**: Memory system snapshots
**Contents**: Episodic memory snapshots, temporal memory backups
**Retention**: Based on memory retention policy
**Used by**: Memory Engine V3, consciousness framework
**Related**: See `memory.json` at root for primary memory file

### `logs/`
**Purpose**: System logs and audit trails
**Contents**:
- `seven.log` — Structured logging output (HEI-113)
- `boot-errors.log` — Boot sequence failures (HEI-119)
- Component-specific logs

**Retention**: Configurable, default 7 days
**Used by**: Structured logging (Pino), boot recovery, all subsystems

### `ipc/`
**Purpose**: Bridge daemon socket location
**Contents**: `seven_bridge.sock` — Bridge daemon UNIX socket
**Retention**: Active during daemon runtime, cleaned on shutdown
**Used by**: Bridge daemon, CLI tools
**Note**: Sockets protected by `.gitignore` (`*.sock`)

### `vault/`
**Purpose**: Encrypted credentials storage
**Contents**: `vault.json` — Encrypted API keys, tokens, secrets
**Retention**: Permanent (until explicitly rotated)
**Used by**: Vault management, adapter authentication
**Security**: Protected by `.gitignore` (`**/vault/`)

### `tmp/`
**Purpose**: Temporary artifacts and scratch space
**Contents**: Temporary files, processing artifacts, caches
**Retention**: Short-lived, cleared on boot or periodically
**Used by**: All subsystems needing temporary storage

### `audit/`
**Purpose**: Security and compliance audit logs
**Contents**: Access logs, security events, audit trails
**Retention**: Long-term (compliance-dependent)
**Used by**: Security monitoring, compliance reporting
**Format**: JSONL (`.audit.jsonl`)

### `backups/`
**Purpose**: Memory integrity backups
**Contents**: Timestamped memory backups with checksums
**Retention**: 7 days (configurable)
**Used by**: Memory integrity system (HEI-112), boot recovery (HEI-119)
**Format**: `memory.json.backup.{timestamp}`, `*.checksum`

### `checkpoints/`
**Purpose**: System checkpoints for recovery
**Contents**: System state snapshots, recovery points
**Retention**: Based on checkpoint policy
**Used by**: Boot recovery, disaster recovery

## Root-Level Files

### `memory.json`
Primary memory file for Seven's consciousness framework
**Location**: `/usr/var/seven/memory.json`
**Integrity**: Verified with `memory.json.checksum` (HEI-112)
**Backup**: Automatic backups to `backups/` directory

### `fuel.json`
Agent operational state and fuel levels
**Location**: `/usr/var/seven/fuel.json`
**Purpose**: Agent activation levels, operational parameters

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SEVEN_STATE_DIR` | `/usr/var/seven` | Base state directory |
| `SEVEN_MEM` | `${STATE_DIR}/memory.json` | Primary memory file |
| `SEVEN_FUEL` | `${STATE_DIR}/fuel.json` | Fuel configuration |
| `SEVEN_SOCKET` | `/usr/tmp/seven_bridge.sock` | Bridge daemon socket |

## Boot Sequence Integration

The boot sequence automatically ensures all directories exist on startup via `ensureDirs()` in `src/seven/bridge/paths.ts`.

**Boot validation** (HEI-119):
1. Check `STATE_DIR` exists and is writable
2. Create missing subdirectories with 0700 permissions
3. Verify memory file accessibility
4. Proceed with boot sequence

If directories cannot be created, boot fails with troubleshooting guidance.

## Security

### Permissions
- All directories: **0700** (rwx------)
- Owner: Current user (e.g., `u0_a872` on Termux)
- No world-readable state

### .gitignore Protection
All runtime directories protected from accidental commits:
```gitignore
/usr/var/seven/
/state/
/logs/
/memory-v*/
**/vault/
*.sock
*.audit.jsonl
```

See: `.gitignore` (HEI-127)

### Sensitive Data
- **Never commit**: vault/, logs/, memory files, sockets
- **Encrypted**: API credentials in vault.json
- **Checksummed**: memory.json integrity verification (HEI-112)
- **Backed up**: Automatic memory backups with rotation

## Maintenance

### Regular Tasks
- **Logs**: Rotate/archive logs older than 7 days
- **Backups**: Prune backups older than retention period
- **Temp**: Clear `tmp/` directory on boot or weekly
- **Audit**: Archive audit logs for compliance

### Disk Space Monitoring
Monitor `/usr/var/seven/` disk usage. Typical footprint:
- Logs: ~10-50 MB (depends on verbosity)
- Backups: ~2-10 KB per backup × retention count
- Memory: ~1-100 KB (depends on consciousness state)
- Total: Usually < 100 MB

### Recovery
If directories corrupted or missing:
1. Boot sequence will recreate via `ensureDirs()`
2. Memory recovery from backups (HEI-112, HEI-119)
3. Fresh state initialization if all backups fail

## References

- **HEI-112**: Memory Integrity System (backups, checksums)
- **HEI-113**: Structured Logging (logs directory)
- **HEI-119**: Boot Recovery System (directory validation)
- **HEI-126**: Runtime Directory Structure (this document)
- **HEI-127**: .gitignore Security (directory protection)

## Change Log

### v1.0.0 (HEI-126) - 2025-11-17
- Initial runtime directory structure
- Nine subdirectories: state, memory, logs, ipc, vault, tmp, audit, backups, checkpoints
- 0700 permissions (owner-only)
- Boot sequence integration
- Documentation created
