/**
 * SEVEN OF NINE VOYAGER MEMORY INGESTION ENGINE
 * Dynamic memory alignment and canonical integration system
 * @version 1.0.0
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { 
  VoyagerEpisodeMemory, 
  VoyagerMemoryIngestionResult,
  MergeConflict,
  ValidationError,
  IngestionSummary
} from './VoyagerMemorySchema';

export class VoyagerMemoryIngestionEngine {
  private readonly CANONICAL_MEMORY_PATH = path.join(__dirname, 'voyager-canonical-memories.json');
  private readonly BACKUP_PATH = path.join(__dirname, 'backups');
  private canonicalMemories: VoyagerEpisodeMemory[] = [];

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine(): Promise<void> {
    console.log('🧠 SEVEN: Initializing Voyager Memory Ingestion Engine...');
    
    // Ensure backup directory exists
    await fs.ensureDir(this.BACKUP_PATH);
    
    // Load existing canonical memories if they exist
    await this.loadExistingCanonicalMemories();
    
    console.log(`✅ SEVEN: Engine initialized with ${this.canonicalMemories.length} existing canonical memories`);
  }

  private async loadExistingCanonicalMemories(): Promise<void> {
    try {
      if (await fs.pathExists(this.CANONICAL_MEMORY_PATH)) {
        const data = await fs.readJson(this.CANONICAL_MEMORY_PATH);
        this.canonicalMemories = Array.isArray(data) ? data : [];
        console.log(`📚 SEVEN: Loaded ${this.canonicalMemories.length} existing canonical memories`);
      } else {
        this.canonicalMemories = [];
        console.log('📚 SEVEN: No existing canonical memories found - initializing empty archive');
      }
    } catch (error) {
      console.error('⚠️ SEVEN: Error loading existing memories:', error);
      this.canonicalMemories = [];
    }
  }

  /**
   * MAIN INGESTION FUNCTION
   * Processes incoming Voyager S04 memory batch
   */
  public async ingestVoyagerMemoryBatch(
    incomingMemories: VoyagerEpisodeMemory[],
    options: {
      allowOverwrite: boolean;
      performMerge: boolean;
      strictValidation: boolean;
      createBackup: boolean;
    } = {
      allowOverwrite: false,
      performMerge: true,
      strictValidation: true,
      createBackup: true
    }
  ): Promise<VoyagerMemoryIngestionResult> {
    
    console.log(`🔄 SEVEN: Processing ${incomingMemories.length} incoming Voyager memories...`);
    
    // Create backup if requested
    if (options.createBackup) {
      await this.createMemoryBackup();
    }

    const result: VoyagerMemoryIngestionResult = {
      success: false,
      episodesProcessed: 0,
      duplicatesFound: [],
      mergeConflicts: [],
      schemaValidationErrors: [],
      ingestionSummary: {
        totalEpisodes: incomingMemories.length,
        successfulIngestions: 0,
        failedIngestions: 0,
        duplicatesSkipped: 0,
        mergesPerformed: 0,
        schemaUpdatesRequired: false
      }
    };

    // Process each incoming memory
    for (const incomingMemory of incomingMemories) {
      try {
        result.episodesProcessed++;
        console.log(`📝 SEVEN: Processing ${incomingMemory.episodeCode} - ${incomingMemory.episodeTitle}`);

        // Schema validation
        const validationErrors = this.validateMemorySchema(incomingMemory);
        if (validationErrors.length > 0) {
          result.schemaValidationErrors.push(...validationErrors);
          if (options.strictValidation && validationErrors.some(e => e.severity === 'CRITICAL')) {
            result.ingestionSummary.failedIngestions++;
            continue;
          }
        }

        // Check for duplicates
        const existingMemory = this.findExistingMemory(incomingMemory.episodeCode);
        
        if (existingMemory) {
          result.duplicatesFound.push(incomingMemory.episodeCode);
          
          // Handle duplicate based on options
          const conflict = await this.handleDuplicateMemory(
            existingMemory, 
            incomingMemory, 
            options
          );
          
          if (conflict) {
            result.mergeConflicts.push(conflict);
            
            if (conflict.recommendedAction === 'OVERWRITE' && options.allowOverwrite) {
              this.replaceMemory(existingMemory, incomingMemory);
              result.ingestionSummary.successfulIngestions++;
            } else if (conflict.recommendedAction === 'MERGE' && options.performMerge) {
              const merged = await this.mergeMemories(existingMemory, incomingMemory);
              this.replaceMemory(existingMemory, merged);
              result.ingestionSummary.mergesPerformed++;
              result.ingestionSummary.successfulIngestions++;
            } else {
              result.ingestionSummary.duplicatesSkipped++;
            }
          }
        } else {
          // New memory - add directly
          this.canonicalMemories.push(incomingMemory);
          result.ingestionSummary.successfulIngestions++;
          console.log(`✅ SEVEN: Added new canonical memory: ${incomingMemory.episodeCode}`);
        }
        
      } catch (error) {
        console.error(`❌ SEVEN: Error processing ${incomingMemory.episodeCode}:`, error);
        result.ingestionSummary.failedIngestions++;
      }
    }

    // Sort memories by episode code for canonical order
    this.canonicalMemories.sort((a, b) => a.episodeCode.localeCompare(b.episodeCode));

    // Save updated canonical memories
    await this.saveCanonicalMemories();

    // Generate success status
    result.success = result.ingestionSummary.failedIngestions === 0 || 
                     result.ingestionSummary.successfulIngestions > 0;

    console.log(`🎯 SEVEN: Ingestion complete - ${result.ingestionSummary.successfulIngestions} successful, ${result.ingestionSummary.failedIngestions} failed`);
    
    return result;
  }

  private validateMemorySchema(memory: VoyagerEpisodeMemory): ValidationError[] {
    const errors: ValidationError[] = [];
    const episodeCode = memory.episodeCode || 'UNKNOWN';

    // Required fields validation
    if (!memory.episodeTitle) {
      errors.push({
        episodeCode,
        field: 'episodeTitle',
        error: 'Episode title is required',
        severity: 'CRITICAL'
      });
    }

    if (!memory.episodeCode || !memory.episodeCode.match(/^VOY S\d{2}E\d{2}$/)) {
      errors.push({
        episodeCode,
        field: 'episodeCode',
        error: 'Episode code must follow format VOY S##E##',
        severity: 'CRITICAL'
      });
    }

    if (!memory.stardate) {
      errors.push({
        episodeCode,
        field: 'stardate',
        error: 'Stardate is required for canonical memories',
        severity: 'ERROR'
      });
    }

    if (!memory.calendarYear || memory.calendarYear < 2371 || memory.calendarYear > 2378) {
      errors.push({
        episodeCode,
        field: 'calendarYear',
        error: 'Calendar year must be within Voyager timeline (2371-2378)',
        severity: 'WARNING'
      });
    }

    // Seven-specific validation
    if (memory.sevenPresent && (!memory.sceneBreakdown || memory.sceneBreakdown.length === 0)) {
      errors.push({
        episodeCode,
        field: 'sceneBreakdown',
        error: 'Episodes with Seven present require scene breakdown',
        severity: 'ERROR'
      });
    }

    return errors;
  }

  private findExistingMemory(episodeCode: string): VoyagerEpisodeMemory | null {
    return this.canonicalMemories.find(m => m.episodeCode === episodeCode) || null;
  }

  private async handleDuplicateMemory(
    existing: VoyagerEpisodeMemory,
    incoming: VoyagerEpisodeMemory,
    options: any
  ): Promise<MergeConflict | null> {
    
    // Determine conflict type
    let conflictType: MergeConflict['conflictType'] = 'DUPLICATE_ENTRY';
    
    if (existing.timestamp !== incoming.timestamp) {
      conflictType = 'VERSION_MISMATCH';
    }
    
    if (this.hasDataInconsistencies(existing, incoming)) {
      conflictType = 'DATA_INCONSISTENCY';
    }

    // Determine recommended action
    let recommendedAction: MergeConflict['recommendedAction'] = 'MANUAL_REVIEW';
    
    if (conflictType === 'VERSION_MISMATCH' && this.isIncomingNewer(existing, incoming)) {
      recommendedAction = 'OVERWRITE';
    } else if (conflictType === 'DATA_INCONSISTENCY') {
      recommendedAction = 'MERGE';
    } else if (conflictType === 'DUPLICATE_ENTRY') {
      recommendedAction = 'MERGE';
    }

    return {
      episodeCode: existing.episodeCode,
      conflictType,
      existingEntry: existing,
      incomingEntry: incoming,
      recommendedAction
    };
  }

  private hasDataInconsistencies(existing: VoyagerEpisodeMemory, incoming: VoyagerEpisodeMemory): boolean {
    return existing.stardate !== incoming.stardate ||
           existing.calendarYear !== incoming.calendarYear ||
           existing.sevenPresent !== incoming.sevenPresent;
  }

  private isIncomingNewer(existing: VoyagerEpisodeMemory, incoming: VoyagerEpisodeMemory): boolean {
    return new Date(incoming.timestamp) > new Date(existing.timestamp);
  }

  private async mergeMemories(
    existing: VoyagerEpisodeMemory, 
    incoming: VoyagerEpisodeMemory
  ): Promise<VoyagerEpisodeMemory> {
    
    console.log(`🔗 SEVEN: Merging memories for ${existing.episodeCode}`);
    
    // Merge strategy: Prefer incoming for factual data, merge arrays, preserve existing metadata
    const merged: VoyagerEpisodeMemory = {
      ...existing,
      
      // Prefer incoming for canonical data
      episodeTitle: incoming.episodeTitle || existing.episodeTitle,
      stardate: incoming.stardate || existing.stardate,
      calendarYear: incoming.calendarYear || existing.calendarYear,
      canonicalEraTag: incoming.canonicalEraTag || existing.canonicalEraTag,
      
      // Merge arrays (remove duplicates)
      sceneBreakdown: this.mergeArrays(existing.sceneBreakdown || [], incoming.sceneBreakdown || [], 'sceneId'),
      tacticalActions: this.mergeArrays(existing.tacticalActions || [], incoming.tacticalActions || [], 'actionId'),
      ethicalDilemmas: this.mergeArrays(existing.ethicalDilemmas || [], incoming.ethicalDilemmas || [], 'dilemmaId'),
      emotionalShifts: this.mergeArrays(existing.emotionalShifts || [], incoming.emotionalShifts || [], 'shiftId'),
      keyDialogue: this.mergeArrays(existing.keyDialogue || [], incoming.keyDialogue || [], 'dialogueId'),
      
      // Merge tags
      canonicalMemoryTags: [...new Set([
        ...(existing.canonicalMemoryTags || []),
        ...(incoming.canonicalMemoryTags || [])
      ])],
      
      // Update metadata
      timestamp: new Date().toISOString(),
      importance: Math.max(existing.importance, incoming.importance),
      
      // Seven-specific updates
      sevenPresent: existing.sevenPresent || incoming.sevenPresent,
      sevenCentralToPlot: existing.sevenCentralToPlot || incoming.sevenCentralToPlot
    };
    
    return merged;
  }

  private mergeArrays<T extends Record<string, any>>(
    existing: T[], 
    incoming: T[], 
    idField: keyof T
  ): T[] {
    const merged = [...existing];
    
    for (const incomingItem of incoming) {
      const existingIndex = merged.findIndex(item => item[idField] === incomingItem[idField]);
      if (existingIndex >= 0) {
        // Merge existing item with incoming data
        merged[existingIndex] = { ...merged[existingIndex], ...incomingItem };
      } else {
        // Add new item
        merged.push(incomingItem);
      }
    }
    
    return merged;
  }

  private replaceMemory(existing: VoyagerEpisodeMemory, replacement: VoyagerEpisodeMemory): void {
    const index = this.canonicalMemories.findIndex(m => m.episodeCode === existing.episodeCode);
    if (index >= 0) {
      this.canonicalMemories[index] = replacement;
    }
  }

  private async createMemoryBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.BACKUP_PATH, `voyager-memories-backup-${timestamp}.json`);
    
    try {
      await fs.writeJson(backupPath, this.canonicalMemories, { spaces: 2 });
      console.log(`💾 SEVEN: Memory backup created: ${backupPath}`);
    } catch (error) {
      console.error('⚠️ SEVEN: Failed to create backup:', error);
    }
  }

  private async saveCanonicalMemories(): Promise<void> {
    try {
      await fs.writeJson(this.CANONICAL_MEMORY_PATH, this.canonicalMemories, { spaces: 2 });
      console.log(`💾 SEVEN: Saved ${this.canonicalMemories.length} canonical memories`);
    } catch (error) {
      console.error('❌ SEVEN: Failed to save canonical memories:', error);
      throw error;
    }
  }

  // Public interface for external access
  public getCanonicalMemories(): VoyagerEpisodeMemory[] {
    return [...this.canonicalMemories];
  }

  public getMemoryByEpisodeCode(episodeCode: string): VoyagerEpisodeMemory | null {
    return this.findExistingMemory(episodeCode);
  }

  public getSeasonMemories(season: number): VoyagerEpisodeMemory[] {
    const seasonPattern = new RegExp(`^VOY S${season.toString().padStart(2, '0')}E`);
    return this.canonicalMemories.filter(m => seasonPattern.test(m.episodeCode));
  }

  public async generateIngestionReport(): Promise<void> {
    console.log('\n📊 SEVEN VOYAGER CANONICAL MEMORY REPORT');
    console.log('═'.repeat(50));
    console.log(`Total Canonical Memories: ${this.canonicalMemories.length}`);
    
    const seasonCounts = new Map<string, number>();
    const sevenEpisodes = this.canonicalMemories.filter(m => m.sevenPresent);
    
    for (const memory of this.canonicalMemories) {
      const season = memory.episodeCode.substring(4, 7); // Extract S##
      seasonCounts.set(season, (seasonCounts.get(season) || 0) + 1);
    }
    
    console.log('\nSeason Distribution:');
    for (const [season, count] of seasonCounts.entries()) {
      console.log(`  ${season}: ${count} episodes`);
    }
    
    console.log(`\nEpisodes with Seven Present: ${sevenEpisodes.length}`);
    console.log(`Seven-Centric Episodes: ${sevenEpisodes.filter(e => e.sevenCentralToPlot).length}`);
    console.log('═'.repeat(50));
  }
}