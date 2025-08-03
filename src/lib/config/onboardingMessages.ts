export interface WelcomeMessage {
  id: string;
  content: string;
  tone: 'executive' | 'mirror' | 'strategic' | 'minimal';
  description: string;
}

export interface TransitionHook {
  fromSection: string;
  toSection: string;
  content: string;
}

export const WELCOME_MESSAGES: WelcomeMessage[] = [
  {
    id: 'executive',
    content: "Welcome — I've worked with hundreds of growth-stage companies, and I'm here to help uncover the patterns, bottlenecks, and opportunities that matter most. Let's take a closer look at where you are today so we can map out what's next.",
    tone: 'executive',
    description: 'Executive consultant tone - authoritative and experienced'
  },
  {
    id: 'mirror',
    content: "You already know your business — I'm here to reflect it back to you with fresh perspective, structure, and strategy. Let's unpack your current position so we can build the growth roadmap together.",
    tone: 'mirror',
    description: 'Mirror-and-guide tone - reflective and collaborative'
  },
  {
    id: 'strategic',
    content: "Glad you're here. This is a different kind of onboarding — more like a strategy session. I'll guide you through a few focused questions to get a pulse on your business, and you'll walk away with clear insights and direction.",
    tone: 'strategic',
    description: 'Strategic warmth tone - consultative and approachable'
  },
  {
    id: 'minimal',
    content: "Let's cut to the signal. I'll ask a few focused questions to understand where your business stands. Then I'll show you where you can grow faster — and how.",
    tone: 'minimal',
    description: 'Minimal and high-trust tone - direct and efficient'
  }
];

export const TRANSITION_HOOKS: TransitionHook[] = [
  {
    fromSection: 'Business Overview',
    toSection: 'Growth Strategy',
    content: "Now that I understand your business fundamentals, let's dive into your growth strategy and challenges."
  },
  {
    fromSection: 'Growth Strategy',
    toSection: 'Market Position',
    content: "Now that I understand your growth priorities, let's talk about how your business stands out in the market."
  },
  {
    fromSection: 'Market Position',
    toSection: 'Operational Excellence',
    content: "That gives me a good sense of how you're positioned. Now I want to look under the hood — your processes, tools, and internal rhythm."
  },
  {
    fromSection: 'Operational Excellence',
    toSection: 'Financial Health',
    content: "Let's shift gears to your customer engine — how you're acquiring, retaining, and scaling growth."
  },
  {
    fromSection: 'Financial Health',
    toSection: 'Future Vision',
    content: "This is where it gets interesting. Let's talk decision-making, alignment, and what success looks like for your team."
  },
  {
    fromSection: 'Future Vision',
    toSection: 'Complete',
    content: "You're building toward something specific — let's anchor that with the right benchmarks and expectations."
  }
];

export function getRandomWelcomeMessage(): WelcomeMessage {
  return WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
}

export function getPersonalizedWelcomeMessage(userProfile?: any): WelcomeMessage {
  if (!userProfile?.industry) {
    return getRandomWelcomeMessage();
  }

  // Personalize based on industry
  const industry = userProfile.industry.toLowerCase();
  
  if (industry.includes('saas') || industry.includes('software')) {
    return WELCOME_MESSAGES.find(msg => msg.tone === 'strategic') || getRandomWelcomeMessage();
  } else if (industry.includes('ecommerce') || industry.includes('retail')) {
    return WELCOME_MESSAGES.find(msg => msg.tone === 'executive') || getRandomWelcomeMessage();
  } else if (industry.includes('consulting') || industry.includes('services')) {
    return WELCOME_MESSAGES.find(msg => msg.tone === 'mirror') || getRandomWelcomeMessage();
  } else {
    return WELCOME_MESSAGES.find(msg => msg.tone === 'minimal') || getRandomWelcomeMessage();
  }
}

export function getWelcomeMessageByTone(tone: WelcomeMessage['tone']): WelcomeMessage {
  return WELCOME_MESSAGES.find(msg => msg.tone === tone) || WELCOME_MESSAGES[0];
}

export function getTransitionHook(fromSection: string, toSection: string): string | undefined {
  const hook = TRANSITION_HOOKS.find(h => 
    h.fromSection === fromSection && h.toSection === toSection
  );
  return hook?.content;
} 