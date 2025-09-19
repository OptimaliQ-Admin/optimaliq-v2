/**
 * Market Intelligence Search API
 * Provides advanced search functionality with semantic analysis and filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const searchRequestSchema = z.object({
  query: z.string().min(1),
  userId: z.string().uuid().optional(),
  searchType: z.enum(['articles', 'insights', 'trends', 'all']).default('all'),
  filters: z.object({
    industry: z.string().optional(),
    dateRange: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional()
    }).optional(),
    category: z.array(z.string()).optional(),
    source: z.array(z.string()).optional(),
    sentiment: z.enum(['positive', 'negative', 'neutral']).optional()
  }).optional(),
  sortBy: z.enum(['relevance', 'date', 'popularity', 'sentiment']).default('relevance'),
  limit: z.number().finite().min(1).max(100).default(20),
  offset: z.number().finite().min(0).default(0)
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
      query: searchParams.get('query') || '',
      userId: searchParams.get('userId') || user.id,
      searchType: searchParams.get('searchType') || 'all',
      filters: {
        industry: searchParams.get('industry'),
        dateRange: {
          startDate: searchParams.get('startDate'),
          endDate: searchParams.get('endDate')
        },
        category: searchParams.get('category')?.split(','),
        source: searchParams.get('source')?.split(','),
        sentiment: searchParams.get('sentiment')
      },
      sortBy: searchParams.get('sortBy') || 'relevance',
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    const validatedQuery = searchRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    let searchResults: any = {};
    let totalResults = 0;

    // Perform search based on type
    if (validatedQuery.searchType === 'articles' || validatedQuery.searchType === 'all') {
      let articlesQuery = supabase
        .from('market_articles')
        .select('*')
        .or(`title.ilike.%${validatedQuery.query}%,content.ilike.%${validatedQuery.query}%,summary.ilike.%${validatedQuery.query}%`);

      // Apply filters
      if (validatedQuery.filters?.industry) {
        articlesQuery = articlesQuery.eq('industry', validatedQuery.filters.industry);
      }
      if (validatedQuery.filters?.dateRange?.startDate) {
        articlesQuery = articlesQuery.gte('published_date', validatedQuery.filters.dateRange.startDate);
      }
      if (validatedQuery.filters?.dateRange?.endDate) {
        articlesQuery = articlesQuery.lte('published_date', validatedQuery.filters.dateRange.endDate);
      }
      if (validatedQuery.filters?.category && validatedQuery.filters.category.length > 0) {
        articlesQuery = articlesQuery.in('category', validatedQuery.filters.category);
      }
      if (validatedQuery.filters?.source && validatedQuery.filters.source.length > 0) {
        articlesQuery = articlesQuery.in('source', validatedQuery.filters.source);
      }
      if (validatedQuery.filters?.sentiment) {
        articlesQuery = articlesQuery.eq('sentiment', validatedQuery.filters.sentiment);
      }

      // Apply sorting
      switch (validatedQuery.sortBy) {
        case 'date':
          articlesQuery = articlesQuery.order('published_date', { ascending: false });
          break;
        case 'popularity':
          articlesQuery = articlesQuery.order('engagement_score', { ascending: false });
          break;
        case 'sentiment':
          articlesQuery = articlesQuery.order('sentiment_score', { ascending: false });
          break;
        default:
          // Relevance sorting (default) - would need full-text search in production
          articlesQuery = articlesQuery.order('published_date', { ascending: false });
      }

      const { data: articles, count: articlesCount } = await articlesQuery
        .range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1);

      searchResults.articles = articles || [];
      totalResults += articlesCount || 0;
    }

    if (validatedQuery.searchType === 'insights' || validatedQuery.searchType === 'all') {
      let insightsQuery = supabase
        .from('market_insights')
        .select('*')
        .or(`title.ilike.%${validatedQuery.query}%,content.ilike.%${validatedQuery.query}%,key_findings.ilike.%${validatedQuery.query}%`);

      // Apply filters
      if (validatedQuery.filters?.industry) {
        insightsQuery = insightsQuery.eq('industry', validatedQuery.filters.industry);
      }
      if (validatedQuery.filters?.dateRange?.startDate) {
        insightsQuery = insightsQuery.gte('created_at', validatedQuery.filters.dateRange.startDate);
      }
      if (validatedQuery.filters?.dateRange?.endDate) {
        insightsQuery = insightsQuery.lte('created_at', validatedQuery.filters.dateRange.endDate);
      }

      // Apply sorting
      switch (validatedQuery.sortBy) {
        case 'date':
          insightsQuery = insightsQuery.order('created_at', { ascending: false });
          break;
        case 'popularity':
          insightsQuery = insightsQuery.order('engagement_score', { ascending: false });
          break;
        default:
          insightsQuery = insightsQuery.order('created_at', { ascending: false });
      }

      const { data: insights, count: insightsCount } = await insightsQuery
        .range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1);

      searchResults.insights = insights || [];
      totalResults += insightsCount || 0;
    }

    if (validatedQuery.searchType === 'trends' || validatedQuery.searchType === 'all') {
      let trendsQuery = supabase
        .from('market_trends')
        .select('*')
        .or(`title.ilike.%${validatedQuery.query}%,description.ilike.%${validatedQuery.query}%,trend_analysis.ilike.%${validatedQuery.query}%`);

      // Apply filters
      if (validatedQuery.filters?.industry) {
        trendsQuery = trendsQuery.eq('industry', validatedQuery.filters.industry);
      }
      if (validatedQuery.filters?.dateRange?.startDate) {
        trendsQuery = trendsQuery.gte('created_at', validatedQuery.filters.dateRange.startDate);
      }
      if (validatedQuery.filters?.dateRange?.endDate) {
        trendsQuery = trendsQuery.lte('created_at', validatedQuery.filters.dateRange.endDate);
      }
      if (validatedQuery.filters?.category && validatedQuery.filters.category.length > 0) {
        trendsQuery = trendsQuery.in('category', validatedQuery.filters.category);
      }

      // Apply sorting
      switch (validatedQuery.sortBy) {
        case 'date':
          trendsQuery = trendsQuery.order('created_at', { ascending: false });
          break;
        case 'popularity':
          trendsQuery = trendsQuery.order('trend_strength', { ascending: false });
          break;
        default:
          trendsQuery = trendsQuery.order('created_at', { ascending: false });
      }

      const { data: trends, count: trendsCount } = await trendsQuery
        .range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1);

      searchResults.trends = trends || [];
      totalResults += trendsCount || 0;
    }

    // Log search activity
    await supabase
      .from('search_logs')
      .insert({
        user_id: validatedQuery.userId,
        search_query: validatedQuery.query,
        search_type: validatedQuery.searchType,
        results_count: totalResults,
        filters_applied: validatedQuery.filters,
        created_at: new Date().toISOString()
      });

    // Generate search suggestions
    const suggestions = await generateSearchSuggestions(validatedQuery.query, profile?.industry);

    return NextResponse.json({
      success: true,
      results: searchResults,
      summary: {
        totalResults,
        query: validatedQuery.query,
        searchType: validatedQuery.searchType,
        filters: validatedQuery.filters,
        sortBy: validatedQuery.sortBy,
        pagination: {
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          hasMore: totalResults > validatedQuery.offset + validatedQuery.limit
        }
      },
      suggestions,
      searchMetadata: {
        searchId: crypto.randomUUID(),
        executedAt: new Date().toISOString(),
        userContext: {
          industry: profile?.industry,
          companySize: profile?.company_size,
          role: profile?.role
        }
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    
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
    const { action, searchData } = body;

    switch (action) {
      case 'save_search':
        // Save search query for later
        const { error: saveError } = await supabase
          .from('saved_searches')
          .insert({
            user_id: user.id,
            search_query: searchData.query,
            search_type: searchData.searchType,
            filters: searchData.filters,
            search_name: searchData.searchName,
            created_at: new Date().toISOString()
          });

        if (saveError) {
          console.error('Error saving search:', saveError);
          return NextResponse.json({ error: 'Failed to save search' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Search saved successfully' });

      case 'get_suggestions':
        // Get search suggestions
        const suggestions = await generateSearchSuggestions(searchData.query, searchData.industry);
        return NextResponse.json({ suggestions });

      case 'update_search_preferences':
        // Update user's search preferences
        const { error: prefError } = await supabase
          .from('user_search_preferences')
          .upsert({
            user_id: user.id,
            default_search_type: searchData.defaultSearchType,
            preferred_filters: searchData.preferredFilters,
            search_history_enabled: searchData.searchHistoryEnabled,
            updated_at: new Date().toISOString()
          });

        if (prefError) {
          console.error('Error updating search preferences:', prefError);
          return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Search preferences updated successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Search action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateSearchSuggestions(query: string, industry?: string): Promise<string[]> {
  // Generate search suggestions based on query and industry
  const suggestions: string[] = [];
  
  // Add industry-specific suggestions
  if (industry) {
    suggestions.push(`${industry} market trends`);
    suggestions.push(`${industry} industry analysis`);
    suggestions.push(`${industry} growth opportunities`);
  }

  // Add general suggestions based on query
  if (query.toLowerCase().includes('trend')) {
    suggestions.push('market trends 2024');
    suggestions.push('emerging trends');
    suggestions.push('industry trends');
  }

  if (query.toLowerCase().includes('growth')) {
    suggestions.push('growth strategies');
    suggestions.push('market growth');
    suggestions.push('business growth');
  }

  if (query.toLowerCase().includes('competition') || query.toLowerCase().includes('competitive')) {
    suggestions.push('competitive analysis');
    suggestions.push('market competition');
    suggestions.push('competitor insights');
  }

  // Add common search terms
  suggestions.push('market intelligence');
  suggestions.push('business insights');
  suggestions.push('industry analysis');

  return suggestions.slice(0, 10); // Return top 10 suggestions
}
