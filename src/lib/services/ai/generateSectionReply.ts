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
  if (responses.growth_metrics) {
    const metrics = Array.isArray(responses.growth_metrics) ? responses.growth_metrics : [responses.growth_metrics];
    analysis += `Growth Metrics: ${metrics.join(', ')}\n`;
    
    if (metrics.includes('Revenue')) {
      analysis += 'Focus: Revenue tracking - shows top-line growth focus\n';
    }
    if (metrics.includes('Profit Margin')) {
      analysis += 'Focus: Profitability tracking - shows mature business thinking\n';
    }
    if (metrics.includes('Customer Lifetime Value (LTV)')) {
      analysis += 'Focus: LTV tracking - shows customer-centric approach\n';
    }
    if (metrics.includes('Customer Acquisition Cost (CAC)')) {
      analysis += 'Focus: CAC tracking - shows unit economics awareness\n';
    }
    if (metrics.includes('Customer Churn Rate')) {
      analysis += 'Focus: Churn tracking - shows retention focus\n';
    }
    if (metrics.includes('Website or App Traffic')) {
      analysis += 'Focus: Traffic tracking - shows awareness of leading indicators\n';
    }
  }

  // Analyze GTM strategy
  if (responses.gtm_strategy) {
    analysis += `GTM Strategy: ${responses.gtm_strategy}\n`;
    
    const strategy = responses.gtm_strategy.toLowerCase();
    if (strategy.includes('content') || strategy.includes('seo')) {
      analysis += 'Strategy Type: Content-driven growth\n';
    } else if (strategy.includes('paid') || strategy.includes('advertising')) {
      analysis += 'Strategy Type: Paid acquisition focus\n';
    } else if (strategy.includes('sales') || strategy.includes('outbound')) {
      analysis += 'Strategy Type: Direct sales approach\n';
    } else if (strategy.includes('partnership') || strategy.includes('affiliate')) {
      analysis += 'Strategy Type: Partnership-driven growth\n';
    }
  }

  // Analyze friction points
  if (responses.friction_points) {
    const frictionPoints = Array.isArray(responses.friction_points) ? responses.friction_points : [responses.friction_points];
    analysis += `Friction Points: ${frictionPoints.join(', ')}\n`;
    
    if (frictionPoints.includes('Lack of funding')) {
      analysis += 'Challenge: Capital constraints\n';
    }
    if (frictionPoints.includes('Leadership misalignment')) {
      analysis += 'Challenge: Team alignment issues\n';
    }
    if (frictionPoints.includes('Hiring or retention challenges')) {
      analysis += 'Challenge: Talent acquisition/retention\n';
    }
    if (frictionPoints.includes('Operational inefficiencies')) {
      analysis += 'Challenge: Process optimization needed\n';
    }
    if (frictionPoints.includes('Underperforming marketing')) {
      analysis += 'Challenge: Marketing effectiveness\n';
    }
    if (frictionPoints.includes('High customer acquisition cost')) {
      analysis += 'Challenge: CAC optimization needed\n';
    }
    if (frictionPoints.includes('Weak customer retention')) {
      analysis += 'Challenge: Customer success focus needed\n';
    }
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
  if (responses.customer_perception) {
    analysis += `Customer Perception: ${responses.customer_perception}\n`;
    
    const perception = responses.customer_perception.toLowerCase();
    if (perception.includes('responsive') || perception.includes('fast')) {
      analysis += 'Perception Type: Service quality focus\n';
    } else if (perception.includes('reliable') || perception.includes('trust')) {
      analysis += 'Perception Type: Trust and reliability\n';
    } else if (perception.includes('innovative') || perception.includes('cutting-edge')) {
      analysis += 'Perception Type: Innovation focus\n';
    } else if (perception.includes('affordable') || perception.includes('value')) {
      analysis += 'Perception Type: Value proposition\n';
    }
  }

  // Analyze strategic decision making
  if (responses.strategic_decision_making) {
    analysis += `Decision Making: ${responses.strategic_decision_making}\n`;
    
    const decisionStyle = responses.strategic_decision_making.toLowerCase();
    if (decisionStyle.includes('data') || decisionStyle.includes('analytics')) {
      analysis += 'Decision Style: Data-driven approach\n';
    } else if (decisionStyle.includes('gut') || decisionStyle.includes('experience')) {
      analysis += 'Decision Style: Experience-based intuition\n';
    } else if (decisionStyle.includes('collective') || decisionStyle.includes('alignment')) {
      analysis += 'Decision Style: Collaborative consensus\n';
    } else if (decisionStyle.includes('top-down') || decisionStyle.includes('executive')) {
      analysis += 'Decision Style: Executive leadership\n';
    }
  }

  return analysis;
}

function analyzeOperationsSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze tech stack overview
  if (responses.tech_stack_overview) {
    const techTools = Array.isArray(responses.tech_stack_overview) ? responses.tech_stack_overview : [responses.tech_stack_overview];
    analysis += `Tech Stack: ${techTools.join(', ')}\n`;
    
    if (techTools.includes('Salesforce') || techTools.includes('HubSpot')) {
      analysis += 'Tech Focus: CRM and sales automation\n';
    }
    if (techTools.includes('Mailchimp') || techTools.includes('ConvertKit')) {
      analysis += 'Tech Focus: Email marketing automation\n';
    }
    if (techTools.includes('Google Analytics') || techTools.includes('Mixpanel')) {
      analysis += 'Tech Focus: Analytics and data tracking\n';
    }
    if (techTools.includes('Asana') || techTools.includes('Trello')) {
      analysis += 'Tech Focus: Project management\n';
    }
  }

  // Analyze business priorities ranking
  if (responses.business_priorities) {
    const priorities = Array.isArray(responses.business_priorities) ? responses.business_priorities : [responses.business_priorities];
    analysis += `Business Priorities: ${priorities.join(' > ')}\n`;
    
    if (priorities[0] === 'Growth') {
      analysis += 'Priority Focus: Growth-driven strategy\n';
    } else if (priorities[0] === 'Profitability') {
      analysis += 'Priority Focus: Profitability optimization\n';
    } else if (priorities[0] === 'Efficiency') {
      analysis += 'Priority Focus: Operational efficiency\n';
    } else if (priorities[0] === 'Innovation') {
      analysis += 'Priority Focus: Innovation and R&D\n';
    }
  }

  // Analyze process maturity
  if (responses.process_maturity) {
    analysis += `Process Maturity: ${responses.process_maturity}\n`;
    
    if (responses.process_maturity === 'Everything is ad hoc') {
      analysis += 'Maturity Level: Early-stage, reactive\n';
    } else if (responses.process_maturity === 'Some structure, but mostly reactive') {
      analysis += 'Maturity Level: Developing structure\n';
    } else if (responses.process_maturity === 'We have defined processes, but they\'re not consistently followed') {
      analysis += 'Maturity Level: Defined but inconsistent\n';
    } else if (responses.process_maturity === 'Most departments follow documented processes') {
      analysis += 'Maturity Level: Structured approach\n';
    } else if (responses.process_maturity === 'Processes are standardized, automated, and continuously optimized') {
      analysis += 'Maturity Level: Advanced optimization\n';
    }
  }

  return analysis;
}

function analyzeGrowthStackSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze acquisition channels
  if (responses.acquisition_channels) {
    const channels = Array.isArray(responses.acquisition_channels) ? responses.acquisition_channels : [responses.acquisition_channels];
    analysis += `Acquisition Channels: ${channels.join(', ')}\n`;
    
    if (channels.includes('Organic Search / SEO')) {
      analysis += 'Channel Strategy: Organic growth focus\n';
    }
    if (channels.includes('Paid Media (Google, Meta, TikTok, etc.)')) {
      analysis += 'Channel Strategy: Paid advertising investment\n';
    }
    if (channels.includes('Email Marketing')) {
      analysis += 'Channel Strategy: Direct marketing approach\n';
    }
    if (channels.includes('Outbound Sales')) {
      analysis += 'Channel Strategy: Direct sales focus\n';
    }
    if (channels.includes('Partnerships / Affiliates')) {
      analysis += 'Channel Strategy: Partnership-driven growth\n';
    }
    if (channels.length > 3) {
      analysis += 'Channel Strategy: Multi-channel approach\n';
    }
  }

  // Analyze tech maturity
  if (responses.tech_maturity) {
    analysis += `Tech Maturity: ${responses.tech_maturity}\n`;
    
    if (responses.tech_maturity === 'Everything is integrated and works seamlessly') {
      analysis += 'Integration Level: Fully integrated\n';
    } else if (responses.tech_maturity === 'Some systems talk to each other, others don\'t') {
      analysis += 'Integration Level: Partially integrated\n';
    } else if (responses.tech_maturity === 'Tools are siloed or require manual workarounds') {
      analysis += 'Integration Level: Siloed systems\n';
    } else if (responses.tech_maturity === 'We\'re still selecting or onboarding core platforms') {
      analysis += 'Integration Level: Building foundation\n';
    }
  }

  // Analyze retention strategy
  if (responses.retention_strategy) {
    analysis += `Retention Strategy: ${responses.retention_strategy}\n`;
    
    const strategy = responses.retention_strategy.toLowerCase();
    if (strategy.includes('email') || strategy.includes('drip')) {
      analysis += 'Retention Focus: Email lifecycle marketing\n';
    } else if (strategy.includes('customer success') || strategy.includes('support')) {
      analysis += 'Retention Focus: Customer success approach\n';
    } else if (strategy.includes('loyalty') || strategy.includes('program')) {
      analysis += 'Retention Focus: Loyalty programs\n';
    } else if (strategy.includes('product') || strategy.includes('feature')) {
      analysis += 'Retention Focus: Product-driven retention\n';
    } else if (strategy.includes('community') || strategy.includes('network')) {
      analysis += 'Retention Focus: Community building\n';
    }
  }

  return analysis;
}

function analyzeClaritySection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze decision bottlenecks
  if (responses.decision_bottlenecks) {
    analysis += `Decision Bottlenecks: ${responses.decision_bottlenecks}\n`;
    
    const bottlenecks = responses.decision_bottlenecks.toLowerCase();
    if (bottlenecks.includes('hiring') || bottlenecks.includes('talent')) {
      analysis += 'Bottleneck Type: Talent acquisition\n';
    } else if (bottlenecks.includes('prioritization') || bottlenecks.includes('focus')) {
      analysis += 'Bottleneck Type: Strategic prioritization\n';
    } else if (bottlenecks.includes('marketing') || bottlenecks.includes('spend')) {
      analysis += 'Bottleneck Type: Marketing investment decisions\n';
    } else if (bottlenecks.includes('pricing') || bottlenecks.includes('pricing')) {
      analysis += 'Bottleneck Type: Pricing strategy\n';
    } else if (bottlenecks.includes('strategic') || bottlenecks.includes('direction')) {
      analysis += 'Bottleneck Type: Strategic direction\n';
    }
  }

  // Analyze team alignment
  if (responses.team_alignment) {
    analysis += `Team Alignment: ${responses.team_alignment}\n`;
    
    if (responses.team_alignment === 'Fully aligned and collaborative') {
      analysis += 'Alignment Status: Strong team cohesion\n';
    } else if (responses.team_alignment === 'Mostly aligned, occasional friction') {
      analysis += 'Alignment Status: Moderate alignment\n';
    } else if (responses.team_alignment === 'Some misalignment across departments') {
      analysis += 'Alignment Status: Departmental misalignment\n';
    } else if (responses.team_alignment === 'No clear alignment — teams are working in silos') {
      analysis += 'Alignment Status: Siloed teams\n';
    }
  }

  // Analyze future state vision
  if (responses.future_state) {
    analysis += `Future State Vision: ${responses.future_state}\n`;
    
    const vision = responses.future_state.toLowerCase();
    if (vision.includes('revenue') || vision.includes('growth')) {
      analysis += 'Vision Focus: Revenue growth\n';
    } else if (vision.includes('team') || vision.includes('people')) {
      analysis += 'Vision Focus: Team development\n';
    } else if (vision.includes('product') || vision.includes('feature')) {
      analysis += 'Vision Focus: Product development\n';
    } else if (vision.includes('market') || vision.includes('positioning')) {
      analysis += 'Vision Focus: Market positioning\n';
    }
  }

  return analysis;
}

function analyzeBenchmarksSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze insights and benchmarks preferences
  if (responses.insights_benchmarks) {
    const insights = Array.isArray(responses.insights_benchmarks) ? responses.insights_benchmarks : [responses.insights_benchmarks];
    analysis += `Insights Preferences: ${insights.join(', ')}\n`;
    
    if (insights.includes('Competitor comparison')) {
      analysis += 'Focus: Competitive intelligence\n';
    }
    if (insights.includes('Revenue growth levers')) {
      analysis += 'Focus: Revenue optimization\n';
    }
    if (insights.includes('Retention improvements')) {
      analysis += 'Focus: Customer retention\n';
    }
    if (insights.includes('Operational efficiency plays')) {
      analysis += 'Focus: Operational optimization\n';
    }
    if (insights.includes('Industry best practices')) {
      analysis += 'Focus: Industry benchmarking\n';
    }
  }

  // Analyze capital/funding status
  if (responses.capital_funding_status) {
    analysis += `Funding Status: ${responses.capital_funding_status}\n`;
    
    if (responses.capital_funding_status === 'Yes, actively raising') {
      analysis += 'Funding Stage: Active fundraising\n';
    } else if (responses.capital_funding_status === 'In early planning stages') {
      analysis += 'Funding Stage: Planning phase\n';
    } else if (responses.capital_funding_status === 'Preparing for acquisition or sale') {
      analysis += 'Funding Stage: Exit preparation\n';
    } else if (responses.capital_funding_status === 'No, not on the roadmap') {
      analysis += 'Funding Stage: Organic growth focus\n';
    }
  }

  // Analyze growth pace
  if (responses.growth_pace) {
    analysis += `Growth Pace: ${responses.growth_pace}\n`;
    
    if (responses.growth_pace === '10–25% YoY') {
      analysis += 'Growth Stage: Steady, sustainable growth\n';
    } else if (responses.growth_pace === '25–50% YoY') {
      analysis += 'Growth Stage: Moderate acceleration\n';
    } else if (responses.growth_pace === '50–100% YoY') {
      analysis += 'Growth Stage: Fast growth trajectory\n';
    } else if (responses.growth_pace === '2x–3x') {
      analysis += 'Growth Stage: Rapid scaling\n';
    } else if (responses.growth_pace === '3x+') {
      analysis += 'Growth Stage: Hypergrowth mode\n';
    }
  }

  return analysis;
}

function analyzeFinalSection(responses: Record<string, any>): string {
  let analysis = '';

  // Analyze unresolved issues
  if (responses.unresolved_issue) {
    analysis += `Unresolved Issue: ${responses.unresolved_issue}\n`;
    
    const issue = responses.unresolved_issue.toLowerCase();
    if (issue.includes('onboarding') || issue.includes('process')) {
      analysis += 'Issue Type: Process optimization\n';
    } else if (issue.includes('pricing') || issue.includes('strategy')) {
      analysis += 'Issue Type: Strategic pricing\n';
    } else if (issue.includes('team') || issue.includes('hiring')) {
      analysis += 'Issue Type: Team development\n';
    } else if (issue.includes('marketing') || issue.includes('acquisition')) {
      analysis += 'Issue Type: Marketing optimization\n';
    } else if (issue.includes('product') || issue.includes('feature')) {
      analysis += 'Issue Type: Product development\n';
    }
  }

  // Analyze commitment confirmation
  if (responses.commitment_confirmation) {
    analysis += `Commitment Level: ${responses.commitment_confirmation}\n`;
    
    if (responses.commitment_confirmation === '✅ Yes — I\'m ready to grow.') {
      analysis += 'Commitment Status: High commitment to growth\n';
    } else if (responses.commitment_confirmation === '❌ No — not at this time.') {
      analysis += 'Commitment Status: Not ready for commitment\n';
    }
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
    
    // Analyze target market
    if (desc.includes('b2b') || desc.includes('enterprise')) {
      analysis += 'Target Market: B2B/Enterprise\n';
    } else if (desc.includes('b2c') || desc.includes('consumer')) {
      analysis += 'Target Market: B2C/Consumer\n';
    } else if (desc.includes('small') || desc.includes('medium')) {
      analysis += 'Target Market: SMB\n';
    }
    
    // Analyze value proposition
    if (desc.includes('efficiency') || desc.includes('automation')) {
      analysis += 'Value Prop: Efficiency/Automation\n';
    } else if (desc.includes('cost') || desc.includes('savings')) {
      analysis += 'Value Prop: Cost Savings\n';
    } else if (desc.includes('quality') || desc.includes('premium')) {
      analysis += 'Value Prop: Quality/Premium\n';
    }
  }

  return analysis;
} 