import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { StructuredOnboardingService } from '@/lib/services/onboarding/StructuredOnboardingService';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize structured onboarding service
    const onboardingService = new StructuredOnboardingService(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create new structured onboarding session
    const result = await onboardingService.createStructuredSession(user.id);

    return NextResponse.json({
      success: true,
      session: result.session,
      currentStep: result.currentStep,
      totalSteps: result.totalSteps,
      message: 'Structured onboarding session created successfully'
    });

  } catch (error) {
    console.error('Error creating structured onboarding session:', error);
    return NextResponse.json(
      { error: 'Failed to create onboarding session' },
      { status: 500 }
    );
  }
} 