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

    // Generate specific response based on section and responses
    const specificResponse = generateSpecificResponse(sectionId, responses, userContext);

    // If we have a specific response, use it; otherwise fall back to AI generation
    if (specificResponse) {
      return specificResponse;
    }

    // Fallback to AI generation for sections not yet covered
    const prompt = `You are a senior growth consultant with 15+ years of experience working with hundreds of companies. You're conducting a strategic assessment session with a business leader.

${userContext}

The user just completed the "${sectionName}" section. Here's what they shared:

${JSON.stringify(responses, null, 2)}

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

function generateSpecificResponse(sectionId: string, responses: Record<string, any>, userContext: string): string {
  switch (sectionId) {
    case 'goals':
      return generateGoalsResponse(responses);
    case 'positioning':
      return generatePositioningResponse(responses);
    case 'operations':
      return generateOperationsResponse(responses);
    case 'growth_stack':
      return generateGrowthStackResponse(responses);
    case 'clarity':
      return generateClarityResponse(responses);
    case 'benchmarks':
      return generateBenchmarksResponse(responses);
    case 'final':
      return generateFinalResponse(responses);
    case 'business_overview':
      return generateBusinessOverviewResponse(responses);
    default:
      return '';
  }
}

function generateGoalsResponse(responses: Record<string, any>): string {
  let response = '';

  // Question 1: Growth Metrics
  if (responses.growth_metrics) {
    const metrics = Array.isArray(responses.growth_metrics) ? responses.growth_metrics : [responses.growth_metrics];
    
    if (metrics.includes('Revenue')) {
      response += "I see you're tracking revenue closely—that's the lifeblood of any business. What I'm curious about is whether you're also monitoring the quality of that revenue. Companies that focus solely on top-line growth often miss the signals that predict sustainable scaling. ";
    } else if (metrics.includes('Profit Margin')) {
      response += "Profit margin focus shows you understand the importance of unit economics—that's sophisticated thinking. Many companies chase growth at the expense of profitability and end up in a dangerous cycle. ";
    } else if (metrics.includes('Customer Lifetime Value (LTV)') || metrics.includes('Customer Acquisition Cost (CAC)')) {
      response += "Excellent—you're tracking the fundamental unit economics. LTV/CAC ratio is often the best predictor of long-term success. Companies with strong LTV/CAC ratios can afford to be more aggressive with growth investments. ";
    } else if (metrics.includes('Customer Churn Rate') || metrics.includes('Customer Retention Rate')) {
      response += "Smart focus on retention—it's often more profitable to keep existing customers than acquire new ones. Companies that crack the retention code typically have much more predictable growth. ";
    } else if (metrics.includes('Conversion Rate')) {
      response += "Conversion rate optimization is a powerful lever. The best conversion strategies often come from understanding the customer journey deeply. ";
    } else if (metrics.includes('Website or App Traffic') || metrics.includes('Monthly Active Users (MAU)')) {
      response += "Traffic and engagement metrics are great leading indicators. But I'm curious about the quality of that traffic—are you seeing the right people engaging, or just more volume? ";
    } else if (metrics.includes('Net Promoter Score (NPS)')) {
      response += "NPS focus shows you understand the importance of customer satisfaction. Companies with high NPS often have organic growth advantages through word-of-mouth. ";
    } else if (metrics.length > 1) {
      response += "You're tracking a well-rounded set of metrics—that's a sign of mature business thinking. How do you prioritize these metrics when they conflict? ";
    }
  }

  // Question 2: Go-To-Market Strategy
  if (responses.gtm_strategy) {
    const strategy = responses.gtm_strategy.toLowerCase();
    
    if (strategy.includes('content') || strategy.includes('seo') || strategy.includes('organic')) {
      response += "Content-driven growth is excellent for building sustainable competitive advantages. The best content strategies often take 6-12 months to show real ROI. ";
    } else if (strategy.includes('paid') || strategy.includes('advertising') || strategy.includes('ads')) {
      response += "Paid channels can drive immediate results, but they require constant optimization. Companies that succeed with paid often have strong organic foundations as well. ";
    } else if (strategy.includes('sales') || strategy.includes('outbound')) {
      response += "Direct sales approaches can be highly effective for B2B or high-value products. The best sales strategies often combine outbound with strong inbound lead generation. ";
    } else if (strategy.includes('partnership') || strategy.includes('partner')) {
      response += "Partnerships can be powerful growth multipliers. The most successful partnership strategies often start with a few key relationships and expand systematically. ";
    } else if (strategy.includes('community') || strategy.includes('referral')) {
      response += "Community-driven growth is incredibly powerful when done right. Companies that build strong communities often have much lower customer acquisition costs. ";
    } else {
      response += "Your go-to-market approach shows strategic thinking. ";
    }
  }

  // Question 3: Friction Points
  if (responses.friction_points) {
    const frictionPoints = Array.isArray(responses.friction_points) ? responses.friction_points : [responses.friction_points];
    
    if (frictionPoints.includes('Lack of funding')) {
      response += "Funding constraints can actually force better business discipline. Many companies that bootstrap successfully develop stronger unit economics and more sustainable growth models. ";
    } else if (frictionPoints.includes('Leadership misalignment')) {
      response += "Leadership alignment issues are common in growing companies. Companies that solve alignment issues early often avoid much bigger problems later. ";
    } else if (frictionPoints.includes('Hiring or retention challenges')) {
      response += "Talent challenges are universal in today's market. Companies that solve talent issues often focus on culture, growth opportunities, and clear career paths. ";
    } else if (frictionPoints.includes('Operational inefficiencies')) {
      response += "Operational bottlenecks often indicate growth—systems that worked at one scale break at the next. Process optimization can often unlock significant growth capacity. ";
    } else if (frictionPoints.includes('Underperforming marketing')) {
      response += "Marketing underperformance often stems from either targeting issues or conversion problems. The best marketing optimizations often start with customer research and journey mapping. ";
    } else if (frictionPoints.includes('High customer acquisition cost')) {
      response += "High CAC is a common challenge in competitive markets. Companies that solve CAC issues often focus on improving LTV first, then optimizing acquisition. ";
    } else if (frictionPoints.includes('Weak customer retention')) {
      response += "Retention issues often indicate product-market fit or customer success problems. The best retention strategies often start with understanding why customers leave. ";
    } else if (frictionPoints.includes('Tech stack limitations')) {
      response += "Tech limitations can seriously constrain growth. Companies that solve tech issues often prioritize integration and automation over adding more tools. ";
    } else if (frictionPoints.includes('Undefined brand positioning')) {
      response += "Unclear positioning makes every marketing dollar less effective. The best positioning strategies often start with customer research and competitive analysis. ";
    }
  }

  return response || "Thank you for sharing your goals and priorities. This gives me a clear picture of where you're focused and what's holding you back. ";
}

function generatePositioningResponse(responses: Record<string, any>): string {
  let response = '';

  // Question 1: Differentiator
  if (responses.differentiator) {
    const differentiator = responses.differentiator.toLowerCase();
    
    if (differentiator.includes('technology') || differentiator.includes('tech') || differentiator.includes('platform')) {
      response += "Technology differentiation can be incredibly powerful when executed well. The key is ensuring your tech advantage translates into customer value that's hard to replicate. ";
    } else if (differentiator.includes('data') || differentiator.includes('analytics') || differentiator.includes('insights')) {
      response += "Data-driven differentiation is becoming increasingly valuable. Companies that can turn data into actionable insights often have significant competitive advantages. ";
    } else if (differentiator.includes('service') || differentiator.includes('support') || differentiator.includes('experience')) {
      response += "Service differentiation is often underrated but incredibly effective. Companies that excel at customer experience often have much higher retention and referral rates. ";
    } else if (differentiator.includes('team') || differentiator.includes('people') || differentiator.includes('expertise')) {
      response += "Team and expertise differentiation is often the most sustainable competitive advantage. The right people can adapt to changing market conditions better than any technology. ";
    } else if (differentiator.includes('process') || differentiator.includes('methodology') || differentiator.includes('approach')) {
      response += "Process differentiation can create significant efficiency advantages. Companies that optimize their core processes often have better margins and faster execution. ";
    } else {
      response += "Your differentiation strategy shows clear thinking about competitive advantages. ";
    }
  }

  // Question 2: Competitive Landscape
  if (responses.competitive_landscape) {
    const landscape = responses.competitive_landscape.toLowerCase();
    
    if (landscape.includes('crowded') || landscape.includes('saturated') || landscape.includes('many competitors')) {
      response += "A crowded market can actually be a good sign—it means there's real demand. The key is finding your unique positioning within that market. ";
    } else if (landscape.includes('emerging') || landscape.includes('new') || landscape.includes('growing')) {
      response += "Emerging markets offer great opportunities but also require careful navigation. Being early can give you significant advantages if you execute well. ";
    } else if (landscape.includes('consolidated') || landscape.includes('few players') || landscape.includes('oligopoly')) {
      response += "Consolidated markets often have high barriers to entry but also significant opportunities for disruption. ";
    } else {
      response += "Understanding your competitive landscape is crucial for effective positioning. ";
    }
  }

  return response || "Your market positioning strategy shows thoughtful consideration of your competitive advantages. ";
}

function generateOperationsResponse(responses: Record<string, any>): string {
  let response = '';

  // Question 1: Team Structure
  if (responses.team_structure) {
    const structure = responses.team_structure.toLowerCase();
    
    if (structure.includes('lean') || structure.includes('small') || structure.includes('startup')) {
      response += "Lean team structures can be incredibly efficient and allow for fast decision-making. Many successful companies maintain lean operations even as they scale. ";
    } else if (structure.includes('department') || structure.includes('functional') || structure.includes('organized')) {
      response += "Functional organization shows you're thinking about scalability and specialization. The key is ensuring departments work together effectively. ";
    } else if (structure.includes('cross-functional') || structure.includes('agile') || structure.includes('squad')) {
      response += "Cross-functional teams can drive innovation and faster execution. Companies that master cross-functional collaboration often have significant competitive advantages. ";
    } else {
      response += "Your team structure reflects your operational priorities and growth stage. ";
    }
  }

  // Question 2: Decision Making
  if (responses.decision_making) {
    const decisionMaking = responses.decision_making.toLowerCase();
    
    if (decisionMaking.includes('data') || decisionMaking.includes('analytics') || decisionMaking.includes('metrics')) {
      response += "Data-driven decision making is essential for scaling effectively. Companies that build strong data cultures often make better long-term decisions. ";
    } else if (decisionMaking.includes('consensus') || decisionMaking.includes('collaborative') || decisionMaking.includes('team')) {
      response += "Collaborative decision making can lead to better buy-in and execution. The key is balancing collaboration with speed. ";
    } else if (decisionMaking.includes('hierarchical') || decisionMaking.includes('top-down') || decisionMaking.includes('leadership')) {
      response += "Clear decision-making authority can speed up execution. The best hierarchical structures maintain accountability while empowering teams. ";
    } else {
      response += "Your decision-making approach reflects your company culture and operational needs. ";
    }
  }

  return response || "Your operational approach shows you're thinking systematically about scaling your business. ";
}

function generateGrowthStackResponse(responses: Record<string, any>): string {
  let response = '';

  // Question 1: Tech Stack
  if (responses.tech_stack) {
    const techStack = Array.isArray(responses.tech_stack) ? responses.tech_stack : [responses.tech_stack];
    
    if (techStack.length > 5) {
      response += "You have a comprehensive tech stack—that shows you're investing in tools. The key is ensuring these tools work together effectively rather than creating complexity. ";
    } else if (techStack.length <= 3) {
      response += "A focused tech stack can be incredibly powerful. Many successful companies do more with fewer, better-integrated tools. ";
    } else {
      response += "Your tech stack reflects your current growth priorities and operational needs. ";
    }
  }

  // Question 2: Automation Level
  if (responses.automation_level) {
    const automation = responses.automation_level.toLowerCase();
    
    if (automation.includes('high') || automation.includes('advanced') || automation.includes('automated')) {
      response += "High automation levels can create significant operational advantages. Companies that automate effectively often have better margins and faster execution. ";
    } else if (automation.includes('medium') || automation.includes('partial') || automation.includes('some')) {
      response += "Balanced automation approaches often work well for growing companies. The key is automating the right processes at the right time. ";
    } else if (automation.includes('low') || automation.includes('manual') || automation.includes('basic')) {
      response += "Manual processes can work well in early stages, but automation becomes increasingly important as you scale. ";
    } else {
      response += "Your automation approach reflects your current operational priorities. ";
    }
  }

  return response || "Your growth stack shows you're thinking about the tools and systems needed to scale effectively. ";
}

function generateClarityResponse(responses: Record<string, any>): string {
  let response = '';

  // Question 1: Vision Clarity
  if (responses.vision_clarity) {
    const clarity = responses.vision_clarity.toLowerCase();
    
    if (clarity.includes('very clear') || clarity.includes('crystal clear') || clarity.includes('well defined')) {
      response += "Having a clear vision is incredibly powerful for alignment and execution. Companies with clear visions often make better strategic decisions. ";
    } else if (clarity.includes('somewhat clear') || clarity.includes('evolving') || clarity.includes('developing')) {
      response += "Vision clarity often evolves as companies grow and learn. The key is ensuring your team understands the current direction. ";
    } else if (clarity.includes('unclear') || clarity.includes('fuzzy') || clarity.includes('confusing')) {
      response += "Vision clarity issues are common in growing companies. Many successful companies go through periods of vision refinement. ";
    } else {
      response += "Your vision clarity reflects your current stage of development. ";
    }
  }

  // Question 2: Communication
  if (responses.communication) {
    const communication = responses.communication.toLowerCase();
    
    if (communication.includes('excellent') || communication.includes('strong') || communication.includes('effective')) {
      response += "Strong communication is essential for execution. Companies that communicate well often have better alignment and faster execution. ";
    } else if (communication.includes('good') || communication.includes('adequate') || communication.includes('improving')) {
      response += "Communication is often an area where companies can make significant improvements. The best communication strategies are consistent and transparent. ";
    } else if (communication.includes('challenging') || communication.includes('difficult') || communication.includes('poor')) {
      response += "Communication challenges are common in growing companies. Many successful companies invest heavily in improving communication as they scale. ";
    } else {
      response += "Your communication approach reflects your current organizational needs. ";
    }
  }

  return response || "Your clarity and communication approach shows you're thinking about organizational effectiveness. ";
}

function generateBenchmarksResponse(responses: Record<string, any>): string {
  let response = '';

  // Question 1: Industry Benchmarks
  if (responses.industry_benchmarks) {
    const benchmarks = responses.industry_benchmarks.toLowerCase();
    
    if (benchmarks.includes('above') || benchmarks.includes('leading') || benchmarks.includes('top')) {
      response += "Leading industry performance is excellent. Companies that consistently outperform benchmarks often have significant competitive advantages. ";
    } else if (benchmarks.includes('average') || benchmarks.includes('middle') || benchmarks.includes('typical')) {
      response += "Average performance can be a good foundation for improvement. Many companies make significant gains by focusing on key performance areas. ";
    } else if (benchmarks.includes('below') || benchmarks.includes('lagging') || benchmarks.includes('struggling')) {
      response += "Below-average performance often indicates opportunities for improvement. Many companies turn around performance by focusing on fundamentals. ";
    } else {
      response += "Understanding your benchmark position is crucial for setting realistic goals. ";
    }
  }

  // Question 2: Growth Rate
  if (responses.growth_rate) {
    const growthRate = responses.growth_rate.toLowerCase();
    
    if (growthRate.includes('high') || growthRate.includes('fast') || growthRate.includes('rapid')) {
      response += "High growth rates are exciting but also require careful management. Companies that sustain high growth often have strong operational foundations. ";
    } else if (growthRate.includes('steady') || growthRate.includes('consistent') || growthRate.includes('stable')) {
      response += "Steady growth can be more sustainable than rapid growth. Many successful companies prioritize consistent, predictable growth over explosive growth. ";
    } else if (growthRate.includes('slow') || growthRate.includes('flat') || growthRate.includes('declining')) {
      response += "Slow or flat growth often indicates the need for strategic changes. Many companies successfully turn around growth by focusing on fundamentals. ";
    } else {
      response += "Your growth rate reflects your current market position and strategic priorities. ";
    }
  }

  return response || "Your benchmark position gives us important context for understanding your current performance. ";
}

function generateFinalResponse(responses: Record<string, any>): string {
  return "Thank you for sharing your insights. This gives me a comprehensive picture of your business and growth priorities. Based on what you've shared, I can see several opportunities for optimization and growth. Let me analyze your responses and provide you with a detailed assessment and strategic roadmap. ";
}

function generateBusinessOverviewResponse(responses: Record<string, any>): string {
  let response = '';

  // Question 1: Business Model
  if (responses.business_model) {
    const model = responses.business_model.toLowerCase();
    
    if (model.includes('saas') || model.includes('subscription') || model.includes('recurring')) {
      response += "SaaS and subscription models can create excellent recurring revenue streams. The key is balancing growth with unit economics. ";
    } else if (model.includes('marketplace') || model.includes('platform') || model.includes('network')) {
      response += "Marketplace and platform models can create powerful network effects. The challenge is often getting to critical mass. ";
    } else if (model.includes('ecommerce') || model.includes('retail') || model.includes('product')) {
      response += "Product-based businesses face unique challenges around inventory, logistics, and customer acquisition. ";
    } else if (model.includes('service') || model.includes('consulting') || model.includes('agency')) {
      response += "Service businesses often have high margins but face scalability challenges. The key is systematizing delivery. ";
    } else {
      response += "Your business model reflects your market opportunity and competitive advantages. ";
    }
  }

  // Question 2: Market Size
  if (responses.market_size) {
    const marketSize = responses.market_size.toLowerCase();
    
    if (marketSize.includes('large') || marketSize.includes('billion') || marketSize.includes('massive')) {
      response += "Large markets offer significant opportunities but also intense competition. The key is finding your unique positioning. ";
    } else if (marketSize.includes('medium') || marketSize.includes('niche') || marketSize.includes('specialized')) {
      response += "Niche markets can be excellent for building strong competitive positions. Many successful companies dominate smaller markets before expanding. ";
    } else if (marketSize.includes('small') || marketSize.includes('emerging') || marketSize.includes('new')) {
      response += "Small or emerging markets offer first-mover advantages but also require market education. ";
    } else {
      response += "Your market size influences your growth strategy and competitive approach. ";
    }
  }

  return response || "Your business overview gives us important context for understanding your growth opportunities. ";
} 