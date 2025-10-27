/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0
 * MemoryRescueScheduler - Batch Memory Rescue Operations
 * 
 * Agent Gamma - Strategic Memory Maintenance
 * Coordinates batch rescue operations at optimal intervals: 4h, 24h, 3d, 7d
 */

import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import { join } from 'path';
import { TemporalMemoryItem, BatchRescueOperation, DecayModel } from './TemporalMemoryItem';
import DecayWatchdog from './DecayWatchdog';
import SelectivePriming from './SelectivePriming';

interface RescueSchedule {
  schedule_id: string;
  interval_type: '4h' | '24h' | '3d' | '7d';
  next_execution: string;
  target_memories: string[];
  batch_size: number;
  priority_level: 'maintenance' | 'urgent' | 'critical';
  estimated_duration: number;
  success_rate_target: number;
}

interface RescueMetrics {
  total_rescues_attempted: number;
  total_rescues_successful: number;
  success_rate_by_interval: {
    '4h': number;
    '24h': number;
    '3d': number;
    '7d': number;
  };
  average_effectiveness_by_interval: {
    '4h': number;
    '24h': number;
    '3d': number;
    '7d': number;
  };
  batch_performance: {
    avg_batch_size: number;
    avg_completion_time: number;
    failures_by_cause: Record<string, number>;
  };
}

interface IntervalConfiguration {
  interval: '4h' | '24h' | '3d' | '7d';
  milliseconds: number;
  effectiveness_target: number;
  max_batch_size: number;
  priority_threshold: number; // decay strength threshold for inclusion
  strategy_preference: string[];
}

export class MemoryRescueScheduler extends EventEmitter {
  private schedules: Map<string, RescueSchedule> = new Map();
  private activeOperations: Map<string, BatchRescueOperation> = new Map();
  private schedulerPath: string;
  private decayWatchdog: DecayWatchdog;
  private selectivePriming: SelectivePriming;
  private intervalConfigs: Map<string, IntervalConfiguration> = new Map();
  private rescueMetrics: RescueMetrics;
  private isRunning: boolean = false;
  private schedulerTimer: NodeJS.Timeout | null = null;

  constructor(
    decayWatchdog: DecayWatchdog,
    selectivePriming: SelectivePriming,
    basePath?: string
  ) {
    super();
    
    this.decayWatchdog = decayWatchdog;
    this.selectivePriming = selectivePriming;
    this.schedulerPath = basePath || join(process.cwd(), 'memory-v3');
    
    this.initializeIntervalConfigurations();
    this.initializeRescueMetrics();
    
    // Event listeners
    this.on('batch_rescue_completed', this.handleBatchRescueCompleted.bind(this));
    this.on('rescue_operation_failed', this.handleRescueOperationFailed.bind(this));
    this.on('schedule_updated', this.handleScheduleUpdated.bind(this));
  }

