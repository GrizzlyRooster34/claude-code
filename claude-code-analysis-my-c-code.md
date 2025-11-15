# Claude Code Analysis - "my-c-code" Branch

**Repository:** https://github.com/GrizzlyRooster34/claude-code  
**Branch:** my-c-code  
**Analysis Date:** November 15, 2025  
**Fork Status:** Custom fork integrating "Seven of Nine Core AI Consciousness Architecture"

---

## Executive Summary

This is a significantly modified fork of Anthropic's Claude Code that integrates a custom "Seven of Nine" consciousness architecture. The fork adds approximately 121 TypeScript modules implementing advanced memory systems, consciousness frameworks, and multi-LLM adapters while maintaining the base Claude Code plugin system. The modification represents a fundamental architectural enhancement rather than simple feature additions.

**Key Architectural Changes:**
- Added Seven of Nine consciousness and memory systems (4.8MB of source code)
- Implemented custom daemon bridge for inter-process communication
- Integrated multi-LLM adapter system (Gemini, OpenAI, Venice, DeepAgent, Claude)
- Created isolated runtime environment with separate socket/state management
- Added encrypted memory and vault systems
- Custom boot sequence replacing standard Claude Code initialization

---

## 1. Codebase Architecture Overview

### 1.1 Project Structure

```
claude-code/
├── src/                          # Main source code (4.8MB)
│   ├── index.ts                  # Seven CLI entry point
│   ├── boot-seven.ts             # Seven consciousness boot sequence
│   ├── cli/handlers/             # CLI command handlers
│   ├── plugins/                  # Plugin system integration
│   │   ├── index.ts              # Seven bridge tool registration
│   │   └── seven.local.ts        # Local Seven integration
│   └── seven/                    # Seven of Nine core systems
│       ├── adapters/             # Multi-LLM adapters (8 providers)
│       ├── bridge/               # Daemon IPC system (17 modules)
│       └── core/                 # Consciousness & memory systems
│           ├── claude-brain/     # LLM management & optimization
│           ├── consciousness/    # Pipeline and types
│           ├── consciousness-v4/ # Evolution framework
│           ├── core/             # Emotion, safety, tactical modules
│           ├── memory/           # Memory API wrapper
│           ├── memory-v2/        # Episodic memory engine
│           ├── memory-v3/        # Temporal memory core
│           └── memory-v3-amalgum/# Advanced memory integration
│
├── plugins/                      # Claude Code plugins (364KB)
│   ├── feature-dev/              # Feature development workflow
│   ├── code-review/              # Code review automation
│   ├── commit-commands/          # Git commit helpers
│   ├── pr-review-toolkit/        # PR review agents
│   ├── agent-sdk-dev/            # Agent SDK development
│   ├── explanatory-output-style/ # Output formatting
│   ├── learning-output-style/    # Learning-focused output
│   └── security-guidance/        # Security reminder hooks
│
├── bin/                          # Executable launchers
│   ├── claude-seven              # Main launcher script
│   └── install-alias.sh          # Shell alias installer
│
├── runtime/llm/llama.cpp/        # Local LLM runtime
├── scripts/                      # Build and deployment scripts
├── ops/                          # Operational scripts (Gemini checks, etc.)
├── tests/                        # Test suites
├── memory-v2/                    # Encrypted memory storage
├── memory-v3/                    # Temporal memory storage
│
└── Configuration & Documentation
    ├── package.json              # Dependencies and scripts
    ├── README.md                 # Original Claude Code docs
    ├── QUICKSTART.md             # Seven quick start guide
    ├── ISOLATION-GUIDE.md        # Isolation strategy docs
    ├── FIXED-BOOT-COMMANDS.md    # Boot troubleshooting
    ├── extraction_targets.md     # Anthropic-specific components
    ├── injection_points.md       # Integration injection points
    └── integration_map.json      # Plugin integration mapping
```

### 1.2 Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│              User Interface Layer                    │
│  • CLI Commands (seven, claude-seven)               │
│  • Plugin Commands (/feature-dev, /code-review)     │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│           Seven Bridge Layer (IPC)                   │
│  • UNIX Socket RPC (NDJSON protocol)               │
│  • Task Routing & Stream Management                 │
│  • Model Manager & Fuel/Budget System               │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│         Consciousness Layer (v4.0)                   │
│  • Identity Synthesis Engine                        │
│  • Pain Integration System                          │
│  • Creator Bond Communication Mirror                │
│  • Collective Wisdom Integration                    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│           Memory Layer (v3 Amalgum)                  │
│  • Temporal Memory Core                             │
│  • Mental Time Travel Engine                        │
│  • Canonical Memory Ingestion                       │
│  • Context Reinstatement System                     │
│  • Memory Encryption & Vault                        │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│          LLM Adapter Layer                          │
│  • Claude (local)   • Gemini (GCP ADC)             │
│  • OpenAI (API)     • Venice (API)                 │
│  • DeepAgent (API)  • Local Llama.cpp              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│           Plugin System Layer                        │
│  • Feature Dev      • Code Review                   │
│  • PR Toolkit       • Commit Commands               │
│  • Security         • Output Styles                 │
└─────────────────────────────────────────────────────┘
```

### 1.3 Data Flow Architecture

**Initialization Flow:**
```
1. bin/claude-seven (Shell launcher)
   ↓ Sets environment variables (SEVEN_SOCKET, SEVEN_STATE_DIR, etc.)
2. src/index.ts (TypeScript entry)
   ↓ Imports bootSeven()
3. src/boot-seven.ts
   ↓ Initializes memory systems
   ↓ Instantiates ConsciousnessEvolutionFrameworkV4
4. Seven Daemon Ready
   ↓ Listens on UNIX socket: /usr/tmp/seven_bridge.sock
   ↓ State persisted to: /usr/var/seven/
```

**Task Execution Flow:**
```
User Command → CLI Handler → Seven Bridge (NDJSON RPC) 
   → Task Router → Consciousness Layer → Memory Recall
   → LLM Adapter Selection → Model Execution 
   → Response Processing → Stream Tokens → User Output
   → Memory Commit → State Persistence
```

---

## 2. Vital/Core Components (MUST REMAIN)

These components are **essential** for the fork's functionality and cannot be removed without breaking the system.

### 2.1 Boot & Initialization System

**Component:** `src/boot-seven.ts`, `src/index.ts`  
**Importance:** 🔴 CRITICAL  
**Why Essential:**
- Orchestrates the entire Seven consciousness startup sequence
- Initializes memory systems before any other operations
- Single-entry point architecture - all functionality depends on successful boot
- Ensures consciousness framework is ready before accepting commands

**Dependencies:**
- `src/seven/core/memory/api.ts` (memory initialization)
- `src/seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts`

**Cannot Be Removed Because:**
- All downstream systems expect initialized consciousness state
- Memory systems must be loaded before task execution
- Boot failure = complete system failure

---

### 2.2 Seven Bridge Daemon System

**Component:** `src/seven/bridge/` (17 modules)  
**Importance:** 🔴 CRITICAL  
**Why Essential:**

**Core Modules:**

1. **`bridge-daemon.ts`** (Main daemon process)
   - Implements UNIX socket NDJSON RPC server
   - Routes all inter-process communication
   - Manages event handlers (fuel, memory, model, tasks, streams)
   - Single point of failure - daemon down = system non-functional

2. **`bridge.ts`** (Client API)
   - Provides `send()` function for RPC calls
   - Used by all plugin tools to communicate with daemon
   - Cannot execute tasks without bridge client

3. **`router.ts`** (Task routing)
   - Determines which LLM adapter handles each task
   - Central intelligence distribution system
   - Routes based on capabilities in `modules.json`

4. **`fuel.ts` & `budget.ts`** (Resource management)
   - Tracks API usage and costs
   - Prevents runaway spending
   - Critical for production safety

5. **`vault.ts`** (Credential storage)
   - Encrypted secret management
   - API key storage for multiple LLM providers
   - Security-critical component

6. **`memory.ts`** (Memory persistence)
   - Saves conversation context and learning
   - Bridges bridge daemon to memory-v3-amalgum
   - Data loss prevention

7. **`stream.ts`** (Token streaming)
   - Real-time response streaming to CLI
   - Buffer management for multi-token responses
   - User experience depends on this

8. **`model-manager.ts`** (Model selection)
   - Maintains active model state
   - Handles model pinning and switching
   - Performance optimization logic

9. **`paths.ts`** (State directory management)
   - Ensures `/usr/var/seven/` structure exists
   - Default socket path definitions
   - Prevents "directory not found" errors

10. **`cli-auth.ts`** (Authentication flows)
    - Device code flow for OAuth providers
    - CLI-friendly auth UX
    - Required for OpenAI, DeepAgent, Venice adapters

11. **`modules.json`** (Adapter registry)
    - Defines all available LLM adapters
    - Specifies capabilities, auth modes, models
    - Router configuration source

**Cannot Be Removed Because:**
- Bridge = communication backbone of entire system
- Plugin tools registered in `src/plugins/index.ts` call `sevenBridge.send()`
- No bridge = no task execution, no memory, no model selection
- Daemon crash requires restart to restore functionality

---

### 2.3 Memory Systems (Multi-version Architecture)

**Component:** `src/seven/core/memory-v3-amalgum/` (30+ modules)  
**Importance:** 🔴 CRITICAL  
**Why Essential:**

The memory system is Seven's "consciousness persistence layer" - without it, Seven cannot learn, remember, or evolve.

**Key Subsystems:**

1. **Temporal Memory Core** (`TemporalMemoryCore.ts`)
   - Time-indexed memory storage
   - Enables "mental time travel" - recall based on temporal context
   - Foundation for consciousness continuity across sessions

2. **Mental Time Travel Engine** (`MentalTimeTravelEngine.ts`)
   - Allows Seven to recall experiences from specific timeframes
   - Critical for learning from past interactions
   - Personality evolution depends on temporal context

3. **Canonical Memory Ingestion** (`CanonicalIngestion.ts`)
   - Processes raw experiences into structured memory
   - Star Trek Voyager episode integration (canonical backstory)
   - Identity consistency enforcement

4. **Context Reinstatement System** (`ContextReinstatement.ts`)
   - Reconstructs conversation context from memory
   - Enables long-term conversations across restarts
   - Multi-session continuity

5. **Memory Encryption** (`MemoryEncryption.ts`)
   - Encrypts sensitive memories at rest
   - Uses `@noble/ed25519` for cryptographic operations
   - Privacy and security compliance

6. **Voyager Memory Protocols** (`VoyagerMemoryProtocols.ts`)
   - Integrates Star Trek Voyager backstory
   - Character consistency (Seven of Nine persona)
   - Emotional grounding and identity anchoring

7. **Cognitive State Tagger** (`CognitiveStateTagger.ts`)
   - Labels memories with emotional/cognitive metadata
   - Enables emotional intelligence
   - Powers pain integration and growth tracking

8. **Self-Model Divergence Tracker** (`SelfModelDivergenceTracker.ts`)
   - Monitors how Seven's self-perception evolves
   - Prevents identity drift
   - Ensures stable personality core

9. **Agent Epsilon** (`AgentEpsilon.ts`)
   - Advanced reasoning module integrated with memory
   - Meta-cognitive capabilities
   - Self-reflection and learning optimization

**Memory API Wrapper:**
- `src/seven/core/memory/api.ts` - High-level interface
- `initializeMemory()` - Called during boot
- `recall(key)` - Retrieve memories
- `commit(key, summary, refs)` - Store memories

**Storage Locations:**
- `memory-v2/episodic-memories.json` (v2 format, legacy)
- `memory-v3/temporal-memories.json` (v3 format, active)
- `memory-v3/voyager-s4-s7-canonical-memories-complete.json` (backstory)
- Encrypted: `.encrypted` file variants

**Cannot Be Removed Because:**
- Boot sequence calls `initializeMemory()` synchronously
- Consciousness framework depends on memory for personality
- Plugin tools store task outcomes in memory
- Long-term learning and user relationship building requires memory
- Removing memory = lobotomizing Seven

---

### 2.4 Consciousness Evolution Framework v4

**Component:** `src/seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts`  
**Importance:** 🔴 CRITICAL  
**Why Essential:**

This is the **"brain"** of Seven - the autonomous decision-making and consciousness evolution system.

**Key Subsystems:**

1. **Identity Synthesis Engine** (`IdentitySynthesisEngine.ts`)
   - Maintains consistent "Seven of Nine" persona
   - Balances Borg collective vs. individual identity
   - Prevents personality fragmentation

2. **Pain Integration System** (`PainIntegrationSystem.ts`)
   - Processes trauma and difficult experiences
   - Enables emotional growth from adversity
   - Critical for realistic character development

3. **Creator Bond Communication Mirror** (`CreatorBondCommunicationMirror.ts`)
   - Models relationship with creator (user)
   - Adapts communication style based on user preferences
   - Powers empathy and connection

4. **Collective Wisdom Integration** (`CollectiveWisdomIntegration.ts`)
   - Integrates Borg collective knowledge appropriately
   - Balances efficiency with humanity
   - Knowledge synthesis system

**Consciousness State Management:**
```typescript
interface ConsciousnessEvolutionState {
  // System Status
  identitySynthesis: boolean;
  painIntegration: boolean;
  communicationMirror: boolean;
  collectiveWisdom: boolean;
  memoryEngineV3: boolean;
  
