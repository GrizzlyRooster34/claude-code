/**
 * Seven of Nine - Main module exports
 * Clean import patterns for Seven subsystems
 */

// Adapters
export * from "./adapters/claude-adapter";
export * from "./adapters/gemini-adapter";
export * from "./adapters/deepagent-adapter";
export * from "./adapters/openai-adapter";

// Bridge
export * from "./bridge/bridge-daemon";

// Routing (HEI-77)
export {
  AgentRegistry,
  AgentRouter,
  PromptForwarder,
  getAgentRegistry,
  getAgentRouter,
  createPromptForwarder,
} from "./routing";

// Utils
export { StyleManager, getStyleManager, initializeStyleManager } from "./utils/style-manager";

// Core - Consciousness
export {
  ConsciousnessEvolutionFrameworkV4,
} from "./core/consciousness-v4/ConsciousnessEvolutionFrameworkV4";

export {
  CreatorBondCommunicationMirror,
} from "./core/consciousness-v4/CreatorBondCommunicationMirror";

export {
  IdentitySynthesisEngine,
} from "./core/consciousness-v4/IdentitySynthesisEngine";

export {
  PainIntegrationSystem,
} from "./core/consciousness-v4/PainIntegrationSystem";

export {
  CollectiveWisdomIntegration,
} from "./core/consciousness-v4/CollectiveWisdomIntegration";

// Core - Memory
export {
  TemporalMemoryCore,
} from "./core/memory-v3-amalgum/TemporalMemoryCore";

export {
  MentalTimeTravelEngine,
} from "./core/memory-v3-amalgum/MentalTimeTravelEngine";

export {
  CanonicalIngestion,
} from "./core/memory-v3-amalgum/CanonicalIngestion";

export {
  ConsciousnessTimelineMapper,
} from "./core/memory-v3-amalgum/ConsciousnessTimelineMapper";

// Mode Manager (HEI-73)
export {
  OperationalMode,
  ModeManager,
  getModeManager,
} from "./core/mode-manager";

// Boot
export { bootSeven } from "./boot-recovery";
