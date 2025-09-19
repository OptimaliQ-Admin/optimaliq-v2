import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, auth } from '@/lib/supabase';
import { UpdateProfileRequestSchema, ErrorResponseSchema } from '../../auth/schema';
import { AppError, handleError } from '@/utils';

// GET /api/users/profile - Get current user profile
export async function GET(_request: NextRequest) {
  try {
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new AppError('Profile not found', 'PROFILE_NOT_FOUND', 404);
    }

    // Get user scores
    const { data: userScores } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const response = {
      success: true,
      data: {
        profile: {
          id: userProfile.id,
          email: userProfile.email,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          title: userProfile.title,
          company: userProfile.company,
          industry: userProfile.industry,
          companySize: userProfile.company_size,
          revenueRange: userProfile.revenue_range,
          timezone: userProfile.timezone,
          linkedinUrl: userProfile.linkedin_url,
          agreedTerms: userProfile.agreed_terms,
          agreedMarketing: userProfile.agreed_marketing,
          createdAt: userProfile.created_at,
          updatedAt: userProfile.updated_at
        },
        scores: userScores ? {
          overall: userScores.score_overall,
          strategy: userScores.score_strategy,
          process: userScores.score_process,
          technology: userScores.score_technology,
          bmpScore: userScores.bmp_score,
          salesScore: userScores.sales_score,
          aiReadinessScore: userScores.ai_readiness_score,
          updatedAt: userScores.updated_at
        } : null
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Get profile error:', error);
    
    const handledError = handleError(error);
    
    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to fetch user profile',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = UpdateProfileRequestSchema.parse(body);
    
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Update user profile
    const updateData = {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      title: validatedData.title,
      company: validatedData.company,
      industry: validatedData.industry,
      company_size: validatedData.companySize,
      revenue_range: validatedData.revenueRange,
      timezone: validatedData.timezone,
      linkedin_url: validatedData.linkedinUrl,
      agreed_marketing: validatedData.agreedMarketing,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const { data: updatedProfile, error: updateError } = await supabase
      .from('tier2_users')
      .update(cleanUpdateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      throw new AppError('Profile update failed', 'PROFILE_UPDATE_FAILED', 500);
    }

    const response = {
      success: true,
      data: {
        id: updatedProfile.id,
        email: updatedProfile.email,
        firstName: updatedProfile.first_name,
        lastName: updatedProfile.last_name,
        title: updatedProfile.title,
        company: updatedProfile.company,
        industry: updatedProfile.industry,
        companySize: updatedProfile.company_size,
        revenueRange: updatedProfile.revenue_range,
        timezone: updatedProfile.timezone,
        linkedinUrl: updatedProfile.linkedin_url,
        agreedTerms: updatedProfile.agreed_terms,
        agreedMarketing: updatedProfile.agreed_marketing,
        createdAt: updatedProfile.created_at,
        updatedAt: updatedProfile.updated_at
      },
      message: 'Profile updated successfully'
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Update profile error:', error);
    
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
        message: 'Failed to update profile',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
