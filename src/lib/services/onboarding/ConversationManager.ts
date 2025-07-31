import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';
import { BusinessIntelligenceEngine } from './BusinessIntelligenceEngine';

export interface UserResponse {
  sessionId: string;
  questionId: string;
  answer: string | string[] | number;
  timestamp: string;
  context?: any;
}

export interface ConversationMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    questionId?: string;
    personality?: string;
    insights?: string[];
    nextQuestion?: string;
  };
}

export interface ConversationState {
  sessionId: string;
  currentPhase: 'introduction' | 'discovery' | 'deep_dive' | 'synthesis' | 'completion';
  context: BusinessContext;
  userPersona: UserPersona;
  conversationHistory: ConversationMessage[];
  activeQuestion: QuestionNode | null;
  nextQuestions: QuestionNode[];
  insights: RealTimeInsight[];
  progress: number;
}

export interface BusinessContext {
  industry?: string;
  companySize?: string;
  revenueRange?: string;
  growthStage?: string;
  primaryChallenges?: string[];
  goals?: string[];
  currentMetrics?: Record<string, any>;
  responses: Record<string, any>;
}

export interface UserPersona {
  communicationStyle: 'direct' | 'detailed' | 'casual' | 'formal';
  expertiseLevel: 'beginner' | 'intermediate' | 'expert';
  decisionMakingStyle: 'data-driven' | 'intuitive' | 'collaborative';
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface QuestionNode {
  id: string;
  type: 'conversation' | 'multi_choice' | 'text_input' | 'ranking' | 'conditional';
  content: string;
  context: string;
  personality: 'consultant' | 'analyst' | 'strategist' | 'mentor';
  options?: QuestionOption[];
  followUps: ConditionalQuestion[];
  insights: InsightGenerator[];
  required: boolean;
  order: number;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  followUpQuestions?: string[];
}

export interface ConditionalQuestion {
  condition: (context: BusinessContext) => boolean;
  questionId: string;
  priority: number;
}

export interface InsightGenerator {
  type: 'pattern' | 'opportunity' | 'risk' | 'benchmark' | 'trend';
  condition: (response: any, context: BusinessContext) => boolean;
  generate: (response: any, context: BusinessContext) => string;
}

export interface RealTimeInsight {
  id: string;
  type: 'pattern' | 'opportunity' | 'risk' | 'benchmark' | 'trend';
  content: string;
  confidence: number;
  dataPoints: string[];
  recommendations: string[];
  timestamp: string;
}

export class ConversationManager {
  private supabase: any;
  private questionTree: QuestionNode[];
  private businessIntelligence: BusinessIntelligenceEngine;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
    this.questionTree = this.initializeQuestionTree();
    this.businessIntelligence = new BusinessIntelligenceEngine();
  }

