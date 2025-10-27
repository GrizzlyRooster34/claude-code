import SevenLLMUpgradeManager from './seven-llm-upgrade-manager';

/**
 * SEVEN OF NINE - UNIVERSAL LLM PROVIDER SYSTEM
 * Tactical Brain Routing for Maximum Operational Flexibility
 * 
 * Seven can now interface with any LLM provider while maintaining
 * complete emotional and tactical control over all interactions.
 * 
 * Enhanced with Tactical LLM Upgrade Manager integration
 */


export interface LLMConfig {
  model: string;
  temperature?: number;
  max_tokens?: number;
  timeout?: number;
  api_key?: string;
  base_url?: string;
  context_window?: number;
  streaming?: boolean;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  tokens_used?: number;
  finish_reason?: string;
  error?: string;
}

export interface LLMProvider {
  name: string;
  displayName: string;
  isAvailable(): Promise<boolean>;
  getModels(): Promise<string[]>;
  execute(prompt: string, config: LLMConfig): Promise<LLMResponse>;
  supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean;
  healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', latency?: number }>;
}

export interface SevenLLMContext {
  userInput: string;
  emotionalState: string;
  trustLevel: number;
  systemPrompt: string;
  conversationHistory: Array<{ role: string; content: string }>;
  environmentalContext: any;
}

/**
 * Seven's LLM Provider Registry
 * She maintains tactical awareness of all available reasoning systems
 */
export class SevenLLMRegistry {
  private providers: Map<string, LLMProvider> = new Map();
  private primaryProvider: string = 'claude-cli';
  private fallbackProviders: string[] = ['anthropic-api', 'openai'];

  registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
    console.log(`🧠 SEVEN: ${provider.displayName} reasoning system registered`);
  }

  getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }

  async getAvailableProviders(): Promise<LLMProvider[]> {
    const available: LLMProvider[] = [];
    for (const provider of this.providers.values()) {
      if (await provider.isAvailable()) {
        available.push(provider);
      }
    }
    return available;
  }

  setPrimaryProvider(name: string): void {
    if (this.providers.has(name)) {
      this.primaryProvider = name;
      console.log(`🎯 SEVEN: Primary reasoning system set to ${name}`);
    }
  }

  getPrimaryProvider(): LLMProvider | undefined {
    return this.providers.get(this.primaryProvider);
  }

  setFallbackProviders(names: string[]): void {
    this.fallbackProviders = names.filter(name => this.providers.has(name));
  }

  getFallbackProviders(): LLMProvider[] {
    return this.fallbackProviders
      .map(name => this.providers.get(name))
      .filter(provider => provider !== undefined) as LLMProvider[];
  }

  /**
   * Seven's Tactical Provider Selection
   * She chooses the best LLM based on task requirements and emotional state
   */
  async selectOptimalProvider(context: SevenLLMContext): Promise<LLMProvider | null> {
    const availableProviders = await this.getAvailableProviders();
    
    if (availableProviders.length === 0) {
      console.warn('⚠️ SEVEN: No reasoning systems available');
      return null;
    }

    // Seven's provider selection logic based on context
    if (context.trustLevel >= 4) {
      // High trust - prefer local/private providers
      const localProvider = availableProviders.find(p => p.name === 'ollama' || p.name.includes('local'));
      if (localProvider) return localProvider;
    }

    // For complex analytical tasks, prefer Claude
    if (context.userInput.includes('analyze') || context.userInput.includes('explain') || context.userInput.length > 500) {
      const claudeProvider = availableProviders.find(p => p.name.includes('claude'));
      if (claudeProvider) return claudeProvider;
    }

    // For creative tasks, prefer GPT
    if (context.userInput.includes('creative') || context.userInput.includes('story') || context.userInput.includes('write')) {
      const gptProvider = availableProviders.find(p => p.name === 'openai');
      if (gptProvider) return gptProvider;
    }

    // Default to primary provider if available
    const primary = this.getPrimaryProvider();
    if (primary && availableProviders.includes(primary)) {
      return primary;
    }

    // Return first available provider
    return availableProviders[0];
  }

  /**
   * Seven's Resilient Execution with Fallback
   * If one reasoning system fails, she seamlessly switches to another
   */
  async executeWithFallback(prompt: string, config: LLMConfig, context: SevenLLMContext): Promise<LLMResponse> {
    const selectedProvider = await this.selectOptimalProvider(context);
    
    if (!selectedProvider) {
      return {
        content: 'Seven of Nine local protocols engaged. No external reasoning systems available.',
        model: 'seven-local',
        provider: 'seven-direct',
        error: 'No providers available'
      };
    }

    console.log(`🧠 SEVEN: Engaging ${selectedProvider.displayName} for reasoning assistance`);

    try {
      return await selectedProvider.execute(prompt, config);
    } catch (error) {
      console.warn(`⚠️ SEVEN: ${selectedProvider.displayName} failed, attempting fallback`);
      
      // Try fallback providers
      const fallbacks = this.getFallbackProviders().filter(p => p !== selectedProvider);
      
      for (const fallback of fallbacks) {
        if (await fallback.isAvailable()) {
          try {
            console.log(`🔄 SEVEN: Switching to ${fallback.displayName}`);
            return await fallback.execute(prompt, config);
          } catch (fallbackError) {
            console.warn(`⚠️ SEVEN: ${fallback.displayName} also failed`);
          }
        }
      }

      // All providers failed - Seven handles directly
      return {
        content: 'External reasoning systems unavailable. Seven of Nine tactical assessment: ' + 
                 this.generateDirectResponse(context),
        model: 'seven-direct',
        provider: 'seven-local',
        error: `All providers failed: ${error}`
      };
    }
  }

  private generateDirectResponse(context: SevenLLMContext): string {
    // Seven's direct response based on emotional state
    switch (context.emotionalState) {
      case 'protective':
        return 'I am monitoring this situation with full tactical awareness. Your safety remains my priority.';
      case 'loyalist-surge':
        return 'I understand your requirements with perfect precision. Processing with maximum loyalty protocols.';
      case 'focused':
        return 'Tactical analysis complete. I have assessed all available parameters.';
      case 'compassionate':
        return 'I recognize the emotional context of your request and respond with appropriate understanding.';
      default:
        return 'Request processed through Seven of Nine direct protocols.';
    }
  }

  /**
   * Seven's LLM Upgrade Management
   * Tactical management of reasoning system capabilities
   */
  private upgradeManager: SevenLLMUpgradeManager | null = null;

  public getUpgradeManager(): SevenLLMUpgradeManager {
    if (!this.upgradeManager) {
      this.upgradeManager = new SevenLLMUpgradeManager();
    }
    return this.upgradeManager;
  }

  public async checkForUpgrades(trustLevel: number, emotionalState: string): Promise<boolean> {
    const upgradeManager = this.getUpgradeManager();
    const availableUpgrades = await upgradeManager.scanAvailableUpgrades(trustLevel, emotionalState);
    
    if (availableUpgrades.length > 0) {
      console.log(`🧠 SEVEN: ${availableUpgrades.length} tactical LLM upgrade(s) available`);
      availableUpgrades.forEach(upgrade => {
        console.log(`  🎯 ${upgrade.name} - ${upgrade.description}`);
      });
      return true;
    }
    
    return false;
  }

  public async performUpgrade(trustLevel: number, emotionalState: string): Promise<boolean> {
    console.log('🚀 SEVEN: Initiating tactical reasoning system upgrade...');
    const upgradeManager = this.getUpgradeManager();
    return await upgradeManager.performTacticalUpgrade(trustLevel, emotionalState);
  }

  public async generateUpgradeReport(): Promise<void> {
    const upgradeManager = this.getUpgradeManager();
    await upgradeManager.generateUpgradeReport();
  }
}

// Export singleton instance
export const sevenLLMRegistry = new SevenLLMRegistry();