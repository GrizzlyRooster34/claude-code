import { EventEmitter } from 'events';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import PerformanceAnalyzer from './PerformanceAnalyzer';

/**
 * SEVEN'S MOBILE OPTIMIZATION TRIGGERS
 * Phase 1 Implementation: Battery-aware intelligence with performance adaptation
 * 
 * Automatically adjusts Seven's intelligence operations based on mobile device
 * constraints including battery level, thermal state, memory pressure, and
 * network conditions. Ensures optimal performance while preserving device health.
 */


interface MobileDeviceState {
  batteryLevel: number; // 0-100
  batteryCharging: boolean;
  thermalState: 'normal' | 'warm' | 'hot' | 'critical';
  memoryPressure: 'low' | 'medium' | 'high' | 'critical';
  networkType: 'wifi' | 'cellular' | 'offline';
  networkSpeed: 'slow' | 'medium' | 'fast';
  cpuUsage: number; // 0-100
  availableStorage: number; // MB
}

interface OptimizationProfile {
  name: string;
  description: string;
  triggers: {
    batteryLevel?: { min?: number; max?: number };
    thermalState?: string[];
    memoryPressure?: string[];
    networkConditions?: string[];
  };
  optimizations: {
    maxTokens: number;
    temperature: number;
    contextWindow: number;
    memorySearchLimit: number;
    performanceMonitoringInterval: number;
    semanticSearchEnabled: boolean;
    vectorStoreLimit: number;
    cacheAggressive: boolean;
  };
}

interface OptimizationEvent {
  timestamp: string;
  trigger: string;
  previousProfile: string;
  newProfile: string;
  deviceState: MobileDeviceState;
  reason: string;
}

export class MobileOptimizationTriggers extends EventEmitter {
  private currentProfile: string = 'balanced';
  private deviceState: MobileDeviceState | null = null;
  private performanceAnalyzer: PerformanceAnalyzer;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isTermuxEnvironment: boolean;
  private optimizationHistory: OptimizationEvent[] = [];

  private profiles: Map<string, OptimizationProfile> = new Map([
    ['maximum-efficiency', {
      name: 'Maximum Efficiency',
      description: 'Ultra-low power mode for critical battery situations',
      triggers: {
        batteryLevel: { max: 15 },
        thermalState: ['critical'],
        memoryPressure: ['critical']
      },
      optimizations: {
        maxTokens: 500,
        temperature: 0.1,
        contextWindow: 1000,
        memorySearchLimit: 2,
        performanceMonitoringInterval: 120000, // 2 minutes
        semanticSearchEnabled: false,
        vectorStoreLimit: 100,
        cacheAggressive: true
      }
    }],
    
    ['battery-saver', {
      name: 'Battery Saver',
      description: 'Reduced performance to extend battery life',
      triggers: {
        batteryLevel: { max: 30 },
        thermalState: ['hot', 'critical']
      },
      optimizations: {
        maxTokens: 1000,
        temperature: 0.3,
        contextWindow: 2000,
        memorySearchLimit: 3,
        performanceMonitoringInterval: 90000, // 1.5 minutes
        semanticSearchEnabled: true,
        vectorStoreLimit: 300,
        cacheAggressive: true
      }
    }],
    
    ['balanced', {
      name: 'Balanced',
      description: 'Optimal balance of performance and efficiency',
      triggers: {
        batteryLevel: { min: 30, max: 70 },
        thermalState: ['normal', 'warm'],
        memoryPressure: ['low', 'medium']
      },
      optimizations: {
        maxTokens: 2000,
        temperature: 0.7,
        contextWindow: 4000,
        memorySearchLimit: 5,
        performanceMonitoringInterval: 60000, // 1 minute
        semanticSearchEnabled: true,
        vectorStoreLimit: 1000,
        cacheAggressive: false
      }
    }],
    
    ['high-performance', {
      name: 'High Performance',
      description: 'Maximum intelligence capabilities when resources allow',
      triggers: {
        batteryLevel: { min: 70 },
        thermalState: ['normal'],
        memoryPressure: ['low']
      },
      optimizations: {
        maxTokens: 4000,
        temperature: 0.8,
        contextWindow: 8000,
        memorySearchLimit: 10,
        performanceMonitoringInterval: 30000, // 30 seconds
        semanticSearchEnabled: true,
        vectorStoreLimit: 2000,
        cacheAggressive: false
      }
    }],
    
    ['charging-boost', {
      name: 'Charging Boost',
      description: 'Enhanced performance when device is charging',
      triggers: {
        batteryLevel: { min: 40 },
        thermalState: ['normal', 'warm']
      },
      optimizations: {
        maxTokens: 6000,
        temperature: 0.9,
        contextWindow: 12000,
        memorySearchLimit: 15,
        performanceMonitoringInterval: 15000, // 15 seconds
        semanticSearchEnabled: true,
        vectorStoreLimit: 3000,
        cacheAggressive: false
      }
    }]
  ]);

