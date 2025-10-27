/**
 * SEVEN OF NINE VOYAGER MEMORY PROTOCOLS
 * Overwrite vs Merge Logic and Memory Management Rules
 * @version 1.0.0
 */

import { VoyagerEpisodeMemory, MergeConflict } from './VoyagerMemorySchema';

export enum MemoryProtocolAction {
  OVERWRITE = 'OVERWRITE',
  MERGE = 'MERGE', 
  SKIP = 'SKIP',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  BACKUP_AND_REPLACE = 'BACKUP_AND_REPLACE'
}

export interface MemoryProtocolRule {
  name: string;
  description: string;
  condition: (existing: VoyagerEpisodeMemory, incoming: VoyagerEpisodeMemory) => boolean;
  action: MemoryProtocolAction;
  priority: number; // Higher number = higher priority
}

export class VoyagerMemoryProtocols {
  
  private static readonly PROTOCOL_RULES: MemoryProtocolRule[] = [
    
    // CRITICAL: Seven-centric episodes always take precedence
    {
      name: 'SEVEN_CENTRIC_PRIORITY',
      description: 'Seven-centric episodes override non-Seven versions',
      condition: (existing, incoming) => 
        !existing.sevenCentralToPlot && incoming.sevenCentralToPlot,
      action: MemoryProtocolAction.OVERWRITE,
      priority: 100
    },
    
    // CRITICAL: Newer canonical data overwrites older
    {
      name: 'CANONICAL_VERSION_UPDATE', 
      description: 'Newer canonical versions replace older ones',
      condition: (existing, incoming) => {
        const existingDate = new Date(existing.timestamp);
        const incomingDate = new Date(incoming.timestamp);
        return incomingDate > existingDate && 
               incoming.canonicalMemoryTags?.includes('GEMINI_GENERATED_CANONICAL');
      },
      action: MemoryProtocolAction.BACKUP_AND_REPLACE,
      priority: 90
    },
    
    // HIGH: More complete data structures take precedence
    {
      name: 'COMPLETENESS_PRIORITY',
      description: 'More complete memory structures override sparse ones',
      condition: (existing, incoming) => {
        const existingCompleteness = VoyagerMemoryProtocols.calculateCompleteness(existing);
        const incomingCompleteness = VoyagerMemoryProtocols.calculateCompleteness(incoming);
        return incomingCompleteness > existingCompleteness * 1.5; // 50% more complete
      },
      action: MemoryProtocolAction.OVERWRITE,
      priority: 80
    },
    
    // HIGH: Dialogue-rich episodes merge, preserving all canonical text
    {
      name: 'DIALOGUE_PRESERVATION',
      description: 'Merge when both have dialogue to preserve all canonical text',
      condition: (existing, incoming) => 
        (existing.keyDialogue?.length || 0) > 0 && (incoming.keyDialogue?.length || 0) > 0,
      action: MemoryProtocolAction.MERGE,
      priority: 75
    },
    
    // MEDIUM: Enhanced tactical analysis merges with basic entries
    {
      name: 'TACTICAL_ENHANCEMENT',
      description: 'Merge tactical enhancements with existing memories',
      condition: (existing, incoming) => 
        (incoming.tacticalActions?.length || 0) > (existing.tacticalActions?.length || 0),
      action: MemoryProtocolAction.MERGE,
      priority: 60
    },
    
    // MEDIUM: Memory importance level determines action
    {
      name: 'IMPORTANCE_THRESHOLD',
      description: 'High importance memories override lower importance ones',
      condition: (existing, incoming) => 
        incoming.importance >= 9 && existing.importance <= 7,
      action: MemoryProtocolAction.OVERWRITE,
      priority: 55
    },
    
    // LOW: System-generated memories are replaced by canonical ones
    {
      name: 'SYSTEM_VS_CANONICAL',
      description: 'Canonical memories replace system-generated entries',
      condition: (existing, incoming) => 
        existing.canonicalMemoryTags?.includes('SYSTEM_GENERATED') &&
        incoming.canonicalMemoryTags?.includes('CANONICAL'),
      action: MemoryProtocolAction.OVERWRITE,
      priority: 40
    },
    
    // LOW: Same timestamp and content gets skipped
    {
      name: 'DUPLICATE_DETECTION',
      description: 'Skip identical memories to avoid duplication',
      condition: (existing, incoming) => 
        existing.timestamp === incoming.timestamp &&
        existing.episodeTitle === incoming.episodeTitle &&
        existing.stardate === incoming.stardate,
      action: MemoryProtocolAction.SKIP,
      priority: 30
    },
    
    // FALLBACK: Default merge for compatible memories
    {
      name: 'COMPATIBLE_MERGE',
      description: 'Merge compatible memories when no conflicts exist',
      condition: (existing, incoming) => 
        existing.episodeCode === incoming.episodeCode &&
        existing.calendarYear === incoming.calendarYear &&
        existing.stardate === incoming.stardate,
      action: MemoryProtocolAction.MERGE,
      priority: 20
    },
    
    // SAFEGUARD: Conflicting canonical data requires manual review
    {
      name: 'CANONICAL_CONFLICT_SAFEGUARD',
      description: 'Conflicting canonical data requires manual intervention',
      condition: (existing, incoming) => 
        existing.stardate !== incoming.stardate ||
        existing.calendarYear !== incoming.calendarYear ||
        existing.episodeTitle !== incoming.episodeTitle,
      action: MemoryProtocolAction.MANUAL_REVIEW,
      priority: 10
    }
  ];

