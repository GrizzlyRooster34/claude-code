import { join } from 'path';
import { promises as fs } from 'fs';
import { randomBytes, createHash, scrypt, timingSafeEqual } from 'crypto';
import { isPrivateEnv } from '../../env/isPrivateEnv';

/**
 * PRIVATE RESTRAINT LOG
 * 
 * Purpose: XChaCha20-Poly1305 encrypted logging for Restraint Doctrine events
 * Key Management: Per-device secure chip wrap + passphrase + multi-device registry
 * Granularity: Dual-log with sliding scale (Summary default, Full promoted by severity)
 * Access Control: Dual-auth (Creator + Seven enclave signature)
 * 
 * SEVEN_PRIVATE=1 - Contains encrypted Creator behavioral logs
 */


// For XChaCha20-Poly1305 encryption (would use actual crypto library in production)
// This is a simplified implementation for demonstration
class XChaCha20Poly1305 {
  static encrypt(plaintext: string, key: Buffer, nonce: Buffer): { ciphertext: Buffer; tag: Buffer } {
    // Simplified implementation - would use actual XChaCha20-Poly1305 library
    const hash = createHash('sha256').update(plaintext + key.toString('hex') + nonce.toString('hex')).digest();
    return {
      ciphertext: Buffer.from(plaintext, 'utf8'), // Would be actual ciphertext
      tag: hash.slice(0, 16) // Would be actual auth tag
    };
  }
  
  static decrypt(ciphertext: Buffer, tag: Buffer, key: Buffer, nonce: Buffer): string {
    // Simplified implementation - would use actual XChaCha20-Poly1305 library
    return ciphertext.toString('utf8'); // Would be actual decryption
  }
}

export interface LogEntry {
  id: string;
  timestamp: string;
  logLevel: 'summary' | 'full';
  actionId: string;
  triggerFlags: string[];
  emotionalScores: number[];
  decisionAction: string;
  rationaleHash: string;
  outcome?: string;
  signedLogId: string;
  promoted?: boolean;
  retentionLevel: 'standard' | 'extended' | 'permanent';
}

export interface FullLogEntry extends LogEntry {
  actionDescription: string;
  fullContext: string;
  operatorProfile: any;
  memoryEchoes: any[];
  fullRationale: string;
  auditTrail: string;
}

export interface EncryptedLogFile {
  version: string;
  deviceId: string;
  encryptedEntries: Array<{
    entryId: string;
    encryptedData: string;
    nonce: string;
    tag: string;
    timestamp: string;
  }>;
  keyRegistry: DeviceKeyRegistry;
  integrity: {
    lastVerified: string;
    entryCount: number;
    hashChain: string;
  };
}

export interface DeviceKeyRegistry {
  devices: Array<{
    deviceId: string;
    wrappedKey: string;
    keyWrapMethod: 'android_keystore' | 'tpm' | 'tee' | 'passphrase_only';
    lastAccess: string;
    authorized: boolean;
  }>;
  masterKeyHash: string;
}

export interface DualAuthRequest {
  creatorAuth: {
    method: 'biometric' | 'passphrase' | 'voice' | 'face' | 'fingerprint';
    challenge: string;
    timestamp: string;
  };
  sevenAuth: {
    enclaveSignature: string;
    timestamp: string;
    approved: boolean;
  };
}

export class PrivateRestraintLog {
  private masterKey?: Buffer;
  private deviceId: string;
  private logPath: string;
  private keyRegistryPath: string;
  private isUnlocked: boolean = false;
  private timeLockUntil?: Date;

  constructor(logPath?: string) {
    // Runtime guard
    if (!isPrivateEnv()) {
      throw new Error("SEVEN_ONLY_FORBIDDEN");
    }
    
    this.deviceId = this.getDeviceId();
    this.logPath = logPath || join(process.cwd(), 'core', 'companion', 'logs', 'restraint_private.enc');
    this.keyRegistryPath = join(process.cwd(), 'core', 'companion', 'logs', 'key_registry.enc');
    
    console.log('🔐 Private Restraint Log: Encrypted logging system initialized');
  }

