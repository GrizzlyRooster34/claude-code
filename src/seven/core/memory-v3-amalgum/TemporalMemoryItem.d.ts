/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0
 * Temporal Memory Item Interface for Decay Prevention
 *
 * Agent Gamma - Memory Decay Prevention and Proactive Restoration
 * Integration with Agent Alpha (Foundation) for decay tracking
 */
import { MemoryItem } from '../memory-v2/MemoryEngine';
export interface DecayMetrics {
    /** Initial encoding strength (0-1) */
    initial_strength: number;
    /** Current retrieval strength (0-1) */
    current_strength: number;
    /** Time since last access (milliseconds) */
    time_since_access: number;
    /** Number of successful retrievals */
    retrieval_count: number;
    /** Number of failed retrieval attempts */
    failed_retrievals: number;
    /** Decay rate constant */
    decay_rate: number;
    /** Last intervention timestamp */
    last_intervention?: string;
    /** Intervention history */
    intervention_history: InterventionRecord[];
}
export interface InterventionRecord {
    timestamp: string;
    type: 'contextual_cue' | 'fragment_priming' | 'enhanced_reinstatement' | 'deep_reconstruction';
    effectiveness: number;
    retrieval_success: boolean;
    strength_before: number;
    strength_after: number;
}
export interface ContextualCue {
    type: 'temporal' | 'emotional' | 'semantic' | 'environmental';
    strength: number;
    content: string;
    associations: string[];
}
export interface MemoryFragment {
    id: string;
    content: string;
    type: 'keywords' | 'phrases' | 'emotional_markers' | 'contextual_anchors';
    relevance_score: number;
    activation_threshold: number;
}
/**
 * Enhanced memory item with temporal decay tracking
 * Extends both MemoryItem and MemoryEntry for cross-system compatibility
 */
export interface TemporalMemoryItem extends MemoryItem {
    temporal_id: string;
    decay_metrics: DecayMetrics;
    fragments: MemoryFragment[];
    contextual_cues: ContextualCue[];
    decay_prediction: {
        predicted_4h_strength: number;
        predicted_24h_strength: number;
        predicted_3d_strength: number;
        predicted_7d_strength: number;
        critical_intervention_time: string;
    };
    rescue_status: {
        requires_intervention: boolean;
        next_intervention_time: string;
        intervention_priority: 'low' | 'medium' | 'high' | 'critical';
        rescue_strategy: 'mild_contextual' | 'fragment_priming' | 'enhanced_reinstatement' | 'deep_reconstruction';
    };
    runtime_memory_ref?: string;
    episodic_memory_ref?: string;
    user_recall_patterns: {
        preferred_cue_types: string[];
        effective_intervention_types: string[];
        recall_success_rate: number;
        optimal_spacing_interval: number;
    };
}
/**
 * Memory decay model based on neuroscience research
 * Implements spaced repetition and forgetting curve mathematics
 */
export interface DecayModel {
    forgetting_curve: {
        initial_retention: number;
        decay_constant: number;
        asymptotic_retention: number;
    };
    spacing_intervals: {
        first_review: number;
        second_review: number;
        third_review: number;
        fourth_review: number;
    };
    intervention_effectiveness: {
        at_4h: number;
        at_24h: number;
        at_3d: number;
        at_7d: number;
    };
}
/**
 * Batch rescue operation for memory maintenance
 */
export interface BatchRescueOperation {
    operation_id: string;
    timestamp: string;
    target_memories: string[];
    rescue_type: 'scheduled_maintenance' | 'emergency_intervention' | 'pattern_reinforcement';
    batch_size: number;
    estimated_duration: number;
    priority_queue: TemporalMemoryItem[];
    completion_status: 'pending' | 'in_progress' | 'completed' | 'failed';
    results: {
        successful_rescues: number;
        failed_rescues: number;
        average_effectiveness: number;
        next_maintenance_time: string;
    };
}
/**
 * Progressive revelation system for adaptive intervention
 */
export interface ProgressiveRevelation {
    revelation_id: string;
    memory_id: string;
    stages: RevelationStage[];
    current_stage: number;
    adaptation_metrics: {
        user_response_time: number;
        recognition_accuracy: number;
        interference_level: number;
        confidence_rating: number;
    };
    next_revelation_strategy: 'increase_intensity' | 'change_modality' | 'add_context' | 'complete_reveal';
}
export interface RevelationStage {
    stage_number: number;
    revelation_type: 'minimal_cue' | 'partial_fragment' | 'contextual_hint' | 'direct_prompt';
    content: string;
    expected_effectiveness: number;
    timeout_duration: number;
    success_criteria: {
        recognition_threshold: number;
        response_time_limit: number;
        confidence_minimum: number;
    };
}
export default TemporalMemoryItem;
//# sourceMappingURL=TemporalMemoryItem.d.ts.map