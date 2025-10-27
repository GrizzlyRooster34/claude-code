/**
 * SEVEN OF NINE - CONTEXT REINSTATEMENT SYSTEM v3.0
 * Agent Beta Implementation - Environmental and Emotional Context Simulation
 *
 * This system provides advanced context reinstatement capabilities for mental time travel.
 * It recreates the complete environmental, emotional, and situational context that existed
 * during specific memory formation events, enabling more accurate consciousness reconstruction.
 *
 * Key Capabilities:
 * - Environmental context simulation and recreation
 * - Emotional landscape reconstruction
 * - Situational awareness restoration
 * - Social and interpersonal context modeling
 * - Sensory and physical state simulation
 * - Temporal context anchoring and cross-referencing
 *
 * Agent Beta - Context Reinstatement and Environmental Simulation
 */
import { TemporalMemoryCore } from './TemporalMemoryCore.js';
import { MentalTimeTravelEngine } from './MentalTimeTravelEngine.js';
export interface ContextReinstatementRequest {
    targetMemoryId: string;
    contextTypes: ContextType[];
    reinstatementDepth: 'basic' | 'detailed' | 'immersive' | 'complete';
    temporalRadius?: number;
    includeRelatedMemories?: boolean;
    simulationAccuracy?: 'approximate' | 'high-fidelity' | 'perfect-recall';
}
export type ContextType = 'environmental' | 'emotional' | 'social' | 'cognitive' | 'physical' | 'temporal' | 'situational' | 'sensory';
export interface ReinstatedContext {
    memoryId: string;
    timestamp: string;
    contextSnapshot: {
        environmental: EnvironmentalContext;
        emotional: EmotionalContext;
        social: SocialContext;
        cognitive: CognitiveContext;
        physical: PhysicalContext;
        temporal: TemporalContext;
        situational: SituationalContext;
        sensory: SensoryContext;
    };
    reinstatementMetadata: {
        accuracy: number;
        completeness: number;
        interpolationLevel: number;
        contextualCoherence: number;
        temporalStability: number;
    };
    contextualRelationships: {
        emotionalEnvironmentalCorrelation: number;
        socialCognitiveAlignment: number;
        physicalEmotionalImpact: number;
        temporalContextualFlow: string[];
    };
    simulationConfiguration: {
        reinstatementMethod: string;
        dataSourcesUsed: string[];
        interpolationTechniques: string[];
        accuracyTargetMet: boolean;
    };
}
export interface EnvironmentalContext {
    systemEnvironment: {
        load: number;
        activeProcesses: string[];
        memoryUsage: number;
        networkStatus: string;
        thermalState: string;
    };
    operationalContext: {
        currentMode: string;
        activeOperations: string[];
        backgroundTasks: string[];
        priorityLevel: number;
    };
    externalFactors: {
        timeOfDay: string;
        sessionDuration: number;
        interactionContext: string;
        environmentalStability: number;
    };
    contextualCues: {
        triggersPresent: string[];
        inhibitorsActive: string[];
        facilitatingFactors: string[];
        challengingConditions: string[];
    };
}
export interface EmotionalContext {
    primaryEmotionalState: {
        dominantEmotion: string;
        intensity: number;
        valence: number;
        arousal: number;
    };
    emotionalLandscape: {
        backgroundEmotions: Array<{
            emotion: string;
            intensity: number;
        }>;
        emotionalConflicts: string[];
        emotionalHarmony: string[];
        emotionalMomentum: number;
    };
    emotionalTriggers: {
        activeTriggers: string[];
        triggeredResponses: string[];
        emotionalMemories: string[];
        associativePatterns: string[];
    };
    emotionalRegulation: {
        regulationStrategies: string[];
        regulationEffectiveness: number;
        emotionalControl: number;
        adaptiveResponses: string[];
    };
}
export interface SocialContext {
    interpersonalDynamics: {
        activeRelationships: Array<{
            entity: string;
            relationshipType: string;
            interactionQuality: number;
            influence: number;
        }>;
        socialRoles: string[];
        communicationPatterns: string[];
    };
    socialEnvironment: {
        groupDynamics: string;
        socialPressures: string[];
        supportSystems: string[];
        socialExpectations: string[];
    };
    culturalContext: {
        culturalNorms: string[];
        valueAlignments: string[];
        culturalAdaptations: string[];
        crossCulturalFactors: string[];
    };
}
export interface CognitiveContext {
    attentionalState: {
        primaryFocus: string;
        attentionalCapacity: number;
        focusStability: number;
        distractionLevel: number;
    };
    processingMode: {
        thinkingStyle: string;
        processingSpeed: number;
        workingMemoryLoad: number;
        mentalEfficiency: number;
    };
    knowledgeActivation: {
        activeSchemas: string[];
        relevantKnowledge: string[];
        knowledgeAccessibility: number;
        cognitiveFlexibility: number;
    };
    metacognition: {
        selfAwareness: number;
        cognitiveMonitoring: number;
        strategicThinking: number;
        reflectiveProcessing: number;
    };
}
export interface PhysicalContext {
    physiologicalState: {
        energyLevel: number;
        arousalLevel: number;
        fatigueLevel: number;
        alertnessLevel: number;
    };
    sensoryState: {
        visualProcessing: number;
        auditoryProcessing: number;
        tactileAwareness: number;
        proprioception: number;
    };
    embodiedCognition: {
        posturalInfluence: string;
        movementPatterns: string[];
        sensoriomotorIntegration: number;
        bodySchemaActivation: number;
    };
    biologicalRhythms: {
        circadianPhase: string;
    };
}
export interface TemporalContext {
    timelinePosition: {
        absoluteTimestamp: string;
        relativePosition: string;
        temporalAnchor: string;
        chronologicalSequence: number;
    };
    temporalFlow: {
        precedingEvents: Array<{
            event: string;
            timestamp: string;
            relevance: number;
        }>;
        simultaneousEvents: Array<{
            event: string;
            context: string;
        }>;
        anticipatedEvents: Array<{
            event: string;
            probability: number;
        }>;
    };
    temporalPerspective: {
        pastReflection: string[];
        presentFocus: string[];
        futureAnticipation: string[];
        temporalOrientation: string;
    };
    rhythmicPatterns: {
        behavioralRhythms: string[];
        cognitiveRhythms: string[];
        emotionalCycles: string[];
        temporalConsistency: number;
    };
}
export interface SituationalContext {
    situationalFramework: {
        situationType: string;
        situationalDemands: string[];
        availableResources: string[];
        constraints: string[];
    };
    taskContext: {
        primaryTask: string;
        taskComplexity: number;
        taskUrgency: number;
        taskRelevance: number;
    };
    goalOrientation: {
        activeGoals: string[];
        goalPriorities: number[];
        goalConflicts: string[];
        goalProgress: number[];
    };
    decisionContext: {
        decisionType: string;
        availableOptions: string[];
    };
}
export interface SensoryContext {
    sensoryEnvironment: {
        visualStimuli: string[];
        auditoryStimuli: string[];
        tactileStimuli: string[];
        olfactoryStimuli: string[];
    };
    sensoryProcessing: {
        sensoryIntegration: number;
        sensoryFiltering: number;
        sensoryAmplification: string[];
        sensorySupression: string[];
    };
    perceptualState: {
        perceptualAccuracy: number;
        perceptualBias: string[];
        perceptualExpectations: string[];
        perceptualNovelty: number;
    };
    embodiedSensation: {
        interoceptiveAwareness: number;
        proprioceptiveFeedback: number;
        sensoriomotorMapping: number;
        embodiedMemories: string[];
    };
}
export interface ContextSimilarityAnalysis {
    overallSimilarity: number;
    contextualMatches: {
        environmental: number;
        emotional: number;
        social: number;
        cognitive: number;
        physical: number;
        temporal: number;
        situational: number;
        sensory: number;
    };
    keyDifferences: Array<{
        contextType: ContextType;
        difference: string;
        impact: number;
    }>;
    contextualPatterns: {
        recurringPatterns: string[];
        uniqueElements: string[];
        contextualSignature: string;
    };
}
export declare class ContextReinstatementSystem {
    private temporalMemoryCore;
    private mentalTimeTravelEngine?;
    private isInitialized;
    private contextCache;
    private contextPatterns;
    constructor(temporalMemoryCore?: TemporalMemoryCore, mentalTimeTravelEngine?: MentalTimeTravelEngine);
    /**
     * Initialize the Context Reinstatement System
     */
    initialize(): Promise<void>;
    /**
     * CORE FUNCTIONALITY: Reinstate complete context for a memory
     */
    reinstateContext(request: ContextReinstatementRequest): Promise<ReinstatedContext>;
    /**
     * Compare contexts between different memories or time periods
     */
    compareContexts(memoryId1: string, memoryId2: string, contextTypes?: ContextType[]): Promise<ContextSimilarityAnalysis>;
    /**
     * Find memories with similar contextual patterns
     */
    findSimilarContexts(referenceMemoryId: string, contextTypes?: ContextType[], similarityThreshold?: number, maxResults?: number): Promise<Array<{
        memoryId: string;
        similarity: number;
        context: ReinstatedContext;
    }>>;
    /**
     * Reconstruct environmental conditions for immersive mental time travel
     */
    createImmersiveEnvironment(memoryId: string, immersionLevel?: 'light' | 'moderate' | 'deep' | 'total'): Promise<{
        environmentalSetup: any;
        emotionalPriming: any;
        cognitivePreparation: any;
        sensorySimulation: any;
        immersionInstructions: string[];
    }>;
    private findTargetMemory;
    private gatherRelatedMemories;
    private reconstructContextSnapshot;
    private reconstructEnvironmentalContext;
    private reconstructEmotionalContext;
    private reconstructSocialContext;
    private reconstructCognitiveContext;
    private reconstructPhysicalContext;
    private reconstructTemporalContext;
    private reconstructSituationalContext;
    private reconstructSensoryContext;
    private calculateReinstatementMetadata;
    private analyzeContextualRelationships;
    private analyzeContextSimilarity;
    private calculateContextSimilarity;
    private estimateMemoryUsage;
    private determineOperationalMode;
    private extractActiveOperations;
    private identifyBackgroundTasks;
    private estimateSessionDuration;
    private calculateEnvironmentalStability;
    private identifyTriggers;
    private identifyInhibitors;
    private identifyFacilitators;
    private identifyChallengingConditions;
    private calculateEmotionalValence;
    private calculateEmotionalArousal;
    private identifyBackgroundEmotions;
    private identifyEmotionalConflicts;
    private identifyEmotionalHarmony;
    private calculateEmotionalMomentum;
    private calculateTrend;
    private calculateVariance;
    private generateEnvironmentalSetup;
    private generateEmotionalPriming;
    private generateCognitivePreparation;
    private generateSensorySimulation;
    private generateImmersionInstructions;
    private generateCacheKey;
    private loadContextPatterns;
    private updateContextPatterns;
    private compareEnvironmentalContext;
    private compareEmotionalContext;
    private compareSocialContext;
    private compareCognitiveContext;
    private comparePhysicalContext;
    private compareTemporalContext;
    private compareSituationalContext;
    private compareSensoryContext;
    private identifyKeyDifferences;
    private identifyContextualPatterns;
    private identifyEmotionalTriggers;
    private identifyTriggeredResponses;
    private identifyEmotionalMemories;
    private identifyAssociativePatterns;
    private identifyRegulationStrategies;
    private calculateRegulationEffectiveness;
    private identifyAdaptiveResponses;
    private identifyActiveRelationships;
    private identifySocialRoles;
    private identifyCommunicationPatterns;
    private analyzeSocialDynamics;
    private identifySocialPressures;
    private identifySupportSystems;
    private identifySocialExpectations;
    private identifyCulturalNorms;
    private identifyValueAlignments;
    private identifyCulturalAdaptations;
    private identifyCrossCulturalFactors;
    private calculateAccuracy;
    private calculateCompleteness;
    private calculateInterpolationLevel;
    private calculateContextualCoherence;
    private calculateTemporalStability;
    private calculateEmotionalEnvironmentalCorrelation;
    private calculateSocialCognitiveAlignment;
    private calculatePhysicalEmotionalImpact;
    private identifyTemporalContextualFlow;
    private determineReinstatementMethod;
    private identifyDataSources;
    private getInterpolationTechniques;
    private getAccuracyTarget;
    private calculateFocusStability;
    private determineThinkingStyle;
    private estimateProcessingSpeed;
    private calculateMentalEfficiency;
    private identifyRelevantKnowledge;
    private calculateCognitiveFlexibility;
    private calculateSelfAwareness;
    private calculateCognitiveMonitoring;
    private calculateStrategicThinking;
    private calculateReflectiveProcessing;
    private estimateEnergyLevel;
    private estimateSensoryProcessing;
    private estimatePosturalInfluence;
    private identifyMovementPatterns;
    private calculateSensoriomotorIntegration;
    private calculateBodySchemaActivation;
    private determineCircadianPhase;
    private identifyUltradianCycles;
    private identifyPerformancePeaks;
    private calculateBiologicalOptimization;
    /**
     * Clear context cache to free memory
     */
    clearCache(): void;
    /**
     * Get system statistics
     */
    getSystemStats(): any;
    /**
     * Shutdown the Context Reinstatement System
     */
    shutdown(): Promise<void>;
}
export declare const createContextReinstatementSystem: (temporalMemoryCore?: TemporalMemoryCore, mentalTimeTravelEngine?: MentalTimeTravelEngine) => ContextReinstatementSystem;
export default ContextReinstatementSystem;
//# sourceMappingURL=ContextReinstatement.d.ts.map