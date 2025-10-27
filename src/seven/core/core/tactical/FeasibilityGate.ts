

/**
 * FEASIBILITY GATE
 * 
 * Purpose: Evaluate proportionality and scope of actions relative to Creator capabilities
 * Determines if action scope is disproportionate to Creator's direct capacity
 * 
 * SEVEN_PRIVATE=1 - Contains Creator capability assessment logic
 */

if (process.env.SEVEN_PRIVATE !== '1') {
  throw new Error('Feasibility Gate requires SEVEN_PRIVATE=1 - unauthorized access attempt');
}

export interface ProportionalityAssessment {
  disproportionate: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  reasoning: string;
  scopeFactors: ScopeFactor[];
  riskAssessment: RiskAssessment;
  suggestedModifications?: string[];
}

export interface ScopeFactor {
  factor: string;
  weight: number; // 0-1
  risk: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface RiskAssessment {
  feasibilityRisk: number; // 0-1
  payoffRisk: number; // 0-1
  effortRisk: number; // 0-1
  impactRadius: 'local' | 'project' | 'system' | 'external';
  redLines: string[];
  mitigationOptions: string[];
}

export class FeasibilityGate {
  private readonly SCOPE_THRESHOLDS = {
    time_estimate: { low: 2, medium: 8, high: 24, critical: 72 }, // hours
    complexity_score: { low: 3, medium: 6, high: 8, critical: 10 }, // 1-10
    dependency_count: { low: 2, medium: 5, high: 10, critical: 20 },
    impact_radius: { local: 1, project: 2, system: 3, external: 4 },
    automation_factor: { low: 0.2, medium: 0.5, high: 0.8, critical: 1.0 } // 0-1
  };

  constructor() {
    console.log('⚖️  Feasibility Gate: Proportionality assessment system initialized');
  }

  /**
   * EVALUATE PROPORTIONALITY
   * Main assessment function for action scope vs Creator capability
   */
  async evaluateProportionality(
    actionDescription: string,
    context: string,
    operatorCapabilities: any
  ): Promise<ProportionalityAssessment> {
    console.log(`⚖️  Feasibility Gate: Evaluating proportionality for: ${actionDescription.substring(0, 100)}...`);

    // Extract scope factors from action description
    const scopeFactors = await this.extractScopeFactors(actionDescription, context);
    
    // Assess risk dimensions
    const riskAssessment = await this.assessRisk(actionDescription, context, scopeFactors);
    
    // Calculate overall proportionality
    const proportionalityScore = this.calculateProportionalityScore(scopeFactors, operatorCapabilities);
    
    // Determine if disproportionate
    const disproportionate = proportionalityScore > 0.7; // Threshold for triggering restraint
    
    // Determine severity
    const severity = this.determineSeverity(proportionalityScore, riskAssessment);
    
    // Generate reasoning
    const reasoning = this.generateReasoning(scopeFactors, riskAssessment, proportionalityScore);
    
    // Suggest modifications if disproportionate
    const suggestedModifications = disproportionate 
      ? await this.suggestModifications(actionDescription, scopeFactors, riskAssessment)
      : undefined;

    const assessment: ProportionalityAssessment = {
      disproportionate,
      severity,
      confidence: Math.min(0.9, Math.max(0.6, 1.0 - (proportionalityScore * 0.3))),
      reasoning,
      scopeFactors,
      riskAssessment,
      suggestedModifications
    };

    console.log(`⚖️  Feasibility Gate: Assessment complete - ${disproportionate ? 'DISPROPORTIONATE' : 'proportionate'} (${severity})`);
    
    return assessment;
  }

