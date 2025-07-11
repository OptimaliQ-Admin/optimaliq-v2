const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fetchNewsFromAPI() {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  
  if (!NEWS_API_KEY) {
    throw new Error('NEWS_API_KEY environment variable is required');
  }

  const businessKeywords = [
    'business', 'economy', 'finance', 'technology', 'startup', 
    'entrepreneurship', 'innovation', 'market', 'investment', 'corporate'
  ];

  const headlines = [];
  
  // Fetch news for each keyword to get diverse business news
  for (const keyword of businessKeywords.slice(0, 5)) { // Limit to 5 keywords to avoid rate limits
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=en&sortBy=publishedAt&pageSize=3&apiKey=${NEWS_API_KEY}`
      );
      
      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch news for keyword "${keyword}": ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        const articles = data.articles
          .filter(article => article.title && article.url && article.source?.name)
          .map(article => ({
            title: article.title,
            url: article.url,
            source: article.source.name,
            published_at: article.publishedAt || new Date().toISOString()
          }));
        
        headlines.push(...articles);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.warn(`⚠️ Error fetching news for keyword "${keyword}":`, error.message);
    }
  }
  
  return headlines;
}

async function populateNewsTicker() {
  try {
    console.log('📰 Fetching real business news headlines...');
    
    const headlines = await fetchNewsFromAPI();
    
    if (headlines.length === 0) {
      console.log('⚠️ No headlines fetched from API. News ticker will remain empty.');
      return;
    }
    
    console.log(`📊 Fetched ${headlines.length} headlines from NewsAPI`);
    
    // Clear existing headlines
    const { error: deleteError } = await supabase
      .from('business_news_ticker')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (deleteError) {
      console.error('❌ Error clearing headlines:', deleteError);
    } else {
      console.log('🧹 Cleared existing headlines');
    }
    
    // Insert new headlines
    const { data, error } = await supabase
      .from('business_news_ticker')
      .insert(headlines)
      .select();
    
    if (error) {
      console.error('❌ Error inserting headlines:', error);
      throw error;
    }
    
    console.log(`✅ Successfully inserted ${data?.length || 0} headlines`);
    console.log('📰 News ticker is now populated with real business news!');
    
  } catch (error) {
    console.error('💥 Error populating news ticker:', error);
    process.exit(1);
  }
}

// Run the script
populateNewsTicker(); 