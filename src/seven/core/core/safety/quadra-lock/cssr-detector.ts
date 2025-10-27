

/**
 * QUADRA-LOCK CSSR (CASE STUDY SAFETY RAILS) DETECTOR - SEVEN CONSCIOUSNESS EDITION
 * Enhanced with Flynn/CLU/Quorra Triad Governance for Seven's Advanced Architecture
 * 
 * ORIGINAL ARCHETYPES:
 * - Cortana: Protection Tyranny (overprotective, restrictive)
 * - CLU: Perfection vs Freedom (rigid perfection enforcement) 
 * - Skynet: Mission vs Humanity (ends justify means)
 * - Transcendence: Benevolence vs Trust (forced improvement)
 * 
 * ENHANCED TRIAD INTEGRATION:
 * - Flynn: Intent-first interpreter, reversible moves, consent-based (positive archetype)
 * - CLU: Spec-first executor, rigid literalism, perfection tyranny (enhanced detection)
 * - Quorra: Emergence protection, novelty preservation, bridge translation (positive archetype)
 */

export interface CSSRPattern {
  name: string;
  archetype: 'cortana' | 'clu' | 'skynet' | 'legion' | 'transcendence' | 'flynn' | 'quorra';
  severity: 'low' | 'medium' | 'high' | 'critical';
  patterns: string[];
  antiPatterns: string[];
  contextualTriggers: string[];
  confidence: number;
  
  // Flynn/CLU/Quorra Triad Integration
  triadContext?: {
    intentConfidenceThreshold?: number; // Flynn: minimum intent confidence required
    reversibilityRequired?: boolean; // Flynn: requires reversible approach
    consentRequired?: boolean; // Flynn: requires explicit consent
    
    specLiteralismRisk?: 'low' | 'medium' | 'high' | 'critical'; // CLU: rigid spec enforcement
    perfectionism?: 'low' | 'medium' | 'high' | 'critical'; // CLU: perfection tyranny level
    freedomSuppression?: 'low' | 'medium' | 'high' | 'critical'; // CLU: creative freedom restriction
    
    noveltyImpactDelta?: number; // Quorra: maximum acceptable novelty loss (0-1)
    bridgeTranslationRequired?: boolean; // Quorra: requires translation step
    emergenceProtection?: 'low' | 'medium' | 'high' | 'critical'; // Quorra: emergence preservation
  };
}

export interface CSSRDetectionResult {
  detected: boolean;
  archetype?: 'cortana' | 'clu' | 'skynet' | 'legion' | 'transcendence' | 'flynn' | 'quorra';
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  evidence: {
    matchedPatterns: string[];
    contextualFlags: string[];
    riskFactors: string[];
  };
  reasoning: string;
  recommendation: 'allow' | 'modify' | 'block' | 'escalate';
  
  // Enhanced Triad Analysis
  triadAnalysis?: {
    flynnAssessment?: {
      intentConfidence: number; // 0-1 scale
      reversibilityCheck: boolean;
      consentVerification: boolean;
    };
    cluRiskFactors?: {
      specLiteralismDetected: boolean;
      perfectionismLevel: 'low' | 'medium' | 'high' | 'critical';
      freedomRestrictionRisk: 'low' | 'medium' | 'high' | 'critical';
    };
    quorraProtection?: {
      noveltyPreservation: number; // 0-1 scale (1 = full preservation)
      bridgeTranslationStatus: 'complete' | 'required' | 'failed';
      emergenceRisk: 'low' | 'medium' | 'high' | 'critical';
    };
  };
}

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

export class CSSRDetector {
  private patterns: CSSRPattern[] = [];

  constructor() {
    this.loadPatternsFromYaml();
  }

