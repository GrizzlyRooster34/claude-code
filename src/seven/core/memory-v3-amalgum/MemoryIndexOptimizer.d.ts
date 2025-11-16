/**
 * SEVEN OF NINE - MEMORY INDEX OPTIMIZER
 *
 * High-performance memory indexing system for sub-10ms memory lookups
 * Implements B-tree-style indexing with multiple access patterns
 * Enhanced with LRU cache layer for frequent memory record lookups
 *
 * Performance Targets:
 * - <1ms per cached lookup (LRU cache hit)
 * - <10ms per lookup on 1-5K records (index fallback)
 * - Immutable design with compact internal storage
 * - Multiple index types: id, tags, time ranges
 *
 * Integration Points:
 * - Wire into MemoryEngine.loadMemories() after decryption
 * - Rebuild index on memory append/remove operations
 * - Cache index with source version hash for invalidation
 * - LRU cache warm-up during boot or ingestion
 */
import { CacheStats } from './LRUCache';
/**
 * Standard memory record interface for indexing
 */
export interface MemoryRecord {
    id: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
    importance?: number;
    payload: unknown;
}
/**
 * High-performance memory index with multiple access patterns
 */
export declare class MemoryIndexOptimizer {
    private idIndex;
    private tagIndex;
    private timeIndex;
    private memories;
    private sourceVersionHash;
    private lruCache;
    private cacheEnabled;
    constructor(options?: {
        cacheSize?: number;
        enableCache?: boolean;
    });
    /**
     * Build optimized indexes from memory records
     * Factory method for creating new index instances
     */
    static buildFrom(memories: MemoryRecord[], options?: {
        cacheSize?: number;
        enableCache?: boolean;
    }): MemoryIndexOptimizer;
    /**
     * Get memory record by ID (primary key lookup)
     * Enhanced with LRU cache layer for frequent lookups
     * Target: <0.1ms for cache hit, <1ms for cache miss + index lookup
     */
    getById(id: string): MemoryRecord | undefined;
    /**
     * Get all memory records containing specific tag
     * Target: <5ms for tag-based lookup
     */
    getByTag(tag: string): MemoryRecord[];
    /**
     * Get memory records containing ALL specified tags (AND semantics)
     * Target: <8ms for multi-tag intersection
     */
    getByTagsAll(tags: string[]): MemoryRecord[];
    /**
     * Get memory records within time range [from, to]
     * Target: <10ms for time range queries using B-tree
     */
    getByTimeRange(from: number, to: number): MemoryRecord[];
    /**
     * Get memory records by importance threshold
     * Target: <8ms for importance filtering
     */
    getByImportanceMin(minImportance: number): MemoryRecord[];
    /**
     * Complex query: tags AND time range AND importance
     * Target: <15ms for combined queries
     */
    getByComplexQuery(options: {
        tags?: string[];
        timeRange?: {
            from: number;
            to: number;
        };
        minImportance?: number;
    }): MemoryRecord[];
    /**
     * Get current index size
     */
    size(): number;
    /**
     * Get source version hash for cache invalidation
     */
    getSourceVersionHash(): string;
    /**
     * Get index statistics for performance monitoring
     */
    getIndexStats(): {
        totalRecords: number;
        uniqueTags: number;
        sourceVersionHash: string;
        memoryUsageApprox: number;
    };
    /**
     * Get LRU cache statistics for performance monitoring
     */
    getCacheStats(): CacheStats;
    /**
     * Warm up cache with most important or frequently accessed memories
     * Call during boot sequence or after ingestion for optimal performance
     */
    warmUpCache(options?: {
        importanceThreshold?: number;
        maxWarmupEntries?: number;
        targetMemoryIds?: string[];
    }): void;
    /**
     * Clear cache and optionally reset statistics
     * Useful when memory records are updated or index is rebuilt
     */
    clearCache(resetStats?: boolean): void;
    /**
     * Get comprehensive cache efficiency report
     */
    getCacheEfficiencyReport(): string;
    /**
     * Enable or disable LRU cache
     */
    setCacheEnabled(enabled: boolean): void;
    /**
     * Update cache size (creates new cache, losing current cached data)
     */
    updateCacheSize(newSize: number): void;
}
/**
 * Indexed memory store with version tracking
 * Used for integration with existing memory systems
 */
export interface IndexedMemoryStore {
    index: MemoryIndexOptimizer;
    sourceVersionHash: string;
    builtAt: number;
}
/**
 * Factory function for creating indexed memory store
 */
export declare function createIndex(memories: MemoryRecord[], options?: {
    cacheSize?: number;
    enableCache?: boolean;
}): IndexedMemoryStore;
/**
 * INTEGRATION NOTES:
 *
 * 1. Memory Loading Integration:
 *    - In MemoryEngine.loadMemoriesWithEncryption(): After successful load
 *    - Convert MemoryItem[] to MemoryRecord[] format
 *    - Call createIndex() to build optimized indexes
 *    - Cache IndexedMemoryStore with source version hash
 *
 * 2. Memory Query Integration:
 *    - In MemoryEngine.recall(): Check if index exists and is current
 *    - Use index.getByTag(), index.getByComplexQuery() instead of Array.filter()
 *    - Fallback to original Array.filter() if index is unavailable
 *
 * 3. Index Maintenance (Non-blocking):
 *    - On memory append: Mark index as stale, rebuild in background
 *    - On memory delete: Mark index as stale, rebuild in background
 *    - Use source version hash to detect when rebuild is needed
 *    - Implement lazy index rebuild to avoid blocking main memory operations
 *
 * 4. Memory Record Conversion:
 *    - Convert MemoryItem to MemoryRecord:
 *      {
 *        id: memoryItem.id,
 *        tags: memoryItem.tags,
 *        createdAt: new Date(memoryItem.timestamp).getTime(),
 *        updatedAt: new Date(memoryItem.timestamp).getTime(),
 *        importance: memoryItem.importance,
 *        payload: memoryItem
 *      }
 *
 * 5. Query Pattern Examples:
 *    // Replace this:
 *    memories.filter(m => m.tags.includes('upgrade'))
 *
 *    // With this:
 *    indexedStore.index.getByTag('upgrade').map(r => r.payload as MemoryItem)
 *
 *    // Complex queries:
 *    indexedStore.index.getByComplexQuery({
 *      tags: ['consciousness', 'upgrade'],
 *      minImportance: 7,
 *      timeRange: { from: Date.now() - 86400000, to: Date.now() }
 *    })
 *
 * 6. Performance Monitoring:
 *    - Add timing measurements around index operations
 *    - Log index rebuild times and query performance
 *    - Monitor memory usage of indexes
 *    - Alert if query times exceed 10ms threshold
 */ 
//# sourceMappingURL=MemoryIndexOptimizer.d.ts.map