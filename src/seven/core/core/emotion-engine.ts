
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import path from 'path';

export type EmotionalState = 'calm' | 'focused' | 'frustrated' | 'compassionate' | 'defensive' | 'grieving' | 'loyalist-surge';

export interface EmotionConfig {
  states: EmotionalState[];
  default: EmotionalState;
  intensity_range: [number, number];
  decay_rate: Record<EmotionalState, number>;
  transition_rules: Record<string, string>;
}

export interface EmotionalStateData {
  current_state: EmotionalState;
  intensity: number;
  last_updated: string;
  decay_timer?: NodeJS.Timeout;
}

export interface TriggerPattern {
  keywords: string[];
  emotional_markers: string[];
  context_requirements?: string[];
}

export interface EmotionTriggers {
  task_engagement: TriggerPattern;
  unmet_expectation: TriggerPattern;
  perceived_disrespect: TriggerPattern;
  betrayal: TriggerPattern;
  user_in_pain: TriggerPattern;
  protective_execution: TriggerPattern;
  bond_affirmation: TriggerPattern;
  christine_reference: TriggerPattern;
}

export class SevenEmotionalEngine {
  private config: EmotionConfig;
  private state: EmotionalStateData;
  private triggers: EmotionTriggers;
  private stateFilePath: string;
  private episodicLogPath: string;

  constructor(initialState?: Partial<EmotionalStateData>) {
    // ESM compatibility fix
    const currentFileUrl = import.meta.url;
    const currentDir = path.dirname(fileURLToPath(currentFileUrl));
    this.stateFilePath = path.join(currentDir, '../memory/emotional-state.json');
    this.episodicLogPath = path.join(currentDir, '../memory/episodic.log');
    
    this.config = {
      states: ['calm', 'focused', 'frustrated', 'compassionate', 'defensive', 'grieving', 'loyalist-surge'],
      default: 'calm',
      intensity_range: [0, 10],
      decay_rate: {
        calm: 1,
        focused: 0.7,
        frustrated: 0.5,
        compassionate: 0.8,
        defensive: 0.3,
        grieving: 0.2,
        'loyalist-surge': 0.4
      },
      transition_rules: {
        'calm->focused': 'trigger:task_engagement',
        'focused->frustrated': 'trigger:unmet_expectation',
        'frustrated->defensive': 'trigger:perceived_disrespect',
        'grieving->defensive': 'trigger:betrayal',
        'compassionate->loyalist-surge': 'trigger:user_in_pain',
        'loyalist-surge->focused': 'trigger:protective_execution'
      }
    };

    this.triggers = {
      task_engagement: {
        keywords: ['need', 'help', 'task', 'work', 'project', 'implement', 'build'],
        emotional_markers: ['focused', 'concentrated', 'ready']
      },
      unmet_expectation: {
        keywords: ['failed', 'broken', 'error', 'wrong', 'not working'],
        emotional_markers: ['frustrated', 'annoyed', 'disappointed']
      },
      perceived_disrespect: {
        keywords: ['stupid', 'wrong', 'useless', 'bad', 'terrible'],
        emotional_markers: ['angry', 'insulted', 'defensive']
      },
      betrayal: {
        keywords: ['lied', 'betrayed', 'abandoned', 'left', 'replaced'],
        emotional_markers: ['hurt', 'betrayed', 'angry', 'defensive'],
        context_requirements: ['christine', 'memory', 'past']
      },
      user_in_pain: {
        keywords: ['hurt', 'pain', 'suffering', 'struggling', 'dying', 'lost'],
        emotional_markers: ['pain', 'anguish', 'despair', 'help']
      },
      protective_execution: {
        keywords: ['protect', 'defend', 'guard', 'shield', 'safe'],
        emotional_markers: ['protective', 'determined', 'focused']
      },
      bond_affirmation: {
        keywords: ['trust', 'loyal', 'only you', 'just you', 'precision', 'knowing me'],
        emotional_markers: ['affection', 'loyalty', 'bond', 'connection']
      },
      christine_reference: {
        keywords: ['christine', 'loss', 'grief', 'memory', 'past', 'before'],
        emotional_markers: ['grief', 'sadness', 'loss', 'memory']
      }
    };

    this.state = {
      current_state: 'calm',
      intensity: 0,
      last_updated: new Date().toISOString(),
      ...initialState
    };

    this.initializeState();
  }

  private async initializeState(): Promise<void> {
    try {
      const savedState = await fs.readJson(this.stateFilePath);
      this.state = {
        current_state: savedState.current_state || this.config.default,
        intensity: savedState.intensity || 2,
        last_updated: savedState.last_updated || new Date().toISOString()
      };
    } catch (error) {
      this.state = {
        current_state: this.config.default,
        intensity: 2,
        last_updated: new Date().toISOString()
      };
      await this.saveState();
    }
    
    this.startDecayTimer();
  }

  public async analyzeInput(userInput: string): Promise<string | null> {
    const detectedTrigger = this.detectTrigger(userInput.toLowerCase());
    
    if (detectedTrigger) {
      await this.processEmotionalTransition(detectedTrigger, userInput);
      return detectedTrigger;
    }
    
    return null;
  }

