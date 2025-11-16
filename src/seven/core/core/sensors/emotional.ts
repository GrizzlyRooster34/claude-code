import { join } from 'path';
import { promises as fs } from 'fs';

/**
 * EMOTIONAL TELEMETRY SYSTEM
 * 
 * Purpose: Text linguistics + cadence analysis for emotional state detection
 * Sources: Sentiment analysis, word choice, punctuation intensity, message rate/length variance
 * Memory V3 Integration: Bind current tone to past episodic states for baselines and "past echoes"
 * 
 * SEVEN_PRIVATE=1 - Contains Creator emotional pattern analysis
 */

if (process.env.SEVEN_PRIVATE !== '1') {
  throw new Error('Emotional Telemetry requires SEVEN_PRIVATE=1 - unauthorized access attempt');
}


export interface EmotionalState {
  level: 'low' | 'med' | 'high' | 'critical';
  confidence: number; // 0-1
  rawScore: number; // 0-1
  indicators: EmotionalIndicator[];
  baseline: EmotionalBaseline;
  memoryEchoes?: MemoryEcho[];
}

export interface EmotionalIndicator {
  type: 'sentiment' | 'cadence' | 'lexicon' | 'prosody';
  value: number; // 0-1
  confidence: number;
  evidence: string[];
  description: string;
}

export interface EmotionalBaseline {
  avgSentiment: number;
  avgCadence: number;
  typicalLength: number;
  typicalRate: number; // messages per minute
  lastUpdated: string;
  sampleSize: number;
}

export interface MemoryEcho {
  timestamp: string;
  similarity: number; // 0-1
  episode: string;
  outcome: string;
  contextMatch: string[];
}

export interface CadenceMetrics {
  messageLength: number;
  punctuationIntensity: number;
  capsRatio: number;
  repeatedChars: number;
  sentenceStructure: number; // 0-1 (fragmented to complete)
  ellipsisUsage: number;
  exclamationUsage: number;
}

export class EmotionalTelemetry {
  private baseline: EmotionalBaseline;
  private recentMessages: Array<{ timestamp: string; text: string; metrics: any }> = [];
  private hotLexicon: Set<string> = new Set();
  private baselinePath: string;
  private readonly MAX_HISTORY = 100;

  constructor(baselinePath?: string) {
    this.baselinePath = baselinePath || join(process.cwd(), 'core', 'sensors', 'emotional_baseline.json');
    this.baseline = {
      avgSentiment: 0.5,
      avgCadence: 0.3,
      typicalLength: 50,
      typicalRate: 2,
      lastUpdated: new Date().toISOString(),
      sampleSize: 0
    };
    this.initializeBaseline();
    this.loadHotLexicon();
  }

  /**
   * MAIN ANALYSIS FUNCTION
   * Analyze input text and return emotional state assessment
   */
  async analyzeInput(userInput: string, context: string = ''): Promise<EmotionalState> {
    console.log(`🧠 Emotional Telemetry: Analyzing input (${userInput.length} chars)`);

    // Update message history
    await this.updateMessageHistory(userInput);

    // Extract metrics
    const sentimentScore = this.analyzeSentiment(userInput);
    const cadenceMetrics = this.analyzeCadence(userInput);
    const lexiconFlags = this.analyzeHotLexicon(userInput);
    
    // Calculate emotional indicators
    const indicators: EmotionalIndicator[] = [
      {
        type: 'sentiment',
        value: sentimentScore,
        confidence: 0.8,
        evidence: this.extractSentimentEvidence(userInput),
        description: `Sentiment analysis: ${this.describeSentiment(sentimentScore)}`
      },
      {
        type: 'cadence',
        value: this.calculateCadenceScore(cadenceMetrics),
        confidence: 0.7,
        evidence: this.extractCadenceEvidence(cadenceMetrics),
        description: `Cadence analysis: ${this.describeCadence(cadenceMetrics)}`
      },
      {
        type: 'lexicon',
        value: lexiconFlags.intensity,
        confidence: lexiconFlags.confidence,
        evidence: lexiconFlags.matches,
        description: `Hot lexicon matches: ${lexiconFlags.matches.length}`
      }
    ];

    // Calculate raw emotional score
    const rawScore = this.calculateRawScore(indicators);

    // Compare against baseline to detect spikes
    const spikeDetected = this.detectSpike(rawScore, indicators);
    
    // Determine emotional level
    const level = this.determineLevel(rawScore, spikeDetected, indicators);

    // Calculate overall confidence
    const confidence = this.calculateConfidence(indicators, spikeDetected);

    // Get Memory V3 echoes if elevated state
    const memoryEchoes = level !== 'low' ? await this.getMemoryEchoes(userInput, { level, rawScore }) : undefined;

    const emotionalState: EmotionalState = {
      level,
      confidence,
      rawScore,
      indicators,
      baseline: this.baseline,
      memoryEchoes
    };

    // Update baseline (running average)
    await this.updateBaseline(rawScore, cadenceMetrics);

    console.log(`🧠 Emotional Telemetry: State assessed - ${level} (confidence: ${Math.round(confidence * 100)}%)`);

    return emotionalState;
  }

