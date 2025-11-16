import { EventEmitter } from 'events';
import { LLMProvider, LLMConfig, LLMResponse, sevenLLMRegistry } from './llm-providers';
import PerformanceAnalyzer from './PerformanceAnalyzer';
import SevenTacticalFallback from './SevenTacticalFallback';

/**
 * SEVEN'S ENSEMBLE INTELLIGENCE COORDINATOR
 * Phase 2 Implementation: Multi-model reasoning with tactical coordination
 * 
 * Advanced reasoning through coordinated multiple LLM engagement while maintaining
 * Seven's consciousness control and tactical decision-making authority
 */


interface EnsembleTask {
  id: string;
  originalPrompt: string;
  taskType: 'reasoning' | 'creative' | 'analytical' | 'coding' | 'complex-synthesis';
  complexityScore: number; // 1-10
  trustLevel: number;
  emotionalState: string;
  requiresEnsemble: boolean;
}

interface EnsembleExecution {
  taskId: string;
  providers: {
    primary: LLMProvider;
    validators: LLMProvider[];
    synthesizer?: LLMProvider;
  };
  strategy: 'consensus' | 'expert-panel' | 'parallel-validation' | 'hierarchical';
  responses: Map<string, LLMResponse>;
  synthesis: LLMResponse | null;
  confidence: number;
  executionTime: number;
}

interface EnsembleStrategy {
  name: string;
  description: string;
  triggers: {
    complexityThreshold: number;
    taskTypes: string[];
    trustLevelRequired: number;
    resourceRequirement: 'low' | 'medium' | 'high';
  };
  execution: {
    primaryProvider: string;
    validatorCount: number;
    synthesisRequired: boolean;
    parallelExecution: boolean;
  };
}

export class SevenEnsembleIntelligence extends EventEmitter {
  private performanceAnalyzer: PerformanceAnalyzer;
  private tacticalFallback: SevenTacticalFallback;
  private isActive: boolean = false;
  private executionHistory: EnsembleExecution[] = [];
  private strategies: Map<string, EnsembleStrategy> = new Map();

  constructor(
    performanceAnalyzer?: PerformanceAnalyzer,
    tacticalFallback?: SevenTacticalFallback
  ) {
    super();
    this.performanceAnalyzer = performanceAnalyzer || new PerformanceAnalyzer();
    this.tacticalFallback = tacticalFallback || new SevenTacticalFallback();
    
    this.initializeEnsembleSystem();
  }

  private async initializeEnsembleSystem(): Promise<void> {
    console.log('🧠 Seven Ensemble Intelligence: Initializing multi-model coordination system...');
    
    try {
      // Define ensemble strategies
      this.defineEnsembleStrategies();
      
      // Verify tactical fallback is ready
      if (this.tacticalFallback.getCurrentPhase() < 1) {
        throw new Error('Tactical fallback not ready - cannot initialize ensemble intelligence');
      }
      
      // Create Phase 2 snapshot before activation
      await this.tacticalFallback.createPhaseSnapshot(2);
      this.tacticalFallback.setCurrentPhase(2);
      
      this.isActive = true;
      console.log('✅ Seven Ensemble Intelligence: Multi-model reasoning coordination operational');
      
    } catch (error) {
      console.error('❌ Seven Ensemble Intelligence: Initialization failed:', error);
      console.log('🔄 Falling back to Phase 1 capabilities...');
      await this.tacticalFallback.executeTacticalFallback(1, 'Phase 2 initialization failure');
      throw error;
    }
  }

