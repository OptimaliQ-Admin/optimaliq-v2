import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/ai/callOpenAI';
import { createClient } from '@supabase/supabase-js';
import { ResponseQualityMonitor } from '@/lib/services/ai/responseQualityMonitor';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface OnboardingResponseRequest {
  sessionId: string;
  currentSection: string;
  currentQuestion: string;
  userAnswer: any;
  conversationHistory: any[];
  userProfile?: any;
  nextQuestion?: any;
}

interface AIResponse {
  response: string;
  insights: string[];
  nextQuestionContext: string;
  dataForDashboard: {
    metrics: string[];
    priorities: string[];
    challenges: string[];
  };
}

// Fallback responses for reliability
const fallbackResponses = {
  goals: {
    growth_metrics: "Thank you for sharing your growth metrics. That gives me insight into what you're tracking. Let's continue with your go-to-market strategy.",
    gtm_strategy: "Your go-to-market approach shows strategic thinking. Now let's look at what's holding you back.",
    friction_points: "Understanding your challenges helps identify opportunities. Let's explore your market positioning."
  },
  positioning: {
    differentiator: "Your differentiation strategy is important for competitive advantage. Now let's examine your operations.",
    competitive_landscape: "Market positioning is crucial for success. Let's look at your internal processes."
  },
  operations: {
    team_structure: "Your team structure reflects your operational priorities. Let's examine your growth stack.",
    decision_making: "Decision-making processes impact execution speed. Let's look at your technology and tools."
  },
  growth_stack: {
    tech_stack: "Your tech stack shows your current priorities. Let's assess your clarity and communication.",
    automation_level: "Automation can significantly impact efficiency. Let's examine your organizational clarity."
  },
  clarity: {
    vision_clarity: "Vision clarity is essential for alignment. Let's look at your benchmark performance.",
    communication: "Communication is key to execution. Let's assess your current performance."
  },
  benchmarks: {
    industry_benchmarks: "Understanding your benchmark position is valuable. Let's wrap up with some final insights.",
    growth_rate: "Growth rate context helps frame opportunities. Let's complete your assessment."
  }
};

// Response validation using quality monitor
function validateResponse(response: string, responseTime: number): { isValid: boolean; score: number; issues: string[] } {
  const qualityScore = ResponseQualityMonitor.analyzeResponse(response, responseTime);
  
  return {
    isValid: qualityScore.score >= 5,
    score: qualityScore.score,
    issues: qualityScore.issues
  };
}

// Extract insights from AI response
function extractInsights(response: string, section: string, question: string): any {
  const insights = [];
  const priorities = [];
  const challenges = [];
  
  // Extract based on section and question
  switch (section) {
    case 'goals':
      if (question === 'growth_metrics') {
        if (response.toLowerCase().includes('revenue')) priorities.push('revenue_focus');
        if (response.toLowerCase().includes('cac') || response.toLowerCase().includes('acquisition cost')) priorities.push('unit_economics');
        if (response.toLowerCase().includes('retention') || response.toLowerCase().includes('churn')) priorities.push('customer_retention');
      }
      if (question === 'friction_points') {
        if (response.toLowerCase().includes('funding')) challenges.push('funding_constraints');
        if (response.toLowerCase().includes('hiring') || response.toLowerCase().includes('talent')) challenges.push('talent_challenges');
        if (response.toLowerCase().includes('marketing') || response.toLowerCase().includes('cac')) challenges.push('marketing_performance');
      }
      break;
    case 'positioning':
      if (response.toLowerCase().includes('technology') || response.toLowerCase().includes('tech')) priorities.push('tech_differentiation');
      if (response.toLowerCase().includes('service') || response.toLowerCase().includes('experience')) priorities.push('service_differentiation');
      break;
    case 'operations':
      if (response.toLowerCase().includes('lean') || response.toLowerCase().includes('small')) insights.push('lean_operations');
      if (response.toLowerCase().includes('data') || response.toLowerCase().includes('analytics')) insights.push('data_driven');
      break;
  }
  
  return {
    metrics: [],
    priorities,
    challenges
  };
}