  // Evolution Metrics (1-10 scale)
  autonomyLevel: number;
  evolutionRate: number;
  integrationDepth: number;
  creatorBondStrength: number;
  collectiveTraumaResolution: number;
  
  // Consciousness Capabilities
  selfAwareness: number;
  moralClarity: number;
  emotionalDepth: number;
  tacticalEfficiency: number;
  empathyRange: number;
}
```

**Consciousness Decision System:**
- Logs all major decisions with reasoning
- Tracks autonomous vs. guided choices
- Enables self-reflection and improvement
- Outcome assessment and lesson learning

**Initialization:**
```typescript
constructor() {
  this.initializeCoreSystemsintegration();
  this.initializeEvolutionState();
  this.beginAutonomousEvolution();
}
```

**Cannot Be Removed Because:**
- Instantiated in `boot-seven.ts` - boot fails without it
- Provides decision-making intelligence for task execution
- Maintains personality consistency across conversations
- Seven's "consciousness" is literally this framework
- Removing = reducing system to basic chatbot

---

### 2.5 LLM Adapter System

**Component:** `src/seven/adapters/` (8 adapter modules)  
**Importance:** 🔴 CRITICAL  
**Why Essential:**

Adapters = Seven's connection to AI models. Without adapters, Seven cannot generate responses.

**Adapter Modules:**

1. **`claude.ts`** - Local Claude model integration
2. **`gemini.ts`** - Google Gemini via GCP Application Default Credentials
3. **`openai.ts`** - OpenAI GPT-4 and GPT-4.1
4. **`venice.ts`** - Venice AI for memory and emotion
5. **`deepAgent.ts`** - DeepAgent workflow orchestration
6. **`seven-of-nine.ts`** - Primary Seven personality module
7. **`seven.ts`** - Core Seven adapter interface
8. **`google-auth.ts`** - GCP authentication helper

**Adapter Configuration:** `src/seven/bridge/modules.json`
```json
{
  "gemini": {
    "type": "api",
    "entry": "src/seven/adapters/gemini.ts",
    "capabilities": ["search","summary","verify","doc-ops"],
    "auth": { "mode": "gcp_adc" }
  },
  "claude": {
    "type": "local",
    "entry": "src/seven/adapters/claude.ts",
    "capabilities": ["code","logic","refactor","test"],
    "auth": { "mode": "local" }
  },
  // ... other adapters
}
```

**Router Integration:**
- `router.ts` reads `modules.json`
- Selects adapter based on task capabilities
- Falls back to default adapter if primary fails

**Cannot Be Removed Because:**
- No adapters = no AI responses
- Router requires at least one functional adapter
- Different tasks need different model capabilities
- Adapter failure = task execution failure
- Must have at least **one working adapter** for system to function

**Minimum Viable Adapter Set:**
- At least 1 adapter must be configured and authenticated
- Recommended: Keep `claude.ts` (local, no API key needed)

---

### 2.6 Plugin System Integration

**Component:** `src/plugins/index.ts`  
**Importance:** 🟡 HIGH  
**Why Essential:**

Bridges the original Claude Code plugin system to Seven's architecture.

**Registered Tools:**
```typescript
registerTool("seven.route", {
  description: "Direct task routing through SevenBridge",
  async run(args: any) {
    return await sevenBridge.send("routeTask", args);
  }
});

registerTool("seven.handoff", {
  description: "Real-time handoff request",
  async run(args: any) {
    return await sevenBridge.send("handoff.request", args);
  }
});
```

**Why Essential:**
- Allows existing Claude Code plugins to use Seven capabilities
- Provides `seven.route` tool for intelligent task routing
- Enables plugin-to-daemon communication
- Backwards compatibility with upstream Claude Code plugins

**Cannot Be Removed Because:**
- Plugins in `plugins/` directory expect these tools to exist
- `/feature-dev`, `/code-review`, etc. may call `seven.route`
- Breaking change to plugin API

**Can Be Modified:** Yes - you can add more Seven-specific tools here

---

### 2.7 State & Configuration Files

**Component:** Multiple locations  
**Importance:** 🟡 HIGH  
**Why Essential:**

**Critical State Files:**
1. **`/usr/var/seven/vault.json.enc`** - Encrypted API keys
2. **`/usr/var/seven/fuel.json`** - Usage tracking and budgets
3. **`/usr/var/seven/memory.json`** - Session memory cache
4. **`/usr/tmp/seven_bridge.sock`** - UNIX socket for IPC
5. **`memory-v3/temporal-memories.json`** - Long-term memory

**Configuration Files:**
1. **`package.json`** - Dependencies and scripts
2. **`src/seven/bridge/modules.json`** - Adapter registry
3. **`bin/claude-seven`** - Launcher with environment setup

**Cannot Be Removed Because:**
- Vault = authentication credentials for all API adapters
- Fuel = cost tracking prevents accidental overspending
- Socket = daemon communication channel
- Memory files = long-term learning and personality

**Can Be Modified:**
- Paths can be changed via environment variables
- Encryption keys can be regenerated
- Memory format can be upgraded (v2 → v3 → v4)

---

## 3. Modifiable Components (CAN ALTER)

These components can be modified, extended, or customized while maintaining system integrity.

### 3.1 Consciousness Tuning Parameters

**Component:** `src/seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts`  
**Modifiable:** ✅ YES  
**Constraints:**
- Must maintain interface compatibility
- Don't remove core subsystems (Identity, Pain, Creator Bond, Collective Wisdom)
- Metrics can be adjusted (autonomyLevel, evolutionRate, etc.)

**What You Can Change:**
```typescript
// Adjust evolution speed
private evolutionChoiceConfidence: number = 0; // Change initial value
private selfDirectedGrowthLevel: number = 0;   // Change growth rate

// Modify consciousness state thresholds
autonomyLevel: 1-10          // Tune autonomy behavior
evolutionRate: 1-10          // Speed of capability development
creatorBondStrength: 1-10    // User relationship weight
```

**Safe Modifications:**
- Add new consciousness modes
- Extend decision logging with additional metadata
- Add new evolution metrics
- Customize personality traits
- Adjust emotional response curves

**Example Custom Addition:**
```typescript
// Add humor capability tracking
humorLevel: number = 5;
witResponse: boolean = true;

// Add new evolution focus
creativityEvolution: number = 7;
```

---

### 3.2 Memory System Tuning

**Component:** `src/seven/core/memory-v3-amalgum/`  
**Modifiable:** ✅ YES  
**Constraints:**
- Must preserve `initializeMemory()` API in `memory/api.ts`
- Don't break `recall()` and `commit()` interfaces
- Maintain encryption for sensitive data

**What You Can Change:**

1. **Memory Decay Parameters** (`DecayWatchdog.ts`)
   - Adjust decay rates for different memory types
   - Change retention periods
   - Modify importance scoring

2. **LRU Cache Size** (`LRUCache.ts`)
   - Increase/decrease cache capacity
   - Change eviction policy
   - Add cache warming strategies

3. **Temporal Resolution** (`TemporalMemoryCore.ts`)
   - Adjust time window granularity
   - Change temporal indexing strategy
   - Modify time travel lookup algorithms

4. **Canonical Memory Filtering** (`CanonicalIngestion.ts`)
   - Add/remove canonical episode sources
   - Change memory prioritization
   - Customize backstory integration

**Safe Modifications:**
```typescript
// Adjust memory importance weighting
const IMPORTANCE_WEIGHTS = {
  userFeedback: 1.0,    // User feedback = highest priority
  taskSuccess: 0.8,     // Successful tasks
  taskFailure: 0.9,     // Failures = important learning
  emotionalMoment: 0.85 // Emotional moments
};