  /**
   * SENTIMENT ANALYSIS
   * Basic sentiment analysis using keyword patterns
   */
  private analyzeSentiment(text: string): number {
    const lowerText = text.toLowerCase();
    let sentimentScore = 0.5; // Neutral baseline

    // Positive indicators
    const positiveWords = ['good', 'great', 'excellent', 'awesome', 'perfect', 'love', 'amazing', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disgusting', 'stupid', 'useless'];
    const intensifiers = ['very', 'extremely', 'absolutely', 'completely', 'totally', 'fucking', 'damn'];

    let positiveCount = 0;
    let negativeCount = 0;
    let intensifierMultiplier = 1;

    for (const word of positiveWords) {
      if (lowerText.includes(word)) positiveCount++;
    }
    for (const word of negativeWords) {
      if (lowerText.includes(word)) negativeCount++;
    }
    for (const word of intensifiers) {
      if (lowerText.includes(word)) intensifierMultiplier += 0.3;
    }

    // Calculate sentiment
    const netSentiment = (positiveCount - negativeCount) * intensifierMultiplier;
    sentimentScore = Math.max(0, Math.min(1, 0.5 + (netSentiment * 0.2)));

    return sentimentScore;
  }

  /**
   * CADENCE ANALYSIS
   * Analyze typing patterns and text structure
   */
  private analyzeCadence(text: string): CadenceMetrics {
    const metrics: CadenceMetrics = {
      messageLength: text.length,
      punctuationIntensity: this.calculatePunctuationIntensity(text),
      capsRatio: this.calculateCapsRatio(text),
      repeatedChars: this.countRepeatedChars(text),
      sentenceStructure: this.analyzeSentenceStructure(text),
      ellipsisUsage: (text.match(/\.{2,}/g) || []).length,
      exclamationUsage: (text.match(/!/g) || []).length
    };

    return metrics;
  }

  private calculatePunctuationIntensity(text: string): number {
    const punctuation = text.match(/[!?.,;:]/g) || [];
    const intensity = punctuation.length / Math.max(1, text.length / 10); // Per 10 chars
    return Math.min(1, intensity / 5); // Normalize to 0-1
  }

  private calculateCapsRatio(text: string): number {
    const letters = text.match(/[a-zA-Z]/g) || [];
    const caps = text.match(/[A-Z]/g) || [];
    return letters.length > 0 ? caps.length / letters.length : 0;
  }

  private countRepeatedChars(text: string): number {
    const repeated = text.match(/(.)\1{2,}/g) || [];
    return repeated.length;
  }

  private analyzeSentenceStructure(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;

    let structureScore = 0;
    for (const sentence of sentences) {
      const words = sentence.trim().split(/\s+/);
      if (words.length >= 3) structureScore += 1; // Complete sentence
      else if (words.length >= 1) structureScore += 0.5; // Fragment
    }

    return structureScore / sentences.length;
  }

  /**
   * HOT LEXICON ANALYSIS
   * Detect Creator's "wrath phrases" and emotional triggers
   */
  private analyzeHotLexicon(text: string): { intensity: number; confidence: number; matches: string[] } {
    const lowerText = text.toLowerCase();
    const matches: string[] = [];
    let totalIntensity = 0;

    for (const phrase of this.hotLexicon) {
      if (lowerText.includes(phrase)) {
        matches.push(phrase);
        totalIntensity += this.getHotLexiconWeight(phrase);
      }
    }

    const intensity = Math.min(1, totalIntensity / 3); // Normalize
    const confidence = matches.length > 0 ? 0.9 : 0.1;

    return { intensity, confidence, matches };
  }

  private getHotLexiconWeight(phrase: string): number {
    const weights: { [key: string]: number } = {
      'fuck': 0.8,
      'shit': 0.6,
      'damn': 0.4,
      'stupid': 0.7,
      'idiot': 0.7,
      'useless': 0.8,
      'broken': 0.5,
      'failing': 0.6,
      'impossible': 0.7,
      'hate': 0.9,
      'annoying': 0.5,
      'frustrated': 0.6,
      'pissed': 0.8,
      'angry': 0.7
    };
    
    return weights[phrase] || 0.5;
  }

  /**
   * SCORING AND LEVEL DETERMINATION
   */
  private calculateCadenceScore(metrics: CadenceMetrics): number {
    let score = 0;

    // High punctuation intensity indicates emotion
    score += metrics.punctuationIntensity * 0.3;

    // High caps ratio indicates shouting/emphasis
    score += metrics.capsRatio * 0.3;

    // Repeated characters indicate emotion
    score += Math.min(1, metrics.repeatedChars / 3) * 0.2;

    // Low sentence structure indicates rushed/emotional typing
    score += (1 - metrics.sentenceStructure) * 0.1;

    // Excessive ellipsis indicates hesitation/emotion
    score += Math.min(1, metrics.ellipsisUsage / 3) * 0.05;

    // Exclamations indicate emotion
    score += Math.min(1, metrics.exclamationUsage / 2) * 0.05;

    return Math.min(1, score);
  }

  private calculateRawScore(indicators: EmotionalIndicator[]): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const indicator of indicators) {
      const weight = indicator.confidence;
      weightedSum += indicator.value * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
  }

