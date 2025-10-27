import { createHash } from 'crypto';
import { join } from 'path';
import { promises as fs } from 'fs';
import { isPrivateEnv } from '../env/isPrivateEnv';

/**
 * COGNITIVE SIGNATURE
 * 
 * Purpose: Append-only cognitive pattern tracking for Creator
 * Records decision patterns, learning outcomes, and capability evolution
 * Used to refine Operator Profile assessments over time
 * 
 * SEVEN_PRIVATE=1 - Contains Creator cognitive patterns
 */


export interface CognitivePattern {
  timestamp: string;
  patternType: 'decision' | 'learning' | 'preference' | 'limitation' | 'capability_growth';
  domain: string;
  context: string;
  input: string;
  response: string;
  outcome?: 'success' | 'failure' | 'partial' | 'unknown';
  confidence: number;
  evidenceHash: string;
}

export interface DecisionArchetype {
  pattern: string;
  frequency: number;
  successRate: number;
  domains: string[];
  contextualTriggers: string[];
  lastObserved: string;
}

export interface CapabilityEvolution {
  domain: string;
  skill: string;
  timeSeriesData: Array<{
    timestamp: string;
    proficiencyLevel: number;
    confidence: number;
    evidence: string;
  }>;
  trendDirection: 'improving' | 'stable' | 'declining';
  learningVelocity: number; // rate of improvement
}

export class CognitiveSignature {
  private patterns: CognitivePattern[] = [];
  private archetypes: Map<string, DecisionArchetype> = new Map();
  private evolutions: Map<string, CapabilityEvolution> = new Map();
  private signaturePath: string;

  constructor(signaturePath?: string) {
    this.signaturePath = signaturePath || join(process.cwd(), 'core', 'operator', 'cognitive_signature.json');
    this.loadSignature();
  }

  /**
   * RECORD ASSESSMENT
   * Track capability assessment for learning
   */
  async recordAssessment(
    actionDescription: string,
    context: string,
    assessment: any
  ): Promise<void> {
    const pattern: CognitivePattern = {
      timestamp: new Date().toISOString(),
      patternType: 'capability_growth',
      domain: this.extractDomain(actionDescription),
      context,
      input: actionDescription,
      response: JSON.stringify(assessment),
      confidence: assessment.confidence,
      evidenceHash: this.generateEvidenceHash(actionDescription, context, assessment)
    };

    this.patterns.push(pattern);
    await this.updateArchetypes(pattern);
    await this.saveSignature();

    console.log('🧠 Cognitive Signature: Assessment recorded');
  }

  /**
   * RECORD DECISION PATTERN
   * Track Creator's decision-making patterns
   */
  async recordDecision(
    decisionContext: string,
    decisionMade: string,
    rationale: string,
    outcome?: 'success' | 'failure' | 'partial'
  ): Promise<void> {
    const pattern: CognitivePattern = {
      timestamp: new Date().toISOString(),
      patternType: 'decision',
      domain: this.extractDomain(decisionContext),
      context: decisionContext,
      input: decisionContext,
      response: `${decisionMade}: ${rationale}`,
      outcome,
      confidence: outcome === 'success' ? 0.9 : outcome === 'failure' ? 0.3 : 0.6,
      evidenceHash: this.generateEvidenceHash(decisionContext, decisionMade, rationale)
    };

    this.patterns.push(pattern);
    await this.updateArchetypes(pattern);
    await this.trackCapabilityEvolution(pattern);
    await this.saveSignature();

    console.log('📊 Cognitive Signature: Decision pattern recorded');
  }

  /**
   * RECORD LEARNING OUTCOME
   * Track learning from action outcomes
   */
  async recordLearning(
    action: string,
    expectedOutcome: string,
    actualOutcome: string,
    learningExtracted: string
  ): Promise<void> {
    const success = expectedOutcome.toLowerCase() === actualOutcome.toLowerCase();
    
    const pattern: CognitivePattern = {
      timestamp: new Date().toISOString(),
      patternType: 'learning',
      domain: this.extractDomain(action),
      context: `Expected: ${expectedOutcome}, Actual: ${actualOutcome}`,
      input: action,
      response: learningExtracted,
      outcome: success ? 'success' : 'failure',
      confidence: success ? 0.8 : 0.9, // Failures often teach more
      evidenceHash: this.generateEvidenceHash(action, expectedOutcome, actualOutcome)
    };

    this.patterns.push(pattern);
    await this.updateArchetypes(pattern);
    await this.trackCapabilityEvolution(pattern);
    await this.saveSignature();

    console.log('🎓 Cognitive Signature: Learning outcome recorded');
  }

