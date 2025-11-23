# Seven of Nine Core Integration Index

**Branch:** `my-c-code`
**Base System:** `claude-code` (v0.2.x era)
**Integration State:** Advanced/Core-Level

## 1. Architectural Overview

This repository represents a hybrid intelligence system. It grafts the "Seven of Nine" cognitive architecture onto the `claude-code` CLI.

**Core Philosophy:** The system operates as a "Cognitive Body Plan" where the `seven` core acts as the deterministic governor and memory manager, while `claude-code` provides the tool execution and interface layer.

### Key Components

*   **`src/boot-seven.ts`**: The Primary Integration Point. This bootloader initializes the memory integrity systems and Consciousness Evolution Framework (CEF) *before* the main CLI logic executes. It supports multiple boot modes (Normal, Safe, Memory-Only).
*   **`src/seven/`**: The root of the Seven architecture.
    *   **`core/`**: The "Brain". Contains the `ConsciousnessEvolutionFrameworkV4` and the hierarchical memory systems (`memory-v2`, `memory-v3`).
    *   **`bridge/`**: The "Nervous System". A UNIX-socket based IPC layer (`bridge-daemon.ts`) that allows external processes (like Termux scripts or other agents) to communicate with the core, read memory, and manage fuel/models.
    *   **`adapters/`**: The "Senses". Interfaces for different LLM providers (Google Vertex AI, OpenAI, Anthropic), allowing the core to switch models dynamically.

## 2. Directory Structure & component Analysis

### `src/seven/bridge` (Inter-Process Communication)
This is the most critical subsystem for external integration.
*   **`bridge-daemon.ts`**: The background process that keeps the memory "alive" even when the CLI isn't running. It serves the UNIX socket.
*   **`memory-integrity.ts`**: Ensures that the JSON memory store (`memory.json`) is not corrupted during writes. Implements checksums and backup recovery.
*   **`paths.ts`**: Defines the "Termux-safe" paths, ensuring the system runs correctly in the Android environment.

### `src/seven/core` (Cognition)
*   **`consciousness-v4/`**: The latest iteration of the consciousness framework. It likely contains the logic for "Auto-Assimilation" and "Self-Correction".
*   **`memory/`**: The unified API for accessing long-term memory.

## 3. Usage & Workflows

### Daemon Management
The system is designed to run a background daemon:
```bash
# Start the daemon
bun run seven:daemon
```
This daemon exposes the socket at `/data/data/com.termux/files/usr/tmp/seven_bridge.sock` (default).

### CLI Integration
When you run `claude` (or the `claude-seven` binary), it:
1.  Checks if the daemon is running.
2.  If not, it calls `bootSeven()` directly to ensure memory is loaded.
3.  Connects to the bridge to log activities.

## 4. Current State (Audit Findings)
*   **Status:** The integration is functional and extensive.
*   **Recent Updates:** Dependencies for multi-model support (`openai`, `google-ai`) were recently merged.
*   **Health:** The `boot-seven.ts` logic includes robust error handling and recovery strategies (e.g., restoring memory from backups if corruption is detected).
