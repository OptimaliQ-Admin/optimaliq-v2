import { NextRequest, NextResponse } from 'next/server';
import { ConversationManager } from '@/lib/services/onboarding/ConversationManager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, sectionId, responses, userProfile } = body;

    // Validate required fields
    if (!sessionId || !sectionId || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize conversation manager
    const conversationManager = new ConversationManager(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Generate strategic GPT response
    const aiResponse = await conversationManager.onSectionComplete(
      sectionId,
      responses,
      userProfile
    );

    return NextResponse.json({
      message: aiResponse,
      sectionId,
      completed: true
    });

  } catch (error) {
    console.error('Error in section-complete API:', error);
    return NextResponse.json(
      { error: 'Failed to complete section' },
      { status: 500 }
    );
  }
} 