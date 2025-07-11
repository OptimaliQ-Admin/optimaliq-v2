/**
 * 🔥 Business Trend Analysis Service
 *
 * This service generates dynamic business trend predictions using:
 * - AI-powered trend analysis for specific industries
 * - Real-time business intelligence synthesis
 * - Smart model selection for different user tiers
 * - Trend direction and percentage change calculation
 *
 * Used to power: Business Trend Cards, Industry Insights, and Strategic Predictions.
 */

import { aiRateLimiter } from './rateLimiter';
import { modelVersioning } from './modelVersioning';
import { callOpenAI } from './callOpenAI';
import { modelSelector } from './modelSelector';

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
}

// Business trend data sources
export interface TrendDataSources {
  industry: string;
  marketData: any;
  newsHeadlines: string[];
  analystReports: any[];
  financialMetrics: any;
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

      // Generate AI analysis with selected model
      const aiAnalysis = await this.generateAIAnalysis(industry, trendData, modelSelection);

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
   * Gather trend data from multiple sources
   */
  private async gatherTrendData(industry: string): Promise<TrendDataSources> {
    const [newsHeadlines, analystReports, financialMetrics] = await Promise.allSettled([
      this.getIndustryNews(industry),
      this.getAnalystReports(industry),
      this.getFinancialMetrics(industry)
    ]);

    return {
      industry,
      marketData: {},
      newsHeadlines: newsHeadlines.status === 'fulfilled' ? newsHeadlines.value : [],
      analystReports: analystReports.status === 'fulfilled' ? analystReports.value : [],
      financialMetrics: financialMetrics.status === 'fulfilled' ? financialMetrics.value : {}
    };
  }

  /**
   * Generate AI analysis using enhanced prompt and selected model
   */
  private async generateAIAnalysis(
    industry: string,
    trendData: TrendDataSources,
    modelSelection: { provider: string; model: string; estimatedCost: number; estimatedLatency: number }
  ): Promise<{ trends: BusinessTrend[]; tokensUsed?: number; cost?: number }> {
    const prompt = this.buildTrendPrompt(industry, trendData);

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

    // Validate and structure the response
    const trends: BusinessTrend[] = (parsedResponse.trends || []).map((trend: any) => ({
      title: trend.title || '',
      direction: this.validateDirection(trend.direction),
      percentageChange: this.validatePercentage(trend.percentageChange),
      description: trend.description || '',
      industry,
      aiModelVersion: modelVersioning.getActiveVersion(modelSelection.provider, modelSelection.model) || '1.0'
    }));

    return { trends, tokensUsed, cost };
  }

  /**
   * Build enhanced prompt for business trend analysis
   */
  private buildTrendPrompt(industry: string, trendData: TrendDataSources): string {
    return `You are a business intelligence analyst specializing in ${industry} industry trends.

Analyze the current business landscape and generate 4 key business trends that are most relevant to the ${industry} industry.

For each trend, provide:
1. A concise title (2-4 words)
2. Direction: "up", "down", or "stable"
3. Percentage change: A realistic number between -50 and +50
4. A brief description (1-2 sentences)

Focus on trends like:
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
      "title": "Digital Transformation",
      "direction": "up",
      "percentageChange": 23,
      "description": "Accelerating adoption of digital technologies across the industry"
    },
    {
      "title": "AI Integration",
      "direction": "up", 
      "percentageChange": 18,
      "description": "Growing investment in AI solutions for operational efficiency"
    },
    {
      "title": "Remote Work",
      "direction": "down",
      "percentageChange": -5,
      "description": "Stabilizing after pandemic surge as hybrid models emerge"
    },
    {
      "title": "Sustainability",
      "direction": "up",
      "percentageChange": 31,
      "description": "Increasing focus on ESG initiatives and green practices"
    }
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
}

export const businessTrendAnalysis = BusinessTrendAnalysis.getInstance(); 