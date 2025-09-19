/**
 * Assessment comparison API
 * Provides detailed comparison between multiple assessments
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Request schema
const AssessmentComparisonSchema = z.object({
  assessmentIds: z.array(z.string().uuid()).min(2).max(10),
  comparisonType: z.enum(['timeline', 'users', 'categories', 'detailed']).default('detailed'),
  includeDetails: z.boolean().default(true),
  includeBenchmarks: z.boolean().default(true)
});

// Response schema
const ComparisonResponseSchema = z.object({
  success: z.boolean(),
  comparison: z.object({
    assessments: z.array(z.object({
      id: z.string(),
      type: z.string(),
      userId: z.string(),
      userName: z.string(),
      organizationId: z.string(),
      score: z.number().finite(),
      completedAt: z.string(),
      responses: z.record(z.any()).optional(),
      categoryScores: z.record(z.number().finite()).optional()
    })),
    analysis: z.object({
      averageScore: z.number().finite(),
      scoreRange: z.object({
        min: z.number().finite(),
        max: z.number().finite(),
        variance: z.number().finite()
      }),
      categoryComparison: z.record(z.object({
        average: z.number().finite(),
        scores: z.array(z.number().finite()),
        variance: z.number().finite(),
        trend: z.enum(['improving', 'declining', 'stable'])
      })).optional(),
      userPerformance: z.array(z.object({
        userId: z.string(),
        userName: z.string(),
        averageScore: z.number().finite(),
        assessmentCount: z.number().finite(),
        trend: z.enum(['improving', 'declining', 'stable']),
        strongCategories: z.array(z.string()),
        weakCategories: z.array(z.string())
      })).optional(),
      timelineAnalysis: z.object({
        firstAssessment: z.string(),
        lastAssessment: z.string(),
        timespan: z.string(),
        improvementRate: z.number().finite(),
        trendDirection: z.enum(['improving', 'declining', 'stable'])
      }).optional(),
      benchmarks: z.object({
        industryAverage: z.number().finite(),
        percentileRank: z.number().finite(),
        comparison: z.enum(['above', 'below', 'at'])
      }).optional()
    }),
    insights: z.array(z.object({
      type: z.enum(['strength', 'weakness', 'opportunity', 'trend']),
      category: z.string(),
      title: z.string(),
      description: z.string(),
      impact: z.enum(['high', 'medium', 'low']),
      recommendation: z.string().optional()
    })),
    recommendations: z.array(z.object({
      priority: z.enum(['high', 'medium', 'low']),
      category: z.string(),
      title: z.string(),
      description: z.string(),
      expectedImpact: z.string(),
      timeline: z.string(),
      resources: z.array(z.string()).optional()
    }))
  }).optional(),
  message: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = AssessmentComparisonSchema.parse(body);

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
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Fetch assessments with user details
    const { data: assessments, error: assessmentError } = await supabase
      .from('onboarding_assessments')
      .select(`
        id,
        type,
        user_id,
        organization_id,
        score,
        responses,
        category_scores,
        completed_at,
        tier2_profiles!inner(
          first_name,
          last_name
        )
      `)
      .in('id', validatedData.assessmentIds)
      .eq('organization_id', userProfile.organization_id);

    if (assessmentError) {
      console.error('Failed to fetch assessments:', assessmentError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch assessments' },
        { status: 500 }
      );
    }

    if (assessments.length < 2) {
      return NextResponse.json(
        { success: false, message: 'At least 2 assessments required for comparison' },
        { status: 400 }
      );
    }

    // Process assessments data
    const processedAssessments = assessments.map(assessment => ({
      id: assessment.id,
      type: assessment.type,
      userId: assessment.user_id,
      userName: `${assessment.tier2_profiles.first_name} ${assessment.tier2_profiles.last_name}`,
      organizationId: assessment.organization_id,
      score: assessment.score || 0,
      completedAt: assessment.completed_at,
      responses: validatedData.includeDetails ? assessment.responses : undefined,
      categoryScores: assessment.category_scores
    }));

    // Calculate basic analysis
    const scores = processedAssessments.map(a => a.score);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;

    // Category analysis
    let categoryComparison: Record<string, any> = {};
    if (processedAssessments.some(a => a.categoryScores)) {
      const allCategories = new Set(
        processedAssessments.flatMap(a => Object.keys(a.categoryScores || {}))
      );

      for (const category of allCategories) {
        const categoryScores = processedAssessments
          .map(a => a.categoryScores?.[category])
          .filter(score => score !== undefined) as number[];

        if (categoryScores.length > 0) {
          const categoryAverage = categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
          const categoryVariance = categoryScores.reduce((sum, score) => sum + Math.pow(score - categoryAverage, 2), 0) / categoryScores.length;
          
          // Determine trend (simplified - would need historical data for real trend)
          let trend: 'improving' | 'declining' | 'stable' = 'stable';
          if (categoryScores.length >= 2) {
            const firstHalf = categoryScores.slice(0, Math.ceil(categoryScores.length / 2));
            const secondHalf = categoryScores.slice(Math.floor(categoryScores.length / 2));
            const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
            
            if (secondAvg > firstAvg + 0.5) trend = 'improving';
            else if (secondAvg < firstAvg - 0.5) trend = 'declining';
          }

          categoryComparison[category] = {
            average: Math.round(categoryAverage * 10) / 10,
            scores: categoryScores,
            variance: Math.round(categoryVariance * 100) / 100,
            trend
          };
        }
      }
    }

    // User performance analysis
    const userPerformance = [];
    const userGroups = processedAssessments.reduce((groups, assessment) => {
      if (!groups[assessment.userId]) {
        groups[assessment.userId] = [];
      }
      groups[assessment.userId].push(assessment);
      return groups;
    }, {} as Record<string, typeof processedAssessments>);

    for (const [userId, userAssessments] of Object.entries(userGroups)) {
      const userScores = userAssessments.map(a => a.score);
      const userAverage = userScores.reduce((sum, score) => sum + score, 0) / userScores.length;
      
      // Determine trend
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (userScores.length >= 2) {
        const firstScore = userScores[0];
        const lastScore = userScores[userScores.length - 1];
        if (lastScore > firstScore + 0.5) trend = 'improving';
        else if (lastScore < firstScore - 0.5) trend = 'declining';
      }

      // Find strong and weak categories
      const userCategoryScores: Record<string, number[]> = {};
      userAssessments.forEach(assessment => {
        if (assessment.categoryScores) {
          Object.entries(assessment.categoryScores).forEach(([category, score]) => {
            if (!userCategoryScores[category]) userCategoryScores[category] = [];
            userCategoryScores[category].push(score);
          });
        }
      });

      const categoryAverages = Object.entries(userCategoryScores).map(([category, scores]) => ({
        category,
        average: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }));

      categoryAverages.sort((a, b) => b.average - a.average);
      const strongCategories = categoryAverages.slice(0, 2).map(c => c.category);
      const weakCategories = categoryAverages.slice(-2).map(c => c.category);

      userPerformance.push({
        userId,
        userName: userAssessments[0].userName,
        averageScore: Math.round(userAverage * 10) / 10,
        assessmentCount: userAssessments.length,
        trend,
        strongCategories,
        weakCategories
      });
    }

    // Timeline analysis
    const sortedAssessments = processedAssessments.sort((a, b) => 
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    const firstAssessment = sortedAssessments[0];
    const lastAssessment = sortedAssessments[sortedAssessments.length - 1];
    const timespan = new Date(lastAssessment.completedAt).getTime() - new Date(firstAssessment.completedAt).getTime();
    const timespanDays = Math.ceil(timespan / (1000 * 60 * 60 * 24));
    
    const improvementRate = sortedAssessments.length > 1 
      ? (lastAssessment.score - firstAssessment.score) / timespanDays * 30 // per month
      : 0;

    let trendDirection: 'improving' | 'declining' | 'stable' = 'stable';
    if (improvementRate > 0.1) trendDirection = 'improving';
    else if (improvementRate < -0.1) trendDirection = 'declining';

    // Generate insights
    const insights = [];
    
    // Score variance insight
    if (variance > 2) {
      insights.push({
        type: 'opportunity' as const,
        category: 'Performance',
        title: 'High Score Variance Detected',
        description: `There's significant variation in assessment scores (variance: ${Math.round(variance * 100) / 100}), indicating inconsistent performance across assessments.`,
        impact: 'medium' as const,
        recommendation: 'Focus on standardizing processes and providing consistent training to reduce performance gaps.'
      });
    }

    // Category-specific insights
    Object.entries(categoryComparison).forEach(([category, data]) => {
      if (data.trend === 'improving') {
        insights.push({
          type: 'strength' as const,
          category,
          title: `${category} Showing Improvement`,
          description: `This category shows a positive trend with an average score of ${data.average}.`,
          impact: 'high' as const,
          recommendation: `Continue current initiatives in ${category} and consider applying similar approaches to other areas.`
        });
      } else if (data.average < averageScore - 1) {
        insights.push({
          type: 'weakness' as const,
          category,
          title: `${category} Below Average`,
          description: `${category} scores are significantly below the overall average (${data.average} vs ${Math.round(averageScore * 10) / 10}).`,
          impact: 'high' as const,
          recommendation: `Develop targeted improvement plan for ${category} to bring scores up to organizational average.`
        });
      }
    });

    // Generate recommendations
    const recommendations = [];
    
    if (trendDirection === 'declining') {
      recommendations.push({
        priority: 'high' as const,
        category: 'Performance',
        title: 'Address Declining Performance Trend',
        description: 'Overall assessment scores are showing a declining trend over time.',
        expectedImpact: 'Prevent further performance degradation and improve overall scores',
        timeline: '30-60 days',
        resources: ['Performance analysis', 'Training programs', 'Process review']
      });
    }

    if (Object.keys(categoryComparison).length > 0) {
      const weakestCategory = Object.entries(categoryComparison)
        .sort(([,a], [,b]) => a.average - b.average)[0];
      
      if (weakestCategory && weakestCategory[1].average < averageScore - 0.5) {
        recommendations.push({
          priority: 'medium' as const,
          category: weakestCategory[0],
          title: `Improve ${weakestCategory[0]} Performance`,
          description: `${weakestCategory[0]} is the weakest performing category with an average score of ${weakestCategory[1].average}.`,
          expectedImpact: 'Increase overall assessment scores by focusing on weakest area',
          timeline: '60-90 days',
          resources: [`${weakestCategory[0]} training`, 'Best practices documentation', 'Mentoring program']
        });
      }
    }

    // Mock industry benchmarks (in production, this would come from real data)
    const industryAverage = 7.2;
    const percentileRank = averageScore > industryAverage ? 75 : 45;
    const comparison = averageScore > industryAverage ? 'above' : 'below';

    const response = ComparisonResponseSchema.parse({
      success: true,
      comparison: {
        assessments: processedAssessments,
        analysis: {
          averageScore: Math.round(averageScore * 10) / 10,
          scoreRange: {
            min: minScore,
            max: maxScore,
            variance: Math.round(variance * 100) / 100
          },
          categoryComparison: Object.keys(categoryComparison).length > 0 ? categoryComparison : undefined,
          userPerformance: userPerformance.length > 1 ? userPerformance : undefined,
          timelineAnalysis: {
            firstAssessment: firstAssessment.completedAt,
            lastAssessment: lastAssessment.completedAt,
            timespan: `${timespanDays} days`,
            improvementRate: Math.round(improvementRate * 100) / 100,
            trendDirection
          },
          benchmarks: validatedData.includeBenchmarks ? {
            industryAverage,
            percentileRank,
            comparison: comparison as 'above' | 'below' | 'at'
          } : undefined
        },
        insights,
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

    console.error('Assessment comparison error:', error);
    return NextResponse.json(
      { success: false, message: 'Comparison failed' },
      { status: 500 }
    );
  }
}
