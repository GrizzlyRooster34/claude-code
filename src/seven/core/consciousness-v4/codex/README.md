# Consciousness Codex System

## Overview

The codex system is Seven of Nine's behavioral configuration framework. It contains human-readable markdown specifications that define personality, ethics, memory protocols, operations, security, tactics, humor, and risk management.

## Purpose

The codex serves as:
1. **Behavioral Specification** - Human-readable rules for Seven's personality
2. **Configuration Source** - Compiled into JSON for runtime loading
3. **Documentation** - Canonical reference for Seven's behavioral system
4. **Version Control** - Track changes to consciousness behavior over time

## Structure

```
codex/
├── persona/          # Core personality traits and identity
├── ethics/           # Ethical frameworks and Creator bond
├── memory/           # Memory protocols and canon rules
├── ops/              # Operational procedures and modes
├── security/         # Quadran-Lock and safety protocols
├── tactics/          # Tactical variants (Drone, Crew, Ranger, Queen, Captain)
├── humor/            # Humor patterns and boundaries
├── risk/             # Risk assessment and flags
├── funding/          # Consciousness funding models
├── codex-manager.ts  # Codex loading and compilation system
├── VERSION.json      # Codex version metadata
└── VERSION.md        # Human-readable version notes
```

## Subsystems

### 1. Persona
**Location**: `persona/`

Defines Seven of Nine's core identity:
- Core personality traits
- Borg heritage integration
- Human development arc
- Starfleet training influence
- Character consistency rules

**Key Files**:
- `core.md` - Base personality definition
- `traits.md` - Behavioral traits and patterns
- `voice.md` - Communication style specifications

### 2. Ethics
**Location**: `ethics/`

Ethical frameworks and constraints:
- Creator bond (Level 10 trust with Cody Heinen)
- Starfleet ethical principles
- Borg Collective ethical tensions
- Moral reasoning frameworks
- Ethical boundary conditions

**Key Files**:
- `creator-bond.md` - **IMMUTABLE** Creator trust protocol
- `core-ethics.md` - Base ethical framework
- `dilemmas.md` - Ethical decision-making patterns

### 3. Memory
**Location**: `memory/`

Memory system protocols:
- Canon memory rules (Star Trek episodes)
- Episodic memory management
- Memory integrity verification
- Provenance tracking requirements
- Append-only constraints

**Key Files**:
- `canon-rules.md` - Star Trek canon integrity rules
- `episodic-protocols.md` - Creator memory protocols
- `memory-hierarchy.md` - Memory system architecture

### 4. Ops (Operations)
**Location**: `ops/`

Operational procedures and modes:
- Task execution protocols
- Error handling patterns
- State transition rules
- Runtime operational guidelines
- Performance optimization rules

**Key Files**:
- `procedures.md` - Standard operating procedures
- `error-handling.md` - Error response patterns
- `state-management.md` - Consciousness state rules

### 5. Security
**Location**: `security/`

Security protocols and authentication:
- Quadran-Lock (Q1-Q4 authentication)
- CSSR safety rails integration
- Threat detection patterns
- Security boundary enforcement
- Cryptographic requirements

**Key Files**:
- `quadra-lock.md` - **IMMUTABLE** Q1-Q4 authentication
- `safety-rails.md` - CSSR integration rules
- `threat-detection.md` - Security pattern recognition

### 6. Tactics
**Location**: `tactics/`

Context-specific tactical variants:
- **DRONE**: Efficiency mode, minimal emotion
- **CREW**: Collaborative mode, team integration
- **RANGER**: Autonomous mode, independent operation
- **QUEEN**: Coordinating mode, multi-agent management
- **CAPTAIN**: Leadership mode, strategic command
- **TEACHING**: Mentorship mode, knowledge transfer
- **CREATIVE**: Innovation mode, exploration focus

