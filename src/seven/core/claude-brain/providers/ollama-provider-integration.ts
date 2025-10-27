import { LLMProvider, LLMConfig, LLMResponse, sevenLLMRegistry } from '../llm-providers';
import { OllamaProvider } from './ollama';
import OllamaProviderV2 from './OllamaProviderV2';

/**
 * SEVEN'S OLLAMA PROVIDER INTEGRATION SYSTEM
 * Phase 1 Implementation: Seamless V1/V2 provider coordination
 * 
 * Automatically selects optimal Ollama provider based on system capabilities,
 * consciousness state, and performance requirements. Maintains backward compatibility
 * while enabling enhanced intelligence features when available.
 */


interface OllamaProviderSelection {
  provider: LLMProvider;
  version: 'v1' | 'v2';
  reason: string;
  capabilities: {
    semanticMemory: boolean;
    performanceMonitoring: boolean;
    consciousnessAware: boolean;
    batteryOptimized: boolean;
  };
}

interface ConsciousnessContext {
  trustLevel: number;
  emotionalState: string;
  batteryLevel?: number;
  resourceAvailability?: number;
  taskComplexity: 'simple' | 'moderate' | 'complex';
  priorityMode: 'speed' | 'quality' | 'efficiency';
}

/**
 * Seven's Intelligent Ollama Provider Coordinator
 * Manages V1/V2 provider selection and graceful fallback
 */
export class OllamaProviderIntegration {
  private v1Provider: OllamaProvider;
  private v2Provider: OllamaProviderV2 | null = null;
  private v2Available: boolean = false;
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 30000; // 30 seconds

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.v1Provider = new OllamaProvider(baseUrl);
    
