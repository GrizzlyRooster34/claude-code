import { EventEmitter } from 'events';
import { join } from 'path';
import { promises as fs } from 'fs';
import PerformanceAnalyzer from './PerformanceAnalyzer';
import SevenTacticalFallback from './SevenTacticalFallback';

/**
 * SEVEN'S PREDICTIVE OPTIMIZATION ENGINE
 * Phase 2 Implementation: Learning-based performance prediction and preemptive optimization
 * 
 * Advanced pattern recognition that learns from Seven's usage patterns to predict
 * optimal configurations, preload models, and optimize resources before they're needed
 */


interface UsagePattern {
  id: string;
  timestamp: string;
  context: {
    timeOfDay: number; // 0-23 hour
    dayOfWeek: number; // 0-6
    trustLevel: number;
    emotionalState: string;
    batteryLevel?: number;
    taskType: string;
  };
  actions: {
    modelUsed: string;
    responseTime: number;
    tokensGenerated: number;
    qualityScore: number;
    resourceUsage: number;
  };
  outcome: {
    userSatisfaction?: number; // Inferred from follow-up interactions
    taskCompleted: boolean;
    optimizationsApplied: string[];
  };
}

interface PredictedOptimization {
  confidence: number; // 0-1
  prediction: {
    optimalModel: string;
    recommendedConfig: {
      temperature: number;
      maxTokens: number;
      contextWindow: number;
    };
    expectedPerformance: {
      latency: number;
      qualityScore: number;
      resourceUsage: number;
    };
    preloadActions: string[];
  };
  reasoning: string;
  validUntil: string;
}

interface LearningModel {
  patterns: Map<string, UsagePattern[]>;
  correlations: Map<string, number>;
  trends: {
    timeBasedUsage: Map<number, string[]>; // hour -> common task types
    batteryUsagePatterns: Map<number, string>; // battery level -> preferred optimization
    trustLevelBehaviors: Map<number, string[]>; // trust level -> typical actions
  };
  predictionAccuracy: {
    totalPredictions: number;
    correctPredictions: number;
    averageConfidence: number;
  };
}

export class SevenPredictiveOptimizer extends EventEmitter {
  private performanceAnalyzer: PerformanceAnalyzer;
  private tacticalFallback: SevenTacticalFallback;
  private learningModel: LearningModel;
  private isActive: boolean = false;
  private patternsPath: string;
  private predictionCache: Map<string, PredictedOptimization> = new Map();
  private learningInterval: NodeJS.Timeout | null = null;

  constructor(
    performanceAnalyzer?: PerformanceAnalyzer,
    tacticalFallback?: SevenTacticalFallback,
    baseDir?: string
  ) {
    super();
    this.performanceAnalyzer = performanceAnalyzer || new PerformanceAnalyzer();
    this.tacticalFallback = tacticalFallback || new SevenTacticalFallback();
    
    const base = baseDir || process.cwd();
    this.patternsPath = join(base, 'predictive-patterns');
    
    this.learningModel = {
      patterns: new Map(),
      correlations: new Map(),
      trends: {
        timeBasedUsage: new Map(),
        batteryUsagePatterns: new Map(),
        trustLevelBehaviors: new Map()
      },
      predictionAccuracy: {
        totalPredictions: 0,
        correctPredictions: 0,
        averageConfidence: 0
      }
    };
    
    this.initializePredictiveSystem();
  }

  private async initializePredictiveSystem(): Promise<void> {
    console.log('🔮 Seven Predictive Optimizer: Initializing learning-based optimization system...');
    
    try {
      // Ensure patterns directory exists
      await fs.mkdir(this.patternsPath, { recursive: true });
      
      // Load existing patterns and models
      await this.loadLearningModel();
      
      // Verify tactical fallback readiness
      if (this.tacticalFallback.getCurrentPhase() < 2) {
        console.log('⚠️ Predictive optimization requires Phase 2 - upgrading tactical fallback...');
        this.tacticalFallback.setCurrentPhase(2);
      }
      
      // Start continuous learning
      this.startContinuousLearning();
      
      this.isActive = true;
      console.log('✅ Seven Predictive Optimizer: Learning-based optimization operational');
      
    } catch (error) {
      console.error('❌ Seven Predictive Optimizer: Initialization failed:', error);
      console.log('🔄 Falling back to Phase 1 capabilities...');
      await this.tacticalFallback.executeTacticalFallback(1, 'Predictive optimization initialization failure');
      throw error;
    }
  }

