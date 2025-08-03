export interface QuestionGroup {
  id: string;
  name: string;
  aiPromptIntro: string;
  transitionHook?: string;
  questions: Question[];
  order: number;
  required?: boolean;
}

export interface Question {
  id: string;
  type: "text_area" | "multi_select" | "multiple_choice" | "rank_order";
  prompt: string;
  options?: string[];
  maxSelect?: number;
  followUpIfOther?: boolean;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface QuestionFlowState {
  currentGroupIndex: number;
  completedGroups: string[];
  userResponses: Record<string, any>;
  sessionId: string;
  progress: number;
}

export class QuestionFlowManager {
  private questionGroups: QuestionGroup[] = [
    {
      id: "business-overview",
      name: "Business Overview",
      aiPromptIntro: "Let's start with understanding your business fundamentals",
      transitionHook: "Now that I understand your business fundamentals, let's dive into your growth strategy and challenges.",
      order: 1,
      questions: [
        {
          id: "industry",
          type: "multiple_choice",
          prompt: "What industry are you in?",
          options: ["SaaS", "E-commerce", "Consulting", "Manufacturing", "Healthcare", "Education", "Finance", "Other"],
          required: true
        },
        {
          id: "company_size",
          type: "multiple_choice", 
          prompt: "How many employees do you have?",
          options: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
          required: true
        },
        {
          id: "revenue_range",
          type: "multiple_choice",
          prompt: "What's your annual revenue range?",
          options: ["<$100K", "$100K-$1M", "$1M-$10M", "$10M-$100M", "$100M+"],
          required: true
        }
      ]
    },
    {
      id: "growth-strategy",
      name: "Growth Strategy",
      aiPromptIntro: "Now let's dive into your growth approach and challenges",
      transitionHook: "Now that I understand your growth priorities, let's talk about how your business stands out in the market.",
      order: 2,
      questions: [
        {
          id: "primary_growth_channel",
          type: "multi_select",
          prompt: "Which growth channels are you currently using?",
          options: ["Content Marketing", "Paid Advertising", "SEO", "Social Media", "Email Marketing", "Partnerships", "Sales Team", "Referrals"],
          maxSelect: 3
        },
        {
          id: "biggest_challenge",
          type: "text_area",
          prompt: "What's your biggest growth challenge right now?",
          validation: { minLength: 10, maxLength: 500 }
        },
        {
          id: "success_metrics",
          type: "rank_order",
          prompt: "Rank these metrics by importance to your business:",
          options: ["Revenue Growth", "Customer Acquisition", "Customer Retention", "Market Share", "Profit Margins"]
        }
      ]
    },
    {
      id: "market-position",
      name: "Market Position",
      aiPromptIntro: "Let's understand your competitive landscape and market dynamics",
      transitionHook: "That gives me a good sense of how you're positioned. Now I want to look under the hood — your processes, tools, and internal rhythm.",
      order: 3,
      questions: [
        {
          id: "target_market",
          type: "text_area",
          prompt: "Describe your ideal customer profile in detail",
          validation: { minLength: 20, maxLength: 300 }
        },
        {
          id: "competitive_advantage",
          type: "multiple_choice",
          prompt: "What's your primary competitive advantage?",
          options: ["Technology/Product", "Customer Service", "Price", "Brand", "Network Effects", "Operational Efficiency"]
        },
        {
          id: "market_maturity",
          type: "multiple_choice",
          prompt: "How mature is your market?",
          options: ["Emerging/Early Stage", "Growing", "Mature", "Declining", "Disrupted"]
        }
      ]
    },
    {
      id: "operational-excellence",
      name: "Operational Excellence",
      aiPromptIntro: "Let's assess your operational foundation and processes",
      transitionHook: "Let's shift gears to your customer engine — how you're acquiring, retaining, and scaling growth.",
      order: 4,
      questions: [
        {
          id: "team_structure",
          type: "multiple_choice",
          prompt: "How is your team organized?",
          options: ["Founder-led", "Functional departments", "Cross-functional teams", "Matrix organization", "Agile/Scrum"]
        },
        {
          id: "key_processes",
          type: "multi_select",
          prompt: "Which processes are most critical to your success?",
          options: ["Product Development", "Sales Process", "Customer Onboarding", "Support Operations", "Financial Management", "HR/Recruiting"],
          maxSelect: 4
        },
        {
          id: "technology_stack",
          type: "text_area",
          prompt: "What's your current technology stack and infrastructure?",
          validation: { minLength: 10, maxLength: 400 }
        }
      ]
    },
    {
      id: "financial-health",
      name: "Financial Health",
      aiPromptIntro: "Let's examine your financial foundation and growth trajectory",
      transitionHook: "This is where it gets interesting. Let's talk decision-making, alignment, and what success looks like for your team.",
      order: 5,
      questions: [
        {
          id: "funding_stage",
          type: "multiple_choice",
          prompt: "What's your current funding stage?",
          options: ["Bootstrapped", "Seed", "Series A", "Series B", "Series C+", "Public"]
        },
        {
          id: "burn_rate",
          type: "multiple_choice",
          prompt: "What's your monthly burn rate?",
          options: ["<$50K", "$50K-$200K", "$200K-$500K", "$500K-$1M", "$1M+"]
        },
        {
          id: "unit_economics",
          type: "multiple_choice",
          prompt: "Are your unit economics positive?",
          options: ["Yes, profitable", "Yes, but scaling", "No, but improving", "No, need optimization", "Unsure"]
        }
      ]
    },
    {
      id: "future-vision",
      name: "Future Vision",
      aiPromptIntro: "Finally, let's explore your vision and strategic priorities",
      transitionHook: "You're building toward something specific — let's anchor that with the right benchmarks and expectations.",
      order: 6,
      questions: [
        {
          id: "growth_goals",
          type: "text_area",
          prompt: "What are your top 3 growth goals for the next 12 months?",
          validation: { minLength: 20, maxLength: 400 }
        },
        {
          id: "strategic_priorities",
          type: "rank_order",
          prompt: "Rank these strategic priorities for your business:",
          options: ["Market Expansion", "Product Development", "Team Building", "Operational Efficiency", "Customer Success"]
        },
        {
          id: "success_definition",
          type: "text_area",
          prompt: "How do you define success for your business?",
          validation: { minLength: 15, maxLength: 300 }
        }
      ]
    }
  ];

