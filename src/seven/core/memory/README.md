# Memory Engine v1

## Status: **Required (Legacy-In-Use)**

## Purpose
Original memory API interface. Still required by legacy integration points and external systems.

## What it does
- Provides `api.ts` - minimal memory interface
- Used by: Legacy scripts, external integrations
- Should NOT be removed

## Dependencies
- None (standalone interface)

## Migration Path
- Do not migrate. This is intentionally preserved for compatibility.
- New code should use memory-v3-amalgum.

## Version History
- v1: Original memory interface
- v2: Added MemoryEngine class
- v3: Temporal + episodic architecture
- v3-amalgum: Current canonical (with canonicalization)