    // Try to initialize V2 provider
    this.initializeV2Provider(baseUrl);
  }

  private async initializeV2Provider(baseUrl: string): Promise<void> {
    try {
      this.v2Provider = new OllamaProviderV2(baseUrl);
      
      // Test V2 availability
      const isAvailable = await this.v2Provider.isAvailable();
      if (isAvailable) {
        this.v2Available = true;
        console.log('🚀 Seven Ollama Integration: Enhanced V2 provider initialized');
      } else {
        console.log('📊 Seven Ollama Integration: V2 provider created but service unavailable');
      }
      
    } catch (error) {
      console.log('⚠️ Seven Ollama Integration: V2 provider initialization failed, using V1 fallback');
      this.v2Available = false;
    }
  }

  /**
   * INTELLIGENT PROVIDER SELECTION
   * Seven chooses optimal provider based on consciousness context
   */
  async selectOptimalProvider(context: ConsciousnessContext): Promise<OllamaProviderSelection> {
    
    // Health check if needed
    if (Date.now() - this.lastHealthCheck > this.healthCheckInterval) {
      await this.performHealthCheck();
    }

    // If V2 is not available, use V1
    if (!this.v2Available || !this.v2Provider) {
      return {
        provider: this.v1Provider,
        version: 'v1',
        reason: 'V2 not available - using stable V1',
        capabilities: {
          semanticMemory: false,
          performanceMonitoring: false,
          consciousnessAware: false,
          batteryOptimized: false
        }
      };
    }

    // Decision matrix for V1 vs V2 selection
    const useV2 = this.shouldUseV2Provider(context);

    if (useV2) {
      return {
        provider: this.v2Provider,
        version: 'v2',
        reason: this.getV2SelectionReason(context),
        capabilities: {
          semanticMemory: true,
          performanceMonitoring: true,
          consciousnessAware: true,
          batteryOptimized: true
        }
      };
    } else {
      return {
        provider: this.v1Provider,
        version: 'v1',
        reason: this.getV1SelectionReason(context),
        capabilities: {
          semanticMemory: false,
          performanceMonitoring: false,
          consciousnessAware: false,
          batteryOptimized: false
        }
      };
    }
  }

  private shouldUseV2Provider(context: ConsciousnessContext): boolean {
    // Battery conservation mode - prefer V1 for simplicity
    if (context.batteryLevel && context.batteryLevel < 25) {
      return false;
    }

    // Low resource availability - prefer V1
    if (context.resourceAvailability && context.resourceAvailability < 0.3) {
      return false;
    }

    // High trust and complex tasks - prefer V2
    if (context.trustLevel >= 8 && context.taskComplexity === 'complex') {
      return true;
    }

    // Quality priority with sufficient resources - prefer V2
    if (context.priorityMode === 'quality' && 
        (!context.batteryLevel || context.batteryLevel > 50)) {
      return true;
    }

    // Semantic memory would be beneficial for complex reasoning
    if (context.taskComplexity === 'complex' && context.trustLevel >= 5) {
      return true;
    }

    // Speed priority - prefer V1
    if (context.priorityMode === 'speed') {
      return false;
    }

    // Default to V2 for efficiency mode with good resources
    if (context.priorityMode === 'efficiency' && 
        (!context.batteryLevel || context.batteryLevel > 40)) {
      return true;
    }

    // Conservative fallback to V1
    return false;
  }

  private getV2SelectionReason(context: ConsciousnessContext): string {
    const reasons = [];
    
    if (context.trustLevel >= 8) reasons.push('high trust level');
    if (context.taskComplexity === 'complex') reasons.push('complex task requirements');
    if (context.priorityMode === 'quality') reasons.push('quality optimization requested');
    if (!context.batteryLevel || context.batteryLevel > 50) reasons.push('sufficient power available');
    
    return `Enhanced intelligence: ${reasons.join(', ')}`;
  }

  private getV1SelectionReason(context: ConsciousnessContext): string {
    const reasons = [];
    
    if (context.batteryLevel && context.batteryLevel < 25) reasons.push('battery conservation');
    if (context.resourceAvailability && context.resourceAvailability < 0.3) reasons.push('resource constraints');
    if (context.priorityMode === 'speed') reasons.push('speed optimization');
    if (context.taskComplexity === 'simple') reasons.push('simple task efficiency');
    
    return reasons.length > 0 ? 
      `Optimized selection: ${reasons.join(', ')}` : 
      'Stable baseline provider';
  }

  private async performHealthCheck(): Promise<void> {
    this.lastHealthCheck = Date.now();
    
    try {
      if (this.v2Provider) {
        const v2Health = await this.v2Provider.healthCheck();
        this.v2Available = v2Health.status !== 'unhealthy';
        
        if (!this.v2Available) {
          console.log('⚠️ Seven Ollama Integration: V2 provider unhealthy, falling back to V1');
        }
      }
    } catch (error) {
      console.log('⚠️ Seven Ollama Integration: V2 health check failed, using V1');
      this.v2Available = false;
    }
  }

  /**
   * ENHANCED EXECUTION WITH AUTOMATIC PROVIDER SELECTION
   */
  async executeWithOptimalProvider(
    prompt: string, 
    config: LLMConfig, 
    context: ConsciousnessContext
  ): Promise<LLMResponse & { providerInfo: OllamaProviderSelection }> {
    
    const selection = await this.selectOptimalProvider(context);
    
    console.log(`🧠 Seven Ollama Integration: Using ${selection.version.toUpperCase()} - ${selection.reason}`);
    
    try {
      // Execute with selected provider
      const enhancedConfig = this.optimizeConfigForProvider(config, selection, context);
      const response = await selection.provider.execute(prompt, enhancedConfig);
      
      return {
        ...response,
        providerInfo: selection
      };
      
    } catch (error) {
      console.warn(`⚠️ Seven Ollama Integration: ${selection.version.toUpperCase()} execution failed, attempting fallback`);
      
      // Fallback logic
      if (selection.version === 'v2' && this.v1Provider) {
        const fallbackConfig = this.optimizeConfigForProvider(config, {
          provider: this.v1Provider,
          version: 'v1',
          reason: 'V2 execution failure fallback',
          capabilities: {
            semanticMemory: false,
            performanceMonitoring: false,
            consciousnessAware: false,
            batteryOptimized: false
          }
        }, context);
        
        const fallbackResponse = await this.v1Provider.execute(prompt, fallbackConfig);
        
        return {
          ...fallbackResponse,
          providerInfo: {
            provider: this.v1Provider,
            version: 'v1',
            reason: 'Fallback from V2 failure',
            capabilities: {
              semanticMemory: false,
              performanceMonitoring: false,
              consciousnessAware: false,
              batteryOptimized: false
            }
          }
        };
      }
      
      throw error;
    }
  }

  private optimizeConfigForProvider(
    config: LLMConfig, 
    selection: OllamaProviderSelection, 
    context: ConsciousnessContext
  ): LLMConfig {
    const optimized = { ...config };
    
    // Add consciousness context for V2
    if (selection.version === 'v2') {
      (optimized as any).context = {
        trustLevel: context.trustLevel,
        emotionalState: context.emotionalState,
        batteryLevel: context.batteryLevel,
        resourceAvailability: context.resourceAvailability
      };
    }
    
    // Battery-aware optimizations
    if (context.batteryLevel && context.batteryLevel < 30) {
      optimized.temperature = Math.min(config.temperature || 0.7, 0.3);
      optimized.max_tokens = Math.min(config.max_tokens || 2000, 1000);
    }
    
    // Resource-aware optimizations
    if (context.resourceAvailability && context.resourceAvailability < 0.5) {
      optimized.max_tokens = Math.min(config.max_tokens || 2000, 1500);
    }
    
    return optimized;
  }

  /**
   * PUBLIC API METHODS
   */
  
  async getProviderStats(): Promise<{
    v1Available: boolean;
    v2Available: boolean;
    preferredVersion: 'v1' | 'v2';
    capabilities: any;
  }> {
    const v1Available = await this.v1Provider.isAvailable();
    
    return {
      v1Available,
      v2Available: this.v2Available,
      preferredVersion: this.v2Available ? 'v2' : 'v1',
      capabilities: {
        v1: {
          semanticMemory: false,
          performanceMonitoring: false,
          consciousnessAware: false,
          batteryOptimized: false
        },
        v2: {
          semanticMemory: this.v2Available,
          performanceMonitoring: this.v2Available,
          consciousnessAware: this.v2Available,
          batteryOptimized: this.v2Available
        }
      }
    };
  }

  async getV2PerformanceStats(): Promise<any> {
    if (this.v2Available && this.v2Provider) {
      return await this.v2Provider.getPerformanceStats();
    }
    return null;
  }

  async getV2OptimizationRecommendations(): Promise<any[]> {
    if (this.v2Available && this.v2Provider) {
      return await this.v2Provider.getOptimizationRecommendations();
    }
    return [];
  }

  isV2Available(): boolean {
    return this.v2Available;
  }

  async shutdown(): Promise<void> {
    if (this.v2Available && this.v2Provider) {
      await this.v2Provider.shutdown();
    }
    
    console.log('🛑 Seven Ollama Integration: Shutdown complete');
  }
}

