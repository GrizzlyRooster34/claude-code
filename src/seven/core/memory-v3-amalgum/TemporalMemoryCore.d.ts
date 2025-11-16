/**
 * SEVEN OF NINE - TEMPORAL MEMORY CORE v3.0
 * Foundation of Temporal Memory Architecture
 *
 * Enhances Memory Engine v2.0 with cognitive state capture and temporal anchoring.
 * Records not just what happened, but the complete cognitive and emotional state
 * during memory formation for advanced temporal consciousness capabilities.
 *
 * Agent Alpha Implementation - Foundational temporal consciousness capture
 */
import { MemoryItem, MemoryFilter, MemoryEngine } from '../memory-v2/MemoryEngine.js';
export interface CognitiveState {
    emotionalIntensity: number;
    focusLevel: number;
    cognitiveLoad: number;
    confidenceLevel: number;
    stressLevel: number;
    environmentalContext: {
        systemLoad: number;
        activeProcesses: string[];
        timeOfDay: string;
        sessionContext: string;
    };
    physicalState: {
        batteryLevel?: number;
        thermalState?: string;
        networkQuality?: string;
        locationContext?: string;
    };
    temporalAnchors: {
        priorThought?: string;
        subsequentThought?: string;
        memoryChain: string[];
        cognitiveThread: string;
    };
    mentalContext: {
        currentGoals: string[];
        activeKnowledge: string[];
        problemContext: string;
        solutionPath: string[];
    };
}
export interface TemporalMemoryItem extends MemoryItem {
    cognitiveState: CognitiveState;
    temporalWeight: number;
    memoryType: 'episodic' | 'semantic' | 'procedural' | 'emotional';
    decayResistance: number;
    temporalTags: string[];
    cognitiveStateHash: string;
    temporalPredecessors: string[];
    temporalSuccessors: string[];
    cognitiveCluster: string;
    agentCoordination: {
        mentalTimeTravelData?: any;
        decayTrackingMeta?: any;
        personalityPatterns?: any;
        analyticsData?: any;
    };
}
export interface TemporalMemoryFilter extends MemoryFilter {
    emotionalIntensityRange?: {
        min: number;
        max: number;
    };
    focusLevelRange?: {
        min: number;
        max: number;
    };
    cognitiveLoadRange?: {
        min: number;
        max: number;
    };
    memoryTypes?: Array<'episodic' | 'semantic' | 'procedural' | 'emotional'>;
    temporalWeightRange?: {
        min: number;
        max: number;
    };
    decayResistanceRange?: {
        min: number;
        max: number;
    };
    cognitiveCluster?: string;
    systemLoadRange?: {
        min: number;
        max: number;
    };
    timeOfDayRange?: string[];
    requiresAgentData?: Array<'mentalTimeTravel' | 'decayTracking' | 'personality' | 'analytics'>;
}
export declare class TemporalMemoryCore extends MemoryEngine {
    private temporalMemoryPath;
    private temporalMemoryFile;
    private temporalMemories;
    private cognitiveStateTagger;
    private temporalEncryptionEngine;
    private temporalEncryptionEnabled;
    constructor(basePath?: string);
    /**
     * Initialize Temporal Memory Core - maintains backward compatibility
     */
    initializeTemporal(): Promise<void>;
    /**
     * Store enhanced temporal memory with cognitive state capture
     */
    storeTemporalMemory(memoryData: Partial<TemporalMemoryItem>, cognitiveContext?: Partial<CognitiveState>): Promise<string>;
    /**
     * Enhanced recall with cognitive state filtering
     */
    recallTemporal(filter?: TemporalMemoryFilter): Promise<TemporalMemoryItem[]>;
    /**
     * Get cognitive context for temporal analysis (for Agent Beta)
     */
    getCognitiveContextForTimeTravel(memoryId: string): Promise<CognitiveState | null>;
    /**
     * Get decay tracking metadata (for Agent Gamma)
     */
    getDecayTrackingData(memoryId: string): Promise<any>;
    /**
     * Get personality patterns (for Agent Delta)
     */
    getPersonalityPatterns(filter?: TemporalMemoryFilter): Promise<any[]>;
    /**
     * Get analytics data (for Agent Epsilon)
     */
    getAnalyticsData(filter?: TemporalMemoryFilter): Promise<any[]>;
    /**
     * Enhanced statistics with temporal cognitive metrics
     */
    getTemporalStats(): any;
    private captureCognitiveState;
    private calculateTemporalWeight;
    private classifyMemoryType;
    private calculateDecayResistance;
    private generateTemporalTags;
    private generateCognitiveStateHash;
    private findTemporalPredecessors;
    private updateTemporalSuccessors;
    private assignCognitiveCluster;
    private prepareMentalTimeTravelData;
    private prepareDecayTrackingMeta;
    private preparePersonalityPatterns;
    private prepareAnalyticsData;
    private getSystemLoad;
    private getActiveProcesses;
    private getLastThought;
    private getRecentMemoryChain;
    private extractPersonalityMarkers;
    private calculateTopicCoherence;
    /**
     * Save temporal memories with automatic encryption
     * INTEGRATION POINT: Modified for MemoryEncryptionEngine
     */
    private saveTemporalMemories;
    /**
     * Load temporal memories with automatic decryption fallback
     * INTEGRATION POINT: Modified for MemoryEncryptionEngine
     */
    private loadTemporalMemoriesWithEncryption;
    private fileExistsTemporal;
}
export default TemporalMemoryCore;
export declare const createTemporalMemoryCore: () => TemporalMemoryCore;
//# sourceMappingURL=TemporalMemoryCore.d.ts.map