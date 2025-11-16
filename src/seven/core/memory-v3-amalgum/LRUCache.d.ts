/**
 * SEVEN OF NINE - LRU CACHE IMPLEMENTATION
 *
 * High-performance Least Recently Used cache with O(1) operations
 * Designed for frequent memory record lookups with configurable size limits
 *
 * Features:
 * - O(1) get, set, and delete operations
 * - Automatic eviction of least recently used items
 * - Type-safe generic implementation
 * - Built-in hit/miss rate tracking
 * - Memory-efficient doubly linked list + hash map structure
 *
 * Integration Points:
 * - Used by MemoryIndexOptimizer for getById caching
 * - Cache warm-up during memory loading or ingestion
 * - Performance monitoring with hit rate reporting
 */
/**
 * Cache statistics for performance monitoring
 */
export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
    maxSize: number;
    evictions: number;
}
/**
 * High-performance LRU Cache with O(1) operations
 *
 * Uses combination of hash map for O(1) lookup and doubly linked list
 * for O(1) insertion/deletion and LRU ordering maintenance
 */
export declare class LRUCache<K, V> {
    private readonly maxSize;
    private readonly cache;
    private head;
    private tail;
    private hits;
    private misses;
    private evictions;
    constructor(maxSize?: number);
    /**
     * Get value by key (O(1) operation)
     * Moves accessed item to front (most recently used)
     * Updates hit/miss statistics
     */
    get(key: K): V | undefined;
    /**
     * Set key-value pair (O(1) operation)
     * Adds new item to front, evicts oldest if over capacity
     */
    set(key: K, value: V): void;
    /**
     * Check if key exists in cache (O(1) operation)
     * Does not update LRU order
     */
    has(key: K): boolean;
    /**
     * Delete key from cache (O(1) operation)
     */
    delete(key: K): boolean;
    /**
     * Clear all cache entries and reset statistics
     */
    clear(): void;
    /**
     * Get current cache size
     */
    size(): number;
    /**
     * Get maximum cache size
     */
    maxCapacity(): number;
    /**
     * Get comprehensive cache statistics
     */
    getStats(): CacheStats;
    /**
     * Reset performance statistics (keeps cached data)
     */
    resetStats(): void;
    /**
     * Get all cached keys in LRU order (most recent first)
     * Useful for debugging and cache analysis
     */
    getKeys(): K[];
    /**
     * Warm up cache with key-value pairs
     * Useful during initialization or bulk loading
     */
    warmUp(entries: Array<[K, V]>): void;
    /**
     * Get cache efficiency report for performance monitoring
     */
    getEfficiencyReport(): string;
    /**
     * Move existing node to front of list (most recently used)
     */
    private moveToFront;
    /**
     * Add node to front of list
     */
    private addToFront;
    /**
     * Remove node from list
     */
    private removeNode;
    /**
     * Evict least recently used item (tail of list)
     */
    private evictLeastRecentlyUsed;
}
/**
 * Factory function for creating LRU cache instances
 */
export declare function createLRUCache<K, V>(maxSize?: number): LRUCache<K, V>;
/**
 * INTEGRATION NOTES:
 *
 * 1. Memory Index Integration:
 *    - Wrap getById() calls in MemoryIndexOptimizer with cache.get()
 *    - On cache miss, fetch from B-tree index and cache.set() result
 *    - Use memory record ID as cache key, full MemoryRecord as value
 *
 * 2. Cache Warm-up Strategies:
 *    - During memory loading: Cache most important memories (importance >= 8)
 *    - During ingestion: Cache newly ingested canonical memories
 *    - On query: Automatically cache any accessed memory records
 *
 * 3. Performance Monitoring:
 *    - Check getStats() periodically to monitor hit rates
 *    - Log efficiency reports during system diagnostics
 *    - Alert if hit rate drops below 50% (may indicate cache size too small)
 *
 * 4. Memory Management:
 *    - Default 256 entries ≈ 50KB memory overhead (acceptable)
 *    - Increase cache size for systems with >5K memory records
 *    - Monitor eviction rate - high evictions may indicate undersized cache
 *
 * 5. Cache Invalidation:
 *    - Memory updates: Remove from cache to force fresh lookup
 *    - Memory deletes: Remove from cache to prevent stale data
 *    - Index rebuilds: Clear cache to ensure consistency
 *
 * Example Integration:
 *
 * // In MemoryIndexOptimizer constructor:
 * this.lruCache = new LRUCache<string, MemoryRecord>(512);
 *
 * // In getById method:
 * const cached = this.lruCache.get(id);
 * if (cached) return cached;
 *
 * const record = this.idIndex.get(id);
 * if (record) this.lruCache.set(id, record);
 * return record;
 */ 
//# sourceMappingURL=LRUCache.d.ts.map