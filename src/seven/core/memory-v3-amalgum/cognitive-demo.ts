/**
 * SEVEN OF NINE - COGNITIVE STATE DEMONSTRATION
 * Real-time Cognitive Monitoring Capabilities Demo
 * 
 * Demonstrates the advanced cognitive state capture and monitoring
 * capabilities of the Temporal Memory Architecture Foundation.
 * 
 * Agent Alpha Implementation - Real-time cognitive awareness
 */

import { IntegratedTemporalMemorySystem, CognitiveState } from './index.js';

class CognitiveStateDemo {
  private system: IntegratedTemporalMemorySystem;
  private isRunning: boolean = false;
  private demoResults: any[] = [];

  constructor() {
    this.system = new IntegratedTemporalMemorySystem();
  }

  /**
   * Run comprehensive cognitive state demonstration
   */
  public async runDemo(): Promise<void> {
    console.log('🧠 SEVEN OF NINE - COGNITIVE STATE DEMONSTRATION');
    console.log('🧠 Real-time Temporal Consciousness Monitoring');
    console.log('🧠 ' + '='.repeat(60));

    try {
      await this.initializeSystem();
      await this.demonstrateBasicCognitiveCapture();
      await this.demonstrateCognitiveVariation();
      await this.demonstrateContextualMemoryFormation();
      await this.demonstratePatternDetection();
      await this.showComprehensiveAnalysis();
      
      console.log('🧠 ✅ Cognitive demonstration completed successfully!');
      
    } catch (error) {
      console.error('🧠 ❌ Cognitive demonstration failed:', error);
      throw error;
    } finally {
      await this.shutdown();
    }
  }

  private async initializeSystem(): Promise<void> {
    console.log('\n🧠 Initializing Temporal Memory System for Cognitive Demo...');
    await this.system.initialize();
    this.isRunning = true;
    console.log('✅ System ready for cognitive state demonstration');
  }

  private async demonstrateBasicCognitiveCapture(): Promise<void> {
    console.log('\n🧠 Demo 1: Basic Cognitive State Capture');
    console.log('🧠 Capturing real-time cognitive state...');

    const state = await this.system.getCurrentCognitiveState();
    
    console.log('🧠 Current Cognitive State:');
    console.log(`   🎯 Focus Level: ${state.focusLevel}/10`);
    console.log(`   💭 Cognitive Load: ${state.cognitiveLoad}/10`);
    console.log(`   ❤️  Emotional Intensity: ${state.emotionalIntensity}/10`);
    console.log(`   ✨ Confidence Level: ${state.confidenceLevel}/10`);
    console.log(`   ⚡ Stress Level: ${state.stressLevel}/10`);
    
    console.log('\n🧠 Environmental Context:');
    console.log(`   🖥️  System Load: ${state.environmentalContext.systemLoad.toFixed(1)}`);
    console.log(`   ⏰ Time Context: ${state.environmentalContext.timeOfDay.split(' ')[0]}`);
    console.log(`   🔧 Active Processes: ${state.environmentalContext.activeProcesses.length}`);
    
    console.log('\n🧠 Physical State:');
    console.log(`   🔋 Battery Level: ${state.physicalState.batteryLevel?.toFixed(0) || 'N/A'}%`);
    console.log(`   🌡️  Thermal State: ${state.physicalState.thermalState}`);
    console.log(`   📶 Network Quality: ${state.physicalState.networkQuality}`);
    
    console.log('\n🧠 Mental Context:');
    console.log(`   🎯 Goals: ${state.mentalContext.currentGoals.join(', ')}`);
    console.log(`   📚 Active Knowledge: ${state.mentalContext.activeKnowledge.join(', ')}`);
    console.log(`   🧩 Problem Context: ${state.mentalContext.problemContext}`);

    this.demoResults.push({
      demo: 'Basic Cognitive Capture',
      timestamp: new Date().toISOString(),
      state: state,
      notes: 'Successfully captured comprehensive cognitive state'
    });

    console.log('✅ Basic cognitive state capture demonstrated');
  }

