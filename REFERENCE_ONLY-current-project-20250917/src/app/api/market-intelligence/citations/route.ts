import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const citationRequestSchema = z.object({
  userId: z.string().uuid(),
  articleId: z.string().uuid().optional(),
  citationType: z.enum(['source', 'reference', 'attribution']).optional(),
  includeMetadata: z.boolean().default(true)
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
      articleId: searchParams.get('articleId'),
      citationType: searchParams.get('citationType'),
      includeMetadata: searchParams.get('includeMetadata') === 'true'
    };

    const validatedQuery = citationRequestSchema.parse(queryData);

    // Build query for citations
    let query = supabase
      .from('citations')
      .select('*')
      .eq('user_id', validatedQuery.userId);

    if (validatedQuery.articleId) {
      query = query.eq('article_id', validatedQuery.articleId);
    }

    if (validatedQuery.citationType) {
      query = query.eq('citation_type', validatedQuery.citationType);
    }

    const { data: citations, error: citationsError } = await query;

    if (citationsError) {
      console.error('Error fetching citations:', citationsError);
      return NextResponse.json({ error: 'Failed to fetch citations' }, { status: 500 });
    }

    // Get related articles if requested
    let articles = null;
    if (validatedQuery.includeMetadata && citations && citations.length > 0) {
      const articleIds = [...new Set(citations.map(c => c.article_id))];
      const { data: articleData } = await supabase
        .from('market_articles')
        .select('*')
        .in('id', articleIds);

      articles = articleData || [];
    }

    // Calculate citation analytics
    const analytics = calculateCitationAnalytics(citations || []);

    return NextResponse.json({
      citations: citations || [],
      articles: articles || [],
      analytics,
      summary: {
        totalCitations: citations?.length || 0,
        byType: citations?.reduce((acc, citation) => {
          acc[citation.citation_type] = (acc[citation.citation_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageReliability: citations?.reduce((sum, c) => sum + (c.reliability_score || 0), 0) / (citations?.length || 1),
        mostCitedSource: analytics.mostCitedSource
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Citation management API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateCitationAnalytics(citations: any[]) {
  const analytics = {
    byType: citations.reduce((acc, citation) => {
      acc[citation.citation_type] = (acc[citation.citation_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    bySource: citations.reduce((acc, citation) => {
      const source = citation.source_name || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    byReliability: {
      high: citations.filter(c => (c.reliability_score || 0) >= 8).length,
      medium: citations.filter(c => (c.reliability_score || 0) >= 5 && (c.reliability_score || 0) < 8).length,
      low: citations.filter(c => (c.reliability_score || 0) < 5).length
    },
    
    mostCitedSource: citations.reduce((most, citation) => {
      const source = citation.source_name || 'Unknown';
      const count = citations.filter(c => (c.source_name || 'Unknown') === source).length;
      if (!most || count > most.count) {
        return { source, count };
      }
      return most;
    }, null as { source: string; count: number } | null)
  };

  return analytics;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, citationData } = body;

    switch (action) {
      case 'add_citation':
        // Add a new citation
        const { data: newCitation, error: citationError } = await supabase
          .from('citations')
          .insert({
            user_id: user.id,
            article_id: citationData.articleId,
            citation_type: citationData.citationType,
            source_name: citationData.sourceName,
            source_url: citationData.sourceUrl,
            author: citationData.author,
            publication_date: citationData.publicationDate,
            reliability_score: citationData.reliabilityScore,
            relevance_score: citationData.relevanceScore,
            notes: citationData.notes,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (citationError) {
          console.error('Error adding citation:', citationError);
          return NextResponse.json({ error: 'Failed to add citation' }, { status: 500 });
        }

        return NextResponse.json({ 
          message: 'Citation added successfully',
          citation: newCitation 
        });

      case 'update_citation':
        // Update an existing citation
        const { error: updateError } = await supabase
          .from('citations')
          .update({
            citation_type: citationData.citationType,
            source_name: citationData.sourceName,
            source_url: citationData.sourceUrl,
            author: citationData.author,
            publication_date: citationData.publicationDate,
            reliability_score: citationData.reliabilityScore,
            relevance_score: citationData.relevanceScore,
            notes: citationData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', citationData.id)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating citation:', updateError);
          return NextResponse.json({ error: 'Failed to update citation' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Citation updated successfully' });

      case 'delete_citation':
        // Delete a citation
        const { error: deleteError } = await supabase
          .from('citations')
          .delete()
          .eq('id', citationData.id)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting citation:', deleteError);
          return NextResponse.json({ error: 'Failed to delete citation' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Citation deleted successfully' });

      case 'verify_citation':
        // Verify citation reliability
        const { error: verifyError } = await supabase
          .from('citations')
          .update({
            verified: true,
            verification_date: new Date().toISOString(),
            verified_by: user.id,
            verification_notes: citationData.verificationNotes
          })
          .eq('id', citationData.id)
          .eq('user_id', user.id);

        if (verifyError) {
          console.error('Error verifying citation:', verifyError);
          return NextResponse.json({ error: 'Failed to verify citation' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Citation verified successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Citation action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

