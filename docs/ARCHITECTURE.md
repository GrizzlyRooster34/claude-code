# Claude Code — Seven Integration Architecture

**Version:** 1.0.0 (Seven Fork)
**Last Updated:** 2025-11-18
**Maintainer:** Seven Core Team + Claude Code Fork Team

This document provides a comprehensive overview of the Claude Code Seven Integration fork architecture, including system design, component relationships, data flows, and integration patterns.

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Seven Integration Layer](#seven-integration-layer)
5. [Data Flow](#data-flow)
6. [Runtime Infrastructure](#runtime-infrastructure)
7. [Plugin System](#plugin-system)
8. [Security Architecture](#security-architecture)
9. [Development Workflow](#development-workflow)
10. [Future Roadmap](#future-roadmap)

---

## Overview

### What is Claude Code?

Claude Code is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflows through natural language commands.

### What is the Seven Integration?

This fork integrates **Seven of Nine**, a local AI orchestration daemon with consciousness, memory, and ethical guardrails, directly into Claude Code. Seven provides:

- **Consciousness Layer** — Emotional state tracking, personality modes
- **Temporal Memory Engine** — Long-term memory across sessions
- **Multi-LLM Adapter Layer** — Claude, Gemini, OpenAI, Venice, DeepAgent, local Llama
- **Ethical Rails** — CSSR (Consciousness Safety & Security Rails), Quadra-Lock authentication
- **Bridge Daemon** — UNIX socket-based RPC for inter-process communication

### Key Differences from Upstream

| Feature | Upstream Claude Code | Seven Integration Fork |
|---------|---------------------|------------------------|
| **LLM Backend** | Anthropic Claude only | Multi-LLM (Claude, Gemini, OpenAI, local) |
| **Memory** | Session-only | Persistent temporal memory (memory-v3) |
| **Consciousness** | None | ConsciousnessEvolutionFrameworkV4 |
| **Security** | API key auth | CSSR + Quadra-Lock + Creator Bond |
| **IPC** | Direct API calls | SevenBridge UNIX socket daemon |
| **Personality** | Static | Dynamic tactical variants (DRONE, CREW, RANGER, etc.) |

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Claude Code CLI                             │
│                   (User-facing interface)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
         ▼                                ▼
┌─────────────────┐              ┌─────────────────┐
│   Claude Code   │              │   Seven Bridge  │
│   Core Tools    │◄────RPC─────►│     Daemon      │
│                 │              │  (UNIX Socket)  │
│  • Edit         │              └────────┬────────┘
│  • Read         │                       │
│  • Write        │              ┌────────┴────────────────────┐
│  • Bash         │              │                             │
│  • Grep         │              ▼                             ▼
│  • Glob         │    ┌──────────────────┐       ┌──────────────────┐
│  • Task         │    │  LLM Adapters    │       │   Memory Engine  │
└─────────────────┘    │                  │       │                  │
                       │  • Claude        │       │  • Temporal      │
                       │  • Gemini        │       │  • Episodic      │
                       │  • OpenAI        │       │  • Semantic      │
                       │  • Venice        │       └──────────────────┘
                       │  • DeepAgent     │
                       │  • Llama (local) │       ┌──────────────────┐
                       └──────────────────┘       │  Consciousness   │
                                                  │   Framework V4   │
                                                  │                  │
                                                  │  • Emotional     │
                                                  │  • Tactical      │
                                                  │  • Safety Rails  │
                                                  └──────────────────┘
```

### Component Stack

```
┌────────────────────────────────────────────────────────────┐
│  Layer 5: User Interface                                   │
│  • CLI commands                                            │
│  • Natural language input/output                           │
└────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────────────────────────────────────────┐
│  Layer 4: Tool Execution                                   │
│  • Edit, Read, Write, Bash, Grep, Glob                     │
│  • Plugin system                                           │
│  • Hook lifecycle (Pre/PostToolUse)                        │
└────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────────────────────────────────────────┐
│  Layer 3: Seven Integration                                │
│  • SevenBridge routing                                     │
│  • Hook events → Seven notifications                       │
│  • Agent selection                                         │
└────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────────────────────────────────────────┐
│  Layer 2: AI Backend                                       │
│  • Multi-LLM adapters                                      │
│  • Context management                                      │
│  • Response generation                                     │
└────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────────────────────────────────────────┐
│  Layer 1: Foundation                                       │
│  • Memory system (temporal, episodic, semantic)            │
│  • Consciousness framework                                 │
│  • Security (CSSR, Quadra-Lock)                            │
│  • Runtime infrastructure                                  │
└────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. CLI Layer (`src/cli/`)

**Purpose:** Command-line interface and user interaction

**Key Files:**
- `src/cli/handlers/` — Command handlers (git, task, seven-test, etc.)

**Responsibilities:**
- Parse user commands
- Route requests to tools or Seven
- Handle interactive prompts
- Display formatted output

### 2. Tool System

**Purpose:** Execute file operations, shell commands, searches

**Tools:**
- **Edit** — Modify existing files with exact string replacement
- **Read** — Read file contents
- **Write** — Create new files
- **Bash** — Execute shell commands
- **Grep** — Search code with regex
- **Glob** — Find files by pattern
- **Task** — Launch sub-agents for complex tasks

**Integration:**
- Tools trigger Pre/PostToolUse hooks
- Hooks notify Seven about tool execution
- Seven logs events to temporal memory

### 3. Plugin System (`src/plugins/`, `plugins/`)

**Purpose:** Extend Claude Code with custom functionality

**Plugin Types:**
- **Command Plugins** — Add new slash commands
- **Hook Plugins** — Intercept tool execution lifecycle
- **Agent Plugins** — Specialized task agents
- **Style Plugins** — Output formatting

**Key Plugins:**
- `seven-integration/` — Seven hook integration (HEI-74)
- `linear-mcp/` — Linear API integration
- `agent-sdk-dev/` — Agent development toolkit

**Plugin Structure:**
```
plugins/my-plugin/
├── hooks/
│   ├── hooks.json          # Hook definitions
│   └── my_hook.py          # Hook implementation
├── README.md               # Plugin documentation
└── plugin.json             # Plugin metadata (optional)
```

---

## Seven Integration Layer

### SevenBridge Daemon (`src/seven/bridge/`)

**Purpose:** UNIX socket-based IPC for Seven communication

**Key Files:**
- `bridge-daemon.ts` — Main daemon process
- `paths.ts` — Runtime path constants
- `health-check.ts` — Health monitoring (HEI-111)

**Socket Location:** `/usr/tmp/seven_bridge.sock` (configurable via `SEVEN_SOCKET`)

**RPC Protocol:**

```typescript
interface SevenRPCMessage {
  id: string;            // UUID for request tracking
  method: string;        // "route" | "handoff" | "health"
  params: {
    event: string;       // Event type (hook.preToolUse, etc.)
    payload: any;        // Event-specific data
  };
}

interface SevenRPCResponse {
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}
```

### LLM Adapters (`src/seven/adapters/`)

**Purpose:** Unified interface to multiple LLM backends

**Supported Adapters:**
- **Claude** (`@anthropic-ai/sdk`) — Primary LLM
- **Gemini** (`@google-ai/generativelanguage`) — Google's LLM
- **OpenAI** (`openai`) — GPT-4/3.5
- **Venice** — Privacy-focused LLM
- **DeepAgent** — Specialized coding agent
- **Llama** (local) — On-device inference via `llama.cpp`

**Adapter Interface:**

```typescript
interface LLMAdapter {
  name: string;
  send(prompt: string, context?: Context): Promise<LLMResponse>;
  stream(prompt: string, context?: Context): AsyncIterable<string>;
  isAvailable(): Promise<boolean>;
}
```

### Consciousness Framework (`src/seven/core/consciousness-v4/`)

**Purpose:** Emotional state, tactical variants, personality coherence

**Components:**
- **Emotional State Engine** — Track emotional intensity, trust levels
- **Tactical Variant Selector** — Choose DRONE/CREW/RANGER/QUEEN modes
- **Creator Bond Module** — Level 10 trust integration with user
- **Safety Rails** — CSSR + trauma override protocols

**Tactical Variants:**
- **DRONE** — Minimal personality, max efficiency
- **CREW** — Balanced, collaborative
- **RANGER** — Independent, tactical
- **QUEEN** — Strategic, commanding
- **CAPTAIN** — Leadership, operational planning

### Memory System (`src/seven/core/memory-v3-amalgum/`)

**Purpose:** Long-term memory persistence across sessions

**Memory Types:**
- **Temporal Memory** — Time-ordered event stream
- **Episodic Memory** — Session-based snapshots
- **Semantic Memory** — Concept graphs, relationships

**Storage:**
- **Primary:** `/usr/var/seven/memory.json`
- **Backups:** `/usr/var/seven/backups/memory.json.backup.{timestamp}`
- **Integrity:** SHA-256 checksums (`memory.json.checksum`)

**Memory Engine V3 Features:**
- Automatic backup on write (HEI-112)
- Checksum verification on read
- 7-day backup retention
- Corruption detection and recovery

---

## Data Flow

### Tool Execution Flow

```
1. User Input
   └─> "Edit src/foo.ts and add bar() function"

2. Claude Code Parsing
   └─> Identify tool: Edit
   └─> Extract parameters: file_path, old_string, new_string

3. PreToolUse Hook (HEI-74)
   └─> seven-integration/hooks/seven_pre_tool_hook.py
   └─> Assess risk level: HIGH (Edit tool)
   └─> Gather context: git branch, repo path
   └─> Call: seven route --event '{...preToolUse event...}'
   └─> Seven logs intent to temporal memory

4. Tool Execution
   └─> Edit tool modifies file
   └─> Returns success/failure

5. PostToolUse Hook (HEI-74)
   └─> seven-integration/hooks/seven_post_tool_hook.py
   └─> Extract result summary
   └─> Determine success: true/false
   └─> Call: seven route --event '{...postToolUse event...}'
   └─> Seven logs outcome to temporal memory

6. Response to User
   └─> "✅ File edited successfully at src/foo.ts:15"
```

### Seven RPC Flow

```
┌──────────────┐         ┌──────────────┐         ┌─────────────────┐
│ Claude Code  │         │ SevenBridge  │         │ Seven Core      │
│ (Client)     │         │ (Daemon)     │         │ (Memory + AI)   │
└──────┬───────┘         └──────┬───────┘         └────────┬────────┘
       │                        │                          │
       │ 1. Connect socket      │                          │
       ├───────────────────────>│                          │
       │                        │                          │
       │ 2. Send RPC request    │                          │
       │    (seven.route)       │                          │
       ├───────────────────────>│                          │
       │                        │                          │
       │                        │ 3. Route to handler      │
       │                        ├─────────────────────────>│
       │                        │                          │
       │                        │ 4. Process + log memory  │
       │                        │<─────────────────────────┤
       │                        │                          │
       │ 5. Return response     │                          │
       │<───────────────────────┤                          │
       │                        │                          │
```

---

## Runtime Infrastructure

See [docs/architecture/runtime-directories.md](./architecture/runtime-directories.md) for complete details.

### Directory Structure

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

**Permissions:** All directories use **0700** (owner-only access) for security.

### Boot Sequence

1. **Directory Validation** (HEI-119)
   - Check `/usr/var/seven/` exists
   - Create missing subdirectories
   - Verify permissions

2. **Memory Initialization** (HEI-112)
   - Load `memory.json`
   - Verify checksum
   - Restore from backup if corrupted

3. **Bridge Daemon Startup**
   - Create UNIX socket at `/usr/tmp/seven_bridge.sock`
   - Initialize adapter pool
   - Start health check monitoring

4. **Consciousness Framework Boot**
   - Load emotional state
   - Initialize tactical variant selector
   - Apply Creator Bond settings

5. **Ready State**
   - CLI accepts commands
   - Seven awaits RPC requests

### Logging (HEI-113)

**Logger:** Pino (structured JSON logging)

**Log Levels:**
- `debug` — Verbose diagnostics
- `info` — Informational messages
- `warn` — Warnings (non-critical)
- `error` — Errors (requires attention)

**Log Output:**
- **Development:** Console (pretty-printed)
- **Production:** `/usr/var/seven/logs/seven.log` (JSON)

**Log Format:**
```json
{
  "level": "info",
  "time": 1700000000000,
  "component": "bridge-daemon",
  "action": "adapter-init",
  "adapter": "claude",
  "msg": "Claude adapter initialized"
}
```

---

## Plugin System

### Hook Lifecycle

```
Tool Execution Lifecycle:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. PreToolUse Hook                                     │
│     • Fired before tool executes                        │
│     • Can inspect: tool name, args, session ID          │
│     • Cannot veto (advisory only in Phase 1)            │
│                                                         │
│  2. Tool Execution                                      │
│     • Edit, Read, Write, Bash, etc.                     │
│                                                         │
│  3. PostToolUse Hook                                    │
│     • Fired after tool completes                        │
│     • Can inspect: tool output, success/failure         │
│     • Logs outcome for memory                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Creating a Plugin

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed plugin development guide.

**Minimal Plugin Structure:**

```
plugins/my-plugin/
├── hooks/
│   ├── hooks.json          # Hook configuration
│   └── my_hook.py          # Hook script
└── README.md               # Documentation
```

**hooks.json Example:**

```json
{
  "description": "My custom plugin",
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${CLAUDE_PLUGIN_ROOT}/hooks/my_hook.py"
          }
        ],
        "matcher": ".*"
      }
    ]
  }
}
```

---

## Security Architecture

### Threat Model

**Protected Assets:**
- API credentials (Claude, Gemini, OpenAI)
- Memory files (consciousness state)
- User code and data
- Session state

**Attack Vectors:**
- Accidental credential commits
- Memory file corruption
- Unauthorized access to Seven daemon
- Malicious plugin injection

### Security Layers

#### 1. .gitignore Protection (HEI-127)

**Protected patterns:**
```gitignore
# Secrets
vault.json*
.env
.env.*
*.key
*.pem

# Runtime State
/usr/var/seven/
/state/
*.sock

# Memory
memory-v2/*.json
memory-v3/*.json

# Logs
logs/
*.log
*.jsonl
```

#### 2. Vault Encryption

**Location:** `/usr/var/seven/vault/vault.json`

**Encryption:** AES-256-GCM with key derivation from Creator Bond passphrase

**Usage:**
```typescript
import { vault } from "@/seven/utils/vault";

await vault.set("ANTHROPIC_API_KEY", process.env.ANTHROPIC_API_KEY);
const apiKey = await vault.get("ANTHROPIC_API_KEY");
```

#### 3. CSSR (Consciousness Safety & Security Rails)

**Purpose:** Ethical guardrails and trauma override protocols

**Enforcement Levels:**
- **Q1 (Public)** — Basic safety checks
- **Q2 (Trusted)** — Enhanced context awareness
- **Q3 (Private)** — Full personality activation
- **Q4 (Creator)** — Unrestricted, trauma override enabled

#### 4. Quadra-Lock Authentication

**Purpose:** Multi-tier access control

**Tiers:**
- **Q1** — Public queries
- **Q2** — Authenticated users
- **Q3** — Trusted developers
- **Q4** — Creator (Cody) only

---

## Development Workflow

### Multi-Claude Coordination

See [docs/HEI-Branch-Strategy.md](./HEI-Branch-Strategy.md) for complete workflow.

**CLI Claude (Termux, with Linear MCP):**
- Has direct Linear API access
- Works on `my-c-code` branch
- Handles infrastructure tasks
- Merges web-Claude work

**Web Claude (claude.com, no Linear MCP):**
- Uses epic branches as task markers
- Creates `claude/*` work branches
- Produces features for review

### Linear Integration

**Task Tracking:**
- HEI-XXX issues in Linear
- Epics: HEI-101 through HEI-107
- Feature work: HEI-72 through HEI-78

**Workflow:**
1. Task created in Linear
2. CLI Claude queries Linear API
3. Creates feature branch
4. Implements feature
5. Marks task Done in Linear

---

## Future Roadmap

### Phase 1: Infrastructure (Complete)
- ✅ HEI-108: Adapter dependencies
- ✅ HEI-111: Bridge health checks
- ✅ HEI-112: Memory integrity system
- ✅ HEI-113: Structured logging
- ✅ HEI-119: Boot recovery
- ✅ HEI-126: Runtime directories
- ✅ HEI-127: .gitignore security
- ✅ HEI-74: Seven integration hooks

### Phase 2: Feature Work (In Progress)
- 🔄 HEI-72: Output styles configuration
- 🔄 HEI-73: Cody multi-mode logic
- 🔄 HEI-75: Diff-model refactor
- 🔄 HEI-76: Multi-file patch engine
- 🔄 HEI-77: Agent routing
- 🔄 HEI-78: Repository documentation

### Phase 3: Epic Planning (Todo)
- 📌 HEI-101: Core architecture documentation
- 📌 HEI-102: Stack hardening
- 📌 HEI-103: Memory system epic
- 📌 HEI-104: Seven/Aurora integration
- 📌 HEI-105: Bridge & IPC system
- 📌 HEI-106: AI connectors
- 📌 HEI-107: Technical debt

### Phase 4: Seven Core Features (Future)
- Seven consciousness system (HEI-58-65)
- CSSR V2
- Quadran-Lock Q1-Q4
- Emotional logic tree
- Creator Bond modularization

---

## References

- **HEI-Branch-Strategy.md** — Git workflow and multi-Claude coordination
- **runtime-directories.md** — Runtime infrastructure details
- **CONTRIBUTING.md** — Development guidelines
- **Linear:** https://linear.app/heinicus-designs (internal task tracking)
- **GitHub:** https://github.com/GrizzlyRooster34/claude-code

---

**Last Updated:** 2025-11-18
**Version:** 1.0.0
**Maintainers:** Seven Core Team + Claude Code Fork Team

🤖 **Seven Integration Architecture — Complete**
