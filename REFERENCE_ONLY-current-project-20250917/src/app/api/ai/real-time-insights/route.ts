import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SimpleAIProvider } from '@/lib/ai/simple-ai-provider';

const RealTimeInsightsSchema = z.object({
  question: z.string(),
  response: z.any(),
  category: z.enum(['strategy', 'operations', 'team', 'technology', 'market']),
  aiPrompt: z.string(),
  userInfo: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    role: z.string().optional(),
    companySize: z.string().optional(),
    revenueRange: z.string().optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RealTimeInsightsSchema.parse(body);

    const { question, response, category, aiPrompt, userInfo } = validatedData;

    // Initialize AI provider
    const aiProvider = new SimpleAIProvider({
      provider: 'fallback',
      model: 'template',
      maxTokens: 500,
      temperature: 0.7
    });

    // Generate insights based on the response
    const insights = await generateInsightsForResponse(
      aiProvider,
      question,
      response,
      category,
      aiPrompt,
      userInfo
    );

    return NextResponse.json({
      success: true,
      insights: insights,
      category: category,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating real-time insights:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate insights' 
      },
      { status: 500 }
    );
  }
}

async function generateInsightsForResponse(
  aiProvider: SimpleAIProvider,
  question: string,
  response: any,
  category: string,
  aiPrompt: string,
  userInfo?: any
): Promise<string[]> {
  try {
    // Format the response for AI analysis
    const formattedResponse = formatResponseForAI(response);
    
    // Create context for AI analysis
    const context = createAnalysisContext(question, formattedResponse, category, userInfo);
    
    // Generate insights using the AI provider
    const aiResponse = await aiProvider.generateResponse(
      `${aiPrompt}\n\nContext: ${context}\n\nResponse: ${formattedResponse}`
    );

    // Parse and format insights
    const insights = parseInsightsFromAI(aiResponse.content || aiResponse, category);
    
    return insights;

  } catch (error) {
    console.error('Error in generateInsightsForResponse:', error);
    return getFallbackInsights(category, response);
  }
}

function formatResponseForAI(response: any): string {
  if (Array.isArray(response)) {
    return response.join(', ');
  }
  if (typeof response === 'object' && response !== null) {
    return JSON.stringify(response);
  }
  return String(response);
}

function createAnalysisContext(
  question: string,
  response: string,
  category: string,
  userInfo?: any
): string {
  let context = `Question: ${question}\nCategory: ${category}\nResponse: ${response}`;
  
  if (userInfo) {
    context += `\nUser Context:`;
    if (userInfo.industry) context += `\n- Industry: ${userInfo.industry}`;
    if (userInfo.companySize) context += `\n- Company Size: ${userInfo.companySize}`;
    if (userInfo.role) context += `\n- Role: ${userInfo.role}`;
    if (userInfo.revenueRange) context += `\n- Revenue Range: ${userInfo.revenueRange}`;
  }
  
  return context;
}

function parseInsightsFromAI(aiResponse: any, category: string): string[] {
  try {
    // Ensure we have a string to work with
    let responseText = '';
    if (typeof aiResponse === 'string') {
      responseText = aiResponse;
    } else if (aiResponse && typeof aiResponse === 'object') {
      // If it's an AI response object, extract the content
      responseText = aiResponse.content || aiResponse.text || JSON.stringify(aiResponse);
    } else {
      responseText = String(aiResponse || '');
    }

    // If we don't have any meaningful content, return fallback
    if (!responseText || responseText.trim().length === 0) {
      return getFallbackInsights(category, '');
    }

    // Try to extract insights from the AI response
    const insights: string[] = [];
    
    // Split by common delimiters and clean up
    const lines = responseText.split(/[•\-\*\n]/).map(line => line.trim()).filter(line => line.length > 0);
    
    for (const line of lines) {
      if (line.length > 20 && line.length < 200) { // Reasonable insight length
        insights.push(line);
      }
    }
    
    // If we didn't get good insights, try to extract key points
    if (insights.length === 0) {
      const sentences = responseText.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 20);
      insights.push(...sentences.slice(0, 3));
    }
    
    return insights.slice(0, 5); // Limit to 5 insights
    
  } catch (error) {
    console.error('Error parsing insights from AI:', error);
    return getFallbackInsights(category, '');
  }
}

function getFallbackInsights(category: string, response: any): string[] {
  const fallbackInsights: { [key: string]: string[] } = {
    strategy: [
      "Consider developing a more structured approach to growth planning",
      "Focus on identifying and addressing your core growth bottlenecks",
      "Evaluate your current strategy against industry best practices"
    ],
    operations: [
      "Implement systematic tracking of key performance indicators",
      "Consider automating routine processes to improve efficiency",
      "Focus on data-driven decision making for better outcomes"
    ],
    team: [
      "Assess your current team structure against growth requirements",
      "Consider hiring for specific growth roles and capabilities",
      "Focus on building scalable processes and systems"
    ],
    technology: [
      "Evaluate your current tech stack for scalability and efficiency",
      "Consider investing in tools that support your growth goals",
      "Focus on integration and automation to reduce manual work"
    ],
    market: [
      "Analyze your competitive positioning and market opportunities",
      "Consider diversifying your customer acquisition channels",
      "Focus on understanding and serving your target market better"
    ]
  };
  
  return fallbackInsights[category] || [
    "This is an important area to focus on for growth",
    "Consider seeking expert advice in this domain",
    "Regular review and optimization will be key"
  ];
}