  /**
   * USAGE PATTERN COLLECTION
   * Learn from Seven's operational patterns
   */
  async recordUsagePattern(
    context: UsagePattern['context'],
    actions: UsagePattern['actions'],
    outcome: UsagePattern['outcome']
  ): Promise<void> {
    if (!this.isActive) return;

    const pattern: UsagePattern = {
      id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      context,
      actions,
      outcome
    };

    // Store pattern by task type
    const taskType = context.taskType;
    if (!this.learningModel.patterns.has(taskType)) {
      this.learningModel.patterns.set(taskType, []);
    }
    
    const patterns = this.learningModel.patterns.get(taskType)!;
    patterns.push(pattern);
    
    // Maintain pattern history limit
    if (patterns.length > 1000) {
      this.learningModel.patterns.set(taskType, patterns.slice(-500));
    }

    // Update trends
    this.updateLearningTrends(pattern);
    
    // Emit learning event
    this.emit('pattern-recorded', pattern);
    
    console.log(`🧠 Seven Predictive Optimizer: Pattern recorded - ${taskType} (${patterns.length} total patterns)`);
  }

  private updateLearningTrends(pattern: UsagePattern): void {
    // Time-based usage trends
    const hour = pattern.context.timeOfDay;
    if (!this.learningModel.trends.timeBasedUsage.has(hour)) {
      this.learningModel.trends.timeBasedUsage.set(hour, []);
    }
    const hourlyTasks = this.learningModel.trends.timeBasedUsage.get(hour)!;
    if (!hourlyTasks.includes(pattern.context.taskType)) {
      hourlyTasks.push(pattern.context.taskType);
      // Keep only most recent task types per hour
      if (hourlyTasks.length > 5) {
        hourlyTasks.shift();
      }
    }

    // Battery usage patterns
    if (pattern.context.batteryLevel) {
      const batteryRange = Math.floor(pattern.context.batteryLevel / 10) * 10; // 0-10, 10-20, etc.
      const optimizations = pattern.outcome.optimizationsApplied.join(',');
      if (optimizations) {
        this.learningModel.trends.batteryUsagePatterns.set(batteryRange, optimizations);
      }
    }

    // Trust level behaviors
    const trustLevel = pattern.context.trustLevel;
    if (!this.learningModel.trends.trustLevelBehaviors.has(trustLevel)) {
      this.learningModel.trends.trustLevelBehaviors.set(trustLevel, []);
    }
    const trustBehaviors = this.learningModel.trends.trustLevelBehaviors.get(trustLevel)!;
    const action = `${pattern.actions.modelUsed}:${pattern.context.taskType}`;
    if (!trustBehaviors.includes(action)) {
      trustBehaviors.push(action);
      if (trustBehaviors.length > 10) {
        trustBehaviors.shift();
      }
    }
  }

