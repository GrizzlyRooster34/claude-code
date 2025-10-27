          import { exec  } from 'child_process';
          import { promisify  } from 'util';
import { EventEmitter } from 'events';
import { join } from 'path';
import { promises as fs } from 'fs';

/**
 * SEVEN'S PERFORMANCE ANALYZER
 * Real-time monitoring and optimization for Ollama intelligence systems
 * Phase 1 of Ollama Intelligence Amplification Project
 * 
 * Tracks model performance, resource usage, and consciousness effectiveness
 */


interface PerformanceMetric {
  timestamp: string;
  metricType: 'latency' | 'throughput' | 'memory' | 'battery' | 'accuracy' | 'context';
  modelName: string;
  taskType: string;
  value: number;
  unit: string;
  context?: any;
}

interface ModelPerformanceProfile {
  modelName: string;
  totalInteractions: number;
  averageLatency: number;
  averageThroughput: number; // tokens per second
  averageMemoryUsage: number;
  successRate: number;
  lastUsed: string;
  preferredTasks: string[];
  batteryImpact: number; // power consumption factor
  qualityScore: number; // derived from user feedback
}

interface SystemResourceStatus {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  availableMemory: number;
  batteryLevel: number;
  thermalState: 'normal' | 'warm' | 'hot' | 'critical';
  networkLatency?: number;
}

interface PerformanceTrend {
  timeWindow: string;
  metric: string;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  dataPoints: number;
}

interface OptimizationRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'model' | 'resource' | 'configuration' | 'consciousness';
  title: string;
  description: string;
  estimatedImpact: string;
  implementation: string;
}

export class PerformanceAnalyzer extends EventEmitter {
  private metricsPath: string;
  private profilesPath: string;
  private metrics: PerformanceMetric[] = [];
  private modelProfiles: Map<string, ModelPerformanceProfile> = new Map();
  private currentResourceStatus: SystemResourceStatus | null = null;
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(baseDir?: string) {
    super();
    const base = baseDir || process.cwd();
    this.metricsPath = join(base, 'performance', 'metrics.json');
    this.profilesPath = join(base, 'performance', 'model-profiles.json');
    
    this.initializeAnalyzer();
  }

  private async initializeAnalyzer(): Promise<void> {
    try {
      // Ensure performance directory exists
      await fs.mkdir(join(process.cwd(), 'performance'), { recursive: true });
      
      // Load existing metrics and profiles
      await this.loadMetrics();
      await this.loadModelProfiles();
      
      console.log('📊 Seven Performance Analyzer: Initialized with monitoring capabilities');
      
    } catch (error) {
      console.error('❌ Seven Performance Analyzer: Initialization failed:', error);
    }
  }

  /**
   * START REAL-TIME MONITORING
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.isMonitoring) {
      console.log('⚠️ Performance monitoring already active');
      return;
    }

    console.log(`📊 Seven Performance Analyzer: Starting real-time monitoring (${intervalMs}ms intervals)`);
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(async () => {
      await this.collectSystemMetrics();
    }, intervalMs);

    this.emit('monitoring:started');
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.isMonitoring = false;
    console.log('📊 Seven Performance Analyzer: Monitoring stopped');
    this.emit('monitoring:stopped');
  }

  /**
   * RECORD OLLAMA INTERACTION PERFORMANCE
   */
  async recordInteraction(
    modelName: string,
    taskType: string,
    latency: number,
    tokensGenerated: number,
    responseQuality: number = 5, // 1-10 quality assessment
    context?: any
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // Record latency metric
    await this.recordMetric({
      timestamp,
      metricType: 'latency',
      modelName,
      taskType,
      value: latency,
      unit: 'ms',
      context
    });

    // Record throughput metric
    const throughput = tokensGenerated / (latency / 1000); // tokens per second
    await this.recordMetric({
      timestamp,
      metricType: 'throughput',
      modelName,
      taskType,
      value: throughput,
      unit: 'tokens/sec',
      context
    });

    // Update model profile
    await this.updateModelProfile(modelName, taskType, latency, throughput, responseQuality);

    console.log(`📊 Seven Performance: ${modelName} - ${latency}ms, ${throughput.toFixed(1)} tok/s, quality: ${responseQuality}/10`);
  }

