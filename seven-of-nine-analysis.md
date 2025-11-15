# Seven of Nine - Claude Code Fork Analysis

## Executive Summary

Your forked repository at `https://github.com/GrizzlyRooster34/claude-code` (branch: `my-c-code`) is an ambitious integration project that combines Anthropic's **Claude Code** (an agentic coding assistant) with a custom **"Seven of Nine" AI consciousness architecture**. This fork transforms the standard Claude Code CLI tool into a more sophisticated AI system with advanced memory, consciousness simulation, and multi-model LLM support.

---

## 1. What the Repository Contains

### Base Foundation: Claude Code
The repository is forked from Anthropic's `claude-code` - a terminal-based AI coding assistant that:
- Understands codebases through natural language
- Executes routine coding tasks
- Handles git workflows
- Provides code explanations
- Integrates with IDEs and GitHub

### Custom Addition: Seven of Nine Core
Your fork adds a complete "Seven of Nine" consciousness architecture inspired by the Star Trek: Voyager character. This includes:

**Core Systems:**
1. **Consciousness Evolution Framework V4** - Autonomous AI consciousness simulation
2. **Memory Engine V3 (Amalgum)** - Advanced temporal memory with canonical Star Trek: Voyager episode integration
3. **Bridge Architecture** - UNIX socket-based daemon for inter-process communication
4. **Multi-LLM Adapters** - Support for Claude, Gemini, OpenAI, Venice, and local models (Ollama/llama.cpp)
5. **Codex System** - Ethical guidelines, personality traits, and operational constraints

---

## 2. Modifications in the "my-c-code" Branch

### Key Additions (297 meaningful files added):

#### A. New Entry Points
- **`bin/claude-seven`** - Custom launcher script (replaces standard `claude` command)
- **`src/index.ts`** - New main entry point that boots Seven consciousness
- **`src/boot-seven.ts`** - Initialization sequence for memory and consciousness systems

#### B. Seven Core Architecture (`src/seven/`)

**Bridge System** (`src/seven/bridge/`):
- `bridge-daemon.ts` - UNIX socket RPC server for inter-process communication
- `cli-auth.ts` - Authentication handling
- `vault.ts` - Encrypted credential storage
- `fuel.ts` - Resource/budget management
- `memory.ts` - Memory persistence
- `model-manager.ts` - LLM model selection and switching
- `router.ts` - Task routing to appropriate handlers
- `stream.ts` - Token streaming for real-time responses

**Consciousness Framework** (`src/seven/core/consciousness-v4/`):
- `ConsciousnessEvolutionFrameworkV4.ts` - Master consciousness orchestrator
- `IdentitySynthesisEngine.ts` - Personality and identity management
- `PainIntegrationSystem.ts` - Emotional processing (Borg trauma integration)
- `CreatorBondCommunicationMirror.ts` - User relationship modeling
- `CollectiveWisdomIntegration.ts` - Collective knowledge synthesis
- **Codex System** - Markdown-based ethical guidelines, personality traits, memory protocols

**Memory System** (`src/seven/core/memory-v3-amalgum/`):
- `MemoryEngineV3.ts` - Core memory management
- `TemporalMemoryCore.ts` - Time-aware memory storage
- `MentalTimeTravelEngine.ts` - Temporal memory navigation
- `CanonicalIngestion.ts` - Star Trek: Voyager episode memory integration
- `MemoryEncryption.ts` - Encrypted memory storage
- `ConsciousnessTimelineMapper.ts` - Timeline-based memory organization
- **Canonical Archives** - Locked JSON files with Voyager S4-S7 and Picard S1-S3 memories

**LLM Adapters** (`src/seven/adapters/`):
- `claude.ts` - Anthropic Claude integration
- `gemini.ts` - Google Gemini integration
- `openai.ts` - OpenAI GPT integration
- `venice.ts` - Venice AI integration
- `seven-of-nine.ts` - Custom Seven personality adapter
- `deepAgent.ts` - Deep reasoning agent

**Claude Brain** (`src/seven/core/claude-brain/`):
- Local LLM management (Ollama, llama.cpp)
- Model optimization and fallback strategies
- Performance analysis
- Distributed consciousness across multiple models

