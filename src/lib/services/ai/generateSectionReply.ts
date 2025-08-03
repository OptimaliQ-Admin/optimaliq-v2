import { callOpenAI } from '@/lib/ai/callOpenAI';

interface SectionReplyRequest {
  sectionId: string;
  sectionName: string;
  responses: Record<string, any>;
  userProfile: any;
  transitionHook: string;
}

export async function generateSectionReply(request: SectionReplyRequest): Promise<string> {
  const { sectionId, sectionName, responses, userProfile, transitionHook } = request;

  // Build context from user profile
  const userContext = {
    industry: userProfile?.industry || 'business',
    companySize: userProfile?.company_size || 'mid-sized',
    revenueRange: userProfile?.revenue_range || 'not specified'
  };

  // Format responses for the prompt
  const responseSummary = Object.entries(responses)
    .map(([questionId, answer]) => {
      const answerText = Array.isArray(answer) ? answer.join(', ') : String(answer);
      return `- ${questionId}: ${answerText}`;
    })
    .join('\n');

  const prompt = `You are a senior growth consultant onboarding a new business leader. Their profile:
- Industry: ${userContext.industry}
- Company Size: ${userContext.companySize}
- Revenue Range: ${userContext.revenueRange}

They just completed the section called: "${sectionName}".

Here's a summary of their answers:
${responseSummary}

Write a short 2-3 sentence message that:
- Acknowledges their situation with nuance
- Reflects patterns you've seen in similar companies
- Feels personal and confident, not robotic
- Transitions naturally to the next section using this transition hook: "${transitionHook}"

Do NOT summarize all the answers. Tone: Strategic, warm, consultative — like a McKinsey advisor who's been through this 100 times.`;

  try {
    const response = await callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 150
    });

    return response.parsed?.message || response.raw || 'Thank you for sharing that. Let\'s continue with the next section.';
  } catch (error) {
    console.error('Error generating section reply:', error);
    return 'I appreciate your responses. Let\'s continue with the next section.';
  }
} 