import { BusinessContext, RealTimeInsight, UserPersona } from './ConversationManager';

export interface BusinessMetrics {
  retentionRate?: number;
  acquisitionCost?: number;
  lifetimeValue?: number;
  growthRate?: number;
  marketPosition?: 'leader' | 'challenger' | 'niche' | 'emerging';
  maturityLevel?: 'startup' | 'growth' | 'scale' | 'mature';
  competitiveAdvantage?: string[];
  riskFactors?: string[];
  opportunities?: string[];
}

export interface StrategicInsight {
  type: 'opportunity' | 'risk' | 'optimization' | 'benchmark' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  recommendations: string[];
  dataPoints: string[];
}

export interface CompetitiveAnalysis {
  marketPosition: string;
  competitiveAdvantages: string[];
  threats: string[];
  opportunities: string[];
  recommendedActions: string[];
}

export class BusinessIntelligenceEngine {
  private industryBenchmarks: Record<string, any> = {
    saas: {
      retentionRate: { good: 70, average: 50, poor: 30 },
      acquisitionCost: { good: 50, average: 150, poor: 300 },
      growthRate: { good: 20, average: 10, poor: 5 }
    },
    ecommerce: {
      retentionRate: { good: 40, average: 25, poor: 15 },
      acquisitionCost: { good: 25, average: 50, poor: 100 },
      growthRate: { good: 15, average: 8, poor: 3 }
    },
    services: {
      retentionRate: { good: 80, average: 60, poor: 40 },
      acquisitionCost: { good: 100, average: 200, poor: 400 },
      growthRate: { good: 12, average: 6, poor: 2 }
    }
  };

  analyzeBusinessContext(context: BusinessContext, persona: UserPersona): BusinessMetrics {
    const metrics: BusinessMetrics = {};
    
    // Analyze retention rate
    if (context.responses.retention_rate) {
      const rate = parseFloat(context.responses.retention_rate);
      if (!isNaN(rate)) {
        metrics.retentionRate = rate;
        metrics.marketPosition = this.assessMarketPosition(rate, 'retention');
      }
    }

    // Analyze growth strategy
    if (context.responses.growth_strategy) {
      metrics.acquisitionCost = this.estimateAcquisitionCost(context.responses.growth_strategy);
      metrics.growthRate = this.estimateGrowthRate(context.responses.growth_strategy);
    }

    // Analyze business maturity
    metrics.maturityLevel = this.assessMaturityLevel(context);
    
    // Identify competitive advantages
    metrics.competitiveAdvantage = this.identifyCompetitiveAdvantages(context);
    
    // Identify risk factors
    metrics.riskFactors = this.identifyRiskFactors(context);
    
    // Identify opportunities
    metrics.opportunities = this.identifyOpportunities(context, persona);

    return metrics;
  }