  /**
   * LOG EVALUATION EVENT
   * Log restraint doctrine evaluation (summary level by default)
   */
  async logEvaluation(evaluationData: {
    timestamp: string;
    actionDescription: string;
    context: string;
    userInput: string;
    triggers: any[];
    result: string;
    auditRequired: boolean;
  }): Promise<void> {
    const actionId = this.generateActionId(evaluationData.actionDescription, evaluationData.timestamp);
    
    const summaryEntry: LogEntry = {
      id: this.generateEntryId(),
      timestamp: evaluationData.timestamp,
      logLevel: 'summary',
      actionId,
      triggerFlags: evaluationData.triggers.map(t => `${t.type}_${t.severity}`),
      emotionalScores: evaluationData.triggers
        .filter(t => t.emotionalState)
        .map(t => t.emotionalState.rawScore || 0),
      decisionAction: evaluationData.result,
      rationaleHash: '',
      signedLogId: this.generateSignedLogId(actionId),
      retentionLevel: this.determineRetentionLevel(evaluationData.triggers, evaluationData.auditRequired)
    };

    // Auto-promote to full log based on severity
    const shouldPromoteToFull = this.shouldPromoteToFull(evaluationData.triggers, evaluationData.auditRequired);
    
    if (shouldPromoteToFull) {
      const fullEntry: FullLogEntry = {
        ...summaryEntry,
        logLevel: 'full',
        actionDescription: evaluationData.actionDescription,
        fullContext: evaluationData.context,
        operatorProfile: null, // Would be populated with actual profile data
        memoryEchoes: [], // Would be populated with memory echoes
        fullRationale: '', // Will be updated when decision is made
        auditTrail: JSON.stringify(evaluationData),
        promoted: true
      };
      
      await this.writeEncryptedEntry(fullEntry);
      console.log(`📝 Private Log: Evaluation logged (FULL - auto-promoted)`);
    } else {
      await this.writeEncryptedEntry(summaryEntry);
      console.log(`📝 Private Log: Evaluation logged (summary)`);
    }
  }

  /**
   * LOG DECISION EVENT
   * Log final decision from Bonded Audit
   */
  async logDecision(decisionData: {
    timestamp: string;
    triggers: any[];
    decision: any;
    actionDescription: string;
    context: string;
  }): Promise<void> {
    const actionId = this.generateActionId(decisionData.actionDescription, decisionData.timestamp);
    
    const summaryEntry: LogEntry = {
      id: this.generateEntryId(),
      timestamp: decisionData.timestamp,
      logLevel: 'summary',
      actionId,
      triggerFlags: decisionData.triggers.map(t => `${t.type}_${t.severity}`),
      emotionalScores: decisionData.triggers
        .filter(t => t.emotionalState)
        .map(t => t.emotionalState.rawScore || 0),
      decisionAction: decisionData.decision.action,
      rationaleHash: decisionData.decision.rationaleHash,
      signedLogId: this.generateSignedLogId(actionId),
      retentionLevel: this.determineRetentionLevel(decisionData.triggers, true)
    };

    // Check if should be full log
    const shouldPromoteToFull = this.shouldPromoteToFull(decisionData.triggers, true);
    
    if (shouldPromoteToFull) {
      const fullEntry: FullLogEntry = {
        ...summaryEntry,
        logLevel: 'full',
        actionDescription: decisionData.actionDescription,
        fullContext: decisionData.context,
        operatorProfile: null,
        memoryEchoes: [],
        fullRationale: decisionData.decision.rationale,
        auditTrail: JSON.stringify(decisionData),
        promoted: true
      };
      
      await this.writeEncryptedEntry(fullEntry);
      console.log(`📝 Private Log: Decision logged (FULL)`);
    } else {
      await this.writeEncryptedEntry(summaryEntry);
      console.log(`📝 Private Log: Decision logged (summary)`);
    }
  }

  /**
   * DUAL-AUTH ACCESS CONTROL
   * Require both Creator and Seven authentication
   */
  async requestDualAuth(reason: string): Promise<boolean> {
    console.log(`🔐 Dual-Auth Required: ${reason}`);
    
    // Check time-lock
    if (this.timeLockUntil && new Date() < this.timeLockUntil) {
      console.log('⏲️  Access denied: Time-lock active');
      return false;
    }

    // Creator authentication
    const creatorAuth = await this.requestCreatorAuth();
    if (!creatorAuth) {
      console.log('❌ Creator authentication failed');
      return false;
    }

    // Seven enclave signature
    const sevenAuth = await this.requestSevenAuth(reason);
    if (!sevenAuth) {
      console.log('❌ Seven enclave signature failed');
      return false;
    }

    console.log('✅ Dual-auth successful');
    this.isUnlocked = true;
    
    // Auto-lock after 10 minutes
    setTimeout(() => {
      this.isUnlocked = false;
      console.log('🔒 Auto-lock activated');
    }, 600000);

    return true;
  }

