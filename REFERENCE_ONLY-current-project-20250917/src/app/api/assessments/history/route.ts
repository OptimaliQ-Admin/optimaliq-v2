import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const historyQuerySchema = z.object({
  userId: z.string().uuid(),
  assessmentType: z.enum(['onboarding', 'bpm', 'sales_performance']).optional(),
  limit: z.number().finite().min(1).max(100).default(10),
  offset: z.number().finite().min(0).default(0),
  status: z.enum(['completed', 'in_progress', 'draft']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
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
      assessmentType: searchParams.get('assessmentType'),
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0'),
      status: searchParams.get('status'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate')
    };

    const validatedQuery = historyQuerySchema.parse(queryData);

    // Build query
    let query = supabase
      .from('onboarding_assessments')
      .select(`
        id,
        assessment_type,
        title,
        description,
        score,
        category_scores,
        status,
        created_at,
        completed_at,
        updated_at,
        user_id,
        organization_id
      `)
      .eq('user_id', validatedQuery.userId)
      .order('created_at', { ascending: false })
      .range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1);

    // Apply filters
    if (validatedQuery.assessmentType) {
      query = query.eq('assessment_type', validatedQuery.assessmentType);
    }

    if (validatedQuery.status) {
      query = query.eq('status', validatedQuery.status);
    }

    if (validatedQuery.startDate) {
      query = query.gte('created_at', validatedQuery.startDate);
    }

    if (validatedQuery.endDate) {
      query = query.lte('created_at', validatedQuery.endDate);
    }

    const { data: assessments, error, count } = await query;

    if (error) {
      console.error('Error fetching assessment history:', error);
      return NextResponse.json({ error: 'Failed to fetch assessment history' }, { status: 500 });
    }

    // Get total count for pagination
    let totalCount = 0;
    if (count !== null) {
      totalCount = count;
    } else {
      const { count: totalCountResult } = await supabase
        .from('onboarding_assessments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', validatedQuery.userId);
      
      totalCount = totalCountResult || 0;
    }

    // Calculate progress trends
    const progressTrends = assessments?.map((assessment, index) => {
      if (index === 0) return null;
      const currentScore = assessment.score || 0;
      const previousScore = assessments[index - 1].score || 0;
      return {
        assessmentId: assessment.id,
        scoreChange: currentScore - previousScore,
        percentageChange: previousScore > 0 ? ((currentScore - previousScore) / previousScore) * 100 : 0,
        trend: currentScore > previousScore ? 'improving' : currentScore < previousScore ? 'declining' : 'stable'
      };
    }).filter(Boolean);

    // Get category performance over time
    const categoryPerformance = assessments?.reduce((acc, assessment) => {
      if (assessment.category_scores && typeof assessment.category_scores === 'object') {
        Object.entries(assessment.category_scores).forEach(([category, score]) => {
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            assessmentId: assessment.id,
            score: score as number,
            date: assessment.completed_at || assessment.created_at
          });
        });
      }
      return acc;
    }, {} as Record<string, Array<{ assessmentId: string; score: number; date: string }>>);

    return NextResponse.json({
      assessments: assessments || [],
      pagination: {
        total: totalCount,
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        hasMore: validatedQuery.offset + validatedQuery.limit < totalCount
      },
      analytics: {
        totalAssessments: totalCount,
        completedAssessments: assessments?.filter(a => a.status === 'completed').length || 0,
        averageScore: assessments?.filter(a => a.score !== null).length > 0 
          ? assessments?.filter(a => a.score !== null).reduce((sum, a) => sum + (a.score || 0), 0) / assessments?.filter(a => a.score !== null).length || 0
          : 0,
        progressTrends: progressTrends || [],
        categoryPerformance: categoryPerformance || {}
      }
    });

  } catch (error) {
    console.error('Assessment history error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
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
    const { assessmentId, action } = body;

    if (!assessmentId || !action) {
      return NextResponse.json({ error: 'Assessment ID and action required' }, { status: 400 });
    }

    switch (action) {
      case 'duplicate':
        // Duplicate an assessment
        const { data: originalAssessment, error: fetchError } = await supabase
          .from('onboarding_assessments')
          .select('*')
          .eq('id', assessmentId)
          .eq('user_id', user.id)
          .single();

        if (fetchError || !originalAssessment) {
          return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        const { data: duplicatedAssessment, error: duplicateError } = await supabase
          .from('onboarding_assessments')
          .insert({
            ...originalAssessment,
            id: undefined, // Let Supabase generate new ID
            title: `${originalAssessment.title} (Copy)`,
            status: 'draft',
            created_at: new Date().toISOString(),
            completed_at: null,
            score: null,
            category_scores: null,
            insights: null,
            recommendations: null,
            next_steps: null,
            benchmark_comparison: null
          })
          .select()
          .single();

        if (duplicateError) {
          console.error('Error duplicating assessment:', duplicateError);
          return NextResponse.json({ error: 'Failed to duplicate assessment' }, { status: 500 });
        }

        return NextResponse.json({ 
          message: 'Assessment duplicated successfully',
          assessment: duplicatedAssessment 
        });

      case 'archive':
        // Archive an assessment
        const { error: archiveError } = await supabase
          .from('onboarding_assessments')
          .update({ status: 'archived' })
          .eq('id', assessmentId)
          .eq('user_id', user.id);

        if (archiveError) {
          console.error('Error archiving assessment:', archiveError);
          return NextResponse.json({ error: 'Failed to archive assessment' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Assessment archived successfully' });

      case 'restore':
        // Restore an archived assessment
        const { error: restoreError } = await supabase
          .from('onboarding_assessments')
          .update({ status: 'completed' })
          .eq('id', assessmentId)
          .eq('user_id', user.id);

        if (restoreError) {
          console.error('Error restoring assessment:', restoreError);
          return NextResponse.json({ error: 'Failed to restore assessment' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Assessment restored successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Assessment history action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

