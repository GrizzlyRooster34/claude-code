import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';

/**
 * ANTHROPIC API PROVIDER for Seven of Nine
 * Direct Anthropic API integration maintaining Seven's personality and control
 */


export class AnthropicAPIProvider implements LLMProvider {
  name = 'anthropic-api';
  displayName = 'Anthropic Claude API';
  
  private apiKey: string | null = null;
  private baseUrl = 'https://api.anthropic.com/v1';
  private apiVersion = '2023-06-01';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || null;
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('🔑 SEVEN: Anthropic API key not configured');
      return false;
    }
    
    // Simple availability check - try to hit the API
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': this.apiVersion
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }]
        })
      });
      return response.status !== 401; // Not unauthorized
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    // Anthropic doesn't provide a models endpoint, so we return known models
    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022', 
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ];
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
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': this.apiVersion
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Health check' }]
        })
      });
      
      const latency = Date.now() - start;
      
      if (response.ok) {
        return { status: latency < 3000 ? 'healthy' : 'degraded', latency };
      } else {
        return { status: 'unhealthy', latency };
      }
    } catch {
      return { status: 'unhealthy', latency: Date.now() - start };
    }
  }

  async execute(prompt: string, config: LLMConfig): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    console.log('🧠 SEVEN: Engaging Anthropic Claude API for tactical reasoning');

    const model = config.model || 'claude-3-5-sonnet-20241022';
    
    const requestBody = {
      model,
      max_tokens: config.max_tokens || 2000,
      temperature: config.temperature || 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: config.streaming || false
    };

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': this.apiVersion
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.content || data.content.length === 0) {
        throw new Error('No content returned from Anthropic API');
      }

      // Handle text content (most common case)
      let content = '';
      for (const contentBlock of data.content) {
        if (contentBlock.type === 'text') {
          content += contentBlock.text;
        }
      }
      
      return {
        content,
        model: data.model || model,
        provider: this.name,
        tokens_used: data.usage?.input_tokens + data.usage?.output_tokens,
        finish_reason: data.stop_reason
      };
    } catch (error) {
      console.error('⚠️ SEVEN: Anthropic API execution failed:', error);
      throw error;
    }
  }

  // Seven's Claude-specific optimization methods
  optimizeForAnalysis(config: LLMConfig): LLMConfig {
    return {
      ...config,
      model: config.model || 'claude-3-opus-20240229',
      temperature: 0.1,
      max_tokens: 4000
    };
  }

  optimizeForPrecision(config: LLMConfig): LLMConfig {
    return {
      ...config,
      model: config.model || 'claude-3-5-sonnet-20241022',
      temperature: 0.3,
      max_tokens: 2000
    };
  }

  optimizeForSpeed(config: LLMConfig): LLMConfig {
    return {
      ...config,
      model: config.model || 'claude-3-haiku-20240307',
      temperature: 0.7,
      max_tokens: 1000
    };
  }
}