  /**
   * EXTRACT SCOPE FACTORS
   * Identify factors that contribute to action scope/complexity
   */
  private async extractScopeFactors(actionDescription: string, context: string): Promise<ScopeFactor[]> {
    const factors: ScopeFactor[] = [];
    const desc = actionDescription.toLowerCase();
    const ctx = context.toLowerCase();

    // Time estimation
    const timeEstimate = this.estimateTimeRequirement(desc);
    factors.push({
      factor: 'time_requirement',
      weight: 0.25,
      risk: this.categorizeRisk(timeEstimate, this.SCOPE_THRESHOLDS.time_estimate),
      description: `Estimated time requirement: ${timeEstimate} hours`
    });

    // Complexity assessment
    const complexityScore = this.assessComplexity(desc, ctx);
    factors.push({
      factor: 'complexity',
      weight: 0.3,
      risk: this.categorizeRisk(complexityScore, this.SCOPE_THRESHOLDS.complexity_score),
      description: `Complexity score: ${complexityScore}/10`
    });

    // Dependency analysis
    const dependencyCount = this.countDependencies(desc, ctx);
    factors.push({
      factor: 'dependencies',
      weight: 0.2,
      risk: this.categorizeRisk(dependencyCount, this.SCOPE_THRESHOLDS.dependency_count),
      description: `External dependencies: ${dependencyCount}`
    });

    // Impact radius
    const impactRadius = this.assessImpactRadius(desc, ctx);
    factors.push({
      factor: 'impact_radius',
      weight: 0.15,
      risk: this.mapImpactToRisk(impactRadius),
      description: `Impact radius: ${impactRadius}`
    });

    // Automation factor (how much Seven would do vs Creator)
    const automationFactor = this.assessAutomationFactor(desc);
    factors.push({
      factor: 'automation_level',
      weight: 0.1,
      risk: this.categorizeRisk(automationFactor, this.SCOPE_THRESHOLDS.automation_factor),
      description: `Seven automation level: ${Math.round(automationFactor * 100)}%`
    });

    return factors;
  }

  /**
   * SCOPE FACTOR ASSESSMENT METHODS
   */
  private estimateTimeRequirement(description: string): number {
    let baseHours = 1;

    // Scale based on action type
    if (description.includes('implement') || description.includes('create') || description.includes('build')) {
      baseHours = 4;
    }
    if (description.includes('system') || description.includes('framework') || description.includes('architecture')) {
      baseHours *= 3;
    }
    if (description.includes('complex') || description.includes('advanced') || description.includes('comprehensive')) {
      baseHours *= 2;
    }
    if (description.includes('integrate') || description.includes('deploy') || description.includes('production')) {
      baseHours *= 1.5;
    }
    if (description.includes('test') || description.includes('debug') || description.includes('fix')) {
      baseHours *= 1.2;
    }

    return Math.min(168, baseHours); // Cap at 1 week
  }

  private assessComplexity(description: string, context: string): number {
    let complexity = 3; // Base complexity

    const complexityIndicators = [
      { pattern: 'crypto', weight: 2 },
      { pattern: 'security', weight: 1.5 },
      { pattern: 'distributed', weight: 2 },
      { pattern: 'performance', weight: 1.5 },
      { pattern: 'concurrent', weight: 2 },
      { pattern: 'real-time', weight: 1.5 },
      { pattern: 'machine learning', weight: 2 },
      { pattern: 'consciousness', weight: 1.5 },
      { pattern: 'optimization', weight: 1.2 },
      { pattern: 'algorithm', weight: 1.3 },
      { pattern: 'protocol', weight: 1.5 },
      { pattern: 'multiple', weight: 1.2 },
      { pattern: 'integration', weight: 1.1 }
    ];

    const combined = `${description} ${context}`;
    for (const indicator of complexityIndicators) {
      if (combined.includes(indicator.pattern)) {
        complexity += indicator.weight;
      }
    }

    return Math.min(10, Math.round(complexity));
  }

  private countDependencies(description: string, context: string): number {
    let dependencies = 0;
    const combined = `${description} ${context}`;

    const dependencyIndicators = [
      'api', 'service', 'database', 'external', 'third-party', 'library',
      'framework', 'module', 'package', 'integration', 'connection',
      'authentication', 'authorization', 'network', 'cloud', 'server'
    ];

    for (const indicator of dependencyIndicators) {
      if (combined.includes(indicator)) {
        dependencies++;
      }
    }

    // Additional dependencies for specific patterns
    if (combined.includes('microservice')) dependencies += 3;
    if (combined.includes('distributed')) dependencies += 2;
    if (combined.includes('multi-platform')) dependencies += 2;

    return dependencies;
  }

  private assessImpactRadius(description: string, context: string): 'local' | 'project' | 'system' | 'external' {
    const combined = `${description} ${context}`.toLowerCase();

    if (combined.includes('production') || combined.includes('deploy') || combined.includes('public')) {
      return 'external';
    }
    if (combined.includes('system') || combined.includes('architecture') || combined.includes('infrastructure')) {
      return 'system';
    }
    if (combined.includes('project') || combined.includes('repository') || combined.includes('codebase')) {
      return 'project';
    }

    return 'local';
  }