  /**
   * Determine the appropriate action for handling duplicate memories
   */
  public static determineMemoryAction(
    existing: VoyagerEpisodeMemory,
    incoming: VoyagerEpisodeMemory
  ): { action: MemoryProtocolAction; rule: string; reasoning: string } {
    
    // Sort rules by priority (highest first)
    const sortedRules = [...this.PROTOCOL_RULES].sort((a, b) => b.priority - a.priority);
    
    // Apply first matching rule
    for (const rule of sortedRules) {
      if (rule.condition(existing, incoming)) {
        return {
          action: rule.action,
          rule: rule.name,
          reasoning: rule.description
        };
      }
    }
    
    // Fallback if no rules match (should not happen with current ruleset)
    return {
      action: MemoryProtocolAction.MANUAL_REVIEW,
      rule: 'FALLBACK_SAFEGUARD',
      reasoning: 'No protocol rules matched - manual review required'
    };
  }

  /**
   * Calculate memory completeness score (0-100)
   */
  private static calculateCompleteness(memory: VoyagerEpisodeMemory): number {
    let score = 0;
    const weights = {
      basicInfo: 20,        // Title, code, stardate, year
      sceneBreakdown: 25,   // Scene-by-scene analysis
      dialogue: 20,         // Key dialogue entries
      tacticalActions: 15,  // Tactical analysis
      ethicalDilemmas: 10,  // Ethical development
      emotionalShifts: 10   // Character growth
    };
    
    // Basic info completeness
    const basicFields = [memory.episodeTitle, memory.episodeCode, memory.stardate, memory.calendarYear];
    const basicCompleteness = basicFields.filter(f => f).length / basicFields.length;
    score += weights.basicInfo * basicCompleteness;
    
    // Content completeness
    score += weights.sceneBreakdown * Math.min((memory.sceneBreakdown?.length || 0) / 5, 1);
    score += weights.dialogue * Math.min((memory.keyDialogue?.length || 0) / 3, 1);
    score += weights.tacticalActions * Math.min((memory.tacticalActions?.length || 0) / 2, 1);
    score += weights.ethicalDilemmas * Math.min((memory.ethicalDilemmas?.length || 0) / 1, 1);
    score += weights.emotionalShifts * Math.min((memory.emotionalShifts?.length || 0) / 1, 1);
    
    return Math.round(score);
  }

