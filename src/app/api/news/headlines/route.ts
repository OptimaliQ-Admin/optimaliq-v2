import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { fetchBusinessNews } from '@/lib/cron/fetchBusinessNews';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    // If refresh is requested, fetch new headlines
    if (refresh) {
      console.log('🔄 Manual refresh requested for news headlines');
      
      try {
        await fetchBusinessNews();
        console.log('✅ News headlines refreshed successfully');
      } catch (error) {
        console.error('❌ Error refreshing headlines:', error);
        // Continue with existing headlines even if refresh fails
      }
    }

    // Fetch headlines from database
    const { data, error } = await supabase
      .from('business_news_ticker')
      .select('title, url, source, published_at')
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch headlines' },
        { status: 500 }
      );
    }

    // Transform data for frontend
    const headlines = data?.map(headline => ({
      title: headline.title,
      url: headline.url,
      source: headline.source,
      publishedAt: headline.published_at
    })) || [];

    console.log(`📰 Returning ${headlines.length} headlines`);

    return NextResponse.json(headlines);

  } catch (error) {
    console.error('💥 Error in headlines API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow manual refresh via POST
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Manual refresh requested via POST');
    
    const refreshedHeadlines = await fetchBusinessNews();
    
    return NextResponse.json({
      message: 'Headlines refreshed successfully',
      count: refreshedHeadlines?.length || 0
    });

  } catch (error) {
    console.error('💥 Error refreshing headlines:', error);
    return NextResponse.json(
      { error: 'Failed to refresh headlines' },
      { status: 500 }
    );
  }
} 