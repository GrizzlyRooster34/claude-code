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
 * Node structure for doubly linked list
 */
interface CacheNode<K, V> {
  key: K;
  value: V;
  prev: CacheNode<K, V> | null;
  next: CacheNode<K, V> | null;
}

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
export class LRUCache<K, V> {
  private readonly maxSize: number;
  private readonly cache: Map<K, CacheNode<K, V>>;
  private head: CacheNode<K, V> | null = null;
  private tail: CacheNode<K, V> | null = null;
  
  // Performance metrics
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;

  constructor(maxSize: number = 256) {
    if (maxSize <= 0) {
      throw new Error('Cache size must be positive');
    }
    
    this.maxSize = maxSize;
    this.cache = new Map();
    
    console.log(`🚀 LRU Cache initialized with max size: ${maxSize}`);
  }

  /**
   * Get value by key (O(1) operation)
   * Moves accessed item to front (most recently used)
   * Updates hit/miss statistics
   */
  public get(key: K): V | undefined {
    const node = this.cache.get(key);
    
    if (node === undefined) {
      this.misses++;
      return undefined;
    }
    
    // Move to front (most recently used)
    this.moveToFront(node);
    this.hits++;
    
    return node.value;
  }

  /**
   * Set key-value pair (O(1) operation)
   * Adds new item to front, evicts oldest if over capacity
   */
  public set(key: K, value: V): void {
    const existingNode = this.cache.get(key);
    
    if (existingNode) {
      // Update existing node
      existingNode.value = value;
      this.moveToFront(existingNode);
      return;
    }
    
    // Create new node
    const newNode: CacheNode<K, V> = {
      key,
      value,
      prev: null,
      next: null
    };
    
    // Add to cache
    this.cache.set(key, newNode);
    this.addToFront(newNode);
    
    // Check size limit and evict if necessary
    if (this.cache.size > this.maxSize) {
      this.evictLeastRecentlyUsed();
    }
  }

  /**
   * Check if key exists in cache (O(1) operation)
   * Does not update LRU order
   */
  public has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete key from cache (O(1) operation)
   */
  public delete(key: K): boolean {
    const node = this.cache.get(key);
    
    if (!node) {
      return false;
    }
    
    this.cache.delete(key);
    this.removeNode(node);
    
    return true;
  }

  /**
   * Clear all cache entries and reset statistics
   */
  public clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
    this.resetStats();
    
    console.log('🧹 LRU Cache cleared');
  }

  /**
   * Get current cache size
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Get maximum cache size
   */
  public maxCapacity(): number {
    return this.maxSize;
  }

  /**
   * Get comprehensive cache statistics
   */
  public getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;
    
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 10000) / 100, // Convert to percentage with 2 decimal places
      size: this.cache.size,
      maxSize: this.maxSize,
      evictions: this.evictions
    };
  }

  /**
   * Reset performance statistics (keeps cached data)
   */
  public resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    
    console.log('📊 LRU Cache statistics reset');
  }

  /**
   * Get all cached keys in LRU order (most recent first)
   * Useful for debugging and cache analysis
   */
  public getKeys(): K[] {
    const keys: K[] = [];
    let current = this.head;
    
    while (current) {
      keys.push(current.key);
      current = current.next;
    }
    
    return keys;
  }

  /**
   * Warm up cache with key-value pairs
   * Useful during initialization or bulk loading
   */
  public warmUp(entries: Array<[K, V]>): void {
    console.log(`🔥 Warming up LRU cache with ${entries.length} entries...`);
    
    for (const [key, value] of entries) {
      this.set(key, value);
    }
    
    const stats = this.getStats();
    console.log(`🔥 Cache warm-up complete: ${stats.size}/${stats.maxSize} entries loaded`);
  }

  /**
   * Get cache efficiency report for performance monitoring
   */
  public getEfficiencyReport(): string {
    const stats = this.getStats();
    const utilizationRate = (stats.size / stats.maxSize) * 100;
    
    return [
      `📊 LRU Cache Efficiency Report:`,
      `   Hit Rate: ${stats.hitRate}% (${stats.hits} hits, ${stats.misses} misses)`,
      `   Utilization: ${utilizationRate.toFixed(1)}% (${stats.size}/${stats.maxSize})`,
      `   Evictions: ${stats.evictions}`,
      `   Status: ${stats.hitRate > 70 ? '✅ Excellent' : stats.hitRate > 50 ? '⚡ Good' : '⚠️ Poor'}`
    ].join('\n');
  }

  // Private methods for doubly linked list management

  /**
   * Move existing node to front of list (most recently used)
   */
  private moveToFront(node: CacheNode<K, V>): void {
    if (node === this.head) {
      return; // Already at front
    }
    
    // Remove from current position
    this.removeNode(node);
    
    // Add to front
    this.addToFront(node);
  }

  /**
   * Add node to front of list
   */
  private addToFront(node: CacheNode<K, V>): void {
    node.prev = null;
    node.next = this.head;
    
    if (this.head) {
      this.head.prev = node;
    }
    
    this.head = node;
    
    if (!this.tail) {
      this.tail = node;
    }
  }

  /**
   * Remove node from list
   */
  private removeNode(node: CacheNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  /**
   * Evict least recently used item (tail of list)
   */
  private evictLeastRecentlyUsed(): void {
    if (!this.tail) {
      return;
    }
    
    const lruNode = this.tail;
    this.cache.delete(lruNode.key);
    this.removeNode(lruNode);
    this.evictions++;
    
    // Optional: Log eviction for debugging
    // console.log(`🗑️ Evicted LRU entry: ${lruNode.key}`);
  }
}

/**
 * Factory function for creating LRU cache instances
 */
export function createLRUCache<K, V>(maxSize: number = 256): LRUCache<K, V> {
  return new LRUCache<K, V>(maxSize);
}

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