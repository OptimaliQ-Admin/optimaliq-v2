import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { contentIngestion } from '@/lib/external-apis';
import { ragPipeline } from '@/lib/ai/rag-pipeline';
import { AppError, handleError } from '@/utils';

// Content ingestion schemas
const ContentIngestionRequestSchema = z.object({
  sources: z.object({
    includeMarketNews: z.boolean().default(true),
    includeBusinessNews: z.boolean().default(true),
    companySymbols: z.array(z.string()).optional(),
    searchQueries: z.array(z.string()).optional(),
  }),
  options: z.object({
    batchSize: z.number().finite().min(1).max(100).default(10),
    rateLimitDelay: z.number().finite().min(100).max(5000).default(1000),
    maxArticles: z.number().finite().min(1).max(1000).default(100),
  }).optional(),
});

const ContentIngestionResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    totalIngested: z.number().finite(),
    sources: z.object({
      finnhubMarket: z.number().finite(),
      finnhubCompany: z.number().finite(),
      newsApiBusiness: z.number().finite(),
      newsApiSearch: z.number().finite(),
    }),
    errors: z.array(z.string()),
    processingTime: z.number().finite(),
    ragPipelineHealth: z.object({
      status: z.enum(['healthy', 'degraded', 'unhealthy']),
      checks: z.object({
        database: z.boolean(),
        openai: z.boolean(),
        vectorSearch: z.boolean(),
      }),
    }),
  }),
  message: z.string().optional(),
  timestamp: z.string(),
});

// POST /api/ml/content-ingestion - Trigger content ingestion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ContentIngestionRequestSchema.parse(body);
    
    const startTime = Date.now();
    
    // Check RAG pipeline health first
    const health = await ragPipeline.healthCheck();
    if (health.status === 'unhealthy') {
      throw new AppError('RAG pipeline is unhealthy', 'RAG_UNHEALTHY', 503);
    }

    // Trigger content ingestion
    const ingestionResult = await contentIngestion.ingestAllSources({
      includeMarketNews: validatedData.sources.includeMarketNews,
      includeBusinessNews: validatedData.sources.includeBusinessNews,
      companySymbols: validatedData.sources.companySymbols,
      searchQueries: validatedData.sources.searchQueries,
    });

    const processingTime = Date.now() - startTime;

    const response = ContentIngestionResponseSchema.parse({
      success: true,
      data: {
        totalIngested: ingestionResult.totalIngested,
        sources: ingestionResult.sources,
        errors: ingestionResult.errors,
        processingTime,
        ragPipelineHealth: health,
      },
      message: `Successfully ingested ${ingestionResult.totalIngested} articles`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    return handleError(error);
  }
}

// GET /api/ml/content-ingestion - Get ingestion status and statistics
export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get article statistics
    const { data: stats, error: statsError } = await supabase
      .rpc('get_market_articles_stats');

    if (statsError) {
      throw new AppError('Failed to get article statistics', 'STATS_ERROR', 500);
    }

    // Get RAG pipeline health
    const health = await ragPipeline.healthCheck();

    // Get recent ingestion activity (last 24 hours)
    const { data: recentArticles, error: recentError } = await supabase
      .from('market_articles')
      .select('source, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (recentError) {
      console.warn('Failed to get recent articles:', recentError);
    }

    // Group recent articles by source
    const sourceActivity = recentArticles?.reduce((acc: Record<string, number>, article) => {
      acc[article.source] = (acc[article.source] || 0) + 1;
      return acc;
    }, {}) || {};

    const response = {
      success: true,
      data: {
        statistics: stats?.[0] || {
          total_articles: 0,
          sources_count: 0,
          latest_article: null,
          oldest_article: null,
        },
        health,
        recentActivity: {
          last24Hours: recentArticles?.length || 0,
          sourceBreakdown: sourceActivity,
        },
        capabilities: {
          vectorSearch: health.checks.vectorSearch,
          contentIngestion: true,
          embeddingGeneration: health.checks.openai,
          clustering: true,
        },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    return handleError(error);
  }
}
