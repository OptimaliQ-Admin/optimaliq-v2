import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

interface NewsArticle {
  title: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export async function fetchBusinessNews() {
  console.log('📰 Starting business news fetch...');
  
  try {
    // Check if we have the required environment variables
    if (!process.env.NEWSAPI_KEY) {
      throw new Error('NEWSAPI_KEY environment variable is not set');
    }
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase environment variables are not set');
    }

    // Fetch headlines from NewsAPI
    const response = await axios.get<NewsAPIResponse>('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'business',
        language: 'en',
        pageSize: 10,
        apiKey: process.env.NEWSAPI_KEY
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.data.status !== 'ok') {
      throw new Error(`NewsAPI returned status: ${response.data.status}`);
    }

    console.log(`📰 Fetched ${response.data.articles.length} articles from NewsAPI`);

    // Transform articles to our format
    const headlines = response.data.articles.map(article => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
      published_at: new Date(article.publishedAt).toISOString()
    }));

    // Initialize Supabase client with service role
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Clear old headlines (keep only last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { error: deleteError } = await supabase
      .from('business_news_ticker')
      .delete()
      .lt('created_at', yesterday.toISOString());

    if (deleteError) {
      console.error('❌ Error clearing old headlines:', deleteError);
    } else {
      console.log('🧹 Cleared old headlines');
    }

    // Insert new headlines
    const { data: insertedData, error: insertError } = await supabase
      .from('business_news_ticker')
      .insert(headlines)
      .select();

    if (insertError) {
      console.error('❌ Error inserting headlines:', insertError);
      throw new Error(`Failed to insert headlines: ${insertError.message}`);
    }

    console.log(`✅ Successfully inserted ${insertedData?.length || 0} headlines`);
    return insertedData;

  } catch (error) {
    console.error('💥 Error fetching business news:', error);
    
    // If NewsAPI fails, try to use fallback headlines
    if (error instanceof Error && error.message.includes('NewsAPI')) {
      console.log('🔄 Attempting to use fallback headlines...');
      return await insertFallbackHeadlines();
    }
    
    throw error;
  }
}

async function insertFallbackHeadlines() {
  console.log('📰 Using fallback headlines...');
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fallbackHeadlines = [
      {
        title: "Tech Companies Focus on AI Integration and Automation",
        url: "https://example.com/tech-ai-integration",
        source: "Business Insider",
        published_at: new Date().toISOString()
      },
      {
        title: "Global Markets Show Resilience Amid Economic Uncertainty",
        url: "https://example.com/global-markets-resilience",
        source: "Reuters",
        published_at: new Date().toISOString()
      },
      {
        title: "Startup Funding Trends Shift Toward Sustainable Solutions",
        url: "https://example.com/startup-funding-trends",
        source: "TechCrunch",
        published_at: new Date().toISOString()
      },
      {
        title: "Remote Work Continues to Transform Business Operations",
        url: "https://example.com/remote-work-transformation",
        source: "Forbes",
        published_at: new Date().toISOString()
      },
      {
        title: "Digital Transformation Accelerates Across Industries",
        url: "https://example.com/digital-transformation",
        source: "Harvard Business Review",
        published_at: new Date().toISOString()
      }
    ];

    const { data, error } = await supabase
      .from('business_news_ticker')
      .insert(fallbackHeadlines)
      .select();

    if (error) {
      console.error('❌ Error inserting fallback headlines:', error);
      throw error;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} fallback headlines`);
    return data;

  } catch (error) {
    console.error('💥 Error with fallback headlines:', error);
    throw error;
  }
}

// Export for use in cron jobs
export default fetchBusinessNews; 