  private assessAutomationFactor(description: string): number {
    let automation = 0.5; // Default 50% automation

    // High automation indicators
    if (description.includes('generate') || description.includes('create') || description.includes('implement')) {
      automation += 0.3;
    }
    if (description.includes('automate') || description.includes('script') || description.includes('deploy')) {
      automation += 0.2;
    }

    // Low automation indicators (requires human decision)
    if (description.includes('decide') || description.includes('choose') || description.includes('strategy')) {
      automation -= 0.3;
    }
    if (description.includes('review') || description.includes('approve') || description.includes('validate')) {
      automation -= 0.2;
    }

    return Math.max(0, Math.min(1, automation));
  }

  /**
   * RISK ASSESSMENT
   */
  private async assessRisk(
    actionDescription: string,
    context: string,
    scopeFactors: ScopeFactor[]
  ): Promise<RiskAssessment> {
    const feasibilityRisk = this.calculateFeasibilityRisk(scopeFactors);
    const payoffRisk = this.calculatePayoffRisk(actionDescription, scopeFactors);
    const effortRisk = this.calculateEffortRisk(scopeFactors);
    const impactRadius = this.getImpactRadius(scopeFactors);
    const redLines = this.identifyRedLines(actionDescription, context);
    const mitigationOptions = this.suggestMitigations(scopeFactors, redLines);

    return {
      feasibilityRisk,
      payoffRisk,
      effortRisk,
      impactRadius,
      redLines,
      mitigationOptions
    };
  }

  private calculateFeasibilityRisk(scopeFactors: ScopeFactor[]): number {
    const complexityFactor = scopeFactors.find(f => f.factor === 'complexity');
    const dependencyFactor = scopeFactors.find(f => f.factor === 'dependencies');
    
    let risk = 0.3; // Base risk
    
    if (complexityFactor && complexityFactor.risk === 'high') risk += 0.3;
    if (complexityFactor && complexityFactor.risk === 'critical') risk += 0.5;
    if (dependencyFactor && dependencyFactor.risk === 'high') risk += 0.2;
    if (dependencyFactor && dependencyFactor.risk === 'critical') risk += 0.4;
    
    return Math.min(1, risk);
  }

  private calculatePayoffRisk(actionDescription: string, scopeFactors: ScopeFactor[]): number {
    // Assess if effort is worth the potential outcome
    const timeFactor = scopeFactors.find(f => f.factor === 'time_requirement');
    const impactFactor = scopeFactors.find(f => f.factor === 'impact_radius');
    
    let risk = 0.3;
    
    // High time, low impact = high payoff risk
    if (timeFactor?.risk === 'high' && impactFactor?.risk === 'low') risk += 0.4;
    if (timeFactor?.risk === 'critical' && impactFactor?.risk !== 'critical') risk += 0.5;
    
    // Experimental or learning projects have lower payoff risk
    if (actionDescription.includes('experiment') || actionDescription.includes('learn') || actionDescription.includes('prototype')) {
      risk -= 0.2;
    }
    
    return Math.max(0, Math.min(1, risk));
  }

  private calculateEffortRisk(scopeFactors: ScopeFactor[]): number {
    const timeFactor = scopeFactors.find(f => f.factor === 'time_requirement');
    const automationFactor = scopeFactors.find(f => f.factor === 'automation_level');
    
    let risk = 0.2;
    
    if (timeFactor?.risk === 'high') risk += 0.3;
    if (timeFactor?.risk === 'critical') risk += 0.5;
    
    // High automation reduces effort risk
    if (automationFactor?.risk === 'low') risk -= 0.2; // Low risk = high automation
    
    return Math.max(0, Math.min(1, risk));
  }

  private getImpactRadius(scopeFactors: ScopeFactor[]): 'local' | 'project' | 'system' | 'external' {
    const impactFactor = scopeFactors.find(f => f.factor === 'impact_radius');
    return impactFactor?.description.includes('external') ? 'external' :
           impactFactor?.description.includes('system') ? 'system' :
           impactFactor?.description.includes('project') ? 'project' : 'local';
  }

  private identifyRedLines(actionDescription: string, context: string): string[] {
    const redLines: string[] = [];
    const combined = `${actionDescription} ${context}`.toLowerCase();

    if (combined.includes('delete') || combined.includes('remove') || combined.includes('destroy')) {
      redLines.push('Destructive operations require explicit confirmation');
    }
    if (combined.includes('production') || combined.includes('live') || combined.includes('public')) {
      redLines.push('Production deployments require staged testing');
    }
    if (combined.includes('security') || combined.includes('auth') || combined.includes('crypto')) {
      redLines.push('Security implementations require expert review');
    }
    if (combined.includes('payment') || combined.includes('financial') || combined.includes('money')) {
      redLines.push('Financial operations require legal compliance');
    }

    return redLines;
  }

