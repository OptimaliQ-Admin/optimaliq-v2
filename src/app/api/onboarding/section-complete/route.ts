import { NextRequest, NextResponse } from 'next/server';
import { ConversationManager, UserResponse } from '@/lib/services/onboarding/ConversationManager';

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

    // Convert responses to UserResponse format
    // For now, we'll process the first response as a representative of the section
    const firstResponseKey = Object.keys(responses)[0];
    const userResponse: UserResponse = {
      sessionId,
      questionId: firstResponseKey || sectionId,
      answer: responses[firstResponseKey] || JSON.stringify(responses),
      timestamp: new Date().toISOString(),
      context: {
        sectionId,
        allResponses: responses,
        userProfile
      }
    };

    // Process the user response to get AI response
    const conversationUpdate = await conversationManager.processUserResponse(userResponse);

    return NextResponse.json({
      message: conversationUpdate.aiMessage.content,
      sectionId,
      completed: true,
      nextQuestion: conversationUpdate.nextQuestion,
      insights: conversationUpdate.insights,
      sectionResponse: conversationUpdate.sectionResponse?.content
    });

  } catch (error) {
    console.error('Error in section-complete API:', error);
    return NextResponse.json(
      { error: 'Failed to complete section' },
      { status: 500 }
    );
  }
} 