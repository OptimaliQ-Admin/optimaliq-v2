import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, auth } from '@/lib/supabase';
import { SignUpRequestSchema, AuthResponseSchema, ErrorResponseSchema } from '../schema';
import { validatePassword } from '@/utils';
import { AppError, handleError } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = SignUpRequestSchema.parse(body);
    
    // Validate password strength
    const passwordValidation = validatePassword(validatedData.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        ErrorResponseSchema.parse({
          success: false,
          error: 'Password validation failed',
          message: passwordValidation.errors.join(', '),
          code: 'WEAK_PASSWORD',
          timestamp: new Date().toISOString()
        }),
        { status: 400 }
      );
    }

    // TODO: Verify reCAPTCHA token
    // const recaptchaValid = await verifyRecaptcha(validatedData.recaptchaToken);
    // if (!recaptchaValid) {
    //   return NextResponse.json(ErrorResponse, { status: 400 });
    // }

    // Create user account
    const authResult = await auth.signUp(validatedData.email, validatedData.password, {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      company: validatedData.company,
      title: validatedData.title,
      industry: validatedData.industry,
      company_size: validatedData.companySize,
      revenue_range: validatedData.revenueRange,
      agreed_terms: validatedData.agreedTerms,
      agreed_marketing: validatedData.agreedMarketing
    });

    if (!authResult.user) {
      throw new AppError('User creation failed', 'USER_CREATION_FAILED', 500);
    }

    // Create user profile in tier2_users table
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_users')
      .insert({
        id: authResult.user.id,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        company: validatedData.company,
        title: validatedData.title,
        industry: validatedData.industry,
        company_size: validatedData.companySize,
        revenue_range: validatedData.revenueRange,
        agreed_terms: validatedData.agreedTerms,
        agreed_marketing: validatedData.agreedMarketing
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Continue anyway - the auth user was created successfully
    }

    // Create initial user profile scores
    const { error: scoresError } = await supabase
      .from('tier2_profiles')
      .insert({
        user_id: authResult.user.id,
        score_overall: 0,
        score_strategy: 0,
        score_process: 0,
        score_technology: 0
      });

    if (scoresError) {
      console.error('Scores creation error:', scoresError);
      // Continue anyway
    }

    const response = AuthResponseSchema.parse({
      success: true,
      user: userProfile || {
        id: authResult.user.id,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        title: validatedData.title,
        company: validatedData.company,
        industry: validatedData.industry,
        companySize: validatedData.companySize,
        revenueRange: validatedData.revenueRange,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      session: authResult.session,
      message: 'Account created successfully. Please check your email to verify your account.'
    });

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    
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
        message: 'Failed to create account',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