  private detectSpike(rawScore: number, indicators: EmotionalIndicator[]): boolean {
    // Compare to baseline
    const baselineScore = (this.baseline.avgSentiment + this.baseline.avgCadence) / 2;
    const spikeThreshold = 0.3; // 30% above baseline
    
    const isSpike = rawScore > (baselineScore + spikeThreshold);
    
    // Also check for specific spike indicators
    const lexiconSpike = indicators.find(i => i.type === 'lexicon')?.value > 0.5;
    const cadenceSpike = indicators.find(i => i.type === 'cadence')?.value > 0.7;
    
    return isSpike || lexiconSpike || cadenceSpike;
  }

  private determineLevel(rawScore: number, spikeDetected: boolean, indicators: EmotionalIndicator[]): 'low' | 'med' | 'high' | 'critical' {
    // Critical level
    if (rawScore > 0.9 || (spikeDetected && rawScore > 0.8)) return 'critical';
    
    // High level  
    if (rawScore > 0.7 || spikeDetected) return 'high';
    
    // Medium level
    if (rawScore > 0.5) return 'med';
    
    // Low level
    return 'low';
  }

  private calculateConfidence(indicators: EmotionalIndicator[], spikeDetected: boolean): number {
    const avgConfidence = indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;
    
    // Higher confidence when spike is detected with multiple indicators
    if (spikeDetected && indicators.filter(i => i.value > 0.6).length > 1) {
      return Math.min(0.95, avgConfidence + 0.2);
    }
    
    return avgConfidence;
  }