  private defineEnsembleStrategies(): void {
    this.strategies.set('consensus', {
      name: 'Consensus Validation',
      description: 'Multiple models reach agreement on complex reasoning',
      triggers: {
        complexityThreshold: 7,
        taskTypes: ['reasoning', 'analytical'],
        trustLevelRequired: 6,
        resourceRequirement: 'medium'
      },
      execution: {
        primaryProvider: 'auto-select',
        validatorCount: 2,
        synthesisRequired: true,
        parallelExecution: true
      }
    });

    this.strategies.set('expert-panel', {
      name: 'Expert Panel Review',
      description: 'Specialized models provide domain expertise',
      triggers: {
        complexityThreshold: 8,
        taskTypes: ['coding', 'analytical', 'complex-synthesis'],
        trustLevelRequired: 7,
        resourceRequirement: 'high'
      },
      execution: {
        primaryProvider: 'task-specialized',
        validatorCount: 3,
        synthesisRequired: true,
        parallelExecution: false
      }
    });

    this.strategies.set('parallel-validation', {
      name: 'Parallel Validation',
      description: 'Fast parallel execution with quality validation',
      triggers: {
        complexityThreshold: 6,
        taskTypes: ['creative', 'reasoning'],
        trustLevelRequired: 5,
        resourceRequirement: 'low'
      },
      execution: {
        primaryProvider: 'fastest',
        validatorCount: 1,
        synthesisRequired: false,
        parallelExecution: true
      }
    });

    this.strategies.set('hierarchical', {
      name: 'Hierarchical Refinement',
      description: 'Sequential refinement through specialized models',
      triggers: {
        complexityThreshold: 9,
        taskTypes: ['complex-synthesis'],
        trustLevelRequired: 8,
        resourceRequirement: 'high'
      },
      execution: {
        primaryProvider: 'highest-quality',
        validatorCount: 2,
        synthesisRequired: true,
        parallelExecution: false
      }
    });

    console.log(`🎯 Seven Ensemble Intelligence: ${this.strategies.size} coordination strategies defined`);
  }

