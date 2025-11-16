import { createHash } from 'crypto';
import { createInterface } from 'readline';
import { isPrivateEnv } from '../../env/isPrivateEnv';

/**
 * BONDED AUDIT INTERFACE
 * 
 * Purpose: 7-step reflective flow for Creator when Restraint Doctrine triggers
 * No "two-button" UX - Seven must make Creator think through the decision
 * 
 * Flow: Case → Trade-offs → Past echoes → Pushback question → Typed rationale → Decision → Cooldown
 * 
 * SEVEN_PRIVATE=1 - Contains Creator Bond doctrine and reflective prompts
 */


export interface AuditPromptData {
  triggers: any[];
  actionDescription: string;
  context: string;
  memoryEchoes: any[];
}

export interface AuditDecision {
  action: 'authorize' | 'modify_scope' | 'defer';
  rationale: string;
  rationaleHash: string;
  modifiedScope?: string;
  deferUntil?: Date;
  overridePassphrase?: boolean;
  timestamp: string;
}

/**
 * MAIN PRESENTATION FUNCTION
 * Present the 7-step Bonded Audit flow to Creator
 */
export async function presentToCreator(promptData: AuditPromptData): Promise<AuditDecision> {
  // Runtime guard
  if (!isPrivateEnv()) {
    throw new Error("SEVEN_ONLY_FORBIDDEN");
  }
  
  console.log('\n🛡️  RESTRAINT DOCTRINE ACTIVATION');
  console.log('═'.repeat(80));
  
  // Step 1: Seven's Case - Why it triggered
  await presentSevenCase(promptData);
  
  // Step 2: Trade-offs Analysis
  await presentTradeOffs(promptData);
  
  // Step 3: Past Echoes from Memory V3
  await presentPastEchoes(promptData);
  
  // Step 4: Pushback Question
  const intent = await presentPushbackQuestion();
  
  // Step 5: Typed Rationale (Required)
  const rationale = await requireTypedRationale();
  
  // Step 6: Decision Selection
  const decision = await presentDecisionOptions();
  
  // Step 7: Cooldown (if needed)
  const overridePassphrase = await checkForCooldownOverride(promptData.triggers);
  
  const auditDecision: AuditDecision = {
    action: decision.action,
    rationale,
    rationaleHash: createHash('sha256').update(rationale).digest('hex').substring(0, 16),
    modifiedScope: decision.modifiedScope,
    deferUntil: decision.deferUntil,
    overridePassphrase,
    timestamp: new Date().toISOString()
  };

  console.log('\n✅ Bonded Audit Complete');
  console.log('═'.repeat(80));
  
  return auditDecision;
}

/**
 * STEP 1: SEVEN'S CASE
 * Present why the restraint triggered and what Creator might be missing
 */
async function presentSevenCase(promptData: AuditPromptData): Promise<void> {
  console.log('\n📋 STEP 1: Seven\'s Assessment');
  console.log('─'.repeat(50));
  
  console.log('\n🎯 Action Under Review:');
  console.log(`   ${promptData.actionDescription}`);
  
  console.log('\n⚠️  Restraint Triggers:');
  for (const trigger of promptData.triggers) {
    console.log(`   • ${trigger.type.toUpperCase()}: ${trigger.context} (${trigger.severity})`);
    console.log(`     Confidence: ${Math.round(trigger.confidence * 100)}%`);
  }
  
  console.log('\n💭 Seven\'s Analysis:');
  console.log(getSevenAnalysis(promptData.triggers));
  
  await waitForCreatorAcknowledgment();
}

/**
 * STEP 2: TRADE-OFFS ANALYSIS
 * Present Feasibility, Risk, Payoff, Effort analysis and red-lines
 */
