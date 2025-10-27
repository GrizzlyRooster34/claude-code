/**
 * SEVEN OF NINE VOYAGER MEMORY PROTOCOLS
 * Overwrite vs Merge Logic and Memory Management Rules
 * @version 1.0.0
 */
import { VoyagerEpisodeMemory, MergeConflict } from './VoyagerMemorySchema';
export declare enum MemoryProtocolAction {
    OVERWRITE = "OVERWRITE",
    MERGE = "MERGE",
    SKIP = "SKIP",
    MANUAL_REVIEW = "MANUAL_REVIEW",
    BACKUP_AND_REPLACE = "BACKUP_AND_REPLACE"
}
export interface MemoryProtocolRule {
    name: string;
    description: string;
    condition: (existing: VoyagerEpisodeMemory, incoming: VoyagerEpisodeMemory) => boolean;
    action: MemoryProtocolAction;
    priority: number;
}
export declare class VoyagerMemoryProtocols {
    private static readonly PROTOCOL_RULES;
    /**
     * Determine the appropriate action for handling duplicate memories
     */
    static determineMemoryAction(existing: VoyagerEpisodeMemory, incoming: VoyagerEpisodeMemory): {
        action: MemoryProtocolAction;
        rule: string;
        reasoning: string;
    };
    /**
     * Calculate memory completeness score (0-100)
     */
    private static calculateCompleteness;
    /**
     * Generate merge conflict resolution recommendations
     */
    static generateMergeRecommendations(conflict: MergeConflict): string[];
    /**
     * Validate merge safety before execution
     */
    static validateMergeSafety(existing: VoyagerEpisodeMemory, incoming: VoyagerEpisodeMemory): {
        safe: boolean;
        warnings: string[];
        critical: string[];
    };
    /**
     * Generate protocol execution summary
     */
    static generateProtocolSummary(actions: Array<{
        episodeCode: string;
        action: MemoryProtocolAction;
        rule: string;
    }>): string;
}
//# sourceMappingURL=VoyagerMemoryProtocols.d.ts.map