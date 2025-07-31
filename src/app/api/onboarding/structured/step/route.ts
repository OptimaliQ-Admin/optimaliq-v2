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

    const { sessionId, answers } = await request.json();

    if (!sessionId || !answers) {
      return NextResponse.json(
        { error: 'Missing sessionId or answers' },
        { status: 400 }
      );
    }

    // Initialize structured onboarding service with service role key for RLS bypass
    const onboardingService = new StructuredOnboardingService(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Submit answers for current step
    const result = await onboardingService.submitStepAnswers(sessionId, answers);

    return NextResponse.json({
      success: true,
      completed: result.completed,
      nextStep: result.nextStep,
      progress: result.progress,
      redirectTo: result.redirectTo,
      message: result.completed ? 'Onboarding completed successfully' : 'Step completed successfully'
    });

  } catch (error) {
    console.error('Error submitting step answers:', error);
    return NextResponse.json(
      { error: 'Failed to submit answers' },
      { status: 500 }
    );
  }
} 