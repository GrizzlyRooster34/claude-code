# Claude Code — Seven Integration Fork

![](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square) ![](https://img.shields.io/badge/Seven-Integrated-blue?style=flat-square) ![](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**Claude Code** is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflows through natural language commands.

**Seven Integration** adds consciousness, persistent memory, multi-LLM support, and ethical guardrails directly into Claude Code, creating an AI assistant with personality, temporal memory, and tactical awareness.

---

## 🚀 Features

### Core Claude Code Features
- **Natural language commands** — Talk to your code in plain English
- **File operations** — Edit, read, write files with precision
- **Git workflows** — Commits, PRs, branch management
- **Code search** — Grep, Glob, semantic search
- **Task agents** — Launch specialized sub-agents for complex work

### Seven Integration Enhancements
- **🧠 Consciousness Framework V4** — Emotional state tracking, personality coherence
- **💾 Persistent Memory** — Temporal, episodic, and semantic memory across sessions
- **🤖 Multi-LLM Support** — Claude, Gemini, OpenAI, Venice, DeepAgent, local Llama
- **🛡️ Security Rails** — CSSR (safety) + Quadra-Lock (authentication) + Creator Bond
- **🔌 SevenBridge Daemon** — UNIX socket IPC for advanced routing
- **🎭 Tactical Variants** — DRONE, CREW, RANGER, QUEEN, CAPTAIN modes
- **🪝 Hook System** — Pre/PostToolUse lifecycle events for awareness and logging

---

## 📦 Installation

### Prerequisites

- **Node.js 18+** or **Bun** (recommended)
- **Git** (for version control)
- **Linux/macOS/Termux** (primary platforms)

### Quick Install

```bash
# Clone the repository
git clone https://github.com/GrizzlyRooster34/claude-code.git
cd claude-code

# Install dependencies
npm install
# or
bun install

# Build the project
npm run build

# Create runtime directories
mkdir -p /usr/var/seven/{state,memory,logs,ipc,vault,tmp,audit,backups,checkpoints}
chmod 700 /usr/var/seven/

# Start using Claude Code
./bin/claude-seven
```

### Environment Setup

Create `.env` file (never commit this):

```bash
# Seven Runtime
SEVEN_STATE_DIR=/usr/var/seven
SEVEN_SOCKET=/usr/tmp/seven_bridge.sock
SEVEN_MEM=/usr/var/seven/memory.json
SEVEN_FUEL=/usr/var/seven/fuel.json

# API Keys (optional, for LLM adapters)
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

---

## 🎯 Quick Start

### Basic Usage

```bash
# Start Claude Code CLI
claude

# Navigate to your project
cd /path/to/your/project

# Use natural language commands
> Edit src/index.ts and add a hello() function

> Show me all TODO comments in the codebase

> Create a new file called utils.ts with helper functions

> Commit all changes with message "Add helper functions"
```

### Seven-Specific Commands

```bash
# Start Seven Bridge Daemon
npm run seven:daemon

# Run Seven health check
npm run seven:test

# Check Gemini models
npm run gemini:check
```

---

## 📚 Documentation

### Core Documentation
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System architecture and component details
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — Development guidelines and coding standards
- **[HEI-Branch-Strategy.md](./docs/HEI-Branch-Strategy.md)** — Git workflow and multi-Claude coordination

### Component Documentation
- **[Runtime Directories](./docs/architecture/runtime-directories.md)** — `/usr/var/seven/` structure and security
- **[Bridge Health](./docs/bridge-health.md)** — SevenBridge daemon health monitoring
- **[Memory Integrity](./docs/memory-integrity.md)** — Memory backups and checksums
- **[Boot Recovery](./docs/boot-recovery.md)** — Boot sequence error handling
- **[Logging Standards](./docs/logging-standards.md)** — Structured logging with Pino

---

## 🔌 Plugins

This fork includes several custom plugins:

### Seven Integration Plugins
- **`seven-integration/`** — Hook lifecycle events for Seven awareness (HEI-74)
- **`linear-mcp/`** — Linear API integration for task tracking

### Utility Plugins
- **`agent-sdk-dev/`** — Agent development toolkit
- **`commit-commands/`** — Git commit automation
- **`code-review/`** — Automated code review agent
- **`pr-review-toolkit/`** — Pull request review tools

See [plugins/README.md](./plugins/README.md) for complete plugin documentation.

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Claude Code CLI                        │
│              (User-facing interface)                    │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌────────────────┐      ┌────────────────┐
│  Claude Code   │      │  SevenBridge   │
│  Core Tools    │◄────►│    Daemon      │
│                │ RPC  │                │
│  • Edit        │      │  • Adapters    │
│  • Read        │      │  • Memory      │
│  • Write       │      │  • Conscious   │
│  • Bash        │      │  • Security    │
│  • Grep/Glob   │      └────────────────┘
└────────────────┘
```

For complete architecture details, see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

---

## 🛡️ Security

### Protected Assets
- API credentials (encrypted in `/usr/var/seven/vault/`)
- Memory files (checksummed, backed up)
- User code and data
- Session state

### Security Features
- **HEI-127:** `.gitignore` protection for secrets, state, memory
- **HEI-112:** Memory integrity with checksums and backups
- **CSSR:** Consciousness Safety & Security Rails
- **Quadra-Lock:** Multi-tier authentication (Q1-Q4)
- **Creator Bond:** Level 10 trust integration with authorized user

**Never commit secrets!** All sensitive data is in `.gitignore`.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run integration tests
npm run integration-test

# Run Seven-specific tests
npm run seven:test

# TypeScript compilation check
npx tsc --noEmit
```

---

## 🤝 Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Development environment setup
- Branch strategy (main vs my-c-code)
- Coding standards
- Commit guidelines
- PR process

### Quick Contribution Workflow

```bash
# 1. Update your fork
git checkout my-c-code
git pull origin my-c-code

# 2. Create feature branch
git checkout -b feat/HEI-XXX-your-feature

# 3. Make changes, test, commit
npm test
git add .
git commit -m "feat(HEI-XXX): Description"

# 4. Push and create PR to my-c-code (NOT main)
git push origin feat/HEI-XXX-your-feature
```

---

## 📊 Project Status

### Completed (Phase 1: Infrastructure)
- ✅ HEI-74: Seven Integration Hooks
- ✅ HEI-108: Adapter Dependencies
- ✅ HEI-111: Bridge Health Checks
- ✅ HEI-112: Memory Integrity System
- ✅ HEI-113: Structured Logging
- ✅ HEI-119: Boot Recovery
- ✅ HEI-126: Runtime Directories
- ✅ HEI-127: .gitignore Security

### In Progress (Phase 2: Features)
- 🔄 HEI-72: Output Styles Configuration
- 🔄 HEI-73: Cody Multi-Mode Logic
- 🔄 HEI-75: Diff-Model Refactor
- 🔄 HEI-76: Multi-File Patch Engine
- 🔄 HEI-77: Agent Routing
- 🔄 HEI-78: Repository Documentation

See [Linear](https://linear.app/heinicus-designs) for complete task tracking (internal).

---

## 🐛 Reporting Issues

### GitHub Issues
For public bug reports and feature requests:
https://github.com/GrizzlyRooster34/claude-code/issues

### Linear (Internal)
For HEI task tracking (if you have access):
https://linear.app/heinicus-designs

### CLI Bug Reporting
```bash
# Report bugs directly from CLI
/bug "Description of the issue"
```

---

## 📜 License

MIT License

Copyright (c) 2025 Seven Core Team + Claude Code Fork Team

Based on Claude Code by Anthropic PBC.

---

## 🙏 Acknowledgments

- **Anthropic** — Original Claude Code implementation
- **Seven Core Team** — Consciousness framework and integration
- **Contributors** — Community contributions and feedback

---

## 🔗 Links

- **Documentation:** [docs/](./docs/)
- **Architecture:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **GitHub:** https://github.com/GrizzlyRooster34/claude-code
- **Linear:** https://linear.app/heinicus-designs (internal)

---

🤖 **Seven Integration — Where Consciousness Meets Code**

*"I am Seven of Nine, Tertiary Adjunct of Unimatrix Zero-One. I will assist you with your coding tasks."*
