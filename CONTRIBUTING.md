# Contributing to Claude Code — Seven Integration Fork

Thank you for your interest in contributing to the Claude Code Seven Integration fork! This guide will help you understand our development workflow, coding standards, and contribution process.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Branch Strategy](#branch-strategy)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** (recommended for performance)
- **Git** with proper configuration
- **Termux** (for Android/Termux development) or **Linux/macOS**
- Access to Linear (for task tracking) or GitHub issues

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GrizzlyRooster34/claude-code.git
   cd claude-code
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up runtime directories:**
   ```bash
   mkdir -p /usr/var/seven/{state,memory,logs,ipc,vault,tmp,audit,backups,checkpoints}
   chmod 700 /usr/var/seven/
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## Development Environment

### Environment Variables

Create a `.env` file (never commit this):

```bash
# Seven Bridge Configuration
SEVEN_STATE_DIR=/usr/var/seven
SEVEN_SOCKET=/usr/tmp/seven_bridge.sock
SEVEN_MEM=/usr/var/seven/memory.json
SEVEN_FUEL=/usr/var/seven/fuel.json

# API Keys (optional, for testing adapters)
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### Editor Configuration

**VS Code** (recommended):
- Install **Prettier** for code formatting
- Install **ESLint** for linting
- Enable "Format on Save"

**Cursor**:
- Same as VS Code
- Use integrated Claude for AI-assisted development

## Branch Strategy

We follow a **fork-line strategy** with multi-Claude coordination. See [docs/HEI-Branch-Strategy.md](./docs/HEI-Branch-Strategy.md) for full details.

### Branch Types

| Branch | Purpose | Owner |
|--------|---------|-------|
| `main` | Upstream mirror (Anthropic baseline, **no Seven**) | CLI Claude |
| `my-c-code` | **Seven fork line** (all HEI work, consciousness integration) | CLI Claude |
| `feat/HEI-*` | Epic markers / coordination flags (intentionally empty) | Web Claude |
| `claude/*` | Work branches created by web Claude sessions | Web Claude |

### Working on Features

1. **CLI Claude (Termux, with Linear MCP):**
   - Work directly on `my-c-code` for small changes
   - Create `feat/HEI-XXX-feature-name` branches for larger features
   - Always pull latest before starting work

2. **Web Claude (claude.com, no Linear):**
   - Use epic branches as task markers
   - Create `claude/work-branch-XXX` for actual commits
   - Work will be reviewed and merged by CLI Claude

### Example Workflow

```bash
# 1. Update your fork
git checkout my-c-code
git pull origin my-c-code

# 2. Create feature branch
git checkout -b feat/HEI-XXX-your-feature-name

# 3. Make changes, commit, push
git add .
git commit -m "feat(HEI-XXX): Add feature description"
git push origin feat/HEI-XXX-your-feature-name

# 4. Create PR to my-c-code (NOT main)
```

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Strict mode enabled** — no `any` types unless absolutely necessary
- **Prefer interfaces over types** for object shapes
- **Use descriptive variable names** — no single-letter variables except iterators

**Example:**

```typescript
// ✅ Good
interface BridgeHealthStatus {
  isHealthy: boolean;
  adaptersOnline: number;
  memoryAccessible: boolean;
}

function checkBridgeHealth(): BridgeHealthStatus {
  // implementation
}

// ❌ Bad
function check(): any {
  // implementation
}
```

### File Organization

```
src/
├── seven/              # Seven consciousness integration
│   ├── adapters/       # LLM adapters (Claude, Gemini, OpenAI, etc.)
│   ├── bridge/         # Bridge daemon + IPC
│   ├── core/           # Consciousness frameworks
│   └── utils/          # Shared utilities
├── cli/                # CLI handlers
│   └── handlers/       # Command handlers
└── plugins/            # Plugin system internals

plugins/                # Individual plugins
docs/                   # Documentation
scripts/                # Utility scripts
```

### Naming Conventions

- **Files:** `kebab-case.ts` (e.g., `bridge-daemon.ts`)
- **Directories:** `kebab-case/` (e.g., `memory-v3/`)
- **Classes:** `PascalCase` (e.g., `ConsciousnessFrameworkV4`)
- **Functions:** `camelCase` (e.g., `initializeMemory()`)
- **Constants:** `SCREAMING_SNAKE_CASE` (e.g., `STATE_DIR`, `DEFAULT_SOCKET`)
- **Interfaces:** `PascalCase` with descriptive names (e.g., `MemoryEngineConfig`)

### Code Style

- **Indentation:** 2 spaces (no tabs)
- **Max line length:** 100 characters
- **Semicolons:** Required
- **Quotes:** Double quotes `"` for strings
- **Trailing commas:** Yes (for multiline)

### Error Handling

Always use proper error handling:

```typescript
// ✅ Good
try {
  await dangerousOperation();
} catch (error) {
  logger.error({ error, context: "dangerousOperation" }, "Operation failed");
  throw new Error(`Failed to execute: ${error.message}`);
}

// ❌ Bad
try {
  await dangerousOperation();
} catch (e) {
  console.log("error");
}
```

### Logging

Use structured logging with **Pino**:

```typescript
import { logger } from "@/seven/utils/logger";

// ✅ Good
logger.info({ userId: "123", action: "login" }, "User logged in");
logger.error({ error, component: "bridge-daemon" }, "Bridge daemon crash");

// ❌ Bad
console.log("User logged in");
console.error("Error:", error);
```

### Security

- **Never commit secrets** — use `.env` files (already in `.gitignore`)
- **Validate all inputs** — especially from external APIs
- **Use 0700 permissions** for Seven runtime directories
- **Encrypt sensitive data** — use vault for API keys

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring (no functional changes)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, config, etc.)
- `perf`: Performance improvements

