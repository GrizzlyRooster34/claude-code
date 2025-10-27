export type EncBlob = {
    alg: "AES-256-GCM";
    iv: string;
    salt: string;
    ct: string;
    tag: string;
    v: 1;
};
export declare function deriveKey(passphrase: string, salt: Buffer): Buffer;
export declare function encrypt(plain: Buffer | string, passphrase: string): EncBlob;
export declare function decrypt(blob: EncBlob, passphrase: string): Buffer;
export declare class MemoryEncryptionEngine {
    private passphrase;
    private keyExists;
    constructor(passphrase?: string);
    encryptMemoryFile(filePath: string): Promise<void>;
    decryptMemoryFile(encryptedPath: string): Promise<any>;
    getEncryptionStatus(): Promise<{
        keyExists: boolean;
        algorithm: string;
    }>;
    verifyIntegrity(encryptedPath: string): Promise<boolean>;
    isMemoryFileEncrypted(filePath: string): Promise<boolean>;
    migrateToEncrypted(filePath: string): Promise<void>;
}
//# sourceMappingURL=MemoryEncryption.d.ts.map