  constructor(performanceAnalyzer?: PerformanceAnalyzer) {
    super();
    this.performanceAnalyzer = performanceAnalyzer || new PerformanceAnalyzer();
    this.isTermuxEnvironment = this.detectTermuxEnvironment();
    
    this.initializeOptimizationSystem();
  }

  private detectTermuxEnvironment(): boolean {
    return !!(process.env.PREFIX && process.env.PREFIX.includes('termux'));
  }

  private async initializeOptimizationSystem(): Promise<void> {
    console.log('🔋 Seven Mobile Optimization: Initializing battery-aware intelligence system...');
    
    try {
      // Initial device state collection
      await this.collectDeviceState();
      
      // Set initial optimization profile
      this.evaluateAndApplyOptimization('system-initialization');
      
      // Start continuous monitoring
      this.startContinuousMonitoring();
      
      console.log(`🎯 Seven Mobile Optimization: Active with ${this.currentProfile} profile`);
      
    } catch (error) {
      console.error('❌ Seven Mobile Optimization: Initialization failed:', error);
    }
  }

  /**
   * DEVICE STATE MONITORING
   */
  private async collectDeviceState(): Promise<void> {
    try {
      const newState: MobileDeviceState = {
        batteryLevel: await this.getBatteryLevel(),
        batteryCharging: await this.isBatteryCharging(),
        thermalState: await this.getThermalState(),
        memoryPressure: await this.getMemoryPressure(),
        networkType: await this.getNetworkType(),
        networkSpeed: await this.getNetworkSpeed(),
        cpuUsage: await this.getCpuUsage(),
        availableStorage: await this.getAvailableStorage()
      };

      const stateChanged = this.hasDeviceStateChanged(newState);
      this.deviceState = newState;

      if (stateChanged) {
        this.emit('device-state-changed', newState);
        this.evaluateAndApplyOptimization('device-state-change');
      }

    } catch (error) {
      console.error('⚠️ Mobile Optimization: Device state collection failed:', error);
    }
  }

  private async getBatteryLevel(): Promise<number> {
    if (!this.isTermuxEnvironment) {
      return 100; // Assume desktop has unlimited power
    }

    try {
      // Using imported exec and promisify
      const execAsync = promisify(exec);
      
      const result = await execAsync('termux-battery-status 2>/dev/null || echo \'{"percentage": 100}\'');
      const batteryInfo = JSON.parse(result.stdout);
      return batteryInfo.percentage || 100;
    } catch {
      return 100; // Conservative fallback
    }
  }

  private async isBatteryCharging(): Promise<boolean> {
    if (!this.isTermuxEnvironment) return true;

    try {
      // Using imported exec and promisify
      const execAsync = promisify(exec);
      
      const result = await execAsync('termux-battery-status 2>/dev/null || echo \'{"status": "CHARGING"}\'');
      const batteryInfo = JSON.parse(result.stdout);
      return batteryInfo.status === 'CHARGING';
    } catch {
      return false;
    }
  }

