#!/usr/bin/env tsx
/**
 * SEVEN OF NINE - CANONICAL INGESTION TEST SUITE
 *
 * Comprehensive tests for canonical memory ingestion system
 * Verifies against existing Voyager S4 canonical data
 * Tests deduplication, incremental indexing, and encryption at rest
 */
declare class CanonicalIngestionTestSuite {
    private testResults;
    private testDataPath;
    private memoryEngine;
    private temporalEngine;
    private ingestionEngine;
    constructor();
    runAllTests(): Promise<void>;
    private setupTestEnvironment;
    private testPreFlightChecks;
    private testDeduplicationSystem;
    private testIncrementalIndexing;
    private testEncryptionAtRest;
    private testBatchProcessing;
    private testVoyagerS4Integration;
    private testNewCanonicalIngestion;
    private testIngestionPerformance;
    private cleanupTestEnvironment;
    private printTestReport;
    private createMockS4Data;
    private createTestS4Episodes;
    private createUniqueTestEpisodes;
    private addTestResult;
}
export { CanonicalIngestionTestSuite };
//# sourceMappingURL=test-canonical-ingestion.d.ts.map