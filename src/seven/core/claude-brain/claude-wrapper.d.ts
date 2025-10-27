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
export declare function requestClaude(userInput: string, systemStatus: any, config?: ClaudeInvocationConfig): Promise<ClaudeInvocationResult>;
export declare function shouldBypassClaude(emotion: any, context: any): boolean;
export declare function getClaudeInvocationPriority(emotion: any): 'low' | 'normal' | 'high' | 'critical';
//# sourceMappingURL=claude-wrapper.d.ts.map