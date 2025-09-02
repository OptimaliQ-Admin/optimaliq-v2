import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ragPipeline } from '@/lib/ai/rag-pipeline';
import { anthropicProvider } from '@/lib/ai/providers/anthropic';
import { googleVertexProvider } from '@/lib/ai/providers/google-vertex';
import { mistralProvider } from '@/lib/ai/providers/mistral';
import { aiRouter } from '@/lib/ai-router';
import { kMeansClusterer } from '@/lib/ai/clustering-algorithms';
import { contentIngestion } from '@/lib/external-apis';
import { AppError, handleError } from '@/utils';

// Health check response schema
const HealthCheckResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    overall: z.object({
      status: z.enum(['healthy', 'degraded', 'unhealthy']),
      score: z.number().finite().min(0).max(100),
      lastChecked: z.string(),
    }),
    components: z.object({
      ragPipeline: z.object({
        status: z.enum(['healthy', 'degraded', 'unhealthy']),
        latency: z.number().finite(),
        checks: z.object({
          database: z.boolean(),
          openai: z.boolean(),
          vectorSearch: z.boolean(),
        }),
      }),
      aiProviders: z.object({
        openai: z.object({
          status: z.enum(['healthy', 'degraded', 'unhealthy']),
          latency: z.number().finite(),
          available: z.boolean(),
        }),
        anthropic: z.object({
          status: z.enum(['healthy', 'degraded', 'unhealthy']),
          latency: z.number().finite(),
          available: z.boolean(),
        }),
        googleVertex: z.object({
          status: z.enum(['healthy', 'degraded', 'unhealthy']),
          latency: z.number().finite(),
          available: z.boolean(),
        }),
        mistral: z.object({
          status: z.enum(['healthy', 'degraded', 'unhealthy']),
          latency: z.number().finite(),
          available: z.boolean(),
        }),
      }),
      clustering: z.object({
        status: z.enum(['healthy', 'degraded', 'unhealthy']),
        algorithms: z.array(z.string()),
        available: z.boolean(),
      }),
      externalApis: z.object({
        finnhub: z.object({
          status: z.enum(['healthy', 'degraded', 'unhealthy']),
          available: z.boolean(),
        }),
        newsApi: z.object({
          status: z.enum(['healthy', 'degraded', 'unhealthy']),
          available: z.boolean(),
        }),
      }),
    }),
    performance: z.object({
      avgResponseTime: z.number().finite(),
      successRate: z.number().finite(),
      errorRate: z.number().finite(),
      throughput: z.number().finite(),
    }),
    recommendations: z.array(z.object({
      component: z.string(),
      type: z.string(),
      description: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
    })),
  }),
  timestamp: z.string(),
});

// GET /api/ml/health - Comprehensive ML/RAG health check
export async function GET(_request: NextRequest) {
  try {
    const startTime = Date.now();
    const healthChecks: any = {};
    const recommendations: any[] = [];

    // Check RAG pipeline health
    try {
      healthChecks.ragPipeline = await ragPipeline.healthCheck();
    } catch (error) {
      healthChecks.ragPipeline = {
        status: 'unhealthy',
        latency: 0,
        checks: { database: false, openai: false, vectorSearch: false },
      };
      recommendations.push({
        component: 'RAG Pipeline',
        type: 'error',
        description: 'RAG pipeline health check failed',
        priority: 'high',
      });
    }

    // Check AI providers
    const providerChecks = await Promise.allSettled([
      anthropicProvider.healthCheck(),
      googleVertexProvider.healthCheck(),
      mistralProvider.healthCheck(),
    ]);

    healthChecks.aiProviders = {
      openai: {
        status: healthChecks.ragPipeline.checks.openai ? 'healthy' : 'unhealthy',
        latency: 0,
        available: healthChecks.ragPipeline.checks.openai,
      },
      anthropic: providerChecks[0].status === 'fulfilled' 
        ? {
            status: providerChecks[0].value.status,
            latency: providerChecks[0].value.latency,
            available: providerChecks[0].value.status !== 'unhealthy',
          }
        : {
            status: 'unhealthy' as const,
            latency: 0,
            available: false,
          },
      googleVertex: providerChecks[1].status === 'fulfilled'
        ? {
            status: providerChecks[1].value.status,
            latency: providerChecks[1].value.latency,
            available: providerChecks[1].value.status !== 'unhealthy',
          }
        : {
            status: 'unhealthy' as const,
            latency: 0,
            available: false,
          },
      mistral: providerChecks[2].status === 'fulfilled'
        ? {
            status: providerChecks[2].value.status,
            latency: providerChecks[2].value.latency,
            available: providerChecks[2].value.status !== 'unhealthy',
          }
        : {
            status: 'unhealthy' as const,
            latency: 0,
            available: false,
          },
    };

    // Check clustering algorithms
    try {
      // Quick test with minimal data
      const testData = [
        { id: '1', vector: [1, 0, 0], metadata: {} },
        { id: '2', vector: [0, 1, 0], metadata: {} },
        { id: '3', vector: [0, 0, 1], metadata: {} },
      ];
      
      await kMeansClusterer.cluster(testData, 2);
      
      healthChecks.clustering = {
        status: 'healthy',
        algorithms: ['kmeans', 'hierarchical'],
        available: true,
      };
    } catch (error) {
      healthChecks.clustering = {
        status: 'unhealthy',
        algorithms: [],
        available: false,
      };
      recommendations.push({
        component: 'Clustering',
        type: 'error',
        description: 'Clustering algorithms not functioning properly',
        priority: 'medium',
      });
    }

    // Check external APIs (simplified check)
    healthChecks.externalApis = {
      finnhub: {
        status: process.env.FINNHUB_API_KEY ? 'healthy' : 'unhealthy',
        available: !!process.env.FINNHUB_API_KEY,
      },
      newsApi: {
              status: process.env.NEWSAPI_KEY ? 'healthy' : 'unhealthy',
      available: !!process.env.NEWSAPI_KEY,
      },
    };

    // Calculate overall health score
    const componentScores = [
      healthChecks.ragPipeline.status === 'healthy' ? 100 : healthChecks.ragPipeline.status === 'degraded' ? 50 : 0,
      Object.values(healthChecks.aiProviders).filter((provider: any) => provider.available).length * 25,
      healthChecks.clustering.available ? 100 : 0,
      (healthChecks.externalApis.finnhub.available ? 50 : 0) + (healthChecks.externalApis.newsApi.available ? 50 : 0),
    ];

    const overallScore = componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;
    const overallStatus = overallScore >= 80 ? 'healthy' : overallScore >= 50 ? 'degraded' : 'unhealthy';

    // Generate performance metrics (mock data for now)
    const performance = {
      avgResponseTime: Date.now() - startTime,
      successRate: overallScore,
      errorRate: 100 - overallScore,
      throughput: 100, // Mock throughput
    };

    // Add general recommendations
    if (overallScore < 80) {
      recommendations.push({
        component: 'General',
        type: 'configuration',
        description: 'Some ML components are not fully configured - check environment variables',
        priority: 'medium',
      });
    }

    const response = HealthCheckResponseSchema.parse({
      success: true,
      data: {
        overall: {
          status: overallStatus,
          score: Math.round(overallScore),
          lastChecked: new Date().toISOString(),
        },
        components: healthChecks,
        performance,
        recommendations,
      },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    return handleError(error);
  }
}
