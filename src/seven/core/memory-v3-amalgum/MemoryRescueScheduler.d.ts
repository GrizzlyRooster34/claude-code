/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0
 * MemoryRescueScheduler - Batch Memory Rescue Operations
 *
 * Agent Gamma - Strategic Memory Maintenance
 * Coordinates batch rescue operations at optimal intervals: 4h, 24h, 3d, 7d
 */
import { EventEmitter } from 'events';
import { TemporalMemoryItem, BatchRescueOperation } from './TemporalMemoryItem';
import DecayWatchdog from './DecayWatchdog';
import SelectivePriming from './SelectivePriming';
export declare class MemoryRescueScheduler extends EventEmitter {
    private schedules;
    private activeOperations;
    private schedulerPath;
    private decayWatchdog;
    private selectivePriming;
    private intervalConfigs;
    private rescueMetrics;
    private isRunning;
    private schedulerTimer;
    constructor(decayWatchdog: DecayWatchdog, selectivePriming: SelectivePriming, basePath?: string);
    /**
     * Initialize rescue scheduler with predefined intervals
     */
    initialize(): Promise<void>;
    /**
     * Schedule batch rescue operation for specific interval
     */
    scheduleBatchRescue(intervalType: '4h' | '24h' | '3d' | '7d', targetMemories: string[], priority?: 'maintenance' | 'urgent' | 'critical'): Promise<string>;
    /**
     * Execute immediate batch rescue operation
     */
    executeImmediateBatchRescue(targetMemories: TemporalMemoryItem[], urgency?: 'emergency' | 'scheduled' | 'maintenance'): Promise<BatchRescueOperation>;
    /**
     * Execute batch rescue operation with progress tracking
     */
    private executeBatchRescueOperation;
    /**
     * Rescue individual memory using appropriate strategy
     */
    private rescueIndividualMemory;
    /**
     * Get comprehensive rescue scheduler status
     */
    getSchedulerStatus(): Promise<any>;
    /**
     * Optimize rescue schedules based on performance metrics
     */
    optimizeSchedules(): Promise<void>;
    /**
     * Start the rescue scheduler
     */
    private startScheduler;
    /**
     * Stop the rescue scheduler
     */
    stopScheduler(): void;
    /**
     * Check for due schedules and execute them
     */
    private checkAndExecuteSchedules;
    private initializeIntervalConfigurations;
    private initializeRescueMetrics;
    private createDefaultSchedules;
    private estimateRescueDuration;
    private calculateRescuePriority;
    private calculateNextMaintenanceTime;
    private updateRescueMetrics;
    private handleBatchRescueCompleted;
    private handleRescueOperationFailed;
    private handleScheduleUpdated;
    private loadSchedules;
    private saveSchedules;
    private loadRescueMetrics;
    private saveRescueMetrics;
}
export default MemoryRescueScheduler;
//# sourceMappingURL=MemoryRescueScheduler.d.ts.map