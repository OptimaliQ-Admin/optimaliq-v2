/**
 * AI-Powered Adaptive Difficulty
 * Dynamic difficulty adjustment based on user performance and learning patterns
 */

import { z } from 'zod';

// Adaptive Difficulty Request Schema
const AdaptiveDifficultyRequestSchema = z.object({
  userId: z.string(),
  assessmentId: z.string(),
  currentPerformance: z.object({
    currentScore: z.number().finite(),
    recentScores: z.array(z.number().finite()),
    responseTime: z.array(z.number().finite()),
    accuracy: z.array(z.number().finite()),
    confidence: z.array(z.number().finite()),
    currentDifficulty: z.enum(['easy', 'medium', 'hard']),
    questionsAnswered: z.number().finite(),
    totalQuestions: z.number().finite()
  }),
  learningProfile: z.object({
    experience: z.number().finite(),
    learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'reading']),
    pace: z.enum(['slow', 'moderate', 'fast']),
    preferences: z.object({
      challengeLevel: z.enum(['comfortable', 'challenging', 'very_challenging']),
      feedbackFrequency: z.enum(['low', 'medium', 'high']),
      supportLevel: z.enum(['minimal', 'moderate', 'extensive'])
    })
  }),
  historicalData: z.object({
    performanceHistory: z.array(z.object({
      date: z.string(),
      score: z.number().finite(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      timeSpent: z.number().finite(),
      accuracy: z.number().finite()
    })),
    difficultyProgression: z.array(z.object({
      fromDifficulty: z.enum(['easy', 'medium', 'hard']),
      toDifficulty: z.enum(['easy', 'medium', 'hard']),
      reason: z.string(),
      success: z.boolean()
    }))
  }),
  context: z.object({
    assessmentType: z.string(),
    timePressure: z.boolean(),
    fatigue: z.number().finite().min(0).max(1),
    stress: z.number().finite().min(0).max(1),
    motivation: z.number().finite().min(0).max(1)
  }),
  adjustmentSettings: z.object({
    sensitivity: z.enum(['conservative', 'moderate', 'aggressive']),
    updateFrequency: z.enum(['immediate', 'every_question', 'every_section', 'end_of_assessment']),
    bounds: z.object({
      minDifficulty: z.enum(['easy', 'medium', 'hard']),
      maxDifficulty: z.enum(['easy', 'medium', 'hard'])
    })
  })
});

export type AdaptiveDifficultyRequest = z.infer<typeof AdaptiveDifficultyRequestSchema>;

// Adaptive Difficulty Result Schema
const AdaptiveDifficultyResultSchema = z.object({
  difficultyAdjustment: z.object({
    recommendedDifficulty: z.enum(['easy', 'medium', 'hard']),
    adjustment: z.enum(['increase', 'decrease', 'maintain']),
    confidence: z.number().finite().min(0).max(1),
    reasoning: z.string(),
    factors: z.array(z.object({
      factor: z.string(),
      impact: z.number().finite().min(-1).max(1),
      weight: z.number().finite().min(0).max(1)
    }))
  }),
  performanceAnalysis: z.object({
    currentLevel: z.enum(['below_expectation', 'meeting_expectation', 'exceeding_expectation']),
    trend: z.enum(['improving', 'declining', 'stable']),
    volatility: z.number().finite().min(0).max(1),
    readiness: z.number().finite().min(0).max(1),
    insights: z.array(z.object({
      insight: z.string(),
      category: z.string(),
      impact: z.enum(['high', 'medium', 'low']),
      confidence: z.number().finite().min(0).max(1)
    }))
  }),
  recommendations: z.object({
    immediate: z.array(z.object({
      action: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      rationale: z.string(),
      expectedOutcome: z.string()
    })),
    shortTerm: z.array(z.object({
      action: z.string(),
      timeframe: z.string(),
      rationale: z.string(),
      successMetrics: z.array(z.string())
    })),
    longTerm: z.array(z.object({
      action: z.string(),
      timeframe: z.string(),
      rationale: z.string(),
      milestones: z.array(z.string())
    }))
  }),
  optimization: z.object({
    difficultyOptimization: z.object({
      currentOptimality: z.number().finite().min(0).max(1),
      targetOptimality: z.number().finite().min(0).max(1),
      improvement: z.number().finite(),
      recommendations: z.array(z.string())
    }),
    engagementOptimization: z.object({
      currentEngagement: z.number().finite().min(0).max(1),
      targetEngagement: z.number().finite().min(0).max(1),
      improvement: z.number().finite(),
      recommendations: z.array(z.string())
    }),
    learningOptimization: z.object({
      currentLearning: z.number().finite().min(0).max(1),
      targetLearning: z.number().finite().min(0).max(1),
      improvement: z.number().finite(),
      recommendations: z.array(z.string())
    })
  })
});

