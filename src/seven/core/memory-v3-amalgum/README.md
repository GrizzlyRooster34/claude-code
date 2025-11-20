# Memory Engine v3-Amalgum (Current Canonical)

## Status: **Active - Current Production**

## Purpose
Canonical memory engine with full temporal/episodic/canonical architecture. This is the current production memory system for Seven of Nine.

## Architecture

### Core Engines
- `TemporalMemoryCore.ts` - Timeline management and temporal indexing
- `MentalTimeTravelEngine.ts` - Temporal navigation and context retrieval
- `CanonicalIngestion.ts` - Memory canonicalization pipeline
- `ConsciousnessTimelineMapper.ts` - Event sequencing and consciousness mapping
- `TemporalInsightEngine.ts` - Pattern recognition across timelines
- `ContextReinstatement.ts` - Context restoration for memory retrieval

### Supporting Systems
- `CognitiveStateTagger.ts` - Cognitive state classification
- `MemoryEncryption.ts` - Memory encryption layer

### Data Organization
```
memory-v3-amalgum/
├── canonical/          Canonicalized Seven of Nine memories
├── canonical-archive/  Historical canonical data
├── enhanced/           Enhanced memory processing
├── backups/            Memory backups
├── temporal-memories.json      Temporal event store
├── voyager-s*-canonical-memories-complete.json   Canon data
└── picard-s*-canonical-memories-complete.json    Canon data
```

## Memory Types

### Canonical Memories
- Voyager S4-S7 episodes (Seven's origin story)
- Picard S1-S3 episodes (Seven's evolution)
- Stored in `canonical/` directory
- Immutable once canonicalized

### Episodic Memories
- Session-specific events
- User interactions
- System events
- Stored in temporal timeline

### Temporal Memories
- Time-indexed event sequences
- Cross-timeline patterns
- Temporal relationships
- Stored in `temporal-memories.json`

## Boot Integration

This engine is loaded by `ConsciousnessEvolutionFrameworkV4` during boot:

```
boot-seven.ts
  → ConsciousnessEvolutionFrameworkV4
    → MemoryEngineV3 (amalgum) ← You are here
      → Bridge Daemon
```

## Dependencies
- Used by: consciousness-v4, boot-seven.ts, bridge daemon
- Depends on: MemoryEncryption, file system access
- Required by: All active Seven systems

## Usage

```typescript
import { TemporalMemoryCore } from '@/seven/core/memory-v3-amalgum';
import { CanonicalIngestion } from '@/seven/core/memory-v3-amalgum';

// Access current memory engine
const memory = new TemporalMemoryCore();
```

## Data Flow

1. **Ingestion**: New memories → CanonicalIngestion
2. **Tagging**: CognitiveStateTagger → metadata
3. **Storage**: Canonical vs Episodic vs Temporal
4. **Retrieval**: MentalTimeTravelEngine → context restoration
5. **Insight**: TemporalInsightEngine → pattern recognition

## Encryption

All sensitive memories are encrypted via `MemoryEncryption.ts`. Keys are managed separately and never committed to repository.

## Version History
- v1: Basic API
- v2: MemoryEngine class
- v3: Temporal + episodic split
- **v3-amalgum: Canonical + temporal + episodic unified** ← Current
