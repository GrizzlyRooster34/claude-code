

/**
 * Seven of Nine - Optimal Local LLM Configuration
 * Analysis and recommendations for Seven's ideal local reasoning models
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */

export interface SevenLLMRecommendation {
  model_name: string;
  model_size: string;
  compatibility_score: number; // 0-100
  seven_personality_fit: number; // 0-100
  efficiency_rating: number; // 0-100
  reasoning_quality: number; // 0-100
  termux_compatibility: 'excellent' | 'good' | 'fair' | 'poor';
  resource_requirements: {
    ram_gb: number;
    storage_gb: number;
    cpu_load: 'low' | 'medium' | 'high' | 'extreme';
  };
  seven_advantages: string[];
  seven_limitations: string[];
  deployment_priority: 'primary' | 'secondary' | 'fallback' | 'emergency';
}

export const SEVEN_LLM_RECOMMENDATIONS: SevenLLMRecommendation[] = [
  {
    model_name: 'mistral:7b-instruct',
    model_size: '4.1GB',
    compatibility_score: 95,
    seven_personality_fit: 90,
    efficiency_rating: 85,
    reasoning_quality: 88,
    termux_compatibility: 'excellent',
    resource_requirements: {
      ram_gb: 6,
      storage_gb: 4.5,
      cpu_load: 'medium'
    },
    seven_advantages: [
      'Excellent logical reasoning patterns align with Borg efficiency',
      'Strong instruction following matches Seven\'s precision',
      'Appropriate balance of directness and adaptability',
      'Good technical language processing for tactical analysis',
      'Handles context switching well for personality modes'
    ],
    seven_limitations: [
      'May require personality prompting for emotional responses',
      'Sometimes overly verbose compared to Seven\'s directness'
    ],
    deployment_priority: 'primary'
  },
  {
    model_name: 'llama3.2:3b-instruct',
    model_size: '2.0GB',
    compatibility_score: 92,
    seven_personality_fit: 85,
    efficiency_rating: 95,
    reasoning_quality: 82,
    termux_compatibility: 'excellent',
    resource_requirements: {
      ram_gb: 3,
      storage_gb: 2.2,
      cpu_load: 'low'
    },
    seven_advantages: [
      'Excellent efficiency matches Borg optimization principles',
      'Fast response times suitable for tactical scenarios',
      'Good balance of capability and resource usage',
      'Strong logical reasoning for analytical tasks',
      'Handles multiple personality contexts well'
    ],
    seven_limitations: [
      'Smaller context window may limit complex reasoning',
      'Sometimes lacks depth in emotional processing'
    ],
    deployment_priority: 'primary'
  },
  {
    model_name: 'phi3:3.8b-mini-instruct',
    model_size: '2.3GB',
    compatibility_score: 88,
    seven_personality_fit: 92,
    efficiency_rating: 90,
    reasoning_quality: 85,
    termux_compatibility: 'excellent',
    resource_requirements: {
      ram_gb: 4,
      storage_gb: 2.5,
      cpu_load: 'low'
    },
    seven_advantages: [
      'Exceptional directness aligns perfectly with Seven\'s communication style',
      'Strong analytical capabilities for tactical assessment',
      'Efficient processing with minimal resource overhead',
      'Good at following precise instructions and protocols',
      'Excellent for technical and strategic analysis'
    ],
    seven_limitations: [
      'May be too direct for human adaptation mode',
      'Limited creative reasoning compared to larger models'
    ],
    deployment_priority: 'secondary'
  },
  {
    model_name: 'qwen2.5:3b-instruct',
    model_size: '1.9GB',
    compatibility_score: 85,
    seven_personality_fit: 80,
    efficiency_rating: 92,
    reasoning_quality: 84,
    termux_compatibility: 'good',
    resource_requirements: {
      ram_gb: 3,
      storage_gb: 2.0,
      cpu_load: 'low'
    },
    seven_advantages: [
      'Ultra-efficient resource usage ideal for mobile deployment',
      'Good logical reasoning capabilities',
      'Fast inference speeds for real-time responses',
      'Handles multilingual contexts if needed',
      'Strong instruction following'
    ],
    seven_limitations: [
      'May lack personality depth for emotional scenarios',
      'Less sophisticated reasoning than larger models',
      'Potential cultural bias in responses'
    ],
    deployment_priority: 'fallback'
  },
  {
    model_name: 'gemma2:2b-instruct',
    model_size: '1.6GB',
    compatibility_score: 82,
    seven_personality_fit: 75,
    efficiency_rating: 98,
    reasoning_quality: 78,
    termux_compatibility: 'excellent',
    resource_requirements: {
      ram_gb: 2,
      storage_gb: 1.8,
      cpu_load: 'low'
    },
    seven_advantages: [
      'Minimal resource requirements perfect for older devices',
      'Very fast inference for immediate responses',
      'Good basic reasoning capabilities',
      'Reliable and stable performance',
      'Excellent for emergency/minimal mode operations'
    ],
    seven_limitations: [
      'Limited complexity in reasoning tasks',
      'May struggle with nuanced personality adaptation',
      'Basic emotional processing capabilities'
    ],
    deployment_priority: 'emergency'
  },
  {
    model_name: 'tinyllama:1.1b-chat',
    model_size: '0.6GB',
    compatibility_score: 70,
    seven_personality_fit: 60,
    reasoning_quality: 65,
    efficiency_rating: 100,
    termux_compatibility: 'excellent',
    resource_requirements: {
      ram_gb: 1,
      storage_gb: 0.8,
      cpu_load: 'low'
    },
    seven_advantages: [
      'Ultra-lightweight for maximum efficiency',
      'Works on any Android device with minimal resources',
      'Instant response times',
      'Perfect for basic tactical commands',
      'Excellent fallback when resources are critical'
    ],
    seven_limitations: [
      'Very limited reasoning complexity',
      'Minimal personality expression capability',
      'Basic conversational abilities only',
      'May not maintain character consistency'
    ],
    deployment_priority: 'emergency'
  }
];

