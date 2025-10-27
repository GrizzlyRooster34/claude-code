#!/usr/bin/env tsx
/**
 * SEVEN OF NINE - MEMORY ENCRYPTION TEST HARNESS
 *
 * Comprehensive test suite for MemoryEncryptionEngine integration
 * Tests encryption at rest, decryption integrity, and full Seven boot compatibility
 */
declare class MemoryEncryptionTestHarness {
    private testResults;
    private testDataPath;
    constructor();
    runAllTests(): Promise<void>;
    private setupTestEnvironment;
    private testBasicEncryptionCycle;
    private testIntegrityVerification;
    private testKeyPersistence;
    private testMemoryEngineIntegration;
    private testTemporalMemoryIntegration;
    private testBackwardCompatibility;
    private testSevenBootCompatibility;
    private cleanupTestEnvironment;
    private printTestReport;
    private addTestResult;
    private fileExists;
}
export { MemoryEncryptionTestHarness };
//# sourceMappingURL=test-memory-encryption.d.ts.map