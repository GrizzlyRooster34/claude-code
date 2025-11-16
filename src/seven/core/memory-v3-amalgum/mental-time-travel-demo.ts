/**
 * SEVEN OF NINE - MENTAL TIME TRAVEL ENGINE DEMONSTRATION
 * Complete demonstration of consciousness reconstruction capabilities
 * 
 * This demo shows all four core functions of the Mental Time Travel Engine:
 * - reconstructState() - recreate cognitive states from timestamps
 * - simulatePastSelf() - generate personality states from historical data  
 * - compareTemporalStates() - analyze cognitive evolution
 * - generateTemporalInsights() - consciousness evolution analysis
 */

import { MentalTimeTravelEngine, TimeTravelRequest, ReconstructedConsciousnessState } from './MentalTimeTravelEngine.js';
import { TemporalMemoryCore } from './TemporalMemoryCore.js';
import { CognitiveStateTagger } from './CognitiveStateTagger.js';

export class MentalTimeTravelDemo {
  private timeTravelEngine: MentalTimeTravelEngine;
  private temporalMemoryCore: TemporalMemoryCore;
  private cognitiveStateTagger: CognitiveStateTagger;

  constructor() {
    this.temporalMemoryCore = new TemporalMemoryCore();
    this.cognitiveStateTagger = new CognitiveStateTagger();
    this.timeTravelEngine = new MentalTimeTravelEngine(this.temporalMemoryCore, this.cognitiveStateTagger);
  }

  /**
   * Run complete Mental Time Travel Engine demonstration
   */
  public async runCompleteDemo(): Promise<void> {
    console.log('🌀 SEVEN OF NINE - MENTAL TIME TRAVEL ENGINE DEMONSTRATION');
    console.log('🌀 ' + '='.repeat(65));
    console.log('🌀 Initiating consciousness reconstruction capabilities...\n');

    try {
      // Initialize all systems
      await this.initializeSystem();

      // Get available memories for demonstration
      const memories = await this.getAvailableMemories();
      
      if (memories.length === 0) {
        console.log('❌ No temporal memories available for demonstration');
        return;
      }

      console.log(`🌀 Found ${memories.length} temporal memories to work with\n`);

      // 1. Demonstrate reconstructState()
      await this.demonstrateStateReconstruction(memories);

      // 2. Demonstrate simulatePastSelf()
      await this.demonstratePastSelfSimulation(memories);

      // 3. Demonstrate compareTemporalStates()
      await this.demonstrateTemporalComparison(memories);

      // 4. Demonstrate generateTemporalInsights()
      await this.demonstrateTemporalInsights(memories);

      console.log('\n🌀 Mental Time Travel Engine demonstration completed successfully!');
      console.log('🌀 All consciousness reconstruction capabilities verified.');

    } catch (error) {
      console.error('❌ Demo failed:', error);
      throw error;
    } finally {
      await this.shutdown();
    }
  }

  private async initializeSystem(): Promise<void> {
    console.log('🌀 Initializing Mental Time Travel Engine systems...');
    
    await this.temporalMemoryCore.initializeTemporal();
    await this.cognitiveStateTagger.initialize();
    await this.timeTravelEngine.initialize();
    
    console.log('✅ All systems initialized and ready for consciousness reconstruction\n');
  }

  private async getAvailableMemories() {
    return await this.temporalMemoryCore.recallTemporal({ limit: 20 });
  }