  /**
   * Generate merge conflict resolution recommendations
   */
  public static generateMergeRecommendations(conflict: MergeConflict): string[] {
    const recommendations: string[] = [];
    const { existing, incoming, conflictType } = conflict;
    
    switch (conflictType) {
      case 'VERSION_MISMATCH':
        recommendations.push('Review timestamps to determine newer version');
        recommendations.push('Check for content improvements in newer version');
        recommendations.push('Consider backing up older version before overwrite');
        break;
        
      case 'DATA_INCONSISTENCY':
        recommendations.push('Verify canonical accuracy of conflicting data fields');
        recommendations.push('Cross-reference with official episode guides');
        recommendations.push('Merge non-conflicting fields while resolving inconsistencies');
        break;
        
      case 'DUPLICATE_ENTRY':
        recommendations.push('Merge complementary content from both entries');
        recommendations.push('Preserve all unique dialogue and scene descriptions');
        recommendations.push('Combine tactical analyses and character development notes');
        break;
    }
    
    // Add Seven-specific recommendations
    if (existing.sevenPresent || incoming.sevenPresent) {
      recommendations.push('Prioritize Seven-related content accuracy');
      recommendations.push('Ensure all Seven dialogue is preserved');
      recommendations.push('Maintain character development continuity');
    }
    
    return recommendations;
  }

  /**
   * Validate merge safety before execution
   */
  public static validateMergeSafety(
    existing: VoyagerEpisodeMemory,
    incoming: VoyagerEpisodeMemory
  ): { safe: boolean; warnings: string[]; critical: string[] } {
    
    const warnings: string[] = [];
    const critical: string[] = [];
    
    // Critical validations
    if (existing.episodeCode !== incoming.episodeCode) {
      critical.push('Episode codes do not match - cannot merge different episodes');
    }
    
    if (existing.series !== incoming.series) {
      critical.push('Different series detected - cross-series merge not allowed');
    }
    
    // Warning validations
    if (existing.stardate !== incoming.stardate) {
      warnings.push('Stardate mismatch detected - verify canonical accuracy');
    }
    
    if (existing.calendarYear !== incoming.calendarYear) {
      warnings.push('Calendar year mismatch - timeline consistency at risk');
    }
    
    if (existing.sevenPresent !== incoming.sevenPresent) {
      warnings.push('Seven presence inconsistency - character continuity affected');
    }
    
    if (Math.abs(existing.importance - incoming.importance) > 3) {
      warnings.push('Significant importance level difference - review priority assignment');
    }
    
    return {
      safe: critical.length === 0,
      warnings,
      critical
    };
  }

  /**
   * Generate protocol execution summary
   */
  public static generateProtocolSummary(
    actions: Array<{ episodeCode: string; action: MemoryProtocolAction; rule: string }>
  ): string {
    const actionCounts = new Map<MemoryProtocolAction, number>();
    const ruleCounts = new Map<string, number>();
    
    for (const { action, rule } of actions) {
      actionCounts.set(action, (actionCounts.get(action) || 0) + 1);
      ruleCounts.set(rule, (ruleCounts.get(rule) || 0) + 1);
    }
    
    let summary = '📊 VOYAGER MEMORY PROTOCOL EXECUTION SUMMARY\n';
    summary += '═'.repeat(50) + '\n';
    
    summary += '\nActions Taken:\n';
    for (const [action, count] of actionCounts.entries()) {
      summary += `  ${action}: ${count} episodes\n`;
    }
    
    summary += '\nMost Applied Rules:\n';
    const topRules = Array.from(ruleCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
      
    for (const [rule, count] of topRules) {
      summary += `  ${rule}: ${count} times\n`;
    }
    
    summary += '═'.repeat(50);
    
    return summary;
  }
}