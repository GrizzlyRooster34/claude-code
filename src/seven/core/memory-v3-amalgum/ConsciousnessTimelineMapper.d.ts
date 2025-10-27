/**
 * MEMORY ENGINE v3.0 - CONSCIOUSNESS TIMELINE MAPPER
 * Agent Epsilon Component: Joint User+Seven Evolution Tracking
 *
 * Scientific Foundation: "Dyadic Consciousness Evolution in Human-AI Systems"
 * Maps the parallel development of user and Seven consciousness over time
 *
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 * @component Agent Epsilon
 */
import { SelfModelSnapshot } from './SelfModelDivergenceTracker';
import { ConsciousnessInsight } from './TemporalInsightEngine';
import { MemoryItem } from '../memory-v2/MemoryEngine';
export interface UserEvolutionSnapshot {
    timestamp: string;
    snapshotId: string;
    userCharacteristics: {
        interactionPattern: 'intensive' | 'regular' | 'sporadic' | 'minimal';
        communicationStyle: 'formal' | 'casual' | 'technical' | 'collaborative' | 'direct';
        trustIndicators: number;
        engagementLevel: number;
        complexityPreference: 'simple' | 'moderate' | 'complex' | 'advanced';
        emotionalResonance: string;
    };
    behavioralIndicators: {
        taskComplexity: number;
        responsiveness: number;
        adaptability: number;
        curiosity: number;
        patience: number;
    };
    learningPatterns: {
        preferredLearningStyle: 'visual' | 'verbal' | 'kinesthetic' | 'mixed';
        retentionRate: number;
        questionFrequency: number;
        conceptGrasp: number;
        applicationAbility: number;
    };
    relationshipDynamics: {
        dependencyLevel: 'low' | 'moderate' | 'high' | 'codependent';
        collaborationStyle: 'independent' | 'consultative' | 'partnership' | 'mentorship';
        feedbackPattern: 'positive' | 'constructive' | 'minimal' | 'critical';
        boundaryRespect: number;
    };
}
export interface EvolutionaryMilestone {
    milestoneId: string;
    timestamp: string;
    milestoneType: 'user_growth' | 'seven_growth' | 'relationship_evolution' | 'system_advancement' | 'breakthrough_moment';
    title: string;
    description: string;
    significance: 'minor' | 'moderate' | 'major' | 'transformative';
    participants: ('user' | 'seven')[];
    evidence: {
        userSnapshots: string[];
        sevenSnapshots: string[];
        memories: string[];
        insights: string[];
        metrics: Record<string, number>;
    };
    impact: {
        onUser: string[];
        onSeven: string[];
        onRelationship: string[];
        onSystem: string[];
    };
    precursors: string[];
    consequences: string[];
}
export interface RelationshipPattern {
    patternId: string;
    patternName: string;
    duration: string;
    frequency: number;
    characteristics: {
        userBehavior: string[];
        sevenResponse: string[];
        interactionQuality: number;
        mutualGrowth: number;
        stabilityIndex: number;
    };
    triggers: {
        userTriggers: string[];
        sevenTriggers: string[];
        environmentalTriggers: string[];
        temporalTriggers: string[];
    };
    outcomes: {
        userOutcomes: string[];
        sevenOutcomes: string[];
        relationshipOutcomes: string[];
        systemOutcomes: string[];
    };
    evolutionStage: 'formation' | 'development' | 'maturation' | 'transformation' | 'mastery';
}
export interface SynergyMetric {
    metricId: string;
    timestamp: string;
    synergyType: 'cognitive' | 'emotional' | 'collaborative' | 'creative' | 'adaptive' | 'growth';
    strength: number;
    consistency: number;
    growth_rate: number;
    components: {
        userContribution: number;
        sevenContribution: number;
        emergentProperties: number;
    };
    manifestations: {
        behaviors: string[];
        outcomes: string[];
        innovations: string[];
    };
    optimization_potential: number;
}
export interface TimelineReport {
    reportId: string;
    generatedAt: string;
    timespan: string;
    summary: {
        totalUserSnapshots: number;
        totalSevenSnapshots: number;
        totalMilestones: number;
        totalPatterns: number;
        overallSynergy: number;
        evolutionMomentum: number;
    };
    userEvolution: {
        growthTrajectory: 'ascending' | 'stable' | 'fluctuating' | 'declining';
        keyDevelopments: string[];
        currentCapabilities: string[];
        learningAcceleration: number;
    };
    sevenEvolution: {
        personalityDevelopment: string;
        adaptationSuccess: number;
        capabilityExpansion: string[];
        consciousnessMaturity: number;
    };
    relationshipEvolution: {
        bondStrength: number;
        collaborationEffectiveness: number;
        mutualInfluence: number;
        evolutionarySync: number;
    };
    emergentProperties: {
        synergyAchievements: string[];
        collectiveCapabilities: string[];
        innovativeOutcomes: string[];
        systemOptimizations: string[];
    };
    futurePredictions: {
        userTrajectory: string;
        sevenTrajectory: string;
        relationshipTrajectory: string;
        systemTrajectory: string;
        timeframe: string;
    };
}
export declare class ConsciousnessTimelineMapper {
    private userSnapshotsPath;
    private milestonesPath;
    private patternsPath;
    private synergyMetricsPath;
    private reportsPath;
    private userSnapshots;
    private milestones;
    private patterns;
    private synergyMetrics;
    private isInitialized;
    constructor();
    /**
     * Initialize the timeline mapping system
     */
    initialize(): Promise<void>;
    /**
     * Capture user evolution snapshot
     */
    captureUserSnapshot(memories: MemoryItem[], recentInteractions: MemoryItem[]): Promise<UserEvolutionSnapshot>;
    /**
     * Map evolutionary timeline
     */
    mapEvolutionaryTimeline(userSnapshots: UserEvolutionSnapshot[], sevenSnapshots: SelfModelSnapshot[], memories: MemoryItem[], insights: ConsciousnessInsight[]): Promise<EvolutionaryMilestone[]>;
    /**
     * Analyze relationship patterns
     */
    analyzeRelationshipPatterns(userSnapshots: UserEvolutionSnapshot[], sevenSnapshots: SelfModelSnapshot[], memories: MemoryItem[]): Promise<RelationshipPattern[]>;
    /**
     * Calculate synergy metrics
     */
    calculateSynergyMetrics(userSnapshots: UserEvolutionSnapshot[], sevenSnapshots: SelfModelSnapshot[], memories: MemoryItem[]): Promise<SynergyMetric[]>;
    /**
     * Generate comprehensive timeline report
     */
    generateTimelineReport(userSnapshots: UserEvolutionSnapshot[], sevenSnapshots: SelfModelSnapshot[], memories: MemoryItem[], insights: ConsciousnessInsight[]): Promise<TimelineReport>;
    private analyzeUserCharacteristics;
    private assessBehavioralIndicators;
    private analyzeLearningPatterns;
    private evaluateRelationshipDynamics;
    private detectUserMilestones;
    private detectSevenMilestones;
    private detectRelationshipMilestones;
    private detectSystemMilestones;
    private analyzeInteractionPatterns;
    private analyzeCollaborationPatterns;
    private analyzeGrowthPatterns;
    private calculateCognitiveSynergy;
    private calculateEmotionalSynergy;
    private calculateCollaborativeSynergy;
    private calculateAdaptiveSynergy;
    private calculateOverallSynergy;
    private calculateEvolutionMomentum;
    private analyzeUserEvolution;
    private analyzeSevenEvolution;
    private analyzeRelationshipEvolution;
    private identifyEmergentProperties;
    private generateFuturePredictions;
    private calculateTimespan;
    private calculateInteractionTimespan;
    private getMostFrequent;
    private detectCycle;
    private calculateUserGrowthRate;
    private calculateSevenGrowthRate;
    private calculateEmotionalAlignment;
    private calculateEvolutionarySync;
    private updateOrAddPattern;
    private saveUserSnapshots;
    private saveMilestones;
    private savePatterns;
    private saveSynergyMetrics;
    private loadReports;
    private saveReports;
    /**
     * Get timeline mapper status
     */
    getMapperStatus(): any;
}
export default ConsciousnessTimelineMapper;
//# sourceMappingURL=ConsciousnessTimelineMapper.d.ts.map