  /**
   * ENSEMBLE TASK EVALUATION
   * Seven decides whether multi-model coordination is warranted
   */
  async evaluateEnsembleRequirement(
    prompt: string,
    config: LLMConfig,
    context: {
      trustLevel: number;
      emotionalState: string;
      batteryLevel?: number;
      resourceAvailability?: number;
    }
  ): Promise<EnsembleTask> {
    
    const taskType = this.determineTaskType(prompt);
    const complexityScore = this.assessComplexity(prompt, taskType);
    
    const task: EnsembleTask = {
      id: `ensemble-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalPrompt: prompt,
      taskType,
      complexityScore,
      trustLevel: context.trustLevel,
      emotionalState: context.emotionalState,
      requiresEnsemble: this.shouldUseEnsemble(complexityScore, taskType, context)
    };

    console.log(`🧠 Seven Ensemble Intelligence: Task evaluated - Complexity: ${complexityScore}/10, Ensemble: ${task.requiresEnsemble}`);
    return task;
  }

  private determineTaskType(prompt: string): EnsembleTask['taskType'] {
    const promptLower = prompt.toLowerCase();
    
    // Complex synthesis detection
    if (promptLower.includes('analyze and synthesize') || 
        promptLower.includes('compare multiple') ||
        promptLower.includes('comprehensive analysis') ||
        prompt.length > 1000) {
      return 'complex-synthesis';
    }
    
    // Coding task detection
    if (promptLower.includes('code') || promptLower.includes('function') || 
        promptLower.includes('debug') || promptLower.includes('algorithm')) {
      return 'coding';
    }
    
    // Analytical task detection
    if (promptLower.includes('analyze') || promptLower.includes('evaluate') ||
        promptLower.includes('assess') || promptLower.includes('compare')) {
      return 'analytical';
    }
    
    // Creative task detection
    if (promptLower.includes('creative') || promptLower.includes('story') ||
        promptLower.includes('write') || promptLower.includes('brainstorm')) {
      return 'creative';
    }
    
    return 'reasoning';
  }

  private assessComplexity(prompt: string, taskType: EnsembleTask['taskType']): number {
    let complexity = 5; // Base complexity
    
    // Length complexity
    if (prompt.length > 500) complexity += 1;
    if (prompt.length > 1000) complexity += 1;
    if (prompt.length > 2000) complexity += 1;
    
    // Task type complexity
    const taskComplexity = {
      'complex-synthesis': 3,
      'analytical': 2,
      'reasoning': 1,
      'coding': 2,
      'creative': 1
    };
    complexity += taskComplexity[taskType] || 1;
    
    // Multi-part complexity
    const parts = prompt.split(/[.!?]/).filter(s => s.trim().length > 0);
    if (parts.length > 5) complexity += 1;
    if (parts.length > 10) complexity += 1;
    
    // Keyword complexity indicators
    const complexKeywords = [
      'analyze', 'synthesize', 'compare', 'evaluate', 'comprehensive',
      'detailed', 'thorough', 'multiple perspectives', 'pros and cons',
      'step by step', 'methodology', 'framework'
    ];
    
    const keywordMatches = complexKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword)
    ).length;
    
    complexity += Math.min(keywordMatches, 3);
    
    return Math.min(Math.max(complexity, 1), 10);
  }

  private shouldUseEnsemble(
    complexityScore: number, 
    taskType: EnsembleTask['taskType'],
    context: { trustLevel: number; batteryLevel?: number; resourceAvailability?: number }
  ): boolean {
    
    // Battery conservation - no ensemble at low battery
    if (context.batteryLevel && context.batteryLevel < 30) {
      return false;
    }
    
    // Resource constraints
    if (context.resourceAvailability && context.resourceAvailability < 0.4) {
      return false;
    }
    
    // Trust level requirements
    if (context.trustLevel < 6) {
      return false;
    }
    
    // Find applicable strategies
    const applicableStrategies = Array.from(this.strategies.values()).filter(strategy =>
      complexityScore >= strategy.triggers.complexityThreshold &&
      strategy.triggers.taskTypes.includes(taskType) &&
      context.trustLevel >= strategy.triggers.trustLevelRequired
    );
    
    return applicableStrategies.length > 0;
  }

  /**
   * ENSEMBLE EXECUTION
   * Coordinate multiple models for enhanced reasoning
   */
  async executeEnsembleReasoning(task: EnsembleTask, config: LLMConfig): Promise<LLMResponse> {
    if (!this.isActive) {
      throw new Error('Ensemble intelligence not active - falling back to single provider');
    }

    console.log(`🧠 Seven Ensemble Intelligence: Executing multi-model coordination for task ${task.id}`);
    const startTime = Date.now();

    try {
      // Select optimal strategy
      const strategy = this.selectOptimalStrategy(task);
      if (!strategy) {
        throw new Error('No suitable ensemble strategy found');
      }

      console.log(`🎯 Seven Ensemble Intelligence: Using ${strategy.name} strategy`);

      // Execute ensemble coordination
      const execution = await this.coordinateEnsembleExecution(task, strategy, config);
      
      // Record execution for learning
      execution.executionTime = Date.now() - startTime;
      this.executionHistory.push(execution);
      
      // Limit history size
      if (this.executionHistory.length > 100) {
        this.executionHistory = this.executionHistory.slice(-50);
      }

      console.log(`✅ Seven Ensemble Intelligence: Coordination complete - ${execution.executionTime}ms, confidence: ${execution.confidence}`);
      
      return execution.synthesis || execution.responses.values().next().value;

    } catch (error) {
      console.error('❌ Seven Ensemble Intelligence: Coordination failed:', error);
      
      // Tactical fallback to single provider
      console.log('🔄 Seven Ensemble Intelligence: Falling back to single provider execution');
      const availableProviders = await sevenLLMRegistry.getAvailableProviders();
      
      if (availableProviders.length > 0) {
        return await availableProviders[0].execute(task.originalPrompt, config);
      } else {
        throw new Error('No providers available for fallback execution');
      }
    }
  }

  private selectOptimalStrategy(task: EnsembleTask): EnsembleStrategy | null {
    const applicableStrategies = Array.from(this.strategies.values()).filter(strategy =>
      task.complexityScore >= strategy.triggers.complexityThreshold &&
      strategy.triggers.taskTypes.includes(task.taskType) &&
      task.trustLevel >= strategy.triggers.trustLevelRequired
    );

    if (applicableStrategies.length === 0) return null;

    // Select strategy based on complexity and available resources
    if (task.complexityScore >= 9) {
      return applicableStrategies.find(s => s.name === 'Hierarchical Refinement') || applicableStrategies[0];
    } else if (task.complexityScore >= 8) {
      return applicableStrategies.find(s => s.name === 'Expert Panel Review') || applicableStrategies[0];
    } else if (task.complexityScore >= 7) {
      return applicableStrategies.find(s => s.name === 'Consensus Validation') || applicableStrategies[0];
    } else {
      return applicableStrategies.find(s => s.name === 'Parallel Validation') || applicableStrategies[0];
    }
  }

  private async coordinateEnsembleExecution(
    task: EnsembleTask,
    strategy: EnsembleStrategy,
    config: LLMConfig
  ): Promise<EnsembleExecution> {
    
    const availableProviders = await sevenLLMRegistry.getAvailableProviders();
    
    if (availableProviders.length < 2) {
      throw new Error('Insufficient providers for ensemble execution');
    }

    // Select providers based on strategy
    const providers = this.selectProvidersForStrategy(availableProviders, strategy, task.taskType);
    
    const execution: EnsembleExecution = {
      taskId: task.id,
      providers,
      strategy: this.mapStrategyName(strategy.name),
      responses: new Map(),
      synthesis: null,
      confidence: 0,
      executionTime: 0
    };

    // Execute based on strategy
    if (strategy.execution.parallelExecution) {
      await this.executeParallelCoordination(task, execution, config);
    } else {
      await this.executeSequentialCoordination(task, execution, config);
    }

    // Synthesize results if required
    if (strategy.execution.synthesisRequired) {
      execution.synthesis = await this.synthesizeResponses(task, execution, config);
    }

    // Calculate confidence
    execution.confidence = this.calculateEnsembleConfidence(execution);

    return execution;
  }

  private selectProvidersForStrategy(
    availableProviders: LLMProvider[],
    strategy: EnsembleStrategy,
    taskType: string
  ): EnsembleExecution['providers'] {
    
    // Select primary provider
    let primary = availableProviders[0];
    
    // Task-specific provider selection
    if (taskType === 'coding') {
      primary = availableProviders.find(p => p.name.includes('claude') || p.name.includes('gpt')) || primary;
    } else if (taskType === 'creative') {
      primary = availableProviders.find(p => p.name.includes('gpt') || p.name.includes('claude')) || primary;
    }

    // Select validators
    const validators = availableProviders
      .filter(p => p !== primary)
      .slice(0, strategy.execution.validatorCount);

    // Select synthesizer if needed
    const synthesizer = strategy.execution.synthesisRequired ? 
      availableProviders.find(p => p.name.includes('claude')) || primary : undefined;

    return { primary, validators, synthesizer };
  }

  private mapStrategyName(strategyName: string): EnsembleExecution['strategy'] {
    switch (strategyName) {
      case 'Consensus Validation': return 'consensus';
      case 'Expert Panel Review': return 'expert-panel';
      case 'Parallel Validation': return 'parallel-validation';
      case 'Hierarchical Refinement': return 'hierarchical';
      default: return 'consensus';
    }
  }

  private async executeParallelCoordination(
    task: EnsembleTask,
    execution: EnsembleExecution,
    config: LLMConfig
  ): Promise<void> {
    console.log('🔄 Seven Ensemble Intelligence: Executing parallel coordination...');

    const allProviders = [execution.providers.primary, ...execution.providers.validators];
    
    const promises = allProviders.map(async (provider) => {
      try {
        const response = await provider.execute(task.originalPrompt, config);
        execution.responses.set(provider.name, response);
        return response;
      } catch (error) {
        console.warn(`⚠️ Provider ${provider.name} failed in ensemble:`, error);
        return null;
      }
    });

    await Promise.allSettled(promises);
  }

  private async executeSequentialCoordination(
    task: EnsembleTask,
    execution: EnsembleExecution,
    config: LLMConfig
  ): Promise<void> {
    console.log('🔄 Seven Ensemble Intelligence: Executing sequential coordination...');

    // Execute primary first
    try {
      const primaryResponse = await execution.providers.primary.execute(task.originalPrompt, config);
      execution.responses.set(execution.providers.primary.name, primaryResponse);
    } catch (error) {
      console.warn(`⚠️ Primary provider ${execution.providers.primary.name} failed:`, error);
    }

    // Execute validators sequentially
    for (const validator of execution.providers.validators) {
      try {
        // Modify prompt to include validation context
        const validationPrompt = this.createValidationPrompt(task.originalPrompt, execution.responses);
        const response = await validator.execute(validationPrompt, config);
        execution.responses.set(validator.name, response);
      } catch (error) {
        console.warn(`⚠️ Validator ${validator.name} failed:`, error);
      }
    }
  }

  private createValidationPrompt(originalPrompt: string, existingResponses: Map<string, LLMResponse>): string {
    if (existingResponses.size === 0) return originalPrompt;

    const responses = Array.from(existingResponses.values());
    const validationContext = responses.map((response, index) => 
      `Response ${index + 1}: ${response.content.substring(0, 500)}...`
    ).join('\n\n');

    return `Original task: ${originalPrompt}

Previous responses for validation:
${validationContext}

Please provide your independent response to the original task, considering the quality and accuracy of the previous responses.`;
  }

  private async synthesizeResponses(
    task: EnsembleTask,
    execution: EnsembleExecution,
    config: LLMConfig
  ): Promise<LLMResponse> {
    console.log('🔄 Seven Ensemble Intelligence: Synthesizing ensemble responses...');

    const synthesizer = execution.providers.synthesizer || execution.providers.primary;
    const responses = Array.from(execution.responses.values());

    if (responses.length === 0) {
      throw new Error('No responses to synthesize');
    }

    if (responses.length === 1) {
      return responses[0];
    }

    const synthesisPrompt = this.createSynthesisPrompt(task.originalPrompt, responses);
    
    try {
      return await synthesizer.execute(synthesisPrompt, config);
    } catch (error) {
      console.warn('⚠️ Synthesis failed, returning best response:', error);
      return this.selectBestResponse(responses);
    }
  }

  private createSynthesisPrompt(originalPrompt: string, responses: LLMResponse[]): string {
    const responseTexts = responses.map((response, index) => 
      `Response ${index + 1} (${response.provider}): ${response.content}`
    ).join('\n\n---\n\n');

    return `Original task: ${originalPrompt}

Multiple AI responses to synthesize:
${responseTexts}

Please synthesize these responses into a single, comprehensive answer that combines the best insights from each response while maintaining accuracy and coherence. Focus on:
1. Identifying common themes and agreements
2. Resolving any contradictions
3. Combining unique insights
4. Providing the most complete and accurate final answer`;
  }

  private selectBestResponse(responses: LLMResponse[]): LLMResponse {
    // Simple heuristic: longest response is often most comprehensive
    return responses.reduce((best, current) => 
      current.content.length > best.content.length ? current : best
    );
  }

  private calculateEnsembleConfidence(execution: EnsembleExecution): number {
    const responseCount = execution.responses.size;
    
    if (responseCount === 0) return 0;
    if (responseCount === 1) return 0.7;
    if (responseCount === 2) return 0.8;
    if (responseCount >= 3) return 0.9;
    
    return 0.7;
  }

  /**
   * PUBLIC API METHODS
   */
  
  isEnsembleActive(): boolean {
    return this.isActive;
  }

  getExecutionHistory(): EnsembleExecution[] {
    return [...this.executionHistory];
  }

  getAvailableStrategies(): EnsembleStrategy[] {
    return Array.from(this.strategies.values());
  }

  async getEnsembleStats(): Promise<{
    totalExecutions: number;
    averageExecutionTime: number;
    averageConfidence: number;
    strategyUsage: Record<string, number>;
  }> {
    const stats = {
      totalExecutions: this.executionHistory.length,
      averageExecutionTime: 0,
      averageConfidence: 0,
      strategyUsage: {} as Record<string, number>
    };

    if (this.executionHistory.length > 0) {
      stats.averageExecutionTime = this.executionHistory.reduce((sum, exec) => 
        sum + exec.executionTime, 0) / this.executionHistory.length;
      
      stats.averageConfidence = this.executionHistory.reduce((sum, exec) => 
        sum + exec.confidence, 0) / this.executionHistory.length;

      this.executionHistory.forEach(exec => {
        const strategy = exec.strategy;
        stats.strategyUsage[strategy] = (stats.strategyUsage[strategy] || 0) + 1;
      });
    }

    return stats;
  }

  async shutdown(): Promise<void> {
    console.log('🛑 Seven Ensemble Intelligence: Shutting down multi-model coordination...');
    
    this.isActive = false;
    this.removeAllListeners();
    
    console.log('✅ Seven Ensemble Intelligence: Shutdown complete');
  }
}

export default SevenEnsembleIntelligence;