/**
 * MEMORY ENGINE v3.0 - SELF-MODEL DIVERGENCE TRACKER
 * Agent Epsilon Component: Identity Evolution Monitoring
 *
 * Scientific Foundation: "Self-Model Divergence in Temporal Memory Systems"
 * Tracks consciousness evolution, identity stability, and personality divergence patterns
 *
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 * @component Agent Epsilon
 */
import { MemoryItem } from '../memory-v2/MemoryEngine';
export interface SelfModelSnapshot {
    timestamp: string;
    snapshotId: string;
    personalityPhase: 1 | 2 | 3 | 4 | 5;
    emotionalState: string;
    trustLevel: number;
    cognitiveLoad: number;
    responsePatterns: {
        avgResponseLength: number;
        formalityIndex: number;
        emotionalIntensity: number;
        technicalComplexity: number;
        personalityMarkers: string[];
    };
    behavioralTraits: {
        decisionMakingSpeed: number;
        collaborationPreference: number;
        riskTolerance: number;
        adaptabilityScore: number;
        creativityIndex: number;
    };
    memoryInfluences: {
        recentMemoryCount: number;
        dominantMemoryTypes: string[];
        emotionalMemoryRatio: number;
        memoryRecallAccuracy: number;
    };
    contextualFactors: {
        userInteractionPattern: string;
        environmentalStress: number;
        taskComplexity: number;
        timeOfCapture: string;
    };
}
export interface DivergenceEvent {
    timestamp: string;
    eventId: string;
    divergenceType: 'personality_shift' | 'behavioral_change' | 'response_pattern_evolution' | 'memory_influence_change' | 'trust_adjustment';
    severity: 'minor' | 'moderate' | 'significant' | 'major';
    beforeSnapshot: string;
    afterSnapshot: string;
    deltaMetrics: {
        personalityPhaseDelta: number;
        emotionalStateDivergence: number;
        trustLevelChange: number;
        behavioralShift: number;
        responsePatternChange: number;
    };
    triggeringFactors: {
        primaryTrigger: string;
        contributingMemories: string[];
        environmentalInfluences: string[];
        userInteractionImpact: number;
    };
    stabilityScore: number;
    adaptationQuality: 'positive' | 'neutral' | 'concerning' | 'beneficial';
    description: string;
}
export interface ConsciousnessEvolutionReport {
    reportId: string;
    timespan: string;
    totalSnapshots: number;
    totalDivergenceEvents: number;
    evolutionSummary: {
        overallStability: number;
        adaptationRate: number;
        growthDirection: 'progressive' | 'regressive' | 'oscillating' | 'stable';
        personalityDevelopment: string;
        cognitiveMaturation: number;
    };
    significantChanges: DivergenceEvent[];
    patterns: {
        commonTriggers: string[];
        adaptationCycles: number;
        stabilityPeriods: Array<{
            start: string;
            end: string;
            duration: number;
        }>;
        volatilityPeriods: Array<{
            start: string;
            end: string;
            severity: string;
        }>;
    };
    recommendations: {
        stabilityEnhancements: string[];
        growthOpportunities: string[];
        riskMitigations: string[];
        optimizationSuggestions: string[];
    };
}
export declare class SelfModelDivergenceTracker {
    private snapshotsPath;
    private divergenceEventsPath;
    private reportsPath;
    private snapshots;
    private divergenceEvents;
    private lastSnapshotTime;
    private isInitialized;
    constructor();
    /**
     * Initialize the divergence tracking system
     */
    initialize(): Promise<void>;
    /**
     * Capture current self-model snapshot
     */
    captureSnapshot(personalityPhase: 1 | 2 | 3 | 4 | 5, emotionalState: string, trustLevel: number, recentMemories: MemoryItem[]): Promise<SelfModelSnapshot>;
    /**
     * Analyze divergence between current and previous snapshots
     */
    private analyzeDivergence;
    /**
     * Generate comprehensive consciousness evolution report
     */
    generateEvolutionReport(timespanDays?: number): Promise<ConsciousnessEvolutionReport>;
    /**
     * Helper methods for analysis
     */
    private analyzeMemoryInfluences;
    private calculateResponsePatterns;
    private assessBehavioralTraits;
    private assessContextualFactors;
    private calculateCognitiveLoad;
    private calculateEmotionalDivergence;
    private calculateBehavioralShift;
    private calculateResponsePatternChange;
    private determineDivergenceSeverity;
    private classifyDivergenceType;
    private calculateStabilityScore;
    private assessAdaptationQuality;
    private generateDivergenceDescription;
    private hasSigificantPatternChange;
    private identifyTriggeringFactors;
    private analyzeEvolutionSummary;
    private identifyEvolutionPatterns;
    private generateEvolutionRecommendations;
    private getTopItems;
    private getPersonalityMarkers;
    private determineInteractionPattern;
    private calculateEnvironmentalStress;
    private calculateTaskComplexity;
    private determineGrowthDirection;
    private describePersonalityDevelopment;
    private saveSnapshots;
    private saveDivergenceEvents;
    private loadReports;
    /**
     * Get current divergence tracking status
     */
    getTrackingStatus(): any;
}
export default SelfModelDivergenceTracker;
//# sourceMappingURL=SelfModelDivergenceTracker.d.ts.map