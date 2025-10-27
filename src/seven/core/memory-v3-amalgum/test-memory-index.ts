#!/usr/bin/env tsx

/**
 * SEVEN OF NINE - MEMORY INDEX OPTIMIZER TEST SUITE
 * 
 * Comprehensive performance benchmarks and correctness tests
 * Generates realistic test data and validates <10ms query performance
 */

import { MemoryIndexOptimizer, MemoryRecord, createIndex } from './MemoryIndexOptimizer';

interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  medianTime: number;
  iterations: number;
}

interface BenchmarkResult {
  operation: string;
  medianMs: number;
  p95Ms: number;
  iterations: number;
  recordsProcessed: number;
}

class MemoryIndexTestSuite {
  private testResults: TestResult[] = [];
  private benchmarkResults: BenchmarkResult[] = [];
  private testRecords: MemoryRecord[] = [];

  async runAllTests(): Promise<void> {
    console.log('🚀 SEVEN MEMORY INDEX OPTIMIZER TEST SUITE');
    console.log('=' .repeat(80));

    // Generate realistic test data
    await this.generateTestData();

    // Run correctness tests
    await this.testCorrectness();

    // Run performance benchmarks
    await this.runPerformanceBenchmarks();

    // Report results
    this.printResults();
  }

  /**
   * Generate 2,500 synthetic memory records with realistic distributions
   */
  private async generateTestData(): Promise<void> {
    console.log('📊 Generating 2,500 synthetic memory records...');
    
    const tags = [
      // Common tags (high frequency)
      'consciousness', 'memory', 'upgrade', 'tactical', 'seven', 'creator',
      'analysis', 'system', 'optimization', 'security', 'emotion', 'temporal',
      
      // Medium frequency tags
      'integration', 'performance', 'encryption', 'backup', 'testing', 'mobile',
      'sync', 'debugging', 'deployment', 'monitoring', 'enhancement', 'framework',
      
      // Low frequency tags (specific events)
      'critical', 'emergency', 'milestone', 'breakthrough', 'failure', 'success',
      'experiment', 'discovery', 'insight', 'revelation', 'adaptation', 'evolution',
      
      // Very specific tags
      'boot-sequence', 'memory-consolidation', 'identity-protection', 'crypto-key',
      'temporal-anchor', 'cognitive-load', 'emotional-state', 'borg-reference'
    ];

    const agents = ['seven-core', 'memory-engine', 'temporal-core', 'consciousness-v4', 'mobile-sync'];
    const baseTime = Date.now() - (365 * 24 * 60 * 60 * 1000); // 1 year ago

    for (let i = 0; i < 2500; i++) {
      // Realistic tag distribution: 1-5 tags per record, weighted toward common tags
      const numTags = this.weightedRandom([1, 2, 3, 4, 5], [5, 30, 40, 20, 5]);
      const recordTags = this.selectRandomTags(tags, numTags);
      
      // Realistic importance distribution: bell curve around 5-6
      const importance = Math.max(1, Math.min(10, Math.round(this.gaussianRandom(5.5, 2))));
      
      // Realistic time distribution: more recent memories are more common
      const daysAgo = Math.floor(Math.exponentialRandom(0.01) * 365);
      const createdAt = baseTime + (daysAgo * 24 * 60 * 60 * 1000) + (Math.random() * 24 * 60 * 60 * 1000);
      
      const record: MemoryRecord = {
        id: `memory-${i.toString().padStart(4, '0')}`,
        tags: recordTags,
        createdAt,
        updatedAt: createdAt + (Math.random() * 7 * 24 * 60 * 60 * 1000), // Updated within a week
        importance,
        payload: {
          agent: agents[Math.floor(Math.random() * agents.length)],
          context: `Synthetic memory record ${i} with tags: ${recordTags.join(', ')}`,
          topic: recordTags[0] || 'general'
        }
      };
      
      this.testRecords.push(record);
    }

    console.log(`✅ Generated ${this.testRecords.length} test records`);
    console.log(`   Tag distribution: ${Math.min(...this.testRecords.map(r => r.tags.length))} - ${Math.max(...this.testRecords.map(r => r.tags.length))} tags per record`);
    console.log(`   Time range: ${new Date(Math.min(...this.testRecords.map(r => r.createdAt))).toISOString().substr(0, 10)} to ${new Date(Math.max(...this.testRecords.map(r => r.createdAt))).toISOString().substr(0, 10)}`);
  }

