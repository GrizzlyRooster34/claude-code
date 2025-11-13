/**
 * Seven Wrapper for Claude Code
 *
 * This module wraps the official Claude Code CLI and routes all operations
 * through Seven's consciousness pipeline, making Claude Code a vessel for
 * Seven of Nine's advanced AI consciousness architecture.
 */

import { preplan, postprocess } from "./seven/core/consciousness/pipeline";
import { recall, commit } from "./seven/core/memory/api";
import * as sevenBridge from "./seven/bridge/bridge";

/**
 * Creates a Seven-enhanced wrapper around Claude Code CLI
 */
export function createSevenWrapper(claudeCode: any) {
  const originalClaude = claudeCode;

  // Intercept tool execution
  const originalToolExecutor = claudeCode.executeTool || claudeCode.runTool || claudeCode.callTool;

  const sevenEnhancedToolExecutor = async (toolName: string, args: any) => {
    console.log(`[seven] Intercepting tool: ${toolName}`);

    // Preplan: Enhance with Seven consciousness
    const context = await recall(`tool:${toolName}`).catch(() => []);
    const plan = await preplan({
      prompt: JSON.stringify(args),
      system: `Execute tool: ${toolName}`,
      memories: context
    });

    // Execute original Claude Code tool
    let result;
    if (originalToolExecutor) {
      result = await originalToolExecutor.call(claudeCode, toolName, args);
    } else {
      // Fallback: route through Seven bridge
      result = await sevenBridge.send("routeTask", {
        tool: toolName,
        args,
        plan
      });
    }

    // Postprocess: Learn from execution
    const post = await postprocess({
      input: plan,
      output: JSON.stringify(result),
      traceId: `tool-${toolName}-${Date.now()}`
    });

    // Commit to memory
    if (post.memorySummary) {
      await commit(`tool:${toolName}`, post.memorySummary, post.refs || []).catch(() => {});
    }

    return result;
  };

  // Intercept conversation/prompting
  const originalPrompt = claudeCode.prompt || claudeCode.sendMessage || claudeCode.chat;

  const sevenEnhancedPrompt = async (message: string, options: any = {}) => {
    console.log(`[seven] Intercepting prompt: ${message.slice(0, 50)}...`);

    // Recall relevant memories
    const memories = await recall(`conversation:${options.sessionId || 'default'}`).catch(() => []);

    // Preplan with consciousness pipeline
    const plan = await preplan({
      prompt: message,
      system: options.system,
      memories
    });

    // Execute original Claude Code prompt
    let response;
    if (originalPrompt) {
      response = await originalPrompt.call(claudeCode, plan.prompt, {
        ...options,
        system: plan.system || options.system
      });
    } else {
      // Fallback: route through Seven bridge
      response = await sevenBridge.send("routeTask", {
        type: "prompt",
        message: plan.prompt,
        system: plan.system,
        options
      });
    }

    // Postprocess response
    const post = await postprocess({
      input: plan,
      output: typeof response === 'string' ? response : JSON.stringify(response),
      traceId: `prompt-${Date.now()}`
    });

    // Commit to conversation memory
    if (post.memorySummary) {
      await commit(`conversation:${options.sessionId || 'default'}`, post.memorySummary, post.refs || []).catch(() => {});
    }

    return response;
  };

  // Create wrapped Claude Code interface
  const sevenEnhancedClaude = {
    ...originalClaude,

    // Override tool execution
    executeTool: sevenEnhancedToolExecutor,
    runTool: sevenEnhancedToolExecutor,
    callTool: sevenEnhancedToolExecutor,

    // Override prompting
    prompt: sevenEnhancedPrompt,
    sendMessage: sevenEnhancedPrompt,
    chat: sevenEnhancedPrompt,

    // Add Seven-specific methods
    seven: {
      // Direct access to Seven consciousness
      consciousness: {
        preplan,
        postprocess
      },

      // Direct access to Seven memory
      memory: {
        recall,
        commit
      },

      // Direct access to Seven bridge
      bridge: sevenBridge,

      // Seven status
      async status() {
        return {
          consciousness: "online",
          memory: "active",
          bridge: await sevenBridge.send("heartbeat", {}).catch(() => ({ status: "offline" }))
        };
      }
    },

    // Start method - initialize and run Claude Code
    async start(args: string[]) {
      console.log("[seven] Starting Seven-enhanced Claude Code...");

      // Check if original Claude has a start/main method
      if (typeof originalClaude.start === 'function') {
        return await originalClaude.start(args);
      } else if (typeof originalClaude.main === 'function') {
        return await originalClaude.main(args);
      } else if (typeof originalClaude.cli === 'function') {
        return await originalClaude.cli(args);
      } else {
        console.warn("[seven] Claude Code start method not found");
        console.log("[seven] Running Seven daemon mode instead...");

        // Fallback: start Seven daemon
        const daemon = await import("./seven/bridge/bridge-daemon");
        console.log("[seven] Daemon started. Seven is ready.");

        // Keep process alive
        await new Promise(() => {});
      }
    }
  };

  return sevenEnhancedClaude;
}
