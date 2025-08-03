import { NextRequest, NextResponse } from 'next/server';
import { getSmartAIClient } from '@/lib/ai/smartAIClient';
import { AIClient } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const { prompt, maxTokens = 150, temperature = 0.7 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get AI client
    const aiClient = getSmartAIClient(new AIClient());
    
    // Generate response
    const response = await aiClient.generate(prompt, {
      maxTokens,
      temperature,
      scenario: 'market_intelligence',
      priority: 'accuracy',
      complexity: 'medium'
    });

    return NextResponse.json({
      response: response.content,
      success: true
    });

  } catch (error) {
    console.error('Error generating section response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 