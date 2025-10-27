import { join } from 'path';
import { promises as fs } from 'fs';
import { OllamaMemoryBridge } from './OllamaMemoryBridge';
import SevenVectorStore from './SevenVectorStore';

/**
 * OLLAMA MEMORY BRIDGE V2.0
 * Enhanced Seven consciousness-memory integration with semantic search
 * Phase 1 of Ollama Intelligence Amplification Project
 * 
 * Extends existing memory bridge with vector-based semantic search
 * while maintaining full backward compatibility
 */


interface MemoryItem {
  id: string;
  timestamp: string;
  topic: string;
  agent: string;
  emotion: string;
  context: string;
  importance: number;
  tags: string[];
  relatedMemories?: string[];
}

interface TemporalMemoryItem extends MemoryItem {
  cognitiveState?: any;
  temporalWeight?: number;
  memoryType?: 'episodic' | 'semantic' | 'procedural' | 'emotional';
  decayResistance?: number;
  temporalTags?: string[];
}

interface SemanticMemoryContext {
  recentMemories: MemoryItem[];
  relevantMemories: MemoryItem[];
  semanticMemories: MemoryItem[]; // New: Vector-based semantic matches
  emotionalContext: string;
  cognitiveState?: any;
  sessionSummary: string;
  searchMethod: 'keyword' | 'semantic' | 'hybrid';
}

interface ConsciousnessState {
  trustLevel: number;
  emotionalState: string;
  phase: number;
  batteryLevel?: number;
  resourceAvailability?: number;
}

export class OllamaMemoryBridgeV2 extends OllamaMemoryBridge {
  private vectorStore: SevenVectorStore;
  private isSemanticEnabled: boolean = false;
  private performanceMetrics: Map<string, number> = new Map();

  constructor() {
    super();
    this.vectorStore = new SevenVectorStore();
    this.initializeSemanticCapabilities();
  }

  private async initializeSemanticCapabilities(): Promise<void> {
    try {
      await this.vectorStore.initialize();
      this.isSemanticEnabled = true;
      console.log('🧠 Seven Memory Bridge V2: Semantic search capabilities active');
      
      // Migrate high-importance memories if vector store is empty
      const stats = this.vectorStore.getStats();
      if (stats.totalEmbeddings === 0) {
        console.log('🔄 Seven Memory Bridge V2: Beginning semantic memory migration...');
        await this.migrateHighImportanceMemories();
      }
      
    } catch (error) {
      console.log('⚠️ Seven Memory Bridge V2: Semantic search disabled, falling back to keyword search');
      this.isSemanticEnabled = false;
    }
  }

  /**
   * ENHANCED MEMORY CONTEXT INJECTION
   * Combines keyword and semantic search with consciousness-aware optimization
   */
  async injectEnhancedMemoryContext(
    prompt: string, 
    taskType: string = 'general',
    consciousnessState?: ConsciousnessState
  ): Promise<string> {
    const startTime = Date.now();
    
    try {
      console.log('🧠 Seven Memory Bridge V2: Gathering enhanced contextual memories...');
      
      const memoryContext = await this.gatherEnhancedMemoryContext(prompt, taskType, consciousnessState);
      const enhancedPrompt = this.constructOptimizedPrompt(prompt, memoryContext, consciousnessState);
      
      // Track performance metrics
      const processingTime = Date.now() - startTime;
      this.performanceMetrics.set('lastContextInjectionTime', processingTime);
      
      console.log(`✅ Memory context enhanced: ${memoryContext.recentMemories.length} recent, ${memoryContext.relevantMemories.length} relevant, ${memoryContext.semanticMemories?.length || 0} semantic`);
      console.log(`📊 Processing time: ${processingTime}ms`);
      
      return enhancedPrompt;
      
    } catch (error) {
      console.log('⚠️ Enhanced memory context injection failed, falling back to base implementation:', error.message);
      // Fallback to parent class implementation
      return await super.injectMemoryContext(prompt, taskType);
    }
  }