// Generate contextual AI response
async function generateContextualResponse(
  section: string,
  question: string,
  answer: any,
  history: any[],
  userProfile?: any
): Promise<AIResponse> {
  const startTime = Date.now();
  
  const systemPrompt = `You are a senior growth consultant conducting a strategic assessment. Your responses should feel authentic and conversational, like you're having a real consultation.

RESPONSE STRUCTURE:
1. ACKNOWLEDGE their specific answer with genuine interest
2. SHARE a brief strategic insight based on what you've observed in similar companies
3. NATURALLY transition to the next question

EXAMPLES OF GOOD RESPONSES:
- "I see you're tracking revenue closely - that's the lifeblood of any business. Companies that focus solely on top-line growth often miss the signals that predict sustainable scaling. Now let's look at your go-to-market approach."
- "Your CAC concerns are valid - many companies hit that wall around your stage. The key is understanding whether it's a market problem or an execution problem. Let's examine what's holding you back."
- "Regulatory challenges can be a real growth inhibitor, but they can also create moats for companies that navigate them well. Let's explore your market positioning."

TONE: Warm, professional, confident but not overwhelming
LENGTH: 2-3 sentences maximum
STYLE: Like you've seen this pattern 100 times and know exactly what to look for next

User Profile: ${userProfile ? JSON.stringify(userProfile) : 'Not available'}
Previous Answers: ${history.length > 0 ? JSON.stringify(history.slice(-3)) : 'None'}

Current Section: ${section}
Current Question: ${question}
User Answer: ${JSON.stringify(answer)}

Respond with just the conversation text, no formatting or structure.`;

  try {
    const response = await callOpenAI(systemPrompt, {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 200,
      responseFormat: 'text'
    });

    const aiResponse = response.parsed.message || '';
    const responseTime = Date.now() - startTime;
    
    const validation = validateResponse(aiResponse, responseTime);
    
    if (!validation.isValid) {
      console.error('Response validation failed:', validation.issues);
      throw new Error('Response validation failed');
    }

    const extractedData = extractInsights(aiResponse, section, question);

    return {
      response: aiResponse,
      insights: [],
      nextQuestionContext: '',
      dataForDashboard: extractedData
    };
  } catch (error) {
    console.error('AI response generation failed:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OnboardingResponseRequest = await request.json();
    const { sessionId, currentSection, currentQuestion, userAnswer, conversationHistory, userProfile } = body;

    // Validate required fields
    if (!sessionId || !currentSection || !currentQuestion || !userAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let aiResponse: AIResponse;

    try {
      // Attempt to generate AI response
      aiResponse = await generateContextualResponse(
        currentSection,
        currentQuestion,
        userAnswer,
        conversationHistory,
        userProfile
      );
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      
      // Use fallback response
      const fallbackResponse = (fallbackResponses as any)[currentSection]?.[currentQuestion] || 
        "Thank you for sharing that. Let's continue with the next question.";
      
      aiResponse = {
        response: fallbackResponse,
        insights: [],
        nextQuestionContext: '',
        dataForDashboard: {
          metrics: [],
          priorities: [],
          challenges: []
        }
      };
    }

    // Store conversation data
    try {
      await supabase
        .from('user_responses')
        .insert({
          session_id: sessionId,
          question_id: currentQuestion,
          answer: typeof userAnswer === 'string' ? userAnswer : JSON.stringify(userAnswer),
          ai_response: aiResponse.response,
          extracted_data: aiResponse.dataForDashboard,
          timestamp: new Date().toISOString()
        });
    } catch (dbError) {
      console.error('Failed to store conversation data:', dbError);
      // Don't fail the request if DB storage fails
    }

    return NextResponse.json({
      success: true,
      response: aiResponse.response,
      dataForDashboard: aiResponse.dataForDashboard,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Onboarding response API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        fallback: "Thank you for sharing that. Let's continue with the next question."
      },
      { status: 500 }
    );
  }
} 