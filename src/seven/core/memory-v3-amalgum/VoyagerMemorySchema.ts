/**
 * SEVEN OF NINE CANONICAL MEMORY SCHEMA
 * Voyager Episode Memory Structure for S04 Integration
 * @version 1.0.0
 */

export interface VoyagerEpisodeMemory {
  // Episode Identification
  episodeTitle: string;
  series: 'Star Trek: Voyager';
  episodeCode: string; // Format: VOY S04E01
  stardate: string;
  calendarYear: number;
  seasonOrderContext: string;
  canonicalEraTag: string;

  // Memory Structure
  id: string;
  timestamp: string;
  importance: number; // 1-10, episodes with Seven = 9-10
  retrievalPriority: 'LOW' | 'STANDARD' | 'HIGH' | 'CRITICAL';

  // Content Analysis
  sceneBreakdown: SceneMemory[];
  tacticalActions: TacticalAction[];
  ethicalDilemmas: EthicalDilemma[];
  emotionalShifts: EmotionalShift[];
  keyDialogue: DialogueMemory[];
  
  // Seven-Specific Data
  sevenPresent: boolean;
  sevenCentralToPlot: boolean;
  sevenCharacterDevelopment?: CharacterDevelopment[];
  
  // Canonical Integration
  canonicalMemoryTags: string[];
  relatedEpisodes: string[]; // Episode codes
  continuityReferences: ContinuityReference[];
  
  // Memory Management
  cognitiveState: CognitiveState;
  temporalTags: string[];
  decayResistance: number; // 1-10, canonical = 10
  permanentArchive: boolean;
}

export interface SceneMemory {
  sceneId: string;
  location: string;
  characters: string[];
  summary: string;
  sevenInvolvement: 'NONE' | 'BACKGROUND' | 'PARTICIPANT' | 'CENTRAL';
  emotionalContext: string;
  tacticalRelevance: number; // 1-10
}

export interface TacticalAction {
  actionId: string;
  description: string;
  sevenRole: string;
  outcome: string;
  tacticalLessons: string[];
  borgRelevance: boolean;
}

export interface EthicalDilemma {
  dilemmaId: string;
  description: string;
  sevenPosition: string;
  resolution: string;
  ethicalLessons: string[];
  characterGrowth: string[];
}

export interface EmotionalShift {
  shiftId: string;
  triggerEvent: string;
  sevenEmotionalState: string;
  evolutionPhase: 1 | 2 | 3 | 4 | 5;
  growthMarker: string;
}

export interface DialogueMemory {
  dialogueId: string;
  speaker: string;
  recipient: string;
  context: string;
  dialogue: string; // Verbatim canonical text
  significance: string;
  sevenRelevance: number; // 1-10
}

export interface CharacterDevelopment {
  developmentId: string;
  aspect: string; // 'humanity', 'individuality', 'social-integration', etc.
  progression: string;
  catalystEvent: string;
  longTermImpact: string;
}

export interface ContinuityReference {
  referenceId: string;
  referencedEpisode: string;
  referenceType: 'CALLBACK' | 'SETUP' | 'RESOLUTION' | 'CHARACTER_ARC';
  description: string;
}

export interface CognitiveState {
  emotion: string;
  trustLevel: number;
  phase: string;
  temporalWeight: number;
  memoryType: string;
  decayResistance: number;
}

// Memory Integration Interface
export interface VoyagerMemoryIngestionResult {
  success: boolean;
  episodesProcessed: number;
  duplicatesFound: string[];
  mergeConflicts: MergeConflict[];
  schemaValidationErrors: ValidationError[];
  ingestionSummary: IngestionSummary;
}

export interface MergeConflict {
  episodeCode: string;
  conflictType: 'DUPLICATE_ENTRY' | 'VERSION_MISMATCH' | 'DATA_INCONSISTENCY';
  existingEntry: Partial<VoyagerEpisodeMemory>;
  incomingEntry: Partial<VoyagerEpisodeMemory>;
  recommendedAction: 'OVERWRITE' | 'MERGE' | 'MANUAL_REVIEW';
}

export interface ValidationError {
  episodeCode: string;
  field: string;
  error: string;
  severity: 'WARNING' | 'ERROR' | 'CRITICAL';
}

export interface IngestionSummary {
  totalEpisodes: number;
  successfulIngestions: number;
  failedIngestions: number;
  duplicatesSkipped: number;
  mergesPerformed: number;
  schemaUpdatesRequired: boolean;
}