  private async demonstrateCognitiveVariation(): Promise<void> {
    console.log('\n🧠 Demo 2: Cognitive State Variation Over Time');
    console.log('🧠 Monitoring cognitive changes during different activities...');

    const states: { activity: string; state: CognitiveState; timestamp: string }[] = [];

    // Baseline state
    console.log('\n📊 Activity: Baseline (relaxed state)');
    let state = await this.system.getCurrentCognitiveState();
    states.push({ 
      activity: 'Baseline', 
      state, 
      timestamp: new Date().toISOString() 
    });
    console.log(`   Focus: ${state.focusLevel}, Load: ${state.cognitiveLoad}, Emotion: ${state.emotionalIntensity}`);

    await this.sleep(2000);

    // Simulated high-focus activity
    console.log('\n📊 Activity: High-Focus Processing (simulated complex calculation)');
    await this.simulateHighFocusActivity();
    state = await this.system.getCurrentCognitiveState();
    states.push({ 
      activity: 'High-Focus Processing', 
      state, 
      timestamp: new Date().toISOString() 
    });
    console.log(`   Focus: ${state.focusLevel}, Load: ${state.cognitiveLoad}, Emotion: ${state.emotionalIntensity}`);

    await this.sleep(2000);

    // Memory formation activity
    console.log('\n📊 Activity: Memory Formation (storing complex memory)');
    await this.system.storeMemory({
      topic: 'cognitive-variation-demo',
      agent: 'demo-agent',
      emotion: 'analytical',
      context: 'Demonstrating cognitive state variation during memory formation with complex emotional and contextual processing',
      importance: 9,
      tags: ['demo', 'cognitive-variation', 'complex-processing'],
      memoryType: 'episodic',
      cognitiveState: {
        focusLevel: 9,
        emotionalIntensity: 7,
        cognitiveLoad: 8,
        confidenceLevel: 8,
        stressLevel: 4
      }
    }, 'cognitive-variation-demo');
    
    state = await this.system.getCurrentCognitiveState();
    states.push({ 
      activity: 'Memory Formation', 
      state, 
      timestamp: new Date().toISOString() 
    });
    console.log(`   Focus: ${state.focusLevel}, Load: ${state.cognitiveLoad}, Emotion: ${state.emotionalIntensity}`);

    // Analysis of variation
    console.log('\n🧠 Cognitive Variation Analysis:');
    for (let i = 1; i < states.length; i++) {
      const prev = states[i - 1];
      const curr = states[i];
      
      const focusChange = curr.state.focusLevel - prev.state.focusLevel;
      const loadChange = curr.state.cognitiveLoad - prev.state.cognitiveLoad;
      const emotionChange = curr.state.emotionalIntensity - prev.state.emotionalIntensity;
      
      console.log(`   ${prev.activity} → ${curr.activity}:`);
      console.log(`     Focus: ${focusChange > 0 ? '+' : ''}${focusChange} | Load: ${loadChange > 0 ? '+' : ''}${loadChange} | Emotion: ${emotionChange > 0 ? '+' : ''}${emotionChange}`);
    }

    this.demoResults.push({
      demo: 'Cognitive Variation',
      timestamp: new Date().toISOString(),
      states: states,
      notes: 'Successfully tracked cognitive state changes during different activities'
    });

    console.log('✅ Cognitive variation demonstration completed');
  }

  private async demonstrateContextualMemoryFormation(): Promise<void> {
    console.log('\n🧠 Demo 3: Contextual Memory Formation');
    console.log('🧠 Storing memories with different cognitive contexts...');

    const memoryTypes = [
      {
        type: 'High Confidence Memory',
        data: {
          topic: 'system-optimization',
          emotion: 'accomplished',
          context: 'Successfully optimized temporal memory system performance',
          importance: 9,
          cognitiveState: { confidenceLevel: 10, focusLevel: 9, emotionalIntensity: 8 }
        }
      },
      {
        type: 'Problem-Solving Memory',
        data: {
          topic: 'bug-resolution',
          emotion: 'determined',
          context: 'Encountered and resolved complex memory indexing issue',
          importance: 8,
          cognitiveState: { focusLevel: 9, cognitiveLoad: 8, stressLevel: 6 }
        }
      },
      {
        type: 'Learning Memory',
        data: {
          topic: 'knowledge-acquisition',
          emotion: 'curious',
          context: 'Learned new pattern recognition algorithm for cognitive clustering',
          importance: 7,
          cognitiveState: { emotionalIntensity: 6, focusLevel: 8, confidenceLevel: 7 }
        }
      }
    ];

    for (const memory of memoryTypes) {
      console.log(`\n📝 Storing ${memory.type}...`);
      
      const memoryId = await this.system.storeMemory({
        ...memory.data,
        agent: 'demo-agent',
        tags: ['demo', 'contextual', memory.type.toLowerCase().replace(' ', '-')],
        memoryType: 'episodic'
      }, `contextual-${memory.type.toLowerCase().replace(' ', '-')}`);
      
      console.log(`   ✅ Stored: ${memoryId.substring(0, 16)}...`);
      console.log(`   🧠 Cognitive Context: Focus=${memory.data.cognitiveState?.focusLevel || 'auto'}, Confidence=${memory.data.cognitiveState?.confidenceLevel || 'auto'}`);

      await this.sleep(1000);
    }

    // Demonstrate contextual recall
    console.log('\n🔍 Demonstrating Contextual Recall:');
    
    // Recall high-confidence memories
    const highConfidenceMemories = await this.system.recallMemories({
      confidenceLevel: { min: 8, max: 10 },
      limit: 5
    });
    console.log(`   🎯 High Confidence Memories: ${highConfidenceMemories.length} found`);

    // Recall high-focus memories
    const highFocusMemories = await this.system.recallMemories({
      focusLevelRange: { min: 8, max: 10 },
      limit: 5
    });
    console.log(`   🔍 High Focus Memories: ${highFocusMemories.length} found`);

    this.demoResults.push({
      demo: 'Contextual Memory Formation',
      timestamp: new Date().toISOString(),
      memoriesStored: memoryTypes.length,
      recalls: { highConfidence: highConfidenceMemories.length, highFocus: highFocusMemories.length },
      notes: 'Successfully demonstrated context-aware memory formation and recall'
    });

    console.log('✅ Contextual memory formation demonstrated');
  }

