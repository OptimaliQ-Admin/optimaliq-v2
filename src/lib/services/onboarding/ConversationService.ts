import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';
import { ConversationMessage, OnboardingSession } from '@/lib/types/database';
import { OnboardingAIService, OnboardingInsight, AdaptiveQuestion, PredictiveRecommendation } from '@/lib/ai/services/onboarding';

export interface ConversationContext {
  sessionId: string;
  userId: string;
  currentStep: string;
  progressPercentage: number;
  previousMessages: ConversationMessage[];
  userProfile: {
    industry: string | null;
    businessModel: string | null;
    companySize: string | null;
    revenueRange: string | null;
  };
  currentFocus: string;
  previousResponses: Record<string, any>;
}

export interface UserIntent {
  type: 'question' | 'answer' | 'clarification' | 'concern' | 'ready_to_proceed';
  confidence: number;
  entities: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface AIResponse {
  text: string;
  confidence: number;
  followUpQuestions?: string[];
  insights?: any[];
  suggestions?: string[];
  nextStep?: string;
}

export class ConversationService {
  private supabase: ReturnType<typeof createClient<Database>>;
  private aiService: OnboardingAIService;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
    this.aiService = new OnboardingAIService();
  }

  // Create a new onboarding session
  async createSession(userId: string, organizationId?: string): Promise<OnboardingSession> {
    const { data: session, error } = await this.supabase
      .from('onboarding_sessions')
      .insert({
        user_id: userId,
        organization_id: organizationId,
        session_type: 'conversational',
        status: 'active',
        current_step: 'welcome',
        progress_percentage: 0,
        metadata: {
          started_at: new Date().toISOString(),
          interface_mode: 'conversational',
          ai_version: 'world_class_v2'
        }
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create onboarding session: ${error.message}`);
    }

    // Create initial welcome message using AI
    const welcomeResponse = await this.aiService.generateAIResponse(
      "Hello, I'm ready to start my business consultation",
      { type: 'ready_to_proceed', confidence: 1.0, entities: [], sentiment: 'positive' },
      {
        sessionId: session.id,
        userId,
        currentStep: 'welcome',
        progressPercentage: 0,
        previousMessages: [],
        userProfile: { industry: null, businessModel: null, companySize: null, revenueRange: null },
        currentFocus: 'welcome',
        previousResponses: {}
      }
    );

    await this.addMessage(session.id, 'ai_response', {
      text: welcomeResponse.text,
      type: 'welcome',
      suggestions: welcomeResponse.suggestions || ['Tell me about your business', 'I run a SaaS company', 'We provide consulting services'],
      insights: welcomeResponse.insights || []
    });

    return session;
  }

  // Add a message to the conversation
  async addMessage(
    sessionId: string,
    messageType: 'user_input' | 'ai_response' | 'insight' | 'question',
    content: any,
    intent?: UserIntent
  ): Promise<ConversationMessage> {
    const { data: message, error } = await this.supabase
      .from('conversation_messages')
      .insert({
        session_id: sessionId,
        message_type: messageType,
        content,
        intent: intent?.type || null,
        confidence_score: intent?.confidence || null,
        metadata: {
          timestamp: new Date().toISOString(),
          intent: intent || null
        }
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add message: ${error.message}`);
    }

    return message;
  }

  // Process user input and generate AI response
  async processUserInput(sessionId: string, userInput: string): Promise<AIResponse> {
    // Get conversation context
    const context = await this.getConversationContext(sessionId);
    
    // Analyze user intent using AI
    const intent = await this.aiService.analyzeUserIntent(userInput, context);
    
    // Add user message to conversation
    await this.addMessage(sessionId, 'user_input', {
      text: userInput,
      timestamp: new Date().toISOString()
    }, intent);

    // Generate AI response using advanced AI service
    const response = await this.aiService.generateAIResponse(userInput, intent, context);
    
    // Generate real-time insights
    const insights = await this.aiService.generateRealTimeInsights(userInput, context);
    
    // Add insights to database
    for (const insight of insights) {
      await this.addInsight(sessionId, insight);
    }
    
    // Add AI response to conversation
    await this.addMessage(sessionId, 'ai_response', {
      text: response.text,
      suggestions: response.suggestions,
      nextStep: response.nextStep,
      insights: insights,
      timestamp: new Date().toISOString()
    });

    // Update session progress
    await this.updateSessionProgress(sessionId, context);

    return response;
  }

