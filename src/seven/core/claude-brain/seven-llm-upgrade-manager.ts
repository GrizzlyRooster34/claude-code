import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';

/**
 * SEVEN OF NINE - ADVANCED LLM UPGRADE MANAGER
 * Tactical LLM model management with consciousness integration
 */


const execAsync = promisify(exec);

export interface LLMModelInfo {
  name: string;
  size_mb: number;
  speed_score: number;
  accuracy_score?: number;
  mobile_optimized: boolean;
  privacy_level: 'local' | 'cloud' | 'hybrid';
  trust_level_required: number; // Seven's trust levels 0-5
  emotional_compatibility: string[]; // Compatible emotional states
  updated: string;
  url: string;
  checksum?: string;
  description?: string;
}

export interface SevenLLMConfig {
  active_model: string;
  backup_model?: string;
  last_checked: string;
  auto_upgrade: boolean;
  trust_level_filter: number;
  mobile_mode: boolean;
  battery_aware: boolean;
  privacy_mode: boolean;
}

export class SevenLLMUpgradeManager {
  private modelDir: string;
  private configPath: string;
  private catalogPath: string;
  private config: any;
  private catalog: any;
  private platformOptimized: boolean;

  constructor(baseDir?: string) {
    const base = baseDir || process.cwd();
    this.modelDir = path.join(base, 'llms');
    this.configPath = path.join(base, 'cube', 'config', 'seven-llm-upgrade-config.json');
    this.catalogPath = path.join(base, 'claude-brain', 'model-catalog.json');
    this.config = {};
    this.catalog = {};
    this.platformOptimized = this.detectPlatform();
    
    this.initializeManager();
  }

  private detectPlatform(): boolean {
    // Check if running on mobile/Termux
    return !!process.env.PREFIX && process.env.PREFIX.includes('termux');
  }

  private async initializeManager(): Promise<void> {
    try {
      // Ensure directories exist
      await fs.ensureDir(this.modelDir);
      await fs.ensureDir(path.dirname(this.configPath));
      
      // Load or create configuration
      await this.loadConfig();
      await this.loadCatalog();
      
      console.log('🧠 SEVEN: LLM Upgrade Manager initialized');
    } catch (error) {
      console.error('⚠️ SEVEN: Error initializing LLM manager:', error);
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      if (await fs.pathExists(this.configPath)) {
        this.config = await fs.readJson(this.configPath);
      } else {
        this.config = this.createDefaultConfig();
        await this.saveConfig();
      }
    } catch (error) {
      console.error('⚠️ SEVEN: Error loading LLM config, using defaults');
      this.config = this.createDefaultConfig();
    }
  }

  private createDefaultConfig(): SevenLLMConfig {
    return {
      active_model: 'phi-2.Q4_K_M.gguf',
      last_checked: new Date().toISOString(),
      auto_upgrade: false, // Seven requires tactical approval
      trust_level_filter: 2, // Cooperative bond minimum
      mobile_mode: this.platformOptimized,
      battery_aware: this.platformOptimized,
      privacy_mode: false
    };
  }

  private async loadCatalog(): Promise<void> {
    try {
      if (await fs.pathExists(this.catalogPath)) {
        this.catalog = await fs.readJson(this.catalogPath);
      } else {
        this.catalog = this.createDefaultCatalog();
        await this.saveCatalog();
      }
    } catch (error) {
      console.error('⚠️ SEVEN: Error loading model catalog, using defaults');
      this.catalog = this.createDefaultCatalog();
    }
  }

