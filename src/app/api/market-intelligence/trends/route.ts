import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { agents } from '@/lib/ai/agents';
import { ragPipeline } from '@/lib/ai/rag-pipeline';
import { contentIngestion } from '@/lib/external-apis';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { ErrorResponseSchema } from '../../auth/schema';
import { AppError, handleError } from '@/utils';

// Market trends schemas
const MarketTrendsRequestSchema = z.object({
  industry: z.string().min(1),
  timeframe: z.enum(['7d', '30d', '90d']).default('30d'),
  focusAreas: z.array(z.string()).optional()
});

const MarketTrendsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
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
  }),
  metadata: z.object({
    generatedAt: z.string(),
    expiresAt: z.string(),
    sourceCount: z.number().finite(),
    cacheHit: z.boolean()
  }),
  message: z.string().optional()
});

// GET /api/market-intelligence/trends
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      industry: searchParams.get('industry') || 'Technology',
      timeframe: (searchParams.get('timeframe') as '7d' | '30d' | '90d') || '30d',
      focusAreas: searchParams.get('focusAreas')?.split(',').filter(Boolean)
    };

    // Validate query parameters
    const validatedParams = MarketTrendsRequestSchema.parse(queryParams);

    // Check for cached market snapshots (TTL: 7 days)
    const { data: cachedSnapshot } = await supabase
      .from('market_snapshots')
      .select('*')
      .eq('industry', validatedParams.industry)
      .gte('ttl_expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let marketIntelligence;
    let cacheHit = false;

    if (cachedSnapshot) {
      // Use cached data
      marketIntelligence = cachedSnapshot.card_json;
      cacheHit = true;
    } else {
      // Generate fresh market intelligence using RAG pipeline
      console.log('Generating fresh market intelligence with RAG...');
      
      // First, ingest fresh content for this industry
      await contentIngestion.ingestAllSources({
        includeMarketNews: true,
        includeBusinessNews: true,
        searchQueries: [
          `${validatedParams.industry} industry trends`,
          `${validatedParams.industry} market analysis`,
          `${validatedParams.industry} business intelligence`
        ]
      });

      // Use RAG pipeline for intelligent analysis
      const ragQuery = `Analyze ${validatedParams.industry} industry trends and market intelligence for ${validatedParams.timeframe} timeframe`;
      const ragResult = await ragPipeline.retrieveAndGenerate(ragQuery, {
        limit: 10,
        threshold: 0.7,
        includeContext: true
      });

      // Use Market Intelligence Agent for structured analysis
      const agent = new MarketIntelligenceAgent();
      const aiResult = await agent.processRequest({
        task: `Analyze market trends for ${validatedParams.industry}`,
        context: {
          industry: validatedParams.industry,
          timeframe: validatedParams.timeframe,
          focusAreas: validatedParams.focusAreas,
          ragContext: ragResult.context,
          citations: ragResult.citations
        },
        userId: 'system',
        organizationId: 'system'
      });

      if (!aiResult.success) {
        throw new AppError('Market intelligence generation failed', 'AI_GENERATION_FAILED', 500);
      }

      marketIntelligence = {
        ...aiResult.data,
        citations: ragResult.citations,
        ragAnswer: ragResult.answer
      };

      // Cache the results (TTL: 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await supabase
        .from('market_snapshots')
        .insert({
          industry: validatedParams.industry,
          card_json: marketIntelligence,
          citations: aiResult.citations || [],
          ttl_expires_at: expiresAt.toISOString()
        });
    }

    // Get business trends for the industry
    const { data: businessTrends } = await supabase
      .from('realtime_business_trends')
      .select('*')
      .eq('industry', validatedParams.industry.toLowerCase())
      .order('generated_at', { ascending: false })
      .limit(5);

    const response = MarketTrendsResponseSchema.parse({
      success: true,
      data: {
        trends: marketIntelligence.trends || [],
        opportunities: marketIntelligence.opportunities || [],
        risks: marketIntelligence.risks || [],
        marketSnapshot: marketIntelligence.marketSnapshot || {
          overview: `Market analysis for ${validatedParams.industry} industry`,
          keyMetrics: {},
          competitiveAnalysis: 'Competitive analysis pending',
          recommendations: []
        }
      },
      metadata: {
        generatedAt: cachedSnapshot?.created_at || new Date().toISOString(),
        expiresAt: cachedSnapshot?.ttl_expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        sourceCount: (marketIntelligence.trends?.length || 0) + (businessTrends?.length || 0),
        cacheHit
      },
      message: cacheHit ? 'Retrieved from cache' : 'Generated fresh insights'
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Market trends error:', error);
    
    const handledError = handleError(error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ErrorResponseSchema.parse({
          success: false,
          error: 'Validation failed',
          message: error.errors.map(e => e.message).join(', '),
          code: 'VALIDATION_ERROR',
          details: error.errors,
          timestamp: new Date().toISOString()
        }),
        { status: 400 }
      );
    }

    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to fetch market intelligence',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