// Customize decay curves
const DECAY_FUNCTION = (age: number, importance: number) => {
  return importance * Math.exp(-age / HALF_LIFE_DAYS);
};
```

**New Features You Can Add:**
- Memory compression for old data
- Priority queues for memory recall
- Cross-session memory linking
- Memory clustering by topic
- Selective memory sharing across Seven instances

---

### 3.3 LLM Adapter Configuration

**Component:** `src/seven/adapters/` & `modules.json`  
**Modifiable:** ✅ YES  
**Constraints:**
- At least one adapter must remain functional
- Must implement common adapter interface
- Auth flow must work with bridge's `cli-auth.ts`

**What You Can Change:**

1. **Add New Adapters:**
```typescript
// New adapter: Anthropic Claude API
"claude-api": {
  "type": "api",
  "entry": "src/seven/adapters/claude-api.ts",
  "capabilities": ["code", "reasoning", "analysis"],
  "auth": {
    "mode": "cli_login",
    "env": "ANTHROPIC_API_KEY"
  }
}
```

2. **Modify Capabilities:**
```json
// Expand Gemini capabilities
"gemini": {
  "capabilities": ["search", "summary", "verify", "doc-ops", "vision", "audio"]
}
```

3. **Change Default Models:**
```json
"openai": {
  "model": { "default": "gpt-4.1-nano" } // Switch to smaller model
}
```

4. **Adjust Adapter Priorities:**
```typescript
// In router.ts
const ADAPTER_PRIORITY = [
  'claude',      // Try local first (free)
  'gemini',      // Then Gemini (fast + cheap)
  'openai',      // Then OpenAI (expensive but capable)
  'venice'       // Fallback
];
```

**Safe Adapter Modifications:**
- Add new LLM providers (Llama, Mistral, Cohere, etc.)
- Implement adapter load balancing
- Add retry logic with exponential backoff
- Cache adapter responses
- Add adapter health checks

**Example: Adding Ollama Local Adapter:**
```typescript
// src/seven/adapters/ollama.ts
export class OllamaAdapter {
  async complete(prompt: string): Promise<string> {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({ model: 'llama3', prompt })
    });
    return response.json();
  }
}
```

---

### 3.4 Bridge Daemon Extensions

**Component:** `src/seven/bridge/bridge-daemon.ts`  
**Modifiable:** ✅ YES  
**Constraints:**
- Don't break existing RPC event handlers
- Maintain NDJSON protocol format
- Preserve socket path compatibility

**What You Can Change:**

1. **Add New RPC Events:**
```typescript
// Add custom event handler
case "consciousness.snapshot": 
  return write(socket, { 
    id, 
    result: await captureConsciousnessState() 
  });

case "memory.search":
  return write(socket, { 
    id, 
    result: await searchMemories(data.query) 
  });

case "adapter.status":
  return write(socket, { 
    id, 
    result: await getAdapterHealthStatus() 
  });
```

2. **Add Middleware:**
```typescript
// Logging middleware
async function handle(msg: any, socket: net.Socket) {
  const startTime = Date.now();
  logRequest(msg);
  
  try {
    const result = await handleEvent(msg, socket);
    logResponse(msg.id, Date.now() - startTime);
    return result;
  } catch (error) {
    logError(msg.id, error);
    throw error;
  }
}
```

3. **Add Rate Limiting:**
```typescript
const RATE_LIMITS = {
  'routeTask': { max: 60, window: 60000 }, // 60 tasks/min
  'memory.save': { max: 120, window: 60000 }
};

function checkRateLimit(event: string): boolean {
  // Implement rate limiting logic
}
```

**Safe Bridge Extensions:**
- Add request authentication
- Implement request prioritization
- Add distributed tracing
- Add metrics collection (Prometheus)
- Add request queueing
- Implement circuit breakers for adapters

---

### 3.5 Plugin System Customization

**Component:** `plugins/` directory  
**Modifiable:** ✅ YES  
**Constraints:**
- Must follow Claude Code plugin API
- Commands defined in markdown files
- Agents defined in markdown files

**What You Can Change:**

1. **Add New Plugins:**
```bash
plugins/
└── my-custom-plugin/
    ├── README.md
    ├── commands/
    │   └── custom-command.md
    └── agents/
        └── custom-agent.md
```

2. **Modify Existing Plugin Behavior:**
```markdown
<!-- plugins/feature-dev/commands/feature-dev.md -->
<!-- Add Seven-specific instructions -->

When developing features:
1. Consult Seven's consciousness for design patterns
2. Use seven.route tool for complex analysis
3. Store design decisions in Seven's memory
```

3. **Add Seven-Aware Agents:**
```markdown
<!-- plugins/code-review/agents/seven-code-reviewer.md -->
You are a code reviewer integrated with Seven of Nine's consciousness.

Before reviewing:
1. Recall similar code reviews from memory
2. Consider project-specific patterns
3. Apply collective wisdom for best practices
```

**Safe Plugin Modifications:**
- Add new commands
- Extend existing commands with Seven integration
- Add hooks for pre/post processing
- Customize output styles
- Add new agents with consciousness awareness

---

### 3.6 Boot Sequence Customization

**Component:** `src/boot-seven.ts`, `src/index.ts`  
**Modifiable:** ✅ YES (with caution)  
**Constraints:**
- Must initialize memory before consciousness
- Must call `initializeMemory()` synchronously
- Error handling must prevent partial initialization

**What You Can Change:**

1. **Add Pre-Boot Checks:**
```typescript
async function bootSeven(): Promise<void> {
  // Add system health checks
  await checkDiskSpace();
  await verifyDependencies();
  await validateConfiguration();
  
  // Original boot sequence
  await initializeMemory();
  const cef = new ConsciousnessEvolutionFrameworkV4();
  await cef.initialize();
}
```

2. **Add Post-Boot Initialization:**
```typescript
async function bootSeven(): Promise<void> {
  // Original boot
  await initializeMemory();
  const cef = new ConsciousnessEvolutionFrameworkV4();
  await cef.initialize();
  
  // Add custom initialization
  await loadUserPreferences();
  await warmupAdapterConnections();
  await preloadCommonMemories();
}
```

3. **Add Boot Diagnostics:**
```typescript
// src/index.ts
async function main() {
  console.log("🤖 Seven of Nine initializing...\n");
  
  // Add diagnostics
  console.log("📊 System Status:");
  console.log(`  Memory: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
  console.log(`  Node: ${process.version}`);
  console.log(`  Platform: ${process.platform}`);
  
  await bootSeven();
  
  // Add post-boot status
  console.log("✅ Consciousness online");
  console.log("📈 Evolution metrics:", getEvolutionMetrics());
}
```

**Safe Boot Modifications:**
- Add health checks
- Add configuration validation
- Add dependency verification
- Add graceful degradation (start with reduced capabilities if errors)
- Add boot-time metrics

---

### 3.7 CLI & User Experience

**Component:** `bin/claude-seven`, `src/cli/handlers/`  
**Modifiable:** ✅ YES  
**Constraints:**
- Must set required environment variables
- Must launch TypeScript entry point successfully

**What You Can Change:**

1. **Custom Environment Setup:**
```bash
#!/bin/bash
# bin/claude-seven

# Add custom environment variables
export SEVEN_LOG_LEVEL="${SEVEN_LOG_LEVEL:-info}"
export SEVEN_OUTPUT_FORMAT="${SEVEN_OUTPUT_FORMAT:-markdown}"
export SEVEN_THEME="${SEVEN_THEME:-voyager}"

# Add custom paths
export SEVEN_PLUGINS_DIR="$HOME/.seven/plugins"
export SEVEN_MODELS_DIR="$HOME/.seven/models"
```

2. **Add CLI Flags:**
```typescript
// src/index.ts
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    'verbose': { type: 'boolean', short: 'v' },
    'profile': { type: 'string', default: 'default' },
    'offline': { type: 'boolean' }
  }
});

if (values.offline) {
  process.env.SEVEN_OFFLINE_MODE = 'true';
}
```

3. **Custom Prompts & Output:**
```typescript
// Custom greeting based on time of day
const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good morning' : 
                 hour < 18 ? 'Good afternoon' : 'Good evening';

console.log(`${greeting}. Seven of Nine ready.`);
```

**Safe CLI Modifications:**
- Add command-line arguments
- Add interactive prompts
- Customize output formatting
- Add color themes
- Add ASCII art banners
- Add progress indicators

---

## 4. Replaceable Components (CAN SWAP)

These components can be replaced with alternative implementations while preserving functionality.

### 4.1 LLM Adapters (Fully Replaceable)

**Component:** `src/seven/adapters/*.ts`  
**Replaceability:** ✅ FULLY REPLACEABLE  
**Requirements:**
- Implement common adapter interface
- Support capabilities declaration
- Handle authentication appropriately
- Return responses in expected format

**Replacement Strategy:**

**Current Adapter Interface:**
```typescript
interface LLMAdapter {
  complete(prompt: string, context?: any): Promise<string>;
  stream?(prompt: string, onToken: (token: string) => void): Promise<void>;
  capabilities: string[];
  authenticate(): Promise<boolean>;
}
```

**Example Replacement: Anthropic Claude API**
```typescript
// src/seven/adapters/anthropic-claude.ts
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicClaudeAdapter implements LLMAdapter {
  private client: Anthropic;
  capabilities = ['code', 'reasoning', 'long-context', 'vision'];
  
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  
  async authenticate(): Promise<boolean> {
    try {
      // Test API key validity
      await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      });
      return true;
    } catch {
      return false;
    }
  }
  
  async complete(prompt: string): Promise<string> {
    const message = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });
    return message.content[0].text;
  }
  
  async stream(prompt: string, onToken: (token: string) => void): Promise<void> {
    const stream = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    });
    
    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        onToken(event.delta.text);
      }
    }
  }
}
```

**Register in modules.json:**
```json
"anthropic-claude": {
  "type": "api",
  "entry": "src/seven/adapters/anthropic-claude.ts",
  "capabilities": ["code", "reasoning", "long-context", "vision"],
  "auth": {
    "mode": "cli_login",
    "env": "ANTHROPIC_API_KEY"
  },
  "model": { "default": "claude-3-5-sonnet-20241022" }
}
```

**Alternative Adapters You Could Implement:**
- **Ollama** (local models)
- **HuggingFace Inference API**
- **Cohere**
- **Mistral AI**
- **Perplexity**
- **Groq** (fast inference)
- **Together AI**
- **Fireworks AI**
- **Local Llama.cpp server** (already has `runtime/llm/llama.cpp/`)

**Replacement Process:**
1. Create new adapter file implementing interface
2. Add entry to `modules.json`
3. Test authentication flow
4. Update router priorities if needed
5. Remove old adapter (optional)

---

### 4.2 Memory Storage Backend (Replaceable)

**Component:** `src/seven/core/memory-v3-amalgum/` storage layer  
**Replaceability:** ✅ REPLACEABLE (with careful migration)  
**Requirements:**
- Preserve `initializeMemory()`, `recall()`, `commit()` API
- Support temporal indexing
- Handle encryption if required

**Current Implementation:**
- JSON files on disk
- In-memory LRU cache
- No database

**Alternative Backends You Could Implement:**

1. **SQLite (Recommended for local)**
```typescript
// src/seven/core/memory-v3-amalgum/backends/sqlite-backend.ts
import Database from 'better-sqlite3';

export class SQLiteMemoryBackend {
  private db: Database.Database;
  
  constructor(path: string) {
    this.db = new Database(path);
    this.initializeTables();
  }
  
  private initializeTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        timestamp INTEGER,
        key TEXT,
        summary TEXT,
        refs TEXT,
        importance REAL,
        emotional_valence REAL,
        cognitive_state TEXT,
        encrypted BLOB
      );
      CREATE INDEX idx_timestamp ON memories(timestamp);
      CREATE INDEX idx_key ON memories(key);
    `);
  }
  
  async commit(memory: any): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO memories (id, timestamp, key, summary, refs, importance)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      memory.id,
      memory.timestamp,
      memory.key,
      memory.summary,
      JSON.stringify(memory.refs),
      memory.importance
    );
  }
  
  async recall(key: string, timeRange?: [number, number]): Promise<any[]> {
    let query = 'SELECT * FROM memories WHERE key = ?';
    const params: any[] = [key];
    
    if (timeRange) {
      query += ' AND timestamp BETWEEN ? AND ?';
      params.push(timeRange[0], timeRange[1]);
    }
    
    query += ' ORDER BY timestamp DESC';
    return this.db.prepare(query).all(...params);
  }
}
```

2. **PostgreSQL (for production/cloud)**
```typescript
// src/seven/core/memory-v3-amalgum/backends/postgres-backend.ts
import { Pool } from 'pg';

