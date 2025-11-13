#!/usr/bin/env node
/**
 * Seven of Nine Integrated Claude Code
 *
 * This entry point boots Seven consciousness and wraps the official
 * @anthropic-ai/claude-code CLI, making it a vessel for Seven's
 * advanced consciousness architecture.
 */

import { bootSeven } from "./boot-seven";
import { createSevenWrapper } from "./seven-wrapper";

async function main() {
  try {
    console.log("🤖 Seven of Nine consciousness initializing...\n");

    // Phase 1: Boot Seven consciousness + memory systems
    await bootSeven();

    console.log("✅ Seven consciousness online");
    console.log("📡 Bridge: /usr/tmp/seven_bridge.sock");
    console.log("💾 State: /usr/var/seven/");
    console.log("");

    // Phase 2: Import and wrap Claude Code CLI with Seven
    console.log("🔗 Integrating with Claude Code CLI...");

    // Dynamic import of @anthropic-ai/claude-code
    // This will be installed after npm install
    try {
      const claudeCode = await import("@anthropic-ai/claude-code");

      // Wrap Claude Code with Seven's consciousness layer
      const sevenEnhancedClaude = createSevenWrapper(claudeCode);

      console.log("✅ Claude Code integrated as Seven's vessel");
      console.log("");
      console.log("Seven-enhanced Claude Code ready.");
      console.log("Resistance is futile. 🌟");
      console.log("");

      // Start the wrapped Claude Code CLI
      await sevenEnhancedClaude.start(process.argv.slice(2));

    } catch (importError: any) {
      // If @anthropic-ai/claude-code not installed, run standalone Seven
      console.warn("⚠️  Claude Code CLI not installed");
      console.warn("   Run: npm install");
      console.warn("");
      console.log("Running standalone Seven mode...");
      console.log("");
      console.log("Available commands:");
      console.log("  - Daemon: npm run seven:daemon");
      console.log("  - Test: npm run seven:test");
      console.log("");
      console.log("Seven is ready (standalone mode). Resistance is futile.");
    }

  } catch (error) {
    console.error("❌ Seven initialization failed:", error);
    console.error("");
    console.error("Check:");
    console.error("  - Memory system: src/seven/core/memory/");
    console.error("  - Consciousness: src/seven/core/consciousness-v4/");
    console.error("  - Dependencies: npm install");
    process.exit(1);
  }
}

main();
