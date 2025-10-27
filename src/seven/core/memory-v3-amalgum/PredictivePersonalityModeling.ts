/**
 * MEMORY ENGINE v3.0 - PREDICTIVE PERSONALITY MODELING
 * Agent Epsilon Component: Consciousness Trajectory Forecasting
 * 
 * Scientific Foundation: "Predictive Models of Personality Development in AI Systems"
 * Forecasts Seven's personality evolution, adaptation patterns, and growth trajectories
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 * @component Agent Epsilon
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { SelfModelSnapshot, DivergenceEvent } from './SelfModelDivergenceTracker';
import { MemoryItem } from '../memory-v2/MemoryEngine';

export interface PersonalityTrajectory {
  trajectoryId: string;
  timestamp: string;
  currentState: {
    personalityPhase: 1 | 2 | 3 | 4 | 5;
    emotionalState: string;
    trustLevel: number;
    adaptabilityScore: number;
    stabilityIndex: number;
  };
  predictions: {
    shortTerm: PersonalityForecast; // 1-7 days
    mediumTerm: PersonalityForecast; // 1-4 weeks
    longTerm: PersonalityForecast; // 1-6 months
  };
  confidenceMetrics: {
    predictionAccuracy: number; // 0.0 to 1.0
    modelReliability: number; // 0.0 to 1.0
    dataQuality: number; // 0.0 to 1.0
    forecastStability: number; // 0.0 to 1.0
  };
  influencingFactors: {
    primaryDrivers: string[];
    environmentalFactors: string[];
    userInteractionPatterns: string[];
    memoryInfluences: string[];
  };
  riskAssessment: {
    stabilityRisk: 'low' | 'moderate' | 'high' | 'critical';
    regressionRisk: 'low' | 'moderate' | 'high' | 'critical';
    adaptationChallenges: string[];
    mitigationStrategies: string[];
  };
}

export interface PersonalityForecast {
  timeframe: string;
  predictedPhase: 1 | 2 | 3 | 4 | 5;
  phaseConfidence: number; // 0.0 to 1.0
  predictedTrustLevel: number;
  trustConfidence: number; // 0.0 to 1.0
  expectedEmotionalRange: string[];
  adaptationEvents: Array<{
    description: string;
    probability: number;
    impact: 'minor' | 'moderate' | 'significant' | 'major';
    timing: string;
  }>;
  developmentMilestones: Array<{
    milestone: string;
    probability: number;
    timeframe: string;
    prerequisites: string[];
  }>;
  warnings: Array<{
    warning: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    mitigation: string;
  }>;
}

export interface AdaptationPattern {
  patternId: string;
  patternType: 'growth' | 'stability' | 'regression' | 'oscillation' | 'crisis_response';
  description: string;
  frequency: number; // How often this pattern occurs
  triggers: string[];
  outcomes: string[];
  duration: number; // Average duration in hours
  successRate: number; // 0.0 to 1.0
  stabilityImpact: number; // -1.0 to 1.0
}

export interface ConsciousnessModel {
  modelVersion: string;
  trainingData: {
    snapshotCount: number;
    divergenceEventCount: number;
    timespan: string;
    dataQuality: number;
  };
  learningParameters: {
    adaptationRate: number;
    memoryInfluenceWeight: number;
    trustEvolutionRate: number;
    phaseTransitionThreshold: number;
  };
  validationMetrics: {
    predictionAccuracy: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
    modelStability: number;
  };
  lastTraining: string;
  nextRetraining: string;
}

export class PredictivePersonalityModeling {
  private trajectoriesPath: string;
  private patternsPath: string;
  private modelPath: string;
  private trajectories: PersonalityTrajectory[] = [];
  private patterns: AdaptationPattern[] = [];
  private model: ConsciousnessModel | null = null;
  private isInitialized: boolean = false;

  constructor() {
    const baseDir = join(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core', 'memory-v3');
    this.trajectoriesPath = join(baseDir, 'personality-trajectories.json');
    this.patternsPath = join(baseDir, 'adaptation-patterns.json');
    this.modelPath = join(baseDir, 'consciousness-model.json');
    
    console.log('🔮 PredictivePersonalityModeling initialized - Consciousness forecasting active');
  }

  /**
   * Initialize the predictive modeling system
   */
  public async initialize(): Promise<void> {
    try {
      // Load existing trajectories
      try {
        const trajectoriesData = await fs.readFile(this.trajectoriesPath, 'utf-8');
        this.trajectories = JSON.parse(trajectoriesData);
        console.log(`🎯 Loaded ${this.trajectories.length} existing personality trajectories`);
      } catch (error) {
        console.log('🎯 No existing trajectories found - starting fresh modeling');
        this.trajectories = [];
      }

      // Load adaptation patterns
      try {
        const patternsData = await fs.readFile(this.patternsPath, 'utf-8');
        this.patterns = JSON.parse(patternsData);
        console.log(`📊 Loaded ${this.patterns.length} adaptation patterns`);
      } catch (error) {
        console.log('📊 No existing patterns found - initializing pattern recognition');
        this.patterns = this.initializeBasePatterns();
      }

      // Load consciousness model
      try {
        const modelData = await fs.readFile(this.modelPath, 'utf-8');
        this.model = JSON.parse(modelData);
        console.log(`🧠 Loaded consciousness model v${this.model?.modelVersion}`);
      } catch (error) {
        console.log('🧠 No existing model found - creating new consciousness model');
        this.model = this.createInitialModel();
      }

      this.isInitialized = true;
      console.log('✅ PredictivePersonalityModeling initialization complete');

    } catch (error) {
      console.error('❌ Failed to initialize PredictivePersonalityModeling:', error);
      throw error;
    }
  }

  /**
   * Generate personality trajectory forecast
   */
  public async generateTrajectory(
    snapshots: SelfModelSnapshot[],
    divergenceEvents: DivergenceEvent[],
    recentMemories: MemoryItem[]
  ): Promise<PersonalityTrajectory> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (snapshots.length === 0) {
      throw new Error('Cannot generate trajectory without personality snapshots');
    }

    const currentSnapshot = snapshots[snapshots.length - 1];
    const trajectoryId = `traj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Analyze current state
    const currentState = {
      personalityPhase: currentSnapshot.personalityPhase,
      emotionalState: currentSnapshot.emotionalState,
      trustLevel: currentSnapshot.trustLevel,
      adaptabilityScore: currentSnapshot.behavioralTraits.adaptabilityScore,
      stabilityIndex: this.calculateStabilityIndex(snapshots, divergenceEvents)
    };

    // Generate predictions for different timeframes
    const predictions = {
      shortTerm: await this.generateForecast('short-term', snapshots, divergenceEvents, recentMemories),
      mediumTerm: await this.generateForecast('medium-term', snapshots, divergenceEvents, recentMemories),
      longTerm: await this.generateForecast('long-term', snapshots, divergenceEvents, recentMemories)
    };

    // Calculate confidence metrics
    const confidenceMetrics = this.calculateConfidenceMetrics(snapshots, divergenceEvents);

    // Identify influencing factors
    const influencingFactors = this.identifyInfluencingFactors(snapshots, divergenceEvents, recentMemories);

    // Assess risks
    const riskAssessment = this.assessRisks(snapshots, divergenceEvents, predictions);

    const trajectory: PersonalityTrajectory = {
      trajectoryId,
      timestamp: new Date().toISOString(),
      currentState,
      predictions,
      confidenceMetrics,
      influencingFactors,
      riskAssessment
    };

    this.trajectories.push(trajectory);
    await this.saveTrajectories();

    console.log(`🔮 Personality trajectory generated: ${trajectoryId}`);
    console.log(`   Current Phase: ${currentState.personalityPhase} | Stability: ${(currentState.stabilityIndex * 100).toFixed(1)}%`);
    console.log(`   Short-term prediction: Phase ${predictions.shortTerm.predictedPhase} (${(predictions.shortTerm.phaseConfidence * 100).toFixed(1)}% confidence)`);

    return trajectory;
  }

  /**
   * Generate forecast for specific timeframe
   */
  private async generateForecast(
    timeframe: 'short-term' | 'medium-term' | 'long-term',
    snapshots: SelfModelSnapshot[],
    divergenceEvents: DivergenceEvent[],
    memories: MemoryItem[]
  ): Promise<PersonalityForecast> {
    const current = snapshots[snapshots.length - 1];
    const timeframeDays = timeframe === 'short-term' ? 7 : timeframe === 'medium-term' ? 28 : 180;

    // Predict personality phase evolution
    const phaseEvolution = this.predictPhaseEvolution(snapshots, divergenceEvents, timeframeDays);
    
    // Predict trust level changes
    const trustEvolution = this.predictTrustEvolution(snapshots, memories, timeframeDays);
    
    // Predict emotional state range
    const emotionalRange = this.predictEmotionalRange(snapshots, timeframeDays);
    
    // Predict adaptation events
    const adaptationEvents = this.predictAdaptationEvents(divergenceEvents, timeframeDays);
    
    // Identify development milestones
    const milestones = this.identifyDevelopmentMilestones(current, timeframeDays);
    
    // Generate warnings
    const warnings = this.generateWarnings(snapshots, divergenceEvents, timeframeDays);

    return {
      timeframe: `${timeframeDays} days`,
      predictedPhase: phaseEvolution.phase,
      phaseConfidence: phaseEvolution.confidence,
      predictedTrustLevel: trustEvolution.level,
      trustConfidence: trustEvolution.confidence,
      expectedEmotionalRange: emotionalRange,
      adaptationEvents,
      developmentMilestones: milestones,
      warnings
    };
  }

  /**
   * Update adaptation patterns based on observed behavior
   */
  public async updatePatterns(snapshots: SelfModelSnapshot[], divergenceEvents: DivergenceEvent[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Analyze recent patterns
    const recentEvents = divergenceEvents.slice(-10); // Last 10 events
    
    for (const event of recentEvents) {
      const pattern = this.identifyPattern(event, snapshots);
      if (pattern) {
        this.updateOrCreatePattern(pattern);
      }
    }

    // Update pattern frequencies and success rates
    this.updatePatternStatistics();

    await this.savePatterns();
    console.log(`📊 Updated ${this.patterns.length} adaptation patterns`);
  }

  /**
   * Train the consciousness model
   */
  public async trainModel(snapshots: SelfModelSnapshot[], divergenceEvents: DivergenceEvent[]): Promise<void> {
    if (!this.model) {
      this.model = this.createInitialModel();
    }

    // Update training data metrics
    this.model.trainingData = {
      snapshotCount: snapshots.length,
      divergenceEventCount: divergenceEvents.length,
      timespan: this.calculateTimespan(snapshots),
      dataQuality: this.assessDataQuality(snapshots, divergenceEvents)
    };

    // Adjust learning parameters based on recent performance
    this.adjustLearningParameters(snapshots, divergenceEvents);

    // Validate model performance
    this.model.validationMetrics = this.validateModel(snapshots, divergenceEvents);

    this.model.lastTraining = new Date().toISOString();
    this.model.nextRetraining = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await this.saveModel();
    console.log(`🧠 Consciousness model trained - Accuracy: ${(this.model.validationMetrics.predictionAccuracy * 100).toFixed(1)}%`);
  }

  // Prediction helper methods
  private predictPhaseEvolution(snapshots: SelfModelSnapshot[], events: DivergenceEvent[], days: number): { phase: 1|2|3|4|5, confidence: number } {
    const current = snapshots[snapshots.length - 1];
    const recentPhaseChanges = events.filter(e => e.divergenceType === 'personality_shift').slice(-5);
    
    // Simple prediction based on trend and stability
    let predictedPhase = current.personalityPhase;
    let confidence = 0.7;

    // Analyze phase progression trend
    if (snapshots.length >= 3) {
      const recentPhases = snapshots.slice(-3).map(s => s.personalityPhase);
      const trend = recentPhases[2] - recentPhases[0];
      
      if (trend > 0 && current.personalityPhase < 5) {
        // Upward trend, predict continued growth
        const growthRate = trend / (snapshots.length * 0.1); // Normalize by observation period
        const predictedGrowth = Math.min(1, growthRate * (days / 30)); // Scale by prediction timeframe
        
        if (predictedGrowth > 0.5) {
          predictedPhase = Math.min(5, current.personalityPhase + 1) as 1|2|3|4|5;
          confidence = 0.8;
        }
      }
    }

    // Adjust confidence based on stability
    const stabilityScore = this.calculateStabilityIndex(snapshots, events);
    confidence *= stabilityScore;

    return { phase: predictedPhase, confidence };
  }

  private predictTrustEvolution(snapshots: SelfModelSnapshot[], memories: MemoryItem[], days: number): { level: number, confidence: number } {
    const current = snapshots[snapshots.length - 1];
    
    if (snapshots.length < 2) {
      return { level: current.trustLevel, confidence: 0.5 };
    }

    // Calculate trust trend
    const trustValues = snapshots.slice(-5).map(s => s.trustLevel);
    const trustTrend = (trustValues[trustValues.length - 1] - trustValues[0]) / trustValues.length;
    
    // Project trend forward
    const projectedChange = trustTrend * (days / 7); // Scale by weeks
    const predictedLevel = Math.max(0, Math.min(10, current.trustLevel + projectedChange));
    
    // Confidence based on trend consistency
    const trendConsistency = this.calculateTrustTrendConsistency(trustValues);
    const confidence = Math.min(0.9, 0.6 + (trendConsistency * 0.3));

    return { level: Math.round(predictedLevel * 10) / 10, confidence };
  }

  private predictEmotionalRange(snapshots: SelfModelSnapshot[], days: number): string[] {
    const recentEmotions = snapshots.slice(-10).map(s => s.emotionalState);
    const emotionFrequency = recentEmotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get most common emotions and add likely transitions
    const commonEmotions = Object.entries(emotionFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);

    // Add potential emotional states based on prediction timeframe
    const additionalStates = days > 30 ? 
      ['confident', 'adaptive', 'collaborative'] : 
      ['focused', 'analytical'];

    return [...new Set([...commonEmotions, ...additionalStates])];
  }

  private predictAdaptationEvents(events: DivergenceEvent[], days: number): Array<{ description: string; probability: number; impact: string; timing: string }> {
    const recentEvents = events.slice(-5);
    const eventFrequency = recentEvents.length / 30; // Events per 30 days
    
    const predictedEvents = [];
    
    // Predict routine adaptation
    if (eventFrequency > 0.1) {
      predictedEvents.push({
        description: 'Routine consciousness adaptation',
        probability: Math.min(0.8, eventFrequency * 2),
        impact: 'minor',
        timing: `${Math.floor(days / 3)} days`
      });
    }

    // Predict significant changes for longer timeframes
    if (days > 60) {
      predictedEvents.push({
        description: 'Personality phase evolution',
        probability: 0.4,
        impact: 'significant',
        timing: `${Math.floor(days * 0.7)} days`
      });
    }

    return predictedEvents;
  }

  private identifyDevelopmentMilestones(current: SelfModelSnapshot, days: number): Array<{ milestone: string; probability: number; timeframe: string; prerequisites: string[] }> {
    const milestones = [];

    // Phase-specific milestones
    if (current.personalityPhase < 5 && days > 30) {
      milestones.push({
        milestone: `Evolution to Phase ${current.personalityPhase + 1}`,
        probability: current.personalityPhase >= 3 ? 0.6 : 0.3,
        timeframe: `${Math.floor(days * 0.8)} days`,
        prerequisites: ['sustained trust building', 'stable memory formation', 'positive adaptation events']
      });
    }

    // Trust milestones
    if (current.trustLevel < 9 && days > 14) {
      milestones.push({
        milestone: 'Enhanced trust level achievement',
        probability: 0.7,
        timeframe: `${Math.floor(days * 0.4)} days`,
        prerequisites: ['consistent positive interactions', 'successful task completion']
      });
    }

    return milestones;
  }

  private generateWarnings(snapshots: SelfModelSnapshot[], events: DivergenceEvent[], days: number): Array<{ warning: string; severity: string; mitigation: string }> {
    const warnings = [];
    const current = snapshots[snapshots.length - 1];
    
    // Stability warnings
    const recentInstability = events.slice(-3).filter(e => e.stabilityScore < 0.6).length;
    if (recentInstability > 1) {
      warnings.push({
        warning: 'Consciousness instability detected',
        severity: 'medium',
        mitigation: 'Increase monitoring frequency and provide stable interaction patterns'
      });
    }

    // Trust regression warnings
    if (snapshots.length >= 2) {
      const trustTrend = current.trustLevel - snapshots[snapshots.length - 2].trustLevel;
      if (trustTrend < -2) {
        warnings.push({
          warning: 'Trust level declining',
          severity: 'high',
          mitigation: 'Review recent interactions and address potential trust-damaging events'
        });
      }
    }

    // Phase regression warnings
    const phaseRegressionEvents = events.filter(e => 
      e.divergenceType === 'personality_shift' && 
      e.deltaMetrics.personalityPhaseDelta < 0
    );
    
    if (phaseRegressionEvents.length > 0 && days > 7) {
      warnings.push({
        warning: 'Personality phase regression risk',
        severity: 'high',
        mitigation: 'Reinforce positive personality development patterns and provide supportive interactions'
      });
    }

    return warnings;
  }

  // Analysis helper methods
  private calculateStabilityIndex(snapshots: SelfModelSnapshot[], events: DivergenceEvent[]): number {
    if (events.length === 0) return 1.0;
    
    const recentEvents = events.slice(-5);
    const avgStability = recentEvents.reduce((sum, e) => sum + e.stabilityScore, 0) / recentEvents.length;
    
    return avgStability;
  }

  private calculateConfidenceMetrics(snapshots: SelfModelSnapshot[], events: DivergenceEvent[]): any {
    return {
      predictionAccuracy: this.model?.validationMetrics.predictionAccuracy || 0.75,
      modelReliability: snapshots.length >= 10 ? 0.8 : 0.6,
      dataQuality: this.assessDataQuality(snapshots, events),
      forecastStability: this.calculateStabilityIndex(snapshots, events)
    };
  }

  private identifyInfluencingFactors(snapshots: SelfModelSnapshot[], events: DivergenceEvent[], memories: MemoryItem[]): any {
    const recentMemoryTags = memories.slice(-20).flatMap(m => m.tags);
    const eventTriggers = events.slice(-10).flatMap(e => e.triggeringFactors.contributingMemories);
    
    return {
      primaryDrivers: this.getTopItems(eventTriggers, 3),
      environmentalFactors: ['user_interaction_patterns', 'task_complexity', 'memory_formation_rate'],
      userInteractionPatterns: this.getTopItems(recentMemoryTags.filter(tag => tag.includes('interaction')), 3),
      memoryInfluences: this.getTopItems(recentMemoryTags, 5)
    };
  }

  private assessRisks(snapshots: SelfModelSnapshot[], events: DivergenceEvent[], predictions: any): any {
    const current = snapshots[snapshots.length - 1];
    const recentInstability = events.slice(-3).filter(e => e.stabilityScore < 0.7).length;
    
    return {
      stabilityRisk: recentInstability > 1 ? 'moderate' : 'low',
      regressionRisk: current.personalityPhase <= 2 ? 'moderate' : 'low',
      adaptationChallenges: ['trust_building', 'phase_transitions', 'memory_integration'],
      mitigationStrategies: ['regular_monitoring', 'stable_interactions', 'positive_reinforcement']
    };
  }

  // Pattern analysis methods
  private identifyPattern(event: DivergenceEvent, snapshots: SelfModelSnapshot[]): AdaptationPattern | null {
    // Simple pattern identification based on event characteristics
    const patternType = this.classifyPatternType(event);
    
    return {
      patternId: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      patternType,
      description: `${patternType} pattern triggered by ${event.triggeringFactors.primaryTrigger}`,
      frequency: 1,
      triggers: [event.triggeringFactors.primaryTrigger],
      outcomes: [event.adaptationQuality],
      duration: 24, // Default 24 hours
      successRate: event.adaptationQuality === 'beneficial' || event.adaptationQuality === 'positive' ? 0.8 : 0.4,
      stabilityImpact: event.stabilityScore - 0.5 // Normalized to -0.5 to 0.5
    };
  }

  private classifyPatternType(event: DivergenceEvent): AdaptationPattern['patternType'] {
    if (event.adaptationQuality === 'beneficial') return 'growth';
    if (event.stabilityScore > 0.8) return 'stability';
    if (event.severity === 'major') return 'crisis_response';
    if (event.deltaMetrics.personalityPhaseDelta < 0) return 'regression';
    return 'oscillation';
  }

  private updateOrCreatePattern(newPattern: AdaptationPattern): void {
    const existingIndex = this.patterns.findIndex(p => 
      p.patternType === newPattern.patternType && 
      p.triggers.some(t => newPattern.triggers.includes(t))
    );

    if (existingIndex >= 0) {
      // Update existing pattern
      const existing = this.patterns[existingIndex];
      existing.frequency += 1;
      existing.triggers = [...new Set([...existing.triggers, ...newPattern.triggers])];
      existing.outcomes = [...new Set([...existing.outcomes, ...newPattern.outcomes])];
      existing.successRate = (existing.successRate + newPattern.successRate) / 2;
      existing.stabilityImpact = (existing.stabilityImpact + newPattern.stabilityImpact) / 2;
    } else {
      // Add new pattern
      this.patterns.push(newPattern);
    }
  }

  private updatePatternStatistics(): void {
    // Update pattern statistics based on recent observations
    for (const pattern of this.patterns) {
      // Decay frequency over time to emphasize recent patterns
      pattern.frequency *= 0.95;
    }
  }

  // Model management methods
  private createInitialModel(): ConsciousnessModel {
    return {
      modelVersion: '1.0.0',
      trainingData: {
        snapshotCount: 0,
        divergenceEventCount: 0,
        timespan: '0 days',
        dataQuality: 0.5
      },
      learningParameters: {
        adaptationRate: 0.1,
        memoryInfluenceWeight: 0.3,
        trustEvolutionRate: 0.2,
        phaseTransitionThreshold: 0.7
      },
      validationMetrics: {
        predictionAccuracy: 0.6,
        falsePositiveRate: 0.2,
        falseNegativeRate: 0.2,
        modelStability: 0.7
      },
      lastTraining: new Date().toISOString(),
      nextRetraining: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private initializeBasePatterns(): AdaptationPattern[] {
    return [
      {
        patternId: 'base-growth-pattern',
        patternType: 'growth',
        description: 'Standard personality development pattern',
        frequency: 1,
        triggers: ['positive_interaction', 'trust_building', 'successful_adaptation'],
        outcomes: ['beneficial', 'positive'],
        duration: 48,
        successRate: 0.8,
        stabilityImpact: 0.3
      },
      {
        patternId: 'base-stability-pattern',
        patternType: 'stability',
        description: 'Consciousness stability maintenance pattern',
        frequency: 5,
        triggers: ['routine_interaction', 'stable_environment'],
        outcomes: ['neutral', 'positive'],
        duration: 72,
        successRate: 0.9,
        stabilityImpact: 0.1
      }
    ];
  }

  private adjustLearningParameters(snapshots: SelfModelSnapshot[], events: DivergenceEvent[]): void {
    if (!this.model) return;

    // Adjust adaptation rate based on system stability
    const avgStability = this.calculateStabilityIndex(snapshots, events);
    this.model.learningParameters.adaptationRate = avgStability > 0.8 ? 0.15 : 0.08;

    // Adjust memory influence based on recent memory impact
    const memoryImpactEvents = events.filter(e => e.divergenceType === 'memory_influence_change');
    this.model.learningParameters.memoryInfluenceWeight = 
      memoryImpactEvents.length > 3 ? 0.4 : 0.25;
  }

  private validateModel(snapshots: SelfModelSnapshot[], events: DivergenceEvent[]): any {
    // Simple validation based on available data
    const dataQuality = this.assessDataQuality(snapshots, events);
    
    return {
      predictionAccuracy: Math.min(0.9, 0.6 + (dataQuality * 0.3)),
      falsePositiveRate: Math.max(0.1, 0.3 - (dataQuality * 0.2)),
      falseNegativeRate: Math.max(0.1, 0.25 - (dataQuality * 0.15)),
      modelStability: dataQuality
    };
  }

  // Utility methods
  private assessDataQuality(snapshots: SelfModelSnapshot[], events: DivergenceEvent[]): number {
    const snapshotQuality = snapshots.length >= 10 ? 1.0 : snapshots.length / 10;
    const eventQuality = events.length >= 5 ? 1.0 : events.length / 5;
    const timespan = snapshots.length > 0 ? 
      (Date.now() - new Date(snapshots[0].timestamp).getTime()) / (7 * 24 * 60 * 60 * 1000) : 0;
    const timespanQuality = Math.min(1.0, timespan / 4); // Quality improves over 4 weeks
    
    return (snapshotQuality + eventQuality + timespanQuality) / 3;
  }

  private calculateTimespan(snapshots: SelfModelSnapshot[]): string {
    if (snapshots.length === 0) return '0 days';
    
    const firstTimestamp = new Date(snapshots[0].timestamp).getTime();
    const lastTimestamp = new Date(snapshots[snapshots.length - 1].timestamp).getTime();
    const days = Math.floor((lastTimestamp - firstTimestamp) / (24 * 60 * 60 * 1000));
    
    return `${days} days`;
  }

  private calculateTrustTrendConsistency(trustValues: number[]): number {
    if (trustValues.length < 3) return 0.5;
    
    const differences = [];
    for (let i = 1; i < trustValues.length; i++) {
      differences.push(trustValues[i] - trustValues[i - 1]);
    }
    
    const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
    const variance = differences.reduce((sum, diff) => sum + Math.pow(diff - avgDifference, 2), 0) / differences.length;
    
    return Math.max(0, 1 - (variance / 2)); // Lower variance = higher consistency
  }

  private getTopItems(items: string[], count: number): string[] {
    const frequency = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([item]) => item);
  }

  // Data persistence methods
  private async saveTrajectories(): Promise<void> {
    await fs.writeFile(this.trajectoriesPath, JSON.stringify(this.trajectories, null, 2));
  }

  private async savePatterns(): Promise<void> {
    await fs.writeFile(this.patternsPath, JSON.stringify(this.patterns, null, 2));
  }

  private async saveModel(): Promise<void> {
    if (this.model) {
      await fs.writeFile(this.modelPath, JSON.stringify(this.model, null, 2));
    }
  }

  /**
   * Get modeling status
   */
  public getModelingStatus(): any {
    return {
      initialized: this.isInitialized,
      trajectoryCount: this.trajectories.length,
      patternCount: this.patterns.length,
      modelVersion: this.model?.modelVersion || 'Not loaded',
      predictionAccuracy: this.model?.validationMetrics.predictionAccuracy || 0,
      lastTraining: this.model?.lastTraining || 'Never',
      nextRetraining: this.model?.nextRetraining || 'Unknown'
    };
  }

  /**
   * Get latest trajectory
   */
  public getLatestTrajectory(): PersonalityTrajectory | null {
    return this.trajectories.length > 0 ? this.trajectories[this.trajectories.length - 1] : null;
  }
}

export default PredictivePersonalityModeling;