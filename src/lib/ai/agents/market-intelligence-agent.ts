import { z } from 'zod';
import { BaseAgent, AgentRequest, AgentResponse, AgentTool } from './base-agent';
import { supabaseService } from '@/lib/supabase';
import { AITask } from '@/lib/ai-router';

// Market Intelligence Response Schema
const MarketIntelligenceResponseSchema = z.object({
  trends: z.array(z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    direction: z.enum(['up', 'down', 'stable']),
    magnitude: z.number().finite().min(0).max(10),
    confidence: z.number().finite().min(0).max(1),
    timeframe: z.string(),
    sources: z.array(z.object({
      url: z.string(),
      title: z.string(),
      author: z.string().optional(),
      publishedAt: z.string().optional()
    }))
  })),
  opportunities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    impact: z.number().finite().min(0).max(10),
    urgency: z.number().finite().min(0).max(10),
    actionItems: z.array(z.string())
  })),
  risks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    probability: z.number().finite().min(0).max(1),
    impact: z.number().finite().min(0).max(10),
    mitigationStrategies: z.array(z.string())
  })),
  marketSnapshot: z.object({
    overview: z.string(),
    keyMetrics: z.record(z.union([z.string(), z.number().finite()])),
    competitiveAnalysis: z.string(),
    recommendations: z.array(z.string())
  })
});

type MarketIntelligenceResponse = z.infer<typeof MarketIntelligenceResponseSchema>;

export interface MarketIntelligenceRequest extends AgentRequest {
  industry: string;
  timeframe: '7d' | '30d' | '90d';
  focusAreas?: string[];
  includeCompetitive?: boolean;
}

export class MarketIntelligenceAgent extends BaseAgent {
  constructor() {
    super('MarketIntelligenceAgent', 'Analyzes market trends, opportunities, and competitive intelligence');
    this.registerTools();
  }

  private registerTools(): void {
    // Market data ingestion tool
    const dataIngestionTool: AgentTool = {
      name: 'ingestMarketData',
      description: 'Fetch and process market data from external sources',
      parameters: z.object({
        industry: z.string(),
        timeframe: z.string(),
        sources: z.array(z.string()).default(['finnhub', 'news_api'])
      }),
      execute: async (params) => {
        // Placeholder for external API integration
        return this.simulateMarketData(params.industry, params.timeframe);
      }
    };

    // Vector search tool
    const vectorSearchTool: AgentTool = {
      name: 'searchMarketArticles',
      description: 'Search market articles using vector similarity',
      parameters: z.object({
        query: z.string(),
        limit: z.number().finite().default(10),
        threshold: z.number().finite().default(0.8)
      }),
      execute: async (params) => {
        try {
          return await supabaseService.searchMarketArticles(params.query, params.limit);
        } catch (error) {
          return [];
        }
      }
    };

    // Content clustering tool
    const clusteringTool: AgentTool = {
      name: 'clusterContent',
      description: 'Cluster similar content for trend identification',
      parameters: z.object({
        articles: z.array(z.any()),
        clusterCount: z.number().finite().default(5)
      }),
      execute: async (params) => {
        return this.clusterArticles(params.articles, params.clusterCount);
      }
    };

    // Trend analysis tool
    const trendAnalysisTool: AgentTool = {
      name: 'analyzeTrends',
      description: 'Analyze trends from clustered content',
      parameters: z.object({
        clusters: z.array(z.any()),
        industry: z.string(),
        timeframe: z.string()
      }),
      execute: async (params) => {
        return this.analyzeTrendClusters(params.clusters, params.industry);
      }
    };

    this.registerTool(dataIngestionTool);
    this.registerTool(vectorSearchTool);
    this.registerTool(clusteringTool);
    this.registerTool(trendAnalysisTool);
  }

  async plan(request: MarketIntelligenceRequest): Promise<string[]> {
    const plan = [
      'Ingest fresh market data from external sources',
      'Search existing market articles for relevant content',
      'Cluster similar content to identify trends',
      'Analyze trends for direction and magnitude',
      'Identify opportunities and risks',
      'Generate competitive analysis',
      'Create market snapshot summary',
      'Format response with citations'
    ];

    this.setMemory('industry', request.industry);
    this.setMemory('timeframe', request.timeframe);
    this.setMemory('focusAreas', request.focusAreas || []);

    return plan;
  }

