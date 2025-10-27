

/**
 * Memory Engine V3 - Temporal Memory Integration
 * Enhanced episodic memory with consciousness timeline mapping
 */

export interface MemoryV3Item {
  id: string;
  content: string;
  timestamp: Date;
  importance: number;
  tags: string[];
  temporalContext?: {
    beforeMemories: string[];
    afterMemories: string[];
    contextWindow: number;
  };
}

export class MemoryEngineV3 {
  private memories: Map<string, MemoryV3Item> = new Map();
  private temporalIndex: Map<string, Date> = new Map();

  async store(memory: Omit<MemoryV3Item, 'id'>): Promise<string> {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const memoryItem: MemoryV3Item = {
      id,
      ...memory,
      timestamp: memory.timestamp || new Date()
    };

    this.memories.set(id, memoryItem);
    this.temporalIndex.set(id, memoryItem.timestamp);
    
    console.log(`📚 Memory V3: Stored memory ${id} with temporal context`);
    return id;
  }

  async recall(query: {
    tags?: string[];
    timeRange?: { start: Date; end: Date };
    importance?: { min: number; max: number };
    limit?: number;
  }): Promise<MemoryV3Item[]> {
    let results = Array.from(this.memories.values());

    if (query.tags) {
      results = results.filter(m => 
        query.tags!.some(tag => m.tags.includes(tag))
      );
    }

    if (query.timeRange) {
      results = results.filter(m => 
        m.timestamp >= query.timeRange!.start && 
        m.timestamp <= query.timeRange!.end
      );
    }

    if (query.importance) {
      results = results.filter(m => 
        m.importance >= query.importance!.min && 
        m.importance <= query.importance!.max
      );
    }

    // Sort by temporal relevance and importance
    results.sort((a, b) => {
      const importanceDiff = b.importance - a.importance;
      if (Math.abs(importanceDiff) > 1) return importanceDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    return results.slice(0, query.limit || 10);
  }

  async getTemporalContext(memoryId: string): Promise<MemoryV3Item[]> {
    const memory = this.memories.get(memoryId);
    if (!memory?.temporalContext) return [];

    const contextIds = [
      ...memory.temporalContext.beforeMemories,
      ...memory.temporalContext.afterMemories
    ];

    return contextIds
      .map(id => this.memories.get(id))
      .filter(Boolean) as MemoryV3Item[];
  }

  getMemoryCount(): number {
    return this.memories.size;
  }
}

// Export singleton instance
export const memoryEngineV3 = new MemoryEngineV3();