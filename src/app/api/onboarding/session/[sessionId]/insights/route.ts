import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ConversationService } from '@/lib/services/onboarding/ConversationService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
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

    const { sessionId } = await params;

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

    // Get real-time insights
    const insights = await conversationService.getRealTimeInsights(sessionId);

    return NextResponse.json({
      success: true,
      insights,
      sessionId
    });

  } catch (error) {
    console.error('Error getting insights:', error);
    return NextResponse.json(
      { error: 'Failed to get insights' },
      { status: 500 }
    );
  }
} 