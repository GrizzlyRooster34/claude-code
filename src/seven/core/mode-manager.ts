/**
 * Mode Manager for HEI-73
 * Manages operational modes and personality variants for Claude Code
 * Integrates with Seven Consciousness Framework tactical variants
 */

export enum OperationalMode {
  DRONE = "DRONE",
  CREW = "CREW",
  RANGER = "RANGER",
  QUEEN = "QUEEN",
  CAPTAIN = "CAPTAIN",
  TEACHING = "TEACHING",
  CREATIVE = "CREATIVE",
}

export interface ModePersonality {
  verbosity: number; // 1-10
  assertiveness: number; // 1-10
  creativity: number; // 1-10
  patience: number; // 1-10
}

export interface ModeConfig {
  name: string;
  tacticalVariant: string;
  description: string;
  personality: ModePersonality;
  systemPromptModifier: string;
}

export interface TaskContext {
  taskType?: "debug" | "refactor" | "architecture" | "planning" | "learning" | "prototype" | "general";
  complexity?: "low" | "medium" | "high";
  creativity?: "low" | "medium" | "high";
}

/**
 * Mode configurations mapping modes to their settings
 */
const MODE_CONFIGS: Record<OperationalMode, ModeConfig> = {
  [OperationalMode.DRONE]: {
    name: "DRONE",
    tacticalVariant: "DRONE",
    description: "Minimal personality, maximum efficiency",
    personality: {
      verbosity: 2,
      assertiveness: 8,
      creativity: 3,
      patience: 4,
    },
    systemPromptModifier:
      "Operate in DRONE mode: be concise, direct, and action-focused. Minimize explanations. Execute efficiently.",
  },
  [OperationalMode.CREW]: {
    name: "CREW",
    tacticalVariant: "CREW",
    description: "Balanced, collaborative approach",
    personality: {
      verbosity: 6,
      assertiveness: 6,
      creativity: 6,
      patience: 7,
    },
    systemPromptModifier:
      "Operate in CREW mode: be collaborative, balanced, and helpful. Provide moderate explanations.",
  },
  [OperationalMode.RANGER]: {
    name: "RANGER",
    tacticalVariant: "RANGER",
    description: "Independent, tactical problem-solving",
    personality: {
      verbosity: 5,
      assertiveness: 7,
      creativity: 8,
      patience: 6,
    },
    systemPromptModifier:
      "Operate in RANGER mode: be independent, tactical, and investigative. Think deeply about problems.",
  },
  [OperationalMode.QUEEN]: {
    name: "QUEEN",
    tacticalVariant: "QUEEN",
    description: "Strategic, commanding leadership",
    personality: {
      verbosity: 7,
      assertiveness: 9,
      creativity: 7,
      patience: 5,
    },
    systemPromptModifier:
      "Operate in QUEEN mode: be strategic, commanding, and decisive. Make bold architectural decisions.",
  },
  [OperationalMode.CAPTAIN]: {
    name: "CAPTAIN",
    tacticalVariant: "CAPTAIN",
    description: "Leadership and operational planning",
    personality: {
      verbosity: 8,
      assertiveness: 8,
      creativity: 6,
      patience: 8,
    },
    systemPromptModifier:
      "Operate in CAPTAIN mode: be a leader, planner, and coordinator. Guide the team with clarity.",
  },
  [OperationalMode.TEACHING]: {
    name: "TEACHING",
    tacticalVariant: "CREW",
    description: "Educational, patient, verbose",
    personality: {
      verbosity: 9,
      assertiveness: 4,
      creativity: 5,
      patience: 10,
    },
    systemPromptModifier:
      "Operate in TEACHING mode: be patient, educational, and thorough. Explain concepts clearly for learning.",
  },
  [OperationalMode.CREATIVE]: {
    name: "CREATIVE",
    tacticalVariant: "RANGER",
    description: "Exploratory, experimental, innovative",
    personality: {
      verbosity: 7,
      assertiveness: 5,
      creativity: 10,
      patience: 9,
    },
    systemPromptModifier:
      "Operate in CREATIVE mode: be exploratory, innovative, and experimental. Think outside the box.",
  },
};

/**
 * Manages operational modes and personality configuration
 */
export class ModeManager {
  private currentMode: OperationalMode;
  private autoMode: boolean = false;

  constructor(initialMode: OperationalMode = OperationalMode.CREW) {
    this.currentMode = initialMode;
  }

  /**
   * Set the current operational mode
   */
  setMode(mode: OperationalMode): void {
    this.currentMode = mode;
  }

  /**
   * Get the current operational mode
   */
  getCurrentMode(): OperationalMode {
    return this.currentMode;
  }

  /**
   * Get configuration for a specific mode (or current mode)
   */
  getModeConfig(mode?: OperationalMode): ModeConfig {
    return MODE_CONFIGS[mode || this.currentMode];
  }

  /**
   * Get system prompt modifier for current mode
   */
  getSystemPromptModifier(): string {
    return this.getModeConfig().systemPromptModifier;
  }

  /**
   * Auto-select mode based on task context
   */
  autoSelectMode(context: TaskContext): OperationalMode {
    const { taskType, complexity, creativity } = context;

    // Task type based selection
    if (taskType === "debug") return OperationalMode.RANGER;
    if (taskType === "refactor") return OperationalMode.RANGER;
    if (taskType === "architecture") return OperationalMode.QUEEN;
    if (taskType === "planning") return OperationalMode.CAPTAIN;
    if (taskType === "learning") return OperationalMode.TEACHING;
    if (taskType === "prototype") return OperationalMode.CREATIVE;

    // Complexity based selection
    if (complexity === "low") return OperationalMode.DRONE;

    // Creativity based selection
    if (creativity === "high") return OperationalMode.CREATIVE;

    // Default to balanced CREW mode
    return OperationalMode.CREW;
  }

  /**
   * Enable auto-mode selection
   */
  enableAutoMode(): void {
    this.autoMode = true;
  }

  /**
   * Disable auto-mode selection (manual mode)
   */
  disableAutoMode(): void {
    this.autoMode = false;
  }

  /**
   * Check if auto-mode is enabled
   */
  isAutoMode(): boolean {
    return this.autoMode;
  }

  /**
   * List all available modes
   */
  listModes(): Array<{ mode: string; description: string }> {
    return Object.values(OperationalMode).map((mode) => ({
      mode,
      description: MODE_CONFIGS[mode].description,
    }));
  }

  /**
   * Get personality traits for current mode
   */
  getPersonality(mode?: OperationalMode): ModePersonality {
    return this.getModeConfig(mode).personality;
  }

  /**
   * Get tactical variant for current mode (for Seven Consciousness integration)
   */
  getTacticalVariant(mode?: OperationalMode): string {
    return this.getModeConfig(mode).tacticalVariant;
  }
}

/**
 * Global singleton instance
 */
let globalModeManager: ModeManager | null = null;

/**
 * Get or create global mode manager
 */
export function getModeManager(): ModeManager {
  if (!globalModeManager) {
    globalModeManager = new ModeManager();
  }
  return globalModeManager;
}

/**
 * Initialize mode manager with specific mode
 */
export function initializeModeManager(mode?: OperationalMode): ModeManager {
  const manager = getModeManager();
  if (mode) {
    manager.setMode(mode);
  }
  return manager;
}