  constructor() {
    // Sort question groups by order
    this.questionGroups.sort((a, b) => a.order - b.order);
  }

  getQuestionGroups(): QuestionGroup[] {
    return this.questionGroups;
  }

  getCurrentGroup(index: number): QuestionGroup | null {
    return this.questionGroups[index] || null;
  }

  getNextGroup(currentIndex: number): QuestionGroup | null {
    return this.questionGroups[currentIndex + 1] || null;
  }

  isLastGroup(index: number): boolean {
    return index === this.questionGroups.length - 1;
  }

  validateGroupResponses(groupId: string, responses: Record<string, any>): { isValid: boolean; errors: string[] } {
    const group = this.questionGroups.find(g => g.id === groupId);
    if (!group) {
      return { isValid: false, errors: ['Question group not found'] };
    }

    const errors: string[] = [];

    group.questions.forEach(question => {
      if (question.required) {
        const response = responses[question.id];
        if (!response || (Array.isArray(response) && response.length === 0)) {
          errors.push(`${question.prompt} is required`);
        }
      }

      // Validate text area length
      if (question.type === 'text_area' && question.validation) {
        const response = responses[question.id];
        if (response) {
          if (question.validation.minLength && response.length < question.validation.minLength) {
            errors.push(`${question.prompt} must be at least ${question.validation.minLength} characters`);
          }
          if (question.validation.maxLength && response.length > question.validation.maxLength) {
            errors.push(`${question.prompt} must be less than ${question.validation.maxLength} characters`);
          }
        }
      }

      // Validate multi-select max
      if (question.type === 'multi_select' && question.maxSelect) {
        const response = responses[question.id];
        if (Array.isArray(response) && response.length > question.maxSelect) {
          errors.push(`${question.prompt} allows maximum ${question.maxSelect} selections`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculateProgress(completedGroups: string[]): number {
    return (completedGroups.length / this.questionGroups.length) * 100;
  }

  getGroupById(groupId: string): QuestionGroup | null {
    return this.questionGroups.find(g => g.id === groupId) || null;
  }

  getGroupByOrder(order: number): QuestionGroup | null {
    return this.questionGroups.find(g => g.order === order) || null;
  }
} 