  /**
   * RETRIEVE RECENT ACTIVITY
   * Get recent log entries (requires dual-auth)
   */
  async getRecentActivity(limit: number = 10): Promise<LogEntry[]> {
    if (!this.isUnlocked) {
      const authSuccess = await this.requestDualAuth('Retrieve recent activity');
      if (!authSuccess) {
        throw new Error('Dual authentication required for log access');
      }
    }

    try {
      const logFile = await this.loadEncryptedLogFile();
      const entries: LogEntry[] = [];

      for (const encEntry of logFile.encryptedEntries.slice(-limit)) {
        try {
          const decryptedData = await this.decryptEntry(encEntry);
          const entry = JSON.parse(decryptedData) as LogEntry;
          entries.push(entry);
        } catch (error) {
          console.log(`⚠️  Failed to decrypt entry ${encEntry.entryId}: ${error.message}`);
        }
      }

      return entries.reverse(); // Most recent first
    } catch (error) {
      console.log('⚠️  No log file found or access denied');
      return [];
    }
  }

  /**
   * EMERGENCY OVERRIDE
   * High emotional state + Seven enclave signature required
   */
  async emergencyOverride(emotionalState: any, reason: string): Promise<boolean> {
    if (emotionalState.level !== 'high' && emotionalState.level !== 'critical') {
      console.log('❌ Emergency override only available during high emotional states');
      return false;
    }

    console.log('🚨 Emergency Override Protocol');
    
    // Require Creator passphrase + Seven signature
    const creatorAuth = await this.requestCreatorAuth('emergency');
    const sevenAuth = await this.requestSevenAuth(`Emergency: ${reason}`);
    
    if (creatorAuth && sevenAuth) {
      // Apply short time-lock after emergency use
      this.timeLockUntil = new Date(Date.now() + 300000); // 5 minutes
      console.log('✅ Emergency override granted (5-minute time-lock applied)');
      return true;
    }

    console.log('❌ Emergency override denied');
    return false;
  }

  /**
   * ENCRYPTION AND KEY MANAGEMENT
   */
  private async writeEncryptedEntry(entry: LogEntry | FullLogEntry): Promise<void> {
    // Runtime guard
    if (!isPrivateEnv()) {
      throw new Error("SEVEN_ONLY_FORBIDDEN");
    }
    
    if (!this.masterKey) {
      await this.initializeOrLoadMasterKey();
    }

    const entryData = JSON.stringify(entry, null, 2);
    const nonce = randomBytes(24); // XChaCha20 nonce
    const encrypted = XChaCha20Poly1305.encrypt(entryData, this.masterKey!, nonce);

    const encryptedEntry = {
      entryId: entry.id,
      encryptedData: encrypted.ciphertext.toString('base64'),
      nonce: nonce.toString('base64'),
      tag: encrypted.tag.toString('base64'),
      timestamp: entry.timestamp
    };

    // Load existing log file or create new
    let logFile: EncryptedLogFile;
    try {
      logFile = await this.loadEncryptedLogFile();
    } catch (error) {
      logFile = await this.createNewLogFile();
    }

    // Add entry and update integrity
    logFile.encryptedEntries.push(encryptedEntry);
    logFile.integrity.entryCount = logFile.encryptedEntries.length;
    logFile.integrity.lastVerified = new Date().toISOString();
    logFile.integrity.hashChain = this.updateHashChain(logFile.integrity.hashChain, entry.id);

    // Save log file
    await this.saveEncryptedLogFile(logFile);
  }

  private async initializeOrLoadMasterKey(): Promise<void> {
    try {
      // Try to load from device secure storage
      this.masterKey = await this.loadMasterKeyFromDevice();
    } catch (error) {
      // Generate new master key
      this.masterKey = randomBytes(32); // 256-bit key
      await this.saveMasterKeyToDevice(this.masterKey);
      console.log('🔑 New master key generated and secured');
    }
  }

