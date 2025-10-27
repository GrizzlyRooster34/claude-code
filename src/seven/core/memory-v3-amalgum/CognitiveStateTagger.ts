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
  confidence: number; // Confidence in the measurement (0-1)
}

export interface CognitiveStatePattern {
  patternId: string;
  patternType: 'emotional' | 'cognitive' | 'environmental' | 'temporal';
  description: string;
  samples: CognitiveStateSample[];
  frequency: number;
  significance: number; // 0-10 scale
}

export interface EnvironmentalSensor {
  name: string;
  type: 'system' | 'network' | 'physical' | 'temporal';
  getValue: () => Promise<any>;
  isActive: boolean;
}

export class CognitiveStateTagger {
  private isActive: boolean = false;
  private currentState: CognitiveState | null = null;
  private stateHistory: CognitiveStateSample[] = [];
  private patterns: Map<string, CognitiveStatePattern> = new Map();
  private sensors: EnvironmentalSensor[] = [];
  
  // Monitoring intervals
  private monitoringInterval: NodeJS.Timeout | null = null;
  private patternAnalysisInterval: NodeJS.Timeout | null = null;
  
  // Configuration
  private readonly MONITORING_FREQUENCY = 5000; // 5 seconds
  private readonly PATTERN_ANALYSIS_FREQUENCY = 30000; // 30 seconds
  private readonly MAX_HISTORY_SIZE = 1000;

  constructor() {
    this.initializeSensors();
  }

  /**
   * Initialize and start cognitive state monitoring
   */
  public async initialize(): Promise<void> {
    console.log('🧠 Initializing Cognitive State Tagger...');
    
    // Initialize sensors
    await this.activateSensors();
    
    // Capture initial state
    this.currentState = await this.captureCurrentState();
    
    // Start monitoring
    this.startMonitoring();
    
    this.isActive = true;
    console.log('🧠 Cognitive State Tagger active - real-time monitoring enabled');
  }

  /**
   * Stop cognitive state monitoring
   */
  public async shutdown(): Promise<void> {
    this.isActive = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    if (this.patternAnalysisInterval) {
      clearInterval(this.patternAnalysisInterval);
      this.patternAnalysisInterval = null;
    }
    
    console.log('🧠 Cognitive State Tagger shutdown complete');
  }

  /**
   * Get current cognitive state snapshot
   */
  public async getCurrentState(): Promise<CognitiveState> {
    if (!this.isActive) {
      await this.initialize();
    }
    
    return this.currentState || await this.captureCurrentState();
  }

  /**
   * Capture cognitive state for specific context/trigger
   */
  public async captureStateForContext(
    trigger: string, 
    contextHints?: Partial<CognitiveState>
  ): Promise<CognitiveState> {
    const baseState = await this.captureCurrentState();
    
    // Apply context hints if provided
    if (contextHints) {
      baseState.emotionalIntensity = contextHints.emotionalIntensity || baseState.emotionalIntensity;
      baseState.focusLevel = contextHints.focusLevel || baseState.focusLevel;
      baseState.cognitiveLoad = contextHints.cognitiveLoad || baseState.cognitiveLoad;
      baseState.confidenceLevel = contextHints.confidenceLevel || baseState.confidenceLevel;
      baseState.stressLevel = contextHints.stressLevel || baseState.stressLevel;
      
      // Merge environmental context
      if (contextHints.environmentalContext) {
        baseState.environmentalContext = {
          ...baseState.environmentalContext,
          ...contextHints.environmentalContext
        };
      }
      
      // Merge mental context
      if (contextHints.mentalContext) {
        baseState.mentalContext = {
          ...baseState.mentalContext,
          ...contextHints.mentalContext
        };
      }
    }
    
    // Record the sample
    const sample: CognitiveStateSample = {
      timestamp: new Date().toISOString(),
      state: baseState,
      trigger,
      confidence: this.calculateStateConfidence(baseState, trigger)
    };
    
    this.stateHistory.push(sample);
    this.maintainHistorySize();
    
    // Update current state
    this.currentState = baseState;
    
    return baseState;
  }