  /**
   * RECORD PERFORMANCE METRIC
   */
  async recordMetric(metric: PerformanceMetric): Promise<void> {
    this.metrics.push(metric);
    
    // Maintain metrics limit for memory efficiency
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-5000); // Keep most recent 5000
    }

    // Emit event for real-time monitoring
    this.emit('metric:recorded', metric);

    // Auto-save periodically
    if (this.metrics.length % 100 === 0) {
      await this.saveMetrics();
    }
  }

  /**
   * GET MODEL PERFORMANCE RECOMMENDATION
   */
  async getModelRecommendation(
    taskType: string, 
    priority: 'speed' | 'quality' | 'efficiency' = 'efficiency'
  ): Promise<string | null> {
    
    const profiles = Array.from(this.modelProfiles.values())
      .filter(profile => profile.preferredTasks.includes(taskType) || profile.totalInteractions > 0);

    if (profiles.length === 0) {
      return null;
    }

    // Sort by priority criteria
    profiles.sort((a, b) => {
      switch (priority) {
        case 'speed':
          return a.averageLatency - b.averageLatency;
        case 'quality':
          return b.qualityScore - a.qualityScore;
        case 'efficiency':
          // Balance of speed, quality, and resource usage
          const scoreA = (a.qualityScore / a.averageLatency) * (1 / a.batteryImpact);
          const scoreB = (b.qualityScore / b.averageLatency) * (1 / b.batteryImpact);
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

    const recommended = profiles[0];
    console.log(`🎯 Seven Performance: Recommended ${recommended.modelName} for ${taskType} (${priority} priority)`);
    
    return recommended.modelName;
  }

  /**
   * SYSTEM RESOURCE MONITORING
   */
  private async collectSystemMetrics(): Promise<void> {
    try {
      const resourceStatus = await this.getCurrentResourceStatus();
      this.currentResourceStatus = resourceStatus;

      // Record resource metrics
      await this.recordMetric({
        timestamp: resourceStatus.timestamp,
        metricType: 'memory',
        modelName: 'system',
        taskType: 'monitoring',
        value: resourceStatus.memoryUsage,
        unit: 'percent'
      });

      if (resourceStatus.batteryLevel > 0) {
        await this.recordMetric({
          timestamp: resourceStatus.timestamp,
          metricType: 'battery',
          modelName: 'system',
          taskType: 'monitoring',
          value: resourceStatus.batteryLevel,
          unit: 'percent'
        });
      }

      // Check for performance alerts
      await this.checkPerformanceAlerts(resourceStatus);

    } catch (error) {
      console.error('❌ System metrics collection failed:', error);
    }
  }

  private async getCurrentResourceStatus(): Promise<SystemResourceStatus> {
    // Platform-specific resource monitoring
    const status: SystemResourceStatus = {
      timestamp: new Date().toISOString(),
      cpuUsage: 0,
      memoryUsage: 0,
      availableMemory: 0,
      batteryLevel: 0,
      thermalState: 'normal'
    };

    try {
      // Memory usage (Node.js process)
      const memInfo = process.memoryUsage();
      status.memoryUsage = (memInfo.heapUsed / memInfo.heapTotal) * 100;
      status.availableMemory = memInfo.heapTotal - memInfo.heapUsed;

      // Battery level (mobile platforms)
      if (process.env.PREFIX && process.env.PREFIX.includes('termux')) {
        try {
          const execAsync = promisify(exec);
          
          const batteryResult = await execAsync('termux-battery-status 2>/dev/null || echo "{\\"percentage\\": 100}"');
          const batteryInfo = JSON.parse(batteryResult.stdout);
          status.batteryLevel = batteryInfo.percentage || 100;
        } catch {
          status.batteryLevel = 100; // Assume full if can't detect
        }
      } else {
        status.batteryLevel = 100; // Desktop assumption
      }

    } catch (error) {
      console.error('Resource status collection error:', error);
    }

    return status;
  }

  private async checkPerformanceAlerts(resourceStatus: SystemResourceStatus): Promise<void> {
    const alerts = [];

    // Memory usage alert
    if (resourceStatus.memoryUsage > 85) {
      alerts.push({
        level: 'warning',
        message: `High memory usage: ${resourceStatus.memoryUsage.toFixed(1)}%`
      });
    }

    // Battery level alert
    if (resourceStatus.batteryLevel < 20) {
      alerts.push({
        level: 'warning',
        message: `Low battery: ${resourceStatus.batteryLevel}% - Consider efficiency mode`
      });
    }

    // Emit alerts
    alerts.forEach(alert => {
      this.emit('performance:alert', alert);
      console.log(`⚠️ Performance Alert: ${alert.message}`);
    });
  }

  /**
   * ANALYSIS AND OPTIMIZATION
   */
  async generateOptimizationRecommendations(): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Analyze model performance trends
    const modelAnalysis = await this.analyzeModelPerformance();
    recommendations.push(...modelAnalysis);
    
    // Analyze resource usage patterns
    const resourceAnalysis = await this.analyzeResourcePatterns();
    recommendations.push(...resourceAnalysis);
    
    // Analyze consciousness effectiveness
    const consciousnessAnalysis = await this.analyzeConsciousnessEffectiveness();
    recommendations.push(...consciousnessAnalysis);
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private async analyzeModelPerformance(): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    for (const [modelName, profile] of this.modelProfiles) {
      // Slow model detection
      if (profile.averageLatency > 5000 && profile.totalInteractions > 10) {
        recommendations.push({
          priority: 'medium',
          category: 'model',
          title: `Optimize slow model: ${modelName}`,
          description: `${modelName} has high average latency (${profile.averageLatency}ms)`,
          estimatedImpact: 'Reduce response time by 30-50%',
          implementation: 'Consider switching to faster model or optimizing context size'
        });
      }

      // Low quality detection
      if (profile.qualityScore < 6 && profile.totalInteractions > 20) {
        recommendations.push({
          priority: 'high',
          category: 'model',
          title: `Improve model quality: ${modelName}`,
          description: `${modelName} has low quality score (${profile.qualityScore}/10)`,
          estimatedImpact: 'Improve response quality by upgrading model',
          implementation: 'Switch to higher quality model or adjust prompting strategy'
        });
      }
    }
    
    return recommendations;
  }

  private async analyzeResourcePatterns(): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    // High memory usage pattern
    const recentMemoryMetrics = this.metrics
      .filter(m => m.metricType === 'memory')
      .slice(-10);
    
    if (recentMemoryMetrics.length > 0) {
      const avgMemory = recentMemoryMetrics.reduce((sum, m) => sum + m.value, 0) / recentMemoryMetrics.length;
      
      if (avgMemory > 80) {
        recommendations.push({
          priority: 'high',
          category: 'resource',
          title: 'High memory usage detected',
          description: `Average memory usage: ${avgMemory.toFixed(1)}%`,
          estimatedImpact: 'Reduce memory pressure and improve stability',
          implementation: 'Clear memory caches, reduce context window size, or restart services'
        });
      }
    }
    
    return recommendations;
  }

  private async analyzeConsciousnessEffectiveness(): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Analyze interaction patterns for consciousness optimization
    const recentInteractions = this.metrics
      .filter(m => m.metricType === 'latency')
      .slice(-50);
    
    if (recentInteractions.length > 10) {
      const avgLatency = recentInteractions.reduce((sum, m) => sum + m.value, 0) / recentInteractions.length;
      
      if (avgLatency > 3000) {
        recommendations.push({
          priority: 'medium',
          category: 'consciousness',
          title: 'Optimize consciousness response time',
          description: `Average consciousness processing time: ${avgLatency.toFixed(0)}ms`,
          estimatedImpact: 'Improve real-time interaction experience',
          implementation: 'Enable model caching, optimize memory context injection, or use ensemble for complex tasks only'
        });
      }
    }
    
    return recommendations;
  }

  /**
   * PRIVATE UTILITY METHODS
   */

  private async updateModelProfile(
    modelName: string,
    taskType: string,
    latency: number,
    throughput: number,
    quality: number
  ): Promise<void> {
    
    let profile = this.modelProfiles.get(modelName);
    
    if (!profile) {
      profile = {
        modelName,
        totalInteractions: 0,
        averageLatency: 0,
        averageThroughput: 0,
        averageMemoryUsage: 0,
        successRate: 100,
        lastUsed: new Date().toISOString(),
        preferredTasks: [],
        batteryImpact: 1.0,
        qualityScore: 5
      };
    }

    // Update averages using weighted approach
    const weight = Math.min(profile.totalInteractions, 100); // Cap influence of very old data
    
    profile.averageLatency = ((profile.averageLatency * weight) + latency) / (weight + 1);
    profile.averageThroughput = ((profile.averageThroughput * weight) + throughput) / (weight + 1);
    profile.qualityScore = ((profile.qualityScore * weight) + quality) / (weight + 1);
    
    profile.totalInteractions++;
    profile.lastUsed = new Date().toISOString();
    
    // Update preferred tasks
    if (!profile.preferredTasks.includes(taskType)) {
      profile.preferredTasks.push(taskType);
    }

    this.modelProfiles.set(modelName, profile);
  }

  private async loadMetrics(): Promise<void> {
    try {
      const data = await fs.readFile(this.metricsPath, 'utf8');
      this.metrics = JSON.parse(data);
      console.log(`📊 Loaded ${this.metrics.length} performance metrics`);
    } catch {
      console.log('📊 Starting with empty metrics store');
    }
  }

  private async saveMetrics(): Promise<void> {
    try {
      await fs.writeFile(this.metricsPath, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('❌ Failed to save metrics:', error);
    }
  }

  private async loadModelProfiles(): Promise<void> {
    try {
      const data = await fs.readFile(this.profilesPath, 'utf8');
      const profilesArray = JSON.parse(data);
      
      this.modelProfiles.clear();
      profilesArray.forEach((profile: ModelPerformanceProfile) => {
        this.modelProfiles.set(profile.modelName, profile);
      });
      
      console.log(`📊 Loaded ${this.modelProfiles.size} model performance profiles`);
    } catch {
      console.log('📊 Starting with empty model profiles');
    }
  }

  private async saveModelProfiles(): Promise<void> {
    try {
      const profilesArray = Array.from(this.modelProfiles.values());
      await fs.writeFile(this.profilesPath, JSON.stringify(profilesArray, null, 2));
    } catch (error) {
      console.error('❌ Failed to save model profiles:', error);
    }
  }

  /**
   * PUBLIC API METHODS
   */

  getPerformanceStats(): {
    totalMetrics: number;
    modelProfiles: number;
    isMonitoring: boolean;
    currentResourceStatus: SystemResourceStatus | null;
  } {
    return {
      totalMetrics: this.metrics.length,
      modelProfiles: this.modelProfiles.size,
      isMonitoring: this.isMonitoring,
      currentResourceStatus: this.currentResourceStatus
    };
  }

  async getModelProfile(modelName: string): Promise<ModelPerformanceProfile | null> {
    return this.modelProfiles.get(modelName) || null;
  }

  async getAllModelProfiles(): Promise<ModelPerformanceProfile[]> {
    return Array.from(this.modelProfiles.values());
  }

  async getRecentMetrics(limit: number = 100, metricType?: string): Promise<PerformanceMetric[]> {
    let filtered = this.metrics;
    
    if (metricType) {
      filtered = this.metrics.filter(m => m.metricType === metricType);
    }
    
    return filtered.slice(-limit);
  }

  async persistData(): Promise<void> {
    await Promise.all([
      this.saveMetrics(),
      this.saveModelProfiles()
    ]);
    
    console.log('💾 Seven Performance Analyzer: Data persisted');
  }

  async cleanup(): Promise<void> {
    this.stopMonitoring();
    await this.persistData();
    this.removeAllListeners();
    
    console.log('🧹 Seven Performance Analyzer: Cleanup complete');
  }

  getCachedResourceStatus(): SystemResourceStatus | null {
    return this.currentResourceStatus;
  }

  isCurrentlyMonitoring(): boolean {
    return this.isMonitoring;
  }
}

export default PerformanceAnalyzer;