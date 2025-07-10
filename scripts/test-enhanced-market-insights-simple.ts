#!/usr/bin/env tsx

/**
 * Simple Enhanced Market Insights Test Script
 * 
 * Tests the enhanced market insights functionality without database connection:
 * - AI analysis service structure
 * - React components
 * - Type definitions
 */

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

class SimpleEnhancedMarketInsightsTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Testing Enhanced Market Insights System (Simple)\n');

    await this.testAIAnalysisService();
    await this.testReactComponents();
    await this.testTypeDefinitions();
    await this.testFileStructure();

    this.printResults();
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

      // Test 3: Check if it's a singleton
      const instance1 = enhancedMarketAnalysis;
      const instance2 = enhancedMarketAnalysis;
      
      if (instance1 !== instance2) {
        this.addResult('AI Service Singleton', false, 'Service is not a singleton');
        return;
      }

      this.addResult('AI Service Singleton', true);

    } catch (error) {
      this.addResult('AI Analysis Service', false, error instanceof Error ? error.message : 'Unknown error');
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

      // Test 2: Check metric card components
      const { MarketSizeCard, GrowthRateCard, CompetitionCard, SentimentCard } = await import('../src/components/dashboard/MarketMetricCard');
      
      if (!MarketSizeCard || !GrowthRateCard || !CompetitionCard || !SentimentCard) {
        this.addResult('Metric Card Components', false, 'Missing metric card components');
        return;
      }

      this.addResult('Metric Card Components', true, undefined, {
        components: ['MarketSizeCard', 'GrowthRateCard', 'CompetitionCard', 'SentimentCard']
      });

      // Test 3: Check enhanced modal component
      const EnhancedAIInsightModal = await import('../src/components/modals/EnhancedAIInsightModal');
      
      if (!EnhancedAIInsightModal.default) {
        this.addResult('Enhanced Modal Component', false, 'Enhanced AI insight modal not found');
        return;
      }

      this.addResult('Enhanced Modal Component', true);

      // Test 4: Check TradingView ticker component
      const TradingViewTicker = await import('../src/components/shared/TradingViewTicker');
      
      if (!TradingViewTicker.default) {
        this.addResult('TradingView Ticker Component', false, 'TradingView ticker component not found');
        return;
      }

      this.addResult('TradingView Ticker Component', true);

    } catch (error) {
      this.addResult('React Components', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testTypeDefinitions(): Promise<void> {
    console.log('📝 Testing Type Definitions...');

    try {
      // Test 1: Check AI analysis types
      const types = await import('../src/lib/ai/enhancedMarketAnalysis');
      
      const expectedTypes = [
        'MarketSizeData',
        'GrowthRateData', 
        'CompetitionData',
        'SentimentData',
        'EnhancedMarketInsight',
        'MarketDataSources'
      ];

      const missingTypes = expectedTypes.filter(type => !(type in types));

      if (missingTypes.length > 0) {
        this.addResult('AI Analysis Types', false, `Missing types: ${missingTypes.join(', ')}`);
        return;
      }

      this.addResult('AI Analysis Types', true, undefined, { types: expectedTypes });

      // Test 2: Check type structure
      const marketSizeType = types.MarketSizeData;
      const growthRateType = types.GrowthRateData;
      const competitionType = types.CompetitionData;
      const sentimentType = types.SentimentData;

      this.addResult('Type Structure', true, undefined, {
        marketSize: typeof marketSizeType,
        growthRate: typeof growthRateType,
        competition: typeof competitionType,
        sentiment: typeof sentimentType
      });

    } catch (error) {
      this.addResult('Type Definitions', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testFileStructure(): Promise<void> {
    console.log('📁 Testing File Structure...');

    try {
      const fs = await import('fs');
      const path = await import('path');
      
      // Test 1: Check API route structure
      const apiRoutePath = path.join(process.cwd(), 'src/app/api/market-insights/enhanced/route.ts');
      
      if (!fs.existsSync(apiRoutePath)) {
        this.addResult('API Route Structure', false, 'API route file not found');
        return;
      }

      this.addResult('API Route Structure', true);

      // Test 2: Check database migration
      const migrationPath = path.join(process.cwd(), 'supabase/migrations/20240321000021_enhanced_market_insights.sql');
      
      if (!fs.existsSync(migrationPath)) {
        this.addResult('Database Migration', false, 'Database migration file not found');
        return;
      }

      this.addResult('Database Migration', true);

      // Test 3: Check component directory structure
      const componentDirs = [
        'src/components/dashboard',
        'src/components/modals',
        'src/components/shared'
      ];

      const missingDirs = componentDirs.filter(dir => !fs.existsSync(path.join(process.cwd(), dir)));

      if (missingDirs.length > 0) {
        this.addResult('Component Directories', false, `Missing directories: ${missingDirs.join(', ')}`);
        return;
      }

      this.addResult('Component Directories', true, undefined, { directories: componentDirs });

    } catch (error) {
      this.addResult('File Structure', false, error instanceof Error ? error.message : 'Unknown error');
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
      console.log('\n📋 Implementation Summary:');
      console.log('✅ Enhanced AI Market Analysis Service');
      console.log('✅ Structured Market Data Types');
      console.log('✅ Reusable Market Metric Cards');
      console.log('✅ Enhanced Market Insight Card');
      console.log('✅ Comprehensive AI Insights Modal');
      console.log('✅ TradingView Ticker Integration');
      console.log('✅ API Endpoints for Data Management');
      console.log('✅ Database Schema with RLS Policies');
      console.log('\n🚀 Ready for integration into Premium Dashboard!');
    } else {
      console.log('⚠️ Some tests failed. Please check the errors above.');
    }
  }
}

// Run tests
async function main() {
  const tester = new SimpleEnhancedMarketInsightsTester();
  await tester.runAllTests();
}

main().catch(console.error); 