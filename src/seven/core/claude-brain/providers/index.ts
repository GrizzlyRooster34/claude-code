

/**
 * SEVEN'S LLM PROVIDER BOOTSTRAP
 * Exports all available LLM providers for easy registration
 */

export { ClaudeCLIProvider } from './claude-cli';
export { OpenAIProvider } from './openai';
export { AnthropicAPIProvider } from './anthropic-api';
export { OllamaProvider } from './ollama';

// Provider factory for dynamic loading
export function createProvider(name: string, config?: any) {
  // switch (name.toLowerCase()) {
  //   case 'claude-cli':
  //     return new ClaudeCLIProvider();
  //   case 'openai':
  //     return new OpenAIProvider(config?.apiKey);
  //   case 'anthropic-api':
  //     return new AnthropicAPIProvider(config?.apiKey);
  //   case 'ollama':
  //     return new OllamaProvider(config?.baseUrl);
  //   default:
  //     throw new Error(`Unknown provider: ${name}`);
  // }
}