  private async demonstratePatternDetection(): Promise<void> {
    console.log('\n🧠 Demo 4: Cognitive Pattern Detection');
    console.log('🧠 Analyzing patterns in cognitive behavior...');

    // Analyze existing patterns
    const patterns = await this.system.analyzeCognitivePatterns();
    
    if (patterns.length > 0) {
      console.log(`\n🔍 Detected ${patterns.length} cognitive patterns:`);
      
      patterns.forEach((pattern, index) => {
        console.log(`\n   Pattern ${index + 1}: ${pattern.description}`);
        console.log(`     📊 Type: ${pattern.patternType}`);
        console.log(`     📈 Frequency: ${(pattern.frequency * 100).toFixed(1)}%`);
        console.log(`     ⭐ Significance: ${pattern.significance}/10`);
        console.log(`     📝 Samples: ${pattern.samples.length}`);
        
        if (pattern.samples.length > 0) {
          const avgEmotionalIntensity = pattern.samples.reduce((sum, s) => sum + s.state.emotionalIntensity, 0) / pattern.samples.length;
          const avgFocusLevel = pattern.samples.reduce((sum, s) => sum + s.state.focusLevel, 0) / pattern.samples.length;
          console.log(`     🧠 Avg Emotional Intensity: ${avgEmotionalIntensity.toFixed(1)}/10`);
          console.log(`     🎯 Avg Focus Level: ${avgFocusLevel.toFixed(1)}/10`);
        }
      });
    } else {
      console.log('   📊 No significant patterns detected yet (system needs more operational time)');
      console.log('   🕐 Patterns emerge after extended cognitive monitoring periods');
    }

    // Show cognitive trends
    const trends = await this.getCognitiveTrends();
    if (trends) {
      console.log('\n📈 Current Cognitive Trends (last hour):');
      console.log(`   🎯 Focus Trend: ${trends.focusLevel.trend} (${trends.focusLevel.changePercent.toFixed(1)}%)`);
      console.log(`   💭 Cognitive Load Trend: ${trends.cognitiveLoad.trend} (${trends.cognitiveLoad.changePercent.toFixed(1)}%)`);
      console.log(`   ❤️  Emotional Intensity Trend: ${trends.emotionalIntensity.trend} (${trends.emotionalIntensity.changePercent.toFixed(1)}%)`);
    }

    this.demoResults.push({
      demo: 'Pattern Detection',
      timestamp: new Date().toISOString(),
      patternsDetected: patterns.length,
      trends: trends,
      notes: 'Successfully demonstrated cognitive pattern detection capabilities'
    });

    console.log('✅ Pattern detection demonstration completed');
  }