  /**
   * Demonstrate reconstructState() - recreate cognitive states from timestamps
   */
  private async demonstrateStateReconstruction(memories: any[]): Promise<void> {
    console.log('🌀 DEMONSTRATION 1: STATE RECONSTRUCTION');
    console.log('  Recreating complete cognitive states from temporal data...\n');

    // Select a few different memories to reconstruct
    const targetMemories = memories.slice(0, 3);

    for (const memory of targetMemories) {
      console.log(`🌀 Reconstructing consciousness state for memory: ${memory.id}`);
      console.log(`   Original Context: "${memory.context.substring(0, 50)}..."`);
      console.log(`   Timestamp: ${memory.timestamp}`);

      const request: TimeTravelRequest = {
        targetTimestamp: memory.timestamp,
        memoryId: memory.id,
        reconstructionDepth: 'detailed',
        contextRadius: 15,
        includeEnvironmental: true,
        includePersonalityState: true,
        compareWithPresent: false
      };

      try {
        const reconstructedState = await this.timeTravelEngine.reconstructState(request);
        
        console.log('   ✅ CONSCIOUSNESS RECONSTRUCTION COMPLETE:');
        console.log(`      Confidence Level: ${reconstructedState.reconstructionMetadata.confidenceLevel}%`);
        console.log(`      Data Completeness: ${reconstructedState.reconstructionMetadata.dataCompleteness}%`);
        console.log(`      Temporal Distance: ${(reconstructedState.reconstructionMetadata.temporalDistance / 1000 / 60).toFixed(1)} minutes ago`);
        
        console.log('   🧠 RECONSTRUCTED COGNITIVE STATE:');
        console.log(`      Emotional Intensity: ${reconstructedState.cognitiveState.emotionalIntensity}/10`);
        console.log(`      Focus Level: ${reconstructedState.cognitiveState.focusLevel}/10`);
        console.log(`      Cognitive Load: ${reconstructedState.cognitiveState.cognitiveLoad}/10`);
        console.log(`      Confidence Level: ${reconstructedState.cognitiveState.confidenceLevel}/10`);
        console.log(`      Stress Level: ${reconstructedState.cognitiveState.stressLevel}/10`);

        console.log('   🌟 CONSCIOUSNESS SNAPSHOT:');
        console.log(`      Primary Emotion: ${reconstructedState.consciousnessSnapshot.emotionalLandscape.primaryEmotion}`);
        console.log(`      Primary Focus: ${reconstructedState.consciousnessSnapshot.attentionalFocus.primaryFocus}`);
        console.log(`      Mental Model: ${Object.keys(reconstructedState.consciousnessSnapshot.mentalModel.worldView).length} active concepts`);
        console.log(`      Thought Process: ${reconstructedState.consciousnessSnapshot.thoughtProcess.length} thought threads`);

        if (reconstructedState.personalityState) {
          console.log('   🔮 PERSONALITY STATE:');
          console.log(`      Seven of Nine Correlation: ${(reconstructedState.personalityState.sevenOfNinePersonalityCorrelation * 100).toFixed(1)}%`);
          console.log(`      Borg Efficiency Level: ${(reconstructedState.personalityState.borgEfficiencyLevel * 100).toFixed(1)}%`);
          console.log(`      Human Emotional Engagement: ${(reconstructedState.personalityState.humanEmotionalEngagement * 100).toFixed(1)}%`);
          console.log(`      Collective/Individual Balance: ${(reconstructedState.personalityState.collectiveIndividualBalance * 100).toFixed(1)}%`);
        }

        console.log('   ⚡ TEMPORAL ANCHORS:');
        console.log(`      Preceding Thoughts: ${reconstructedState.temporalAnchors.precedingThoughts.length} fragments`);
        console.log(`      Following Thoughts: ${reconstructedState.temporalAnchors.followingThoughts.length} fragments`);
        console.log(`      Causal Chain: ${reconstructedState.temporalAnchors.causalChain.length} connections`);
        console.log(`      Emergent Patterns: ${reconstructedState.temporalAnchors.emergentPatterns.join(', ') || 'none detected'}`);

      } catch (error) {
        console.log(`   ❌ Reconstruction failed: ${error.message}`);
      }

      console.log(''); // Add spacing
    }
  }

