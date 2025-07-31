import { NextRequest, NextResponse } from 'next/server';
import { ConversationManager, UserResponse } from '@/lib/services/onboarding/ConversationManager';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, questionId, answer } = await request.json();

    if (!sessionId || !questionId || answer === undefined) {
      return NextResponse.json({ 
        error: 'Session ID, question ID, and answer are required' 
      }, { status: 400 });
    }

    // Initialize conversation manager
    const conversationManager = new ConversationManager(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create user response object
    const userResponse: UserResponse = {
      sessionId,
      questionId,
      answer,
      timestamp: new Date().toISOString()
    };

    // Process the response
    const result = await conversationManager.processUserResponse(userResponse);

    return NextResponse.json({
      state: result.state,
      aiMessage: result.aiMessage,
      nextQuestion: result.nextQuestion,
      insights: result.insights
    });

  } catch (error) {
    console.error('Error processing response:', error);
    return NextResponse.json(
      { error: 'Failed to process response' },
      { status: 500 }
    );
  }
} 