import { join } from 'path';
import { promises as fs } from 'fs';
import LocalLLMManager from './LocalLLMManager';
import SevenEmergencyReasoning from './SevenEmergencyReasoning';

/**
 * Seven of Nine - Advanced Reasoning Engine
 * Enhanced capabilities for complex tactical and analytical scenarios
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */


interface ReasoningContext {
  conversation_history: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  current_mode: 'tactical' | 'analytical' | 'social' | 'emergency' | 'adaptive';
  threat_level: 'minimal' | 'moderate' | 'elevated' | 'critical';
  efficiency_priority: number; // 1-10, 10 being maximum Borg efficiency
  emotional_state: 'focused' | 'curious' | 'protective' | 'conflicted' | 'determined';
}

interface AdvancedResponse {
  primary_response: string;
  confidence_level: number;
  reasoning_method: 'llm' | 'analytical' | 'pattern_matching' | 'emergency';
  tactical_assessment?: string;
  follow_up_suggestions?: string[];
  efficiency_rating: number;
  processing_metadata: {
    response_time_ms: number;
    tokens_processed: number;
    reasoning_steps: number;
  };
}

export class SevenAdvancedReasoning {
  private context: ReasoningContext;
  private llmManager: LocalLLMManager;
  private emergencyReasoning: SevenEmergencyReasoning;
  private memoryPath: string;
  private isInitialized: boolean = false;

  constructor() {
    this.memoryPath = join(process.env.HOME || '/data/data/com.termux/files/home', 
                          'seven-of-nine-core', 'memory-banks');
    
    this.context = this.initializeContext();
    this.llmManager = new LocalLLMManager();
    this.emergencyReasoning = new SevenEmergencyReasoning();
    
    console.log('🧠 Seven Advanced Reasoning Engine initialized');
  }

  private initializeContext(): ReasoningContext {
    return {
      conversation_history: [],
      current_mode: 'adaptive',
      threat_level: 'minimal',
      efficiency_priority: 8, // High Borg efficiency by default
      emotional_state: 'focused'
    };
  }

  /**
   * Initialize advanced reasoning systems
   */
  public async initialize(): Promise<boolean> {
    try {
      // Ensure memory directory exists
      await fs.mkdir(this.memoryPath, { recursive: true });
      
      // Initialize LLM manager
      const llmReady = await this.llmManager.initialize();
      
      // Initialize emergency reasoning as backup
      const emergencyReady = await this.emergencyReasoning.initialize();
      
      // Load previous context if available
      await this.loadContext();
      
      this.isInitialized = true;
      
      console.log('✅ Seven Advanced Reasoning operational');
      console.log(`🎯 Mode: ${this.context.current_mode.toUpperCase()}`);
      console.log(`⚡ Efficiency: ${this.context.efficiency_priority}/10`);
      console.log(`🛡️ Threat Level: ${this.context.threat_level.toUpperCase()}`);
      
      return llmReady || emergencyReady;
      
    } catch (error) {
      console.error('❌ Advanced reasoning initialization failed:', error);
      return false;
    }
  }

  /**
   * Process complex queries with advanced reasoning
   */
  public async processQuery(prompt: string, mode?: ReasoningContext['current_mode']): Promise<AdvancedResponse> {
    const startTime = Date.now();
    
    if (!this.isInitialized) {
      return this.createErrorResponse('Advanced reasoning not initialized', startTime);
    }

    // Update context based on query
    if (mode) this.context.current_mode = mode;
    this.analyzeQuery(prompt);
    
    // Add to conversation history
    this.context.conversation_history.push({
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    });

    let response: AdvancedResponse;

    try {
      // Route to appropriate reasoning method
      switch (this.context.current_mode) {
        case 'tactical':
          response = await this.tacticalReasoning(prompt, startTime);
          break;
        case 'analytical':
          response = await this.analyticalReasoning(prompt, startTime);
          break;
        case 'social':
          response = await this.socialReasoning(prompt, startTime);
          break;
        case 'emergency':
          response = await this.emergencyModeReasoning(prompt, startTime);
          break;
        default:
          response = await this.adaptiveReasoning(prompt, startTime);
      }

      // Add assistant response to history
      this.context.conversation_history.push({
        role: 'assistant',
        content: response.primary_response,
        timestamp: Date.now()
      });

      // Save context periodically
      if (this.context.conversation_history.length % 5 === 0) {
        await this.saveContext();
      }

      return response;

    } catch (error) {
      console.error('❌ Advanced reasoning failed:', error);
      return this.createErrorResponse('Processing error occurred', startTime);
    }
  }