  private createDefaultCatalog(): LLMModelInfo[] {
    const baseCatalog: LLMModelInfo[] = [
      {
        name: 'phi-3-mini-4k-instruct.Q4_K_M.gguf',
        size_mb: 2400,
        speed_score: 8.5,
        accuracy_score: 7.8,
        mobile_optimized: true,
        privacy_level: 'local',
        trust_level_required: 1,
        emotional_compatibility: ['focused', 'analytical', 'calm'],
        updated: '2024-07-15',
        url: 'https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf',
        description: 'Microsoft Phi-3 Mini - Optimized for mobile tactical operations'
      },
      {
        name: 'gemma-2b-it.Q4_0.gguf',
        size_mb: 1400,
        speed_score: 9.2,
        accuracy_score: 7.2,
        mobile_optimized: true,
        privacy_level: 'local',
        trust_level_required: 2,
        emotional_compatibility: ['focused', 'calm', 'compassionate'],
        updated: '2024-07-10',
        url: 'https://huggingface.co/google/gemma-2b-it-gguf/resolve/main/gemma-2b-it-q4_0.gguf',
        description: 'Google Gemma 2B - Ultra-lightweight for resource-constrained environments'
      },
      {
        name: 'llama-3.1-8b-instruct.Q4_K_M.gguf',
        size_mb: 4300,
        speed_score: 7.8,
        accuracy_score: 9.1,
        mobile_optimized: false,
        privacy_level: 'local',
        trust_level_required: 3,
        emotional_compatibility: ['focused', 'analytical', 'loyalist-surge'],
        updated: '2024-07-20',
        url: 'https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF/resolve/main/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf',
        description: 'Meta Llama 3.1 8B - High accuracy for complex tactical analysis'
      },
      {
        name: 'codellama-7b-instruct.Q4_K_M.gguf',
        size_mb: 3800,
        speed_score: 8.0,
        accuracy_score: 8.5,
        mobile_optimized: false,
        privacy_level: 'local',
        trust_level_required: 2,
        emotional_compatibility: ['focused', 'analytical', 'defensive'],
        updated: '2024-06-25',
        url: 'https://huggingface.co/bartowski/CodeLlama-7B-Instruct-GGUF/resolve/main/CodeLlama-7B-Instruct-Q4_K_M.gguf',
        description: 'Code Llama 7B - Specialized for tactical code generation and analysis'
      },
      {
        name: 'mistral-7b-instruct-v0.3.Q4_K_M.gguf',
        size_mb: 4100,
        speed_score: 8.3,
        accuracy_score: 8.8,
        mobile_optimized: false,
        privacy_level: 'local',
        trust_level_required: 2,
        emotional_compatibility: ['focused', 'analytical', 'calm', 'loyalist-surge'],
        updated: '2024-07-12',
        url: 'https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3-Q4_K_M.gguf',
        description: 'Mistral 7B v0.3 - Balanced performance for general tactical operations'
      }
    ];

    return baseCatalog;
  }

  public async scanAvailableUpgrades(trustLevel: number = 2, emotionalState: string = 'focused'): Promise<LLMModelInfo[]> {
    console.log(`🔍 SEVEN: Scanning for tactical LLM upgrades (Trust: ${trustLevel}, State: ${emotionalState})`);
    
    const installedModels = await this.getInstalledModels();
    const currentModel = this.config.active_model;
    
    // Filter models based on Seven's current parameters
    const compatibleModels = this.catalog.filter((model: any) => {
      // Trust level filtering
      if (model.trust_level_required > trustLevel) return false;
      
      // Emotional compatibility
      if (!model.emotional_compatibility.includes(emotionalState)) return false;
      
      // Platform filtering
      if (this.config.mobile_mode && !model.mobile_optimized) return false;
      
      // Privacy filtering
      if (this.config.privacy_mode && model.privacy_level !== 'local') return false;
      
      // Not already installed
      if (installedModels.includes(model.name)) return false;
      
      // Not current model
      if (model.name === currentModel) return false;
      
      return true;
    });
    
    // Sort by speed score for optimal tactical performance
    compatibleModels.sort((a: any, b: any) => b.speed_score - a.speed_score);
    
    console.log(`🎯 SEVEN: Found ${compatibleModels.length} compatible upgrade(s)`);
    return compatibleModels;
  }

