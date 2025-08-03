import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardScores } from '@/lib/services/ai/generateDashboardScores';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userResponses, userProfile } = body;

    // Validate required fields
    if (!sessionId || !userResponses || !userProfile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate comprehensive analysis
    const analysis = await generateDashboardScores({
      sessionId,
      userResponses,
      userProfile
    });

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error in score-onboarding API:', error);
    return NextResponse.json(
      { error: 'Failed to generate scores' },
      { status: 500 }
    );
  }
} 