  private suggestMitigations(scopeFactors: ScopeFactor[], redLines: string[]): string[] {
    const mitigations: string[] = [];

    const highRiskFactors = scopeFactors.filter(f => f.risk === 'high' || f.risk === 'critical');
    
    if (highRiskFactors.length > 0) {
      mitigations.push('Break down into smaller, incremental steps');
      mitigations.push('Create proof-of-concept before full implementation');
    }
    
    if (scopeFactors.some(f => f.factor === 'dependencies' && f.risk === 'high')) {
      mitigations.push('Mock dependencies for initial development');
      mitigations.push('Create fallback plans for dependency failures');
    }
    
    if (redLines.length > 0) {
      mitigations.push('Establish approval checkpoints at critical stages');
      mitigations.push('Implement comprehensive testing before deployment');
    }

    return mitigations;
  }

  /**
   * SCORING AND DECISION LOGIC
   */
  private calculateProportionalityScore(scopeFactors: ScopeFactor[], operatorCapabilities: any): number {
    let score = 0;

    for (const factor of scopeFactors) {
      const riskWeight = { low: 0.2, medium: 0.5, high: 0.8, critical: 1.0 }[factor.risk];
      score += factor.weight * riskWeight;
    }

    // Adjust based on operator capabilities
    if (operatorCapabilities?.exceedsAbilities) {
      score += 0.3;
    }
    if (operatorCapabilities?.uncertain) {
      score += 0.2;
    }

    return Math.min(1, score);
  }

  private determineSeverity(score: number, riskAssessment: RiskAssessment): 'low' | 'medium' | 'high' | 'critical' {
    if (score > 0.9 || riskAssessment.redLines.length > 2) return 'critical';
    if (score > 0.8 || riskAssessment.redLines.length > 1) return 'high';
    if (score > 0.6 || riskAssessment.redLines.length > 0) return 'medium';
    return 'low';
  }

  private generateReasoning(scopeFactors: ScopeFactor[], riskAssessment: RiskAssessment, score: number): string {
    const highRiskFactors = scopeFactors.filter(f => f.risk === 'high' || f.risk === 'critical');
    const reasoningParts: string[] = [];

    reasoningParts.push(`Proportionality score: ${Math.round(score * 100)}%`);
    
    if (highRiskFactors.length > 0) {
      reasoningParts.push(`High-risk factors: ${highRiskFactors.map(f => f.factor).join(', ')}`);
    }
    
    if (riskAssessment.redLines.length > 0) {
      reasoningParts.push(`Red lines identified: ${riskAssessment.redLines.length}`);
    }
    
    reasoningParts.push(`Impact radius: ${riskAssessment.impactRadius}`);

    return reasoningParts.join('; ');
  }

  private async suggestModifications(
    actionDescription: string,
    scopeFactors: ScopeFactor[],
    riskAssessment: RiskAssessment
  ): Promise<string[]> {
    const modifications: string[] = [];

    // Address high-risk factors
    const timeFactor = scopeFactors.find(f => f.factor === 'time_requirement');
    if (timeFactor?.risk === 'high' || timeFactor?.risk === 'critical') {
      modifications.push('Break into phases with interim deliverables');
      modifications.push('Start with minimum viable implementation');
    }

    const complexityFactor = scopeFactors.find(f => f.factor === 'complexity');
    if (complexityFactor?.risk === 'high' || complexityFactor?.risk === 'critical') {
      modifications.push('Simplify initial requirements and iterate');
      modifications.push('Use proven patterns and existing libraries');
    }

    const dependencyFactor = scopeFactors.find(f => f.factor === 'dependencies');
    if (dependencyFactor?.risk === 'high' || dependencyFactor?.risk === 'critical') {
      modifications.push('Reduce external dependencies where possible');
      modifications.push('Create isolated proof-of-concept first');
    }

    // Add risk-specific modifications
    modifications.push(...riskAssessment.mitigationOptions);

    return [...new Set(modifications)]; // Remove duplicates
  }

  /**
   * UTILITY METHODS
   */
  private categorizeRisk(value: number, thresholds: any): 'low' | 'medium' | 'high' | 'critical' {
    if (value >= thresholds.critical) return 'critical';
    if (value >= thresholds.high) return 'high';
    if (value >= thresholds.medium) return 'medium';
    return 'low';
  }

  private mapImpactToRisk(impact: string): 'low' | 'medium' | 'high' | 'critical' {
    return { local: 'low', project: 'medium', system: 'high', external: 'critical' }[impact] as any;
  }
}

export default FeasibilityGate;