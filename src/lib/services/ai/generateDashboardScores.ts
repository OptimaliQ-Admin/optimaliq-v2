import { callOpenAI } from '@/lib/ai/callOpenAI';

export interface DashboardScoresRequest {
  sessionId: string;
  userResponses: Record<string, any>;
  userProfile: {
    industry: string;
    companySize: string;
    revenueRange: string;
  };
}

export interface AssessmentScores {
  overall_score: number;
  strategy_score: number;
  process_score: number;
  technology_score: number;
  bracket: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  industry_benchmark: number;
  top_performer_benchmark: number;
  recommendations: string[];
  confidence_score: number;
}

export interface DashboardInsights {
  key_insights: string[];
  growth_opportunities: string[];
  risk_factors: string[];
  competitive_position: string;
  market_trends: string[];
}

export interface RoadmapTask {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimated_effort: string;
  expected_impact: string;
  due_date: Date;
  dependencies: string[];
}

export async function generateDashboardScores(
  request: DashboardScoresRequest
): Promise<{
  scores: AssessmentScores;
  insights: DashboardInsights;
  roadmap: RoadmapTask[];
}> {
  const { userResponses, userProfile } = request;

  // Format responses for analysis
  const responseSummary = Object.entries(userResponses)
    .map(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(', ') : value;
      return `- ${key}: ${formattedValue}`;
    })
    .join('\n');

  const prompt = `You are a senior growth consultant analyzing a business assessment.

Business Profile:
- Industry: ${userProfile.industry}
- Company Size: ${userProfile.companySize}
- Revenue Range: ${userProfile.revenueRange}

Assessment Responses:
${responseSummary}

Please provide a comprehensive analysis in JSON format with the following structure:

{
  "scores": {
    "overall_score": 3.2,
    "strategy_score": 3.5,
    "process_score": 2.8,
    "technology_score": 3.1,
    "bracket": "intermediate",
    "industry_benchmark": 2.9,
    "top_performer_benchmark": 4.2,
    "recommendations": ["Improve customer retention processes", "Implement data-driven decision making"],
    "confidence_score": 0.85
  },
  "insights": {
    "key_insights": ["Strong product-market fit", "Operational processes need optimization"],
    "growth_opportunities": ["Market expansion potential", "Process automation"],
    "risk_factors": ["Customer churn risk", "Scaling challenges"],
    "competitive_position": "Strong in niche, vulnerable to larger players",
    "market_trends": ["Industry consolidation", "Digital transformation acceleration"]
  },
  "roadmap": [
    {
      "title": "Implement Customer Success Program",
      "description": "Develop systematic approach to customer onboarding and retention",
      "priority": "high",
      "estimated_effort": "2-3 months",
      "expected_impact": "Reduce churn by 20%",
      "due_date": "2024-03-15",
      "dependencies": []
    }
  ]
}

Scoring Guidelines:
- 1-2: Beginner (basic processes, limited strategy)
- 2-3: Intermediate (some structure, room for improvement)
- 3-4: Advanced (well-developed, strategic approach)
- 4-5: Expert (best-in-class, innovative practices)

Focus on actionable insights and specific, measurable recommendations.`;

  try {
    const response = await callOpenAI(prompt, {
      model: 'gpt-4o-mini',
      maxTokens: 1500,
      temperature: 0.3
    });

    const analysis = response.parsed;

    // Validate and structure the response
    const scores: AssessmentScores = {
      overall_score: analysis.scores?.overall_score || 3.0,
      strategy_score: analysis.scores?.strategy_score || 3.0,
      process_score: analysis.scores?.process_score || 3.0,
      technology_score: analysis.scores?.technology_score || 3.0,
      bracket: analysis.scores?.bracket || 'intermediate',
      industry_benchmark: analysis.scores?.industry_benchmark || 3.0,
      top_performer_benchmark: analysis.scores?.top_performer_benchmark || 4.0,
      recommendations: analysis.scores?.recommendations || [],
      confidence_score: analysis.scores?.confidence_score || 0.8
    };

    const insights: DashboardInsights = {
      key_insights: analysis.insights?.key_insights || [],
      growth_opportunities: analysis.insights?.growth_opportunities || [],
      risk_factors: analysis.insights?.risk_factors || [],
      competitive_position: analysis.insights?.competitive_position || 'Analyzing...',
      market_trends: analysis.insights?.market_trends || []
    };

    const roadmap: RoadmapTask[] = (analysis.roadmap || []).map((task: any) => ({
      title: task.title || 'Task',
      description: task.description || '',
      priority: task.priority || 'medium',
      estimated_effort: task.estimated_effort || '1 month',
      expected_impact: task.expected_impact || 'Improve performance',
      due_date: new Date(task.due_date || Date.now() + 30 * 24 * 60 * 60 * 1000),
      dependencies: task.dependencies || []
    }));

    return { scores, insights, roadmap };

  } catch (error) {
    console.error('Error generating dashboard scores:', error);
    
    // Fallback response
    return {
      scores: {
        overall_score: 3.0,
        strategy_score: 3.0,
        process_score: 3.0,
        technology_score: 3.0,
        bracket: 'intermediate',
        industry_benchmark: 3.0,
        top_performer_benchmark: 4.0,
        recommendations: ['Complete detailed assessment for personalized recommendations'],
        confidence_score: 0.5
      },
      insights: {
        key_insights: ['Assessment completed successfully'],
        growth_opportunities: ['Further analysis required'],
        risk_factors: ['Limited data available'],
        competitive_position: 'Analysis in progress',
        market_trends: ['Industry analysis pending']
      },
      roadmap: [
        {
          title: 'Complete Assessment Review',
          description: 'Review detailed assessment results and develop action plan',
          priority: 'high',
          estimated_effort: '1 week',
          expected_impact: 'Clear strategic direction',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          dependencies: []
        }
      ]
    };
  }
} 