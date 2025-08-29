#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create service client for seeding
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Seed data
const seedData = {
  // Growth quadrant data
  growthQuadrantData: [
    { segment: 'Innovators', x: 8.5, y: 9.2, label: 'High Growth, High Innovation', color: '#10B981' },
    { segment: 'Fast Followers', x: 6.8, y: 7.5, label: 'High Growth, Medium Innovation', color: '#3B82F6' },
    { segment: 'Steady Performers', x: 5.2, y: 5.8, label: 'Medium Growth, Medium Innovation', color: '#F59E0B' },
    { segment: 'Laggards', x: 3.1, y: 3.4, label: 'Low Growth, Low Innovation', color: '#EF4444' },
    { segment: 'Efficiency Leaders', x: 4.5, y: 8.1, label: 'Medium Growth, High Innovation', color: '#8B5CF6' }
  ],

  // Assessment templates for different industries
  assessmentTemplates: [
    {
      type: 'onboarding',
      name: 'General Business Assessment',
      description: 'Comprehensive assessment covering strategy, process, and technology',
      industry: null,
      questions: [
        {
          id: '1',
          text: 'How would you rate your current strategic planning process?',
          type: 'scale',
          weight: 1.0,
          category: 'strategy',
          required: true,
          order: 1
        },
        {
          id: '2', 
          text: 'How documented are your core business processes?',
          type: 'scale',
          weight: 1.0,
          category: 'process',
          required: true,
          order: 2
        },
        {
          id: '3',
          text: 'How would you rate your technology infrastructure?',
          type: 'scale',
          weight: 1.0,
          category: 'technology',
          required: true,
          order: 3
        }
      ],
      scoring_rules: [
        {
          category: 'strategy',
          weight: 0.33,
          algorithm: 'weighted_average',
          parameters: { min_score: 0, max_score: 10 }
        },
        {
          category: 'process',
          weight: 0.33,
          algorithm: 'weighted_average',
          parameters: { min_score: 0, max_score: 10 }
        },
        {
          category: 'technology',
          weight: 0.34,
          algorithm: 'weighted_average',
          parameters: { min_score: 0, max_score: 10 }
        }
      ]
    },
    {
      type: 'bpm',
      name: 'Business Process Management Assessment',
      description: 'Detailed assessment of business process maturity',
      industry: null,
      questions: [
        {
          id: '1',
          text: 'How mature are your business processes?',
          type: 'scale',
          weight: 1.0,
          category: 'maturity',
          required: true,
          order: 1
        },
        {
          id: '2',
          text: 'What level of automation do you have?',
          type: 'scale',
          weight: 1.0,
          category: 'automation',
          required: true,
          order: 2
        }
      ],
      scoring_rules: [
        {
          category: 'maturity',
          weight: 0.4,
          algorithm: 'weighted_average',
          parameters: { min_score: 0, max_score: 10 }
        },
        {
          category: 'automation',
          weight: 0.6,
          algorithm: 'weighted_average',
          parameters: { min_score: 0, max_score: 10 }
        }
      ]
    }
  ],

  // Lead sources for attribution
  leadSources: [
    { source_name: 'Google Organic', source_type: 'organic', utm_source: 'google', utm_medium: 'organic' },
    { source_name: 'LinkedIn Ads', source_type: 'paid', utm_source: 'linkedin', utm_medium: 'cpc' },
    { source_name: 'Content Marketing', source_type: 'content', utm_source: 'blog', utm_medium: 'content' },
    { source_name: 'Email Newsletter', source_type: 'email', utm_source: 'newsletter', utm_medium: 'email' },
    { source_name: 'Referral Program', source_type: 'referral', utm_source: 'referral', utm_medium: 'referral' },
    { source_name: 'Direct Traffic', source_type: 'direct', utm_source: 'direct', utm_medium: 'none' }
  ],

  // Benchmark data for industry comparisons
  benchmarkData: [
    // Technology Industry
    { industry: 'Technology', category: 'strategy', metric_name: 'Strategic Planning Score', industry_average: 7.2, top_performers: 9.1, bottom_quartile: 5.3, sample_size: 1250 },
    { industry: 'Technology', category: 'process', metric_name: 'Process Maturity Score', industry_average: 6.8, top_performers: 8.9, bottom_quartile: 4.9, sample_size: 1250 },
    { industry: 'Technology', category: 'technology', metric_name: 'Tech Infrastructure Score', industry_average: 8.1, top_performers: 9.5, bottom_quartile: 6.2, sample_size: 1250 },
    
    // Non-Profit Industry
    { industry: 'Non-Profit', category: 'strategy', metric_name: 'Strategic Planning Score', industry_average: 6.5, top_performers: 8.7, bottom_quartile: 4.8, sample_size: 890 },
    { industry: 'Non-Profit', category: 'process', metric_name: 'Process Maturity Score', industry_average: 5.9, top_performers: 8.2, bottom_quartile: 3.9, sample_size: 890 },
    { industry: 'Non-Profit', category: 'technology', metric_name: 'Tech Infrastructure Score', industry_average: 5.4, top_performers: 7.8, bottom_quartile: 3.2, sample_size: 890 },
    
    // Healthcare Industry
    { industry: 'Healthcare', category: 'strategy', metric_name: 'Strategic Planning Score', industry_average: 7.0, top_performers: 8.9, bottom_quartile: 5.1, sample_size: 650 },
    { industry: 'Healthcare', category: 'process', metric_name: 'Process Maturity Score', industry_average: 7.8, top_performers: 9.2, bottom_quartile: 6.1, sample_size: 650 },
    { industry: 'Healthcare', category: 'technology', metric_name: 'Tech Infrastructure Score', industry_average: 6.9, top_performers: 8.6, bottom_quartile: 5.0, sample_size: 650 }
  ],

  // Lead scoring rules
  leadScoringRules: [
    {
      rule_name: 'Company Size Scoring',
      rule_type: 'firmographic',
      criteria: { field: 'company_size', operator: 'equals', value: '201-1000' },
      score_value: 25
    },
    {
      rule_name: 'Revenue Range Scoring',
      rule_type: 'firmographic', 
      criteria: { field: 'revenue_range', operator: 'equals', value: '$10M - $50M' },
      score_value: 30
    },
    {
      rule_name: 'Demo Request',
      rule_type: 'behavioral',
      criteria: { action: 'demo_request' },
      score_value: 50
    },
    {
      rule_name: 'Email Engagement',
      rule_type: 'engagement',
      criteria: { action: 'email_open', frequency: 'high' },
      score_value: 15
    }
  ],

  // Email sequences
  emailSequences: [
    {
      sequence_name: 'Welcome Series',
      sequence_type: 'onboarding',
      trigger_event: 'user_signup',
      emails: [
        {
          delay_hours: 0,
          subject: 'Welcome to OptimaliQ - Your Growth Journey Starts Now',
          template: 'welcome_email'
        },
        {
          delay_hours: 24,
          subject: 'Take Your Free Assessment - See Where You Stand',
          template: 'assessment_reminder'
        },
        {
          delay_hours: 72,
          subject: 'Success Stories: How Companies Like Yours Grew 40%',
          template: 'social_proof'
        }
      ]
    },
    {
      sequence_name: 'Trial Nurture',
      sequence_type: 'trial',
      trigger_event: 'trial_start',
      emails: [
        {
          delay_hours: 0,
          subject: 'Your Trial is Active - Here\'s How to Get Started',
          template: 'trial_welcome'
        },
        {
          delay_hours: 168, // 1 week
          subject: 'Unlock Your Growth Potential - See Your Progress',
          template: 'trial_progress'
        }
      ]
    }
  ]
};

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed growth quadrant data
    console.log('📊 Seeding growth quadrant data...');
    const { error: quadrantError } = await supabase
      .from('growth_quadrant_data')
      .upsert(seedData.growthQuadrantData, { onConflict: 'segment' });
    
    if (quadrantError) {
      console.error('❌ Error seeding growth quadrant data:', quadrantError);
    } else {
      console.log('✅ Growth quadrant data seeded successfully');
    }

    // Seed assessment templates
    console.log('📝 Seeding assessment templates...');
    const { error: templatesError } = await supabase
      .from('assessment_templates')
      .upsert(seedData.assessmentTemplates, { onConflict: 'type,name' });
    
    if (templatesError) {
      console.error('❌ Error seeding assessment templates:', templatesError);
    } else {
      console.log('✅ Assessment templates seeded successfully');
    }

    // Seed lead sources
    console.log('🎯 Seeding lead sources...');
    const { error: sourcesError } = await supabase
      .from('lead_sources')
      .upsert(seedData.leadSources, { onConflict: 'source_name' });
    
    if (sourcesError) {
      console.error('❌ Error seeding lead sources:', sourcesError);
    } else {
      console.log('✅ Lead sources seeded successfully');
    }

    // Seed benchmark data
    console.log('📈 Seeding benchmark data...');
    const { error: benchmarkError } = await supabase
      .from('benchmark_data')
      .upsert(seedData.benchmarkData, { onConflict: 'industry,category,metric_name' });
    
    if (benchmarkError) {
      console.error('❌ Error seeding benchmark data:', benchmarkError);
    } else {
      console.log('✅ Benchmark data seeded successfully');
    }

    // Seed lead scoring rules
    console.log('🎯 Seeding lead scoring rules...');
    const { error: scoringError } = await supabase
      .from('lead_scoring_rules')
      .upsert(seedData.leadScoringRules, { onConflict: 'rule_name' });
    
    if (scoringError) {
      console.error('❌ Error seeding lead scoring rules:', scoringError);
    } else {
      console.log('✅ Lead scoring rules seeded successfully');
    }

    // Seed email sequences
    console.log('📧 Seeding email sequences...');
    const { error: emailError } = await supabase
      .from('email_sequences')
      .upsert(seedData.emailSequences, { onConflict: 'sequence_name' });
    
    if (emailError) {
      console.error('❌ Error seeding email sequences:', emailError);
    } else {
      console.log('✅ Email sequences seeded successfully');
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