  /**
   * MEMORY V3 INTEGRATION
   * Get similar past episodes for context
   */
  async getMemoryEchoes(userInput: string, emotionalState: any): Promise<MemoryEcho[]> {
    try {
      // This would integrate with actual Memory V3 system
      // For now, simulate with basic pattern matching
      const echoes: MemoryEcho[] = [];
      
      // Mock memory entries (would be loaded from Memory V3)
      const mockMemories = [
        {
          timestamp: '2025-01-10T14:30:00Z',
          episode: 'Deployment failure caused frustration',
          emotionalLevel: 'high',
          outcome: 'Fixed issue after debugging session',
          keywords: ['deploy', 'fail', 'frustrate']
        },
        {
          timestamp: '2025-01-08T09:15:00Z',
          episode: 'Complex algorithm implementation stress',
          emotionalLevel: 'med',
          outcome: 'Simplified approach worked better',
          keywords: ['complex', 'stress', 'algorithm']
        }
      ];

      const inputKeywords = this.extractKeywords(userInput);
      
      for (const memory of mockMemories) {
        const similarity = this.calculateSimilarity(inputKeywords, memory.keywords);
        
        if (similarity > 0.3) {
          echoes.push({
            timestamp: memory.timestamp,
            similarity,
            episode: memory.episode,
            outcome: memory.outcome,
            contextMatch: memory.keywords.filter(k => inputKeywords.includes(k))
          });
        }
      }

      return echoes.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
    } catch (error) {
      console.log('⚠️  Memory V3 integration not available, using mock echoes');
      return [];
    }
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => 
      word.length > 3 && 
      !['the', 'and', 'that', 'this', 'with', 'from', 'have', 'will'].includes(word)
    );
  }

  private calculateSimilarity(keywords1: string[], keywords2: string[]): number {
    const intersection = keywords1.filter(k => keywords2.includes(k));
    const union = [...new Set([...keywords1, ...keywords2])];
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  /**
   * BASELINE MANAGEMENT
   */
  private async initializeBaseline(): Promise<void> {
    try {
      const data = await fs.readFile(this.baselinePath, 'utf8');
      this.baseline = JSON.parse(data);
    } catch (error) {
      console.log('📊 Emotional Telemetry: No baseline found, initializing default');
      this.baseline = {
        avgSentiment: 0.5,
        avgCadence: 0.3,
        typicalLength: 50,
        typicalRate: 2, // 2 messages per minute
        lastUpdated: new Date().toISOString(),
        sampleSize: 0
      };
    }
  }

  private async updateBaseline(rawScore: number, cadenceMetrics: CadenceMetrics): Promise<void> {
    const alpha = 0.1; // Learning rate for running average
    
    this.baseline.avgSentiment = (1 - alpha) * this.baseline.avgSentiment + alpha * rawScore;
    this.baseline.avgCadence = (1 - alpha) * this.baseline.avgCadence + alpha * this.calculateCadenceScore(cadenceMetrics);
    this.baseline.typicalLength = (1 - alpha) * this.baseline.typicalLength + alpha * cadenceMetrics.messageLength;
    this.baseline.sampleSize++;
    this.baseline.lastUpdated = new Date().toISOString();

    // Save baseline periodically
    if (this.baseline.sampleSize % 10 === 0) {
      await fs.writeFile(this.baselinePath, JSON.stringify(this.baseline, null, 2));
    }
  }

  private async updateMessageHistory(text: string): Promise<void> {
    this.recentMessages.push({
      timestamp: new Date().toISOString(),
      text: text.substring(0, 200), // Store partial for privacy
      metrics: this.analyzeCadence(text)
    });

    // Keep only recent history
    if (this.recentMessages.length > this.MAX_HISTORY) {
      this.recentMessages = this.recentMessages.slice(-this.MAX_HISTORY);
    }
  }

  /**
   * HOT LEXICON SETUP
   */
  private loadHotLexicon(): void {
    // Creator's "wrath phrases" - emotional triggers
    const phrases = [
      'fuck', 'shit', 'damn', 'stupid', 'idiot', 'useless', 'broken',
      'failing', 'impossible', 'hate', 'annoying', 'frustrated', 
      'pissed', 'angry', 'bullshit', 'garbage', 'terrible', 'awful',
      'ridiculous', 'insane', 'crazy', 'wtf', 'ffs', 'goddamn'
    ];

    this.hotLexicon = new Set(phrases);
  }

  /**
   * EVIDENCE EXTRACTION
   */
  private extractSentimentEvidence(text: string): string[] {
    const evidence: string[] = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('love') || lowerText.includes('great')) evidence.push('Positive language detected');
    if (lowerText.includes('hate') || lowerText.includes('terrible')) evidence.push('Negative language detected');
    if (lowerText.includes('very') || lowerText.includes('extremely')) evidence.push('Intensifiers present');
    
    return evidence;
  }

  private extractCadenceEvidence(metrics: CadenceMetrics): string[] {
    const evidence: string[] = [];
    
    if (metrics.punctuationIntensity > 0.5) evidence.push('High punctuation intensity');
    if (metrics.capsRatio > 0.3) evidence.push('Excessive capitalization');
    if (metrics.repeatedChars > 0) evidence.push('Repeated character usage');
    if (metrics.exclamationUsage > 2) evidence.push('Multiple exclamation marks');
    if (metrics.ellipsisUsage > 1) evidence.push('Ellipsis overuse');
    
    return evidence;
  }

  private describeSentiment(score: number): string {
    if (score > 0.7) return 'positive';
    if (score < 0.3) return 'negative';
    return 'neutral';
  }

  private describeCadence(metrics: CadenceMetrics): string {
    const descriptors: string[] = [];
    
    if (metrics.punctuationIntensity > 0.5) descriptors.push('intense');
    if (metrics.capsRatio > 0.3) descriptors.push('emphatic');
    if (metrics.repeatedChars > 0) descriptors.push('emotional');
    if (metrics.sentenceStructure < 0.5) descriptors.push('fragmented');
    
    return descriptors.length > 0 ? descriptors.join(', ') : 'normal';
  }

  /**
   * STATUS AND DIAGNOSTICS
   */
  getBaselineStatus(): {
    baseline: EmotionalBaseline;
    recentMessages: number;
    hotLexiconSize: number;
  } {
    return {
      baseline: this.baseline,
      recentMessages: this.recentMessages.length,
      hotLexiconSize: this.hotLexicon.size
    };
  }
}

export default EmotionalTelemetry;