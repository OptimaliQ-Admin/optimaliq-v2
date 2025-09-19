import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const clusteringRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  clusterType: z.enum(['topic', 'sentiment', 'trend', 'source']).optional(),
  includeAnalysis: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      userId: searchParams.get('userId') || user.id,
      industry: searchParams.get('industry'),
      clusterType: searchParams.get('clusterType'),
      includeAnalysis: searchParams.get('includeAnalysis') === 'true'
    };

    const validatedQuery = clusteringRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    // Get market articles for clustering
    const { data: articles } = await supabase
      .from('market_articles')
      .select('*')
      .eq('industry', validatedQuery.industry || profile?.industry || 'general')
      .order('published_date', { ascending: false })
      .limit(100);

    // Perform content clustering using Market Intelligence Agent
    const marketIntelligenceAgent = new MarketIntelligenceAgent();
    
    const clusteringResult = await marketIntelligenceAgent.performContentClustering({
      articles: articles || [],
      clusterType: validatedQuery.clusterType || 'topic',
      industry: validatedQuery.industry || profile?.industry,
      includeAnalysis: validatedQuery.includeAnalysis
    });

    // Store clustering results
    if (clusteringResult.clusters && clusteringResult.clusters.length > 0) {
      for (const cluster of clusteringResult.clusters) {
        await supabase
          .from('content_clusters')
          .upsert({
            user_id: validatedQuery.userId,
            cluster_type: validatedQuery.clusterType || 'topic',
            cluster_name: cluster.name,
            cluster_keywords: cluster.keywords,
            cluster_articles: cluster.articleIds,
            cluster_summary: cluster.summary,
            cluster_sentiment: cluster.sentiment,
            cluster_trend: cluster.trend,
            created_at: new Date().toISOString()
          });
      }
    }

    return NextResponse.json({
      clusters: clusteringResult.clusters || [],
      analysis: clusteringResult.analysis || null,
      summary: {
        totalClusters: clusteringResult.clusters?.length || 0,
        totalArticles: articles?.length || 0,
        averageClusterSize: clusteringResult.clusters && clusteringResult.clusters.length > 0 
          ? clusteringResult.clusters.reduce((sum, c) => sum + c.articleIds.length, 0) / clusteringResult.clusters.length 
          : 0,
        dominantTopics: clusteringResult.analysis?.dominantTopics || [],
        sentimentDistribution: clusteringResult.analysis?.sentimentDistribution || {}
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content clustering API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, clusterData } = body;

    switch (action) {
      case 'create_cluster':
        // Create a custom cluster
        const { data: newCluster, error: clusterError } = await supabase
          .from('content_clusters')
          .insert({
            user_id: user.id,
            cluster_type: clusterData.clusterType,
            cluster_name: clusterData.name,
            cluster_keywords: clusterData.keywords,
            cluster_articles: clusterData.articleIds,
            cluster_summary: clusterData.summary,
            cluster_sentiment: clusterData.sentiment,
            cluster_trend: clusterData.trend,
            is_custom: true,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (clusterError) {
          console.error('Error creating cluster:', clusterError);
          return NextResponse.json({ error: 'Failed to create cluster' }, { status: 500 });
        }

        return NextResponse.json({ 
          message: 'Cluster created successfully',
          cluster: newCluster 
        });

      case 'update_cluster':
        // Update an existing cluster
        const { error: updateError } = await supabase
          .from('content_clusters')
          .update({
            cluster_name: clusterData.name,
            cluster_keywords: clusterData.keywords,
            cluster_articles: clusterData.articleIds,
            cluster_summary: clusterData.summary,
            updated_at: new Date().toISOString()
          })
          .eq('id', clusterData.id)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating cluster:', updateError);
          return NextResponse.json({ error: 'Failed to update cluster' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Cluster updated successfully' });

      case 'delete_cluster':
        // Delete a cluster
        const { error: deleteError } = await supabase
          .from('content_clusters')
          .delete()
          .eq('id', clusterData.id)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting cluster:', deleteError);
          return NextResponse.json({ error: 'Failed to delete cluster' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Cluster deleted successfully' });

      case 'add_article_to_cluster':
        // Add article to cluster
        const { data: cluster } = await supabase
          .from('content_clusters')
          .select('cluster_articles')
          .eq('id', clusterData.clusterId)
          .eq('user_id', user.id)
          .single();

        if (!cluster) {
          return NextResponse.json({ error: 'Cluster not found' }, { status: 404 });
        }

        const updatedArticles = [...(cluster.cluster_articles || []), clusterData.articleId];
        
        const { error: addError } = await supabase
          .from('content_clusters')
          .update({
            cluster_articles: updatedArticles,
            updated_at: new Date().toISOString()
          })
          .eq('id', clusterData.clusterId)
          .eq('user_id', user.id);

        if (addError) {
          console.error('Error adding article to cluster:', addError);
          return NextResponse.json({ error: 'Failed to add article to cluster' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Article added to cluster successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Cluster action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

