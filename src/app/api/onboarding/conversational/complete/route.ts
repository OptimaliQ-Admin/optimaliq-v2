import { NextRequest, NextResponse } from 'next/server';
import { ConversationManager } from '@/lib/services/onboarding/ConversationManager';
import { BusinessIntelligenceEngine } from '@/lib/services/onboarding/BusinessIntelligenceEngine';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Initialize services
    const conversationManager = new ConversationManager(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const businessIntelligence = new BusinessIntelligenceEngine();

    // Get conversation state
    const state = await conversationManager['getConversationState'](sessionId);

    // Analyze business context
    const metrics = businessIntelligence.analyzeBusinessContext(state.context, state.userPersona);

    // Generate strategic insights
    const insights = businessIntelligence.generateStrategicInsights(metrics, state.context);

    // Mark session as completed
    await conversationManager['supabase']
      .from('onboarding_sessions')
      .update({
        status: 'completed',
        current_step: 'completion',
        progress_percentage: 100,
        metadata: {
          ...state.context,
          metrics,
          insights,
          completed_at: new Date().toISOString()
        }
      })
      .eq('id', sessionId);

    return NextResponse.json({
      metrics,
      insights,
      completionMessage: "Excellent! I've completed my analysis of your business. Here's what I discovered and my strategic recommendations for your growth."
    });

  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
} 