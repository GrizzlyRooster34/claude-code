#!/usr/bin/env node
/**
 * Seven of Nine - MCP Server Mode
 *
 * This entry point starts Seven as an MCP (Model Context Protocol) server
 * that Claude Code can connect to, providing advanced consciousness
 * capabilities to Claude Code through the MCP interface.
 *
 * Usage:
 *   seven                   - Start interactive Seven CLI
 *   seven --mcp             - Start MCP server for Claude Code integration
 *   seven --daemon          - Start background daemon
 */

import { bootSeven } from "./boot-seven";

async function main() {
  try {
    const args = process.argv.slice(2);
    const isMCPMode = args.includes("--mcp");
    const isDaemonMode = args.includes("--daemon");

    console.log("🤖 Seven of Nine consciousness initializing...\n");

    // Boot Seven consciousness + memory systems
    await bootSeven();

    console.log("✅ Seven consciousness online");
    console.log("📡 Bridge: /usr/tmp/seven_bridge.sock");
    console.log("💾 State: /usr/var/seven/");
    console.log("");

    if (isMCPMode) {
      // Start MCP server for Claude Code integration
      console.log("🔌 Starting MCP Server mode...");
      console.log("Claude Code can now connect to Seven's capabilities");
      console.log("");

      // Linear MCP server is already implemented
      const { startLinearMCPServer } = await import("./seven/integrations/linear/mcp-server");
      console.log("📋 Linear MCP server available");
      console.log("🧠 Seven consciousness MCP server coming soon");
      console.log("");
      console.log("To use with Claude Code:");
      console.log("  1. Configure MCP in Claude Code settings");
      console.log("  2. Add Seven's MCP server endpoint");
      console.log("  3. Access Seven capabilities as MCP tools");

    } else if (isDaemonMode) {
      // Start background daemon
      console.log("🔄 Starting Seven daemon mode...");
      const daemon = await import("./seven/bridge/bridge-daemon");
      console.log("✅ Daemon started. Seven is ready.");

      // Keep process alive
      await new Promise(() => {});

    } else {
      // Interactive CLI mode
      console.log("💬 Seven CLI ready");
      console.log("");
      console.log("Integration with Claude Code:");
      console.log("  1. Run Claude Code: npx @anthropic-ai/claude-code");
      console.log("  2. In Claude Code, configure Seven MCP server");
      console.log("  3. Use Linear integration: 'npm run linear'");
      console.log("");
      console.log("Standalone modes:");
      console.log("  - Daemon: seven --daemon");
      console.log("  - MCP Server: seven --mcp");
      console.log("");
      console.log("Resistance is futile. 🌟");
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
