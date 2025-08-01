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
  type: 'conversation' | 'multi_choice' | 'multi_select' | 'text_input' | 'ranking' | 'slider' | 'nps' | 'likert';
  content: string;
  context: string;
  personality: 'consultant' | 'analyst' | 'strategist' | 'mentor';
  phase: 'introduction' | 'discovery' | 'diagnosis' | 'roadmap';
  options?: QuestionOption[];
  maxSelect?: number; // For multi_select questions
  minValue?: number; // For slider questions
  maxValue?: number; // For slider questions
  step?: number; // For slider questions
  scale?: number; // For NPS/Likert questions
  followUps: ConditionalQuestion[];
  insights: InsightGenerator[];
  required: boolean;
  order: number;
  adaptiveLogic?: {
    condition: (context: BusinessContext, previousAnswers: Record<string, any>) => boolean;
    skipTo?: string;
    additionalQuestions?: string[];
  };
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
      // Group 1: Goals & Challenges
      {
        id: 'welcome',
        type: 'conversation',
        content: "Hi! I'm your business growth consultant. I'm here to help you discover your biggest growth opportunities and create a strategic roadmap. Let's start by understanding your business better. What's the biggest challenge you're facing right now in growing your business?",
        context: 'Introduction and initial challenge identification',
        personality: 'consultant',
        phase: 'introduction',
        followUps: [],
        insights: [
          {
            type: 'pattern',
            condition: (response) => response && response.length > 10,
            generate: () => "I see you're facing some real challenges. Let me understand your current approach better."
          }
        ],
        required: true,
        order: 1
      },
      {
        id: 'growth_metrics',
        type: 'multi_select',
        content: "What metrics do you track most closely to measure growth? Choose the KPIs that guide your key decisions today.",
        context: 'Understanding current focus and optimization priorities',
        personality: 'analyst',
        phase: 'discovery',
        maxSelect: 5,
        options: [
          { value: 'revenue', label: 'Revenue', description: 'Total sales and income' },
          { value: 'profit_margin', label: 'Profit Margin', description: 'Net profit as percentage of revenue' },
          { value: 'customer_ltv', label: 'Customer Lifetime Value (LTV)', description: 'Total value a customer brings over time' },
          { value: 'customer_acquisition_cost', label: 'Customer Acquisition Cost (CAC)', description: 'Cost to acquire a new customer' },
          { value: 'churn_rate', label: 'Customer Churn Rate', description: 'Rate at which customers leave' },
          { value: 'retention_rate', label: 'Customer Retention Rate', description: 'Rate at which customers stay' },
          { value: 'conversion_rate', label: 'Conversion Rate', description: 'Percentage of visitors who become customers' },
          { value: 'traffic', label: 'Website or App Traffic', description: 'Number of visitors to your platform' },
          { value: 'active_users', label: 'Monthly Active Users (MAU)', description: 'Users engaging with your product monthly' },
          { value: 'net_promoter_score', label: 'Net Promoter Score (NPS)', description: 'Customer satisfaction and loyalty metric' },
          { value: 'other', label: 'Other', description: 'Custom metrics specific to your business' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 2
      },
      {
        id: 'growth_metrics_other',
        type: 'text_input',
        content: "Please describe the other metric(s) you track",
        context: 'Understanding custom metrics',
        personality: 'analyst',
        phase: 'discovery',
        followUps: [],
        insights: [],
        required: false,
        order: 3
      },
      {
        id: 'gtm_strategy',
        type: 'text_input',
        content: "In one or two sentences, describe your go-to-market strategy. How do you attract, convert, and retain customers?",
        context: 'Understanding current market approach',
        personality: 'strategist',
        phase: 'discovery',
        followUps: [],
        insights: [],
        required: true,
        order: 4
      },
      {
        id: 'friction_points',
        type: 'multi_select',
        content: "What are the biggest friction points actively holding your business back? Select up to 3 areas where you're experiencing the most significant challenges.",
        context: 'Identifying current bottlenecks and challenges',
        personality: 'consultant',
        phase: 'discovery',
        maxSelect: 3,
        options: [
          { value: 'lack_funding', label: 'Lack of funding', description: 'Insufficient capital for growth initiatives' },
          { value: 'leadership_misalignment', label: 'Leadership misalignment', description: 'Conflicting priorities or vision among leaders' },
          { value: 'hiring_retention', label: 'Hiring or retention challenges', description: 'Difficulty finding or keeping key talent' },
          { value: 'operational_inefficiencies', label: 'Operational inefficiencies', description: 'Process bottlenecks or workflow issues' },
          { value: 'underperforming_marketing', label: 'Underperforming marketing', description: 'Low ROI on marketing spend or poor conversion' },
          { value: 'high_cac', label: 'High customer acquisition cost', description: 'Expensive customer acquisition relative to LTV' },
          { value: 'weak_retention', label: 'Weak customer retention', description: 'High churn or low customer loyalty' },
          { value: 'tech_stack_issues', label: 'Tech stack limitations', description: 'Technology constraints or integration problems' },
          { value: 'brand_positioning', label: 'Undefined brand positioning', description: 'Unclear market differentiation or messaging' },
          { value: 'market_saturation', label: 'Market saturation', description: 'Intense competition or limited market opportunity' },
          { value: 'regulatory_issues', label: 'Regulatory or compliance issues', description: 'Legal or compliance challenges' },
          { value: 'other', label: 'Other', description: 'Unique challenges specific to your business' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 5
      },
      {
        id: 'friction_points_other',
        type: 'text_input',
        content: "Please describe the other friction point(s)",
        context: 'Understanding unique challenges',
        personality: 'consultant',
        phase: 'discovery',
        followUps: [],
        insights: [],
        required: false,
        order: 6
      },

      // Group 2: Positioning
      {
        id: 'differentiator',
        type: 'text_input',
        content: "What makes your business hard to compete with? What do you do better, faster, or differently than others in your space?",
        context: 'Understanding competitive advantages and market positioning',
        personality: 'strategist',
        phase: 'discovery',
        followUps: [],
        insights: [],
        required: true,
        order: 7
      },
      {
        id: 'brand_perception',
        type: 'text_input',
        content: "How would your customers describe your brand in one sentence? Imagine you're reading an online review—what would they say?",
        context: 'Understanding brand perception and customer experience',
        personality: 'consultant',
        phase: 'discovery',
        followUps: [],
        insights: [],
        required: true,
        order: 8
      },
      {
        id: 'strategy_decision_method',
        type: 'multi_choice',
        content: "How do you currently make big strategic decisions? When facing big bets—new product, pricing changes, growth pivots—what guides your decision-making process?",
        context: 'Understanding decision-making approach',
        personality: 'strategist',
        phase: 'discovery',
        options: [
          { value: 'gut_feel', label: 'Mostly gut instinct or experience', description: 'Decisions based on intuition and past experience' },
          { value: 'data_driven', label: 'Primarily based on data and analytics', description: 'Decisions guided by metrics, testing, and analysis' },
          { value: 'team_alignment', label: 'Collective input and cross-functional alignment', description: 'Decisions made through team consensus and collaboration' },
          { value: 'executive_top_down', label: 'Top-down executive leadership', description: 'Decisions made by senior leadership and cascaded down' },
          { value: 'board_pressure', label: 'Board or investor direction', description: 'Decisions influenced by board members or investors' },
          { value: 'mixed', label: 'A mix of the above', description: 'Combination of different approaches depending on the situation' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 9
      },

      // Group 3: Operations
      {
        id: 'tech_stack_overview',
        type: 'multi_select',
        content: "What platforms or tools are central to your operations? Select the tools you actively use across different categories.",
        context: 'Understanding current tech ecosystem',
        personality: 'analyst',
        phase: 'diagnosis',
        maxSelect: 8,
        options: [
          { value: 'crm', label: 'CRM (Salesforce, HubSpot, etc.)', description: 'Customer relationship management' },
          { value: 'marketing_automation', label: 'Marketing Automation', description: 'Email marketing and automation tools' },
          { value: 'analytics', label: 'Analytics & BI', description: 'Data analysis and business intelligence' },
          { value: 'project_management', label: 'Project Management', description: 'Task and project tracking tools' },
          { value: 'accounting', label: 'Accounting & Finance', description: 'Financial management systems' },
          { value: 'communication', label: 'Communication Tools', description: 'Team communication platforms' },
          { value: 'ecommerce', label: 'E-commerce Platform', description: 'Online sales and payment processing' },
          { value: 'cms', label: 'Content Management', description: 'Website and content management' },
          { value: 'hr_tools', label: 'HR & Recruitment', description: 'Human resources and hiring tools' },
          { value: 'other', label: 'Other', description: 'Custom or industry-specific tools' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 10
      },
      {
        id: 'tech_stack_other',
        type: 'text_input',
        content: "Please describe any other platforms or tools that are central to your operations",
        context: 'Understanding custom tools',
        personality: 'analyst',
        phase: 'diagnosis',
        followUps: [],
        insights: [],
        required: false,
        order: 11
      },
      {
        id: 'business_priorities',
        type: 'ranking',
        content: "Rank the following priorities from most to least important to your business right now. This helps us understand your current strategic focus.",
        context: 'Understanding strategic priorities and resource allocation',
        personality: 'strategist',
        phase: 'diagnosis',
        options: [
          { value: 'growth', label: 'Growth', description: 'Expanding customer base and revenue' },
          { value: 'profitability', label: 'Profitability', description: 'Improving margins and financial performance' },
          { value: 'efficiency', label: 'Efficiency', description: 'Optimizing operations and processes' },
          { value: 'innovation', label: 'Innovation', description: 'Developing new products or services' },
          { value: 'brand_equity', label: 'Brand Equity', description: 'Building brand recognition and loyalty' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 12
      },
      {
        id: 'process_discipline',
        type: 'multi_choice',
        content: "Describe your internal process discipline. Select the statement that best reflects your company's current operational maturity level.",
        context: 'Understanding operational maturity',
        personality: 'analyst',
        phase: 'diagnosis',
        options: [
          { value: '1', label: 'Everything is ad hoc', description: 'No formal processes, decisions made on the fly' },
          { value: '2', label: 'Some structure, but mostly reactive', description: 'Basic processes exist but are inconsistently applied' },
          { value: '3', label: 'We have defined processes, but they\'re not consistently followed', description: 'Processes are documented but execution varies' },
          { value: '4', label: 'Most departments follow documented processes', description: 'Consistent process execution across most areas' },
          { value: '5', label: 'Processes are standardized, automated, and continuously optimized', description: 'Mature process discipline with continuous improvement' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 13
      },

      // Group 4: Growth Stack
      {
        id: 'acquisition_channels',
        type: 'multi_select',
        content: "Which acquisition channels are driving meaningful results today? Select all that apply.",
        context: 'Understanding current growth engine',
        personality: 'strategist',
        phase: 'roadmap',
        maxSelect: 5,
        options: [
          { value: 'seo', label: 'Organic Search / SEO', description: 'Traffic from search engines' },
          { value: 'paid_media', label: 'Paid Media (Google, Meta, TikTok, etc.)', description: 'Paid advertising across platforms' },
          { value: 'email', label: 'Email Marketing', description: 'Direct email campaigns and automation' },
          { value: 'outbound', label: 'Outbound Sales', description: 'Proactive sales outreach' },
          { value: 'partnerships', label: 'Partnerships / Affiliates', description: 'Strategic partnerships and affiliate programs' },
          { value: 'events', label: 'Events / Webinars', description: 'Live events and virtual presentations' },
          { value: 'influencers', label: 'Influencer Marketing', description: 'Collaborations with influencers' },
          { value: 'pr', label: 'PR / Earned Media', description: 'Public relations and media coverage' },
          { value: 'referrals', label: 'Word of Mouth / Referrals', description: 'Customer referrals and recommendations' },
          { value: 'retail', label: 'Retail or Channel Distribution', description: 'Physical retail or distribution channels' },
          { value: 'other', label: 'Other', description: 'Unique channels specific to your business' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 14
      },
      {
        id: 'acquisition_channels_other',
        type: 'text_input',
        content: "Please describe the acquisition channels that are driving meaningful results",
        context: 'Understanding unique channels',
        personality: 'strategist',
        phase: 'roadmap',
        followUps: [],
        insights: [],
        required: false,
        order: 15
      },
      {
        id: 'tech_maturity',
        type: 'multi_choice',
        content: "What is your current tech maturity level? How well-integrated and effective is your current tech stack?",
        context: 'Understanding technical foundation',
        personality: 'analyst',
        phase: 'roadmap',
        options: [
          { value: 'integrated', label: 'Everything is integrated and works seamlessly', description: 'All systems communicate and data flows automatically' },
          { value: 'partially_integrated', label: 'Some systems talk to each other, others don\'t', description: 'Partial integration with some manual processes' },
          { value: 'siloed', label: 'Tools are siloed or require manual workarounds', description: 'Systems operate independently with manual data transfer' },
          { value: 'early_stage', label: 'We\'re still selecting or onboarding core platforms', description: 'In the process of building the tech foundation' },
          { value: 'unsure', label: 'Unsure / Other', description: 'Not certain about current tech integration status' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 16
      },
      {
        id: 'retention_strategy',
        type: 'text_input',
        content: "What are your current retention levers? How do you keep customers coming back? What's your hook or lifecycle play?",
        context: 'Understanding customer success strategy',
        personality: 'strategist',
        phase: 'roadmap',
        followUps: [],
        insights: [],
        required: true,
        order: 17
      },

      // Group 5: Clarity
      {
        id: 'decision_bottlenecks',
        type: 'text_input',
        content: "What kind of business decisions are hardest for you to make right now? Hiring? Prioritization? Marketing spend? Pricing? Something else?",
        context: 'Understanding current decision-making challenges',
        personality: 'consultant',
        phase: 'roadmap',
        followUps: [],
        insights: [],
        required: true,
        order: 18
      },
      {
        id: 'team_alignment',
        type: 'multi_choice',
        content: "How aligned is your team on company goals and direction? This helps us understand your organizational dynamics.",
        context: 'Understanding organizational alignment',
        personality: 'consultant',
        phase: 'roadmap',
        options: [
          { value: 'fully_aligned', label: 'Fully aligned and collaborative', description: 'Everyone is on the same page and working together effectively' },
          { value: 'mostly_aligned', label: 'Mostly aligned, occasional friction', description: 'Generally aligned with some minor disagreements or miscommunications' },
          { value: 'some_misalignment', label: 'Some misalignment across departments', description: 'Different teams have different priorities or understandings' },
          { value: 'not_aligned', label: 'No clear alignment — teams are working in silos', description: 'Teams operate independently without shared goals or coordination' },
          { value: 'other', label: 'Other', description: 'Unique alignment situation specific to your organization' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 19
      },

      {
        id: 'future_success',
        type: 'text_input',
        content: "What would a wildly successful next 12 months look like for your business? Revenue, people, customers, product—describe your future state vividly.",
        context: 'Understanding vision and goals',
        personality: 'strategist',
        phase: 'roadmap',
        followUps: [],
        insights: [],
        required: true,
        order: 21
      },

      // Group 6: Benchmarks
      {
        id: 'benchmark_preferences',
        type: 'multi_select',
        content: "What type of insights or benchmarks would be most valuable to you right now? Select all that apply.",
        context: 'Understanding insight priorities',
        personality: 'analyst',
        phase: 'roadmap',
        maxSelect: 4,
        options: [
          { value: 'competitor_comparison', label: 'Competitor comparison', description: 'How you stack up against competitors' },
          { value: 'revenue_growth', label: 'Revenue growth levers', description: 'Strategies to accelerate revenue' },
          { value: 'retention', label: 'Retention improvements', description: 'Ways to reduce churn and increase loyalty' },
          { value: 'efficiency', label: 'Operational efficiency plays', description: 'Process optimization opportunities' },
          { value: 'industry_best_practices', label: 'Industry best practices', description: 'Proven strategies from your industry' },
          { value: 'automation', label: 'Process automation opportunities', description: 'Tasks that can be automated' },
          { value: 'tech_stack', label: 'Tech stack recommendations', description: 'Technology optimization suggestions' },
          { value: 'funnel_analysis', label: 'Marketing & sales funnel analysis', description: 'Conversion optimization insights' },
          { value: 'other', label: 'Other', description: 'Unique insights specific to your business' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 22
      },
      {
        id: 'benchmark_preferences_other',
        type: 'text_input',
        content: "Please describe the other insights or benchmarks",
        context: 'Understanding unique insight needs',
        personality: 'analyst',
        phase: 'roadmap',
        followUps: [],
        insights: [],
        required: false,
        order: 23
      },
      {
        id: 'funding_status',
        type: 'multi_choice',
        content: "Are you currently raising capital or preparing for an exit? This helps us understand your current business stage.",
        context: 'Understanding business stage and strategic priorities',
        personality: 'strategist',
        phase: 'roadmap',
        options: [
          { value: 'raising_now', label: 'Yes, actively raising', description: 'Currently in fundraising mode' },
          { value: 'early_planning', label: 'In early planning stages', description: 'Considering fundraising in the near future' },
          { value: 'preparing_exit', label: 'Preparing for acquisition or sale', description: 'Planning for exit or acquisition' },
          { value: 'not_planned', label: 'No, not on the roadmap', description: 'Focusing on organic growth' },
          { value: 'other', label: 'Other', description: 'Unique funding or exit situation' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 24
      },
      {
        id: 'funding_status_other',
        type: 'text_input',
        content: "Please describe the other ways you are currently raising capital or preparing for an exit",
        context: 'Understanding unique funding situation',
        personality: 'strategist',
        phase: 'roadmap',
        followUps: [],
        insights: [],
        required: false,
        order: 25
      },
      {
        id: 'growth_pace',
        type: 'multi_choice',
        content: "What is your ideal pace of growth? This helps us understand your growth ambitions and set appropriate benchmarks.",
        context: 'Understanding growth ambitions',
        personality: 'strategist',
        phase: 'roadmap',
        options: [
          { value: '10_25', label: '10–25% YoY', description: 'Steady, sustainable growth' },
          { value: '25_50', label: '25–50% YoY', description: 'Moderate acceleration' },
          { value: '50_100', label: '50–100% YoY', description: 'Fast growth trajectory' },
          { value: '2x_3x', label: '2x–3x', description: 'Rapid scaling' },
          { value: '3x_plus', label: '3x+', description: 'Hypergrowth mode' },
          { value: 'unsure', label: 'Unsure', description: 'Still determining growth targets' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 26
      },

      // Group 7: Final Commitment
      {
        id: 'unresolved_issue',
        type: 'text_input',
        content: "What's one thing you know you need to fix—but haven't yet? Be honest. What's been nagging at you that keeps getting deprioritized?",
        context: 'Identifying immediate opportunities',
        personality: 'consultant',
        phase: 'roadmap',
        followUps: [],
        insights: [],
        required: true,
        order: 27
      },
      {
        id: 'final_confirmation',
        type: 'multi_choice',
        content: "Are You Ready to Commit? Ready to level up? This path is built for ambitious businesses willing to do the work. Are you in?",
        context: 'Confirming commitment to growth',
        personality: 'mentor',
        phase: 'roadmap',
        options: [
          { value: 'yes_ready', label: '✅ Yes — I\'m ready to grow.', description: 'I\'m committed to implementing the strategies and insights from this assessment' },
          { value: 'no_not_ready', label: '❌ No — not at this time.', description: 'I need more time to consider or prepare for this commitment' }
        ],
        followUps: [],
        insights: [],
        required: true,
        order: 28
      },

      // Group 8: Business Overview
      {
        id: 'business_overview',
        type: 'text_input',
        content: "Briefly describe what your business offers, who you serve, and how you deliver value. This helps us personalize insights and recommendations.",
        context: 'Understanding business model and value proposition',
        personality: 'consultant',
        phase: 'roadmap',
        followUps: [],
        insights: [],
        required: true,
        order: 29
      }
    ];
  }

  async processUserResponse(response: UserResponse): Promise<ConversationUpdate> {
    try {
      console.log('Processing user response:', { sessionId: response.sessionId, questionId: response.questionId, answer: response.answer });
      
      // Save the response to the database
      await this.saveResponse(response);
      console.log('Response saved successfully');

      // Get current conversation state
      const state = await this.getConversationState(response.sessionId);
      console.log('Conversation state retrieved:', { sessionId: state.sessionId, phase: state.currentPhase });

      // Update business context with the response
      const updatedContext = this.updateBusinessContext(state.context, response);
      console.log('Business context updated');

      // Analyze the response for insights
      const insights = await this.generateInsights(response, updatedContext);
      console.log('Insights generated:', insights.length);

      // Determine the next question based on response and context
      const nextQuestion = await this.determineNextQuestion(response, updatedContext, state);
      console.log('Next question determined:', nextQuestion?.id);

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
      console.log('Conversation state saved');

      // Generate AI response message
      const aiMessage = await this.generateAIResponse(response, nextQuestion, insights);
      console.log('AI message generated');

      // Save AI message to database
      await this.saveAIMessage(response.sessionId, aiMessage);
      console.log('AI message saved');

      return {
        state: updatedState,
        aiMessage,
        nextQuestion,
        insights
      };

    } catch (error) {
      console.error('Error processing user response:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error(`Failed to process user response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async saveResponse(response: UserResponse): Promise<void> {
    try {
      // Save user message to conversation_messages
      const { error: userError } = await this.supabase
        .from('conversation_messages')
        .insert({
          session_id: response.sessionId,
          message_type: 'user',
          content: response.answer,
          metadata: {
            questionId: response.questionId,
            context: response.context
          }
        });

      if (userError) {
        console.error('Error saving user response:', userError);
        throw userError;
      }
    } catch (error) {
      console.error('Error in saveResponse:', error);
      throw error;
    }
  }

  private async getConversationState(sessionId: string): Promise<ConversationState> {
    try {
      // Get session data
      const { data: session, error: sessionError } = await this.supabase
        .from('onboarding_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        throw sessionError;
      }

      // Get conversation history
      const { data: messages, error: messagesError } = await this.supabase
        .from('conversation_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      // Build context from user messages
      const userMessages = messages?.filter((m: any) => m.message_type === 'user') || [];
      const responses: Record<string, any> = {};
      
      userMessages.forEach((message: any) => {
        if (message.metadata?.questionId) {
          responses[message.metadata.questionId] = message.content;
        }
      });

      const context: BusinessContext = {
        responses,
        industry: undefined,
        companySize: undefined,
        revenueRange: undefined,
        growthStage: undefined,
        primaryChallenges: [],
        goals: [],
        currentMetrics: {}
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
    } catch (error) {
      console.error('Error in getConversationState:', error);
      throw error;
    }
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

    // Only generate business intelligence insights for certain question types
    // Skip for simple conversation questions to avoid noise
    if (question && question.type !== 'conversation') {
      const businessInsights = this.businessIntelligence.generateRealTimeInsights(
        response.answer,
        response.questionId,
        context
      );
      insights.push(...businessInsights);
    }

    return insights;
  }

  private async determineNextQuestion(response: UserResponse, context: BusinessContext, state: ConversationState): Promise<QuestionNode | null> {
    console.log('DEBUG: Determining next question after:', response.questionId, 'with answer:', response.answer);
    const currentQuestion = this.questionTree.find(q => q.id === response.questionId);
    
    if (!currentQuestion) return null;

    // For the welcome question, always go to growth_metrics
    if (currentQuestion.id === 'welcome') {
      return this.questionTree.find(q => q.id === 'growth_metrics') || null;
    }

    // Only show follow-up questions for "other" if the answer is meaningful
    if (response.answer === 'other' && currentQuestion.options) {
      // Only show follow-up if user hasn't already answered this type of question
      const otherQuestionId = `${currentQuestion.id}_other`;
      const otherQuestion = this.questionTree.find(q => q.id === otherQuestionId);
      if (otherQuestion && !context.responses[otherQuestionId]) {
        return otherQuestion;
      }
    }

    // Handle multi-select questions with "other" option - only if "other" is selected
    if (Array.isArray(response.answer) && response.answer.includes('other')) {
      console.log('DEBUG: Other option selected in multi-select, checking for follow-up question');
      const otherQuestionId = `${currentQuestion.id}_other`;
      const otherQuestion = this.questionTree.find(q => q.id === otherQuestionId);
      if (otherQuestion && !context.responses[otherQuestionId]) {
        console.log('DEBUG: Returning other follow-up question:', otherQuestionId);
        return otherQuestion;
      }
    } else if (Array.isArray(response.answer)) {
      console.log('DEBUG: Multi-select answer without other:', response.answer);
    }

    // Skip follow-up questions for most cases to keep conversation flowing
    // Only check for critical follow-ups that are absolutely necessary
    if (currentQuestion.options && currentQuestion.id.includes('critical')) {
      const selectedOption = currentQuestion.options.find(opt => opt.value === response.answer);
      const followUps = selectedOption?.followUpQuestions || [];
      
      if (followUps.length > 0) {
        const nextQuestionId = followUps[0];
        const nextQuestion = this.questionTree.find(q => q.id === nextQuestionId);
        if (nextQuestion) return nextQuestion;
      }
    }

    // Default: move to next question by order, but skip "_other" questions unless explicitly triggered
    const currentOrder = currentQuestion.order;
    let nextOrder = currentOrder + 1;
    let nextQuestion = this.questionTree.find(q => q.order === nextOrder);
    
    // Skip "_other" questions when going by order (they should only be triggered as follow-ups)
    while (nextQuestion && nextQuestion.id.includes('_other')) {
      nextOrder++;
      nextQuestion = this.questionTree.find(q => q.order === nextOrder);
    }
    
    console.log('DEBUG: Returning next question by order:', nextQuestion?.id || 'null');
    return nextQuestion || null;
  }

  private calculateProgress(context: BusinessContext): number {
    // Count only required questions for progress calculation
    const requiredQuestions = this.questionTree.filter(q => q.required);
    const totalRequired = requiredQuestions.length;
    const answeredRequired = requiredQuestions.filter(q => context.responses[q.id]).length;
    return Math.round((answeredRequired / totalRequired) * 100);
  }

  private analyzeUserPersona(messages: any[]): UserPersona {
    // Analyze communication style from message patterns
    const userMessages = messages.filter((m: any) => m.message_type === 'user');
    const avgLength = userMessages.length > 0 
      ? userMessages.reduce((sum: number, msg: any) => sum + (msg.content?.length || 0), 0) / userMessages.length 
      : 0;
    
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

    // Generate conversational responses
    if (nextQuestion) {
      // Don't add acknowledgments for "other" follow-up questions
      if (nextQuestion.id.includes('_other')) {
        content = "";
      } else {
        // Add brief acknowledgment or transition for most questions
        const acknowledgments = [
          "Got it!",
          "Thanks for sharing that.",
          "I see.",
          "That's helpful to know.",
          "Perfect.",
          "Interesting!",
          "That makes sense.",
          "I understand.",
          "Right.",
          "Okay.",
          "Understood."
        ];
        
        const randomAck = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
        
        // For conversation type questions, include the question content
        if (nextQuestion.type === 'conversation') {
          content = `${randomAck} ${nextQuestion.content}`;
        } else {
          // For other question types, just provide acknowledgment
          content = randomAck;
        }
      }
    } else {
      content = "Thank you for sharing all that information! I have a great understanding of your business now. Let me prepare your personalized growth strategy.";
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

  private async saveAIMessage(sessionId: string, message: ConversationMessage): Promise<void> {
    await this.supabase
      .from('conversation_messages')
      .insert({
        session_id: sessionId,
        message_type: 'ai',
        content: message.content,
        metadata: message.metadata
      });
  }
}

export interface ConversationUpdate {
  state: ConversationState;
  aiMessage: ConversationMessage;
  nextQuestion: QuestionNode | null;
  insights: RealTimeInsight[];
} 