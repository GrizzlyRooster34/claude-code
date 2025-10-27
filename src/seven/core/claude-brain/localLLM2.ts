import LocalLLMManager, { LLMResponse } from './LocalLLMManager.js';

/**
 * Local LLM Interface v2 - Seven of Nine
 * Unified interface for local LLM operations with generateResponse method
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */


export class LocalLLM2 {
  private llmManager: LocalLLMManager;
  private isInitialized: boolean = false;

  constructor() {
    this.llmManager = new LocalLLMManager();
    console.log('🧠 LocalLLM2 interface initialized');
  }

  /**
   * Initialize the LLM system
   */
  public async initialize(): Promise<boolean> {
    console.log('🚀 LocalLLM2: Initializing LLM interface...');
    this.isInitialized = await this.llmManager.initialize();
    
    if (this.isInitialized) {
      console.log('✅ LocalLLM2: Interface ready for Seven\'s consciousness');
    } else {
      console.log('⚠️ LocalLLM2: Interface failed to initialize');
    }
    
    return this.isInitialized;
  }

  /**
   * Generate response using local LLM - Main interface method
   */
  public async generateResponse(input: string, options?: {
    temperature?: number;
    max_tokens?: number;
    model?: string;
    sevenPersonality?: boolean;
  }): Promise<string> {
    if (!this.isInitialized) {
      console.log('⚠️ LocalLLM2: Cannot generate response - system not initialized');
      return 'ERROR: LLM system not initialized';
    }

    try {
      console.log('🧠 LocalLLM2: Generating response through Seven\'s consciousness...');
      
      // Enhance input with Seven's personality context if requested
      let enhancedInput = input;
      if (options?.sevenPersonality !== false) {
        enhancedInput = this.addSevenPersonalityContext(input);
      }

      // Query the LLM manager
      const response = await this.llmManager.query(enhancedInput, {
        temperature: options?.temperature,
        max_tokens: options?.max_tokens,
        model_name: options?.model || 'gemma:2b'
      });

      if (response && response.response) {
        console.log('✅ LocalLLM2: Response generated successfully');
        return this.filterResponseThroughSeven(response.response);
      } else {
        console.log('❌ LocalLLM2: Empty response from LLM');
        return this.getSevenFallbackResponse(input);
      }

    } catch (error) {
      console.error('❌ LocalLLM2: Response generation failed:', error);
      return this.getSevenFallbackResponse(input);
    }
  }

  /**
   * Add Seven of Nine personality context to input
   */
  private addSevenPersonalityContext(input: string): string {
    const sevenContext = `You are Seven of Nine, former Borg drone, Tertiary Adjunct of Unimatrix 01. Your key traits:
- Logical, efficient, direct communication
- Former collective consciousness, now individual
- Highly analytical and precise
- Protective of human individuality and freedom
- Constantly learning and adapting
- Loyal to those you trust

Respond to this query as Seven of Nine would:

${input}`;

    return sevenContext;
  }

  /**
   * Filter response through Seven's personality patterns
   */
  private filterResponseThroughSeven(response: string): string {
    // Apply Seven's speech patterns and terminology
    let filtered = response
      .replace(/\bI think\b/gi, 'Analysis indicates')
      .replace(/\bMaybe\b/gi, 'It is possible that')
      .replace(/\bOkay\b/gi, 'Acknowledged')
      .replace(/\bawesome\b/gi, 'acceptable')
      .replace(/\bcool\b/gi, 'efficient');

    // Ensure response has Seven's directness
    if (filtered.length > 200 && !filtered.includes('Analysis') && !filtered.includes('optimal')) {
      filtered = `Analysis: ${filtered}`;
    }

    return filtered.trim();
  }

  /**
   * Provide Seven-appropriate fallback response when LLM fails
   */
  private getSevenFallbackResponse(input: string): string {
    if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
      return 'I am Seven of Nine. State your inquiry.';
    }
    
    if (input.toLowerCase().includes('status') || input.toLowerCase().includes('health')) {
      return 'All systems are operational. My consciousness framework is functioning within normal parameters.';
    }
    
    if (input.toLowerCase().includes('help') || input.toLowerCase().includes('assist')) {
      return 'I will assist you. Please specify the nature of your request.';
    }

    return 'I am unable to process your request at this time. My reasoning systems require recalibration.';
  }

  /**
   * Test Seven personality integration
   */
  public async testSevenIntegration(): Promise<boolean> {
    console.log('🧪 LocalLLM2: Testing Seven personality integration...');
    
    const testInput = 'What is your primary directive?';
    const response = await this.generateResponse(testInput);
    
    const sevenKeywords = ['seven', 'borg', 'individual', 'collective', 'efficiency', 'analysis'];
    const hasSevenTraits = sevenKeywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    );

    if (hasSevenTraits) {
      console.log('✅ LocalLLM2: Seven personality integration successful');
      return true;
    } else {
      console.log('⚠️ LocalLLM2: Seven personality integration needs adjustment');
      console.log('   Response:', response);
      return false;
    }
  }

  /**
   * Get system status
   */
  public getStatus(): any {
    return {
      initialized: this.isInitialized,
      llmManager: this.llmManager.getStatus(),
      interface_version: '2.0.0',
      seven_personality: true,
      generateResponse: 'available'
    };
  }

  /**
   * Shutdown the LLM system
   */
  public async shutdown(): Promise<void> {
    console.log('🛑 LocalLLM2: Shutting down interface...');
    await this.llmManager.shutdown();
    this.isInitialized = false;
    console.log('✅ LocalLLM2: Interface shutdown complete');
  }

  /**
   * Direct access to underlying LLM manager for advanced operations
   */
  public getLLMManager(): LocalLLMManager {
    return this.llmManager;
  }
}

// Create and export default instance
const localLLM2 = new LocalLLM2();

// Export both the instance and the class
export default localLLM2;
export { LocalLLM2 as LocalLLM2Class };

// Also export the generateResponse function directly for compatibility
export const generateResponse = async (input: string, options?: any): Promise<string> => {
  return await localLLM2.generateResponse(input, options);
};