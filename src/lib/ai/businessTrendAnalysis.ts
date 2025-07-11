/**
 * 🔥 Business Trend Analysis Service
 *
 * This service generates dynamic business trend predictions using:
 * - AI-powered trend analysis for specific industries
 * - Real-time business intelligence synthesis
 * - Smart model selection for different user tiers
 * - Trend direction and percentage change calculation
 * - Real-time signal calculation for enhanced accuracy
 * - Consistent caching with 7-day cache and 1-day refresh limit
 *
 * Used to power: Business Trend Cards, Industry Insights, and Strategic Predictions.
 */

import { aiRateLimiter } from './rateLimiter';
import { modelVersioning } from './modelVersioning';
import { callOpenAI } from './callOpenAI';
import { modelSelector } from './modelSelector';
import { sharedCaching } from './sharedCaching';

// User tier types
export type UserTier = 'free' | 'premium';

// Business trend interface
export interface BusinessTrend {
  title: string;
  direction: 'up' | 'down' | 'stable';
  percentageChange: number;
  description: string;
  industry: string;
  aiModelVersion: string;
  signalScore?: number; // Real-time signal strength
  signalFactors?: SignalFactors; // Breakdown of signal components
}

// Real-time signal calculation interfaces
export interface SignalFactors {
  newsVolume: number; // Number of relevant news articles (0-100)
  marketMomentum: number; // Market cap and growth rate changes (-100 to 100)
  sentimentScore: number; // Sentiment polarity from sources (-100 to 100)
  analystConfidence: number; // Analyst report confidence (0-100)
  volatilityIndex: number; // Market volatility indicator (0-100)
}

export interface SignalData {
  newsArticles: NewsArticle[];
  marketMetrics: MarketMetrics;
  sentimentData: SentimentData;
  analystInsights: AnalystInsight[];
}

export interface NewsArticle {
  headline: string;
  source: string;
  timestamp: Date;
  relevance: number; // 0-1 relevance score
  sentiment: number; // -1 to 1 sentiment score
}

export interface MarketMetrics {
  marketCap: number;
  growthRate: number;
  previousMarketCap: number;
  previousGrowthRate: number;
  volatility: number;
  tradingVolume: number;
}

export interface SentimentData {
  overallSentiment: number; // -1 to 1
  positiveArticles: number;
  negativeArticles: number;
  neutralArticles: number;
  sentimentTrend: 'improving' | 'declining' | 'stable';
}

export interface AnalystInsight {
  title: string;
  confidence: number; // 0-1
  outlook: 'bullish' | 'bearish' | 'neutral';
  keyMetrics: string[];
}

// Business trend data sources
export interface TrendDataSources {
  industry: string;
  marketData: any;
  newsHeadlines: string[];
  analystReports: any[];
  financialMetrics: any;
  signalData?: SignalData; // Enhanced with real-time signals
}

class BusinessTrendAnalysis {
  private static instance: BusinessTrendAnalysis;

  private constructor() {}

  static getInstance(): BusinessTrendAnalysis {
    if (!BusinessTrendAnalysis.instance) {
      BusinessTrendAnalysis.instance = new BusinessTrendAnalysis();
    }
    return BusinessTrendAnalysis.instance;
  }

  /**
   * Calculate real-time signal score based on multiple factors
   */
  private calculateSignalScore(signalData: SignalData): { score: number; factors: SignalFactors } {
    // Calculate news volume score (0-100)
    const newsVolume = Math.min(100, signalData.newsArticles.length * 10);
    
    // Calculate market momentum score (-100 to 100)
    const marketCapChange = ((signalData.marketMetrics.marketCap - signalData.marketMetrics.previousMarketCap) / 
                            signalData.marketMetrics.previousMarketCap) * 100;
    const growthRateChange = (signalData.marketMetrics.growthRate - signalData.marketMetrics.previousGrowthRate) * 100;
    const marketMomentum = Math.max(-100, Math.min(100, (marketCapChange + growthRateChange) / 2));
    
    // Calculate sentiment score (-100 to 100)
    const sentimentScore = signalData.sentimentData.overallSentiment * 100;
    
    // Calculate analyst confidence score (0-100)
    const analystConfidence = signalData.analystInsights.length > 0 
      ? signalData.analystInsights.reduce((sum, insight) => sum + insight.confidence, 0) / signalData.analystInsights.length * 100
      : 50; // Default neutral confidence
    
    // Calculate volatility index (0-100)
    const volatilityIndex = Math.min(100, signalData.marketMetrics.volatility * 100);
    
    // Weighted signal score calculation
    const weights = {
      newsVolume: 0.2,
      marketMomentum: 0.3,
      sentimentScore: 0.25,
      analystConfidence: 0.15,
      volatilityIndex: 0.1
    };
    
    const signalScore = (
      newsVolume * weights.newsVolume +
      marketMomentum * weights.marketMomentum +
      sentimentScore * weights.sentimentScore +
      analystConfidence * weights.analystConfidence +
      (100 - volatilityIndex) * weights.volatilityIndex // Lower volatility is better
    );
    
    return {
      score: Math.max(-100, Math.min(100, signalScore)),
      factors: {
        newsVolume,
        marketMomentum,
        sentimentScore,
        analystConfidence,
        volatilityIndex
      }
    };
  }