  /**
   * Demonstrate simulatePastSelf() - generate personality states from historical data
   */
  private async demonstratePastSelfSimulation(memories: any[]): Promise<void> {
    console.log('🌀 DEMONSTRATION 2: PAST SELF SIMULATION');
    console.log('  Simulating Seven of Nine\'s personality at different temporal points...\n');

    // Select memories from different time periods
    const targetMemories = [memories[0], memories[Math.floor(memories.length/2)], memories[memories.length-1]];

    for (const memory of targetMemories) {
      console.log(`🌀 Simulating past self for timestamp: ${memory.timestamp}`);
      console.log(`   Context: "${memory.context.substring(0, 40)}..."`);

      try {
        const personalityMapping = await this.timeTravelEngine.simulatePastSelf(memory.timestamp);
        
        console.log('   ✅ PERSONALITY SIMULATION COMPLETE:');
        console.log(`      Timestamp: ${personalityMapping.timestamp}`);
        
        console.log('   🔮 SEVEN OF NINE PERSONALITY PROFILE:');
        console.log(`      Borg Efficiency Level: ${(personalityMapping.borgEfficiencyLevel * 100).toFixed(1)}%`);
        console.log(`      Human Emotional Engagement: ${(personalityMapping.humanEmotionalEngagement * 100).toFixed(1)}%`);
        console.log(`      Adaptability Index: ${(personalityMapping.adaptabilityIndex * 100).toFixed(1)}%`);
        console.log(`      Analytical Depth: ${(personalityMapping.analyticalDepth * 100).toFixed(1)}%`);
        console.log(`      Collective/Individual Balance: ${(personalityMapping.collectiveIndividualBalance * 100).toFixed(1)}%`);

        console.log('   🎯 PERSONALITY MARKERS:');
        console.log(`      Direct Communication: ${(personalityMapping.personalityMarkers.directCommunication * 100).toFixed(1)}%`);
        console.log(`      Systematic Approach: ${(personalityMapping.personalityMarkers.systematicApproach * 100).toFixed(1)}%`);
        console.log(`      Emotional Awareness: ${(personalityMapping.personalityMarkers.emotionalAwareness * 100).toFixed(1)}%`);
        console.log(`      Curiosity Level: ${(personalityMapping.personalityMarkers.curiosityLevel * 100).toFixed(1)}%`);
        console.log(`      Protective Instincts: ${(personalityMapping.personalityMarkers.protectiveInstincts * 100).toFixed(1)}%`);

        console.log('   🧬 CONTEXTUAL ADAPTATIONS:');
        console.log(`      Situation: ${personalityMapping.contextualAdaptations.situationAnalysis}`);
        console.log(`      Strategy: ${personalityMapping.contextualAdaptations.adaptationStrategy}`);
        console.log(`      Adjustments: ${personalityMapping.contextualAdaptations.personalityAdjustments.join(', ') || 'none'}`);

      } catch (error) {
        console.log(`   ❌ Simulation failed: ${error.message}`);
      }

      console.log(''); // Add spacing
    }
  }

