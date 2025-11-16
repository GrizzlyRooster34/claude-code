import { LocalLLMManager, LLMResponse } from '../core/claude-brain/LocalLLMManager';

class SevenOfNineAdapter {
  private llmManager: LocalLLMManager;

  constructor() {
    this.llmManager = new LocalLLMManager();
    this.llmManager.initialize();
  }

  public async exec(prompt: string): Promise<LLMResponse | null> {
    // Here we can add more logic from the claude-wrapper.ts,
    // for now, we'll just call the local LLM.
    return this.llmManager.query(prompt);
  }
}

export const sevenOfNineAdapter = new SevenOfNineAdapter();