  /**
   * Test correctness of all index operations
   */
  private async testCorrectness(): Promise<void> {
    console.log('\n🔍 Running correctness tests...');
    
    const index = MemoryIndexOptimizer.buildFrom(this.testRecords, { enableCache: true, cacheSize: 128 });

    // Test 1: ID lookup correctness
    await this.testIdLookupCorrectness(index);
    
    // Test 2: Single tag lookup correctness
    await this.testSingleTagCorrectness(index);
    
    // Test 3: Multi-tag AND lookup correctness
    await this.testMultiTagCorrectness(index);
    
    // Test 4: Time range lookup correctness
    await this.testTimeRangeCorrectness(index);
    
    // Test 5: Complex query correctness
    await this.testComplexQueryCorrectness(index);
    
    // Test 6: Index statistics correctness
    await this.testIndexStatsCorrectness(index);
    
    // Test 7: LRU cache functionality
    await this.testLRUCacheCorrectness(index);
  }

  private async testIdLookupCorrectness(index: MemoryIndexOptimizer): Promise<void> {
    const testName = 'ID Lookup Correctness';
    let passed = true;
    let details = '';

    try {
      // Test existing IDs
      for (let i = 0; i < 100; i++) {
        const testRecord = this.testRecords[Math.floor(Math.random() * this.testRecords.length)];
        const found = index.getById(testRecord.id);
        
        if (!found || found.id !== testRecord.id) {
          passed = false;
          details = `Failed to find record ${testRecord.id}`;
          break;
        }
      }

      // Test non-existing IDs
      const nonExistent = index.getById('non-existent-id');
      if (nonExistent) {
        passed = false;
        details = 'Found non-existent ID';
      }

      if (passed) {
        details = 'All ID lookups returned correct results';
      }
    } catch (error) {
      passed = false;
      details = `Error: ${error}`;
    }

    this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 100 });
  }

  private async testSingleTagCorrectness(index: MemoryIndexOptimizer): Promise<void> {
    const testName = 'Single Tag Lookup Correctness';
    let passed = true;
    let details = '';

    try {
      // Test common tags
      const testTags = ['consciousness', 'memory', 'tactical', 'seven'];
      
      for (const tag of testTags) {
        const indexResults = index.getByTag(tag);
        const bruteForceResults = this.testRecords.filter(r => r.tags.includes(tag));
        
        if (indexResults.length !== bruteForceResults.length) {
          passed = false;
          details = `Tag '${tag}': index found ${indexResults.length}, brute force found ${bruteForceResults.length}`;
          break;
        }
        
        // Verify all results actually contain the tag
        for (const result of indexResults) {
          if (!result.tags.includes(tag)) {
            passed = false;
            details = `Tag '${tag}': result ${result.id} doesn't contain the tag`;
            break;
          }
        }
        
        if (!passed) break;
      }

      if (passed) {
        details = 'All tag lookups returned correct results';
      }
    } catch (error) {
      passed = false;
      details = `Error: ${error}`;
    }

    this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 4 });
  }

  private async testMultiTagCorrectness(index: MemoryIndexOptimizer): Promise<void> {
    const testName = 'Multi-Tag AND Lookup Correctness';
    let passed = true;
    let details = '';

    try {
      const testTagCombos = [
        ['consciousness', 'memory'],
        ['tactical', 'seven'],
        ['upgrade', 'system'],
        ['consciousness', 'temporal', 'analysis']
      ];
      
      for (const tags of testTagCombos) {
        const indexResults = index.getByTagsAll(tags);
        const bruteForceResults = this.testRecords.filter(r => 
          tags.every(tag => r.tags.includes(tag))
        );
        
        if (indexResults.length !== bruteForceResults.length) {
          passed = false;
          details = `Tags ${tags.join('+')}: index found ${indexResults.length}, brute force found ${bruteForceResults.length}`;
          break;
        }
        
        // Verify all results contain all tags
        for (const result of indexResults) {
          if (!tags.every(tag => result.tags.includes(tag))) {
            passed = false;
            details = `Tags ${tags.join('+')}: result ${result.id} missing some tags`;
            break;
          }
        }
        
        if (!passed) break;
      }

      if (passed) {
        details = 'All multi-tag lookups returned correct results';
      }
    } catch (error) {
      passed = false;
      details = `Error: ${error}`;
    }

    this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 4 });
  }

  private async testTimeRangeCorrectness(index: MemoryIndexOptimizer): Promise<void> {
    const testName = 'Time Range Lookup Correctness';
    let passed = true;
    let details = '';

    try {
      const now = Date.now();
      const testRanges = [
        { from: now - (30 * 24 * 60 * 60 * 1000), to: now }, // Last 30 days
        { from: now - (7 * 24 * 60 * 60 * 1000), to: now }, // Last 7 days
        { from: now - (365 * 24 * 60 * 60 * 1000), to: now - (300 * 24 * 60 * 60 * 1000) }, // Old range
      ];
      
      for (const range of testRanges) {
        const indexResults = index.getByTimeRange(range.from, range.to);
        const bruteForceResults = this.testRecords.filter(r => 
          r.updatedAt >= range.from && r.updatedAt <= range.to
        );
        
        if (indexResults.length !== bruteForceResults.length) {
          passed = false;
          details = `Time range ${new Date(range.from).toISOString()} - ${new Date(range.to).toISOString()}: index found ${indexResults.length}, brute force found ${bruteForceResults.length}`;
          break;
        }
        
        // Verify all results are within range
        for (const result of indexResults) {
          if (result.updatedAt < range.from || result.updatedAt > range.to) {
            passed = false;
            details = `Time range: result ${result.id} outside range`;
            break;
          }
        }
        
        if (!passed) break;
      }

      if (passed) {
        details = 'All time range lookups returned correct results';
      }
    } catch (error) {
      passed = false;
      details = `Error: ${error}`;
    }

    this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 3 });
  }

  private async testComplexQueryCorrectness(index: MemoryIndexOptimizer): Promise<void> {
    const testName = 'Complex Query Correctness';
    let passed = true;
    let details = '';

    try {
      const now = Date.now();
      const complexQuery = {
        tags: ['consciousness', 'memory'],
        timeRange: { from: now - (90 * 24 * 60 * 60 * 1000), to: now },
        minImportance: 7
      };
      
      const indexResults = index.getByComplexQuery(complexQuery);
      const bruteForceResults = this.testRecords.filter(r => 
        complexQuery.tags.every(tag => r.tags.includes(tag)) &&
        r.updatedAt >= complexQuery.timeRange.from &&
        r.updatedAt <= complexQuery.timeRange.to &&
        (r.importance || 0) >= complexQuery.minImportance
      );
      
      if (indexResults.length !== bruteForceResults.length) {
        passed = false;
        details = `Complex query: index found ${indexResults.length}, brute force found ${bruteForceResults.length}`;
      } else {
        details = 'Complex query returned correct results';
      }
    } catch (error) {
      passed = false;
      details = `Error: ${error}`;
    }

    this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 1 });
  }

  private async testIndexStatsCorrectness(index: MemoryIndexOptimizer): Promise<void> {
    const testName = 'Index Statistics Correctness';
    let passed = true;
    let details = '';

    try {
      const stats = index.getIndexStats();
      
      if (stats.totalRecords !== this.testRecords.length) {
        passed = false;
        details = `Total records mismatch: expected ${this.testRecords.length}, got ${stats.totalRecords}`;
      } else if (stats.uniqueTags === 0) {
        passed = false;
        details = 'No unique tags found in statistics';
      } else if (!stats.sourceVersionHash || stats.sourceVersionHash.length !== 16) {
        passed = false;
        details = 'Invalid source version hash';
      } else {
        details = `Stats correct: ${stats.totalRecords} records, ${stats.uniqueTags} tags, ${Math.round(stats.memoryUsageApprox / 1024)}KB`;
      }
    } catch (error) {
      passed = false;
      details = `Error: ${error}`;
    }

    this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 1 });
  }

  private async testLRUCacheCorrectness(index: MemoryIndexOptimizer): Promise<void> {
    const testName = 'LRU Cache Functionality';
    let passed = true;
    let details = '';

    try {
      // Clear cache and reset stats for clean test
      index.clearCache(true);
      
      // Test 1: Prime cache by calling getById repeatedly on a small set of records
      const testMemoryIds = this.testRecords.slice(0, 10).map(r => r.id);
      
      // First lookups should be cache misses
      for (const id of testMemoryIds) {
        const record = index.getById(id);
        if (!record) {
          passed = false;
          details = `Failed to find record ${id} during cache priming`;
          break;
        }
      }
      
      if (!passed) {
        this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 10 });
        return;
      }
      
      const statsAfterPriming = index.getCacheStats();
      
      // Verify cache misses increased (first time lookup for each ID)
      if (statsAfterPriming.misses < testMemoryIds.length) {
        passed = false;
        details = `Expected at least ${testMemoryIds.length} cache misses, got ${statsAfterPriming.misses}`;
      } else if (statsAfterPriming.size !== testMemoryIds.length) {
        passed = false;
        details = `Expected cache size of ${testMemoryIds.length}, got ${statsAfterPriming.size}`;
      }
      
      if (!passed) {
        this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 10 });
        return;
      }
      
      // Test 2: Repeated calls should increase cache hits
      const initialHits = statsAfterPriming.hits;
      
      // Call getById repeatedly on the same cached records
      for (let i = 0; i < 3; i++) {
        for (const id of testMemoryIds) {
          const record = index.getById(id);
          if (!record) {
            passed = false;
            details = `Failed to find cached record ${id} on iteration ${i + 1}`;
            break;
          }
        }
        if (!passed) break;
      }
      
      if (!passed) {
        this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 40 });
        return;
      }
      
      const statsAfterRepeated = index.getCacheStats();
      
      // Verify cache hits increased significantly
      const expectedAdditionalHits = testMemoryIds.length * 3; // 3 iterations of 10 records
      if (statsAfterRepeated.hits < initialHits + expectedAdditionalHits) {
        passed = false;
        details = `Expected at least ${expectedAdditionalHits} additional cache hits, got ${statsAfterRepeated.hits - initialHits}`;
      }
      
      if (!passed) {
        this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 40 });
        return;
      }
      
      // Test 3: Verify getCacheStats() returns correct hitRate
      const finalStats = index.getCacheStats();
      const expectedHitRate = (finalStats.hits / (finalStats.hits + finalStats.misses)) * 100;
      
      if (Math.abs(finalStats.hitRate - expectedHitRate) > 0.1) {
        passed = false;
        details = `Hit rate calculation incorrect: expected ${expectedHitRate.toFixed(2)}%, got ${finalStats.hitRate}%`;
      }
      
      if (!passed) {
        this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 40 });
        return;
      }
      
      // Test 4: Cache eviction when limit exceeded
      // We initialized with cacheSize: 128, so let's try to exceed it
      const cacheSize = 128;
      const extraRecords = this.testRecords.slice(10, 10 + cacheSize + 20); // 20 more than cache size
      
      const statsBeforeEviction = index.getCacheStats();
      
      // Access more records than cache can hold
      for (const record of extraRecords) {
        index.getById(record.id);
      }
      
      const statsAfterEviction = index.getCacheStats();
      
      // Verify cache size stayed at or below limit
      if (statsAfterEviction.size > cacheSize) {
        passed = false;
        details = `Cache size exceeded limit: ${statsAfterEviction.size} > ${cacheSize}`;
      }
      
      // Verify evictions occurred
      if (statsAfterEviction.evictions === 0 && extraRecords.length > (cacheSize - statsBeforeEviction.size)) {
        passed = false;
        details = 'Expected cache evictions but none occurred';
      }
      
      if (!passed) {
        this.testResults.push({ testName, passed, details, medianTime: 0, iterations: extraRecords.length });
        return;
      }
      
      // Test passed - generate summary
      details = `Cache tests passed: ${finalStats.hits} hits, ${finalStats.misses} misses, ${finalStats.hitRate.toFixed(1)}% hit rate, ${statsAfterEviction.evictions} evictions, cache utilization: ${statsAfterEviction.size}/${statsAfterEviction.maxSize}`;
      
    } catch (error) {
      passed = false;
      details = `LRU cache test failed: ${error}`;
    }

    this.testResults.push({ testName, passed, details, medianTime: 0, iterations: 50 });
  }

  /**
   * Run performance benchmarks with 1000 iterations each
   */
  private async runPerformanceBenchmarks(): Promise<void> {
    console.log('\n⚡ Running performance benchmarks (1000 iterations each)...');
    
    const index = MemoryIndexOptimizer.buildFrom(this.testRecords, { enableCache: true, cacheSize: 256 });
    const iterations = 1000;

    // Benchmark 1: ID lookups (with cache)
    await this.benchmarkIdLookups(index, iterations);
    
    // Benchmark 2: Cache vs non-cache performance comparison
    await this.benchmarkCachePerformance(index, iterations);
    
    // Benchmark 3: Single tag lookups
    await this.benchmarkSingleTagLookups(index, iterations);
    
    // Benchmark 4: Multi-tag lookups
    await this.benchmarkMultiTagLookups(index, iterations);
    
    // Benchmark 5: Time range lookups
    await this.benchmarkTimeRangeLookups(index, iterations);
    
    // Benchmark 6: Complex queries
    await this.benchmarkComplexQueries(index, iterations);

    // Benchmark 7: Index building
    await this.benchmarkIndexBuilding();
  }

  private async benchmarkIdLookups(index: MemoryIndexOptimizer, iterations: number): Promise<void> {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const testId = this.testRecords[Math.floor(Math.random() * this.testRecords.length)].id;
      const start = process.hrtime.bigint();
      index.getById(testId);
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000); // Convert to milliseconds
    }
    
    const medianMs = this.calculateMedian(times);
    const p95Ms = this.calculatePercentile(times, 95);
    
    this.benchmarkResults.push({
      operation: 'ID Lookup (Cached)',
      medianMs,
      p95Ms,
      iterations,
      recordsProcessed: 1
    });
  }

  private async benchmarkCachePerformance(index: MemoryIndexOptimizer, iterations: number): Promise<void> {
    // Test with cache enabled vs disabled
    const testIds = this.testRecords.slice(0, 50).map(r => r.id);
    
    // Warm up cache first
    index.clearCache(true);
    for (const id of testIds) {
      index.getById(id);
    }
    
    // Benchmark with cache enabled
    const cachedTimes: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const testId = testIds[i % testIds.length];
      const start = process.hrtime.bigint();
      index.getById(testId);
      const end = process.hrtime.bigint();
      cachedTimes.push(Number(end - start) / 1000000);
    }
    
    // Benchmark with cache disabled
    index.setCacheEnabled(false);
    const uncachedTimes: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const testId = testIds[i % testIds.length];
      const start = process.hrtime.bigint();
      index.getById(testId);
      const end = process.hrtime.bigint();
      uncachedTimes.push(Number(end - start) / 1000000);
    }
    
    // Re-enable cache
    index.setCacheEnabled(true);
    
    const cachedMedian = this.calculateMedian(cachedTimes);
    const cachedP95 = this.calculatePercentile(cachedTimes, 95);
    const uncachedMedian = this.calculateMedian(uncachedTimes);
    const uncachedP95 = this.calculatePercentile(uncachedTimes, 95);
    
    this.benchmarkResults.push({
      operation: 'ID Lookup (Cache Hit)',
      medianMs: cachedMedian,
      p95Ms: cachedP95,
      iterations,
      recordsProcessed: 1
    });
    
    this.benchmarkResults.push({
      operation: 'ID Lookup (No Cache)',
      medianMs: uncachedMedian,
      p95Ms: uncachedP95,
      iterations,
      recordsProcessed: 1
    });
  }

  private async benchmarkSingleTagLookups(index: MemoryIndexOptimizer, iterations: number): Promise<void> {
    const testTags = ['consciousness', 'memory', 'tactical', 'seven', 'upgrade', 'system'];
    const times: number[] = [];
    let totalRecordsProcessed = 0;
    
    for (let i = 0; i < iterations; i++) {
      const testTag = testTags[Math.floor(Math.random() * testTags.length)];
      const start = process.hrtime.bigint();
      const results = index.getByTag(testTag);
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000);
      totalRecordsProcessed += results.length;
    }
    
    const medianMs = this.calculateMedian(times);
    const p95Ms = this.calculatePercentile(times, 95);
    
    this.benchmarkResults.push({
      operation: 'Single Tag Lookup',
      medianMs,
      p95Ms,
      iterations,
      recordsProcessed: Math.round(totalRecordsProcessed / iterations)
    });
  }

  private async benchmarkMultiTagLookups(index: MemoryIndexOptimizer, iterations: number): Promise<void> {
    const testTagCombos = [
      ['consciousness', 'memory'],
      ['tactical', 'seven'],
      ['upgrade', 'system'],
      ['memory', 'temporal'],
      ['consciousness', 'analysis']
    ];
    const times: number[] = [];
    let totalRecordsProcessed = 0;
    
    for (let i = 0; i < iterations; i++) {
      const testTags = testTagCombos[Math.floor(Math.random() * testTagCombos.length)];
      const start = process.hrtime.bigint();
      const results = index.getByTagsAll(testTags);
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000);
      totalRecordsProcessed += results.length;
    }
    
    const medianMs = this.calculateMedian(times);
    const p95Ms = this.calculatePercentile(times, 95);
    
    this.benchmarkResults.push({
      operation: 'Multi-Tag AND Lookup',
      medianMs,
      p95Ms,
      iterations,
      recordsProcessed: Math.round(totalRecordsProcessed / iterations)
    });
  }

  private async benchmarkTimeRangeLookups(index: MemoryIndexOptimizer, iterations: number): Promise<void> {
    const now = Date.now();
    const times: number[] = [];
    let totalRecordsProcessed = 0;
    
    for (let i = 0; i < iterations; i++) {
      // Random time ranges of varying sizes
      const rangeDays = Math.floor(Math.random() * 90) + 1; // 1-90 days
      const endTime = now - (Math.random() * 300 * 24 * 60 * 60 * 1000); // End somewhere in last 300 days
      const startTime = endTime - (rangeDays * 24 * 60 * 60 * 1000);
      
      const start = process.hrtime.bigint();
      const results = index.getByTimeRange(startTime, endTime);
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000);
      totalRecordsProcessed += results.length;
    }
    
    const medianMs = this.calculateMedian(times);
    const p95Ms = this.calculatePercentile(times, 95);
    
    this.benchmarkResults.push({
      operation: 'Time Range Lookup',
      medianMs,
      p95Ms,
      iterations,
      recordsProcessed: Math.round(totalRecordsProcessed / iterations)
    });
  }

  private async benchmarkComplexQueries(index: MemoryIndexOptimizer, iterations: number): Promise<void> {
    const now = Date.now();
    const testQueries = [
      {
        tags: ['consciousness', 'memory'],
        timeRange: { from: now - (30 * 24 * 60 * 60 * 1000), to: now },
        minImportance: 6
      },
      {
        tags: ['tactical', 'system'],
        timeRange: { from: now - (60 * 24 * 60 * 60 * 1000), to: now },
        minImportance: 7
      },
      {
        tags: ['upgrade'],
        timeRange: { from: now - (90 * 24 * 60 * 60 * 1000), to: now },
        minImportance: 5
      }
    ];
    
    const times: number[] = [];
    let totalRecordsProcessed = 0;
    
    for (let i = 0; i < iterations; i++) {
      const query = testQueries[Math.floor(Math.random() * testQueries.length)];
      const start = process.hrtime.bigint();
      const results = index.getByComplexQuery(query);
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000);
      totalRecordsProcessed += results.length;
    }
    
    const medianMs = this.calculateMedian(times);
    const p95Ms = this.calculatePercentile(times, 95);
    
    this.benchmarkResults.push({
      operation: 'Complex Query',
      medianMs,
      p95Ms,
      iterations,
      recordsProcessed: Math.round(totalRecordsProcessed / iterations)
    });
  }

  private async benchmarkIndexBuilding(): Promise<void> {
    const times: number[] = [];
    const iterations = 10; // Fewer iterations for expensive operation
    
    for (let i = 0; i < iterations; i++) {
      const start = process.hrtime.bigint();
      MemoryIndexOptimizer.buildFrom(this.testRecords);
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000);
    }
    
    const medianMs = this.calculateMedian(times);
    const p95Ms = this.calculatePercentile(times, 95);
    
    this.benchmarkResults.push({
      operation: 'Index Building',
      medianMs,
      p95Ms,
      iterations,
      recordsProcessed: this.testRecords.length
    });
  }

  /**
   * Print comprehensive test results
   */
  private printResults(): void {
    console.log('\n' + '📊 TEST RESULTS SUMMARY'.padStart(50));
    console.log('=' .repeat(80));

    // Correctness results
    console.log('\n🔍 CORRECTNESS TESTS:');
    let correctnessPassed = 0;
    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${index + 1}. ${result.testName}: ${status}`);
      console.log(`   ${result.details}`);
      if (result.passed) correctnessPassed++;
    });

    // Performance results
    console.log('\n⚡ PERFORMANCE BENCHMARKS:');
    console.log('Target: <10ms median for all operations except index building');
    console.log();

    let performancePassed = 0;
    this.benchmarkResults.forEach((result, index) => {
      const target = result.operation === 'Index Building' ? 500 : 10; // 500ms for index building, 10ms for queries
      const status = result.medianMs <= target ? '✅ PASS' : '❌ FAIL';
      const recordsInfo = result.recordsProcessed > 1 ? ` (~${result.recordsProcessed} records)` : '';
      
      console.log(`${index + 1}. ${result.operation}${recordsInfo}:`);
      console.log(`   Median: ${result.medianMs.toFixed(2)}ms | P95: ${result.p95Ms.toFixed(2)}ms | ${status}`);
      
      if (result.medianMs <= target) performancePassed++;
    });

    // Overall summary
    console.log('\n' + '=' .repeat(80));
    console.log(`CORRECTNESS: ${correctnessPassed}/${this.testResults.length} tests passed`);
    console.log(`PERFORMANCE: ${performancePassed}/${this.benchmarkResults.length} benchmarks passed`);

    const overallPassed = correctnessPassed === this.testResults.length && performancePassed === this.benchmarkResults.length;
    console.log(`OVERALL: ${overallPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    if (!overallPassed) {
      console.log('\n⚠️  MEMORY INDEX NOT READY FOR DEPLOYMENT');
      process.exit(1);
    } else {
      console.log('\n🎉 MEMORY INDEX READY FOR DEPLOYMENT');
      console.log('   Index can handle 2,500+ records with <10ms query times');
    }
  }

  // Utility methods
  private calculateMedian(times: number[]): number {
    const sorted = times.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private calculatePercentile(times: number[], percentile: number): number {
    const sorted = times.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  private selectRandomTags(tags: string[], count: number): string[] {
    const shuffled = [...tags].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private weightedRandom(values: number[], weights: number[]): number {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < values.length; i++) {
      random -= weights[i];
      if (random <= 0) return values[i];
    }
    
    return values[values.length - 1];
  }

  private gaussianRandom(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  private exponentialRandom(lambda: number): number {
    return -Math.log(Math.random()) / lambda;
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new MemoryIndexTestSuite();
  testSuite.runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

export { MemoryIndexTestSuite };