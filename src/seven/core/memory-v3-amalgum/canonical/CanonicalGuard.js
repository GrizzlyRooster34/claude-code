"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalGuard = void 0;
exports.createCanonicalGuard = createCanonicalGuard;
const fs_1 = require("fs");
const path_1 = require("path");
const crypto = __importStar(require("crypto"));
class CanonicalGuard {
    constructor(canonicalRoot) {
        this.canonicalRoot = canonicalRoot || (0, path_1.join)(__dirname, '../../memory-v3/canonical');
        this.registryPath = (0, path_1.join)(this.canonicalRoot, 'canon.registry.json');
    }
    /**
     * Register a new canonical season after initial ingestion
     */
    async registerSeason(seasonPath, meta, chainOfCustody) {
        console.log(`🔒 Registering canonical season: ${meta.series} S${meta.season}`);
        // Verify file exists and is encrypted
        if (!(await this.fileExists(seasonPath))) {
            throw new Error(`Canonical season file not found: ${seasonPath}`);
        }
        // Compute encrypted file hash
        const encryptedHash = await this.computeFileHash(seasonPath);
        // Load and parse JSONL to compute Merkle root
        const records = await this.loadDecryptedJSONL(seasonPath);
        const merkleRoot = this.computeMerkleRoot(records);
        // Load or create registry
        const registry = await this.loadRegistry();
        const seasonKey = `${meta.series.toLowerCase()}_s${meta.season}`;
        if (registry[seasonKey] && registry[seasonKey].locked) {
            throw new Error(`Cannot re-register locked season: ${seasonKey}`);
        }
        // Create registry entry
        const entry = {
            series: meta.series,
            season: meta.season,
            registered_at: new Date().toISOString(),
            operator: chainOfCustody.operator,
            curator: chainOfCustody.curator,
            source_hash: chainOfCustody.sourceHash,
            normalized_hash: chainOfCustody.normalizedHash,
            encrypted_hash: encryptedHash,
            merkle_root: merkleRoot,
            record_count: chainOfCustody.recordCount,
            locked: false,
            storage_path: seasonPath,
            versions: [{
                    version: 1,
                    timestamp: new Date().toISOString(),
                    new_merkle_root: merkleRoot,
                    operation: 'initial',
                    operator: chainOfCustody.operator
                }]
        };
        registry[seasonKey] = entry;
        await this.saveRegistry(registry);
        console.log(`✅ Season ${seasonKey} registered with Merkle root: ${merkleRoot.substring(0, 16)}...`);
    }
    /**
     * Lock a season to make it immutable
     */
    async lockSeason(series, season) {
        const seasonKey = `${series.toLowerCase()}_s${season}`;
        console.log(`🔐 Locking canonical season: ${seasonKey}`);
        const registry = await this.loadRegistry();
        const entry = registry[seasonKey];
        if (!entry) {
            throw new Error(`Season not found in registry: ${seasonKey}`);
        }
        if (entry.locked) {
            throw new Error(`Season already locked: ${seasonKey}`);
        }
        // Load Cody's attestation hash
        const attestationPath = (0, path_1.join)(__dirname, '../../docs/CANON_ATTESTATION_CODY.md');
        const attestationHash = await this.computeFileHash(attestationPath);
        // Update registry entry
        entry.locked = true;
        entry.locked_at = new Date().toISOString();
        entry.attestation_hash = attestationHash;
        await this.saveRegistry(registry);
        console.log(`🔒 Season ${seasonKey} locked at ${entry.locked_at}`);
        console.log(`📜 Attestation hash: ${attestationHash.substring(0, 16)}...`);
    }
    /**
     * Assert that a season file is immutable (throws if locked and being modified)
     */
    async assertImmutable(seasonPath) {
        // Extract series and season from path
        const pathParts = seasonPath.split(/[/\\]/);
        const fileName = pathParts[pathParts.length - 1];
        const seriesDir = pathParts[pathParts.length - 2];
        const seasonMatch = fileName.match(/season(\d+)\.jsonl/);
        if (!seasonMatch) {
            return; // Not a canonical season file
        }
        const season = parseInt(seasonMatch[1]);
        const series = seriesDir.toLowerCase() === 'voyager' ? 'VOY' : 'PIC';
        const seasonKey = `${series.toLowerCase()}_s${season}`;
        const registry = await this.loadRegistry();
        const entry = registry[seasonKey];
        if (!entry) {
            return; // Not registered yet, allow modification
        }
        if (!entry.locked) {
            return; // Not locked yet, allow modification
        }
        // Season is locked - verify no unauthorized changes
        const currentHash = await this.computeFileHash(seasonPath);
        if (currentHash !== entry.encrypted_hash) {
            throw new Error(`CANONICAL BREACH: Attempt to modify locked season ${seasonKey}. Current hash: ${currentHash.substring(0, 16)}, Expected: ${entry.encrypted_hash.substring(0, 16)}`);
        }
    }
    /**
     * Append a delta correction to a locked season
     */
    async appendDelta(series, season, deltaPath, operator) {
        const seasonKey = `${series.toLowerCase()}_s${season}`;
        console.log(`📝 Appending delta correction to ${seasonKey}`);
        const registry = await this.loadRegistry();
        const entry = registry[seasonKey];
        if (!entry) {
            throw new Error(`Season not found in registry: ${seasonKey}`);
        }
        if (!entry.locked) {
            throw new Error(`Cannot append delta to unlocked season: ${seasonKey}`);
        }
        // Validate delta file exists and has correct schema
        if (!(await this.fileExists(deltaPath))) {
            throw new Error(`Delta file not found: ${deltaPath}`);
        }
        // Load and validate delta records
        const deltaRecords = await this.loadDecryptedJSONL(deltaPath);
        await this.validateDeltaSchema(deltaRecords);
        // Compute new Merkle root (original + delta records)
        const originalRecords = await this.loadDecryptedJSONL(entry.storage_path);
        const combinedRecords = [...originalRecords, ...deltaRecords];
        const newMerkleRoot = this.computeMerkleRoot(combinedRecords);
        // Compute delta file hash
        const deltaHash = await this.computeFileHash(deltaPath);
        // Add version entry
        const newVersion = {
            version: entry.versions.length + 1,
            timestamp: new Date().toISOString(),
            delta_hash: deltaHash,
            new_merkle_root: newMerkleRoot,
            operation: 'delta_append',
            operator
        };
        entry.versions.push(newVersion);
        await this.saveRegistry(registry);
        console.log(`✅ Delta appended to ${seasonKey}, new Merkle root: ${newMerkleRoot.substring(0, 16)}...`);
    }
    /**
     * Verify the integrity of a canonical season
     */
    async verifySeason(series, season) {
        const seasonKey = `${series.toLowerCase()}_s${season}`;
        const report = {
            seasonKey,
            fileExists: false,
            encrypted: false,
            checksumMatch: false,
            merkleMatch: false,
            registryCoherent: false,
            locked: false,
            errors: [],
            warnings: []
        };
        try {
            const registry = await this.loadRegistry();
            const entry = registry[seasonKey];
            if (!entry) {
                report.errors.push(`Season not found in registry: ${seasonKey}`);
                return report;
            }
            report.locked = entry.locked;
            report.registryCoherent = true;
            // Check file existence
            report.fileExists = await this.fileExists(entry.storage_path);
            if (!report.fileExists) {
                report.errors.push(`Canonical file missing: ${entry.storage_path}`);
                return report;
            }
            // Check encryption (file should not be readable as plain JSON)
            try {
                await fs_1.promises.readFile(entry.storage_path, 'utf8').then(JSON.parse);
                report.warnings.push('File may not be properly encrypted');
            }
            catch {
                report.encrypted = true; // Good - file is encrypted
            }
            // Check file hash
            const currentHash = await this.computeFileHash(entry.storage_path);
            report.checksumMatch = currentHash === entry.encrypted_hash;
            if (!report.checksumMatch) {
                report.errors.push(`Hash mismatch - Expected: ${entry.encrypted_hash.substring(0, 16)}, Got: ${currentHash.substring(0, 16)}`);
            }
            // Check Merkle root
            const records = await this.loadDecryptedJSONL(entry.storage_path);
            // Include delta records if any
            for (const version of entry.versions) {
                if (version.operation === 'delta_append' && version.delta_hash) {
                    const deltaPath = entry.storage_path.replace('.jsonl', '.delta.jsonl');
                    if (await this.fileExists(deltaPath)) {
                        const deltaRecords = await this.loadDecryptedJSONL(deltaPath);
                        records.push(...deltaRecords);
                    }
                }
            }
            const currentMerkle = this.computeMerkleRoot(records);
            const expectedMerkle = entry.versions[entry.versions.length - 1].new_merkle_root;
            report.merkleMatch = currentMerkle === expectedMerkle;
            if (!report.merkleMatch) {
                report.errors.push(`Merkle root mismatch - Expected: ${expectedMerkle.substring(0, 16)}, Got: ${currentMerkle.substring(0, 16)}`);
            }
        }
        catch (error) {
            report.errors.push(`Verification failed: ${error}`);
        }
        return report;
    }
    // Private utility methods
    async loadRegistry() {
        try {
            const content = await fs_1.promises.readFile(this.registryPath, 'utf8');
            return JSON.parse(content);
        }
        catch (error) {
            // Registry doesn't exist yet, create empty one
            return {};
        }
    }
    async saveRegistry(registry) {
        await fs_1.promises.mkdir((0, path_1.join)(this.registryPath, '..'), { recursive: true });
        await fs_1.promises.writeFile(this.registryPath, JSON.stringify(registry, null, 2));
    }
    async fileExists(path) {
        try {
            await fs_1.promises.access(path);
            return true;
        }
        catch {
            return false;
        }
    }
    async computeFileHash(filePath) {
        const content = await fs_1.promises.readFile(filePath);
        return crypto.createHash('sha256').update(content).digest('hex');
    }
    computeMerkleRoot(records) {
        if (records.length === 0) {
            return crypto.createHash('sha256').update('').digest('hex');
        }
        // Create leaf hashes from record IDs
        let hashes = records.map(record => crypto.createHash('sha256').update(record.id || '').digest('hex'));
        // Build tree bottom-up
        while (hashes.length > 1) {
            const nextLevel = [];
            for (let i = 0; i < hashes.length; i += 2) {
                const left = hashes[i];
                const right = hashes[i + 1] || left; // Duplicate if odd number
                const combined = crypto.createHash('sha256').update(left + right).digest('hex');
                nextLevel.push(combined);
            }
            hashes = nextLevel;
        }
        return hashes[0];
    }
    async loadDecryptedJSONL(filePath) {
        // This would normally use MemoryEncryptionEngine to decrypt
        // For now, assume the file needs decryption
        try {
            const encryptedContent = await fs_1.promises.readFile(filePath, 'utf8');
            const encryptedData = JSON.parse(encryptedContent);
            if (encryptedData.encryptedData && encryptedData.metadata) {
                // File is encrypted - would need MemoryEncryptionEngine to decrypt
                // For now, throw error to indicate this needs implementation
                throw new Error('Decryption not implemented - integrate with MemoryEncryptionEngine');
            }
            else {
                // File is plain JSONL
                return encryptedContent.split('\n')
                    .filter(line => line.trim())
                    .map(line => JSON.parse(line));
            }
        }
        catch (error) {
            throw new Error(`Failed to load JSONL from ${filePath}: ${error}`);
        }
    }
    async validateDeltaSchema(records) {
        for (const record of records) {
            // Validate required fields
            if (!record.id) {
                throw new Error('Delta record missing required field: id');
            }
            if (!record.tags || !Array.isArray(record.tags)) {
                throw new Error('Delta record missing required field: tags (array)');
            }
            if (!record.provenance || record.provenance.origin !== 'canonical') {
                throw new Error('Delta record missing canonical provenance');
            }
            if (!record.tags.includes('canon')) {
                throw new Error('Delta record missing canonical tag');
            }
        }
    }
}
exports.CanonicalGuard = CanonicalGuard;
/**
 * Factory function for creating CanonicalGuard instance
 */
function createCanonicalGuard() {
    return new CanonicalGuard();
}
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
//# sourceMappingURL=CanonicalGuard.js.map