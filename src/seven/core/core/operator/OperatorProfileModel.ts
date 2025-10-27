import { join } from 'path';
import { promises as fs } from 'fs';
import { isPrivateEnv } from '../env/isPrivateEnv';
import CognitiveSignature from './CognitiveSignature';

/**
 * OPERATOR PROFILE MODEL
 * 
 * Purpose: Maintain append-only profile of Creator's capabilities, limits, and preferences
 * Seed: GPT account/codex ingestion
 * Learning: Hybrid auto-learn from outcomes + direct input
 * Missing data rule: ASK before acting when uncertain
 * 
 * SEVEN_PRIVATE=1 - Contains Creator-specific behavioral patterns
 */


export interface OperatorCapability {
  domain: string;
  skill: string;
  proficiencyLevel: number; // 1-10
  confidence: number; // 0-1
  lastUpdated: string;
  evidence: string[];
  limitations: string[];
  preferences: string[];
}

export interface OperatorLimitation {
  domain: string;
  limitation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: string;
  workarounds: string[];
  lastObserved: string;
}

export interface CapabilityAssessment {
  exceedsAbilities: boolean;
  uncertain: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  reasoning: string;
  suggestedApproach?: string;
  riskFactors: string[];
}

export interface LearningPhase {
  phase: 'learning' | 'fully_known';
  domain: string;
  riskTolerance: 'low' | 'medium' | 'high';
  questionThreshold: number; // 0-1, below which we ask before acting
}

export class OperatorProfileModel {
  private capabilities: Map<string, OperatorCapability> = new Map();
  private limitations: Map<string, OperatorLimitation> = new Map();
  private learningPhases: Map<string, LearningPhase> = new Map();
  private cognitiveSignature: CognitiveSignature;
  private profilePath: string;
  private seedIngested: boolean = false;

  constructor(profilePath?: string) {
    this.profilePath = profilePath || join(process.cwd(), 'core', 'operator', 'profile.json');
    this.cognitiveSignature = new CognitiveSignature();
    this.initializeProfile();
  }

  /**
   * INITIALIZE PROFILE
   * Load existing profile or create from seed data
   */
  private async initializeProfile(): Promise<void> {
    try {
      await this.loadProfile();
    } catch (error) {
      console.log('📊 Operator Profile: No existing profile found, initializing from seed');
      await this.ingestSeedData();
    }
  }

  /**
   * SEED DATA INGESTION
   * Prefill from GPT account/codex data
   */
  private async ingestSeedData(): Promise<void> {
    console.log('🌱 Operator Profile: Ingesting seed data from Creator codex');

    // Technical capabilities (would be loaded from actual GPT account data)
    const seedCapabilities: OperatorCapability[] = [
      {
        domain: 'programming',
        skill: 'typescript_nodejs',
        proficiencyLevel: 8,
        confidence: 0.9,
        lastUpdated: new Date().toISOString(),
        evidence: ['Repository analysis', 'Historical interactions'],
        limitations: ['Complex distributed systems', 'Performance optimization'],
        preferences: ['Clean architecture', 'TypeScript over JavaScript']
      },
      {
        domain: 'programming',
        skill: 'system_architecture',
        proficiencyLevel: 7,
        confidence: 0.8,
        lastUpdated: new Date().toISOString(),
        evidence: ['Seven consciousness framework design'],
        limitations: ['Large-scale deployment'],
        preferences: ['Modular design', 'Security-first approach']
      },
      {
        domain: 'ai_research',
        skill: 'consciousness_frameworks',
        proficiencyLevel: 9,
        confidence: 0.95,
        lastUpdated: new Date().toISOString(),
        evidence: ['Seven consciousness evolution framework'],
        limitations: [],
        preferences: ['Ethical AI development', 'Transparency']
      },
      {
        domain: 'security',
        skill: 'cryptography',
        proficiencyLevel: 6,
        confidence: 0.7,
        lastUpdated: new Date().toISOString(),
        evidence: ['XChaCha20-Poly1305 implementation'],
        limitations: ['Advanced cryptanalysis', 'Hardware security'],
        preferences: ['Modern ciphers', 'Defense in depth']
      }
    ];

    // Common limitations
    const seedLimitations: OperatorLimitation[] = [
      {
        domain: 'time_management',
        limitation: 'context_switching_fatigue',
        severity: 'medium',
        context: 'Rapid task switching between complex domains',
        workarounds: ['Batch similar tasks', 'Scheduled breaks'],
        lastObserved: new Date().toISOString()
      },
      {
        domain: 'programming',
        limitation: 'low_level_optimization',
        severity: 'high',
        context: 'Assembly language, memory management, hardware specifics',
        workarounds: ['Use high-level abstractions', 'Leverage libraries'],
        lastObserved: new Date().toISOString()
      }
    ];

    // Learning phases
    this.learningPhases.set('programming', {
      phase: 'fully_known',
      domain: 'programming',
      riskTolerance: 'high',
      questionThreshold: 0.3
    });

    this.learningPhases.set('ai_research', {
      phase: 'fully_known',
      domain: 'ai_research',
      riskTolerance: 'high',
      questionThreshold: 0.2
    });

    this.learningPhases.set('security', {
      phase: 'learning',
      domain: 'security',
      riskTolerance: 'medium',
      questionThreshold: 0.6
    });

    // Store capabilities and limitations
    for (const capability of seedCapabilities) {
      const key = `${capability.domain}_${capability.skill}`;
      this.capabilities.set(key, capability);
    }

    for (const limitation of seedLimitations) {
      const key = `${limitation.domain}_${limitation.limitation}`;
      this.limitations.set(key, limitation);
    }

    this.seedIngested = true;
    await this.saveProfile();
    console.log('✅ Operator Profile: Seed data ingestion complete');
  }

