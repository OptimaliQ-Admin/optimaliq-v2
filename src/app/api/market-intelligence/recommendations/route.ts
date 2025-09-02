import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const recommendationRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  recommendationType: z.enum(['article', 'trend', 'opportunity', 'action']).optional(),
  includePersonalization: z.boolean().default(true)
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
      recommendationType: searchParams.get('recommendationType'),
      includePersonalization: searchParams.get('includePersonalization') === 'true'
    };

    const validatedQuery = recommendationRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    // Get user's reading history and preferences
    const { data: readingHistory } = await supabase
      .from('user_reading_history')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .order('read_at', { ascending: false })
      .limit(50);

    // Get market articles for recommendations
    const { data: articles } = await supabase
      .from('market_articles')
      .select('*')
      .eq('industry', validatedQuery.industry || profile?.industry || 'general')
      .order('published_date', { ascending: false })
      .limit(100);

    // Generate recommendations using Market Intelligence Agent
    const marketIntelligenceAgent = new MarketIntelligenceAgent();
    
    const recommendations = await marketIntelligenceAgent.generateRecommendations({
      articles: articles || [],
      userProfile: profile,
      readingHistory: readingHistory || [],
      recommendationType: validatedQuery.recommendationType || 'article',
      includePersonalization: validatedQuery.includePersonalization
    });

    // Store recommendations
    if (recommendations && recommendations.length > 0) {
      for (const rec of recommendations) {
        await supabase
          .from('market_recommendations')
          .upsert({
            user_id: validatedQuery.userId,
            recommendation_type: validatedQuery.recommendationType || 'article',
            article_id: rec.articleId,
            recommendation_score: rec.score,
            recommendation_reason: rec.reason,
            personalization_factors: rec.personalizationFactors,
            created_at: new Date().toISOString()
          });
      }
    }

    return NextResponse.json({
      recommendations: recommendations || [],
      summary: {
        totalRecommendations: recommendations?.length || 0,
        averageScore: recommendations && recommendations.length > 0 
          ? recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length 
          : 0,
        topRecommendations: recommendations?.slice(0, 5) || [],
        personalizationLevel: validatedQuery.includePersonalization ? 'high' : 'basic'
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Market recommendations API error:', error);
    
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
    const { action, recommendationData } = body;

    switch (action) {
      case 'mark_read':
        // Mark recommendation as read
        const { error: readError } = await supabase
          .from('user_reading_history')
          .insert({
            user_id: user.id,
            article_id: recommendationData.articleId,
            read_at: new Date().toISOString(),
            recommendation_id: recommendationData.recommendationId
          });

        if (readError) {
          console.error('Error marking as read:', readError);
          return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Marked as read successfully' });

      case 'provide_feedback':
        // Provide feedback on recommendation
        const { error: feedbackError } = await supabase
          .from('recommendation_feedback')
          .insert({
            user_id: user.id,
            recommendation_id: recommendationData.recommendationId,
            feedback_type: recommendationData.feedbackType,
            feedback_score: recommendationData.feedbackScore,
            feedback_text: recommendationData.feedbackText,
            created_at: new Date().toISOString()
          });

        if (feedbackError) {
          console.error('Error saving feedback:', feedbackError);
          return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Feedback saved successfully' });

      case 'dismiss_recommendation':
        // Dismiss a recommendation
        const { error: dismissError } = await supabase
          .from('market_recommendations')
          .update({
            dismissed: true,
            dismissed_at: new Date().toISOString()
          })
          .eq('id', recommendationData.recommendationId)
          .eq('user_id', user.id);

        if (dismissError) {
          console.error('Error dismissing recommendation:', dismissError);
          return NextResponse.json({ error: 'Failed to dismiss recommendation' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Recommendation dismissed successfully' });

      case 'save_recommendation':
        // Save recommendation for later
        const { error: saveError } = await supabase
          .from('saved_recommendations')
          .insert({
            user_id: user.id,
            recommendation_id: recommendationData.recommendationId,
            saved_at: new Date().toISOString(),
            notes: recommendationData.notes
          });

        if (saveError) {
          console.error('Error saving recommendation:', saveError);
          return NextResponse.json({ error: 'Failed to save recommendation' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Recommendation saved successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Recommendation action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

