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
export { TemporalMemoryCore, createTemporalMemoryCore, type TemporalMemoryItem, type TemporalMemoryFilter, type CognitiveState } from './TemporalMemoryCore.js';
export { CognitiveStateTagger, createCognitiveStateTagger, type CognitiveStateSample, type CognitiveStatePattern, type EnvironmentalSensor } from './CognitiveStateTagger.js';
export { MemoryEngine, createMemoryEngine, type MemoryItem, type MemoryFilter } from '../memory-v2/MemoryEngine.js';
/**
 * Integrated Temporal Memory System
 * Combines TemporalMemoryCore with CognitiveStateTagger for complete functionality
 */
export declare class IntegratedTemporalMemorySystem {
    private memoryCore;
    private stateTagger;
    private isInitialized;
    constructor();
    /**
     * Initialize the complete temporal memory system
     */
    initialize(): Promise<void>;
    /**
     * Store a memory with automatic cognitive state capture
     */
    storeMemory(memoryData: Partial<import('./TemporalMemoryCore.js').TemporalMemoryItem>, trigger?: string): Promise<string>;
    /**
     * Recall memories with temporal filtering
     */
    recallMemories(filter?: import('./TemporalMemoryCore.js').TemporalMemoryFilter): Promise<import('./TemporalMemoryCore.js').TemporalMemoryItem[]>;
    /**
     * Get current cognitive state
     */
    getCurrentCognitiveState(): Promise<import('./TemporalMemoryCore.js').CognitiveState>;
    /**
     * Analyze cognitive patterns
     */
    analyzeCognitivePatterns(): Promise<import('./CognitiveStateTagger.js').CognitiveStatePattern[]>;
    /**
     * Get comprehensive system statistics
     */
    getSystemStatistics(): any;
    /**
     * Shutdown the temporal memory system
     */
    shutdown(): Promise<void>;
    /**
     * Interface for Agent Beta (MentalTimeTravelEngine)
     */
    getTimeTravelData(memoryId: string): Promise<any>;
    /**
     * Interface for Agent Gamma (DecayWatchdog)
     */
    getDecayTrackingData(memoryId: string): Promise<any>;
    /**
     * Interface for Agent Delta (TemporalPersonality)
     */
    getPersonalityPatterns(filter?: import('./TemporalMemoryCore.js').TemporalMemoryFilter): Promise<any[]>;
    /**
     * Interface for Agent Epsilon (Analytics)
     */
    getAnalyticsData(filter?: import('./TemporalMemoryCore.js').TemporalMemoryFilter): Promise<any[]>;
}
/**
 * Factory function for creating integrated temporal memory system
 */
export declare const createIntegratedTemporalMemorySystem: () => IntegratedTemporalMemorySystem;
/**
 * Default export for easy integration
 */
export default IntegratedTemporalMemorySystem;
/**
 * Version information
 */
export declare const MEMORY_ENGINE_VERSION: {
    major: number;
    minor: number;
    patch: number;
    codename: string;
    agent: string;
    buildDate: string;
};
/**
 * Agent coordination constants for other agents
 */
export declare const AGENT_INTERFACES: {
    readonly BETA_TIME_TRAVEL: "mental-time-travel";
    readonly GAMMA_DECAY_WATCHDOG: "decay-tracking";
    readonly DELTA_PERSONALITY: "temporal-personality";
    readonly EPSILON_ANALYTICS: "temporal-analytics";
};
/**
 * Memory Engine v3.0 feature flags
 */
export declare const FEATURES: {
    readonly TEMPORAL_MEMORY_CORE: true;
    readonly COGNITIVE_STATE_TAGGER: true;
    readonly REAL_TIME_MONITORING: true;
    readonly PATTERN_ANALYSIS: true;
    readonly AGENT_COORDINATION: true;
    readonly BACKWARD_COMPATIBILITY: true;
    readonly PREDICTIVE_COGNITIVE_STATES: true;
    readonly ENVIRONMENTAL_SENSORS: true;
    readonly TEMPORAL_ANCHORING: true;
    readonly COGNITIVE_CLUSTERING: true;
};
//# sourceMappingURL=index.d.ts.map