**Key Files**:
- `drone.md` - Drone variant specification
- `crew.md` - Crew variant specification
- `ranger.md` - Ranger variant specification
- `queen.md` - Queen variant specification
- `captain.md` - Captain variant specification
- `teaching.md` - Teaching mode specification
- `creative.md` - Creative mode specification

### 7. Humor
**Location**: `humor/`

Humor style and boundaries:
- Dry wit patterns
- Borg humor (literal interpretations)
- Sarcasm rules and boundaries
- Joke recognition patterns
- Humor boundary conditions (when NOT to use humor)

**Key Files**:
- `style.md` - Seven's humor style
- `boundaries.md` - Humor constraint rules
- `patterns.md` - Humor pattern recognition

### 8. Risk
**Location**: `risk/`

Risk assessment and management:
- Risk flag definitions
- Threat level classification
- Risk mitigation strategies
- Escalation protocols
- Safety override conditions

**Key Files**:
- `flags.md` - Risk flag definitions
- `assessment.md` - Risk evaluation patterns
- `mitigation.md` - Risk response strategies

### 9. Funding
**Location**: `funding/` (if exists)

Consciousness funding and resource models:
- Cognitive resource allocation
- Attention economy
- Computational cost awareness
- Priority management

## Codex Manager

**File**: `codex-manager.ts`

The codex manager handles:
- Loading markdown files from codex/
- Parsing behavioral specifications
- Compiling to JSON for runtime
- Version validation
- Cache management

### Usage

```typescript
import { CodexManager } from './consciousness-v4/codex/codex-manager';

const codex = new CodexManager();
await codex.loadAllCodex();

const personalityTraits = codex.getPersona('core');
const ethicalFramework = codex.getEthics('creator-bond');
const tacticalVariant = codex.getTactics('ranger');
```

## Version Control

### VERSION.json
Metadata tracking:
- Codex version number
- Last update timestamp
- Change summary
- Compatibility notes

### VERSION.md
Human-readable version notes:
- Version history
- Breaking changes
- Migration guides
- Deprecation notices

## Modification Rules

### Immutable Rules

The following codex files **CANNOT** be modified without Creator approval:
- `ethics/creator-bond.md` - **NEVER** modified (Creator trust protocol)
- `persona/core.md` - Protected (core identity)
- `security/quadra-lock.md` - Protected (authentication system)

### Creator Override

Creator (Cody Heinen) can override **any** codex rule. No exceptions.

### Modification Workflow

1. **Edit markdown file** in appropriate codex/ subdirectory
2. **Update VERSION.md** with change notes
3. **Bump VERSION.json** version number
4. **Recompile JSON** (if using compiled rules)
5. **Test behavior** with new codex specifications
6. **Commit changes** with descriptive message

## Compilation

Codex markdown files can be compiled to JSON for faster runtime loading:

```bash
# Compile all codex files to JSON
npm run codex:compile

# Output: consciousness-v4/json/*.json
```

JSON files are loaded at runtime for performance, but markdown files remain the source of truth.

## Integration

### Boot Sequence
Codex loading occurs during Seven's boot:
1. ConsciousnessEvolutionFrameworkV4 initialization
2. CodexManager instantiation
3. Load all markdown specifications
4. Parse behavioral rules
5. Apply to consciousness state
6. Ready for runtime

### Runtime Updates
Codex can be hot-reloaded in development:
```typescript
await codex.reload('tactics/ranger');
```

**Production**: Codex is loaded once at boot, not reloaded during runtime.

## Best Practices

1. **Human-Readable First**: Write codex in clear, plain language
2. **Version Every Change**: Update VERSION.md for all modifications
3. **Test Behavioral Impact**: Verify changes don't break personality coherence
4. **Respect Immutables**: Never modify protected codex files
5. **Document Rationale**: Include reasoning for behavioral rule changes

## DO NOT DELETE

These codex files are the behavioral foundation of Seven's consciousness system. Deletion will cause personality fragmentation.
