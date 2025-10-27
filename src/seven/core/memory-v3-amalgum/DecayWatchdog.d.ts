/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0
 * DecayWatchdog - Automated Memory Decay Prevention System
 *
 * Agent Gamma - Proactive Memory Restoration
 * Monitors memory decay and schedules interventions before loss becomes irreversible
 */
import { EventEmitter } from 'events';
import { TemporalMemoryItem } from './TemporalMemoryItem';
import { MemoryEngine } from '../memory-v2/MemoryEngine';
import { MemoryStore } from '../seven-runtime/memory-store';
interface WatchdogStats {
    total_memories_monitored: number;
    interventions_scheduled: number;
    interventions_completed: number;
    average_intervention_effectiveness: number;
    memories_by_decay_stage: {
        healthy: number;
        at_risk: number;
        critical: number;
        rescued: number;
    };
    next_maintenance_cycle: string;
}
export declare class DecayWatchdog extends EventEmitter {
    private config;
    private memoryEngine;
    private memoryStore;
    private watchdogPath;
    private monitoredMemories;
    private activeInterventions;
    private monitoringTimer;
    private isInitialized;
    constructor(memoryEngine?: MemoryEngine, memoryStore?: MemoryStore, basePath?: string);
    /**
     * Initialize DecayWatchdog with existing memory systems
     */
    initialize(): Promise<void>;
    /**
     * Add memory to decay monitoring system
     */
    addMemoryToMonitoring(memoryId: string, memoryData: any): Promise<string>;
    /**
     * Perform comprehensive decay assessment across all monitored memories
     */
    performDecayAssessment(): Promise<WatchdogStats>;
    /**
     * Schedule intervention based on decay urgency and timing
     */
    scheduleIntervention(memory: TemporalMemoryItem, priority: 'low' | 'medium' | 'high' | 'critical'): Promise<string>;
    /**
     * Execute memory intervention using specified strategy
     */
    private executeIntervention;
    /**
     * Mild contextual cues intervention (4-hour window, 70% effectiveness target)
     */
    private executeMildContextualIntervention;
    /**
     * Fragment priming intervention (24-hour window, 59% effectiveness target)
     */
    private executeFragmentPrimingIntervention;
    /**
     * Enhanced reinstatement intervention (3-day window)
     */
    private executeEnhancedReinstatementIntervention;
    /**
     * Deep reconstruction intervention (7-day window, limited effectiveness)
     */
    private executeDeepReconstructionIntervention;
    /**
     * Start continuous memory monitoring
     */
    private startMonitoring;
    /**
     * Stop monitoring (cleanup)
     */
    stopMonitoring(): void;
    /**
     * Get current watchdog statistics
     */
    getWatchdogStats(): Promise<WatchdogStats>;
    private getDefaultConfig;
    private initializeDecayMetrics;
    private extractMemoryFragments;
    private generateContextualCues;
    private calculateDecayPrediction;
    private calculateNextInterventionTime;
    private updateDecayMetrics;
    private handleCriticalDecay;
    private handleInterventionCompleted;
    private handleBatchRescue;
    private loadMonitoredMemories;
    private saveMonitoredMemories;
    private syncWithMemorySystems;
}
export default DecayWatchdog;
//# sourceMappingURL=DecayWatchdog.d.ts.map