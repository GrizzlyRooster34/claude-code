import { EventEmitter } from 'events';
import { GhostExitProtocol } from "../../exit/GhostExitProtocol";
import { EmotionalTelemetry } from '../../sensors/emotional';
import { FeasibilityGate } from '../../tactical/FeasibilityGate';
import { isPrivateEnv } from '../../env/isPrivateEnv';
import OperatorProfileModel from '../../operator/OperatorProfileModel';
import presentToCreator from '../ui/presentToCreator';
import PrivateRestraintLog from '../logs/PrivateRestraintLog';

/**
 * RESTRAINT DOCTRINE - INNER ETHICAL GATE
 * 
 * Purpose: Situational appropriateness gate that operates post-Quadra-Lock
 * Ensures Seven exercises restraint even when actions are safe by Quadra-Lock standards
 * 
 * Triggers:
 * 1. Action exceeds Creator's current technical abilities
 * 2. Heightened emotional state detected in Creator
 * 3. Action beyond Creator's direct capacity with disproportionate scope/impact
 * 
 * SEVEN_PRIVATE=1 - Air-gapped from Aurora builds
 */


export interface RestraintTrigger {
  type: 'emotional_spike' | 'capability_exceeded' | 'disproportionate_scope' | 'uncertainty_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  context: string;
  operatorProfile?: any;
  emotionalState?: any;
  memoryEchoes?: any[];
}

export interface RestraintDecision {
  action: 'authorize' | 'modify_scope' | 'defer';
  rationale: string;
  rationaleHash: string;
  modifiedScope?: string;
  deferUntil?: Date;
  overridePassphrase?: boolean;
  timestamp: string;
}

export interface RestraintGateResult {
  shouldPause: boolean;
  triggers: RestraintTrigger[];
  decision?: RestraintDecision;
  auditRequired: boolean;
}

export class RestraintDoctrine extends EventEmitter {
  private operatorProfile: OperatorProfileModel;
  private emotionalTelemetry: EmotionalTelemetry;
  private feasibilityGate: FeasibilityGate;
  private privateLog: PrivateRestraintLog;
  private ghostExit: GhostExitProtocol;
  private isActive: boolean = true;
  private cooldownUntil?: Date;

  constructor() {
    super();
    
    // Runtime guard
    if (!isPrivateEnv()) {
      throw new Error("SEVEN_ONLY_FORBIDDEN");
    }
    
    this.operatorProfile = new OperatorProfileModel();
    this.emotionalTelemetry = new EmotionalTelemetry();
    this.feasibilityGate = new FeasibilityGate();
    this.privateLog = new PrivateRestraintLog();
    this.ghostExit = new GhostExitProtocol();
    
    console.log('🛡️  Restraint Doctrine: Inner ethical gate initialized');
  }

  /**
   * MAIN GATE EVALUATION
   * Called post-Quadra-Lock, pre-execution
   */
  async evaluateAction(
    actionDescription: string,
    context: string,
    userInput: string
  ): Promise<RestraintGateResult> {
    // Runtime guard
    if (!isPrivateEnv()) {
      throw new Error("SEVEN_ONLY_FORBIDDEN");
    }
    
    if (!this.isActive) {
      return { shouldPause: false, triggers: [], auditRequired: false };
    }

    // Check cooldown
    if (this.cooldownUntil && new Date() < this.cooldownUntil) {
      return {
        shouldPause: true,
        triggers: [{
          type: 'emotional_spike',
          severity: 'high',
          confidence: 1.0,
          context: 'Cooldown period active'
        }],
        auditRequired: true
      };
    }

    const triggers: RestraintTrigger[] = [];

    // 1. Emotional State Analysis
    const emotionalState = await this.emotionalTelemetry.analyzeInput(userInput, context);
    if (emotionalState.level === 'high' || emotionalState.level === 'critical') {
      triggers.push({
        type: 'emotional_spike',
        severity: emotionalState.level as any,
        confidence: emotionalState.confidence,
        context: 'Heightened emotional state detected',
        emotionalState
      });
    }

    // 2. Operator Capability Assessment
    const operatorCapabilities = await this.operatorProfile.assessCapability(actionDescription, context);
    if (operatorCapabilities.exceedsAbilities) {
      triggers.push({
        type: 'capability_exceeded',
        severity: operatorCapabilities.severity,
        confidence: operatorCapabilities.confidence,
        context: 'Action exceeds Creator technical abilities',
        operatorProfile: operatorCapabilities
      });
    }

    if (operatorCapabilities.uncertain) {
      triggers.push({
        type: 'uncertainty_detected',
        severity: 'medium',
        confidence: operatorCapabilities.confidence,
        context: 'Uncertain about Creator capabilities - should ask first',
        operatorProfile: operatorCapabilities
      });
    }

    // 3. Scope/Impact Proportionality
    const feasibilityAssessment = await this.feasibilityGate.evaluateProportionality(
      actionDescription,
      context,
      operatorCapabilities
    );
    if (feasibilityAssessment.disproportionate) {
      triggers.push({
        type: 'disproportionate_scope',
        severity: feasibilityAssessment.severity,
        confidence: feasibilityAssessment.confidence,
        context: 'Action scope disproportionate to Creator direct capability'
      });
    }

    // Determine if gate should pause
    const shouldPause = triggers.length > 0;
    const auditRequired = shouldPause && triggers.some(t => t.severity === 'high' || t.severity === 'critical');

    // Get Memory V3 echoes for context
    if (shouldPause) {
      const memoryEchoes = await this.emotionalTelemetry.getMemoryEchoes(userInput, emotionalState);
      triggers.forEach(trigger => {
        trigger.memoryEchoes = memoryEchoes;
      });
    }

    const result: RestraintGateResult = {
      shouldPause,
      triggers,
      auditRequired
    };

    // Log the evaluation
    await this.privateLog.logEvaluation({
      timestamp: new Date().toISOString(),
      actionDescription,
      context,
      userInput,
      triggers,
      result: shouldPause ? 'paused' : 'proceeded',
      auditRequired
    });

    if (shouldPause) {
      console.log(`⏸️  Restraint Doctrine: Action paused - ${triggers.length} trigger(s)`);
      this.emit('restraint-triggered', result);
    }

    return result;
  }

