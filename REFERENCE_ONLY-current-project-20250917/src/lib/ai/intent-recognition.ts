/**
 * AI-Powered User Intent Recognition System
 * AI-powered intent detection and classification for conversational interfaces
 */

import { z } from 'zod';

// Intent Recognition Request Schema
const IntentRecognitionRequestSchema = z.object({
  userId: z.string(),
  conversationId: z.string(),
  userInput: z.object({
    text: z.string(),
    context: z.record(z.any()).optional(),
    metadata: z.object({
      timestamp: z.string(),
      channel: z.enum(['text', 'voice', 'chat', 'form']),
      sessionId: z.string(),
      previousIntents: z.array(z.string()).optional()
    })
  }),
  analysisSettings: z.object({
    confidenceThreshold: z.number().finite().min(0).max(1).default(0.7),
    enableMultipleIntents: z.boolean().default(true),
    enableSubIntents: z.boolean().default(true),
    contextWindowSize: z.number().finite().min(1).max(10).default(5)
  })
});

export type IntentRecognitionRequest = z.infer<typeof IntentRecognitionRequestSchema>;

// Intent Recognition Result Schema
const IntentRecognitionResultSchema = z.object({
  primaryIntent: z.object({
    intent: z.string(),
    confidence: z.number().finite().min(0).max(1),
    category: z.string(),
    description: z.string(),
    entities: z.array(z.object({
      entity: z.string(),
      value: z.any(),
      confidence: z.number().finite().min(0).max(1),
      type: z.enum(['person', 'organization', 'location', 'date', 'number', 'custom'])
    }))
  }),
  alternativeIntents: z.array(z.object({
    intent: z.string(),
    confidence: z.number().finite().min(0).max(1),
    category: z.string(),
    reasoning: z.string()
  })),
  contextAnalysis: z.object({
    conversationStage: z.enum(['greeting', 'information_gathering', 'clarification', 'resolution', 'closing']),
    userMood: z.enum(['positive', 'neutral', 'negative', 'frustrated', 'excited']),
    urgency: z.enum(['low', 'medium', 'high', 'urgent']),
    complexity: z.enum(['simple', 'moderate', 'complex']),
    domainFocus: z.array(z.string())
  }),
  recommendations: z.object({
    suggestedActions: z.array(z.object({
      action: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
      reasoning: z.string()
    })),
    responseStrategy: z.enum(['direct_answer', 'clarifying_question', 'guided_flow', 'escalation']),
    nextSteps: z.array(z.string())
  })
});

export type IntentRecognitionResult = z.infer<typeof IntentRecognitionResultSchema>;

export class UserIntentRecognition {
  private intentClassifier: Map<string, any>;
  private entityExtractor: Map<string, any>;
  private contextAnalyzer: Map<string, any>;

  constructor() {
    this.intentClassifier = new Map();
    this.entityExtractor = new Map();
    this.contextAnalyzer = new Map();
    this.initializeModels();
  }

  /**
   * Recognize user intent from input
   */
  async recognizeIntent(request: IntentRecognitionRequest): Promise<IntentRecognitionResult> {
    try {
      const validatedRequest = IntentRecognitionRequestSchema.parse(request);
      
      // Classify primary intent
      const primaryIntent = this.classifyIntent(validatedRequest);
      
      // Find alternative intents
      const alternativeIntents = this.findAlternativeIntents(validatedRequest, primaryIntent);
      
      // Analyze context
      const contextAnalysis = this.analyzeContext(validatedRequest);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(validatedRequest, primaryIntent, contextAnalysis);
      
      const result: IntentRecognitionResult = {
        primaryIntent,
        alternativeIntents,
        contextAnalysis,
        recommendations
      };

      return IntentRecognitionResultSchema.parse(result);
    } catch (error) {
      console.error('Error recognizing intent:', error);
      return this.getFallbackIntentResult(request);
    }
  }

  /**
   * Classify primary intent
   */
  private classifyIntent(request: IntentRecognitionRequest): any {
    const text = request.userInput.text.toLowerCase();
    const patterns = this.getIntentPatterns();
    
    let bestMatch = { intent: 'general_inquiry', confidence: 0.5, category: 'general' };
    
    for (const [intent, pattern] of patterns.entries()) {
      const confidence = this.calculateIntentConfidence(text, pattern);
      if (confidence > bestMatch.confidence && confidence >= request.analysisSettings.confidenceThreshold) {
        bestMatch = {
          intent,
          confidence,
          category: pattern.category
        };
      }
    }
    
    const entities = this.extractEntities(text, bestMatch.intent);
    const description = this.getIntentDescription(bestMatch.intent);
    
    return {
      intent: bestMatch.intent,
      confidence: bestMatch.confidence,
      category: bestMatch.category,
      description,
      entities
    };
  }

