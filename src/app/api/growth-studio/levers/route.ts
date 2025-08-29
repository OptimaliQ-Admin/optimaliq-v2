import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, auth } from '@/lib/supabase';
import { agents } from '@/lib/ai/agents';
import { ErrorResponseSchema } from '../../auth/schema';
import { AppError, handleError } from '@/utils';

// Growth levers schemas
const GrowthLeverSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  impact: z.number().min(0).max(10),
  effort: z.number().min(0).max(10),
  priority: z.number().min(0).max(10),
  timeline: z.number().min(1).max(12),
  isCompleted: z.boolean(),
  completedAt: z.string().optional(),
  generatedAt: z.string()
});

const GrowthLeversResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(GrowthLeverSchema),
  metadata: z.object({
    totalLevers: z.number(),
    completedLevers: z.number(),
    averageImpact: z.number(),
    lastGenerated: z.string(),
    needsRegeneration: z.boolean()
  }),
  message: z.string().optional()
});

const ToggleLeverRequestSchema = z.object({
  leverId: z.string(),
  isCompleted: z.boolean()
});

// GET /api/growth-studio/levers - Get growth levers
export async function GET(_request: NextRequest) {
  try {
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Get existing growth levers
    const { data: existingLevers } = await supabase
      .from('growth_levers')
      .select('*')
      .eq('user_id', user.id)
      .order('priority', { ascending: false });

    // Check if levers need regeneration (31 days old)
    const needsRegeneration = !existingLevers || existingLevers.length === 0 ||
      (existingLevers[0] && new Date(existingLevers[0].generated_at).getTime() < Date.now() - (31 * 24 * 60 * 60 * 1000));

    let levers = existingLevers || [];

    // Regenerate if needed
    if (needsRegeneration) {
      try {
        // Get user scores and profile for context
        const { data: userScores } = await supabase
          .from('tier2_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const { data: userProfile } = await supabase
          .from('tier2_users')
          .select('industry, company_size, revenue_range')
          .eq('id', user.id)
          .single();

        if (userScores) {
          // Generate new growth plan
          const growthPlan = await agents.createGrowthPlan(
            {
              strategy: userScores.score_strategy,
              process: userScores.score_process,
              technology: userScores.score_technology,
              overall: userScores.score_overall
            },
            userProfile?.industry || 'Technology',
            userProfile?.company_size || '11-50',
            userProfile?.revenue_range || '$1M - $10M',
            user.id
          );

          if (growthPlan.success && growthPlan.data.growthLevers) {
            // Clear old levers
            await supabase
              .from('growth_levers')
              .delete()
              .eq('user_id', user.id);

            // Insert new levers
            const newLevers = growthPlan.data.growthLevers.map((lever: any) => ({
              user_id: user.id,
              title: lever.title,
              description: lever.description,
              category: lever.category,
              impact: lever.impact,
              effort: lever.effort,
              priority: lever.priority,
              generated_at: new Date().toISOString()
            }));

            const { data: insertedLevers } = await supabase
              .from('growth_levers')
              .insert(newLevers)
              .select();

            levers = insertedLevers || [];
          }
        }
      } catch (aiError) {
        console.error('Growth levers generation failed:', aiError);
        // Continue with existing levers
      }
    }

    // Get progress tracking
    const { data: progressData } = await supabase
      .from('growth_lever_progress')
      .select('*')
      .eq('user_id', user.id);

    // Map progress to levers
    const progressMap = new Map(
      (progressData || []).map(p => [p.lever_text, p.is_completed])
    );

    const formattedLevers = levers.map(lever => ({
      id: lever.id,
      title: lever.title,
      description: lever.description,
      category: lever.category,
      impact: lever.impact,
      effort: lever.effort,
      priority: lever.priority,
      timeline: 1, // Default timeline
      isCompleted: progressMap.get(lever.title) || false,
      completedAt: progressData?.find(p => p.lever_text === lever.title && p.is_completed)?.toggled_at,
      generatedAt: lever.generated_at
    }));

    const completedCount = formattedLevers.filter(l => l.isCompleted).length;
    const averageImpact = formattedLevers.length > 0 
      ? formattedLevers.reduce((sum, l) => sum + l.impact, 0) / formattedLevers.length
      : 0;

    const response = GrowthLeversResponseSchema.parse({
      success: true,
      data: formattedLevers,
      metadata: {
        totalLevers: formattedLevers.length,
        completedLevers: completedCount,
        averageImpact,
        lastGenerated: levers[0]?.generated_at || new Date().toISOString(),
        needsRegeneration
      }
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Growth levers error:', error);
    
    const handledError = handleError(error);
    
    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to fetch growth levers',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}

// POST /api/growth-studio/levers/toggle - Toggle lever completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = ToggleLeverRequestSchema.parse(body);
    
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Get the lever details
    const { data: lever, error: leverError } = await supabase
      .from('growth_levers')
      .select('*')
      .eq('id', validatedData.leverId)
      .eq('user_id', user.id)
      .single();

    if (leverError || !lever) {
      throw new AppError('Growth lever not found', 'LEVER_NOT_FOUND', 404);
    }

    // Update or insert progress
    const { error: progressError } = await supabase
      .from('growth_lever_progress')
      .upsert({
        user_id: user.id,
        lever_text: lever.title,
        is_completed: validatedData.isCompleted,
        toggled_at: new Date().toISOString()
      });

    if (progressError) {
      throw new AppError('Failed to update progress', 'PROGRESS_UPDATE_FAILED', 500);
    }

    return NextResponse.json({
      success: true,
      data: {
        leverId: validatedData.leverId,
        isCompleted: validatedData.isCompleted,
        updatedAt: new Date().toISOString()
      },
      message: validatedData.isCompleted ? 'Growth lever completed! 🎉' : 'Growth lever marked as incomplete'
    }, { status: 200 });

  } catch (error) {
    console.error('Toggle lever error:', error);
    
    const handledError = handleError(error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ErrorResponseSchema.parse({
          success: false,
          error: 'Validation failed',
          message: error.errors.map(e => e.message).join(', '),
          code: 'VALIDATION_ERROR',
          details: error.errors,
          timestamp: new Date().toISOString()
        }),
        { status: 400 }
      );
    }

    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to toggle lever completion',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
