/**
 * Adaptive Questioning System for Assessment Engine
 * Dynamic question generation based on user responses and context
 */

import { z } from 'zod';

// Question Generation Schema
const QuestionGenerationSchema = z.object({
  assessmentType: z.string(),
  currentResponses: z.record(z.any()),
  userProfile: z.record(z.any()),
  questionHistory: z.array(z.string()),
  difficulty: z.number().finite().min(1).max(5),
  category: z.string(),
  context: z.record(z.any())
});

export type QuestionGenerationRequest = z.infer<typeof QuestionGenerationSchema>;

// Generated Question Schema
const GeneratedQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(['multiple_choice', 'scale', 'text', 'boolean', 'ranking']),
  options: z.array(z.string()).optional(),
  category: z.string(),
  difficulty: z.number().finite().min(1).max(5),
  confidence: z.number().finite().min(0).max(1),
  reasoning: z.string(),
  followUpQuestions: z.array(z.string()).optional(),
  skipConditions: z.array(z.any()).optional()
});

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;

export class AdaptiveQuestioningSystem {
  private questionTemplates: Map<string, any>;
  private difficultyAdjustments: Map<string, any>;
  private categoryWeights: Map<string, number>;

  constructor() {
    this.questionTemplates = new Map();
    this.difficultyAdjustments = new Map();
    this.categoryWeights = new Map();
    this.initializeTemplates();
  }

  /**
   * Generate adaptive question based on user responses
   */
  async generateAdaptiveQuestion(request: QuestionGenerationRequest): Promise<GeneratedQuestion> {
    try {
      const validatedRequest = QuestionGenerationSchema.parse(request);
      
      // Analyze current responses and user profile
      const analysis = this.analyzeUserResponses(validatedRequest);
      
      // Determine optimal question category and difficulty
      const questionStrategy = this.determineQuestionStrategy(analysis, validatedRequest);
      
      // Generate question based on strategy
      const question = this.generateQuestionFromStrategy(questionStrategy, validatedRequest);
      
      // Apply adaptive modifications
      const adaptedQuestion = this.applyAdaptiveModifications(question, analysis);
      
      // Calculate confidence and reasoning
      const finalQuestion = this.calculateConfidenceAndReasoning(adaptedQuestion, analysis);
      
      return GeneratedQuestionSchema.parse(finalQuestion);
    } catch (error) {
      console.error('Error generating adaptive question:', error);
      return this.getFallbackQuestion(request);
    }
  }

  /**
   * Analyze user responses for insights
   */
  private analyzeUserResponses(request: QuestionGenerationRequest): any {
    const analysis = {
      responsePatterns: this.analyzeResponsePatterns(request.currentResponses),
      knowledgeGaps: this.identifyKnowledgeGaps(request.currentResponses, request.assessmentType),
      difficultyProgression: this.analyzeDifficultyProgression(request.questionHistory),
      categoryPerformance: this.analyzeCategoryPerformance(request.currentResponses),
      userEngagement: this.calculateUserEngagement(request.currentResponses),
      confidenceTrends: this.analyzeConfidenceTrends(request.currentResponses)
    };

    return analysis;
  }

  /**
   * Determine optimal question strategy
   */
  private determineQuestionStrategy(analysis: any, request: QuestionGenerationRequest): any {
    const strategy = {
      category: this.selectOptimalCategory(analysis, request),
      difficulty: this.calculateOptimalDifficulty(analysis, request),
      type: this.selectQuestionType(analysis, request),
      focus: this.determineQuestionFocus(analysis, request),
      approach: this.selectQuestionApproach(analysis, request)
    };

    return strategy;
  }

  /**
   * Select optimal question category
   */
  private selectOptimalCategory(analysis: any, request: QuestionGenerationRequest): string {
    const categoryPerformance = analysis.categoryPerformance;
    const knowledgeGaps = analysis.knowledgeGaps;
    
    // Prioritize categories with knowledge gaps
    if (knowledgeGaps.length > 0) {
      const gapCategory = knowledgeGaps[0].category;
      if (categoryPerformance[gapCategory] && categoryPerformance[gapCategory].score < 6) {
        return gapCategory;
      }
    }
    
    // Select category with lowest performance
    const categories = Object.keys(categoryPerformance);
    if (categories.length > 0) {
      const lowestPerforming = categories.reduce((lowest, category) => {
        return categoryPerformance[category].score < categoryPerformance[lowest].score ? category : lowest;
      });
      
      return lowestPerforming;
    }
    
    return request.category || 'strategy';
  }