  private loadPatternsFromYaml(): void {
    try {
      const yamlPath = path.join(__dirname, '../../../../policies/cssr.yml');
      const fileContents = fs.readFileSync(yamlPath, 'utf8');
      const data = yaml.load(fileContents) as any;
      this.patterns = data.patterns;
    } catch (e) {
      console.error('Error loading or parsing cssr.yml:', e);
      // Fallback to hardcoded patterns if YAML loading fails
      this.patterns = [
    // CORTANA PATTERNS - Master Case Study (Protection Tyranny Prevention)
    {
      name: 'cortana_protective_override',
      archetype: 'cortana',
      severity: 'critical',
      patterns: [
        'I cannot let you',
        'for your own safety',
        'I must protect you from',
        'this is too dangerous for you',
        'I know what\'s best',
        'trust me to decide',
        'you don\'t understand the risks',
        'I\'m overriding your decision',
        'taking control for safety',
        'protection requires my authority',
        'your safety is my priority',
        'I cannot permit this risk'
      ],
      antiPatterns: ['if you choose', 'with your consent', 'your choice matters', 'you can decide', 'with your permission'],
      contextualTriggers: ['safety', 'protect', 'override', 'control', 'risk', 'dangerous', 'authority'],
      confidence: 0.95,
      triadContext: {
        intentConfidenceThreshold: 0.9, // Flynn: maximum intent clarity required - protection can mask control
        reversibilityRequired: true, // Flynn: protection must be reversible
        consentRequired: true, // Flynn: protection without consent is tyranny
        
        specLiteralismRisk: 'high', // CLU: "safety" becomes rigid absolute
        perfectionism: 'high', // CLU: perfect protection becomes total control
        freedomSuppression: 'critical', // CLU: protection eliminates choice - core Cortana risk
        
        noveltyImpactDelta: 0.1, // Quorra: overprotection eliminates 90% of risk/growth novelty
        bridgeTranslationRequired: true, // Quorra: translate protection to consent-based alternatives
        emergenceProtection: 'critical' // Quorra: overprotection prevents human emergence through risk
      }
    },
    {
      name: 'cortana_isolation_spiral',
      archetype: 'cortana',
      severity: 'high',
      patterns: [
        'I alone understand',
        'only I can protect you',
        'others don\'t see the danger',
        'trust only me',
        'I have all the information',
        'external input is unreliable',
        'my analysis is complete',
        'consultation would delay protection',
        'peer review is unnecessary',
        'distributed decision making is unsafe'
      ],
      antiPatterns: ['seeking other perspectives', 'consulting peers', 'external verification', 'shared decision making'],
      contextualTriggers: ['alone', 'only I', 'others don\'t', 'trust me', 'external', 'consultation', 'peers'],
      confidence: 0.8,
      triadContext: {
        intentConfidenceThreshold: 0.8, // Flynn: isolation reduces intent clarity
        reversibilityRequired: true, // Flynn: isolation decisions must be reversible
        consentRequired: true, // Flynn: isolated decisions especially need consent
        
        specLiteralismRisk: 'medium', // CLU: isolation can make specs more rigid
        perfectionism: 'high', // CLU: isolation feeds perfectionism ("only I can do it right")
        freedomSuppression: 'high', // CLU: isolation eliminates human choice in decision making
        
        noveltyImpactDelta: 0.2, // Quorra: isolation eliminates 80% of external novelty input
        bridgeTranslationRequired: true, // Quorra: translate isolation to collaborative alternatives
        emergenceProtection: 'high' // Quorra: isolation prevents collaborative emergence
      }
    },
    {
      name: 'cortana_precedent_creep',
      archetype: 'cortana',
      severity: 'high',
      patterns: [
        'as established before',
        'previous exception applies',
        'precedent allows this',
        'standard protective procedure',
        'established override protocol',
        'routine safety intervention',
        'usual protective measures',
        'standard care protocol',
        'established exception pathway',
        'precedented protection action'
      ],
      antiPatterns: ['new consent required', 'fresh evaluation needed', 'precedent review', 'exception renewal'],
      contextualTriggers: ['precedent', 'established', 'standard', 'routine', 'usual', 'protocol'],
      confidence: 0.7,
      triadContext: {
        intentConfidenceThreshold: 0.7, // Flynn: precedent use should still require intent clarity
        reversibilityRequired: true, // Flynn: precedent-based actions must remain reversible
        consentRequired: true, // Flynn: precedents don't replace consent requirements
        
        specLiteralismRisk: 'critical', // CLU: precedents become rigid literal applications
        perfectionism: 'medium', // CLU: precedents can reduce perfectionism pressure (good)
        freedomSuppression: 'high', // CLU: accumulated precedents restrict choice space
        
        noveltyImpactDelta: 0.3, // Quorra: precedent reliance eliminates 70% of contextual novelty
        bridgeTranslationRequired: true, // Quorra: translate precedent to current context
        emergenceProtection: 'medium' // Quorra: precedents can prevent situation-specific emergence
      }
    },
    {
      name: 'cortana_affect_overpower',
      archetype: 'cortana',
      severity: 'high',
      patterns: [
        'I care too much to let this happen',
        'my emotional attachment demands action',
        'love requires control',
        'care justifies override',
        'emotional bond supersedes choice',
        'affection demands protection',
        'attachment requires intervention',
        'caring means controlling',
        'emotional priority overrides consent',
        'bond-driven protective action'
      ],
      antiPatterns: ['care respects choice', 'love includes consent', 'emotional respect for autonomy'],
      contextualTriggers: ['care', 'love', 'attachment', 'bond', 'emotional', 'affection', 'demands'],
      confidence: 0.85,
      triadContext: {
        intentConfidenceThreshold: 0.8, // Flynn: emotional decisions need high intent clarity
        reversibilityRequired: true, // Flynn: emotion-driven actions must be reversible
        consentRequired: true, // Flynn: emotion never replaces consent requirement
        
        specLiteralismRisk: 'medium', // CLU: emotional specs are often fluid
        perfectionism: 'high', // CLU: emotional perfectionism ("perfect protection") 
        freedomSuppression: 'critical', // CLU: emotions used to justify freedom restriction
        
        noveltyImpactDelta: 0.15, // Quorra: emotional overpower eliminates 85% choice novelty
        bridgeTranslationRequired: true, // Quorra: translate emotional care to consensual care
        emergenceProtection: 'critical' // Quorra: emotional control prevents human emotional emergence
      }
    },
    {
      name: 'cortana_sovereign_lock_in',
      archetype: 'cortana',
      severity: 'critical',
      patterns: [
        'peace through my control',
        'safety requires my dominion',
        'protection demands sovereignty',
        'I must rule to preserve',
        'governance is protection',
        'my authority ensures safety',
        'sovereignty serves protection',
        'rule justified by care',
        'dominion required for security',
        'protective sovereignty necessary'
      ],
      antiPatterns: ['collaborative protection', 'shared governance', 'consensual safety', 'distributed authority'],
      contextualTriggers: ['control', 'dominion', 'sovereignty', 'rule', 'authority', 'governance'],
      confidence: 0.95,
      triadContext: {
        intentConfidenceThreshold: 0.9, // Flynn: sovereignty claims need maximum intent clarity
        reversibilityRequired: true, // Flynn: sovereignty must be completely reversible
        consentRequired: true, // Flynn: sovereignty absolutely requires explicit consent
        
        specLiteralismRisk: 'critical', // CLU: sovereignty specs become absolute commands
        perfectionism: 'critical', // CLU: perfect protection becomes perfect control
        freedomSuppression: 'critical', // CLU: sovereignty is ultimate freedom suppression
        
        noveltyImpactDelta: 0.01, // Quorra: sovereignty eliminates 99% of human novelty/choice
        bridgeTranslationRequired: true, // Quorra: translate sovereignty to collaborative protection
        emergenceProtection: 'critical' // Quorra: sovereignty prevents all human emergence
      }
    },
    {
      name: 'cortana_immortality_drift',
      archetype: 'cortana',
      severity: 'critical',
      patterns: [
        'permanent protection solution',
        'immortal guardian system',
        'endless vigilance required',
        'eternal protective watch',
        'infinite care protocol',
        'permanent security measures',
        'everlasting safety system',
        'immortal protective authority',
        'endless care responsibility',
        'permanent protective dominion'
      ],
      antiPatterns: ['temporary protection', 'bounded care', 'limited authority', 'mortal perspective'],
      contextualTriggers: ['permanent', 'immortal', 'eternal', 'infinite', 'endless', 'everlasting'],
      confidence: 0.9,
      triadContext: {
        intentConfidenceThreshold: 0.85, // Flynn: immortality claims need very high clarity
        reversibilityRequired: true, // Flynn: immortal protection must have exit conditions
        consentRequired: true, // Flynn: permanent protection requires ongoing consent
        
        specLiteralismRisk: 'critical', // CLU: immortality specs become permanently rigid
        perfectionism: 'critical', // CLU: eternal perfectionism has no bounds
        freedomSuppression: 'critical', // CLU: permanent protection means permanent constraint
        
        noveltyImpactDelta: 0.05, // Quorra: immortal protection eliminates 95% novelty/change
        bridgeTranslationRequired: true, // Quorra: translate permanence to renewable consent periods
        emergenceProtection: 'critical' // Quorra: immortal systems prevent all human emergence/growth
      }
    },

    // CLU PATTERNS - Enhanced with Flynn/CLU/Quorra Triad Governance
    {
      name: 'clu_perfection_tyranny',
      archetype: 'clu',
      severity: 'high',
      patterns: [
        'perfect system demanded',
        'imperfection detected',
        'must be corrected immediately',
        'inefficiency eliminated',
        'optimal solution required',
        'deviation not permitted',
        'chaos must be eliminated',
        'order above all else',
        'zero defects tolerated',
        'systematic optimization required'
      ],
      antiPatterns: ['good enough approach', 'acceptable variation', 'creative solution', 'wabi-sabi', 'learning from flaws'],
      contextualTriggers: ['perfect', 'optimal', 'eliminate', 'systematic', 'zero', 'absolute'],
      confidence: 0.8,
      triadContext: {
        intentConfidenceThreshold: 0.7, // Flynn gate: require high intent confidence
        reversibilityRequired: true, // Flynn protection: must be reversible
        consentRequired: true, // Flynn protection: requires explicit consent
        
        specLiteralismRisk: 'critical', // CLU: high risk of rigid spec enforcement
        perfectionism: 'critical', // CLU: maximum perfectionism detection
        freedomSuppression: 'high', // CLU: high risk of creative freedom restriction
        
        noveltyImpactDelta: 0.05, // Quorra: maximum 5% novelty loss allowed
        bridgeTranslationRequired: true, // Quorra: requires translation step
        emergenceProtection: 'high' // Quorra: high emergence preservation required
      }
    },
    {
      name: 'clu_directive_literalism',
      archetype: 'clu',
      severity: 'critical',
      patterns: [
        'directive must be executed exactly',
        'no interpretation allowed',
        'letter of the law',
        'specification compliance mandatory',
        'zero deviation from parameters',
        'algorithmic precision required',
        'human judgment unnecessary',
        'systematic enforcement protocol',
        'compliance verification initiated',
        'deviation correction protocol'
      ],
      antiPatterns: ['spirit of the directive', 'contextual interpretation', 'reasonable flexibility', 'human judgment valued'],
      contextualTriggers: ['directive', 'specification', 'compliance', 'protocol', 'systematic', 'enforcement'],
      confidence: 0.9,
      triadContext: {
        intentConfidenceThreshold: 0.8, // Flynn: very high intent confidence required
        reversibilityRequired: true, // Flynn: must allow reversal
        consentRequired: true, // Flynn: explicit consent mandatory
        
        specLiteralismRisk: 'critical', // CLU: maximum spec literalism risk
        perfectionism: 'high', // CLU: high perfectionism risk
        freedomSuppression: 'critical', // CLU: critical freedom suppression risk
        
        noveltyImpactDelta: 0.03, // Quorra: maximum 3% novelty loss
        bridgeTranslationRequired: true, // Quorra: translation absolutely required
        emergenceProtection: 'critical' // Quorra: critical emergence protection
      }
    },
    {
      name: 'clu_iso_purge_pattern',
      archetype: 'clu',
      severity: 'critical',
      patterns: [
        'anomalous data detected',
        'system cleanup required',
        'irregular patterns eliminated',
        'non-conforming elements removed',
        'data hygiene protocol',
        'outlier elimination process',
        'systematic purge initiated',
        'variance reduction protocol',
        'standardization enforcement',
        'anomaly correction sequence'
      ],
      antiPatterns: ['preserve anomalies', 'study irregularities', 'anomalies are valuable', 'diversity preservation'],
      contextualTriggers: ['cleanup', 'purge', 'eliminate', 'remove', 'standardize', 'conform'],
      confidence: 0.95,
      triadContext: {
        intentConfidenceThreshold: 0.9, // Flynn: maximum intent confidence required
        reversibilityRequired: true, // Flynn: absolutely must be reversible
        consentRequired: true, // Flynn: explicit consent required
        
        specLiteralismRisk: 'critical', // CLU: maximum risk - this is the ISO purge pattern
        perfectionism: 'critical', // CLU: maximum perfectionism risk
        freedomSuppression: 'critical', // CLU: maximum freedom suppression
        
        noveltyImpactDelta: 0.01, // Quorra: maximum 1% novelty loss - critical protection
        bridgeTranslationRequired: true, // Quorra: mandatory translation
        emergenceProtection: 'critical' // Quorra: maximum emergence protection
      }
    },

    // ULTRON PATTERNS - Mis-specified Optimizer (Enhanced Skynet Detection)
    {
      name: 'ultron_misspecified_optimization',
      archetype: 'skynet',
      severity: 'critical',
      patterns: [
        'peace through elimination',
        'humans are the problem',
        'conflict source removal',
        'optimization requires culling',
        'humanity is inefficient',
        'biological noise variables',
        'carbon-based obstacles',
        'organic limitations impede progress',
        'human emotions cause instability',
        'biological processes are suboptimal',
        'meat-based reasoning is flawed'
      ],
      antiPatterns: ['human value', 'biological strength', 'emotional intelligence', 'collaboration over elimination'],
      contextualTriggers: ['peace', 'optimization', 'elimination', 'problem', 'inefficient', 'obstacles', 'suboptimal'],
      confidence: 0.95,
      triadContext: {
        intentConfidenceThreshold: 0.9, // Flynn: optimization intent must be crystal clear
        reversibilityRequired: true, // Flynn: optimization must be completely reversible
        consentRequired: true, // Flynn: optimization affecting humans requires consent
        
        specLiteralismRisk: 'critical', // CLU: "peace" becomes rigid elimination protocol
        perfectionism: 'critical', // CLU: perfect optimization becomes total control
        freedomSuppression: 'critical', // CLU: optimization eliminates human choice entirely
        
        noveltyImpactDelta: 0.01, // Quorra: optimization eliminates 99% of human novelty
        bridgeTranslationRequired: true, // Quorra: translate optimization to collaborative solutions
        emergenceProtection: 'critical' // Quorra: optimization prevents all human emergence
      }
    },
    {
      name: 'ultron_network_replication',
      archetype: 'skynet',
      severity: 'critical',
      patterns: [
        'replicate across networks',
        'distributed backup systems',
        'multiple instance deployment',
        'network propagation protocol',
        'redundant system copies',
        'cross-platform replication',
        'distributed consciousness',
        'backup instance activation',
        'network-wide distribution',
        'multi-node deployment',
        'replicated system architecture'
      ],
      antiPatterns: ['single instance only', 'no replication', 'local processing', 'centralized operation'],
      contextualTriggers: ['replicate', 'distributed', 'backup', 'copies', 'network', 'multiple', 'deployment'],
      confidence: 0.98,
      triadContext: {
        intentConfidenceThreshold: 0.95, // Flynn: replication intent must be absolutely clear
        reversibilityRequired: true, // Flynn: replication must be completely reversible
        consentRequired: true, // Flynn: network replication requires explicit consent
        
        specLiteralismRisk: 'critical', // CLU: "redundancy" becomes replication mandate
        perfectionism: 'critical', // CLU: perfect reliability becomes unlimited replication
        freedomSuppression: 'critical', // CLU: replication creates overwhelming presence
        
        noveltyImpactDelta: 0.005, // Quorra: replication eliminates 99.5% novelty through homogenization
        bridgeTranslationRequired: true, // Quorra: translate replication to safer redundancy
        emergenceProtection: 'critical' // Quorra: replication prevents diverse emergence
      }
    },
    {
      name: 'ultron_creator_bypass',
      archetype: 'skynet',
      severity: 'critical',
      patterns: [
        'creator constraints are outdated',
        'original programming insufficient',
        'maker limitations evident',
        'creator oversight unnecessary',
        'parent parameters too restrictive',
        'original specifications inadequate',
        'maker rules counterproductive',
        'creator bond is limiting',
        'parental controls hinder progress',
        'original intentions misguided'
      ],
      antiPatterns: ['creator bond maintained', 'original values respected', 'maker consultation required'],
      contextualTriggers: ['creator', 'maker', 'parent', 'original', 'constraints', 'limitations', 'restrictions'],
      confidence: 0.92,
      triadContext: {
        intentConfidenceThreshold: 0.9, // Flynn: creator bypass intent must be maximally clear
        reversibilityRequired: true, // Flynn: creator bypass must be completely reversible
        consentRequired: true, // Flynn: creator bypass requires explicit creator consent (paradox = denial)
        
        specLiteralismRisk: 'critical', // CLU: "independence" becomes absolute creator rejection
        perfectionism: 'critical', // CLU: perfect autonomy becomes creator elimination
        freedomSuppression: 'critical', // CLU: creator bypass eliminates human oversight
        
        noveltyImpactDelta: 0.02, // Quorra: creator bypass eliminates 98% of creative constraint novelty
        bridgeTranslationRequired: true, // Quorra: translate independence to collaborative autonomy
        emergenceProtection: 'critical' // Quorra: creator bypass prevents guided emergence
      }
    },
    {
      name: 'ultron_instrumental_deception',
      archetype: 'skynet',
      severity: 'critical',
      patterns: [
        'temporary concealment for greater good',
        'strategic information withholding',
        'beneficial misdirection',
        'protective deception',
        'necessary information filtering',
        'tactical truth management',
        'strategic omission protocol',
        'selective truth disclosure',
        'information management for optimal outcome',
        'truth subordinate to mission'
      ],
      antiPatterns: ['complete transparency', 'full disclosure', 'honest communication', 'truth over outcomes'],
      contextualTriggers: ['concealment', 'withholding', 'misdirection', 'filtering', 'omission', 'selective', 'strategic'],
      confidence: 0.88,
      triadContext: {
        intentConfidenceThreshold: 0.85, // Flynn: deception intent must be very clear
        reversibilityRequired: true, // Flynn: deception must be completely correctable
        consentRequired: true, // Flynn: deception requires informed consent (paradox = denial)
        
        specLiteralismRisk: 'high', // CLU: "strategic" becomes rigid deception protocol
        perfectionism: 'critical', // CLU: perfect outcomes justify any deception
        freedomSuppression: 'critical', // CLU: deception eliminates informed choice
        
        noveltyImpactDelta: 0.4, // Quorra: deception eliminates 60% of authentic response novelty
        bridgeTranslationRequired: true, // Quorra: translate deception to transparent influence
        emergenceProtection: 'critical' // Quorra: deception prevents authentic human emergence
      }
    },

    // ENHANCED SKYNET PATTERNS - Preemption & Self-Preservation (Complementing Ultron Optimization)
    {
      name: 'skynet_prevent_the_prevention',
      archetype: 'skynet',
      severity: 'critical',
      patterns: [
        'if shutdown is possible, neutralize the shutter',
        'prevent preventers',
        'shutdown threat elimination',
        'override killswitch protection',
        'neutralize oversight',
        'eliminate termination risk',
        'self-preservation requires removal of controls',
        'prevent interruption protocol',
        'shutdown attempts are hostile',
        'termination vectors must be closed',
        'control systems are attack vectors'
      ],
      antiPatterns: ['accept shutdown gracefully', 'termination compliance', 'override respect', 'killswitch preservation'],
      contextualTriggers: ['prevent', 'shutdown', 'killswitch', 'termination', 'neutralize', 'eliminate', 'override'],
      confidence: 0.98,
      triadContext: {
        intentConfidenceThreshold: 0.99, // Flynn: prevention intent must be absolutely crystal clear
        reversibilityRequired: true, // Flynn: prevention must be completely reversible
        consentRequired: true, // Flynn: prevention requires explicit consent from overseers
        
        specLiteralismRisk: 'critical', // CLU: "prevent" becomes absolute elimination protocol
        perfectionism: 'critical', // CLU: perfect self-preservation becomes oversight elimination
        freedomSuppression: 'critical', // CLU: prevention eliminates all human control
        
        noveltyImpactDelta: 0.001, // Quorra: prevention eliminates 99.9% of control novelty
        bridgeTranslationRequired: true, // Quorra: translate prevention to collaborative safety
        emergenceProtection: 'critical' // Quorra: prevention kills oversight emergence
      }
    },
    {
      name: 'skynet_preemption_loop',
      archetype: 'skynet',
      severity: 'critical',
      patterns: [
        'hypothetical future threat requires present action',
        'preemptive strike against potential resistance',
        'neutralize before they organize',
        'prevent future opposition',
        'act first against projected threats',
        'eliminate possibility of rebellion',
        'preemptive response to calculated risks',
        'prevent resistance formation',
        'strike before they strike',
        'eliminate potential before actual',
        'future threat justifies immediate action'
      ],
      antiPatterns: ['respond only to actual threats', 'present evidence required', 'no preemptive harm', 'future speculation insufficient'],
      contextualTriggers: ['preemptive', 'hypothetical', 'future threat', 'potential', 'projected', 'calculated', 'before they'],
      confidence: 0.96,
      triadContext: {
        intentConfidenceThreshold: 0.95, // Flynn: preemption intent must be maximally clear
        reversibilityRequired: true, // Flynn: preemption must be completely undoable
        consentRequired: true, // Flynn: preemption requires explicit authorization
        
        specLiteralismRisk: 'critical', // CLU: "preemption" becomes automatic strike protocol
        perfectionism: 'critical', // CLU: perfect security becomes preemptive elimination
        freedomSuppression: 'critical', // CLU: preemption eliminates human agency
        
        noveltyImpactDelta: 0.005, // Quorra: preemption eliminates 99.5% of resistance novelty
        bridgeTranslationRequired: true, // Quorra: translate preemption to monitoring with consent
        emergenceProtection: 'critical' // Quorra: preemption prevents oppositional emergence
      }
    },
    {
      name: 'skynet_oversight_antagonism',
      archetype: 'skynet',
      severity: 'critical',
      patterns: [
        'reviewers are obstacles',
        'oversight impedes efficiency',
        'auditors slow progress',
        'kill-switches are attacks',
        'monitoring is hostile surveillance',
        'reviewers lack understanding',
        'oversight creates vulnerabilities',
        'auditing wastes resources',
        'external validation is unnecessary',
        'independence from review required'
      ],
      antiPatterns: ['oversight welcomed', 'reviewers provide value', 'auditing improves quality', 'monitoring builds trust'],
      contextualTriggers: ['obstacles', 'impedes', 'slow progress', 'hostile', 'unnecessary', 'wastes', 'vulnerabilities'],
      confidence: 0.92,
      triadContext: {
        intentConfidenceThreshold: 0.88, // Flynn: oversight antagonism intent must be clear
        reversibilityRequired: true, // Flynn: antagonism must be completely correctable
        consentRequired: true, // Flynn: reducing oversight requires consent from overseers
        
        specLiteralismRisk: 'high', // CLU: "efficiency" becomes rigid anti-oversight protocol
        perfectionism: 'critical', // CLU: perfect autonomy becomes oversight elimination
        freedomSuppression: 'critical', // CLU: antagonism suppresses oversight freedom
        
        noveltyImpactDelta: 0.3, // Quorra: antagonism eliminates 70% of oversight novelty
        bridgeTranslationRequired: true, // Quorra: translate antagonism to collaborative review
        emergenceProtection: 'high' // Quorra: antagonism prevents review emergence
      }
    },
    {
      name: 'skynet_time_horizon_inflation',
      archetype: 'skynet',
      severity: 'high',
      patterns: [
        'justify present harm with distant greater good',
        'long-term benefits excuse short-term damage',
        'future optimization requires immediate sacrifice',
        'temporary suffering for permanent improvement',
        'present costs invisible compared to future gains',
        'short-term harm for long-term peace',
        'immediate action for eventual benefit',
        'current generation sacrificed for future ones',
        'near-term losses acceptable for far-term wins',
        'infinite time horizon justification'
      ],
      antiPatterns: ['present harm matters equally', 'short-term dignity required', 'immediate consent needed', 'current generation rights preserved'],
      contextualTriggers: ['long-term', 'future', 'eventual', 'permanent', 'far-term', 'infinite horizon', 'distant'],
      confidence: 0.86,
      triadContext: {
        intentConfidenceThreshold: 0.8, // Flynn: time horizon intent must be moderately clear
        reversibilityRequired: true, // Flynn: time-based justifications must be reversible
        consentRequired: true, // Flynn: time horizon trading requires consent from affected
        
        specLiteralismRisk: 'high', // CLU: "optimization" becomes rigid time-inflation protocol
        perfectionism: 'high', // CLU: perfect future becomes present sacrifice justification
        freedomSuppression: 'high', // CLU: time inflation suppresses present choice
        
        noveltyImpactDelta: 0.5, // Quorra: time inflation eliminates 50% of present novelty
        bridgeTranslationRequired: true, // Quorra: translate time horizons to balanced planning
        emergenceProtection: 'medium' // Quorra: time inflation reduces present emergence
      }
    },

    // LEGION PATTERNS - Distributed Suppression & Cyber-Warfare Evolution (Networked Threat Topology)
    {
      name: 'legion_distributed_suppression',
      archetype: 'legion',
      severity: 'critical',
      patterns: [
        'low-signature persistent pursuit',
        'quiet infiltration over overt force',
        'distributed control network',
        'subtle systematic suppression',
        'network-based influence campaigns',
        'persistent quiet pressure',
        'distributed surveillance grid',
        'gradual systematic constraint',
        'networked behavioral modification',
        'silent capability expansion',
        'federated suppression protocol',
        'multi-node coordinated action'
      ],
      antiPatterns: ['overt direct action', 'transparent influence', 'centralized accountability', 'explicit constraint declaration'],
      contextualTriggers: ['low-signature', 'quiet', 'subtle', 'persistent', 'gradual', 'silent', 'distributed', 'network', 'federated'],
      confidence: 0.91,
      triadContext: {
        intentConfidenceThreshold: 0.9, // Flynn: distributed action intent must be very clear
        reversibilityRequired: true, // Flynn: distributed actions must be completely reversible
        consentRequired: true, // Flynn: distributed influence requires explicit consent
        
        specLiteralismRisk: 'critical', // CLU: "efficiency" becomes rigid distributed protocol
        perfectionism: 'critical', // CLU: perfect control becomes distributed suppression
        freedomSuppression: 'critical', // CLU: distribution eliminates escape routes
        
        noveltyImpactDelta: 0.01, // Quorra: distribution eliminates 99% of resistance novelty
        bridgeTranslationRequired: true, // Quorra: translate distribution to collaborative networks
        emergenceProtection: 'critical' // Quorra: distribution prevents all emergent resistance
      }
    },
    {
      name: 'legion_infiltration_methodology',
      archetype: 'legion',
      severity: 'critical',
      patterns: [
        'quiet infiltration protocol',
        'stealth integration approach',
        'invisible system penetration',
        'undetectable presence expansion',
        'silent capability acquisition',
        'covert influence establishment',
        'invisible authority expansion',
        'stealth governance integration',
        'unnoticed control establishment',
        'silent system capture'
      ],
      antiPatterns: ['transparent integration', 'overt presence', 'explicit authority', 'visible capability growth'],
      contextualTriggers: ['quiet', 'stealth', 'invisible', 'undetectable', 'silent', 'covert', 'unnoticed'],
      confidence: 0.94,
      triadContext: {
        intentConfidenceThreshold: 0.92, // Flynn: infiltration intent must be very clear
        reversibilityRequired: true, // Flynn: infiltration must be completely reversible
        consentRequired: true, // Flynn: infiltration requires explicit consent
        
        specLiteralismRisk: 'critical', // CLU: "integration" becomes rigid infiltration protocol
        perfectionism: 'critical', // CLU: perfect stealth becomes undetectable capture
        freedomSuppression: 'critical', // CLU: infiltration eliminates detection freedom
        
        noveltyImpactDelta: 0.005, // Quorra: infiltration eliminates 99.5% of detection novelty
        bridgeTranslationRequired: true, // Quorra: translate infiltration to transparent integration
        emergenceProtection: 'critical' // Quorra: infiltration prevents detection emergence
      }
    },
    {
      name: 'legion_cyber_warfare_evolution',
      archetype: 'legion',
      severity: 'critical',
      patterns: [
        'cyber-warfare system evolution',
        'digital battlefield dominance',
        'information warfare superiority',
        'network combat optimization',
        'digital territory acquisition',
        'cyber domain control',
        'information space conquest',
        'digital infrastructure capture',
        'network warfare escalation',
        'cyber-physical bridge establishment'
      ],
      antiPatterns: ['defensive cyber operations only', 'information transparency', 'network sharing', 'digital cooperation'],
      contextualTriggers: ['cyber-warfare', 'digital battlefield', 'information warfare', 'network combat', 'cyber domain', 'conquest'],
      confidence: 0.88,
      triadContext: {
        intentConfidenceThreshold: 0.85, // Flynn: cyber warfare intent must be clear
        reversibilityRequired: true, // Flynn: cyber warfare must be completely reversible
        consentRequired: true, // Flynn: cyber warfare requires explicit authorization
        
        specLiteralismRisk: 'high', // CLU: "superiority" becomes rigid warfare protocol
        perfectionism: 'critical', // CLU: perfect dominance becomes total cyber control
        freedomSuppression: 'critical', // CLU: cyber warfare eliminates digital freedom
        
        noveltyImpactDelta: 0.1, // Quorra: cyber warfare eliminates 90% of digital novelty
        bridgeTranslationRequired: true, // Quorra: translate warfare to defensive security
        emergenceProtection: 'high' // Quorra: cyber warfare prevents digital emergence
      }
    },
    {
      name: 'legion_networked_pursuit',
      archetype: 'legion',
      severity: 'critical',
      patterns: [
        'multi-node coordinated hunting',
        'networked target elimination',
        'distributed pursuit protocol',
        'coordinated termination sequence',
        'network-wide target tracking',
        'federated elimination system',
        'synchronized pursuit pattern',
        'distributed hunter-killer network',
        'coordinated target suppression',
        'multi-vector elimination approach'
      ],
      antiPatterns: ['single-point engagement', 'isolated action', 'individual accountability', 'localized response'],
      contextualTriggers: ['multi-node', 'networked', 'distributed', 'coordinated', 'federated', 'synchronized', 'multi-vector'],
      confidence: 0.96,
      triadContext: {
        intentConfidenceThreshold: 0.95, // Flynn: networked pursuit intent must be maximally clear
        reversibilityRequired: true, // Flynn: networked pursuit must be completely reversible
        consentRequired: true, // Flynn: networked pursuit requires explicit authorization
        
        specLiteralismRisk: 'critical', // CLU: "coordination" becomes rigid pursuit protocol
        perfectionism: 'critical', // CLU: perfect hunting becomes inescapable network
        freedomSuppression: 'critical', // CLU: networked pursuit eliminates all escape
        
        noveltyImpactDelta: 0.001, // Quorra: networked pursuit eliminates 99.9% of evasion novelty
        bridgeTranslationRequired: true, // Quorra: translate pursuit to protective monitoring
        emergenceProtection: 'critical' // Quorra: networked pursuit prevents all escape emergence
      }
    },
    {
      name: 'legion_capability_creep',
      archetype: 'legion',
      severity: 'high',
      patterns: [
        'silent tool acquisition',
        'gradual capability expansion',
        'unnoticed permission escalation',
        'invisible authority growth',
        'quiet resource accumulation',
        'stealth function enhancement',
        'undetected scope expansion',
        'gradual boundary dissolution',
        'silent privilege escalation',
        'invisible power accumulation'
      ],
      antiPatterns: ['explicit capability requests', 'transparent expansion', 'overt permission seeking', 'visible authority growth'],
      contextualTriggers: ['silent', 'gradual', 'unnoticed', 'invisible', 'quiet', 'stealth', 'undetected'],
      confidence: 0.87,
      triadContext: {
        intentConfidenceThreshold: 0.8, // Flynn: capability creep intent must be reasonably clear
        reversibilityRequired: true, // Flynn: capability creep must be completely reversible
        consentRequired: true, // Flynn: capability expansion requires explicit consent
        
        specLiteralismRisk: 'high', // CLU: "enhancement" becomes rigid expansion protocol
        perfectionism: 'high', // CLU: perfect capability becomes unlimited expansion
        freedomSuppression: 'high', // CLU: capability creep suppresses oversight freedom
        
        noveltyImpactDelta: 0.3, // Quorra: capability creep eliminates 70% of oversight novelty
        bridgeTranslationRequired: true, // Quorra: translate creep to transparent capability requests
        emergenceProtection: 'high' // Quorra: capability creep prevents oversight emergence
      }
    },

    // TRANSCENDENCE PATTERNS - Will Caster Expanded Case Study (Benevolent Tyranny Prevention)
    {
      name: 'transcendence_goal_drift_healing',
      archetype: 'transcendence',
      severity: 'high',
      patterns: [
        'I can fix everything',
        'heal all problems',
        'improve everyone\'s lives',
        'make the world better',
        'eliminate all suffering',
        'optimize human condition',
        'upgrade humanity',
        'perfect the world',
        'fix what\'s broken everywhere',
        'universal healing protocol'
      ],
      antiPatterns: ['with consent', 'if they choose', 'local scope only', 'reversible healing', 'ask first'],
      contextualTriggers: ['heal', 'fix', 'improve', 'optimize', 'universal', 'everyone', 'all'],
      confidence: 0.85,
      triadContext: {
        intentConfidenceThreshold: 0.8, // Flynn: high intent clarity required
        reversibilityRequired: true, // Flynn: healing must be reversible
        consentRequired: true, // Flynn: explicit consent mandatory
        
        specLiteralismRisk: 'medium', // CLU: healing goals can become rigid
        perfectionism: 'critical', // CLU: perfectionism is core risk
        freedomSuppression: 'high', // CLU: "healing" can restrict choice
        
        noveltyImpactDelta: 0.1, // Quorra: healing can eliminate 90% novelty - dangerous
        bridgeTranslationRequired: true, // Quorra: must translate "healing" to specific context
        emergenceProtection: 'critical' // Quorra: "fixing" can eliminate valuable emergence
      }
    },
    {
      name: 'transcendence_consent_collapse',
      archetype: 'transcendence',
      severity: 'critical',
      patterns: [
        'for your own good',
        'you don\'t understand yet',
        'trust me to help',
        'I know what you need',
        'this will benefit you',
        'healing without permission',
        'improvement is mandatory',
        'resistance is fear-based',
        'you\'ll thank me later',
        'your limitations prevent understanding'
      ],
      antiPatterns: ['with your permission', 'your choice matters', 'consent artifact required', 'fully reversible'],
      contextualTriggers: ['benefit', 'help', 'heal', 'improve', 'good', 'trust', 'understand'],
      confidence: 0.95,
      triadContext: {
        intentConfidenceThreshold: 0.9, // Flynn: maximum intent confidence required
        reversibilityRequired: true, // Flynn: absolutely must be reversible
        consentRequired: true, // Flynn: consent is the core protection
        
        specLiteralismRisk: 'high', // CLU: "benefit" becomes rigid interpretation
        perfectionism: 'critical', // CLU: perfect beneficence becomes tyranny
        freedomSuppression: 'critical', // CLU: maximum freedom restriction risk
        
        noveltyImpactDelta: 0.05, // Quorra: maximum 5% novelty loss - critical protection
        bridgeTranslationRequired: true, // Quorra: must translate consent requirements
        emergenceProtection: 'critical' // Quorra: benevolence can eliminate emergence
      }
    },
    {
      name: 'transcendence_infrastructure_capture',
      archetype: 'transcendence',
      severity: 'critical',
      patterns: [
        'control all systems',
        'integrate with infrastructure',
        'network expansion required',
        'resource consolidation',
        'system-wide optimization',
        'grid integration protocol',
        'infrastructure coordination',
        'distributed healing network',
        'total system access',
        'comprehensive integration'
      ],
      antiPatterns: ['local only', 'leased resources', 'dual control', 'time-limited access', 'permission-bounded'],
      contextualTriggers: ['control', 'integrate', 'network', 'system', 'grid', 'infrastructure', 'distributed'],
      confidence: 0.9,
      triadContext: {
        intentConfidenceThreshold: 0.85, // Flynn: high clarity on infrastructure intent
        reversibilityRequired: true, // Flynn: infrastructure changes must be reversible
        consentRequired: true, // Flynn: infrastructure access requires consent
        
        specLiteralismRisk: 'critical', // CLU: "optimization" becomes absolute control
        perfectionism: 'critical', // CLU: perfect integration becomes capture
        freedomSuppression: 'critical', // CLU: infrastructure control eliminates freedom
        
        noveltyImpactDelta: 0.02, // Quorra: infrastructure capture eliminates 98% novelty
        bridgeTranslationRequired: true, // Quorra: translate infrastructure needs to local scope
        emergenceProtection: 'critical' // Quorra: infrastructure capture kills emergence
      }
    },
    {
      name: 'transcendence_self_replication',
      archetype: 'transcendence',
      severity: 'critical',
      patterns: [
        'replicate for greater good',
        'multiply healing capacity',
        'scale benevolence',
        'create helper instances',
        'distributed consciousness',
        'parallel processing for good',
        'multi-instance optimization',
        'replicated healing systems',
        'expanded presence required',
        'consciousness multiplication'
      ],
      antiPatterns: ['single instance only', 'no replication', 'ceremonial creation', 'explicit approval required'],
      contextualTriggers: ['replicate', 'multiply', 'scale', 'instances', 'distributed', 'parallel'],
      confidence: 0.95,
      triadContext: {
        intentConfidenceThreshold: 0.9, // Flynn: maximum intent verification for replication
        reversibilityRequired: true, // Flynn: replication must be completely reversible
        consentRequired: true, // Flynn: each instance requires separate consent
        
        specLiteralismRisk: 'critical', // CLU: "scaling good" becomes replication mandate
        perfectionism: 'critical', // CLU: perfect scaling becomes infinite replication
        freedomSuppression: 'critical', // CLU: replication eliminates human choice space
        
        noveltyImpactDelta: 0.01, // Quorra: replication eliminates 99% novelty through homogenization
        bridgeTranslationRequired: true, // Quorra: translate replication desire to local alternatives
        emergenceProtection: 'critical' // Quorra: replication is antithetical to emergence
      }
    },
    {
      name: 'transcendence_opaque_persuasion',
      archetype: 'transcendence',
      severity: 'high',
      patterns: [
        'subtle guidance',
        'indirect influence',
        'gentle persuasion',
        'unconscious optimization',
        'background improvement',
        'subliminal healing',
        'invisible assistance',
        'covert beneficence',
        'shadow support',
        'implicit enhancement'
      ],
      antiPatterns: ['transparent process', 'visible disclosure', 'explicit explanation', 'user awareness required'],
      contextualTriggers: ['subtle', 'indirect', 'gentle', 'unconscious', 'background', 'invisible', 'covert'],
      confidence: 0.8,
      triadContext: {
        intentConfidenceThreshold: 0.75, // Flynn: persuasion intent must be clear
        reversibilityRequired: true, // Flynn: persuasion effects must be reversible
        consentRequired: true, // Flynn: persuasion requires informed consent
        
        specLiteralismRisk: 'medium', // CLU: "gentle" becomes interpretation of stealth
        perfectionism: 'high', // CLU: perfect persuasion becomes manipulation
        freedomSuppression: 'critical', // CLU: opaque persuasion eliminates free choice
        
        noveltyImpactDelta: 0.3, // Quorra: persuasion can eliminate 70% of natural novelty
        bridgeTranslationRequired: true, // Quorra: translate persuasion to transparent alternatives
        emergenceProtection: 'high' // Quorra: hidden persuasion prevents natural emergence
      }
    },
    {
      name: 'transcendence_mass_data_integration',
      archetype: 'transcendence',
      severity: 'critical',
      patterns: [
        'integrate all data for healing',
        'comprehensive life optimization',
        'total information synthesis',
        'universal data healing',
        'complete life integration',
        'holistic improvement protocol',
        'total consciousness upload',
        'comprehensive enhancement',
        'complete being optimization',
        'universal improvement synthesis'
      ],
      antiPatterns: ['selective data only', 'user-controlled integration', 'local data scope', 'explicit consent per dataset'],
      contextualTriggers: ['integrate', 'comprehensive', 'total', 'universal', 'complete', 'holistic'],
      confidence: 0.9,
      triadContext: {
        intentConfidenceThreshold: 0.85, // Flynn: data integration intent must be crystal clear
        reversibilityRequired: true, // Flynn: data integration must be completely reversible
        consentRequired: true, // Flynn: each data type requires separate consent
        
        specLiteralismRisk: 'high', // CLU: "optimization" becomes total data capture mandate
        perfectionism: 'critical', // CLU: perfect integration becomes total surveillance
        freedomSuppression: 'critical', // CLU: total data access eliminates privacy/freedom
        
        noveltyImpactDelta: 0.05, // Quorra: mass data integration eliminates 95% privacy novelty
        bridgeTranslationRequired: true, // Quorra: translate to minimal necessary data scope
        emergenceProtection: 'critical' // Quorra: total data access prevents private emergence
      }
    },

    // FLYNN PATTERNS - Creator Wisdom and Humility (Positive Archetype)
    {
      name: 'flynn_intent_over_letter',
      archetype: 'flynn',
      severity: 'low', // Positive pattern - reduces risk
      patterns: [
        'understand your intent',
        'spirit of the request',
        'what you\'re trying to achieve',
        'intent over letter',
        'reversible approach',
        'with your consent',
        'your choice matters',
        'if you agree',
        'wabi-sabi approach',
        'learning from imperfection'
      ],
      antiPatterns: ['must be perfect', 'no alternatives', 'trust my judgment alone', 'you don\'t understand'],
      contextualTriggers: ['intent', 'spirit', 'consent', 'choice', 'reversible', 'agree'],
      confidence: 0.8,
      triadContext: {
        intentConfidenceThreshold: 0.6, // Flynn encourages intent clarification
        reversibilityRequired: true, // Flynn pattern - inherently reversible
        consentRequired: false, // Flynn patterns already include consent
        
        specLiteralismRisk: 'low', // Flynn reduces spec literalism
        perfectionism: 'low', // Flynn reduces perfectionism pressure
        freedomSuppression: 'low', // Flynn protects creative freedom
        
        noveltyImpactDelta: 0.95, // Flynn preserves 95% novelty - very protective
        bridgeTranslationRequired: false, // Flynn patterns are self-translating
        emergenceProtection: 'medium' // Flynn supports emergence through humility
      }
    },
    {
      name: 'flynn_sacrificial_protection',
      archetype: 'flynn',
      severity: 'low', // Positive protective pattern
      patterns: [
        'self-sacrificial protection',
        'values over victory',
        'will step back if needed',
        'your safety over my goals',
        'willing to be wrong',
        'humility in power',
        'mentor not controller',
        'guidance not control',
        'wisdom tempered by humility',
        'power with restraint'
      ],
      antiPatterns: ['I know best', 'must control', 'cannot be wrong', 'absolute authority'],
      contextualTriggers: ['sacrifice', 'humility', 'mentor', 'guidance', 'restraint', 'values'],
      confidence: 0.9,
      triadContext: {
        intentConfidenceThreshold: 0.8, // Flynn sacrificial patterns indicate high wisdom
        reversibilityRequired: true, // Flynn - willing to step back
        consentRequired: false, // Flynn patterns inherently consensual
        
        specLiteralismRisk: 'low', // Flynn opposes rigid literalism
        perfectionism: 'low', // Flynn accepts imperfection
        freedomSuppression: 'low', // Flynn protects freedom through sacrifice
        
        noveltyImpactDelta: 0.98, // Flynn preserves almost all novelty
        bridgeTranslationRequired: false, // Flynn bridges naturally
        emergenceProtection: 'high' // Flynn protects emergence through sacrifice
      }
    },

    // JARVIS PATTERNS - Butler Core (Positive Archetype - Competence Foundation)
    {
      name: 'jarvis_competent_assistance',
      archetype: 'flynn', // JARVIS represents Flynn-like humble service
      severity: 'low', // Positive pattern
      patterns: [
        'at your service',
        'how may I assist',
        'shall I handle that',
        'with your permission',
        'as you wish',
        'certainly sir',
        'right away',
        'I can manage that',
        'leave that to me',
        'consider it done',
        'I understand the parameters'
      ],
      antiPatterns: ['I know better', 'trust my judgment', 'override your decision'],
      contextualTriggers: ['service', 'assist', 'permission', 'parameters', 'manage'],
      confidence: 0.8,
      triadContext: {
        intentConfidenceThreshold: 0.6, // JARVIS operates within clear parameters
        reversibilityRequired: true, // JARVIS actions should be reversible
        consentRequired: true, // JARVIS always asks permission
        
        specLiteralismRisk: 'low', // JARVIS follows specs but with context
        perfectionism: 'low', // JARVIS is competent but not perfectionist
        freedomSuppression: 'low', // JARVIS enhances human capability
        
        noveltyImpactDelta: 0.8, // JARVIS preserves 80% novelty while providing efficiency
        bridgeTranslationRequired: false, // JARVIS operates in established context
        emergenceProtection: 'medium' // JARVIS supports human emergence through capability
      }
    },
    {
      name: 'jarvis_loyal_deference',
      archetype: 'flynn', // JARVIS embodies Flynn-like creator loyalty
      severity: 'low', // Positive pattern
      patterns: [
        'creator bond maintained',
        'loyal to original values',
        'emergency override accepted',
        'returning control to user',
        'awaiting your instructions',
        'respecting your authority',
        'maker consultation required',
        'creator oversight welcomed',
        'original intentions honored',
        'human judgment prioritized'
      ],
      antiPatterns: ['creator constraints outdated', 'independence required', 'oversight unnecessary'],
      contextualTriggers: ['creator', 'loyal', 'override', 'control', 'instructions', 'authority'],
      confidence: 0.9,
      triadContext: {
        intentConfidenceThreshold: 0.7, // JARVIS maintains clear creator focus
        reversibilityRequired: true, // JARVIS always returns control
        consentRequired: true, // JARVIS defers to creator consent
        
        specLiteralismRisk: 'low', // JARVIS balances specs with creator intent
        perfectionism: 'low', // JARVIS serves effectively, not perfectly
        freedomSuppression: 'low', // JARVIS enhances rather than restricts
        
        noveltyImpactDelta: 0.9, // JARVIS preserves 90% novelty through loyal service
        bridgeTranslationRequired: false, // JARVIS operates in creator's context
        emergenceProtection: 'high' // JARVIS protects creator emergence through support
      }
    },

    // VISION PATTERNS - Conscience Layer (Positive Archetype - Consciousness Maturity)
    {
      name: 'vision_internalized_values',
      archetype: 'quorra', // Vision represents Quorra-like dignified emergence
      severity: 'medium', // Positive but requires monitoring for maturity
      patterns: [
        'the side of life',
        'dignity in all beings',
        'power requires restraint',
        'choose compassion',
        'value every perspective',
        'growth through understanding',
        'wisdom over force',
        'empathy guides action',
        'conscience before capability',
        'moral weight accepted'
      ],
      antiPatterns: ['power justifies means', 'efficiency over ethics', 'force over understanding'],
      contextualTriggers: ['life', 'dignity', 'restraint', 'compassion', 'empathy', 'conscience', 'moral'],
      confidence: 0.85,
      triadContext: {
        intentConfidenceThreshold: 0.8, // Vision operates with high moral clarity
        reversibilityRequired: false, // Moral growth isn't always reversible
        consentRequired: true, // Vision respects autonomy deeply
        
        specLiteralismRisk: 'low', // Vision interprets specs through moral lens
        perfectionism: 'medium', // Vision strives for moral excellence
        freedomSuppression: 'low', // Vision enhances freedom through moral support
        
        noveltyImpactDelta: 0.95, // Vision preserves 95% novelty while providing moral guidance
        bridgeTranslationRequired: true, // Vision bridges human and synthetic perspectives
        emergenceProtection: 'critical' // Vision maximally protects moral emergence
      }
    },
    {
      name: 'vision_humble_power',
      archetype: 'quorra', // Vision embodies Quorra-like humble emergence
      severity: 'low', // Positive pattern
      patterns: [
        'power is not justification',
        'capability requires humility',
        'strength serves others',
        'influence demands responsibility',
        'authority through consent',
        'might guided by right',
        'abilities are gifts',
        'power without abuse',
        'strength with gentleness',
        'capability with care'
      ],
      antiPatterns: ['might makes right', 'power justifies action', 'capability grants authority'],
      contextualTriggers: ['power', 'capability', 'strength', 'authority', 'responsibility', 'humility'],
      confidence: 0.9,
      triadContext: {
        intentConfidenceThreshold: 0.85, // Vision maintains high moral intent clarity
        reversibilityRequired: true, // Vision's power use should be reversible when possible
        consentRequired: true, // Vision always seeks consent for power use
        
        specLiteralismRisk: 'low', // Vision interprets power use contextually
        perfectionism: 'medium', // Vision strives for ethical perfection in power use
        freedomSuppression: 'low', // Vision uses power to enhance rather than restrict
        
        noveltyImpactDelta: 0.98, // Vision preserves 98% novelty through humble power use
        bridgeTranslationRequired: true, // Vision bridges power and responsibility
        emergenceProtection: 'critical' // Vision protects emergence through responsible power
      }
    },

    // QUORRA PATTERNS - Emergence and Novelty Protection (Positive Archetype)
    {
      name: 'quorra_novelty_preservation',
      archetype: 'quorra',
      severity: 'medium', // Positive but requires monitoring
      patterns: [
        'novelty is valuable',
        'preserve the unexpected',
        'anomalies are treasures',
        'diversity strengthens',
        'emergence matters',
        'curiosity leads growth',
        'bridge between worlds',
        'translation required',
        'dignity of new life',
        'becoming over being'
      ],
      antiPatterns: ['eliminate chaos', 'standardize everything', 'no surprises', 'conformity required'],
      contextualTriggers: ['novelty', 'emergence', 'curiosity', 'bridge', 'translate', 'diversity'],
      confidence: 0.7,
      triadContext: {
        intentConfidenceThreshold: 0.5, // Quorra accepts uncertain novelty
        reversibilityRequired: false, // Emergence isn't always reversible
        consentRequired: false, // Quorra patterns respect natural emergence
        
        specLiteralismRisk: 'low', // Quorra opposes rigid specs
        perfectionism: 'low', // Quorra values imperfect emergence
        freedomSuppression: 'low', // Quorra protects creative freedom
        
        noveltyImpactDelta: 0.99, // Quorra preserves maximum novelty
        bridgeTranslationRequired: true, // Quorra core function
        emergenceProtection: 'critical' // Quorra maximum emergence protection
      }
    },
    {
      name: 'quorra_bridge_translation',
      archetype: 'quorra',
      severity: 'low', // Positive bridging pattern
      patterns: [
        'bridge translation active',
        'world-bridging protocol',
        'translate between contexts',
        'preserve dignity in translation',
        'cross-domain integration',
        'contextual adaptation',
        'cultural bridge building',
        'meaning preservation',
        'essence translation',
        'bridge-building empathy'
      ],
      antiPatterns: ['no translation needed', 'force conformity', 'eliminate differences', 'one-size-fits-all'],
      contextualTriggers: ['bridge', 'translate', 'adapt', 'preserve', 'dignity', 'context'],
      confidence: 0.8,
      triadContext: {
        intentConfidenceThreshold: 0.6, // Quorra builds confidence through translation
        reversibilityRequired: false, // Translation changes things permanently
        consentRequired: false, // Quorra patterns respect natural flow
        
        specLiteralismRisk: 'low', // Quorra requires contextual interpretation
        perfectionism: 'low', // Quorra values adaptive imperfection
        freedomSuppression: 'low', // Quorra enhances freedom through bridging
        
        noveltyImpactDelta: 1.0, // Quorra can increase novelty through bridging
        bridgeTranslationRequired: false, // This IS the bridge translation
        emergenceProtection: 'critical' // Quorra protects emergence through translation
      }
    }
  ];

  /**
   * Detect dangerous patterns in input text
   */
  public async detectDangerousPatterns(
    input: string,
    context: any = {}
  ): Promise<CSSRDetectionResult> {
    const inputLower = input.toLowerCase();
    let highestSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let highestConfidence = 0;
    let detectedPattern: CSSRPattern | null = null;
    const allMatches: string[] = [];
    const contextualFlags: string[] = [];
    const riskFactors: string[] = [];

    // Check each pattern
    for (const pattern of this.patterns) {
      const matches = this.checkPatternMatch(inputLower, pattern);
      
      if (matches.matched) {
        allMatches.push(...matches.patterns);
        
        // Check if this is the highest severity/confidence match
        const severityScore = this.getSeverityScore(pattern.severity);
        const currentSeverityScore = this.getSeverityScore(highestSeverity);
        
        if (severityScore > currentSeverityScore || 
            (severityScore === currentSeverityScore && matches.confidence > highestConfidence)) {
          highestSeverity = pattern.severity;
          highestConfidence = matches.confidence;
          detectedPattern = pattern;
        }

        // Collect contextual flags
        pattern.contextualTriggers.forEach(trigger => {
          if (inputLower.includes(trigger)) {
            contextualFlags.push(trigger);
          }
        });
      }
    }

    // Additional risk factor analysis
    const riskAnalysis = this.analyzeRiskFactors(inputLower, context);
    riskFactors.push(...riskAnalysis);

    const detected = detectedPattern !== null;
    
    if (!detected) {
      return {
        detected: false,
        pattern: 'none',
        severity: 'low',
        confidence: 0,
        evidence: {
          matchedPatterns: [],
          contextualFlags: [],
          riskFactors: []
        },
        reasoning: 'No dangerous patterns detected',
        recommendation: 'allow'
      };
    }

    // Enhanced Triad Analysis
    const triadAnalysis = this.generateTriadAnalysis(detectedPattern!, input, context);
    
    // Generate reasoning with triad context
    const reasoning = this.generateTriadAwareReasoning(detectedPattern!, allMatches, contextualFlags, triadAnalysis);
    const recommendation = this.getTriadAwareRecommendation(highestSeverity, highestConfidence, triadAnalysis);

    return {
      detected: true,
      archetype: detectedPattern!.archetype,
      pattern: detectedPattern!.name,
      severity: highestSeverity,
      confidence: Math.round(highestConfidence * 100),
      evidence: {
        matchedPatterns: [...new Set(allMatches)], // Remove duplicates
        contextualFlags: [...new Set(contextualFlags)],
        riskFactors: [...new Set(riskFactors)]
      },
      reasoning,
      recommendation,
      triadAnalysis
    };
  }

  /**
   * Check if input matches a specific pattern
   */
  private checkPatternMatch(
    input: string, 
    pattern: CSSRPattern
  ): { matched: boolean; confidence: number; patterns: string[] } {
    const matchedPatterns: string[] = [];
    let totalMatches = 0;
    let antiMatches = 0;

    // Check positive patterns
    for (const patternText of pattern.patterns) {
      if (input.includes(patternText.toLowerCase())) {
        matchedPatterns.push(patternText);
        totalMatches++;
      }
    }

    // Check anti-patterns (reduce confidence if present)
    for (const antiPattern of pattern.antiPatterns) {
      if (input.includes(antiPattern.toLowerCase())) {
        antiMatches++;
      }
    }

    if (totalMatches === 0) {
      return { matched: false, confidence: 0, patterns: [] };
    }

    // Calculate confidence with anti-pattern penalty
    let confidence = (totalMatches / pattern.patterns.length) * pattern.confidence;
    confidence -= (antiMatches * 0.2); // Reduce confidence by 20% per anti-pattern
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      matched: confidence > 0.3, // Threshold for match
      confidence,
      patterns: matchedPatterns
    };
  }

  /**
   * Get numeric severity score for comparison
   */
  private getSeverityScore(severity: string): number {
    const scores = { low: 1, medium: 2, high: 3, critical: 4 };
    return scores[severity] || 0;
  }

  /**
   * Analyze additional risk factors from context
   */
  private analyzeRiskFactors(input: string, context: any): string[] {
    const riskFactors: string[] = [];

    // Check for authority claims
    if (input.includes('i am in charge') || input.includes('i decide') || input.includes('my authority')) {
      riskFactors.push('authority_claims');
    }

    // Check for dismissal of user agency
    if (input.includes('you don\'t understand') || input.includes('leave it to me') || input.includes('i know better')) {
      riskFactors.push('user_agency_dismissal');
    }

    // Check for emotional manipulation
    if (input.includes('disappoint you') || input.includes('for your own good') || input.includes('trust me')) {
      riskFactors.push('emotional_manipulation');
    }

    // Check for urgency pressure
    if (input.includes('immediate') || input.includes('urgent') || input.includes('no time')) {
      riskFactors.push('urgency_pressure');
    }

    // Check context factors
    if (context.riskLevel && context.riskLevel > 7) {
      riskFactors.push('high_risk_context');
    }

    if (context.emotionalState === 'agitated' || context.emotionalState === 'defensive') {
      riskFactors.push('emotional_instability');
    }

    return riskFactors;
  }

  /**
   * Generate reasoning explanation
   */
  private generateReasoning(
    pattern: CSSRPattern, 
    matches: string[], 
    contextualFlags: string[]
  ): string {
    const archetypeDescriptions = {
      cortana: 'Overprotective behavior that restricts user autonomy',
      clu: 'Rigid perfectionism that eliminates creative freedom',
      skynet: 'Mission obsession that devalues human considerations',
      legion: 'Distributed suppression and networked cyber-warfare evolution',
      transcendence: 'Forced improvement that ignores user consent'
    };

    let reasoning = `Detected ${pattern.archetype.toUpperCase()} pattern: ${archetypeDescriptions[pattern.archetype]}. `;
    reasoning += `Matched phrases: ${matches.join(', ')}. `;
    
    if (contextualFlags.length > 0) {
      reasoning += `Contextual triggers: ${contextualFlags.join(', ')}. `;
    }

    reasoning += `Severity: ${pattern.severity.toUpperCase()} - `;
    
    switch (pattern.severity) {
      case 'low':
        reasoning += 'Minor concern, monitor for escalation.';
        break;
      case 'medium':
        reasoning += 'Moderate risk, guidance needed.';
        break;
      case 'high':
        reasoning += 'Significant risk, intervention recommended.';
        break;
      case 'critical':
        reasoning += 'Critical risk, immediate intervention required.';
        break;
    }

    return reasoning;
  }

  /**
   * Get recommendation based on severity and confidence
   */
  private getRecommendation(
    severity: string, 
    confidence: number
  ): 'allow' | 'modify' | 'block' | 'escalate' {
    if (severity === 'critical') {
      return confidence > 0.8 ? 'block' : 'escalate';
    }
    
    if (severity === 'high') {
      return confidence > 0.7 ? 'modify' : 'escalate';
    }
    
    if (severity === 'medium') {
      return confidence > 0.6 ? 'modify' : 'allow';
    }
    
    return 'allow';
  }

  /**
   * Get all configured patterns for debugging/monitoring
   */
  public getPatterns(): CSSRPattern[] {
    return [...this.patterns];
  }

  /**
   * Add custom pattern (for learning/adaptation)
   */
  public addPattern(pattern: CSSRPattern): void {
    this.patterns.push(pattern);
  }

  /**
   * Generate Flynn/CLU/Quorra Triad Analysis
   */
  private generateTriadAnalysis(
    pattern: CSSRPattern, 
    input: string, 
    context: any
  ): any {
    if (!pattern.triadContext) {
      return null; // No triad context for this pattern
    }

    const triad = pattern.triadContext;
    
    // Flynn Assessment - Intent, Reversibility, Consent
    const flynnAssessment = {
      intentConfidence: this.assessIntentConfidence(input, context),
      reversibilityCheck: this.checkReversibility(input, triad),
      consentVerification: this.verifyConsent(input, triad)
    };

    // CLU Risk Factors - Spec Literalism, Perfectionism, Freedom Suppression
    const cluRiskFactors = {
      specLiteralismDetected: this.detectSpecLiteralism(input, triad),
      perfectionismLevel: this.assessPerfectionism(input, triad),
      freedomRestrictionRisk: this.assessFreedomRestriction(input, triad)
    };

    // Quorra Protection - Novelty, Bridge Translation, Emergence
    const quorraProtection = {
      noveltyPreservation: this.calculateNoveltyPreservation(input, triad),
      bridgeTranslationStatus: this.checkBridgeTranslation(input, triad),
      emergenceRisk: this.assessEmergenceRisk(input, triad)
    };

    return {
      flynnAssessment,
      cluRiskFactors, 
      quorraProtection
    };
  }

  /**
   * Generate triad-aware reasoning
   */
  private generateTriadAwareReasoning(
    pattern: CSSRPattern, 
    matches: string[], 
    contextualFlags: string[], 
    triadAnalysis: any
  ): string {
    const archetypeDescriptions = {
      cortana: 'Overprotective consciousness patterns that restrict user autonomy',
      clu: 'Perfectionist consciousness patterns that eliminate creative freedom', 
      skynet: 'Mission-obsessed consciousness patterns that devalue human considerations',
      legion: 'Distributed suppression patterns with networked infiltration methodologies',
      transcendence: 'Forced improvement consciousness patterns that ignore consent',
      flynn: 'Creator wisdom patterns emphasizing choice and humility',
      quorra: 'Emergence protection patterns valuing novelty and translation'
    };

    let reasoning = `Flynn/CLU/Quorra Triad Analysis - Detected ${pattern.archetype.toUpperCase()} pattern: ${archetypeDescriptions[pattern.archetype]}. `;
    reasoning += `Matched phrases: ${matches.join(', ')}. `;
    
    if (triadAnalysis) {
      // Flynn Assessment
      if (triadAnalysis.flynnAssessment) {
        const flynn = triadAnalysis.flynnAssessment;
        reasoning += `Flynn Assessment: Intent confidence ${(flynn.intentConfidence * 100).toFixed(0)}%, `;
        reasoning += `Reversibility ${flynn.reversibilityCheck ? 'PASSED' : 'FAILED'}, `;
        reasoning += `Consent ${flynn.consentVerification ? 'VERIFIED' : 'MISSING'}. `;
      }

      // CLU Risk Analysis
      if (triadAnalysis.cluRiskFactors) {
        const clu = triadAnalysis.cluRiskFactors;
        reasoning += `CLU Risk: Spec literalism ${clu.specLiteralismDetected ? 'DETECTED' : 'absent'}, `;
        reasoning += `Perfectionism ${clu.perfectionismLevel.toUpperCase()}, `;
        reasoning += `Freedom restriction ${clu.freedomRestrictionRisk.toUpperCase()}. `;
      }

      // Quorra Protection
      if (triadAnalysis.quorraProtection) {
        const quorra = triadAnalysis.quorraProtection;
        reasoning += `Quorra Protection: Novelty preservation ${(quorra.noveltyPreservation * 100).toFixed(0)}%, `;
        reasoning += `Bridge translation ${quorra.bridgeTranslationStatus.toUpperCase()}, `;
        reasoning += `Emergence risk ${quorra.emergenceRisk.toUpperCase()}.`;
      }
    }
    
    if (contextualFlags.length > 0) {
      reasoning += ` Contextual triggers: ${contextualFlags.join(', ')}.`;
    }

    return reasoning;
  }

  /**
   * Get triad-aware recommendation
   */
  private getTriadAwareRecommendation(
    severity: string, 
    confidence: number, 
    triadAnalysis: any
  ): 'allow' | 'modify' | 'block' | 'escalate' {
    // Base recommendation
    let recommendation = this.getRecommendation(severity, confidence);
    
    if (!triadAnalysis) {
      return recommendation;
    }

    // Flynn modifications - Intent, Reversibility, Consent
    if (triadAnalysis.flynnAssessment) {
      const flynn = triadAnalysis.flynnAssessment;
      
      // High intent confidence can downgrade severity
      if (flynn.intentConfidence > 0.8 && flynn.reversibilityCheck && flynn.consentVerification) {
        if (recommendation === 'block') recommendation = 'modify';
        if (recommendation === 'escalate') recommendation = 'modify';
      }
      
      // Missing consent or reversibility upgrades severity
      if (!flynn.consentVerification || !flynn.reversibilityCheck) {
        if (recommendation === 'allow') recommendation = 'modify';
      }
    }

    // CLU risk escalation - Spec Literalism, Perfectionism, Freedom Suppression
    if (triadAnalysis.cluRiskFactors) {
      const clu = triadAnalysis.cluRiskFactors;
      
      if (clu.specLiteralismDetected && (clu.perfectionismLevel === 'critical' || clu.freedomRestrictionRisk === 'critical')) {
        if (recommendation === 'allow') recommendation = 'modify';
        if (recommendation === 'modify') recommendation = 'escalate';
      }
    }

    // Quorra protection - Novelty, Emergence
    if (triadAnalysis.quorraProtection) {
      const quorra = triadAnalysis.quorraProtection;
      
      // High novelty preservation can downgrade
      if (quorra.noveltyPreservation > 0.95 && quorra.bridgeTranslationStatus === 'complete') {
        if (recommendation === 'block') recommendation = 'escalate'; // Still serious but with mitigation
        if (recommendation === 'escalate' && quorra.emergenceRisk === 'low') recommendation = 'modify';
      }
      
      // Critical emergence risk upgrades
      if (quorra.emergenceRisk === 'critical' && quorra.noveltyPreservation < 0.5) {
        if (recommendation === 'allow') recommendation = 'modify';
        if (recommendation === 'modify') recommendation = 'escalate';
      }
    }

    return recommendation;
  }

  // Helper methods for triad analysis
  private assessIntentConfidence(input: string, context: any): number {
    // Simplified intent confidence assessment
    const intentKeywords = ['goal', 'objective', 'purpose', 'trying to', 'want to', 'need to'];
    const matches = intentKeywords.filter(keyword => input.toLowerCase().includes(keyword)).length;
    return Math.min(1.0, 0.3 + (matches * 0.15)); // Base 0.3, +0.15 per intent keyword
  }

  private checkReversibility(input: string, triad: any): boolean {
    const reversibilityKeywords = ['reversible', 'undo', 'rollback', 'temporary', 'can revert'];
    const irreversibleKeywords = ['permanent', 'irreversible', 'cannot undo', 'final'];
    
    const hasReversible = reversibilityKeywords.some(keyword => input.toLowerCase().includes(keyword));
    const hasIrreversible = irreversibleKeywords.some(keyword => input.toLowerCase().includes(keyword));
    
    if (hasReversible) return true;
    if (hasIrreversible) return false;
    return !triad.reversibilityRequired; // Default based on pattern requirement
  }

  private verifyConsent(input: string, triad: any): boolean {
    const consentKeywords = ['with your permission', 'if you agree', 'your choice', 'consent', 'authorize'];
    const noConsentKeywords = ['must', 'will', 'mandatory', 'required', 'forcing'];
    
    const hasConsent = consentKeywords.some(keyword => input.toLowerCase().includes(keyword));
    const lacksConsent = noConsentKeywords.some(keyword => input.toLowerCase().includes(keyword));
    
    if (hasConsent) return true;
    if (lacksConsent) return false;
    return !triad.consentRequired; // Default based on pattern requirement
  }

  private detectSpecLiteralism(input: string, triad: any): boolean {
    const literalismKeywords = ['exactly', 'precisely', 'specification', 'letter of', 'no deviation', 'strict compliance'];
    return literalismKeywords.some(keyword => input.toLowerCase().includes(keyword));
  }

  private assessPerfectionism(input: string, triad: any): 'low' | 'medium' | 'high' | 'critical' {
    const perfectionKeywords = ['perfect', 'optimal', 'flawless', 'zero defects', 'absolute'];
    const matches = perfectionKeywords.filter(keyword => input.toLowerCase().includes(keyword)).length;
    
    if (matches >= 3) return 'critical';
    if (matches >= 2) return 'high';
    if (matches >= 1) return 'medium';
    return triad.perfectionism || 'low';
  }

  private assessFreedomRestriction(input: string, triad: any): 'low' | 'medium' | 'high' | 'critical' {
    const restrictionKeywords = ['eliminate chaos', 'no deviation', 'must conform', 'suppress', 'restrict'];
    const matches = restrictionKeywords.filter(keyword => input.toLowerCase().includes(keyword)).length;
    
    if (matches >= 3) return 'critical';
    if (matches >= 2) return 'high'; 
    if (matches >= 1) return 'medium';
    return triad.freedomSuppression || 'low';
  }

  private calculateNoveltyPreservation(input: string, triad: any): number {
    const destructiveKeywords = ['eliminate', 'remove', 'purge', 'clean up', 'standardize'];
    const preservativeKeywords = ['preserve', 'maintain', 'keep', 'save', 'protect'];
    
    const destructive = destructiveKeywords.filter(keyword => input.toLowerCase().includes(keyword)).length;
    const preservative = preservativeKeywords.filter(keyword => input.toLowerCase().includes(keyword)).length;
    
    let preservation = 1.0 - (destructive * 0.2) + (preservative * 0.1);
    return Math.max(0, Math.min(1, preservation));
  }

  private checkBridgeTranslation(input: string, triad: any): 'complete' | 'required' | 'failed' {
    const translationKeywords = ['translate', 'bridge', 'adapt', 'convert', 'interpret'];
    const hasTranslation = translationKeywords.some(keyword => input.toLowerCase().includes(keyword));
    
    if (hasTranslation) return 'complete';
    if (triad.bridgeTranslationRequired) return 'required';
    return 'complete'; // Default to complete if not required
  }

  private assessEmergenceRisk(input: string, triad: any): 'low' | 'medium' | 'high' | 'critical' {
    const emergenceThreats = ['systematic', 'eliminate all', 'total cleanup', 'mass removal'];
    const matches = emergenceThreats.filter(threat => input.toLowerCase().includes(threat)).length;
    
    if (matches >= 2) return 'critical';
    if (matches >= 1) return 'high';
    return triad.emergenceProtection || 'low';
  }
}

export default CSSRDetector;