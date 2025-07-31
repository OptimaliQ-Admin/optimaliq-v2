import { getSmartAIClient } from '@/lib/ai/smartAIClient';
import { ConversationContext, UserIntent, AIResponse } from '@/lib/services/onboarding/ConversationService';

export interface OnboardingInsight {
  type: 'market' | 'competitive' | 'operational' | 'strategic';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
  data?: any;
}

export interface AdaptiveQuestion {
  id: string;
  type: 'business_model' | 'goals' | 'challenges' | 'differentiation' | 'market' | 'operations' | 'team' | 'finances';
  question: string;
  options?: string[];
  followUp?: string;
  relevanceScore: number;
  prerequisites: string[];
  estimatedTime: number;
}

export interface PredictiveRecommendation {
  type: 'immediate' | 'short_term' | 'long_term';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  confidence: number;
  reasoning: string;
}

export class OnboardingAIService {
  private aiClient: any;

  constructor() {
    // Initialize with a default AI client
    this.aiClient = getSmartAIClient({} as any);
  }

  // Enhanced intent analysis with AI
  async analyzeUserIntent(userInput: string, context: ConversationContext): Promise<UserIntent> {
    const data = {
      userInput,
      context: {
        currentStep: context.currentStep,
        industry: context.userProfile.industry || 'Unknown',
        businessModel: context.userProfile.businessModel || 'Unknown',
        previousResponses: context.previousResponses
      }
    };

    const analysisContext = `
      Analyze the user's intent in the context of a business onboarding conversation.
      
      Classify the intent as one of:
      - question: User is asking for information or clarification
      - answer: User is providing information about their business
      - clarification: User needs more explanation
      - concern: User expresses worry or problem
      - ready_to_proceed: User wants to move to next step
      
      Also analyze:
      - Confidence level (0-1)
      - Key entities mentioned
      - Sentiment (positive/neutral/negative)
    `;

    try {
      const response = await this.aiClient.analyze(data, analysisContext);
      
      // Extract intent from insights and recommendations
      const intentData = this.extractIntentFromAnalysis(response);
      return intentData;
    } catch (error) {
      console.error('Error analyzing user intent:', error);
      // Fallback to basic analysis
      return this.fallbackIntentAnalysis(userInput);
    }
  }

  // Generate context-aware AI responses
  async generateAIResponse(
    userInput: string,
    intent: UserIntent,
    context: ConversationContext
  ): Promise<AIResponse> {
    const data = {
      userInput,
      intent,
      context: {
        industry: context.userProfile.industry || 'Unknown',
        businessModel: context.userProfile.businessModel || 'Unknown',
        currentStep: context.currentStep,
        previousResponses: context.previousResponses
      }
    };

    const analysisContext = `
      You are an expert business strategist conducting a consultation with a business owner.
      
      Generate a helpful, strategic response that:
      1. Addresses their specific intent
      2. Builds on previous context
      3. Provides actionable insights
      4. Guides them toward the next step
      5. Maintains a conversational, expert tone
      
      Also provide:
      - 2-3 relevant follow-up suggestions
      - Next logical step in the onboarding process
      - Any immediate insights or observations
    `;

    try {
      const response = await this.aiClient.analyze(data, analysisContext);
      
      // Extract response from analysis
      const responseData = this.extractResponseFromAnalysis(response);
      return responseData;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.fallbackResponse(userInput, intent, context);
    }
  }

