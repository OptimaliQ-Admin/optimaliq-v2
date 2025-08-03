import { createClient } from '@supabase/supabase-js';
import { BusinessContext } from './ConversationManager';

export interface SectionResponse {
  content: string;
  confidence: number;
  sectionId: string;
  timestamp: string;
}

export interface QuestionSection {
  id: string;
  name: string;
  description: string;
  questions: string[];
  order: number;
  aiPrompt: string;
}

export class SectionResponseGenerator {
  private supabase: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async generateSectionResponse(
    section: QuestionSection,
    responses: Record<string, any>,
    context: BusinessContext
  ): Promise<SectionResponse> {
    try {
      // Build the GPT prompt
      const prompt = this.buildSectionPrompt(section, responses, context);
      
      // Call GPT via API
      const gptResponse = await this.callGPT(prompt);
      
      return {
        content: gptResponse,
        confidence: 0.9,
        sectionId: section.id,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating section response:', error);
      // Fallback response
      return {
        content: "Thanks for sharing that. Let's continue with the next section to get a complete picture of your business.",
        confidence: 0.5,
        sectionId: section.id,
        timestamp: new Date().toISOString()
      };
    }
  }

  private buildSectionPrompt(
    section: QuestionSection,
    responses: Record<string, any>,
    context: BusinessContext
  ): string {
    const { industry, companySize, revenueRange } = context;
    
    // Get section-specific responses
    const sectionResponses = section.questions
      .map(qId => responses[qId])
      .filter(Boolean);

    // Build response summary
    const responseSummary = section.questions
      .map((qId, index) => {
        const response = responses[qId];
        if (!response) return null;
        
        const questionLabels = {
          'welcome': 'Biggest challenge',
          'growth_metrics': 'Key metrics',
          'friction_points': 'Main challenges',
          'gtm_strategy': 'Go-to-market strategy',
          'differentiator': 'Competitive advantage',
          'business_priorities': 'Strategic priorities',
          'tech_stack_overview': 'Technology stack',
          'process_discipline': 'Process maturity',
          'acquisition_channels': 'Customer acquisition',
          'benchmark_preferences': 'Benchmark interests',
          'funding_status': 'Funding situation',
          'growth_pace': 'Growth ambitions'
        };

        const label = questionLabels[qId as keyof typeof questionLabels] || qId;
        return `- ${label}: ${Array.isArray(response) ? response.join(', ') : response}`;
      })
      .filter(Boolean)
      .join('\n');

    return `You are a seasoned business strategist helping a ${companySize || 'mid-sized'} company in the ${industry || 'business'} space grow efficiently.

The user just completed a section on "${section.name}" and shared:

${responseSummary}

Write a brief, conversational response that:
- Acknowledges their context and challenges
- References what you've seen in similar companies at their stage
- Shows that you're taking note of key issues for the final strategy
- Encourages them as you move to the next topic

Tone: Strategic, warm, confident — like an advisor who's been through this before.
Length: 2–3 sentences max.
Keep it natural and conversational, not formal or report-like.`;
  }

  private async callGPT(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/section-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('GPT API call failed');
      }

      const data = await response.json();
      return data.response || data.content || data.text;
    } catch (error) {
      console.error('Error calling GPT:', error);
      throw error;
    }
  }
} 