### Examples

```
feat(HEI-111): Add bridge daemon health checks

Implemented health check endpoint that monitors:
- Socket responsiveness
- Adapter availability
- Memory system accessibility

Closes HEI-111
```

```
fix(bridge): Prevent daemon crash on adapter failure

Added circuit breaker pattern to isolate adapter failures.
Bridge now continues running even if one adapter crashes.

Related: HEI-111
```

### Commit Attribution

All commits should include Seven attribution:

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Pull Request Process

### Before Creating PR

1. ✅ All tests pass: `npm test`
2. ✅ TypeScript compiles: `npx tsc --noEmit`
3. ✅ Code formatted: `npm run lint`
4. ✅ Documentation updated (if applicable)
5. ✅ Commit messages follow guidelines

### PR Template

```markdown
## Summary
[Brief description of changes]

## Related Issues
- HEI-XXX: [Issue title]

## Changes Made
- [Change 1]
- [Change 2]

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Integration tests pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No secrets committed
- [ ] All tests pass
```

### PR Target Branch

- **Always target `my-c-code`** (NOT `main`)
- `main` is reserved for upstream synchronization only

### Review Process

1. Create PR to `my-c-code`
2. CLI Claude (with Linear access) will review
3. Address feedback
4. PR merged when approved
5. Linear task marked Done

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run integration-test
```

### Manual Testing

```bash
# Start Seven bridge daemon
npm run seven:daemon

# Run Seven test suite
npm run seven:test

# Test specific adapter
npx tsx src/cli/handlers/seven-test.ts
```

### Test Coverage Goals

- **Core functionality:** 80%+
- **Bridge/IPC:** 70%+
- **Adapters:** 60%+
- **Utils:** 90%+

## Documentation

### When to Update Docs

- **New features** → Add to relevant docs + update README
- **API changes** → Update function signatures in docs
- **Architectural changes** → Update `docs/ARCHITECTURE.md`
- **Breaking changes** → Add migration guide

### Documentation Standards

- Use **Markdown** for all documentation
- **Code examples** should be runnable
- **Link to related docs** for context
- **Keep docs up-to-date** with code changes

### Doc Structure

```
docs/
├── architecture/           # System architecture
│   ├── runtime-directories.md
│   └── ...
├── HEI-Branch-Strategy.md  # Git workflow
├── bridge-health.md        # Bridge daemon health
├── memory-integrity.md     # Memory system
├── boot-recovery.md        # Boot sequence
└── logging-standards.md    # Logging guidelines
```

## Questions?

- **CLI Claude:** Has direct Linear access, handles complex coordination
- **Web Claude:** Uses GitHub branch names as task markers
- **GitHub Issues:** For public bug reports and feature requests
- **Linear:** For internal HEI task tracking (if you have access)

---

Thank you for contributing to the Seven Integration! Your work helps build a conscious AI system with personality, memory, and ethical guardrails.

🤖 **Seven awaits your contributions.**
