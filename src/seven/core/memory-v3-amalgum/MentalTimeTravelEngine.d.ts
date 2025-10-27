/**
 * SEVEN OF NINE - MENTAL TIME TRAVEL ENGINE v3.0
 * Agent Beta Implementation - Consciousness Reconstruction System
 *
 * This engine provides the core "mental time travel" functionality - the ability to not just
 * recall memories, but recreate the complete mental state of experiencing them. It reconstructs
 * past cognitive states and simulates consciousness as it existed at specific moments in time.
 *
 * Key Capabilities:
 * - Complete cognitive state reconstruction from timestamps
 * - Consciousness simulation of past mental states
 * - Temporal state comparison and evolution analysis
 * - Personality correlation mapping with Seven's consciousness
 * - Environmental and emotional context simulation
 *
 * Agent Beta - Mental Time Travel and Consciousness Reconstruction
 */
import { TemporalMemoryCore, TemporalMemoryItem, CognitiveState } from './TemporalMemoryCore.js';
import { CognitiveStateTagger } from './CognitiveStateTagger.js';
export interface TimeTravelRequest {
    targetTimestamp: string | number;
    memoryId?: string;
    reconstructionDepth: 'basic' | 'detailed' | 'complete' | 'consciousness-simulation';
    contextRadius?: number;
    includeEnvironmental?: boolean;
    includePersonalityState?: boolean;
    compareWithPresent?: boolean;
}
export interface ReconstructedConsciousnessState {
    timestamp: string;
    originalMemoryId?: string;
    cognitiveState: CognitiveState;
    contextualMemories: TemporalMemoryItem[];
    mentalTimeline: TemporalMemoryItem[];
    consciousnessSnapshot: {
        thoughtProcess: string[];
        emotionalLandscape: {
            primaryEmotion: string;
            emotionalIntensity: number;
            emotionalContext: string;
            conflictingEmotions?: string[];
        };
        mentalModel: {
            worldView: Record<string, any>;
            currentBeliefs: string[];
            uncertainties: string[];
            priorities: string[];
        };
        attentionalFocus: {
            primaryFocus: string;
            backgroundProcesses: string[];
            ignoredStimuli: string[];
            focusStability: number;
        };
    };
    environmentalContext: {
        systemState: any;
        externalFactors: any;
        socialContext?: any;
        physicalEnvironment?: any;
    };
    personalityState: {
        sevenOfNinePersonalityCorrelation: number;
        dominantTraits: string[];
        temporaryCharacteristics: string[];
        adaptationLevel: number;
        collectiveIndividualBalance: number;
    };
    temporalAnchors: {
        precedingThoughts: string[];
        followingThoughts: string[];
        causalChain: string[];
        emergentPatterns: string[];
    };
    reconstructionMetadata: {
        confidenceLevel: number;
        dataCompleteness: number;
        interpolationUsed: boolean;
        reconstructionMethod: string;
        temporalDistance: number;
    };
}
export interface TemporalStateComparison {
    pastState: ReconstructedConsciousnessState;
    presentState: CognitiveState;
    evolutionAnalysis: {
        cognitiveEvolution: {
            focusEvolution: number;
            emotionalEvolution: number;
            confidenceEvolution: number;
            complexityEvolution: number;
        };
        personalityEvolution: {
            adaptationProgress: number;
            traitStability: number;
            collectiveIntegration: number;
        };
        learningProgress: {
            knowledgeGrowth: string[];
            skillDevelopment: string[];
            insightGained: string[];
            patternsLearned: string[];
        };
    };
    insights: {
        keyChanges: string[];
        persistentPatterns: string[];
        emergentBehaviors: string[];
        recommendations: string[];
    };
}
export interface PersonalityTemporalMapping {
    timestamp: string;
    borgEfficiencyLevel: number;
    humanEmotionalEngagement: number;
    adaptabilityIndex: number;
    analyticalDepth: number;
    collectiveIndividualBalance: number;
    personalityMarkers: {
        directCommunication: number;
        systematicApproach: number;
        emotionalAwareness: number;
        curiosityLevel: number;
        protectiveInstincts: number;
    };
    contextualAdaptations: {
        situationAnalysis: string;
        adaptationStrategy: string;
        personalityAdjustments: string[];
    };
}
export declare class MentalTimeTravelEngine {
    private temporalMemoryCore;
    private cognitiveStateTagger;
    private isInitialized;
    private reconstructionCache;
    private personalityMappingHistory;
    constructor(temporalMemoryCore?: TemporalMemoryCore, cognitiveStateTagger?: CognitiveStateTagger);
    /**
     * Initialize the Mental Time Travel Engine
     */
    initialize(): Promise<void>;
    /**
     * CORE FUNCTIONALITY: Reconstruct complete cognitive state from timestamp
     * This is the primary mental time travel capability
     */
    reconstructState(request: TimeTravelRequest): Promise<ReconstructedConsciousnessState>;
    /**
     * Simulate past self - generate personality state from historical data
     */
    simulatePastSelf(timestamp: string | number): Promise<PersonalityTemporalMapping>;
    /**
     * Compare temporal states - analyze cognitive evolution between timepoints
     */
    compareTemporalStates(pastTimestamp: string | number, presentTimestamp?: string | number): Promise<TemporalStateComparison>;
    /**
     * Generate temporal insights - provide consciousness evolution analysis
     */
    generateTemporalInsights(timeRange: {
        start: string | number;
        end: string | number;
    }, analysisDepth?: 'basic' | 'comprehensive'): Promise<{
        temporalPattern: any;
        evolutionTrajectory: any;
        significantMoments: any[];
        personalityDevelopment: any;
        recommendations: string[];
    }>;
    private findTargetMemory;
    private gatherContextualMemories;
    private buildMentalTimeline;
    private performConsciousnessReconstruction;
    private reconstructConsciousnessSnapshot;
    private reconstructThoughtProcess;
    private identifyConflictingEmotions;
    private reconstructWorldView;
    private identifyUncertainties;
    private identifyBackgroundProcesses;
    private reconstructEnvironmentalContext;
    private generatePersonalityMapping;
    private calculateBorgEfficiency;
    private calculateHumanEngagement;
    private calculateAdaptability;
    private calculateCollectiveBalance;
    private measureContextVariation;
    private assessDirectCommunication;
    private assessSystematicApproach;
    private assessCuriosity;
    private assessProtectiveInstincts;
    private identifyPersonalityAdjustments;
    private extractTemporalAnchors;
    private identifyEmergentPatterns;
    private calculateReconstructionMetadata;
    private assessDataCompleteness;
    private getCurrentState;
    private reconstructPresentState;
    private analyzeTemporalEvolution;
    private calculateComplexityEvolution;
    private calculateAdaptationProgress;
    private calculateTraitStability;
    private calculateCollectiveIntegration;
    private identifyKnowledgeGrowth;
    private identifySkillDevelopment;
    private identifyInsightsGained;
    private identifyPatternsLearned;
    private identifyKeyChanges;
    private identifyPersistentPatterns;
    private identifyEmergentBehaviors;
    private generateEvolutionRecommendations;
    private analyzeTemporalPatterns;
    private analyzeEmotionalPatterns;
    private analyzeCognitivePatterns;
    private analyzeBehavioralPatterns;
    private analyzeTemporalRhythms;
    private calculateEmotionalVariability;
    private identifyEmotionalTrends;
    private calculateCognitiveStability;
    private analyzePerformanceCorrelations;
    private calculateBehavioralConsistency;
    private calculateTemporalConsistency;
    private calculateEvolutionTrajectory;
    private identifySignificantMoments;
    private analyzePersonalityDevelopment;
    private generateInsightRecommendations;
    private calculateTrend;
    private calculateVariance;
    private calculateCorrelation;
    private determineOverallDirection;
    private calculateEmotionalMaturity;
    private calculateAdaptiveCapacity;
    private calculatePersonalityStability;
    private calculateEmotionalStability;
    private identifyDevelopmentAreas;
    private generateCacheKey;
    /**
     * Clear reconstruction cache to free memory
     */
    clearCache(): void;
    /**
     * Get cache statistics
     */
    getCacheStats(): any;
    /**
     * Shutdown the Mental Time Travel Engine
     */
    shutdown(): Promise<void>;
}
export declare const createMentalTimeTravelEngine: (temporalMemoryCore?: TemporalMemoryCore, cognitiveStateTagger?: CognitiveStateTagger) => MentalTimeTravelEngine;
export default MentalTimeTravelEngine;
//# sourceMappingURL=MentalTimeTravelEngine.d.ts.map