  /**
   * Calculate optimal difficulty level
   */
  private calculateOptimalDifficulty(analysis: any, request: QuestionGenerationRequest): number {
    const currentDifficulty = request.difficulty;
    const performance = analysis.categoryPerformance[request.category];
    
    if (!performance) {
      return Math.min(5, currentDifficulty + 1);
    }
    
    const averageScore = performance.score;
    
    // Adjust difficulty based on performance
    if (averageScore >= 8) {
      return Math.min(5, currentDifficulty + 1); // Increase difficulty
    } else if (averageScore <= 4) {
      return Math.max(1, currentDifficulty - 1); // Decrease difficulty
    }
    
    return currentDifficulty; // Maintain current difficulty
  }

  /**
   * Select appropriate question type
   */
  private selectQuestionType(analysis: any, request: QuestionGenerationRequest): string {
    const userEngagement = analysis.userEngagement;
    const responsePatterns = analysis.responsePatterns;
    
    // Use multiple choice for low engagement
    if (userEngagement < 0.5) {
      return 'multiple_choice';
    }
    
    // Use scale questions for detailed assessment
    if (request.assessmentType === 'comprehensive') {
      return 'scale';
    }
    
    // Use text questions for high engagement and complex topics
    if (userEngagement > 0.8 && request.category === 'strategy') {
      return 'text';
    }
    
    // Default to multiple choice
    return 'multiple_choice';
  }

  /**
   * Generate question from strategy
   */
  private generateQuestionFromStrategy(strategy: any, request: QuestionGenerationRequest): GeneratedQuestion {
    const template = this.questionTemplates.get(strategy.category) || this.questionTemplates.get('default');
    const questionTemplate = this.selectQuestionTemplate(template, strategy);
    
    const question: GeneratedQuestion = {
      id: this.generateQuestionId(),
      question: this.generateQuestionText(questionTemplate, request),
      type: strategy.type,
      options: this.generateQuestionOptions(questionTemplate, strategy),
      category: strategy.category,
      difficulty: strategy.difficulty,
      confidence: 0.8, // Will be calculated later
      reasoning: '',
      followUpQuestions: this.generateFollowUpQuestions(strategy, request),
      skipConditions: this.generateSkipConditions(strategy, request)
    };

    return question;
  }

  /**
   * Apply adaptive modifications to question
   */
  private applyAdaptiveModifications(question: GeneratedQuestion, analysis: any): GeneratedQuestion {
    const modifiedQuestion = { ...question };
    
    // Adapt question text based on user profile
    if (analysis.userProfile) {
      modifiedQuestion.question = this.adaptQuestionText(modifiedQuestion.question, analysis.userProfile);
    }
    
    // Adapt options based on difficulty
    if (modifiedQuestion.options) {
      modifiedQuestion.options = this.adaptQuestionOptions(modifiedQuestion.options, modifiedQuestion.difficulty);
    }
    
    // Add context-specific modifications
    modifiedQuestion.question = this.addContextSpecificContent(modifiedQuestion.question, analysis);
    
    return modifiedQuestion;
  }

  /**
   * Calculate confidence and reasoning
   */
  private calculateConfidenceAndReasoning(question: GeneratedQuestion, analysis: any): GeneratedQuestion {
    const confidence = this.calculateQuestionConfidence(question, analysis);
    const reasoning = this.generateQuestionReasoning(question, analysis);
    
    return {
      ...question,
      confidence,
      reasoning
    };
  }

