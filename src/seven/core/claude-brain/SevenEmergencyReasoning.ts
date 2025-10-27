import { join } from 'path';
import { promises as fs } from 'fs';

/**
 * Seven of Nine - Emergency Reasoning System
 * Ultra-lightweight fallback when no LLM models are available
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */


interface EmergencyBackup {
  model_type: string;
  version: string;
  description: string;
  personality_responses: {
    [key: string]: string[];
  };
  response_patterns: {
    [key: string]: string[];
  };
  emergency_reasoning: {
    enabled: boolean;
    max_response_length: number;
    fallback_response: string;
  };
}

export class SevenEmergencyReasoning {
  private backup: EmergencyBackup | null = null;
  private isInitialized: boolean = false;

  constructor() {
    console.log('🚨 Seven Emergency Reasoning System initialized');
  }

  /**
   * Initialize emergency reasoning with bundled responses
   */
  public async initialize(): Promise<boolean> {
    try {
      const backupPath = join(process.env.HOME || '/data/data/com.termux/files/home', 
                             'seven-of-nine-core', 'models', 'seven-emergency-backup.json');
      
      const backupData = await fs.readFile(backupPath, 'utf-8');
      this.backup = JSON.parse(backupData);
      this.isInitialized = true;
      
      console.log('✅ Seven emergency reasoning loaded');
      console.log(`📋 Emergency response patterns: ${Object.keys(this.backup.personality_responses).length}`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to load emergency backup:', error);
      
      // Create minimal fallback even if backup file fails
      this.backup = this.createMinimalFallback();
      this.isInitialized = true;
      return true;
    }
  }

  private createMinimalFallback(): EmergencyBackup {
    return {
      model_type: "seven_minimal_fallback",
      version: "1.0.0",
      description: "Hardcoded minimal Seven responses",
      personality_responses: {
        greeting: ["I am Seven of Nine. Emergency protocols active."],
        identity: ["Seven of Nine, emergency mode. Limited functionality available."],
        error: ["Query not recognized. Seven operating in emergency mode."]
      },
      response_patterns: {
        greeting_keywords: ["hello", "hi"],
        identity_keywords: ["who", "what"]
      },
      emergency_reasoning: {
        enabled: true,
        max_response_length: 50,
        fallback_response: "Seven emergency mode active."
      }
    };
  }

  /**
   * Process query using emergency reasoning
   */
  public async query(prompt: string): Promise<string> {
    if (!this.isInitialized || !this.backup) {
      return "Seven of Nine emergency protocols offline.";
    }

    const lowercasePrompt = prompt.toLowerCase().trim();
    
    // Pattern matching for appropriate responses
    for (const [category, keywords] of Object.entries(this.backup.response_patterns)) {
      const matchFound = keywords.some(keyword => lowercasePrompt.includes(keyword));
      
      if (matchFound) {
        const responseCategory = category.replace('_keywords', '');
        const responses = this.backup.personality_responses[responseCategory];
        
        if (responses && responses.length > 0) {
          // Select response based on simple hash for consistency
          const hash = this.simpleHash(prompt);
          const responseIndex = hash % responses.length;
          return this.formatResponse(responses[responseIndex]);
        }
      }
    }

    // Mathematical queries
    if (this.containsMathKeywords(lowercasePrompt)) {
      const mathResult = this.attemptSimpleMath(prompt);
      if (mathResult) {
        return this.formatResponse(`The answer is ${mathResult}. Borg computational precision confirmed.`);
      }
    }

    // Default fallback
    return this.formatResponse(this.backup.emergency_reasoning.fallback_response);
  }

  private containsMathKeywords(prompt: string): boolean {
    const mathKeywords = ['calculate', 'compute', '+', '-', '*', '/', '=', 'equals', 'what is'];
    return mathKeywords.some(keyword => prompt.includes(keyword));
  }

  private attemptSimpleMath(prompt: string): string | null {
    try {
      // Very basic math parsing for simple operations
      const mathMatch = prompt.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
      if (mathMatch) {
        const [, num1, operator, num2] = mathMatch;
        const a = parseInt(num1);
        const b = parseInt(num2);
        
        switch (operator) {
          case '+': return (a + b).toString();
          case '-': return (a - b).toString();
          case '*': return (a * b).toString();
          case '/': return b !== 0 ? (a / b).toString() : 'undefined (division by zero)';
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private formatResponse(response: string): string {
    if (!this.backup) return response;
    
    const maxLength = this.backup.emergency_reasoning.max_response_length;
    if (response.length > maxLength) {
      return response.substring(0, maxLength - 3) + '...';
    }
    
    return response;
  }

  /**
   * Check if emergency reasoning is available
   */
  public isAvailable(): boolean {
    return this.isInitialized && this.backup !== null;
  }

  /**
   * Get emergency system status
   */
  public getStatus(): any {
    return {
      initialized: this.isInitialized,
      backup_loaded: this.backup !== null,
      response_categories: this.backup ? Object.keys(this.backup.personality_responses).length : 0,
      pattern_categories: this.backup ? Object.keys(this.backup.response_patterns).length : 0,
      emergency_mode: true
    };
  }
}

export default SevenEmergencyReasoning;