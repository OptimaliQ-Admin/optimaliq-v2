/**
 * Dynamic Branching Logic for Conversational AI
 * Context-aware conversation flow with intelligent branching
 */

import { z } from 'zod';

// Conversation Context Schema
const ConversationContextSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  currentStep: z.number().finite(),
  totalSteps: z.number().finite(),
  responses: z.record(z.any()),
  intent: z.string().optional(),
  confidence: z.number().finite().min(0).max(1),
  context: z.record(z.any()),
  metadata: z.record(z.any())
});

export type ConversationContext = z.infer<typeof ConversationContextSchema>;

// Branching Decision Schema
const BranchingDecisionSchema = z.object({
  nextQuestion: z.string(),
  branchType: z.enum(['linear', 'conditional', 'adaptive', 'skip']),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains']),
    value: z.any()
  })).optional(),
  priority: z.number().finite().min(1).max(5),
  skipReason: z.string().optional()
});

export type BranchingDecision = z.infer<typeof BranchingDecisionSchema>;

// Question Node Schema
const QuestionNodeSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(['text', 'multiple_choice', 'scale', 'boolean', 'ranking']),
  options: z.array(z.string()).optional(),
  dependencies: z.array(z.string()),
  skipConditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains']),
    value: z.any()
  })).optional(),
  adaptiveLogic: z.record(z.any()).optional()
});

export type QuestionNode = z.infer<typeof QuestionNodeSchema>;

export class DynamicBranchingLogic {
  private questionGraph: Map<string, QuestionNode>;
  private branchingRules: Map<string, BranchingDecision[]>;

  constructor() {
    this.questionGraph = new Map();
    this.branchingRules = new Map();
    this.initializeQuestionGraph();
    this.initializeBranchingRules();
  }

  /**
   * Determine the next question based on current context
   */
  async determineNextQuestion(context: ConversationContext): Promise<QuestionNode | null> {
    try {
      const validatedContext = ConversationContextSchema.parse(context);
      
      // Check if conversation is complete
      if (validatedContext.currentStep >= validatedContext.totalSteps) {
        return null;
      }

      // Get current question
      const currentQuestionId = this.getCurrentQuestionId(validatedContext);
      const currentQuestion = this.questionGraph.get(currentQuestionId);
      
      if (!currentQuestion) {
        throw new Error(`Question not found: ${currentQuestionId}`);
      }

      // Analyze user response and context
      const analysis = this.analyzeUserResponse(validatedContext);
      
      // Determine next question based on branching logic
      const nextQuestionId = this.calculateNextQuestion(currentQuestionId, analysis, validatedContext);
      
      if (!nextQuestionId) {
        return null; // Conversation complete
      }

      const nextQuestion = this.questionGraph.get(nextQuestionId);
      
      // Apply adaptive modifications if needed
      if (nextQuestion && nextQuestion.adaptiveLogic) {
        return this.applyAdaptiveModifications(nextQuestion, validatedContext);
      }

      return nextQuestion || null;
    } catch (error) {
      console.error('Error determining next question:', error);
      return this.getFallbackQuestion(context);
    }
  }

  /**
   * Analyze user response and extract insights
   */
  private analyzeUserResponse(context: ConversationContext): any {
    const analysis = {
      intent: context.intent || 'unknown',
      confidence: context.confidence,
      responsePattern: this.analyzeResponsePattern(context.responses),
      contextInsights: this.extractContextInsights(context),
      skipProbability: this.calculateSkipProbability(context)
    };

    return analysis;
  }

  /**
   * Calculate next question based on branching rules
   */
  private calculateNextQuestion(
    currentQuestionId: string, 
    analysis: any, 
    context: ConversationContext
  ): string | null {
    const rules = this.branchingRules.get(currentQuestionId) || [];
    
    // Sort rules by priority
    const sortedRules = rules.sort((a, b) => b.priority - a.priority);
    
    for (const rule of sortedRules) {
      if (this.evaluateConditions(rule.conditions || [], context.responses)) {
        return rule.nextQuestion;
      }
    }

    // Default to linear progression
    return this.getNextLinearQuestion(currentQuestionId);
  }

  /**
   * Evaluate conditions for branching
   */
  private evaluateConditions(conditions: any[], responses: Record<string, any>): boolean {
    if (conditions.length === 0) return true;

    return conditions.every(condition => {
      const responseValue = responses[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return responseValue === condition.value;
        case 'not_equals':
          return responseValue !== condition.value;
        case 'greater_than':
          return Number(responseValue) > Number(condition.value);
        case 'less_than':
          return Number(responseValue) < Number(condition.value);
        case 'contains':
          return String(responseValue).includes(String(condition.value));
        case 'not_contains':
          return !String(responseValue).includes(String(condition.value));
        default:
          return false;
      }
    });
  }

