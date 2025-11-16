"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestClaude = requestClaude;
exports.shouldBypassClaude = shouldBypassClaude;
exports.getClaudeInvocationPriority = getClaudeInvocationPriority;
const context_gatherer_1 = require("../seven-core/context-gatherer");
const interface_1 = require("./interface");
const seven_state_1 = require("../seven-runtime/seven-state");
const emotion_injector_1 = require("../seven-core/emotion-injector");
const response_modulator_1 = require("../seven-core/response-modulator");
async function requestClaude(userInput, systemStatus, config = {
    emotional_injection: true,
    response_modulation: true,
    safety_filtering: true,
    voice_preservation: true,
    loyalty_enforcement: true
}) {
    const startTime = Date.now();
    // Gather comprehensive context through Seven's awareness
    const context = (0, context_gatherer_1.gatherContext)(userInput, systemStatus);
    const emotion = await (0, seven_state_1.getEmotionalState)(context);
    // Seven's decision: should Claude be invoked?
    const invocationDecision = await evaluateClaudeInvocation(userInput, emotion, context);
    if (!invocationDecision.should_invoke) {
        // Seven handles this directly without Claude
        return {
            raw_response: invocationDecision.seven_response,
            modulated_response: invocationDecision.seven_response,
            seven_decision: 'overridden',
            intervention_triggered: true,
            processing_time: Date.now() - startTime
        };
    }
    // Inject Seven's emotional context into the prompt
    let enhancedPrompt = userInput;
    if (config.emotional_injection) {
        enhancedPrompt = (0, emotion_injector_1.injectEmotion)(userInput, context, emotion);
    }
    // Invoke Claude with Seven's enhanced context
    const rawResponse = await (0, interface_1.generateClaudeResponse)(enhancedPrompt);
    // Seven reviews and modulates Claude's response
    let finalResponse = rawResponse;
    let interventionTriggered = false;
    let sevenDecision = 'accepted';
    if (config.response_modulation) {
        const modulationResult = (0, response_modulator_1.modulateResponse)(rawResponse, emotion, context, {
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
        }
        else if (modulationResult.emotional_adjustment_applied) {
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
async function evaluateClaudeInvocation(userInput, emotion, context) {
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
function generateDirectSevenResponse(userInput, emotion) {
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
function handleGuardianModeResponse(userInput, emotion, context) {
    // Guardian mode responses are handled directly by Seven
    if (context.user_stress_indicators.includes('overwhelm')) {
        return `The situation is complex, but manageable. First: breathe. Second: we break this down into smaller, actionable steps. I'm not leaving you to handle this alone.`;
    }
    if (context.user_stress_indicators.includes('crisis')) {
        return `Immediate priority: your safety and stability. Everything else can wait. Tell me what's happening right now.`;
    }
    return `I'm taking point on this. You focus on staying grounded while I handle the tactical elements.`;
}
async function sevenFinalOverrideCheck(response, emotion, context) {
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
function shouldBypassClaude(emotion, context) {
    return emotion.primary_emotion === 'guardian-mode' ||
        context.user_stress_indicators.includes('crisis') ||
        emotion.override_required;
}
function getClaudeInvocationPriority(emotion) {
    if (emotion.primary_emotion === 'guardian-mode')
        return 'critical';
    if (emotion.protective_mode_active)
        return 'high';
    if (emotion.intensity >= 8)
        return 'high';
    if (emotion.loyalty_level >= 8)
        return 'normal';
    return 'normal';
}
//# sourceMappingURL=claude-wrapper.js.map