  async execute(_plan: string[], request: MarketIntelligenceRequest): Promise<any> {
    const results: any = {};

    try {
      // Step 1: Ingest market data
      const marketData = await this.executeTool('ingestMarketData', {
        industry: request.industry,
        timeframe: request.timeframe,
        sources: ['finnhub', 'news_api']
      });

      // Step 2: Search existing articles
      const searchQuery = `${request.industry} trends opportunities risks ${request.timeframe}`;
      const existingArticles = await this.executeTool('searchMarketArticles', {
        query: searchQuery,
        limit: 20
      });

      // Step 3: Cluster content
      const allArticles = [...marketData.articles, ...existingArticles];
      const clusters = await this.executeTool('clusterContent', {
        articles: allArticles,
        clusterCount: 5
      });

      // Step 4: Analyze trends
      const trendAnalysis = await this.executeTool('analyzeTrends', {
        clusters,
        industry: request.industry,
        timeframe: request.timeframe
      });

      // Step 5: Generate comprehensive market intelligence
      const intelligencePrompt = this.buildMarketIntelligencePrompt(
        request.industry,
        trendAnalysis,
        clusters,
        request.focusAreas
      );

      const aiResponse = await this.generateContent(intelligencePrompt, AITask.ANALYSIS);
      
      const parsedResponse = await this.validateAndRepairJSON(aiResponse, z.object({
        trends: z.array(z.any()),
        opportunities: z.array(z.any()),
        risks: z.array(z.any()),
        marketSnapshot: z.object({
          overview: z.string(),
          keyMetrics: z.record(z.union([z.string(), z.number().finite()])),
          competitiveAnalysis: z.string(),
          recommendations: z.array(z.string())
        })
      }));

      results.marketIntelligence = parsedResponse;
      results.sources = this.extractSources(allArticles);

      return results;

    } catch (error) {
      throw new Error(`Market intelligence execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validate(result: any): Promise<AgentResponse<MarketIntelligenceResponse>> {
    try {
      const formattedResponse: MarketIntelligenceResponse = {
        trends: result.marketIntelligence.trends.map((trend: any, index: number) => ({
          id: `trend_${index + 1}`,
          title: trend.title,
          summary: trend.summary,
          category: trend.category,
          direction: trend.direction,
          magnitude: trend.magnitude,
          confidence: trend.confidence,
          timeframe: trend.timeframe || '30d',
          sources: trend.sources || []
        })),
        opportunities: result.marketIntelligence.opportunities,
        risks: result.marketIntelligence.risks,
        marketSnapshot: result.marketIntelligence.marketSnapshot
      };

      const validatedResponse = MarketIntelligenceResponseSchema.parse(formattedResponse);

      return {
        success: true,
        data: validatedResponse,
        citations: result.sources || []
      };

    } catch (error) {
      return {
        success: false,
        data: {} as MarketIntelligenceResponse,
        errors: [error instanceof Error ? error.message : 'Market intelligence validation failed']
      };
    }
  }

  // Simulate market data (placeholder for external API integration)
  private simulateMarketData(industry: string, timeframe: string): any {
    return {
      articles: [
        {
          title: `${industry} Market Trends ${timeframe}`,
          summary: `Recent developments in ${industry} industry`,
          content: `Market analysis for ${industry} sector showing significant trends...`,
          source: 'Market Research',
          publishedAt: new Date().toISOString(),
          url: 'https://example.com/market-research'
        }
      ],
      metrics: {
        marketSize: Math.random() * 1000000,
        growthRate: Math.random() * 20,
        competitorCount: Math.floor(Math.random() * 100)
      }
    };
  }

  // Cluster articles for trend identification
  private clusterArticles(articles: any[], clusterCount: number): any[] {
    // Simplified clustering - in production this would use vector similarity
    const clusters = [];
    const articlesPerCluster = Math.ceil(articles.length / clusterCount);
    
    for (let i = 0; i < clusterCount; i++) {
      const startIndex = i * articlesPerCluster;
      const endIndex = Math.min(startIndex + articlesPerCluster, articles.length);
      
      clusters.push({
        id: `cluster_${i + 1}`,
        articles: articles.slice(startIndex, endIndex),
        theme: `Theme ${i + 1}`,
        relevanceScore: Math.random()
      });
    }
    
    return clusters;
  }

  // Analyze trend clusters
  private analyzeTrendClusters(clusters: any[], _industry: string): any {
    return {
      trendDirection: 'up',
      trendMagnitude: Math.random() * 10,
      confidence: 0.8,
      keyThemes: clusters.map(cluster => cluster.theme),
      timeframe: '30d'
    };
  }

  // Build market intelligence prompt
  private buildMarketIntelligencePrompt(
    industry: string,
    trendAnalysis: any,
    clusters: any[],
    focusAreas?: string[]
  ): string {
    const focusAreasText = focusAreas && focusAreas.length > 0 
      ? `Focus particularly on: ${focusAreas.join(', ')}`
      : '';

    return `
      You are a senior market analyst creating intelligence for a ${industry} company.
      
      Trend Analysis Data: ${JSON.stringify(trendAnalysis, null, 2)}
      Content Clusters: ${JSON.stringify(clusters, null, 2)}
      ${focusAreasText}
      
      Create comprehensive market intelligence in JSON format:
      
      {
        "trends": [
          {
            "title": "Specific trend name",
            "summary": "2-3 sentence summary",
            "category": "technology|market|regulatory|competitive",
            "direction": "up|down|stable", 
            "magnitude": 1-10,
            "confidence": 0.0-1.0,
            "timeframe": "Short/Medium/Long term",
            "sources": [{"url": "source_url", "title": "source_title"}]
          }
        ],
        "opportunities": [
          {
            "title": "Opportunity name",
            "description": "Detailed description",
            "category": "market|product|technology|partnership",
            "impact": 1-10,
            "urgency": 1-10,
            "actionItems": ["Specific action 1", "Specific action 2"]
          }
        ],
        "risks": [
          {
            "title": "Risk name", 
            "description": "Risk description",
            "category": "market|competitive|regulatory|technology",
            "probability": 0.0-1.0,
            "impact": 1-10,
            "mitigationStrategies": ["Strategy 1", "Strategy 2"]
          }
        ],
        "marketSnapshot": {
          "overview": "Executive summary of current market state",
          "keyMetrics": {"metric1": "value1", "metric2": 123},
          "competitiveAnalysis": "Analysis of competitive landscape",
          "recommendations": ["Recommendation 1", "Recommendation 2"]
        }
      }
      
      Ensure all data is specific, actionable, and relevant to ${industry} companies.
    `;
  }

  // Extract sources from articles
  private extractSources(articles: any[]): any[] {
    return articles.map(article => ({
      url: article.url || '',
      title: article.title || '',
      author: article.author,
      publishedAt: article.publishedAt
    }));
  }
}

// Export singleton instance
export const marketIntelligenceAgent = new MarketIntelligenceAgent();
