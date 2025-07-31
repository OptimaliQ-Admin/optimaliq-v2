import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';

export interface OnboardingQuestion {
  id: string;
  type: 'text' | 'select' | 'multi_select' | 'number';
  question: string;
  options?: string[];
  required: boolean;
  category: 'business_basics' | 'goals' | 'challenges' | 'operations' | 'market' | 'team' | 'finances';
  order: number;
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

  // Define the structured onboarding flow
  getOnboardingSteps(): OnboardingStep[] {
    return [
      {
        id: 'business_basics',
        title: 'Business Basics',
        description: 'Let\'s start with some basic information about your business.',
        order: 1,
        questions: [
          {
            id: 'company_name',
            type: 'text',
            question: 'What is your company name?',
            required: true,
            category: 'business_basics',
            order: 1
          },
          {
            id: 'industry',
            type: 'select',
            question: 'What industry is your business in?',
            options: [
              'Technology/SaaS',
              'Healthcare',
              'Finance',
              'Education',
              'Manufacturing',
              'Retail/E-commerce',
              'Consulting/Professional Services',
              'Real Estate',
              'Food & Beverage',
              'Entertainment/Media',
              'Other'
            ],
            required: true,
            category: 'business_basics',
            order: 2
          },
          {
            id: 'company_size',
            type: 'select',
            question: 'How many employees does your company have?',
            options: [
              '1-10 (Startup)',
              '11-50 (Small)',
              '51-200 (Medium)',
              '201-1000 (Large)',
              '1000+ (Enterprise)'
            ],
            required: true,
            category: 'business_basics',
            order: 3
          },
          {
            id: 'revenue_range',
            type: 'select',
            question: 'What is your annual revenue range?',
            options: [
              'Under $100K',
              '$100K - $500K',
              '$500K - $1M',
              '$1M - $5M',
              '$5M - $10M',
              '$10M - $50M',
              '$50M+'
            ],
            required: true,
            category: 'business_basics',
            order: 4
          }
        ]
      },
      {
        id: 'business_model',
        title: 'Business Model',
        description: 'Tell us about how your business operates.',
        order: 2,
        questions: [
          {
            id: 'business_model_type',
            type: 'select',
            question: 'What type of business model do you primarily use?',
            options: [
              'B2B (Business to Business)',
              'B2C (Business to Consumer)',
              'B2B2C (Business to Business to Consumer)',
              'Marketplace',
              'Subscription/SaaS',
              'E-commerce',
              'Consulting/Services',
              'Manufacturing/Product',
              'Other'
            ],
            required: true,
            category: 'business_basics',
            order: 1
          },
          {
            id: 'primary_product',
            type: 'text',
            question: 'What is your primary product or service?',
            required: true,
            category: 'business_basics',
            order: 2,
            helpText: 'Describe your main offering in 1-2 sentences'
          }
        ]
      },
      {
        id: 'goals',
        title: 'Business Goals',
        description: 'What are your primary business objectives?',
        order: 3,
        questions: [
          {
            id: 'primary_goal',
            type: 'select',
            question: 'What is your primary business goal for the next 12 months?',
            options: [
              'Increase Revenue',
              'Expand Market Share',
              'Improve Operational Efficiency',
              'Launch New Products/Services',
              'Enter New Markets',
              'Improve Customer Satisfaction',
              'Reduce Costs',
              'Scale Operations',
              'Other'
            ],
            required: true,
            category: 'goals',
            order: 1
          },
          {
            id: 'growth_target',
            type: 'select',
            question: 'What is your target growth rate for the next year?',
            options: [
              '0-10%',
              '10-25%',
              '25-50%',
              '50-100%',
              '100%+'
            ],
            required: true,
            category: 'goals',
            order: 2
          }
        ]
      },
      {
        id: 'challenges',
        title: 'Business Challenges',
        description: 'What challenges are you currently facing?',
        order: 4,
        questions: [
          {
            id: 'main_challenges',
            type: 'multi_select',
            question: 'What are your main business challenges? (Select all that apply)',
            options: [
              'Customer Acquisition',
              'Customer Retention',
              'Competition',
              'Cash Flow',
              'Talent/Team Building',
              'Technology/Systems',
              'Marketing/Sales',
              'Operational Efficiency',
              'Product Development',
              'Market Expansion',
              'Regulatory Compliance',
              'Other'
            ],
            required: true,
            category: 'challenges',
            order: 1
          },
          {
            id: 'biggest_challenge',
            type: 'text',
            question: 'What is your biggest challenge right now?',
            required: true,
            category: 'challenges',
            order: 2,
            helpText: 'Describe your most pressing issue in detail'
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