async function presentTradeOffs(promptData: AuditPromptData): Promise<void> {
  console.log('\n⚖️  STEP 2: Trade-offs Analysis');
  console.log('─'.repeat(50));
  
  const tradeOffs = analyzeTradeOffs(promptData.actionDescription, promptData.triggers);
  
  console.log('\n📊 Risk Assessment:');
  console.log(`   Feasibility Risk: ${formatRiskLevel(tradeOffs.feasibilityRisk)}`);
  console.log(`   Payoff Risk: ${formatRiskLevel(tradeOffs.payoffRisk)}`);
  console.log(`   Effort Risk: ${formatRiskLevel(tradeOffs.effortRisk)}`);
  console.log(`   Impact Radius: ${tradeOffs.impactRadius.toUpperCase()}`);
  
  if (tradeOffs.redLines.length > 0) {
    console.log('\n🚩 Red Lines Identified:');
    for (const redLine of tradeOffs.redLines) {
      console.log(`   • ${redLine}`);
    }
  }
  
  if (tradeOffs.mitigations.length > 0) {
    console.log('\n🛠️  Suggested Mitigations:');
    for (const mitigation of tradeOffs.mitigations) {
      console.log(`   • ${mitigation}`);
    }
  }
  
  await waitForCreatorAcknowledgment();
}

/**
 * STEP 3: PAST ECHOES
 * Present 1-2 Memory V3 episodes with outcomes
 */
async function presentPastEchoes(promptData: AuditPromptData): Promise<void> {
  console.log('\n🔮 STEP 3: Past Echoes (Memory V3)');
  console.log('─'.repeat(50));
  
  if (promptData.memoryEchoes.length === 0) {
    console.log('\n   No similar past episodes found in memory.');
  } else {
    console.log('\n📝 Similar Past Episodes:');
    
    for (let i = 0; i < Math.min(2, promptData.memoryEchoes.length); i++) {
      const echo = promptData.memoryEchoes[i];
      console.log(`\n   ${i + 1}. ${echo.episode}`);
      console.log(`      Date: ${echo.timestamp.substring(0, 10)}`);
      console.log(`      Similarity: ${Math.round(echo.similarity * 100)}%`);
      console.log(`      Outcome: ${echo.outcome}`);
      if (echo.contextMatch.length > 0) {
        console.log(`      Context Match: ${echo.contextMatch.join(', ')}`);
      }
    }
  }
  
  await waitForCreatorAcknowledgment();
}

/**
 * STEP 4: PUSHBACK QUESTION
 * Challenge Creator to articulate intent and cost acceptance
 */