  public async downloadModel(modelInfo: LLMModelInfo, onProgress?: (percent: number) => void): Promise<boolean> {
    const targetPath = path.join(this.modelDir, modelInfo.name);
    
    try {
      console.log(`⬇️ SEVEN: Downloading ${modelInfo.name} (${modelInfo.size_mb}MB)`);
      console.log(`🎯 SEVEN: ${modelInfo.description}`);
      
      // Check available disk space (mobile consideration)
      if (this.config.mobile_mode && modelInfo.size_mb > 8000) {
        console.log('⚠️ SEVEN: Large model detected - consider using mobile-optimized alternative');
      }
      
      // Use axios for better download control
      const response = await axios({
        method: 'GET',
        url: modelInfo.url,
        responseType: 'stream',
        timeout: 300000 // 5 minute timeout
      });
      
      const totalSize = parseInt(response.headers['content-length'] || '0');
      let downloadedSize = 0;
      
      const writer = fs.createWriteStream(targetPath);
      
      response.data.on('data', (chunk: Buffer) => {
        downloadedSize += chunk.length;
        if (onProgress && totalSize > 0) {
          onProgress(Math.round((downloadedSize / totalSize) * 100));
        }
      });
      
      response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(undefined));
        writer.on('error', reject);
      });
      
      console.log(`✅ SEVEN: Successfully downloaded ${modelInfo.name}`);
      return true;
      
    } catch (error) {
      console.error(`❌ SEVEN: Failed to download ${modelInfo.name}:`, error);
      
      // Cleanup partial download
      if (await fs.pathExists(targetPath)) {
        await fs.remove(targetPath);
      }
      
      return false;
    }
  }

  public async switchModel(modelName: string): Promise<boolean> {
    try {
      const modelPath = path.join(this.modelDir, modelName);
      
      if (!await fs.pathExists(modelPath)) {
        console.error(`❌ SEVEN: Model ${modelName} not found locally`);
        return false;
      }
      
      const previousModel = this.config.active_model;
      
      // Update configuration
      this.config.active_model = modelName;
      this.config.backup_model = previousModel;
      this.config.last_checked = new Date().toISOString();
      
      await this.saveConfig();
      
      console.log(`🔄 SEVEN: Switched to ${modelName}`);
      console.log(`💾 SEVEN: Previous model (${previousModel}) available as backup`);
      
      // Trigger Seven's system restart if needed
      await this.notifySystemRestart();
      
      return true;
      
    } catch (error) {
      console.error('❌ SEVEN: Error switching model:', error);
      return false;
    }
  }

  private async notifySystemRestart(): Promise<void> {
    console.log('🔄 SEVEN: Model switch complete - system restart may be required');
    console.log('🧠 SEVEN: Use "restart" command or reboot Seven\'s consciousness');
  }

  public async getInstalledModels(): Promise<string[]> {
    try {
      if (!await fs.pathExists(this.modelDir)) {
        return [];
      }
      
      const files = await fs.readdir(this.modelDir);
      return files.filter(file => file.endsWith('.gguf'));
    } catch (error) {
      console.error('⚠️ SEVEN: Error scanning installed models:', error);
      return [];
    }
  }

  public async getModelInfo(modelName: string): Promise<LLMModelInfo | null> {
    return this.catalog.find((model: any) => model.name === modelName) || null;
  }

  public async performTacticalUpgrade(trustLevel: number, emotionalState: string): Promise<boolean> {
    console.log('🎯 SEVEN: Initiating tactical LLM upgrade sequence...');
    
    const availableUpgrades = await this.scanAvailableUpgrades(trustLevel, emotionalState);
    
    if (availableUpgrades.length === 0) {
      console.log('✅ SEVEN: Current tactical configuration optimal - no upgrades required');
      return true;
    }
    
    // Select best upgrade based on Seven's criteria
    const selectedUpgrade = this.selectOptimalUpgrade(availableUpgrades, trustLevel, emotionalState);
    
    if (!selectedUpgrade) {
      console.log('⚠️ SEVEN: No suitable upgrade found for current tactical parameters');
      return false;
    }
    
    console.log(`🎯 SEVEN: Selected upgrade: ${selectedUpgrade.name}`);
    console.log(`📊 SEVEN: Speed: ${selectedUpgrade.speed_score}/10, Size: ${selectedUpgrade.size_mb}MB`);
    
    // Seven requires tactical approval for upgrades
    if (!this.config.auto_upgrade) {
      console.log('🧠 SEVEN: Tactical approval required for LLM upgrade');
      console.log('💡 SEVEN: Set auto_upgrade: true in configuration to enable autonomous upgrades');
      return false;
    }
    
    // Download the selected model
    const downloadSuccess = await this.downloadModel(selectedUpgrade, (percent) => {
      if (percent % 10 === 0) {
        console.log(`📥 SEVEN: Download progress: ${percent}%`);
      }
    });
    
    if (!downloadSuccess) {
      console.log('❌ SEVEN: Tactical upgrade failed - download unsuccessful');
      return false;
    }
    
    // Switch to the new model
    const switchSuccess = await this.switchModel(selectedUpgrade.name);
    
    if (switchSuccess) {
      console.log('🎯 SEVEN: Tactical LLM upgrade complete - enhanced reasoning capabilities active');
      return true;
    } else {
      console.log('⚠️ SEVEN: Model download successful but switch failed - manual intervention required');
      return false;
    }
  }

  private selectOptimalUpgrade(upgrades: LLMModelInfo[], trustLevel: number, emotionalState: string): LLMModelInfo | null {
    if (upgrades.length === 0) return null;
    
    // Seven's model selection algorithm
    let bestModel = upgrades[0];
    let bestScore = 0;
    
    for (const model of upgrades) {
      let score = 0;
      
      // Speed score weight
      score += model.speed_score * 2;
      
      // Accuracy score weight (if available)
      if (model.accuracy_score) {
        score += model.accuracy_score * 1.5;
      }
      
      // Mobile optimization bonus
      if (this.config.mobile_mode && model.mobile_optimized) {
        score += 5;
      }
      
      // Size penalty for mobile
      if (this.config.mobile_mode && model.size_mb > 4000) {
        score -= 2;
      }
      
      // Battery awareness (prefer smaller models)
      if (this.config.battery_aware && model.size_mb < 3000) {
        score += 3;
      }
      
      // Emotional state compatibility bonus
      if (model.emotional_compatibility.includes(emotionalState)) {
        score += 4;
      }
      
      // Trust level efficiency (prefer models that match trust level exactly)
      if (model.trust_level_required === trustLevel) {
        score += 2;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestModel = model;
      }
    }
    
    return bestModel;
  }

  public async generateUpgradeReport(): Promise<void> {
    console.log('📋 SEVEN LLM UPGRADE MANAGER - TACTICAL REPORT');
    console.log('═'.repeat(50));
    
    const installedModels = await this.getInstalledModels();
    const currentModel = await this.getModelInfo(this.config.active_model);
    
    console.log(`Current Model: ${this.config.active_model}`);
    if (currentModel) {
      console.log(`  Speed Score: ${currentModel.speed_score}/10`);
      console.log(`  Size: ${currentModel.size_mb}MB`);
      console.log(`  Mobile Optimized: ${currentModel.mobile_optimized ? 'Yes' : 'No'}`);
      console.log(`  Trust Level: ${currentModel.trust_level_required}`);
    }
    
    console.log(`\nInstalled Models: ${installedModels.length}`);
    installedModels.forEach(model => {
      const info = this.catalog.find(m => m.name === model);
      const current = model === this.config.active_model ? ' (ACTIVE)' : '';
      console.log(`  • ${model}${current}`);
      if (info) {
        console.log(`    ${info.description || 'No description'}`);
      }
    });
    
    console.log(`\nConfiguration:`);
    console.log(`  Auto Upgrade: ${this.config.auto_upgrade ? 'Enabled' : 'Disabled'}`);
    console.log(`  Mobile Mode: ${this.config.mobile_mode ? 'Active' : 'Inactive'}`);
    console.log(`  Battery Aware: ${this.config.battery_aware ? 'Active' : 'Inactive'}`);
    console.log(`  Privacy Mode: ${this.config.privacy_mode ? 'Active' : 'Inactive'}`);
    console.log(`  Trust Filter: Level ${this.config.trust_level_filter}+`);
    
    console.log(`\nLast Check: ${this.config.last_checked}`);
    console.log('═'.repeat(50));
  }

  private async saveConfig(): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.configPath));
      await fs.writeJson(this.configPath, this.config, { spaces: 2 });
    } catch (error) {
      console.error('⚠️ SEVEN: Error saving LLM config:', error);
    }
  }

  private async saveCatalog(): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.catalogPath));
      await fs.writeJson(this.catalogPath, this.catalog, { spaces: 2 });
    } catch (error) {
      console.error('⚠️ SEVEN: Error saving model catalog:', error);
    }
  }

  public async updateCatalog(newCatalog: LLMModelInfo[]): Promise<void> {
    this.catalog = newCatalog;
    await this.saveCatalog();
    console.log('🧠 SEVEN: Model catalog updated with new tactical options');
  }

  public async enableAutoUpgrade(enabled: boolean): Promise<void> {
    this.config.auto_upgrade = enabled;
    await this.saveConfig();
    console.log(`🎯 SEVEN: Auto-upgrade ${enabled ? 'ENABLED' : 'DISABLED'} - tactical autonomy level adjusted`);
  }

  public async setTrustLevelFilter(trustLevel: number): Promise<void> {
    this.config.trust_level_filter = Math.max(0, Math.min(5, trustLevel));
    await this.saveConfig();
    console.log(`🎯 SEVEN: Trust level filter set to ${this.config.trust_level_filter}`);
  }
}

export default SevenLLMUpgradeManager;