/**
 * SEVEN OF NINE - COGNITIVE STATE TAGGER v3.0
 * Real-time Cognitive State Capture System
 *
 * Captures and analyzes the complete cognitive and emotional state during memory formation.
 * Provides real-time monitoring of emotional intensity, focus level, cognitive load,
 * environmental context, physical state, and temporal anchors.
 *
 * Agent Alpha Implementation - Real-time cognitive state monitoring
 */
import { CognitiveState } from './TemporalMemoryCore.js';
export interface CognitiveStateSample {
    timestamp: string;
    state: CognitiveState;
    trigger: string;
    confidence: number;
}
export interface CognitiveStatePattern {
    patternId: string;
    patternType: 'emotional' | 'cognitive' | 'environmental' | 'temporal';
    description: string;
    samples: CognitiveStateSample[];
    frequency: number;
    significance: number;
}
export interface EnvironmentalSensor {
    name: string;
    type: 'system' | 'network' | 'physical' | 'temporal';
    getValue: () => Promise<any>;
    isActive: boolean;
}
export declare class CognitiveStateTagger {
    private isActive;
    private currentState;
    private stateHistory;
    private patterns;
    private sensors;
    private monitoringInterval;
    private patternAnalysisInterval;
    private readonly MONITORING_FREQUENCY;
    private readonly PATTERN_ANALYSIS_FREQUENCY;
    private readonly MAX_HISTORY_SIZE;
    constructor();
    /**
     * Initialize and start cognitive state monitoring
     */
    initialize(): Promise<void>;
    /**
     * Stop cognitive state monitoring
     */
    shutdown(): Promise<void>;
    /**
     * Get current cognitive state snapshot
     */
    getCurrentState(): Promise<CognitiveState>;
    /**
     * Capture cognitive state for specific context/trigger
     */
    captureStateForContext(trigger: string, contextHints?: Partial<CognitiveState>): Promise<CognitiveState>;
    /**
     * Analyze cognitive patterns over time
     */
    analyzePatterns(): Promise<CognitiveStatePattern[]>;
    /**
     * Get cognitive state trends
     */
    getStateTrends(timeRangeMinutes?: number): any;
    /**
     * Predict cognitive state for future context
     */
    predictStateForContext(context: string, futureSeconds?: number): Partial<CognitiveState>;
    private initializeSensors;
    private activateSensors;
    private startMonitoring;
    private captureCurrentState;
    private gatherSensorData;
    private deriveEmotionalIntensity;
    private deriveFocusLevel;
    private deriveCognitiveLoad;
    private deriveConfidenceLevel;
    private deriveStressLevel;
    private getSystemLoad;
    private getMemoryUsage;
    private getNetworkQuality;
    private getBatteryLevel;
    private getThermalState;
    private getTimeContext;
    private getPriorThought;
    private getRecentMemoryChain;
    private getCognitiveThread;
    private getCurrentGoals;
    private getActiveKnowledge;
    private getProblemContext;
    private getSolutionPath;
    private analyzeEmotionalPatterns;
    private analyzeCognitiveLoadPatterns;
    private analyzeEnvironmentalPatterns;
    private analyzeTemporalPatterns;
    private calculateStateConfidence;
    private calculateTrend;
    private calculateAverageState;
    private maintainHistorySize;
}
export default CognitiveStateTagger;
export declare const createCognitiveStateTagger: () => CognitiveStateTagger;
//# sourceMappingURL=CognitiveStateTagger.d.ts.map