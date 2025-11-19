/**
 * Unit tests for Agent Routing (HEI-77)
 */

import {
  AgentRegistry,
  AgentRouter,
  PromptForwarder,
  RoutingContext,
  LLMAdapter,
} from "../../../src/seven/routing";

describe("Agent Routing System", () => {
  describe("AgentRegistry", () => {
    let registry: AgentRegistry;

    beforeEach(() => {
      registry = new AgentRegistry();
    });

    it("should register default agents", () => {
      const agents = registry.listAgents();

      expect(agents.length).toBeGreaterThanOrEqual(4); // Claude, Gemini, DeepAgent, OpenAI
      expect(agents.map(a => a.name)).toContain("claude");
      expect(agents.map(a => a.name)).toContain("gemini");
      expect(agents.map(a => a.name)).toContain("deepagent");
      expect(agents.map(a => a.name)).toContain("openai");
    });

    it("should get agent by name", () => {
      const claude = registry.getAgent("claude");

      expect(claude).toBeDefined();
      expect(claude?.name).toBe("claude");
      expect(claude?.adapter).toBe("claude");
    });

    it("should return undefined for nonexistent agent", () => {
      const agent = registry.getAgent("nonexistent");

      expect(agent).toBeUndefined();
    });

    it("should find agents by capability", () => {
      const codingAgents = registry.findAgentsByCapability("coding");

      expect(codingAgents.length).toBeGreaterThan(0);
      expect(codingAgents.every(a => a.capabilities.tasks.includes("coding"))).toBe(true);
    });

    it("should find agents by language", () => {
      const pythonAgents = registry.findAgentsByLanguage("python");

      expect(pythonAgents.length).toBeGreaterThan(0);
      expect(pythonAgents.every(a => a.capabilities.languages.includes("python"))).toBe(true);
    });

    it("should register custom agent", () => {
      registry.registerAgent({
        name: "custom",
        adapter: "custom-adapter",
        capabilities: {
          tasks: ["custom-task"],
          languages: ["custom-lang"],
          speed: "fast",
          cost: "low",
          contextWindow: 50000,
          streaming: true,
        },
        priority: 5,
        available: async () => true,
      });

      const custom = registry.getAgent("custom");
      expect(custom).toBeDefined();
      expect(custom?.name).toBe("custom");
    });

    it("should have correct agent capabilities", () => {
      const claude = registry.getAgent("claude");

      expect(claude?.capabilities.tasks).toContain("coding");
      expect(claude?.capabilities.languages).toContain("typescript");
      expect(claude?.capabilities.contextWindow).toBeGreaterThan(100000);
      expect(claude?.capabilities.streaming).toBe(true);
    });
  });

  describe("AgentRouter", () => {
    let router: AgentRouter;
    let registry: AgentRegistry;

    beforeEach(() => {
      registry = new AgentRegistry();
      router = new AgentRouter(registry);

      // Mock environment variables for availability
      process.env.ANTHROPIC_API_KEY = "test-key";
      process.env.GOOGLE_API_KEY = "test-key";
    });

    afterEach(() => {
      delete process.env.ANTHROPIC_API_KEY;
      delete process.env.GOOGLE_API_KEY;
    });

    it("should route to preferred agent if specified", async () => {
      const context: RoutingContext = {
        task: "coding",
        preferredAgent: "claude",
      };

      const decision = await router.route(context);

      expect(decision.agent.name).toBe("claude");
      expect(decision.reason).toContain("User-specified");
    });

    it("should route based on task capability", async () => {
      const context: RoutingContext = {
        task: "coding",
      };

      const decision = await router.route(context);

      expect(decision.agent.capabilities.tasks).toContain("coding");
    });

    it("should filter by language", async () => {
      const context: RoutingContext = {
        task: "coding",
        language: "rust",
      };

      const decision = await router.route(context);

      expect(decision.agent.capabilities.languages).toContain("rust");
    });

    it("should prioritize fast agents for urgent tasks", async () => {
      const context: RoutingContext = {
        task: "coding",
        urgency: "high",
      };

      const decision = await router.route(context);

      // Should prefer fast or medium speed agents
      expect(["fast", "medium"]).toContain(decision.agent.capabilities.speed);
    });

    it("should prioritize low-cost agents for low budget", async () => {
      const context: RoutingContext = {
        task: "coding",
        budget: "low",
      };

      const decision = await router.route(context);

      // Should prefer low or medium cost agents
      expect(["low", "medium"]).toContain(decision.agent.capabilities.cost);
    });

    it("should provide fallback agents", async () => {
      const context: RoutingContext = {
        task: "coding",
      };

      const decision = await router.route(context);

      expect(decision.fallbacks.length).toBeGreaterThan(0);
      expect(decision.fallbacks.length).toBeLessThanOrEqual(2);
      expect(decision.fallbacks.every(f => f.name !== decision.agent.name)).toBe(true);
    });

    it("should throw error if no agents available for task", async () => {
      const context: RoutingContext = {
        task: "nonexistent-task",
      };

      await expect(router.route(context)).rejects.toThrow("No agents found");
    });

    it("should throw error if no agents support language", async () => {
      const context: RoutingContext = {
        task: "coding",
        language: "nonexistent-language",
      };

      await expect(router.route(context)).rejects.toThrow();
    });

    it("should get routing statistics", async () => {
      const stats = await router.getRoutingStats();

      expect(stats.totalAgents).toBeGreaterThan(0);
      expect(stats.byTask).toBeDefined();
      expect(stats.byTask.coding).toBeGreaterThan(0);
    });
  });

  describe("PromptForwarder", () => {
    let forwarder: PromptForwarder;
    let router: AgentRouter;
    let registry: AgentRegistry;
    let mockAdapters: Map<string, LLMAdapter>;

    beforeEach(() => {
      registry = new AgentRegistry();
      router = new AgentRouter(registry);

      // Create mock adapters
      mockAdapters = new Map<string, LLMAdapter>();

      mockAdapters.set("claude", {
        send: jest.fn().mockResolvedValue("Claude response"),
      });

      mockAdapters.set("gemini", {
        send: jest.fn().mockResolvedValue("Gemini response"),
      });

      forwarder = new PromptForwarder(router, mockAdapters);

      // Mock environment
      process.env.ANTHROPIC_API_KEY = "test-key";
      process.env.GOOGLE_API_KEY = "test-key";
    });

    afterEach(() => {
      delete process.env.ANTHROPIC_API_KEY;
      delete process.env.GOOGLE_API_KEY;
    });

    it("should forward prompt to primary agent", async () => {
      const result = await forwarder.forward("Test prompt", {
        task: "coding",
        preferredAgent: "claude",
      });

      expect(result.agent).toBe("claude");
      expect(result.fallbackUsed).toBe(false);
      expect(result.response).toContain("Claude");
    });

    it("should use fallback if primary fails", async () => {
      // Make claude fail
      const claudeAdapter = mockAdapters.get("claude")!;
      (claudeAdapter.send as jest.Mock).mockRejectedValue(new Error("Claude failed"));

      const result = await forwarder.forward("Test prompt", {
        task: "coding",
      });

      expect(result.fallbackUsed).toBe(true);
      expect(result.agent).not.toBe("claude");
    });

    it("should throw if all agents fail", async () => {
      // Make all adapters fail
      mockAdapters.forEach(adapter => {
        (adapter.send as jest.Mock).mockRejectedValue(new Error("Failed"));
      });

      await expect(
        forwarder.forward("Test prompt", { task: "coding" })
      ).rejects.toThrow("All agents failed");
    });

    it("should forward to explicit agent", async () => {
      const result = await forwarder.forwardToAgent("Test prompt", "gemini");

      expect(result.agent).toBe("gemini");
      expect(result.response).toContain("Gemini");
    });

    it("should check adapter availability", () => {
      expect(forwarder.hasAdapter("claude")).toBe(true);
      expect(forwarder.hasAdapter("nonexistent")).toBe(false);
    });

    it("should list available adapters", () => {
      const adapters = forwarder.listAdapters();

      expect(adapters).toContain("claude");
      expect(adapters).toContain("gemini");
    });
  });

  describe("Integration", () => {
    it("should route and forward prompt end-to-end", async () => {
      const registry = new AgentRegistry();
      const router = new AgentRouter(registry);

      const mockAdapters = new Map<string, LLMAdapter>();
      mockAdapters.set("claude", {
        send: jest.fn().mockResolvedValue("End-to-end response"),
      });

      const forwarder = new PromptForwarder(router, mockAdapters);

      process.env.ANTHROPIC_API_KEY = "test-key";

      const result = await forwarder.forward("Test prompt", {
        task: "coding",
        language: "typescript",
        complexity: "high",
      });

      expect(result.response).toBe("End-to-end response");
      expect(result.fallbackUsed).toBe(false);

      delete process.env.ANTHROPIC_API_KEY;
    });
  });
});
