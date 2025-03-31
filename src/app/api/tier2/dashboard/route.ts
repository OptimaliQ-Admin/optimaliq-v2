// File: /src/app/api/tier2/dashboard/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    // 🔍 Fetch user by email
    const { data: user, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = user.user_id;

    // 🔍 Fetch most recent onboarding assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("onboarding_assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError || !assessment)
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

    // ⏳ Check if assessment is older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const assessmentDate = new Date(assessment.created_at);
    const promptRetake = assessmentDate < thirtyDaysAgo;

    // 🔍 Check if existing dashboard insights already exist
    const { data: existingInsights } = await supabase
      .from("tier2_dashboard_insights")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingInsights && !promptRetake) {
      console.log("✅ Returning cached dashboard insights");
      return NextResponse.json({ ...existingInsights, promptRetake });
    }

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
These answers reflect how the company currently thinks about growth, operations, and market position:

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
    "strategy": "How this business compares on strategy",
    "process": "How this business compares on process",
    "technology": "How this business compares on tech"
  },

  "strengths": [
    { "title": "Strong Brand Perception", "impact": "Creates pricing power and customer loyalty" },
    ...
  ],

  "weaknesses": [
    { "title": "Lack of Retention Strategy", "impact": "Results in higher churn and lower lifetime value" },
    ...
  ],

  "roadmap": [
    {
      "task": "Implement onboarding automation for new clients",
      "expectedImpact": "Reduces churn and improves time-to-value for new accounts"
    },
    ...
  ]
}
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Respond in valid JSON only." },
        { role: "user", content: aiPrompt },
      ],
      max_tokens: 900,
    });

    const parsed = JSON.parse(aiResponse.choices[0].message.content || "{}");

    // 📈 Chart Data
    const chartData = [
      { month: "Now", userScore: parsed.score, industryScore: parsed.industryAvgScore, topPerformerScore: parsed.topPerformerScore },
      { month: "3 Months", userScore: Math.min(5, parsed.score + 0.5), industryScore: parsed.industryAvgScore, topPerformerScore: parsed.topPerformerScore },
      { month: "6 Months", userScore: Math.min(5, parsed.score + 1), industryScore: parsed.industryAvgScore, topPerformerScore: parsed.topPerformerScore },
      { month: "12 Months", userScore: Math.min(5, parsed.score + 2), industryScore: parsed.industryAvgScore, topPerformerScore: parsed.topPerformerScore }
    ];

    const finalPayload = {
      user_id: userId,
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
      chartData,
      updated_at: new Date().toISOString(),
    };

    // 💾 Store in Supabase
    await supabase
      .from("tier2_dashboard_insights")
      .upsert(finalPayload, { onConflict: "user_id" });

    return NextResponse.json({ ...finalPayload, promptRetake });
  } catch (error) {
    console.error("❌ Dashboard API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}