export interface Question {
  id: string;
  type: 'text_area' | 'multi_select' | 'multiple_choice' | 'rank_order';
  prompt: string;
  options?: string[];
  maxSelect?: number;
  followUpIfOther?: boolean;
  required?: boolean;
}

export interface QuestionGroup {
  id: string;
  name: string;
  aiPromptIntro: string;
  questions: Question[];
  order: number;
  transitionHook: string;
}

export const questionGroups: QuestionGroup[] = [
  {
    id: 'goals',
    name: 'Goals & Priorities',
    aiPromptIntro: 'Understanding your growth priorities and strategic objectives',
    order: 1,
    transitionHook: 'Now that I understand your growth priorities, let\'s talk about how your business stands out in the market.',
    questions: [
      {
        id: 'primary_goal',
        type: 'multiple_choice',
        prompt: 'What\'s your primary growth goal right now?',
        options: [
          'Scale revenue rapidly',
          'Improve profitability',
          'Expand to new markets',
          'Optimize operations',
          'Build team and culture'
        ],
        required: true
      },
      {
        id: 'timeframe',
        type: 'multiple_choice',
        prompt: 'What\'s your target timeframe for achieving this goal?',
        options: [
          '3-6 months',
          '6-12 months',
          '12-18 months',
          '18+ months'
        ],
        required: true
      },
      {
        id: 'biggest_challenge',
        type: 'text_area',
        prompt: 'What\'s the biggest challenge standing in your way?',
        required: true
      }
    ]
  },
  {
    id: 'positioning',
    name: 'Market Positioning',
    aiPromptIntro: 'Understanding your competitive landscape and differentiation',
    order: 2,
    transitionHook: 'That gives me a good sense of how you\'re positioned. Now I want to look under the hood — your processes, tools, and internal rhythm.',
    questions: [
      {
        id: 'differentiator',
        type: 'text_area',
        prompt: 'What makes your business unique in your market?',
        required: true
      },
      {
        id: 'target_customer',
        type: 'text_area',
        prompt: 'Who is your ideal customer?',
        required: true
      },
      {
        id: 'competitive_advantage',
        type: 'multiple_choice',
        prompt: 'What\'s your strongest competitive advantage?',
        options: [
          'Technology/Product',
          'Customer service',
          'Price/Value',
          'Speed to market',
          'Team expertise',
          'Brand recognition'
        ],
        required: true
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations & Processes',
    aiPromptIntro: 'Understanding your operational maturity and efficiency',
    order: 3,
    transitionHook: 'Let\'s shift gears to your customer engine — how you\'re acquiring, retaining, and scaling growth.',
    questions: [
      {
        id: 'process_maturity',
        type: 'multiple_choice',
        prompt: 'How would you describe your operational processes?',
        options: [
          'Mostly ad-hoc and reactive',
          'Some documented processes',
          'Well-defined and followed',
          'Highly optimized and automated'
        ],
        required: true
      },
      {
        id: 'team_size',
        type: 'multiple_choice',
        prompt: 'How large is your team?',
        options: [
          '1-5 people',
          '6-15 people',
          '16-50 people',
          '51-200 people',
          '200+ people'
        ],
        required: true
      },
      {
        id: 'biggest_operational_challenge',
        type: 'text_area',
        prompt: 'What\'s your biggest operational challenge?',
        required: true
      }
    ]
  },
  {
    id: 'growth_stack',
    name: 'Growth Stack & Tools',
    aiPromptIntro: 'Understanding your technology stack and growth tools',
    order: 4,
    transitionHook: 'This is where it gets interesting. Let\'s talk decision-making, alignment, and what success looks like for your team.',
    questions: [
      {
        id: 'tech_stack_maturity',
        type: 'multiple_choice',
        prompt: 'How mature is your technology stack?',
        options: [
          'Still building core systems',
          'Basic tools in place',
          'Integrated and optimized',
          'Advanced automation'
        ],
        required: true
      },
      {
        id: 'key_tools',
        type: 'multi_select',
        prompt: 'Which tools do you use most? (Select all that apply)',
        options: [
          'CRM (Salesforce, HubSpot, etc.)',
          'Marketing automation',
          'Analytics (Google Analytics, Mixpanel)',
          'Email marketing',
          'Social media management',
          'Project management',
          'Customer support',
          'Accounting/Finance',
          'HR/Recruiting'
        ],
        maxSelect: 5,
        required: true
      },
      {
        id: 'tech_gaps',
        type: 'text_area',
        prompt: 'What technology gaps are holding you back?',
        required: true
      }
    ]
  },
  {
    id: 'clarity',
    name: 'Decision Making & Clarity',
    aiPromptIntro: 'Understanding your decision-making processes and strategic clarity',
    order: 5,
    transitionHook: 'You\'re building toward something specific — let\'s anchor that with the right benchmarks and expectations.',
    questions: [
      {
        id: 'decision_speed',
        type: 'multiple_choice',
        prompt: 'How quickly do you typically make strategic decisions?',
        options: [
          'Immediately (same day)',
          'Within a week',
          'Within a month',
          'Several months',
          'Very slowly'
        ],
        required: true
      },
      {
        id: 'success_metrics',
        type: 'multi_select',
        prompt: 'What metrics do you track most closely? (Select all that apply)',
        options: [
          'Revenue growth',
          'Customer acquisition cost',
          'Customer lifetime value',
          'Conversion rates',
          'Team productivity',
          'Customer satisfaction',
          'Profit margins',
          'Market share'
        ],
        maxSelect: 4,
        required: true
      },
      {
        id: 'strategic_clarity',
        type: 'text_area',
        prompt: 'What strategic question keeps you up at night?',
        required: true
      }
    ]
  },
  {
    id: 'benchmarks',
    name: 'Benchmarks & Expectations',
    aiPromptIntro: 'Understanding your performance benchmarks and growth expectations',
    order: 6,
    transitionHook: 'Thanks for being thoughtful through this. One last thing before we wrap — let\'s talk about what\'s been left unsaid or deprioritized.',
    questions: [
      {
        id: 'industry_benchmark',
        type: 'multiple_choice',
        prompt: 'How do you think you compare to industry leaders?',
        options: [
          'Significantly behind',
          'Slightly behind',
          'On par',
          'Ahead of most',
          'Leading the industry'
        ],
        required: true
      },
      {
        id: 'growth_rate',
        type: 'multiple_choice',
        prompt: 'What\'s your current growth rate?',
        options: [
          'Declining',
          'Flat (0-5%)',
          'Moderate (5-20%)',
          'Strong (20-50%)',
          'Explosive (50%+)'
        ],
        required: true
      },
      {
        id: 'deprioritized_areas',
        type: 'text_area',
        prompt: 'What important areas have you had to deprioritize?',
        required: true
      }
    ]
  }
];

export function getQuestionGroupById(id: string): QuestionGroup | undefined {
  return questionGroups.find(group => group.id === id);
}

export function getQuestionGroupByOrder(order: number): QuestionGroup | undefined {
  return questionGroups.find(group => group.order === order);
} 