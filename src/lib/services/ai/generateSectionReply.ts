import { callOpenAI } from '@/lib/ai/callOpenAI';

interface GenerateSectionReplyParams {
  sectionId: string;
  sectionName: string;
  responses: Record<string, any>;
  userProfile: any;
  transitionHook: string;
}

export async function generateSectionReply({
  sectionId,
  sectionName,
  responses,
  userProfile,
  transitionHook
}: GenerateSectionReplyParams): Promise<string> {
  try {
    // Build context from user profile
    const userContext = userProfile ? `
User Profile:
- Industry: ${userProfile.industry || 'Not specified'}
- Company Size: ${userProfile.company_size || 'Not specified'}
- Revenue Range: ${userProfile.revenue_range || 'Not specified'}
` : '';

    // Build response analysis based on section
    let responseAnalysis = '';
    const strategicInsight = '';

    switch (sectionId) {
      case 'goals':
        responseAnalysis = analyzeGoalsSection(responses);
        break;
      case 'positioning':
        responseAnalysis = analyzePositioningSection(responses);
        break;
      case 'operations':
        responseAnalysis = analyzeOperationsSection(responses);
        break;
      case 'growth_stack':
        responseAnalysis = analyzeGrowthStackSection(responses);
        break;
      case 'clarity':
        responseAnalysis = analyzeClaritySection(responses);
        break;
      case 'benchmarks':
        responseAnalysis = analyzeBenchmarksSection(responses);
        break;
      case 'final':
        responseAnalysis = analyzeFinalSection(responses);
        break;
      case 'business_overview':
        responseAnalysis = analyzeBusinessOverviewSection(responses);
        break;
      default:
        responseAnalysis = 'Analyzing responses...';
    }

    const prompt = `You are a senior growth consultant with 15+ years of experience working with hundreds of companies. You're conducting a strategic assessment session with a business leader.

${userContext}

The user just completed the "${sectionName}" section. Here's what they shared:

${responseAnalysis}

${strategicInsight}

Based on their responses, provide a strategic, consultative 2-3 sentence response that:
1. Acknowledges their situation with nuance and strategic insight
2. Reflects patterns you've seen in similar companies
3. Feels personal and confident, like a McKinsey advisor who's been through this 100 times
4. Transitions naturally to the next section using this hook: "${transitionHook}"

Tone: Strategic, warm, consultative. Do NOT summarize their answers. Instead, provide strategic perspective and insight.

Response:`;

    const response = await callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 200
    });

    return response.parsed.message || 'Thank you for sharing that. Let\'s continue with the next section.';
  } catch (error) {
    console.error('Error generating section reply:', error);
    return 'I appreciate your responses. Let\'s continue with the next section.';
  }
}

function analyzeGoalsSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze growth metrics
  if (responses.primary_goal) {
    const goal = responses.primary_goal;
    analysis += `Primary Growth Goal: ${goal}\n`;
    
    if (goal === 'Scale revenue rapidly') {
      analysis += 'Focus: Rapid revenue scaling - shows aggressive growth ambitions\n';
    } else if (goal === 'Improve profitability') {
      analysis += 'Focus: Profitability optimization - shows mature business thinking\n';
    } else if (goal === 'Expand to new markets') {
      analysis += 'Focus: Market expansion - shows strategic growth thinking\n';
    } else if (goal === 'Optimize operations') {
      analysis += 'Focus: Operational efficiency - shows systematic improvement approach\n';
    } else if (goal === 'Build team and culture') {
      analysis += 'Focus: Team development - shows people-first leadership approach\n';
    }
  }

  // Analyze timeframe
  if (responses.timeframe) {
    analysis += `Timeframe: ${responses.timeframe}\n`;
    if (responses.timeframe === '3-6 months') {
      analysis += 'Urgency: High - immediate execution focus\n';
    } else if (responses.timeframe === '6-12 months') {
      analysis += 'Urgency: Medium - balanced planning and execution\n';
    } else if (responses.timeframe === '12-18 months') {
      analysis += 'Urgency: Strategic - long-term planning approach\n';
    }
  }

  // Analyze biggest challenge
  if (responses.biggest_challenge) {
    analysis += `Biggest Challenge: ${responses.biggest_challenge}\n`;
  }

  return analysis;
}

function analyzePositioningSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze differentiator
  if (responses.differentiator) {
    analysis += `Competitive Advantage: ${responses.differentiator}\n`;
    
    // Analyze the type of differentiator
    const diff = responses.differentiator.toLowerCase();
    if (diff.includes('technology') || diff.includes('tech') || diff.includes('platform')) {
      analysis += 'Differentiator Type: Technology/Product-focused\n';
    } else if (diff.includes('service') || diff.includes('support') || diff.includes('customer')) {
      analysis += 'Differentiator Type: Service/Customer-focused\n';
    } else if (diff.includes('process') || diff.includes('efficiency') || diff.includes('operational')) {
      analysis += 'Differentiator Type: Process/Operational\n';
    } else if (diff.includes('team') || diff.includes('expertise') || diff.includes('experience')) {
      analysis += 'Differentiator Type: Team/Expertise\n';
    } else if (diff.includes('partnership') || diff.includes('access') || diff.includes('network')) {
      analysis += 'Differentiator Type: Market Access/Partnerships\n';
    }
  }

  // Analyze customer perception
  if (responses.target_customer) {
    analysis += `Target Customer: ${responses.target_customer}\n`;
  }

  // Analyze competitive advantage
  if (responses.competitive_advantage) {
    analysis += `Strongest Advantage: ${responses.competitive_advantage}\n`;
  }

  return analysis;
}

function analyzeOperationsSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze team size
  if (responses.team_size) {
    analysis += `Team Size: ${responses.team_size}\n`;
    
    if (responses.team_size === '1-5 people') {
      analysis += 'Stage: Early-stage startup\n';
    } else if (responses.team_size === '6-15 people') {
      analysis += 'Stage: Growing startup\n';
    } else if (responses.team_size === '16-50 people') {
      analysis += 'Stage: Scaling company\n';
    } else if (responses.team_size === '51-200 people') {
      analysis += 'Stage: Established company\n';
    } else if (responses.team_size === '200+ people') {
      analysis += 'Stage: Large organization\n';
    }
  }

  // Analyze process maturity
  if (responses.process_maturity) {
    analysis += `Process Maturity: ${responses.process_maturity}\n`;
    
    if (responses.process_maturity === 'Ad-hoc and reactive') {
      analysis += 'Maturity Level: Early-stage, reactive\n';
    } else if (responses.process_maturity === 'Some processes documented') {
      analysis += 'Maturity Level: Developing structure\n';
    } else if (responses.process_maturity === 'Well-defined processes') {
      analysis += 'Maturity Level: Structured approach\n';
    } else if (responses.process_maturity === 'Highly optimized and automated') {
      analysis += 'Maturity Level: Advanced optimization\n';
    }
  }

  // Analyze tech stack
  if (responses.tech_stack) {
    analysis += `Tech Stack: ${responses.tech_stack}\n`;
  }

  return analysis;
}

function analyzeGrowthStackSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze acquisition channels
  if (responses.acquisition_channels) {
    const channels = Array.isArray(responses.acquisition_channels) ? responses.acquisition_channels : [responses.acquisition_channels];
    analysis += `Acquisition Channels: ${channels.join(', ')}\n`;
    
    // Analyze channel mix
    if (channels.includes('Organic Search / SEO')) {
      analysis += 'Channel Strategy: Organic growth focus\n';
    }
    if (channels.includes('Paid Media')) {
      analysis += 'Channel Strategy: Paid advertising investment\n';
    }
    if (channels.includes('Email Marketing')) {
      analysis += 'Channel Strategy: Direct marketing approach\n';
    }
    if (channels.includes('Outbound Sales')) {
      analysis += 'Channel Strategy: Direct sales focus\n';
    }
    if (channels.length > 3) {
      analysis += 'Channel Strategy: Multi-channel approach\n';
    }
  }

  // Analyze retention strategy
  if (responses.retention_strategy) {
    analysis += `Retention Strategy: ${responses.retention_strategy}\n`;
  }

  // Analyze growth metrics
  if (responses.growth_metrics) {
    const metrics = Array.isArray(responses.growth_metrics) ? responses.growth_metrics : [responses.growth_metrics];
    analysis += `Key Metrics: ${metrics.join(', ')}\n`;
  }

  return analysis;
}

