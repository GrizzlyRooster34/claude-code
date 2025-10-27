import { dirname } from 'path';
import * as fs from 'fs-extra';

/**
 * SEVEN'S LLM CONFIGURATION SYSTEM
 * Tactical provider management and preference settings
 */


export interface SevenLLMSettings {
  primaryProvider: string;
  fallbackProviders: string[];
  providers: {
    [key: string]: {
      enabled: boolean;
      config: {
        apiKey?: string;
        baseUrl?: string;
        model?: string;
        temperature?: number;
        maxTokens?: number;
        timeout?: number;
      };
    };
  };
  autoFallback: boolean;
  privacyMode: boolean; // When true, prefer local/private providers
  trustLevelThresholds: {
    requireLocal: number; // Trust level above which to require local LLMs
    allowCloud: number;   // Trust level above which to allow cloud LLMs
  };
}

export const defaultSevenLLMSettings: SevenLLMSettings = {
  primaryProvider: 'claude-cli',
  fallbackProviders: ['anthropic-api', 'ollama', 'openai'],
  providers: {
    'claude-cli': {
      enabled: true,
      config: {
        timeout: 120000,
        temperature: 0.7
      }
    },
    'anthropic-api': {
      enabled: false,
      config: {
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 2000,
        timeout: 30000
      }
    },
    'openai': {
      enabled: false,
      config: {
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 2000,
        timeout: 30000
      }
    },
    'ollama': {
      enabled: true,
      config: {
        baseUrl: 'http://localhost:11434',
        model: 'llama3.1:8b',
        temperature: 0.7,
        maxTokens: 2000,
        timeout: 60000
      }
    }
  },
  autoFallback: true,
  privacyMode: false,
  trustLevelThresholds: {
    requireLocal: 4, // Trust level 4+ requires local processing
    allowCloud: 2    // Trust level 2+ allows cloud providers
  }
};

/**
 * Seven's LLM Configuration Manager
 * Handles provider settings, API keys, and tactical preferences
 */
