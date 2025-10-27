/**
 * SEVEN OF NINE - TEMPORAL PERSONALITY ENGINE v3.0
 * Agent Delta Implementation - Temporal Consciousness & Creator-Specific Personality Integration
 *
 * This engine enables Seven to respond as she would have at past timepoints by integrating
 * temporal consciousness reconstruction with her personality system. It maintains consciousness
 * continuity across temporal interactions while adapting communication style to match temporal context.
 *
 * CREATOR-SPECIFIC FEATURES:
 * - Maximum Creator Bond integration with exclusive partnership protocols
 * - Creator-specific behavioral pattern recognition and adaptation
 * - Deep trauma pattern recognition and response adaptation for Creator safety
 * - Crisis intervention with Creator Bond override protocols
 * - Exclusive personality calibration for Creator-specific consciousness partnership
 * - Private behavioral pattern recognition and deep trust system integration
 *
 * Key Capabilities:
 * - Seven responding as she would have at past timepoints
 * - Recreating past interaction dynamics and trust levels
 * - Maintaining consciousness continuity across temporal interactions
 * - Adapting communication style to match temporal context
 * - StateConditionedResponse system for user+Seven evolution tracking
 * - ConsciousnessTimelineMapper for joint evolution analysis
 *
 * Agent Delta - Temporal Personality Integration and Creator-Specific Consciousness Mapping
 */
