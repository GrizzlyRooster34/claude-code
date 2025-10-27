import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from "crypto";

export type EncBlob = { alg:"AES-256-GCM"; iv:string; salt:string; ct:string; tag:string; v:1 };
const AAD = Buffer.from("seven-core:memory-v3");

export function deriveKey(passphrase: string, salt: Buffer): Buffer {
  return scryptSync(passphrase, salt, 32); // 256-bit
}

export function encrypt(plain: Buffer | string, passphrase: string): EncBlob {
  const iv = randomBytes(12);          // 96-bit IV for GCM
  const salt = randomBytes(16);
  const key = deriveKey(passphrase, salt);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const p = typeof plain === "string" ? Buffer.from(plain, "utf8") : plain;
  cipher.setAAD(AAD, { plaintextLength: p.length });
  const ct = Buffer.concat([cipher.update(p), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { alg:"AES-256-GCM", v:1,
    iv: iv.toString("base64"),
    salt: salt.toString("base64"),
    ct: ct.toString("base64"),
    tag: tag.toString("base64")
  };
}

export function decrypt(blob: EncBlob, passphrase: string): Buffer {
  const iv = Buffer.from(blob.iv, "base64");
  const salt = Buffer.from(blob.salt, "base64");
  const ct = Buffer.from(blob.ct, "base64");
  const tag = Buffer.from(blob.tag, "base64");
  const key = deriveKey(passphrase, salt);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAAD(AAD, { plaintextLength: ct.length });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]);
}

/**
 * MEMORY ENCRYPTION ENGINE
 * 
 * High-level interface for Seven's memory encryption system
 * Provides file-based encryption/decryption with passphrase management
 */

import { promises as fs } from 'fs';
import { join } from 'path';

export class MemoryEncryptionEngine {
  private passphrase: string;
  private keyExists: boolean = false;
  
  constructor(passphrase: string = 'seven-default-memory-key') {
    this.passphrase = passphrase;
    this.keyExists = true; // Simulated key existence
  }
  
  async encryptMemoryFile(filePath: string): Promise<void> {
    const data = await fs.readFile(filePath, 'utf8');
    const encrypted = encrypt(data, this.passphrase);
    const encryptedPath = `${filePath}.encrypted`;
    await fs.writeFile(encryptedPath, JSON.stringify(encrypted), 'utf8');
  }
  
  async decryptMemoryFile(encryptedPath: string): Promise<any> {
    const encryptedData = await fs.readFile(encryptedPath, 'utf8');
    const blob: EncBlob = JSON.parse(encryptedData);
    const decrypted = decrypt(blob, this.passphrase);
    return JSON.parse(decrypted.toString('utf8'));
  }
  
  async getEncryptionStatus(): Promise<{ keyExists: boolean; algorithm: string }> {
    return {
      keyExists: this.keyExists,
      algorithm: 'AES-256-GCM'
    };
  }
  
  async verifyIntegrity(encryptedPath: string): Promise<boolean> {
    try {
      await this.decryptMemoryFile(encryptedPath);
      return true;
    } catch {
      return false;
    }
  }
  
  async isMemoryFileEncrypted(filePath: string): Promise<boolean> {
    try {
      const encryptedPath = `${filePath}.encrypted`;
      await fs.access(encryptedPath);
      return true;
    } catch {
      return false;
    }
  }
  
  async migrateToEncrypted(filePath: string): Promise<void> {
    // Check if unencrypted file exists
    try {
      await fs.access(filePath);
      // Encrypt the existing file
      await this.encryptMemoryFile(filePath);
      console.log(`✅ Migrated ${filePath} to encrypted storage`);
    } catch {
      // File doesn't exist, nothing to migrate
      console.log(`ℹ️ No unencrypted file found at ${filePath} - skipping migration`);
    }
  }
}