  // Add insight to database
  private async addInsight(sessionId: string, insight: OnboardingInsight): Promise<void> {
    await this.supabase
      .from('real_time_insights')
      .insert({
        session_id: sessionId,
        insight_type: insight.type,
        insight_data: {
          title: insight.title,
          description: insight.description,
          actionable: insight.actionable,
          priority: insight.priority,
          data: insight.data
        },
        confidence_score: insight.confidence,
        relevance_score: insight.priority === 'high' ? 0.9 : insight.priority === 'medium' ? 0.7 : 0.5,
        actionability_score: insight.actionable ? 0.8 : 0.3,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'ai_analysis'
        }
      });
  }

  // Generate adaptive question
  async generateAdaptiveQuestion(sessionId: string): Promise<AdaptiveQuestion> {
    const context = await this.getConversationContext(sessionId);
    return await this.aiService.generateAdaptiveQuestion(context);
  }

  // Generate predictive recommendations
  async generatePredictiveRecommendations(sessionId: string): Promise<PredictiveRecommendation[]> {
    const context = await this.getConversationContext(sessionId);
    return await this.aiService.generatePredictiveRecommendations(context);
  }

  // Get conversation context
  private async getConversationContext(sessionId: string): Promise<ConversationContext> {
    // Get session
    const { data: session, error: sessionError } = await this.supabase
      .from('onboarding_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      throw new Error(`Failed to get session: ${sessionError.message}`);
    }

    // Get conversation messages
    const { data: messages, error: messagesError } = await this.supabase
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      throw new Error(`Failed to get messages: ${messagesError.message}`);
    }

    // Get user profile
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('industry, company, company_size, revenue_range')
      .eq('id', session.user_id)
      .single();

    if (userError) {
      throw new Error(`Failed to get user: ${userError.message}`);
    }

    // Extract previous responses from messages using AI analysis
    const previousResponses: Record<string, any> = {};
    messages.forEach(message => {
      if (message.message_type === 'user_input' && message.content.text) {
        // Use AI to extract business information
        this.extractBusinessInfo(message.content.text, previousResponses);
      }
    });

    return {
      sessionId,
      userId: session.user_id!,
      currentStep: session.current_step || 'welcome',
      progressPercentage: session.progress_percentage || 0,
      previousMessages: messages,
      userProfile: {
        industry: user.industry,
        businessModel: previousResponses.businessModel || null,
        companySize: user.company_size,
        revenueRange: user.revenue_range
      },
      currentFocus: this.determineCurrentFocus(messages),
      previousResponses
    };
  }

  // Extract business information from user input
  private extractBusinessInfo(text: string, previousResponses: Record<string, any>): void {
    const lowerText = text.toLowerCase();
    
    // Extract business model
    if (lowerText.includes('saas') || lowerText.includes('software') || lowerText.includes('app')) {
      previousResponses.businessModel = 'saas';
    } else if (lowerText.includes('consulting') || lowerText.includes('service')) {
      previousResponses.businessModel = 'consulting';
    } else if (lowerText.includes('ecommerce') || lowerText.includes('retail') || lowerText.includes('product')) {
      previousResponses.businessModel = 'ecommerce';
    } else if (lowerText.includes('agency') || lowerText.includes('marketing')) {
      previousResponses.businessModel = 'agency';
    }

    // Extract industry
    if (lowerText.includes('tech') || lowerText.includes('technology')) {
      previousResponses.industry = 'technology';
    } else if (lowerText.includes('health') || lowerText.includes('medical')) {
      previousResponses.industry = 'healthcare';
    } else if (lowerText.includes('finance') || lowerText.includes('banking')) {
      previousResponses.industry = 'finance';
    } else if (lowerText.includes('education') || lowerText.includes('learning')) {
      previousResponses.industry = 'education';
    }

    // Extract goals
    if (lowerText.includes('grow') || lowerText.includes('scale') || lowerText.includes('expand')) {
      previousResponses.goals = previousResponses.goals || [];
      previousResponses.goals.push('growth');
    }
    if (lowerText.includes('revenue') || lowerText.includes('sales') || lowerText.includes('profit')) {
      previousResponses.goals = previousResponses.goals || [];
      previousResponses.goals.push('revenue');
    }
    if (lowerText.includes('team') || lowerText.includes('hire') || lowerText.includes('employee')) {
      previousResponses.goals = previousResponses.goals || [];
      previousResponses.goals.push('team');
    }

    // Extract challenges
    if (lowerText.includes('funding') || lowerText.includes('money') || lowerText.includes('capital')) {
      previousResponses.challenges = previousResponses.challenges || [];
      previousResponses.challenges.push('funding');
    }
    if (lowerText.includes('customer') || lowerText.includes('client') || lowerText.includes('acquisition')) {
      previousResponses.challenges = previousResponses.challenges || [];
      previousResponses.challenges.push('customer_acquisition');
    }
    if (lowerText.includes('competition') || lowerText.includes('competitor')) {
      previousResponses.challenges = previousResponses.challenges || [];
      previousResponses.challenges.push('competition');
    }
  }

  // Update session progress
  private async updateSessionProgress(sessionId: string, context: ConversationContext): Promise<void> {
    const messageCount = context.previousMessages.length;
    const progressPercentage = Math.min((messageCount / 20) * 100, 100); // Estimate 20 messages for completion

    const { error } = await this.supabase
      .from('onboarding_sessions')
      .update({
        progress_percentage: progressPercentage,
        current_step: context.currentFocus,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Failed to update session progress:', error);
    }
  }

  // Determine current focus based on conversation
  private determineCurrentFocus(messages: ConversationMessage[]): string {
    const userMessages = messages.filter(m => m.message_type === 'user_input');
    
    if (userMessages.length === 0) return 'welcome';
    if (userMessages.length === 1) return 'business_model';
    if (userMessages.length === 2) return 'goals';
    if (userMessages.length === 3) return 'challenges';
    if (userMessages.length === 4) return 'differentiation';
    if (userMessages.length === 5) return 'market';
    if (userMessages.length === 6) return 'operations';
    if (userMessages.length === 7) return 'team';
    if (userMessages.length === 8) return 'finances';
    if (userMessages.length === 9) return 'strategy';
    if (userMessages.length === 10) return 'summary';
    
    return 'completion';
  }

  // Get session by ID
  async getSession(sessionId: string): Promise<OnboardingSession | null> {
    const { data: session, error } = await this.supabase
      .from('onboarding_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Failed to get session:', error);
      return null;
    }

    return session;
  }

  // Get conversation messages
  async getConversationMessages(sessionId: string): Promise<ConversationMessage[]> {
    const { data: messages, error } = await this.supabase
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to get messages:', error);
      return [];
    }

    return messages || [];
  }

  // Get real-time insights for session
  async getRealTimeInsights(sessionId: string): Promise<any[]> {
    const { data: insights, error } = await this.supabase
      .from('real_time_insights')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get insights:', error);
      return [];
    }

    return insights || [];
  }

  // Complete session
  async completeSession(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('onboarding_sessions')
      .update({
        status: 'completed',
        progress_percentage: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) {
      throw new Error(`Failed to complete session: ${error.message}`);
    }
  }
} 