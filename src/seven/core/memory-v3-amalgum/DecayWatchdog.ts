/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0
 * DecayWatchdog - Automated Memory Decay Prevention System
 * 
 * Agent Gamma - Proactive Memory Restoration
 * Monitors memory decay and schedules interventions before loss becomes irreversible
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { EventEmitter } from 'events';
import { TemporalMemoryItem, DecayMetrics, InterventionRecord, BatchRescueOperation, DecayModel } from './TemporalMemoryItem';
import { MemoryEngine } from '../memory-v2/MemoryEngine';
import { MemoryStore } from '../seven-runtime/memory-store';

interface WatchdogConfig {
  monitoring_interval: number; // milliseconds between checks
  intervention_thresholds: {
    critical: number;    // 0.3 - immediate intervention required
    high: number;        // 0.5 - intervention needed soon
    medium: number;      // 0.7 - schedule intervention
    low: number;         // 0.9 - monitoring only
  };
  batch_size_limits: {
    emergency: number;   // max memories per emergency batch
    maintenance: number; // max memories per maintenance batch
  };
  decay_model_params: DecayModel;
}

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

export class DecayWatchdog extends EventEmitter {
  private config: WatchdogConfig;
  private memoryEngine: MemoryEngine;
  private memoryStore: MemoryStore;
  private watchdogPath: string;
  private monitoredMemories: Map<string, TemporalMemoryItem> = new Map();
  private activeInterventions: Map<string, BatchRescueOperation> = new Map();
  private monitoringTimer: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;

  constructor(memoryEngine?: MemoryEngine, memoryStore?: MemoryStore, basePath?: string) {
    super();
    
    this.config = this.getDefaultConfig();
    this.memoryEngine = memoryEngine || new MemoryEngine();
    this.memoryStore = memoryStore || new MemoryStore();
    this.watchdogPath = basePath || join(process.cwd(), 'memory-v3');
    
    // Event handlers
    this.on('critical_decay_detected', this.handleCriticalDecay.bind(this));
    this.on('intervention_completed', this.handleInterventionCompleted.bind(this));
    this.on('batch_rescue_needed', this.handleBatchRescue.bind(this));
  }