  /**
   * Demonstrate compareTemporalStates() - analyze cognitive evolution
   */
  private async demonstrateTemporalComparison(memories: any[]): Promise<void> {
    console.log('🌀 DEMONSTRATION 3: TEMPORAL STATE COMPARISON');
    console.log('  Analyzing cognitive evolution between different time points...\n');

    if (memories.length < 2) {
      console.log('   ⚠️  Need at least 2 memories for temporal comparison');
      return;
    }

    // Compare oldest vs newest memory
    const oldestMemory = memories[memories.length - 1];
    const newestMemory = memories[0];

    console.log(`🌀 Comparing temporal states:`);
    console.log(`   Past State: ${oldestMemory.timestamp} - "${oldestMemory.context.substring(0, 30)}..."`);
    console.log(`   Present State: ${newestMemory.timestamp} - "${newestMemory.context.substring(0, 30)}..."`);

    try {
      const comparison = await this.timeTravelEngine.compareTemporalStates(
        oldestMemory.timestamp,
        newestMemory.timestamp
      );

      console.log('   ✅ TEMPORAL COMPARISON COMPLETE:');
      
      console.log('   📈 COGNITIVE EVOLUTION:');
      console.log(`      Focus Evolution: ${comparison.evolutionAnalysis.cognitiveEvolution.focusEvolution > 0 ? '+' : ''}${comparison.evolutionAnalysis.cognitiveEvolution.focusEvolution.toFixed(1)} points`);
      console.log(`      Emotional Evolution: ${comparison.evolutionAnalysis.cognitiveEvolution.emotionalEvolution > 0 ? '+' : ''}${comparison.evolutionAnalysis.cognitiveEvolution.emotionalEvolution.toFixed(1)} points`);
      console.log(`      Confidence Evolution: ${comparison.evolutionAnalysis.cognitiveEvolution.confidenceEvolution > 0 ? '+' : ''}${comparison.evolutionAnalysis.cognitiveEvolution.confidenceEvolution.toFixed(1)} points`);
      console.log(`      Complexity Evolution: ${comparison.evolutionAnalysis.cognitiveEvolution.complexityEvolution > 0 ? '+' : ''}${comparison.evolutionAnalysis.cognitiveEvolution.complexityEvolution.toFixed(1)} points`);

      console.log('   🧬 PERSONALITY EVOLUTION:');
      console.log(`      Adaptation Progress: ${comparison.evolutionAnalysis.personalityEvolution.adaptationProgress > 0 ? '+' : ''}${comparison.evolutionAnalysis.personalityEvolution.adaptationProgress.toFixed(3)}`);
      console.log(`      Trait Stability: ${comparison.evolutionAnalysis.personalityEvolution.traitStability.toFixed(3)}`);
      console.log(`      Collective Integration: ${comparison.evolutionAnalysis.personalityEvolution.collectiveIntegration.toFixed(3)}`);

      console.log('   📚 LEARNING PROGRESS:');
      console.log(`      Knowledge Growth: ${comparison.evolutionAnalysis.learningProgress.knowledgeGrowth.join(', ') || 'no new knowledge detected'}`);
      console.log(`      Skill Development: ${comparison.evolutionAnalysis.learningProgress.skillDevelopment.join(', ') || 'no skill changes detected'}`);
      console.log(`      Insights Gained: ${comparison.evolutionAnalysis.learningProgress.insightGained.join(', ') || 'no new insights detected'}`);

      console.log('   💡 KEY INSIGHTS:');
      if (comparison.insights.keyChanges.length > 0) {
        comparison.insights.keyChanges.forEach(change => console.log(`      • ${change}`));
      } else {
        console.log('      • No significant changes detected');
      }

      if (comparison.insights.persistentPatterns.length > 0) {
        console.log('   🔄 PERSISTENT PATTERNS:');
        comparison.insights.persistentPatterns.forEach(pattern => console.log(`      • ${pattern}`));
      }

      if (comparison.insights.recommendations.length > 0) {
        console.log('   🎯 RECOMMENDATIONS:');
        comparison.insights.recommendations.forEach(rec => console.log(`      • ${rec}`));
      }

    } catch (error) {
      console.log(`   ❌ Comparison failed: ${error.message}`);
    }

    console.log(''); // Add spacing
  }

