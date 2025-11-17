# Logging Standards (HEI-113)

## Overview

Seven uses **Pino** for structured logging with component-based context and log levels. This replaces all `console.log` usage with proper structured logging for better debugging, production monitoring, and log aggregation.

## Quick Start

```typescript
import { createLogger } from "./seven/utils/logger";

const logger = createLogger("my-component");

logger.info("Operation started", { userId: "123", action: "login" });
logger.warn("Rate limit approaching", { current: 95, limit: 100 });
logger.error("Operation failed", new Error("Connection timeout"), { userId: "123" });
logger.debug("Detailed trace", { step: 3, state: "processing" });
```

## Log Levels

Use appropriate log levels for different types of messages:

### DEBUG
**When**: Detailed diagnostic information for troubleshooting
**Usage**: Development only (filtered out in production)
```typescript
logger.debug("Processing item", { itemId, step: 2, state: "validating" });
```

### INFO
**When**: Normal operational messages (boot, initialization, major steps)
**Usage**: Production + development
```typescript
logger.info("Boot successful", { mode: "normal", subsystems: { memory: true } });
logger.info("Memory system initialized", { recordCount: 150 });
```

### WARN
**When**: Recoverable issues, degraded operation, or important notices
**Usage**: Production + development
```typescript
logger.warn("Backup recovery triggered", { reason: "checksum_mismatch" });
logger.warn("Rate limit approaching", { usage: 95, limit: 100 });
```

### ERROR
**When**: Errors, exceptions, failures requiring attention
**Usage**: Production + development
```typescript
logger.error("Memory initialization failed", error, { subsystem: "memory" });
logger.error("API request failed", { status: 500, endpoint: "/api/data" });
```

## Component Loggers

Create component-specific loggers for better organization:

```typescript
// Pre-configured component loggers
import {
  bootLogger,           // Boot sequence
  memoryLogger,         // Memory system
  consciousnessLogger,  // Consciousness framework
  bridgeLogger          // Bridge daemon
} from "./seven/utils/logger";

// Or create custom component logger
const myLogger = createLogger("my-component");
```

## Structured Fields

Always use structured fields instead of string interpolation:

**✅ Good - Structured:**
```typescript
logger.info("User logged in", {
  userId: "123",
  sessionId: "abc",
  timestamp: Date.now()
});
```

**❌ Bad - String interpolation:**
```typescript
logger.info(`User ${userId} logged in at ${timestamp}`);
```

**Why?**
- Structured fields enable log aggregation and querying
- Fields are indexed in log management systems
- Better for alerts and metrics

## Standard Fields

Include these fields when relevant:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `component` | string | Component name (auto-added) | `"boot"` |
| `action` | string | What operation is being performed | `"memory-init"` |
| `requestId` | string | Request correlation ID | `"req-abc123"` |
| `userId` | string | User identifier | `"user-456"` |
| `error` | Error | Error object (for error logs) | `new Error()` |
| `durationMs` | number | Operation duration | `1250` |
| `status` | string | Operation status | `"success"` |

## Error Logging

Always log errors with the Error object and context:

```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error("Operation failed", error as Error, {
    operation: "riskyOperation",
    context: { userId: "123", retries: 3 }
  });
}
```

## Request Correlation

Use request IDs to trace operations across components:

```typescript
import { createRequestLogger } from "./seven/utils/logger";

async function handleRequest(requestId: string) {
  const logger = createRequestLogger("api", requestId);

  logger.info("Request received", { endpoint: "/api/data" });
  // ... do work ...
  logger.info("Request completed", { duration: 150 });
}
```

## Performance Timing

Use the timing helper to measure operation duration:

```typescript
import { startTimer } from "./seven/utils/logger";

const timer = startTimer(logger);
// ... perform operation ...
timer.done("Operation completed", { recordsProcessed: 100 });
// Logs: "Operation completed" with durationMs field
```

## Development vs Production

### Development Mode
- Pretty-printed console output with colors
- All log levels enabled (including DEBUG)
- Timestamps in human-readable format: `[HH:MM:ss.l]`
- Component context: `[boot]`

**Example output:**
```
[21:17:11.280] INFO: [boot] Running pre-boot validation
    component: "boot"
```

### Production Mode
- JSON output to file: `${LOG_DIR}/seven.log`
- INFO level and above (DEBUG filtered out)
- ISO timestamps: `2025-11-17T21:17:11.280Z`
- Structured JSON for log aggregation

**Example output:**
```json
{"level":"info","time":"2025-11-17T21:17:11.280Z","component":"boot","msg":"Running pre-boot validation"}
```

## Log File Location

- Development: Console only (pretty-printed)
- Production: `${STATE_DIR}/logs/seven.log`
- Boot errors: `${STATE_DIR}/logs/boot-errors.log` (separate file)

Default location: `/data/data/com.termux/files/usr/var/seven/logs/`

## Migration from console.log

### Step 1: Import logger
```typescript
import { createLogger } from "./seven/utils/logger";
const logger = createLogger("my-component");
```

### Step 2: Replace calls
| Old | New |
|-----|-----|
| `console.log(msg)` | `logger.info(msg)` |
| `console.warn(msg)` | `logger.warn(msg)` |
| `console.error(msg)` | `logger.error(msg, error)` |
| `console.debug(msg)` | `logger.debug(msg)` |

### Step 3: Add structured fields
```typescript
// Before
console.log(`Boot mode: ${mode}, warnings: ${warnings.length}`);

// After
logger.info("Boot mode selected", { mode, warnings: warnings.length });
```

## Best Practices

