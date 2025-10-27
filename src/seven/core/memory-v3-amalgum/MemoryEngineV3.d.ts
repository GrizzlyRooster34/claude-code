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
export declare class MemoryEngineV3 {
    private memories;
    private temporalIndex;
    store(memory: Omit<MemoryV3Item, 'id'>): Promise<string>;
    recall(query: {
        tags?: string[];
        timeRange?: {
            start: Date;
            end: Date;
        };
        importance?: {
            min: number;
            max: number;
        };
        limit?: number;
    }): Promise<MemoryV3Item[]>;
    getTemporalContext(memoryId: string): Promise<MemoryV3Item[]>;
    getMemoryCount(): number;
}
export declare const memoryEngineV3: MemoryEngineV3;
//# sourceMappingURL=MemoryEngineV3.d.ts.map