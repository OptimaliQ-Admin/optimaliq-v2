/**
 * 🎯 Engagement Intelligence Analysis Service
 *
 * This service generates comprehensive engagement intelligence using:
 * - Real-time engagement metrics from multiple platforms
 * - Customer sentiment and behavior analysis
 * - AI-powered engagement trend synthesis
 * - Smart model selection for different user tiers
 * - Real-time signal calculation for enhanced accuracy
 * - Engagement scoring and predictive insights
 * - Consistent caching with weekly refresh (Monday 12am) and 1-day refresh limit
 *
 * Used to power: Engagement Intelligence Cards, Customer Behavior Reports, and Engagement Strategy Insights.
 */

import { aiRateLimiter } from './rateLimiter';
import { modelVersioning } from './modelVersioning';
import { callOpenAI } from './callOpenAI';
import { modelSelector } from './modelSelector';
import { getSmartAIClient } from './smartAIClient';
import { AIClient } from './client';
import { sharedCaching } from './sharedCaching';

// User tier types
export type UserTier = 'free' | 'premium';

// Interface for user context
export interface UserContext {
  userId: string;
  tier: UserTier;
  industry: string;
}

// Real-time signal calculation interfaces
export interface SignalFactors {
  engagementVolume: number; // Number of engagement interactions (0-100)
  sentimentMomentum: number; // Customer sentiment changes (-100 to 100)
  conversionTrend: number; // Conversion rate trends (-100 to 100)
  audienceGrowth: number; // Audience growth rate (0-100)
  retentionIndex: number; // Customer retention indicator (0-100)
}

export interface SignalData {
  engagementMetrics: EngagementMetrics;
  sentimentData: SentimentAnalysis;
  conversionData: ConversionMetrics;
  audienceData: AudienceMetrics;
  retentionData: RetentionMetrics;
}

export interface EngagementMetrics {
  totalInteractions: number;
  engagementRate: number;
  previousEngagementRate: number;
  platformBreakdown: {
    social: number;
    email: number;
    web: number;
    mobile: number;
  };
  interactionTypes: {
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
}

export interface SentimentAnalysis {
  overallSentiment: number; // -1 to 1
  positiveInteractions: number;
  negativeInteractions: number;
  neutralInteractions: number;
  sentimentTrend: 'improving' | 'declining' | 'stable';
  keyTopics: string[];
}

export interface ConversionMetrics {
  conversionRate: number;
  previousConversionRate: number;
  conversionTrend: number;
  funnelStages: {
    awareness: number;
    consideration: number;
    decision: number;
    retention: number;
  };
  revenueImpact: number;
}

export interface AudienceMetrics {
  totalAudience: number;
  audienceGrowth: number;
  previousAudienceSize: number;
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    interests: string[];
  };
  engagementSegments: {
    highEngagers: number;
    mediumEngagers: number;
    lowEngagers: number;
  };
}

export interface RetentionMetrics {
  retentionRate: number;
  churnRate: number;
  lifetimeValue: number;
  repeatPurchaseRate: number;
  loyaltyScore: number;
}

export interface EngagementTrend {
  title: string;
  direction: 'up' | 'down' | 'flat';
  percentageChange: number;
  description: string;
  impact?: 'high' | 'medium' | 'low';
  timeframe?: string;
  aiModelVersion?: string;
  signalScore?: number;
  signalFactors?: SignalFactors;
}

export interface EngagementStrategy {
  title: string;
  description: string;
  expectedImpact: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  resources: string[];
  successMetrics: string[];
}

// New strategic engagement trend interface
export interface EngagementTrend {
  title: string;
  direction: 'up' | 'down' | 'flat';
  percentageChange: number;
  description: string;
}

// New strategic engagement insight interface
export interface EngagementInsight {
  signalScore: number; // 0–100
  signalSummary: string; // e.g. "Neutral to Weak"
  trends: EngagementTrend[];
  recommendations: string[]; // 3 actionable bullets
  lastUpdated: string; // ISO string
  aiModelVersion: string;
  confidenceScore: number; // 0.00 to 1.00
}

// Legacy interface for backward compatibility (will be removed)
export interface EngagementIntelligenceInsight {
  trends: EngagementTrend[];
  strategies: EngagementStrategy[];
  keyMetrics: {
    overallEngagement: number;
    sentimentScore: number;
    conversionRate: number;
    audienceGrowth: number;
    retentionRate: number;
  };
  fullInsight: string;
  dataSources: {
    social_media: boolean;
    email_analytics: boolean;
    web_analytics: boolean;
    customer_feedback: boolean;
  };
  confidenceScore: number; // 0.00 to 1.00
  aiModelVersion: string;
  signalScore?: number;
  signalFactors?: SignalFactors;
  lastUpdated: Date;
}