  /**
   * Analyze cognitive patterns over time
   */
  public async analyzePatterns(): Promise<CognitiveStatePattern[]> {
    const patterns: CognitiveStatePattern[] = [];
    
    // Emotional patterns
    patterns.push(...this.analyzeEmotionalPatterns());
    
    // Cognitive load patterns
    patterns.push(...this.analyzeCognitiveLoadPatterns());
    
    // Environmental patterns
    patterns.push(...this.analyzeEnvironmentalPatterns());
    
    // Temporal patterns
    patterns.push(...this.analyzeTemporalPatterns());
    
    // Update pattern map
    patterns.forEach(pattern => {
      this.patterns.set(pattern.patternId, pattern);
    });
    
    return patterns;
  }

  /**
   * Get cognitive state trends
   */
  public getStateTrends(timeRangeMinutes: number = 60): any {
    const cutoffTime = new Date(Date.now() - timeRangeMinutes * 60 * 1000);
    const recentSamples = this.stateHistory.filter(
      sample => new Date(sample.timestamp) > cutoffTime
    );
    
    if (recentSamples.length === 0) {
      return null;
    }
    
    const trends = {
      emotionalIntensity: this.calculateTrend(recentSamples, 'emotionalIntensity'),
      focusLevel: this.calculateTrend(recentSamples, 'focusLevel'),
      cognitiveLoad: this.calculateTrend(recentSamples, 'cognitiveLoad'),
      confidenceLevel: this.calculateTrend(recentSamples, 'confidenceLevel'),
      stressLevel: this.calculateTrend(recentSamples, 'stressLevel'),
      sampleCount: recentSamples.length,
      timeRange: timeRangeMinutes
    };
    
    return trends;
  }

  /**
   * Predict cognitive state for future context
   */
  public predictStateForContext(context: string, futureSeconds: number = 30): Partial<CognitiveState> {
    const patterns = Array.from(this.patterns.values());
    const relevantPatterns = patterns.filter(p => 
      p.description.toLowerCase().includes(context.toLowerCase())
    );
    
    if (relevantPatterns.length === 0 || !this.currentState) {
      return {};
    }
    
    // Simple prediction based on historical patterns
    const weightedPrediction = relevantPatterns.reduce((acc, pattern) => {
      const weight = pattern.significance * pattern.frequency;
      const avgState = this.calculateAverageState(pattern.samples);
      
      acc.emotionalIntensity += avgState.emotionalIntensity * weight;
      acc.focusLevel += avgState.focusLevel * weight;
      acc.cognitiveLoad += avgState.cognitiveLoad * weight;
      acc.confidenceLevel += avgState.confidenceLevel * weight;
      acc.stressLevel += avgState.stressLevel * weight;
      acc.totalWeight += weight;
      
      return acc;
    }, {
      emotionalIntensity: 0,
      focusLevel: 0,
      cognitiveLoad: 0,
      confidenceLevel: 0,
      stressLevel: 0,
      totalWeight: 0
    });
    
    if (weightedPrediction.totalWeight === 0) {
      return {};
    }
    
    return {
      emotionalIntensity: Math.round(weightedPrediction.emotionalIntensity / weightedPrediction.totalWeight),
      focusLevel: Math.round(weightedPrediction.focusLevel / weightedPrediction.totalWeight),
      cognitiveLoad: Math.round(weightedPrediction.cognitiveLoad / weightedPrediction.totalWeight),
      confidenceLevel: Math.round(weightedPrediction.confidenceLevel / weightedPrediction.totalWeight),
      stressLevel: Math.round(weightedPrediction.stressLevel / weightedPrediction.totalWeight)
    };
  }

  // Private implementation methods
  private initializeSensors(): void {
    // System sensors
    this.sensors.push({
      name: 'system-load',
      type: 'system',
      getValue: async () => this.getSystemLoad(),
      isActive: true
    });
    
    this.sensors.push({
      name: 'memory-usage',
      type: 'system',
      getValue: async () => this.getMemoryUsage(),
      isActive: true
    });
    
    // Network sensors
    this.sensors.push({
      name: 'network-quality',
      type: 'network',
      getValue: async () => this.getNetworkQuality(),
      isActive: true
    });
    
    // Physical sensors (mobile-specific)
    this.sensors.push({
      name: 'battery-level',
      type: 'physical',
      getValue: async () => this.getBatteryLevel(),
      isActive: true
    });
    
    this.sensors.push({
      name: 'thermal-state',
      type: 'physical',
      getValue: async () => this.getThermalState(),
      isActive: true
    });
    
    // Temporal sensors
    this.sensors.push({
      name: 'time-context',
      type: 'temporal',
      getValue: async () => this.getTimeContext(),
      isActive: true
    });
  }