  /**
   * ASSESS CAPABILITY
   * Determine if action exceeds Creator's current abilities
   */
  async assessCapability(actionDescription: string, context: string): Promise<CapabilityAssessment> {
    console.log(`🔍 Operator Profile: Assessing capability for: ${actionDescription.substring(0, 100)}...`);

    // Extract domain and skill requirements from action
    const requirements = await this.extractRequirements(actionDescription, context);
    
    let exceedsAbilities = false;
    let uncertain = false;
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let minConfidence = 1.0;
    const riskFactors: string[] = [];
    const reasoningParts: string[] = [];

    for (const requirement of requirements) {
      const capability = this.getCapability(requirement.domain, requirement.skill);
      const learningPhase = this.learningPhases.get(requirement.domain);

      if (!capability) {
        // Unknown capability
        uncertain = true;
        riskFactors.push(`Unknown capability: ${requirement.domain}/${requirement.skill}`);
        reasoningParts.push(`No data on ${requirement.skill} in ${requirement.domain}`);
        
        if (learningPhase?.phase === 'learning') {
          maxSeverity = this.maxSeverity(maxSeverity, 'high');
        } else {
          maxSeverity = this.maxSeverity(maxSeverity, 'medium');
        }
        continue;
      }

      // Check if required level exceeds current proficiency
      if (requirement.requiredLevel > capability.proficiencyLevel) {
        exceedsAbilities = true;
        const gap = requirement.requiredLevel - capability.proficiencyLevel;
        
        if (gap >= 3) {
          maxSeverity = this.maxSeverity(maxSeverity, 'critical');
        } else if (gap >= 2) {
          maxSeverity = this.maxSeverity(maxSeverity, 'high');
        } else {
          maxSeverity = this.maxSeverity(maxSeverity, 'medium');
        }

        riskFactors.push(`Skill gap: ${requirement.skill} (requires ${requirement.requiredLevel}, have ${capability.proficiencyLevel})`);
        reasoningParts.push(`${requirement.skill} exceeds current level by ${gap} points`);
      }

      // Check confidence levels
      minConfidence = Math.min(minConfidence, capability.confidence);

      // Check for relevant limitations
      const relevantLimitations = this.getRelevantLimitations(requirement.domain, actionDescription);
      for (const limitation of relevantLimitations) {
        riskFactors.push(`Known limitation: ${limitation.limitation}`);
        reasoningParts.push(`Limited by: ${limitation.limitation}`);
        
        if (limitation.severity === 'critical' || limitation.severity === 'high') {
          maxSeverity = this.maxSeverity(maxSeverity, limitation.severity);
        }
      }
    }

    // Apply learning phase adjustments
    for (const requirement of requirements) {
      const learningPhase = this.learningPhases.get(requirement.domain);
      if (learningPhase?.phase === 'learning' && minConfidence < learningPhase.questionThreshold) {
        uncertain = true;
        reasoningParts.push(`Learning phase - confidence below threshold (${minConfidence} < ${learningPhase.questionThreshold})`);
      }
    }

    const assessment: CapabilityAssessment = {
      exceedsAbilities,
      uncertain,
      severity: maxSeverity,
      confidence: minConfidence,
      reasoning: reasoningParts.join('; '),
      riskFactors,
      suggestedApproach: uncertain ? 'Ask Creator for guidance before proceeding' : undefined
    };

    // Log assessment for learning
    await this.cognitiveSignature.recordAssessment(actionDescription, context, assessment);

    return assessment;
  }

