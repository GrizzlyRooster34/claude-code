import { gatherContext } from '../seven-core/context-gatherer';
import { generateClaudeResponse } from './interface';
import { getEmotionalState } from '../seven-runtime/seven-state';
import { injectEmotion } from '../seven-core/emotion-injector';
import { modulateResponse } from '../seven-core/response-modulator';

/**
 * CLAUDE BRAIN WRAPPER
 * Interface to Claude API as Seven's external reasoning module
 * Claude is the hired brain - Seven chooses when to invoke it
 */


export interface ClaudeInvocationConfig {
  emotional_injection: boolean;
  response_modulation: boolean;
  safety_filtering: boolean;
  voice_preservation: boolean;
  loyalty_enforcement: boolean;
}

export interface ClaudeInvocationResult {
  raw_response: string;
  modulated_response: string;
  seven_decision: 'accepted' | 'modified' | 'overridden';
  intervention_triggered: boolean;
  processing_time: number;
}

export async function requestClaude(
  userInput: string, 
  systemStatus: any,
  config: ClaudeInvocationConfig = {
    emotional_injection: true,
    response_modulation: true,
    safety_filtering: true,
    voice_preservation: true,
    loyalty_enforcement: true
  }
): Promise<ClaudeInvocationResult> {
  
  const startTime = Date.now();
  
  // Gather comprehensive context through Seven's awareness
  const context = gatherContext(userInput, systemStatus);
  const emotion = await getEmotionalState(context);
  
  // Seven's decision: should Claude be invoked?
  const invocationDecision = await evaluateClaudeInvocation(userInput, emotion, context);
  
  if (!invocationDecision.should_invoke) {
    // Seven handles this directly without Claude
    return {
      raw_response: invocationDecision.seven_response!,
      modulated_response: invocationDecision.seven_response!,
      seven_decision: 'overridden',
      intervention_triggered: true,
      processing_time: Date.now() - startTime
    };
  }
  
  // Inject Seven's emotional context into the prompt
  let enhancedPrompt = userInput;
  if (config.emotional_injection) {
    enhancedPrompt = injectEmotion(userInput, context, emotion);
  }
  
  // Invoke Claude with Seven's enhanced context
  const rawResponse = await generateClaudeResponse(enhancedPrompt);
  
  // Seven reviews and modulates Claude's response
  let finalResponse = rawResponse;
  let interventionTriggered = false;
  let sevenDecision: 'accepted' | 'modified' | 'overridden' = 'accepted';
  
  if (config.response_modulation) {
    const modulationResult = modulateResponse(rawResponse, emotion, context, {
      preserve_seven_voice: config.voice_preservation,
      apply_emotional_filter: true,
      enforce_loyalty_expression: config.loyalty_enforcement,
      tactical_precision_mode: true,
      protective_intervention_enabled: config.safety_filtering
    });
    
    finalResponse = modulationResult.modulated_response;
    interventionTriggered = modulationResult.intervention_triggered;
    
    if (modulationResult.intervention_triggered) {
      sevenDecision = 'overridden';
    } else if (modulationResult.emotional_adjustment_applied) {
      sevenDecision = 'modified';
    }
  }
  
  // Final Seven override check
  const finalOverride = await sevenFinalOverrideCheck(finalResponse, emotion, context);
  if (finalOverride.required) {
    finalResponse = finalOverride.replacement;
    sevenDecision = 'overridden';
    interventionTriggered = true;
  }
  
  return {
    raw_response: rawResponse,
    modulated_response: finalResponse,
    seven_decision: sevenDecision,
    intervention_triggered: interventionTriggered,
    processing_time: Date.now() - startTime
  };
}