  generateStrategicInsights(metrics: BusinessMetrics, context: BusinessContext): StrategicInsight[] {
    const insights: StrategicInsight[] = [];

    // Retention insights
    if (metrics.retentionRate) {
      if (metrics.retentionRate >= 70) {
        insights.push({
          type: 'optimization',
          title: 'Excellent Retention Foundation',
          description: `Your ${metrics.retentionRate}% retention rate is exceptional. This gives you a strong foundation for sustainable growth.`,
          confidence: 0.9,
          impact: 'high',
          timeframe: 'immediate',
          recommendations: [
            'Leverage your high retention to increase customer lifetime value',
            'Focus on upselling and cross-selling to existing customers',
            'Use your retention success as a competitive differentiator'
          ],
          dataPoints: ['retention_rate']
        });
      } else if (metrics.retentionRate < 40) {
        insights.push({
          type: 'risk',
          title: 'Retention Improvement Opportunity',
          description: `Your ${metrics.retentionRate}% retention rate indicates significant room for improvement.`,
          confidence: 0.8,
          impact: 'high',
          timeframe: 'immediate',
          recommendations: [
            'Implement customer feedback loops to understand churn reasons',
            'Develop a comprehensive customer success program',
            'Focus on product-market fit before scaling acquisition'
          ],
          dataPoints: ['retention_rate']
        });
      }
    }

    // Growth strategy insights
    if (context.responses.growth_strategy) {
      const strategy = context.responses.growth_strategy;
      
      if (strategy === 'digital_marketing') {
        insights.push({
          type: 'opportunity',
          title: 'Digital Marketing Optimization',
          description: 'You\'re using digital marketing for growth. Let\'s optimize your approach.',
          confidence: 0.85,
          impact: 'medium',
          timeframe: 'short-term',
          recommendations: [
            'Implement conversion rate optimization',
            'Develop a content marketing strategy',
            'Use data-driven attribution modeling'
          ],
          dataPoints: ['growth_strategy']
        });
      } else if (strategy === 'referrals') {
        insights.push({
          type: 'opportunity',
          title: 'Referral Program Enhancement',
          description: 'Referrals are your primary growth channel. Let\'s maximize this advantage.',
          confidence: 0.9,
          impact: 'high',
          timeframe: 'short-term',
          recommendations: [
            'Implement a structured referral program',
            'Create incentives for both referrers and referees',
            'Track and optimize referral conversion rates'
          ],
          dataPoints: ['growth_strategy']
        });
      }
    }

    // Competitive analysis
    const competitiveAnalysis = this.performCompetitiveAnalysis(metrics, context);
    insights.push({
      type: 'benchmark',
      title: 'Competitive Position Analysis',
      description: `You're positioned as a ${competitiveAnalysis.marketPosition} in your market.`,
      confidence: 0.75,
      impact: 'medium',
      timeframe: 'long-term',
      recommendations: competitiveAnalysis.recommendedActions,
      dataPoints: Object.keys(context.responses)
    });

    return insights;
  }

  generateRealTimeInsights(response: any, questionId: string, context: BusinessContext): RealTimeInsight[] {
    const insights: RealTimeInsight[] = [];

    // Pattern recognition
    if (this.detectPattern(response, questionId)) {
      insights.push({
        id: `pattern_${Date.now()}`,
        type: 'pattern',
        content: this.generatePatternInsight(response, questionId),
        confidence: 0.8,
        dataPoints: [questionId],
        recommendations: [],
        timestamp: new Date().toISOString()
      });
    }

    // Opportunity detection
    const opportunity = this.detectOpportunity(response, questionId, context);
    if (opportunity) {
      insights.push({
        id: `opportunity_${Date.now()}`,
        type: 'opportunity',
        content: opportunity,
        confidence: 0.7,
        dataPoints: [questionId],
        recommendations: this.generateOpportunityRecommendations(response, questionId),
        timestamp: new Date().toISOString()
      });
    }

    // Risk assessment
    const risk = this.detectRisk(response, questionId, context);
    if (risk) {
      insights.push({
        id: `risk_${Date.now()}`,
        type: 'risk',
        content: risk,
        confidence: 0.75,
        dataPoints: [questionId],
        recommendations: this.generateRiskMitigation(response, questionId),
        timestamp: new Date().toISOString()
      });
    }

    return insights;
  }

  private assessMarketPosition(value: number, metric: string): 'leader' | 'challenger' | 'niche' | 'emerging' {
    const benchmarks = this.industryBenchmarks.saas[metric];
    if (value >= benchmarks.good) return 'leader';
    if (value >= benchmarks.average) return 'challenger';
    if (value >= benchmarks.poor) return 'niche';
    return 'emerging';
  }

  private estimateAcquisitionCost(strategy: string): number {
    const estimates: Record<string, number> = {
      digital_marketing: 150,
      referrals: 50,
      sales_team: 300,
      organic: 25
    };
    return estimates[strategy] || 150;
  }

  private estimateGrowthRate(strategy: string): number {
    const estimates: Record<string, number> = {
      digital_marketing: 12,
      referrals: 8,
      sales_team: 15,
      organic: 5
    };
    return estimates[strategy] || 10;
  }

  private assessMaturityLevel(context: BusinessContext): 'startup' | 'growth' | 'scale' | 'mature' {
    const responses = context.responses;
    
    if (responses.retention_rate && parseFloat(responses.retention_rate) > 70) {
      return 'mature';
    }
    if (responses.growth_strategy === 'sales_team') {
      return 'scale';
    }
    if (responses.growth_strategy === 'digital_marketing') {
      return 'growth';
    }
    return 'startup';
  }