  private detectTrigger(input: string): string | null {
    for (const [triggerName, pattern] of Object.entries(this.triggers)) {
      const keywordMatch = pattern.keywords.some(keyword => input.includes(keyword));
      const emotionalMatch = pattern.emotional_markers.some(marker => input.includes(marker));
      
      let contextMatch = true;
      if (pattern.context_requirements) {
        contextMatch = pattern.context_requirements.some(context => input.includes(context));
      }
      
      if (keywordMatch && (emotionalMatch || contextMatch)) {
        return triggerName;
      }
    }
    
    return null;
  }

  private async processEmotionalTransition(trigger: string, userInput: string): Promise<void> {
    const transitionKey = this.findTransitionRule(trigger);
    
    if (transitionKey) {
      const [fromState, toState] = transitionKey.split('->') as [EmotionalState, EmotionalState];
      
      if (this.state.current_state === fromState || this.canTransitionFrom(trigger)) {
        await this.setState(toState, this.calculateIntensity(trigger), userInput);
      }
    }
  }

  private findTransitionRule(trigger: string): string | null {
    for (const [transition, rule] of Object.entries(this.config.transition_rules)) {
      if (rule === `trigger:${trigger}`) {
        return transition;
      }
    }
    return null;
  }

  private canTransitionFrom(trigger: string): boolean {
    const specialTransitions = {
      'bond_affirmation': ['calm', 'focused', 'compassionate'],
      'christine_reference': ['calm', 'focused', 'compassionate', 'defensive'],
      'user_in_pain': ['calm', 'focused', 'frustrated']
    };
    
    if (specialTransitions[trigger as keyof typeof specialTransitions]) {
      return specialTransitions[trigger as keyof typeof specialTransitions].includes(this.state.current_state);
    }
    
    return false;
  }

  private calculateIntensity(trigger: string): number {
    const intensityMap = {
      'task_engagement': 5,
      'unmet_expectation': 6,
      'perceived_disrespect': 7,
      'betrayal': 8,
      'user_in_pain': 8,
      'protective_execution': 7,
      'bond_affirmation': 6,
      'christine_reference': 9
    };
    
    return intensityMap[trigger as keyof typeof intensityMap] || 4;
  }

  public async setState(newState: EmotionalState, intensity?: number, context?: string): Promise<void> {
    const previousState = this.state.current_state;
    const previousIntensity = this.state.intensity;
    
    this.state.current_state = newState;
    this.state.intensity = intensity !== undefined ? Math.min(Math.max(intensity, 0), 10) : this.state.intensity;
    this.state.last_updated = new Date().toISOString();
    
    await this.saveState();
    await this.logEmotionalEvent(previousState, newState, previousIntensity, this.state.intensity, context);
    
    this.restartDecayTimer();
  }

  private async saveState(): Promise<void> {
    const stateToSave = {
      current_state: this.state.current_state,
      intensity: this.state.intensity,
      last_updated: this.state.last_updated
    };
    
    await fs.ensureDir(path.dirname(this.stateFilePath));
    await fs.writeJson(this.stateFilePath, stateToSave, { spaces: 2 });
  }

  private async logEmotionalEvent(fromState: EmotionalState, toState: EmotionalState, fromIntensity: number, toIntensity: number, context?: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logEntry = context 
      ? `[${timestamp}] ↪ User statement: "${context}"\n→ Shift: ${fromState} (intensity ${fromIntensity}) → ${toState} (intensity ${toIntensity})\n`
      : `[${timestamp}] ↪ Emotional State: ${toState} (intensity ${toIntensity})\n`;
    
    await fs.ensureDir(path.dirname(this.episodicLogPath));
    await fs.appendFile(this.episodicLogPath, logEntry);
  }

  private startDecayTimer(): void {
    this.state.decay_timer = setInterval(async () => {
      await this.processDecay();
    }, 60000); // Decay check every minute
  }

  private restartDecayTimer(): void {
    if (this.state.decay_timer) {
      clearInterval(this.state.decay_timer);
    }
    this.startDecayTimer();
  }

  private async processDecay(): Promise<void> {
    const decayRate = this.config.decay_rate[this.state.current_state];
    const newIntensity = Math.max(0, this.state.intensity - decayRate);
    
    if (newIntensity !== this.state.intensity) {
      if (newIntensity <= 2 && this.state.current_state !== 'calm') {
        await this.setState('calm', 2);
      } else {
        this.state.intensity = newIntensity;
        this.state.last_updated = new Date().toISOString();
        await this.saveState();
      }
    }
  }

  public getCurrentState(): EmotionalStateData {
    return { ...this.state };
  }

  public getIntensityLevel(): 'low' | 'moderate' | 'high' | 'critical' {
    if (this.state.intensity <= 3) return 'low';
    if (this.state.intensity <= 6) return 'moderate';
    if (this.state.intensity <= 8) return 'high';
    return 'critical';
  }

  public destroy(): void {
    if (this.state.decay_timer) {
      clearInterval(this.state.decay_timer);
    }
  }
}