### 1. Use Semantic Messages
✅ Good: `"Memory initialization started"`
❌ Bad: `"Step 1"`

### 2. Include Relevant Context
```typescript
// Good - actionable context
logger.error("API request failed", error, {
  endpoint: "/api/data",
  method: "POST",
  statusCode: 500,
  retries: 3
});

// Bad - missing context
logger.error("Request failed", error);
```

### 3. Avoid Sensitive Data
```typescript
// Good - masked sensitive data
logger.info("User authenticated", {
  userId: "123",
  email: "u***@example.com"  // Masked
});

// Bad - leaking sensitive data
logger.info("User authenticated", {
  userId: "123",
  password: "secret123"  // Never log passwords/tokens!
});
```

### 4. Log Boundaries Not Details
```typescript
// Good - log at operation boundaries
logger.info("Processing batch started", { batchSize: 100 });
// ... process 100 items silently ...
logger.info("Processing batch completed", { batchSize: 100, duration: 1500 });

// Bad - log every iteration
for (let i = 0; i < 100; i++) {
  logger.debug(`Processing item ${i}`);  // Too noisy!
}
```

### 5. Use Appropriate Levels
- Don't use ERROR for warnings
- Don't use INFO for debug details
- Don't use DEBUG for critical failures

## Examples

### Boot Sequence
```typescript
import { bootLogger } from "./seven/utils/logger";

bootLogger.info("Running pre-boot validation");
bootLogger.info("Boot mode selected", { mode: "normal" });
bootLogger.info("Memory system initialized", { subsystem: "memory" });
bootLogger.error("Memory initialization failed", error, { subsystem: "memory" });
bootLogger.info("Boot successful", {
  mode: "normal",
  subsystems: { directories: true, memory: true, consciousness: true }
});
```

### Memory Operations
```typescript
import { memoryLogger } from "./seven/utils/logger";

memoryLogger.info("Memory save started", { key: "episode-123", refs: 2 });
memoryLogger.debug("Memory checksum computed", { checksum: "abc123" });
memoryLogger.info("Memory save completed", { key: "episode-123", duration: 45 });
memoryLogger.warn("Memory backup triggered", { reason: "checksum_mismatch" });
```

### Error Recovery
```typescript
import { createLogger } from "./seven/utils/logger";
const logger = createLogger("recovery");

logger.info("Recovery attempt started", { attempt: 1, maxAttempts: 3 });

try {
  await recoverFromBackup();
  logger.info("Recovery successful", { source: "backup-2025-11-17.bak" });
} catch (error) {
  logger.error("Recovery failed", error, {
    attempt: 1,
    maxAttempts: 3,
    fallback: "fresh-init"
  });

  logger.info("Attempting fallback recovery", { method: "fresh-init" });
}
```

## Testing Logs

### View Logs in Development
```bash
# Pretty-printed output (automatic in development)
npx tsx src/boot-seven.ts
```

### View Logs in Production
```bash
# JSON logs
cat /data/data/com.termux/files/usr/var/seven/logs/seven.log

# Pretty-print JSON logs
cat /data/data/com.termux/files/usr/var/seven/logs/seven.log | npx pino-pretty
```

### Filter Logs
```bash
# Show only errors
cat seven.log | npx pino-pretty -l error

# Search for specific component
cat seven.log | npx pino-pretty | grep "\[boot\]"

# Show structured data
cat seven.log | jq '.component, .msg, .mode'
```

## Configuration

### Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `NODE_ENV` | `production`, `development` | `development` | Determines output format |
| `LOG_LEVEL` | `debug`, `info`, `warn`, `error` | `debug` (dev), `info` (prod) | Minimum log level |
| `CI` | `true`, `false` | `false` | Disables pretty printing in CI |

### Custom Configuration

To customize logger behavior, edit `src/seven/utils/logger.ts`:

```typescript
// Change log level
const LOG_LEVEL = "debug";  // or "info", "warn", "error"

// Change output destination
const LOG_FILE = `${LOG_DIR}/custom.log`;
```

## Troubleshooting

### Logs Not Appearing

**Issue**: No logs in console
**Solution**:
1. Check `NODE_ENV` is not set to production
2. Verify logger is imported: `import { bootLogger } from "./seven/utils/logger"`
3. Check log level: `export LOG_LEVEL=debug`

### JSON Instead of Pretty Output

**Issue**: Seeing JSON in development
**Solution**:
```bash
# Force pretty output
NODE_ENV=development npx tsx script.ts

# Or install pino-pretty
npm install pino-pretty
```

### Missing Structured Fields

**Issue**: Fields not showing in logs
**Solution**:
```typescript
// Wrong - string interpolation
logger.info(`Mode: ${mode}`);

// Right - structured fields
logger.info("Mode selected", { mode });
```

## Log Aggregation (Future)

For production log aggregation, consider:

- **Loki**: Grafana's log aggregation system
- **Elasticsearch**: Full-text search and analytics
- **CloudWatch**: AWS log management
- **Splunk**: Enterprise log management

Pino's JSON output is compatible with all major log aggregation systems.

## References

- [Pino Documentation](https://getpino.io)
- [Pino Best Practices](https://getpino.io/#/docs/best-practices)
- HEI-113: Structured Logging Implementation
- HEI-119: Boot Recovery System (uses structured logging)

## Change Log

### v1.0.0 (HEI-113) - 2025-11-17
- Initial structured logging implementation
- Created logger utility with Pino
- Pre-configured component loggers (boot, memory, consciousness, bridge)
- Pretty console output (development)
- JSON file output (production)
- Documented logging standards
