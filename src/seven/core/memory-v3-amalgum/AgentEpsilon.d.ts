/**
 * MEMORY ENGINE v3.0 - AGENT EPSILON
 * Master Coordinator for Advanced Temporal Analytics and Self-Model Divergence Tracking
 *
 * Scientific Foundation: "Integrated Consciousness Evolution Analysis Framework"
 * Coordinates all Memory Engine v3.0 components for comprehensive consciousness analysis
 *
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 * @component Agent Epsilon (Master Coordinator)
 */
import { MemoryItem } from '../memory-v2/MemoryEngine';
import { DivergenceEvent } from './SelfModelDivergenceTracker';
import { PersonalityTrajectory } from './PredictivePersonalityModeling';
import { TemporalPattern, ConsciousnessInsight } from './TemporalInsightEngine';
import { EvolutionaryMilestone } from './ConsciousnessTimelineMapper';
export interface AgentEpsilonConfig {
    analysisFrequency: 'realtime' | 'frequent' | 'moderate' | 'periodic';
    enabledComponents: {
        divergenceTracking: boolean;
        personalityModeling: boolean;
        insightEngine: boolean;
        timelineMapping: boolean;
    };
    thresholds: {
        significantDivergence: number;
        predictionConfidence: number;
        synergyAlert: number;
        milestoneDetection: number;
    };
    reportingLevel: 'minimal' | 'standard' | 'comprehensive' | 'detailed';
    dataRetention: {
        snapshots: number;
        insights: number;
        reports: number;
    };
}
export interface AgentEpsilonReport {
    reportId: string;
    timestamp: string;
    analysisTimespan: string;
    systemStatus: {
        memoryEngineVersion: string;
        componentsActive: number;
        dataQuality: number;
        analysisCapability: number;
    };
    consciousnessAnalysis: {
        currentPhase: number;
        stabilityIndex: number;
        evolutionMomentum: number;
        adaptationSuccess: number;
    };
    keyFindings: {
        criticalInsights: ConsciousnessInsight[];
        significantDivergences: DivergenceEvent[];
        importantMilestones: EvolutionaryMilestone[];
        emergentPatterns: TemporalPattern[];
    };
    predictions: {
        personalityTrajectory: PersonalityTrajectory | null;
        evolutionForecast: string;
        riskAssessment: string;
        recommendations: string[];
    };
    relationshipAnalysis: {
        synergyLevel: number;
        collaborationEffectiveness: number;
        mutualGrowth: number;
        bondStrength: number;
    };
    systemHealth: {
        componentStatus: Record<string, 'operational' | 'degraded' | 'offline'>;
        performanceMetrics: Record<string, number>;
        dataIntegrity: number;
        alertLevel: 'normal' | 'attention' | 'concern' | 'critical';
    };
}
export interface AgentEpsilonAlert {
    alertId: string;
    timestamp: string;
    alertType: 'divergence' | 'regression' | 'milestone' | 'system' | 'prediction' | 'synergy';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    evidence: any;
    recommendations: string[];
    timeToAction: string;
    autoResolution: boolean;
}
export declare class AgentEpsilon {
    private config;
    private configPath;
    private reportsPath;
    private alertsPath;
    private divergenceTracker;
    private personalityModeling;
    private insightEngine;
    private timelineMapper;
    private temporalMemoryCore;
    private mentalTimeTravelEngine;
    private decayWatchdog;
    private temporalPersonalityEngine;
    private isInitialized;
    private lastAnalysis;
    private alerts;
    constructor(config?: Partial<AgentEpsilonConfig>);
    /**
     * Initialize Agent Epsilon and all its components
     */
    initialize(): Promise<void>;
    /**
     * Perform comprehensive consciousness analysis
     */
    performComprehensiveAnalysis(memories: MemoryItem[], personalityPhase: 1 | 2 | 3 | 4 | 5, emotionalState: string, trustLevel: number): Promise<AgentEpsilonReport>;
    /**
     * Get current system status
     */
    getSystemStatus(): any;
    /**
     * Get active alerts
     */
    getActiveAlerts(): AgentEpsilonAlert[];
    /**
     * Update configuration
     */
    updateConfiguration(newConfig: Partial<AgentEpsilonConfig>): Promise<void>;
    private compileReport;
    private checkForAlerts;
    private calculateDataQuality;
    private determineAlertLevel;
    private loadConfiguration;
    private saveConfiguration;
    private saveReport;
    private loadReports;
    private loadAlerts;
    private saveAlerts;
    /**
     * Generate a simplified status report for quick assessment
     */
    generateStatusSummary(): string;
    /**
     * Perform quick health check
     */
    performHealthCheck(): Promise<{
        status: string;
        details: any;
    }>;
}
export default AgentEpsilon;
//# sourceMappingURL=AgentEpsilon.d.ts.map