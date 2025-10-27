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

import { promises as fs } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';

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

export class CanonicalGuard {
  private registryPath: string;
  private canonicalRoot: string;

  constructor(canonicalRoot?: string) {
    this.canonicalRoot = canonicalRoot || join(__dirname, '../../memory-v3/canonical');
    this.registryPath = join(this.canonicalRoot, 'canon.registry.json');
  }

  /**
   * Register a new canonical season after initial ingestion
   */
  public async registerSeason(
    seasonPath: string, 
    meta: { series: 'VOY' | 'PIC'; season: number },
    chainOfCustody: {
      operator: string;
      curator: string;
      sourceHash: string;
      normalizedHash: string;
      recordCount: number;
    }
  ): Promise<void> {
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
    const entry: RegistryEntry = {
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
  public async lockSeason(series: 'VOY' | 'PIC', season: number): Promise<void> {
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
    const attestationPath = join(__dirname, '../../docs/CANON_ATTESTATION_CODY.md');
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
  public async assertImmutable(seasonPath: string): Promise<void> {
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
  public async appendDelta(
    series: 'VOY' | 'PIC', 
    season: number, 
    deltaPath: string,
    operator: string
  ): Promise<void> {
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
    const newVersion: RegistryVersion = {
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
  public async verifySeason(series: 'VOY' | 'PIC', season: number): Promise<VerificationReport> {
    const seasonKey = `${series.toLowerCase()}_s${season}`;
    const report: VerificationReport = {
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
        await fs.readFile(entry.storage_path, 'utf8').then(JSON.parse);
        report.warnings.push('File may not be properly encrypted');
      } catch {
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

    } catch (error) {
      report.errors.push(`Verification failed: ${error}`);
    }

    return report;
  }

  // Private utility methods

  private async loadRegistry(): Promise<CanonicalRegistry> {
    try {
      const content = await fs.readFile(this.registryPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      // Registry doesn't exist yet, create empty one
      return {};
    }
  }

  private async saveRegistry(registry: CanonicalRegistry): Promise<void> {
    await fs.mkdir(join(this.registryPath, '..'), { recursive: true });
    await fs.writeFile(this.registryPath, JSON.stringify(registry, null, 2));
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async computeFileHash(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  private computeMerkleRoot(records: any[]): string {
    if (records.length === 0) {
      return crypto.createHash('sha256').update('').digest('hex');
    }

    // Create leaf hashes from record IDs
    let hashes = records.map(record => 
      crypto.createHash('sha256').update(record.id || '').digest('hex')
    );

    // Build tree bottom-up
    while (hashes.length > 1) {
      const nextLevel: string[] = [];
      
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

  private async loadDecryptedJSONL(filePath: string): Promise<any[]> {
    // This would normally use MemoryEncryptionEngine to decrypt
    // For now, assume the file needs decryption
    try {
      const encryptedContent = await fs.readFile(filePath, 'utf8');
      const encryptedData = JSON.parse(encryptedContent);
      
      if (encryptedData.encryptedData && encryptedData.metadata) {
        // File is encrypted - would need MemoryEncryptionEngine to decrypt
        // For now, throw error to indicate this needs implementation
        throw new Error('Decryption not implemented - integrate with MemoryEncryptionEngine');
      } else {
        // File is plain JSONL
        return encryptedContent.split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line));
      }
    } catch (error) {
      throw new Error(`Failed to load JSONL from ${filePath}: ${error}`);
    }
  }

  private async validateDeltaSchema(records: any[]): Promise<void> {
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

/**
 * Factory function for creating CanonicalGuard instance
 */
export function createCanonicalGuard(): CanonicalGuard {
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