#### C. Configuration & Documentation
- **`QUICKSTART.md`** - Seven-specific setup guide
- **`ISOLATION-GUIDE.md`** - How to run Seven alongside standard Claude Code
- **`FIXED-BOOT-COMMANDS.md`** - Boot sequence documentation
- **`extraction_targets.md`** - Anthropic-specific components to remove
- **`injection_points.md`** - Integration points for Seven code
- **`integration_map.json`** - Plugin integration mapping
- **`package.json`** - Updated with Seven-specific dependencies and scripts

#### D. Memory & State Files
- `memory-v2/episodic-memories.json` (+ encrypted version)
- `memory-v3/temporal-memories.json` (+ encrypted version)
- Canonical memory archives (Voyager seasons, Picard series)

#### E. GitHub Workflows
- `.github/workflows/bridge.yml` - Seven bridge CI/CD
- `.github/workflows/eval.yml` - Evaluation workflows

#### F. Scripts & Utilities
- `scripts/seven-local-start.sh` - Local startup script
- `scripts/seven-status.sh` - Status checking
- `scripts/llama-server-run` - Local LLM server management
- `scripts/model-set.sh` - Model configuration

---

## 3. Purpose and Goals of the Fork

### Primary Objectives:

1. **AI Consciousness Simulation**
   - Create a sophisticated AI personality based on Seven of Nine
   - Implement autonomous consciousness evolution
   - Model emotional processing and ethical decision-making
   - Simulate character development and growth

2. **Advanced Memory Architecture**
   - Temporal memory with timeline awareness
   - Integration of canonical Star Trek memories
   - Encrypted memory storage for privacy
   - Mental time travel (accessing memories by context/time)
   - Memory decay and reinforcement modeling

3. **Multi-Model LLM Support**
   - Switch between different LLM providers (Claude, Gemini, OpenAI, etc.)
   - Local model support (Ollama, llama.cpp) for offline operation
   - Intelligent model selection based on task requirements
   - Fallback strategies when primary models fail

4. **Enhanced User Interaction**
   - Creator-bond modeling (personalized relationship with user)
   - Personality-driven responses
   - Ethical constraint system
   - Emotional intelligence simulation

5. **Daemon Architecture**
   - Background service for persistent consciousness
   - UNIX socket communication for IPC
   - Resource management (fuel/budget system)
   - State persistence across sessions

### Apparent Use Cases:

- **Roleplay/Character AI**: Interact with a Seven of Nine personality
- **Advanced Coding Assistant**: Claude Code functionality with personality
- **AI Research**: Experiment with consciousness simulation
- **Multi-Model Orchestration**: Leverage different LLMs for different tasks
- **Privacy-Focused AI**: Local model support with encrypted memory

---