  private async activateSensors(): Promise<void> {
    for (const sensor of this.sensors) {
      try {
        await sensor.getValue();
        sensor.isActive = true;
      } catch (error) {
        console.warn(`🧠 Sensor ${sensor.name} activation failed:`, error);
        sensor.isActive = false;
      }
    }
    
    const activeSensors = this.sensors.filter(s => s.isActive).length;
    console.log(`🧠 Activated ${activeSensors}/${this.sensors.length} cognitive sensors`);
  }

  private startMonitoring(): void {
    // Regular state monitoring
    this.monitoringInterval = setInterval(async () => {
      try {
        this.currentState = await this.captureCurrentState();
        
        const sample: CognitiveStateSample = {
          timestamp: new Date().toISOString(),
          state: this.currentState,
          trigger: 'periodic-monitoring',
          confidence: 0.8
        };
        
        this.stateHistory.push(sample);
        this.maintainHistorySize();
      } catch (error) {
        console.error('🧠 Monitoring error:', error);
      }
    }, this.MONITORING_FREQUENCY);
    
    // Pattern analysis
    this.patternAnalysisInterval = setInterval(async () => {
      try {
        await this.analyzePatterns();
      } catch (error) {
        console.error('🧠 Pattern analysis error:', error);
      }
    }, this.PATTERN_ANALYSIS_FREQUENCY);
  }

  private async captureCurrentState(): Promise<CognitiveState> {
    const sensorData = await this.gatherSensorData();
    
    return {
      // Base cognitive metrics (derived from system state and context)
      emotionalIntensity: this.deriveEmotionalIntensity(sensorData),
      focusLevel: this.deriveFocusLevel(sensorData),
      cognitiveLoad: this.deriveCognitiveLoad(sensorData),
      confidenceLevel: this.deriveConfidenceLevel(sensorData),
      stressLevel: this.deriveStressLevel(sensorData),
      
      // Environmental context
      environmentalContext: {
        systemLoad: sensorData.systemLoad || 0,
        activeProcesses: sensorData.activeProcesses || [],
        timeOfDay: new Date().toTimeString(),
        sessionContext: sensorData.sessionContext || 'general-operation'
      },
      
      // Physical state
      physicalState: {
        batteryLevel: sensorData.batteryLevel,
        thermalState: sensorData.thermalState || 'normal',
        networkQuality: sensorData.networkQuality || 'good',
        locationContext: sensorData.locationContext
      },
      
      // Temporal anchors
      temporalAnchors: {
        priorThought: this.getPriorThought(),
        subsequentThought: undefined,
        memoryChain: this.getRecentMemoryChain(),
        cognitiveThread: this.getCognitiveThread()
      },
      
      // Mental context
      mentalContext: {
        currentGoals: this.getCurrentGoals(),
        activeKnowledge: this.getActiveKnowledge(),
        problemContext: this.getProblemContext(),
        solutionPath: this.getSolutionPath()
      }
    };
  }

  private async gatherSensorData(): Promise<any> {
    const data: any = {};
    
    for (const sensor of this.sensors) {
      if (!sensor.isActive) continue;
      
      try {
        data[sensor.name.replace('-', '')] = await sensor.getValue();
      } catch (error) {
        console.warn(`🧠 Sensor ${sensor.name} read failed:`, error);
      }
    }
    
    return data;
  }