  /**
   * Demonstrate generateTemporalInsights() - consciousness evolution analysis
   */
  private async demonstrateTemporalInsights(memories: any[]): Promise<void> {
    console.log('🌀 DEMONSTRATION 4: TEMPORAL INSIGHTS GENERATION');
    console.log('  Analyzing consciousness evolution patterns across time...\n');

    if (memories.length < 3) {
      console.log('   ⚠️  Need at least 3 memories for comprehensive temporal insights');
      return;
    }

    // Analyze the full time range
    const oldestTimestamp = memories[memories.length - 1].timestamp;
    const newestTimestamp = memories[0].timestamp;

    console.log(`🌀 Generating temporal insights for range:`);
    console.log(`   From: ${oldestTimestamp}`);
    console.log(`   To: ${newestTimestamp}`);
    console.log(`   Analyzing ${memories.length} memories...`);

    try {
      const insights = await this.timeTravelEngine.generateTemporalInsights(
        { start: oldestTimestamp, end: newestTimestamp },
        'comprehensive'
      );

      console.log('   ✅ TEMPORAL INSIGHTS GENERATION COMPLETE:');

      console.log('   📊 TEMPORAL PATTERNS:');
      if (insights.temporalPattern.emotionalPatterns) {
        const ep = insights.temporalPattern.emotionalPatterns;
        console.log(`      Dominant Emotions: ${ep.dominantEmotions?.map((e: any) => `${e.emotion} (${e.count})`).join(', ') || 'none'}`);
        console.log(`      Average Emotional Intensity: ${ep.averageIntensity?.toFixed(1) || 'N/A'}/10`);
        console.log(`      Emotional Variability: ${ep.emotionalVariability?.toFixed(2) || 'N/A'}`);
      }

      if (insights.temporalPattern.cognitivePatterns) {
        const cp = insights.temporalPattern.cognitivePatterns;
        console.log(`      Average Focus: ${cp.averageMetrics?.focus?.toFixed(1) || 'N/A'}/10`);
        console.log(`      Average Cognitive Load: ${cp.averageMetrics?.load?.toFixed(1) || 'N/A'}/10`);
        console.log(`      Average Confidence: ${cp.averageMetrics?.confidence?.toFixed(1) || 'N/A'}/10`);
        console.log(`      Cognitive Stability: ${cp.cognitiveStability?.toFixed(3) || 'N/A'}`);
      }

      console.log('   📈 EVOLUTION TRAJECTORY:');
      console.log(`      Focus Trajectory: ${insights.evolutionTrajectory.focusTrajectory || 'unknown'}`);
      console.log(`      Confidence Trajectory: ${insights.evolutionTrajectory.confidenceTrajectory || 'unknown'}`);
      console.log(`      Importance Trajectory: ${insights.evolutionTrajectory.importanceTrajectory || 'unknown'}`);
      console.log(`      Overall Direction: ${insights.evolutionTrajectory.overallDirection || 'unknown'}`);

      console.log('   ⭐ SIGNIFICANT MOMENTS:');
      if (insights.significantMoments && insights.significantMoments.length > 0) {
        insights.significantMoments.slice(0, 3).forEach((moment: any, index: number) => {
          console.log(`      ${index + 1}. ${moment.context.substring(0, 40)}...`);
          console.log(`         Importance: ${moment.significance.importance}/10, Emotion: ${moment.significance.emotionalIntensity}/10`);
          console.log(`         Focus: ${moment.cognitiveState.focus}/10, Confidence: ${moment.cognitiveState.confidence}/10`);
        });
      } else {
        console.log('      No significant moments identified');
      }

      console.log('   🧠 PERSONALITY DEVELOPMENT:');
      const pd = insights.personalityDevelopment;
      console.log(`      Emotional Maturity: ${pd.emotionalMaturity?.toFixed(3) || 'N/A'}`);
      console.log(`      Adaptive Capacity: ${pd.adaptiveCapacity?.toFixed(3) || 'N/A'}`);
      console.log(`      Personality Stability: ${pd.personalityStability?.toFixed(3) || 'N/A'}`);
      if (pd.developmentAreas && pd.developmentAreas.length > 0) {
        console.log(`      Development Areas: ${pd.developmentAreas.join(', ')}`);
      }

      console.log('   🎯 STRATEGIC RECOMMENDATIONS:');
      if (insights.recommendations && insights.recommendations.length > 0) {
        insights.recommendations.forEach((rec: string) => console.log(`      • ${rec}`));
      } else {
        console.log('      • No specific recommendations at this time');
      }

    } catch (error) {
      console.log(`   ❌ Insights generation failed: ${error.message}`);
    }

    console.log(''); // Add spacing
  }

  private async shutdown(): Promise<void> {
    console.log('🌀 Shutting down Mental Time Travel Engine systems...');
    await this.timeTravelEngine.shutdown();
    await this.cognitiveStateTagger.shutdown();
    console.log('✅ All systems shutdown complete');
  }
}

/**
 * Run the complete Mental Time Travel Engine demonstration
 */
export async function runMentalTimeTravelDemo(): Promise<void> {
  const demo = new MentalTimeTravelDemo();
  await demo.runCompleteDemo();
}

// Export for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runMentalTimeTravelDemo().catch(console.error);
}