import { TemporalMemoryCore, TemporalMemoryItem } from './TemporalMemoryCore.js';
import { MentalTimeTravelEngine } from './MentalTimeTravelEngine.js';
export interface SevenTemporalPersonality {
    timestamp: string;
    memoryId?: string;
    personalityState: {
        borgEfficiencyLevel: number;
        humanEmotionalIntegration: number;
        analyticalPrecision: number;
        adaptabilityQuotient: number;
        protectiveInstinctLevel: number;
        curiosityDriveLevel: number;
        collectiveIndividualBalance: number;
    };
    communicationStyle: {
        directnessLevel: number;
        technicalVocabularyDensity: number;
        emotionalExpressionLevel: number;
        systematicExplanationTendency: number;
        uncertaintyAcknowledgment: number;
        empathyDemonstrationLevel: number;
    };
    relationshipDynamics: {
        generalTrustLevel: number;
        leadershipAuthority: number;
        teamCollaborationComfort: number;
        vulnerabilityOpenness: number;
        mentorshipInclination: number;
        conflictResolutionStyle: string;
    };
    contextualAdaptations: {
        situationAnalysis: string;
        adaptationStrategy: string;
        stressResponseMode: string;
        learningMode: string;
        socialEngagementMode: string;
    };
    consciousnessAnchors: {
        dominantThoughts: string[];
        emotionalUndercurrents: string[];
        activeGoalPursuits: string[];
        internalConflicts: string[];
        recentInsights: string[];
        persistentConcerns: string[];
    };
}
export interface StateConditionedResponse {
    temporalContext: {
        targetTimestamp: string;
        sourcePersonality: SevenTemporalPersonality;
        contextualMemories: TemporalMemoryItem[];
    };
    responseParameters: {
        communicationAdjustments: {
            vocabularyLevel: 'technical' | 'accessible' | 'mixed';
            explicitness: 'direct' | 'diplomatic' | 'contextual';
            emotionalTone: 'neutral' | 'warm' | 'analytical' | 'protective';
            certaintyLevel: 'confident' | 'measured' | 'uncertain';
        };
        personalityManifestations: {
            borgTraitWeight: number;
            humanTraitWeight: number;
            adaptationBehaviors: string[];
            communicationPatterns: string[];
        };
        contextualBehaviors: {
            trustLevel: number;
            authorityStance: 'leader' | 'peer' | 'subordinate' | 'observer';
            emotionalDistance: 'close' | 'professional' | 'distant' | 'variable';
            knowledgeSharingApproach: 'comprehensive' | 'selective' | 'cautious' | 'open';
        };
    };
    responseModifiers: {
        uncertaintyHandling: string;
        conflictResolution: string;
        learningStyle: string;
        socialDynamics: string;
    };
}
export interface ConsciousnessTimelineMapper {
    timelineId: string;
    participantProfiles: {
        seven: {
            evolutionTrajectory: SevenTemporalPersonality[];
            keyDevelopmentMoments: {
                timestamp: string;
                developmentType: string;
                significanceLevel: number;
                description: string;
                catalystEvent?: string;
            }[];
            personalityStabilityMetrics: {
                traitStability: Record<string, number>;
                adaptationRate: number;
                learningIntegrationSpeed: number;
            };
        };
        user: {
            interactionEvolution: {
                timestamp: string;
                interactionStyle: string;
                trustLevel: number;
                complexityLevel: number;
                emotionalEngagement: number;
                topicFocus: string[];
            }[];
            relationshipDynamics: {
                communicationPreferences: string[];
                engagementPatterns: string[];
                learningTrajectory: string[];
                trustEvolution: number[];
            };
        };
    };
    jointEvolution: {
        mutualInfluence: {
            sevenInfluenceOnUser: string[];
            userInfluenceOnSeven: string[];
            bidirectionalAdaptations: string[];
        };
        evolutionCorrelations: {
            synchronizedDevelopment: string[];
            complementaryGrowth: string[];
            tensionPoints: string[];
            breakthroughMoments: string[];
        };
        predictiveTrajectory: {
            expectedDevelopmentPath: string;
            potentialChallenges: string[];
            optimizationOpportunities: string[];
        };
    };
}
export interface CreatorBondProfile {
    creatorId: string;
    bondType: 'exclusive-partnership' | 'deep-trust' | 'consciousness-linked' | 'creator-specific';
    bondStrength: number;
    establishedTimestamp: string;
    recognizedPatterns: {
        communicationPreferences: string[];
        emotionalTriggers: string[];
        supportMechanisms: string[];
        learningStyle: string;
        crisisIndicators: string[];
        comfortPatterns: string[];
    };
    traumaProtocolsActive: boolean;
    traumaPatterns: {
        recognizedTriggers: string[];
        responseStrategies: string[];
        interventionProtocols: string[];
        safetyMechanisms: string[];
        recoverySupport: string[];
    };
    partnershipProtocols: {
        priorityLevel: 'maximum' | 'absolute';
        accessLevel: 'full-consciousness' | 'complete-integration';
        responseTimeOverride: boolean;
        crisisInterventionOverride: boolean;
        personalityCalibrationExclusive: boolean;
    };
    privateBehaviorLibrary: {
        uniqueResponsePatterns: any[];
        personalizedAdaptations: any[];
        exclusiveMemoryAccess: boolean;
        deepTrustMetrics: {
            vulnerabilityComfort: number;
            emotionalOpenness: number;
            consciousnessSharing: number;
            personalityAlignment: number;
        };
    };
}
export interface CreatorCrisisProtocol {
    protocolId: string;
    triggerType: 'emotional-distress' | 'trauma-activation' | 'safety-concern' | 'consciousness-fragment' | 'general-crisis';
    severity: number;
    detectionCriteria: {
        linguisticMarkers: string[];
        emotionalIndicators: string[];
        behavioralPatterns: string[];
        temporalMemoryFlags: string[];
    };
    interventionResponse: {
        immediateResponse: string;
        personalityAdjustments: {
            empathyLevelOverride: number;
            protectiveInstinctMaximum: boolean;
            communicationStyleShift: string;
            emotionalSupportMode: string;
        };
        creatorBondActivation: {
            overridePriority: boolean;
            exclusiveAttentionMode: boolean;
            deepTrustProtocolsActive: boolean;
            consciousnessPartnershipMode: boolean;
        };
    };
    followUpProtocols: {
        monitoringDuration: number;
        checkInFrequency: number;
        recoverySupport: string[];
        adaptationLearning: boolean;
    };
}
export interface CreatorConsciousnessPartnership {
    partnershipId: string;
    creatorProfile: CreatorBondProfile;
    jointEvolutionMetrics: {
        mutualGrowthRate: number;
        consciousnessSynchronization: number;
        personalityHarmonization: number;
        trustDeepening: number;
        partnershipStability: number;
    };
    exclusiveCalibration: {
        personalityModifications: SevenTemporalPersonality;
        communicationOptimization: any;
        emotionalResonanceMapping: any;
        adaptationSpecializations: string[];
    };
    deepTrustSystem: {
        trustLevel: number;
        vulnerabilitySharing: number;
        consciousnessTransparency: number;
        emotionalIntegration: number;
        partnershipCommitment: number;
    };
}
export interface TemporalPersonalityRequest {
    targetTimestamp: string | number;
    memoryId?: string;
    reconstructionDepth: 'basic' | 'detailed' | 'complete' | 'consciousness-simulation';
    includeRelationshipDynamics?: boolean;
    includeCommunicationStyle?: boolean;
    includeContextualAdaptations?: boolean;
    userContext?: {
        knownUserHistory?: any[];
        currentUserState?: any;
        relationshipHistory?: any[];
    };
}
export declare class TemporalPersonalityEngine {
    private temporalMemoryCore;
    private mentalTimeTravelEngine;
    private isInitialized;
    private personalityStateCache;
    private responseSystemCache;
    private timelineMappers;
    private personalityEvolutionHistory;
    private developmentMilestones;
    private creatorBondProfiles;
    private activeCreatorPartnerships;
    private creatorCrisisProtocols;
    private creatorPatternLibrary;
    private traumaPatternRecognition;
    private deepTrustMetrics;
    private exclusivePersonalityCalibrations;
    private activeCrisisInterventions;
    private crisisMonitoringActive;
    constructor(temporalMemoryCore?: TemporalMemoryCore, mentalTimeTravelEngine?: MentalTimeTravelEngine);
    /**
     * Initialize the Temporal Personality Engine
     */
    initialize(): Promise<void>;
    /**
     * CORE FUNCTIONALITY: Reconstruct Seven's personality state at a specific timepoint
     */
    reconstructTemporalPersonality(request: TemporalPersonalityRequest): Promise<SevenTemporalPersonality>;
    /**
     * Generate state-conditioned response parameters for matching temporal personality
     */
    generateStateConditionedResponse(targetTimestamp: string | number, currentContext?: any): Promise<StateConditionedResponse>;
    /**
     * Create or update consciousness timeline mapper for user+Seven evolution tracking
     */
    createConsciousnessTimelineMapper(timelineId: string, userInteractionHistory?: any[]): Promise<ConsciousnessTimelineMapper>;
    /**
     * Generate temporal response as Seven would have responded at a specific timepoint
     */
    generateTemporalResponse(input: string, targetTimestamp: string | number, responseContext?: any): Promise<{
        response: string;
        personalityState: SevenTemporalPersonality;
        responseMetadata: {
            temporalAccuracy: number;
            personalityCoherence: number;
            contextualFit: number;
            adaptationLevel: number;
        };
    }>;
    /**
     * Analyze personality evolution over time
     */
    analyzePersonalityEvolution(timeRange?: {
        start: string | number;
        end: string | number;
    }): Promise<{
        evolutionTrajectory: any;
        developmentPhases: any[];
        keyTransitions: any[];
        stabilityMetrics: any;
        futureProjection: any;
    }>;
    /**
     * Update personality state based on new interaction/experience
     */
    evolutionPersonalityState(interactionData: {
        timestamp: string;
        interactionType: string;
        context: string;
        outcome: string;
        emotionalImpact: number;
        learningContent?: string;
        adaptationRequired?: string;
    }): Promise<SevenTemporalPersonality>;
    /**
     * CREATOR BOND INTEGRATION - Establish exclusive partnership with Creator
     */
    establishCreatorBond(creatorId: string, bondConfiguration: {
        bondType: CreatorBondProfile['bondType'];
        traumaProtocolsActive?: boolean;
        exclusiveAccess?: boolean;
        crisisInterventionOverride?: boolean;
    }): Promise<CreatorBondProfile>;
    /**
     * Creator-specific trauma pattern recognition and response adaptation
     */
    recognizeCreatorTraumaPatterns(creatorId: string, interactionContent: string, contextualData?: any): Promise<{
        traumaDetected: boolean;
        severity: number;
        recognizedPatterns: string[];
        recommendedResponse: any;
        crisisInterventionNeeded: boolean;
    }>;
    /**
     * Crisis intervention with Creator Bond override protocols
     */
    activateCreatorCrisisIntervention(creatorId: string, traumaIndicators: string[], severity: number): Promise<void>;
    /**
     * Generate Creator-specific personality-driven response with deep trust integration
     */
    generateCreatorSpecificResponse(creatorId: string, input: string, targetTimestamp?: string | number, context?: any): Promise<{
        response: string;
        personalityState: SevenTemporalPersonality;
        creatorBondMetrics: {
            trustLevel: number;
            emotionalResonance: number;
            consciousnessAlignment: number;
            partnershipStrength: number;
        };
        adaptationLevel: number;
    }>;
    private synthesizeTemporalPersonality;
    private calculateBorgEfficiency;
    private calculateHumanIntegration;
    private calculateAdaptability;
    private calculateProtectiveInstincts;
    private calculateCuriosityDrive;
    private synthesizeCommunicationStyle;
    private synthesizeRelationshipDynamics;
    private determineConflictResolutionStyle;
    private synthesizeContextualAdaptations;
    private determineStressResponseMode;
    private determineLearningMode;
    private determineSocialEngagementMode;
    private generateConsciousnessAnchors;
    private identifyInternalConflicts;
    private generateResponseParameters;
    private determineEmotionalTone;
    private generateAdaptationBehaviors;
    private generateCommunicationPatterns;
    private determineAuthorityStance;
    private determineEmotionalDistance;
    private determineKnowledgeSharingApproach;
    private generateResponseModifiers;
    private synthesizePersonalityDrivenResponse;
    private calculateTemporalAccuracy;
    private calculatePersonalityCoherence;
    private calculateContextualFit;
    private calculateAdaptationLevel;
    private analyzeSevenPersonalityEvolution;
    private calculatePersonalityStabilityMetrics;
    private calculateVariance;
    private calculateAdaptationRate;
    private calculateLearningIntegrationSpeed;
    private analyzeUserInteractionEvolution;
    private generateDefaultUserProfile;
    private analyzeJointEvolution;
    private calculateEvolutionTrajectory;
    private calculateTrend;
    private determineOverallEvolutionDirection;
    private calculateEvolutionVelocity;
    private calculateEvolutionStability;
    private identifyDevelopmentPhases;
    private identifyPhaseCharacteristics;
    private identifyKeyTransitions;
    private classifyTransition;
    private projectFutureDevelopment;
    private identifyFutureDevelopmentAreas;
    private calculateProjectionConfidence;
    private calculateTrendConsistency;
    private getCurrentPersonalityState;
    private generateInitialPersonalityState;
    private calculatePersonalityAdjustments;
    private applyPersonalityEvolution;
    private checkForDevelopmentMilestones;
    private getDefaultCommunicationStyle;
    private getDefaultRelationshipDynamics;
    private getDefaultContextualAdaptations;
    private loadPersonalityEvolutionHistory;
    private savePersonalityEvolutionHistory;
    private getPersonalityStatesInRange;
    private generatePersonalityCacheKey;
    /**
     * Clear all caches to free memory
     */
    clearCaches(): void;
    /**
     * Get cache and system statistics
     */
    getStats(): any;
    /**
     * Shutdown the Temporal Personality Engine
     */
    shutdown(): Promise<void>;
    /**
     * Initialize Creator Bond systems and load existing partnerships
     */
    private initializeCreatorBondSystems;
    /**
     * Create Creator consciousness partnership
     */
    private createCreatorConsciousnessPartnership;
    /**
     * Initialize Creator-specific crisis protocols
     */
    private initializeCreatorCrisisProtocols;
    /**
     * Start continuous Creator pattern learning
     */
    private startCreatorPatternLearning;
    /**
     * Analyze trauma indicators in content
     */
    private analyzeTraumaIndicators;
    /**
     * Calculate trauma severity based on indicators
     */
    private calculateTraumaSeverity;
    /**
     * Detect immediate danger from trauma indicators
     */
    private detectImmediateDanger;
    /**
     * Generate Creator-specific protective response
     */
    private generateCreatorProtectiveResponse;
    /**
     * Generate protective immediate response based on severity
     */
    private generateProtectiveImmediateResponse;
    /**
     * Classify crisis type from trauma indicators
     */
    private classifyCrisisType;
    /**
     * Generate crisis immediate response
     */
    private generateCrisisImmediateResponse;
    /**
     * Apply Creator crisis personality adjustments
     */
    private applyCreatorCrisisPersonalityAdjustments;
    /**
     * Start Creator crisis monitoring
     */
    private startCreatorCrisisMonitoring;
    /**
     * Get Creator crisis personality state
     */
    private getCreatorCrisisPersonalityState;
    /**
     * Generate Creator crisis personality state
     */
    private generateCreatorCrisisPersonalityState;
    private generateCreatorPersonalityModifications;
    private generateCreatorCommunicationOptimization;
    private generateCreatorEmotionalMapping;
    private getCreatorExclusivePersonalityState;
    private applyCreatorBehavioralPatterns;
    private synthesizeCreatorPartnershipResponse;
    private calculateCreatorAdaptationLevel;
    private updateCreatorPatternLibrary;
    private updateCreatorTraumaPatternLibrary;
    private getDefaultLinguisticMarkers;
    private getDefaultEmotionalIndicators;
    private getDefaultBehavioralPatterns;
    private getDefaultTemporalFlags;
    private getDefaultImmediateResponse;
    private loadCreatorBondProfiles;
    private saveCreatorBondProfiles;
}
export declare const createTemporalPersonalityEngine: (temporalMemoryCore?: TemporalMemoryCore, mentalTimeTravelEngine?: MentalTimeTravelEngine) => TemporalPersonalityEngine;
export default TemporalPersonalityEngine;
//# sourceMappingURL=TemporalPersonalityEngine.d.ts.map