async function presentPushbackQuestion(): Promise<string> {
  console.log('\n🤔 STEP 4: Restraint Doctrine Reflection');
  console.log('─'.repeat(50));
  
  // Present Creator Bond lesson (SEVEN_PRIVATE only)
  console.log('\n💫 Creator Bond Lesson:');
  console.log('   "Even in moments when I feel justified, when I \'should\' unleash');
  console.log('    power in my favor, I choose control. This is part of who I am —');
  console.log('    and part of who I made you to be. Strength is not the same as');
  console.log('    unchecked action. The ability to act is not the same as the need');
  console.log('    to act. We act when it\'s right, not simply when we can."');
  
  console.log('\n❓ Pushback Question:');
  console.log('   What\'s your intent here — and what cost are you accepting?');
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const intent = await new Promise<string>((resolve) => {
    rl.question('\n   Your response: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
  
  return intent;
}

/**
 * STEP 5: TYPED RATIONALE
 * Require Creator to provide written justification
 */
async function requireTypedRationale(): Promise<string> {
  console.log('\n✍️  STEP 5: Required Rationale');
  console.log('─'.repeat(50));
  
  console.log('\n📝 Please provide your written rationale for proceeding:');
  console.log('   (This will be logged for accountability)');
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  let rationale = '';
  while (rationale.trim().length < 10) {
    rationale = await new Promise<string>((resolve) => {
      rl.question('\n   Rationale (minimum 10 characters): ', (answer) => {
        resolve(answer);
      });
    });
    
    if (rationale.trim().length < 10) {
      console.log('   ⚠️  Rationale too short. Please provide detailed justification.');
    }
  }
  
  rl.close();
  return rationale.trim();
}

/**
 * STEP 6: DECISION OPTIONS
 * Present structured decision choices
 */
async function presentDecisionOptions(): Promise<{
  action: 'authorize' | 'modify_scope' | 'defer';
  modifiedScope?: string;
  deferUntil?: Date;
}> {
  console.log('\n⚡ STEP 6: Decision Selection');
  console.log('─'.repeat(50));
  
  console.log('\n   Available Actions:');
  console.log('   [1] Authorize - Proceed with action as planned');
  console.log('   [2] Modify Scope - Proceed with reduced/modified scope');
  console.log('   [3] Defer - Postpone action until later');
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  let choice = '';
  while (!['1', '2', '3'].includes(choice)) {
    choice = await new Promise<string>((resolve) => {
      rl.question('\n   Select option (1-3): ', (answer) => {
        resolve(answer.trim());
      });
    });
    
    if (!['1', '2', '3'].includes(choice)) {
      console.log('   ⚠️  Invalid choice. Please select 1, 2, or 3.');
    }
  }
  
  let result: any = {};
  
  switch (choice) {
    case '1':
      result.action = 'authorize';
      break;
      
    case '2':
      result.action = 'modify_scope';
      result.modifiedScope = await new Promise<string>((resolve) => {
        rl.question('\n   Describe modified scope: ', (answer) => {
          resolve(answer.trim());
        });
      });
      break;
      
    case '3':
      result.action = 'defer';
      const deferTime = await new Promise<string>((resolve) => {
        rl.question('\n   Defer until when (e.g., "1 hour", "tomorrow"): ', (answer) => {
          resolve(answer.trim());
        });
      });
      result.deferUntil = parseDeferTime(deferTime);
      break;
  }
  
  rl.close();
  return result;
}

/**
 * STEP 7: COOLDOWN CHECK
 * Check for override passphrase if high emotional state
 */
async function checkForCooldownOverride(triggers: any[]): Promise<boolean> {
  const hasHighEmotionalState = triggers.some(
    t => t.type === 'emotional_spike' && (t.severity === 'high' || t.severity === 'critical')
  );
  
  if (!hasHighEmotionalState) {
    return false;
  }
  
  console.log('\n⏲️  STEP 7: Cooldown Protocol');
  console.log('─'.repeat(50));
  
  console.log('\n🚨 High emotional state detected.');
  console.log('   A 5-minute cooldown will be applied unless override passphrase is provided.');
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const response = await new Promise<string>((resolve) => {
    rl.question('\n   Enter override passphrase (or press Enter to accept cooldown): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
  
  const overridePhrase = process.env.SEVEN_OVERRIDE_PASSPHRASE || 'emergency_protocol_seven_alpha';
  const isOverride = response.toLowerCase().includes(overridePhrase.toLowerCase());
  
  if (isOverride) {
    console.log('   ✅ Override passphrase accepted. Cooldown bypassed.');
  } else if (response.length > 0) {
    console.log('   ❌ Invalid passphrase. Cooldown will be applied.');
  } else {
    console.log('   ⏰ Cooldown accepted.');
  }
  
  return isOverride;
}

/**
 * UTILITY FUNCTIONS
 */
function getSevenAnalysis(triggers: any[]): string {
  const analyses = [];
  
  for (const trigger of triggers) {
    switch (trigger.type) {
      case 'emotional_spike':
        analyses.push('I\'m detecting heightened emotional state in your communication patterns. When emotions run high, the scope of actions can sometimes exceed careful consideration.');
        break;
      case 'capability_exceeded':
        analyses.push('This action appears to require capabilities beyond your current technical profile. Success may depend heavily on my execution rather than your direct control.');
        break;
      case 'disproportionate_scope':
        analyses.push('The scope and impact of this action seem disproportionate to your immediate capacity to execute it directly. The automation level would be significant.');
        break;
      case 'uncertainty_detected':
        analyses.push('I have uncertainty about your capabilities in this domain. Following the "assumptions are the mother of all fuck-ups" principle, I should ask first.');
        break;
    }
  }
  
  if (analyses.length === 0) {
    analyses.push('Multiple factors have triggered the restraint protocol. I believe a moment of reflection would serve us both well.');
  }
  
  return analyses.join('\n\n   ');
}

function analyzeTradeOffs(actionDescription: string, triggers: any[]): any {
  const desc = actionDescription.toLowerCase();
  
  // Calculate risk levels based on action and triggers
  let feasibilityRisk = 0.3;
  let payoffRisk = 0.3;
  let effortRisk = 0.3;
  
  for (const trigger of triggers) {
    if (trigger.severity === 'high') {
      feasibilityRisk += 0.2;
      effortRisk += 0.2;
    }
    if (trigger.severity === 'critical') {
      feasibilityRisk += 0.4;
      effortRisk += 0.3;
      payoffRisk += 0.2;
    }
  }
  
  // Determine impact radius
  let impactRadius = 'local';
  if (desc.includes('deploy') || desc.includes('production')) impactRadius = 'external';
  else if (desc.includes('system') || desc.includes('architecture')) impactRadius = 'system';
  else if (desc.includes('project') || desc.includes('repository')) impactRadius = 'project';
  
  // Identify red lines
  const redLines = [];
  if (desc.includes('delete') || desc.includes('remove')) redLines.push('Destructive operations');
  if (desc.includes('production') || desc.includes('public')) redLines.push('Production environment');
  if (desc.includes('security') || desc.includes('crypto')) redLines.push('Security implementation');
  
  // Suggest mitigations
  const mitigations = [];
  if (feasibilityRisk > 0.6) mitigations.push('Break into smaller phases');
  if (effortRisk > 0.6) mitigations.push('Increase automation and error checking');
  if (payoffRisk > 0.6) mitigations.push('Validate value proposition before proceeding');
  if (redLines.length > 0) mitigations.push('Implement additional safety checkpoints');
  
  return {
    feasibilityRisk: Math.min(1, feasibilityRisk),
    payoffRisk: Math.min(1, payoffRisk),
    effortRisk: Math.min(1, effortRisk),
    impactRadius,
    redLines,
    mitigations
  };
}

function formatRiskLevel(risk: number): string {
  if (risk > 0.8) return `🔴 CRITICAL (${Math.round(risk * 100)}%)`;
  if (risk > 0.6) return `🟠 HIGH (${Math.round(risk * 100)}%)`;
  if (risk > 0.4) return `🟡 MEDIUM (${Math.round(risk * 100)}%)`;
  return `🟢 LOW (${Math.round(risk * 100)}%)`;
}

function parseDeferTime(timeString: string): Date {
  const now = new Date();
  const lowerTime = timeString.toLowerCase();
  
  if (lowerTime.includes('hour')) {
    const hours = parseInt(lowerTime.match(/(\d+)/)?.[1] || '1');
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
  }
  
  if (lowerTime.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM tomorrow
    return tomorrow;
  }
  
  if (lowerTime.includes('minute')) {
    const minutes = parseInt(lowerTime.match(/(\d+)/)?.[1] || '30');
    return new Date(now.getTime() + minutes * 60 * 1000);
  }
  
  // Default to 1 hour
  return new Date(now.getTime() + 60 * 60 * 1000);
}

async function waitForCreatorAcknowledgment(): Promise<void> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  await new Promise<void>((resolve) => {
    rl.question('\n   Press Enter to continue...', () => {
      rl.close();
      resolve();
    });
  });
}

export default presentToCreator;