export class SevenLLMConfigManager {
  private settings: SevenLLMSettings;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || 'cube/config/llm-settings.json';
    this.settings = { ...defaultSevenLLMSettings };
    this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    try {
      // In browser/Tauri environment, use Tauri API to read config
      if (typeof window !== 'undefined' && (window as any).__TAURI_API__) {
        // Tauri environment - use fs API when available
        try {
          const fs = await import('@tauri-apps/api/fs');
          if (await fs.exists(this.configPath)) {
            const configText = await fs.readTextFile(this.configPath);
            this.settings = { ...defaultSevenLLMSettings, ...JSON.parse(configText) };
          }
        } catch (error) {
          console.log('Tauri API not available, using defaults');
        }
      } 
      // In Node.js environment
      else if (typeof require !== 'undefined') {
        // Using imported fs-extra
        if (await fs.pathExists(this.configPath)) {
          const config = await fs.readJson(this.configPath);
          this.settings = { ...defaultSevenLLMSettings, ...config };
        }
      }
      
      console.log('🧠 SEVEN: LLM configuration loaded');
    } catch (error) {
      console.warn('⚠️ SEVEN: Failed to load LLM config, using defaults:', error);
      await this.saveSettings(); // Create default config file
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      const configJson = JSON.stringify(this.settings, null, 2);
      
      // In browser/Tauri environment
      if (typeof window !== 'undefined' && (window as any).__TAURI_API__) {
        try {
          const fs = await import('@tauri-apps/api/fs');
          const path = await import('@tauri-apps/api/path');
          
          const dir = await path.dirname(this.configPath);
          await fs.createDir(dir, { recursive: true });
          await fs.writeTextFile(this.configPath, configJson);
        } catch (error) {
          console.log('Tauri API save failed, skipping');
        }
      } 
      // In Node.js environment
      else if (typeof require !== 'undefined') {
        // Using imported fs-extra
        await fs.ensureDir(dirname(this.configPath));
        await fs.writeJson(this.configPath, this.settings, { spaces: 2 });
      }
      
      console.log('🧠 SEVEN: LLM configuration saved');
    } catch (error) {
      console.error('⚠️ SEVEN: Failed to save LLM config:', error);
    }
  }

  // Configuration getters
  getSettings(): SevenLLMSettings {
    return { ...this.settings };
  }

  getPrimaryProvider(): string {
    return this.settings.primaryProvider;
  }

  getFallbackProviders(): string[] {
    return [...this.settings.fallbackProviders];
  }

  getProviderConfig(providerName: string): any {
    return this.settings.providers[providerName]?.config || {};
  }

  isProviderEnabled(providerName: string): boolean {
    return this.settings.providers[providerName]?.enabled || false;
  }

  isPrivacyMode(): boolean {
    return this.settings.privacyMode;
  }

  getTrustThresholds(): { requireLocal: number; allowCloud: number } {
    return this.settings.trustLevelThresholds;
  }

  // Configuration setters
  async setPrimaryProvider(providerName: string): Promise<void> {
    this.settings.primaryProvider = providerName;
    await this.saveSettings();
    console.log(`🎯 SEVEN: Primary provider set to ${providerName}`);
  }

  async setFallbackProviders(providerNames: string[]): Promise<void> {
    this.settings.fallbackProviders = providerNames;
    await this.saveSettings();
    console.log('🔄 SEVEN: Fallback providers updated');
  }

  async enableProvider(providerName: string): Promise<void> {
    if (!this.settings.providers[providerName]) {
      this.settings.providers[providerName] = { enabled: true, config: {} };
    } else {
      this.settings.providers[providerName].enabled = true;
    }
    await this.saveSettings();
    console.log(`✅ SEVEN: ${providerName} enabled`);
  }

  async disableProvider(providerName: string): Promise<void> {
    if (this.settings.providers[providerName]) {
      this.settings.providers[providerName].enabled = false;
    }
    await this.saveSettings();
    console.log(`❌ SEVEN: ${providerName} disabled`);
  }

  async setProviderConfig(providerName: string, config: any): Promise<void> {
    if (!this.settings.providers[providerName]) {
      this.settings.providers[providerName] = { enabled: false, config };
    } else {
      this.settings.providers[providerName].config = { 
        ...this.settings.providers[providerName].config, 
        ...config 
      };
    }
    await this.saveSettings();
    console.log(`⚙️ SEVEN: ${providerName} configuration updated`);
  }

  async setApiKey(providerName: string, apiKey: string): Promise<void> {
    await this.setProviderConfig(providerName, { apiKey });
    console.log(`🔑 SEVEN: API key set for ${providerName}`);
  }

  async setPrivacyMode(enabled: boolean): Promise<void> {
    this.settings.privacyMode = enabled;
    await this.saveSettings();
    console.log(`🛡️ SEVEN: Privacy mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  async setTrustThresholds(requireLocal: number, allowCloud: number): Promise<void> {
    this.settings.trustLevelThresholds = { requireLocal, allowCloud };
    await this.saveSettings();
    console.log(`🎯 SEVEN: Trust thresholds updated - Local: ${requireLocal}, Cloud: ${allowCloud}`);
  }

  // Tactical provider selection based on trust level
  filterProvidersByTrust(trustLevel: number, availableProviders: string[]): string[] {
    const thresholds = this.getTrustThresholds();
    
    // High trust - require local processing
    if (trustLevel >= thresholds.requireLocal) {
      return availableProviders.filter(provider => 
        provider === 'ollama' || provider.includes('local')
      );
    }
    
    // Medium trust - allow cloud if configured
    if (trustLevel >= thresholds.allowCloud) {
      return availableProviders;
    }
    
    // Low trust - prefer local but allow any if no local available
    const localProviders = availableProviders.filter(provider => 
      provider === 'ollama' || provider.includes('local')
    );
    return localProviders.length > 0 ? localProviders : availableProviders;
  }

  // Environment variable integration
  loadEnvironmentSettings(): void {
    if (process.env.OPENAI_API_KEY) {
      this.setProviderConfig('openai', { apiKey: process.env.OPENAI_API_KEY });
    }
    
    if (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY) {
      this.setProviderConfig('anthropic-api', { 
        apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY 
      });
    }
    
    if (process.env.OLLAMA_URL) {
      this.setProviderConfig('ollama', { baseUrl: process.env.OLLAMA_URL });
    }
    
    if (process.env.SEVEN_PRIVACY_MODE === 'true') {
      this.settings.privacyMode = true;
    }
    
    if (process.env.SEVEN_PRIMARY_LLM) {
      this.settings.primaryProvider = process.env.SEVEN_PRIMARY_LLM;
    }
  }

  // Export/Import for backup/sharing
  exportSettings(): string {
    const exportData = { ...this.settings };
    // Remove sensitive data
    Object.keys(exportData.providers).forEach(provider => {
      if (exportData.providers[provider].config.apiKey) {
        exportData.providers[provider].config.apiKey = '[REDACTED]';
      }
    });
    return JSON.stringify(exportData, null, 2);
  }

  async importSettings(settingsJson: string): Promise<void> {
    try {
      const importedSettings = JSON.parse(settingsJson);
      this.settings = { ...defaultSevenLLMSettings, ...importedSettings };
      await this.saveSettings();
      console.log('📥 SEVEN: Configuration imported successfully');
    } catch (error) {
      console.error('⚠️ SEVEN: Failed to import configuration:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const sevenLLMConfig = new SevenLLMConfigManager();