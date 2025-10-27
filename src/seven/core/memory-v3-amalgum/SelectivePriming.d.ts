/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0
 * SelectivePriming - Fragment-based Recall and Contextual Cues System
 *
 * Agent Gamma - Strategic Memory Reinstatement
 * Uses neuroscience-based priming techniques to restore memory accessibility
 */
import { EventEmitter } from 'events';
import { TemporalMemoryItem, MemoryFragment, ContextualCue, ProgressiveRevelation } from './TemporalMemoryItem';
interface PrimingStrategy {
    name: string;
    effectiveness_rating: number;
    optimal_timing: number;
    fragment_types: string[];
    cue_modalities: string[];
    success_criteria: {
        recognition_threshold: number;
        response_time_limit: number;
        confidence_minimum: number;
    };
}
interface PrimingResponse {
    timestamp: string;
    stimulus_type: 'fragment' | 'cue' | 'combined';
    stimulus_content: string;
    response_time: number;
    recognition_score: number;
    confidence_level: number;
    interference_detected: boolean;
    successful_recall: boolean;
}
export declare class SelectivePriming extends EventEmitter {
    private activeStrategies;
    private activeSessions;
    private fragmentAnalysisCache;
    private cueProfiles;
    private userAdaptationData;
    constructor();
    /**
     * Create selective priming session for memory restoration
     */
    createPrimingSession(memory: TemporalMemoryItem, urgency?: 'low' | 'medium' | 'high' | 'critical'): Promise<string>;
    /**
     * Execute progressive revelation priming sequence
     */
    executeProgressiveRevelation(sessionId: string, adaptiveMode?: boolean): Promise<ProgressiveRevelation>;
    /**
     * Analyze memory fragments for optimal priming selection
     */
    analyzeMemoryFragments(fragments: MemoryFragment[]): Promise<MemoryFragment[]>;
    /**
     * Optimize contextual cues for maximum recall effectiveness
     */
    optimizeContextualCues(cues: ContextualCue[], memory: TemporalMemoryItem): Promise<ContextualCue[]>;
    /**
     * Create adaptive fragment-cue combinations for enhanced priming
     */
    createFragmentCueCombinations(fragments: MemoryFragment[], cues: ContextualCue[]): Promise<Array<{
        fragment: MemoryFragment;
        cue: ContextualCue;
        synergy_score: number;
    }>>;
    /**
     * Adapt priming strategy based on user response patterns
     */
    adaptPrimingStrategy(sessionId: string, responseHistory: PrimingResponse[]): Promise<PrimingStrategy>;
    /**
     * Generate priming effectiveness report
     */
    generateEffectivenessReport(sessionId: string): Promise<any>;
    private initializePrimingStrategies;
    private initializeCueProfiles;
    private selectOptimalStrategy;
    private createRevelationStages;
    private executeRevelationStage;
    private simulateUserResponse;
    private updateAdaptationMetrics;
    private adaptNextStage;
    private calculateSessionEffectiveness;
    private calculateSemanticStrength;
    private calculateEmotionalResonance;
    private calculateTemporalAnchoring;
    private calculateUniquenessScore;
    private calculateFragmentCueSynergy;
    private calculateContentSimilarity;
    private getTypeSynergy;
    private getDefaultCueProfile;
    private calculateRecognitionTrend;
    private calculateResponseTimeTrend;
    private calculateConfidenceProgression;
    private generateRecommendations;
}
export default SelectivePriming;
//# sourceMappingURL=SelectivePriming.d.ts.map