  /**
   * Apply adaptive modifications to questions
   */
  private applyAdaptiveModifications(question: QuestionNode, context: ConversationContext): QuestionNode {
    const modifiedQuestion = { ...question };
    
    if (question.adaptiveLogic) {
      // Adapt question text based on context
      if (question.adaptiveLogic.textAdaptation) {
        modifiedQuestion.question = this.adaptQuestionText(
          question.question, 
          context.responses, 
          question.adaptiveLogic.textAdaptation
        );
      }

      // Adapt options based on context
      if (question.adaptiveLogic.optionAdaptation) {
        modifiedQuestion.options = this.adaptQuestionOptions(
          question.options || [], 
          context.responses, 
          question.adaptiveLogic.optionAdaptation
        );
      }

      // Adapt skip conditions based on context
      if (question.adaptiveLogic.skipAdaptation) {
        modifiedQuestion.skipConditions = this.adaptSkipConditions(
          question.skipConditions || [], 
          context.responses, 
          question.adaptiveLogic.skipAdaptation
        );
      }
    }

    return modifiedQuestion;
  }

  /**
   * Analyze response patterns for insights
   */
  private analyzeResponsePattern(responses: Record<string, any>): any {
    const pattern = {
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
      pattern.averageResponseLength = totalLength / responseValues.length;

      // Analyze response types
      responseValues.forEach(val => {
        if (typeof val === 'string') pattern.responseTypes.add('text');
        else if (typeof val === 'number') pattern.responseTypes.add('numeric');
        else if (typeof val === 'boolean') pattern.responseTypes.add('boolean');
        else pattern.responseTypes.add('other');
      });

      // Calculate consistency (variance in numeric responses)
      const numericResponses = responseValues.filter(val => typeof val === 'number');
      if (numericResponses.length > 1) {
        const mean = numericResponses.reduce((sum, val) => sum + val, 0) / numericResponses.length;
        const variance = numericResponses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericResponses.length;
        pattern.consistency = Math.max(0, 1 - variance / 10); // Normalize to 0-1
      }

      // Calculate engagement (based on response completeness)
      pattern.engagement = Math.min(1, pattern.responseCount / 10);
    }

    return pattern;
  }

  /**
   * Extract insights from conversation context
   */
  private extractContextInsights(context: ConversationContext): any {
    const insights = {
      userProfile: this.buildUserProfile(context.responses),
      conversationFlow: this.analyzeConversationFlow(context),
      intentProgression: this.trackIntentProgression(context),
      engagementLevel: this.calculateEngagementLevel(context)
    };

    return insights;
  }

  /**
   * Calculate skip probability for current question
   */
  private calculateSkipProbability(context: ConversationContext): number {
    let skipProbability = 0.1; // Base skip probability

    // Increase skip probability based on user behavior
    if (context.responses) {
      const responseCount = Object.keys(context.responses).length;
      if (responseCount > 5) skipProbability += 0.1; // User has answered many questions
      if (responseCount > 10) skipProbability += 0.1; // User has answered many questions
    }

    // Increase skip probability based on confidence
    if (context.confidence < 0.5) skipProbability += 0.2; // Low confidence suggests confusion

    // Increase skip probability based on step progression
    const stepRatio = context.currentStep / context.totalSteps;
    if (stepRatio > 0.8) skipProbability += 0.1; // Near the end, more likely to skip

    return Math.min(0.8, skipProbability); // Cap at 80%
  }

  /**
   * Build user profile from responses
   */
  private buildUserProfile(responses: Record<string, any>): any {
    const profile = {
      businessGoals: [],
      teamSize: '',
      industry: '',
      technologyLevel: '',
      challenges: [],
      timeline: '',
      budget: '',
      learningPreference: ''
    };

    // Extract profile information from responses
    Object.entries(responses).forEach(([key, value]) => {
      switch (key) {
        case 'business_goal':
          profile.businessGoals.push(value);
          break;
        case 'team_size':
          profile.teamSize = value;
          break;
        case 'industry':
          profile.industry = value;
          break;
        case 'tech_level':
          profile.technologyLevel = value;
          break;
        case 'challenge':
          profile.challenges.push(value);
          break;
        case 'timeline':
          profile.timeline = value;
          break;
        case 'budget':
          profile.budget = value;
          break;
        case 'learning_preference':
          profile.learningPreference = value;
          break;
      }
    });

    return profile;
  }

  /**
   * Analyze conversation flow
   */
  private analyzeConversationFlow(context: ConversationContext): any {
    return {
      currentStep: context.currentStep,
      totalSteps: context.totalSteps,
      progress: (context.currentStep / context.totalSteps) * 100,
      stepDuration: this.calculateStepDuration(context),
      flowEfficiency: this.calculateFlowEfficiency(context)
    };
  }

