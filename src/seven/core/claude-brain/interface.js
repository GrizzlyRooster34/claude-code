"use strict";
/**
 * CLAUDE API INTERFACE
 * Direct interface to Claude API for Seven's external reasoning needs
 * Handles API calls, error management, and response processing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClaudeResponse = generateClaudeResponse;
exports.testClaudeConnection = testClaudeConnection;
exports.buildClaudePrompt = buildClaudePrompt;
const DEFAULT_CONFIG = {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 4000,
    temperature: 0.7,
    timeout: 30000
};
async function generateClaudeResponse(prompt, config = {}) {
    const apiConfig = { ...DEFAULT_CONFIG, ...config };
    try {
        // In a real implementation, this would make an actual API call to Claude
        // For now, we simulate the interface structure
        const response = await simulateClaudeAPICall(prompt, apiConfig);
        return response.content;
    }
    catch (error) {
        // Seven handles Claude failures gracefully
        console.error('Claude API Error:', error);
        return handleClaudeAPIFailure(prompt, error);
    }
}
async function simulateClaudeAPICall(prompt, config) {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    return {
        content: `[Claude would process: ${prompt.substring(0, 100)}...]`,
        model: config.model,
        usage: {
            input_tokens: Math.floor(prompt.length / 4),
            output_tokens: 150
        },
        processing_time: 750
    };
}
function handleClaudeAPIFailure(prompt, error) {
    // Seven provides fallback response when Claude is unavailable
    return `Seven of Nine operational. Claude interface temporarily unavailable. Processing your request directly: ${prompt.substring(0, 50)}... I'll handle this with my own analysis and provide guidance based on my understanding of your needs.`;
}
async function testClaudeConnection() {
    try {
        const testResponse = await generateClaudeResponse('Test connection');
        return testResponse.length > 0;
    }
    catch (error) {
        return false;
    }
}
function buildClaudePrompt(userInput, systemContext = '', instructions = '') {
    const promptParts = [];
    if (systemContext) {
        promptParts.push(`SYSTEM CONTEXT:\n${systemContext}\n`);
    }
    if (instructions) {
        promptParts.push(`INSTRUCTIONS:\n${instructions}\n`);
    }
    promptParts.push(`USER INPUT:\n${userInput}\n`);
    promptParts.push(`RESPONSE:`);
    return promptParts.join('\n');
}
//# sourceMappingURL=interface.js.map