  /**
   * Initialize rescue scheduler with predefined intervals
   */
  public async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.schedulerPath, { recursive: true });
      
      // Load existing schedules and metrics
      await this.loadSchedules();
      await this.loadRescueMetrics();
      
      // Create default schedules if none exist
      if (this.schedules.size === 0) {
        await this.createDefaultSchedules();
      }
      
      // Start scheduler
      this.startScheduler();
      
      console.log(`📅 MemoryRescueScheduler initialized: ${this.schedules.size} schedules active`);
      
      this.emit('scheduler_initialized', {
        schedules_count: this.schedules.size,
        active_operations: this.activeOperations.size
      });
      
    } catch (error) {
      console.error('MemoryRescueScheduler initialization failed:', error);
      throw error;
    }
  }

  /**
   * Schedule batch rescue operation for specific interval
   */
  public async scheduleBatchRescue(
    intervalType: '4h' | '24h' | '3d' | '7d',
    targetMemories: string[],
    priority: 'maintenance' | 'urgent' | 'critical' = 'maintenance'
  ): Promise<string> {
    const scheduleId = `schedule-${intervalType}-${Date.now()}`;
    const config = this.intervalConfigs.get(intervalType)!;
    
    // Calculate next execution time
    const nextExecution = new Date(Date.now() + config.milliseconds).toISOString();
    
    // Determine batch size based on priority and limits
    let batchSize = Math.min(targetMemories.length, config.max_batch_size);
    if (priority === 'critical') {
      batchSize = Math.min(targetMemories.length, config.max_batch_size * 1.5);
    }
    
    const schedule: RescueSchedule = {
      schedule_id: scheduleId,
      interval_type: intervalType,
      next_execution: nextExecution,
      target_memories: targetMemories.slice(0, batchSize),
      batch_size: batchSize,
      priority_level: priority,
      estimated_duration: this.estimateRescueDuration(batchSize, intervalType),
      success_rate_target: config.effectiveness_target
    };
    
    this.schedules.set(scheduleId, schedule);
    await this.saveSchedules();
    
    console.log(`📅 Batch rescue scheduled: ${scheduleId} for ${intervalType} with ${batchSize} memories`);
    
    this.emit('batch_rescue_scheduled', {
      schedule_id: scheduleId,
      interval_type: intervalType,
      batch_size: batchSize,
      next_execution: nextExecution,
      priority
    });
    
    return scheduleId;
  }

  /**
   * Execute immediate batch rescue operation
   */
  public async executeImmediateBatchRescue(
    targetMemories: TemporalMemoryItem[],
    urgency: 'emergency' | 'scheduled' | 'maintenance' = 'scheduled'
  ): Promise<BatchRescueOperation> {
    const operationId = `batch-rescue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    // Determine rescue type based on urgency
    let rescueType: 'scheduled_maintenance' | 'emergency_intervention' | 'pattern_reinforcement';
    switch (urgency) {
      case 'emergency':
        rescueType = 'emergency_intervention';
        break;
      case 'maintenance':
        rescueType = 'scheduled_maintenance';
        break;
      default:
        rescueType = 'pattern_reinforcement';
    }
    
    // Create batch operation
    const operation: BatchRescueOperation = {
      operation_id: operationId,
      timestamp: new Date().toISOString(),
      target_memories: targetMemories.map(m => m.temporal_id),
      rescue_type: rescueType,
      batch_size: targetMemories.length,
      estimated_duration: this.estimateRescueDuration(targetMemories.length, '4h'), // Default estimation
      priority_queue: [...targetMemories].sort((a, b) => this.calculateRescuePriority(b) - this.calculateRescuePriority(a)),
      completion_status: 'pending',
      results: {
        successful_rescues: 0,
        failed_rescues: 0,
        average_effectiveness: 0,
        next_maintenance_time: ''
      }
    };
    
    this.activeOperations.set(operationId, operation);
    
    console.log(`🚀 Starting immediate batch rescue: ${operationId} with ${targetMemories.length} memories`);
    
    this.emit('batch_rescue_started', {
      operation_id: operationId,
      rescue_type: rescueType,
      batch_size: targetMemories.length,
      urgency
    });
    
    // Execute rescue operation
    await this.executeBatchRescueOperation(operation);
    
    return operation;
  }

  /**
   * Execute batch rescue operation with progress tracking
   */
  private async executeBatchRescueOperation(operation: BatchRescueOperation): Promise<void> {
    const startTime = Date.now();
    operation.completion_status = 'in_progress';
    
    let totalEffectiveness = 0;
    let successfulRescues = 0;
    let failedRescues = 0;
    
    try {
      console.log(`🔄 Executing batch rescue: ${operation.operation_id} - ${operation.batch_size} memories`);
      
      // Process memories in priority order
      for (let i = 0; i < operation.priority_queue.length; i++) {
        const memory = operation.priority_queue[i];
        
        try {
          // Emit progress update
          this.emit('rescue_progress', {
            operation_id: operation.operation_id,
            current_memory: i + 1,
            total_memories: operation.priority_queue.length,
            memory_id: memory.temporal_id
          });
          
          // Execute individual memory rescue
          const rescueResult = await this.rescueIndividualMemory(memory, operation.rescue_type);
          
          if (rescueResult.success) {
            successfulRescues++;
            totalEffectiveness += rescueResult.effectiveness;
            
            // Update memory decay metrics
            memory.decay_metrics.current_strength = Math.min(1.0, memory.decay_metrics.current_strength + rescueResult.effectiveness * 0.3);
            memory.decay_metrics.last_intervention = new Date().toISOString();
            memory.rescue_status.requires_intervention = false;
            
            console.log(`✅ Memory rescued: ${memory.temporal_id} - effectiveness: ${rescueResult.effectiveness.toFixed(2)}`);
            
          } else {
            failedRescues++;
            console.log(`❌ Memory rescue failed: ${memory.temporal_id} - ${rescueResult.error}`);
          }
          
          // Small delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          failedRescues++;
          console.error(`💥 Error rescuing memory ${memory.temporal_id}:`, error);
        }
      }
      
      // Calculate results
      const averageEffectiveness = successfulRescues > 0 ? totalEffectiveness / successfulRescues : 0;
      const nextMaintenanceTime = this.calculateNextMaintenanceTime(operation.rescue_type);
      
      operation.results = {
        successful_rescues: successfulRescues,
        failed_rescues: failedRescues,
        average_effectiveness: averageEffectiveness,
        next_maintenance_time: nextMaintenanceTime
      };
      
      operation.completion_status = 'completed';
      
      // Update rescue metrics
      this.updateRescueMetrics(operation);
      
      const completionTime = Date.now() - startTime;
      
      console.log(`✅ Batch rescue completed: ${operation.operation_id}`);
      console.log(`   Successful: ${successfulRescues}/${operation.batch_size}`);
      console.log(`   Average effectiveness: ${averageEffectiveness.toFixed(2)}`);
      console.log(`   Completion time: ${completionTime}ms`);
      
      this.emit('batch_rescue_completed', {
        operation_id: operation.operation_id,
        successful_rescues: successfulRescues,
        failed_rescues: failedRescues,
        average_effectiveness: averageEffectiveness,
        completion_time: completionTime
      });
      
    } catch (error) {
      operation.completion_status = 'failed';
      console.error(`💥 Batch rescue operation failed: ${operation.operation_id}`, error);
      
      this.emit('rescue_operation_failed', {
        operation_id: operation.operation_id,
        error: error.message,
        partial_results: {
          successful_rescues: successfulRescues,
          failed_rescues: failedRescues
        }
      });
    } finally {
      // Clean up active operation
      setTimeout(() => {
        this.activeOperations.delete(operation.operation_id);
      }, 60000); // Keep for 1 minute for status checking
    }
  }

  /**
   * Rescue individual memory using appropriate strategy
   */
  private async rescueIndividualMemory(
    memory: TemporalMemoryItem,
    rescueType: string
  ): Promise<{success: boolean, effectiveness: number, error?: string}> {
    try {
      // Determine rescue strategy based on memory decay stage and type
      const timeSinceAccess = memory.decay_metrics.time_since_access;
      const currentStrength = memory.decay_metrics.current_strength;
      
      let strategy: string;
      let expectedEffectiveness: number;
      
      if (timeSinceAccess <= 4 * 60 * 60 * 1000) { // 4 hours
        strategy = 'mild_contextual';
        expectedEffectiveness = 0.70;
      } else if (timeSinceAccess <= 24 * 60 * 60 * 1000) { // 24 hours
        strategy = 'fragment_priming';
        expectedEffectiveness = 0.59;
      } else if (timeSinceAccess <= 3 * 24 * 60 * 60 * 1000) { // 3 days
        strategy = 'enhanced_reinstatement';
        expectedEffectiveness = 0.45;
      } else { // 7+ days
        strategy = 'deep_reconstruction';
        expectedEffectiveness = 0.25;
      }
      
      // Create priming session
      const sessionId = await this.selectivePriming.createPrimingSession(memory, 'medium');
      
      // Execute progressive revelation
      const revelation = await this.selectivePriming.executeProgressiveRevelation(sessionId, true);
      
      // Generate effectiveness report
      const report = await this.selectivePriming.generateEffectivenessReport(sessionId);
      
      const actualEffectiveness = report.session_summary?.final_effectiveness || 0;
      const success = actualEffectiveness >= (expectedEffectiveness * 0.7); // 70% of expected
      
      // Record rescue attempt in memory
      memory.decay_metrics.intervention_history.push({
        timestamp: new Date().toISOString(),
        type: strategy as any,
        effectiveness: actualEffectiveness,
        retrieval_success: success,
        strength_before: currentStrength,
        strength_after: currentStrength + (actualEffectiveness * 0.3)
      });
      
      return {
        success,
        effectiveness: actualEffectiveness
      };
      
    } catch (error) {
      return {
        success: false,
        effectiveness: 0,
        error: error.message
      };
    }
  }

  /**
   * Get comprehensive rescue scheduler status
   */
  public async getSchedulerStatus(): Promise<any> {
    const activeSchedules = Array.from(this.schedules.values());
    const activeOps = Array.from(this.activeOperations.values());
    
    return {
      scheduler_info: {
        is_running: this.isRunning,
        total_schedules: activeSchedules.length,
        active_operations: activeOps.length,
        next_scheduled_rescue: activeSchedules
          .sort((a, b) => new Date(a.next_execution).getTime() - new Date(b.next_execution).getTime())[0]?.next_execution
      },
      
      schedules_by_interval: {
        '4h': activeSchedules.filter(s => s.interval_type === '4h').length,
        '24h': activeSchedules.filter(s => s.interval_type === '24h').length,
        '3d': activeSchedules.filter(s => s.interval_type === '3d').length,
        '7d': activeSchedules.filter(s => s.interval_type === '7d').length
      },
      
      current_operations: activeOps.map(op => ({
        operation_id: op.operation_id,
        rescue_type: op.rescue_type,
        batch_size: op.batch_size,
        completion_status: op.completion_status,
        progress: op.completion_status === 'in_progress' ? 
          `${op.results.successful_rescues + op.results.failed_rescues}/${op.batch_size}` : 
          'N/A'
      })),
      
      performance_metrics: this.rescueMetrics,
      
      upcoming_schedules: activeSchedules
        .sort((a, b) => new Date(a.next_execution).getTime() - new Date(b.next_execution).getTime())
        .slice(0, 5)
        .map(s => ({
          schedule_id: s.schedule_id,
          interval_type: s.interval_type,
          next_execution: s.next_execution,
          batch_size: s.batch_size,
          priority: s.priority_level
        }))
    };
  }

  /**
   * Optimize rescue schedules based on performance metrics
   */
  public async optimizeSchedules(): Promise<void> {
    console.log('🔧 Optimizing rescue schedules based on performance metrics...');
    
    const metrics = this.rescueMetrics;
    const schedules = Array.from(this.schedules.values());
    
    for (const schedule of schedules) {
      const intervalType = schedule.interval_type;
      const currentSuccessRate = metrics.success_rate_by_interval[intervalType];
      const targetSuccessRate = schedule.success_rate_target;
      
      // Adjust batch size based on success rate
      if (currentSuccessRate < targetSuccessRate * 0.8) {
        // Poor performance - reduce batch size to improve success rate
        schedule.batch_size = Math.max(5, Math.floor(schedule.batch_size * 0.8));
        console.log(`📉 Reduced batch size for ${intervalType} schedule: ${schedule.batch_size}`);
        
      } else if (currentSuccessRate > targetSuccessRate * 1.1) {
        // Excellent performance - can increase batch size
        const config = this.intervalConfigs.get(intervalType)!;
        schedule.batch_size = Math.min(config.max_batch_size, Math.floor(schedule.batch_size * 1.2));
        console.log(`📈 Increased batch size for ${intervalType} schedule: ${schedule.batch_size}`);
      }
      
      // Adjust priority levels based on effectiveness
      const avgEffectiveness = metrics.average_effectiveness_by_interval[intervalType];
      if (avgEffectiveness < 0.3 && schedule.priority_level === 'maintenance') {
        schedule.priority_level = 'urgent';
        console.log(`⚡ Elevated priority for ${intervalType} schedule due to low effectiveness`);
      }
    }
    
    await this.saveSchedules();
    
    this.emit('schedules_optimized', {
      total_schedules_optimized: schedules.length,
      optimization_timestamp: new Date().toISOString()
    });
  }

  /**
   * Start the rescue scheduler
   */
  private startScheduler(): void {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
    }
    
    // Check schedules every minute
    this.schedulerTimer = setInterval(async () => {
      await this.checkAndExecuteSchedules();
    }, 60 * 1000);
    
    this.isRunning = true;
    console.log('🚀 MemoryRescueScheduler started');
  }

  /**
   * Stop the rescue scheduler
   */
  public stopScheduler(): void {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    
    this.isRunning = false;
    console.log('🛑 MemoryRescueScheduler stopped');
  }

  /**
   * Check for due schedules and execute them
   */
  private async checkAndExecuteSchedules(): Promise<void> {
    const now = new Date();
    const dueSchedules = Array.from(this.schedules.values())
      .filter(schedule => new Date(schedule.next_execution) <= now);
    
    for (const schedule of dueSchedules) {
      try {
        console.log(`⏰ Executing scheduled rescue: ${schedule.schedule_id}`);
        
        // Get current memories that need rescue
        const watchdogStats = await this.decayWatchdog.getWatchdogStats();
        // This would filter memories based on schedule criteria
        // For now, we'll simulate with empty array
        const targetMemories: TemporalMemoryItem[] = [];
        
        if (targetMemories.length > 0) {
          await this.executeImmediateBatchRescue(targetMemories, 'scheduled');
        }
        
        // Schedule next execution
        const config = this.intervalConfigs.get(schedule.interval_type)!;
        schedule.next_execution = new Date(now.getTime() + config.milliseconds).toISOString();
        
        console.log(`📅 Next ${schedule.interval_type} rescue scheduled for: ${schedule.next_execution}`);
        
      } catch (error) {
        console.error(`💥 Error executing scheduled rescue ${schedule.schedule_id}:`, error);
      }
    }
    
    if (dueSchedules.length > 0) {
      await this.saveSchedules();
    }
  }

  // Private helper methods
  private initializeIntervalConfigurations(): void {
    const configs: IntervalConfiguration[] = [
      {
        interval: '4h',
        milliseconds: 4 * 60 * 60 * 1000,
        effectiveness_target: 0.70,
        max_batch_size: 20,
        priority_threshold: 0.8,
        strategy_preference: ['mild_contextual', 'gentle_contextual']
      },
      {
        interval: '24h',
        milliseconds: 24 * 60 * 60 * 1000,
        effectiveness_target: 0.59,
        max_batch_size: 35,
        priority_threshold: 0.6,
        strategy_preference: ['fragment_priming', 'fragment_intensive']
      },
      {
        interval: '3d',
        milliseconds: 3 * 24 * 60 * 60 * 1000,
        effectiveness_target: 0.45,
        max_batch_size: 50,
        priority_threshold: 0.4,
        strategy_preference: ['enhanced_reinstatement', 'multimodal_reconstruction']
      },
      {
        interval: '7d',
        milliseconds: 7 * 24 * 60 * 60 * 1000,
        effectiveness_target: 0.25,
        max_batch_size: 25,
        priority_threshold: 0.2,
        strategy_preference: ['deep_reconstruction', 'comprehensive_recovery']
      }
    ];
    
    configs.forEach(config => {
      this.intervalConfigs.set(config.interval, config);
    });
  }

  private initializeRescueMetrics(): void {
    this.rescueMetrics = {
      total_rescues_attempted: 0,
      total_rescues_successful: 0,
      success_rate_by_interval: {
        '4h': 0.70,
        '24h': 0.59,
        '3d': 0.45,
        '7d': 0.25
      },
      average_effectiveness_by_interval: {
        '4h': 0.70,
        '24h': 0.59,
        '3d': 0.45,
        '7d': 0.25
      },
      batch_performance: {
        avg_batch_size: 0,
        avg_completion_time: 0,
        failures_by_cause: {}
      }
    };
  }

  private async createDefaultSchedules(): Promise<void> {
    const intervals: Array<'4h' | '24h' | '3d' | '7d'> = ['4h', '24h', '3d', '7d'];
    
    for (const interval of intervals) {
      await this.scheduleBatchRescue(interval, [], 'maintenance');
    }
    
    console.log('📅 Created default rescue schedules for all intervals');
  }

  private estimateRescueDuration(batchSize: number, intervalType: string): number {
    // Base time per memory rescue (in milliseconds)
    const baseTimePerMemory = {
      '4h': 2000,   // 2 seconds for mild contextual
      '24h': 4000,  // 4 seconds for fragment priming
      '3d': 6000,   // 6 seconds for enhanced reinstatement
      '7d': 10000   // 10 seconds for deep reconstruction
    };
    
    const baseTime = baseTimePerMemory[intervalType as keyof typeof baseTimePerMemory] || 5000;
    return batchSize * baseTime;
  }

  private calculateRescuePriority(memory: TemporalMemoryItem): number {
    const decayStrength = 1 - memory.decay_metrics.current_strength;
    const importance = memory.importance / 10;
    const timeFactor = Math.min(1, memory.decay_metrics.time_since_access / (7 * 24 * 60 * 60 * 1000));
    
    return decayStrength * 0.5 + importance * 0.3 + timeFactor * 0.2;
  }

  private calculateNextMaintenanceTime(rescueType: string): string {
    const intervals = {
      'scheduled_maintenance': 24 * 60 * 60 * 1000, // 24 hours
      'emergency_intervention': 4 * 60 * 60 * 1000,  // 4 hours
      'pattern_reinforcement': 12 * 60 * 60 * 1000   // 12 hours
    };
    
    const interval = intervals[rescueType as keyof typeof intervals] || intervals.scheduled_maintenance;
    return new Date(Date.now() + interval).toISOString();
  }

  private updateRescueMetrics(operation: BatchRescueOperation): void {
    const metrics = this.rescueMetrics;
    
    metrics.total_rescues_attempted += operation.batch_size;
    metrics.total_rescues_successful += operation.results.successful_rescues;
    
    // Update batch performance
    const currentBatches = metrics.batch_performance.avg_batch_size === 0 ? 1 : 
      metrics.total_rescues_attempted / metrics.batch_performance.avg_batch_size;
    
    metrics.batch_performance.avg_batch_size = 
      (metrics.batch_performance.avg_batch_size * (currentBatches - 1) + operation.batch_size) / currentBatches;
    
    // Note: In a real implementation, we would track interval-specific metrics
    // based on the memories' decay timing
  }

  private async handleBatchRescueCompleted(event: any): void {
    console.log(`✅ Batch rescue completed: ${event.operation_id} - ${event.successful_rescues}/${event.successful_rescues + event.failed_rescues} successful`);
  }

  private async handleRescueOperationFailed(event: any): void {
    console.log(`❌ Rescue operation failed: ${event.operation_id} - ${event.error}`);
  }

  private async handleScheduleUpdated(event: any): void {
    console.log(`📅 Schedule updated: ${event.schedule_id}`);
  }

  private async loadSchedules(): Promise<void> {
    try {
      const schedulesFile = join(this.schedulerPath, 'rescue-schedules.json');
      const data = await fs.readFile(schedulesFile, 'utf8');
      const schedulesArray = JSON.parse(data);
      
      schedulesArray.forEach((schedule: RescueSchedule) => {
        this.schedules.set(schedule.schedule_id, schedule);
      });
      
    } catch (error) {
      console.log('No existing schedules found, will create defaults');
    }
  }

  private async saveSchedules(): Promise<void> {
    try {
      const schedulesFile = join(this.schedulerPath, 'rescue-schedules.json');
      const schedulesArray = Array.from(this.schedules.values());
      await fs.writeFile(schedulesFile, JSON.stringify(schedulesArray, null, 2));
    } catch (error) {
      console.error('Failed to save schedules:', error);
    }
  }

  private async loadRescueMetrics(): Promise<void> {
    try {
      const metricsFile = join(this.schedulerPath, 'rescue-metrics.json');
      const data = await fs.readFile(metricsFile, 'utf8');
      this.rescueMetrics = JSON.parse(data);
    } catch (error) {
      console.log('No existing metrics found, using defaults');
    }
  }

  private async saveRescueMetrics(): Promise<void> {
    try {
      const metricsFile = join(this.schedulerPath, 'rescue-metrics.json');
      await fs.writeFile(metricsFile, JSON.stringify(this.rescueMetrics, null, 2));
    } catch (error) {
      console.error('Failed to save rescue metrics:', error);
    }
  }
}

export default MemoryRescueScheduler;