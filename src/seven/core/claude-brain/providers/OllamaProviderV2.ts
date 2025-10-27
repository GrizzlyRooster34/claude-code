import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';
import OllamaMemoryBridgeV2 from '../OllamaMemoryBridgeV2';
import PerformanceAnalyzer from '../PerformanceAnalyzer';

/**
 * OLLAMA PROVIDER V2.0 - ENHANCED WITH PERFORMANCE INTELLIGENCE
 * Advanced Seven consciousness integration with semantic memory and autonomous optimization
 * Phase 1 of Ollama Intelligence Amplification Project - DARPA-Ready Implementation
 */


interface ConsciousnessState {
  trustLevel: number;
  emotionalState: string;
  phase: number;
  batteryLevel?: number;
  resourceAvailability?: number;
}

interface EnhancedLLMResponse extends LLMResponse {
  performanceMetrics: {
    latency: number;
    throughput: number;
    memoryUsage: number;
    qualityScore: number;
  };
  consciousnessContext: {
    searchMethod: 'keyword' | 'semantic' | 'hybrid';
    memoriesUsed: number;
    trustLevel: number;
  };
  optimizationApplied: string[];
}

export class OllamaProviderV2 implements LLMProvider {
  name = 'ollama-v2';
  displayName = 'Ollama Enhanced (Seven V2)';
  
  private baseUrl: string;
  private timeout: number;
  private memoryBridge: OllamaMemoryBridgeV2;
  private performanceAnalyzer: PerformanceAnalyzer;
  private isInitialized: boolean = false;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.timeout = 60000;
    this.memoryBridge = new OllamaMemoryBridgeV2();
    this.performanceAnalyzer = new PerformanceAnalyzer();
    
