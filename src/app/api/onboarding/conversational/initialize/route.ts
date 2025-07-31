import { NextRequest, NextResponse } from 'next/server';
import { ConversationManager } from '@/lib/services/onboarding/ConversationManager';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Initialize conversation manager
    const conversationManager = new ConversationManager(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the first question from the question tree
    const questionTree = conversationManager['questionTree'] as any;
    const firstQuestion = questionTree.find((q: any) => q.order === 1);

    if (!firstQuestion) {
      return NextResponse.json({ error: 'No questions available' }, { status: 404 });
    }

    return NextResponse.json({
      question: firstQuestion,
      sessionId
    });

  } catch (error) {
    console.error('Error initializing conversation:', error);
    return NextResponse.json(
      { error: 'Failed to initialize conversation' },
      { status: 500 }
    );
  }
} 