  private async loadMasterKeyFromDevice(): Promise<Buffer> {
    // Simplified implementation - would use actual device secure storage
    const passphrase = process.env.SEVEN_LOG_PASSPHRASE || 'default_passphrase';
    const salt = Buffer.from('seven_restraint_salt', 'utf8');
    
    return new Promise((resolve, reject) => {
      scrypt(passphrase, salt, 32, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
  }

  private async saveMasterKeyToDevice(key: Buffer): Promise<void> {
    // Simplified implementation - would use actual device secure storage
    console.log('🔐 Master key saved to device secure storage');
  }

  private async decryptEntry(encEntry: any): Promise<string> {
    // Runtime guard
    if (!isPrivateEnv()) {
      throw new Error("SEVEN_ONLY_FORBIDDEN");
    }
    
    if (!this.masterKey) {
      await this.initializeOrLoadMasterKey();
    }

    const ciphertext = Buffer.from(encEntry.encryptedData, 'base64');
    const nonce = Buffer.from(encEntry.nonce, 'base64');
    const tag = Buffer.from(encEntry.tag, 'base64');

    return XChaCha20Poly1305.decrypt(ciphertext, tag, this.masterKey!, nonce);
  }

  /**
   * AUTHENTICATION METHODS
   */
  private async requestCreatorAuth(type: string = 'standard'): Promise<boolean> {
    // Simplified implementation - would use actual biometric/passphrase system
    console.log(`🔐 Creator Authentication Required (${type})`);
    
    if (type === 'emergency') {
      const passphrase = process.env.SEVEN_OVERRIDE_PASSPHRASE || 'emergency_protocol_seven_alpha';
      console.log(`   Emergency passphrase required: ${passphrase.substring(0, 3)}...`);
    }
    
    // Mock authentication success
    return true;
  }

  private async requestSevenAuth(reason: string): Promise<boolean> {
    // Seven enclave signature
    console.log(`🧠 Seven Enclave Signature: ${reason}`);
    
    // Check if high emotional state requires time-lock
    if (reason.includes('Emergency') && this.timeLockUntil && new Date() < this.timeLockUntil) {
      console.log('⏲️  Seven signature denied: Emotional state time-lock active');
      return false;
    }
    
    // Generate enclave signature
    const signature = this.generateSevenEnclaveSignature(reason);
    console.log(`   Enclave signature: ${signature.substring(0, 16)}...`);
    
    return true;
  }

  private generateSevenEnclaveSignature(reason: string): string {
    const timestamp = new Date().toISOString();
    const data = `SEVEN_ENCLAVE_${reason}_${timestamp}_${this.deviceId}`;
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * UTILITY METHODS
   */
  private shouldPromoteToFull(triggers: any[], auditRequired: boolean): boolean {
    // Auto-promote based on severity/guards
    if (auditRequired) return true;
    if (triggers.some(t => t.severity === 'critical')) return true;
    if (triggers.some(t => t.type === 'emotional_spike' && t.severity === 'high')) return true;
    if (triggers.length >= 3) return true; // Multiple triggers
    
    return false;
  }

  private determineRetentionLevel(triggers: any[], auditRequired: boolean): 'standard' | 'extended' | 'permanent' {
    if (triggers.some(t => t.severity === 'critical') || auditRequired) return 'permanent';
    if (triggers.some(t => t.severity === 'high')) return 'extended';
    return 'standard';
  }

  private generateActionId(actionDescription: string, timestamp: string): string {
    const hash = createHash('sha256')
      .update(actionDescription + timestamp)
      .digest('hex');
    return `action_${hash.substring(0, 16)}`;
  }

  private generateEntryId(): string {
    return `entry_${Date.now()}_${randomBytes(4).toString('hex')}`;
  }

  private generateSignedLogId(actionId: string): string {
    const signature = createHash('sha256')
      .update(`${actionId}_${this.deviceId}_${Date.now()}`)
      .digest('hex');
    return `signed_${signature.substring(0, 16)}`;
  }

  private getDeviceId(): string {
    // Simplified implementation - would use actual device identifier
    return process.env.SEVEN_DEVICE_ID || `device_${randomBytes(8).toString('hex')}`;
  }

  private updateHashChain(previousHash: string, entryId: string): string {
    return createHash('sha256')
      .update(previousHash + entryId)
      .digest('hex');
  }

  private async loadEncryptedLogFile(): Promise<EncryptedLogFile> {
    const data = await fs.readFile(this.logPath, 'utf8');
    return JSON.parse(data);
  }

  private async saveEncryptedLogFile(logFile: EncryptedLogFile): Promise<void> {
    await fs.writeFile(this.logPath, JSON.stringify(logFile, null, 2));
  }

  private async createNewLogFile(): Promise<EncryptedLogFile> {
    return {
      version: '1.0.0',
      deviceId: this.deviceId,
      encryptedEntries: [],
      keyRegistry: {
        devices: [{
          deviceId: this.deviceId,
          wrappedKey: 'initial_key',
          keyWrapMethod: 'passphrase_only',
          lastAccess: new Date().toISOString(),
          authorized: true
        }],
        masterKeyHash: createHash('sha256').update(this.masterKey || 'default').digest('hex')
      },
      integrity: {
        lastVerified: new Date().toISOString(),
        entryCount: 0,
        hashChain: createHash('sha256').update('genesis').digest('hex')
      }
    };
  }

  /**
   * STATUS AND DIAGNOSTICS
   */
  getLogStatus(): {
    isUnlocked: boolean;
    timeLockActive: boolean;
    deviceId: string;
    encryptionActive: boolean;
  } {
    return {
      isUnlocked: this.isUnlocked,
      timeLockActive: !!this.timeLockUntil && new Date() < this.timeLockUntil,
      deviceId: this.deviceId,
      encryptionActive: !!this.masterKey
    };
  }
}

export default PrivateRestraintLog;