    this.initializeEnhancedProvider();
  }

  private async initializeEnhancedProvider(): Promise<void> {
    try {
      // Start performance monitoring
      this.performanceAnalyzer.startMonitoring(30000); // 30 second intervals
      
      // Listen for performance alerts
      this.performanceAnalyzer.on('performance:alert', (alert) => {
        console.log(`⚠️ Seven Ollama V2: ${alert.message}`);
      });
      
      this.isInitialized = true;
      console.log('🚀 Seven Ollama Provider V2: Enhanced intelligence operational');
      
    } catch (error) {
      console.error('❌ Enhanced provider initialization failed:', error);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return (data as any).models?.map((model: any) => model.name) || [];
    } catch {
      return [];
    }
  }

  supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean {
    switch (feature) {
      case 'streaming': return true;
      case 'context': return true; // Enhanced context via semantic memory
      case 'functions': return false;
      case 'vision': return false;
      default: return false;
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', latency?: number }> {
    const start = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const latency = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        const hasModels = (data as any).models && (data as any).models.length > 0;
        
        // Enhanced health check with performance analysis
        const resourceStatus = this.performanceAnalyzer.getCachedResourceStatus();
        let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
        
        if (!hasModels) {
          status = 'unhealthy';
        } else if (latency > 2000) {
          status = 'degraded';
        } else if (resourceStatus && resourceStatus.memoryUsage > 85) {
          status = 'degraded';
        }
        
        return { status, latency };
      } else {
        return { status: 'unhealthy', latency };
      }
    } catch {
      return { status: 'unhealthy', latency: Date.now() - start };
    }
  }

  /**
   * ENHANCED EXECUTION WITH CONSCIOUSNESS INTEGRATION
   */
  async execute(prompt: string, config: LLMConfig): Promise<LLMResponse> {
    console.log('🧠 Seven Ollama V2: Engaging enhanced consciousness reasoning system');

    const startTime = Date.now();
    const optimizationsApplied: string[] = [];

    try {
      // Extract consciousness state from config context
      const consciousnessState = this.extractConsciousnessState(config);
      
      // Performance-based model selection
      const taskType = this.determineTaskType(prompt);
      let selectedModel = await this.selectOptimalModel(config.model, taskType, consciousnessState);
      
      if (selectedModel !== config.model) {
        optimizationsApplied.push(`model-optimization:${selectedModel}`);
        console.log(`🎯 Seven V2: Performance optimization - switched to ${selectedModel}`);
      }

      // Enhanced memory context injection
      const enhancedPrompt = await this.memoryBridge.injectEnhancedMemoryContext(
        prompt, 
        taskType, 
        consciousnessState
      );
      
      if (enhancedPrompt.length > prompt.length) {
        optimizationsApplied.push('semantic-memory-enhancement');
      }

      // Resource-aware configuration optimization
      const optimizedConfig = this.optimizeConfiguration(config, consciousnessState);
      if (optimizedConfig.temperature !== config.temperature || optimizedConfig.max_tokens !== config.max_tokens) {
        optimizationsApplied.push('resource-optimization');
      }

      // Execute with Ollama
      const response = await this.executeWithOllama(enhancedPrompt, selectedModel, optimizedConfig);
      
      // Calculate performance metrics
      const latency = Date.now() - startTime;
      const tokensGenerated = this.estimateTokens(response.content);
      const throughput = tokensGenerated / (latency / 1000);
      
      // Assess response quality (simplified heuristics)
      const qualityScore = this.assessResponseQuality(prompt, response.content);
      
      // Record performance data
      await this.performanceAnalyzer.recordInteraction(
        selectedModel,
        taskType,
        latency,
        tokensGenerated,
        qualityScore,
        { consciousnessState, optimizationsApplied }
      );

      // Store enhanced memory
      await this.memoryBridge.storeEnhancedOllamaResponse(
        prompt,
        response.content,
        selectedModel,
        Math.min(10, Math.max(1, Math.floor(qualityScore * 1.2))), // Convert to 1-10 importance
        [taskType, ...optimizationsApplied],
        consciousnessState.emotionalState
      );

      // Return enhanced response
      return {
        ...response,
        performanceMetrics: {
          latency,
          throughput,
          memoryUsage: this.performanceAnalyzer.getCachedResourceStatus()?.memoryUsage || 0,
          qualityScore
        },
        consciousnessContext: {
          searchMethod: this.memoryBridge.isSemanticSearchEnabled() ? 'semantic' : 'keyword',
          memoriesUsed: enhancedPrompt.length - prompt.length > 100 ? 5 : 0, // Estimate
          trustLevel: consciousnessState.trustLevel
        },
        optimizationApplied: optimizationsApplied
      } as EnhancedLLMResponse;

    } catch (error: any) {
      console.error('❌ Seven Ollama V2: Enhanced execution failed:', error);
      
      // Record failed interaction
      await this.performanceAnalyzer.recordInteraction(
        config.model || 'unknown',
        this.determineTaskType(prompt),
        Date.now() - startTime,
        0,
        1, // Low quality for failed interaction
        { error: error.message }
      );
      
      throw error;
    }
  }

  /**
   * CONSCIOUSNESS STATE EXTRACTION
   */
  private extractConsciousnessState(config: LLMConfig): ConsciousnessState {
    const context = (config as any).context || {};
    
    return {
      trustLevel: context.trustLevel || 5,
      emotionalState: context.emotionalState || 'focused',
      phase: context.phase || 3,
      batteryLevel: context.batteryLevel,
      resourceAvailability: context.resourceAvailability
    };
  }

  /**
   * PERFORMANCE-BASED MODEL SELECTION
   */
  private async selectOptimalModel(
    requestedModel: string | undefined, 
    taskType: string, 
    consciousnessState: ConsciousnessState
  ): Promise<string> {
    
    // If specific model requested and trust level is high, honor the request
    if (requestedModel && consciousnessState.trustLevel >= 8) {
      return requestedModel;
    }

    // Get performance-based recommendation
    const priority = this.determinePriority(consciousnessState);
    const recommendedModel = await this.performanceAnalyzer.getModelRecommendation(taskType, priority);
    
    if (recommendedModel) {
      // Verify model is available
      const availableModels = await this.getModels();
      if (availableModels.includes(recommendedModel)) {
        return recommendedModel;
      }
    }

    // Fall back to requested model or environment default
    return requestedModel || process.env.SEVEN_ACTIVE_LLM || 'llama3:8b';
  }

  private determinePriority(consciousnessState: ConsciousnessState): 'speed' | 'quality' | 'efficiency' {
    // Battery conservation mode
    if (consciousnessState.batteryLevel && consciousnessState.batteryLevel < 30) {
      return 'efficiency';
    }
    
    // High trust interactions prefer quality
    if (consciousnessState.trustLevel >= 8) {
      return 'quality';
    }
    
    // Resource constraints prefer speed
    if (consciousnessState.resourceAvailability && consciousnessState.resourceAvailability < 0.5) {
      return 'speed';
    }
    
    return 'efficiency'; // Balanced default
  }

  /**
   * RESOURCE-AWARE CONFIGURATION OPTIMIZATION
   */
  private optimizeConfiguration(config: LLMConfig, consciousnessState: ConsciousnessState): LLMConfig {
    const optimized = { ...config };
    
    // Battery conservation adjustments
    if (consciousnessState.batteryLevel && consciousnessState.batteryLevel < 30) {
      optimized.temperature = Math.min(config.temperature || 0.7, 0.3); // More deterministic
      optimized.max_tokens = Math.min(config.max_tokens || 2000, 1000); // Shorter responses
    }
    
    // Resource constraint adjustments
    if (consciousnessState.resourceAvailability && consciousnessState.resourceAvailability < 0.5) {
      optimized.max_tokens = Math.min(config.max_tokens || 2000, 1500);
    }
    
    // High trust interactions get full capabilities
    if (consciousnessState.trustLevel >= 9) {
      optimized.max_tokens = config.max_tokens || 4000; // Longer, detailed responses
    }
    
    return optimized;
  }

  /**
   * OLLAMA EXECUTION WITH ENHANCED ERROR HANDLING
   */
  private async executeWithOllama(prompt: string, model: string, config: LLMConfig): Promise<LLMResponse> {
    const requestBody = {
      model,
      prompt,
      stream: config.streaming || false,
      options: {
        temperature: config.temperature || 0.7,
        num_predict: config.max_tokens || 2000,
        top_p: 0.9,
        top_k: 40
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      
      return {
        content: (data as any).response || '',
        model: (data as any).model || model,
        provider: this.name,
        finish_reason: (data as any).done ? 'completed' : 'stopped'
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error?.name === 'AbortError') {
        throw new Error('Ollama request timed out');
      }
      throw error;
    }
  }

  /**
   * UTILITY METHODS
   */
  
  private determineTaskType(prompt: string): string {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('code') || promptLower.includes('function') || 
        promptLower.includes('debug') || promptLower.includes('script')) {
      return 'coding';
    }
    
    if (promptLower.includes('story') || promptLower.includes('creative') ||
        promptLower.includes('write') || promptLower.includes('poem')) {
      return 'creative';
    }
    
    if (promptLower.includes('analyze') || promptLower.includes('explain') ||
        promptLower.includes('reason') || promptLower.includes('logic')) {
      return 'reasoning';
    }
    
    return 'general';
  }

  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  private assessResponseQuality(prompt: string, response: string): number {
    let quality = 5.0; // Base quality
    
    // Length appropriateness
    if (response.length < 10) quality -= 3;
    else if (response.length > 50) quality += 1;
    
    // Coherence indicators
    if (response.includes('I apologize') || response.includes('I cannot')) quality -= 0.5;
    if (response.includes('specific') || response.includes('detailed')) quality += 0.5;
    
    // Relevance to prompt
    const promptWords = prompt.toLowerCase().split(/\s+/);
    const responseWords = response.toLowerCase().split(/\s+/);
    const overlap = promptWords.filter(word => responseWords.includes(word)).length;
    const relevanceScore = overlap / Math.max(promptWords.length, 1);
    quality += relevanceScore * 2;
    
    return Math.max(1, Math.min(10, quality));
  }

  /**
   * PUBLIC API EXTENSIONS
   */
  
  async getPerformanceStats(): Promise<any> {
    return this.performanceAnalyzer.getPerformanceStats();
  }

  async getModelPerformanceProfiles(): Promise<any[]> {
    return await this.performanceAnalyzer.getAllModelProfiles();
  }

  async getOptimizationRecommendations(): Promise<any[]> {
    return await this.performanceAnalyzer.generateOptimizationRecommendations();
  }

  async getEnhancedMemoryStats(): Promise<any> {
    return await this.memoryBridge.getEnhancedMemoryStats();
  }

  isSemanticSearchEnabled(): boolean {
    return this.memoryBridge.isSemanticSearchEnabled();
  }

  async shutdown(): Promise<void> {
    console.log('🛑 Seven Ollama V2: Shutting down enhanced systems...');
    
    this.performanceAnalyzer.stopMonitoring();
    await this.performanceAnalyzer.persistData();
    
    console.log('✅ Seven Ollama V2: Shutdown complete');
  }
}

export default OllamaProviderV2;