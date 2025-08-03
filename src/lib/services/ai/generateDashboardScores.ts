import { callOpenAI } from '@/lib/ai/callOpenAI';

interface DashboardScoresRequest {
  sessionId: string;
  allResponses: Record<string, any>;
  userProfile: any;
}

interface DashboardScores {
  strategy_score: number;
  process_score: number;
  technology_score: number;
  overall_score: number;
  benchmark_position: number;
  roadmap: string[];
}

export async function generateDashboardScores(request: DashboardScoresRequest): Promise<DashboardScores> {
  const { sessionId, allResponses, userProfile } = request;

  // Build context from user profile
  const userContext = {
    industry: userProfile?.industry || 'business',
    companySize: userProfile?.company_size || 'mid-sized',
    revenueRange: userProfile?.revenue_range || 'not specified'
  };

  // Format all responses for analysis
  const responseSummary = Object.entries(allResponses)
    .map(([questionId, answer]) => {
      const answerText = Array.isArray(answer) ? answer.join(', ') : String(answer);
      return `- ${questionId}: ${answerText}`;
    })
    .join('\n');

  const prompt = `You are a senior business strategist analyzing a company's growth maturity. 

Company Profile:
- Industry: ${userContext.industry}
- Company Size: ${userContext.companySize}
- Revenue Range: ${userContext.revenueRange}

Assessment Responses:
${responseSummary}

Based on these responses, provide a comprehensive analysis in JSON format with the following structure:

{
  "strategy_score": <number 1-5>,
  "process_score": <number 1-5>,
  "technology_score": <number 1-5>,
  "overall_score": <number 1-5>,
  "benchmark_position": <number representing percentage above industry average>,
  "roadmap": ["action item 1", "action item 2", "action item 3", "action item 4", "action item 5"]
}

Scoring Guidelines:
- Strategy Score: Based on goal clarity, positioning, competitive advantage
- Process Score: Based on operational maturity, team size, process efficiency
- Technology Score: Based on tech stack maturity, tool usage, automation
- Overall Score: Weighted average of the three scores
- Benchmark Position: Percentage above industry average (e.g., 25 means 25% above average)
- Roadmap: 5 specific, actionable items for the next 30 days

Be strategic and realistic in your assessment.`;

  try {
    const response = await callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 500
    });

    const result = response.parsed || JSON.parse(response.raw || '{}');

    return {
      strategy_score: result.strategy_score || 3,
      process_score: result.process_score || 3,
      technology_score: result.technology_score || 3,
      overall_score: result.overall_score || 3,
      benchmark_position: result.benchmark_position || 0,
      roadmap: result.roadmap || [
        'Review and optimize current processes',
        'Implement key performance indicators',
        'Evaluate technology stack efficiency',
        'Develop strategic growth plan',
        'Build team capabilities'
      ]
    };
  } catch (error) {
    console.error('Error generating dashboard scores:', error);
    
    // Return default scores if AI fails
    return {
      strategy_score: 3,
      process_score: 3,
      technology_score: 3,
      overall_score: 3,
      benchmark_position: 0,
      roadmap: [
        'Review and optimize current processes',
        'Implement key performance indicators',
        'Evaluate technology stack efficiency',
        'Develop strategic growth plan',
        'Build team capabilities'
      ]
    };
  }
} 