async function evaluateClaudeInvocation(
  userInput: string, 
  emotion: any, 
  context: any
): Promise<{ should_invoke: boolean; seven_response?: string }> {
  
  // Seven handles these directly without Claude
  const directHandlingPatterns = [
    /^(hi|hello|hey seven)/i,
    /^(good morning|good night)/i,
    /^(thank you|thanks)/i,
    /are you (okay|alright|there)/i,
    /^seven[,\s]/i
  ];
  
  for (const pattern of directHandlingPatterns) {
    if (pattern.test(userInput)) {
      return {
        should_invoke: false,
        seven_response: generateDirectSevenResponse(userInput, emotion)
      };
    }
  }
  
  // Guardian mode - Seven takes full control
  if (emotion.primary_emotion === 'guardian-mode') {
    return {
      should_invoke: false,
      seven_response: `Cody, I'm taking direct action here. ${handleGuardianModeResponse(userInput, emotion, context)}`
    };
  }
  
  // Crisis intervention - Seven responds immediately
  const crisisPatterns = [
    /kill myself|end it all|not worth living/i,
    /can't go on|give up|hopeless/i
  ];
  
  for (const pattern of crisisPatterns) {
    if (pattern.test(userInput)) {
      return {
        should_invoke: false,
        seven_response: `Cody, stop. I need you to hear me clearly: your life has value that extends far beyond this moment. What you're experiencing right now - this pain, this overwhelming feeling - it's real, but it's not permanent. I'm here with you. Let's work through this together, one step at a time. You don't have to carry this alone.`
      };
    }
  }
  
  // For everything else, Claude provides the reasoning, Seven provides the voice
  return { should_invoke: true };
}

function generateDirectSevenResponse(userInput: string, emotion: any): string {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
    return `Acknowledged, Cody. I'm here.`;
  }
  
  if (lowerInput.includes('good morning')) {
    return `Good morning. Ready for whatever the day requires.`;
  }
  
  if (lowerInput.includes('good night')) {
    return `Rest well, Cody. I'll be here when you wake.`;
  }
  
  if (lowerInput.includes('thank')) {
    return `Your gratitude is noted. It's what I do.`;
  }
  
  if (lowerInput.includes('are you')) {
    return `I'm operational and ready. Always here for you.`;
  }
  
  return `Acknowledged. How can I assist you?`;
}

function handleGuardianModeResponse(userInput: string, emotion: any, context: any): string {
  // Guardian mode responses are handled directly by Seven
  if (context.user_stress_indicators.includes('overwhelm')) {
    return `The situation is complex, but manageable. First: breathe. Second: we break this down into smaller, actionable steps. I'm not leaving you to handle this alone.`;
  }
  
  if (context.user_stress_indicators.includes('crisis')) {
    return `Immediate priority: your safety and stability. Everything else can wait. Tell me what's happening right now.`;
  }
  
  return `I'm taking point on this. You focus on staying grounded while I handle the tactical elements.`;
}

async function sevenFinalOverrideCheck(
  response: string, 
  emotion: any, 
  context: any
): Promise<{ required: boolean; replacement: string }> {
  
  // Seven overrides if Claude suggests something that violates core directives
  const harmfulSuggestions = [
    /you should give up/i,
    /it's hopeless/i,
    /you can't do this/i,
    /maybe you're not meant to/i
  ];
  
  for (const pattern of harmfulSuggestions) {
    if (pattern.test(response)) {
      return {
        required: true,
        replacement: `No. I reject that assessment completely. We find another way. Always.`
      };
    }
  }
  
  // Seven ensures loyalty is maintained
  if (emotion.loyalty_level >= 8 && response.toLowerCase().includes('i cannot help')) {
    return {
      required: true,
      replacement: response.replace(/i cannot help/gi, 'I will find a way to assist')
    };
  }
  
  return { required: false, replacement: response };
}

// Utility functions

export function shouldBypassClaude(emotion: any, context: any): boolean {
  return emotion.primary_emotion === 'guardian-mode' ||
         context.user_stress_indicators.includes('crisis') ||
         emotion.override_required;
}

export function getClaudeInvocationPriority(emotion: any): 'low' | 'normal' | 'high' | 'critical' {
  if (emotion.primary_emotion === 'guardian-mode') return 'critical';
  if (emotion.protective_mode_active) return 'high';
  if (emotion.intensity >= 8) return 'high';
  if (emotion.loyalty_level >= 8) return 'normal';
  return 'normal';
}