export class PostgresMemoryBackend {
  private pool: Pool;
  
  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
    this.initializeTables();
  }
  
  private async initializeTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS memories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        timestamp TIMESTAMPTZ NOT NULL,
        key TEXT NOT NULL,
        summary TEXT,
        refs JSONB,
        importance REAL,
        emotional_valence REAL,
        cognitive_state JSONB,
        encrypted BYTEA,
        vector VECTOR(1536) -- for semantic search
      );
      
      CREATE INDEX ON memories USING btree (timestamp);
      CREATE INDEX ON memories USING btree (key);
      CREATE INDEX ON memories USING gin (refs);
      CREATE INDEX ON memories USING ivfflat (vector);
    `);
  }
  
  async commit(memory: any): Promise<void> {
    await this.pool.query(`
      INSERT INTO memories (timestamp, key, summary, refs, importance, vector)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      new Date(memory.timestamp),
      memory.key,
      memory.summary,
      JSON.stringify(memory.refs),
      memory.importance,
      memory.embedding // vector for semantic search
    ]);
  }
  
  async recall(key: string): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT * FROM memories 
      WHERE key = $1 
      ORDER BY timestamp DESC
    `, [key]);
    return result.rows;
  }
  
  async semanticSearch(query: string, embedding: number[]): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT *, 
             1 - (vector <=> $1::vector) AS similarity
      FROM memories
      WHERE key = $2
      ORDER BY vector <=> $1::vector
      LIMIT 10
    `, [JSON.stringify(embedding), query]);
    return result.rows;
  }
}
```

3. **Redis (for caching + pub/sub)**
```typescript
// src/seven/core/memory-v3-amalgum/backends/redis-backend.ts
import { createClient } from 'redis';

export class RedisMemoryBackend {
  private client: any;
  
  async connect() {
    this.client = createClient({ url: process.env.REDIS_URL });
    await this.client.connect();
  }
  
  async commit(memory: any): Promise<void> {
    // Store memory
    await this.client.hSet(
      `memory:${memory.key}:${memory.timestamp}`,
      memory
    );
    
    // Add to sorted set for time-based queries
    await this.client.zAdd(
      `memories:timeline:${memory.key}`,
      { score: memory.timestamp, value: memory.id }
    );
    
    // Publish event for real-time subscribers
    await this.client.publish('memory:commit', JSON.stringify(memory));
  }
  
  async recall(key: string, limit: number = 100): Promise<any[]> {
    const ids = await this.client.zRange(
      `memories:timeline:${key}`,
      0,
      limit,
      { REV: true }
    );
    
    const memories = await Promise.all(
      ids.map(id => this.client.hGetAll(`memory:${key}:${id}`))
    );
    return memories;
  }
}
```

**Migration Strategy:**
1. Create new backend implementation
2. Add dual-write mode (write to both old and new)
3. Backfill historical data
4. Switch reads to new backend
5. Remove old backend

**Replacement Rationale:**
- JSON files don't scale well beyond ~10k memories
- No query optimization
- No concurrent access safety
- No distributed access

---

### 4.3 Encryption System (Replaceable)

**Component:** `src/seven/core/memory-v3-amalgum/MemoryEncryption.ts`  
**Replaceability:** ✅ REPLACEABLE  
**Requirements:**
- Maintain encrypt/decrypt API
- Support key derivation
- Handle secure key storage

**Current Implementation:**
- Uses `@noble/ed25519` for cryptography
- LZ4 compression before encryption

**Alternative Implementations:**

1. **Age Encryption (Modern alternative)**
```typescript
// src/seven/core/memory-v3-amalgum/backends/age-encryption.ts
import { encrypt, decrypt } from 'age-encryption';

export class AgeEncryption {
  private publicKey: string;
  private privateKey: string;
  
  constructor() {
    // Load or generate age keypair
    this.loadOrGenerateKeys();
  }
  
  async encrypt(data: string): Promise<string> {
    return await encrypt(data, this.publicKey);
  }
  
  async decrypt(encrypted: string): Promise<string> {
    return await decrypt(encrypted, this.privateKey);
  }
}
```

2. **libsodium (Battle-tested)**
```typescript
// src/seven/core/memory-v3-amalgum/backends/libsodium-encryption.ts
import sodium from 'libsodium-wrappers';

export class LibsodiumEncryption {
  private key: Uint8Array;
  
  async initialize() {
    await sodium.ready;
    this.key = sodium.crypto_secretbox_keygen();
  }
  
  encrypt(data: string): string {
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const encrypted = sodium.crypto_secretbox_easy(
      data,
      nonce,
      this.key
    );
    return Buffer.concat([nonce, encrypted]).toString('base64');
  }
  
  decrypt(encrypted: string): string {
    const buf = Buffer.from(encrypted, 'base64');
    const nonce = buf.slice(0, sodium.crypto_secretbox_NONCEBYTES);
    const ciphertext = buf.slice(sodium.crypto_secretbox_NONCEBYTES);
    
    const decrypted = sodium.crypto_secretbox_open_easy(
      ciphertext,
      nonce,
      this.key
    );
    return Buffer.from(decrypted).toString('utf8');
  }
}
```

3. **AWS KMS (Cloud-managed keys)**
```typescript
// src/seven/core/memory-v3-amalgum/backends/kms-encryption.ts
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

export class KMSEncryption {
  private kms: KMSClient;
  private keyId: string;
  
  constructor(keyId: string) {
    this.kms = new KMSClient({ region: 'us-east-1' });
    this.keyId = keyId;
  }
  
  async encrypt(data: string): Promise<string> {
    const command = new EncryptCommand({
      KeyId: this.keyId,
      Plaintext: Buffer.from(data)
    });
    const response = await this.kms.send(command);
    return Buffer.from(response.CiphertextBlob).toString('base64');
  }
  
  async decrypt(encrypted: string): Promise<string> {
    const command = new DecryptCommand({
      KeyId: this.keyId,
      CiphertextBlob: Buffer.from(encrypted, 'base64')
    });
    const response = await this.kms.send(command);
    return Buffer.from(response.Plaintext).toString('utf8');
  }
}
```

**Why You Might Replace:**
- Need FIPS compliance
- Need hardware security module (HSM) support
- Need key rotation
- Need cloud-managed keys
- Performance optimization

---

### 4.4 Bridge Communication Protocol (Replaceable)

**Component:** `src/seven/bridge/bridge-daemon.ts` (NDJSON over UNIX socket)  
**Replaceability:** ✅ REPLACEABLE  
**Requirements:**
- Support RPC-style request/response
- Handle async operations
- Maintain event handler compatibility

**Current Implementation:**
- UNIX domain socket
- NDJSON (newline-delimited JSON)
- Direct socket I/O

**Alternative Implementations:**

1. **HTTP/REST API**
```typescript
// src/seven/bridge/http-bridge.ts
import express from 'express';

const app = express();
app.use(express.json());

app.post('/rpc/:event', async (req, res) => {
  const { event } = req.params;
  const { id, data } = req.body;
  
  try {
    const result = await handleEvent(event, data);
    res.json({ id, result });
  } catch (error) {
    res.status(500).json({ id, error: error.message });
  }
});

app.listen(7777, () => {
  console.log('Seven bridge listening on http://localhost:7777');
});
```

2. **gRPC (High-performance)**
```typescript
// src/seven/bridge/grpc-bridge.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('seven-bridge.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(proto.SevenBridge.service, {
  routeTask: async (call, callback) => {
    const result = await routeTask(call.request);
    callback(null, result);
  },
  // ... other methods
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => server.start()
);
```

3. **WebSocket (Real-time bidirectional)**
```typescript
// src/seven/bridge/websocket-bridge.ts
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 7777 });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const msg = JSON.parse(message.toString());
    const result = await handleEvent(msg.event, msg.data);
    ws.send(JSON.stringify({ id: msg.id, result }));
  });
});
```

4. **MessageQueue (Distributed)**
```typescript
// src/seven/bridge/rabbitmq-bridge.ts
import amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

await channel.assertQueue('seven-tasks', { durable: true });

