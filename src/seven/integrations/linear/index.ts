/**
 * Linear Integration - Complete System Export
 *
 * Seven-Enhanced Linear Integration
 */

// Core Client
export { LinearClient, LinearConfig, LinearIssue, LinearProject, LinearTeam, LinearComment, LinearWebhook } from "./client";

// Seven-Integrated Service
export { LinearService, LinearServiceConfig, getLinearService, initializeLinear } from "./service";

// MCP Server for Claude Code
export { LinearMCPServer, MCPTool, getLinearMCPServer, registerLinearMCP } from "./mcp-server";

// CLI Interface
export { LinearCLI, CLICommand, runLinearCLI } from "./cli";

// Webhooks
export {
  LinearWebhookServer,
  WebhookEvent,
  WebhookHandler,
  startLinearWebhooks,
  stopLinearWebhooks,
  getLinearWebhookServer,
} from "./webhooks";

// Quick Start Utilities
export async function quickStart(apiKey: string, options?: {
  teamId?: string;
  enableWebhooks?: boolean;
  webhookPort?: number;
  autoSync?: boolean;
}) {
  const { initializeLinear } = await import("./service");
  const { registerLinearMCP } = await import("./mcp-server");
  const { startLinearWebhooks } = await import("./webhooks");

  console.log("[linear] 🚀 Starting Linear integration...");

  // Initialize service
  const service = await initializeLinear({
    apiKey,
    teamId: options?.teamId,
    autoSync: options?.autoSync ?? true,
  });

  console.log("[linear] ✅ Service initialized");

  // Register MCP tools
  const mcp = registerLinearMCP();
  console.log(`[linear] ✅ Registered ${mcp.getTools().length} MCP tools`);

  // Start webhooks if enabled
  if (options?.enableWebhooks) {
    const webhooks = startLinearWebhooks(options.webhookPort);
    console.log(`[linear] ✅ Webhooks server started`);
  }

  console.log("[linear] 🎉 Integration ready!");

  return { service, mcp };
}