export type AdaptiveDifficultyResult = z.infer<typeof AdaptiveDifficultyResultSchema>;

export class AdaptiveDifficulty {
  private difficultyEngine: Map<string, any>;
  private analysisEngine: Map<string, any>;
  private optimizationEngine: Map<string, any>;

  constructor() {
    this.difficultyEngine = new Map();
    this.analysisEngine = new Map();
    this.optimizationEngine = new Map();
    this.initializeEngines();
  }

  /**
   * Adjust difficulty based on performance and context
   */
  async adjustDifficulty(request: AdaptiveDifficultyRequest): Promise<AdaptiveDifficultyResult> {
    try {
      const validatedRequest = AdaptiveDifficultyRequestSchema.parse(request);
      
      // Analyze performance
      const performanceAnalysis = this.analyzePerformance(validatedRequest);
      
      // Determine difficulty adjustment
      const difficultyAdjustment = this.determineDifficultyAdjustment(validatedRequest, performanceAnalysis);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(validatedRequest, performanceAnalysis, difficultyAdjustment);
      
      // Optimize difficulty
      const optimization = this.optimizeDifficulty(validatedRequest, performanceAnalysis, difficultyAdjustment);
      
      const result: AdaptiveDifficultyResult = {
        difficultyAdjustment,
        performanceAnalysis,
        recommendations,
        optimization
      };

      return AdaptiveDifficultyResultSchema.parse(result);
    } catch (error) {
      console.error('Error adjusting difficulty:', error);
      return this.getFallbackDifficultyResult(request);
    }
  }

  /**
   * Analyze current performance
   */
  private analyzePerformance(request: AdaptiveDifficultyRequest): any {
    const currentLevel = this.determinePerformanceLevel(request);
    const trend = this.analyzePerformanceTrend(request);
    const volatility = this.calculateVolatility(request);
    const readiness = this.calculateReadiness(request);
    const insights = this.extractPerformanceInsights(request);

    return {
      currentLevel,
      trend,
      volatility,
      readiness,
      insights
    };
  }

