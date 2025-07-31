import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';

export interface OnboardingQuestionOption {
  value: string;
  label: string;
  description: string;
}

export interface OnboardingQuestion {
  id: string;
  type: 'text' | 'select' | 'multi_select' | 'number' | 'rank';
  question: string;
  description?: string;
  options?: OnboardingQuestionOption[] | string[];
  required: boolean;
  category: 'goals' | 'positioning' | 'operations' | 'growth_stack';
  order: number;
  maxSelect?: number;
  maxLength?: number;
  rows?: number;
  helpText?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  questions: OnboardingQuestion[];
  order: number;
}

export interface OnboardingResponse {
  questionId: string;
  answer: string | string[] | number;
  timestamp: string;
}

export class StructuredOnboardingService {
  private supabase: ReturnType<typeof createClient<Database>>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  // Define the structured onboarding flow based on original groups 1-8
  getOnboardingSteps(): OnboardingStep[] {
    return [
      {
        id: 'goals',
        title: 'Business Goals & Growth Strategy',
        description: 'Let\'s understand your growth objectives and how you measure success.',
        order: 1,
        questions: [
          {
            id: 'growth_metrics',
            type: 'multi_select',
            question: 'What metrics do you track most closely to measure growth?',
            description: 'Choose the KPIs that guide your key decisions today. These metrics help us understand your current focus and optimization priorities.',
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
            required: true,
            category: 'goals',
            order: 1,
            maxSelect: 5
          },
          {
            id: 'gtm_strategy',
            type: 'text',
            question: 'In one or two sentences, describe your go-to-market strategy.',
            description: 'How do you attract, convert, and retain customers? This helps us understand your current market approach and identify optimization opportunities.',
            required: true,
            category: 'goals',
            order: 2,
            maxLength: 300,
            rows: 4
          },
          {
            id: 'friction_points',
            type: 'multi_select',
            question: 'What are the biggest friction points actively holding your business back?',
            description: 'Select up to 3 areas where you\'re experiencing the most significant challenges or bottlenecks.',
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
            required: true,
            category: 'goals',
            order: 3,
            maxSelect: 3
          }
        ]
      },
      {
        id: 'positioning',
        title: 'Market Positioning & Competitive Advantage',
        description: 'Let\'s explore how you differentiate and make strategic decisions.',
        order: 2,
        questions: [
          {
            id: 'differentiator',
            type: 'text',
            question: 'What makes your business hard to compete with?',
            description: 'What do you do better, faster, or differently than others in your space? This helps us understand your competitive advantages and market positioning.',
            required: true,
            category: 'positioning',
            order: 1,
            maxLength: 400,
            rows: 4
          },
          {
            id: 'brand_perception',
            type: 'text',
            question: 'How would your customers describe your brand in one sentence?',
            description: 'Imagine you\'re reading an online review or hearing feedback—what would they say? This helps us understand your brand perception and customer experience.',
            required: true,
            category: 'positioning',
            order: 2,
            maxLength: 300,
            rows: 3
          },
          {
            id: 'strategy_decision_method',
            type: 'select',
            question: 'How do you currently make big strategic decisions?',
            description: 'When facing big bets—new product, pricing changes, growth pivots—what guides your decision-making process?',
            options: [
              { value: 'gut_feel', label: 'Mostly gut instinct or experience', description: 'Decisions based on intuition and past experience' },
              { value: 'data_driven', label: 'Primarily based on data and analytics', description: 'Decisions guided by metrics, testing, and analysis' },
              { value: 'team_alignment', label: 'Collective input and cross-functional alignment', description: 'Decisions made through team consensus and collaboration' },
              { value: 'executive_top_down', label: 'Top-down executive leadership', description: 'Decisions made by senior leadership and cascaded down' },
              { value: 'board_pressure', label: 'Board or investor direction', description: 'Decisions influenced by board members or investors' },
              { value: 'mixed', label: 'A mix of the above', description: 'Combination of different approaches depending on the situation' }
            ],
            required: true,
            category: 'positioning',
            order: 3
          }
        ]
      },
      {
        id: 'operations',
        title: 'Operations & Technology Stack',
        description: 'Let\'s understand your operational maturity and technology ecosystem.',
        order: 3,
        questions: [
          {
            id: 'tech_stack',
            type: 'multi_select',
            question: 'What platforms or tools are central to your operations?',
            description: 'Select the tools you actively use across different categories. This helps us understand your current tech ecosystem and identify integration opportunities.',
            options: [
              { value: 'crm', label: 'CRM (Salesforce, HubSpot, etc.)', description: 'Customer relationship management' },
              { value: 'marketing_automation', label: 'Marketing Automation', description: 'Email, social, and campaign tools' },
              { value: 'analytics', label: 'Analytics & BI', description: 'Data analysis and business intelligence' },
              { value: 'cms', label: 'CMS/Website', description: 'Content management and website platforms' },
              { value: 'ecommerce', label: 'E-commerce', description: 'Online sales and payment processing' },
              { value: 'accounting', label: 'Accounting & Finance', description: 'Financial management and reporting' },
              { value: 'hr', label: 'HR & Payroll', description: 'Human resources and employee management' },
              { value: 'project_management', label: 'Project Management', description: 'Task and project coordination' },
              { value: 'communication', label: 'Communication', description: 'Team collaboration and messaging' },
              { value: 'design', label: 'Design & Creative', description: 'Graphic design and creative tools' },
              { value: 'development', label: 'Development', description: 'Software development and coding tools' },
              { value: 'other', label: 'Other', description: 'Custom or industry-specific tools' }
            ],
            required: true,
            category: 'operations',
            order: 1,
            maxSelect: 15
          },
          {
            id: 'business_priorities',
            type: 'rank',
            question: 'Rank the following priorities from most to least important to your business right now.',
            description: 'Drag to reorder. Top = most important. This helps us understand your current strategic focus and resource allocation.',
            options: ['Growth', 'Profitability', 'Efficiency', 'Innovation', 'Brand Equity'],
            required: true,
            category: 'operations',
            order: 2
          },
          {
            id: 'process_discipline',
            type: 'select',
            question: 'Describe your internal process discipline.',
            description: 'Select the statement that best reflects your company\'s current operational maturity level.',
            options: [
              { value: '1', label: 'Everything is ad hoc', description: 'No formal processes, decisions made on the fly' },
              { value: '2', label: 'Some structure, but mostly reactive', description: 'Basic processes exist but are inconsistently applied' },
              { value: '3', label: 'We have defined processes, but they\'re not consistently followed', description: 'Processes are documented but execution varies' },
              { value: '4', label: 'Most departments follow documented processes', description: 'Consistent process execution across most areas' },
              { value: '5', label: 'Processes are standardized, automated, and continuously optimized', description: 'Mature process discipline with continuous improvement' }
            ],
            required: true,
            category: 'operations',
            order: 3
          }
        ]
      },
      {
        id: 'growth_stack',
        title: 'Growth Stack & Customer Acquisition',
        description: 'Let\'s explore your customer acquisition and retention strategies.',
        order: 4,
        questions: [
          {
            id: 'acquisition_channels',
            type: 'multi_select',
            question: 'Which customer acquisition channels are most effective for your business?',
            description: 'Select the channels that drive the most valuable customers to your business.',
            options: [
              { value: 'seo', label: 'SEO & Organic Search', description: 'Search engine optimization and organic traffic' },
              { value: 'paid_media', label: 'Paid Media (PPC, Social)', description: 'Paid advertising on search and social platforms' },
              { value: 'email', label: 'Email Marketing', description: 'Email campaigns and newsletters' },
              { value: 'outbound', label: 'Outbound Sales', description: 'Direct outreach and cold calling' },
              { value: 'partnerships', label: 'Partnerships & Affiliates', description: 'Strategic partnerships and affiliate programs' },
              { value: 'events', label: 'Events & Conferences', description: 'Trade shows, conferences, and networking events' },
              { value: 'influencers', label: 'Influencer Marketing', description: 'Influencer collaborations and endorsements' },
              { value: 'pr', label: 'Public Relations', description: 'Media coverage and press releases' },
              { value: 'referrals', label: 'Customer Referrals', description: 'Word-of-mouth and referral programs' },
              { value: 'retail', label: 'Retail & Physical', description: 'Physical locations and retail partnerships' },
              { value: 'other', label: 'Other', description: 'Unique or industry-specific channels' }
            ],
            required: true,
            category: 'growth_stack',
            order: 1,
            maxSelect: 5
          },
          {
            id: 'tech_maturity',
            type: 'select',
            question: 'How would you describe your technology integration maturity?',
            description: 'How well do your different tools and platforms work together?',
            options: [
              { value: 'integrated', label: 'Fully integrated ecosystem', description: 'All tools work seamlessly together with automated data flow' },
              { value: 'partially_integrated', label: 'Partially integrated', description: 'Some tools connect, but there are still manual processes' },
              { value: 'siloed', label: 'Siloed systems', description: 'Tools exist but don\'t communicate with each other' },
              { value: 'early_stage', label: 'Early stage', description: 'Still building out the basic tech stack' },
              { value: 'unsure', label: 'Not sure', description: 'Uncertain about current integration status' }
            ],
            required: true,
            category: 'growth_stack',
            order: 2
          },
          {
            id: 'retention_strategy',
            type: 'text',
            question: 'Describe your approach to customer retention.',
            description: 'How do you keep customers engaged and prevent churn? This helps us understand your retention strategy and identify improvement opportunities.',
            required: true,
            category: 'growth_stack',
            order: 3,
            maxLength: 300,
            rows: 3
          }
        ]
      }
    ];
  }

