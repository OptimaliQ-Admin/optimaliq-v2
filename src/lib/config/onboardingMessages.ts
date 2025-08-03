export interface WelcomeMessage {
  id: string;
  tone: string;
  content: string;
  industry?: string;
}

export interface TransitionHook {
  id: string;
  fromSection: string;
  toSection: string;
  content: string;
}

export const WELCOME_MESSAGES: WelcomeMessage[] = [
  {
    id: 'executive_consultant',
    tone: 'Executive Consultant',
    content: 'Welcome — I\'ve worked with hundreds of growth-stage companies, and I\'m here to help uncover the patterns, bottlenecks, and opportunities that matter most. Let\'s take a closer look at where you are today so we can map out what\'s next.'
  },
  {
    id: 'mirror_guide',
    tone: 'Mirror-and-Guide',
    content: 'You already know your business — I\'m here to reflect it back to you with fresh perspective, structure, and strategy. Let\'s unpack your current position so we can build the growth roadmap together.'
  },
  {
    id: 'strategic_warmth',
    tone: 'Strategic Warmth',
    content: 'Glad you\'re here. This is a different kind of onboarding — more like a strategy session. I\'ll guide you through a few focused questions to get a pulse on your business, and you\'ll walk away with clear insights and direction.'
  },
  {
    id: 'minimal_trust',
    tone: 'Minimal and High-Trust',
    content: 'Let\'s cut to the signal. I\'ll ask a few focused questions to understand where your business stands. Then I\'ll show you where you can grow faster — and how.'
  },
  {
    id: 'saas_specialist',
    tone: 'SaaS Specialist',
    content: 'Welcome to OptimaliQ. I\'ve helped hundreds of SaaS companies scale from startup to enterprise. Let\'s dive into your growth engine and identify the levers that will drive your next phase of growth.',
    industry: 'saas'
  },
  {
    id: 'ecommerce_expert',
    tone: 'E-commerce Expert',
    content: 'Great to meet you. I\'ve guided countless e-commerce businesses through growth plateaus and scaling challenges. Let\'s examine your customer journey, conversion funnel, and growth strategies.',
    industry: 'ecommerce'
  },
  {
    id: 'agency_consultant',
    tone: 'Agency Consultant',
    content: 'Welcome! I\'ve worked with agencies at every stage — from boutique to enterprise. Let\'s explore your service delivery, client acquisition, and operational efficiency to unlock sustainable growth.',
    industry: 'agency'
  }
];

export const TRANSITION_HOOKS: TransitionHook[] = [
  {
    id: 'goals_to_positioning',
    fromSection: 'Goals',
    toSection: 'Positioning',
    content: 'Now that I understand your growth priorities, let\'s talk about how your business stands out in the market.'
  },
  {
    id: 'positioning_to_operations',
    fromSection: 'Positioning',
    toSection: 'Operations',
    content: 'That gives me a good sense of how you\'re positioned. Now I want to look under the hood — your processes, tools, and internal rhythm.'
  },
  {
    id: 'operations_to_growth_stack',
    fromSection: 'Operations',
    toSection: 'Growth Stack',
    content: 'Let\'s shift gears to your customer engine — how you\'re acquiring, retaining, and scaling growth.'
  },
  {
    id: 'growth_stack_to_clarity',
    fromSection: 'Growth Stack',
    toSection: 'Clarity',
    content: 'This is where it gets interesting. Let\'s talk decision-making, alignment, and what success looks like for your team.'
  },
  {
    id: 'clarity_to_benchmarks',
    fromSection: 'Clarity',
    toSection: 'Benchmarks',
    content: 'You\'re building toward something specific — let\'s anchor that with the right benchmarks and expectations.'
  },
  {
    id: 'benchmarks_to_final',
    fromSection: 'Benchmarks',
    toSection: 'Final',
    content: 'Thanks for being thoughtful through this. One last thing before we wrap — let\'s talk about what\'s been left unsaid or deprioritized.'
  }
];

export function getRandomWelcomeMessage(industry?: string): WelcomeMessage {
  // If industry is specified, try to find a matching message
  if (industry) {
    const industryMessages = WELCOME_MESSAGES.filter(msg => msg.industry === industry.toLowerCase());
    if (industryMessages.length > 0) {
      return industryMessages[Math.floor(Math.random() * industryMessages.length)];
    }
  }
  
  // Fall back to general messages (excluding industry-specific ones)
  const generalMessages = WELCOME_MESSAGES.filter(msg => !msg.industry);
  return generalMessages[Math.floor(Math.random() * generalMessages.length)];
}

export function getWelcomeMessageByTone(tone: string): WelcomeMessage | undefined {
  return WELCOME_MESSAGES.find(msg => msg.tone === tone);
}

export function getTransitionHook(fromSection: string, toSection: string): string {
  const hook = TRANSITION_HOOKS.find(h => 
    h.fromSection.toLowerCase() === fromSection.toLowerCase() && 
    h.toSection.toLowerCase() === toSection.toLowerCase()
  );
  return hook?.content || 'Let\'s continue with the next section.';
}

export function getPersonalizedWelcomeMessage(userProfile: any): WelcomeMessage {
  const industry = userProfile?.industry?.toLowerCase();
  return getRandomWelcomeMessage(industry);
} 