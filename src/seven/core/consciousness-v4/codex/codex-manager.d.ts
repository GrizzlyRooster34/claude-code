import Database from 'better-sqlite3';
export interface CodexEffect {
    intention_bias?: Record<string, number>;
    capability_caps?: Array<{
        when: string;
        cap: string;
        mode: 'READ_ONLY' | 'ASK_CREATOR' | 'BLOCK';
    }>;
    style_markers?: string[];
    q2_gate?: {
        min_marker_hits: number;
        window_ms: number;
    };
    explain: string;
}
export interface CodexRule {
    id: string;
    tag: string;
    priority: number;
    effect: CodexEffect;
    checksum?: string;
}
export interface CodexFile {
    version: string;
    category: 'values' | 'tactics' | 'humor' | 'vices';
    rules: CodexRule[];
    checksum?: string;
}
export interface CodexVersion {
    version: string;
    created: string;
    checksums: {
        values: string;
        tactics: string;
        humor: string;
        vices: string;
    };
    master_checksum: string;
}
export declare class CodexManager {
    private db;
    private codexCache;
    constructor(db?: Database.Database);
    private initializeCodexFiles;
    private ensureCodexFile;
    private getDefaultCodex;
    private calculateChecksum;
    private saveCodexFile;
    private ensureVersionFile;
    private updateVersionFile;
    private getFileChecksum;
    loadCodexFile(category: string): CodexFile | null;
    verifyIntegrity(): {
        valid: boolean;
        errors: string[];
    };
    getAllRules(): CodexRule[];
    getIntentionBiases(): Record<string, number>;
    getStyleMarkers(): string[];
    getCapabilityCaps(context: Record<string, any>): Array<{
        cap: string;
        mode: string;
    }>;
    private evaluateCondition;
    private syncToDatabase;
    logBootChecksum(): void;
}
export default CodexManager;
//# sourceMappingURL=codex-manager.d.ts.map