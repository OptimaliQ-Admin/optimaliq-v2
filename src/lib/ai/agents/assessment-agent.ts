import { z } from 'zod';
import { BaseAgent, AgentRequest, AgentResponse, AgentTool } from './base-agent';
import { AITask } from '@/lib/ai-router';
import { AppError } from '@/utils';

// Assessment Agent Response Schema
const AssessmentResponseSchema = z.object({
  overallScore: z.number().min(0).max(10),
  strategyScore: z.number().min(0).max(10),
  processScore: z.number().min(0).max(10),
  technologyScore: z.number().min(0).max(10),
  breakdown: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
    categoryScores: z.record(z.number())
  }),
  roadmap: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    priority: z.number(),
    effort: z.number(),
    timeline: z.number(),
    dependencies: z.array(z.string()),
    isCompleted: z.boolean().default(false)
  })),
  benchmarks: z.array(z.object({
    category: z.string(),
    userScore: z.number(),
    industryAverage: z.number(),
    topPerformers: z.number(),
    percentile: z.number()
  }))
});

type AssessmentResponse = z.infer<typeof AssessmentResponseSchema>;

export interface AssessmentRequest extends AgentRequest {
  assessmentData: Record<string, any>;
  assessmentType: string;
  industry?: string;
}

export class AssessmentAgent extends BaseAgent {
  constructor() {
    super('AssessmentAgent', 'Analyzes assessment data and generates insights, scores, and roadmaps');
    this.registerTools();
  }

  private registerTools(): void {
    // Database query tool
    const dbQueryTool: AgentTool = {
      name: 'queryDatabase',
      description: 'Query database for assessment templates, benchmarks, and historical data',
      parameters: z.object({
        table: z.string(),
        filters: z.record(z.any()),
        select: z.string().optional()
      }),
      execute: async (_params) => {
        // Implementation would query Supabase based on parameters
        return { data: [], count: 0 };
      }
    };

    const benchmarkTool: AgentTool = {
      name: 'getBenchmarks',
      description: 'Retrieve industry benchmarks for comparison',
      parameters: z.object({
        industry: z.string(),
        categories: z.array(z.string())
      }),
      execute: async (_params) => {
        // Query benchmark_data table
        return {
          benchmarks: [
            { category: 'strategy', industryAverage: 7.2, topPerformers: 9.1 },
            { category: 'process', industryAverage: 6.8, topPerformers: 8.9 },
            { category: 'technology', industryAverage: 8.1, topPerformers: 9.5 }
          ]
        };
      }
    };

    const scoringTool: AgentTool = {
      name: 'calculateScores',
      description: 'Calculate assessment scores using configurable rules',
      parameters: z.object({
        assessmentType: z.string(),
        responses: z.record(z.any())
      }),
      execute: async (params) => {
        return this.calculateDeterministicScores(params.responses, params.assessmentType);
      }
    };

    this.registerTool(dbQueryTool);
    this.registerTool(benchmarkTool);
    this.registerTool(scoringTool);
  }

  async plan(request: AssessmentRequest): Promise<string[]> {
    const plan = [
      'Validate assessment data and type',
      'Retrieve scoring rules and benchmarks',
      'Calculate deterministic scores',
      'Generate AI insights and recommendations',
      'Create roadmap items',
      'Format final response with benchmarks'
    ];

    this.setMemory('currentPlan', plan);
    this.setMemory('assessmentType', request.assessmentType);
    this.setMemory('industry', request.industry);

    return plan;
  }

