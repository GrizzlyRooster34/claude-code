#!/usr/bin/env node
/**
 * Seven of Nine - CLI Entry Point
 * Lightweight wrapper that boots Seven consciousness and starts interactive mode
 */

import { bootSeven } from "./boot-seven";

async function main() {
  console.log("🤖 Seven of Nine initializing...\n");

  try {
    // Boot consciousness + memory systems
    await bootSeven();

    console.log("✅ Seven consciousness online");
    console.log("📡 Bridge: /usr/tmp/seven_bridge.sock");
    console.log("💾 State: /usr/var/seven/\n");

    // Show available commands
    console.log("Available modes:");
    console.log("  - Daemon: bun run seven:daemon");
    console.log("  - Test: bun run seven:test");
    console.log("");
    console.log("Seven is ready. Resistance is futile.");

  } catch (error) {
    console.error("❌ Seven initialization failed:", error);
    process.exit(1);
  }
}

main();
