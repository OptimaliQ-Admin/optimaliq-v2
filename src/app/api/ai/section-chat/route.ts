import { NextRequest, NextResponse } from 'next/server';
import { generateSectionReply } from '@/lib/services/ai/generateSectionReply';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, sectionName, userProfile, sectionResponses, transitionHook } = body;

    // Validate required fields
    if (!sessionId || !sectionName || !userProfile || !sectionResponses) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate AI response
    const response = await generateSectionReply({
      sessionId,
      sectionName,
      userProfile,
      sectionResponses,
      transitionHook
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in section-chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 