  /**
   * Find alternative intents
   */
  private findAlternativeIntents(request: IntentRecognitionRequest, primaryIntent: any): any[] {
    const text = request.userInput.text.toLowerCase();
    const patterns = this.getIntentPatterns();
    const alternatives = [];
    
    for (const [intent, pattern] of patterns.entries()) {
      if (intent === primaryIntent.intent) continue;
      
      const confidence = this.calculateIntentConfidence(text, pattern);
      if (confidence >= 0.3 && confidence < request.analysisSettings.confidenceThreshold) {
        alternatives.push({
          intent,
          confidence,
          category: pattern.category,
          reasoning: this.getAlternativeReasoning(intent, confidence)
        });
      }
    }
    
    return alternatives.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }

  /**
   * Analyze conversation context
   */
  private analyzeContext(request: IntentRecognitionRequest): any {
    const text = request.userInput.text;
    const previousIntents = request.userInput.metadata.previousIntents || [];
    
    const conversationStage = this.determineConversationStage(text, previousIntents);
    const userMood = this.detectUserMood(text);
    const urgency = this.assessUrgency(text);
    const complexity = this.assessComplexity(text);
    const domainFocus = this.identifyDomainFocus(text);
    
    return {
      conversationStage,
      userMood,
      urgency,
      complexity,
      domainFocus
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(request: IntentRecognitionRequest, primaryIntent: any, contextAnalysis: any): any {
    const suggestedActions = this.suggestActions(primaryIntent, contextAnalysis);
    const responseStrategy = this.determineResponseStrategy(primaryIntent, contextAnalysis);
    const nextSteps = this.suggestNextSteps(primaryIntent, contextAnalysis);
    
    return {
      suggestedActions,
      responseStrategy,
      nextSteps
    };
  }

  // Helper methods
  private getIntentPatterns(): Map<string, any> {
    const patterns = new Map();
    
    // Greeting intents
    patterns.set('greeting', {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      category: 'social',
      confidence: 0.9
    });
    
    // Information seeking
    patterns.set('information_request', {
      keywords: ['what', 'how', 'when', 'where', 'why', 'tell me about', 'explain'],
      category: 'inquiry',
      confidence: 0.8
    });
    
    // Help requests
    patterns.set('help_request', {
      keywords: ['help', 'assist', 'support', 'guidance', 'stuck', 'problem'],
      category: 'support',
      confidence: 0.85
    });
    
    // Assessment related
    patterns.set('assessment_inquiry', {
      keywords: ['assessment', 'evaluate', 'test', 'measure', 'score', 'performance'],
      category: 'assessment',
      confidence: 0.9
    });
    
    // Growth planning
    patterns.set('growth_planning', {
      keywords: ['growth', 'plan', 'strategy', 'roadmap', 'goals', 'objectives'],
      category: 'planning',
      confidence: 0.85
    });
    
    // Market intelligence
    patterns.set('market_analysis', {
      keywords: ['market', 'competition', 'industry', 'trends', 'analysis'],
      category: 'intelligence',
      confidence: 0.8
    });
    
    // Delegation
    patterns.set('delegation_request', {
      keywords: ['delegate', 'assign', 'team', 'collaboration', 'distribute'],
      category: 'delegation',
      confidence: 0.8
    });
    
    // Feedback
    patterns.set('feedback', {
      keywords: ['feedback', 'review', 'opinion', 'thoughts', 'suggestions'],
      category: 'feedback',
      confidence: 0.8
    });
    
    // Complaints
    patterns.set('complaint', {
      keywords: ['problem', 'issue', 'bug', 'error', 'wrong', 'broken'],
      category: 'support',
      confidence: 0.85
    });
    
    // Farewell
    patterns.set('farewell', {
      keywords: ['goodbye', 'bye', 'see you', 'thanks', 'thank you'],
      category: 'social',
      confidence: 0.9
    });
    
    return patterns;
  }

  private calculateIntentConfidence(text: string, pattern: any): number {
    let matchScore = 0;
    const words = text.split(/\s+/);
    const totalWords = words.length;
    
    for (const keyword of pattern.keywords) {
      if (text.includes(keyword)) {
        matchScore += 1;
      }
    }
    
    // Normalize score
    const normalizedScore = matchScore / pattern.keywords.length;
    
    // Apply pattern confidence
    return Math.min(1, normalizedScore * pattern.confidence);
  }

  private extractEntities(text: string, intent: string): any[] {
    const entities = [];
    
    // Extract dates
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b|\btoday\b|\btomorrow\b|\byesterday\b/gi;
    const dates = text.match(dateRegex);
    if (dates) {
      dates.forEach(date => {
        entities.push({
          entity: 'date',
          value: date,
          confidence: 0.9,
          type: 'date' as const
        });
      });
    }
    
    // Extract numbers
    const numberRegex = /\b\d+(\.\d+)?\b/g;
    const numbers = text.match(numberRegex);
    if (numbers) {
      numbers.forEach(number => {
        entities.push({
          entity: 'number',
          value: parseFloat(number),
          confidence: 0.8,
          type: 'number' as const
        });
      });
    }
    
    // Extract organizations (simplified)
    const orgKeywords = ['company', 'corporation', 'inc', 'llc', 'ltd'];
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      if (orgKeywords.some(keyword => words[i].toLowerCase().includes(keyword))) {
        entities.push({
          entity: 'organization',
          value: words[i],
          confidence: 0.7,
          type: 'organization' as const
        });
      }
    }
    
    return entities;
  }

  private getIntentDescription(intent: string): string {
    const descriptions = {
      greeting: 'User is greeting or starting conversation',
      information_request: 'User is seeking information or explanation',
      help_request: 'User needs assistance or support',
      assessment_inquiry: 'User is asking about assessments or evaluations',
      growth_planning: 'User is interested in growth planning or strategy',
      market_analysis: 'User wants market intelligence or analysis',
      delegation_request: 'User wants to delegate tasks or manage team',
      feedback: 'User is providing feedback or wants to give opinion',
      complaint: 'User is reporting a problem or issue',
      farewell: 'User is ending conversation or saying goodbye',
      general_inquiry: 'General question or conversation'
    };
    
    return descriptions[intent] || 'Unknown intent';
  }

  private getAlternativeReasoning(intent: string, confidence: number): string {
    if (confidence > 0.5) {
      return `High similarity to ${intent} pattern`;
    } else if (confidence > 0.3) {
      return `Moderate similarity to ${intent} pattern`;
    } else {
      return `Low similarity to ${intent} pattern`;
    }
  }

  private determineConversationStage(text: string, previousIntents: string[]): any {
    const greetings = ['hello', 'hi', 'hey'];
    const farewells = ['goodbye', 'bye', 'thanks'];
    
    if (greetings.some(g => text.toLowerCase().includes(g))) {
      return 'greeting';
    }
    
    if (farewells.some(f => text.toLowerCase().includes(f))) {
      return 'closing';
    }
    
    if (previousIntents.length === 0) {
      return 'greeting';
    } else if (previousIntents.length < 3) {
      return 'information_gathering';
    } else if (text.includes('?')) {
      return 'clarification';
    } else {
      return 'resolution';
    }
  }

  private detectUserMood(text: string): any {
    const positiveWords = ['great', 'awesome', 'excellent', 'good', 'happy', 'love'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'frustrated', 'angry'];
    const excitedWords = ['amazing', 'fantastic', 'incredible', 'wow', '!'];
    const frustratedWords = ['stuck', 'confused', 'difficult', 'hard', 'problem'];
    
    const textLower = text.toLowerCase();
    
    if (excitedWords.some(word => textLower.includes(word)) || text.includes('!')) {
      return 'excited';
    } else if (frustratedWords.some(word => textLower.includes(word))) {
      return 'frustrated';
    } else if (positiveWords.some(word => textLower.includes(word))) {
      return 'positive';
    } else if (negativeWords.some(word => textLower.includes(word))) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  private assessUrgency(text: string): any {
    const urgentWords = ['urgent', 'asap', 'emergency', 'immediately', 'now'];
    const highWords = ['soon', 'quickly', 'fast', 'priority'];
    
    const textLower = text.toLowerCase();
    
    if (urgentWords.some(word => textLower.includes(word))) {
      return 'urgent';
    } else if (highWords.some(word => textLower.includes(word))) {
      return 'high';
    } else if (text.includes('?')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private assessComplexity(text: string): any {
    const complexWords = ['complex', 'complicated', 'detailed', 'comprehensive', 'advanced'];
    const simpleWords = ['simple', 'basic', 'easy', 'quick'];
    
    const textLower = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;
    
    if (complexWords.some(word => textLower.includes(word)) || wordCount > 20) {
      return 'complex';
    } else if (simpleWords.some(word => textLower.includes(word)) || wordCount < 5) {
      return 'simple';
    } else {
      return 'moderate';
    }
  }

  private identifyDomainFocus(text: string): string[] {
    const domains = {
      'business': ['business', 'company', 'revenue', 'profit', 'growth'],
      'technology': ['tech', 'software', 'system', 'digital', 'automation'],
      'marketing': ['marketing', 'brand', 'customer', 'campaign', 'promotion'],
      'finance': ['finance', 'money', 'budget', 'investment', 'cost'],
      'operations': ['operations', 'process', 'workflow', 'efficiency', 'productivity'],
      'strategy': ['strategy', 'plan', 'goal', 'objective', 'vision'],
      'analytics': ['data', 'analytics', 'metrics', 'performance', 'insights']
    };
    
    const textLower = text.toLowerCase();
    const focusAreas = [];
    
    for (const [domain, keywords] of Object.entries(domains)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        focusAreas.push(domain);
      }
    }
    
    return focusAreas.length > 0 ? focusAreas : ['general'];
  }

  private suggestActions(primaryIntent: any, contextAnalysis: any): any[] {
    const actions = [];
    
    switch (primaryIntent.intent) {
      case 'information_request':
        actions.push({
          action: 'Provide detailed information',
          priority: 'high' as const,
          reasoning: 'User is seeking specific information'
        });
        break;
      case 'help_request':
        actions.push({
          action: 'Offer assistance and guidance',
          priority: 'high' as const,
          reasoning: 'User needs support'
        });
        break;
      case 'assessment_inquiry':
        actions.push({
          action: 'Guide to assessment features',
          priority: 'medium' as const,
          reasoning: 'User interested in assessments'
        });
        break;
      case 'growth_planning':
        actions.push({
          action: 'Initiate growth planning flow',
          priority: 'medium' as const,
          reasoning: 'User wants to plan growth strategy'
        });
        break;
      case 'complaint':
        actions.push({
          action: 'Address issue and provide solution',
          priority: 'high' as const,
          reasoning: 'User has a problem that needs resolution'
        });
        break;
      default:
        actions.push({
          action: 'Engage in general conversation',
          priority: 'low' as const,
          reasoning: 'Standard conversational response'
        });
    }
    
    // Adjust based on urgency
    if (contextAnalysis.urgency === 'urgent') {
      actions.forEach(action => {
        if (action.priority !== 'high') {
          action.priority = 'high';
        }
      });
    }
    
    return actions;
  }

  private determineResponseStrategy(primaryIntent: any, contextAnalysis: any): any {
    if (contextAnalysis.complexity === 'complex' || contextAnalysis.urgency === 'urgent') {
      return 'escalation';
    } else if (primaryIntent.confidence < 0.7) {
      return 'clarifying_question';
    } else if (['assessment_inquiry', 'growth_planning', 'delegation_request'].includes(primaryIntent.intent)) {
      return 'guided_flow';
    } else {
      return 'direct_answer';
    }
  }

  private suggestNextSteps(primaryIntent: any, contextAnalysis: any): string[] {
    const steps = [];
    
    switch (primaryIntent.intent) {
      case 'information_request':
        steps.push('Provide comprehensive answer');
        steps.push('Ask if user needs clarification');
        break;
      case 'help_request':
        steps.push('Understand specific problem');
        steps.push('Offer step-by-step guidance');
        steps.push('Provide additional resources');
        break;
      case 'assessment_inquiry':
        steps.push('Explain assessment options');
        steps.push('Guide to assessment setup');
        steps.push('Schedule assessment if needed');
        break;
      case 'growth_planning':
        steps.push('Gather business information');
        steps.push('Identify growth goals');
        steps.push('Create initial roadmap');
        break;
      default:
        steps.push('Continue conversation');
        steps.push('Offer additional assistance');
    }
    
    return steps;
  }

  /**
   * Get fallback intent result
   */
  private getFallbackIntentResult(request: IntentRecognitionRequest): IntentRecognitionResult {
    return {
      primaryIntent: {
        intent: 'general_inquiry',
        confidence: 0.5,
        category: 'general',
        description: 'General conversation or inquiry',
        entities: []
      },
      alternativeIntents: [],
      contextAnalysis: {
        conversationStage: 'information_gathering',
        userMood: 'neutral',
        urgency: 'low',
        complexity: 'simple',
        domainFocus: ['general']
      },
      recommendations: {
        suggestedActions: [{
          action: 'Engage in general conversation',
          priority: 'low',
          reasoning: 'Fallback response for unrecognized intent'
        }],
        responseStrategy: 'direct_answer',
        nextSteps: ['Continue conversation', 'Offer assistance']
      }
    };
  }

  /**
   * Initialize intent recognition models
   */
  private initializeModels(): void {
    // Initialize intent classification models
    this.intentClassifier.set('patterns', this.getIntentPatterns());
    this.entityExtractor.set('extractors', ['date', 'number', 'organization', 'person']);
    this.contextAnalyzer.set('analyzers', ['mood', 'urgency', 'complexity', 'domain']);
  }
}