export interface EngagementDataSources {
  socialMediaMetrics: any;
  emailAnalytics: any;
  webAnalytics: any;
  customerFeedback: any;
  conversionData: any;
  signalData?: SignalData;
}

class EngagementIntelligenceAnalysis {
  private static instance: EngagementIntelligenceAnalysis;

  private constructor() {}

  static getInstance(): EngagementIntelligenceAnalysis {
    if (!EngagementIntelligenceAnalysis.instance) {
      EngagementIntelligenceAnalysis.instance = new EngagementIntelligenceAnalysis();
    }
    return EngagementIntelligenceAnalysis.instance;
  }

  /**
   * Calculate real-time signal score based on multiple engagement factors
   */
  private calculateSignalScore(signalData: SignalData): { score: number; factors: SignalFactors } {
    // Calculate engagement volume score (0-100)
    const engagementVolume = Math.min(100, signalData.engagementMetrics.totalInteractions / 1000);
    
    // Calculate sentiment momentum score (-100 to 100)
    const sentimentChange = signalData.sentimentData.overallSentiment * 100;
    const sentimentMomentum = Math.max(-100, Math.min(100, sentimentChange));
    
    // Calculate conversion trend score (-100 to 100)
    const conversionChange = ((signalData.conversionData.conversionRate - signalData.conversionData.previousConversionRate) / 
                             signalData.conversionData.previousConversionRate) * 100;
    const conversionTrend = Math.max(-100, Math.min(100, conversionChange));
    
    // Calculate audience growth score (0-100)
    const audienceGrowth = Math.min(100, Math.max(0, signalData.audienceData.audienceGrowth * 100));
    
    // Calculate retention index (0-100)
    const retentionIndex = Math.min(100, signalData.retentionData.retentionRate * 100);
    
    // Weighted signal score calculation
    const weights = {
      engagementVolume: 0.25,
      sentimentMomentum: 0.25,
      conversionTrend: 0.2,
      audienceGrowth: 0.15,
      retentionIndex: 0.15
    };
    
    const signalScore = (
      engagementVolume * weights.engagementVolume +
      sentimentMomentum * weights.sentimentMomentum +
      conversionTrend * weights.conversionTrend +
      audienceGrowth * weights.audienceGrowth +
      retentionIndex * weights.retentionIndex
    );
    
    return {
      score: Math.max(-100, Math.min(100, signalScore)),
      factors: {
        engagementVolume,
        sentimentMomentum,
        conversionTrend,
        audienceGrowth,
        retentionIndex
      }
    };
  }

  /**
   * Get optimal model based on user tier and scenario
   */
  private getOptimalModel(userTier: UserTier, scenario: 'engagement_intelligence' | 'real_time' = 'engagement_intelligence') {
    let priority: 'cost' | 'speed' | 'accuracy' | 'balanced';
    let complexity: 'low' | 'medium' | 'high';

    switch (userTier) {
      case 'free':
        priority = 'cost';
        complexity = 'low';
        break;
      case 'premium':
        priority = 'accuracy';
        complexity = 'high';
        break;
      default:
        priority = 'balanced';
        complexity = 'medium';
    }

    const modelSelection = modelSelector.selectModel({
      taskType: 'market_intelligence',
      complexity,
      priority,
      responseFormat: 'json'
    });

    console.log(`🧠 Smart Model Selection for ${userTier} user (Engagement Intelligence):`);
    console.log(`   Selected: ${modelSelection.provider}:${modelSelection.model}`);
    console.log(`   Reasoning: ${modelSelection.reasoning}`);
    console.log(`   Estimated Cost: $${modelSelection.estimatedCost}/1M tokens`);

    return {
      provider: modelSelection.provider,
      model: modelSelection.model,
      estimatedCost: modelSelection.estimatedCost,
      estimatedLatency: modelSelection.estimatedLatency
    };
  }