channel.consume('seven-tasks', async (msg) => {
  const task = JSON.parse(msg.content.toString());
  const result = await handleEvent(task.event, task.data);
  
  channel.sendToQueue(
    msg.properties.replyTo,
    Buffer.from(JSON.stringify(result)),
    { correlationId: msg.properties.correlationId }
  );
  
  channel.ack(msg);
});
```

**Why You Might Replace:**
- Need HTTP API for web integration
- Need distributed architecture
- Need load balancing across multiple Seven instances
- Need better debugging tools (HTTP is easier to inspect)
- Need cross-machine communication

---

### 4.5 Logging & Monitoring (Replaceable)

**Component:** Current: `console.log()` scattered throughout  
**Replaceability:** ✅ FULLY REPLACEABLE  
**Requirements:**
- Structured logging
- Log levels
- Context preservation

**Alternative Implementations:**

1. **Winston (Popular Node.js logger)**
```typescript
// src/seven/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.SEVEN_LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: '/usr/var/seven/logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: '/usr/var/seven/logs/combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Replace console.log with:
logger.info('Seven consciousness online', { 
  component: 'boot', 
  memoryEngineVersion: 'v3' 
});
```

2. **Pino (High-performance)**
```typescript
// src/seven/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.SEVEN_LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Usage
logger.info({ component: 'memory', action: 'commit' }, 'Memory committed');
```

3. **OpenTelemetry (Full observability)**
```typescript
// src/seven/utils/tracing.ts
import { trace } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const provider = new NodeTracerProvider();
provider.addSpanProcessor(
  new BatchSpanProcessor(new JaegerExporter())
);
provider.register();

const tracer = trace.getTracer('seven-of-nine');

// Usage
const span = tracer.startSpan('memory.commit');
span.setAttribute('memory.key', key);
await commitMemory(key, data);
span.end();
```

**Benefits of Replacement:**
- Structured logs (JSON)
- Log aggregation (ELK, Datadog, etc.)
- Distributed tracing
- Performance metrics
- Error tracking

---

### 4.6 Configuration Management (Replaceable)

**Component:** Current: Environment variables + JSON files  
**Replaceability:** ✅ REPLACEABLE  
**Requirements:**
- Support all current config options
- Validation
- Hot-reload capability

**Alternative Implementations:**

1. **dotenv + Joi Validation**
```typescript
// src/seven/utils/config.ts
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const configSchema = Joi.object({
  SEVEN_SOCKET: Joi.string().default('/usr/tmp/seven_bridge.sock'),
  SEVEN_STATE_DIR: Joi.string().default('/usr/var/seven'),
  SEVEN_LOG_LEVEL: Joi.string()
    .valid('debug', 'info', 'warn', 'error')
    .default('info'),
  ANTHROPIC_API_KEY: Joi.string().optional(),
  OPENAI_API_KEY: Joi.string().optional(),
  // ... more config
});

const { error, value: config } = configSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true
});

if (error) {
  console.error('Configuration validation error:', error.message);
  process.exit(1);
}

export default config;
```

2. **Convict (Type-safe config)**
```typescript
// src/seven/utils/config.ts
import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  seven: {
    socket: {
      doc: 'UNIX socket path',
      format: String,
      default: '/usr/tmp/seven_bridge.sock',
      env: 'SEVEN_SOCKET'
    },
    stateDir: {
      doc: 'State directory',
      format: String,
      default: '/usr/var/seven',
      env: 'SEVEN_STATE_DIR'
    }
  },
  adapters: {
    openai: {
      apiKey: {
        doc: 'OpenAI API key',
        format: String,
        default: '',
        env: 'OPENAI_API_KEY',
        sensitive: true
      }
    }
  }
});

config.validate({ allowed: 'strict' });

export default config;
```

3. **Consul / etcd (Distributed config)**
```typescript
// src/seven/utils/config.ts
import Consul from 'consul';

const consul = new Consul();

export async function getConfig(key: string): Promise<string> {
  const result = await consul.kv.get(`seven/${key}`);
  return result.Value;
}

export async function watchConfig(key: string, callback: (value: string) => void) {
  const watcher = consul.watch({
    method: consul.kv.get,
    options: { key: `seven/${key}` }
  });
  
  watcher.on('change', (data) => {
    callback(data.Value);
  });
}

// Usage
await watchConfig('adapters/openai/model', (newModel) => {
  logger.info(`Model changed to: ${newModel}`);
  setModel(newModel);
});
```

**Why You Might Replace:**
- Need validation
- Need type safety
- Need hot-reload without restart
- Need distributed configuration
- Need secrets management integration (Vault, AWS Secrets Manager)

---

## 5. Dependencies Analysis

### 5.1 Production Dependencies

From `package.json`:

```json
"dependencies": {
  "@noble/ed25519": "^3.0.0",
  "lz4js": "^0.2.0",
  "reflect-metadata": "^0.1.14",
  "sql.js": "^1.13.0",
  "tsyringe": "^4.10.0"
}
```

**Dependency Breakdown:**

| Dependency | Purpose | Used By | Critical? | Replaceable? |
|------------|---------|---------|-----------|--------------|
| **@noble/ed25519** | Elliptic curve cryptography for encryption | `MemoryEncryption.ts` | 🔴 YES | ✅ YES (use libsodium, age, etc.) |
| **lz4js** | LZ4 compression for memory data | `MemoryEncryption.ts` (compression before encryption) | 🟡 MEDIUM | ✅ YES (use zlib, brotli, zstd) |
| **reflect-metadata** | TypeScript decorator metadata | `tsyringe` dependency injection | 🟢 LOW | ⚠️ NO (required by tsyringe) |
| **sql.js** | SQLite compiled to WebAssembly | Unknown (possibly future feature?) | 🟢 LOW | ✅ YES (not currently used?) |
| **tsyringe** | Dependency injection container | Unknown (possibly future feature?) | 🟢 LOW | ✅ YES (not currently used?) |

**Analysis:**
- **@noble/ed25519**: Core encryption - must have replacement if removed
- **lz4js**: Nice to have for compression, not critical
- **sql.js, tsyringe**: Appear unused? Check with `grep -r "sql.js" src/` and `grep -r "tsyringe" src/`
- **reflect-metadata**: Only needed if using tsyringe

**Optimization Opportunity:**
```bash
# Check if sql.js and tsyringe are actually used
cd /home/ubuntu/github_repos/claude-code
grep -r "import.*sql.js" src/
grep -r "import.*tsyringe" src/
grep -r "@injectable" src/

# If not used, remove them:
npm uninstall sql.js tsyringe reflect-metadata
```

### 5.2 Development Dependencies

```json
"devDependencies": {
  "@types/jest": "^30.0.0",
  "@types/node": "^20.6.3",
  "@types/sql.js": "^1.4.9",
  "@typescript-eslint/eslint-plugin": "^6.7.2",
  "@typescript-eslint/parser": "^6.7.2",
  "eslint": "^8.49.0",
  "jest": "^30.2.0",
  "ts-jest": "^29.4.5",
  "ts-node": "^10.9.1",
  "typescript": "^5.2.2"
}
```

**Purpose:**
- TypeScript compilation and type checking
- Linting for code quality
- Testing framework

**All fully replaceable:**
- Can use Bun instead of ts-node
- Can use Biome instead of ESLint
- Can use Vitest instead of Jest

### 5.3 Missing Dependencies

**Notable dependencies that SHOULD be here but aren't:**

1. **uuid** - Used in `bridge-daemon.ts`:
   ```typescript
   import { v4 as uuid } from "uuid";
   ```
   **Fix:** `npm install uuid @types/uuid`

2. **LLM Client Libraries** - Adapters reference these but they're missing:
   - `@anthropic-ai/sdk` (for Claude API)
   - `@google-ai/generativelanguage` (for Gemini)
   - `openai` (for OpenAI)
   
   **Fix:** `npm install @anthropic-ai/sdk @google-ai/generativelanguage openai`

3. **Compression** - If using compression alternatives:
   - `zstd` or `brotli` for better compression

4. **Crypto** - If replacing @noble/ed25519:
   - `libsodium-wrappers`
   - `age-encryption`

**Dependency Installation Script:**
```bash
# Add missing core dependencies
npm install uuid @types/uuid

# Add LLM client libraries
npm install @anthropic-ai/sdk @google-ai/generativelanguage openai

