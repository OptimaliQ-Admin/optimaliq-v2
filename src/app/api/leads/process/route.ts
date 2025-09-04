import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { AppError } from '@/utils';

// Lead processing request schema
const ProcessLeadRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Valid email required'),
  industry: z.string().min(1, 'Industry is required'),
  role: z.string().min(1, 'Role is required').max(100, 'Role too long'),
  companySize: z.string().min(1, 'Company size is required'),
  revenueRange: z.string().min(1, 'Revenue range is required'),
  privacyConsent: z.boolean().refine(val => val === true, 'Privacy consent required'),
  source: z.string().default('growth_assessment'),
  utmData: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional()
  }).optional()
});

// Lead processing response schema
const ProcessLeadResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    userId: z.string().optional(),
    email: z.string(),
    assessmentUrl: z.string(),
    message: z.string()
  }).optional(),
  message: z.string()
});

export async function POST(request: NextRequest) {
  try {
    console.log('Leads processing started');
    
    if (!supabase) {
      console.error('Supabase not configured');
      throw new AppError('Database connection failed', 'DATABASE_CONNECTION_FAILED', 500);
    }

    console.log('Supabase configured, parsing request body');
    const body = await request.json();
    console.log('Request body:', body);
    
    // Validate request body
    const validatedData = ProcessLeadRequestSchema.parse(body);
    console.log('Request validated:', validatedData);
    
    // Check if user already exists
    console.log('Checking for existing user...');
    const { data: existingUser, error: userCheckError } = await supabase
      .from('tier2_users')
      .select('id, email')
      .eq('email', validatedData.email)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userCheckError);
      throw new AppError('Failed to check existing user', 'USER_CHECK_FAILED', 500);
    }

    console.log('Existing user check result:', existingUser);

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      console.log('User exists, updating profile...');
      // User exists, update their profile with new lead data
      userId = existingUser.id;
      
      const { error: updateError } = await supabase
        .from('tier2_users')
        .update({
          industry: validatedData.industry,
          company_size: validatedData.companySize,
          revenue_range: validatedData.revenueRange,
          title: validatedData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Profile update error:', updateError);
      } else {
        console.log('Profile updated successfully');
      }
    } else {
      console.log('Creating new user account...');
      // Create new user account
      isNewUser = true;
      
      // Generate a temporary password (user will reset it)
      const tempPassword = `OptimaliQ_${Math.random().toString(36).substring(2, 15)}`;
      console.log('Generated temp password for:', validatedData.email);
      
      // Try to create auth user first, fallback to direct database insert if auth fails
      console.log('Creating auth user...');
      try {
        const { data: authResult, error: authError } = await supabase.auth.signUp({
          email: validatedData.email,
          password: tempPassword,
          options: {
            data: {
          first_name: validatedData.name.split(' ')[0] || validatedData.name,
          last_name: validatedData.name.split(' ').slice(1).join(' ') || '',
          company: 'Lead from Growth Assessment',
          title: validatedData.role,
          industry: validatedData.industry,
          company_size: validatedData.companySize,
          revenue_range: validatedData.revenueRange,
          agreed_terms: true,
          agreed_marketing: validatedData.privacyConsent
            }
          }
        });

        console.log('Auth result:', authResult);

        if (authError) {
          console.warn('Auth signup failed, creating user directly in database:', authError.message);
          throw new Error('Auth signup failed');
        }

        if (!authResult.user) {
          console.warn('Auth signup failed, creating user directly in database');
          throw new Error('Auth signup failed');
        }

        userId = authResult.user.id;
        console.log('Auth user created with ID:', userId);
      } catch (authError) {
        console.log('Auth creation failed, creating user directly in database...');
        // Fallback: create user directly in tier2_users table
        // Generate a UUID for the user since we're not using auth
        const { data: newUser, error: userError } = await supabase
          .from('tier2_users')
          .insert({
            id: crypto.randomUUID(), // Generate UUID for direct database insert
            first_name: validatedData.name.split(' ')[0] || validatedData.name,
            last_name: validatedData.name.split(' ').slice(1).join(' ') || '',
            email: validatedData.email,
            industry: validatedData.industry,
            company_size: validatedData.companySize,
            revenue_range: validatedData.revenueRange,
            title: validatedData.role,
            agreed_terms: true,
            agreed_marketing: validatedData.privacyConsent
          })
          .select('id')
          .single();

        if (userError) {
          console.error('Direct user creation error:', userError);
          throw new AppError(`Failed to create user: ${userError.message}`, 'USER_CREATION_FAILED', 500);
        }

        userId = newUser.id;
        console.log('User created directly in database with ID:', userId);
      }

      // Create user profile in tier2_users table (only if not already created)
      console.log('Creating user profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('tier2_users')
        .upsert({
          id: userId,
          first_name: validatedData.name.split(' ')[0] || validatedData.name,
          last_name: validatedData.name.split(' ').slice(1).join(' ') || '',
          email: validatedData.email,
          company: 'Lead from Growth Assessment',
          title: validatedData.role,
          industry: validatedData.industry,
          company_size: validatedData.companySize,
          revenue_range: validatedData.revenueRange,
          agreed_terms: true,
          agreed_marketing: validatedData.privacyConsent
        })
        .select();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue anyway - the user was created successfully
      } else {
        console.log('User profile created/updated successfully:', profileData);
      }

      // Create initial user profile scores
      console.log('Creating initial profile scores...');
      const { error: scoresError } = await supabase
        .from('tier2_profiles')
        .insert({
          user_id: userId,
          score_overall: 0,
          score_strategy: 0,
          score_process: 0,
          score_technology: 0
        });

      if (scoresError) {
        console.error('Scores creation error:', scoresError);
        // Continue anyway
      } else {
        console.log('Profile scores created successfully');
      }
    }

    // Create lead record
    console.log('Creating lead record...');
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert({
        email: validatedData.email,
        name: validatedData.name,
        industry: validatedData.industry,
        role: validatedData.role,
        company_size: validatedData.companySize,
        revenue_range: validatedData.revenueRange,
        source: validatedData.source,
        utm_data: validatedData.utmData || {},
        status: 'qualified',
        user_id: userId,
        created_at: new Date().toISOString()
      })
      .select();

    if (leadError) {
      console.error('Lead creation error:', leadError);
      // Continue anyway - the user was created successfully
    } else {
      console.log('Lead record created successfully:', leadData);
    }

    // Generate assessment URL with user context
    const assessmentUrl = `/assessment?user=${userId}&industry=${encodeURIComponent(validatedData.industry)}&role=${encodeURIComponent(validatedData.role)}`;
    console.log('Generated assessment URL:', assessmentUrl);

    const response = ProcessLeadResponseSchema.parse({
      success: true,
      data: {
        userId: isNewUser ? userId : undefined,
        email: validatedData.email,
        assessmentUrl,
        message: isNewUser 
          ? 'Account created successfully! Redirecting to your personalized assessment...'
          : 'Welcome back! Redirecting to your personalized assessment...'
      },
      message: isNewUser ? 'Lead processed and account created' : 'Lead processed and profile updated'
    });

    console.log('Response prepared:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in leads processing:', error);
    
    if (error instanceof AppError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        code: error.code,
        details: error.details
      }, { status: error.statusCode });
    }
    
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: error.message,
        code: 'UNKNOWN_ERROR'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR'
    }, { status: 500 });
  }
}