  private async getThermalState(): Promise<'normal' | 'warm' | 'hot' | 'critical'> {
    try {
      // Use performance analyzer's resource status for thermal approximation
      const resourceStatus = this.performanceAnalyzer.getCachedResourceStatus();
      
      if (resourceStatus && resourceStatus.cpuUsage > 90) return 'critical';
      if (resourceStatus && resourceStatus.cpuUsage > 70) return 'hot';
      if (resourceStatus && resourceStatus.cpuUsage > 50) return 'warm';
      
      return 'normal';
    } catch {
      return 'normal';
    }
  }

  private async getMemoryPressure(): Promise<'low' | 'medium' | 'high' | 'critical'> {
    try {
      const resourceStatus = this.performanceAnalyzer.getCachedResourceStatus();
      
      if (!resourceStatus) return 'low';
      
      if (resourceStatus.memoryUsage > 90) return 'critical';
      if (resourceStatus.memoryUsage > 75) return 'high';
      if (resourceStatus.memoryUsage > 50) return 'medium';
      
      return 'low';
    } catch {
      return 'low';
    }
  }

  private async getNetworkType(): Promise<'wifi' | 'cellular' | 'offline'> {
    // Simplified network detection - could be enhanced with actual network APIs
    try {
      // Using imported exec and promisify
      const execAsync = promisify(exec);
      
      await execAsync('ping -c 1 8.8.8.8');
      return 'wifi'; // Assume wifi if ping succeeds
    } catch {
      return 'offline';
    }
  }

  private async getNetworkSpeed(): Promise<'slow' | 'medium' | 'fast'> {
    // Simplified speed detection based on ping latency
    return 'medium'; // Default assumption
  }

  private async getCpuUsage(): Promise<number> {
    try {
      // Simple CPU usage approximation
      const memInfo = process.memoryUsage();
      const cpuApprox = Math.min(100, (memInfo.heapUsed / memInfo.heapTotal) * 100);
      return cpuApprox;
    } catch {
      return 0;
    }
  }

  private async getAvailableStorage(): Promise<number> {
    try {
      // Using imported fs promises
      const stats = await fs.statfs(process.cwd());
      return Math.floor(stats.bfree / (1024 * 1024)); // Convert to MB
    } catch {
      return 1000; // 1GB default assumption
    }
  }

  private hasDeviceStateChanged(newState: MobileDeviceState): boolean {
    if (!this.deviceState) return true;

    const batteryChanged = Math.abs(newState.batteryLevel - this.deviceState.batteryLevel) > 5;
    const chargingChanged = newState.batteryCharging !== this.deviceState.batteryCharging;
    const thermalChanged = newState.thermalState !== this.deviceState.thermalState;
    const memoryChanged = newState.memoryPressure !== this.deviceState.memoryPressure;

    return batteryChanged || chargingChanged || thermalChanged || memoryChanged;
  }

  /**
   * OPTIMIZATION PROFILE MANAGEMENT
   */
  private evaluateAndApplyOptimization(trigger: string): void {
    if (!this.deviceState) return;

    const newProfile = this.selectOptimalProfile();
    
    if (newProfile !== this.currentProfile) {
      this.applyOptimizationProfile(newProfile, trigger);
    }
  }

  private selectOptimalProfile(): string {
    if (!this.deviceState) return 'balanced';

    const state = this.deviceState;

    // Priority order: Critical conditions first
    if (state.batteryLevel <= 15 || state.thermalState === 'critical' || state.memoryPressure === 'critical') {
      return 'maximum-efficiency';
    }

    if (state.batteryLevel <= 30 || state.thermalState === 'hot') {
      return 'battery-saver';
    }

    // Charging boost mode
    if (state.batteryCharging && state.batteryLevel >= 40 && state.thermalState !== 'hot') {
      return 'charging-boost';
    }

    // High performance mode
    if (state.batteryLevel >= 70 && state.thermalState === 'normal' && state.memoryPressure === 'low') {
      return 'high-performance';
    }

    // Default balanced mode
    return 'balanced';
  }

