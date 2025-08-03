import { callOpenAI } from '@/lib/ai/callOpenAI';

export interface SectionReplyRequest {
  sessionId: string;
  sectionName: string;
  userProfile: {
    industry: string;
    companySize: string;
    revenueRange: string;
  };
  sectionResponses: Record<string, any>;
  nextSectionName?: string;
  transitionHook?: string;
}

export interface SectionReplyResponse {
  message: string;
  confidence: number;
  insights: string[];
  nextSectionHint: string;
}

export async function generateSectionReply(
  request: SectionReplyRequest
): Promise<SectionReplyResponse> {
  const { sectionName, userProfile, sectionResponses, nextSectionName, transitionHook } = request;

  // Format the responses for the prompt
  const responseSummary = Object.entries(sectionResponses)
    .map(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(', ') : value;
      return `- ${key}: ${formattedValue}`;
    })
    .join('\n');

  const prompt = `You are a senior growth consultant onboarding a new business leader.

Their profile:
- Industry: ${userProfile.industry}
- Company Size: ${userProfile.companySize}
- Revenue Range: ${userProfile.revenueRange}

They just completed the section called: "${sectionName}".

Here's a summary of their answers:
${responseSummary}

Write a short 2-3 sentence message that:
- Acknowledges their situation with nuance
- Reflects patterns you've seen in similar companies
- Feels personal and confident, not robotic
- Transitions naturally to the next section (don't label it)

${transitionHook ? `Note: The next section will be introduced with: "${transitionHook}" - make sure your response flows naturally into this transition.` : ''}

Do NOT summarize all the answers.
Tone: Strategic, warm, consultative — like a McKinsey advisor who's been through this 100 times.

Focus on the strategic implications and what this tells you about their business maturity and challenges.`;

  try {
    const systemPrompt = 'You are a senior growth consultant with 15+ years of experience working with hundreds of companies across all stages and industries. You have deep expertise in business strategy, growth, and operational excellence. Your communication style is warm, confident, and strategic - like a trusted advisor who has seen it all before.';

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    
    const response = await callOpenAI(fullPrompt, {
      model: 'gpt-4o-mini',
      maxTokens: 200,
      temperature: 0.7
    });

    const message = response.parsed.message || response.parsed.response || response.raw;
    
    if (!message) {
      throw new Error('No response generated from AI');
    }

    // Extract insights and next section hint
    const insights = extractInsights(sectionResponses, userProfile);
    const nextSectionHint = generateNextSectionHint(sectionName, nextSectionName);

    return {
      message,
      confidence: 0.85, // High confidence for structured responses
      insights,
      nextSectionHint
    };

  } catch (error) {
    console.error('Error generating section reply:', error);
    
    // Fallback response
    return {
      message: `Thank you for sharing that information about your ${sectionName.toLowerCase()}. I can see some interesting patterns here that we'll explore further. Let's continue with the next part of our assessment.`,
      confidence: 0.5,
      insights: [],
      nextSectionHint: ''
    };
  }
}

function extractInsights(responses: Record<string, any>, userProfile: any): string[] {
  const insights: string[] = [];

  // Extract insights based on response patterns
  if (responses.industry) {
    insights.push(`Industry: ${responses.industry}`);
  }
  
  if (responses.company_size) {
    insights.push(`Company Size: ${responses.company_size}`);
  }

  if (responses.revenue_range) {
    insights.push(`Revenue Range: ${responses.revenue_range}`);
  }

  // Add strategic insights based on combinations
  if (responses.industry && responses.company_size) {
    if (responses.company_size === '1-10' && responses.revenue_range?.includes('$1M')) {
      insights.push('High-revenue early-stage company - strong product-market fit');
    }
  }

  return insights;
}

function generateNextSectionHint(currentSection: string, nextSection?: string): string {
  const sectionHints: Record<string, string> = {
    'Business Overview': 'growth strategy and challenges',
    'Growth Strategy': 'market position and competitive landscape',
    'Market Position': 'operational excellence and processes',
    'Operational Excellence': 'financial health and metrics',
    'Financial Health': 'future vision and strategic priorities',
    'Future Vision': 'comprehensive assessment and recommendations'
  };

  return sectionHints[currentSection] || 'next section';
} 