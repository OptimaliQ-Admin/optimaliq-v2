import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { AppError } from '@/utils';

// Assessment save request schema
const SaveAssessmentRequestSchema = z.object({
  userInfo: z.object({
    name: z.string(),
    email: z.string(),
    industry: z.string(),
    role: z.string(),
    companySize: z.string(),
    revenueRange: z.string(),
    userId: z.string().optional()
  }),
  answers: z.object({
    obstacles: z.string(),
    strategy: z.string(),
    process: z.string(),
    customers: z.string(),
    technology: z.string()
  }),
  submittedAt: z.string()
});

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      throw new AppError('Database connection failed', 'DATABASE_CONNECTION_FAILED', 500);
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = SaveAssessmentRequestSchema.parse(body);
    
    // Get or create user ID
    let userId = validatedData.userInfo.userId;
    
    if (!userId) {
      // Check if user exists by email
      const { data: existingUser } = await supabase
        .from('tier2_users')
        .select('id')
        .eq('email', validatedData.userInfo.email)
        .single();

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user if doesn't exist
        const { data: newUser, error: userError } = await supabase
          .from('tier2_users')
          .insert({
            first_name: validatedData.userInfo.name.split(' ')[0] || validatedData.userInfo.name,
            last_name: validatedData.userInfo.name.split(' ').slice(1).join(' ') || '',
            email: validatedData.userInfo.email,
            industry: validatedData.userInfo.industry,
            company_size: validatedData.userInfo.companySize,
            revenue_range: validatedData.userInfo.revenueRange,
            title: validatedData.userInfo.role,
            agreed_terms: true,
            agreed_marketing: true
          })
          .select('id')
          .single();

        if (userError) {
          console.error('User creation error:', userError);
          throw new AppError('Failed to create user', 'USER_CREATION_FAILED', 500);
        }

        userId = newUser.id;
      }
    }

    // Save assessment responses
    const { data: assessment, error: assessmentError } = await supabase
      .from('onboarding_assessments')
      .insert({
        user_id: userId,
        type: 'growth_assessment',
        payload_json: {
          obstacles: validatedData.answers.obstacles,
          strategy: validatedData.answers.strategy,
          process: validatedData.answers.process,
          customers: validatedData.answers.customers,
          technology: validatedData.answers.technology,
          user_info: validatedData.userInfo
        },
        status: 'completed',
        score: 0, // Will be calculated by AI
        completed_at: validatedData.submittedAt
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('Assessment save error:', assessmentError);
      throw new AppError('Failed to save assessment', 'ASSESSMENT_SAVE_FAILED', 500);
    }

    // Update user profile with assessment completion
    await supabase
      .from('tier2_users')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    // Create lead record
    await supabase
      .from('leads')
      .insert({
        email: validatedData.userInfo.email,
        name: validatedData.userInfo.name,
        industry: validatedData.userInfo.industry,
        role: validatedData.userInfo.role,
        company_size: validatedData.userInfo.companySize,
        revenue_range: validatedData.userInfo.revenueRange,
        source: 'growth_assessment',
        status: 'assessment_completed',
        user_id: userId,
        assessment_completed: true,
        assessment_score: 0, // Will be calculated by AI
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      data: {
        assessmentId: assessment.id,
        userId: userId,
        message: 'Assessment saved successfully'
      },
      message: 'Assessment completed and saved'
    });

  } catch (error) {
    console.error('Save assessment error:', error);
    
    if (error instanceof AppError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        code: error.code
      }, { status: error.statusCode });
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    }, { status: 500 });
  }
}
