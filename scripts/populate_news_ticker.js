const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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
  },
  {
    title: "E-commerce Growth Drives Innovation in Supply Chain Management",
    url: "https://example.com/ecommerce-supply-chain",
    source: "Wall Street Journal",
    published_at: new Date().toISOString()
  },
  {
    title: "Sustainability Becomes Key Driver in Corporate Strategy",
    url: "https://example.com/sustainability-strategy",
    source: "Financial Times",
    published_at: new Date().toISOString()
  },
  {
    title: "Cybersecurity Investments Surge as Threats Evolve",
    url: "https://example.com/cybersecurity-investments",
    source: "Bloomberg",
    published_at: new Date().toISOString()
  }
];

async function populateNewsTicker() {
  try {
    console.log('📰 Populating news ticker with fallback headlines...');
    
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
      .insert(fallbackHeadlines)
      .select();
    
    if (error) {
      console.error('❌ Error inserting headlines:', error);
      throw error;
    }
    
    console.log(`✅ Successfully inserted ${data?.length || 0} headlines`);
    console.log('📰 News ticker is now populated and ready!');
    
  } catch (error) {
    console.error('💥 Error populating news ticker:', error);
    process.exit(1);
  }
}

// Run the script
populateNewsTicker(); 