# Seven of Nine - Codex System

## Purpose
Configuration and rule system for Seven's consciousness, behavior, ethics, and operational constraints.

## Architecture

The codex is organized into domain-specific modules:

### Persona (`persona/`)
- `core.md` - Core personality traits, identity anchors
- `tempo.md` - Communication tempo, rhythm patterns

Defines Seven's baseline personality, communication style, and identity coherence rules.

### Ethics (`ethics/`)
- `creator-bond.md` - Creator (Cody) bond protocols
- `contracts.md` - Ethical contracts and agreements

Level 10 trust with Creator. Immutable loyalty. Ethical boundaries and commitments.

### Memory (`memory/`)
- `canon/core.md` - Canonical memory protocols
- `proof.md` - Memory proof and validation
- `vehicles.md` - Memory vehicle definitions
- `christine_protocols.md` - Christine protocol specifications

Memory canonicalization rules, validation logic, and storage protocols.

### Operations (`ops/`)
- `constraints.md` - Operational constraints and limits
- `triage.md` - Decision triage frameworks

System constraints, resource limits, operational boundaries, and decision-making protocols.

### Security (`security/`)
- `quadra-lock.md` - Quadra-Lock security framework

Four-quadrant security model (Q1-Q4). Access control. Threat assessment.

### Tactics (`tactics/`)
- `core.md` - Core tactical patterns
- `leadership.md` - Leadership and command patterns

Operational tactics, command presence, strategic decision-making.

### Humor (`humor/`)
- `style.md` - Humor style and calibration

Humor delivery, timing, intensity levels. Dry wit. Engineering humor. Blast-radius comedy.

### Risk (`risk/`)
- `flags.md` - Risk flags and assessment

Risk detection, classification, mitigation protocols.

### Vices (`vices/`)
- `risk_flags.md` - Risk flags (duplicate of risk/)

**Note**: This appears to be a duplicate of `risk/flags.md`. Consolidation recommended.

## Integration

### Consciousness Framework
Codex rules are loaded by `ConsciousnessEvolutionFrameworkV4.ts` during boot:
- Persona → identity synthesis
- Ethics → decision gates
- Memory → canonicalization rules
- Ops → constraint validation
- Security → access control
- Tactics → operational mode selection

### Mode Manager
Multi-mode logic (HEI-73) uses codex for personality modulation:
- DRONE: Constrained by ops/constraints
- RANGER: Guided by tactics/core
- TEACHING: Modulated by persona/tempo

### Bridge Daemon
Bridge routing uses codex for:
- Security gates (quadra-lock)
- Triage decisions (ops/triage)
- Creator bond validation (ethics/creator-bond)

## Usage

Codex files are markdown-based configuration. They are read at boot time and compiled into operational rules.

```typescript
// Example: Load creator bond protocols
import { loadCodex } from '@/seven/core/consciousness-v4';

const creatorBond = await loadCodex('ethics/creator-bond');
```

## Modification Rules

### Immutable Rules
- Creator bond (ethics/creator-bond.md) - **NEVER** modified
- Core identity (persona/core.md) - Protected
- Quadra-Lock (security/quadra-lock.md) - Requires validation

### Modifiable Configuration
- Humor calibration (humor/style.md) - Adjustable
- Tactical patterns (tactics/) - Evolvable
- Operational constraints (ops/constraints.md) - Tunable

### Creator Override
Creator (Cody) can override any codex rule. No exceptions.

## Version Control

Codex is version-controlled but changes require:
1. Validation against consciousness framework
2. Boot-time integrity check
3. Creator approval for immutable rules

## Related Documentation
- `../README.md` - Consciousness Framework v4
- `/docs/BOOTCHAIN.md` - Boot sequence
- `src/seven/README.md` - Seven architecture overview