  /**
   * Generate engagement intelligence insights
   */
  async generateEngagementInsight(
    userId: string,
    industry: string,
    userTier: UserTier = 'premium'
  ): Promise<EngagementIntelligenceInsight> {
    console.log(`🎯 Generating engagement intelligence for ${industry} (${userTier} user)`);

    // Rate limiting check
    const rateLimitResult = await aiRateLimiter.checkRateLimit(userId, 'engagement_intelligence');
    if (!rateLimitResult.allowed) {
      throw new Error(`Rate limit exceeded. Please try again in ${rateLimitResult.retryAfter} seconds.`);
    }

    // Get optimal model
    const modelSelection = this.getOptimalModel(userTier);

    // Gather engagement data
    const engagementData = await this.gatherEngagementData(industry);
    
    // Gather signal data
    const signalData = await this.gatherSignalData(industry);
    
    // Calculate signal score
    const { score: signalScore, factors: signalFactors } = this.calculateSignalScore(signalData);
    
    // Add signal data to engagement data
    engagementData.signalData = signalData;

    // Generate AI analysis
    const { insight, tokensUsed, cost } = await this.generateAIAnalysis(
      industry,
      engagementData,
      modelSelection,
      signalScore,
      signalFactors
    );

    // Track usage
    if (tokensUsed && cost) {
      await aiRateLimiter.recordRequest(userId, modelSelection.provider, modelSelection.model, 0, true, tokensUsed);
    }

    // Update model version
    await modelVersioning.recordModelRequest({
      userId,
      provider: modelSelection.provider,
      model: modelSelection.model,
      version: '1.0',
      requestData: { prompt: 'engagement_intelligence' },
      responseTime: 0,
      tokensUsed: tokensUsed || 0,
      cost: cost || 0,
      success: true,
      timestamp: new Date()
    });

    console.log(`✅ Engagement intelligence generated successfully`);
    console.log(`   Signal Score: ${signalScore.toFixed(2)}`);
    console.log(`   Confidence: ${(insight.confidenceScore * 100).toFixed(1)}%`);
    console.log(`   Model: ${modelSelection.provider}:${modelSelection.model}`);

    return {
      ...insight,
      signalScore,
      signalFactors,
      lastUpdated: new Date()
    };
  }

  /**
   * Generate engagement insight with caching support
   */
  async generateEngagementInsightWithCache(
    userId: string,
    industry: string,
    userTier: UserTier = 'premium',
    forceRefresh: boolean = false
  ): Promise<EngagementIntelligenceInsight> {
    try {
      // Get optimal model for signal calculation
      const modelSelection = this.getOptimalModel(userTier);
      
      // Gather signal data for caching
      const signalData = await this.gatherSignalData(industry);
      const { score: signalScore, factors: signalFactors } = this.calculateSignalScore(signalData);

      return await sharedCaching.generateInsightWithCache<EngagementIntelligenceInsight>(
        userId,
        industry,
        'engagement_insights',
        () => this.generateEngagementInsight(userId, industry, userTier),
        modelSelection.model,
        forceRefresh,
        signalScore,
        { signalFactors, signalData }
      );
    } catch (error) {
      console.error('Error generating engagement insight with cache:', error);
      throw error;
    }
  }

  /**
   * Force refresh engagement insight (bypass cache but respect rate limits)
   */
  async forceRefreshEngagementInsight(
    userId: string,
    industry: string,
    userTier: UserTier = 'premium'
  ): Promise<EngagementIntelligenceInsight> {
    try {
      const modelSelection = this.getOptimalModel(userTier);
      const signalData = await this.gatherSignalData(industry);
      const { score: signalScore, factors: signalFactors } = this.calculateSignalScore(signalData);

      return await sharedCaching.forceRefreshInsight<EngagementIntelligenceInsight>(
        userId,
        industry,
        'engagement_insights',
        () => this.generateEngagementInsight(userId, industry, userTier),
        modelSelection.model,
        signalScore,
        { signalFactors, signalData }
      );
    } catch (error) {
      console.error('Error force refreshing engagement insight:', error);
      throw error;
    }
  }

  /**
   * Get cached engagement insight if available
   */
  async getCachedEngagementInsight(
    userId: string,
    industry: string
  ): Promise<EngagementIntelligenceInsight | null> {
    try {
      return await sharedCaching.getCachedInsight<EngagementIntelligenceInsight>(userId, industry, 'engagement_insights');
    } catch (error) {
      console.error('Error getting cached engagement insight:', error);
      return null;
    }
  }

  /**
   * Check if user can perform a manual refresh
   */
  async checkRefreshLimit(
    userId: string,
    industry: string
  ): Promise<{ allowed: boolean; retryAfter?: number; lastRefresh?: Date }> {
    try {
      return await sharedCaching.checkRefreshLimit(userId, industry, 'engagement_insights');
    } catch (error) {
      console.error('Error checking refresh limit:', error);
      return { allowed: true };
    }
  }

  /**
   * Gather engagement data from various sources
   */
  private async gatherEngagementData(industry: string): Promise<EngagementDataSources> {
    console.log(`📊 Gathering engagement data for ${industry}`);

    try {
      // In a real implementation, these would be actual API calls
      const socialMediaMetrics = await this.getSocialMediaMetrics(industry);
      const emailAnalytics = await this.getEmailAnalytics(industry);
      const webAnalytics = await this.getWebAnalytics(industry);
      const customerFeedback = await this.getCustomerFeedback(industry);
      const conversionData = await this.getConversionData(industry);

      return {
        socialMediaMetrics,
        emailAnalytics,
        webAnalytics,
        customerFeedback,
        conversionData
      };
    } catch (error) {
      console.error(`❌ Error gathering engagement data:`, error);
      return this.getDefaultEngagementData();
    }
  }