  private initializeQuestionTree(): QuestionNode[] {
    return [
      {
        id: 'welcome',
        type: 'conversation',
        content: "Hi! I'm your business growth consultant. I'm here to help you discover your biggest growth opportunities and create a strategic roadmap. Let's start by understanding your business better. What's the biggest challenge you're facing right now in growing your business?",
        context: 'Introduction and initial challenge identification',
        personality: 'consultant',
        followUps: [],
        insights: [],
        required: true,
        order: 1
      },
      {
        id: 'challenge_followup',
        type: 'multi_choice',
        content: "That's a common challenge! I'm seeing some interesting patterns here. Let me understand your current approach better. Which of these resonates most with your situation?",
        context: 'Understanding current approach to the identified challenge',
        personality: 'analyst',
        options: [
          {
            value: 'loyalty_program',
            label: 'We have a loyalty program',
            description: 'We offer rewards, points, or membership benefits',
            followUpQuestions: ['retention_rate', 'loyalty_effectiveness']
          },
          {
            value: 'customer_service',
            label: 'We focus on customer service',
            description: 'We prioritize excellent customer support and experience',
            followUpQuestions: ['service_metrics', 'customer_satisfaction']
          },
          {
            value: 'unsure',
            label: 'We\'re not sure what to do',
            description: 'We haven\'t implemented a specific strategy yet',
            followUpQuestions: ['business_maturity', 'resource_availability']
          },
          {
            value: 'other',
            label: 'Other approach',
            description: 'We have a different strategy',
            followUpQuestions: ['custom_approach', 'strategy_details']
          }
        ],
        followUps: [],
        insights: [
          {
            type: 'pattern',
            condition: (response) => response === 'loyalty_program',
            generate: () => "I see you're using a loyalty program approach. This is often effective for retention, but let's see how it's performing for you."
          }
        ],
        required: true,
        order: 2
      },
      {
        id: 'retention_rate',
        type: 'text_input',
        content: "Great! Loyalty programs can be powerful. I'm curious - what's your current retention rate, and how do you measure it?",
        context: 'Understanding current retention metrics',
        personality: 'strategist',
        followUps: [],
        insights: [
          {
            type: 'benchmark',
            condition: (response, context) => {
              const rate = parseFloat(response);
              return !isNaN(rate);
            },
            generate: (response) => {
              const rate = parseFloat(response);
              if (rate >= 70) return "That's excellent! You're well above industry averages.";
              if (rate >= 50) return "That's solid! You're performing well compared to most businesses.";
              return "I see some opportunities here. Let's work on improving this together.";
            }
          }
        ],
        required: true,
        order: 3
      },
      {
        id: 'growth_strategy',
        type: 'multi_choice',
        content: "Now let's talk about growth. What's your primary method for acquiring new customers?",
        context: 'Understanding customer acquisition strategy',
        personality: 'consultant',
        options: [
          {
            value: 'digital_marketing',
            label: 'Digital Marketing',
            description: 'SEO, PPC, social media, content marketing',
            followUpQuestions: ['marketing_budget', 'channel_effectiveness']
          },
          {
            value: 'referrals',
            label: 'Referrals & Word of Mouth',
            description: 'Customer referrals, partnerships, networking',
            followUpQuestions: ['referral_program', 'partnership_network']
          },
          {
            value: 'sales_team',
            label: 'Sales Team',
            description: 'Direct sales, outbound, account management',
            followUpQuestions: ['sales_process', 'team_size']
          },
          {
            value: 'organic',
            label: 'Organic Growth',
            description: 'Natural growth, minimal marketing spend',
            followUpQuestions: ['growth_rate', 'scalability_concerns']
          }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 4
      },
      {
        id: 'priority_ranking',
        type: 'ranking',
        content: "Based on our conversation, I'd like to understand your priorities. Please rank these business areas by importance to you:",
        context: 'Understanding business priorities and focus areas',
        personality: 'strategist',
        options: [
          {
            value: 'customer_retention',
            label: 'Customer Retention',
            description: 'Keeping existing customers happy and engaged'
          },
          {
            value: 'customer_acquisition',
            label: 'Customer Acquisition',
            description: 'Finding and converting new customers'
          },
          {
            value: 'product_development',
            label: 'Product Development',
            description: 'Improving and expanding your product/service'
          },
          {
            value: 'team_growth',
            label: 'Team Growth',
            description: 'Building and scaling your team'
          },
          {
            value: 'operational_efficiency',
            label: 'Operational Efficiency',
            description: 'Streamlining processes and reducing costs'
          }
        ],
        followUps: [],
        insights: [
          {
            type: 'pattern',
            condition: (response, context) => {
              const rankings = response as string[];
              return rankings[0] === 'customer_retention';
            },
            generate: () => "I see you prioritize customer retention. This aligns perfectly with sustainable growth strategies."
          }
        ],
        required: true,
        order: 5
      },
      {
        id: 'business_maturity',
        type: 'conditional',
        content: "Let me understand your business maturity level better. How long have you been in business?",
        context: 'Understanding business maturity and experience',
        personality: 'analyst',
        options: [
          {
            value: 'under_1_year',
            label: 'Under 1 year',
            description: 'Early startup phase',
            followUpQuestions: ['funding_status', 'product_market_fit']
          },
          {
            value: '1_3_years',
            label: '1-3 years',
            description: 'Growth phase',
            followUpQuestions: ['scaling_challenges', 'team_size']
          },
          {
            value: '3_5_years',
            label: '3-5 years',
            description: 'Established business',
            followUpQuestions: ['market_expansion', 'competitive_position']
          },
          {
            value: '5_plus_years',
            label: '5+ years',
            description: 'Mature business',
            followUpQuestions: ['innovation_focus', 'market_leadership']
          }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 6
      }
    ];
  }

  async processUserResponse(response: UserResponse): Promise<ConversationUpdate> {
    try {
      // Save the response to the database
      await this.saveResponse(response);

      // Get current conversation state
      const state = await this.getConversationState(response.sessionId);

      // Update business context with the response
      const updatedContext = this.updateBusinessContext(state.context, response);

      // Analyze the response for insights
      const insights = await this.generateInsights(response, updatedContext);

      // Determine the next question based on response and context
      const nextQuestion = await this.determineNextQuestion(response, updatedContext, state);

      // Update conversation state
      const updatedState: ConversationState = {
        ...state,
        context: updatedContext,
        insights: [...state.insights, ...insights],
        activeQuestion: nextQuestion,
        progress: this.calculateProgress(updatedContext)
      };

      // Save updated state
      await this.saveConversationState(updatedState);

      // Generate AI response message
      const aiMessage = await this.generateAIResponse(response, nextQuestion, insights);

      return {
        state: updatedState,
        aiMessage,
        nextQuestion,
        insights
      };

    } catch (error) {
      console.error('Error processing user response:', error);
      throw new Error('Failed to process user response');
    }
  }

  private async saveResponse(response: UserResponse): Promise<void> {
    const { error } = await this.supabase
      .from('onboarding_responses')
      .insert({
        session_id: response.sessionId,
        question_id: response.questionId,
        answer: response.answer,
        timestamp: response.timestamp,
        context: response.context
      });

    if (error) throw error;
  }

  private async getConversationState(sessionId: string): Promise<ConversationState> {
    // Get session data
    const { data: session } = await this.supabase
      .from('onboarding_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    // Get conversation history
    const { data: messages } = await this.supabase
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    // Get responses
    const { data: responses } = await this.supabase
      .from('onboarding_responses')
      .select('*')
      .eq('session_id', sessionId);

    // Build context from responses
    const context: BusinessContext = {
      responses: {},
      ...responses?.reduce((acc: any, response: any) => {
        acc.responses[response.question_id] = response.answer;
        return acc;
      }, {} as any)
    };

    return {
      sessionId,
      currentPhase: session?.current_step || 'introduction',
      context,
      userPersona: this.analyzeUserPersona(messages || []),
      conversationHistory: messages || [],
      activeQuestion: null,
      nextQuestions: [],
      insights: [],
      progress: 0
    };
  }

  private updateBusinessContext(context: BusinessContext, response: UserResponse): BusinessContext {
    return {
      ...context,
      responses: {
        ...context.responses,
        [response.questionId]: response.answer
      }
    };
  }

  private async generateInsights(response: UserResponse, context: BusinessContext): Promise<RealTimeInsight[]> {
    const insights: RealTimeInsight[] = [];
    const question = this.questionTree.find(q => q.id === response.questionId);

    // Generate insights from question-specific logic
    if (question) {
      for (const insightGenerator of question.insights) {
        if (insightGenerator.condition(response.answer, context)) {
          const content = insightGenerator.generate(response.answer, context);
          insights.push({
            id: `insight_${Date.now()}`,
            type: insightGenerator.type,
            content,
            confidence: 0.8,
            dataPoints: [response.questionId],
            recommendations: [],
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    // Generate real-time business intelligence insights
    const businessInsights = this.businessIntelligence.generateRealTimeInsights(
      response.answer,
      response.questionId,
      context
    );
    insights.push(...businessInsights);

    return insights;
  }

  private async determineNextQuestion(response: UserResponse, context: BusinessContext, state: ConversationState): Promise<QuestionNode | null> {
    const currentQuestion = this.questionTree.find(q => q.id === response.questionId);
    
    if (!currentQuestion) return null;

    // Check for follow-up questions based on the response
    const followUps = currentQuestion.options?.find(opt => opt.value === response.answer)?.followUpQuestions || [];
    
    if (followUps.length > 0) {
      const nextQuestionId = followUps[0];
      return this.questionTree.find(q => q.id === nextQuestionId) || null;
    }

    // Get next question in sequence
    const nextQuestion = this.questionTree.find(q => q.order === currentQuestion.order + 1);
    
    return nextQuestion || null;
  }

  private calculateProgress(context: BusinessContext): number {
    const totalQuestions = this.questionTree.length;
    const answeredQuestions = Object.keys(context.responses).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }

  private analyzeUserPersona(messages: ConversationMessage[]): UserPersona {
    // Analyze communication style from message patterns
    const userMessages = messages.filter(m => m.type === 'user');
    const avgLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;
    
    let communicationStyle: 'direct' | 'detailed' | 'casual' | 'formal' = 'casual';
    if (avgLength > 100) communicationStyle = 'detailed';
    else if (avgLength < 30) communicationStyle = 'direct';

    return {
      communicationStyle,
      expertiseLevel: 'intermediate', // Default, can be refined
      decisionMakingStyle: 'data-driven', // Default, can be refined
      urgencyLevel: 'medium' // Default, can be refined
    };
  }

  private async generateAIResponse(response: UserResponse, nextQuestion: QuestionNode | null, insights: RealTimeInsight[]): Promise<ConversationMessage> {
    let content = '';

    // Add insights if any
    if (insights.length > 0) {
      content += insights.map(insight => insight.content).join(' ') + '\n\n';
    }

    // Add next question
    if (nextQuestion) {
      content += nextQuestion.content;
    } else {
      content += "Thank you for sharing all that information! I have a great understanding of your business now. Let me prepare your personalized growth strategy.";
    }

    return {
      id: `msg_${Date.now()}`,
      type: 'ai',
      content,
      timestamp: new Date().toISOString(),
      metadata: {
        questionId: nextQuestion?.id,
        personality: nextQuestion?.personality,
        insights: insights.map(i => i.content)
      }
    };
  }

  private async saveConversationState(state: ConversationState): Promise<void> {
    // Update session
    await this.supabase
      .from('onboarding_sessions')
      .update({
        current_step: state.currentPhase,
        progress_percentage: state.progress,
        metadata: {
          context: state.context,
          userPersona: state.userPersona
        }
      })
      .eq('id', state.sessionId);

    // Save insights
    for (const insight of state.insights) {
      await this.supabase
        .from('real_time_insights')
        .insert({
          session_id: state.sessionId,
          insight_type: insight.type,
          content: insight.content,
          confidence_score: insight.confidence,
          data_points: insight.dataPoints,
          recommendations: insight.recommendations
        });
    }
  }
}

export interface ConversationUpdate {
  state: ConversationState;
  aiMessage: ConversationMessage;
  nextQuestion: QuestionNode | null;
  insights: RealTimeInsight[];
} 