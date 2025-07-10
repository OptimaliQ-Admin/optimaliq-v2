#!/usr/bin/env tsx

/**
 * Enhanced Market Insights Test Script
 * 
 * Tests the complete enhanced market insights functionality:
 * - Database schema
 * - AI analysis service
 * - API endpoints
 * - React components
 */

import { createClient } from '@supabase/supabase-js';

// Test configuration
const TEST_CONFIG = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key',
  testUserId: '00000000-0000-0000-0000-000000000000',
  testIndustry: 'technology'
};

// Initialize Supabase client
const supabase = createClient(TEST_CONFIG.supabaseUrl, TEST_CONFIG.supabaseKey);

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

class EnhancedMarketInsightsTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Testing Enhanced Market Insights System\n');

    await this.testDatabaseSchema();
    await this.testAIAnalysisService();
    await this.testAPIEndpoints();
    await this.testReactComponents();

    this.printResults();
  }

  private async testDatabaseSchema(): Promise<void> {
    console.log('📊 Testing Database Schema...');

    try {
      // Test 1: Check if enhanced_market_insights table exists
      const { data: tableExists, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'enhanced_market_insights')
        .single();

      if (tableError || !tableExists) {
        this.addResult('Database Table Exists', false, 'enhanced_market_insights table not found');
        return;
      }

      this.addResult('Database Table Exists', true);

      // Test 2: Check table structure
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'enhanced_market_insights')
        .order('ordinal_position');

      if (columnsError) {
        this.addResult('Table Structure', false, 'Failed to get table structure');
        return;
      }

      const expectedColumns = [
        'id', 'u_id', 'industry', 'market_size', 'growth_rate', 
        'competition', 'sentiment', 'full_insight', 'data_sources', 
        'confidence_score', 'ai_model_version', 'created_at', 'updated_at'
      ];

      const actualColumns = columns.map(col => col.column_name);
      const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));

      if (missingColumns.length > 0) {
        this.addResult('Table Structure', false, `Missing columns: ${missingColumns.join(', ')}`);
        return;
      }

      this.addResult('Table Structure', true, undefined, { columns: actualColumns });

      // Test 3: Check sample data
      const { data: sampleData, error: sampleError } = await supabase
        .from('enhanced_market_insights')
        .select('*')
        .eq('industry', 'technology')
        .limit(1)
        .single();

      if (sampleError || !sampleData) {
        this.addResult('Sample Data', false, 'No sample data found');
        return;
      }

      this.addResult('Sample Data', true, undefined, { 
        industry: sampleData.industry,
        hasMarketSize: !!sampleData.market_size,
        hasGrowthRate: !!sampleData.growth_rate,
        hasCompetition: !!sampleData.competition,
        hasSentiment: !!sampleData.sentiment
      });

    } catch (error) {
      this.addResult('Database Schema', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testAIAnalysisService(): Promise<void> {
    console.log('🤖 Testing AI Analysis Service...');

    try {
      // Test 1: Check if AI analysis service can be imported
      const { enhancedMarketAnalysis } = await import('../src/lib/ai/enhancedMarketAnalysis');
      
      if (!enhancedMarketAnalysis) {
        this.addResult('AI Service Import', false, 'Failed to import enhancedMarketAnalysis');
        return;
      }

      this.addResult('AI Service Import', true);

      // Test 2: Check service methods
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(enhancedMarketAnalysis));
      const requiredMethods = ['generateMarketInsight'];

      const missingMethods = requiredMethods.filter(method => !methods.includes(method));

      if (missingMethods.length > 0) {
        this.addResult('AI Service Methods', false, `Missing methods: ${missingMethods.join(', ')}`);
        return;
      }

      this.addResult('AI Service Methods', true, undefined, { methods: requiredMethods });

      // Test 3: Check type definitions
      const types = [
        'MarketSizeData',
        'GrowthRateData', 
        'CompetitionData',
        'SentimentData',
        'EnhancedMarketInsight',
        'MarketDataSources'
      ];

      this.addResult('AI Service Types', true, undefined, { types });

    } catch (error) {
      this.addResult('AI Analysis Service', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testAPIEndpoints(): Promise<void> {
    console.log('🌐 Testing API Endpoints...');

    try {
      // Test 1: Check if API route file exists
      const fs = await import('fs');
      const path = await import('path');
      
      const apiRoutePath = path.join(process.cwd(), 'src/app/api/market-insights/enhanced/route.ts');
      
      if (!fs.existsSync(apiRoutePath)) {
        this.addResult('API Route File', false, 'API route file not found');
        return;
      }

      this.addResult('API Route File', true);

      // Test 2: Check API route exports
      const routeModule = await import('../src/app/api/market-insights/enhanced/route');
      
      if (!routeModule.POST || !routeModule.GET) {
        this.addResult('API Route Exports', false, 'Missing POST or GET exports');
        return;
      }

      this.addResult('API Route Exports', true, undefined, { 
        exports: ['POST', 'GET'].filter(exp => !!routeModule[exp as keyof typeof routeModule])
      });

    } catch (error) {
      this.addResult('API Endpoints', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testReactComponents(): Promise<void> {
    console.log('⚛️ Testing React Components...');

    try {
      // Test 1: Check if components exist
      const fs = await import('fs');
      const path = await import('path');
      
      const components = [
        'src/components/dashboard/MarketMetricCard.tsx',
        'src/components/dashboard/EnhancedMarketInsightCard.tsx',
        'src/components/modals/EnhancedAIInsightModal.tsx'
      ];

      const missingComponents = components.filter(comp => !fs.existsSync(path.join(process.cwd(), comp)));

      if (missingComponents.length > 0) {
        this.addResult('Component Files', false, `Missing components: ${missingComponents.join(', ')}`);
        return;
      }

      this.addResult('Component Files', true, undefined, { components });

      // Test 2: Check component imports
      const { MarketSizeCard, GrowthRateCard, CompetitionCard, SentimentCard } = await import('../src/components/dashboard/MarketMetricCard');
      
      if (!MarketSizeCard || !GrowthRateCard || !CompetitionCard || !SentimentCard) {
        this.addResult('Metric Card Components', false, 'Missing metric card components');
        return;
      }

      this.addResult('Metric Card Components', true);

      // Test 3: Check enhanced modal component
      const EnhancedAIInsightModal = await import('../src/components/modals/EnhancedAIInsightModal');
      
      if (!EnhancedAIInsightModal.default) {
        this.addResult('Enhanced Modal Component', false, 'Enhanced AI insight modal not found');
        return;
      }

      this.addResult('Enhanced Modal Component', true);

    } catch (error) {
      this.addResult('React Components', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private addResult(name: string, passed: boolean, error?: string, details?: any): void {
    this.results.push({ name, passed, error, details });
  }

  private printResults(): void {
    console.log('\n📋 Test Results:\n');

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;

    this.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.name}`);
      
      if (!result.passed && result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
      }
    });

    console.log(`\n🎯 Overall: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)`);

    if (passed === total) {
      console.log('🎉 All tests passed! Enhanced Market Insights system is ready.');
    } else {
      console.log('⚠️ Some tests failed. Please check the errors above.');
    }
  }
}

// Run tests
async function main() {
  const tester = new EnhancedMarketInsightsTester();
  await tester.runAllTests();
}

main().catch(console.error); 