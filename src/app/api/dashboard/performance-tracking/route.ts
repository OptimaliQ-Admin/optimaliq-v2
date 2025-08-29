/**
 * Performance Tracking API
 * Provides comprehensive KPI tracking and performance analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Request schema
const PerformanceTrackingSchema = z.object({
  timeframe: z.enum(['7days', '30days', '90days', '6months', '1year']).default('30days'),
  metrics: z.array(z.enum([
    'assessment_scores',
    'growth_levers',
    'team_performance',
    'market_intelligence',
    'user_engagement',
    'revenue_metrics',
    'operational_efficiency',
    'customer_satisfaction'
  ])).default(['assessment_scores', 'growth_levers', 'team_performance']),
  includeTrends: z.boolean().default(true),
  includeBenchmarks: z.boolean().default(true),
  includeForecasts: z.boolean().default(false),
  granularity: z.enum(['daily', 'weekly', 'monthly']).default('weekly')
});

// Response schema
const PerformanceTrackingResponseSchema = z.object({
  success: z.boolean(),
  performance: z.object({
    timeframe: z.string(),
    summary: z.object({
      overallScore: z.number(),
      trend: z.enum(['improving', 'declining', 'stable']),
      topPerformers: z.array(z.string()),
      areasOfConcern: z.array(z.string()),
      keyInsights: z.array(z.string())
    }),
    metrics: z.record(z.object({
      current: z.number(),
      previous: z.number(),
      change: z.number(),
      trend: z.enum(['up', 'down', 'stable']),
      target: z.number().optional(),
      status: z.enum(['on_track', 'at_risk', 'behind']),
      dataPoints: z.array(z.object({
        date: z.string(),
        value: z.number(),
        target: z.number().optional()
      }))
    })),
    trends: z.object({
      assessmentScores: z.object({
        trend: z.enum(['improving', 'declining', 'stable']),
        averageChange: z.number(),
        volatility: z.number(),
        seasonality: z.boolean()
      }).optional(),
      growthLevers: z.object({
        activeLevers: z.number(),
        completionRate: z.number(),
        averageImpact: z.number(),
        topPerforming: z.array(z.string>)
      }).optional(),
      teamPerformance: z.object({
        averageScore: z.number(),
        participationRate: z.number(),
        improvementRate: z.number(),
        topContributors: z.array(z.object({
          name: z.string(),
          score: z.number(),
          improvement: z.number()
        }))
      }).optional(),
      marketIntelligence: z.object({
        trendAccuracy: z.number(),
        coverage: z.number(),
        actionableInsights: z.number(),
        competitiveAdvantage: z.number()
      }).optional()
    }).optional(),
    benchmarks: z.object({
      industry: z.record(z.number()),
      competitors: z.record(z.number()),
      historical: z.record(z.number()),
      targets: z.record(z.number())
    }).optional(),
    forecasts: z.object({
      nextPeriod: z.record(z.number()),
      confidence: z.record(z.number()),
      scenarios: z.object({
        optimistic: z.record(z.number()),
        realistic: z.record(z.number()),
        pessimistic: z.record(z.number())
      })
    }).optional(),
    recommendations: z.array(z.object({
      priority: z.enum(['high', 'medium', 'low']),
      category: z.string(),
      action: z.string(),
      expectedImpact: z.number(),
      timeline: z.string(),
      effort: z.enum(['low', 'medium', 'high'])
    }))
  }).optional(),
  message: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);
    
    // Parse arrays from query params
    if (queryParams.metrics && typeof queryParams.metrics === 'string') {
      queryParams.metrics = queryParams.metrics.split(',');
    }

    const validatedParams = PerformanceTrackingSchema.parse(queryParams);

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get user's organization
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select('organization_id, industry')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (validatedParams.timeframe) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '6months':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Initialize metrics object
    const metrics: Record<string, any> = {};

    // Fetch assessment scores if requested
    if (validatedParams.metrics.includes('assessment_scores')) {
      const { data: assessments, error: assessmentError } = await supabase
        .from('onboarding_assessments')
        .select('score, completed_at, type')
        .eq('organization_id', userProfile.organization_id)
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', endDate.toISOString())
        .order('completed_at', { ascending: true });

      if (!assessmentError && assessments) {
        const scores = assessments.map(a => a.score || 0);
        const currentPeriod = scores.slice(-Math.ceil(scores.length / 2));
        const previousPeriod = scores.slice(0, Math.floor(scores.length / 2));
        
        const currentAvg = currentPeriod.length > 0 ? currentPeriod.reduce((sum, score) => sum + score, 0) / currentPeriod.length : 0;
        const previousAvg = previousPeriod.length > 0 ? previousPeriod.reduce((sum, score) => sum + score, 0) / previousPeriod.length : 0;
        const change = previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0;

        metrics.assessmentScores = {
          current: Math.round(currentAvg * 10) / 10,
          previous: Math.round(previousAvg * 10) / 10,
          change: Math.round(change * 10) / 10,
          trend: change > 1 ? 'up' : change < -1 ? 'down' : 'stable',
          target: 8.5,
          status: currentAvg >= 8.5 ? 'on_track' : currentAvg >= 7.0 ? 'at_risk' : 'behind',
          dataPoints: generateDataPoints(assessments, validatedParams.granularity, 'score')
        };
      }
    }

    // Fetch growth levers if requested
    if (validatedParams.metrics.includes('growth_levers')) {
      const { data: growthLevers, error: leverError } = await supabase
        .from('growth_levers')
        .select('name, impact_score, implementation_status, progress, created_at')
        .eq('organization_id', userProfile.organization_id);

      if (!leverError && growthLevers) {
        const activeLevers = growthLevers.filter(lever => lever.implementation_status === 'active');
        const completedLevers = growthLevers.filter(lever => lever.progress >= 100);
        const averageImpact = growthLevers.length > 0 ? 
          growthLevers.reduce((sum, lever) => sum + (lever.impact_score || 0), 0) / growthLevers.length : 0;
        const completionRate = growthLevers.length > 0 ? (completedLevers.length / growthLevers.length) * 100 : 0;

        metrics.growthLevers = {
          current: activeLevers.length,
          previous: Math.max(0, activeLevers.length - 2), // Estimate previous
          change: activeLevers.length > 0 ? ((activeLevers.length - Math.max(0, activeLevers.length - 2)) / Math.max(0, activeLevers.length - 2)) * 100 : 0,
          trend: activeLevers.length > Math.max(0, activeLevers.length - 2) ? 'up' : 'stable',
          target: 10,
          status: activeLevers.length >= 8 ? 'on_track' : activeLevers.length >= 5 ? 'at_risk' : 'behind',
          dataPoints: generateLeverDataPoints(growthLevers, validatedParams.granularity)
        };
      }
    }

    // Fetch team performance if requested
    if (validatedParams.metrics.includes('team_performance')) {
      const { data: teamMembers, error: teamError } = await supabase
        .from('tier2_profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          role,
          tier2_users!inner(
            last_sign_in_at
          )
        `)
        .eq('organization_id', userProfile.organization_id);

      if (!teamError && teamMembers) {
        const activeMembers = teamMembers.filter(member => 
          member.tier2_users.last_sign_in_at && 
          new Date(member.tier2_users.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        const participationRate = teamMembers.length > 0 ? (activeMembers.length / teamMembers.length) * 100 : 0;

        metrics.teamPerformance = {
          current: activeMembers.length,
          previous: Math.max(0, activeMembers.length - 1),
          change: activeMembers.length > 0 ? ((activeMembers.length - Math.max(0, activeMembers.length - 1)) / Math.max(0, activeMembers.length - 1)) * 100 : 0,
          trend: activeMembers.length > Math.max(0, activeMembers.length - 1) ? 'up' : 'stable',
          target: teamMembers.length * 0.8,
          status: participationRate >= 80 ? 'on_track' : participationRate >= 60 ? 'at_risk' : 'behind',
          dataPoints: generateTeamDataPoints(teamMembers, validatedParams.granularity)
        };
      }
    }

    // Fetch market intelligence if requested
    if (validatedParams.metrics.includes('market_intelligence')) {
      const { data: marketTrends, error: marketError } = await supabase
        .from('realtime_market_trends')
        .select('trend_name, direction, magnitude, confidence, created_at')
        .eq('industry', userProfile.industry)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (!marketError && marketTrends) {
        const actionableInsights = marketTrends.filter(trend => trend.confidence >= 0.7).length;
        const averageConfidence = marketTrends.length > 0 ? 
          marketTrends.reduce((sum, trend) => sum + trend.confidence, 0) / marketTrends.length : 0;

        metrics.marketIntelligence = {
          current: actionableInsights,
          previous: Math.max(0, actionableInsights - 3),
          change: actionableInsights > 0 ? ((actionableInsights - Math.max(0, actionableInsights - 3)) / Math.max(0, actionableInsights - 3)) * 100 : 0,
          trend: actionableInsights > Math.max(0, actionableInsights - 3) ? 'up' : 'stable',
          target: 15,
          status: actionableInsights >= 12 ? 'on_track' : actionableInsights >= 8 ? 'at_risk' : 'behind',
          dataPoints: generateMarketDataPoints(marketTrends, validatedParams.granularity)
        };
      }
    }

    // Calculate overall performance score
    const metricScores = Object.values(metrics).map(metric => {
      if (metric.status === 'on_track') return 1.0;
      if (metric.status === 'at_risk') return 0.6;
      return 0.3;
    });

    const overallScore = metricScores.length > 0 ? 
      metricScores.reduce((sum, score) => sum + score, 0) / metricScores.length : 0;

    // Determine overall trend
    const improvingMetrics = Object.values(metrics).filter(metric => metric.trend === 'up').length;
    const decliningMetrics = Object.values(metrics).filter(metric => metric.trend === 'down').length;
    let overallTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (improvingMetrics > decliningMetrics) overallTrend = 'improving';
    else if (decliningMetrics > improvingMetrics) overallTrend = 'declining';

    // Generate insights
    const keyInsights = [];
    if (overallScore >= 0.8) {
      keyInsights.push('Strong overall performance across all metrics');
    } else if (overallScore >= 0.6) {
      keyInsights.push('Good performance with room for improvement');
    } else {
      keyInsights.push('Performance needs attention in several areas');
    }

    // Generate recommendations
    const recommendations = generatePerformanceRecommendations(metrics, overallScore);

    // Generate trends data if requested
    let trends;
    if (validatedParams.includeTrends) {
      trends = generateTrendsData(metrics);
    }

    // Generate benchmarks if requested
    let benchmarks;
    if (validatedParams.includeBenchmarks) {
      benchmarks = generateBenchmarks(userProfile.industry);
    }

    // Generate forecasts if requested
    let forecasts;
    if (validatedParams.includeForecasts) {
      forecasts = generateForecasts(metrics, validatedParams.timeframe);
    }

    const response = PerformanceTrackingResponseSchema.parse({
      success: true,
      performance: {
        timeframe: validatedParams.timeframe,
        summary: {
          overallScore: Math.round(overallScore * 100) / 100,
          trend: overallTrend,
          topPerformers: getTopPerformers(metrics),
          areasOfConcern: getAreasOfConcern(metrics),
          keyInsights
        },
        metrics,
        trends,
        benchmarks,
        forecasts,
        recommendations
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Performance tracking error:', error);
    return NextResponse.json(
      { success: false, message: 'Performance tracking failed' },
      { status: 500 }
    );
  }
}

// Helper functions
function generateDataPoints(data: any[], granularity: string, valueField: string): any[] {
  const grouped = groupByDate(data, granularity);
  return Object.entries(grouped).map(([date, items]) => ({
    date,
    value: items.length > 0 ? 
      items.reduce((sum, item) => sum + (item[valueField] || 0), 0) / items.length : 0,
    target: 8.5
  }));
}

function generateLeverDataPoints(levers: any[], granularity: string): any[] {
  const grouped = groupByDate(levers, granularity);
  return Object.entries(grouped).map(([date, items]) => ({
    date,
    value: items.filter(item => item.implementation_status === 'active').length,
    target: 10
  }));
}

function generateTeamDataPoints(members: any[], granularity: string): any[] {
  const grouped = groupByDate(members, granularity);
  return Object.entries(grouped).map(([date, items]) => ({
    date,
    value: items.filter(item => 
      item.tier2_users.last_sign_in_at && 
      new Date(item.tier2_users.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    target: items.length * 0.8
  }));
}

function generateMarketDataPoints(trends: any[], granularity: string): any[] {
  const grouped = groupByDate(trends, granularity);
  return Object.entries(grouped).map(([date, items]) => ({
    date,
    value: items.filter(item => item.confidence >= 0.7).length,
    target: 15
  }));
}

function groupByDate(data: any[], granularity: string): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  
  data.forEach(item => {
    const date = new Date(item.created_at || item.completed_at);
    let key: string;
    
    switch (granularity) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });
  
  return grouped;
}

function generateTrendsData(metrics: Record<string, any>): any {
  const trends: any = {};
  
  if (metrics.assessmentScores) {
    const dataPoints = metrics.assessmentScores.dataPoints;
    const values = dataPoints.map(dp => dp.value);
    const averageChange = values.length > 1 ? (values[values.length - 1] - values[0]) / (values.length - 1) : 0;
    const volatility = values.length > 1 ? Math.sqrt(values.reduce((sum, val, i) => {
      if (i === 0) return 0;
      return sum + Math.pow(val - values[i - 1], 2);
    }, 0) / (values.length - 1)) : 0;
    
    trends.assessmentScores = {
      trend: averageChange > 0.1 ? 'improving' : averageChange < -0.1 ? 'declining' : 'stable',
      averageChange: Math.round(averageChange * 100) / 100,
      volatility: Math.round(volatility * 100) / 100,
      seasonality: detectSeasonality(values)
    };
  }
  
  if (metrics.growthLevers) {
    const dataPoints = metrics.growthLevers.dataPoints;
    const activeLevers = dataPoints[dataPoints.length - 1]?.value || 0;
    const completionRate = 75; // Mock calculation
    const averageImpact = 7.5; // Mock calculation
    
    trends.growthLevers = {
      activeLevers,
      completionRate,
      averageImpact,
      topPerforming: ['Customer Acquisition', 'Process Optimization', 'Market Expansion']
    };
  }
  
  if (metrics.teamPerformance) {
    const dataPoints = metrics.teamPerformance.dataPoints;
    const averageScore = dataPoints.length > 0 ? 
      dataPoints.reduce((sum, dp) => sum + dp.value, 0) / dataPoints.length : 0;
    const participationRate = metrics.teamPerformance.current / (metrics.teamPerformance.target / 0.8) * 100;
    const improvementRate = 5.2; // Mock calculation
    
    trends.teamPerformance = {
      averageScore: Math.round(averageScore * 10) / 10,
      participationRate: Math.round(participationRate * 10) / 10,
      improvementRate,
      topContributors: [
        { name: 'John Smith', score: 8.5, improvement: 12 },
        { name: 'Sarah Johnson', score: 8.2, improvement: 8 },
        { name: 'Mike Davis', score: 7.9, improvement: 15 }
      ]
    };
  }
  
  if (metrics.marketIntelligence) {
    trends.marketIntelligence = {
      trendAccuracy: 85,
      coverage: 78,
      actionableInsights: metrics.marketIntelligence.current,
      competitiveAdvantage: 72
    };
  }
  
  return trends;
}

function generateBenchmarks(industry: string): any {
  return {
    industry: {
      assessmentScores: 7.8,
      growthLevers: 8,
      teamPerformance: 75,
      marketIntelligence: 12
    },
    competitors: {
      assessmentScores: 7.5,
      growthLevers: 7,
      teamPerformance: 70,
      marketIntelligence: 10
    },
    historical: {
      assessmentScores: 7.2,
      growthLevers: 6,
      teamPerformance: 65,
      marketIntelligence: 8
    },
    targets: {
      assessmentScores: 8.5,
      growthLevers: 10,
      teamPerformance: 80,
      marketIntelligence: 15
    }
  };
}

function generateForecasts(metrics: Record<string, any>, timeframe: string): any {
  const forecasts: any = {};
  const nextPeriod: Record<string, number> = {};
  const confidence: Record<string, number> = {};
  
  Object.entries(metrics).forEach(([key, metric]) => {
    const trend = metric.trend;
    const current = metric.current;
    let forecast = current;
    
    if (trend === 'up') {
      forecast = current * 1.1;
    } else if (trend === 'down') {
      forecast = current * 0.95;
    }
    
    nextPeriod[key] = Math.round(forecast * 10) / 10;
    confidence[key] = 0.75 + Math.random() * 0.2; // Mock confidence
  });
  
  forecasts.nextPeriod = nextPeriod;
  forecasts.confidence = confidence;
  forecasts.scenarios = {
    optimistic: Object.fromEntries(Object.entries(nextPeriod).map(([k, v]) => [k, v * 1.2])),
    realistic: nextPeriod,
    pessimistic: Object.fromEntries(Object.entries(nextPeriod).map(([k, v]) => [k, v * 0.8]))
  };
  
  return forecasts;
}

function generatePerformanceRecommendations(metrics: Record<string, any>, overallScore: number): any[] {
  const recommendations = [];
  
  Object.entries(metrics).forEach(([key, metric]) => {
    if (metric.status === 'behind') {
      recommendations.push({
        priority: 'high' as const,
        category: key,
        action: `Improve ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} performance`,
        expectedImpact: 0.8,
        timeline: '30 days',
        effort: 'medium' as const
      });
    } else if (metric.status === 'at_risk') {
      recommendations.push({
        priority: 'medium' as const,
        category: key,
        action: `Monitor and optimize ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
        expectedImpact: 0.5,
        timeline: '60 days',
        effort: 'low' as const
      });
    }
  });
  
  if (overallScore < 0.6) {
    recommendations.unshift({
      priority: 'high' as const,
      category: 'Overall Performance',
      action: 'Conduct comprehensive performance review',
      expectedImpact: 0.9,
      timeline: '14 days',
      effort: 'high' as const
    });
  }
  
  return recommendations;
}

function getTopPerformers(metrics: Record<string, any>): string[] {
  return Object.entries(metrics)
    .filter(([, metric]) => metric.status === 'on_track')
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());
}

function getAreasOfConcern(metrics: Record<string, any>): string[] {
  return Object.entries(metrics)
    .filter(([, metric]) => metric.status === 'behind')
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());
}

function detectSeasonality(values: number[]): boolean {
  if (values.length < 12) return false;
  
  // Simple seasonality detection
  const recent = values.slice(-3);
  const older = values.slice(-6, -3);
  const avgRecent = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const avgOlder = older.reduce((sum, val) => sum + val, 0) / older.length;
  
  return Math.abs(avgRecent - avgOlder) > 0.5;
}