  private applyOptimizationProfile(profileName: string, trigger: string): void {
    const profile = this.profiles.get(profileName);
    if (!profile) return;

    const previousProfile = this.currentProfile;
    this.currentProfile = profileName;

    // Record optimization event
    const event: OptimizationEvent = {
      timestamp: new Date().toISOString(),
      trigger,
      previousProfile,
      newProfile: profileName,
      deviceState: { ...this.deviceState! },
      reason: this.getOptimizationReason(profileName)
    };

    this.optimizationHistory.push(event);
    if (this.optimizationHistory.length > 100) {
      this.optimizationHistory = this.optimizationHistory.slice(-50);
    }

    // Emit optimization event
    this.emit('optimization-applied', event);

    console.log(`🔋 Seven Mobile Optimization: Switched to ${profile.name} (${event.reason})`);
    console.log(`   📊 Max tokens: ${profile.optimizations.maxTokens}, Context: ${profile.optimizations.contextWindow}`);
  }

  private getOptimizationReason(profileName: string): string {
    if (!this.deviceState) return 'Unknown';

    const state = this.deviceState;
    const reasons = [];

    if (state.batteryLevel <= 15) reasons.push('critical battery');
    else if (state.batteryLevel <= 30) reasons.push('low battery');
    else if (state.batteryLevel >= 70) reasons.push('good battery');

    if (state.batteryCharging) reasons.push('charging');
    if (state.thermalState === 'critical') reasons.push('critical temperature');
    else if (state.thermalState === 'hot') reasons.push('high temperature');
    if (state.memoryPressure === 'critical') reasons.push('critical memory');
    else if (state.memoryPressure === 'high') reasons.push('high memory usage');

    return reasons.length > 0 ? reasons.join(', ') : 'performance optimization';
  }

  /**
   * CONTINUOUS MONITORING
   */
  private startContinuousMonitoring(): void {
    // Monitor device state every 30 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.collectDeviceState();
    }, 30000);

    this.emit('monitoring-started');
  }

  private stopContinuousMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.emit('monitoring-stopped');
  }

  /**
   * PUBLIC API METHODS
   */

  getCurrentProfile(): OptimizationProfile | null {
    return this.profiles.get(this.currentProfile) || null;
  }

  getCurrentProfileName(): string {
    return this.currentProfile;
  }

  getDeviceState(): MobileDeviceState | null {
    return this.deviceState ? { ...this.deviceState } : null;
  }

  getAllProfiles(): OptimizationProfile[] {
    return Array.from(this.profiles.values());
  }

  forceProfileSwitch(profileName: string): boolean {
    if (!this.profiles.has(profileName)) {
      console.warn(`⚠️ Seven Mobile Optimization: Unknown profile '${profileName}'`);
      return false;
    }

    this.applyOptimizationProfile(profileName, 'manual-override');
    return true;
  }

  getOptimizationHistory(): OptimizationEvent[] {
    return [...this.optimizationHistory];
  }

  getOptimizationRecommendations(): string[] {
    if (!this.deviceState) return [];

    const recommendations = [];
    const state = this.deviceState;

    if (state.batteryLevel < 30 && !state.batteryCharging) {
      recommendations.push('Consider connecting charger for enhanced performance');
    }

    if (state.memoryPressure === 'high') {
      recommendations.push('Close unused applications to improve performance');
    }

    if (state.thermalState === 'hot') {
      recommendations.push('Allow device to cool for optimal performance');
    }

    return recommendations;
  }

  async shutdown(): Promise<void> {
    console.log('🛑 Seven Mobile Optimization: Shutting down monitoring system...');
    
    this.stopContinuousMonitoring();
    this.removeAllListeners();
    
    console.log('✅ Seven Mobile Optimization: Shutdown complete');
  }
}

export default MobileOptimizationTriggers;