  private identifyCompetitiveAdvantages(context: BusinessContext): string[] {
    const advantages: string[] = [];
    const responses = context.responses;

    if (responses.retention_rate && parseFloat(responses.retention_rate) > 60) {
      advantages.push('Strong customer retention');
    }
    if (responses.growth_strategy === 'referrals') {
      advantages.push('Organic growth through referrals');
    }
    if (responses.challenge_followup === 'loyalty_program') {
      advantages.push('Established loyalty program');
    }

    return advantages;
  }

  private identifyRiskFactors(context: BusinessContext): string[] {
    const risks: string[] = [];
    const responses = context.responses;

    if (responses.retention_rate && parseFloat(responses.retention_rate) < 40) {
      risks.push('Low customer retention');
    }
    if (responses.growth_strategy === 'organic') {
      risks.push('Limited growth scalability');
    }
    if (responses.challenge_followup === 'unsure') {
      risks.push('Unclear strategic direction');
    }

    return risks;
  }

  private identifyOpportunities(context: BusinessContext, persona: UserPersona): string[] {
    const opportunities: string[] = [];
    const responses = context.responses;

    if (responses.retention_rate && parseFloat(responses.retention_rate) < 60) {
      opportunities.push('Improve customer retention');
    }
    if (responses.growth_strategy !== 'digital_marketing') {
      opportunities.push('Implement digital marketing');
    }
    if (responses.growth_strategy !== 'referrals') {
      opportunities.push('Develop referral program');
    }

    return opportunities;
  }

  private performCompetitiveAnalysis(metrics: BusinessMetrics, context: BusinessContext): CompetitiveAnalysis {
    const analysis: CompetitiveAnalysis = {
      marketPosition: metrics.marketPosition || 'emerging',
      competitiveAdvantages: metrics.competitiveAdvantage || [],
      threats: metrics.riskFactors || [],
      opportunities: metrics.opportunities || [],
      recommendedActions: []
    };

    // Generate recommended actions based on analysis
    if (analysis.competitiveAdvantages.length > 0) {
      analysis.recommendedActions.push('Leverage your competitive advantages in marketing');
    }
    if (analysis.threats.length > 0) {
      analysis.recommendedActions.push('Address identified risk factors');
    }
    if (analysis.opportunities.length > 0) {
      analysis.recommendedActions.push('Focus on high-impact opportunities');
    }

    return analysis;
  }

  private detectPattern(response: any, questionId: string): boolean {
    // Pattern detection logic
    if (questionId === 'retention_rate' && typeof response === 'string') {
      const rate = parseFloat(response);
      return rate > 70 || rate < 30; // Significant patterns
    }
    return false;
  }

  private generatePatternInsight(response: any, questionId: string): string {
    if (questionId === 'retention_rate') {
      const rate = parseFloat(response);
      if (rate > 70) {
        return "I'm seeing an exceptional retention pattern here. This is well above industry standards!";
      } else if (rate < 30) {
        return "I'm noticing a concerning pattern with your retention rate. This needs immediate attention.";
      }
    }
    return "I'm seeing some interesting patterns in your responses.";
  }

  private detectOpportunity(response: any, questionId: string, context: BusinessContext): string | null {
    if (questionId === 'growth_strategy' && response === 'organic') {
      return "I see a great opportunity to scale your growth beyond organic methods.";
    }
    if (questionId === 'retention_rate') {
      const rate = parseFloat(response);
      if (rate < 50) {
        return "There's significant opportunity to improve your retention rate.";
      }
    }
    return null;
  }

  private generateOpportunityRecommendations(response: any, questionId: string): string[] {
    if (questionId === 'growth_strategy' && response === 'organic') {
      return [
        'Implement digital marketing channels',
        'Develop a referral program',
        'Consider sales team expansion'
      ];
    }
    return [];
  }

  private detectRisk(response: any, questionId: string, context: BusinessContext): string | null {
    if (questionId === 'retention_rate') {
      const rate = parseFloat(response);
      if (rate < 30) {
        return "Your low retention rate poses a significant risk to sustainable growth.";
      }
    }
    return null;
  }

  private generateRiskMitigation(response: any, questionId: string): string[] {
    if (questionId === 'retention_rate') {
      return [
        'Implement customer success program',
        'Conduct exit interviews',
        'Improve product-market fit'
      ];
    }
    return [];
  }
} 