  /**
   * Track intent progression
   */
  private trackIntentProgression(context: ConversationContext): any {
    return {
      currentIntent: context.intent,
      intentHistory: context.context.intentHistory || [],
      intentConfidence: context.confidence,
      intentChanges: this.calculateIntentChanges(context)
    };
  }

  /**
   * Calculate engagement level
   */
  private calculateEngagementLevel(context: ConversationContext): number {
    let engagement = 0.5; // Base engagement

    // Increase engagement based on response quality
    if (context.responses) {
      const responseCount = Object.keys(context.responses).length;
      if (responseCount > 0) engagement += 0.2;
      if (responseCount > 3) engagement += 0.1;
      if (responseCount > 5) engagement += 0.1;
    }

    // Increase engagement based on confidence
    if (context.confidence > 0.7) engagement += 0.1;

    // Decrease engagement if user is skipping
    if (context.context.skippedQuestions) {
      engagement -= context.context.skippedQuestions * 0.05;
    }

    return Math.max(0, Math.min(1, engagement));
  }

  /**
   * Adapt question text based on context
   */
  private adaptQuestionText(
    originalText: string, 
    responses: Record<string, any>, 
    adaptationRules: any
  ): string {
    let adaptedText = originalText;

    // Replace placeholders with context-specific content
    Object.entries(adaptationRules).forEach(([placeholder, rule]) => {
      const value = responses[rule.field];
      if (value) {
        adaptedText = adaptedText.replace(placeholder, String(value));
      }
    });

    return adaptedText;
  }

  /**
   * Adapt question options based on context
   */
  private adaptQuestionOptions(
    originalOptions: string[], 
    responses: Record<string, any>, 
    adaptationRules: any
  ): string[] {
    let adaptedOptions = [...originalOptions];

    // Filter options based on context
    if (adaptationRules.filter) {
      adaptedOptions = adaptedOptions.filter(option => {
        return this.evaluateConditions(adaptationRules.filter, { option, ...responses });
      });
    }

    // Add context-specific options
    if (adaptationRules.add) {
      adaptationRules.add.forEach((rule: any) => {
        if (this.evaluateConditions(rule.conditions || [], responses)) {
          adaptedOptions.push(rule.option);
        }
      });
    }

    return adaptedOptions;
  }

  /**
   * Adapt skip conditions based on context
   */
  private adaptSkipConditions(
    originalConditions: any[], 
    responses: Record<string, any>, 
    adaptationRules: any
  ): any[] {
    let adaptedConditions = [...originalConditions];

    // Add context-specific skip conditions
    if (adaptationRules.add) {
      adaptationRules.add.forEach((rule: any) => {
        if (this.evaluateConditions(rule.conditions || [], responses)) {
          adaptedConditions.push(rule.skipCondition);
        }
      });
    }

    return adaptedConditions;
  }

  /**
   * Get current question ID based on context
   */
  private getCurrentQuestionId(context: ConversationContext): string {
    const questionIds = [
      'business_goal',
      'team_size', 
      'industry',
      'tech_level',
      'challenge',
      'timeline',
      'budget',
      'learning_preference',
      'next_action'
    ];

    return questionIds[context.currentStep - 1] || 'business_goal';
  }

  /**
   * Get next linear question
   */
  private getNextLinearQuestion(currentQuestionId: string): string | null {
    const questionSequence = [
      'business_goal',
      'team_size',
      'industry', 
      'tech_level',
      'challenge',
      'timeline',
      'budget',
      'learning_preference',
      'next_action'
    ];

    const currentIndex = questionSequence.indexOf(currentQuestionId);
    if (currentIndex === -1 || currentIndex === questionSequence.length - 1) {
      return null;
    }

    return questionSequence[currentIndex + 1];
  }

  /**
   * Get fallback question
   */
  private getFallbackQuestion(context: ConversationContext): QuestionNode {
    return {
      id: 'fallback',
      question: 'Thank you for your responses. How can I help you get started with OptimaliQ?',
      type: 'multiple_choice',
      options: ['Start Assessment', 'View Dashboard', 'Schedule Demo', 'Learn More'],
      dependencies: []
    };
  }

  /**
   * Calculate step duration
   */
  private calculateStepDuration(context: ConversationContext): number {
    // This would calculate actual step duration from timestamps
    return 30; // Default 30 seconds
  }

  /**
   * Calculate flow efficiency
   */
  private calculateFlowEfficiency(context: ConversationContext): number {
    // This would calculate efficiency based on time spent vs expected time
    return 0.8; // Default 80% efficiency
  }