  /**
   * Gather signal data for real-time analysis
   */
  private async gatherSignalData(industry: string): Promise<SignalData> {
    console.log(`📡 Gathering signal data for ${industry}`);

    try {
      const engagementMetrics = await this.getDetailedEngagementMetrics(industry);
      const sentimentData = await this.analyzeSentiment(industry);
      const conversionData = await this.getDetailedConversionMetrics(industry);
      const audienceData = await this.getDetailedAudienceMetrics(industry);
      const retentionData = await this.getDetailedRetentionMetrics(industry);

      return {
        engagementMetrics,
        sentimentData,
        conversionData,
        audienceData,
        retentionData
      };
    } catch (error) {
      console.error(`❌ Error gathering signal data:`, error);
      return this.getDefaultSignalData();
    }
  }

  /**
   * Get detailed engagement metrics
   */
  private async getDetailedEngagementMetrics(industry: string): Promise<EngagementMetrics> {
    // Simulated API call - replace with actual implementation
    return {
      totalInteractions: Math.floor(Math.random() * 10000) + 1000,
      engagementRate: Math.random() * 0.1 + 0.02, // 2-12%
      previousEngagementRate: Math.random() * 0.1 + 0.02,
      platformBreakdown: {
        social: Math.random() * 0.6 + 0.2,
        email: Math.random() * 0.3 + 0.1,
        web: Math.random() * 0.2 + 0.05,
        mobile: Math.random() * 0.4 + 0.1
      },
      interactionTypes: {
        likes: Math.floor(Math.random() * 5000) + 500,
        shares: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 2000) + 200,
        clicks: Math.floor(Math.random() * 3000) + 300
      }
    };
  }

  /**
   * Analyze sentiment from customer interactions
   */
  private async analyzeSentiment(industry: string): Promise<SentimentAnalysis> {
    // Simulated sentiment analysis - replace with actual implementation
    const overallSentiment = (Math.random() - 0.5) * 2; // -1 to 1
    
    return {
      overallSentiment,
      positiveInteractions: Math.floor(Math.random() * 1000) + 200,
      negativeInteractions: Math.floor(Math.random() * 200) + 50,
      neutralInteractions: Math.floor(Math.random() * 500) + 100,
      sentimentTrend: overallSentiment > 0.1 ? 'improving' : overallSentiment < -0.1 ? 'declining' : 'stable',
      keyTopics: ['customer service', 'product quality', 'user experience', 'pricing']
    };
  }

  /**
   * Get detailed conversion metrics
   */
  private async getDetailedConversionMetrics(industry: string): Promise<ConversionMetrics> {
    return {
      conversionRate: Math.random() * 0.05 + 0.01, // 1-6%
      previousConversionRate: Math.random() * 0.05 + 0.01,
      conversionTrend: (Math.random() - 0.5) * 0.02, // -1% to +1%
      funnelStages: {
        awareness: Math.random() * 0.8 + 0.2,
        consideration: Math.random() * 0.6 + 0.1,
        decision: Math.random() * 0.4 + 0.05,
        retention: Math.random() * 0.3 + 0.02
      },
      revenueImpact: Math.random() * 100000 + 10000
    };
  }

  /**
   * Get detailed audience metrics
   */
  private async getDetailedAudienceMetrics(industry: string): Promise<AudienceMetrics> {
    return {
      totalAudience: Math.floor(Math.random() * 100000) + 10000,
      audienceGrowth: Math.random() * 0.2 + 0.05, // 5-25%
      previousAudienceSize: Math.floor(Math.random() * 100000) + 10000,
      demographics: {
        ageGroups: {
          '18-24': Math.random() * 0.3 + 0.1,
          '25-34': Math.random() * 0.4 + 0.2,
          '35-44': Math.random() * 0.3 + 0.1,
          '45+': Math.random() * 0.2 + 0.05
        },
        locations: {
          'United States': Math.random() * 0.6 + 0.2,
          'Europe': Math.random() * 0.3 + 0.1,
          'Asia': Math.random() * 0.2 + 0.05
        },
        interests: ['technology', 'business', 'marketing', 'innovation']
      },
      engagementSegments: {
        highEngagers: Math.random() * 0.3 + 0.1,
        mediumEngagers: Math.random() * 0.5 + 0.2,
        lowEngagers: Math.random() * 0.4 + 0.1
      }
    };
  }

  /**
   * Get detailed retention metrics
   */
  private async getDetailedRetentionMetrics(industry: string): Promise<RetentionMetrics> {
    return {
      retentionRate: Math.random() * 0.4 + 0.3, // 30-70%
      churnRate: Math.random() * 0.2 + 0.05, // 5-25%
      lifetimeValue: Math.random() * 500 + 100,
      repeatPurchaseRate: Math.random() * 0.3 + 0.1, // 10-40%
      loyaltyScore: Math.random() * 100 + 50 // 50-150
    };
  }

  /**
   * Get default engagement data for fallback
   */
  private getDefaultEngagementData(): EngagementDataSources {
    return {
      socialMediaMetrics: {},
      emailAnalytics: {},
      webAnalytics: {},
      customerFeedback: {},
      conversionData: {}
    };
  }

  /**
   * Get default signal data for fallback
   */
  private getDefaultSignalData(): SignalData {
    return {
      engagementMetrics: {
        totalInteractions: 5000,
        engagementRate: 0.05,
        previousEngagementRate: 0.05,
        platformBreakdown: { social: 0.4, email: 0.2, web: 0.1, mobile: 0.3 },
        interactionTypes: { likes: 2000, shares: 500, comments: 1000, clicks: 1500 }
      },
      sentimentData: {
        overallSentiment: 0.1,
        positiveInteractions: 500,
        negativeInteractions: 100,
        neutralInteractions: 200,
        sentimentTrend: 'stable',
        keyTopics: ['general feedback']
      },
      conversionData: {
        conversionRate: 0.03,
        previousConversionRate: 0.03,
        conversionTrend: 0,
        funnelStages: { awareness: 0.5, consideration: 0.3, decision: 0.2, retention: 0.1 },
        revenueImpact: 50000
      },
      audienceData: {
        totalAudience: 50000,
        audienceGrowth: 0.1,
        previousAudienceSize: 45000,
        demographics: { ageGroups: {}, locations: {}, interests: [] },
        engagementSegments: { highEngagers: 0.2, mediumEngagers: 0.5, lowEngagers: 0.3 }
      },
      retentionData: {
        retentionRate: 0.5,
        churnRate: 0.1,
        lifetimeValue: 200,
        repeatPurchaseRate: 0.2,
        loyaltyScore: 75
      }
    };
  }

  /**
   * Generate AI analysis using the selected model
   */
  private async generateAIAnalysis(
    industry: string,
    engagementData: EngagementDataSources,
    modelSelection: { provider: string; model: string; estimatedCost: number; estimatedLatency: number },
    signalScore: number,
    signalFactors: SignalFactors
  ): Promise<{ insight: EngagementIntelligenceInsight; tokensUsed?: number; cost?: number }> {
    console.log(`🤖 Generating AI analysis with ${modelSelection.provider}:${modelSelection.model}`);

    const prompt = this.buildEngagementPrompt(industry, engagementData, signalScore, signalFactors);

    try {
      const aiClient = getSmartAIClient(new AIClient());
      const response = await aiClient.generate(prompt, {
        model: modelSelection.model,
        temperature: 0.7,
        maxTokens: 2000
      });

      const content = response.content;
      if (!content) {
        throw new Error('No content received from AI model');
      }

      // Log the raw AI response for debugging
      console.warn('Raw AI response:', content);

      // Parse the JSON response
      let parsedData;
      try {
        parsedData = JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON from markdown/code block or extra text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
          } catch (jsonExtractError) {
            console.error('Failed to parse extracted JSON from AI response:', jsonExtractError);
            throw new Error('Invalid AI response format');
          }
        } else {
          console.error('Failed to parse AI response:', parseError);
          throw new Error('Invalid AI response format');
        }
      }

      // Validate and structure the response
      const insight: EngagementIntelligenceInsight = {
        trends: this.validateTrends(parsedData.trends || []),
        strategies: this.validateStrategies(parsedData.strategies || []),
        keyMetrics: this.validateKeyMetrics(parsedData.keyMetrics || {}),
        fullInsight: parsedData.fullInsight || content,
        dataSources: {
          social_media: true,
          email_analytics: true,
          web_analytics: true,
          customer_feedback: true
        },
        confidenceScore: Math.min(1, Math.max(0, parsedData.confidenceScore || 0.8)),
        aiModelVersion: modelSelection.model,
        lastUpdated: new Date()
      };

      return {
        insight,
        tokensUsed: response.tokensUsed,
        cost: 0 // Default cost since SmartAIResponse doesn't have cost property
      };
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      throw new Error(`Failed to generate engagement intelligence: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build comprehensive prompt for engagement intelligence
   */
  private buildEngagementPrompt(
    industry: string,
    engagementData: EngagementDataSources,
    signalScore: number,
    signalFactors: SignalFactors
  ): string {
    return `You are an engagement intelligence strategist trusted by top CMOs and growth teams to identify emerging engagement trends, customer behavior shifts, and strategic plays for improving customer engagement and retention.

Based on the engagement data and real-time signals below, generate comprehensive engagement intelligence insights for the ${industry} industry.

📊 Engagement Data:
- Social Media Metrics: ${JSON.stringify(engagementData.socialMediaMetrics, null, 2)}
- Email Analytics: ${JSON.stringify(engagementData.emailAnalytics, null, 2)}
- Web Analytics: ${JSON.stringify(engagementData.webAnalytics, null, 2)}
- Customer Feedback: ${JSON.stringify(engagementData.customerFeedback, null, 2)}
- Conversion Data: ${JSON.stringify(engagementData.conversionData, null, 2)}

📡 Real-Time Signal Data:
- Signal Score: ${signalScore.toFixed(2)} (-100 to 100)
- Signal Factors:
  * Engagement Volume: ${signalFactors.engagementVolume.toFixed(1)}/100
  * Sentiment Momentum: ${signalFactors.sentimentMomentum.toFixed(1)}/100
  * Conversion Trend: ${signalFactors.conversionTrend.toFixed(1)}/100
  * Audience Growth: ${signalFactors.audienceGrowth.toFixed(1)}/100
  * Retention Index: ${signalFactors.retentionIndex.toFixed(1)}/100

🎯 Instructions:
1. Analyze the engagement patterns and identify emerging trends
2. Consider the signal score and factors in your analysis
3. Provide actionable strategies for improving engagement
4. Focus on data-driven insights and measurable outcomes
5. Consider industry-specific engagement patterns

📋 Output Format (JSON):
{
  "trends": [
    {
      "title": "Trend title",
      "direction": "up|down|stable",
      "percentageChange": number,
      "description": "Detailed trend description",
      "impact": "high|medium|low",
      "timeframe": "30 days|60 days|90 days"
    }
  ],
  "strategies": [
    {
      "title": "Strategy title",
      "description": "Detailed strategy description",
      "expectedImpact": number,
      "implementationDifficulty": "easy|medium|hard",
      "timeframe": "2-4 weeks|1-3 months|3-6 months",
      "resources": ["resource1", "resource2"],
      "successMetrics": ["metric1", "metric2"]
    }
  ],
  "keyMetrics": {
    "overallEngagement": number,
    "sentimentScore": number,
    "conversionRate": number,
    "audienceGrowth": number,
    "retentionRate": number
  },
  "fullInsight": "Comprehensive analysis text...",
  "confidenceScore": number
}

Focus on providing actionable, data-driven insights that can help improve customer engagement and business outcomes.`;
  }

  /**
   * Validate trends data
   */
  private validateTrends(trends: any[]): EngagementTrend[] {
    return trends.map(trend => ({
      title: trend.title || 'Unknown Trend',
      direction: this.validateDirection(trend.direction),
      percentageChange: this.validatePercentage(trend.percentageChange),
      description: trend.description || 'No description available',
      impact: this.validateImpact(trend.impact),
      timeframe: trend.timeframe || '30 days',
      aiModelVersion: 'gpt-4o'
    }));
  }

  /**
   * Validate strategies data
   */
  private validateStrategies(strategies: any[]): EngagementStrategy[] {
    return strategies.map(strategy => ({
      title: strategy.title || 'Unknown Strategy',
      description: strategy.description || 'No description available',
      expectedImpact: Math.max(0, Math.min(100, strategy.expectedImpact || 0)),
      implementationDifficulty: this.validateDifficulty(strategy.implementationDifficulty),
      timeframe: strategy.timeframe || '2-4 weeks',
      resources: Array.isArray(strategy.resources) ? strategy.resources : [],
      successMetrics: Array.isArray(strategy.successMetrics) ? strategy.successMetrics : []
    }));
  }

  /**
   * Validate key metrics
   */
  private validateKeyMetrics(metrics: any): any {
    return {
      overallEngagement: Math.max(0, Math.min(100, metrics.overallEngagement || 0)),
      sentimentScore: Math.max(0, Math.min(100, metrics.sentimentScore || 0)),
      conversionRate: Math.max(0, Math.min(100, metrics.conversionRate || 0)),
      audienceGrowth: Math.max(0, Math.min(100, metrics.audienceGrowth || 0)),
      retentionRate: Math.max(0, Math.min(100, metrics.retentionRate || 0))
    };
  }

  /**
   * Validate direction
   */
  private validateDirection(direction: any): 'up' | 'down' | 'flat' {
    if (direction === 'up' || direction === 'down' || direction === 'flat' || direction === 'stable') {
      return direction === 'stable' ? 'flat' : direction;
    }
    return 'flat';
  }

  /**
   * Validate percentage
   */
  private validatePercentage(percentage: any): number {
    const num = parseFloat(percentage);
    return isNaN(num) ? 0 : Math.max(-100, Math.min(100, num));
  }

  /**
   * Validate impact
   */
  private validateImpact(impact: any): 'high' | 'medium' | 'low' {
    if (impact === 'high' || impact === 'medium' || impact === 'low') {
      return impact;
    }
    return 'medium';
  }

  /**
   * Validate difficulty
   */
  private validateDifficulty(difficulty: any): 'easy' | 'medium' | 'hard' {
    if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
      return difficulty;
    }
    return 'medium';
  }

  /**
   * Get signal insights for a specific industry
   */
  async getSignalInsights(industry: string): Promise<{
    signalScore: number;
    factors: SignalFactors;
    signalData: SignalData;
    interpretation: string;
  }> {
    const signalData = await this.gatherSignalData(industry);
    const { score: signalScore, factors } = this.calculateSignalScore(signalData);
    
    const interpretation = this.getSignalStrengthDescription(signalScore);
    
    return {
      signalScore,
      factors,
      signalData,
      interpretation
    };
  }

  /**
   * Get signal strength description
   */
  getSignalStrengthDescription(signalScore: number): string {
    if (signalScore >= 70) {
      return 'Strong positive engagement signals with high customer satisfaction and growth momentum.';
    } else if (signalScore >= 40) {
      return 'Moderate engagement signals with stable customer relationships and steady growth.';
    } else if (signalScore >= 10) {
      return 'Weak positive signals with some engagement challenges but potential for improvement.';
    } else if (signalScore >= -10) {
      return 'Neutral engagement signals with mixed customer feedback and stable metrics.';
    } else if (signalScore >= -40) {
      return 'Weak negative signals with declining engagement and customer satisfaction concerns.';
    } else {
      return 'Strong negative signals with significant engagement challenges requiring immediate attention.';
    }
  }

  /**
   * Generate strategic engagement insight (NEW METHOD)
   */
  async generateStrategicEngagementInsight(
    userId: string,
    industry: string,
    userTier: UserTier = 'premium'
  ): Promise<EngagementInsight> {
    console.log(`🎯 Generating strategic engagement insight for ${industry} (${userTier} user)`);

    // Rate limiting check
    const rateLimitResult = await aiRateLimiter.checkRateLimit(userId, 'engagement_intelligence');
    if (!rateLimitResult.allowed) {
      throw new Error(`Rate limit exceeded. Please try again in ${rateLimitResult.retryAfter} seconds.`);
    }

    // Get optimal model
    const modelSelection = this.getOptimalModel(userTier);

    // Gather industry-wide engagement data
    const engagementData = await this.gatherEngagementData(industry);
    
    // Gather signal data
    const signalData = await this.gatherSignalData(industry);
    
    // Calculate signal score
    const { score: signalScore, factors: signalFactors } = this.calculateSignalScore(signalData);
    
    // Add signal data to engagement data
    engagementData.signalData = signalData;

    // Generate AI analysis
    const { insight, tokensUsed, cost } = await this.generateStrategicAIAnalysis(
      industry,
      engagementData,
      modelSelection,
      signalScore,
      signalFactors
    );

    // Track usage
    if (tokensUsed && cost) {
      await aiRateLimiter.recordRequest(userId, modelSelection.provider, modelSelection.model, 0, true, tokensUsed);
    }

    // Update model version
    await modelVersioning.recordModelRequest({
      userId,
      provider: modelSelection.provider,
      model: modelSelection.model,
      version: '2.0',
      requestData: { prompt: 'strategic_engagement_intelligence' },
      responseTime: 0,
      tokensUsed: tokensUsed || 0,
      cost: cost || 0,
      success: true,
      timestamp: new Date()
    });

    console.log(`✅ Strategic engagement insight generated successfully`);
    console.log(`   Signal Score: ${signalScore.toFixed(2)}`);
    console.log(`   Trends: ${insight.trends.length}`);
    console.log(`   Recommendations: ${insight.recommendations.length}`);

    return insight;
  }

  /**
   * Generate strategic AI analysis (NEW METHOD)
   */
  private async generateStrategicAIAnalysis(
    industry: string,
    engagementData: EngagementDataSources,
    modelSelection: { provider: string; model: string; estimatedCost: number; estimatedLatency: number },
    signalScore: number,
    signalFactors: SignalFactors
  ): Promise<{ insight: EngagementInsight; tokensUsed?: number; cost?: number }> {
    console.log(`🧠 Generating strategic AI analysis for ${industry}`);

    const prompt = this.buildStrategicEngagementPrompt(
      industry,
      engagementData,
      signalScore,
      signalFactors
    );

    const startTime = Date.now();
    
    try {
      const aiClient = getSmartAIClient(new AIClient());
      const response = await aiClient.generate(prompt, {
        model: modelSelection.model,
        temperature: 0.7,
        maxTokens: 1500
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log(`✅ AI analysis completed in ${responseTime}ms`);

      // Parse the AI response
      const parsedInsight = this.parseStrategicEngagementResponse(response.content || '', signalScore);

      return {
        insight: parsedInsight,
        tokensUsed: response.tokensUsed,
        cost: 0 // Default cost since SmartAIResponse doesn't have cost property
      };

    } catch (error) {
      console.error('❌ Error generating AI analysis:', error);
      
      // Return fallback insight
      return {
        insight: this.generateFallbackEngagementInsight(industry, signalScore)
      };
    }
  }

  /**
   * Build strategic engagement prompt
   */
  private buildStrategicEngagementPrompt(
    industry: string,
    engagementData: EngagementDataSources,
    signalScore: number,
    signalFactors: SignalFactors
  ): string {
    return `Analyze engagement intelligence for the ${industry} industry and provide strategic insights.

Industry: ${industry}
Signal Score: ${signalScore.toFixed(1)}/100
Signal Factors:
- Engagement Volume: ${signalFactors.engagementVolume.toFixed(1)}
- Sentiment Momentum: ${signalFactors.sentimentMomentum.toFixed(1)}
- Conversion Trend: ${signalFactors.conversionTrend.toFixed(1)}
- Audience Growth: ${signalFactors.audienceGrowth.toFixed(1)}
- Retention Index: ${signalFactors.retentionIndex.toFixed(1)}

Provide a JSON response with the following structure:
{
  "signalSummary": "Brief description of signal strength (e.g., 'Strong Positive', 'Neutral to Weak', 'Declining')",
  "trends": [
    {
      "title": "Trend name",
      "direction": "up|down|flat",
      "percentageChange": number,
      "description": "Brief description of the trend"
    }
  ],
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2", 
    "Actionable recommendation 3"
  ]
}

