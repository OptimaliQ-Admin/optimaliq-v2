import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const benchmarkRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  revenueRange: z.string().optional(),
  metrics: z.array(z.string()).optional(),
  timeRange: z.enum(['30d', '90d', '1y', '2y']).default('1y')
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      userId: searchParams.get('userId') || user.id,
      industry: searchParams.get('industry'),
      companySize: searchParams.get('companySize'),
      revenueRange: searchParams.get('revenueRange'),
      metrics: searchParams.get('metrics')?.split(','),
      timeRange: searchParams.get('timeRange') || '1y'
    };

    const validatedQuery = benchmarkRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    // Get user's assessment scores
    const { data: assessments } = await supabase
      .from('onboarding_assessments')
      .select('score, category_scores, assessment_type, completed_at')
      .eq('user_id', validatedQuery.userId)
      .eq('status', 'completed')
      .not('score', 'is', null);

    // Get benchmark data from database
    const { data: benchmarkData } = await supabase
      .from('benchmark_data')
      .select('*')
      .eq('industry', validatedQuery.industry || profile?.industry || 'general')
      .eq('company_size', validatedQuery.companySize || profile?.company_size || 'general')
      .eq('time_period', validatedQuery.timeRange);

    // Calculate user's current metrics
    const userMetrics = calculateUserMetrics(assessments || []);

    // Generate benchmark comparisons
    const benchmarkComparisons = generateBenchmarkComparisons(userMetrics, benchmarkData || []);

    // Get industry-specific benchmarks
    const industryBenchmarks = await getIndustryBenchmarks(
      validatedQuery.industry || profile?.industry,
      validatedQuery.companySize || profile?.company_size
    );

    // Get peer comparisons
    const peerComparisons = await getPeerComparisons(
      validatedQuery.userId,
      validatedQuery.industry || profile?.industry,
      validatedQuery.companySize || profile?.company_size
    );

    return NextResponse.json({
      userMetrics,
      benchmarkComparisons,
      industryBenchmarks,
      peerComparisons,
      summary: {
        totalMetrics: Object.keys(userMetrics).length,
        aboveBenchmark: Object.values(benchmarkComparisons).filter((b: any) => b.percentile > 75).length,
        belowBenchmark: Object.values(benchmarkComparisons).filter((b: any) => b.percentile < 25).length,
        averagePercentile: Object.values(benchmarkComparisons).reduce((sum: number, b: any) => sum + b.percentile, 0) / Object.keys(benchmarkComparisons).length
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Benchmark API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateUserMetrics(assessments: any[]) {
  const metrics: Record<string, number> = {};
  
  if (assessments.length === 0) {
    return metrics;
  }

  // Overall performance score
  const overallScores = assessments.map(a => a.score).filter(s => s !== null);
  if (overallScores.length > 0) {
    metrics.overallPerformance = overallScores.reduce((sum, score) => sum + score, 0) / overallScores.length;
  }

  // Category scores
  const categoryScores: Record<string, number[]> = {};
  assessments.forEach(assessment => {
    if (assessment.category_scores && typeof assessment.category_scores === 'object') {
      Object.entries(assessment.category_scores).forEach(([category, score]) => {
        if (!categoryScores[category]) {
          categoryScores[category] = [];
        }
        categoryScores[category].push(score as number);
      });
    }
  });

  Object.entries(categoryScores).forEach(([category, scores]) => {
    metrics[`${category}Performance`] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  });

  // Assessment type specific scores
  const typeScores: Record<string, number[]> = {};
  assessments.forEach(assessment => {
    if (!typeScores[assessment.assessment_type]) {
      typeScores[assessment.assessment_type] = [];
    }
    typeScores[assessment.assessment_type].push(assessment.score);
  });

  Object.entries(typeScores).forEach(([type, scores]) => {
    metrics[`${type}Score`] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  });

  // Recent performance (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentAssessments = assessments.filter(a => 
    new Date(a.completed_at) >= thirtyDaysAgo
  );
  
  if (recentAssessments.length > 0) {
    const recentScores = recentAssessments.map(a => a.score);
    metrics.recentPerformance = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
  }

  return metrics;
}

function generateBenchmarkComparisons(userMetrics: Record<string, number>, benchmarkData: any[]) {
  const comparisons: Record<string, any> = {};

  Object.entries(userMetrics).forEach(([metric, value]) => {
    // Find relevant benchmark data
    const relevantBenchmarks = benchmarkData.filter(b => 
      b.metric_name === metric || b.metric_name.includes(metric)
    );

    if (relevantBenchmarks.length > 0) {
      const benchmark = relevantBenchmarks[0];
      const percentile = calculatePercentile(value, benchmark.average, benchmark.std_dev);
      
      comparisons[metric] = {
        userValue: value,
        benchmarkAverage: benchmark.average,
        benchmarkStdDev: benchmark.std_dev,
        percentile: percentile,
        performance: percentile > 75 ? 'excellent' : percentile > 50 ? 'good' : percentile > 25 ? 'average' : 'below_average',
        difference: value - benchmark.average,
        percentageDifference: ((value - benchmark.average) / benchmark.average) * 100
      };
    } else {
      // Use default benchmarks if no specific data found
      comparisons[metric] = {
        userValue: value,
        benchmarkAverage: 70, // Default benchmark
        benchmarkStdDev: 15,
        percentile: calculatePercentile(value, 70, 15),
        performance: 'unknown',
        difference: value - 70,
        percentageDifference: ((value - 70) / 70) * 100
      };
    }
  });

  return comparisons;
}

function calculatePercentile(value: number, mean: number, stdDev: number): number {
  // Simple percentile calculation based on normal distribution
  const zScore = (value - mean) / stdDev;
  const percentile = 50 + (zScore * 34.13); // Approximate for normal distribution
  return Math.max(0, Math.min(100, percentile));
}

async function getIndustryBenchmarks(industry?: string, companySize?: string) {
  const supabase = createClient();
  
  const { data: benchmarks } = await supabase
    .from('benchmark_data')
    .select('*')
    .eq('industry', industry || 'general')
    .eq('company_size', companySize || 'general')
    .order('metric_name');

  return benchmarks || [];
}

async function getPeerComparisons(userId: string, industry?: string, companySize?: string) {
  const supabase = createClient();
  
  // Get similar users' performance
  const { data: similarUsers } = await supabase
    .from('tier2_profiles')
    .select('user_id, industry, company_size')
    .eq('industry', industry || 'general')
    .eq('company_size', companySize || 'general')
    .neq('user_id', userId)
    .limit(100);

  if (!similarUsers || similarUsers.length === 0) {
    return { peerCount: 0, averageScore: 0, userRank: 0 };
  }

  // Get their assessment scores
  const userIds = similarUsers.map(u => u.user_id);
  const { data: peerAssessments } = await supabase
    .from('onboarding_assessments')
    .select('user_id, score')
    .in('user_id', userIds)
    .eq('status', 'completed')
    .not('score', 'is', null);

  // Get user's average score
  const { data: userAssessments } = await supabase
    .from('onboarding_assessments')
    .select('score')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .not('score', 'is', null);

  const userAverage = userAssessments && userAssessments.length > 0
    ? userAssessments.reduce((sum, a) => sum + a.score, 0) / userAssessments.length
    : 0;

  // Calculate peer statistics
  const peerScores = peerAssessments?.map(a => a.score) || [];
  const peerAverage = peerScores.length > 0
    ? peerScores.reduce((sum, score) => sum + score, 0) / peerScores.length
    : 0;

  // Calculate user's rank
  const allScores = [...peerScores, userAverage].sort((a, b) => b - a);
  const userRank = allScores.indexOf(userAverage) + 1;

  return {
    peerCount: peerScores.length,
    averageScore: peerAverage,
    userRank: userRank,
    totalRank: allScores.length,
    percentile: (userRank / allScores.length) * 100
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, metric, value, benchmarkId } = body;

    switch (action) {
      case 'save_goal':
        // Save benchmark-based goal
        const { error: goalError } = await supabase
          .from('user_goals')
          .insert({
            user_id: user.id,
            metric_name: metric,
            target_value: value,
            benchmark_id: benchmarkId,
            created_at: new Date().toISOString()
          });

        if (goalError) {
          console.error('Error saving goal:', goalError);
          return NextResponse.json({ error: 'Failed to save goal' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Goal saved successfully' });

      case 'track_progress':
        // Track progress against benchmark
        const { error: progressError } = await supabase
          .from('benchmark_progress')
          .insert({
            user_id: user.id,
            metric_name: metric,
            current_value: value,
            benchmark_id: benchmarkId,
            tracked_at: new Date().toISOString()
          });

        if (progressError) {
          console.error('Error tracking progress:', progressError);
          return NextResponse.json({ error: 'Failed to track progress' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Progress tracked successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Benchmark action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

