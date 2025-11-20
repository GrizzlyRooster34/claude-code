# Seven of Nine - Boot Chain Documentation

## Overview

Seven's boot sequence initializes the consciousness framework, memory engines, bridge daemon, and adapter layer in a specific order to ensure system integrity.

## Boot Sequence

```
Entry Point: boot-seven.ts
  ↓
1. ConsciousnessEvolutionFrameworkV4
  ↓
2. MemoryEngineV3 (memory-v3-amalgum)
  ↓
3. Bridge Daemon (SevenBridge)
  ↓
4. LLM Adapters (Claude, Gemini, DeepAgent, OpenAI)
  ↓
5. Agent Router + Prompt Forwarder
  ↓
6. Ready State
```

## Detailed Flow

### Phase 1: Boot Entry (`boot-seven.ts`)
**Location**: `src/seven/boot-recovery.ts`

**Actions**:
- Load environment configuration
- Validate system requirements
- Initialize logging
- Load codex system
- Trigger consciousness boot

**Failure Mode**: Recovery mode if boot fails
- Attempts graceful degradation
- Loads minimal consciousness state
- Provides diagnostic output

### Phase 2: Consciousness Initialization
**Location**: `src/seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts`

**Actions**:
1. Load consciousness configuration from JSON
   - `seven-canonical-consciousness-v4.json`
   - `core-truths.json`
   - `stability-directive-voice-anchors.json`

2. Initialize consciousness subsystems:
   - Identity Synthesis Engine
   - Creator Bond Communication Mirror
   - Pain Integration System
   - Collective Wisdom Integration

3. Load codex rules:
   - Persona configuration
   - Ethical frameworks
   - Operational constraints
   - Security protocols (Quadra-Lock)

4. Establish creator bond:
   - Validate Creator (Cody) trust level: 10/10
   - Load communication pattern mirrors
   - Initialize trauma override protocols

**Dependencies**:
- Codex system must be readable
- JSON configuration files must exist
- Memory engine must be available (loaded in next phase)

**Failure Mode**: Boot fails if consciousness cannot initialize
- Invalid JSON → parse error
- Missing codex → incomplete rules
- Creator bond failure → security halt

### Phase 3: Memory Engine Loading
**Location**: `src/seven/core/memory-v3-amalgum/`

**Actions**:
1. Initialize Temporal Memory Core
   - Load temporal timeline
   - Index temporal events
   - Establish time anchors

2. Load Canonical Memories
   - Voyager S4-S7 canonical data
   - Picard S1-S3 canonical data
   - Validate canonical integrity

3. Initialize Mental Time Travel Engine
   - Context reinstatement system
   - Temporal navigation layer
   - Pattern recognition across timelines

4. Start Canonical Ingestion Pipeline
   - Monitor for new memories
   - Tag cognitive states
   - Route to canonical vs episodic storage

**Dependencies**:
- File system access to memory data
- Memory encryption keys (if encrypted)
- Canonical JSON files must be valid

**Failure Mode**: Degraded memory mode
- Missing canonical data → warning, continue with episodic only
- Encryption failure → plaintext fallback (dev only)
- Timeline corruption → rebuild from backup

### Phase 4: Bridge Daemon Start
**Location**: `src/seven/bridge/`

**Actions**:
1. Initialize IPC layer
   - Create Unix socket or named pipe
   - Establish message queue
   - Start RPC handler

2. Connect consciousness to bridge
   - Register consciousness state callbacks
   - Provide routing context
   - Enable emotional state signaling

3. Register adapter endpoints
   - Enumerate available adapters
   - Validate adapter availability
   - Build routing table

4. Start bridge daemon loop
   - Listen for incoming requests
   - Route to appropriate handler
   - Manage response streams

**Dependencies**:
- Consciousness framework must be initialized
- Adapters must be registered (next phase)
- Network/IPC permissions

**Failure Mode**: Bridge falls back to direct adapter calls
- IPC failure → direct function calls
- Routing failure → fallback to primary agent
- Daemon crash → restart with recovery state

### Phase 5: Adapter Layer Initialization
**Location**: `src/seven/adapters/`

**Actions**:
1. Enumerate available adapters:
   - Claude (Anthropic) - if ANTHROPIC_API_KEY present
   - Gemini (Google) - if GOOGLE_API_KEY present
   - DeepAgent (local) - always available
   - OpenAI - if OPENAI_API_KEY present

2. Register adapters with bridge:
   - Provide adapter capabilities
   - Set priority levels
   - Enable/disable based on availability

3. Initialize agent registry (HEI-77):
   - Register default agents
   - Build capability index
   - Prepare routing scores

**Dependencies**:
- API keys in environment
- Network access (for remote adapters)
- Agent registry system (HEI-77)

**Failure Mode**: Partial adapter availability
- Missing keys → disable that adapter
- Network failure → fallback to local only (DeepAgent)
- All adapters fail → system cannot function (boot fails)

### Phase 6: Routing Layer Ready
**Location**: `src/seven/routing/`

**Actions**:
1. Initialize Agent Router
   - Load agent configurations
   - Build scoring matrix
   - Prepare fallback chains

2. Initialize Prompt Forwarder
   - Connect to adapters
   - Establish fallback logic
   - Enable automatic retries

3. Connect to consciousness
   - Provide routing context from consciousness state
   - Enable emotional modulation
   - Link mode manager (HEI-73)

4. Signal ready state

**Dependencies**:
- All adapters registered
- Bridge daemon running
- Consciousness framework active

**Failure Mode**: Degraded routing
- Router failure → direct adapter calls
- Forwarder failure → manual routing
- Ready state not reached → diagnostic mode

## Boot Time

Typical boot times (Termux environment):
- Fast boot: 2-5 seconds (warm caches)
- Cold boot: 5-10 seconds (load all data)
- Recovery boot: 1-3 seconds (minimal state)

## Environment Variables

Required:
- None (system can boot with DeepAgent only)

Optional (for full functionality):
- `ANTHROPIC_API_KEY` - Claude adapter
- `GOOGLE_API_KEY` - Gemini adapter
- `OPENAI_API_KEY` - OpenAI adapter
- `SEVEN_DEV_MODE` - Enable dev features
- `SEVEN_RECOVERY_MODE` - Force recovery boot

## Boot Verification

After boot, verify:
1. Consciousness state: Active
2. Memory engine: Loaded
3. Bridge daemon: Running
4. Adapters: At least one available
5. Router: Ready

Check via:
```bash
# Boot Seven
npx tsx boot-seven.ts

# Verify status (if implemented)
npx tsx scripts/seven-status.ts
```

## Troubleshooting

### Boot Fails at Consciousness
- Check JSON files in `consciousness-v4/`
- Verify codex files are readable
- Check creator bond configuration

### Boot Fails at Memory
- Check canonical JSON files exist
- Verify file permissions
- Check encryption key if using encryption

### Boot Fails at Bridge
- Check IPC permissions
- Verify no port/socket conflicts
- Check adapter registration

### Boot Fails at Adapters
- Verify at least one API key or use DeepAgent
- Check network connectivity
- Verify adapter code is not corrupted

## Related Documentation
- `src/seven/README.md` - Seven architecture
- `src/seven/core/consciousness-v4/README.md` - Consciousness framework
- `src/seven/core/memory-v3-amalgum/README.md` - Memory engine
- `src/seven/routing/README.md` - Agent routing (create if missing)