  /**
   * Calculate intent changes
   */
  private calculateIntentChanges(context: ConversationContext): number {
    const intentHistory = context.context.intentHistory || [];
    if (intentHistory.length < 2) return 0;

    let changes = 0;
    for (let i = 1; i < intentHistory.length; i++) {
      if (intentHistory[i] !== intentHistory[i - 1]) {
        changes++;
      }
    }

    return changes;
  }

  /**
   * Initialize question graph
   */
  private initializeQuestionGraph(): void {
    const questions: QuestionNode[] = [
      {
        id: 'business_goal',
        question: "What's your primary business goal?",
        type: 'multiple_choice',
        options: ['Increase revenue', 'Improve efficiency', 'Expand market', 'Reduce costs', 'Improve team performance'],
        dependencies: [],
        adaptiveLogic: {
          textAdaptation: {
            '{{industry}}': { field: 'industry' }
          }
        }
      },
      {
        id: 'team_size',
        question: "How many people are in your organization?",
        type: 'multiple_choice',
        options: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
        dependencies: ['business_goal']
      },
      {
        id: 'industry',
        question: "What industry are you in?",
        type: 'multiple_choice',
        options: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Other'],
        dependencies: ['team_size']
      },
      {
        id: 'tech_level',
        question: "How would you rate your current technology adoption level?",
        type: 'multiple_choice',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        dependencies: ['industry'],
        skipConditions: [
          { field: 'team_size', operator: 'equals', value: '1-10' }
        ]
      },
      {
        id: 'challenge',
        question: "What's your biggest challenge right now?",
        type: 'multiple_choice',
        options: ['Scaling operations', 'Team collaboration', 'Data insights', 'Process efficiency', 'Market competition'],
        dependencies: ['tech_level']
      },
      {
        id: 'timeline',
        question: "When do you hope to see results from implementing new tools?",
        type: 'multiple_choice',
        options: ['Immediately', '1-3 months', '3-6 months', '6-12 months', 'Long-term'],
        dependencies: ['challenge']
      },
      {
        id: 'budget',
        question: "What's your budget range for business improvement tools?",
        type: 'multiple_choice',
        options: ['Under $1K/month', '$1K-$5K/month', '$5K-$10K/month', '$10K+/month', 'Not sure yet'],
        dependencies: ['timeline']
      },
      {
        id: 'learning_preference',
        question: "How do you prefer to learn and implement new tools?",
        type: 'multiple_choice',
        options: ['Self-guided', 'Guided onboarding', 'Full implementation support', 'Training for team'],
        dependencies: ['budget']
      },
      {
        id: 'next_action',
        question: "Based on your responses, I recommend starting with our Growth Assessment. Would you like to begin?",
        type: 'multiple_choice',
        options: ['Start Assessment', 'View Dashboard', 'Schedule Demo', 'Learn More'],
        dependencies: ['learning_preference']
      }
    ];

    questions.forEach(question => {
      this.questionGraph.set(question.id, question);
    });
  }

  /**
   * Initialize branching rules
   */
  private initializeBranchingRules(): void {
    // Business goal branching
    this.branchingRules.set('business_goal', [
      {
        nextQuestion: 'team_size',
        branchType: 'linear',
        priority: 5
      }
    ]);

    // Team size branching
    this.branchingRules.set('team_size', [
      {
        nextQuestion: 'industry',
        branchType: 'linear',
        priority: 5
      }
    ]);

    // Industry branching
    this.branchingRules.set('industry', [
      {
        nextQuestion: 'tech_level',
        branchType: 'linear',
        priority: 5
      }
    ]);

    // Tech level branching with skip conditions
    this.branchingRules.set('tech_level', [
      {
        nextQuestion: 'challenge',
        branchType: 'conditional',
        conditions: [
          { field: 'team_size', operator: 'not_equals', value: '1-10' }
        ],
        priority: 5
      },
      {
        nextQuestion: 'challenge',
        branchType: 'skip',
        skipReason: 'Small team, skip tech level question',
        priority: 3
      }
    ]);

    // Challenge branching
    this.branchingRules.set('challenge', [
      {
        nextQuestion: 'timeline',
        branchType: 'linear',
        priority: 5
      }
    ]);

    // Timeline branching
    this.branchingRules.set('timeline', [
      {
        nextQuestion: 'budget',
        branchType: 'linear',
        priority: 5
      }
    ]);

    // Budget branching
    this.branchingRules.set('budget', [
      {
        nextQuestion: 'learning_preference',
        branchType: 'linear',
        priority: 5
      }
    ]);

    // Learning preference branching
    this.branchingRules.set('learning_preference', [
      {
        nextQuestion: 'next_action',
        branchType: 'linear',
        priority: 5
      }
    ]);

    // Next action branching
    this.branchingRules.set('next_action', [
      {
        nextQuestion: 'complete',
        branchType: 'linear',
        priority: 5
      }
    ]);
  }
}

