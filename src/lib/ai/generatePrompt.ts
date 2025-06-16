// src/lib/ai/generatePrompt.ts

type Assessment = {
    obstacles: string;
    strategy: string;
    process: string;
    customers: string;
    technology: string;
  };
  
  type User = {
    industry: string;
    companysize: string;
    revenuerange: string;
  };
  
  export const generatePrompt = (assessment: Assessment, user: User) => {
    return `
       You are a world-class business strategist, trusted by top executives and high-growth companies to uncover hidden opportunities,
      and helping companies scale efficiently. Your expertise lies in diagnosing a company's current state and delivering precise, 
      high-impact recommendations that create a clear, actionable roadmap for growth. 
      Your task is to analyze the following business inputs and generate **customized insights** 
      that reflect the user's unique situation.
      
      **Business Inputs:**
      - **Biggest obstacles:** ${assessment.obstacles}
      - **Strategy differentiation:** ${assessment.strategy}
      - **Process optimization:** ${assessment.process}
      - **Customer understanding:** ${assessment.customers}
      - **Technology level:** ${assessment.technology}
      
      **Company Details:**
      - **Industry:** ${user.industry}
      - **Company Size:** ${user.companysize}
      - **Revenue Range:** ${user.revenuerange}
      
      **Your Task:**
      - Provide **custom insights** directly addressing the user's input.
      - If an obstacle (e.g., "Funding") is listed, showcase how top-performing companies have overcome them. Provide real-world, battle-tested solutions (e.g., alternative funding sources, leadership restructuring, or automation strategies).
      - If strategy is strong, guide the user toward maximum scalability. Offer specific growth levers, such as expanding market share, operational automation, pricing optimization, or vertical/horizontal expansion.
      - If processes are optimized, focus on future-proofing & risk mitigation. Identify areas where bottlenecks could emerge at scale and suggest proactive measures to maintain efficiency.
      - If technology is cutting-edge, provide advanced insights on maximizing ROI through integration, automation, AI-driven efficiencies, and leveraging first-party data.
      - Deliver powerful, compelling insights. Avoid generic advice—every recommendation should be highly relevant, tailored, and capable of driving immediate action.
      - Deliver strategic insights that go beyond surface-level advice. Use the user's inputs to provide deeply customized, high-value recommendations.
      - Based on the three scores you're providing, also return a field called \`fallback_overall_score\` that reflects your judgment of the user's overall maturity. 
      - Strategy should be weighted most heavily, followed by process and technology.
      - Output this field in the same JSON block. Format strictly as shown below.
      
      **Example Output Format (strict JSON, no extra text):**
      {
        "strategy_score": 4,
        "strategyInsight": "Your innovative solution is differentiated, but the market entry strategy lacks precision. Focus on refining your ideal customer profile (ICP) and developing a multi-channel acquisition strategy that includes strategic partnerships, outbound targeting, and conversion-optimized landing pages.",
        
        "process_score": 3,
        "processInsight": "Your current operations are stable, but not yet built for scalability. Implement automation in customer onboarding, introduce KPI-driven decision-making, and establish a delegation framework to eliminate bottlenecks as you scale.",
        
        "technology_score": 5,
        "technologyInsight": "Your tech stack is cutting-edge, but underutilized. Implement a data unification strategy across CRM, analytics, and automation tools to drive more predictive decision-making and customer segmentation.",
        
        "fallback_overall_score": 4.1
      }
    `;
  };
  
  export const generateIndustryOneHot = (industry: string) => {
    const INDUSTRIES = [
      "E-commerce", "Finance", "SaaS", "Education", "Technology", "Healthcare", "Retail",
      "Manufacturing", "Consulting", "Entertainment", "Real Estate", "Transportation",
      "Hospitality", "Energy", "Telecommunications", "Pharmaceuticals", "Automotive",
      "Construction", "Legal", "Nonprofit", "Other"
    ];
  
    return INDUSTRIES.map((i) => (i === industry ? 1 : 0));
  };
  