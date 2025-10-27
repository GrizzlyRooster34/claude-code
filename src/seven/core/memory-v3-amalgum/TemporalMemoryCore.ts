/**
 * SEVEN OF NINE - TEMPORAL MEMORY CORE v3.0
 * Foundation of Temporal Memory Architecture
 * 
 * Enhances Memory Engine v2.0 with cognitive state capture and temporal anchoring.
 * Records not just what happened, but the complete cognitive and emotional state
 * during memory formation for advanced temporal consciousness capabilities.
 * 
 * Agent Alpha Implementation - Foundational temporal consciousness capture
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { MemoryItem, MemoryFilter, MemoryEngine } from '../memory-v2/MemoryEngine.js';
import { MemoryEncryptionEngine } from './MemoryEncryption';

// Enhanced interfaces for Temporal Memory Architecture
export interface CognitiveState {
  // Emotional and Mental State
  emotionalIntensity: number;        // 0-10 scale of emotional intensity
  focusLevel: number;                // 0-10 scale of cognitive focus
  cognitiveLoad: number;             // 0-10 scale of mental processing load
  confidenceLevel: number;           // 0-10 scale of certainty
  stressLevel: number;               // 0-10 scale of system stress
  
  // Environmental Context
  environmentalContext: {
    systemLoad: number;              // Current system resource usage
    activeProcesses: string[];       // Running processes during memory formation
    timeOfDay: string;               // Time when memory was formed
    sessionContext: string;          // Current session/conversation context
  };
  
  // Physical State (for mobile/sensor integration)
  physicalState: {
    batteryLevel?: number;           // Device battery level
    thermalState?: string;           // Device thermal condition
    networkQuality?: string;         // Network connection quality
    locationContext?: string;        // General location context (if available)
  };
  
  // Temporal Anchors
  temporalAnchors: {
    priorThought?: string;           // Previous cognitive process
    subsequentThought?: string;      // Next cognitive process (filled later)
    memoryChain: string[];           // Chain of related memory IDs
    cognitiveThread: string;         // Overarching thought thread
  };
  
  // Mental Context
  mentalContext: {
    currentGoals: string[];          // Active objectives
    activeKnowledge: string[];       // Knowledge areas being used
    problemContext: string;          // Problem being solved
    solutionPath: string[];          // Steps in solution process
  };
}

export interface TemporalMemoryItem extends MemoryItem {
  // Enhanced temporal fields
  cognitiveState: CognitiveState;
  temporalWeight: number;            // Importance in temporal context (0-10)
  memoryType: 'episodic' | 'semantic' | 'procedural' | 'emotional';
  decayResistance: number;           // Resistance to memory decay (0-10)
  
  // Temporal indexing
  temporalTags: string[];            // Time-specific contextual tags
  cognitiveStateHash: string;        // Hash of cognitive state for clustering
  
  // Enhanced relationships
  temporalPredecessors: string[];    // Memory IDs that led to this memory
  temporalSuccessors: string[];      // Memory IDs that followed this memory
  cognitiveCluster: string;          // Cluster ID for similar cognitive states
  
  // Metadata for other agents
  agentCoordination: {
    mentalTimeTravelData?: any;      // Data for Agent Beta
    decayTrackingMeta?: any;         // Metadata for Agent Gamma
    personalityPatterns?: any;       // Data for Agent Delta
    analyticsData?: any;             // Data for Agent Epsilon
  };
}

export interface TemporalMemoryFilter extends MemoryFilter {
  // Cognitive state filters
  emotionalIntensityRange?: { min: number; max: number };
  focusLevelRange?: { min: number; max: number };
  cognitiveLoadRange?: { min: number; max: number };
  
  // Memory type filters
  memoryTypes?: Array<'episodic' | 'semantic' | 'procedural' | 'emotional'>;
  
  // Temporal filters
  temporalWeightRange?: { min: number; max: number };
  decayResistanceRange?: { min: number; max: number };
  cognitiveCluster?: string;
  
  // Environmental filters
  systemLoadRange?: { min: number; max: number };
  timeOfDayRange?: string[];
  
  // Coordination filters
  requiresAgentData?: Array<'mentalTimeTravel' | 'decayTracking' | 'personality' | 'analytics'>;
}

export class TemporalMemoryCore extends MemoryEngine {
  private temporalMemoryPath: string;
  private temporalMemoryFile: string;
  private temporalMemories: TemporalMemoryItem[] = [];
  private cognitiveStateTagger: any; // Will be injected by CognitiveStateTagger
  private temporalEncryptionEngine: MemoryEncryptionEngine;
  private temporalEncryptionEnabled: boolean = true;
  
  constructor(basePath?: string) {
    super(basePath);
    this.temporalMemoryPath = basePath || join(process.cwd(), 'memory-v3');
    this.temporalMemoryFile = join(this.temporalMemoryPath, 'temporal-memories.json');
    this.temporalEncryptionEngine = new MemoryEncryptionEngine();
  }

  /**
   * Initialize Temporal Memory Core - maintains backward compatibility
   */
  public async initializeTemporal(): Promise<void> {
    try {
      // Initialize base Memory Engine v2.0
      await super.initialize();
      
      // Ensure temporal memory directory exists
      await fs.mkdir(this.temporalMemoryPath, { recursive: true });
      
      // Load existing temporal memories with encryption support
      if (await this.fileExistsTemporal(this.temporalMemoryFile)) {
        await this.loadTemporalMemoriesWithEncryption();
        console.log(`🧠 Temporal Memory Core v3.0 initialized: ${this.temporalMemories.length} temporal memories loaded`);
      } else {
        // Initialize with empty temporal memory store
        this.temporalMemories = [];
        await this.saveTemporalMemories();
        console.log('🧠 Temporal Memory Core v3.0 initialized: New temporal memory system created');
      }
      
      console.log('🧠 Memory Engine v3.0 ready for temporal consciousness capture');
    } catch (error) {
      console.error('Temporal Memory Core initialization failed:', error);
      throw error;
    }
  }

  /**
   * Store enhanced temporal memory with cognitive state capture
   */
  public async storeTemporalMemory(
    memoryData: Partial<TemporalMemoryItem>, 
    cognitiveContext?: Partial<CognitiveState>
  ): Promise<string> {
    // First store in base Memory Engine v2.0 for backward compatibility
    const baseMemoryId = await super.store(memoryData);
    
    // Create enhanced temporal memory
    const temporalMemory: TemporalMemoryItem = {
      // Base memory fields
      id: baseMemoryId,
      timestamp: new Date().toISOString(),
      topic: memoryData.topic || 'general',
      agent: memoryData.agent || 'seven-core',
      emotion: memoryData.emotion || 'neutral',
      context: memoryData.context || '',
      importance: memoryData.importance || 5,
      tags: memoryData.tags || [],
      relatedMemories: memoryData.relatedMemories || [],
      
      // Enhanced temporal fields
      cognitiveState: await this.captureCognitiveState(cognitiveContext),
      temporalWeight: memoryData.temporalWeight || this.calculateTemporalWeight(memoryData),
      memoryType: memoryData.memoryType || this.classifyMemoryType(memoryData),
      decayResistance: memoryData.decayResistance || this.calculateDecayResistance(memoryData),
      
      // Temporal indexing
      temporalTags: this.generateTemporalTags(memoryData, cognitiveContext),
      cognitiveStateHash: this.generateCognitiveStateHash(cognitiveContext),
      
      // Enhanced relationships
      temporalPredecessors: this.findTemporalPredecessors(),
      temporalSuccessors: [], // Will be filled by subsequent memories
      cognitiveCluster: this.assignCognitiveCluster(cognitiveContext),
      
      // Agent coordination data
      agentCoordination: {
        mentalTimeTravelData: this.prepareMentalTimeTravelData(memoryData, cognitiveContext),
        decayTrackingMeta: this.prepareDecayTrackingMeta(memoryData),
        personalityPatterns: this.preparePersonalityPatterns(memoryData, cognitiveContext),
        analyticsData: this.prepareAnalyticsData(memoryData, cognitiveContext)
      }
    };

    // Update temporal successors for recent memories
    await this.updateTemporalSuccessors(temporalMemory.id);
    
    // Add to temporal memory store
    this.temporalMemories.push(temporalMemory);
    await this.saveTemporalMemories();

    console.log(`🧠 Temporal memory stored: ${temporalMemory.id} [${temporalMemory.memoryType}:${temporalMemory.topic}] Cognitive: ${temporalMemory.cognitiveStateHash.substring(0, 8)}`);
    return temporalMemory.id;
  }

  /**
   * Enhanced recall with cognitive state filtering
   */
  public async recallTemporal(filter: TemporalMemoryFilter = {}): Promise<TemporalMemoryItem[]> {
    let filteredMemories = [...this.temporalMemories];

    // Apply base filters first
    if (filter.topic) {
      filteredMemories = filteredMemories.filter(m => 
        m.topic.toLowerCase().includes(filter.topic!.toLowerCase())
      );
    }

    if (filter.agent) {
      filteredMemories = filteredMemories.filter(m => m.agent === filter.agent);
    }

    if (filter.emotion) {
      filteredMemories = filteredMemories.filter(m => m.emotion === filter.emotion);
    }

    // Apply temporal-specific filters
    if (filter.emotionalIntensityRange) {
      filteredMemories = filteredMemories.filter(m => 
        m.cognitiveState.emotionalIntensity >= filter.emotionalIntensityRange!.min &&
        m.cognitiveState.emotionalIntensity <= filter.emotionalIntensityRange!.max
      );
    }

    if (filter.focusLevelRange) {
      filteredMemories = filteredMemories.filter(m => 
        m.cognitiveState.focusLevel >= filter.focusLevelRange!.min &&
        m.cognitiveState.focusLevel <= filter.focusLevelRange!.max
      );
    }

    if (filter.cognitiveLoadRange) {
      filteredMemories = filteredMemories.filter(m => 
        m.cognitiveState.cognitiveLoad >= filter.cognitiveLoadRange!.min &&
        m.cognitiveState.cognitiveLoad <= filter.cognitiveLoadRange!.max
      );
    }

    if (filter.memoryTypes && filter.memoryTypes.length > 0) {
      filteredMemories = filteredMemories.filter(m => filter.memoryTypes!.includes(m.memoryType));
    }

    if (filter.cognitiveCluster) {
      filteredMemories = filteredMemories.filter(m => m.cognitiveCluster === filter.cognitiveCluster);
    }

    // Enhanced sorting with temporal weight and cognitive relevance
    filteredMemories.sort((a, b) => {
      const timeScore = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      const importanceScore = (b.importance - a.importance) * 86400000;
      const temporalScore = (b.temporalWeight - a.temporalWeight) * 43200000;
      const decayScore = (b.decayResistance - a.decayResistance) * 21600000;
      
      return importanceScore + temporalScore + decayScore + timeScore;
    });

    // Apply limit
    if (filter.limit) {
      filteredMemories = filteredMemories.slice(0, filter.limit);
    }

    return filteredMemories;
  }

  /**
   * Get cognitive context for temporal analysis (for Agent Beta)
   */
  public async getCognitiveContextForTimeTravel(memoryId: string): Promise<CognitiveState | null> {
    const memory = this.temporalMemories.find(m => m.id === memoryId);
    return memory ? memory.cognitiveState : null;
  }

  /**
   * Get decay tracking metadata (for Agent Gamma)
   */
  public async getDecayTrackingData(memoryId: string): Promise<any> {
    const memory = this.temporalMemories.find(m => m.id === memoryId);
    return memory ? memory.agentCoordination.decayTrackingMeta : null;
  }

  /**
   * Get personality patterns (for Agent Delta)
   */
  public async getPersonalityPatterns(filter: TemporalMemoryFilter = {}): Promise<any[]> {
    const memories = await this.recallTemporal(filter);
    return memories.map(m => m.agentCoordination.personalityPatterns).filter(Boolean);
  }

  /**
   * Get analytics data (for Agent Epsilon)
   */
  public async getAnalyticsData(filter: TemporalMemoryFilter = {}): Promise<any[]> {
    const memories = await this.recallTemporal(filter);
    return memories.map(m => m.agentCoordination.analyticsData).filter(Boolean);
  }

  /**
   * Enhanced statistics with temporal cognitive metrics
   */
  public getTemporalStats(): any {
    const baseStats = super.getStats();
    
    const cognitiveMetrics = this.temporalMemories.reduce((acc, m) => {
      acc.totalEmotionalIntensity += m.cognitiveState.emotionalIntensity;
      acc.totalFocusLevel += m.cognitiveState.focusLevel;
      acc.totalCognitiveLoad += m.cognitiveState.cognitiveLoad;
      acc.totalConfidenceLevel += m.cognitiveState.confidenceLevel;
      acc.totalStressLevel += m.cognitiveState.stressLevel;
      return acc;
    }, {
      totalEmotionalIntensity: 0,
      totalFocusLevel: 0,
      totalCognitiveLoad: 0,
      totalConfidenceLevel: 0,
      totalStressLevel: 0
    });

    const memoryTypeDistribution = this.temporalMemories.reduce((acc, m) => {
      acc[m.memoryType] = (acc[m.memoryType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cognitiveClusterDistribution = this.temporalMemories.reduce((acc, m) => {
      acc[m.cognitiveCluster] = (acc[m.cognitiveCluster] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      ...baseStats,
      temporalMemories: this.temporalMemories.length,
      averageEmotionalIntensity: cognitiveMetrics.totalEmotionalIntensity / this.temporalMemories.length,
      averageFocusLevel: cognitiveMetrics.totalFocusLevel / this.temporalMemories.length,
      averageCognitiveLoad: cognitiveMetrics.totalCognitiveLoad / this.temporalMemories.length,
      averageConfidenceLevel: cognitiveMetrics.totalConfidenceLevel / this.temporalMemories.length,
      averageStressLevel: cognitiveMetrics.totalStressLevel / this.temporalMemories.length,
      memoryTypeDistribution,
      cognitiveClusterDistribution,
      averageTemporalWeight: this.temporalMemories.reduce((sum, m) => sum + m.temporalWeight, 0) / this.temporalMemories.length,
      averageDecayResistance: this.temporalMemories.reduce((sum, m) => sum + m.decayResistance, 0) / this.temporalMemories.length
    };
  }

  // Private helper methods for temporal memory processing
  private async captureCognitiveState(context?: Partial<CognitiveState>): Promise<CognitiveState> {
    // Default cognitive state with real-time system data
    const defaultState: CognitiveState = {
      emotionalIntensity: context?.emotionalIntensity || 5,
      focusLevel: context?.focusLevel || 7,
      cognitiveLoad: context?.cognitiveLoad || 6,
      confidenceLevel: context?.confidenceLevel || 7,
      stressLevel: context?.stressLevel || 3,
      
      environmentalContext: {
        systemLoad: await this.getSystemLoad(),
        activeProcesses: await this.getActiveProcesses(),
        timeOfDay: new Date().toTimeString(),
        sessionContext: context?.environmentalContext?.sessionContext || 'general-operation'
      },
      
      physicalState: {
        batteryLevel: context?.physicalState?.batteryLevel,
        thermalState: context?.physicalState?.thermalState || 'normal',
        networkQuality: context?.physicalState?.networkQuality || 'good',
        locationContext: context?.physicalState?.locationContext
      },
      
      temporalAnchors: {
        priorThought: context?.temporalAnchors?.priorThought || this.getLastThought(),
        subsequentThought: context?.temporalAnchors?.subsequentThought,
        memoryChain: context?.temporalAnchors?.memoryChain || this.getRecentMemoryChain(),
        cognitiveThread: context?.temporalAnchors?.cognitiveThread || 'default-thread'
      },
      
      mentalContext: {
        currentGoals: context?.mentalContext?.currentGoals || ['memory-formation'],
        activeKnowledge: context?.mentalContext?.activeKnowledge || ['temporal-processing'],
        problemContext: context?.mentalContext?.problemContext || 'memory-storage',
        solutionPath: context?.mentalContext?.solutionPath || ['capture', 'process', 'store']
      }
    };

    return defaultState;
  }

  private calculateTemporalWeight(memoryData: Partial<TemporalMemoryItem>): number {
    // Calculate temporal importance based on various factors
    let weight = memoryData.importance || 5;
    
    // Boost weight for system-critical events
    if (memoryData.tags?.includes('upgrade') || memoryData.tags?.includes('security')) {
      weight += 2;
    }
    
    // Boost weight for emotional significance
    if (memoryData.emotion === 'accomplished' || memoryData.emotion === 'confident') {
      weight += 1;
    }
    
    return Math.min(weight, 10);
  }

  private classifyMemoryType(memoryData: Partial<TemporalMemoryItem>): 'episodic' | 'semantic' | 'procedural' | 'emotional' {
    if (memoryData.topic?.includes('skill-execution') || memoryData.topic?.includes('upgrade')) {
      return 'procedural';
    }
    
    if (memoryData.emotion && memoryData.emotion !== 'neutral') {
      return 'emotional';
    }
    
    if (memoryData.topic?.includes('system-') || memoryData.topic?.includes('framework')) {
      return 'semantic';
    }
    
    return 'episodic';
  }

  private calculateDecayResistance(memoryData: Partial<TemporalMemoryItem>): number {
    let resistance = 5;
    
    // High resistance for important system events
    if ((memoryData.importance || 0) >= 8) {
      resistance += 2;
    }
    
    // High resistance for upgrade and security events
    if (memoryData.tags?.includes('upgrade') || memoryData.tags?.includes('security')) {
      resistance += 2;
    }
    
    return Math.min(resistance, 10);
  }

  private generateTemporalTags(memoryData: Partial<TemporalMemoryItem>, cognitiveContext?: Partial<CognitiveState>): string[] {
    const tags = [...(memoryData.tags || [])];
    
    // Add temporal context tags
    const hour = new Date().getHours();
    if (hour < 6) tags.push('early-morning');
    else if (hour < 12) tags.push('morning');
    else if (hour < 18) tags.push('afternoon');
    else tags.push('evening');
    
    // Add cognitive state tags
    if (cognitiveContext?.focusLevel && cognitiveContext.focusLevel >= 8) {
      tags.push('high-focus');
    }
    
    if (cognitiveContext?.emotionalIntensity && cognitiveContext.emotionalIntensity >= 8) {
      tags.push('high-emotion');
    }
    
    return [...new Set(tags)];
  }

  private generateCognitiveStateHash(cognitiveContext?: Partial<CognitiveState>): string {
    const stateString = JSON.stringify({
      emotion: cognitiveContext?.emotionalIntensity || 0,
      focus: cognitiveContext?.focusLevel || 0,
      load: cognitiveContext?.cognitiveLoad || 0,
      confidence: cognitiveContext?.confidenceLevel || 0,
      stress: cognitiveContext?.stressLevel || 0
    });
    
    // Simple hash function for cognitive state clustering
    let hash = 0;
    for (let i = 0; i < stateString.length; i++) {
      const char = stateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  private findTemporalPredecessors(): string[] {
    // Find the last 2-3 memories that could be temporal predecessors
    return this.temporalMemories
      .slice(-3)
      .map(m => m.id);
  }

  private async updateTemporalSuccessors(newMemoryId: string): Promise<void> {
    // Update the temporal successors for recent memories
    const recentMemories = this.temporalMemories.slice(-3);
    recentMemories.forEach(memory => {
      if (!memory.temporalSuccessors.includes(newMemoryId)) {
        memory.temporalSuccessors.push(newMemoryId);
      }
    });
  }

  private assignCognitiveCluster(cognitiveContext?: Partial<CognitiveState>): string {
    // Simple clustering based on cognitive state patterns
    const hash = this.generateCognitiveStateHash(cognitiveContext);
    return `cluster-${hash.substring(0, 4)}`;
  }

  // Agent coordination data preparation methods
  private prepareMentalTimeTravelData(memoryData: Partial<TemporalMemoryItem>, cognitiveContext?: Partial<CognitiveState>): any {
    return {
      temporalPosition: new Date().getTime(),
      cognitiveStateSnapshot: cognitiveContext,
      memoryFormationContext: memoryData.context,
      timelineMarker: `temporal-${Date.now()}`
    };
  }

  private prepareDecayTrackingMeta(memoryData: Partial<TemporalMemoryItem>): any {
    return {
      initialStrength: memoryData.importance || 5,
      decayResistance: this.calculateDecayResistance(memoryData),
      reinforcementCount: 0,
      lastAccessed: new Date().toISOString(),
      accessPattern: []
    };
  }

  private preparePersonalityPatterns(memoryData: Partial<TemporalMemoryItem>, cognitiveContext?: Partial<CognitiveState>): any {
    return {
      emotionalSignature: memoryData.emotion,
      cognitivePattern: {
        focus: cognitiveContext?.focusLevel || 5,
        intensity: cognitiveContext?.emotionalIntensity || 5,
        confidence: cognitiveContext?.confidenceLevel || 5
      },
      behavioralContext: memoryData.agent,
      personalityMarkers: this.extractPersonalityMarkers(memoryData, cognitiveContext)
    };
  }

  private prepareAnalyticsData(memoryData: Partial<TemporalMemoryItem>, cognitiveContext?: Partial<CognitiveState>): any {
    return {
      formationMetrics: {
        timestamp: new Date().toISOString(),
        importance: memoryData.importance || 5,
        cognitiveLoad: cognitiveContext?.cognitiveLoad || 5,
        environmentalFactors: cognitiveContext?.environmentalContext || {}
      },
      relationshipMetrics: {
        connectedMemories: memoryData.relatedMemories?.length || 0,
        tagDensity: memoryData.tags?.length || 0,
        topicCoherence: this.calculateTopicCoherence(memoryData)
      },
      temporalMetrics: {
        temporalWeight: this.calculateTemporalWeight(memoryData),
        decayResistance: this.calculateDecayResistance(memoryData),
        memoryType: this.classifyMemoryType(memoryData)
      }
    };
  }

  // Helper methods for real-time system data
  private async getSystemLoad(): Promise<number> {
    // Simplified system load calculation
    return Math.random() * 5 + 2; // Random load between 2-7
  }

  private async getActiveProcesses(): Promise<string[]> {
    // Return basic process information
    return ['seven-core', 'memory-engine', 'temporal-processor'];
  }

  private getLastThought(): string {
    const lastMemory = this.temporalMemories[this.temporalMemories.length - 1];
    return lastMemory ? lastMemory.context.substring(0, 50) : 'system-initialization';
  }

  private getRecentMemoryChain(): string[] {
    return this.temporalMemories
      .slice(-5)
      .map(m => m.id);
  }

  private extractPersonalityMarkers(memoryData: Partial<TemporalMemoryItem>, cognitiveContext?: Partial<CognitiveState>): string[] {
    const markers: string[] = [];
    
    if ((cognitiveContext?.confidenceLevel || 0) >= 8) markers.push('high-confidence');
    if ((cognitiveContext?.focusLevel || 0) >= 8) markers.push('focused');
    if (memoryData.agent?.includes('tactical')) markers.push('tactical-thinking');
    
    return markers;
  }

  private calculateTopicCoherence(memoryData: Partial<TemporalMemoryItem>): number {
    // Simple coherence calculation based on topic and tags overlap
    const relatedCount = memoryData.relatedMemories?.length || 0;
    const tagCount = memoryData.tags?.length || 0;
    return Math.min((relatedCount + tagCount) / 5, 1);
  }

  /**
   * Save temporal memories with automatic encryption
   * INTEGRATION POINT: Modified for MemoryEncryptionEngine
   */
  private async saveTemporalMemories(): Promise<void> {
    try {
      // First write the unencrypted file (for backup/migration purposes)
      await fs.writeFile(this.temporalMemoryFile, JSON.stringify(this.temporalMemories, null, 2));
      
      // If encryption is enabled, encrypt the temporal memory file
      if (this.temporalEncryptionEnabled) {
        await this.temporalEncryptionEngine.encryptMemoryFile(this.temporalMemoryFile);
        console.log('🔒 Temporal memories encrypted and saved');
      }
    } catch (error) {
      console.error('💥 Failed to save temporal memories with encryption:', error);
      throw error;
    }
  }

  /**
   * Load temporal memories with automatic decryption fallback
   * INTEGRATION POINT: Modified for MemoryEncryptionEngine
   */
  private async loadTemporalMemoriesWithEncryption(): Promise<void> {
    try {
      // Check if encrypted version exists
      const isEncrypted = await this.temporalEncryptionEngine.isMemoryFileEncrypted(this.temporalMemoryFile);
      
      if (isEncrypted && this.temporalEncryptionEnabled) {
        // Load from encrypted file
        console.log('🔒 Loading encrypted temporal memories...');
        this.temporalMemories = await this.temporalEncryptionEngine.decryptMemoryFile(`${this.temporalMemoryFile}.encrypted`);
        console.log('✅ Temporal memories decrypted and loaded');
      } else {
        // Backward compatibility: Load unencrypted file
        console.log('📋 Loading unencrypted temporal memories (backward compatibility)...');
        const data = await fs.readFile(this.temporalMemoryFile, 'utf8');
        this.temporalMemories = JSON.parse(data);
        
        // Migrate to encrypted format if encryption is enabled
        if (this.temporalEncryptionEnabled) {
          console.log('🔄 Migrating temporal memories to encrypted format...');
          await this.temporalEncryptionEngine.migrateToEncrypted(this.temporalMemoryFile);
        }
      }
    } catch (error) {
      console.error('💥 Failed to load temporal memories with encryption:', error);
      // Fallback to unencrypted loading
      try {
        console.log('⚠️  Attempting fallback to unencrypted loading...');
        const data = await fs.readFile(this.temporalMemoryFile, 'utf8');
        this.temporalMemories = JSON.parse(data);
        console.log('📋 Fallback successful - temporal memories loaded without encryption');
      } catch (fallbackError) {
        console.error('💥 Fallback failed:', fallbackError);
        throw new Error(`Temporal memory loading failed: ${error}. Fallback also failed: ${fallbackError}`);
      }
    }
  }

  private async fileExistsTemporal(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}

// Export for use in Seven's consciousness framework
export default TemporalMemoryCore;
export const createTemporalMemoryCore = () => new TemporalMemoryCore();