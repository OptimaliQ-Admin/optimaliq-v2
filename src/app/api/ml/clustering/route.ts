import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { kMeansClusterer, hierarchicalClusterer } from '@/lib/ai/clustering-algorithms';
import { AppError, handleError } from '@/utils';

// Clustering request schema
const ClusteringRequestSchema = z.object({
  algorithm: z.enum(['kmeans', 'hierarchical']).default('kmeans'),
  parameters: z.object({
    k: z.number().finite().min(2).max(20).optional(),
    autoOptimizeK: z.boolean().default(true),
    linkage: z.enum(['single', 'complete', 'average', 'ward']).default('ward'),
    maxIterations: z.number().finite().min(10).max(1000).default(100),
    tolerance: z.number().finite().min(1e-6).max(1e-2).default(1e-4),
  }).optional(),
  filters: z.object({
    source: z.string().optional(),
    timeframe: z.enum(['1d', '7d', '30d', '90d']).default('30d'),
    minSimilarity: z.number().finite().min(0).max(1).default(0.1),
  }).optional(),
  options: z.object({
    includeMetadata: z.boolean().default(true),
    maxArticles: z.number().finite().min(10).max(1000).default(100),
  }).optional(),
});

const ClusteringResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    algorithm: z.string(),
    clusters: z.array(z.object({
      id: z.string(),
      size: z.number().finite(),
      centroid: z.array(z.number().finite()),
      articles: z.array(z.object({
        id: z.string(),
        title: z.string(),
        url: z.string(),
        source: z.string(),
        publishedAt: z.string().optional(),
        similarity: z.number().finite(),
      })),
      topics: z.array(z.string()),
      sentiment: z.object({
        average: z.number().finite(),
        distribution: z.record(z.number().finite()),
      }),
      keyPhrases: z.array(z.string()),
    })),
    metrics: z.object({
      totalInertia: z.number().finite(),
      silhouetteScore: z.number().finite(),
      iterations: z.number().finite(),
      converged: z.boolean(),
      processingTime: z.number().finite(),
    }),
    recommendations: z.array(z.object({
      type: z.string(),
      description: z.string(),
      confidence: z.number().finite(),
    })),
  }),
  timestamp: z.string(),
});

// POST /api/ml/clustering - Perform content clustering analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ClusteringRequestSchema.parse(body);
    
    const startTime = Date.now();
    const supabase = createClient();

    // Get articles for clustering based on filters
    let query = supabase
      .from('market_articles')
      .select('id, title, url, source, published_at, content, embedding')
      .not('embedding', 'is', null);

    // Apply filters
    if (validatedData.filters?.source) {
      query = query.ilike('source', `%${validatedData.filters.source}%`);
    }

    if (validatedData.filters?.timeframe) {
      const timeframeDays = {
        '1d': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90,
      }[validatedData.filters.timeframe];
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);
      
      query = query.gte('published_at', cutoffDate.toISOString());
    }

    const { data: articles, error: articlesError } = await query
      .order('published_at', { ascending: false })
      .limit(validatedData.options?.maxArticles || 100);

    if (articlesError) {
      throw new AppError('Failed to fetch articles for clustering', 'FETCH_ERROR', 500);
    }

    if (!articles || articles.length < 2) {
      throw new AppError('Insufficient articles for clustering', 'INSUFFICIENT_DATA', 400);
    }

    // Prepare data points for clustering
    const dataPoints = articles
      .filter(article => article.embedding && Array.isArray(article.embedding))
      .map(article => ({
        id: article.id.toString(),
        vector: article.embedding as number[],
        metadata: {
          title: article.title,
          url: article.url,
          source: article.source,
          publishedAt: article.published_at,
          content: article.content,
        },
      }));

    if (dataPoints.length < 2) {
      throw new AppError('No valid embeddings found for clustering', 'NO_EMBEDDINGS', 400);
    }

    // Perform clustering
    let clusteringResult;
    let algorithm = validatedData.algorithm;

    if (algorithm === 'kmeans') {
      let k = validatedData.parameters?.k;
      
      // Auto-optimize K if requested
      if (validatedData.parameters?.autoOptimizeK && !k) {
        const optimalK = await kMeansClusterer.findOptimalK(dataPoints, 
          Math.min(10, Math.floor(dataPoints.length / 3)));
        k = optimalK.optimalK;
      }
      
      k = k || Math.min(5, Math.floor(dataPoints.length / 2));
      
      clusteringResult = await kMeansClusterer.cluster(dataPoints, k, {
        initMethod: 'kmeans++',
      });
    } else {
      const hierarchicalResult = await hierarchicalClusterer.cluster(dataPoints, {
        maxClusters: validatedData.parameters?.k || 5,
      });
      
      // Convert to standard clustering result format
      clusteringResult = {
        clusters: hierarchicalResult.clusters,
        totalInertia: hierarchicalResult.clusters.reduce((sum, cluster) => sum + cluster.inertia, 0),
        iterations: 1,
        converged: true,
        silhouetteScore: 0, // Hierarchical clustering doesn't have silhouette score in this implementation
      };
    }

    // Analyze clusters for topics and sentiment
    const analyzedClusters = await Promise.all(
      clusteringResult.clusters.map(async (cluster) => {
        const articles = cluster.points.map(point => ({
          id: point.id,
          title: point.metadata.title,
          url: point.metadata.url,
          source: point.metadata.source,
          publishedAt: point.metadata.publishedAt,
          similarity: 1.0, // All points in cluster are similar
        }));

        // Extract topics from cluster content
        const allContent = cluster.points
          .map(point => point.metadata.content)
          .join(' ');
        
        const topics = this.extractTopicsFromContent(allContent);
        const sentiment = this.analyzeSentiment(allContent);
        const keyPhrases = this.extractKeyPhrases(allContent);

        return {
          id: cluster.id,
          size: cluster.size,
          centroid: cluster.centroid,
          articles,
          topics,
          sentiment,
          keyPhrases,
        };
      })
    );

    // Generate recommendations based on clustering results
    const recommendations = this.generateClusteringRecommendations(
      analyzedClusters,
      clusteringResult
    );

    const processingTime = Date.now() - startTime;

    const response = ClusteringResponseSchema.parse({
      success: true,
      data: {
        algorithm,
        clusters: analyzedClusters,
        metrics: {
          totalInertia: clusteringResult.totalInertia,
          silhouetteScore: clusteringResult.silhouetteScore || 0,
          iterations: clusteringResult.iterations,
          converged: clusteringResult.converged,
          processingTime,
        },
        recommendations,
      },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    return handleError(error);
  }
}