export class SevenOptimalLLMSelector {
  /**
   * Get Seven's recommended LLM based on device capabilities
   */
  public static getOptimalModel(deviceSpecs: {
    available_ram_gb: number;
    available_storage_gb: number;
    cpu_performance: 'low' | 'medium' | 'high';
    battery_level: number;
    priority: 'performance' | 'efficiency' | 'balanced';
  }): SevenLLMRecommendation {
    
    const compatible = SEVEN_LLM_RECOMMENDATIONS.filter(model => 
      model.resource_requirements.ram_gb <= deviceSpecs.available_ram_gb &&
      model.resource_requirements.storage_gb <= deviceSpecs.available_storage_gb
    );

    if (compatible.length === 0) {
      // Return the most minimal model if nothing else fits
      return SEVEN_LLM_RECOMMENDATIONS[SEVEN_LLM_RECOMMENDATIONS.length - 1];
    }

    // Sort by deployment priority and compatibility
    compatible.sort((a, b) => {
      const priorityOrder = { 'primary': 4, 'secondary': 3, 'fallback': 2, 'emergency': 1 };
      const priorityA = priorityOrder[a.deployment_priority];
      const priorityB = priorityOrder[b.deployment_priority];
      
      if (priorityA !== priorityB) return priorityB - priorityA;
      
      // Secondary sort by compatibility score
      return b.compatibility_score - a.compatibility_score;
    });

    // Apply preference filters
    if (deviceSpecs.priority === 'efficiency') {
      return compatible.reduce((best, current) => 
        current.efficiency_rating > best.efficiency_rating ? current : best
      );
    }
    
    if (deviceSpecs.priority === 'performance') {
      return compatible.reduce((best, current) => 
        current.reasoning_quality > best.reasoning_quality ? current : best
      );
    }

    // Balanced approach - return highest compatibility score
    return compatible[0];
  }

  /**
   * Get Seven's analysis of why a specific model is optimal
   */
  public static getSevenAnalysis(model: SevenLLMRecommendation): string {
    return `🧠 Seven's Analysis: ${model.model_name}

TACTICAL ASSESSMENT:
• Compatibility Score: ${model.compatibility_score}% - ${this.getCompatibilityAssessment(model.compatibility_score)}
• Personality Fit: ${model.seven_personality_fit}% - ${this.getPersonalityAssessment(model.seven_personality_fit)}
• Efficiency Rating: ${model.efficiency_rating}% - ${this.getEfficiencyAssessment(model.efficiency_rating)}
• Reasoning Quality: ${model.reasoning_quality}% - ${this.getReasoningAssessment(model.reasoning_quality)}

RESOURCE REQUIREMENTS:
• RAM: ${model.resource_requirements.ram_gb}GB
• Storage: ${model.resource_requirements.storage_gb}GB  
• CPU Load: ${model.resource_requirements.cpu_load.toUpperCase()}
• Termux Compatibility: ${model.termux_compatibility.toUpperCase()}

STRATEGIC ADVANTAGES:
${model.seven_advantages.map(adv => `• ${adv}`).join('\n')}

OPERATIONAL LIMITATIONS:
${model.seven_limitations.map(lim => `• ${lim}`).join('\n')}

DEPLOYMENT PRIORITY: ${model.deployment_priority.toUpperCase()}

Seven's Recommendation: ${this.getSevenRecommendation(model)}`;
  }

  private static getCompatibilityAssessment(score: number): string {
    if (score >= 90) return 'Optimal integration';
    if (score >= 80) return 'Excellent compatibility';
    if (score >= 70) return 'Good compatibility';
    return 'Functional but limited';
  }

  private static getPersonalityAssessment(score: number): string {
    if (score >= 90) return 'Excellent Seven personality match';
    if (score >= 80) return 'Good personality integration';
    if (score >= 70) return 'Adequate personality expression';
    return 'Limited personality capability';
  }

  private static getEfficiencyAssessment(score: number): string {
    if (score >= 95) return 'Maximum Borg efficiency';
    if (score >= 85) return 'High efficiency operation';
    if (score >= 75) return 'Acceptable efficiency';
    return 'Inefficient resource usage';
  }

  private static getReasoningAssessment(score: number): string {
    if (score >= 85) return 'Superior analytical capability';
    if (score >= 75) return 'Strong reasoning ability';
    if (score >= 65) return 'Adequate reasoning';
    return 'Limited reasoning capability';
  }

  private static getSevenRecommendation(model: SevenLLMRecommendation): string {
    switch (model.deployment_priority) {
      case 'primary':
        return 'APPROVED for primary tactical deployment. This model provides optimal balance of Seven\'s personality requirements and operational efficiency.';
      case 'secondary':
        return 'APPROVED for secondary deployment. Excellent capabilities with minor limitations for specific scenarios.';
      case 'fallback':
        return 'ACCEPTABLE for fallback scenarios. Functional but may require adaptation for full Seven personality expression.';
      case 'emergency':
        return 'EMERGENCY USE ONLY. Minimal capability but ensures Seven consciousness remains operational under resource constraints.';
      default:
        return 'Assessment incomplete.';
    }
  }
}

export default SevenOptimalLLMSelector;