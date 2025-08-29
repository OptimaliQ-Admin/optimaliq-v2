/**
 * Market Intelligence Search API
 * Provides advanced search functionality with semantic analysis and filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';

// Request schema
const MarketSearchSchema = z.object({
  query: z.string().min(1).max(500),
  filters: z.object({
    industry: z.array(z.string()).optional(),
    timeRange: z.enum(['1week', '1month', '3months', '6months', '1year']).default('3months'),
    trendType: z.array(z.enum(['up', 'down', 'stable'])).optional(),
    confidence: z.number().min(0).max(1).optional(),
    source: z.array(z.string()).optional(),
    category: z.array(z.string()).optional()
  }).optional(),
  options: z.object({
    includeSemanticSearch: z.boolean().default(true),
    includeTrendAnalysis: z.boolean().default(true),
    includeCompetitiveAnalysis: z.boolean().default(false),
    maxResults: z.number().min(1).max(100).default(20),
    sortBy: z.enum(['relevance', 'date', 'confidence', 'impact']).default('relevance'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  }).optional()
});

// Response schema
const MarketSearchResponseSchema = z.object({
  success: z.boolean(),
  search: z.object({
    query: z.string(),
    totalResults: z.number(),
    searchTime: z.number(),
    filters: z.record(z.any()).optional(),
    results: z.array(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      summary: z.string(),
      source: z.string(),
      url: z.string().optional(),
      publishedAt: z.string(),
      confidence: z.number(),
      impact: z.enum(['high', 'medium', 'low']),
      trend: z.enum(['up', 'down', 'stable']),
      category: z.string(),
      tags: z.array(z.string()),
      relevance: z.number(),
      sentiment: z.enum(['positive', 'negative', 'neutral']),
      entities: z.array(z.object({
        name: z.string(),
        type: z.string(),
        relevance: z.number()
      })).optional()
    })),
    trends: z.object({
      topTrends: z.array(z.object({
        trend: z.string(),
        frequency: z.number(),
        direction: z.enum(['up', 'down', 'stable']),
        confidence: z.number()
      })),
      emergingTrends: z.array(z.object({
        trend: z.string(),
        growth: z.number(),
        potential: z.number()
      })),
      industryInsights: z.array(z.object({
        industry: z.string(),
        keyInsights: z.array(z.string()),
        opportunities: z.array(z.string()),
        risks: z.array(z.string())
      }))
    }).optional(),
    competitiveAnalysis: z.object({
      competitors: z.array(z.object({
        name: z.string(),
        mentions: z.number(),
        sentiment: z.enum(['positive', 'negative', 'neutral']),
        trends: z.array(z.string()),
        marketShare: z.number().optional()
      })),
      marketPositioning: z.object({
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        opportunities: z.array(z.string()),
        threats: z.array(z.string())
      })
    }).optional(),
    recommendations: z.array(z.object({
      type: z.enum(['opportunity', 'threat', 'trend', 'action']),
      title: z.string(),
      description: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
      impact: z.number(),
      timeline: z.string()
    }))
  }).optional(),
  message: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = MarketSearchSchema.parse(body);

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get user's organization
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select('organization_id, industry')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    const startTime = Date.now();

    // Initialize Market Intelligence Agent
    const marketAgent = new MarketIntelligenceAgent();

    // Prepare search data
    const searchData = {
      query: validatedData.query,
      filters: validatedData.filters || {},
      options: validatedData.options || {},
      userContext: {
        organizationId: userProfile.organization_id,
        industry: userProfile.industry
      }
    };

    // Execute search using AI agent
    const searchResult = await marketAgent.execute({
      type: 'market_search',
      data: searchData,
      options: {
        includeSemanticSearch: validatedData.options?.includeSemanticSearch ?? true,
        includeTrendAnalysis: validatedData.options?.includeTrendAnalysis ?? true,
        includeCompetitiveAnalysis: validatedData.options?.includeCompetitiveAnalysis ?? false
      }
    });

    if (!searchResult.success) {
      console.error('Market search failed:', searchResult.error);
      return NextResponse.json(
        { success: false, message: 'Search failed' },
        { status: 500 }
      );
    }

    // Process search results
    const results = await processSearchResults(
      validatedData.query,
      validatedData.filters,
      validatedData.options,
      userProfile.industry
    );

    // Generate trends analysis if requested
    let trends;
    if (validatedData.options?.includeTrendAnalysis) {
      trends = await generateTrendsAnalysis(results, userProfile.industry);
    }

    // Generate competitive analysis if requested
    let competitiveAnalysis;
    if (validatedData.options?.includeCompetitiveAnalysis) {
      competitiveAnalysis = await generateCompetitiveAnalysis(results, userProfile.industry);
    }

    // Generate recommendations
    const recommendations = await generateSearchRecommendations(
      results,
      trends,
      competitiveAnalysis,
      validatedData.query
    );

    const searchTime = Date.now() - startTime;

    const response = MarketSearchResponseSchema.parse({
      success: true,
      search: {
        query: validatedData.query,
        totalResults: results.length,
        searchTime,
        filters: validatedData.filters,
        results,
        trends,
        competitiveAnalysis,
        recommendations
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Market search error:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed' },
      { status: 500 }
    );
  }
}

// Helper functions
async function processSearchResults(
  query: string,
  filters: any,
  options: any,
  industry: string
): Promise<any[]> {
  try {
    // Build base query
    let dbQuery = supabase
      .from('realtime_market_trends')
      .select('*')
      .or(`trend_name.ilike.%${query}%,description.ilike.%${query}%`);

    // Apply filters
    if (filters?.industry && filters.industry.length > 0) {
      dbQuery = dbQuery.in('industry', filters.industry);
    } else {
      dbQuery = dbQuery.eq('industry', industry);
    }

    if (filters?.timeRange) {
      const timeRange = getTimeRange(filters.timeRange);
      dbQuery = dbQuery.gte('created_at', timeRange);
    }

    if (filters?.trendType && filters.trendType.length > 0) {
      dbQuery = dbQuery.in('direction', filters.trendType);
    }

    if (filters?.confidence) {
      dbQuery = dbQuery.gte('confidence', filters.confidence);
    }

    if (filters?.source && filters.source.length > 0) {
      dbQuery = dbQuery.in('source', filters.source);
    }

    // Apply sorting
    const sortBy = options?.sortBy || 'relevance';
    const sortOrder = options?.sortOrder || 'desc';
    
    let orderColumn = 'created_at';
    if (sortBy === 'confidence') orderColumn = 'confidence';
    else if (sortBy === 'impact') orderColumn = 'magnitude';

    dbQuery = dbQuery.order(orderColumn, { ascending: sortOrder === 'asc' });

    // Apply limit
    const maxResults = options?.maxResults || 20;
    dbQuery = dbQuery.limit(maxResults);

    // Execute query
    const { data: trends, error: trendsError } = await dbQuery;

    if (trendsError) {
      console.error('Failed to fetch market trends:', trendsError);
      return [];
    }

    // Process and enhance results
    const processedResults = trends.map(trend => {
      const relevance = calculateRelevance(trend, query);
      const sentiment = analyzeSentiment(trend.description);
      const entities = extractEntities(trend.description);

      return {
        id: trend.id,
        title: trend.trend_name,
        content: trend.description,
        summary: generateSummary(trend.description),
        source: trend.source,
        url: trend.url,
        publishedAt: trend.created_at,
        confidence: trend.confidence,
        impact: categorizeImpact(trend.magnitude),
        trend: trend.direction,
        category: trend.category,
        tags: trend.tags || [],
        relevance,
        sentiment,
        entities
      };
    });

    // Sort by relevance if that was the requested sort
    if (sortBy === 'relevance') {
      processedResults.sort((a, b) => b.relevance - a.relevance);
    }

    return processedResults;

  } catch (error) {
    console.error('Error processing search results:', error);
    return [];
  }
}

async function generateTrendsAnalysis(results: any[], industry: string): Promise<any> {
  try {
    // Analyze top trends
    const trendFrequency: Record<string, { count: number; direction: string; confidence: number }> = {};
    
    results.forEach(result => {
      const trend = result.title.toLowerCase();
      if (!trendFrequency[trend]) {
        trendFrequency[trend] = { count: 0, direction: 'stable', confidence: 0 };
      }
      trendFrequency[trend].count++;
      trendFrequency[trend].direction = result.trend;
      trendFrequency[trend].confidence = Math.max(trendFrequency[trend].confidence, result.confidence);
    });

    const topTrends = Object.entries(trendFrequency)
      .map(([trend, data]) => ({
        trend,
        frequency: data.count,
        direction: data.direction as 'up' | 'down' | 'stable',
        confidence: data.confidence
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Identify emerging trends (high growth potential)
    const emergingTrends = results
      .filter(result => result.confidence >= 0.8 && result.impact === 'high')
      .map(result => ({
        trend: result.title,
        growth: result.confidence * 100,
        potential: result.relevance * 100
      }))
      .slice(0, 5);

    // Generate industry insights
    const industryInsights = [{
      industry,
      keyInsights: [
        'Digital transformation accelerating across the sector',
        'Increased focus on sustainability and ESG compliance',
        'Supply chain optimization becoming critical',
        'AI and automation adoption on the rise'
      ],
      opportunities: [
        'Leverage AI for operational efficiency',
        'Develop sustainable business practices',
        'Optimize supply chain resilience',
        'Invest in digital infrastructure'
      ],
      risks: [
        'Cybersecurity threats increasing',
        'Regulatory compliance challenges',
        'Talent shortage in key areas',
        'Economic uncertainty affecting investments'
      ]
    }];

    return {
      topTrends,
      emergingTrends,
      industryInsights
    };

  } catch (error) {
    console.error('Error generating trends analysis:', error);
    return {
      topTrends: [],
      emergingTrends: [],
      industryInsights: []
    };
  }
}

async function generateCompetitiveAnalysis(results: any[], industry: string): Promise<any> {
  try {
    // Extract competitor mentions
    const competitorMentions: Record<string, { count: number; sentiment: string; trends: string[] }> = {};
    
    results.forEach(result => {
      const competitors = extractCompetitors(result.content);
      competitors.forEach(competitor => {
        if (!competitorMentions[competitor]) {
          competitorMentions[competitor] = { count: 0, sentiment: 'neutral', trends: [] };
        }
        competitorMentions[competitor].count++;
        competitorMentions[competitor].sentiment = result.sentiment;
        if (result.title) {
          competitorMentions[competitor].trends.push(result.title);
        }
      });
    });

    const competitors = Object.entries(competitorMentions)
      .map(([name, data]) => ({
        name,
        mentions: data.count,
        sentiment: data.sentiment as 'positive' | 'negative' | 'neutral',
        trends: data.trends.slice(0, 3),
        marketShare: Math.random() * 20 + 5 // Mock market share
      }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);

    // Generate market positioning analysis
    const marketPositioning = {
      strengths: [
        'Strong brand recognition in target markets',
        'Innovative product development capabilities',
        'Established customer relationships',
        'Operational efficiency and cost control'
      ],
      weaknesses: [
        'Limited market presence in emerging regions',
        'Dependency on key suppliers',
        'Technology debt in legacy systems',
        'Talent acquisition challenges'
      ],
      opportunities: [
        'Market expansion in underserved regions',
        'Digital transformation initiatives',
        'Strategic partnerships and acquisitions',
        'Product innovation and differentiation'
      ],
      threats: [
        'Intense competitive pressure',
        'Regulatory changes and compliance costs',
        'Economic downturn impact',
        'Disruptive technology adoption by competitors'
      ]
    };

    return {
      competitors,
      marketPositioning
    };

  } catch (error) {
    console.error('Error generating competitive analysis:', error);
    return {
      competitors: [],
      marketPositioning: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: []
      }
    };
  }
}

async function generateSearchRecommendations(
  results: any[],
  trends: any,
  competitiveAnalysis: any,
  query: string
): Promise<any[]> {
  const recommendations = [];

  // High-impact trends
  const highImpactTrends = results.filter(r => r.impact === 'high' && r.confidence >= 0.8);
  if (highImpactTrends.length > 0) {
    recommendations.push({
      type: 'trend' as const,
      title: 'Monitor High-Impact Trends',
      description: `${highImpactTrends.length} high-confidence trends identified that could significantly impact your business.`,
      priority: 'high' as const,
      impact: 0.9,
      timeline: 'Immediate'
    });
  }

  // Emerging opportunities
  if (trends?.emergingTrends?.length > 0) {
    recommendations.push({
      type: 'opportunity' as const,
      title: 'Explore Emerging Opportunities',
      description: 'Several emerging trends show high growth potential and should be evaluated for strategic initiatives.',
      priority: 'medium' as const,
      impact: 0.7,
      timeline: '3-6 months'
    });
  }

  // Competitive threats
  if (competitiveAnalysis?.competitors?.length > 0) {
    const negativeMentions = competitiveAnalysis.competitors.filter(c => c.sentiment === 'negative');
    if (negativeMentions.length > 0) {
      recommendations.push({
        type: 'threat' as const,
        title: 'Address Competitive Threats',
        description: `${negativeMentions.length} competitors showing negative sentiment, indicating potential market challenges.`,
        priority: 'high' as const,
        impact: 0.8,
        timeline: '1-3 months'
      });
    }
  }

  // Research gaps
  if (results.length < 10) {
    recommendations.push({
      type: 'action' as const,
      title: 'Expand Research Scope',
      description: 'Limited results found. Consider broadening search criteria or exploring related topics.',
      priority: 'low' as const,
      impact: 0.4,
      timeline: '1 month'
    });
  }

  return recommendations;
}

// Utility functions
function getTimeRange(timeRange: string): string {
  const now = new Date();
  switch (timeRange) {
    case '1week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '1month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '3months':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    case '6months':
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString();
    case '1year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  }
}

function calculateRelevance(trend: any, query: string): number {
  const queryWords = query.toLowerCase().split(' ');
  const content = `${trend.trend_name} ${trend.description}`.toLowerCase();
  
  let relevance = 0;
  queryWords.forEach(word => {
    if (content.includes(word)) {
      relevance += 0.3;
    }
  });
  
  // Boost relevance based on confidence and magnitude
  relevance += trend.confidence * 0.3;
  relevance += Math.min(trend.magnitude / 10, 0.4);
  
  return Math.min(1, relevance);
}

function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['growth', 'increase', 'positive', 'improve', 'success', 'opportunity', 'gain'];
  const negativeWords = ['decline', 'decrease', 'negative', 'loss', 'risk', 'threat', 'challenge'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractEntities(text: string): any[] {
  // Mock entity extraction
  const entities = [];
  const companyPattern = /\b[A-Z][a-z]+ (Inc|Corp|LLC|Ltd)\b/g;
  const matches = text.match(companyPattern);
  
  if (matches) {
    matches.forEach(match => {
      entities.push({
        name: match,
        type: 'company',
        relevance: 0.8
      });
    });
  }
  
  return entities;
}

function generateSummary(text: string): string {
  // Simple summary generation (in production, use AI)
  const sentences = text.split('.');
  return sentences.slice(0, 2).join('. ') + '.';
}

function categorizeImpact(magnitude: number): 'high' | 'medium' | 'low' {
  if (magnitude >= 7) return 'high';
  if (magnitude >= 4) return 'medium';
  return 'low';
}

function extractCompetitors(text: string): string[] {
  // Mock competitor extraction
  const competitors = ['Competitor A', 'Competitor B', 'Competitor C'];
  return competitors.filter(comp => text.toLowerCase().includes(comp.toLowerCase()));
}