  /**
   * Get optimal model based on user tier and scenario
   */
  private getOptimalModel(userTier: UserTier, scenario: 'business_trends' | 'real_time' = 'business_trends') {
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

    console.log(`🧠 Smart Model Selection for ${userTier} user (Business Trends):`);
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
   * Generate business trends for a specific industry
   */
  async generateBusinessTrends(
    userId: string,
    industry: string,
    userTier: UserTier = 'premium'
  ): Promise<BusinessTrend[]> {
    const startTime = Date.now();

    try {
      // Get optimal model for user tier
      const modelSelection = this.getOptimalModel(userTier, 'business_trends');

      // Check rate limits with selected model
      const rateLimitResult = await aiRateLimiter.checkRateLimit(
        userId,
        modelSelection.provider,
        modelSelection.model,
        userTier
      );

      if (!rateLimitResult.allowed) {
        throw new Error(`Rate limit exceeded. Retry after ${rateLimitResult.retryAfter} seconds`);
      }

      // Get trend data from multiple sources
      const trendData = await this.gatherTrendData(industry);

      // Calculate real-time signal score
      const signalScoreResult = this.calculateSignalScore(trendData.signalData || this.getDefaultSignalData());
      const signalScore = signalScoreResult.score;
      const signalFactors = signalScoreResult.factors;

      // Generate AI analysis with selected model and signal data
      const aiAnalysis = await this.generateAIAnalysis(industry, trendData, modelSelection, signalScore, signalFactors);

      // Record successful request
      const responseTime = Date.now() - startTime;
      await aiRateLimiter.recordRequest(
        userId,
        modelSelection.provider,
        modelSelection.model,
        responseTime,
        true,
        aiAnalysis.tokensUsed
      );

      // Record model request for versioning
      await modelVersioning.recordModelRequest({
        userId,
        provider: modelSelection.provider,
        model: modelSelection.model,
        version: '1.0',
        requestData: { industry, trendData, userTier },
        responseData: aiAnalysis,
        responseTime,
        tokensUsed: aiAnalysis.tokensUsed || 0,
        cost: aiAnalysis.cost || 0,
        success: true,
        timestamp: new Date()
      });

      return aiAnalysis.trends;

    } catch (error) {
      // Record failed request
      const responseTime = Date.now() - startTime;
      const modelSelection = this.getOptimalModel(userTier, 'business_trends');
      
      await aiRateLimiter.recordRequest(
        userId,
        modelSelection.provider,
        modelSelection.model,
        responseTime,
        false
      );

      throw error;
    }
  }

  /**
   * Generate business trends with caching support
   */
  async generateBusinessTrendsWithCache(
    userId: string,
    industry: string,
    userTier: UserTier = 'premium',
    forceRefresh: boolean = false
  ): Promise<BusinessTrend[]> {
    try {
      // Get optimal model for signal calculation
      const modelSelection = this.getOptimalModel(userTier);
      
      // Gather signal data for caching
      const signalData = await this.gatherSignalData(industry);
      const { score: signalScore, factors: signalFactors } = this.calculateSignalScore(signalData);

      return await sharedCaching.generateInsightWithCache<BusinessTrend[]>(
        userId,
        industry,
        'business_trends',
        () => this.generateBusinessTrends(userId, industry, userTier),
        modelSelection.model,
        forceRefresh,
        signalScore,
        { signalFactors, signalData }
      );
    } catch (error) {
      console.error('Error generating business trends with cache:', error);
      throw error;
    }
  }

  /**
   * Force refresh business trends (bypass cache but respect rate limits)
   */
  async forceRefreshBusinessTrends(
    userId: string,
    industry: string,
    userTier: UserTier = 'premium'
  ): Promise<BusinessTrend[]> {
    try {
      const modelSelection = this.getOptimalModel(userTier);
      const signalData = await this.gatherSignalData(industry);
      const { score: signalScore, factors: signalFactors } = this.calculateSignalScore(signalData);

      return await sharedCaching.forceRefreshInsight<BusinessTrend[]>(
        userId,
        industry,
        'business_trends',
        () => this.generateBusinessTrends(userId, industry, userTier),
        modelSelection.model,
        signalScore,
        { signalFactors, signalData }
      );
    } catch (error) {
      console.error('Error force refreshing business trends:', error);
      throw error;
    }
  }

  /**
   * Get cached business trends if available
   */
  async getCachedBusinessTrends(
    userId: string,
    industry: string
  ): Promise<BusinessTrend[] | null> {
    try {
      return await sharedCaching.getCachedInsight<BusinessTrend[]>(userId, industry, 'business_trends');
    } catch (error) {
      console.error('Error getting cached business trends:', error);
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
      return await sharedCaching.checkRefreshLimit(userId, industry, 'business_trends');
    } catch (error) {
      console.error('Error checking refresh limit:', error);
      return { allowed: true };
    }
  }

  /**
   * Gather enhanced trend data with real-time signals
   */
  private async gatherTrendData(industry: string): Promise<TrendDataSources> {
    const [newsHeadlines, analystReports, financialMetrics, signalData] = await Promise.allSettled([
      this.getIndustryNews(industry),
      this.getAnalystReports(industry),
      this.getFinancialMetrics(industry),
      this.gatherSignalData(industry)
    ]);

    return {
      industry,
      marketData: {},
      newsHeadlines: newsHeadlines.status === 'fulfilled' ? newsHeadlines.value : [],
      analystReports: analystReports.status === 'fulfilled' ? analystReports.value : [],
      financialMetrics: financialMetrics.status === 'fulfilled' ? financialMetrics.value : {},
      signalData: signalData.status === 'fulfilled' ? signalData.value : undefined
    };
  }

  /**
   * Gather comprehensive signal data for real-time analysis
   */
  private async gatherSignalData(industry: string): Promise<SignalData> {
    const [newsArticles, marketMetrics, sentimentData, analystInsights] = await Promise.allSettled([
      this.getRelevantNewsArticles(industry),
      this.getDetailedMarketMetrics(industry),
      this.analyzeSentiment(industry),
      this.getAnalystInsights(industry)
    ]);

    return {
      newsArticles: newsArticles.status === 'fulfilled' ? newsArticles.value : [],
      marketMetrics: marketMetrics.status === 'fulfilled' ? marketMetrics.value : this.getDefaultMarketMetrics(),
      sentimentData: sentimentData.status === 'fulfilled' ? sentimentData.value : this.getDefaultSentimentData(),
      analystInsights: analystInsights.status === 'fulfilled' ? analystInsights.value : []
    };
  }

  /**
   * Get relevant news articles with sentiment analysis
   */
  private async getRelevantNewsArticles(industry: string): Promise<NewsArticle[]> {
    // Mock implementation - in production, this would call news APIs with sentiment analysis
    const mockArticles: NewsArticle[] = [
      {
        headline: `${industry} companies accelerate digital transformation`,
        source: 'TechCrunch',
        timestamp: new Date(),
        relevance: 0.9,
        sentiment: 0.7
      },
      {
        headline: `New AI regulations impact ${industry} sector`,
        source: 'Reuters',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        relevance: 0.8,
        sentiment: -0.3
      },
      {
        headline: `${industry} leaders focus on sustainability initiatives`,
        source: 'Bloomberg',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        relevance: 0.7,
        sentiment: 0.5
      },
      {
        headline: `Investment in ${industry} technology reaches new highs`,
        source: 'Forbes',
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
        relevance: 0.9,
        sentiment: 0.8
      },
      {
        headline: `Supply chain disruptions affect ${industry} operations`,
        source: 'Wall Street Journal',
        timestamp: new Date(Date.now() - 345600000), // 4 days ago
        relevance: 0.6,
        sentiment: -0.6
      }
    ];
    
    return mockArticles;
  }

  /**
   * Get detailed market metrics for signal calculation
   */
  private async getDetailedMarketMetrics(industry: string): Promise<MarketMetrics> {
    // Mock implementation - in production, this would fetch from financial APIs
    const currentMarketCap = 1000000000;
    const previousMarketCap = 950000000;
    const currentGrowthRate = 0.15;
    const previousGrowthRate = 0.12;
    
    return {
      marketCap: currentMarketCap,
      growthRate: currentGrowthRate,
      previousMarketCap,
      previousGrowthRate,
      volatility: 0.25,
      tradingVolume: 50000000
    };
  }

  /**
   * Analyze sentiment from news sources
   */
  private async analyzeSentiment(industry: string): Promise<SentimentData> {
    // Mock implementation - in production, this would use NLP services
    const articles = await this.getRelevantNewsArticles(industry);
    
    const positiveArticles = articles.filter(a => a.sentiment > 0.2).length;
    const negativeArticles = articles.filter(a => a.sentiment < -0.2).length;
    const neutralArticles = articles.filter(a => a.sentiment >= -0.2 && a.sentiment <= 0.2).length;
    
    const overallSentiment = articles.reduce((sum, article) => sum + article.sentiment, 0) / articles.length;
    
    // Determine sentiment trend based on recent articles
    const recentArticles = articles.slice(0, 3);
    const recentSentiment = recentArticles.reduce((sum, article) => sum + article.sentiment, 0) / recentArticles.length;
    
    let sentimentTrend: 'improving' | 'declining' | 'stable';
    if (recentSentiment > overallSentiment + 0.1) {
      sentimentTrend = 'improving';
    } else if (recentSentiment < overallSentiment - 0.1) {
      sentimentTrend = 'declining';
    } else {
      sentimentTrend = 'stable';
    }
    
    return {
      overallSentiment,
      positiveArticles,
      negativeArticles,
      neutralArticles,
      sentimentTrend
    };
  }

  /**
   * Get detailed analyst insights
   */
  private async getAnalystInsights(industry: string): Promise<AnalystInsight[]> {
    // Mock implementation - in production, this would fetch from analyst databases
    return [
      {
        title: `${industry} Market Analysis Q4 2024`,
        confidence: 0.85,
        outlook: 'bullish',
        keyMetrics: ['Digital transformation', 'AI adoption', 'Market expansion']
      },
      {
        title: `${industry} Trends Report`,
        confidence: 0.72,
        outlook: 'neutral',
        keyMetrics: ['Sustainability focus', 'Remote work evolution', 'Supply chain optimization']
      },
      {
        title: `${industry} Investment Outlook`,
        confidence: 0.78,
        outlook: 'bullish',
        keyMetrics: ['Technology investment', 'M&A activity', 'International growth']
      }
    ];
  }

  /**
   * Get default market metrics for fallback
   */
  private getDefaultMarketMetrics(): MarketMetrics {
    return {
      marketCap: 1000000000,
      growthRate: 0.1,
      previousMarketCap: 1000000000,
      previousGrowthRate: 0.1,
      volatility: 0.2,
      tradingVolume: 50000000
    };
  }

  /**
   * Get default sentiment data for fallback
   */
  private getDefaultSentimentData(): SentimentData {
    return {
      overallSentiment: 0,
      positiveArticles: 0,
      negativeArticles: 0,
      neutralArticles: 0,
      sentimentTrend: 'stable'
    };
  }

  /**
   * Get default signal data for fallback
   */
  private getDefaultSignalData(): SignalData {
    return {
      newsArticles: [],
      marketMetrics: this.getDefaultMarketMetrics(),
      sentimentData: this.getDefaultSentimentData(),
      analystInsights: []
    };
  }

  /**
   * Generate AI analysis using enhanced prompt and selected model with real-time signals
   */
  private async generateAIAnalysis(
    industry: string,
    trendData: TrendDataSources,
    modelSelection: { provider: string; model: string; estimatedCost: number; estimatedLatency: number },
    signalScore: number,
    signalFactors: SignalFactors
  ): Promise<{ trends: BusinessTrend[]; tokensUsed?: number; cost?: number }> {
    const prompt = this.buildTrendPrompt(industry, trendData, signalScore, signalFactors);

    // Use the selected model instead of hardcoded callOpenAI
    let response: any;
    let tokensUsed = 0;
    let cost = 0;

    try {
      // For now, we'll use callOpenAI but with the selected model
      // In the future, this could be replaced with a multi-provider client
      response = await callOpenAI(prompt, { model: modelSelection.model });
      
      // Estimate tokens and cost based on model selection
      tokensUsed = response.length || 1000; // Rough estimate
      cost = (tokensUsed / 1000000) * modelSelection.estimatedCost;
      
    } catch (error) {
      console.error(`Error with ${modelSelection.provider}:${modelSelection.model}:`, error);
      
      // Fallback to GPT-4o-mini if selected model fails
      console.log('🔄 Falling back to GPT-4o-mini...');
      response = await callOpenAI(prompt, { model: 'gpt-4o-mini' });
      tokensUsed = response.length || 1000;
      cost = (tokensUsed / 1000000) * 0.15; // GPT-4o-mini cost
    }

    const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response.parsed;

    // Validate and structure the response with signal data
    const trends: BusinessTrend[] = (parsedResponse.trends || []).map((trend: any) => ({
      title: trend.title || '',
      direction: this.validateDirection(trend.direction),
      percentageChange: this.validatePercentage(trend.percentageChange),
      description: trend.description || '',
      industry,
      aiModelVersion: modelVersioning.getActiveVersion(modelSelection.provider, modelSelection.model) || '1.0',
      signalScore,
      signalFactors
    }));

    return { trends, tokensUsed, cost };
  }

  /**
   * Build enhanced prompt for business trend analysis with real-time signals
   */
  private buildTrendPrompt(industry: string, trendData: TrendDataSources, signalScore: number, signalFactors: SignalFactors): string {
    // Get news headlines for context
    const headlines = trendData.newsHeadlines.slice(0, 5).map((headline: string) => `- "${headline}"`).join("\n");

    // Format signal factors for the prompt
    const signalInfo = `
📊 Real-Time Signal Analysis:
- Signal Strength: ${signalScore.toFixed(1)}/100 (${signalScore > 50 ? 'Strong Positive' : signalScore < -50 ? 'Strong Negative' : 'Neutral'})
- News Volume: ${signalFactors.newsVolume.toFixed(1)}/100
- Market Momentum: ${signalFactors.marketMomentum.toFixed(1)}/100
- Sentiment Score: ${signalFactors.sentimentScore.toFixed(1)}/100
- Analyst Confidence: ${signalFactors.analystConfidence.toFixed(1)}/100
- Volatility Index: ${signalFactors.volatilityIndex.toFixed(1)}/100

Use this signal data to influence trend direction and confidence levels.`;

    return `You are an enterprise strategist generating real-time trend signals for the ${industry} industry.

📅 Date: ${new Date().toISOString().split('T')[0]}
🗂️ Industry: ${industry}

${signalInfo}

📊 Data Sources (last 7 days):
- Top News Headlines:
${headlines}
- Financial Metrics: ${JSON.stringify(trendData.financialMetrics)}
- Analyst Reports: ${trendData.analystReports.map(r => r.title).join(', ')}

🗂️ Instructions:
- Extract strategic business trends using signals from the headlines and real-time signal data.
- Use the signal strength (${signalScore.toFixed(1)}/100) to influence trend direction and confidence.
- Strong positive signals (>50) should generally indicate upward trends.
- Strong negative signals (<-50) should generally indicate downward trends.
- Neutral signals (-50 to 50) should indicate stable or mixed trends.
- Offer actionable insights, not just summaries.
- Assume a cross-industry audience (unless clear sector context exists).
- Focus on innovation, adaptability, and growth (not just risk).
- Use headlines as anchor points where helpful (but don't quote all of them).
- Keep the tone balanced and strategic, not overly optimistic or alarmist.

## Output Format
✍️ Output Format:
🔥 Business Trend Summary:
A concise 2–3 sentence summary highlighting the major directional theme.

🎯 Actionable Recommendations:
- Bullet 1 (actionable and relevant)
- Bullet 2
- Bullet 3
- Bullet 4
- Bullet 5
- Bullet 6
- Bullet 7

Guidance:
- Provide exactly 3 recommendations.
- If the news headlines offer ambiguous or insufficient information for clear recommendations, briefly note this in the trend summary and offer general strategic advice based on available signals.
- Focus on trends like:
  - Digital transformation and technology adoption
  - Market dynamics and competitive landscape
  - Regulatory changes and compliance
  - Consumer behavior shifts
  - Operational efficiency and process improvements
  - Sustainability and ESG initiatives
  - Talent and workforce changes
  - Supply chain and logistics
  - Financial and investment patterns

Return your response as a JSON object with this exact structure:
{
  "trends": [
    {
      "title": "string",
      "direction": "up|down|stable",
      "percentageChange": number,
      "description": "string"
    },
    {
      "title": "string",
      "direction": "up|down|stable",
      "percentageChange": number,
      "description": "string"
    },
    {
      "title": "string",
      "direction": "up|down|stable",
      "percentageChange": number,
      "description": "string"
    },
  ]
}

Make the trends specific to the ${industry} industry and ensure they are current, relevant, and actionable.`;
  }

  /**
   * Get industry news headlines
   */
  private async getIndustryNews(industry: string): Promise<string[]> {
    // Mock implementation - in production, this would call news APIs
    const mockHeadlines = [
      `${industry} companies accelerate digital transformation`,
      `New AI regulations impact ${industry} sector`,
      `${industry} leaders focus on sustainability initiatives`,
      `Remote work trends stabilize in ${industry}`,
      `Investment in ${industry} technology reaches new highs`
    ];
    return mockHeadlines;
  }

  /**
   * Get analyst reports
   */
  private async getAnalystReports(industry: string): Promise<any[]> {
    // Mock implementation - in production, this would fetch from analyst databases
    return [
      { title: `${industry} Market Analysis Q4 2024`, insights: ['Digital transformation', 'AI adoption'] },
      { title: `${industry} Trends Report`, insights: ['Sustainability focus', 'Remote work evolution'] }
    ];
  }

  /**
   * Get financial metrics
   */
  private async getFinancialMetrics(industry: string): Promise<any> {
    // Mock implementation - in production, this would fetch from financial APIs
    return {
      marketCap: 1000000000,
      growthRate: 0.15,
      investmentTrend: 'increasing'
    };
  }

  /**
   * Validate trend direction
   */
  private validateDirection(direction: any): 'up' | 'down' | 'stable' {
    const validDirections = ['up', 'down', 'stable'];
    return validDirections.includes(direction) ? direction : 'stable';
  }

  /**
   * Validate percentage change
   */
  private validatePercentage(percentage: any): number {
    const num = Number(percentage);
    if (isNaN(num)) return 0;
    return Math.max(-50, Math.min(50, num)); // Clamp between -50 and +50
  }

  /**
   * Get real-time signal insights for an industry
   */
  async getSignalInsights(industry: string): Promise<{
    signalScore: number;
    factors: SignalFactors;
    signalData: SignalData;
    interpretation: string;
  }> {
    try {
      const signalData = await this.gatherSignalData(industry);
      const signalResult = this.calculateSignalScore(signalData);
      
      // Generate interpretation based on signal score
      let interpretation = '';
      if (signalResult.score > 70) {
        interpretation = 'Very strong positive signals indicating significant growth opportunities';
      } else if (signalResult.score > 30) {
        interpretation = 'Strong positive signals suggesting favorable market conditions';
      } else if (signalResult.score > -30) {
        interpretation = 'Neutral signals indicating stable market conditions';
      } else if (signalResult.score > -70) {
        interpretation = 'Negative signals suggesting potential challenges ahead';
      } else {
        interpretation = 'Very strong negative signals indicating significant market concerns';
      }

      return {
        signalScore: signalResult.score,
        factors: signalResult.factors,
        signalData,
        interpretation
      };
    } catch (error) {
      console.error('Error getting signal insights:', error);
      throw error;
    }
  }

  /**
   * Get signal strength description
   */
  getSignalStrengthDescription(signalScore: number): string {
    if (signalScore > 70) return 'Very Strong Positive';
    if (signalScore > 30) return 'Strong Positive';
    if (signalScore > 10) return 'Moderate Positive';
    if (signalScore > -10) return 'Neutral';
    if (signalScore > -30) return 'Moderate Negative';
    if (signalScore > -70) return 'Strong Negative';
    return 'Very Strong Negative';
  }
}

export const businessTrendAnalysis = BusinessTrendAnalysis.getInstance(); 