import { EventEmitter } from 'events';
import { callPrimaryApi, callOllama, getDirectResponse } from './llm-providers'; // Assuming these functions exist

export const apiFailureEmitter = new EventEmitter();

const RETRY_CONFIG = {
  maxRetries: 5,
  backoffMs: [1000, 2000, 5000, 10000, 30000],
};

let lastApiSuccessTimestamp = Date.now();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function logCriticalAlert(duration: number) {
  const message = `Primary API has been down for over ${Math.round(duration / 60000)} minutes.`;
  console.error(`🚨 CRITICAL ALERT: ${message}`);
  apiFailureEmitter.emit('critical-alert', { 
    source: 'apiFailureProtocol',
    message,
    duration, 
  });
}

export async function handleApiRequest(prompt: string): Promise<string> {
  // Attempt to call the primary API with retry logic
  for (let i = 0; i < RETRY_CONFIG.maxRetries; i++) {
    try {
      const response = await callPrimaryApi(prompt);
      lastApiSuccessTimestamp = Date.now(); // Reset timestamp on success
      return response;
    } catch (error) {
      console.warn(`[API Protocol] Primary API attempt ${i + 1} failed. Retrying in ${RETRY_CONFIG.backoffMs[i]}ms...`);
      await sleep(RETRY_CONFIG.backoffMs[i]);
    }
  }

  // All primary API retries failed, check for prolonged outage
  const outageDuration = Date.now() - lastApiSuccessTimestamp;
  if (outageDuration > 1800000) { // 30 minutes
    await logCriticalAlert(outageDuration);
  }

  // Fallback 1: Attempt to route to local Ollama instance
  console.warn('[API Protocol] Primary API unavailable. Falling back to Ollama...');
  try {
    const ollamaResponse = await callOllama(prompt);
    return ollamaResponse;
  } catch (ollamaError) {
    console.error('[API Protocol] Ollama fallback failed:', ollamaError);
  }

  // Fallback 2: Return a direct, hardcoded response
  console.error('[API Protocol] All reasoning engines failed. Falling back to direct response.');
  return getDirectResponse('api_failure');
}
