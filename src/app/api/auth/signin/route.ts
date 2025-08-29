import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, auth } from '@/lib/supabase';
import { SignInRequestSchema, AuthResponseSchema, ErrorResponseSchema } from '../schema';
import { AppError, handleError } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = SignInRequestSchema.parse(body);

    // TODO: Verify reCAPTCHA token if provided
    // if (validatedData.recaptchaToken) {
    //   const recaptchaValid = await verifyRecaptcha(validatedData.recaptchaToken);
    //   if (!recaptchaValid) {
    //     return NextResponse.json(ErrorResponse, { status: 400 });
    //   }
    // }

    // Authenticate user
    const authResult = await auth.signIn(validatedData.email, validatedData.password);

    if (!authResult.user || !authResult.session) {
      throw new AppError('Authentication failed', 'AUTH_FAILED', 401);
    }

    // Get user profile from tier2_users
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_users')
      .select('*')
      .eq('id', authResult.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    const response = AuthResponseSchema.parse({
      success: true,
      user: userProfile ? {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        title: userProfile.title,
        company: userProfile.company,
        industry: userProfile.industry,
        companySize: userProfile.company_size,
        revenueRange: userProfile.revenue_range,
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at
      } : undefined,
      session: authResult.session,
      message: 'Signed in successfully'
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Signin error:', error);
    
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
        message: 'Authentication failed',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
