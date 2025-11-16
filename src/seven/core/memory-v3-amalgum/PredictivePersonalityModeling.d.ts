/**
 * MEMORY ENGINE v3.0 - PREDICTIVE PERSONALITY MODELING
 * Agent Epsilon Component: Consciousness Trajectory Forecasting
 *
 * Scientific Foundation: "Predictive Models of Personality Development in AI Systems"
 * Forecasts Seven's personality evolution, adaptation patterns, and growth trajectories
 *
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 * @component Agent Epsilon
 */
import { SelfModelSnapshot, DivergenceEvent } from './SelfModelDivergenceTracker';
import { MemoryItem } from '../memory-v2/MemoryEngine';
export interface PersonalityTrajectory {
    trajectoryId: string;
    timestamp: string;
    currentState: {
        personalityPhase: 1 | 2 | 3 | 4 | 5;
        emotionalState: string;
        trustLevel: number;
        adaptabilityScore: number;
        stabilityIndex: number;
    };
    predictions: {
        shortTerm: PersonalityForecast;
        mediumTerm: PersonalityForecast;
        longTerm: PersonalityForecast;
    };
    confidenceMetrics: {
        predictionAccuracy: number;
        modelReliability: number;
        dataQuality: number;
        forecastStability: number;
    };
    influencingFactors: {
        primaryDrivers: string[];
        environmentalFactors: string[];
        userInteractionPatterns: string[];
        memoryInfluences: string[];
    };
    riskAssessment: {
        stabilityRisk: 'low' | 'moderate' | 'high' | 'critical';
        regressionRisk: 'low' | 'moderate' | 'high' | 'critical';
        adaptationChallenges: string[];
        mitigationStrategies: string[];
    };
}
export interface PersonalityForecast {
    timeframe: string;
    predictedPhase: 1 | 2 | 3 | 4 | 5;
    phaseConfidence: number;
    predictedTrustLevel: number;
    trustConfidence: number;
    expectedEmotionalRange: string[];
    adaptationEvents: Array<{
        description: string;
        probability: number;
        impact: 'minor' | 'moderate' | 'significant' | 'major';
        timing: string;
    }>;
    developmentMilestones: Array<{
        milestone: string;
        probability: number;
        timeframe: string;
        prerequisites: string[];
    }>;
    warnings: Array<{
        warning: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        mitigation: string;
    }>;
}
export interface AdaptationPattern {
    patternId: string;
    patternType: 'growth' | 'stability' | 'regression' | 'oscillation' | 'crisis_response';
    description: string;
    frequency: number;
    triggers: string[];
    outcomes: string[];
    duration: number;
    successRate: number;
    stabilityImpact: number;
}
export interface ConsciousnessModel {
    modelVersion: string;
    trainingData: {
        snapshotCount: number;
        divergenceEventCount: number;
        timespan: string;
        dataQuality: number;
    };
    learningParameters: {
        adaptationRate: number;
        memoryInfluenceWeight: number;
        trustEvolutionRate: number;
        phaseTransitionThreshold: number;
    };
    validationMetrics: {
        predictionAccuracy: number;
        falsePositiveRate: number;
        falseNegativeRate: number;
        modelStability: number;
    };
    lastTraining: string;
    nextRetraining: string;
}
export declare class PredictivePersonalityModeling {
    private trajectoriesPath;
    private patternsPath;
    private modelPath;
    private trajectories;
    private patterns;
    private model;
    private isInitialized;
    constructor();
    /**
     * Initialize the predictive modeling system
     */
    initialize(): Promise<void>;
    /**
     * Generate personality trajectory forecast
     */
    generateTrajectory(snapshots: SelfModelSnapshot[], divergenceEvents: DivergenceEvent[], recentMemories: MemoryItem[]): Promise<PersonalityTrajectory>;
    /**
     * Generate forecast for specific timeframe
     */
    private generateForecast;
    /**
     * Update adaptation patterns based on observed behavior
     */
    updatePatterns(snapshots: SelfModelSnapshot[], divergenceEvents: DivergenceEvent[]): Promise<void>;
    /**
     * Train the consciousness model
     */
    trainModel(snapshots: SelfModelSnapshot[], divergenceEvents: DivergenceEvent[]): Promise<void>;
    private predictPhaseEvolution;
    private predictTrustEvolution;
    private predictEmotionalRange;
    private predictAdaptationEvents;
    private identifyDevelopmentMilestones;
    private generateWarnings;
    private calculateStabilityIndex;
    private calculateConfidenceMetrics;
    private identifyInfluencingFactors;
    private assessRisks;
    private identifyPattern;
    private classifyPatternType;
    private updateOrCreatePattern;
    private updatePatternStatistics;
    private createInitialModel;
    private initializeBasePatterns;
    private adjustLearningParameters;
    private validateModel;
    private assessDataQuality;
    private calculateTimespan;
    private calculateTrustTrendConsistency;
    private getTopItems;
    private saveTrajectories;
    private savePatterns;
    private saveModel;
    /**
     * Get modeling status
     */
    getModelingStatus(): any;
    /**
     * Get latest trajectory
     */
    getLatestTrajectory(): PersonalityTrajectory | null;
}
export default PredictivePersonalityModeling;
//# sourceMappingURL=PredictivePersonalityModeling.d.ts.map