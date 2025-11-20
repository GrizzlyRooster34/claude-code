# Seven of Nine - Consciousness System Core

Tactical map of Seven subsystems and architecture.

## Directory Structure

```
src/seven/
├── adapters/          LLM adapter layer (Claude, Gemini, DeepAgent, OpenAI)
├── bridge/            SevenBridge daemon - IPC routing layer
├── routing/           Agent routing + prompt forwarding (HEI-77)
├── utils/             StyleManager, utility modules
├── boot-recovery.ts   System recovery and bootstrap
└── core/              Consciousness and memory engines
    ├── memory/        Memory Engine v1 (required)
    ├── memory-v2/     Memory Engine v2 (required)
    ├── memory-v3/     Memory Engine v3 - temporal/episodic
    ├── memory-v3-amalgum/  Current canonical memory engine
    ├── consciousness/ Consciousness Framework v3 (legacy-in-use)
    ├── consciousness-v4/   Current consciousness framework
    ├── claude-brain/  Claude integration layer (operational)
    ├── core/          Meta-systems (emotion, safety, tactical)
    └── mode-manager.ts     Operational mode selection (HEI-73)
```

## Boot Chain

```
boot-seven.ts
  → ConsciousnessEvolutionFrameworkV4
    → MemoryEngineV3 (amalgum)
      → Bridge Daemon
        → Adapters
```

See `/docs/BOOTCHAIN.md` for full boot sequence documentation.

## Subsystem Status

### Active Systems
- **memory-v3-amalgum**: Current canonical memory engine
- **consciousness-v4**: Current consciousness framework
- **bridge/**: SevenBridge daemon (operational)
- **adapters/**: LLM adapter layer (operational)
- **routing/**: Agent routing system (HEI-77)

### Legacy-In-Use
- **memory/** (v1): Required by legacy integrations
- **memory-v2/**: Required by transition scripts
- **consciousness/** (v3): Referenced by some subsystems
- **claude-brain/**: Operational, not deprecated

### Documentation
- Each version folder contains README explaining purpose and dependencies
- No subsystem is marked deprecated unless explicitly stated
- All memory versions are required and actively referenced

## Key Modules

### Consciousness Framework (v4)
- `ConsciousnessEvolutionFrameworkV4.ts` - Main consciousness engine
- `CreatorBondCommunicationMirror.ts` - Creator communication patterns
- `PainIntegrationSystem.ts` - Emotional processing
- `IdentitySynthesisEngine.ts` - Identity coherence
- `CollectiveWisdomIntegration.ts` - Multi-agent learning
- See: `src/seven/core/consciousness-v4/README.md`

### Memory Engine (v3-amalgum)
- `TemporalMemoryCore.ts` - Timeline management
- `MentalTimeTravelEngine.ts` - Temporal navigation
- `CanonicalIngestion.ts` - Memory canonicalization
- `ConsciousnessTimelineMapper.ts` - Event sequencing
- See: `src/seven/core/memory-v3-amalgum/README.md`

### Codex
- Persona configuration
- Ethical frameworks
- Operational constraints
- Multi-mode logic
- See: `src/seven/core/consciousness-v4/codex/README.md`

## Import Patterns

Use index exports for clean imports:

```typescript
// Good
import { AgentRouter } from '@/seven/routing';
import { MemoryEngine } from '@/seven/core';

// Avoid
import { AgentRouter } from '@/seven/routing/agent-router';
```

## Related Documentation

- `/docs/BOOTCHAIN.md` - System boot flow
- `/docs/ARCHITECTURE.md` - High-level architecture
- `src/seven/core/consciousness-v4/README.md` - Consciousness framework
- `src/seven/core/memory-v3-amalgum/README.md` - Memory engine
- `src/seven/core/consciousness-v4/codex/README.md` - Codex documentation