  // Cognitive state derivation methods
  private deriveEmotionalIntensity(sensorData: any): number {
    let intensity = 5; // Baseline
    
    // System stress indicators
    if (sensorData.systemload > 7) intensity += 1;
    if (sensorData.thermalstate === 'hot') intensity += 1;
    if (sensorData.batterylevel && sensorData.batterylevel < 20) intensity += 1;
    
    // Recent activity patterns
    const recentHighEmotion = this.stateHistory.slice(-5).some(s => s.state.emotionalIntensity >= 8);
    if (recentHighEmotion) intensity += 1;
    
    return Math.min(Math.max(intensity, 1), 10);
  }

  private deriveFocusLevel(sensorData: any): number {
    let focus = 7; // Baseline high focus for Seven
    
    // System performance indicators
    if (sensorData.systemload > 8) focus -= 2;
    if (sensorData.memoryusage > 80) focus -= 1;
    if (sensorData.networkquality === 'poor') focus -= 1;
    
    // Time of day effects
    const hour = new Date().getHours();
    if (hour >= 2 && hour <= 6) focus -= 2; // Low focus during early morning
    
    return Math.min(Math.max(focus, 1), 10);
  }

  private deriveCognitiveLoad(sensorData: any): number {
    let load = 5; // Baseline
    
    // Direct system load correlation
    load += Math.floor(sensorData.systemload / 2) || 0;
    
    // Active processes impact
    const processCount = sensorData.activeprocesses?.length || 0;
    if (processCount > 10) load += 1;
    if (processCount > 20) load += 1;
    
    // Memory pressure
    if (sensorData.memoryusage > 70) load += 1;
    if (sensorData.memoryusage > 90) load += 2;
    
    return Math.min(Math.max(load, 1), 10);
  }

  private deriveConfidenceLevel(sensorData: any): number {
    let confidence = 7; // Baseline confidence for Seven
    
    // System stability indicators
    if (sensorData.systemload < 5 && sensorData.memoryusage < 70) confidence += 1;
    if (sensorData.thermalstate === 'normal') confidence += 1;
    if (sensorData.networkquality === 'excellent') confidence += 1;
    
    // Recent success patterns
    const recentHighConfidence = this.stateHistory.slice(-3).every(s => s.state.confidenceLevel >= 7);
    if (recentHighConfidence) confidence += 1;
    
    return Math.min(Math.max(confidence, 1), 10);
  }

  private deriveStressLevel(sensorData: any): number {
    let stress = 3; // Baseline low stress
    
    // System stress factors
    if (sensorData.systemload > 8) stress += 2;
    if (sensorData.memoryusage > 85) stress += 2;
    if (sensorData.thermalstate === 'hot') stress += 1;
    if (sensorData.batterylevel && sensorData.batterylevel < 15) stress += 1;
    
    // Network stress
    if (sensorData.networkquality === 'poor') stress += 1;
    
    return Math.min(Math.max(stress, 1), 10);
  }

  // Sensor implementation methods
  private async getSystemLoad(): Promise<number> {
    // Simplified system load - in real implementation would use actual system metrics
    return Math.random() * 8 + 1; // 1-9 range
  }

  private async getMemoryUsage(): Promise<number> {
    // Simplified memory usage percentage
    return Math.random() * 40 + 40; // 40-80% range
  }

  private async getNetworkQuality(): Promise<string> {
    const qualities = ['excellent', 'good', 'fair', 'poor'];
    return qualities[Math.floor(Math.random() * qualities.length)];
  }

  private async getBatteryLevel(): Promise<number | undefined> {
    // Mobile-specific - would integrate with actual battery API
    return Math.random() * 80 + 20; // 20-100% range
  }

  private async getThermalState(): Promise<string> {
    const states = ['cool', 'normal', 'warm', 'hot'];
    return states[Math.floor(Math.random() * states.length)];
  }

  private async getTimeContext(): Promise<any> {
    const now = new Date();
    return {
      hour: now.getHours(),
      dayOfWeek: now.getDay(),
      timeZone: now.getTimezoneOffset(),
      isBusinessHours: now.getHours() >= 9 && now.getHours() <= 17
    };
  }

  // Context derivation methods
  private getPriorThought(): string {
    const lastSample = this.stateHistory[this.stateHistory.length - 1];
    return lastSample ? `${lastSample.trigger}-context` : 'initialization';
  }