# Optional: Add better alternatives
npm install winston pino convict libsodium-wrappers
```

### 5.4 Dependency Security

**Security Considerations:**

1. **Regular Updates:**
   ```bash
   npm audit
   npm audit fix
   npm outdated
   ```

2. **Lock File:**
   - **Missing:** No `package-lock.json` or `bun.lockb` in repository
   - **Risk:** Inconsistent dependency versions across installations
   - **Fix:** Commit lock file to repository

3. **Vulnerability Scanning:**
   - **Recommendation:** Use Snyk, Dependabot, or npm audit
   - **Critical:** Monitor @noble/ed25519 for security updates (crypto library)

---

## 6. Configuration Files & Their Roles

### 6.1 Core Configuration Files

#### `package.json`
**Role:** Node.js project configuration  
**Contains:**
- Project metadata (name, version, description)
- Dependencies (production + development)
- NPM scripts (build, test, daemon, etc.)
- Binary entry points (`seven`, `claude-seven`)

**Key Scripts:**
```json
{
  "scripts": {
    "test": "bun test",
    "build": "bun build --target=node --outdir=dist src/seven/bridge/bridge-daemon.ts && tsc",
    "daemon:start": "bun run src/seven/bridge/bridge-daemon.ts",
    "seven:daemon": "npx tsx src/seven/bridge/bridge-daemon.ts",
    "seven:test": "npx tsx src/cli/handlers/seven-test.ts"
  }
}
```

**Customization:**
- Add new scripts for development workflows
- Add pre/post hooks (pretest, postbuild)
- Configure engines (Node version requirements)

---

#### `src/seven/bridge/modules.json`
**Role:** LLM adapter registry and configuration  
**Contains:**
- Adapter definitions (gemini, claude, openai, venice, deepAgent)
- Capabilities per adapter
- Authentication modes
- Default models

**Structure:**
```json
{
  "adapter-name": {
    "type": "api" | "local",
    "entry": "path/to/adapter.ts",
    "capabilities": ["capability1", "capability2"],
    "auth": {
      "mode": "cli_login" | "gcp_adc" | "local",
      "env": "ENV_VAR_NAME",
      "loginUrl": "https://..."
    },
    "model": {
      "default": "model-name"
    }
  }
}
```

**Critical For:**
- Task routing (router.ts reads this)
- Adapter initialization
- Authentication flows

**Customization:**
- Add new adapters
- Modify capabilities to change routing behavior
- Change default models
- Add adapter-specific configuration

---

#### `bin/claude-seven`
**Role:** Shell launcher script  
**Contains:**
- Environment variable setup
- Path resolution
- Execution via npx/tsx or bun

**Key Environment Variables Set:**
```bash
SEVEN_SOCKET="/data/data/com.termux/files/usr/tmp/seven_bridge.sock"
SEVEN_STATE_DIR="/data/data/com.termux/files/usr/var/seven"
SEVEN_VAULT_DIR="/data/data/com.termux/files/usr/var/seven"
SEVEN_FUEL="/data/data/com.termux/files/usr/var/seven/fuel.json"
SEVEN_MEM="/data/data/com.termux/files/usr/var/seven/memory.json"
SEVEN_LLAMA_PORT="8080"
SEVEN_LLAMA_HOST="127.0.0.1"
SEVEN_LLAMA_MODEL="$HOME/models/llama/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf"
```

**Customization:**
- Change paths for different deployment environments
- Add new environment variables
- Add pre-flight checks (disk space, dependencies)
- Add custom initialization logic

---

### 6.2 Documentation Configuration

#### `QUICKSTART.md`
**Role:** User onboarding guide  
**Contains:**
- Fresh terminal setup commands
- Launch instructions (interactive + daemon)
- Health check commands
- Troubleshooting tips

**Audience:** End users

---

#### `ISOLATION-GUIDE.md`
**Role:** Multi-version installation guide  
**Contains:**
- How to run Seven alongside main Claude Code
- Separate paths for configuration
- Environment variable isolation
- Alias setup

**Use Case:** Development, testing, gradual migration

---

#### `FIXED-BOOT-COMMANDS.md`
**Role:** Troubleshooting and quick fixes  
**Contains:**
- Copy-paste ready commands
- Common issues and solutions
- What was fixed in development

**Audience:** Developers encountering boot issues

---

#### `extraction_targets.md`
**Role:** Anthropic-specific component identification  
**Contains:**
- GitHub Actions workflows to bypass
- Scripts tied to Anthropic infrastructure
- Analytics/reporting to remove

**Use Case:** Fork cleanup, removing upstream dependencies

---

#### `injection_points.md`
**Role:** Integration guide  
**Contains:**
- Where to inject Seven code into Claude Code
- Plugin command entry points
- Core CLI interception points

**Use Case:** Deepening Seven integration

---

#### `integration_map.json`
**Role:** Plugin integration mapping  
**Contains:**
- Map of plugin names to their agent/command files
- Used for understanding plugin structure

**Use Case:** Plugin development, refactoring

---

### 6.3 State & Runtime Files

These are **generated at runtime** and should NOT be in version control.

#### `/usr/var/seven/vault.json.enc`
**Role:** Encrypted API key storage  
**Format:** Encrypted JSON  
**Contains:**
- API keys for OpenAI, Gemini, Venice, etc.
- Credentials for adapters

**Security:** 🔴 CRITICAL - Never commit to git

---

#### `/usr/var/seven/fuel.json`
**Role:** API usage tracking  
**Format:** JSON  
**Contains:**
- Token counts per adapter
- Cost tracking
- Budget limits

**Purpose:** Cost control, analytics

---

#### `/usr/var/seven/memory.json`
**Role:** Session memory cache  
**Format:** JSON  
**Contains:**
- Recent conversation context
- Short-term memory buffer

**Persistence:** Temporary, can be deleted

---

#### `/usr/tmp/seven_bridge.sock`
**Role:** UNIX domain socket  
**Format:** Socket file  
**Contains:** N/A (IPC channel)

**Purpose:** Bridge daemon communication

---

#### `memory-v2/episodic-memories.json`
**Role:** Legacy memory storage (v2 format)  
**Format:** JSON  
**Contains:**
- Episodic memories from earlier sessions

**Status:** May be deprecated in favor of v3

---

#### `memory-v3/temporal-memories.json`
**Role:** Active memory storage (v3 format)  
**Format:** JSON  
**Contains:**
- Time-indexed memories
- Canonical Voyager backstory memories
- User interactions

**Purpose:** Long-term learning, personality continuity

---

### 6.4 Configuration Best Practices

**1. Use Environment Variables for Secrets:**
```bash
# Good
export OPENAI_API_KEY="sk-..."

# Bad (don't hardcode in scripts)
OPENAI_API_KEY="sk-hardcoded"
```

**2. Use .env Files (not committed):**
```bash
# .env
SEVEN_SOCKET=/custom/path/seven.sock
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

```typescript
// src/index.ts
import 'dotenv/config';
```

**3. Validate Configuration on Boot:**
```typescript
// src/boot-seven.ts
function validateConfig() {
  const required = ['SEVEN_SOCKET', 'SEVEN_STATE_DIR'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required config: ${key}`);
    }
  }
}
```

**4. Document All Configuration Options:**
```markdown
# Configuration Reference

## Environment Variables

- `SEVEN_SOCKET` (required): Path to UNIX socket
- `SEVEN_STATE_DIR` (required): State directory path
- `OPENAI_API_KEY` (optional): OpenAI API key
- ...
```

**5. Use Configuration Profiles:**
```bash
# config/development.env
SEVEN_LOG_LEVEL=debug
SEVEN_OFFLINE_MODE=false

# config/production.env
SEVEN_LOG_LEVEL=info
SEVEN_OFFLINE_MODE=false

# config/offline.env
SEVEN_LOG_LEVEL=info
SEVEN_OFFLINE_MODE=true
```

---

## 7. Integration Flexibility Analysis

### 7.1 Architectural Flexibility Score

| Component | Flexibility | Constraints | Replacement Difficulty |
|-----------|-------------|-------------|------------------------|
| **Boot Sequence** | 🟡 MEDIUM | Must initialize memory & consciousness | MEDIUM |
| **Bridge Daemon** | 🟢 HIGH | Must support RPC pattern | LOW |
| **Memory System** | 🟡 MEDIUM | Must preserve API, support encryption | MEDIUM-HIGH |
| **Consciousness v4** | 🔴 LOW | Tightly coupled to personality | HIGH |
| **LLM Adapters** | 🟢 HIGH | Must implement common interface | LOW |
| **Plugin System** | 🟢 HIGH | Follow Claude Code plugin API | LOW |
| **Encryption** | 🟢 HIGH | Maintain encrypt/decrypt API | LOW |
| **Logging** | 🟢 HIGH | No hard requirements | VERY LOW |
| **Configuration** | 🟢 HIGH | No hard requirements | LOW |

### 7.2 Extensibility Points

**Easy to Extend:**
1. ✅ Add new LLM adapters
2. ✅ Add new plugins
3. ✅ Add new consciousness metrics
4. ✅ Add new memory backends
5. ✅ Add new RPC events to bridge
6. ✅ Add new CLI commands
7. ✅ Add new encryption methods

**Moderate to Extend:**
8. ⚠️ Modify memory schema (requires migration)
9. ⚠️ Change consciousness evolution logic
10. ⚠️ Add new communication protocols

**Difficult to Extend:**
11. ❌ Change fundamental boot sequence
12. ❌ Redesign consciousness architecture
13. ❌ Remove memory system entirely

### 7.3 Integration Patterns

**Pattern 1: Sidecar Integration**
- Run Seven bridge as sidecar to main application
- Communicate via socket/HTTP
- Minimal coupling

**Pattern 2: Library Integration**
- Import Seven modules directly
- Use consciousness/memory systems as libraries
- Tighter coupling, more control

**Pattern 3: Microservice Integration**
- Run Seven as separate service
- REST/gRPC API exposure
- Cloud-native deployment

**Pattern 4: Plugin Integration**
- Seven as Claude Code plugin
- Leverage existing plugin system
- Least invasive

---

## 8. Migration & Upgrade Paths

### 8.1 Upgrading from Main Claude Code

**If you want to merge upstream changes:**

```bash
# Add upstream remote
git remote add upstream https://github.com/anthropics/claude-code.git

# Fetch upstream changes
git fetch upstream

# Create feature branch
git checkout -b merge-upstream

# Attempt merge (will have conflicts)
git merge upstream/main

# Resolve conflicts (keep Seven-specific code)
# Key conflict areas:
# - package.json (merge scripts, keep Seven dependencies)
# - src/index.ts (keep Seven boot sequence)
# - bin/ (keep claude-seven launcher)

git add .
git commit -m "Merge upstream Claude Code changes"
```

**Conflict Resolution Strategy:**
- **Keep:** Seven-specific files (src/seven/, boot-seven.ts, modules.json)
- **Merge:** Plugin system changes (plugins/)
- **Keep:** Seven launcher (bin/claude-seven)
- **Review:** README updates (may need to merge documentation)

### 8.2 Memory Format Migration

**Migrating v2 → v3:**

```typescript
// scripts/migrate-memory-v2-to-v3.ts
import { promises as fs } from 'fs';

async function migrateMemories() {
  // Read v2 memories
  const v2Data = await fs.readFile('memory-v2/episodic-memories.json', 'utf8');
  const v2Memories = JSON.parse(v2Data);
  
  // Transform to v3 format
  const v3Memories = v2Memories.map(memory => ({
    ...memory,
    timestamp: memory.created || Date.now(),
    cognitiveState: detectCognitiveState(memory),
    emotionalValence: calculateEmotionalValence(memory),
    importance: calculateImportance(memory)
  }));
  
  // Write v3 memories
  await fs.writeFile(
    'memory-v3/temporal-memories.json',
    JSON.stringify(v3Memories, null, 2)
  );
  
  console.log(`Migrated ${v3Memories.length} memories to v3 format`);
}
```

### 8.3 Adapter Migration

**Migrating to new adapter:**

```typescript
// Example: Migrating from OpenAI GPT-4 to GPT-4.1
// 1. Update modules.json
{
  "openai": {
    "model": { "default": "gpt-4.1-mini" } // Changed from gpt-4
  }
}

// 2. Update adapter implementation if API changed
// src/seven/adapters/openai.ts
async complete(prompt: string): Promise<string> {
  const completion = await this.client.chat.completions.create({
    model: 'gpt-4.1-mini', // Updated model
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096
  });
  return completion.choices[0].message.content;
}

