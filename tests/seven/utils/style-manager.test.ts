/**
 * Unit tests for StyleManager (HEI-72)
 */

import { StyleManager, initializeStyleManager } from "../../../src/seven/utils/style-manager";
import { join } from "path";

describe("StyleManager", () => {
  let manager: StyleManager;
  const configPath = join(process.cwd(), "config/output-styles.json");

  beforeEach(() => {
    manager = new StyleManager();
  });

  describe("loadStyles", () => {
    it("should load styles from config file", async () => {
      await manager.loadStyles(configPath);

      expect(manager.isLoaded()).toBe(true);
      expect(manager.getVersion()).toBe("1.0.0");
    });

    it("should throw error if file not found", async () => {
      await expect(
        manager.loadStyles("/nonexistent/path.json")
      ).rejects.toThrow();
    });

    it("should use default style from config", async () => {
      await manager.loadStyles(configPath);

      expect(manager.getCurrentStyleName()).toBe("balanced");
    });
  });

  describe("getStyle", () => {
    beforeEach(async () => {
      await manager.loadStyles(configPath);
    });

    it("should get current style when no name provided", () => {
      const style = manager.getStyle();

      expect(style.name).toBe("Balanced");
      expect(style.settings.verbosity).toBe("medium");
    });

    it("should get specific style by name", () => {
      const style = manager.getStyle("concise");

      expect(style.name).toBe("Concise");
      expect(style.settings.verbosity).toBe("low");
      expect(style.settings.explanations).toBe(false);
    });

    it("should throw error if style not found", () => {
      expect(() => manager.getStyle("nonexistent")).toThrow();
    });

    it("should throw error if styles not loaded", () => {
      const unloadedManager = new StyleManager();
      expect(() => unloadedManager.getStyle()).toThrow("Styles not loaded");
    });
  });

  describe("setStyle", () => {
    beforeEach(async () => {
      await manager.loadStyles(configPath);
    });

    it("should change current style", () => {
      manager.setStyle("concise");

      expect(manager.getCurrentStyleName()).toBe("concise");
      expect(manager.getCurrentStyle().name).toBe("Concise");
    });

    it("should throw error if style not found", () => {
      expect(() => manager.setStyle("nonexistent")).toThrow();
    });

    it("should throw error if styles not loaded", () => {
      const unloadedManager = new StyleManager();
      expect(() => unloadedManager.setStyle("concise")).toThrow("Styles not loaded");
    });
  });

  describe("listStyles", () => {
    beforeEach(async () => {
      await manager.loadStyles(configPath);
    });

    it("should list all available styles", () => {
      const styles = manager.listStyles();

      expect(styles.length).toBeGreaterThanOrEqual(5);
      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "concise",
            description: expect.any(String),
          }),
          expect.objectContaining({
            name: "balanced",
            description: expect.any(String),
          }),
          expect.objectContaining({
            name: "verbose",
            description: expect.any(String),
          }),
        ])
      );
    });

    it("should throw error if styles not loaded", () => {
      const unloadedManager = new StyleManager();
      expect(() => unloadedManager.listStyles()).toThrow("Styles not loaded");
    });
  });

  describe("getSystemPromptModifier", () => {
    beforeEach(async () => {
      await manager.loadStyles(configPath);
    });

    it("should generate prompt modifier for concise style", () => {
      manager.setStyle("concise");
      const prompt = manager.getSystemPromptModifier();

      expect(prompt).toContain("concise");
      expect(prompt).toContain("action-focused");
      expect(prompt).toContain("Do not explain");
    });

    it("should generate prompt modifier for verbose style", () => {
      manager.setStyle("verbose");
      const prompt = manager.getSystemPromptModifier();

      expect(prompt).toContain("detailed");
      expect(prompt).toContain("learning");
    });

    it("should generate prompt modifier for tactical style", () => {
      manager.setStyle("tactical");
      const prompt = manager.getSystemPromptModifier();

      expect(prompt).toContain("status markers");
      expect(prompt).toContain("bullet points");
    });

    it("should generate prompt modifier for seven-tactical style", () => {
      manager.setStyle("seven-tactical");
      const prompt = manager.getSystemPromptModifier();

      expect(prompt).toContain("tactical");
      expect(prompt).toContain("inner monologue");
    });

    it("should include response length limit", () => {
      manager.setStyle("concise");
      const prompt = manager.getSystemPromptModifier();

      expect(prompt).toContain("500 characters");
    });
  });

  describe("style settings", () => {
    beforeEach(async () => {
      await manager.loadStyles(configPath);
    });

    it("should have correct settings for concise style", () => {
      const style = manager.getStyle("concise");

      expect(style.settings.verbosity).toBe("low");
      expect(style.settings.explanations).toBe(false);
      expect(style.settings.codeComments).toBe(false);
      expect(style.settings.emojiUsage).toBe("none");
      expect(style.settings.bulletPoints).toBe(true);
      expect(style.settings.maxResponseLength).toBe(500);
    });

    it("should have correct settings for balanced style", () => {
      const style = manager.getStyle("balanced");

      expect(style.settings.verbosity).toBe("medium");
      expect(style.settings.explanations).toBe(true);
      expect(style.settings.codeComments).toBe(true);
      expect(style.settings.emojiUsage).toBe("minimal");
      expect(style.settings.maxResponseLength).toBe(1500);
    });

    it("should have correct settings for verbose style", () => {
      const style = manager.getStyle("verbose");

      expect(style.settings.verbosity).toBe("high");
      expect(style.settings.explanations).toBe(true);
      expect(style.settings.includeExamples).toBe(true);
      expect(style.settings.maxResponseLength).toBe(3000);
    });

    it("should have correct settings for tactical style", () => {
      const style = manager.getStyle("tactical");

      expect(style.settings.verbosity).toBe("low");
      expect(style.settings.emojiUsage).toBe("icons");
      expect(style.settings.statusMarkers).toBe(true);
      expect(style.settings.maxResponseLength).toBe(800);
    });

    it("should have correct settings for seven-tactical style", () => {
      const style = manager.getStyle("seven-tactical");

      expect(style.settings.verbosity).toBe("medium");
      expect(style.settings.tacticalMarkers).toBe(true);
      expect(style.settings.innerMonologue).toBe(true);
      expect(style.settings.maxResponseLength).toBe(2000);
    });
  });

  describe("global style manager", () => {
    it("should initialize global style manager", async () => {
      const manager1 = await initializeStyleManager(configPath);
      const manager2 = await initializeStyleManager(configPath);

      // Should return the same instance
      expect(manager1).toBe(manager2);
    });
  });

  describe("custom default style", () => {
    it("should use custom default style in constructor", () => {
      const customManager = new StyleManager("concise");

      expect(customManager.getCurrentStyleName()).toBe("concise");
    });

    it("should override constructor default with config default", async () => {
      const customManager = new StyleManager("concise");
      await customManager.loadStyles(configPath);

      // Config default ("balanced") should override constructor default
      expect(customManager.getCurrentStyleName()).toBe("balanced");
    });
  });
});