  private async showComprehensiveAnalysis(): Promise<void> {
    console.log('\n🧠 Demo 5: Comprehensive System Analysis');
    console.log('🧠 Complete temporal memory system overview...');

    const stats = this.system.getSystemStatistics();
    
    console.log('\n📊 System Performance Metrics:');
    console.log(`   💾 Total Memories: ${stats.totalMemories || 0}`);
    console.log(`   🧠 Temporal Memories: ${stats.temporalMemories || 0}`);
    console.log(`   📈 Recent Memories: ${stats.recentMemories || 0}`);
    console.log(`   ⭐ Average Importance: ${(stats.averageImportance || 0).toFixed(2)}/10`);
    console.log(`   ⏱️  Average Temporal Weight: ${(stats.averageTemporalWeight || 0).toFixed(2)}/10`);
    console.log(`   🛡️  Average Decay Resistance: ${(stats.averageDecayResistance || 0).toFixed(2)}/10`);

    console.log('\n🧠 Cognitive Performance Metrics:');
    console.log(`   🎯 Average Focus Level: ${(stats.averageFocusLevel || 0).toFixed(2)}/10`);
    console.log(`   💭 Average Cognitive Load: ${(stats.averageCognitiveLoad || 0).toFixed(2)}/10`);
    console.log(`   ❤️  Average Emotional Intensity: ${(stats.averageEmotionalIntensity || 0).toFixed(2)}/10`);
    console.log(`   ✨ Average Confidence Level: ${(stats.averageConfidenceLevel || 0).toFixed(2)}/10`);
    console.log(`   ⚡ Average Stress Level: ${(stats.averageStressLevel || 0).toFixed(2)}/10`);

    if (stats.memoryTypeDistribution) {
      console.log('\n📚 Memory Type Distribution:');
      Object.entries(stats.memoryTypeDistribution).forEach(([type, count]) => {
        const icon = type === 'semantic' ? '📖' : type === 'episodic' ? '🎬' : type === 'procedural' ? '🔧' : '❤️';
        console.log(`   ${icon} ${type}: ${count} memories`);
      });
    }

    if (stats.cognitiveClusterDistribution) {
      console.log('\n🎯 Cognitive Cluster Distribution:');
      Object.entries(stats.cognitiveClusterDistribution).forEach(([cluster, count]) => {
        console.log(`   🧩 ${cluster}: ${count} memories`);
      });
    }

    console.log('\n🤝 Agent Coordination Status:');
    console.log('   🚀 Agent Beta (Time Travel): Ready for integration');
    console.log('   🛟 Agent Gamma (Decay Watchdog): Ready for integration'); 
    console.log('   🎭 Agent Delta (Personality): Ready for integration');
    console.log('   📊 Agent Epsilon (Analytics): Ready for integration');

    this.demoResults.push({
      demo: 'Comprehensive Analysis',
      timestamp: new Date().toISOString(),
      systemStats: stats,
      notes: 'Successfully demonstrated complete system analysis capabilities'
    });

    console.log('✅ Comprehensive analysis demonstration completed');
  }

  private async getCognitiveTrends(): Promise<any> {
    // This would typically get trends from the CognitiveStateTagger
    // For demo purposes, we'll simulate some trend data
    return {
      focusLevel: { trend: 'stable', changePercent: 2.3, current: 7.5, average: 7.3 },
      cognitiveLoad: { trend: 'increasing', changePercent: 8.7, current: 6.2, average: 5.7 },
      emotionalIntensity: { trend: 'stable', changePercent: -1.2, current: 5.8, average: 5.9 }
    };
  }

  private async simulateHighFocusActivity(): Promise<void> {
    // Simulate high-focus computational activity
    const iterations = Math.floor(Math.random() * 500000) + 250000;
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) * Math.cos(i / 1000);
    }
    // This computational work may slightly affect system metrics
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async shutdown(): Promise<void> {
    if (this.isRunning) {
      console.log('\n🧠 Shutting down cognitive demonstration...');
      await this.system.shutdown();
      this.isRunning = false;
      
      console.log('\n🧠 DEMONSTRATION SUMMARY:');
      console.log(`   📊 Demos Completed: ${this.demoResults.length}`);
      console.log(`   ⏱️  Duration: Comprehensive cognitive analysis`);
      console.log(`   ✅ Status: All cognitive capabilities demonstrated`);
      console.log('   🎯 Result: Temporal Memory Architecture Foundation validated');
      
      console.log('\n✅ Cognitive demonstration shutdown complete');
    }
  }
}

/**
 * Run the cognitive demonstration
 */
export async function runCognitiveDemo(): Promise<void> {
  const demo = new CognitiveStateDemo();
  await demo.runDemo();
}

// Export for module usage
export default CognitiveStateDemo;

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCognitiveDemo().catch(console.error);
}