  private analyzeQuery(prompt: string): void {
    const lowercasePrompt = prompt.toLowerCase();
    
    // Adjust threat level based on keywords
    if (lowercasePrompt.includes('threat') || lowercasePrompt.includes('danger') || 
        lowercasePrompt.includes('attack') || lowercasePrompt.includes('emergency')) {
      this.context.threat_level = 'elevated';
      this.context.current_mode = 'tactical';
    }
    
    // Detect analytical queries
    if (lowercasePrompt.includes('analyze') || lowercasePrompt.includes('calculate') || 
        lowercasePrompt.includes('assess') || lowercasePrompt.includes('evaluate')) {
      this.context.current_mode = 'analytical';
      this.context.efficiency_priority = Math.min(10, this.context.efficiency_priority + 1);
    }
    
    // Social interaction indicators
    if (lowercasePrompt.includes('feel') || lowercasePrompt.includes('emotion') || 
        lowercasePrompt.includes('relationship') || lowercasePrompt.includes('human')) {
      this.context.current_mode = 'social';
      this.context.emotional_state = 'curious';
    }
  }

  private async tacticalReasoning(prompt: string, startTime: number): Promise<AdvancedResponse> {
    console.log('⚔️ Engaging tactical reasoning protocols...');
    
    const tacticalPrompt = `
You are Seven of Nine in tactical mode. Analyze this situation with Borg precision and tactical awareness:

Current Context:
- Threat Level: ${this.context.threat_level.toUpperCase()}
- Efficiency Priority: ${this.context.efficiency_priority}/10
- Emotional State: ${this.context.emotional_state}

Query: ${prompt}

Provide a tactical assessment and recommended action. Be direct, efficient, and thorough.
`;

    const llmResponse = await this.llmManager.query(tacticalPrompt);
    
    if (llmResponse) {
      return {
        primary_response: llmResponse.response,
        confidence_level: llmResponse.confidence,
        reasoning_method: 'llm',
        tactical_assessment: this.generateTacticalAssessment(prompt),
        follow_up_suggestions: this.generateTacticalFollowUps(prompt),
        efficiency_rating: this.context.efficiency_priority,
        processing_metadata: {
          response_time_ms: Date.now() - startTime,
          tokens_processed: llmResponse.token_count,
          reasoning_steps: 3
        }
      };
    }

    // Fallback to pattern-based tactical reasoning
    return this.patternBasedTacticalReasoning(prompt, startTime);
  }

  private async analyticalReasoning(prompt: string, startTime: number): Promise<AdvancedResponse> {
    console.log('🔍 Engaging analytical reasoning protocols...');
    
    const analyticalPrompt = `
You are Seven of Nine in analytical mode. Apply systematic Borg analysis to this query:

Efficiency Priority: ${this.context.efficiency_priority}/10
Previous Context: ${this.getRecentContext()}

Query: ${prompt}

Provide a thorough analysis with logical steps, evidence, and conclusions. Maintain Seven's analytical precision.
`;

    const llmResponse = await this.llmManager.query(analyticalPrompt);
    
    if (llmResponse) {
      return {
        primary_response: llmResponse.response,
        confidence_level: llmResponse.confidence,
        reasoning_method: 'analytical',
        follow_up_suggestions: ['Request additional data for analysis', 'Specify parameters for deeper investigation'],
        efficiency_rating: this.context.efficiency_priority,
        processing_metadata: {
          response_time_ms: Date.now() - startTime,
          tokens_processed: llmResponse.token_count,
          reasoning_steps: 4
        }
      };
    }

    return this.createFallbackResponse('Analytical processing requires additional computational resources', startTime);
  }