// GET /api/ml/clustering - Get clustering analysis status and history
export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get article count and embedding status
    const { data: stats, error: statsError } = await supabase
      .rpc('get_market_articles_stats');

    if (statsError) {
      throw new AppError('Failed to get clustering statistics', 'STATS_ERROR', 500);
    }

    // Check how many articles have embeddings
    const { count: embeddedCount, error: embeddedError } = await supabase
      .from('market_articles')
      .select('*', { count: 'exact', head: true })
      .not('embedding', 'is', null);

    if (embeddedError) {
      console.warn('Failed to get embedded article count:', embeddedError);
    }

    // Get source distribution
    const { data: sourceDistribution, error: sourceError } = await supabase
      .from('market_articles')
      .select('source')
      .not('embedding', 'is', null);

    if (sourceError) {
      console.warn('Failed to get source distribution:', sourceError);
    }

    const sources = sourceDistribution?.reduce((acc: Record<string, number>, article) => {
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
        embeddingStatus: {
          totalArticles: stats?.[0]?.total_articles || 0,
          embeddedArticles: embeddedCount || 0,
          embeddingRate: stats?.[0]?.total_articles > 0 
            ? ((embeddedCount || 0) / stats[0].total_articles * 100).toFixed(1) + '%'
            : '0%',
        },
        sourceDistribution: sources,
        clusteringCapabilities: {
          algorithms: ['kmeans', 'hierarchical'],
          maxClusters: 20,
          supportedLinkages: ['single', 'complete', 'average', 'ward'],
          qualityMetrics: ['silhouette', 'inertia', 'convergence'],
        },
        recommendations: [
          {
            type: 'optimization',
            description: embeddedCount && embeddedCount >= 50 
              ? 'Ready for clustering analysis with good data volume'
              : 'Consider ingesting more content for better clustering results',
            confidence: embeddedCount && embeddedCount >= 50 ? 0.9 : 0.6,
          },
          {
            type: 'performance',
            description: 'Use K-means for speed, hierarchical for relationship analysis',
            confidence: 0.8,
          },
        ],
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    return handleError(error);
  }
}

// Helper functions for content analysis
function extractTopicsFromContent(content: string): string[] {
  // Simple topic extraction based on keyword frequency
  const keywords = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4);

  const frequency: Record<string, number> = {};
  keywords.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

function analyzeSentiment(content: string): {
  average: number;
  distribution: Record<string, number>;
} {
  const positiveWords = ['growth', 'success', 'profit', 'increase', 'positive', 'good', 'excellent'];
  const negativeWords = ['decline', 'loss', 'negative', 'bad', 'crisis', 'problem', 'failure'];
  
  const words = content.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });

  const total = positiveCount + negativeCount;
  const sentiment = total > 0 ? (positiveCount - negativeCount) / total : 0;

  return {
    average: sentiment,
    distribution: {
      positive: total > 0 ? positiveCount / total : 0,
      negative: total > 0 ? negativeCount / total : 0,
      neutral: total > 0 ? 1 - (positiveCount + negativeCount) / total : 1,
    },
  };
}

function extractKeyPhrases(content: string): string[] {
  // Extract 2-3 word phrases
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const phrases: Record<string, number> = {};
  
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    phrases[bigram] = (phrases[bigram] || 0) + 1;
    
    if (i < words.length - 2) {
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      phrases[trigram] = (phrases[trigram] || 0) + 1;
    }
  }

  return Object.entries(phrases)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([phrase]) => phrase);
}

function generateClusteringRecommendations(
  clusters: any[],
  result: any
): Array<{ type: string; description: string; confidence: number }> {
  const recommendations = [];

  // Quality recommendations
  if (result.silhouetteScore > 0.7) {
    recommendations.push({
      type: 'quality',
      description: 'Excellent clustering quality - clusters are well-separated',
      confidence: 0.9,
    });
  } else if (result.silhouetteScore > 0.5) {
    recommendations.push({
      type: 'quality',
      description: 'Good clustering quality - consider fine-tuning parameters',
      confidence: 0.7,
    });
  } else {
    recommendations.push({
      type: 'quality',
      description: 'Poor clustering quality - try different K value or algorithm',
      confidence: 0.8,
    });
  }

  // Size recommendations
  const avgClusterSize = clusters.reduce((sum, cluster) => sum + cluster.size, 0) / clusters.length;
  if (avgClusterSize < 3) {
    recommendations.push({
      type: 'optimization',
      description: 'Small clusters detected - consider reducing K or using hierarchical clustering',
      confidence: 0.75,
    });
  }

  // Content recommendations
  const topicDiversity = new Set(clusters.flatMap(cluster => cluster.topics)).size;
  if (topicDiversity > clusters.length * 2) {
    recommendations.push({
      type: 'insights',
      description: 'High topic diversity - content spans multiple themes effectively',
      confidence: 0.8,
    });
  }

  return recommendations;
}
