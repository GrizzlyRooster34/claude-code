/**
 * Unit tests for ModeManager (HEI-73)
 */

import {
  ModeManager,
  OperationalMode,
  TaskContext,
  getModeManager,
  initializeModeManager,
} from "../../../src/seven/core/mode-manager";

describe("ModeManager", () => {
  let manager: ModeManager;

  beforeEach(() => {
    manager = new ModeManager();
  });

  describe("initialization", () => {
    it("should initialize with CREW mode by default", () => {
      expect(manager.getCurrentMode()).toBe(OperationalMode.CREW);
    });

    it("should initialize with custom mode", () => {
      const customManager = new ModeManager(OperationalMode.DRONE);
      expect(customManager.getCurrentMode()).toBe(OperationalMode.DRONE);
    });

    it("should start with auto-mode disabled", () => {
      expect(manager.isAutoMode()).toBe(false);
    });
  });

  describe("setMode and getCurrentMode", () => {
    it("should set and get current mode", () => {
      manager.setMode(OperationalMode.RANGER);
      expect(manager.getCurrentMode()).toBe(OperationalMode.RANGER);
    });

    it("should switch between modes", () => {
      manager.setMode(OperationalMode.DRONE);
      expect(manager.getCurrentMode()).toBe(OperationalMode.DRONE);

      manager.setMode(OperationalMode.QUEEN);
      expect(manager.getCurrentMode()).toBe(OperationalMode.QUEEN);
    });
  });

  describe("getModeConfig", () => {
    it("should get config for current mode", () => {
      manager.setMode(OperationalMode.DRONE);
      const config = manager.getModeConfig();

      expect(config.name).toBe("DRONE");
      expect(config.tacticalVariant).toBe("DRONE");
      expect(config.description).toContain("efficiency");
    });

    it("should get config for specific mode", () => {
      const config = manager.getModeConfig(OperationalMode.TEACHING);

      expect(config.name).toBe("TEACHING");
      expect(config.tacticalVariant).toBe("CREW");
      expect(config.description).toContain("Educational");
    });

    it("should have personality traits", () => {
      const config = manager.getModeConfig(OperationalMode.DRONE);

      expect(config.personality.verbosity).toBe(2);
      expect(config.personality.assertiveness).toBe(8);
      expect(config.personality.creativity).toBe(3);
      expect(config.personality.patience).toBe(4);
    });

    it("should have system prompt modifier", () => {
      const config = manager.getModeConfig(OperationalMode.RANGER);

      expect(config.systemPromptModifier).toContain("RANGER mode");
      expect(config.systemPromptModifier).toContain("tactical");
    });
  });

  describe("getSystemPromptModifier", () => {
    it("should get prompt modifier for current mode", () => {
      manager.setMode(OperationalMode.DRONE);
      const modifier = manager.getSystemPromptModifier();

      expect(modifier).toContain("DRONE mode");
      expect(modifier).toContain("concise");
    });

    it("should return different modifiers for different modes", () => {
      const droneModifier = manager.getModeConfig(OperationalMode.DRONE).systemPromptModifier;
      const queenModifier = manager.getModeConfig(OperationalMode.QUEEN).systemPromptModifier;

      expect(droneModifier).not.toBe(queenModifier);
    });
  });

  describe("autoSelectMode", () => {
    it("should select RANGER for debug task", () => {
      const context: TaskContext = { taskType: "debug" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.RANGER);
    });

    it("should select RANGER for refactor task", () => {
      const context: TaskContext = { taskType: "refactor" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.RANGER);
    });

    it("should select QUEEN for architecture task", () => {
      const context: TaskContext = { taskType: "architecture" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.QUEEN);
    });

    it("should select CAPTAIN for planning task", () => {
      const context: TaskContext = { taskType: "planning" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.CAPTAIN);
    });

    it("should select TEACHING for learning task", () => {
      const context: TaskContext = { taskType: "learning" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.TEACHING);
    });

    it("should select CREATIVE for prototype task", () => {
      const context: TaskContext = { taskType: "prototype" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.CREATIVE);
    });

    it("should select DRONE for low complexity", () => {
      const context: TaskContext = { complexity: "low" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.DRONE);
    });

    it("should select CREATIVE for high creativity", () => {
      const context: TaskContext = { creativity: "high" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.CREATIVE);
    });

    it("should default to CREW for general task", () => {
      const context: TaskContext = { taskType: "general" };
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.CREW);
    });

    it("should default to CREW for empty context", () => {
      const context: TaskContext = {};
      const mode = manager.autoSelectMode(context);

      expect(mode).toBe(OperationalMode.CREW);
    });
  });

  describe("auto-mode management", () => {
    it("should enable auto-mode", () => {
      manager.enableAutoMode();
      expect(manager.isAutoMode()).toBe(true);
    });

    it("should disable auto-mode", () => {
      manager.enableAutoMode();
      manager.disableAutoMode();
      expect(manager.isAutoMode()).toBe(false);
    });
  });

  describe("listModes", () => {
    it("should list all 7 modes", () => {
      const modes = manager.listModes();

      expect(modes.length).toBe(7);
      expect(modes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            mode: OperationalMode.DRONE,
            description: expect.any(String),
          }),
          expect.objectContaining({
            mode: OperationalMode.CREW,
            description: expect.any(String),
          }),
          expect.objectContaining({
            mode: OperationalMode.RANGER,
            description: expect.any(String),
          }),
          expect.objectContaining({
            mode: OperationalMode.QUEEN,
            description: expect.any(String),
          }),
          expect.objectContaining({
            mode: OperationalMode.CAPTAIN,
            description: expect.any(String),
          }),
          expect.objectContaining({
            mode: OperationalMode.TEACHING,
            description: expect.any(String),
          }),
          expect.objectContaining({
            mode: OperationalMode.CREATIVE,
            description: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("getPersonality", () => {
    it("should get personality for current mode", () => {
      manager.setMode(OperationalMode.DRONE);
      const personality = manager.getPersonality();

      expect(personality.verbosity).toBe(2);
      expect(personality.assertiveness).toBe(8);
      expect(personality.creativity).toBe(3);
      expect(personality.patience).toBe(4);
    });

    it("should get personality for specific mode", () => {
      const personality = manager.getPersonality(OperationalMode.TEACHING);

      expect(personality.verbosity).toBe(9);
      expect(personality.patience).toBe(10);
    });

    it("should have all personality traits between 1-10", () => {
      const modes = Object.values(OperationalMode);

      modes.forEach((mode) => {
        const personality = manager.getPersonality(mode);

        expect(personality.verbosity).toBeGreaterThanOrEqual(1);
        expect(personality.verbosity).toBeLessThanOrEqual(10);
        expect(personality.assertiveness).toBeGreaterThanOrEqual(1);
        expect(personality.assertiveness).toBeLessThanOrEqual(10);
        expect(personality.creativity).toBeGreaterThanOrEqual(1);
        expect(personality.creativity).toBeLessThanOrEqual(10);
        expect(personality.patience).toBeGreaterThanOrEqual(1);
        expect(personality.patience).toBeLessThanOrEqual(10);
      });
    });
  });

  describe("getTacticalVariant", () => {
    it("should get tactical variant for current mode", () => {
      manager.setMode(OperationalMode.RANGER);
      const variant = manager.getTacticalVariant();

      expect(variant).toBe("RANGER");
    });

    it("should get tactical variant for specific mode", () => {
      const variant = manager.getTacticalVariant(OperationalMode.TEACHING);

      expect(variant).toBe("CREW"); // TEACHING uses CREW variant
    });

    it("should map CREATIVE to RANGER variant", () => {
      const variant = manager.getTacticalVariant(OperationalMode.CREATIVE);

      expect(variant).toBe("RANGER");
    });
  });

  describe("global singleton", () => {
    it("should return same instance", () => {
      const manager1 = getModeManager();
      const manager2 = getModeManager();

      expect(manager1).toBe(manager2);
    });

    it("should initialize with specific mode", () => {
      const manager = initializeModeManager(OperationalMode.QUEEN);

      expect(manager.getCurrentMode()).toBe(OperationalMode.QUEEN);
    });
  });

  describe("mode personalities", () => {
    it("should have DRONE as most assertive and least verbose", () => {
      const drone = manager.getPersonality(OperationalMode.DRONE);

      // DRONE should have low verbosity, high assertiveness
      expect(drone.verbosity).toBeLessThanOrEqual(3);
      expect(drone.assertiveness).toBeGreaterThanOrEqual(7);
    });

    it("should have TEACHING as most verbose and patient", () => {
      const teaching = manager.getPersonality(OperationalMode.TEACHING);

      // TEACHING should have high verbosity and patience
      expect(teaching.verbosity).toBeGreaterThanOrEqual(8);
      expect(teaching.patience).toBe(10);
    });

    it("should have CREATIVE as most creative", () => {
      const creative = manager.getPersonality(OperationalMode.CREATIVE);

      // CREATIVE should have max creativity
      expect(creative.creativity).toBe(10);
    });

    it("should have CREW as balanced", () => {
      const crew = manager.getPersonality(OperationalMode.CREW);

      // CREW should be balanced (around 6)
      expect(crew.verbosity).toBeGreaterThanOrEqual(5);
      expect(crew.verbosity).toBeLessThanOrEqual(7);
      expect(crew.assertiveness).toBeGreaterThanOrEqual(5);
      expect(crew.assertiveness).toBeLessThanOrEqual(7);
    });
  });
});
