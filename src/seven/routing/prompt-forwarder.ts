/**
 * Prompt Forwarder for HEI-77
 * Forwards prompts to agents with automatic fallback
 */

import { AgentRouter, RoutingContext } from "./agent-router";

export interface LLMAdapter {
  send(prompt: string): Promise<string>;
}

export interface ForwardResult {
  response: string;
  agent: string;
  fallbackUsed: boolean;
}

/**
 * Forwards prompts to appropriate agents with fallback handling
 */
export class PromptForwarder {
  constructor(
    private router: AgentRouter,
    private adapters: Map<string, LLMAdapter>
  ) {}

  /**
   * Forward a prompt to the appropriate agent
   */
  async forward(
    prompt: string,
    context: RoutingContext
  ): Promise<ForwardResult> {
    const decision = await this.router.route(context);

    try {
      const adapter = this.adapters.get(decision.agent.adapter);
      if (!adapter) {
        throw new Error(`Adapter not found: ${decision.agent.adapter}`);
      }

      const response = await adapter.send(prompt);

      return {
        response,
        agent: decision.agent.name,
        fallbackUsed: false,
      };
    } catch (error) {
      // Try fallbacks
      for (const fallback of decision.fallbacks) {
        try {
          const fallbackAdapter = this.adapters.get(fallback.adapter);
          if (!fallbackAdapter) {
            continue;
          }

          const response = await fallbackAdapter.send(prompt);

          return {
            response,
            agent: fallback.name,
            fallbackUsed: true,
          };
        } catch (fallbackError) {
          // Continue to next fallback
          continue;
        }
      }

      // All attempts failed
      throw new Error(
        `All agents failed. Primary: ${decision.agent.name}, Fallbacks: ${decision.fallbacks.map(f => f.name).join(", ")}`
      );
    }
  }

  /**
   * Forward with explicit agent selection
   */
  async forwardToAgent(
    prompt: string,
    agentName: string
  ): Promise<ForwardResult> {
    return this.forward(prompt, {
      task: "general",
      preferredAgent: agentName,
    });
  }

  /**
   * Check if adapter is available
   */
  hasAdapter(adapterName: string): boolean {
    return this.adapters.has(adapterName);
  }

  /**
   * List available adapters
   */
  listAdapters(): string[] {
    return Array.from(this.adapters.keys());
  }
}

/**
 * Create a PromptForwarder with default configuration
 */
export function createPromptForwarder(
  router?: AgentRouter,
  adapters?: Map<string, LLMAdapter>
): PromptForwarder {
  const routerInstance = router || require("./agent-router").getAgentRouter();
  const adaptersMap = adapters || new Map<string, LLMAdapter>();

  return new PromptForwarder(routerInstance, adaptersMap);
}