  /**
   * Analyze response patterns
   */
  private analyzeResponsePatterns(responses: Record<string, any>): any {
    const patterns = {
      responseCount: Object.keys(responses).length,
      averageResponseLength: 0,
      responseTypes: new Set<string>(),
      consistency: 0,
      engagement: 0
    };

    const responseValues = Object.values(responses);
    
    if (responseValues.length > 0) {
      // Calculate average response length
      const totalLength = responseValues
        .filter(val => typeof val === 'string')
        .reduce((sum, val) => sum + val.length, 0);
      patterns.averageResponseLength = totalLength / responseValues.length;

      // Analyze response types
      responseValues.forEach(val => {
        if (typeof val === 'string') patterns.responseTypes.add('text');
        else if (typeof val === 'number') patterns.responseTypes.add('numeric');
        else if (typeof val === 'boolean') patterns.responseTypes.add('boolean');
        else patterns.responseTypes.add('other');
      });

      // Calculate consistency
      const numericResponses = responseValues.filter(val => typeof val === 'number');
      if (numericResponses.length > 1) {
        const mean = numericResponses.reduce((sum, val) => sum + val, 0) / numericResponses.length;
        const variance = numericResponses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericResponses.length;
        patterns.consistency = Math.max(0, 1 - variance / 10);
      }

      // Calculate engagement
      patterns.engagement = Math.min(1, patterns.responseCount / 10);
    }

    return patterns;
  }

