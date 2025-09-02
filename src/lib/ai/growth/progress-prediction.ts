/**
 * AI-Powered Progress Prediction for Growth Planning
 * AI-powered progress forecasting and trajectory analysis for growth strategies
 */

import { z } from 'zod';

// Progress Prediction Request Schema
const GrowthProgressPredictionRequestSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
  growthGoals: z.array(z.object({
    id: z.string(),
    title: z.string(),
    target: z.number().finite(),
    current: z.number().finite(),
    unit: z.string(),
    deadline: z.string(),
    priority: z.enum(['low', 'medium', 'high', 'critical'])
  })),
  historicalData: z.object({
    progressHistory: z.array(z.object({
      date: z.string(),
      goalId: z.string(),
      value: z.number().finite(),
      effort: z.number().finite()
    })),
    performanceMetrics: z.object({
      averageProgress: z.number().finite(),
      consistency: z.number().finite(),
      efficiency: z.number().finite(),
      velocity: z.number().finite()
    })
  }),
  predictionSettings: z.object({
    timeframe: z.enum(['short_term', 'medium_term', 'long_term']),
    granularity: z.enum(['daily', 'weekly', 'monthly']),
    confidenceLevel: z.number().finite().min(0.5).max(0.99)
  })
});

export type GrowthProgressPredictionRequest = z.infer<typeof GrowthProgressPredictionRequestSchema>;

// Progress Prediction Result Schema
const GrowthProgressPredictionResultSchema = z.object({
  predictions: z.object({
    goalTrajectories: z.array(z.object({
      goalId: z.string(),
      goalTitle: z.string(),
      trajectory: z.array(z.object({
        date: z.string(),
        predictedValue: z.number().finite(),
        probability: z.number().finite().min(0).max(1)
      })),
      completionProbability: z.number().finite().min(0).max(1),
      estimatedCompletion: z.string(),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical'])
    })),
    overallProgress: z.object({
      currentProgress: z.number().finite(),
      predictedProgress: z.number().finite(),
      completionRate: z.number().finite().min(0).max(1),
      velocity: z.number().finite()
    })
  }),
  insights: z.object({
    keyInsights: z.array(z.object({
      insight: z.string(),
      category: z.string(),
      impact: z.enum(['high', 'medium', 'low']),
      confidence: z.number().finite().min(0).max(1)
    })),
    risks: z.array(z.object({
      risk: z.string(),
      probability: z.number().finite().min(0).max(1),
      impact: z.enum(['low', 'medium', 'high', 'critical']),
      mitigation: z.string()
    }))
  }),
  recommendations: z.object({
    immediate: z.array(z.object({
      action: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      impact: z.number().finite().min(0).max(1),
      rationale: z.string()
    })),
    longTerm: z.array(z.object({
      action: z.string(),
      timeframe: z.string(),
      impact: z.number().finite().min(0).max(1),
      rationale: z.string()
    }))
  })
});

export type GrowthProgressPredictionResult = z.infer<typeof GrowthProgressPredictionResultSchema>;

export class GrowthProgressPrediction {
  async predictGrowthProgress(request: GrowthProgressPredictionRequest): Promise<GrowthProgressPredictionResult> {
    try {
      const validatedRequest = GrowthProgressPredictionRequestSchema.parse(request);
      
      const predictions = this.generatePredictions(validatedRequest);
      const insights = this.generateInsights(validatedRequest, predictions);
      const recommendations = this.generateRecommendations(validatedRequest, predictions, insights);
      
      const result: GrowthProgressPredictionResult = {
        predictions,
        insights,
        recommendations
      };

      return GrowthProgressPredictionResultSchema.parse(result);
    } catch (error) {
      console.error('Error predicting growth progress:', error);
      return this.getFallbackPredictionResult(request);
    }
  }

  private generatePredictions(request: GrowthProgressPredictionRequest): any {
    const goalTrajectories = request.growthGoals.map(goal => {
      const historicalProgress = this.calculateHistoricalProgress(request, goal.id);
      const trajectory = this.generateGoalTrajectory(goal, historicalProgress);
      
      return {
        goalId: goal.id,
        goalTitle: goal.title,
        trajectory,
        completionProbability: this.calculateCompletionProbability(goal, trajectory),
        estimatedCompletion: this.estimateCompletion(goal, historicalProgress),
        riskLevel: this.assessRiskLevel(goal, trajectory)
      };
    });

    const overallProgress = this.calculateOverallProgress(request, goalTrajectories);

    return {
      goalTrajectories,
      overallProgress
    };
  }

  private generateInsights(request: GrowthProgressPredictionRequest, predictions: any): any {
    const keyInsights = this.extractKeyInsights(request, predictions);
    const risks = this.identifyRisks(request, predictions);

    return {
      keyInsights,
      risks
    };
  }

  private generateRecommendations(request: GrowthProgressPredictionRequest, predictions: any, insights: any): any {
    const immediate = this.generateImmediateRecommendations(request, predictions, insights);
    const longTerm = this.generateLongTermRecommendations(request, predictions, insights);

    return {
      immediate,
      longTerm
    };
  }