function analyzeClaritySection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze vision clarity
  if (responses.vision_clarity) {
    analysis += `Team Alignment: ${responses.vision_clarity}\n`;
    
    if (responses.vision_clarity === 'Very clear and aligned') {
      analysis += 'Alignment Status: Strong team cohesion\n';
    } else if (responses.vision_clarity === 'Somewhat clear') {
      analysis += 'Alignment Status: Moderate alignment\n';
    } else if (responses.vision_clarity === 'Unclear or conflicting') {
      analysis += 'Alignment Status: Needs improvement\n';
    } else if (responses.vision_clarity === 'Not communicated') {
      analysis += 'Alignment Status: Communication gap\n';
    }
  }

  // Analyze decision making
  if (responses.decision_making) {
    analysis += `Decision Making: ${responses.decision_making}\n`;
  }

  // Analyze success definition
  if (responses.success_definition) {
    analysis += `Success Vision: ${responses.success_definition}\n`;
  }

  return analysis;
}

function analyzeBenchmarksSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze industry benchmarks
  if (responses.industry_benchmarks) {
    analysis += `Benchmark Position: ${responses.industry_benchmarks}\n`;
  }

  // Analyze growth rate
  if (responses.growth_rate) {
    analysis += `Growth Rate: ${responses.growth_rate}\n`;
    
    if (responses.growth_rate === 'Hypergrowth (50%+)') {
      analysis += 'Growth Stage: Rapid scaling\n';
    } else if (responses.growth_rate === 'High (20-50%)') {
      analysis += 'Growth Stage: Strong growth\n';
    } else if (responses.growth_rate === 'Moderate (5-20%)') {
      analysis += 'Growth Stage: Steady growth\n';
    } else if (responses.growth_rate === 'Flat (0-5%)') {
      analysis += 'Growth Stage: Stabilization\n';
    } else if (responses.growth_rate === 'Declining') {
      analysis += 'Growth Stage: Challenge mode\n';
    }
  }

  // Analyze unaddressed areas
  if (responses.unaddressed_areas) {
    analysis += `Unaddressed Areas: ${responses.unaddressed_areas}\n`;
  }

  return analysis;
}

function analyzeFinalSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze unresolved issues
  if (responses.unresolved_issue) {
    analysis += `Unresolved Issue: ${responses.unresolved_issue}\n`;
  }

  // Analyze commitment
  if (responses.commitment) {
    analysis += `Commitment Level: ${responses.commitment}\n`;
  }

  return analysis;
}

function analyzeBusinessOverviewSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze business description
  if (responses.business_description) {
    analysis += `Business Overview: ${responses.business_description}\n`;
    
    // Analyze business model
    const desc = responses.business_description.toLowerCase();
    if (desc.includes('saas') || desc.includes('software')) {
      analysis += 'Business Model: SaaS/Software\n';
    } else if (desc.includes('service') || desc.includes('consulting')) {
      analysis += 'Business Model: Service-based\n';
    } else if (desc.includes('product') || desc.includes('physical')) {
      analysis += 'Business Model: Product-based\n';
    } else if (desc.includes('marketplace') || desc.includes('platform')) {
      analysis += 'Business Model: Marketplace/Platform\n';
    }
  }

  return analysis;
} 