  /**
   * Identify knowledge gaps
   */
  private identifyKnowledgeGaps(responses: Record<string, any>, assessmentType: string): any[] {
    const gaps = [];
    const categoryScores: Record<string, number> = {};
    
    // Calculate category scores
    Object.entries(responses).forEach(([key, value]) => {
      const category = this.getQuestionCategory(key);
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0 };
      }
      categoryScores[category].total += Number(value) || 0;
      categoryScores[category].count += 1;
    });

    // Identify gaps (scores below threshold)
    Object.entries(categoryScores).forEach(([category, score]) => {
      const averageScore = score.total / score.count;
      if (averageScore < 6) {
        gaps.push({
          category,
          score: averageScore,
          severity: 6 - averageScore
        });
      }
    });

    return gaps.sort((a, b) => b.severity - a.severity);
  }

  /**
   * Analyze difficulty progression
   */
  private analyzeDifficultyProgression(questionHistory: string[]): any {
    return {
      totalQuestions: questionHistory.length,
      difficultyTrend: this.calculateDifficultyTrend(questionHistory),
      progressionRate: this.calculateProgressionRate(questionHistory),
      stuckPoints: this.identifyStuckPoints(questionHistory)
    };
  }

  /**
   * Analyze category performance
   */
  private analyzeCategoryPerformance(responses: Record<string, any>): Record<string, any> {
    const performance: Record<string, any> = {};
    
    Object.entries(responses).forEach(([key, value]) => {
      const category = this.getQuestionCategory(key);
      if (!performance[category]) {
        performance[category] = { scores: [], count: 0 };
      }
      performance[category].scores.push(Number(value) || 0);
      performance[category].count += 1;
    });

    // Calculate performance metrics
    Object.keys(performance).forEach(category => {
      const scores = performance[category].scores;
      performance[category].score = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      performance[category].variance = this.calculateVariance(scores);
      performance[category].trend = this.calculateScoreTrend(scores);
    });

    return performance;
  }

  /**
   * Calculate user engagement
   */
  private calculateUserEngagement(responses: Record<string, any>): number {
    const responseCount = Object.keys(responses).length;
    const responseValues = Object.values(responses);
    
    let engagement = 0.5; // Base engagement
    
    // Increase engagement based on response count
    if (responseCount > 5) engagement += 0.2;
    if (responseCount > 10) engagement += 0.2;
    
    // Increase engagement based on response quality
    const textResponses = responseValues.filter(val => typeof val === 'string' && val.length > 10);
    if (textResponses.length > 0) engagement += 0.1;
    
    return Math.min(1, engagement);
  }

  /**
   * Analyze confidence trends
   */
  private analyzeConfidenceTrends(responses: Record<string, any>): any {
    const confidenceScores = Object.values(responses)
      .filter(val => typeof val === 'number')
      .map(val => Number(val));
    
    return {
      averageConfidence: confidenceScores.length > 0 ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length : 0,
      confidenceVariance: this.calculateVariance(confidenceScores),
      confidenceTrend: this.calculateScoreTrend(confidenceScores)
    };
  }

  /**
   * Generate question ID
   */
  private generateQuestionId(): string {
    return `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Select question template
   */
  private selectQuestionTemplate(template: any, strategy: any): any {
    const templates = template[strategy.type] || template.multiple_choice;
    const difficultyTemplates = templates[strategy.difficulty] || templates[3];
    
    return difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)];
  }

  /**
   * Generate question text
   */
  private generateQuestionText(template: any, request: QuestionGenerationRequest): string {
    let question = template.question;
    
    // Replace placeholders with context-specific content
    if (request.userProfile.industry) {
      question = question.replace('{{industry}}', request.userProfile.industry);
    }
    
    if (request.userProfile.teamSize) {
      question = question.replace('{{teamSize}}', request.userProfile.teamSize);
    }
    
    return question;
  }

  /**
   * Generate question options
   */
  private generateQuestionOptions(template: any, strategy: any): string[] {
    if (strategy.type === 'multiple_choice') {
      return template.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    }
    
    if (strategy.type === 'scale') {
      return ['1 - Not at all', '2 - Slightly', '3 - Somewhat', '4 - Moderately', '5 - Very much', '6 - Extremely', '7 - Completely'];
    }
    
    return [];
  }

  /**
   * Generate follow-up questions
   */
  private generateFollowUpQuestions(strategy: any, request: QuestionGenerationRequest): string[] {
    const followUps = [];
    
    if (strategy.category === 'strategy') {
      followUps.push('How do you plan to implement this strategy?');
      followUps.push('What resources will you need?');
    }
    
    if (strategy.category === 'technology') {
      followUps.push('What technology stack are you currently using?');
      followUps.push('How do you handle technology decisions?');
    }
    
    return followUps;
  }

  /**
   * Generate skip conditions
   */
  private generateSkipConditions(strategy: any, request: QuestionGenerationRequest): any[] {
    const conditions = [];
    
    // Skip if user has low engagement
    if (request.userProfile.engagement < 0.3) {
      conditions.push({
        type: 'engagement',
        threshold: 0.3,
        action: 'skip'
      });
    }
    
    // Skip if category already well covered
    const categoryResponses = Object.keys(request.currentResponses).filter(key => 
      this.getQuestionCategory(key) === strategy.category
    );
    
    if (categoryResponses.length > 5) {
      conditions.push({
        type: 'category_coverage',
        threshold: 5,
        action: 'skip'
      });
    }
    
    return conditions;
  }

  /**
   * Adapt question text
   */
  private adaptQuestionText(question: string, userProfile: any): string {
    let adaptedQuestion = question;
    
    if (userProfile.industry) {
      adaptedQuestion = adaptedQuestion.replace('{{industry}}', userProfile.industry);
    }
    
    if (userProfile.teamSize) {
      adaptedQuestion = adaptedQuestion.replace('{{teamSize}}', userProfile.teamSize);
    }
    
    return adaptedQuestion;
  }

  /**
   * Adapt question options
   */
  private adaptQuestionOptions(options: string[], difficulty: number): string[] {
    if (difficulty <= 2) {
      // Simplify options for low difficulty
      return options.slice(0, 4);
    } else if (difficulty >= 4) {
      // Add more nuanced options for high difficulty
      return [...options, 'Not applicable', 'Need more information'];
    }
    
    return options;
  }

  /**
   * Add context-specific content
   */
  private addContextSpecificContent(question: string, analysis: any): string {
    if (analysis.knowledgeGaps.length > 0) {
      return question + ' (This area may need more attention)';
    }
    
    return question;
  }

  /**
   * Calculate question confidence
   */
  private calculateQuestionConfidence(question: GeneratedQuestion, analysis: any): number {
    let confidence = 0.8; // Base confidence
    
    // Adjust based on category performance
    const categoryPerformance = analysis.categoryPerformance[question.category];
    if (categoryPerformance) {
      if (categoryPerformance.score < 5) confidence -= 0.1;
      if (categoryPerformance.score > 8) confidence += 0.1;
    }
    
    // Adjust based on difficulty
    if (question.difficulty > 4) confidence -= 0.1;
    if (question.difficulty < 2) confidence += 0.1;
    
    return Math.max(0.1, Math.min(1, confidence));
  }

  /**
   * Generate question reasoning
   */
  private generateQuestionReasoning(question: GeneratedQuestion, analysis: any): string {
    const reasons = [];
    
    if (analysis.knowledgeGaps.some((gap: any) => gap.category === question.category)) {
      reasons.push('Addressing identified knowledge gap');
    }
    
    if (question.difficulty > 3) {
      reasons.push('Challenging question to assess depth of knowledge');
    }
    
    if (analysis.categoryPerformance[question.category]?.score < 6) {
      reasons.push('Focusing on underperforming category');
    }
    
    return reasons.join('. ') || 'Standard assessment question';
  }

  /**
   * Get question category
   */
  private getQuestionCategory(questionId: string): string {
    if (questionId.includes('strategy')) return 'strategy';
    if (questionId.includes('technology')) return 'technology';
    if (questionId.includes('process')) return 'process';
    if (questionId.includes('team')) return 'team';
    if (questionId.includes('market')) return 'market';
    return 'general';
  }

  /**
   * Calculate variance
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate score trend
   */
  private calculateScoreTrend(scores: number[]): string {
    if (scores.length < 2) return 'stable';
    
    const recentScores = scores.slice(-3);
    const earlierScores = scores.slice(0, -3);
    
    if (recentScores.length === 0 || earlierScores.length === 0) return 'stable';
    
    const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const earlierAvg = earlierScores.reduce((sum, score) => sum + score, 0) / earlierScores.length;
    
    if (recentAvg > earlierAvg + 1) return 'improving';
    if (recentAvg < earlierAvg - 1) return 'declining';
    return 'stable';
  }

  /**
   * Calculate difficulty trend
   */
  private calculateDifficultyTrend(questionHistory: string[]): string {
    // This would analyze the difficulty progression in question history
    return 'increasing';
  }

  /**
   * Calculate progression rate
   */
  private calculateProgressionRate(questionHistory: string[]): number {
    // This would calculate how quickly user is progressing through questions
    return questionHistory.length / 10; // Normalized rate
  }

  /**
   * Identify stuck points
   */
  private identifyStuckPoints(questionHistory: string[]): string[] {
    // This would identify where user is getting stuck
    return [];
  }

  /**
   * Get fallback question
   */
  private getFallbackQuestion(request: QuestionGenerationRequest): GeneratedQuestion {
    return {
      id: 'fallback-question',
      question: 'How would you rate your overall business performance?',
      type: 'scale',
      options: ['1 - Poor', '2 - Below Average', '3 - Average', '4 - Above Average', '5 - Excellent'],
      category: 'general',
      difficulty: 3,
      confidence: 0.5,
      reasoning: 'Fallback question for assessment continuation'
    };
  }

  /**
   * Initialize question templates
   */
  private initializeTemplates(): void {
    // Strategy questions
    this.questionTemplates.set('strategy', {
      multiple_choice: {
        1: [
          {
            question: 'Do you have a clear business strategy?',
            options: ['Yes', 'No', 'Partially', 'Not sure']
          }
        ],
        3: [
          {
            question: 'How well is your business strategy aligned with market opportunities?',
            options: ['Very well aligned', 'Somewhat aligned', 'Not well aligned', 'No strategy']
          }
        ],
        5: [
          {
            question: 'How do you evaluate and adjust your strategic initiatives in response to market changes?',
            options: ['Systematic evaluation', 'Ad-hoc adjustments', 'Annual review', 'No formal process']
          }
        ]
      }
    });

    // Technology questions
    this.questionTemplates.set('technology', {
      multiple_choice: {
        1: [
          {
            question: 'Do you use technology in your business operations?',
            options: ['Yes', 'No', 'Somewhat', 'Not sure']
          }
        ],
        3: [
          {
            question: 'How would you rate your technology adoption level?',
            options: ['Advanced', 'Intermediate', 'Basic', 'Minimal']
          }
        ],
        5: [
          {
            question: 'How do you approach technology decisions and implementation?',
            options: ['Strategic planning', 'Reactive adoption', 'Consultant-driven', 'No formal approach']
          }
        ]
      }
    });

    // Default template
    this.questionTemplates.set('default', {
      multiple_choice: {
        3: [
          {
            question: 'How would you rate your current business performance?',
            options: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor']
          }
        ]
      }
    });
  }
}