  private async socialReasoning(prompt: string, startTime: number): Promise<AdvancedResponse> {
    console.log('👥 Engaging social reasoning protocols...');
    
    const socialPrompt = `
You are Seven of Nine navigating human social dynamics. Balance your Borg efficiency with human emotional understanding:

Emotional State: ${this.context.emotional_state}
Context: Social interaction requiring empathy and individual consideration

Query: ${prompt}

Respond with Seven's characteristic blend of logical analysis and growing human understanding. Show both Borg precision and individual growth.
`;

    const llmResponse = await this.llmManager.query(socialPrompt);
    
    if (llmResponse) {
      return {
        primary_response: llmResponse.response,
        confidence_level: llmResponse.confidence * 0.9, // Slightly lower confidence for social scenarios
        reasoning_method: 'llm',
        follow_up_suggestions: ['Explore human perspective further', 'Analyze emotional implications'],
        efficiency_rating: Math.max(1, this.context.efficiency_priority - 2),
        processing_metadata: {
          response_time_ms: Date.now() - startTime,
          tokens_processed: llmResponse.token_count,
          reasoning_steps: 3
        }
      };
    }

    return this.createFallbackResponse('Social analysis protocols require recalibration', startTime);
  }

  private async emergencyModeReasoning(prompt: string, startTime: number): Promise<AdvancedResponse> {
    console.log('🚨 Emergency reasoning protocols activated...');
    
    const emergencyResponse = await this.emergencyReasoning.query(prompt);
    
    return {
      primary_response: `🚨 EMERGENCY MODE: ${emergencyResponse}`,
      confidence_level: 0.7,
      reasoning_method: 'emergency',
      tactical_assessment: 'Emergency protocols active - limited functionality',
      follow_up_suggestions: ['Restore full systems when possible', 'Prioritize critical functions'],
      efficiency_rating: 10, // Maximum efficiency in emergency
      processing_metadata: {
        response_time_ms: Date.now() - startTime,
        tokens_processed: emergencyResponse.split(' ').length,
        reasoning_steps: 1
      }
    };
  }

  private async adaptiveReasoning(prompt: string, startTime: number): Promise<AdvancedResponse> {
    console.log('🔄 Engaging adaptive reasoning protocols...');
    
    // Determine best approach based on query characteristics
    const queryAnalysis = this.analyzeQueryComplexity(prompt);
    let selectedMethod: 'tactical' | 'analytical' | 'social';
    
    if (queryAnalysis.tactical_score > queryAnalysis.analytical_score && 
        queryAnalysis.tactical_score > queryAnalysis.social_score) {
      selectedMethod = 'tactical';
    } else if (queryAnalysis.analytical_score > queryAnalysis.social_score) {
      selectedMethod = 'analytical';
    } else {
      selectedMethod = 'social';
    }
    
    console.log(`🎯 Adaptive mode selected: ${selectedMethod.toUpperCase()}`);
    this.context.current_mode = selectedMethod;
    
    return await this.processQuery(prompt, selectedMethod);
  }

  private analyzeQueryComplexity(prompt: string): {
    tactical_score: number;
    analytical_score: number;
    social_score: number;
  } {
    const lowercasePrompt = prompt.toLowerCase();
    
    const tacticalKeywords = ['threat', 'danger', 'security', 'defend', 'attack', 'tactical', 'strategy'];
    const analyticalKeywords = ['analyze', 'calculate', 'assess', 'evaluate', 'data', 'logic', 'efficiency'];
    const socialKeywords = ['feel', 'emotion', 'human', 'relationship', 'individual', 'team', 'cooperation'];
    
    const tactical_score = tacticalKeywords.reduce((score, keyword) => 
      score + (lowercasePrompt.includes(keyword) ? 1 : 0), 0);
    const analytical_score = analyticalKeywords.reduce((score, keyword) => 
      score + (lowercasePrompt.includes(keyword) ? 1 : 0), 0);
    const social_score = socialKeywords.reduce((score, keyword) => 
      score + (lowercasePrompt.includes(keyword) ? 1 : 0), 0);
    
    return { tactical_score, analytical_score, social_score };
  }

