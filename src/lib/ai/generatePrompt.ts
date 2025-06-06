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
      1. Analyze the business inputs and company details
      2. Assign scores (1-5) for strategy, process, and technology maturity
      3. Calculate an overall score considering:
         - Industry-specific weighting (e.g., technology companies should weight tech score higher)
         - Balance between strategy, process, and technology
         - Overall business maturity level
      4. Provide detailed insights for each area
      
      **Scoring Guidelines:**
      - Strategy Score (1-5): Based on market positioning, competitive advantage, and growth potential
      - Process Score (1-5): Based on operational efficiency, scalability, and automation
      - Technology Score (1-5): Based on tech stack maturity, integration, and digital capabilities
      - Overall Score (1-5): Weighted average considering industry context and company size
      
      **Example Output Format (strict JSON, no extra text):**
      {
        "strategy_score": 4,
        "strategy_insight": "Your innovative solution is differentiated, but the market entry strategy lacks precision. Focus on refining your ideal customer profile (ICP) and developing a multi-channel acquisition strategy that includes strategic partnerships, outbound targeting, and conversion-optimized landing pages.",
        
        "process_score": 3,
        "process_insight": "Your current operations are stable, but not yet built for scalability. Implement automation in customer onboarding, introduce KPI-driven decision-making, and establish a delegation framework to eliminate bottlenecks as you scale.",
        
        "technology_score": 5,
        "technology_insight": "Your tech stack is cutting-edge, but underutilized. Implement a data unification strategy across CRM, analytics, and automation tools to drive more predictive decision-making and customer segmentation.",
        
        "overall_score": 4.2
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
  