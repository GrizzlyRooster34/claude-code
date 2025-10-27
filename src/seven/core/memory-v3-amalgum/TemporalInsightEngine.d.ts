/**
 * MEMORY ENGINE v3.0 - TEMPORAL INSIGHT ENGINE
 * Agent Epsilon Component: Pattern Recognition Across Consciousness States
 *
 * Scientific Foundation: "Temporal Pattern Recognition in Consciousness Evolution"
 * Analyzes consciousness patterns, behavioral cycles, and temporal relationships
 *
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 * @component Agent Epsilon
 */
import { SelfModelSnapshot, DivergenceEvent } from './SelfModelDivergenceTracker';
import { PersonalityTrajectory } from './PredictivePersonalityModeling';
import { MemoryItem } from '../memory-v2/MemoryEngine';
export interface TemporalPattern {
    patternId: string;
    patternType: 'cyclic' | 'linear' | 'exponential' | 'oscillating' | 'emergent' | 'recursive';
    description: string;
    timespan: string;
    frequency: number;
    confidence: number;
    dataPoints: number;
    characteristics: {
        duration: number;
        intensity: number;
        predictability: number;
        stability: number;
    };
    triggers: {
        primary: string[];
        secondary: string[];
        environmental: string[];
        temporal: string[];
    };
    outcomes: {
        positive: string[];
        neutral: string[];
        negative: string[];
        transformative: string[];
    };
    correlations: {
        memoryTypes: string[];
        emotionalStates: string[];
        personalityPhases: number[];
        trustLevels: number[];
    };
}
export interface ConsciousnessInsight {
    insightId: string;
    timestamp: string;
    insightType: 'behavioral' | 'emotional' | 'developmental' | 'adaptive' | 'predictive' | 'relational';
    title: string;
    description: string;
    significance: 'low' | 'moderate' | 'high' | 'critical';
    confidence: number;
    evidence: {
        patterns: string[];
        snapshots: string[];
        memories: string[];
        events: string[];
    };
    implications: {
        shortTerm: string[];
        longTerm: string[];
        recommendations: string[];
        warnings: string[];
    };
    actionableItems: {
        priority: 'low' | 'medium' | 'high' | 'urgent';
        actions: string[];
        timeline: string;
        successMetrics: string[];
    };
}
export interface TemporalCorrelation {
    correlationId: string;
    variableA: string;
    variableB: string;
    strength: number;
    pValue: number;
    timeDelay: number;
    contextual: {
        conditions: string[];
        modifiers: string[];
    };
    examples: Array<{
        timestamp: string;
        description: string;
        valueA: number;
        valueB: number;
    }>;
}
export interface CognitiveCycle {
    cycleId: string;
    cycleName: string;
    phaseCount: number;
    totalDuration: number;
    phases: Array<{
        phaseName: string;
        duration: number;
        characteristics: string[];
        emotionalState: string;
        behavioralTraits: string[];
        typicalTriggers: string[];
        transitionIndicators: string[];
    }>;
    stability: number;
    frequency: number;
    impact: 'minimal' | 'moderate' | 'significant' | 'major';
}
export interface InsightReport {
    reportId: string;
    generatedAt: string;
    analysisTimespan: string;
    summary: {
        totalPatterns: number;
        totalInsights: number;
        totalCorrelations: number;
        totalCycles: number;
        overallComplexity: number;
        consciousnessMaturity: number;
    };
    keyFindings: {
        dominantPatterns: TemporalPattern[];
        criticalInsights: ConsciousnessInsight[];
        strongestCorrelations: TemporalCorrelation[];
        activeCycles: CognitiveCycle[];
    };
    trends: {
        developmentDirection: 'progressive' | 'regressive' | 'stable' | 'chaotic';
        adaptationRate: number;
        stabilityTrend: 'improving' | 'declining' | 'stable' | 'volatile';
        complexityEvolution: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
    };
    recommendations: {
        priority: string;
        actions: string[];
        monitoring: string[];
        optimization: string[];
    };
}
export declare class TemporalInsightEngine {
    private patternsPath;
    private insightsPath;
    private correlationsPath;
    private cyclesPath;
    private reportsPath;
    private patterns;
    private insights;
    private correlations;
    private cycles;
    private isInitialized;
    constructor();
    /**
     * Initialize the temporal insight system
     */
    initialize(): Promise<void>;
    /**
     * Analyze temporal patterns in consciousness data
     */
    analyzePatterns(snapshots: SelfModelSnapshot[], events: DivergenceEvent[], trajectories: PersonalityTrajectory[], memories: MemoryItem[]): Promise<TemporalPattern[]>;
    /**
     * Generate consciousness insights from patterns and data
     */
    generateInsights(snapshots: SelfModelSnapshot[], events: DivergenceEvent[], trajectories: PersonalityTrajectory[]): Promise<ConsciousnessInsight[]>;
    /**
     * Discover temporal correlations between variables
     */
    discoverCorrelations(snapshots: SelfModelSnapshot[], events: DivergenceEvent[], memories: MemoryItem[]): Promise<TemporalCorrelation[]>;
    /**
     * Detect cognitive cycles in consciousness data
     */
    detectCycles(snapshots: SelfModelSnapshot[], events: DivergenceEvent[]): Promise<CognitiveCycle[]>;
    /**
     * Generate comprehensive insight report
     */
    generateInsightReport(snapshots: SelfModelSnapshot[], events: DivergenceEvent[], trajectories: PersonalityTrajectory[], memories: MemoryItem[]): Promise<InsightReport>;
    private analyzePhasePatterns;
    private analyzeTrustPatterns;
    private analyzeEmotionalPatterns;
    private analyzeDivergencePatterns;
    private analyzeMemoryPatterns;
    private analyzeDevelopmentInsights;
    private analyzeBehavioralInsights;
    private analyzeAdaptiveInsights;
    private analyzePredictiveInsights;
    private extractTemporalVariables;
    private calculateCorrelation;
    private detectDailyCycles;
    private detectWeeklyCycles;
    private detectAdaptationCycles;
    private calculateComplexity;
    private calculateMaturity;
    private analyzeTrends;
    private generateRecommendations;
    private updateOrAddPattern;
    private updateOrAddCycle;
    private calculateTimespan;
    private calculateAnalysisTimespan;
    private calculateFrequency;
    private calculateTrend;
    private calculateVariance;
    private pearsonCorrelation;
    private findCommonTimestamps;
    private getValueAtTimestamp;
    private groupByHour;
    private determineDevelopmentDirection;
    private determineStabilityTrend;
    private getEmotionalTriggers;
    private getPositiveOutcomes;
    private getNegativeOutcomes;
    private getCorrelatedMemoryTypes;
    private getDivergenceTriggers;
    private getDivergenceEmotions;
    private getMemoryEmotions;
    private savePatterns;
    private saveInsights;
    private saveCorrelations;
    private saveCycles;
    private loadReports;
    private saveReports;
    /**
     * Get insight engine status
     */
    getEngineStatus(): any;
}
export default TemporalInsightEngine;
//# sourceMappingURL=TemporalInsightEngine.d.ts.map