  private calculateHistoricalProgress(request: GrowthProgressPredictionRequest, goalId: string): number {
    const goalHistory = request.historicalData.progressHistory.filter(entry => entry.goalId === goalId);
    if (goalHistory.length < 2) return 0.1;
    
    const recentProgress = goalHistory.slice(-3);
    const totalProgress = recentProgress.reduce((sum, entry) => sum + entry.value, 0);
    const totalEffort = recentProgress.reduce((sum, entry) => sum + entry.effort, 0);
    
    return totalEffort > 0 ? totalProgress / totalEffort : 0.1;
  }

  private generateGoalTrajectory(goal: any, progressRate: number): any[] {
    const trajectory = [];
    const startDate = new Date();
    const targetDate = new Date(goal.deadline);
    const daysToTarget = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysToTarget; i += 7) {
      const predictedValue = Math.min(goal.target, goal.current + (progressRate * i));
      const confidence = Math.max(0.1, 0.9 - (i / daysToTarget) * 0.3);
      
      trajectory.push({
        date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predictedValue: Math.round(predictedValue * 100) / 100,
        probability: confidence
      });
    }

    return trajectory;
  }

  private calculateCompletionProbability(goal: any, trajectory: any[]): number {
    const finalPrediction = trajectory[trajectory.length - 1];
    if (!finalPrediction) return 0;
    
    const progressRatio = finalPrediction.predictedValue / goal.target;
    return Math.min(1, progressRatio * 0.9);
  }

  private estimateCompletion(goal: any, progressRate: number): string {
    const progressNeeded = goal.target - goal.current;
    if (progressNeeded <= 0) return new Date().toISOString().split('T')[0];
    
    const daysToComplete = Math.ceil(progressNeeded / progressRate);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysToComplete);
    
    return completionDate.toISOString().split('T')[0];
  }

  private assessRiskLevel(goal: any, trajectory: any[]): 'low' | 'medium' | 'high' | 'critical' {
    const completionProbability = this.calculateCompletionProbability(goal, trajectory);
    
    if (completionProbability < 0.3) return 'critical';
    if (completionProbability < 0.6) return 'high';
    if (completionProbability < 0.8) return 'medium';
    return 'low';
  }

  private calculateOverallProgress(request: GrowthProgressPredictionRequest, goalTrajectories: any[]): any {
    const currentProgress = request.growthGoals.reduce((sum, goal) => sum + (goal.current / goal.target), 0) / request.growthGoals.length;
    const predictedProgress = goalTrajectories.reduce((sum, trajectory) => {
      const finalPrediction = trajectory.trajectory[trajectory.trajectory.length - 1];
      return sum + (finalPrediction ? finalPrediction.predictedValue : 0);
    }, 0) / goalTrajectories.length;
    
    const completionRate = goalTrajectories.filter(trajectory => trajectory.completionProbability > 0.8).length / goalTrajectories.length;
    const velocity = request.historicalData.performanceMetrics.velocity;

    return {
      currentProgress,
      predictedProgress,
      completionRate,
      velocity
    };
  }

  private extractKeyInsights(request: GrowthProgressPredictionRequest, predictions: any): any[] {
    const insights = [];

    if (predictions.overallProgress.completionRate < 0.5) {
      insights.push({
        insight: 'Low completion probability indicates need for strategy adjustment',
        category: 'progress',
        impact: 'high' as const,
        confidence: 0.9
      });
    }

    return insights;
  }

  private identifyRisks(request: GrowthProgressPredictionRequest, predictions: any): any[] {
    const risks = [];

    const criticalGoals = predictions.goalTrajectories.filter(trajectory => trajectory.riskLevel === 'critical');
    if (criticalGoals.length > 0) {
      risks.push({
        risk: `${criticalGoals.length} goals at critical risk of missing deadlines`,
        probability: 0.8,
        impact: 'critical' as const,
        mitigation: 'Implement emergency measures and reallocate resources'
      });
    }

    return risks;
  }

  private generateImmediateRecommendations(request: GrowthProgressPredictionRequest, predictions: any, insights: any): any[] {
    const recommendations = [];

    const criticalGoals = predictions.goalTrajectories.filter(trajectory => trajectory.riskLevel === 'critical');
    if (criticalGoals.length > 0) {
      recommendations.push({
        action: `Address ${criticalGoals.length} critical goals immediately`,
        priority: 'critical' as const,
        impact: 0.9,
        rationale: 'Critical goals require immediate intervention to avoid failure'
      });
    }

    return recommendations;
  }

  private generateLongTermRecommendations(request: GrowthProgressPredictionRequest, predictions: any, insights: any): any[] {
    const recommendations = [];

    if (predictions.overallProgress.completionRate < 0.7) {
      recommendations.push({
        action: 'Optimize overall growth strategy and processes',
        timeframe: 'Next 3 months',
        impact: 0.9,
        rationale: 'Low completion probability indicates need for strategic improvement'
      });
    }

    return recommendations;
  }

  private getFallbackPredictionResult(request: GrowthProgressPredictionRequest): GrowthProgressPredictionResult {
    return {
      predictions: {
        goalTrajectories: [],
        overallProgress: {
          currentProgress: 0,
          predictedProgress: 0,
          completionRate: 0,
          velocity: 0
        }
      },
      insights: {
        keyInsights: [],
        risks: []
      },
      recommendations: {
        immediate: [],
        longTerm: []
      }
    };
  }
}