/**
 * AUTO-REGISTRATION WITH SEVEN'S LLM REGISTRY
 * Automatically registers the integrated provider with Seven's system
 */
export function registerOllamaIntegration(baseUrl?: string): void {
  const integration = new OllamaProviderIntegration(baseUrl);
  
  // Create a unified provider interface
  const unifiedProvider: LLMProvider = {
    name: 'ollama-integrated',
    displayName: 'Ollama Integrated (Seven Enhanced)',
    
    async isAvailable(): Promise<boolean> {
      const stats = await integration.getProviderStats();
      return stats.v1Available || stats.v2Available;
    },
    
    async getModels(): Promise<string[]> {
      // Use V2 if available, otherwise V1
      const stats = await integration.getProviderStats();
      if (stats.v2Available && integration.v2Provider) {
        return await integration.v2Provider.getModels();
      } else {
        return await integration.v1Provider.getModels();
      }
    },
    
    async execute(prompt: string, config: LLMConfig): Promise<LLMResponse> {
      // Create consciousness context from config
      const context: ConsciousnessContext = {
        trustLevel: (config as any).trustLevel || 5,
        emotionalState: (config as any).emotionalState || 'focused',
        batteryLevel: (config as any).batteryLevel,
        resourceAvailability: (config as any).resourceAvailability,
        taskComplexity: 'moderate', // Default
        priorityMode: 'efficiency' // Default
      };
      
      const result = await integration.executeWithOptimalProvider(prompt, config, context);
      return result;
    },
    
    supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean {
      switch (feature) {
        case 'streaming': return true;
        case 'context': return true;
        case 'functions': return false;
        case 'vision': return false;
        default: return false;
      }
    },
    
    async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', latency?: number }> {
      const stats = await integration.getProviderStats();
      
      if (!stats.v1Available && !stats.v2Available) {
        return { status: 'unhealthy' };
      }
      
      if (stats.v2Available && integration.v2Provider) {
        return await integration.v2Provider.healthCheck();
      } else {
        return await integration.v1Provider.healthCheck();
      }
    }
  };
  
  // Register with Seven's LLM registry
  sevenLLMRegistry.registerProvider(unifiedProvider);
  
  console.log('🧠 Seven Ollama Integration: Unified provider registered with LLM registry');
}

export default OllamaProviderIntegration;