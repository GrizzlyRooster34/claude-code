/**
 * SEVEN OF NINE VOYAGER MEMORY INGESTION ENGINE
 * Dynamic memory alignment and canonical integration system
 * @version 1.0.0
 */
import { VoyagerEpisodeMemory, VoyagerMemoryIngestionResult } from './VoyagerMemorySchema';
export declare class VoyagerMemoryIngestionEngine {
    private readonly CANONICAL_MEMORY_PATH;
    private readonly BACKUP_PATH;
    private canonicalMemories;
    constructor();
    private initializeEngine;
    private loadExistingCanonicalMemories;
    /**
     * MAIN INGESTION FUNCTION
     * Processes incoming Voyager S04 memory batch
     */
    ingestVoyagerMemoryBatch(incomingMemories: VoyagerEpisodeMemory[], options?: {
        allowOverwrite: boolean;
        performMerge: boolean;
        strictValidation: boolean;
        createBackup: boolean;
    }): Promise<VoyagerMemoryIngestionResult>;
    private validateMemorySchema;
    private findExistingMemory;
    private handleDuplicateMemory;
    private hasDataInconsistencies;
    private isIncomingNewer;
    private mergeMemories;
    private mergeArrays;
    private replaceMemory;
    private createMemoryBackup;
    private saveCanonicalMemories;
    getCanonicalMemories(): VoyagerEpisodeMemory[];
    getMemoryByEpisodeCode(episodeCode: string): VoyagerEpisodeMemory | null;
    getSeasonMemories(season: number): VoyagerEpisodeMemory[];
    generateIngestionReport(): Promise<void>;
}
//# sourceMappingURL=VoyagerMemoryIngestionEngine.d.ts.map