import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const toggleRequestSchema = z.object({
  leverId: z.string().uuid(),
  userId: z.string().uuid(),
  action: z.enum(['activate', 'deactivate', 'complete', 'pause', 'resume']),
  progress: z.number().finite().min(0).max(100).optional(),
  notes: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = toggleRequestSchema.parse(body);

    // Verify user owns the growth lever
    const { data: lever, error: leverError } = await supabase
      .from('growth_levers')
      .select('*')
      .eq('id', validatedData.leverId)
      .eq('user_id', validatedData.userId)
      .single();

    if (leverError || !lever) {
      return NextResponse.json({ error: 'Growth lever not found' }, { status: 404 });
    }

    // Update lever status based on action
    let newStatus = lever.status;
    let updateData: any = {
      updated_at: new Date().toISOString()
    };

    switch (validatedData.action) {
      case 'activate':
        newStatus = 'active';
        updateData.started_at = new Date().toISOString();
        break;
      case 'deactivate':
        newStatus = 'inactive';
        updateData.paused_at = new Date().toISOString();
        break;
      case 'complete':
        newStatus = 'completed';
        updateData.completed_at = new Date().toISOString();
        updateData.progress = 100;
        break;
      case 'pause':
        newStatus = 'paused';
        updateData.paused_at = new Date().toISOString();
        break;
      case 'resume':
        newStatus = 'active';
        updateData.resumed_at = new Date().toISOString();
        break;
    }

    // Update progress if provided
    if (validatedData.progress !== undefined) {
      updateData.progress = validatedData.progress;
    }

    // Update the growth lever
    const { error: updateError } = await supabase
      .from('growth_levers')
      .update({
        ...updateData,
        status: newStatus
      })
      .eq('id', validatedData.leverId);

    if (updateError) {
      console.error('Error updating growth lever:', updateError);
      return NextResponse.json({ error: 'Failed to update growth lever' }, { status: 500 });
    }

    // Create progress tracking entry
    const { error: progressError } = await supabase
      .from('growth_lever_progress')
      .insert({
        lever_id: validatedData.leverId,
        user_id: validatedData.userId,
        action: validatedData.action,
        previous_status: lever.status,
        new_status: newStatus,
        progress: validatedData.progress || lever.progress,
        notes: validatedData.notes,
        created_at: new Date().toISOString()
      });

    if (progressError) {
      console.error('Error creating progress entry:', progressError);
    }

    // Update KPI tracking if lever is completed
    if (validatedData.action === 'complete') {
      const { error: kpiError } = await supabase
        .from('kpi_tracking')
        .insert({
          user_id: validatedData.userId,
          kpi_type: 'growth_lever_completion',
          value: 1,
          metadata: {
            leverId: validatedData.leverId,
            leverName: lever.name,
            impactScore: lever.impact_score
          },
          tracked_date: new Date().toISOString()
        });

      if (kpiError) {
        console.error('Error updating KPI tracking:', kpiError);
      }
    }

    return NextResponse.json({
      message: `Growth lever ${validatedData.action}d successfully`,
      lever: {
        id: validatedData.leverId,
        status: newStatus,
        progress: validatedData.progress || lever.progress,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Growth lever toggle error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leverId = searchParams.get('leverId');
    const userId = searchParams.get('userId') || user.id;

    if (!leverId) {
      return NextResponse.json({ error: 'Lever ID required' }, { status: 400 });
    }

    // Get growth lever progress history
    const { data: progressHistory, error: progressError } = await supabase
      .from('growth_lever_progress')
      .select('*')
      .eq('lever_id', leverId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (progressError) {
      console.error('Error fetching progress history:', progressError);
      return NextResponse.json({ error: 'Failed to fetch progress history' }, { status: 500 });
    }

    // Get current lever status
    const { data: lever } = await supabase
      .from('growth_levers')
      .select('*')
      .eq('id', leverId)
      .eq('user_id', userId)
      .single();

    // Calculate progress analytics
    const analytics = calculateProgressAnalytics(progressHistory || [], lever);

    return NextResponse.json({
      leverId,
      currentStatus: lever?.status,
      currentProgress: lever?.progress,
      progressHistory: progressHistory || [],
      analytics,
      summary: {
        totalActions: progressHistory?.length || 0,
        lastAction: progressHistory?.[0]?.action,
        lastActionDate: progressHistory?.[0]?.created_at,
        averageProgressChange: analytics.averageProgressChange,
        timeToCompletion: analytics.timeToCompletion
      }
    });

  } catch (error) {
    console.error('Progress tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateProgressAnalytics(progressHistory: any[], lever: any) {
  if (progressHistory.length === 0) {
    return {
      averageProgressChange: 0,
      timeToCompletion: null,
      statusChanges: [],
      progressTrend: 'stable'
    };
  }

  // Calculate average progress change
  const progressChanges = progressHistory
    .filter(p => p.progress !== null)
    .map((p, index) => {
      if (index === progressHistory.length - 1) return 0;
      const nextProgress = progressHistory[index + 1].progress;
      return p.progress - nextProgress;
    })
    .filter(change => change !== 0);

  const averageProgressChange = progressChanges.length > 0 
    ? progressChanges.reduce((sum, change) => sum + change, 0) / progressChanges.length 
    : 0;

  // Calculate time to completion
  const completionEntry = progressHistory.find(p => p.action === 'complete');
  const startEntry = progressHistory[progressHistory.length - 1];
  
  let timeToCompletion = null;
  if (completionEntry && startEntry) {
    const startTime = new Date(startEntry.created_at).getTime();
    const completionTime = new Date(completionEntry.created_at).getTime();
    timeToCompletion = (completionTime - startTime) / (1000 * 60 * 60 * 24); // Days
  }

  // Analyze status changes
  const statusChanges = progressHistory
    .filter(p => p.previous_status !== p.new_status)
    .map(p => ({
      from: p.previous_status,
      to: p.new_status,
      date: p.created_at,
      action: p.action
    }));

  // Determine progress trend
  const recentProgress = progressHistory
    .slice(0, 3)
    .filter(p => p.progress !== null)
    .map(p => p.progress);

  let progressTrend = 'stable';
  if (recentProgress.length >= 2) {
    const trend = recentProgress[0] - recentProgress[recentProgress.length - 1];
    if (trend > 5) progressTrend = 'increasing';
    else if (trend < -5) progressTrend = 'decreasing';
  }

  return {
    averageProgressChange,
    timeToCompletion,
    statusChanges,
    progressTrend
  };
}
