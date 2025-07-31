import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ConversationService } from '@/lib/services/onboarding/ConversationService';

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

    const body = await request.json();
    const { organizationId } = body;

    // Initialize conversation service
    const conversationService = new ConversationService(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create new onboarding session
    const session = await conversationService.createSession(user.id, organizationId);

    return NextResponse.json({
      success: true,
      session,
      message: 'Onboarding session created successfully'
    });

  } catch (error) {
    console.error('Error creating onboarding session:', error);
    return NextResponse.json(
      { error: 'Failed to create onboarding session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Initialize conversation service
    const conversationService = new ConversationService(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get session and messages
    const session = await conversationService.getSession(sessionId);
    const messages = await conversationService.getConversationMessages(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session,
      messages
    });

  } catch (error) {
    console.error('Error getting onboarding session:', error);
    return NextResponse.json(
      { error: 'Failed to get onboarding session' },
      { status: 500 }
    );
  }
} 