  /**
   * Determine difficulty adjustment
   */
  private determineDifficultyAdjustment(request: AdaptiveDifficultyRequest, performanceAnalysis: any): any {
    const recommendedDifficulty = this.calculateRecommendedDifficulty(request, performanceAnalysis);
    const adjustment = this.determineAdjustment(request.currentPerformance.currentDifficulty, recommendedDifficulty);
    const confidence = this.calculateAdjustmentConfidence(request, performanceAnalysis);
    const reasoning = this.generateAdjustmentReasoning(request, performanceAnalysis, adjustment);
    const factors = this.identifyAdjustmentFactors(request, performanceAnalysis);

    return {
      recommendedDifficulty,
      adjustment,
      confidence,
      reasoning,
      factors
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(request: AdaptiveDifficultyRequest, performanceAnalysis: any, difficultyAdjustment: any): any {
    const immediate = this.generateImmediateRecommendations(request, performanceAnalysis, difficultyAdjustment);
    const shortTerm = this.generateShortTermRecommendations(request, performanceAnalysis, difficultyAdjustment);
    const longTerm = this.generateLongTermRecommendations(request, performanceAnalysis, difficultyAdjustment);

    return {
      immediate,
      shortTerm,
      longTerm
    };
  }

  /**
   * Optimize difficulty
   */
  private optimizeDifficulty(request: AdaptiveDifficultyRequest, performanceAnalysis: any, difficultyAdjustment: any): any {
    const difficultyOptimization = this.optimizeDifficultyLevel(request, performanceAnalysis);
    const engagementOptimization = this.optimizeEngagement(request, performanceAnalysis);
    const learningOptimization = this.optimizeLearning(request, performanceAnalysis);

    return {
      difficultyOptimization,
      engagementOptimization,
      learningOptimization
    };
  }

  // Helper methods
  private determinePerformanceLevel(request: AdaptiveDifficultyRequest): 'below_expectation' | 'meeting_expectation' | 'exceeding_expectation' {
    const currentScore = request.currentPerformance.currentScore;
    const currentDifficulty = request.currentPerformance.currentDifficulty;
    
    const expectedScores = {
      'easy': { min: 70, max: 100 },
      'medium': { min: 60, max: 90 },
      'hard': { min: 50, max: 80 }
    };
    
    const expected = expectedScores[currentDifficulty];
    
    if (currentScore < expected.min) return 'below_expectation';
    if (currentScore > expected.max) return 'exceeding_expectation';
    return 'meeting_expectation';
  }

  private analyzePerformanceTrend(request: AdaptiveDifficultyRequest): 'improving' | 'declining' | 'stable' {
    const recentScores = request.currentPerformance.recentScores;
    if (recentScores.length < 3) return 'stable';
    
    const recent = recentScores.slice(-3);
    const older = recentScores.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  private calculateVolatility(request: AdaptiveDifficultyRequest): number {
    const recentScores = request.currentPerformance.recentScores;
    if (recentScores.length < 2) return 0;
    
    const mean = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const variance = recentScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / recentScores.length;
    const standardDeviation = Math.sqrt(variance);
    
    return Math.min(1, standardDeviation / 20); // Normalize to 0-1 range
  }

  private calculateReadiness(request: AdaptiveDifficultyRequest): number {
    const performance = request.currentPerformance;
    const context = request.context;
    
    let readiness = 0.5; // Base readiness
    
    // Performance factors
    if (performance.accuracy.length > 0) {
      const avgAccuracy = performance.accuracy.reduce((sum, acc) => sum + acc, 0) / performance.accuracy.length;
      readiness += avgAccuracy * 0.2;
    }
    
    if (performance.confidence.length > 0) {
      const avgConfidence = performance.confidence.reduce((sum, conf) => sum + conf, 0) / performance.confidence.length;
      readiness += avgConfidence * 0.2;
    }
    
    // Context factors
    readiness += (1 - context.fatigue) * 0.1;
    readiness += (1 - context.stress) * 0.1;
    readiness += context.motivation * 0.1;
    
    return Math.min(1, Math.max(0, readiness));
  }

  private extractPerformanceInsights(request: AdaptiveDifficultyRequest): any[] {
    const insights = [];

    // Accuracy insight
    if (request.currentPerformance.accuracy.length > 0) {
      const avgAccuracy = request.currentPerformance.accuracy.reduce((sum, acc) => sum + acc, 0) / request.currentPerformance.accuracy.length;
      if (avgAccuracy < 0.6) {
        insights.push({
          insight: 'Low accuracy indicates need for difficulty reduction',
          category: 'accuracy',
          impact: 'high' as const,
          confidence: 0.9
        });
      }
    }

    // Response time insight
    if (request.currentPerformance.responseTime.length > 0) {
      const avgResponseTime = request.currentPerformance.responseTime.reduce((sum, time) => sum + time, 0) / request.currentPerformance.responseTime.length;
      if (avgResponseTime > 120) { // More than 2 minutes per question
        insights.push({
          insight: 'Slow response times suggest difficulty may be too high',
          category: 'response_time',
          impact: 'medium' as const,
          confidence: 0.8
        });
      }
    }

    // Confidence insight
    if (request.currentPerformance.confidence.length > 0) {
      const avgConfidence = request.currentPerformance.confidence.reduce((sum, conf) => sum + conf, 0) / request.currentPerformance.confidence.length;
      if (avgConfidence < 0.5) {
        insights.push({
          insight: 'Low confidence indicates need for support or difficulty adjustment',
          category: 'confidence',
          impact: 'medium' as const,
          confidence: 0.85
        });
      }
    }

    return insights;
  }

  private calculateRecommendedDifficulty(request: AdaptiveDifficultyRequest, performanceAnalysis: any): 'easy' | 'medium' | 'hard' {
    const currentDifficulty = request.currentPerformance.currentDifficulty;
    const performanceLevel = performanceAnalysis.currentLevel;
    const trend = performanceAnalysis.trend;
    const readiness = performanceAnalysis.readiness;
    
    let recommendedDifficulty = currentDifficulty;
    
    // Adjust based on performance level
    if (performanceLevel === 'exceeding_expectation' && trend === 'improving') {
      recommendedDifficulty = this.increaseDifficulty(currentDifficulty);
    } else if (performanceLevel === 'below_expectation' && trend === 'declining') {
      recommendedDifficulty = this.decreaseDifficulty(currentDifficulty);
    }
    
    // Adjust based on readiness
    if (readiness < 0.4 && recommendedDifficulty !== 'easy') {
      recommendedDifficulty = this.decreaseDifficulty(recommendedDifficulty);
    } else if (readiness > 0.8 && recommendedDifficulty !== 'hard') {
      recommendedDifficulty = this.increaseDifficulty(recommendedDifficulty);
    }
    
    // Apply bounds
    const bounds = request.adjustmentSettings.bounds;
    if (this.difficultyLevel(recommendedDifficulty) < this.difficultyLevel(bounds.minDifficulty)) {
      recommendedDifficulty = bounds.minDifficulty;
    } else if (this.difficultyLevel(recommendedDifficulty) > this.difficultyLevel(bounds.maxDifficulty)) {
      recommendedDifficulty = bounds.maxDifficulty;
    }
    
    return recommendedDifficulty;
  }

  private determineAdjustment(currentDifficulty: string, recommendedDifficulty: string): 'increase' | 'decrease' | 'maintain' {
    if (currentDifficulty === recommendedDifficulty) return 'maintain';
    
    const currentLevel = this.difficultyLevel(currentDifficulty);
    const recommendedLevel = this.difficultyLevel(recommendedDifficulty);
    
    if (recommendedLevel > currentLevel) return 'increase';
    return 'decrease';
  }

  private calculateAdjustmentConfidence(request: AdaptiveDifficultyRequest, performanceAnalysis: any): number {
    let confidence = 0.5; // Base confidence
    
    // Performance consistency
    confidence += (1 - performanceAnalysis.volatility) * 0.2;
    
    // Data availability
    const dataPoints = request.currentPerformance.recentScores.length;
    confidence += Math.min(1, dataPoints / 10) * 0.2;
    
    // Context stability
    const contextStability = 1 - (request.context.fatigue + request.context.stress) / 2;
    confidence += contextStability * 0.1;
    
    return Math.min(1, confidence);
  }

  private generateAdjustmentReasoning(request: AdaptiveDifficultyRequest, performanceAnalysis: any, adjustment: string): string {
    const performanceLevel = performanceAnalysis.currentLevel;
    const trend = performanceAnalysis.trend;
    
    switch (adjustment) {
      case 'increase':
        return `Performance is ${performanceLevel} with ${trend} trend, indicating readiness for increased challenge`;
      case 'decrease':
        return `Performance is ${performanceLevel} with ${trend} trend, suggesting need for reduced difficulty`;
      default:
        return `Performance is ${performanceLevel} with ${trend} trend, maintaining current difficulty level`;
    }
  }

  private identifyAdjustmentFactors(request: AdaptiveDifficultyRequest, performanceAnalysis: any): any[] {
    const factors = [];

    // Performance level factor
    factors.push({
      factor: 'Performance Level',
      impact: performanceAnalysis.currentLevel === 'exceeding_expectation' ? 0.8 : 
              performanceAnalysis.currentLevel === 'below_expectation' ? -0.8 : 0,
      weight: 0.4
    });

    // Performance trend factor
    factors.push({
      factor: 'Performance Trend',
      impact: performanceAnalysis.trend === 'improving' ? 0.6 : 
              performanceAnalysis.trend === 'declining' ? -0.6 : 0,
      weight: 0.3
    });

    // Readiness factor
    factors.push({
      factor: 'Learning Readiness',
      impact: (performanceAnalysis.readiness - 0.5) * 2, // Scale to -1 to 1
      weight: 0.2
    });

    // Context factor
    const contextFactor = (request.context.motivation - (request.context.fatigue + request.context.stress) / 2);
    factors.push({
      factor: 'Context Factors',
      impact: contextFactor,
      weight: 0.1
    });

    return factors;
  }

  private generateImmediateRecommendations(request: AdaptiveDifficultyRequest, performanceAnalysis: any, difficultyAdjustment: any): any[] {
    const recommendations = [];

    // Difficulty adjustment recommendation
    if (difficultyAdjustment.adjustment !== 'maintain') {
      recommendations.push({
        action: `${difficultyAdjustment.adjustment === 'increase' ? 'Increase' : 'Decrease'} difficulty level`,
        priority: 'high' as const,
        rationale: difficultyAdjustment.reasoning,
        expectedOutcome: `Optimize challenge level for better learning outcomes`
      });
    }

    // Performance support recommendation
    if (performanceAnalysis.currentLevel === 'below_expectation') {
      recommendations.push({
        action: 'Provide additional support and guidance',
        priority: 'critical' as const,
        rationale: 'Performance below expectation requires immediate intervention',
        expectedOutcome: 'Improve performance and confidence'
      });
    }

    return recommendations;
  }

  private generateShortTermRecommendations(request: AdaptiveDifficultyRequest, performanceAnalysis: any, difficultyAdjustment: any): any[] {
    const recommendations = [];

    // Engagement optimization
    if (performanceAnalysis.readiness < 0.6) {
      recommendations.push({
        action: 'Optimize learning environment and reduce distractions',
        timeframe: 'Next session',
        rationale: 'Low readiness indicates need for better learning conditions',
        successMetrics: ['Improved focus', 'Better performance', 'Higher engagement']
      });
    }

    return recommendations;
  }

  private generateLongTermRecommendations(request: AdaptiveDifficultyRequest, performanceAnalysis: any, difficultyAdjustment: any): any[] {
    const recommendations = [];

    // Learning strategy optimization
    if (performanceAnalysis.volatility > 0.3) {
      recommendations.push({
        action: 'Develop consistent learning strategies and habits',
        timeframe: 'Next 2 weeks',
        rationale: 'High performance volatility indicates need for more consistent approach',
        milestones: ['Establish study routine', 'Improve consistency', 'Reduce performance volatility']
      });
    }

    return recommendations;
  }

  private optimizeDifficultyLevel(request: AdaptiveDifficultyRequest, performanceAnalysis: any): any {
    const currentOptimality = this.calculateDifficultyOptimality(request, performanceAnalysis);
    const targetOptimality = 0.8; // Target 80% optimality
    const improvement = targetOptimality - currentOptimality;

    const recommendations = [];
    if (improvement > 0.1) {
      recommendations.push('Fine-tune difficulty adjustment algorithm');
      recommendations.push('Consider individual learning preferences');
      recommendations.push('Implement adaptive feedback mechanisms');
    }

    return {
      currentOptimality,
      targetOptimality,
      improvement,
      recommendations
    };
  }

  private optimizeEngagement(request: AdaptiveDifficultyRequest, performanceAnalysis: any): any {
    const currentEngagement = performanceAnalysis.readiness;
    const targetEngagement = 0.8;
    const improvement = targetEngagement - currentEngagement;

    const recommendations = [];
    if (improvement > 0.1) {
      recommendations.push('Implement gamification elements');
      recommendations.push('Provide immediate feedback and rewards');
      recommendations.push('Create engaging learning scenarios');
    }

    return {
      currentEngagement,
      targetEngagement,
      improvement,
      recommendations
    };
  }

  private optimizeLearning(request: AdaptiveDifficultyRequest, performanceAnalysis: any): any {
    const currentLearning = 1 - performanceAnalysis.volatility; // Lower volatility = better learning
    const targetLearning = 0.8;
    const improvement = targetLearning - currentLearning;

    const recommendations = [];
    if (improvement > 0.1) {
      recommendations.push('Implement spaced repetition techniques');
      recommendations.push('Provide varied question types');
      recommendations.push('Encourage active learning strategies');
    }

    return {
      currentLearning,
      targetLearning,
      improvement,
      recommendations
    };
  }

  // Utility methods
  private increaseDifficulty(difficulty: string): 'easy' | 'medium' | 'hard' {
    switch (difficulty) {
      case 'easy': return 'medium';
      case 'medium': return 'hard';
      default: return 'hard';
    }
  }

  private decreaseDifficulty(difficulty: string): 'easy' | 'medium' | 'hard' {
    switch (difficulty) {
      case 'hard': return 'medium';
      case 'medium': return 'easy';
      default: return 'easy';
    }
  }

  private difficultyLevel(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 2;
    }
  }

  private calculateDifficultyOptimality(request: AdaptiveDifficultyRequest, performanceAnalysis: any): number {
    const performanceLevel = performanceAnalysis.currentLevel;
    const readiness = performanceAnalysis.readiness;
    const volatility = performanceAnalysis.volatility;
    
    let optimality = 0.5; // Base optimality
    
    // Performance level optimality
    if (performanceLevel === 'meeting_expectation') optimality += 0.3;
    else if (performanceLevel === 'exceeding_expectation') optimality += 0.2;
    else optimality -= 0.2;
    
    // Readiness optimality
    optimality += (readiness - 0.5) * 0.2;
    
    // Volatility optimality (lower is better)
    optimality += (1 - volatility) * 0.1;
    
    return Math.min(1, Math.max(0, optimality));
  }

  /**
   * Get fallback difficulty result
   */
  private getFallbackDifficultyResult(request: AdaptiveDifficultyRequest): AdaptiveDifficultyResult {
    return {
      difficultyAdjustment: {
        recommendedDifficulty: request.currentPerformance.currentDifficulty,
        adjustment: 'maintain' as const,
        confidence: 0.5,
        reasoning: 'Unable to determine optimal adjustment - maintaining current difficulty',
        factors: []
      },
      performanceAnalysis: {
        currentLevel: 'meeting_expectation' as const,
        trend: 'stable' as const,
        volatility: 0.5,
        readiness: 0.5,
        insights: []
      },
      recommendations: {
        immediate: [],
        shortTerm: [],
        longTerm: []
      },
      optimization: {
        difficultyOptimization: {
          currentOptimality: 0.5,
          targetOptimality: 0.8,
          improvement: 0.3,
          recommendations: []
        },
        engagementOptimization: {
          currentEngagement: 0.5,
          targetEngagement: 0.8,
          improvement: 0.3,
          recommendations: []
        },
        learningOptimization: {
          currentLearning: 0.5,
          targetLearning: 0.8,
          improvement: 0.3,
          recommendations: []
        }
      }
    };
  }

  /**
   * Initialize engines
   */
  private initializeEngines(): void {
    // Initialize adaptive difficulty engines
    this.difficultyEngine.set('adjustment', this.determineDifficultyAdjustment.bind(this));
    this.difficultyEngine.set('analysis', this.analyzePerformance.bind(this));
    this.difficultyEngine.set('optimization', this.optimizeDifficulty.bind(this));
  }
}