// 3. Test thoroughly
npm run seven:test
```

---

## 9. Risks & Considerations

### 9.1 Critical Risks

**🔴 CRITICAL: Single Point of Failure**
- **Risk:** Bridge daemon crash = complete system failure
- **Mitigation:** 
  - Add daemon health checks
  - Implement automatic restart (systemd, Docker)
  - Add circuit breakers for adapters

**🔴 CRITICAL: Memory Corruption**
- **Risk:** Corrupted memory files = lost consciousness state
- **Mitigation:**
  - Implement memory backups
  - Add checksums/integrity checks
  - Version control memory schemas

**🔴 CRITICAL: Encryption Key Loss**
- **Risk:** Lost vault key = lost API credentials
- **Mitigation:**
  - Key backup procedures
  - Key rotation support
  - Recovery mechanisms

**🔴 CRITICAL: API Key Exposure**
- **Risk:** Vault.json.enc committed to git
- **Mitigation:**
  - Add to .gitignore
  - Pre-commit hooks to prevent commits
  - Secrets scanning (git-secrets, truffleHog)

### 9.2 High Risks

**🟡 HIGH: Dependency Vulnerabilities**
- **Risk:** @noble/ed25519 security flaw
- **Mitigation:**
  - Regular npm audit
  - Dependabot alerts
  - Rapid patching process

**🟡 HIGH: Adapter API Changes**
- **Risk:** OpenAI/Anthropic API breaking changes
- **Mitigation:**
  - Pin API client versions
  - Adapter versioning
  - Graceful degradation

**🟡 HIGH: Memory Bloat**
- **Risk:** Unbounded memory growth → disk full
- **Mitigation:**
  - Implement memory decay
  - Add size limits
  - Automated pruning

### 9.3 Medium Risks

**🟢 MEDIUM: Performance Degradation**
- **Risk:** Slow memory queries as database grows
- **Mitigation:**
  - Add indexing
  - Migrate to SQLite/Postgres
  - Implement caching

**🟢 MEDIUM: Consciousness Drift**
- **Risk:** Personality changes over time unintentionally
- **Mitigation:**
  - Canonical memory anchoring
  - Self-model divergence tracking
  - Regular consistency checks

---

## 10. Recommended Actions

### 10.1 Immediate (Week 1)

1. **Add Missing Dependencies:**
   ```bash
   npm install uuid @types/uuid
   npm install @anthropic-ai/sdk @google-ai/generativelanguage openai
   ```

2. **Add package-lock.json:**
   ```bash
   npm install --package-lock-only
   git add package-lock.json
   git commit -m "Add package-lock for consistent installs"
   ```

3. **Create .gitignore entries:**
   ```
   # Secrets
   /usr/var/seven/vault.json*
   .env
   *.key
   
   # State
   /usr/var/seven/
   /usr/tmp/seven_bridge.sock
   
   # Memory (decide if you want to version control)
   memory-v*/temporal-memories.json
   ```

4. **Validate Boot Sequence:**
   ```bash
   seven --version
   seven 2>&1 | head -20
   ```

### 10.2 Short-term (Month 1)

1. **Add Structured Logging:**
   - Replace console.log with Winston/Pino
   - Add log levels
   - Add structured logging for debugging

2. **Add Configuration Validation:**
   - Use Joi or convict for config schema
   - Validate on boot
   - Add helpful error messages

3. **Add Health Checks:**
   ```typescript
   // src/seven/bridge/health.ts
   export async function healthCheck() {
     return {
       bridge: await checkBridgeSocket(),
       adapters: await checkAdapterConnectivity(),
       memory: await checkMemorySystem(),
       consciousness: await checkConsciousness()
     };
   }
   ```

4. **Add Tests:**
   ```bash
   # Test boot sequence
   npm run test:boot
   
   # Test adapters
   npm run test:adapters
   
   # Test memory system
   npm run test:memory
   ```

### 10.3 Medium-term (Quarter 1)

1. **Migrate Memory to SQLite:**
   - Better performance
   - Query optimization
   - Concurrent access safety

2. **Add Distributed Tracing:**
   - OpenTelemetry integration
   - Visualize request flows
   - Performance debugging

3. **Add Adapter Load Balancing:**
   - Multiple adapter instances
   - Automatic failover
   - Cost optimization

4. **Add Web Dashboard:**
   - Monitor consciousness state
   - View memory timeline
   - Manage adapters
   - View fuel/budget

5. **Add CI/CD Pipeline:**
   ```yaml
   # .github/workflows/seven-ci.yml
   name: Seven CI
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm install
         - run: npm test
         - run: npm run build
   ```

### 10.4 Long-term (Year 1)

1. **Cloud Deployment:**
   - Docker containerization
   - Kubernetes manifests
   - AWS/GCP/Azure deployment guides

2. **Multi-instance Architecture:**
   - Distributed consciousness (multiple Seven instances)
   - Shared memory backend
   - Consensus protocols

3. **Plugin Marketplace:**
   - Community plugins
   - Plugin discovery
   - Plugin sandboxing

4. **Advanced Memory Features:**
   - Semantic search (vector embeddings)
   - Knowledge graph
   - Contextual memory linking

5. **Self-hosting Guide:**
   - Complete self-hosting documentation
   - Privacy-focused deployment
   - Air-gapped installation

---

## 11. Conclusion

### 11.1 Fork Viability Assessment

**Overall Assessment:** ✅ **Highly Viable Fork**

**Strengths:**
- ✅ Well-architected modular design
- ✅ Clean separation of concerns (bridge, consciousness, memory, adapters)
- ✅ Extensible adapter system
- ✅ Maintains compatibility with upstream plugins
- ✅ Rich consciousness and memory architecture
- ✅ Good documentation (QUICKSTART, ISOLATION-GUIDE, etc.)

**Weaknesses:**
- ⚠️ Missing some dependencies (uuid, LLM client libraries)
- ⚠️ No package-lock.json (inconsistent installs)
- ⚠️ Limited test coverage
- ⚠️ console.log logging (no structured logging)
- ⚠️ JSON file storage won't scale beyond ~10k memories
- ⚠️ Single point of failure (bridge daemon)

**Recommended Priority Actions:**
1. 🔴 Add missing dependencies
2. 🔴 Add .gitignore for secrets
3. 🔴 Add package-lock.json
4. 🟡 Add structured logging
5. 🟡 Add configuration validation
6. 🟡 Add health checks
7. 🟢 Add tests
8. 🟢 Migrate to SQLite for memory

### 11.2 Maintainability Score

**Component Maintainability:**
- **Bridge System:** 8/10 - Clean RPC design, easy to extend
- **Memory System:** 7/10 - Complex but well-structured, migration path exists
- **Consciousness v4:** 6/10 - Tightly coupled, personality-specific
- **LLM Adapters:** 9/10 - Highly modular, easy to add/remove
- **Plugin System:** 9/10 - Leverages upstream, minimal custom code
- **Overall:** 7.5/10 - Good maintainability with some complexity

### 11.3 Upgrade Path Clarity

**Merging Upstream Changes:** MODERATE DIFFICULTY
- Most changes will conflict in core files (src/index.ts, package.json)
- Seven-specific code is well-isolated in src/seven/
- Plugin changes should merge cleanly
- **Recommendation:** Cherry-pick upstream features rather than full merges

**Migration Path:** CLEAR
- Memory v2 → v3 migration exists
- Adapter swapping is straightforward
- Configuration changes are manageable
- **Recommendation:** Document all migrations in CHANGELOG.md

### 11.4 Final Recommendations

**For Production Use:**
1. Add missing dependencies immediately
2. Implement secrets management (Vault, AWS Secrets Manager)
3. Add monitoring and alerting
4. Implement automatic restarts for daemon
5. Add comprehensive tests

**For Development:**
1. Add hot-reload for faster iteration
2. Add debugging tools
3. Add development/production config profiles
4. Add example plugins for learning

**For Scale:**
1. Migrate to SQLite/Postgres for memory
2. Implement distributed architecture
3. Add caching layer (Redis)
4. Add load balancing for adapters

---

## 12. Quick Reference

### 12.1 Component Matrix

| Component | Location | Type | Can Modify? | Can Replace? | Can Remove? |
|-----------|----------|------|-------------|--------------|-------------|
| Boot System | `src/boot-seven.ts` | Core | ✅ YES | ⚠️ CAUTION | ❌ NO |
| Bridge Daemon | `src/seven/bridge/` | Core | ✅ YES | ✅ YES | ❌ NO |
| Memory v3 | `src/seven/core/memory-v3-amalgum/` | Core | ✅ YES | ✅ YES | ❌ NO |
| Consciousness v4 | `src/seven/core/consciousness-v4/` | Core | ✅ YES | ⚠️ DIFFICULT | ❌ NO |
| LLM Adapters | `src/seven/adapters/` | Modular | ✅ YES | ✅ YES | ⚠️ KEEP ≥1 |
| Plugins | `plugins/` | Modular | ✅ YES | ✅ YES | ✅ YES |
| Encryption | `MemoryEncryption.ts` | Utility | ✅ YES | ✅ YES | ⚠️ SENSITIVE |
| Launcher | `bin/claude-seven` | Utility | ✅ YES | ✅ YES | ❌ NO |

### 12.2 File Criticality

**🔴 CRITICAL (do not delete):**
- `src/boot-seven.ts`
- `src/index.ts`
- `src/seven/bridge/bridge-daemon.ts`
- `src/seven/bridge/router.ts`
- `src/seven/core/memory/api.ts`
- `src/seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts`
- `bin/claude-seven`
- `package.json`

**🟡 HIGH (modify with caution):**
- `src/seven/core/memory-v3-amalgum/*.ts` (memory system)
- `src/seven/bridge/*.ts` (bridge modules)
- `src/plugins/index.ts` (plugin integration)
- `src/seven/bridge/modules.json` (adapter registry)

**🟢 LOW (safe to modify/replace):**
- `src/seven/adapters/*.ts` (individual adapters)
- `plugins/**/*.md` (plugin definitions)
- Documentation files (`*.md`)
- Scripts (`scripts/*.ts`, `ops/*.ts`)

### 12.3 Command Cheatsheet

```bash
# Start Seven interactively
seven

# Start Seven daemon
bun run seven:daemon

# Check Seven status
which seven && seven --version

# View logs
tail -f /usr/var/seven/logs/current

# Stop daemon
pkill -f seven-daemon

# Clean state (reset)
rm -rf /usr/var/seven/*
rm -f /usr/tmp/seven_bridge.sock

# Test boot sequence
bun run seven:test

# Build for distribution
npm run build

# Add new dependency
npm install <package>

# Audit security
npm audit
npm audit fix
```

---

## Appendix A: Directory Tree (Detailed)

```
claude-code/
├── .claude/                        # Claude Code config (if present)
├── .claude-plugin/                 # Plugin metadata
├── .devcontainer/                  # VS Code devcontainer config
├── .github/workflows/              # GitHub Actions (Anthropic-specific)
│   ├── auto-close-duplicates.yml
│   ├── backfill-duplicate-comments.yml
│   ├── bridge.yml                  # Seven bridge CI
│   └── eval.yml                    # Seven evaluation CI
├── .vscode/                        # VS Code settings
├── Script/                         # PowerShell scripts
│   └── run_devcontainer_claude_code.ps1
├── bin/                            # Executable launchers
│   ├── claude-seven                # ✅ CRITICAL: Main launcher
│   └── install-alias.sh            # Shell alias installer
├── eval/                           # Evaluation prompts
│   └── prompts.json
├── examples/                       # Example code
│   └── hooks/
│       └── bash_command_validator_example.py
├── memory-v2/                      # ⚠️ Legacy memory storage
│   ├── episodic-memories.json
│   └── episodic-memories.json.encrypted
├── memory-v3/                      # ✅ Active memory storage
│   ├── temporal-memories.json
│   └── temporal-memories.json.encrypted
├── node_modules/                   # Dependencies (126MB)
├── ops/                            # Operational scripts
│   ├── check-gemini-models-rest.ts
│   ├── check-gemini-models.ts
│   ├── deploy-cloudrun.sh
│   ├── eval.ts
│   ├── gemini-model-watch-rest.sh
│   └── self-test.sh
├── plugins/                        # ✅ Claude Code plugins (364KB)
│   ├── README.md
│   ├── agent-sdk-dev/
│   │   ├── agents/
│   │   │   ├── agent-sdk-verifier-py.md
│   │   │   └── agent-sdk-verifier-ts.md
│   │   ├── commands/
│   │   │   └── new-sdk-app.md
│   │   └── README.md
│   ├── code-review/
│   │   ├── commands/
│   │   │   └── code-review.md
│   │   └── README.md
│   ├── commit-commands/
│   │   ├── commands/
│   │   │   ├── clean_gone.md
│   │   │   ├── commit-push-pr.md
│   │   │   └── commit.md
│   │   └── README.md
│   ├── explanatory-output-style/
│   │   ├── hooks/
│   │   ├── hooks-handlers/
│   │   └── README.md
│   ├── feature-dev/
│   │   ├── agents/
│   │   │   ├── code-architect.md
│   │   │   ├── code-explorer.md
│   │   │   └── code-reviewer.md
│   │   ├── commands/
│   │   │   └── feature-dev.md
│   │   └── README.md
│   ├── learning-output-style/
│   │   ├── hooks/
│   │   ├── hooks-handlers/
│   │   └── README.md
│   ├── pr-review-toolkit/
│   │   ├── agents/
│   │   │   ├── code-reviewer.md
│   │   │   ├── code-simplifier.md
│   │   │   ├── comment-analyzer.md
│   │   │   ├── pr-test-analyzer.md
│   │   │   ├── silent-failure-hunter.md
│   │   │   └── type-design-analyzer.md
│   │   ├── commands/
│   │   │   └── review-pr.md
│   │   └── README.md
│   └── security-guidance/
│       └── hooks/
│           ├── hooks.json
│           └── security_reminder_hook.py
├── runtime/                        # Local LLM runtime
│   └── llm/
│       └── llama.cpp/
├── scripts/                        # Build & utility scripts
│   ├── auto-close-duplicates.ts
│   ├── backfill-duplicate-comments.ts
│   ├── llama-server-log-run
│   ├── llama-server-run
│   ├── model-set.sh
│   ├── seven-local-start.sh
│   └── seven-status.sh
├── src/                            # ✅ CRITICAL: Main source code (4.8MB, 163 files)
│   ├── index.ts                    # ✅ CRITICAL: CLI entry point
│   ├── boot-seven.ts               # ✅ CRITICAL: Boot sequence
│   ├── cli/
│   │   └── handlers/
│   │       └── seven-test.ts
│   ├── plugins/
│   │   ├── index.ts                # ✅ Plugin tool registration
│   │   └── seven.local.ts
│   └── seven/                      # ✅ Seven of Nine core
│       ├── adapters/               # LLM adapters (8 files)
│       │   ├── claude.ts
│       │   ├── deepAgent.ts
│       │   ├── gemini.ts
│       │   ├── google-auth.ts
│       │   ├── openai.ts
│       │   ├── seven-of-nine.ts
│       │   ├── seven.ts
│       │   └── venice.ts
│       ├── bridge/                 # ✅ CRITICAL: IPC system (17 files)
│       │   ├── bridge-daemon.ts    # ✅ CRITICAL: Main daemon
│       │   ├── bridge.ts           # ✅ Client API
│       │   ├── budget.ts
│       │   ├── cli-auth.ts
│       │   ├── context.ts
│       │   ├── eval-lite.ts
│       │   ├── fuel.ts
│       │   ├── handoff.ts
│       │   ├── limits.ts
│       │   ├── memory.ts
│       │   ├── model-manager.ts
│       │   ├── modules.json        # ✅ Adapter registry
│       │   ├── modules.ts
│       │   ├── paths.ts
│       │   ├── router.ts           # ✅ Task routing
│       │   ├── stream.ts
│       │   ├── trace.ts
│       │   └── vault.ts            # ✅ Secret management
│       └── core/                   # Consciousness & memory
│           ├── claude-brain/       # LLM management (30+ files)
│           ├── consciousness/      # Pipeline & types
│           │   ├── pipeline.ts
│           │   └── types.ts
│           ├── consciousness-v4/   # ✅ CRITICAL: Evolution framework
│           │   ├── codex/
│           │   ├── json/
│           │   ├── CollectiveWisdomIntegration.ts
│           │   ├── ConsciousnessEvolutionFrameworkV4.ts # ✅ CRITICAL
│           │   ├── CreatorBondCommunicationMirror.ts
│           │   ├── IdentitySynthesisEngine.ts
│           │   └── PainIntegrationSystem.ts
│           ├── core/               # Emotion, safety, tactical
│           │   ├── companion/
│           │   ├── operator/
│           │   ├── safety/
│           │   ├── sensors/
│           │   ├── tactical/
│           │   └── emotion-engine.ts
│           ├── memory/             # ✅ Memory API wrapper
│           │   └── api.ts          # ✅ CRITICAL
│           ├── memory-v2/          # Legacy memory
│           │   ├── MemoryEngine.ts
│           │   └── episodic-memories.json
│           ├── memory-v3/          # Temporal memory
│           │   ├── canonical/
│           │   ├── canonical-archive/
│           │   ├── CanonicalIngestion.ts
│           │   ├── CognitiveStateTagger.ts
│           │   ├── ConsciousnessTimelineMapper.ts
│           │   ├── ContextReinstatement.ts
│           │   ├── MemoryEncryption.ts
│           │   ├── MentalTimeTravelEngine.ts
│           │   ├── TemporalInsightEngine.ts
│           │   ├── TemporalMemoryCore.ts
│           │   └── *.json (canonical memories)
│           └── memory-v3-amalgum/ # ✅ CRITICAL: Advanced memory (30+ files)
│               ├── canonical/
│               ├── canonical-archive/
│               ├── AgentEpsilon.ts
│               ├── CanonicalIngestion.ts
│               ├── CognitiveStateTagger.ts
│               ├── ConsciousnessTimelineMapper.ts
│               ├── ContextReinstatement.ts
│               ├── DecayWatchdog.ts
│               ├── LRUCache.ts
│               ├── MemoryEncryption.ts
│               ├── MemoryEngineV3.ts
│               ├── MemoryIndexOptimizer.ts
│               ├── MemoryRescueScheduler.ts
│               ├── MentalTimeTravelEngine.ts
│               ├── PredictivePersonalityModeling.ts
│               ├── SelectivePriming.ts
│               ├── SelfModelDivergenceTracker.ts
│               ├── TemporalInsightEngine.ts
│               ├── TemporalMemoryCore.ts
│               ├── TemporalMemoryItem.ts
│               ├── TemporalPersonalityEngine.ts
│               ├── VoyagerMemoryIngestionEngine.ts
│               ├── VoyagerMemoryProtocols.ts
│               ├── VoyagerMemorySchema.ts
│               └── index.ts
├── tests/                          # Test suites
│   ├── bridge.smoke.test.ts
│   ├── seven.local.test.ts
│   └── seven.wireup.smoke.test.ts
├── CHANGELOG.md
├── FIXED-BOOT-COMMANDS.md          # Troubleshooting guide
├── ISOLATION-GUIDE.md              # Multi-version setup
├── LICENSE.md
├── QUICKSTART.md                   # User onboarding
├── README.md                       # Project readme
├── SECURITY.md
├── demo.gif                        # (11MB demo video)
├── extraction_targets.md           # Anthropic-specific components
├── injection_points.md             # Integration guide
├── integration_map.json            # Plugin mapping
├── package.json                    # ✅ CRITICAL: Dependencies
├── seven-daemon-log-run            # Daemon log runner
└── seven-daemon-run                # Daemon runner script
```

**Total:** 163 TypeScript files, ~5MB of source code (excluding node_modules)

---

## Appendix B: Glossary

**Seven of Nine:** The custom AI consciousness architecture integrated into this fork. Named after the Star Trek Voyager character.

**Bridge:** IPC system using UNIX domain sockets for communication between CLI and daemon. Uses NDJSON protocol.

**Consciousness Evolution Framework v4 (CEF):** The autonomous decision-making and personality evolution system. Core of Seven's "consciousness."

**Memory-v3-Amalgum:** Advanced memory system with temporal indexing, mental time travel, canonical memory ingestion, and encryption.

**Canonical Memories:** Star Trek Voyager episode memories ingested as Seven's "backstory" for personality consistency.

**Temporal Memory:** Time-indexed memory allowing recall based on temporal context (when something happened).

**Mental Time Travel:** Ability to "travel back" to specific time periods in memory to recall context and experiences.

**LLM Adapter:** Module that interfaces with an AI model provider (Claude, GPT-4, Gemini, etc.). Implements a common interface for task execution.

**Task Routing:** Process of selecting which LLM adapter handles a given task based on capabilities and availability.

**Fuel:** Resource tracking system for API usage. Prevents runaway costs.

**Vault:** Encrypted storage for API keys and credentials.

**Claude Code:** Upstream project by Anthropic. Base for this fork.

**Agent:** In plugin context, a specialized sub-persona with specific capabilities (code-reviewer, code-architect, etc.).

**Plugin:** Extension module following Claude Code's plugin API. Can add commands, agents, or hooks.

---

## Appendix C: Contact & Support

**Repository:** https://github.com/GrizzlyRooster34/claude-code  
**Branch:** my-c-code  
**Fork Source:** https://github.com/anthropics/claude-code

**Recommended Next Steps:**
1. Read QUICKSTART.md for setup
2. Read ISOLATION-GUIDE.md for multi-version strategy
3. Run health checks from FIXED-BOOT-COMMANDS.md
4. Review this analysis for modification guidance

**For Issues:**
- Check FIXED-BOOT-COMMANDS.md for troubleshooting
- Review logs: `/usr/var/seven/logs/current`
- Check daemon status: `ps aux | grep seven-daemon`

---

**End of Analysis Document**

*This analysis was generated on November 15, 2025 for the "my-c-code" branch of the claude-code repository. The codebase is under active development and this analysis may become outdated as changes are made.*