  /**
   * Initialize DecayWatchdog with existing memory systems
   */
  public async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.watchdogPath, { recursive: true });
      
      // Load existing monitored memories
      await this.loadMonitoredMemories();
      
      // Sync with existing memory systems
      await this.syncWithMemorySystems();
      
      // Start continuous monitoring
      this.startMonitoring();
      
      this.isInitialized = true;
      console.log(`🔍 DecayWatchdog initialized: monitoring ${this.monitoredMemories.size} memories`);
      
      this.emit('watchdog_initialized', {
        memories_monitored: this.monitoredMemories.size,
        monitoring_interval: this.config.monitoring_interval
      });
      
    } catch (error) {
      console.error('DecayWatchdog initialization failed:', error);
      throw error;
    }
  }

  /**
   * Add memory to decay monitoring system
   */
  public async addMemoryToMonitoring(memoryId: string, memoryData: any): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('DecayWatchdog not initialized');
    }

    const temporalId = `temporal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const temporalMemory: TemporalMemoryItem = {
      // Base MemoryItem properties
      id: memoryId,
      timestamp: new Date().toISOString(),
      topic: memoryData.topic || 'general',
      agent: 'decay-watchdog',
      emotion: memoryData.emotion || 'neutral',
      context: memoryData.context || '',
      importance: memoryData.importance || 5,
      tags: memoryData.tags || [],
      relatedMemories: memoryData.relatedMemories || [],
      
      // Temporal properties
      temporal_id: temporalId,
      decay_metrics: this.initializeDecayMetrics(),
      fragments: this.extractMemoryFragments(memoryData),
      contextual_cues: this.generateContextualCues(memoryData),
      decay_prediction: this.calculateDecayPrediction(),
      rescue_status: {
        requires_intervention: false,
        next_intervention_time: this.calculateNextInterventionTime(4), // 4 hours default
        intervention_priority: 'low',
        rescue_strategy: 'mild_contextual'
      },
      user_recall_patterns: {
        preferred_cue_types: ['semantic', 'temporal'],
        effective_intervention_types: ['fragment_priming'],
        recall_success_rate: 0.8, // Initial optimistic baseline
        optimal_spacing_interval: 4 * 60 * 60 * 1000 // 4 hours in ms
      }
    };

    this.monitoredMemories.set(temporalId, temporalMemory);
    await this.saveMonitoredMemories();
    
    console.log(`🔍 Memory added to decay monitoring: ${temporalId}`);
    return temporalId;
  }

  /**
   * Perform comprehensive decay assessment across all monitored memories
   */
  public async performDecayAssessment(): Promise<WatchdogStats> {
    const stats: WatchdogStats = {
      total_memories_monitored: this.monitoredMemories.size,
      interventions_scheduled: 0,
      interventions_completed: 0,
      average_intervention_effectiveness: 0,
      memories_by_decay_stage: {
        healthy: 0,
        at_risk: 0,
        critical: 0,
        rescued: 0
      },
      next_maintenance_cycle: new Date(Date.now() + this.config.monitoring_interval).toISOString()
    };

    const now = Date.now();
    let totalEffectiveness = 0;
    let completedInterventions = 0;

    for (const [temporalId, memory] of this.monitoredMemories) {
      // Update decay metrics
      const updatedMemory = this.updateDecayMetrics(memory, now);
      
      // Categorize memory by decay stage
      const currentStrength = updatedMemory.decay_metrics.current_strength;
      
      if (currentStrength >= this.config.intervention_thresholds.low) {
        stats.memories_by_decay_stage.healthy++;
      } else if (currentStrength >= this.config.intervention_thresholds.medium) {
        stats.memories_by_decay_stage.at_risk++;
      } else if (currentStrength >= this.config.intervention_thresholds.critical) {
        stats.memories_by_decay_stage.critical++;
        
        // Schedule intervention
        await this.scheduleIntervention(updatedMemory, 'high');
        stats.interventions_scheduled++;
      } else {
        // Critical - immediate intervention needed
        this.emit('critical_decay_detected', updatedMemory);
        await this.scheduleIntervention(updatedMemory, 'critical');
        stats.interventions_scheduled++;
      }

      // Calculate intervention effectiveness
      const interventionHistory = updatedMemory.decay_metrics.intervention_history;
      if (interventionHistory.length > 0) {
        const effectivenessSum = interventionHistory.reduce((sum, record) => sum + record.effectiveness, 0);
        totalEffectiveness += effectivenessSum / interventionHistory.length;
        completedInterventions++;
      }

      // Update memory in monitoring system
      this.monitoredMemories.set(temporalId, updatedMemory);
    }

    stats.interventions_completed = completedInterventions;
    stats.average_intervention_effectiveness = completedInterventions > 0 ? 
      totalEffectiveness / completedInterventions : 0;

    await this.saveMonitoredMemories();
    return stats;
  }

  /**
   * Schedule intervention based on decay urgency and timing
   */
  public async scheduleIntervention(
    memory: TemporalMemoryItem, 
    priority: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<string> {
    const interventionId = `intervention-${Date.now()}-${memory.temporal_id}`;
    const now = Date.now();
    const timeSinceAccess = memory.decay_metrics.time_since_access;
    
    // Determine intervention strategy based on timing and decay level
    let strategy: string;
    let scheduledTime: number;
    
    if (timeSinceAccess <= 4 * 60 * 60 * 1000) { // Within 4 hours
      strategy = 'mild_contextual';
      scheduledTime = now + (5 * 60 * 1000); // 5 minutes delay
    } else if (timeSinceAccess <= 24 * 60 * 60 * 1000) { // Within 24 hours
      strategy = 'fragment_priming';
      scheduledTime = now + (15 * 60 * 1000); // 15 minutes delay
    } else if (timeSinceAccess <= 3 * 24 * 60 * 60 * 1000) { // Within 3 days
      strategy = 'enhanced_reinstatement';
      scheduledTime = now + (30 * 60 * 1000); // 30 minutes delay
    } else { // Beyond 7 days
      strategy = 'deep_reconstruction';
      scheduledTime = now + (60 * 60 * 1000); // 1 hour delay
    }

    // Update memory rescue status
    memory.rescue_status = {
      requires_intervention: true,
      next_intervention_time: new Date(scheduledTime).toISOString(),
      intervention_priority: priority,
      rescue_strategy: strategy as any
    };

    // Schedule the intervention
    setTimeout(async () => {
      await this.executeIntervention(memory, strategy);
    }, scheduledTime - now);

    console.log(`📅 Intervention scheduled: ${interventionId} for ${memory.temporal_id} using ${strategy}`);
    
    this.emit('intervention_scheduled', {
      intervention_id: interventionId,
      memory_id: memory.temporal_id,
      strategy,
      scheduled_time: new Date(scheduledTime).toISOString(),
      priority
    });

    return interventionId;
  }

  /**
   * Execute memory intervention using specified strategy
   */
  private async executeIntervention(memory: TemporalMemoryItem, strategy: string): Promise<void> {
    const interventionStart = Date.now();
    let effectiveness = 0;
    let success = false;

    try {
      const strengthBefore = memory.decay_metrics.current_strength;
      
      switch (strategy) {
        case 'mild_contextual':
          effectiveness = await this.executeMildContextualIntervention(memory);
          break;
        case 'fragment_priming':
          effectiveness = await this.executeFragmentPrimingIntervention(memory);
          break;
        case 'enhanced_reinstatement':
          effectiveness = await this.executeEnhancedReinstatementIntervention(memory);
          break;
        case 'deep_reconstruction':
          effectiveness = await this.executeDeepReconstructionIntervention(memory);
          break;
        default:
          effectiveness = 0.3; // Fallback minimal effectiveness
      }

      // Update decay metrics with intervention results
      const strengthAfter = Math.min(1.0, strengthBefore + (effectiveness * 0.4)); // Max 40% boost
      success = effectiveness > 0.5;

      memory.decay_metrics.current_strength = strengthAfter;
      memory.decay_metrics.last_intervention = new Date().toISOString();
      
      const interventionRecord: InterventionRecord = {
        timestamp: new Date().toISOString(),
        type: strategy as any,
        effectiveness,
        retrieval_success: success,
        strength_before: strengthBefore,
        strength_after: strengthAfter
      };
      
      memory.decay_metrics.intervention_history.push(interventionRecord);
      
      // Reset rescue status if successful
      if (success) {
        memory.rescue_status.requires_intervention = false;
        memory.rescue_status.next_intervention_time = this.calculateNextInterventionTime();
        memory.rescue_status.intervention_priority = 'low';
      }

      console.log(`✅ Intervention completed: ${memory.temporal_id} - effectiveness: ${effectiveness.toFixed(2)}`);
      
      this.emit('intervention_completed', {
        memory_id: memory.temporal_id,
        strategy,
        effectiveness,
        success,
        duration: Date.now() - interventionStart
      });

    } catch (error) {
      console.error(`❌ Intervention failed for ${memory.temporal_id}:`, error);
      
      this.emit('intervention_failed', {
        memory_id: memory.temporal_id,
        strategy,
        error: error.message
      });
    }
  }

  /**
   * Mild contextual cues intervention (4-hour window, 70% effectiveness target)
   */
  private async executeMildContextualIntervention(memory: TemporalMemoryItem): Promise<number> {
    // Use gentle contextual reminders
    const relevantCues = memory.contextual_cues
      .filter(cue => cue.strength > 0.6)
      .slice(0, 2); // Top 2 cues
    
    if (relevantCues.length === 0) {
      return 0.4; // Minimal effectiveness without good cues
    }

    // Simulate contextual priming effectiveness
    const baseEffectiveness = 0.7;
    const cueQuality = relevantCues.reduce((sum, cue) => sum + cue.strength, 0) / relevantCues.length;
    
    return Math.min(0.95, baseEffectiveness * cueQuality);
  }

  /**
   * Fragment priming intervention (24-hour window, 59% effectiveness target)
   */
  private async executeFragmentPrimingIntervention(memory: TemporalMemoryItem): Promise<number> {
    // Use memory fragments to trigger recall
    const highRelevanceFragments = memory.fragments
      .filter(fragment => fragment.relevance_score > 0.7)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 3); // Top 3 fragments

    if (highRelevanceFragments.length === 0) {
      return 0.3; // Low effectiveness without fragments
    }

    // Simulate fragment priming effectiveness
    const baseEffectiveness = 0.59;
    const fragmentQuality = highRelevanceFragments.reduce((sum, frag) => sum + frag.relevance_score, 0) / highRelevanceFragments.length;
    
    return Math.min(0.85, baseEffectiveness * fragmentQuality * 1.2);
  }

  /**
   * Enhanced reinstatement intervention (3-day window)
   */
  private async executeEnhancedReinstatementIntervention(memory: TemporalMemoryItem): Promise<number> {
    // Combine contextual cues with fragments and emotional markers
    const combinedApproach = [
      ...memory.contextual_cues.slice(0, 2),
      ...memory.fragments.slice(0, 2)
    ];

    const baseEffectiveness = 0.45; // Diminishing returns at 3 days
    const multiModalBonus = combinedApproach.length > 3 ? 1.3 : 1.1;
    
    return Math.min(0.75, baseEffectiveness * multiModalBonus);
  }

  /**
   * Deep reconstruction intervention (7-day window, limited effectiveness)
   */
  private async executeDeepReconstructionIntervention(memory: TemporalMemoryItem): Promise<number> {
    // Last resort - comprehensive memory reconstruction
    const allAvailableCues = [
      ...memory.contextual_cues,
      ...memory.fragments,
      ...(memory.relatedMemories || [])
    ];

    const baseEffectiveness = 0.25; // Limited effectiveness after 7 days
    const comprehensiveBonus = allAvailableCues.length > 5 ? 1.4 : 1.0;
    
    return Math.min(0.6, baseEffectiveness * comprehensiveBonus);
  }

  /**
   * Start continuous memory monitoring
   */
  private startMonitoring(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
    }

    this.monitoringTimer = setInterval(async () => {
      try {
        const stats = await this.performDecayAssessment();
        
        this.emit('monitoring_cycle_completed', stats);
        
        // Check for batch rescue needs
        const criticalMemories = Array.from(this.monitoredMemories.values())
          .filter(memory => memory.decay_metrics.current_strength < this.config.intervention_thresholds.critical);
        
        if (criticalMemories.length >= this.config.batch_size_limits.emergency) {
          this.emit('batch_rescue_needed', criticalMemories);
        }
        
      } catch (error) {
        console.error('Monitoring cycle failed:', error);
        this.emit('monitoring_error', error);
      }
    }, this.config.monitoring_interval);

    console.log(`🔄 DecayWatchdog monitoring started: ${this.config.monitoring_interval}ms intervals`);
  }

  /**
   * Stop monitoring (cleanup)
   */
  public stopMonitoring(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
      console.log('🛑 DecayWatchdog monitoring stopped');
    }
  }

  /**
   * Get current watchdog statistics
   */
  public async getWatchdogStats(): Promise<WatchdogStats> {
    return await this.performDecayAssessment();
  }

  // Private helper methods
  private getDefaultConfig(): WatchdogConfig {
    return {
      monitoring_interval: 15 * 60 * 1000, // 15 minutes
      intervention_thresholds: {
        critical: 0.3,
        high: 0.5,
        medium: 0.7,
        low: 0.9
      },
      batch_size_limits: {
        emergency: 20,
        maintenance: 50
      },
      decay_model_params: {
        forgetting_curve: {
          initial_retention: 1.0,
          decay_constant: 0.693, // ln(2) for half-life calculation
          asymptotic_retention: 0.2
        },
        spacing_intervals: {
          first_review: 4 * 60 * 60 * 1000,    // 4 hours
          second_review: 24 * 60 * 60 * 1000,  // 24 hours
          third_review: 3 * 24 * 60 * 60 * 1000, // 3 days
          fourth_review: 7 * 24 * 60 * 60 * 1000  // 7 days
        },
        intervention_effectiveness: {
          at_4h: 0.70,
          at_24h: 0.59,
          at_3d: 0.45,
          at_7d: 0.25
        }
      }
    };
  }

  private initializeDecayMetrics(): DecayMetrics {
    return {
      initial_strength: 1.0,
      current_strength: 1.0,
      time_since_access: 0,
      retrieval_count: 0,
      failed_retrievals: 0,
      decay_rate: 0.693, // ln(2) for exponential decay
      intervention_history: []
    };
  }

  private extractMemoryFragments(memoryData: any): any[] {
    // Implementation would extract key fragments from memory content
    // For now, return basic structure
    return [
      {
        id: `frag-${Date.now()}-1`,
        content: memoryData.context?.substring(0, 50) || '',
        type: 'keywords',
        relevance_score: 0.8,
        activation_threshold: 0.6
      }
    ];
  }

  private generateContextualCues(memoryData: any): any[] {
    return [
      {
        type: 'temporal',
        strength: 0.7,
        content: memoryData.timestamp || new Date().toISOString(),
        associations: [memoryData.topic || 'general']
      }
    ];
  }

  private calculateDecayPrediction(): any {
    const now = Date.now();
    return {
      predicted_4h_strength: 0.85,
      predicted_24h_strength: 0.65,
      predicted_3d_strength: 0.45,
      predicted_7d_strength: 0.25,
      critical_intervention_time: new Date(now + (4 * 60 * 60 * 1000)).toISOString()
    };
  }

  private calculateNextInterventionTime(hoursFromNow: number = 4): string {
    return new Date(Date.now() + (hoursFromNow * 60 * 60 * 1000)).toISOString();
  }

  private updateDecayMetrics(memory: TemporalMemoryItem, currentTime: number): TemporalMemoryItem {
    const timeSinceAccess = currentTime - new Date(memory.timestamp).getTime();
    const decayFactor = Math.exp(-memory.decay_metrics.decay_rate * (timeSinceAccess / (24 * 60 * 60 * 1000))); // daily decay
    
    memory.decay_metrics.time_since_access = timeSinceAccess;
    memory.decay_metrics.current_strength = Math.max(0.1, memory.decay_metrics.initial_strength * decayFactor);
    
    return memory;
  }

  private async handleCriticalDecay(memory: TemporalMemoryItem): void {
    console.log(`🚨 Critical decay detected for memory: ${memory.temporal_id}`);
    await this.scheduleIntervention(memory, 'critical');
  }

  private async handleInterventionCompleted(event: any): void {
    console.log(`✅ Intervention completed for ${event.memory_id}: ${event.effectiveness.toFixed(2)} effectiveness`);
  }

  private async handleBatchRescue(criticalMemories: TemporalMemoryItem[]): void {
    console.log(`🚨 Batch rescue needed for ${criticalMemories.length} critical memories`);
    // Would trigger MemoryRescueScheduler
  }

  private async loadMonitoredMemories(): Promise<void> {
    try {
      const memoriesFile = join(this.watchdogPath, 'monitored-memories.json');
      const data = await fs.readFile(memoriesFile, 'utf8');
      const memoriesArray = JSON.parse(data);
      
      memoriesArray.forEach((memory: TemporalMemoryItem) => {
        this.monitoredMemories.set(memory.temporal_id, memory);
      });
      
    } catch (error) {
      // File doesn't exist or other error - start with empty monitoring
      console.log('Starting with empty memory monitoring');
    }
  }

  private async saveMonitoredMemories(): Promise<void> {
    try {
      const memoriesFile = join(this.watchdogPath, 'monitored-memories.json');
      const memoriesArray = Array.from(this.monitoredMemories.values());
      await fs.writeFile(memoriesFile, JSON.stringify(memoriesArray, null, 2));
    } catch (error) {
      console.error('Failed to save monitored memories:', error);
    }
  }

  private async syncWithMemorySystems(): Promise<void> {
    // Sync with MemoryEngine v2
    // This would integrate with existing memories
    console.log('🔄 Syncing with existing memory systems...');
  }
}

export default DecayWatchdog;