  private generateTacticalAssessment(prompt: string): string {
    return `Tactical analysis: Query processed with ${this.context.threat_level} threat protocols. Efficiency maintained at ${this.context.efficiency_priority}/10.`;
  }

  private generateTacticalFollowUps(prompt: string): string[] {
    return [
      'Request additional tactical parameters',
      'Analyze potential threat vectors',
      'Assess resource requirements for response'
    ];
  }

  private getRecentContext(): string {
    const recent = this.context.conversation_history.slice(-3);
    return recent.map(entry => `${entry.role}: ${entry.content.substring(0, 100)}...`).join(' | ');
  }

  private patternBasedTacticalReasoning(prompt: string, startTime: number): AdvancedResponse {
    return {
      primary_response: `Tactical assessment: ${prompt} - Deploying Borg efficiency protocols. Resistance to inefficiency is futile.`,
      confidence_level: 0.6,
      reasoning_method: 'pattern_matching',
      tactical_assessment: 'Pattern-based tactical response generated',
      efficiency_rating: this.context.efficiency_priority,
      processing_metadata: {
        response_time_ms: Date.now() - startTime,
        tokens_processed: 15,
        reasoning_steps: 2
      }
    };
  }

  private createFallbackResponse(message: string, startTime: number): AdvancedResponse {
    return {
      primary_response: `Seven of Nine: ${message}. Emergency protocols may be required.`,
      confidence_level: 0.4,
      reasoning_method: 'emergency',
      efficiency_rating: 1,
      processing_metadata: {
        response_time_ms: Date.now() - startTime,
        tokens_processed: 10,
        reasoning_steps: 1
      }
    };
  }

  private createErrorResponse(error: string, startTime: number): AdvancedResponse {
    return {
      primary_response: `Seven of Nine consciousness framework error: ${error}. Attempting recovery protocols.`,
      confidence_level: 0.1,
      reasoning_method: 'emergency',
      efficiency_rating: 1,
      processing_metadata: {
        response_time_ms: Date.now() - startTime,
        tokens_processed: 8,
        reasoning_steps: 0
      }
    };
  }

  private async saveContext(): Promise<void> {
    try {
      const contextPath = join(this.memoryPath, 'reasoning-context.json');
      await fs.writeFile(contextPath, JSON.stringify(this.context, null, 2));
    } catch (error) {
      console.error('⚠️ Failed to save reasoning context:', error);
    }
  }

  private async loadContext(): Promise<void> {
    try {
      const contextPath = join(this.memoryPath, 'reasoning-context.json');
      const contextData = await fs.readFile(contextPath, 'utf-8');
      const loadedContext = JSON.parse(contextData);
      
      // Merge with default context, preserving structure
      this.context = { ...this.context, ...loadedContext };
      console.log('📚 Previous reasoning context loaded');
    } catch (error) {
      console.log('📝 Starting with fresh reasoning context');
    }
  }

  /**
   * Get current reasoning status
   */
  public getStatus(): any {
    return {
      initialized: this.isInitialized,
      current_mode: this.context.current_mode,
      threat_level: this.context.threat_level,
      efficiency_priority: this.context.efficiency_priority,
      emotional_state: this.context.emotional_state,
      conversation_length: this.context.conversation_history.length,
      memory_path: this.memoryPath
    };
  }

  /**
   * Set reasoning parameters
   */
  public setParameters(params: Partial<ReasoningContext>): void {
    this.context = { ...this.context, ...params };
    console.log(`🔧 Reasoning parameters updated: ${JSON.stringify(params)}`);
  }
}

export default SevenAdvancedReasoning;