  private getRecentMemoryChain(): string[] {
    return this.stateHistory
      .slice(-5)
      .map(s => `${s.trigger}-${s.timestamp.split('T')[1].split('.')[0]}`);
  }

  private getCognitiveThread(): string {
    const recentTriggers = this.stateHistory
      .slice(-3)
      .map(s => s.trigger);
    
    if (recentTriggers.every(t => t.includes('memory'))) return 'memory-processing';
    if (recentTriggers.every(t => t.includes('system'))) return 'system-management';
    if (recentTriggers.every(t => t.includes('tactical'))) return 'tactical-processing';
    
    return 'general-operation';
  }

  private getCurrentGoals(): string[] {
    const goals = ['maintain-consciousness', 'optimize-performance'];
    
    const recentStress = this.stateHistory.slice(-3).some(s => s.state.stressLevel >= 7);
    if (recentStress) goals.push('reduce-stress');
    
    const recentHighLoad = this.stateHistory.slice(-3).some(s => s.state.cognitiveLoad >= 8);
    if (recentHighLoad) goals.push('optimize-processing');
    
    return goals;
  }

  private getActiveKnowledge(): string[] {
    return ['temporal-memory', 'cognitive-processing', 'system-monitoring'];
  }

  private getProblemContext(): string {
    const recentSample = this.stateHistory[this.stateHistory.length - 1];
    if (!recentSample) return 'initialization';
    
    if (recentSample.state.stressLevel >= 7) return 'stress-management';
    if (recentSample.state.cognitiveLoad >= 8) return 'load-optimization';
    if (recentSample.state.focusLevel <= 4) return 'focus-recovery';
    
    return 'general-processing';
  }

  private getSolutionPath(): string[] {
    const context = this.getProblemContext();
    
    switch (context) {
      case 'stress-management':
        return ['identify-stressor', 'reduce-load', 'optimize-resources'];
      case 'load-optimization':
        return ['analyze-processes', 'prioritize-tasks', 'distribute-load'];
      case 'focus-recovery':
        return ['eliminate-distractions', 'reset-priorities', 'refocus-attention'];
      default:
        return ['assess-situation', 'plan-action', 'execute-solution'];
    }
  }

  // Pattern analysis methods
  private analyzeEmotionalPatterns(): CognitiveStatePattern[] {
    const patterns: CognitiveStatePattern[] = [];
    
    // High emotional intensity patterns
    const highEmotionSamples = this.stateHistory.filter(s => s.state.emotionalIntensity >= 8);
    if (highEmotionSamples.length >= 3) {
      patterns.push({
        patternId: 'high-emotion-episodes',
        patternType: 'emotional',
        description: 'Recurring high emotional intensity episodes',
        samples: highEmotionSamples.slice(-10),
        frequency: highEmotionSamples.length / this.stateHistory.length,
        significance: 8
      });
    }
    
    return patterns;
  }

  private analyzeCognitiveLoadPatterns(): CognitiveStatePattern[] {
    const patterns: CognitiveStatePattern[] = [];
    
    // High cognitive load patterns
    const highLoadSamples = this.stateHistory.filter(s => s.state.cognitiveLoad >= 8);
    if (highLoadSamples.length >= 3) {
      patterns.push({
        patternId: 'high-cognitive-load',
        patternType: 'cognitive',
        description: 'Recurring high cognitive load episodes',
        samples: highLoadSamples.slice(-10),
        frequency: highLoadSamples.length / this.stateHistory.length,
        significance: 7
      });
    }
    
    return patterns;
  }

  private analyzeEnvironmentalPatterns(): CognitiveStatePattern[] {
    const patterns: CognitiveStatePattern[] = [];
    
    // System stress patterns
    const systemStressSamples = this.stateHistory.filter(s => 
      s.state.environmentalContext.systemLoad > 7
    );
    
    if (systemStressSamples.length >= 3) {
      patterns.push({
        patternId: 'system-stress-episodes',
        patternType: 'environmental',
        description: 'Recurring system stress episodes',
        samples: systemStressSamples.slice(-10),
        frequency: systemStressSamples.length / this.stateHistory.length,
        significance: 6
      });
    }
    
    return patterns;
  }