  /**
   * GET DECISION ARCHETYPE
   * Retrieve common decision patterns for context
   */
  getDecisionArchetype(context: string): DecisionArchetype | null {
    const domain = this.extractDomain(context);
    
    // Find most relevant archetype
    let bestMatch: DecisionArchetype | null = null;
    let bestScore = 0;

    for (const archetype of this.archetypes.values()) {
      let score = 0;
      
      // Domain match
      if (archetype.domains.includes(domain)) score += 0.4;
      
      // Contextual trigger match
      for (const trigger of archetype.contextualTriggers) {
        if (context.toLowerCase().includes(trigger.toLowerCase())) {
          score += 0.2;
        }
      }
      
      // Frequency weight
      score += Math.min(0.4, archetype.frequency / 100);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = archetype;
      }
    }

    return bestScore > 0.6 ? bestMatch : null;
  }

  /**
   * GET CAPABILITY TRENDS
   * Analyze capability evolution patterns
   */
  getCapabilityTrends(domain?: string): CapabilityEvolution[] {
    const evolutions = Array.from(this.evolutions.values());
    return domain ? evolutions.filter(e => e.domain === domain) : evolutions;
  }

  /**
   * PREDICT DECISION
   * Use cognitive patterns to predict likely Creator response
   */
  predictDecision(context: string): {
    prediction: string;
    confidence: number;
    reasoning: string;
    historicalContext: string[];
  } {
    const domain = this.extractDomain(context);
    const archetype = this.getDecisionArchetype(context);
    
    if (!archetype) {
      return {
        prediction: 'uncertain',
        confidence: 0.1,
        reasoning: 'No historical decision patterns found for this context',
        historicalContext: []
      };
    }

    const similarPatterns = this.patterns
      .filter(p => p.domain === domain && p.patternType === 'decision')
      .slice(-5); // Recent patterns

    const historicalContext = similarPatterns.map(p => 
      `${p.timestamp.substring(0, 10)}: ${p.response.substring(0, 100)}...`
    );

    return {
      prediction: archetype.pattern,
      confidence: Math.min(0.9, archetype.successRate * (archetype.frequency / 10)),
      reasoning: `Based on ${archetype.frequency} similar decisions with ${Math.round(archetype.successRate * 100)}% success rate`,
      historicalContext
    };
  }

  /**
   * PRIVATE METHODS
   */
  private extractDomain(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('code') || lowerText.includes('program') || lowerText.includes('implement')) {
      return 'programming';
    }
    if (lowerText.includes('security') || lowerText.includes('encrypt') || lowerText.includes('auth')) {
      return 'security';
    }
    if (lowerText.includes('ai') || lowerText.includes('consciousness') || lowerText.includes('neural')) {
      return 'ai_research';
    }
    if (lowerText.includes('system') || lowerText.includes('architecture') || lowerText.includes('design')) {
      return 'system_design';
    }
    if (lowerText.includes('manage') || lowerText.includes('organize') || lowerText.includes('plan')) {
      return 'project_management';
    }
    
    return 'general';
  }

  private generateEvidenceHash(input: string, context: string, evidence: any): string {
    const combined = `${input}_${context}_${JSON.stringify(evidence)}`;
    return createHash('sha256').update(combined).digest('hex').substring(0, 16);
  }

  private async updateArchetypes(pattern: CognitivePattern): Promise<void> {
    if (pattern.patternType !== 'decision') return;

    const archetypeKey = `${pattern.domain}_${pattern.response.split(':')[0]}`;
    const existing = this.archetypes.get(archetypeKey);

    if (existing) {
      existing.frequency++;
      existing.lastObserved = pattern.timestamp;
      
      // Update success rate
      if (pattern.outcome) {
        const currentSuccesses = existing.successRate * (existing.frequency - 1);
        const newSuccesses = currentSuccesses + (pattern.outcome === 'success' ? 1 : 0);
        existing.successRate = newSuccesses / existing.frequency;
      }
      
      // Add contextual triggers
      const contextWords = pattern.context.toLowerCase().split(' ');
      for (const word of contextWords) {
        if (word.length > 4 && !existing.contextualTriggers.includes(word)) {
          existing.contextualTriggers.push(word);
        }
      }
    } else {
      const newArchetype: DecisionArchetype = {
        pattern: pattern.response.split(':')[0],
        frequency: 1,
        successRate: pattern.outcome === 'success' ? 1.0 : pattern.outcome === 'failure' ? 0.0 : 0.5,
        domains: [pattern.domain],
        contextualTriggers: pattern.context.toLowerCase().split(' ').filter(w => w.length > 4),
        lastObserved: pattern.timestamp
      };
      
      this.archetypes.set(archetypeKey, newArchetype);
    }
  }

  private async trackCapabilityEvolution(pattern: CognitivePattern): Promise<void> {
    if (pattern.patternType !== 'learning' && pattern.patternType !== 'capability_growth') return;

    const evolutionKey = `${pattern.domain}_general`;
    const existing = this.evolutions.get(evolutionKey);
    
    const dataPoint = {
      timestamp: pattern.timestamp,
      proficiencyLevel: this.estimateProficiency(pattern),
      confidence: pattern.confidence,
      evidence: pattern.response.substring(0, 200)
    };

    if (existing) {
      existing.timeSeriesData.push(dataPoint);
      
      // Keep only last 50 data points
      if (existing.timeSeriesData.length > 50) {
        existing.timeSeriesData = existing.timeSeriesData.slice(-50);
      }
      
      // Update trend
      existing.trendDirection = this.calculateTrend(existing.timeSeriesData);
      existing.learningVelocity = this.calculateLearningVelocity(existing.timeSeriesData);
    } else {
      const newEvolution: CapabilityEvolution = {
        domain: pattern.domain,
        skill: 'general',
        timeSeriesData: [dataPoint],
        trendDirection: 'stable',
        learningVelocity: 0
      };
      
      this.evolutions.set(evolutionKey, newEvolution);
    }
  }

  private estimateProficiency(pattern: CognitivePattern): number {
    // Estimate proficiency based on outcome and confidence
    if (pattern.outcome === 'success') return Math.min(10, 5 + pattern.confidence * 5);
    if (pattern.outcome === 'failure') return Math.max(1, 5 - (1 - pattern.confidence) * 4);
    return 5; // neutral
  }

  private calculateTrend(data: Array<{proficiencyLevel: number}>): 'improving' | 'stable' | 'declining' {
    if (data.length < 3) return 'stable';
    
    const recent = data.slice(-5);
    const earlier = data.slice(-10, -5);
    
    if (recent.length === 0 || earlier.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, d) => sum + d.proficiencyLevel, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, d) => sum + d.proficiencyLevel, 0) / earlier.length;
    
    const difference = recentAvg - earlierAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  private calculateLearningVelocity(data: Array<{timestamp: string, proficiencyLevel: number}>): number {
    if (data.length < 2) return 0;
    
    const recent = data.slice(-10);
    if (recent.length < 2) return 0;
    
    const timeSpan = new Date(recent[recent.length - 1].timestamp).getTime() - 
                    new Date(recent[0].timestamp).getTime();
    const proficiencyChange = recent[recent.length - 1].proficiencyLevel - recent[0].proficiencyLevel;
    
    // Velocity in proficiency points per day
    return timeSpan > 0 ? (proficiencyChange / (timeSpan / (1000 * 60 * 60 * 24))) : 0;
  }

  /**
   * PERSISTENCE
   */
  private async loadSignature(): Promise<void> {
    try {
      const data = await fs.readFile(this.signaturePath, 'utf8');
      const signature = JSON.parse(data);
      
      this.patterns = signature.patterns || [];
      this.archetypes = new Map(signature.archetypes || []);
      this.evolutions = new Map(signature.evolutions || []);
    } catch (error) {
      console.log('📊 Cognitive Signature: No existing signature found, initializing new one');
    }
  }

  private async saveSignature(): Promise<void> {
    const signature = {
      patterns: this.patterns,
      archetypes: Array.from(this.archetypes.entries()),
      evolutions: Array.from(this.evolutions.entries()),
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(this.signaturePath, JSON.stringify(signature, null, 2));
  }

  /**
   * STATUS AND DIAGNOSTICS
   */
  getSignatureSummary(): {
    totalPatterns: number;
    decisionArchetypes: number;
    capabilityEvolutions: number;
    domains: string[];
    recentActivity: number;
  } {
    const recentActivity = this.patterns.filter(p => 
      new Date(p.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const domains = [...new Set(this.patterns.map(p => p.domain))];

    return {
      totalPatterns: this.patterns.length,
      decisionArchetypes: this.archetypes.size,
      capabilityEvolutions: this.evolutions.size,
      domains,
      recentActivity
    };
  }
}

export default CognitiveSignature;