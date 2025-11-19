/**
 * Agent Registry for HEI-77
 * Manages available LLM agents and their capabilities
 */

export interface AgentCapabilities {
  tasks: string[]; // ["coding", "analysis", "debugging", "documentation"]
  languages: string[]; // ["typescript", "python", "rust"]
  speed: "fast" | "medium" | "slow";
  cost: "low" | "medium" | "high";
  contextWindow: number; // Token limit
  streaming: boolean;
}

export interface AgentConfig {
  name: string;
  adapter: string; // "claude", "gemini", "openai", etc.
  capabilities: AgentCapabilities;
  priority: number; // Higher = preferred
  available: () => Promise<boolean>;
}

/**
 * Registry of available LLM agents
 */
export class AgentRegistry {
  private agents: Map<string, AgentConfig>;

  constructor() {
    this.agents = new Map();
    this.registerDefaultAgents();
  }

  /**
   * Register a new agent
   */
  registerAgent(config: AgentConfig): void {
    this.agents.set(config.name, config);
  }

  /**
   * Get agent by name
   */
  getAgent(name: string): AgentConfig | undefined {
    return this.agents.get(name);
  }

  /**
   * List all registered agents
   */
  listAgents(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Find agents by capability
   */
  findAgentsByCapability(capability: string): AgentConfig[] {
    return Array.from(this.agents.values()).filter((agent) =>
      agent.capabilities.tasks.includes(capability)
    );
  }

  /**
   * Find agents by language support
   */
  findAgentsByLanguage(language: string): AgentConfig[] {
    return Array.from(this.agents.values()).filter((agent) =>
      agent.capabilities.languages.includes(language)
    );
  }

  /**
   * Get available agents (checks availability)
   */
  async getAvailableAgents(): Promise<AgentConfig[]> {
    const agents = this.listAgents();
    const available: AgentConfig[] = [];

    for (const agent of agents) {
      if (await agent.available()) {
        available.push(agent);
      }
    }

    return available;
  }

  /**
   * Register default agents (Claude, Gemini, DeepAgent, OpenAI)
   */
  private registerDefaultAgents(): void {
    // Claude - High-quality, versatile
    this.registerAgent({
      name: "claude",
      adapter: "claude",
      capabilities: {
        tasks: ["coding", "analysis", "debugging", "documentation", "refactoring", "architecture"],
        languages: ["typescript", "javascript", "python", "rust", "go", "java", "c", "cpp"],
        speed: "medium",
        cost: "high",
        contextWindow: 200000,
        streaming: true,
      },
      priority: 10,
      available: async () => !!process.env.ANTHROPIC_API_KEY,
    });

    // Gemini - Fast, affordable
    this.registerAgent({
      name: "gemini",
      adapter: "gemini",
      capabilities: {
        tasks: ["coding", "analysis", "documentation"],
        languages: ["typescript", "javascript", "python", "go", "java"],
        speed: "fast",
        cost: "low",
        contextWindow: 1000000, // Gemini 2.5 Flash has 1M context
        streaming: true,
      },
      priority: 8,
      available: async () => !!process.env.GOOGLE_API_KEY,
    });

    // DeepAgent - Analysis specialist
    this.registerAgent({
      name: "deepagent",
      adapter: "deepagent",
      capabilities: {
        tasks: ["analysis", "architecture", "documentation", "research"],
        languages: ["typescript", "javascript", "python"],
        speed: "slow",
        cost: "medium",
        contextWindow: 128000,
        streaming: false,
      },
      priority: 9,
      available: async () => true, // Always available (local)
    });

    // OpenAI - Solid all-rounder
    this.registerAgent({
      name: "openai",
      adapter: "openai",
      capabilities: {
        tasks: ["coding", "debugging", "documentation", "refactoring"],
        languages: ["typescript", "javascript", "python", "rust", "go"],
        speed: "medium",
        cost: "medium",
        contextWindow: 128000,
        streaming: true,
      },
      priority: 7,
      available: async () => !!process.env.OPENAI_API_KEY,
    });
  }
}

/**
 * Global singleton instance
 */
let globalRegistry: AgentRegistry | null = null;

/**
 * Get or create global agent registry
 */
export function getAgentRegistry(): AgentRegistry {
  if (!globalRegistry) {
    globalRegistry = new AgentRegistry();
  }
  return globalRegistry;
}
