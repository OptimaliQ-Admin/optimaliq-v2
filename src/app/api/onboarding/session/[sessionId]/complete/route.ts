import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ConversationService } from '@/lib/services/onboarding/ConversationService';

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
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

    const { sessionId } = params;

    // Initialize conversation service
    const conversationService = new ConversationService(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify session belongs to user
    const session = await conversationService.getSession(sessionId);
    if (!session || session.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    // Complete the session
    await conversationService.completeSession(sessionId);

    // Generate final recommendations
    const recommendations = await conversationService.generatePredictiveRecommendations(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Onboarding session completed successfully',
      sessionId,
      recommendations
    });

  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    );
  }
} 