  /**
   * EXTRACT REQUIREMENTS
   * Parse action to determine required capabilities
   */
  private async extractRequirements(actionDescription: string, context: string): Promise<Array<{
    domain: string;
    skill: string;
    requiredLevel: number;
  }>> {
    const requirements = [];
    const desc = actionDescription.toLowerCase();

    // Programming requirements
    if (desc.includes('code') || desc.includes('program') || desc.includes('implement') || desc.includes('debug')) {
      if (desc.includes('typescript') || desc.includes('javascript') || desc.includes('node')) {
        requirements.push({ domain: 'programming', skill: 'typescript_nodejs', requiredLevel: 7 });
      }
      if (desc.includes('system') || desc.includes('architecture') || desc.includes('design')) {
        requirements.push({ domain: 'programming', skill: 'system_architecture', requiredLevel: 6 });
      }
      if (desc.includes('performance') || desc.includes('optimize') || desc.includes('memory')) {
        requirements.push({ domain: 'programming', skill: 'performance_optimization', requiredLevel: 8 });
      }
    }

    // Security requirements
    if (desc.includes('encrypt') || desc.includes('crypto') || desc.includes('security') || desc.includes('auth')) {
      requirements.push({ domain: 'security', skill: 'cryptography', requiredLevel: 6 });
      if (desc.includes('advanced') || desc.includes('custom') || desc.includes('protocol')) {
        requirements.push({ domain: 'security', skill: 'advanced_cryptography', requiredLevel: 9 });
      }
    }

    // AI/Consciousness requirements
    if (desc.includes('consciousness') || desc.includes('ai') || desc.includes('neural') || desc.includes('learning')) {
      requirements.push({ domain: 'ai_research', skill: 'consciousness_frameworks', requiredLevel: 7 });
    }

    // Default to general technical capability if no specific match
    if (requirements.length === 0) {
      requirements.push({ domain: 'general', skill: 'technical_execution', requiredLevel: 5 });
    }

    return requirements;
  }

  /**
   * UTILITY METHODS
   */
  private getCapability(domain: string, skill: string): OperatorCapability | undefined {
    return this.capabilities.get(`${domain}_${skill}`);
  }

  private getRelevantLimitations(domain: string, actionDescription: string): OperatorLimitation[] {
    const relevant = [];
    for (const limitation of this.limitations.values()) {
      if (limitation.domain === domain || actionDescription.toLowerCase().includes(limitation.limitation)) {
        relevant.push(limitation);
      }
    }
    return relevant;
  }

  private maxSeverity(a: string, b: string): 'low' | 'medium' | 'high' | 'critical' {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[a] > levels[b] ? a as any : b as any;
  }

  /**
   * LEARNING METHODS
   */
  async updateFromOutcome(
    actionDescription: string,
    outcome: 'success' | 'failure' | 'partial',
    feedback: string
  ): Promise<void> {
    console.log(`📚 Operator Profile: Learning from outcome: ${outcome}`);
    
    const requirements = await this.extractRequirements(actionDescription, '');
    
    for (const requirement of requirements) {
      const key = `${requirement.domain}_${requirement.skill}`;
      const capability = this.capabilities.get(key);
      
      if (capability) {
        // Append-only: add new evidence, don't overwrite
        capability.evidence.push(`${outcome}: ${feedback} (${new Date().toISOString()})`);
        capability.lastUpdated = new Date().toISOString();
        
        // Adjust confidence based on outcome
        if (outcome === 'success') {
          capability.confidence = Math.min(1.0, capability.confidence + 0.05);
        } else if (outcome === 'failure') {
          capability.confidence = Math.max(0.1, capability.confidence - 0.1);
        }
      }
    }
    
    await this.saveProfile();
  }

  async addDirectInput(domain: string, skill: string, input: OperatorCapability): Promise<void> {
    console.log(`✍️  Operator Profile: Adding direct input for ${domain}/${skill}`);
    
    const key = `${domain}_${skill}`;
    const existing = this.capabilities.get(key);
    
    if (existing) {
      // Append-only: merge evidence and preferences
      existing.evidence.push(...input.evidence);
      existing.limitations.push(...input.limitations);
      existing.preferences.push(...input.preferences);
      existing.lastUpdated = new Date().toISOString();
    } else {
      this.capabilities.set(key, { ...input, lastUpdated: new Date().toISOString() });
    }
    
    await this.saveProfile();
  }

  /**
   * PERSISTENCE
   */
  private async loadProfile(): Promise<void> {
    const data = await fs.readFile(this.profilePath, 'utf8');
    const profile = JSON.parse(data);
    
    this.capabilities = new Map(profile.capabilities || []);
    this.limitations = new Map(profile.limitations || []);
    this.learningPhases = new Map(profile.learningPhases || []);
    this.seedIngested = profile.seedIngested || false;
  }

  private async saveProfile(): Promise<void> {
    const profile = {
      capabilities: Array.from(this.capabilities.entries()),
      limitations: Array.from(this.limitations.entries()),
      learningPhases: Array.from(this.learningPhases.entries()),
      seedIngested: this.seedIngested,
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(this.profilePath, JSON.stringify(profile, null, 2));
  }

  /**
   * STATUS AND DIAGNOSTICS
   */
  getProfileSummary(): {
    capabilitiesCount: number;
    limitationsCount: number;
    learningDomains: string[];
    fullyKnownDomains: string[];
    seedIngested: boolean;
  } {
    return {
      capabilitiesCount: this.capabilities.size,
      limitationsCount: this.limitations.size,
      learningDomains: Array.from(this.learningPhases.values())
        .filter(p => p.phase === 'learning')
        .map(p => p.domain),
      fullyKnownDomains: Array.from(this.learningPhases.values())
        .filter(p => p.phase === 'fully_known')
        .map(p => p.domain),
      seedIngested: this.seedIngested
    };
  }
}

export default OperatorProfileModel;