  // Create a new structured onboarding session
  async createStructuredSession(userId: string): Promise<any> {
    const steps = this.getOnboardingSteps();
    
    const { data: session, error } = await this.supabase
      .from('onboarding_sessions')
      .insert({
        user_id: userId,
        session_type: 'structured',
        status: 'active',
        current_step: 'business_basics',
        progress_percentage: 0,
        metadata: {
          started_at: new Date().toISOString(),
          total_steps: steps.length,
          current_step_index: 0,
          completed_questions: []
        }
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create onboarding session: ${error.message}`);
    }

    return {
      session,
      currentStep: steps[0],
      totalSteps: steps.length
    };
  }

  // Get current step for a session
  async getCurrentStep(sessionId: string): Promise<any> {
    const { data: session, error } = await this.supabase
      .from('onboarding_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      throw new Error('Session not found');
    }

    const steps = this.getOnboardingSteps();
    const currentStepIndex = session.metadata?.current_step_index || 0;
    const currentStep = steps[currentStepIndex];

    return {
      session,
      currentStep,
      totalSteps: steps.length,
      progress: ((currentStepIndex + 1) / steps.length) * 100
    };
  }

  // Submit answers for current step
  async submitStepAnswers(sessionId: string, answers: OnboardingResponse[]): Promise<any> {
    // Save answers to database
    const { error: saveError } = await this.supabase
      .from('onboarding_responses')
      .insert(answers.map(answer => ({
        session_id: sessionId,
        question_id: answer.questionId,
        answer: answer.answer,
        timestamp: answer.timestamp
      })));

    if (saveError) {
      throw new Error(`Failed to save answers: ${saveError.message}`);
    }

    // Update session progress
    const { data: session, error: updateError } = await this.supabase
      .from('onboarding_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (updateError || !session) {
      throw new Error('Session not found');
    }

    const steps = this.getOnboardingSteps();
    const currentStepIndex = session.metadata?.current_step_index || 0;
    const nextStepIndex = currentStepIndex + 1;

    if (nextStepIndex >= steps.length) {
      // Complete onboarding
      await this.completeOnboarding(sessionId);
      return { completed: true, redirectTo: '/premium/dashboard' };
    }

    // Move to next step
    const { error: progressError } = await this.supabase
      .from('onboarding_sessions')
      .update({
        current_step: steps[nextStepIndex].id,
        progress_percentage: ((nextStepIndex + 1) / steps.length) * 100,
        metadata: {
          ...session.metadata,
          current_step_index: nextStepIndex,
          completed_questions: [
            ...(session.metadata?.completed_questions || []),
            ...answers.map(a => a.questionId)
          ]
        }
      })
      .eq('id', sessionId);

    if (progressError) {
      throw new Error(`Failed to update progress: ${progressError.message}`);
    }

    return {
      completed: false,
      nextStep: steps[nextStepIndex],
      progress: ((nextStepIndex + 1) / steps.length) * 100
    };
  }

  // Complete onboarding and generate dashboard data
  private async completeOnboarding(sessionId: string): Promise<void> {
    // Get all responses
    const { data: responses, error: responsesError } = await this.supabase
      .from('onboarding_responses')
      .select('*')
      .eq('session_id', sessionId);

    if (responsesError) {
      throw new Error(`Failed to get responses: ${responsesError.message}`);
    }

    // Generate dashboard scores based on responses
    const scores = this.generateDashboardScores(responses);

    // Save scores to database
    const { error: scoresError } = await this.supabase
      .from('dashboard_scores')
      .insert({
        session_id: sessionId,
        strategy_score: scores.strategy,
        process_score: scores.process,
        technology_score: scores.technology,
        overall_score: scores.overall,
        generated_at: new Date().toISOString()
      });

    if (scoresError) {
      throw new Error(`Failed to save scores: ${scoresError.message}`);
    }

    // Mark session as completed
    const { error: completeError } = await this.supabase
      .from('onboarding_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      })
      .eq('id', sessionId);

    if (completeError) {
      throw new Error(`Failed to complete session: ${completeError.message}`);
    }
  }

  // Generate dashboard scores based on onboarding responses
  private generateDashboardScores(responses: any[]): any {
    // This is a simplified scoring algorithm
    // In a real implementation, this would be more sophisticated
    
    let strategyScore = 50;
    let processScore = 50;
    let technologyScore = 50;

    responses.forEach(response => {
      const answer = response.answer;
      
      // Example scoring logic
      if (response.question_id === 'revenue_range') {
        if (answer === '$1M - $5M' || answer === '$5M - $10M') {
          strategyScore += 10;
        }
      }
      
      if (response.question_id === 'company_size') {
        if (answer === '51-200 (Medium)' || answer === '201-1000 (Large)') {
          processScore += 10;
        }
      }
      
      if (response.question_id === 'industry') {
        if (answer === 'Technology/SaaS') {
          technologyScore += 15;
        }
      }
    });

    const overallScore = Math.round((strategyScore + processScore + technologyScore) / 3);

    return {
      strategy: Math.min(100, Math.max(0, strategyScore)),
      process: Math.min(100, Math.max(0, processScore)),
      technology: Math.min(100, Math.max(0, technologyScore)),
      overall: Math.min(100, Math.max(0, overallScore))
    };
  }
} 