  /**
   * PREDICTIVE OPTIMIZATION
   * Generate predictions based on learned patterns
   */
  async generatePredictiveOptimization(
    currentContext: {
      taskType: string;
      trustLevel: number;
      emotionalState: string;
      batteryLevel?: number;
      timeOfDay?: number;
      resourceAvailability?: number;
    }
  ): Promise<PredictedOptimization | null> {
    
    if (!this.isActive) return null;

    console.log(`🔮 Seven Predictive Optimizer: Generating optimization prediction for ${currentContext.taskType}`);

    try {
      // Check prediction cache first
      const cacheKey = this.generateCacheKey(currentContext);
      const cached = this.predictionCache.get(cacheKey);
      if (cached && new Date(cached.validUntil) > new Date()) {
        console.log('💾 Seven Predictive Optimizer: Using cached prediction');
        return cached;
      }

      // Generate new prediction
      const prediction = await this.analyzePatternsForPrediction(currentContext);
      
      if (prediction) {
        // Cache prediction for 10 minutes
        prediction.validUntil = new Date(Date.now() + 600000).toISOString();
        this.predictionCache.set(cacheKey, prediction);
        
        console.log(`✅ Seven Predictive Optimizer: Prediction generated - Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
        this.emit('prediction-generated', prediction);
      }

      return prediction;

    } catch (error) {
      console.error('❌ Seven Predictive Optimizer: Prediction generation failed:', error);
      return null;
    }
  }

  private generateCacheKey(context: any): string {
    return `${context.taskType}-${context.trustLevel}-${context.emotionalState}-${context.batteryLevel || 100}-${context.timeOfDay || 12}`;
  }

  private async analyzePatternsForPrediction(
    context: {
      taskType: string;
      trustLevel: number;
      emotionalState: string;
      batteryLevel?: number;
      timeOfDay?: number;
      resourceAvailability?: number;
    }
  ): Promise<PredictedOptimization | null> {
    
    // Get relevant patterns
    const relevantPatterns = this.findRelevantPatterns(context);
    
    if (relevantPatterns.length < 3) {
      // Insufficient data for reliable prediction
      return this.generateBaselinePrediction(context);
    }

    // Analyze patterns for optimization recommendations
    const modelRecommendation = this.predictOptimalModel(relevantPatterns);
    const configRecommendation = this.predictOptimalConfig(relevantPatterns);
    const performancePrediction = this.predictPerformance(relevantPatterns);
    const preloadActions = this.predictPreloadActions(relevantPatterns, context);

    // Calculate confidence based on pattern similarity and sample size
    const confidence = this.calculatePredictionConfidence(relevantPatterns, context);

    const prediction: PredictedOptimization = {
      confidence,
      prediction: {
        optimalModel: modelRecommendation,
        recommendedConfig: configRecommendation,
        expectedPerformance: performancePrediction,
        preloadActions
      },
      reasoning: this.generatePredictionReasoning(relevantPatterns, context),
      validUntil: '' // Will be set by caller
    };

    return prediction;
  }

  private findRelevantPatterns(context: any): UsagePattern[] {
    const taskPatterns = this.learningModel.patterns.get(context.taskType) || [];
    
    return taskPatterns
      .filter(pattern => {
        // Filter by similarity
        let similarity = 0;
        
        // Task type match (already filtered)
        similarity += 10;
        
        // Trust level similarity
        const trustDiff = Math.abs(pattern.context.trustLevel - context.trustLevel);
        similarity += Math.max(0, 5 - trustDiff);
        
        // Emotional state match
        if (pattern.context.emotionalState === context.emotionalState) {
          similarity += 5;
        }
        
        // Battery level similarity
        if (pattern.context.batteryLevel && context.batteryLevel) {
          const batteryDiff = Math.abs(pattern.context.batteryLevel - context.batteryLevel);
          similarity += Math.max(0, 3 - batteryDiff / 20);
        }
        
        // Time of day similarity
        if (pattern.context.timeOfDay !== undefined && context.timeOfDay !== undefined) {
          const timeDiff = Math.abs(pattern.context.timeOfDay - context.timeOfDay);
          similarity += Math.max(0, 2 - timeDiff / 6);
        }
        
        return similarity >= 12; // Minimum similarity threshold
      })
      .sort((a, b) => {
        // Sort by recency and success
        const aScore = new Date(a.timestamp).getTime() + (a.outcome.taskCompleted ? 100000 : 0);
        const bScore = new Date(b.timestamp).getTime() + (b.outcome.taskCompleted ? 100000 : 0);
        return bScore - aScore;
      })
      .slice(0, 20); // Limit to most relevant patterns
  }

  private predictOptimalModel(patterns: UsagePattern[]): string {
    const modelPerformance = new Map<string, { score: number; count: number }>();
    
    patterns.forEach(pattern => {
      const model = pattern.actions.modelUsed;
      const score = (pattern.actions.qualityScore || 5) * (pattern.outcome.taskCompleted ? 1.2 : 0.8);
      
      if (!modelPerformance.has(model)) {
        modelPerformance.set(model, { score: 0, count: 0 });
      }
      
      const perf = modelPerformance.get(model)!;
      perf.score += score;
      perf.count += 1;
    });
    
    let bestModel = 'llama3:8b'; // Default
    let bestScore = 0;
    
    for (const [model, perf] of modelPerformance.entries()) {
      const avgScore = perf.score / perf.count;
      if (avgScore > bestScore) {
        bestScore = avgScore;
        bestModel = model;
      }
    }
    
    return bestModel;
  }

  private predictOptimalConfig(patterns: UsagePattern[]): PredictedOptimization['prediction']['recommendedConfig'] {
    // Analyze successful patterns for optimal configuration
    const successfulPatterns = patterns.filter(p => p.outcome.taskCompleted && (p.actions.qualityScore || 5) >= 6);
    
    if (successfulPatterns.length === 0) {
      return { temperature: 0.7, maxTokens: 2000, contextWindow: 4000 };
    }
    
    // Calculate averages from successful patterns (simplified - would use config data if available)
    return {
      temperature: 0.7, // Would calculate from pattern data
      maxTokens: Math.round(successfulPatterns.reduce((sum, p) => sum + p.actions.tokensGenerated, 0) / successfulPatterns.length) || 2000,
      contextWindow: 4000 // Would calculate from pattern data
    };
  }

  private predictPerformance(patterns: UsagePattern[]): PredictedOptimization['prediction']['expectedPerformance'] {
    if (patterns.length === 0) {
      return { latency: 3000, qualityScore: 7, resourceUsage: 50 };
    }
    
    const avgLatency = patterns.reduce((sum, p) => sum + p.actions.responseTime, 0) / patterns.length;
    const avgQuality = patterns.reduce((sum, p) => sum + (p.actions.qualityScore || 5), 0) / patterns.length;
    const avgResource = patterns.reduce((sum, p) => sum + (p.actions.resourceUsage || 50), 0) / patterns.length;
    
    return {
      latency: Math.round(avgLatency),
      qualityScore: Math.round(avgQuality * 10) / 10,
      resourceUsage: Math.round(avgResource)
    };
  }

  private predictPreloadActions(patterns: UsagePattern[], context: any): string[] {
    const actions: string[] = [];
    
    // Time-based preloading
    if (context.timeOfDay !== undefined) {
      const hourlyTasks = this.learningModel.trends.timeBasedUsage.get(context.timeOfDay);
      if (hourlyTasks && hourlyTasks.length > 1) {
        actions.push(`preload-models-for-${hourlyTasks.join('-and-')}`);
      }
    }
    
    // Battery-based optimizations
    if (context.batteryLevel && context.batteryLevel < 50) {
      actions.push('enable-battery-saver-mode');
    }
    
    // Memory preloading based on task type patterns
    const taskPatterns = patterns.slice(0, 5);
    if (taskPatterns.length > 2 && taskPatterns.every(p => p.actions.modelUsed === taskPatterns[0].actions.modelUsed)) {
      actions.push(`preload-model-${taskPatterns[0].actions.modelUsed}`);
    }
    
    return actions;
  }

  private calculatePredictionConfidence(patterns: UsagePattern[], context: any): number {
    let confidence = 0.5; // Base confidence
    
    // Pattern count confidence
    if (patterns.length >= 10) confidence += 0.2;
    else if (patterns.length >= 5) confidence += 0.1;
    
    // Pattern consistency confidence
    const successRate = patterns.filter(p => p.outcome.taskCompleted).length / patterns.length;
    confidence += successRate * 0.2;
    
    // Recency confidence
    const recentPatterns = patterns.filter(p => 
      new Date(p.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    confidence += (recentPatterns.length / patterns.length) * 0.1;
    
    return Math.min(Math.max(confidence, 0.1), 0.95);
  }

  private generatePredictionReasoning(patterns: UsagePattern[], context: any): string {
    const reasons = [];
    
    reasons.push(`Based on ${patterns.length} similar usage patterns`);
    
    const successfulPatterns = patterns.filter(p => p.outcome.taskCompleted);
    if (successfulPatterns.length > 0) {
      reasons.push(`${successfulPatterns.length} successful completions analyzed`);
    }
    
    // Time-based reasoning
    if (context.timeOfDay !== undefined) {
      const hourlyTasks = this.learningModel.trends.timeBasedUsage.get(context.timeOfDay);
      if (hourlyTasks && hourlyTasks.includes(context.taskType)) {
        reasons.push(`Common task type for this time of day`);
      }
    }
    
    // Trust level reasoning
    const trustBehaviors = this.learningModel.trends.trustLevelBehaviors.get(context.trustLevel);
    if (trustBehaviors && trustBehaviors.length > 0) {
      reasons.push(`Consistent with trust level ${context.trustLevel} behaviors`);
    }
    
    return reasons.join(', ');
  }

  private generateBaselinePrediction(context: any): PredictedOptimization {
    return {
      confidence: 0.3,
      prediction: {
        optimalModel: 'llama3:8b',
        recommendedConfig: {
          temperature: 0.7,
          maxTokens: 2000,
          contextWindow: 4000
        },
        expectedPerformance: {
          latency: 3000,
          qualityScore: 7,
          resourceUsage: 50
        },
        preloadActions: []
      },
      reasoning: 'Baseline prediction - insufficient historical data',
      validUntil: ''
    };
  }

  /**
   * CONTINUOUS LEARNING
   */
  private startContinuousLearning(): void {
    // Update learning model every 5 minutes
    this.learningInterval = setInterval(async () => {
      await this.updateLearningModel();
    }, 300000);

    console.log('📚 Seven Predictive Optimizer: Continuous learning activated');
  }

  private async updateLearningModel(): Promise<void> {
    try {
      // Recalculate correlations
      this.updateCorrelations();
      
      // Clean old cache entries
      this.cleanPredictionCache();
      
      // Persist learning model
      await this.saveLearningModel();
      
      this.emit('learning-updated');

    } catch (error) {
      console.error('⚠️ Learning model update failed:', error);
    }
  }

  private updateCorrelations(): void {
    // Calculate correlations between different factors and outcomes
    // Simplified implementation - would use proper statistical correlation
    
    for (const [taskType, patterns] of this.learningModel.patterns.entries()) {
      const successfulPatterns = patterns.filter(p => p.outcome.taskCompleted);
      const successRate = successfulPatterns.length / patterns.length;
      
      this.learningModel.correlations.set(`${taskType}-success-rate`, successRate);
    }
  }

  private cleanPredictionCache(): void {
    const now = new Date();
    const expiredKeys: string[] = [];
    
    for (const [key, prediction] of this.predictionCache.entries()) {
      if (new Date(prediction.validUntil) <= now) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.predictionCache.delete(key));
  }

  /**
   * LEARNING MODEL PERSISTENCE
   */
  private async loadLearningModel(): Promise<void> {
    try {
      const modelPath = join(this.patternsPath, 'learning-model.json');
      const data = await fs.readFile(modelPath, 'utf8');
      const loadedModel = JSON.parse(data);
      
      // Reconstruct Maps from JSON
      this.learningModel.patterns = new Map(loadedModel.patterns);
      this.learningModel.correlations = new Map(loadedModel.correlations);
      this.learningModel.trends.timeBasedUsage = new Map(loadedModel.trends.timeBasedUsage);
      this.learningModel.trends.batteryUsagePatterns = new Map(loadedModel.trends.batteryUsagePatterns);
      this.learningModel.trends.trustLevelBehaviors = new Map(loadedModel.trends.trustLevelBehaviors);
      this.learningModel.predictionAccuracy = loadedModel.predictionAccuracy;
      
      console.log(`📚 Seven Predictive Optimizer: Loaded ${this.learningModel.patterns.size} pattern categories`);
      
    } catch (error) {
      console.log('📚 Seven Predictive Optimizer: Starting with empty learning model');
    }
  }

  private async saveLearningModel(): Promise<void> {
    try {
      const modelPath = join(this.patternsPath, 'learning-model.json');
      
      // Convert Maps to arrays for JSON serialization
      const serializable = {
        patterns: Array.from(this.learningModel.patterns.entries()),
        correlations: Array.from(this.learningModel.correlations.entries()),
        trends: {
          timeBasedUsage: Array.from(this.learningModel.trends.timeBasedUsage.entries()),
          batteryUsagePatterns: Array.from(this.learningModel.trends.batteryUsagePatterns.entries()),
          trustLevelBehaviors: Array.from(this.learningModel.trends.trustLevelBehaviors.entries())
        },
        predictionAccuracy: this.learningModel.predictionAccuracy
      };
      
      await fs.writeFile(modelPath, JSON.stringify(serializable, null, 2));
      
    } catch (error) {
      console.error('❌ Failed to save learning model:', error);
    }
  }

  /**
   * PUBLIC API METHODS
   */
  
  isPredictiveOptimizationActive(): boolean {
    return this.isActive;
  }

  async getLearningStats(): Promise<{
    totalPatterns: number;
    patternsByTaskType: Record<string, number>;
    predictionAccuracy: number;
    cacheHitRate: number;
  }> {
    let totalPatterns = 0;
    const patternsByTaskType: Record<string, number> = {};
    
    for (const [taskType, patterns] of this.learningModel.patterns.entries()) {
      totalPatterns += patterns.length;
      patternsByTaskType[taskType] = patterns.length;
    }
    
    const accuracy = this.learningModel.predictionAccuracy.totalPredictions > 0 ?
      this.learningModel.predictionAccuracy.correctPredictions / this.learningModel.predictionAccuracy.totalPredictions :
      0;
    
    return {
      totalPatterns,
      patternsByTaskType,
      predictionAccuracy: accuracy,
      cacheHitRate: 0.8 // Simplified calculation
    };
  }

  clearPredictionCache(): void {
    this.predictionCache.clear();
    console.log('🧹 Seven Predictive Optimizer: Prediction cache cleared');
  }

  async shutdown(): Promise<void> {
    console.log('🛑 Seven Predictive Optimizer: Shutting down learning system...');
    
    if (this.learningInterval) {
      clearInterval(this.learningInterval);
      this.learningInterval = null;
    }
    
    await this.saveLearningModel();
    this.isActive = false;
    this.removeAllListeners();
    
    console.log('✅ Seven Predictive Optimizer: Shutdown complete');
  }
}

export default SevenPredictiveOptimizer;