/**
 * SEVEN OF NINE - CANONICAL MEMORY GUARD
 *
 * Cryptographic enforcement system for canonical memory immutability
 * Prevents unauthorized modifications to locked canonical seasons
 * Maintains chain of custody through registry and Merkle tree verification
 *
 * DOCTRINE ENFORCEMENT:
 * "Canonical memories are sacrosanct. They are write-once, append-only,
 *  and never altered post-ingestion. Any deviation is a system breach."
 */
export interface CanonicalRegistry {
    [key: string]: RegistryEntry;
}
export interface RegistryEntry {
    series: 'VOY' | 'PIC';
    season: number;
    registered_at: string;
    operator: string;
    curator: string;
    source_hash: string;
    normalized_hash: string;
    encrypted_hash: string;
    merkle_root: string;
    record_count: number;
    locked: boolean;
    locked_at?: string;
    attestation_hash?: string;
    storage_path: string;
    versions: RegistryVersion[];
}
export interface RegistryVersion {
    version: number;
    timestamp: string;
    delta_hash?: string;
    new_merkle_root: string;
    operation: 'initial' | 'delta_append';
    operator: string;
}
export interface VerificationReport {
    seasonKey: string;
    fileExists: boolean;
    encrypted: boolean;
    checksumMatch: boolean;
    merkleMatch: boolean;
    registryCoherent: boolean;
    locked: boolean;
    errors: string[];
    warnings: string[];
}
export declare class CanonicalGuard {
    private registryPath;
    private canonicalRoot;
    constructor(canonicalRoot?: string);
    /**
     * Register a new canonical season after initial ingestion
     */
    registerSeason(seasonPath: string, meta: {
        series: 'VOY' | 'PIC';
        season: number;
    }, chainOfCustody: {
        operator: string;
        curator: string;
        sourceHash: string;
        normalizedHash: string;
        recordCount: number;
    }): Promise<void>;
    /**
     * Lock a season to make it immutable
     */
    lockSeason(series: 'VOY' | 'PIC', season: number): Promise<void>;
    /**
     * Assert that a season file is immutable (throws if locked and being modified)
     */
    assertImmutable(seasonPath: string): Promise<void>;
    /**
     * Append a delta correction to a locked season
     */
    appendDelta(series: 'VOY' | 'PIC', season: number, deltaPath: string, operator: string): Promise<void>;
    /**
     * Verify the integrity of a canonical season
     */
    verifySeason(series: 'VOY' | 'PIC', season: number): Promise<VerificationReport>;
    private loadRegistry;
    private saveRegistry;
    private fileExists;
    private computeFileHash;
    private computeMerkleRoot;
    private loadDecryptedJSONL;
    private validateDeltaSchema;
}
/**
 * Factory function for creating CanonicalGuard instance
 */
export declare function createCanonicalGuard(): CanonicalGuard;
/**
 * INTEGRATION NOTES:
 *
 * 1. CanonicalIngestion Integration:
 *    - Call guard.assertImmutable() before any write operations
 *    - Call guard.registerSeason() after successful initial ingestion
 *    - Require explicit --lock step via scripts/canon/lock-season.ts
 *
 * 2. CI/CD Integration:
 *    - Run guard.verifySeason() on any canonical file changes
 *    - Block commits if verification fails
 *    - Require clean verification for deployment
 *
 * 3. Delta Corrections:
 *    - Use guard.appendDelta() for post-lock corrections
 *    - Maintains original file integrity while allowing fixes
 *    - Full chain of custody preserved in registry versions
 *
 * 4. Emergency Recovery:
 *    - Registry contains all hashes needed to detect corruption
 *    - Merkle trees provide efficient integrity verification
 *    - Chain of custody enables forensic analysis
 */ 
//# sourceMappingURL=CanonicalGuard.d.ts.map