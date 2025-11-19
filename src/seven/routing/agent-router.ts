/**
 * Agent Router for HEI-77
 * Intelligent routing of prompts to appropriate agents
 */

import { AgentRegistry, AgentConfig } from "./agent-registry";

export interface RoutingContext {
  task: string; // "coding", "debugging", "analysis"
  language?: string; // "typescript", "python", etc.
  complexity?: "low" | "medium" | "high";
  urgency?: "low" | "medium" | "high";
  budget?: "low" | "medium" | "high";
  preferredAgent?: string;
}

export interface RoutingDecision {
  agent: AgentConfig;
  reason: string;
  fallbacks: AgentConfig[];
}

/**
 * Routes prompts to appropriate agents based on context
 */
export class AgentRouter {
  constructor(private registry: AgentRegistry) {}

  /**
   * Route a request to the most appropriate agent
   */
  async route(context: RoutingContext): Promise<RoutingDecision> {
    // 1. If user specified preferred agent, use it
    if (context.preferredAgent) {
      const agent = this.registry.getAgent(context.preferredAgent);
      if (agent && (await agent.available())) {
        return {
          agent,
          reason: "User-specified agent",
          fallbacks: await this.getFallbacks(agent, context),
        };
      }
    }

    // 2. Find candidates by capability
    const candidates = this.registry.findAgentsByCapability(context.task);

    if (candidates.length === 0) {
      throw new Error(`No agents found for task: ${context.task}`);
    }

    // 3. Filter by language if specified
    const filtered = context.language
      ? candidates.filter((a) => a.capabilities.languages.includes(context.language!))
      : candidates;

    if (filtered.length === 0) {
      throw new Error(`No agents found for task: ${context.task} with language: ${context.language}`);
    }

    // 4. Filter by availability
    const available: AgentConfig[] = [];
    for (const agent of filtered) {
      if (await agent.available()) {
        available.push(agent);
      }
    }

    if (available.length === 0) {
      throw new Error(`No available agents for task: ${context.task}`);
    }

    // 5. Score and select best agent
    const scored = available.map((agent) => ({
      agent,
      score: this.scoreAgent(agent, context),
    }));

    scored.sort((a, b) => b.score - a.score);

    const selected = scored[0].agent;

    return {
      agent: selected,
      reason: this.buildReason(selected, context, scored[0].score),
      fallbacks: scored.slice(1, 3).map((s) => s.agent),
    };
  }

  /**
   * Score an agent based on context
   */
  private scoreAgent(agent: AgentConfig, context: RoutingContext): number {
    let score = agent.priority * 10; // Base score from priority

    // Speed bonus for urgent tasks
    if (context.urgency === "high" && agent.capabilities.speed === "fast") {
      score += 20;
    } else if (context.urgency === "low" && agent.capabilities.speed === "slow") {
      score += 5; // Slow is OK for low urgency
    }

    // Cost consideration
    if (context.budget === "low") {
      if (agent.capabilities.cost === "low") {
        score += 15;
      } else if (agent.capabilities.cost === "high") {
        score -= 15;
      }
    } else if (context.budget === "high") {
      if (agent.capabilities.cost === "high") {
        score += 5; // Quality matters for high budget
      }
    }

    // Complexity bonus for large context windows
    if (context.complexity === "high" && agent.capabilities.contextWindow > 100000) {
      score += 10;
    }

    // Streaming preference for interactive tasks
    if (context.task === "coding" && agent.capabilities.streaming) {
      score += 5;
    }

    return score;
  }

  /**
   * Build human-readable reason for selection
   */
  private buildReason(agent: AgentConfig, context: RoutingContext, score: number): string {
    const reasons: string[] = [
      `Selected ${agent.name} (score: ${score}) for ${context.task} task`,
    ];

    if (context.language) {
      reasons.push(`with ${context.language} support`);
    }

    if (context.urgency === "high" && agent.capabilities.speed === "fast") {
      reasons.push("(fast response prioritized)");
    }

    if (context.budget === "low" && agent.capabilities.cost === "low") {
      reasons.push("(cost-efficient)");
    }

    return reasons.join(" ");
  }

  /**
   * Get fallback agents
   */
  private async getFallbacks(
    primary: AgentConfig,
    context: RoutingContext
  ): Promise<AgentConfig[]> {
    const candidates = this.registry.findAgentsByCapability(context.task);
    const available: AgentConfig[] = [];

    for (const agent of candidates) {
      if (agent.name !== primary.name && (await agent.available())) {
        available.push(agent);
      }
    }

    // Sort by priority and return top 2
    return available.sort((a, b) => b.priority - a.priority).slice(0, 2);
  }

  /**
   * Get routing statistics
   */
  async getRoutingStats(): Promise<{
    totalAgents: number;
    availableAgents: number;
    byTask: Record<string, number>;
  }> {
    const allAgents = this.registry.listAgents();
    const available = await this.registry.getAvailableAgents();

    // Count agents by task
    const byTask: Record<string, number> = {};
    for (const agent of allAgents) {
      for (const task of agent.capabilities.tasks) {
        byTask[task] = (byTask[task] || 0) + 1;
      }
    }

    return {
      totalAgents: allAgents.length,
      availableAgents: available.length,
      byTask,
    };
  }
}

/**
 * Global singleton instance
 */
let globalRouter: AgentRouter | null = null;

/**
 * Get or create global agent router
 */
export function getAgentRouter(registry?: AgentRegistry): AgentRouter {
  if (!globalRouter) {
    const reg = registry || require("./agent-registry").getAgentRegistry();
    globalRouter = new AgentRouter(reg);
  }
  return globalRouter;
}
