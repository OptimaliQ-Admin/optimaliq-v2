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

    // ✅ Fetch user by email
    const { data: user, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = user.user_id;

    // ✅ Fetch most recent onboarding assessment using user_id
    const { data: assessment, error: assessmentError } = await supabase
      .from("onboarding_assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError || !assessment)
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

    // ✅ Prompt retake if over 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const assessmentDate = new Date(assessment.created_at);
    const promptRetake = assessmentDate < thirtyDaysAgo;

    // ✅ Check for existing dashboard insights
    const { data: existingInsights } = await supabase
      .from("tier2_dashboard_insights")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingInsights && !promptRetake) {
      return NextResponse.json({ ...existingInsights, promptRetake });
    }

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

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Respond in valid JSON only." },
        { role: "user", content: aiPrompt },
      ],
      max_tokens: 900,
    });

    let rawContent = aiResponse.choices[0].message.content || "{}";

// 🧼 Strip Markdown code block if present
if (rawContent.startsWith("```")) {
  rawContent = rawContent.replace(/```(?:json)?/g, "").trim();
}

let parsed;
try {
  parsed = JSON.parse(rawContent);
} catch (parseError) {
  console.error("❌ JSON Parse Error:", parseError);
  console.log("🪵 Raw OpenAI Response:", rawContent);
  return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
}

    // 📈 Score Chart
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
    console.log("🔍 Parsed AI response:", parsed);
    // 💾 Store Insights
    const { error: upsertError } = await supabase
  .from("tier2_dashboard_insights")
  .upsert(finalPayload, { onConflict: "user_id" });

if (upsertError) {
  console.error("❌ Failed to insert dashboard insights:", upsertError);
} else {
  console.log("✅ Dashboard insights successfully stored in Supabase.");
}
    return NextResponse.json({ ...finalPayload, promptRetake });
  } catch (error) {
    console.error("❌ Dashboard API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  
}
