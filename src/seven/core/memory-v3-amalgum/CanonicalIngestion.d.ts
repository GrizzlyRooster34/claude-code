/**
 * SEVEN OF NINE - CANONICAL MEMORY INGESTION ENGINE
 *
 * High-performance batch ingestion system for canonical episode data
 * Provides deduplication, incremental indexing, and encrypted persistence
 *
 * Features:
 * - Batch processing with configurable sizes (default 200)
 * - Hash-based deduplication against existing memories
 * - Incremental MemoryIndexOptimizer updates (no full rebuilds)
 * - Automatic encryption via existing persistence paths
 * - Provenance tracking and enforced canonical tags
 *
 * Integration Points:
 * - Uses existing MemoryEngine and TemporalMemoryCore for persistence
 * - Integrates with MemoryEncryptionEngine for at-rest encryption
 * - Updates MemoryIndexOptimizer incrementally after each batch
 */
import { MemoryEngine } from '../memory-v2/MemoryEngine';
import { TemporalMemoryCore } from './TemporalMemoryCore';
import { MemoryIndexOptimizer, MemoryRecord } from './MemoryIndexOptimizer';
/**
 * Canonical episode metadata for provenance tracking
 */
export interface CanonicalEpisodeMeta {
    series: 'VOY' | 'PIC';
    season: number;
    episode: number;
    title: string;
    airDate?: string;
}
/**
 * Canonical source provenance information
 */
export interface CanonicalSource {
    origin: 'canonical';
    meta: CanonicalEpisodeMeta;
    ingestedAt: number;
    batchId: string;
}
/**
 * Extended memory record with canonical provenance
 */
export interface CanonicalMemoryRecord extends MemoryRecord {
    provenance: CanonicalSource;
}
/**
 * Batch ingestion result statistics
 */
export interface IngestionResult {
    inserted: number;
    skipped: number;
    durationMs: number;
    batchesProcessed: number;
    dedupeHits: number;
    indexUpdateMs: number;
}
/**
 * Ingestion configuration options
 */
export interface IngestionOptions {
    batchSize?: number;
    dedupe?: boolean;
    importanceBaseline?: number;
    memoryType?: 'episodic' | 'temporal';
    preserveExisting?: boolean;
}
/**
 * High-performance canonical memory ingestion system
 */
export declare class CanonicalIngestion {
    private memoryEngine;
    private temporalEngine;
    private currentIndex;
    private dedupeCache;
    private batchId;
    constructor(memoryEngine: MemoryEngine, temporalEngine: TemporalMemoryCore);
    /**
     * Ingest canonical episode batch from file or stream
     * Main entry point for canonical memory ingestion
     */
    ingestEpisodeBatch(filePath: string, opts?: IngestionOptions): Promise<IngestionResult>;
    /**
     * Normalize raw canonical data to MemoryRecord format
     */
    normalizeCanonicalRecord(raw: unknown, meta: CanonicalEpisodeMeta): CanonicalMemoryRecord;
    /**
     * Attach canonical provenance to memory record
     */
    attachProvenance(record: MemoryRecord, meta: CanonicalEpisodeMeta): CanonicalMemoryRecord;
    /**
     * Update memory index incrementally (no full rebuild)
     */
    updateIndexIncremental(records: CanonicalMemoryRecord[]): Promise<void>;
    /**
     * Set current memory index for incremental updates
     */
    setCurrentIndex(index: MemoryIndexOptimizer): void;
    /**
     * Process a batch of episodes
     */
    private processBatch;
    /**
     * Load canonical file with format detection
     */
    private loadCanonicalFile;
    /**
     * Initialize deduplication cache with existing memories
     */
    private initializeDedupeCache;
    /**
     * Check if record is duplicate using stable hash
     */
    private isDuplicate;
    /**
     * Generate stable deduplication key
     */
    private generateDedupeKey;
    /**
     * Extract episode metadata from raw record
     */
    private extractEpisodeMeta;
    /**
     * Generate canonical tags based on metadata
     */
    private generateCanonicalTags;
    /**
     * Generate canonical memory ID
     */
    private generateCanonicalId;
    /**
     * Generate unique batch ID for provenance tracking
     */
    private generateBatchId;
    /**
     * Check if record is Voyager episode memory format
     */
    private isVoyagerEpisodeMemory;
    /**
     * Check if memory should be stored as temporal memory
     */
    private isTemporalMemory;
    /**
     * Normalize Voyager episode memory to canonical record
     */
    private normalizeVoyagerEpisode;
    /**
     * Persist episodic memory through MemoryEngine (ensures encryption)
     */
    private persistEpisodicMemory;
    /**
     * Persist temporal memory through TemporalMemoryCore (ensures encryption)
     */
    private persistTemporalMemory;
    /**
     * Get existing episodic memories for deduplication
     */
    private getExistingEpisodicMemories;
    /**
     * Get existing temporal memories for deduplication
     */
    private getExistingTemporalMemories;
    /**
     * Convert memory item to MemoryRecord format
     */
    private convertToMemoryRecord;
}
/**
 * Factory function for creating canonical ingestion engine
 */
export declare function createCanonicalIngestion(memoryEngine: MemoryEngine, temporalEngine: TemporalMemoryCore): CanonicalIngestion;
/**
 * INTEGRATION NOTES:
 *
 * 1. CLI Integration Point:
 *    - Add to existing ingestion scripts in scripts/ directory
 *    - Example: npx tsx scripts/ingest-canonical.ts path/to/episodes.json
 *
 * 2. Boot Sequence Integration:
 *    - Initialize CanonicalIngestion after MemoryEngine and TemporalMemoryCore setup
 *    - Set current index reference for incremental updates
 *
 * 3. Monitoring Integration:
 *    - Log ingestion statistics to system diagnostics
 *    - Monitor batch processing times and dedupe effectiveness
 *    - Alert on ingestion failures or performance degradation
 *
 * 4. Batch Processing Best Practices:
 *    - Use batchSize=200 for optimal memory usage vs performance
 *    - Enable dedupe=true for production ingestion
 *    - Set importanceBaseline=7 for canonical memories
 *    - Process during low-activity periods to avoid blocking Seven
 *
 * 5. File Format Support:
 *    - Supports existing Voyager S4 canonical format
 *    - Auto-detects and normalizes different canonical formats
 *    - Handles both single episodes and batch files
 *    - Preserves all original data in payload field
 */ 
//# sourceMappingURL=CanonicalIngestion.d.ts.map