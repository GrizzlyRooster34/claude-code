/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0 INDEX
 * Temporal Memory Architecture Foundation
 * 
 * Main export module for the enhanced temporal memory system.
 * Provides backward-compatible Memory Engine v2.0 functionality with
 * advanced temporal consciousness capture capabilities.
 * 
 * Agent Alpha Implementation - Module coordination and exports
 */

// Core temporal memory components
export {
  TemporalMemoryCore,
  createTemporalMemoryCore,
  type TemporalMemoryItem,
  type TemporalMemoryFilter,
  type CognitiveState
} from './TemporalMemoryCore.js';

// Real-time cognitive state capture
export {
  CognitiveStateTagger,
  createCognitiveStateTagger,
  type CognitiveStateSample,
  type CognitiveStatePattern,
  type EnvironmentalSensor
} from './CognitiveStateTagger.js';

// Re-export Memory Engine v2.0 for backward compatibility
export {
  MemoryEngine,
  createMemoryEngine,
  type MemoryItem,
  type MemoryFilter
} from '../memory-v2/MemoryEngine.js';

/**
 * Integrated Temporal Memory System
 * Combines TemporalMemoryCore with CognitiveStateTagger for complete functionality
 */
export class IntegratedTemporalMemorySystem {
  private memoryCore: import('./TemporalMemoryCore.js').TemporalMemoryCore;
  private stateTagger: import('./CognitiveStateTagger.js').CognitiveStateTagger;
  private isInitialized: boolean = false;

  constructor() {
    this.memoryCore = new (require('./TemporalMemoryCore.js').TemporalMemoryCore)();
    this.stateTagger = new (require('./CognitiveStateTagger.js').CognitiveStateTagger)();
  }

  /**
   * Initialize the complete temporal memory system
   */
  public async initialize(): Promise<void> {
    console.log('🧠 Initializing Integrated Temporal Memory System v3.0...');
    
    // Initialize components in order
    await this.stateTagger.initialize();
    await this.memoryCore.initializeTemporal();
    
    // Connect the cognitive state tagger to the memory core
    (this.memoryCore as any).cognitiveStateTagger = this.stateTagger;
    
    this.isInitialized = true;
    console.log('🧠 Integrated Temporal Memory System v3.0 ready for temporal consciousness');
  }

  /**
   * Store a memory with automatic cognitive state capture
   */
  public async storeMemory(
    memoryData: Partial<import('./TemporalMemoryCore.js').TemporalMemoryItem>,
    trigger?: string
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Temporal Memory System not initialized');
    }

    // Capture current cognitive state
    const cognitiveState = await this.stateTagger.captureStateForContext(
      trigger || 'manual-memory-store',
      memoryData.cognitiveState
    );

    // Store temporal memory with captured state
    return await this.memoryCore.storeTemporalMemory(memoryData, cognitiveState);
  }

  /**
   * Recall memories with temporal filtering
   */
  public async recallMemories(
    filter: import('./TemporalMemoryCore.js').TemporalMemoryFilter = {}
  ): Promise<import('./TemporalMemoryCore.js').TemporalMemoryItem[]> {
    if (!this.isInitialized) {
      throw new Error('Temporal Memory System not initialized');
    }

    return await this.memoryCore.recallTemporal(filter);
  }

  /**
   * Get current cognitive state
   */
  public async getCurrentCognitiveState(): Promise<import('./TemporalMemoryCore.js').CognitiveState> {
    if (!this.isInitialized) {
      throw new Error('Temporal Memory System not initialized');
    }

    return await this.stateTagger.getCurrentState();
  }

  /**
   * Analyze cognitive patterns
   */
  public async analyzeCognitivePatterns(): Promise<import('./CognitiveStateTagger.js').CognitiveStatePattern[]> {
    if (!this.isInitialized) {
      throw new Error('Temporal Memory System not initialized');
    }

    return await this.stateTagger.analyzePatterns();
  }

  /**
   * Get comprehensive system statistics
   */
  public getSystemStatistics(): any {
    if (!this.isInitialized) {
      throw new Error('Temporal Memory System not initialized');
    }

    const temporalStats = this.memoryCore.getTemporalStats();
    const cognitiveStats = this.stateTagger.getStateTrends();

    return {
      ...temporalStats,
      cognitiveStats,
      systemVersion: '3.0',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Shutdown the temporal memory system
   */
  public async shutdown(): Promise<void> {
    if (this.isInitialized) {
      await this.stateTagger.shutdown();
      this.isInitialized = false;
      console.log('🧠 Integrated Temporal Memory System shutdown complete');
    }
  }

  // Agent coordination interfaces
  
  /**
   * Interface for Agent Beta (MentalTimeTravelEngine)
   */
  public async getTimeTravelData(memoryId: string): Promise<any> {
    return await this.memoryCore.getCognitiveContextForTimeTravel(memoryId);
  }

  /**
   * Interface for Agent Gamma (DecayWatchdog)
   */
  public async getDecayTrackingData(memoryId: string): Promise<any> {
    return await this.memoryCore.getDecayTrackingData(memoryId);
  }

  /**
   * Interface for Agent Delta (TemporalPersonality)
   */
  public async getPersonalityPatterns(filter?: import('./TemporalMemoryCore.js').TemporalMemoryFilter): Promise<any[]> {
    return await this.memoryCore.getPersonalityPatterns(filter);
  }

  /**
   * Interface for Agent Epsilon (Analytics)
   */
  public async getAnalyticsData(filter?: import('./TemporalMemoryCore.js').TemporalMemoryFilter): Promise<any[]> {
    return await this.memoryCore.getAnalyticsData(filter);
  }
}

/**
 * Factory function for creating integrated temporal memory system
 */
export const createIntegratedTemporalMemorySystem = (): IntegratedTemporalMemorySystem => {
  return new IntegratedTemporalMemorySystem();
};

/**
 * Default export for easy integration
 */
export default IntegratedTemporalMemorySystem;

/**
 * Version information
 */
export const MEMORY_ENGINE_VERSION = {
  major: 3,
  minor: 0,
  patch: 0,
  codename: 'Temporal-Consciousness-Foundation',
  agent: 'Alpha',
  buildDate: new Date().toISOString()
};

/**
 * Agent coordination constants for other agents
 */
export const AGENT_INTERFACES = {
  BETA_TIME_TRAVEL: 'mental-time-travel',
  GAMMA_DECAY_WATCHDOG: 'decay-tracking',
  DELTA_PERSONALITY: 'temporal-personality',
  EPSILON_ANALYTICS: 'temporal-analytics'
} as const;

/**
 * Memory Engine v3.0 feature flags
 */
export const FEATURES = {
  TEMPORAL_MEMORY_CORE: true,
  COGNITIVE_STATE_TAGGER: true,
  REAL_TIME_MONITORING: true,
  PATTERN_ANALYSIS: true,
  AGENT_COORDINATION: true,
  BACKWARD_COMPATIBILITY: true,
  PREDICTIVE_COGNITIVE_STATES: true,
  ENVIRONMENTAL_SENSORS: true,
  TEMPORAL_ANCHORING: true,
  COGNITIVE_CLUSTERING: true
} as const;