# Memory Engine v2

## Status: **Required (Legacy-In-Use)**

## Purpose
Second-generation memory engine with MemoryEngine class. Still required by transition scripts and some subsystems.

## What it does
- `MemoryEngine.ts` - Core memory engine implementation
- `episodic-memories.json` - Episodic memory data store
- Used by: Transition scripts, v2→v3 migration tools, some consciousness modules

## Dependencies
- Referenced by consciousness v3
- Used by migration scripts
- Should NOT be removed

## Key Features
- Structured memory storage
- Episodic memory support
- Foundation for v3 temporal architecture

## Migration Path
- Do not migrate. This is intentionally preserved for compatibility.
- New code should use memory-v3-amalgum.
- Existing v2 dependencies will be migrated gradually.

## Version History
- v1: Basic API interface
- **v2: MemoryEngine class** ← You are here
- v3: Temporal + episodic separation
- v3-amalgum: Current canonical
