/**
 * Style Manager for HEI-72
 * Manages output styles configuration for Claude Code responses
 */

import { readFile } from "fs/promises";
import { join } from "path";

export interface OutputStyleSettings {
  verbosity: "low" | "medium" | "high";
  explanations: boolean;
  codeComments: boolean;
  emojiUsage: "none" | "minimal" | "moderate" | "icons" | "tactical";
  bulletPoints: boolean;
  maxResponseLength: number;
  includeExamples?: boolean;
  statusMarkers?: boolean;
  tacticalMarkers?: boolean;
  innerMonologue?: boolean;
}

export interface OutputStyle {
  name: string;
  description: string;
  settings: OutputStyleSettings;
}

export interface OutputStylesConfig {
  version: string;
  default: string;
  styles: Record<string, OutputStyle>;
}

/**
 * Manages loading and applying output styles
 */
export class StyleManager {
  private config: OutputStylesConfig | null = null;
  private currentStyle: string;

  constructor(defaultStyle?: string) {
    this.currentStyle = defaultStyle || "balanced";
  }

  /**
   * Load styles from configuration file
   */
  async loadStyles(configPath?: string): Promise<void> {
    const path = configPath || join(process.cwd(), "config/output-styles.json");

    try {
      const content = await readFile(path, "utf-8");
      this.config = JSON.parse(content);

      // Use default style from config if available
      if (this.config.default) {
        this.currentStyle = this.config.default;
      }
    } catch (error) {
      throw new Error(`Failed to load styles from ${path}: ${error}`);
    }
  }

  /**
   * Get a specific style (or current style if not specified)
   */
  getStyle(styleName?: string): OutputStyle {
    if (!this.config) {
      throw new Error("Styles not loaded. Call loadStyles() first.");
    }

    const name = styleName || this.currentStyle;
    const style = this.config.styles[name];

    if (!style) {
      throw new Error(`Style "${name}" not found. Available styles: ${this.listStyles().map(s => s.name).join(", ")}`);
    }

    return style;
  }

  /**
   * Set the active style
   */
  setStyle(styleName: string): void {
    if (!this.config) {
      throw new Error("Styles not loaded. Call loadStyles() first.");
    }

    if (!this.config.styles[styleName]) {
      throw new Error(`Style "${styleName}" not found. Available styles: ${this.listStyles().map(s => s.name).join(", ")}`);
    }

    this.currentStyle = styleName;
  }

  /**
   * Get the current style
   */
  getCurrentStyle(): OutputStyle {
    return this.getStyle(this.currentStyle);
  }

  /**
   * Get current style name
   */
  getCurrentStyleName(): string {
    return this.currentStyle;
  }

  /**
   * List all available styles
   */
  listStyles(): Array<{ name: string; description: string }> {
    if (!this.config) {
      throw new Error("Styles not loaded. Call loadStyles() first.");
    }

    return Object.entries(this.config.styles).map(([key, style]) => ({
      name: key,
      description: style.description,
    }));
  }

  /**
   * Generate system prompt modifier based on current style
   */
  getSystemPromptModifier(): string {
    const style = this.getCurrentStyle();
    const { settings } = style;

    let prompt = "";

    // Verbosity guidance
    if (settings.verbosity === "low") {
      prompt += " Be concise and action-focused. Minimize explanations.";
    } else if (settings.verbosity === "high") {
      prompt += " Provide detailed explanations for learning purposes.";
    } else {
      prompt += " Balance brevity with clarity.";
    }

    // Explanation preferences
    if (!settings.explanations) {
      prompt += " Do not explain your reasoning unless asked.";
    }

    // Formatting preferences
    if (settings.bulletPoints) {
      prompt += " Use bullet points for clarity.";
    }

    // Emoji usage
    if (settings.emojiUsage === "none") {
      prompt += " Do not use emojis.";
    } else if (settings.emojiUsage === "tactical") {
      prompt += " Use tactical markers (🎯, 📌, ✅, 🚧) for status.";
    } else if (settings.emojiUsage === "icons") {
      prompt += " Use icons sparingly for emphasis.";
    }

    // Status markers
    if (settings.statusMarkers) {
      prompt += " Prefix actions with status markers (✅ done, 📌 in progress, 🚧 blocked).";
    }

    // Tactical markers
    if (settings.tacticalMarkers) {
      prompt += " Use tactical ops markers (🎯 target, ⚡ action, 🔍 analysis).";
    }

    // Inner monologue
    if (settings.innerMonologue) {
      prompt += " Include brief inner monologue for self-reflection.";
    }

    // Response length
    prompt += ` Keep responses under ${settings.maxResponseLength} characters when possible.`;

    return prompt;
  }

  /**
   * Check if style is loaded
   */
  isLoaded(): boolean {
    return this.config !== null;
  }

  /**
   * Get config version
   */
  getVersion(): string | null {
    return this.config?.version || null;
  }
}

/**
 * Global style manager instance
 */
let globalStyleManager: StyleManager | null = null;

/**
 * Get or create global style manager
 */
export function getStyleManager(): StyleManager {
  if (!globalStyleManager) {
    globalStyleManager = new StyleManager();
  }
  return globalStyleManager;
}

/**
 * Initialize global style manager with config
 */
export async function initializeStyleManager(configPath?: string): Promise<StyleManager> {
  const manager = getStyleManager();
  await manager.loadStyles(configPath);
  return manager;
}
