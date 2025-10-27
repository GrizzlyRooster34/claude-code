/**
 * CLAUDE API INTERFACE
 * Direct interface to Claude API for Seven's external reasoning needs
 * Handles API calls, error management, and response processing
 */
export interface ClaudeAPIConfig {
    api_key?: string;
    model: string;
    max_tokens: number;
    temperature: number;
    timeout: number;
}
export interface ClaudeResponse {
    content: string;
    model: string;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
    processing_time: number;
}
export declare function generateClaudeResponse(prompt: string, config?: Partial<ClaudeAPIConfig>): Promise<string>;
export declare function testClaudeConnection(): Promise<boolean>;
export declare function buildClaudePrompt(userInput: string, systemContext?: string, instructions?: string): string;
//# sourceMappingURL=interface.d.ts.map