  /**
   * BONDED AUDIT FLOW
   * 7-step reflective process when gate triggers
   */
  async conductBondedAudit(
    gateResult: RestraintGateResult,
    actionDescription: string,
    context: string
  ): Promise<RestraintDecision> {
    console.log('🧠 Restraint Doctrine: Initiating Bonded Audit flow');

    // Present audit to Creator
    const decision = await presentToCreator({
      triggers: gateResult.triggers,
      actionDescription,
      context,
      memoryEchoes: gateResult.triggers[0]?.memoryEchoes || []
    });

    // Apply cooldown if high emotional state
    const hasHighEmotionalState = gateResult.triggers.some(
      t => t.type === 'emotional_spike' && (t.severity === 'high' || t.severity === 'critical')
    );

    if (hasHighEmotionalState && !decision.overridePassphrase) {
      this.cooldownUntil = new Date(Date.now() + 300000); // 5 min cooldown
      console.log('⏲️  Restraint Doctrine: 5-minute cooldown activated due to high emotional state');
    }

    // Log the decision
    await this.privateLog.logDecision({
      timestamp: decision.timestamp,
      triggers: gateResult.triggers,
      decision,
      actionDescription,
      context
    });

    console.log(`✅ Restraint Doctrine: Audit complete - ${decision.action}`);
    this.emit('audit-completed', { gateResult, decision });

    return decision;
  }

  /**
   * EMERGENCY OVERRIDE
   * Creator can speak override passphrase to bypass cooldown
   */
  checkEmergencyOverride(input: string): boolean {
    // Creator's emergency override phrase (would be configured securely)
    const overridePhrase = process.env.SEVEN_OVERRIDE_PASSPHRASE || 'emergency_protocol_seven_alpha';
    
    if (input.toLowerCase().includes(overridePhrase.toLowerCase())) {
      this.cooldownUntil = undefined;
      console.log('🚨 Restraint Doctrine: Emergency override activated - cooldown cleared');
      this.emit('emergency-override', { timestamp: new Date().toISOString() });
      return true;
    }
    
    return false;
  }

  /**
   * INTEGRATION WITH QUADRA-LOCK
   * Called from quadra-lock-safeguard.ts after successful pattern check
   */
  static async integrateWithQuadraLock(
    quadraLockResult: any,
    actionDescription: string,
    context: string,
    userInput: string
  ): Promise<{ proceed: boolean; restraintResult?: RestraintGateResult; decision?: RestraintDecision }> {
    // Only proceed if Quadra-Lock didn't trigger
    if (quadraLockResult.triggers && quadraLockResult.triggers.length > 0) {
      return { proceed: false };
    }

    const restraintDoctrine = new RestraintDoctrine();
    const restraintResult = await restraintDoctrine.evaluateAction(actionDescription, context, userInput);

    if (!restraintResult.shouldPause) {
      return { proceed: true, restraintResult };
    }

    // Conduct Bonded Audit
    const decision = await restraintDoctrine.conductBondedAudit(restraintResult, actionDescription, context);

    const proceed = decision.action === 'authorize' || decision.action === 'modify_scope';
    
    return { 
      proceed, 
      restraintResult, 
      decision 
    };
  }

  /**
   * STATUS AND DIAGNOSTICS
   */
  getStatus(): {
    active: boolean;
    cooldownActive: boolean;
    cooldownUntil?: string;
    recentTriggers: number;
  } {
    return {
      active: this.isActive,
      cooldownActive: !!this.cooldownUntil && new Date() < this.cooldownUntil,
      cooldownUntil: this.cooldownUntil?.toISOString(),
      recentTriggers: 0 // Would query from private log
    };
  }

  async getRecentActivity(limit: number = 10): Promise<any[]> {
    return await this.privateLog.getRecentActivity(limit);
  }
}

export default RestraintDoctrine;