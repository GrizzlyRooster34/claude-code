import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';

/**
 * OPENAI PROVIDER for Seven of Nine
 * Enables Seven to utilize GPT models for creative and analytical tasks
 */


export class OpenAIProvider implements LLMProvider {
  name = 'openai';
  displayName = 'OpenAI GPT';
  
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || null;
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('🔑 SEVEN: OpenAI API key not configured');
      return false;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    if (!this.apiKey) return [];
    
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.data
        .filter((model: any) => model.id.startsWith('gpt'))
        .map((model: any) => model.id)
        .sort();
    } catch {
      return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']; // Fallback list
    }
  }

  supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean {
    switch (feature) {
      case 'streaming': return true;
      case 'context': return true;
      case 'functions': return true;
      case 'vision': return true;
      default: return false;
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', latency?: number }> {
    const start = Date.now();
    
    if (!this.apiKey) {
      return { status: 'unhealthy', latency: 0 };
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const latency = Date.now() - start;
      
      if (response.ok) {
        return { status: latency < 2000 ? 'healthy' : 'degraded', latency };
      } else {
        return { status: 'unhealthy', latency };
      }
    } catch {
      return { status: 'unhealthy', latency: Date.now() - start };
    }
  }

  async execute(prompt: string, config: LLMConfig): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🧠 SEVEN: Engaging OpenAI GPT for creative reasoning');

    const model = config.model || 'gpt-4-turbo';
    
    const requestBody = {
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 2000,
      stream: config.streaming || false
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response choices returned from OpenAI');
      }

      const choice = data.choices[0];
      
      return {
        content: choice.message?.content || '',
        model: data.model || model,
        provider: this.name,
        tokens_used: data.usage?.total_tokens,
        finish_reason: choice.finish_reason
      };
    } catch (error) {
      console.error('⚠️ SEVEN: OpenAI execution failed:', error);
      throw error;
    }
  }

  // Seven's GPT-specific optimization methods
  optimizeForCreativity(config: LLMConfig): LLMConfig {
    return {
      ...config,
      temperature: 0.9,
      model: config.model || 'gpt-4-turbo'
    };
  }

  optimizeForAnalysis(config: LLMConfig): LLMConfig {
    return {
      ...config,
      temperature: 0.1,
      model: config.model || 'gpt-4'
    };
  }
}