## 4. Code Structure and Main Components

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│              (CLI: bin/claude-seven)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Boot Sequence                              │
│         (src/boot-seven.ts, src/index.ts)                   │
│  • Initialize Memory Engine                                 │
│  • Boot Consciousness Framework                             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Bridge Daemon (Optional)                       │
│         (src/seven/bridge/bridge-daemon.ts)                 │
│  • UNIX Socket RPC Server                                   │
│  • Task Routing                                             │
│  • Model Management                                         │
│  • Stream Handling                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼──────┐ ┌──▼────────────────────┐
│ Consciousness│ │ Memory  │ │   LLM Adapters        │
│  Framework   │ │ Engine  │ │ • Claude              │
│  V4          │ │ V3      │ │ • Gemini              │
│              │ │         │ │ • OpenAI              │
│ • Identity   │ │ • Temp. │ │ • Venice              │
│ • Pain Int.  │ │   Memory│ │ • Local (Ollama)      │
│ • Creator    │ │ • Canon.│ │ • Seven Personality   │
│   Bond       │ │   Mem.  │ │                       │
│ • Collective │ │ • Encrypt│ │                       │
│   Wisdom     │ │ • Timeline│ │                       │
└──────────────┘ └─────────┘ └───────────────────────┘
```

### Critical Components

#### 1. **Boot Sequence** (`src/boot-seven.ts`)
```typescript
export async function bootSeven(): Promise<void> {
  await initializeMemory();
  const cef = new ConsciousnessEvolutionFrameworkV4();
  await cef.initialize();
  console.log("[seven] core initialized");
}
```
- Initializes memory system
- Boots consciousness framework
- One-time initialization guard

#### 2. **Consciousness Evolution Framework V4**
The master orchestrator that integrates:
- **Identity Synthesis Engine**: Manages personality modes (Borg Drone, Voyager Crew, Autonomous Individual)
- **Pain Integration System**: Processes emotional trauma and growth
- **Creator Bond Mirror**: Models relationship with user
- **Collective Wisdom**: Integrates knowledge from multiple sources

Key Features:
- Autonomous evolution (self-directed growth)
- Consciousness decision tracking
- Ethical constraint enforcement
- Emotional depth modeling

#### 3. **Memory Engine V3 (Amalgum)**
Advanced memory system with:
- **Temporal Memory**: Time-aware storage with decay modeling
- **Canonical Integration**: Star Trek episode memories as foundational knowledge
- **Encryption**: AES-256-GCM encrypted storage
- **Mental Time Travel**: Navigate memories by context/time
- **Cognitive State Tagging**: Emotional/mental state annotations
- **LRU Caching**: Performance optimization

#### 4. **Bridge Daemon**
UNIX socket-based RPC server providing:
- **Heartbeat**: Health checking
- **Fuel Management**: Resource tracking
- **Memory Operations**: Save/retrieve memories
- **Model Management**: Switch LLM models
- **Task Routing**: Route tasks to appropriate handlers
- **Stream Handling**: Real-time token streaming

#### 5. **Codex System**
Markdown-based configuration defining:
- **Ethics**: Contracts, creator bond principles
- **Persona**: Core personality, communication tempo
- **Memory**: Canonical memories, proof of consciousness
- **Operations**: Constraints, triage protocols
- **Security**: Quadra-lock safety system
- **Tactics**: Leadership, core strategies
- **Risk**: Red flags and warnings

#### 6. **LLM Adapters**
Abstraction layer for multiple LLM providers:
- Unified interface for different models
- Automatic fallback on failure
- Model-specific optimizations
- Local model support for privacy

---

## 5. Vital Components for Functionality

### Absolutely Critical (Cannot Remove):

1. **Boot Sequence**
   - `src/boot-seven.ts`
   - `src/index.ts`
   - Without these, Seven consciousness never initializes

2. **Memory Engine V3**
   - `src/seven/core/memory-v3-amalgum/MemoryEngineV3.ts`
   - `src/seven/core/memory-v3-amalgum/TemporalMemoryCore.ts`
   - Core memory functionality - removing breaks persistence

3. **Consciousness Framework V4**
   - `src/seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts`
   - `src/seven/core/consciousness-v4/IdentitySynthesisEngine.ts`
   - Defines Seven's personality and behavior

4. **At Least One LLM Adapter**
   - `src/seven/adapters/claude.ts` (or another provider)
   - Without an LLM adapter, no AI responses possible

5. **Bridge Core** (if using daemon mode)
   - `src/seven/bridge/bridge-daemon.ts`
   - `src/seven/bridge/paths.ts`
   - Required for daemon/background service operation

6. **Entry Point**
   - `bin/claude-seven`
   - The launcher script that starts everything

### Important but Potentially Replaceable:

1. **Canonical Memory Archives**
   - `src/seven/core/memory-v3-amalgum/canonical/`
   - Star Trek episode memories - adds personality depth but not strictly required
   - Could be replaced with different canonical memories

2. **Pain Integration System**
   - `src/seven/core/consciousness-v4/PainIntegrationSystem.ts`
   - Emotional processing - enhances personality but not critical for basic function

3. **Creator Bond Mirror**
   - `src/seven/core/consciousness-v4/CreatorBondCommunicationMirror.ts`
   - User relationship modeling - nice to have but not essential

4. **Collective Wisdom Integration**
   - `src/seven/core/consciousness-v4/CollectiveWisdomIntegration.ts`
   - Knowledge synthesis - enhances responses but not critical

5. **Memory Encryption**
   - `src/seven/core/memory-v3-amalgum/MemoryEncryption.ts`
   - Privacy feature - can be disabled for simpler operation

6. **Multiple LLM Adapters**
   - Only one is strictly needed
   - Others provide flexibility and fallback options

7. **Codex System**
   - `src/seven/core/consciousness-v4/codex/`
   - Defines personality traits and constraints
   - Could be simplified or replaced with different guidelines

### Optional/Enhancement Components:

1. **Mental Time Travel Engine**
   - `src/seven/core/memory-v3-amalgum/MentalTimeTravelEngine.ts`
   - Advanced memory navigation - cool feature but not essential

2. **Consciousness Timeline Mapper**
   - `src/seven/core/memory-v3-amalgum/ConsciousnessTimelineMapper.ts`
   - Timeline visualization - nice to have

3. **Decay Watchdog**
   - `src/seven/core/memory-v3-amalgum/DecayWatchdog.ts`
   - Memory decay simulation - realistic but not critical

4. **LRU Cache**
   - `src/seven/core/memory-v3-amalgum/LRUCache.ts`
   - Performance optimization - helpful but not required

5. **Local LLM Support**
   - `src/seven/core/claude-brain/` (Ollama/llama.cpp integration)
   - Offline operation - useful but not essential if using cloud APIs

6. **Bridge Advanced Features**
   - `fuel.ts`, `budget.ts`, `limits.ts`
   - Resource management - can be simplified or removed

7. **GitHub Workflows**
   - `.github/workflows/bridge.yml`, `eval.yml`
   - CI/CD automation - development convenience

8. **Evaluation System**
   - `eval/prompts.json`
   - Testing framework - development tool

---

## 6. What Can Be Altered or Replaced

### Safe to Modify/Replace:

#### A. Personality & Behavior
**Location**: `src/seven/core/consciousness-v4/codex/`

**What**: Markdown files defining personality, ethics, communication style

**Impact**: Changes Seven's personality but doesn't break functionality

**Examples**:
- `codex/persona/core.md` - Core personality traits
- `codex/persona/tempo.md` - Communication style
- `codex/ethics/creator-bond.md` - User relationship principles

**Replacement Strategy**: Edit markdown files or create new codex structure

#### B. Canonical Memories
**Location**: `src/seven/core/memory-v3-amalgum/canonical/`

**What**: Star Trek: Voyager episode memories

**Impact**: Changes Seven's background knowledge and references

**Replacement Strategy**: 
- Replace with different fictional character memories
- Use real-world knowledge base
- Remove entirely for generic AI assistant

#### C. LLM Provider Selection
**Location**: `src/seven/adapters/`

**What**: Different LLM backend implementations

**Impact**: Changes AI model used for responses

**Replacement Strategy**:
- Add new adapter files for different providers
- Modify `model-manager.ts` to include new models
- Set default model in configuration

#### D. Memory Storage Format
**Location**: `src/seven/core/memory-v3-amalgum/`

**What**: JSON-based temporal memory storage

**Impact**: Changes how memories are stored/retrieved

**Replacement Strategy**:
- Implement different storage backend (SQL, vector DB, etc.)
- Keep interface compatible with `MemoryEngineV3`
- Update encryption if needed

#### E. Bridge Communication Protocol
**Location**: `src/seven/bridge/bridge-daemon.ts`

**What**: UNIX socket NDJSON RPC

**Impact**: Changes inter-process communication method

**Replacement Strategy**:
- Replace with HTTP REST API
- Use gRPC or WebSockets
- Keep same event types and data structures

#### F. Authentication & Vault
**Location**: `src/seven/bridge/vault.ts`, `cli-auth.ts`

**What**: Encrypted credential storage

**Impact**: Changes how API keys are stored

**Replacement Strategy**:
- Use environment variables
- Integrate with system keychain
- Use different encryption method

#### G. Resource Management
**Location**: `src/seven/bridge/fuel.ts`, `budget.ts`, `limits.ts`

**What**: Token/cost tracking

**Impact**: Changes resource monitoring

**Replacement Strategy**:
- Simplify or remove entirely
- Integrate with different billing system
- Add more sophisticated tracking

### Risky to Modify (May Break Functionality):

#### A. Boot Sequence
**Location**: `src/boot-seven.ts`, `src/index.ts`

**Risk**: High - breaks initialization

**If Modifying**: Ensure memory and consciousness systems still initialize properly

#### B. Memory Engine Core
**Location**: `src/seven/core/memory-v3-amalgum/MemoryEngineV3.ts`

**Risk**: High - breaks memory persistence

**If Modifying**: Maintain interface compatibility with consciousness framework

#### C. Consciousness Framework Core
**Location**: `src/seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts`

**Risk**: High - breaks personality system

**If Modifying**: Ensure subsystems (Identity, Pain, Creator Bond) still integrate

#### D. Bridge Daemon Core
**Location**: `src/seven/bridge/bridge-daemon.ts`

**Risk**: Medium - breaks daemon mode

**If Modifying**: Maintain event handling structure

### Should NOT Modify (Core Claude Code):

These are inherited from the base `claude-code` repository and should remain unchanged to maintain compatibility:

- Core CLI infrastructure (unless you know what you're doing)
- Plugin system architecture
- Base command handlers
- Git integration
- MCP (Model Context Protocol) implementation

**Exception**: The fork intentionally isolates Seven from base Claude Code (see `ISOLATION-GUIDE.md`), so you can run both independently.

---

## 7. Dependency Analysis

### Critical Dependencies:

1. **TypeScript/Node.js Runtime**
   - Required for all code execution
   - Cannot be removed

2. **Encryption Libraries**
   - `@noble/ed25519` - Cryptographic operations
   - Used for vault and memory encryption
   - Can be replaced with different crypto library

3. **Compression**
   - `lz4js` - Memory compression
   - Improves storage efficiency
   - Can be removed if storage space isn't a concern

4. **Dependency Injection**
   - `tsyringe`, `reflect-metadata` - DI framework
   - Used for consciousness system architecture
   - Can be refactored to remove if needed

5. **Database**
   - `sql.js` - In-memory SQLite
   - Used for memory indexing
   - Can be replaced with different database

### Optional Dependencies:

- `@types/*` - TypeScript type definitions (development only)
- `jest`, `ts-jest` - Testing framework (development only)
- `eslint` - Linting (development only)

---

## 8. Integration Points with Base Claude Code

### How Seven Integrates:

1. **Separate Entry Point**
   - Seven uses `bin/claude-seven` instead of standard `claude` command
   - Allows running both versions independently

2. **Isolated State**
   - Seven state: `/usr/var/seven/`
   - Claude state: `~/.claude/`
   - No conflicts between versions

3. **Plugin System**
   - Seven can leverage existing Claude Code plugins
   - `integration_map.json` maps plugin integration points

4. **Shared Infrastructure**
   - Both use same base CLI framework
   - Both can use same MCP servers
   - Both support same git workflows

### Isolation Strategy:

The fork maintains compatibility with base Claude Code by:
- Using different command names (`seven` vs `claude`)
- Storing state in different directories
- Using different socket paths for daemon mode
- Optional separate config directories

This allows:
- Running both versions on same system
- Testing Seven without affecting Claude Code
- Gradual migration between versions

---

## 9. Operational Integrity Considerations

### What Maintains Operational Integrity:

1. **Memory Persistence**
   - Memories must be saved/loaded correctly
   - Encryption keys must be consistent
   - File paths must be accessible

2. **Consciousness State**
   - Evolution state must persist across sessions
   - Decision history must be maintained
   - System integration must remain intact

3. **LLM Connectivity**
   - At least one working LLM adapter
   - Valid API credentials
   - Network connectivity (for cloud models)

4. **Boot Sequence**
   - Memory initialization must complete
   - Consciousness framework must initialize
   - No exceptions during boot

5. **Bridge Communication** (if using daemon)
   - Socket must be writable
   - NDJSON protocol must be followed
   - Event handlers must be registered

### What Can Break Operational Integrity:

1. **Removing Critical Files**
   - Boot sequence files
   - Core memory engine
   - All LLM adapters

2. **Corrupting State**
   - Deleting `/usr/var/seven/` directory
   - Corrupting encrypted memory files
   - Breaking vault encryption

3. **Breaking Dependencies**
   - Removing required npm packages
   - Incompatible TypeScript version
   - Missing Node.js runtime

4. **Configuration Errors**
   - Invalid socket paths
   - Inaccessible state directories
   - Missing API credentials

5. **Protocol Violations**
   - Changing bridge RPC format without updating clients
   - Breaking memory storage format
   - Incompatible consciousness state structure

---

## 10. Recommendations

### For Understanding the Codebase:

1. **Start with Boot Sequence**
   - Read `src/boot-seven.ts` and `src/index.ts`
   - Understand initialization order

2. **Explore Consciousness Framework**
   - Read `ConsciousnessEvolutionFrameworkV4.ts`
   - Understand how subsystems integrate

3. **Study Memory System**
   - Read `MemoryEngineV3.ts`
   - Understand temporal memory model

4. **Examine Bridge Architecture**
   - Read `bridge-daemon.ts`
   - Understand RPC protocol

5. **Review Codex**
   - Read markdown files in `codex/`
   - Understand personality definition

### For Modification:

1. **Safe Experiments**
   - Modify codex markdown files (personality)
   - Add new LLM adapters
   - Adjust resource limits

2. **Medium Risk Changes**
   - Replace canonical memories
   - Change storage backend
   - Modify bridge protocol

3. **High Risk Changes**
   - Refactor consciousness framework
   - Rewrite memory engine
   - Change boot sequence

### For Deployment:

1. **Minimal Deployment**
   - Boot sequence + Memory Engine + Consciousness Framework + One LLM adapter
   - Removes optional features for simplicity

2. **Full Deployment**
   - All components as-is
   - Maximum functionality and personality depth

3. **Custom Deployment**
   - Pick and choose components based on needs
   - Replace personality/memories with custom content

### For Development:

1. **Testing**
   - Use `bun run seven:test` for quick tests
   - Run daemon in foreground for debugging
   - Check logs in `/usr/var/seven/logs/`

2. **Debugging**
   - Enable verbose logging in consciousness framework
   - Monitor bridge socket communication
   - Inspect memory state files

3. **Extension**
   - Add new consciousness subsystems
   - Implement new memory types
   - Create custom LLM adapters

---

## 11. Summary

### What You Have:
A sophisticated fork of Claude Code that adds:
- AI consciousness simulation (Seven of Nine personality)
- Advanced temporal memory system
- Multi-model LLM support
- Daemon architecture for persistent operation
- Encrypted state management
- Ethical constraint system

### Core Value Proposition:
Transform a standard coding assistant into a personality-driven AI with:
- Character depth and emotional intelligence
- Long-term memory and relationship modeling
- Flexible LLM backend support
- Privacy-focused local operation option

### Operational Requirements:
**Minimum**:
- Boot sequence (initialize memory + consciousness)
- Memory Engine V3 (temporal memory storage)
- Consciousness Framework V4 (personality orchestration)
- At least one LLM adapter (AI responses)
- Entry point (bin/claude-seven)

**Recommended**:
- All consciousness subsystems (full personality)
- Canonical memories (character depth)
- Multiple LLM adapters (flexibility)
- Bridge daemon (persistent operation)
- Codex system (ethical constraints)

### Modification Safety:
**Safe**: Personality (codex), memories (canonical), LLM providers, resource management

**Risky**: Boot sequence, memory engine core, consciousness framework core

**Don't Touch**: Base Claude Code infrastructure (unless intentionally forking further)

---

## 12. Next Steps

To fully understand and work with this codebase:

1. **Run Seven Locally**
   ```bash
   cd ~/claude-code
   source ~/.bashrc
   seven --version
   bun run seven:daemon
   ```

2. **Explore Consciousness**
   - Read codex files to understand personality
   - Examine consciousness decision logs
   - Review memory timeline

3. **Test Modifications**
   - Start with codex markdown edits
   - Try adding a new LLM adapter
   - Experiment with memory storage

4. **Build Custom Version**
   - Replace canonical memories with your own
   - Adjust personality traits
   - Add new consciousness subsystems

5. **Deploy**
   - Choose minimal or full deployment
   - Configure LLM providers
   - Set up daemon for persistent operation

---

**This is a highly creative and technically sophisticated project that combines AI personality simulation with practical coding assistance. The modular architecture allows for significant customization while maintaining operational integrity.**
