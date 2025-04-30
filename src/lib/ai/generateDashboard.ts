// /lib/ai/generateDashboard.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type DashboardScores = {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
  industryAvgScore: number;
  topPerformerScore: number;
  benchmarking: Record<string, string>;
  strengths: { title: string; impact: string }[];
  weaknesses: { title: string; impact: string }[];
  roadmap: { task: string; expectedImpact: string }[];
};

export async function generateDashboardScores(user: any, assessment: any): Promise<DashboardScores | null> {
      // 🧠 Build OpenAI prompt
    const aiPrompt = `
    You are a world-class business strategist hired to evaluate high-growth companies. 
    Your role is to synthesize the qualitative and operational inputs below to generate a full assessment of the business: 
    its current position, strategic gaps, comparative benchmarks, and a 30-day improvement roadmap.
    
    Return your response as a **well-formatted JSON object** with **no commentary or extra text**.
    
    ---
    
    ## 🧠 Company Profile
    - **Industry:** ${user.industry}
    - **Company Size:** ${user.company_size}
    - **Revenue Range:** ${user.revenue_range}
    
    ---
    
    ## 📋 Strategic Assessment Responses
    
    - **Growth Metrics Tracked:** ${assessment.growth_metrics}
    - **Go-to-Market Strategy:** ${assessment.gtm_strategy}
    - **Biggest Friction Points:** ${assessment.friction_points}
    - **Differentiator (Competitive Edge):** ${assessment.differentiator}
    - **Customer Brand Perception:** ${assessment.brand_perception}
    - **Top Priorities (Ranked):** ${assessment.business_priorities}
    - **Core Tech Stack:** ${assessment.tech_stack}
    - **Internal Process Discipline:** ${assessment.process_discipline}
    - **Winning Acquisition Channels:** ${assessment.acquisition_channels}
    - **Technology Maturity Level:** ${assessment.tech_maturity}
    - **Retention Strategy:** ${assessment.retention_strategy}
    - **Current Decision Bottlenecks:** ${assessment.decision_bottlenecks}
    - **Team Alignment on Goals:** ${assessment.team_alignment}
    - **12-Month Vision of Success:** ${assessment.future_success}
    - **Preferred Benchmarking Insights:** ${assessment.benchmark_preferences}
    - **Funding Status or Exit Prep:** ${assessment.funding_status}
    - **Ideal Pace of Growth:** ${assessment.growth_pace}
    - **Unresolved Internal Issues:** ${assessment.unresolved_issue}
    - **Willingness to Commit to Growth Model:** ${assessment.final_confirmation}
    
    ---
    
    ## 🎯 Your Task
    Using this data:
    - Assign a score (1–5) for **strategy**, **process**, and **technology** maturity
    - Benchmark this business against **industry averages** and **top performers**
    - List 2–4 **strengths** and **weaknesses**, each with a practical business impact
    - Build a high-impact **30-day roadmap** with tactical steps that address weaknesses and accelerate growth
    
    ---
    
    ## 📦 JSON Response Format
    Return a structured JSON object like:
    
    {
      "strategyScore": 3.5,
      "processScore": 3.0,
      "technologyScore": 4.0,
      "score": 3.5,
      "industryAvgScore": 3.2,
      "topPerformerScore": 4.5,
      "benchmarking": {
        "strategy": "...",
        "process": "...",
        "technology": "..."
      },
      "strengths": [ { "title": "...", "impact": "..." } ],
      "weaknesses": [ { "title": "...", "impact": "..." } ],
      "roadmap": [ { "task": "...", "expectedImpact": "..." } ]
    }
    `;

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Respond in valid JSON only." },
          { role: "user", content: aiPrompt },
        ],
        max_tokens: 900,
      });
  
      let content = aiResponse.choices[0].message.content || "{}";
      if (content.startsWith("```")) {
        content = content.replace(/```(?:json)?/g, "").trim();
      }
  // 🧪 Log raw GPT content
  console.log("🧠 Raw OpenAI response content:", content);
      const parsed = JSON.parse(content);
  // 🧪 Log parsed object
  console.log("🧪 Parsed AI response object:", JSON.stringify(parsed, null, 2));
      if (
        !parsed.strategyScore ||
        !parsed.processScore ||
        !parsed.technologyScore ||
        !parsed.score ||
        !parsed.benchmarking ||
        !Array.isArray(parsed.strengths) ||
        !Array.isArray(parsed.weaknesses) ||
        !Array.isArray(parsed.roadmap)
      ) {
        console.error("❌ Missing expected fields in parsed OpenAI response:", parsed);
        return null;
      }
      
      return {
        strategyScore: parsed.strategyScore,
        processScore: parsed.processScore,
        technologyScore: parsed.technologyScore,
        score: parsed.score,
        industryAvgScore: parsed.industryAvgScore,
        topPerformerScore: parsed.topPerformerScore,
        benchmarking: parsed.benchmarking,
        strengths: parsed.strengths,
        weaknesses: parsed.weaknesses,
        roadmap: parsed.roadmap,
      };
      
    } catch (error) {
      console.error("❌ Failed to generate dashboard scores:", error);
      return null;
    }
  }
