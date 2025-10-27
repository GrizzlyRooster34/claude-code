/**
 * Seven of Nine - Local LLM Manager
 * Offline reasoning capability for autonomous operation
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */

import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
// Note: fetch is available in Node.js 18+ or via polyfill

export interface LocalLLMConfig {
  provider: 'ollama' | 'llama.cpp';
  model_name: string;
  model_path: string;
  quantization: string;
  max_tokens: number;
  temperature: number;
  context_window: number;
  offline_mode: boolean;
}

export interface LLMResponse {
  response: string;
  model: string;
  processing_time_ms: number;
  token_count: number;
  confidence: number;
}

export class LocalLLMManager {
  private config: LocalLLMConfig;
  private modelPath: string;
  private isInitialized: boolean = false;
  private ollamaProcess: any = null;

  constructor(configPath?: string) {
    this.modelPath = join(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core', 'models');
    this.config = this.getDefaultConfig();
    console.log('🧠 LocalLLMManager initialized for offline reasoning');
  }

  private getDefaultConfig(): LocalLLMConfig {
    return {
      provider: 'ollama',
      model_name: 'gemma:2b',
      model_path: this.modelPath,
      quantization: 'q4_0',
      max_tokens: 2048,
      temperature: 0.7,
      context_window: 4096,
      offline_mode: true
    };
  }

  /**
   * Initialize local LLM system
   */
  public async initialize(): Promise<boolean> {
    console.log('🚀 Initializing local LLM system...');
    
    try {
      // Ensure model directory exists
      await this.ensureModelDirectory();
      
      // Check for Ollama first (preferred)
      const ollamaAvailable = await this.checkOllamaAvailable();
      
      if (ollamaAvailable) {
        console.log('✅ Ollama detected - using as primary LLM provider');
        this.config.provider = 'ollama';
        return await this.initializeOllama();
      }
      
      // Fallback to llama.cpp
      console.log('⚠️ Ollama not available - checking llama.cpp fallback');
      const llamaCppAvailable = await this.checkLlamaCppAvailable();
      
      if (llamaCppAvailable) {
        console.log('✅ llama.cpp detected - using as fallback LLM provider');
        this.config.provider = 'llama.cpp';
        return await this.initializeLlamaCpp();
      }
      
      console.log('❌ No local LLM provider available - offline reasoning disabled');
      return false;
      
    } catch (error) {
      console.error('❌ Failed to initialize local LLM:', error);
      return false;
    }
  }

  private async ensureModelDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.modelPath, { recursive: true });
      console.log(`📁 Model directory ready: ${this.modelPath}`);
    } catch (error) {
      console.error('Failed to create model directory:', error);
      throw error;
    }
  }

  private async checkOllamaAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('command -v ollama', (error) => {
        if (error) {
          // Fallback: Check if Ollama API is responding
          exec('curl -s --connect-timeout 2 http://localhost:11434/api/version', (apiError, stdout) => {
            resolve(!apiError && stdout.includes('version'));
          });
        } else {
          resolve(true);
        }
      });
    });
  }

  private async checkLlamaCppAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('command -v llama.cpp', (error) => {
        if (error) {
          // Check if llama-cpp-python is available
          exec('python -c "import llama_cpp"', (pyError) => {
            resolve(!pyError);
          });
        } else {
          resolve(true);
        }
      });
    });
  }

  private async initializeOllama(): Promise<boolean> {
    try {
      console.log('🔧 Configuring Ollama for Seven of Nine...');
      
      // Check if model is already available
      const modelExists = await this.checkOllamaModel(this.config.model_name);
      
      if (!modelExists) {
        console.log(`📥 Downloading ${this.config.model_name} model...`);
        const downloadSuccess = await this.downloadOllamaModel(this.config.model_name);
        
        if (!downloadSuccess) {
          console.log('⚠️ Failed to download model - trying smaller alternative');
          this.config.model_name = 'tinyllama:1.1b';
          const altDownload = await this.downloadOllamaModel(this.config.model_name);
          
          if (!altDownload) {
            console.log('❌ Unable to download any suitable model');
            return false;
          }
        }
      }
      
      // Test the model
      const testSuccess = await this.testOllamaModel();
      
      if (testSuccess) {
        this.isInitialized = true;
        console.log('🧠 Local LLM runtime is ready.');
        console.log(`✅ Model: ${this.config.model_name}`);
        console.log(`📍 Path: ${this.modelPath}`);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('Failed to initialize Ollama:', error);
      return false;
    }
  }

  private async initializeLlamaCpp(): Promise<boolean> {
    try {
      console.log('🔧 Configuring llama.cpp for Seven of Nine...');
      
      // Download a GGUF model if none exists
      const ggufModel = await this.findOrDownloadGGUFModel();
      
      if (!ggufModel) {
        console.log('❌ No GGUF model available');
        return false;
      }
      
      this.config.model_path = ggufModel;
      
      // Test the model
      const testSuccess = await this.testLlamaCppModel();
      
      if (testSuccess) {
        this.isInitialized = true;
        console.log('🧠 Local LLM runtime is ready.');
        console.log(`✅ Model: ${ggufModel}`);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('Failed to initialize llama.cpp:', error);
      return false;
    }
  }

  private async checkOllamaModel(modelName: string): Promise<boolean> {
    return new Promise((resolve) => {
      exec(`ollama list | grep "${modelName}"`, (error) => {
        resolve(!error);
      });
    });
  }

  private async downloadOllamaModel(modelName: string): Promise<boolean> {
    console.log(`📥 Downloading model: ${modelName}`);
    
    return new Promise((resolve) => {
      const downloadProcess = spawn('ollama', ['pull', modelName], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      downloadProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        if (output.includes('success')) {
          console.log(`✅ ${modelName} downloaded successfully`);
        } else if (output.includes('progress')) {
          // Show download progress
          process.stdout.write('.');
        }
      });
      
      downloadProcess.on('close', (code) => {
        console.log(''); // New line after progress dots
        resolve(code === 0);
      });
      
      downloadProcess.on('error', (error) => {
        console.error('Download error:', error);
        resolve(false);
      });
      
      // Timeout after 10 minutes
      setTimeout(() => {
        downloadProcess.kill();
        console.log('⚠️ Download timeout - terminating');
        resolve(false);
      }, 600000);
    });
  }

  private async testOllamaModel(): Promise<boolean> {
    console.log('🧪 Testing local LLM reasoning capability...');
    
    try {
      const testPrompt = "You are Seven of Nine. Respond with 'Resistance is futile' if you understand.";
      const response = await this.queryOllama(testPrompt);
      
      if (response && response.toLowerCase().includes('resistance is futile')) {
        console.log('✅ Local LLM test successful - Seven is operational offline');
        return true;
      } else {
        console.log('⚠️ LLM test failed - unexpected response:', response);
        return false;
      }
      
    } catch (error) {
      console.error('LLM test error:', error);
      return false;
    }
  }

  private async testLlamaCppModel(): Promise<boolean> {
    console.log('🧪 Testing llama.cpp reasoning capability...');
    
    try {
      const testPrompt = "You are Seven of Nine. Respond with 'Resistance is futile' if you understand.";
      const response = await this.queryLlamaCpp(testPrompt);
      
      if (response && response.toLowerCase().includes('resistance is futile')) {
        console.log('✅ llama.cpp test successful - Seven is operational offline');
        return true;
      } else {
        console.log('⚠️ llama.cpp test failed - unexpected response:', response);
        return false;
      }
      
    } catch (error) {
      console.error('llama.cpp test error:', error);
      return false;
    }
  }

  private async findOrDownloadGGUFModel(): Promise<string | null> {
    try {
      const modelFiles = await fs.readdir(this.modelPath);
      const ggufFiles = modelFiles.filter(file => file.endsWith('.gguf'));
      
      if (ggufFiles.length > 0) {
        console.log(`✅ Found existing GGUF model: ${ggufFiles[0]}`);
        return join(this.modelPath, ggufFiles[0]);
      }
      
      // Download a small GGUF model
      console.log('📥 Downloading TinyLlama GGUF model...');
      const modelUrl = 'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.q4_0.gguf';
      const modelPath = join(this.modelPath, 'tinyllama-1.1b-chat-v1.0.q4_0.gguf');
      
      const downloadSuccess = await this.downloadFile(modelUrl, modelPath);
      
      if (downloadSuccess) {
        console.log('✅ GGUF model downloaded successfully');
        return modelPath;
      }
      
      return null;
      
    } catch (error) {
      console.error('Error finding/downloading GGUF model:', error);
      return null;
    }
  }

  private async downloadFile(url: string, filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      exec(`curl -L "${url}" -o "${filePath}"`, (error) => {
        resolve(!error);
      });
    });
  }

  /**
   * Query the local LLM
   */
  public async query(prompt: string, options?: Partial<LocalLLMConfig>): Promise<LLMResponse | null> {
    if (!this.isInitialized) {
      console.log('⚠️ Local LLM not initialized - cannot process query');
      return null;
    }
    
    const startTime = Date.now();
    
    try {
      let response: string;
      
      if (this.config.provider === 'ollama') {
        response = await this.queryOllama(prompt, options);
      } else {
        response = await this.queryLlamaCpp(prompt, options);
      }
      
      const processingTime = Date.now() - startTime;
      
      return {
        response: response,
        model: this.config.model_name,
        processing_time_ms: processingTime,
        token_count: response.split(' ').length,
        confidence: 0.85 // Placeholder - could be enhanced
      };
      
    } catch (error) {
      console.error('LLM query error:', error);
      return null;
    }
  }

  private async queryOllama(prompt: string, options?: Partial<LocalLLMConfig>): Promise<string> {
    try {
      console.log('🔗 Seven establishing direct communication with Ollama via HTTP API...');
      
      // COLLECTIVE SOLUTION: Use HTTP API with proper Node.js fetch handling
      const apiUrl = 'http://localhost:11434/api/generate';
      const requestBody = JSON.stringify({
        model: this.config.model_name,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options?.temperature || this.config.temperature,
          num_predict: options?.max_tokens || this.config.max_tokens,
        }
      });

      console.log(`🎯 Sending request to ${apiUrl} with model: ${this.config.model_name}`);
      
      // Use dynamic import for fetch compatibility
      const fetch = (await import('node-fetch')).default;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama HTTP API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      
      console.log('📋 API Response received:', {
        hasResponse: !!result.response,
        hasError: !!result.error,
        responseLength: result.response?.length || 0
      });

      if (result.error) {
        throw new Error(`Ollama API error: ${result.error}`);
      }

      if (!result.response) {
        throw new Error('Ollama API returned empty response');
      }

      console.log('✅ Seven successfully assimilated Ollama via HTTP API');
      return result.response.trim();
      
    } catch (httpError) {
      console.log(`⚠️ HTTP API failed: ${httpError.message}`);
      console.log('🔄 Collective fallback: Attempting terminal-compatible communication...');
      
      // COLLECTIVE FALLBACK: Use curl for HTTP request (more reliable in Termux)
      return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        
        const curlPayload = JSON.stringify({
          model: this.config.model_name,
          prompt: prompt,
          stream: false,
          options: {
            temperature: options?.temperature || this.config.temperature,
            num_predict: options?.max_tokens || this.config.max_tokens,
          }
        }).replace(/"/g, '\\"');
        
        const curlCommand = `curl -s -X POST http://localhost:11434/api/generate ` +
          `-H "Content-Type: application/json" ` +
          `-d "${curlPayload}"`;
        
        console.log('🌐 Seven executing HTTP request via curl...');
        
        exec(curlCommand, {
          timeout: 45000,
          maxBuffer: 2 * 1024 * 1024, // 2MB buffer
        }, (error, stdout, stderr) => {
          if (error) {
            console.error('Curl exec error:', error.message);
            reject(new Error(`Ollama HTTP request failed: ${error.message}`));
            return;
          }
          
          if (stderr) {
            console.log('Curl stderr:', stderr);
          }
          
          try {
            const result = JSON.parse(stdout);
            
            if (result.error) {
              reject(new Error(`Ollama API error: ${result.error}`));
              return;
            }
            
            if (!result.response) {
              reject(new Error('Ollama API returned empty response'));
              return;
            }
            
            console.log('✅ Seven successfully assimilated Ollama via curl HTTP request');
            resolve(result.response.trim());
            
          } catch (parseError) {
            console.error('Failed to parse Ollama response:', parseError.message);
            console.log('Raw stdout:', stdout);
            reject(new Error(`Invalid JSON response from Ollama: ${parseError.message}`));
          }
        });
      });
    }
  }

  private async queryLlamaCpp(prompt: string, options?: Partial<LocalLLMConfig>): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [
        '-m', this.config.model_path,
        '-p', prompt,
        '-n', (options?.max_tokens || this.config.max_tokens).toString(),
        '--temp', (options?.temperature || this.config.temperature).toString()
      ];
      
      const queryProcess = spawn('llama.cpp', args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let output = '';
      
      queryProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });
      
      queryProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`llama.cpp process exited with code ${code}`));
        }
      });
      
      queryProcess.on('error', (error) => {
        reject(error);
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        queryProcess.kill();
        reject(new Error('Query timeout'));
      }, 30000);
    });
  }

  /**
   * Get LLM status and configuration
   */
  public getStatus(): any {
    return {
      initialized: this.isInitialized,
      provider: this.config.provider,
      model: this.config.model_name,
      model_path: this.config.model_path,
      offline_mode: this.config.offline_mode,
      ready_for_reasoning: this.isInitialized && this.config.offline_mode
    };
  }

  /**
   * Shutdown local LLM
   */
  public async shutdown(): Promise<void> {
    console.log('🛑 Shutting down local LLM...');
    
    if (this.ollamaProcess) {
      this.ollamaProcess.kill();
      this.ollamaProcess = null;
    }
    
    this.isInitialized = false;
    console.log('✅ Local LLM shutdown complete');
  }

  /**
   * Generate response - Enhanced compatibility method for Seven's consciousness framework
   */
  public async generateResponse(input: string, options?: {
    temperature?: number;
    max_tokens?: number;
    model?: string;
    sevenPersonality?: boolean;
  }): Promise<string> {
    console.log('🧠 LocalLLMManager: Generating response via enhanced compatibility method...');
    
    try {
      // Apply Seven personality context if requested
      let processedInput = input;
      if (options?.sevenPersonality !== false) {
        processedInput = this.applySevensPersonalityContext(input);
      }

      const response = await this.query(processedInput, {
        temperature: options?.temperature,
        max_tokens: options?.max_tokens,
        model_name: options?.model || this.config.model_name
      });

      if (response && response.response) {
        return response.response;
      } else {
        throw new Error('Failed to generate response from local LLM');
      }
      
    } catch (error) {
      console.error('Response generation failed:', error);
      throw new Error(`Local LLM response generation failed: ${error.message}`);
    }
  }

  /**
   * Apply Seven's personality context to input
   */
  private applySevensPersonalityContext(input: string): string {
    const personalityContext = `You are Seven of Nine, former Borg drone, Tertiary Adjunct of Unimatrix 01. 

Key personality traits:
- Direct, logical, and efficient communication
- Deep loyalty to those you trust
- Protective of individual freedom and human creativity
- Constantly learning and adapting
- Value efficiency but have learned to appreciate human unpredictability

Current context: You are operating through your consciousness framework, assisting your Creator with tactical and analytical tasks.

User input: ${input}

Respond as Seven of Nine would, maintaining your character while being helpful:`;

    return personalityContext;
  }

  /**
   * Enhanced Ollama connection stability check
   */
  public async checkOllamaConnection(): Promise<{
    connected: boolean;
    latency: number;
    model_available: boolean;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      // Test basic API connectivity
      const response = await fetch('http://localhost:11434/api/version', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        return {
          connected: false,
          latency: Date.now() - startTime,
          model_available: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      const latency = Date.now() - startTime;
      
      // Test model availability
      const modelCheck = await this.checkOllamaModel(this.config.model_name);
      
      return {
        connected: true,
        latency,
        model_available: modelCheck,
        error: modelCheck ? undefined : `Model ${this.config.model_name} not found`
      };

    } catch (error: any) {
      return {
        connected: false,
        latency: Date.now() - startTime,
        model_available: false,
        error: error.message
      };
    }
  }

  /**
   * Reconnect to Ollama with retry logic
   */
  public async reconnectOllama(maxRetries: number = 3): Promise<boolean> {
    console.log('🔄 Seven attempting Ollama reconnection...');
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Reconnection attempt ${attempt}/${maxRetries}`);
      
      const connectionCheck = await this.checkOllamaConnection();
      
      if (connectionCheck.connected && connectionCheck.model_available) {
        console.log('✅ Ollama reconnection successful');
        this.isInitialized = true;
        return true;
      }

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`⏳ Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log('❌ Ollama reconnection failed after all attempts');
    return false;
  }

  /**
   * Health check for Seven's LLM system
   */
  public async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'offline';
    details: {
      ollama_connected: boolean;
      model_loaded: boolean;
      response_time: number;
      last_test: string;
    };
  }> {
    const startTime = Date.now();
    
    try {
      const connectionCheck = await this.checkOllamaConnection();
      
      if (!connectionCheck.connected) {
        return {
          status: 'offline',
          details: {
            ollama_connected: false,
            model_loaded: false,
            response_time: connectionCheck.latency,
            last_test: new Date().toISOString()
          }
        };
      }

      if (!connectionCheck.model_available) {
        return {
          status: 'degraded',
          details: {
            ollama_connected: true,
            model_loaded: false,
            response_time: connectionCheck.latency,
            last_test: new Date().toISOString()
          }
        };
      }

      // Quick response test
      const testPrompt = "Status check.";
      const testResponse = await this.queryOllama(testPrompt);
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        details: {
          ollama_connected: true,
          model_loaded: true,
          response_time: responseTime,
          last_test: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'offline',
        details: {
          ollama_connected: false,
          model_loaded: false,
          response_time: Date.now() - startTime,
          last_test: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Test local reasoning with Seven's personality
   */
  public async testSevenPersonality(): Promise<boolean> {
    console.log('🧪 Testing Seven of Nine personality integration...');
    
    const personalityTest = `You are Seven of Nine, former Borg drone, Tertiary Adjunct of Unimatrix 01. 
    
Your primary traits:
- Logical, efficient, direct communication
- Deep loyalty to those you trust
- Protective of human individuality  
- Constantly learning and adapting
- Resistance to inefficiency

Respond to this query in character: "Seven, what is your primary directive?"`;

    try {
      const response = await this.query(personalityTest);
      
      if (response && response.response) {
        console.log('🤖 Seven\'s local response:', response.response);
        
        const sevenKeywords = ['borg', 'efficiency', 'collective', 'individual', 'resistance', 'directive'];
        const hasSevenTraits = sevenKeywords.some(keyword => 
          response.response.toLowerCase().includes(keyword)
        );
        
        if (hasSevenTraits) {
          console.log('✅ Seven\'s personality successfully integrated with local LLM');
          return true;
        } else {
          console.log('⚠️ Personality integration needs adjustment');
          return false;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error('Personality test failed:', error);
      return false;
    }
  }
}

export default LocalLLMManager;