#!/usr/bin/env tsx
/**
 * SEVEN OF NINE - MEMORY INDEX OPTIMIZER TEST SUITE
 *
 * Comprehensive performance benchmarks and correctness tests
 * Generates realistic test data and validates <10ms query performance
 */
declare class MemoryIndexTestSuite {
    private testResults;
    private benchmarkResults;
    private testRecords;
    runAllTests(): Promise<void>;
    /**
     * Generate 2,500 synthetic memory records with realistic distributions
     */
    private generateTestData;
    /**
     * Test correctness of all index operations
     */
    private testCorrectness;
    private testIdLookupCorrectness;
    private testSingleTagCorrectness;
    private testMultiTagCorrectness;
    private testTimeRangeCorrectness;
    private testComplexQueryCorrectness;
    private testIndexStatsCorrectness;
    private testLRUCacheCorrectness;
    /**
     * Run performance benchmarks with 1000 iterations each
     */
    private runPerformanceBenchmarks;
    private benchmarkIdLookups;
    private benchmarkCachePerformance;
    private benchmarkSingleTagLookups;
    private benchmarkMultiTagLookups;
    private benchmarkTimeRangeLookups;
    private benchmarkComplexQueries;
    private benchmarkIndexBuilding;
    /**
     * Print comprehensive test results
     */
    private printResults;
    private calculateMedian;
    private calculatePercentile;
    private selectRandomTags;
    private weightedRandom;
    private gaussianRandom;
    private exponentialRandom;
}
export { MemoryIndexTestSuite };
//# sourceMappingURL=test-memory-index.d.ts.map