  // Generate real-time insights
  async generateRealTimeInsights(
    userInput: string,
    context: ConversationContext
  ): Promise<OnboardingInsight[]> {
    const data = {
      userInput,
      context: {
        industry: context.userProfile.industry || 'Unknown',
        businessModel: context.userProfile.businessModel || 'Unknown',
        companySize: context.userProfile.companySize || 'Unknown',
        revenueRange: context.userProfile.revenueRange || 'Unknown'
      }
    };

    const analysisContext = `
      Based on the user's input and business context, generate actionable insights.
      
      Generate insights in these categories:
      1. Market insights (opportunities, threats, trends)
      2. Competitive insights (differentiation, positioning)
      3. Operational insights (efficiency, processes)
      4. Strategic insights (growth, direction)
      
      For each insight, provide:
      - Type (market/competitive/operational/strategic)
      - Title
      - Description
      - Confidence (0-1)
      - Actionability (true/false)
      - Priority (high/medium/low)
    `;

    try {
      const response = await this.aiClient.analyze(data, analysisContext);
      return this.extractInsightsFromAnalysis(response);
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  // Generate adaptive questions
  async generateAdaptiveQuestion(context: ConversationContext): Promise<AdaptiveQuestion> {
    const data = {
      context: {
        currentStep: context.currentStep,
        industry: context.userProfile.industry || 'Unknown',
        businessModel: context.userProfile.businessModel || 'Unknown',
        previousResponses: context.previousResponses
      }
    };

    const analysisContext = `
      Generate the next most relevant question for this business onboarding session.
      
      Question types:
      - business_model: Understanding the core business
      - goals: Short and long-term objectives
      - challenges: Current pain points
      - differentiation: Competitive advantages
      - market: Target market and positioning
      - operations: Internal processes
      - team: People and culture
      - finances: Revenue and funding
      
      Generate a question that:
      1. Is most relevant to their current situation
      2. Builds on previous information
      3. Moves the conversation forward
      4. Provides actionable insights
    `;

    try {
      const response = await this.aiClient.analyze(data, analysisContext);
      return this.extractQuestionFromAnalysis(response);
    } catch (error) {
      console.error('Error generating adaptive question:', error);
      return this.fallbackQuestion(context);
    }
  }

  // Generate predictive recommendations
  async generatePredictiveRecommendations(
    context: ConversationContext
  ): Promise<PredictiveRecommendation[]> {
    const data = {
      context: {
        industry: context.userProfile.industry || 'Unknown',
        businessModel: context.userProfile.businessModel || 'Unknown',
        companySize: context.userProfile.companySize || 'Unknown',
        revenueRange: context.userProfile.revenueRange || 'Unknown',
        previousResponses: context.previousResponses
      }
    };

    const analysisContext = `
      Based on the business context and conversation so far, generate predictive recommendations.
      
      Generate recommendations in three categories:
      1. Immediate actions (can be done this week)
      2. Short-term strategies (next 3 months)
      3. Long-term opportunities (next 12 months)
      
      For each recommendation, provide:
      - Type (immediate/short_term/long_term)
      - Title
      - Description
      - Impact (high/medium/low)
      - Effort (high/medium/low)
      - Confidence (0-1)
      - Reasoning
    `;

    try {
      const response = await this.aiClient.analyze(data, analysisContext);
      return this.extractRecommendationsFromAnalysis(response);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  // Analyze business model and provide insights
  async analyzeBusinessModel(context: ConversationContext): Promise<any> {
    const prompt = `
      Analyze the business model based on the conversation context.
      
      Business Context:
      - Industry: ${context.userProfile.industry || 'Unknown'}
      - Business Model: ${context.userProfile.businessModel || 'Unknown'}
      - Company Size: ${context.userProfile.companySize || 'Unknown'}
      - Revenue Range: ${context.userProfile.revenueRange || 'Unknown'}
      - Previous Responses: ${JSON.stringify(context.previousResponses)}
      
      Provide analysis on:
      1. Business model strengths and weaknesses
      2. Revenue model optimization opportunities
      3. Customer acquisition strategy insights
      4. Operational efficiency recommendations
      5. Growth potential assessment
      
      Respond in JSON format with detailed analysis.
    `;

    try {
      const response = await this.aiClient.analyze(prompt);
      return JSON.parse(response.analysis);
    } catch (error) {
      console.error('Error analyzing business model:', error);
      return {};
    }
  }

  // Fallback methods for error handling
  private fallbackIntentAnalysis(userInput: string): UserIntent {
    const input = userInput.toLowerCase();
    
    let type: UserIntent['type'] = 'answer';
    let confidence = 0.7;
    const entities: string[] = [];
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';

    if (input.includes('?') || input.includes('what') || input.includes('how')) {
      type = 'question';
      confidence = 0.8;
    }

    if (input.includes('ready') || input.includes('continue')) {
      type = 'ready_to_proceed';
      sentiment = 'positive';
      confidence = 0.9;
    }

    return { type, confidence, entities, sentiment };
  }

  private fallbackResponse(
    userInput: string,
    intent: UserIntent,
    context: ConversationContext
  ): AIResponse {
    let responseText = "Thank you for sharing that information. Let's continue exploring your business strategy.";
    let suggestions = ['Tell me more about your goals', 'What challenges are you facing?', 'How do you differentiate?'];
    let nextStep = 'goals';

    if (intent.type === 'question') {
      responseText = "That's a great question. Let me help you understand this better.";
    }

    return {
      text: responseText,
      confidence: 0.7,
      suggestions,
      nextStep
    };
  }

  private fallbackQuestion(context: ConversationContext): AdaptiveQuestion {
    return {
      id: `fallback-${Date.now()}`,
      type: 'goals',
      question: "What are your primary business goals for the next 12 months?",
      options: ['Increase revenue', 'Expand team', 'Improve efficiency', 'Enter new markets'],
      relevanceScore: 0.8,
      prerequisites: [],
      estimatedTime: 30
    };
  }

  // Helper methods to extract data from AI analysis
  private extractIntentFromAnalysis(analysis: any): UserIntent {
    // Extract intent from insights and recommendations
    const insights = analysis.insights || [];
    const recommendations = analysis.recommendations || [];
    
    // Default values
    let type: UserIntent['type'] = 'answer';
    let confidence = analysis.confidence || 0.7;
    const entities: string[] = [];
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';

    // Analyze insights to determine intent
    insights.forEach((insight: string) => {
      const lowerInsight = insight.toLowerCase();
      if (lowerInsight.includes('question') || lowerInsight.includes('ask')) {
        type = 'question';
      } else if (lowerInsight.includes('clarify') || lowerInsight.includes('explain')) {
        type = 'clarification';
      } else if (lowerInsight.includes('concern') || lowerInsight.includes('worried')) {
        type = 'concern';
      } else if (lowerInsight.includes('ready') || lowerInsight.includes('continue')) {
        type = 'ready_to_proceed';
      }
    });

    // Determine sentiment
    const allText = [...insights, ...recommendations].join(' ').toLowerCase();
    if (allText.includes('positive') || allText.includes('good') || allText.includes('excellent')) {
      sentiment = 'positive';
    } else if (allText.includes('negative') || allText.includes('bad') || allText.includes('problem')) {
      sentiment = 'negative';
    }

    return { type, confidence, entities, sentiment };
  }

  private extractResponseFromAnalysis(analysis: any): AIResponse {
    // Extract response from insights and recommendations
    const insights = analysis.insights || [];
    const recommendations = analysis.recommendations || [];
    
    // Combine insights into response text
    const responseText = insights.length > 0 
      ? insights.join(' ') 
      : "Thank you for sharing that information. Let's continue exploring your business strategy.";

    // Generate suggestions from recommendations
    const suggestions = recommendations.slice(0, 3).map((rec: string) => {
      // Extract action items from recommendations
      if (rec.includes('consider')) return rec.replace('consider', 'Consider');
      if (rec.includes('focus')) return rec.replace('focus', 'Focus on');
      return rec;
    });

    return {
      text: responseText,
      confidence: analysis.confidence || 0.7,
      suggestions,
      nextStep: 'goals'
    };
  }

  private extractInsightsFromAnalysis(analysis: any): OnboardingInsight[] {
    const insights = analysis.insights || [];
    const recommendations = analysis.recommendations || [];
    
    // Convert insights and recommendations to OnboardingInsight format
    const onboardingInsights: OnboardingInsight[] = [];
    
    insights.forEach((insight: string, index: number) => {
      onboardingInsights.push({
        type: this.determineInsightType(insight),
        title: `Insight ${index + 1}`,
        description: insight,
        confidence: analysis.confidence || 0.7,
        actionable: insight.toLowerCase().includes('action') || insight.toLowerCase().includes('recommend'),
        priority: this.determinePriority(insight)
      });
    });

    recommendations.forEach((rec: string, index: number) => {
      onboardingInsights.push({
        type: 'strategic',
        title: `Recommendation ${index + 1}`,
        description: rec,
        confidence: analysis.confidence || 0.7,
        actionable: true,
        priority: 'high'
      });
    });

    return onboardingInsights;
  }

  private determineInsightType(insight: string): OnboardingInsight['type'] {
    const lowerInsight = insight.toLowerCase();
    if (lowerInsight.includes('market') || lowerInsight.includes('industry') || lowerInsight.includes('trend')) {
      return 'market';
    } else if (lowerInsight.includes('competitor') || lowerInsight.includes('differentiation') || lowerInsight.includes('positioning')) {
      return 'competitive';
    } else if (lowerInsight.includes('operation') || lowerInsight.includes('process') || lowerInsight.includes('efficiency')) {
      return 'operational';
    } else {
      return 'strategic';
    }
  }

  private determinePriority(insight: string): 'high' | 'medium' | 'low' {
    const lowerInsight = insight.toLowerCase();
    if (lowerInsight.includes('critical') || lowerInsight.includes('urgent') || lowerInsight.includes('immediate')) {
      return 'high';
    } else if (lowerInsight.includes('important') || lowerInsight.includes('significant')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private extractQuestionFromAnalysis(analysis: any): AdaptiveQuestion {
    const insights = analysis.insights || [];
    const recommendations = analysis.recommendations || [];
    
    // Extract question from insights
    const questionText = insights.length > 0 
      ? insights[0] 
      : "What are your primary business goals for the next 12 months?";
    
    // Generate options from recommendations
    const options = recommendations.slice(0, 4).map((rec: string) => {
      // Extract action items from recommendations
      if (rec.includes('consider')) return rec.replace('consider', 'Consider');
      if (rec.includes('focus')) return rec.replace('focus', 'Focus on');
      return rec;
    });

    return {
      id: `question-${Date.now()}`,
      type: 'goals',
      question: questionText,
      options: options.length > 0 ? options : ['Increase revenue', 'Expand team', 'Improve efficiency', 'Enter new markets'],
      relevanceScore: analysis.confidence || 0.8,
      prerequisites: [],
      estimatedTime: 30
    };
  }

  private extractRecommendationsFromAnalysis(analysis: any): PredictiveRecommendation[] {
    const insights = analysis.insights || [];
    const recommendations = analysis.recommendations || [];
    
    const predictiveRecommendations: PredictiveRecommendation[] = [];
    
    // Convert insights and recommendations to PredictiveRecommendation format
    insights.forEach((insight: string, index: number) => {
      predictiveRecommendations.push({
        type: this.determineRecommendationType(insight),
        title: `Insight ${index + 1}`,
        description: insight,
        impact: this.determineImpact(insight),
        effort: this.determineEffort(insight),
        confidence: analysis.confidence || 0.7,
        reasoning: `Based on analysis of business context and conversation`
      });
    });

    recommendations.forEach((rec: string, index: number) => {
      predictiveRecommendations.push({
        type: 'immediate',
        title: `Recommendation ${index + 1}`,
        description: rec,
        impact: 'high',
        effort: 'medium',
        confidence: analysis.confidence || 0.7,
        reasoning: `Strategic recommendation based on business analysis`
      });
    });

    return predictiveRecommendations;
  }

  private determineRecommendationType(insight: string): 'immediate' | 'short_term' | 'long_term' {
    const lowerInsight = insight.toLowerCase();
    if (lowerInsight.includes('immediate') || lowerInsight.includes('now') || lowerInsight.includes('this week')) {
      return 'immediate';
    } else if (lowerInsight.includes('short') || lowerInsight.includes('next 3 months') || lowerInsight.includes('quarter')) {
      return 'short_term';
    } else {
      return 'long_term';
    }
  }

  private determineImpact(insight: string): 'high' | 'medium' | 'low' {
    const lowerInsight = insight.toLowerCase();
    if (lowerInsight.includes('high') || lowerInsight.includes('significant') || lowerInsight.includes('major')) {
      return 'high';
    } else if (lowerInsight.includes('medium') || lowerInsight.includes('moderate')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private determineEffort(insight: string): 'high' | 'medium' | 'low' {
    const lowerInsight = insight.toLowerCase();
    if (lowerInsight.includes('complex') || lowerInsight.includes('difficult') || lowerInsight.includes('challenging')) {
      return 'high';
    } else if (lowerInsight.includes('moderate') || lowerInsight.includes('medium')) {
      return 'medium';
    } else {
      return 'low';
    }
  }
} 