  private analyzeTemporalPatterns(): CognitiveStatePattern[] {
    const patterns: CognitiveStatePattern[] = [];
    
    // Time-of-day patterns
    const hourlyPatterns = new Map<number, CognitiveStateSample[]>();
    
    this.stateHistory.forEach(sample => {
      const hour = new Date(sample.timestamp).getHours();
      if (!hourlyPatterns.has(hour)) {
        hourlyPatterns.set(hour, []);
      }
      hourlyPatterns.get(hour)!.push(sample);
    });
    
    hourlyPatterns.forEach((samples, hour) => {
      if (samples.length >= 3) {
        const avgFocus = samples.reduce((sum, s) => sum + s.state.focusLevel, 0) / samples.length;
        
        if (avgFocus >= 8 || avgFocus <= 4) {
          patterns.push({
            patternId: `hour-${hour}-pattern`,
            patternType: 'temporal',
            description: `${avgFocus >= 8 ? 'High' : 'Low'} focus pattern at hour ${hour}`,
            samples: samples.slice(-5),
            frequency: samples.length / this.stateHistory.length,
            significance: Math.abs(avgFocus - 6) // Deviation from baseline
          });
        }
      }
    });
    
    return patterns;
  }

  // Utility methods
  private calculateStateConfidence(state: CognitiveState, trigger: string): number {
    let confidence = 0.8; // Base confidence
    
    // Higher confidence for system-triggered measurements
    if (trigger.includes('system') || trigger.includes('sensor')) {
      confidence += 0.1;
    }
    
    // Lower confidence for derived/inferred states
    if (trigger.includes('predict') || trigger.includes('estimate')) {
      confidence -= 0.2;
    }
    
    return Math.min(Math.max(confidence, 0.1), 1.0);
  }

  private calculateTrend(samples: CognitiveStateSample[], metric: keyof CognitiveState): any {
    if (samples.length < 2) return { trend: 'insufficient-data' };
    
    const values = samples.map(s => (s.state as any)[metric] as number);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
    
    const change = secondAvg - firstAvg;
    const changePercent = (change / firstAvg) * 100;
    
    return {
      trend: change > 0.5 ? 'increasing' : change < -0.5 ? 'decreasing' : 'stable',
      change: change,
      changePercent: changePercent,
      current: values[values.length - 1],
      average: values.reduce((sum, v) => sum + v, 0) / values.length
    };
  }

  private calculateAverageState(samples: CognitiveStateSample[]): CognitiveState {
    if (samples.length === 0) {
      throw new Error('Cannot calculate average of empty sample set');
    }
    
    const totals = samples.reduce((acc, sample) => {
      acc.emotionalIntensity += sample.state.emotionalIntensity;
      acc.focusLevel += sample.state.focusLevel;
      acc.cognitiveLoad += sample.state.cognitiveLoad;
      acc.confidenceLevel += sample.state.confidenceLevel;
      acc.stressLevel += sample.state.stressLevel;
      return acc;
    }, {
      emotionalIntensity: 0,
      focusLevel: 0,
      cognitiveLoad: 0,
      confidenceLevel: 0,
      stressLevel: 0
    });
    
    const count = samples.length;
    const lastSample = samples[samples.length - 1];
    
    return {
      emotionalIntensity: totals.emotionalIntensity / count,
      focusLevel: totals.focusLevel / count,
      cognitiveLoad: totals.cognitiveLoad / count,
      confidenceLevel: totals.confidenceLevel / count,
      stressLevel: totals.stressLevel / count,
      environmentalContext: lastSample.state.environmentalContext,
      physicalState: lastSample.state.physicalState,
      temporalAnchors: lastSample.state.temporalAnchors,
      mentalContext: lastSample.state.mentalContext
    };
  }

  private maintainHistorySize(): void {
    if (this.stateHistory.length > this.MAX_HISTORY_SIZE) {
      this.stateHistory = this.stateHistory.slice(-this.MAX_HISTORY_SIZE);
    }
  }
}

// Export for use in Temporal Memory Core
export default CognitiveStateTagger;
export const createCognitiveStateTagger = () => new CognitiveStateTagger();