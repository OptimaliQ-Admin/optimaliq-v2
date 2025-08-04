export interface Question {
  id: string;
  type: 'text_area' | 'multi_select' | 'multiple_choice' | 'rank_order' | 'tech_stack_selector';
  prompt: string;
  description?: string;
  options?: string[];
  maxSelect?: number;
  required?: boolean;
  placeholder?: string;
  maxCharacters?: number;
  rows?: number;
  defaultItems?: string[];
}

export interface QuestionGroup {
  id: string;
  name: string;
  aiPromptIntro: string;
  order: number;
  transitionHook: string;
  questions: Question[];
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
        id: 'growth_metrics',
        type: 'multi_select',
        prompt: 'What metrics do you track most closely to measure growth?',
        description: 'Choose the KPIs that guide your key decisions today. These metrics help us understand your current focus and optimization priorities.',
        options: [
          'Revenue',
          'Profit Margin',
          'Customer Lifetime Value (LTV)',
          'Customer Acquisition Cost (CAC)',
          'Customer Churn Rate',
          'Customer Retention Rate',
          'Conversion Rate',
          'Website or App Traffic',
          'Monthly Active Users (MAU)',
          'Net Promoter Score (NPS)',
          'Other'
        ],
        maxSelect: 5,
        required: true
      },
      {
        id: 'gtm_strategy',
        type: 'text_area',
        prompt: 'In one or two sentences, describe your go-to-market strategy.',
        description: 'How do you attract, convert, and retain customers? This helps us understand your current market approach and identify optimization opportunities.',
        placeholder: 'E.g., We drive traffic through paid and organic channels and convert through personalized onboarding flows...',
        maxCharacters: 300,
        rows: 4,
        required: true
      },
      {
        id: 'friction_points',
        type: 'multi_select',
        prompt: 'What are the biggest friction points actively holding your business back?',
        description: 'Select up to 3 areas where you\'re experiencing the most significant challenges or bottlenecks.',
        options: [
          'Lack of funding',
          'Leadership misalignment',
          'Hiring or retention challenges',
          'Operational inefficiencies',
          'Underperforming marketing',
          'High customer acquisition cost',
          'Weak customer retention',
          'Tech stack limitations',
          'Undefined brand positioning',
          'Market saturation',
          'Regulatory or compliance issues',
          'Other'
        ],
        maxSelect: 3,
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
        prompt: 'What makes your business hard to compete with?',
        description: 'What do you do better, faster, or differently than others in your space? This helps us understand your competitive advantages and market positioning.',
        placeholder: 'E.g., We own a proprietary data model that predicts churn 90 days in advance, or we have exclusive partnerships that give us unique market access...',
        maxCharacters: 400,
        rows: 4,
        required: true
      },
      {
        id: 'customer_perception',
        type: 'text_area',
        prompt: 'How would your customers describe your brand in one sentence?',
        description: 'Imagine you\'re reading an online review or hearing feedback—what would they say? This helps us understand your brand perception and customer experience.',
        placeholder: 'E.g., A scrappy but responsive team that delivers results quickly, or the most reliable partner in our industry...',
        maxCharacters: 300,
        rows: 3,
        required: true
      },
      {
        id: 'strategic_decision_making',
        type: 'multiple_choice',
        prompt: 'How do you currently make big strategic decisions?',
        description: 'When facing big bets—new product, pricing changes, growth pivots—what guides your decision-making process?',
        options: [
          'Mostly gut instinct or experience',
          'Primarily based on data and analytics',
          'Collective input and cross-functional alignment',
          'Top-down executive leadership',
          'Board or investor direction',
          'A mix of the above'
        ],
        required: true
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations & Process',
    aiPromptIntro: 'Understanding your operational efficiency and process maturity',
    order: 3,
    transitionHook: 'Let\'s shift gears to your customer engine — how you\'re acquiring, retaining, and scaling growth.',
    questions: [
      {
        id: 'tech_stack_overview',
        type: 'tech_stack_selector',
        prompt: 'What platforms or tools are central to your operations?',
        description: 'Select the tools you actively use across different categories. This helps us understand your current tech ecosystem and identify integration opportunities.',
        required: true
      },
      {
        id: 'business_priorities',
        type: 'rank_order',
        prompt: 'Rank the following priorities from most to least important to your business right now.',
        description: 'Drag to reorder. Top = most important. This helps us understand your current strategic focus and resource allocation.',
        defaultItems: [
          'Growth',
          'Profitability',
          'Efficiency',
          'Innovation',
          'Brand Equity'
        ],
        required: true
      },
      {
        id: 'process_maturity',
        type: 'multiple_choice',
        prompt: 'Describe your internal process discipline.',
        description: 'Select the statement that best reflects your company\'s current operational maturity level.',
        options: [
          'Everything is ad hoc',
          'Some structure, but mostly reactive',
          'We have defined processes, but they\'re not consistently followed',
          'Most departments follow documented processes',
          'Processes are standardized, automated, and continuously optimized'
        ],
        required: true
      }
    ]
  },
  {
    id: 'growth_stack',
    name: 'Growth Engine',
    aiPromptIntro: 'Understanding your customer acquisition and retention strategies',
    order: 4,
    transitionHook: 'This is where it gets interesting. Let\'s talk decision-making, alignment, and what success looks like for your team.',
    questions: [
      {
        id: 'acquisition_channels',
        type: 'multi_select',
        prompt: 'Which acquisition channels are driving meaningful results today?',
        description: 'Select all that apply. This helps us understand your current growth engine and identify optimization opportunities.',
        options: [
          'Organic Search / SEO',
          'Paid Media (Google, Meta, TikTok, etc.)',
          'Email Marketing',
          'Outbound Sales',
          'Partnerships / Affiliates',
          'Events / Webinars',
          'Influencer Marketing',
          'PR / Earned Media',
          'Word of Mouth / Referrals',
          'Retail or Channel Distribution',
          'Other'
        ],
        maxSelect: 6,
        required: true
      },
      {
        id: 'tech_maturity',
        type: 'multiple_choice',
        prompt: 'What is your current tech maturity level?',
        description: 'How well-integrated and effective is your current tech stack? This helps us understand your technical foundation.',
        options: [
          'Everything is integrated and works seamlessly',
          'Some systems talk to each other, others don\'t',
          'Tools are siloed or require manual workarounds',
          'We\'re still selecting or onboarding core platforms',
          'Unsure / Other'
        ],
        required: true
      },
      {
        id: 'retention_strategy',
        type: 'text_area',
        prompt: 'What are your current retention levers?',
        description: 'How do you keep customers coming back? What\'s your hook or lifecycle play? This helps us understand your customer success strategy.',
        placeholder: 'E.g., Email drip campaigns, customer success outreach, loyalty programs, product features, community building...',
        maxCharacters: 400,
        rows: 4,
        required: true
      }
    ]
  },
  {
    id: 'clarity',
    name: 'Strategy & Alignment',
    aiPromptIntro: 'Understanding your strategic clarity and team alignment',
    order: 5,
    transitionHook: 'You\'re building toward something specific — let\'s anchor that with the right benchmarks and expectations.',
    questions: [
      {
        id: 'decision_bottlenecks',
        type: 'text_area',
        prompt: 'What kind of business decisions are hardest for you to make right now?',
        description: 'Hiring? Prioritization? Marketing spend? Pricing? Something else? This helps us understand your current decision-making challenges.',
        placeholder: 'Be honest. What\'s slowing you down the most right now? What decisions keep you up at night?',
        maxCharacters: 400,
        rows: 4,
        required: true
      },
      {
        id: 'team_alignment',
        type: 'multiple_choice',
        prompt: 'How aligned is your team on company goals and direction?',
        description: 'This helps us understand your organizational dynamics and identify potential alignment opportunities.',
        options: [
          'Fully aligned and collaborative',
          'Mostly aligned, occasional friction',
          'Some misalignment across departments',
          'No clear alignment — teams are working in silos',
          'Other'
        ],
        required: true
      },
      {
        id: 'future_state',
        type: 'text_area',
        prompt: 'What would a wildly successful next 12 months look like for your business?',
        description: 'Revenue, people, customers, product—describe your future state vividly. This helps us understand your vision and goals.',
        placeholder: 'Paint the picture: What does success look like in 12 months? Be specific about metrics, team size, customer base, product features...',
        maxCharacters: 500,
        rows: 5,
        required: true
      }
    ]
  },
  {
    id: 'benchmarks',
    name: 'Benchmarks & Expectations',
    aiPromptIntro: 'Understanding your performance context and industry benchmarks',
    order: 6,
    transitionHook: 'Thanks for being thoughtful through this. One last thing before we wrap — let\'s talk about what\'s been left unsaid or deprioritized.',
    questions: [
      {
        id: 'insights_benchmarks',
        type: 'multi_select',
        prompt: 'What type of insights or benchmarks would be most valuable to you right now?',
        description: 'Select all that apply. This helps us prioritize the most relevant insights for your business.',
        options: [
          'Competitor comparison',
          'Revenue growth levers',
          'Retention improvements',
          'Operational efficiency plays',
          'Industry best practices',
          'Process automation opportunities',
          'Tech stack recommendations',
          'Marketing & sales funnel analysis',
          'Other'
        ],
        maxSelect: 6,
        required: true
      },
      {
        id: 'capital_funding_status',
        type: 'multiple_choice',
        prompt: 'Are you currently raising capital or preparing for an exit?',
        description: 'This helps us understand your current business stage and strategic priorities.',
        options: [
          'Yes, actively raising',
          'In early planning stages',
          'Preparing for acquisition or sale',
          'No, not on the roadmap',
          'Other'
        ],
        required: true
      },
      {
        id: 'growth_pace',
        type: 'multiple_choice',
        prompt: 'What is your ideal pace of growth?',
        description: 'This helps us understand your growth ambitions and set appropriate benchmarks.',
        options: [
          '10–25% YoY',
          '25–50% YoY',
          '50–100% YoY',
          '2x–3x',
          '3x+',
          'Unsure'
        ],
        required: true
      }
    ]
  },
  {
    id: 'final',
    name: 'Final Assessment',
    aiPromptIntro: 'Identifying immediate opportunities and commitment to growth',
    order: 7,
    transitionHook: 'Perfect. Now let\'s get you set up with your personalized growth roadmap.',
    questions: [
      {
        id: 'unresolved_issue',
        type: 'text_area',
        prompt: 'What\'s one thing you know you need to fix—but haven\'t yet?',
        description: 'Be honest. What\'s been nagging at you that keeps getting deprioritized? This helps us identify immediate opportunities.',
        placeholder: 'Example: We know our onboarding process is hurting retention, but haven\'t made time to redesign it. Or: Our pricing strategy needs work but we keep putting it off...',
        maxCharacters: 400,
        rows: 4,
        required: true
      },
      {
        id: 'commitment_confirmation',
        type: 'multiple_choice',
        prompt: 'Are You Ready to Commit?',
        description: 'Ready to level up? This path is built for ambitious businesses willing to do the work. Are you in?',
        options: [
          '✅ Yes — I\'m ready to grow.',
          '❌ No — not at this time.'
        ],
        required: true
      }
    ]
  },
  {
    id: 'business_overview',
    name: 'Business Overview',
    aiPromptIntro: 'Understanding your business model and market context',
    order: 8,
    transitionHook: 'Excellent. Now I have a clear picture of your business. Let\'s dive into your growth assessment.',
    questions: [
      {
        id: 'business_description',
        type: 'text_area',
        prompt: 'Briefly describe what your business offers, who you serve, and how you deliver value.',
        description: 'This helps us personalize insights and recommendations that make sense for your model. Be specific about your product/service, target customers, and unique value proposition.',
        placeholder: 'Example: We provide SaaS project management software for small to medium-sized marketing agencies. Our platform helps teams collaborate on client projects, track time, and deliver results on time and budget. We differentiate through our industry-specific templates and integrations with popular marketing tools.',
        maxCharacters: 600,
        rows: 6,
        required: true
      }
    ]
  }
];

export function getQuestionGroupById(id: string): QuestionGroup | undefined {
  return questionGroups.find(group => group.id === id);
}

export function getQuestionById(questionId: string): Question | undefined {
  for (const group of questionGroups) {
    const question = group.questions.find(q => q.id === questionId);
    if (question) return question;
  }
  return undefined;
}

export function getTotalQuestions(): number {
  return questionGroups.reduce((total, group) => total + group.questions.length, 0);
} 