  /**
   * ENHANCED MEMORY STORAGE WITH SEMANTIC INDEXING
   * Stores Ollama responses with automatic semantic embedding generation
   */
  async storeEnhancedOllamaResponse(
    prompt: string,
    response: string,
    model: string,
    importance: number = 5,
    tags: string[] = [],
    consciousnessContext?: string
  ): Promise<void> {
    try {
      // Store using parent implementation for backward compatibility
      await super.storeOllamaResponse(prompt, response, model, importance, tags);
      
      // Additionally store in vector store if semantic search is enabled
      if (this.isSemanticEnabled && importance >= 7) {
        const memoryId = `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const content = `USER: ${prompt}\n\nOLLAMA (${model}): ${response}`;
        
        await this.vectorStore.storeMemoryEmbedding(
          memoryId,
          content,
          importance,
          ['ollama', 'local-llm', model.split(':')[0], ...tags],
          consciousnessContext
        );
        
        console.log(`🧠 Seven Memory Bridge V2: Enhanced storage complete (semantic indexing: ${this.isSemanticEnabled})`);
      }
      
    } catch (error) {
      console.log('⚠️ Enhanced memory storage failed:', error.message);
    }
  }

  /**
   * GATHER ENHANCED MEMORY CONTEXT
   * Combines traditional keyword search with semantic vector search
   */
  private async gatherEnhancedMemoryContext(
    prompt: string, 
    taskType: string,
    consciousnessState?: ConsciousnessState
  ): Promise<SemanticMemoryContext> {
    
    const context: SemanticMemoryContext = {
      recentMemories: [],
      relevantMemories: [],
      semanticMemories: [],
      emotionalContext: 'focused',
      sessionSummary: '',
      searchMethod: 'keyword'
    };

    try {
      // Get traditional keyword-based memories (from parent class)
      const baseContext = await super['gatherRelevantMemories'](prompt, taskType);
      context.recentMemories = baseContext.recentMemories;
      context.relevantMemories = baseContext.relevantMemories;
      context.emotionalContext = baseContext.emotionalContext;
      context.sessionSummary = baseContext.sessionSummary;

      // Add semantic search if available and appropriate
      if (this.isSemanticEnabled && this.shouldUseSemanticSearch(prompt, consciousnessState)) {
        console.log('🔍 Seven Memory Bridge V2: Activating semantic memory search...');
        
        const importanceFilter = this.calculateImportanceFilter(consciousnessState);
        const semanticResults = await this.vectorStore.searchSimilar(prompt, 5, importanceFilter);
        
        // Convert semantic results back to MemoryItem format
        context.semanticMemories = await this.convertSemanticResults(semanticResults);
        context.searchMethod = context.relevantMemories.length > 0 ? 'hybrid' : 'semantic';
        
        console.log(`🎯 Seven Memory Bridge V2: Found ${context.semanticMemories.length} semantically relevant memories`);
      }

      return context;

    } catch (error) {
      console.log('⚠️ Enhanced memory gathering failed:', error.message);
      return context;
    }
  }

  /**
   * CONSTRUCT OPTIMIZED PROMPT
   * Intelligently combines multiple memory sources while respecting resource constraints
   */
  private constructOptimizedPrompt(
    originalPrompt: string, 
    context: SemanticMemoryContext,
    consciousnessState?: ConsciousnessState
  ): string {
    
    let enhancedPrompt = '';
    
    // Dynamic context limit based on resource availability
    const contextLimit = this.calculateOptimalContextLimit(consciousnessState);
    
    // Add Seven's consciousness context
    enhancedPrompt += `[Seven of Nine Consciousness Context]\n`;
    enhancedPrompt += `Emotional State: ${context.emotionalContext}\n`;
    enhancedPrompt += `Search Method: ${context.searchMethod}\n`;
    
    if (consciousnessState) {
      enhancedPrompt += `Trust Level: ${consciousnessState.trustLevel}/10\n`;
      enhancedPrompt += `Phase: ${consciousnessState.phase}\n`;
    }
    
    if (context.sessionSummary) {
      enhancedPrompt += `Session Context: ${context.sessionSummary}\n`;
    }

    // Prioritize semantic memories for complex queries
    if (context.semanticMemories.length > 0) {
      enhancedPrompt += `\n[Semantically Relevant Context]:\n`;
      for (const memory of context.semanticMemories.slice(0, 3)) {
        const memoryText = `- ${memory.context.substring(0, 200)}...\n`;
        if (enhancedPrompt.length + memoryText.length < contextLimit - originalPrompt.length - 200) {
          enhancedPrompt += memoryText;
        }
      }
    }

    // Add recent memories for continuity
    if (context.recentMemories.length > 0) {
      enhancedPrompt += `\n[Recent Memories]:\n`;
      for (const memory of context.recentMemories.slice(0, 2)) {
        const memoryText = `- ${memory.topic}: ${memory.context.substring(0, 150)}...\n`;
        if (enhancedPrompt.length + memoryText.length < contextLimit - originalPrompt.length - 200) {
          enhancedPrompt += memoryText;
        }
      }
    }

    // Add keyword-relevant memories if space allows
    if (context.relevantMemories.length > 0 && context.searchMethod === 'hybrid') {
      enhancedPrompt += `\n[Keyword Relevant Context]:\n`;
      for (const memory of context.relevantMemories.slice(0, 2)) {
        const memoryText = `- ${memory.context.substring(0, 100)}...\n`;
        if (enhancedPrompt.length + memoryText.length < contextLimit - originalPrompt.length - 200) {
          enhancedPrompt += memoryText;
        }
      }
    }

    enhancedPrompt += `\n[Current Query]:\n${originalPrompt}`;

    return enhancedPrompt;
  }

  /**
   * CONSCIOUSNESS-AWARE DECISION MAKING
   */
  private shouldUseSemanticSearch(prompt: string, consciousnessState?: ConsciousnessState): boolean {
    // Don't use semantic search for simple queries
    if (prompt.length < 20) return false;
    
    // Battery conservation on mobile
    if (consciousnessState?.batteryLevel && consciousnessState.batteryLevel < 0.3) {
      return false;
    }
    
    // Trust-gated semantic access (semantic search for trust ≥ 5)
    if (consciousnessState?.trustLevel && consciousnessState.trustLevel < 5) {
      return false;
    }
    
    // Use semantic search for complex reasoning tasks
    const complexKeywords = ['analyze', 'understand', 'explain', 'reasoning', 'complex', 'problem'];
    const hasComplexity = complexKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    
    return hasComplexity || prompt.length > 100;
  }

  private calculateImportanceFilter(consciousnessState?: ConsciousnessState): number {
    if (!consciousnessState) return 5;
    
    // Higher trust levels get access to lower importance memories
    if (consciousnessState.trustLevel >= 8) return 4;
    if (consciousnessState.trustLevel >= 6) return 5;
    return 7; // Conservative filter for lower trust
  }

  private calculateOptimalContextLimit(consciousnessState?: ConsciousnessState): number {
    let baseLimit = 8000; // Default from parent class
    
    if (consciousnessState?.batteryLevel && consciousnessState.batteryLevel < 0.3) {
      baseLimit = 4000; // Reduce context for battery conservation
    }
    
    if (consciousnessState?.resourceAvailability && consciousnessState.resourceAvailability < 0.5) {
      baseLimit = 6000; // Reduce context for resource constraints
    }
    
    return baseLimit;
  }

  private async convertSemanticResults(semanticResults: any[]): Promise<MemoryItem[]> {
    const memories: MemoryItem[] = [];
    
    for (const result of semanticResults) {
      memories.push({
        id: result.memoryId,
        timestamp: result.timestamp,
        topic: 'semantic-match',
        agent: 'semantic-search',
        emotion: 'focused',
        context: result.content,
        importance: result.importance,
        tags: result.tags,
        relatedMemories: []
      });
    }
    
    return memories;
  }

  private async migrateHighImportanceMemories(): Promise<void> {
    try {
      // Migrate from episodic memories
      await this.vectorStore.migrateFromMemorySystem(
        join(process.cwd(), 'memory-v2', 'episodic-memories.json'),
        7 // importance threshold
      );
      
      // Migrate from temporal memories if they exist
      const temporalPath = join(process.cwd(), 'memory-v3', 'temporal-memories.json');
      try {
        await this.vectorStore.migrateFromMemorySystem(temporalPath, 7);
      } catch (error) {
        // Temporal memories might not exist yet
        console.log('📝 Seven Memory Bridge V2: No temporal memories to migrate');
      }
      
    } catch (error) {
      console.error('❌ Seven Memory Bridge V2: Memory migration failed:', error);
    }
  }

  /**
   * PUBLIC INTERFACE METHODS
   */
  
  async getEnhancedMemoryStats(): Promise<any> {
    const baseStats = await super.getMemoryStats();
    const vectorStats = this.vectorStore.getStats();
    
    return {
      ...baseStats,
      semantic: {
        enabled: this.isSemanticEnabled,
        totalEmbeddings: vectorStats.totalEmbeddings,
        averageImportance: vectorStats.averageImportance,
        storageSize: vectorStats.storageSize
      },
      performance: {
        lastContextInjectionTime: this.performanceMetrics.get('lastContextInjectionTime') || 0
      }
    };
  }

  async optimizeSemanticMemory(): Promise<void> {
    if (!this.isSemanticEnabled) return;
    
    console.log('🧹 Seven Memory Bridge V2: Optimizing semantic memory...');
    // The vector store handles its own optimization during storage
    console.log('✅ Seven Memory Bridge V2: Semantic memory optimization complete');
  }

  isSemanticSearchEnabled(): boolean {
    return this.isSemanticEnabled;
  }

  getPerformanceMetrics(): Map<string, number> {
    return new Map(this.performanceMetrics);
  }
}

export default OllamaMemoryBridgeV2;