  async execute(_plan: string[], request: AssessmentRequest): Promise<any> {
    const results: any = {};

    try {
      // Step 1: Validate assessment data
      if (!request.assessmentData || Object.keys(request.assessmentData).length === 0) {
        throw new AppError('Assessment data is required', 'INVALID_ASSESSMENT_DATA', 400);
      }

      // Step 2: Calculate deterministic scores
      const scores = await this.executeTool('calculateScores', {
        assessmentType: request.assessmentType,
        responses: request.assessmentData
      });

      results.scores = scores;

      // Step 3: Get industry benchmarks
      const benchmarkData = await this.executeTool('getBenchmarks', {
        industry: request.industry || 'Technology',
        categories: ['strategy', 'process', 'technology']
      });

      results.benchmarks = this.formatBenchmarks(scores, benchmarkData.benchmarks);

      // Step 4: Generate AI insights and roadmap
      const insightsPrompt = this.buildInsightsPrompt(scores, request.assessmentData, request.industry);
      const aiInsights = await this.generateContent(insightsPrompt, AITask.ANALYSIS);

      // Step 5: Parse and validate AI response
      const parsedInsights = await this.validateAndRepairJSON(aiInsights, z.object({
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        recommendations: z.array(z.string()),
        roadmap: z.array(z.object({
          title: z.string(),
          description: z.string(),
          category: z.string(),
          priority: z.number(),
          effort: z.number(),
          timeline: z.number()
        }))
      }));

      results.insights = parsedInsights;

      return results;

    } catch (error) {
      throw new AppError(
        `Assessment agent execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ASSESSMENT_AGENT_ERROR',
        500
      );
    }
  }

  async validate(result: any): Promise<AgentResponse<AssessmentResponse>> {
    try {
      const formattedResponse: AssessmentResponse = {
        overallScore: result.scores.overall,
        strategyScore: result.scores.strategy,
        processScore: result.scores.process,
        technologyScore: result.scores.technology,
        breakdown: {
          strengths: result.insights.strengths,
          weaknesses: result.insights.weaknesses,
          recommendations: result.insights.recommendations,
          categoryScores: {
            strategy: result.scores.strategy,
            process: result.scores.process,
            technology: result.scores.technology
          }
        },
        roadmap: result.insights.roadmap.map((item: any, index: number) => ({
          id: `roadmap_${index + 1}`,
          title: item.title,
          description: item.description,
          category: item.category,
          priority: item.priority,
          effort: item.effort,
          timeline: item.timeline,
          dependencies: [],
          isCompleted: false
        })),
        benchmarks: result.benchmarks
      };

      // Validate against schema
      const validatedResponse = AssessmentResponseSchema.parse(formattedResponse);

      return {
        success: true,
        data: validatedResponse,
        citations: []
      };

    } catch (error) {
      return {
        success: false,
        data: {} as AssessmentResponse,
        errors: [error instanceof Error ? error.message : 'Validation failed']
      };
    }
  }

  // Calculate deterministic scores based on assessment responses
  private calculateDeterministicScores(responses: Record<string, any>, _assessmentType: string): any {
    const scores = {
      strategy: 0,
      process: 0,
      technology: 0,
      overall: 0
    };

    // Basic scoring logic - this would be enhanced with actual scoring rules
    const responseValues = Object.values(responses).filter(val => typeof val === 'number');
    
    if (responseValues.length > 0) {
      const average = responseValues.reduce((sum, val) => sum + val, 0) / responseValues.length;
      
      // Distribute scores across categories (this would be configurable)
      scores.strategy = Math.min(10, Math.max(0, average * 1.1));
      scores.process = Math.min(10, Math.max(0, average * 0.9));
      scores.technology = Math.min(10, Math.max(0, average * 1.0));
      scores.overall = (scores.strategy + scores.process + scores.technology) / 3;
    }

    return scores;
  }

  // Dynamic question branching logic
  private determineNextQuestion(currentResponses: Record<string, any>, questionBank: any[]): any | null {
    // Analyze current responses to determine the next most relevant question
    const responsePatterns = this.analyzeResponsePatterns(currentResponses);
    
    // Find questions that haven't been answered yet
    const unansweredQuestions = questionBank.filter(q => !currentResponses[q.id]);
    
    if (unansweredQuestions.length === 0) {
      return null; // All questions answered
    }

    // Score each unanswered question based on relevance to current responses
    const scoredQuestions = unansweredQuestions.map(question => {
      let relevanceScore = 0;
      
      // Score based on category relevance
      if (responsePatterns.weakCategories.includes(question.category)) {
        relevanceScore += 3; // Prioritize weak areas
      }
      
      // Score based on question dependencies
      if (this.checkQuestionDependencies(question, currentResponses)) {
        relevanceScore += 2;
      }
      
      // Score based on assessment progress
      const progressRatio = Object.keys(currentResponses).length / questionBank.length;
      if (progressRatio < 0.3 && question.priority === 'high') {
        relevanceScore += 2; // Prioritize high-priority questions early
      }
      
      return { question, relevanceScore };
    });

    // Return the question with the highest relevance score
    scoredQuestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return scoredQuestions[0]?.question || null;
  }

  // Analyze response patterns to identify strengths and weaknesses
  private analyzeResponsePatterns(responses: Record<string, any>): any {
    const categoryScores: Record<string, number[]> = {};
    
    // Group responses by category
    Object.entries(responses).forEach(([questionId, response]) => {
      // This would need to be enhanced with actual question metadata
      const category = this.getQuestionCategory(questionId);
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      categoryScores[category].push(Number(response) || 0);
    });

    // Calculate average scores per category
    const categoryAverages = Object.entries(categoryScores).map(([category, scores]) => ({
      category,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }));

    // Identify strong and weak categories
    const sortedCategories = categoryAverages.sort((a, b) => b.average - a.average);
    const strongCategories = sortedCategories.slice(0, Math.ceil(sortedCategories.length / 2)).map(c => c.category);
    const weakCategories = sortedCategories.slice(Math.ceil(sortedCategories.length / 2)).map(c => c.category);

    return {
      strongCategories,
      weakCategories,
      categoryAverages
    };
  }

  // Check if a question's dependencies are satisfied
  private checkQuestionDependencies(question: any, currentResponses: Record<string, any>): boolean {
    if (!question.dependencies || question.dependencies.length === 0) {
      return true; // No dependencies
    }

    return question.dependencies.every((dep: any) => {
      const response = currentResponses[dep.questionId];
      if (dep.condition === 'answered') {
        return response !== undefined;
      }
      if (dep.condition === 'value') {
        return response === dep.value;
      }
      if (dep.condition === 'range') {
        return response >= dep.min && response <= dep.max;
      }
      return false;
    });
  }

  // Get question category (placeholder implementation)
  private getQuestionCategory(questionId: string): string {
    // This would be enhanced with actual question metadata
    const categoryMap: Record<string, string> = {
      'strategy_1': 'strategy',
      'strategy_2': 'strategy',
      'process_1': 'process',
      'process_2': 'process',
      'technology_1': 'technology',
      'technology_2': 'technology'
    };
    return categoryMap[questionId] || 'general';
  }

  // Format benchmarks with user scores
  private formatBenchmarks(userScores: any, industryBenchmarks: any[]): any[] {
    return industryBenchmarks.map(benchmark => ({
      category: benchmark.category,
      userScore: userScores[benchmark.category] || 0,
      industryAverage: benchmark.industryAverage,
      topPerformers: benchmark.topPerformers,
      percentile: this.calculatePercentile(
        userScores[benchmark.category] || 0,
        benchmark.industryAverage,
        benchmark.topPerformers
      )
    }));
  }

  // Calculate percentile ranking
  private calculatePercentile(userScore: number, average: number, topPerformers: number): number {
    if (userScore >= topPerformers) return 95;
    if (userScore >= average) {
      return 50 + ((userScore - average) / (topPerformers - average)) * 45;
    }
    return (userScore / average) * 50;
  }

  // Build insights generation prompt
  private buildInsightsPrompt(scores: any, assessmentData: any, industry?: string): string {
    return `
      You are an expert business consultant analyzing an assessment for a ${industry || 'technology'} company.
      
      Assessment Scores:
      - Strategy: ${scores.strategy}/10
      - Process: ${scores.process}/10
      - Technology: ${scores.technology}/10
      - Overall: ${scores.overall}/10
      
      Assessment Data: ${JSON.stringify(assessmentData, null, 2)}
      
      Based on this assessment, provide a comprehensive analysis in the following JSON format:
      {
        "strengths": ["List 3-5 key strengths based on high-scoring areas"],
        "weaknesses": ["List 3-5 key weaknesses based on low-scoring areas"],
        "recommendations": ["List 5-7 specific, actionable recommendations"],
        "roadmap": [
          {
            "title": "Specific improvement initiative",
            "description": "Detailed description of the initiative",
            "category": "strategy|process|technology",
            "priority": 1-10,
            "effort": 1-10,
            "timeline": 1-12
          }
        ],
        "personalizedInsights": [
          {
            "insight": "Specific insight tailored to this company's situation",
            "category": "strategy|process|technology|growth|risk",
            "confidence": 0.0-1.0,
            "actionable": true,
            "priority": "high|medium|low"
          }
        ]
      }
            "effort": 1-10,
            "timeline": 1-12 (months)
          }
        ]
      }
      
      Focus on actionable, specific recommendations that address the identified gaps.
      Ensure all roadmap items are realistic and achievable within the specified timeline.
    `;
  }
}

// Export singleton instance
export const assessmentAgent = new AssessmentAgent();