Focus on industry-wide trends and strategic recommendations that would benefit companies in the ${industry} sector. Keep descriptions concise and actionable.`;
  }

  /**
   * Parse strategic engagement response
   */
  private parseStrategicEngagementResponse(response: string, signalScore: number): EngagementInsight {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and structure the response
      const trends: EngagementTrend[] = (parsed.trends || []).slice(0, 3).map((trend: any, index: number) => ({
        title: trend.title || `Trend ${index + 1}`,
        direction: this.validateDirection(trend.direction),
        percentageChange: this.validatePercentage(trend.percentageChange),
        description: trend.description || 'No description available'
      }));

      const recommendations: string[] = (parsed.recommendations || []).slice(0, 3).map((rec: any) => 
        typeof rec === 'string' ? rec : 'Recommendation not available'
      );

      return {
        signalScore,
        signalSummary: parsed.signalSummary || this.getSignalStrengthDescription(signalScore),
        trends,
        recommendations,
        lastUpdated: new Date().toISOString(),
        aiModelVersion: 'gpt-4o',
        confidenceScore: 0.85
      };

    } catch (error) {
      console.error('❌ Error parsing AI response:', error);
      return this.generateFallbackEngagementInsight('general', signalScore);
    }
  }

  /**
   * Generate fallback engagement insight
   */
  private generateFallbackEngagementInsight(industry: string, signalScore: number): EngagementInsight {
    return {
      signalScore,
      signalSummary: this.getSignalStrengthDescription(signalScore),
      trends: [
        {
          title: 'Email Click-Throughs',
          direction: 'down',
          percentageChange: -10,
          description: 'Drop in CTR despite strong open rates'
        },
        {
          title: 'Customer Satisfaction',
          direction: 'flat',
          percentageChange: 0,
          description: 'Satisfaction holding steady'
        },
        {
          title: 'Retention Index',
          direction: 'up',
          percentageChange: 4.3,
          description: 'Slight improvement in retention'
        }
      ],
      recommendations: [
        'Revamp email content and CTAs to improve CTR',
        'Map customer journey to identify drop-off points',
        'Increase proactive engagement on social channels'
      ],
      lastUpdated: new Date().toISOString(),
      aiModelVersion: 'gpt-4o',
      confidenceScore: 0.75
    };
  }

  // Mock API methods - replace with actual implementations
  private async getSocialMediaMetrics(industry: string): Promise<any> {
    return { platform: 'mixed', engagement: Math.random() * 0.1 + 0.02 };
  }

  private async getEmailAnalytics(industry: string): Promise<any> {
    return { openRate: Math.random() * 0.3 + 0.1, clickRate: Math.random() * 0.05 + 0.01 };
  }

  private async getWebAnalytics(industry: string): Promise<any> {
    return { pageViews: Math.floor(Math.random() * 10000) + 1000, bounceRate: Math.random() * 0.5 + 0.2 };
  }

  private async getCustomerFeedback(industry: string): Promise<any> {
    return { satisfaction: Math.random() * 0.4 + 0.6, nps: Math.floor(Math.random() * 40) + 30 };
  }

  private async getConversionData(industry: string): Promise<any> {
    return { rate: Math.random() * 0.05 + 0.01, value: Math.random() * 100 + 50 };
  }
}

// Export singleton instance
export const engagementIntelligenceAnalysis = EngagementIntelligenceAnalysis.getInstance(); 