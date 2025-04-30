// File: /src/app/api/tier2/profile/update/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

import { getErrorMessage } from "@/utils/errorHandler";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json();
    if (!u_id) return NextResponse.json({ error: "Missing u_id" }, { status: 400 });

    // 🔍 Pull most recent onboarding assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("onboarding_assessments")
      .select("*")
      .eq("u_id", u_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // 🔍 Pull user metadata
    const { data: user, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("u_id", u_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🧠 AI scoring prompt
    const aiPrompt = `
You are a business analyst evaluating a company based on the following information.
Assign a 1-5 score for strategy, process, and technology maturity based on completeness, clarity, and growth potential.
Return only valid JSON.

---
Industry: ${user.industry}
Company Size: ${user.company_size}
Revenue Range: ${user.revenue_range}

Assessment:
- Growth Metrics: ${assessment.growth_metrics}
- GTM Strategy: ${assessment.gtm_strategy}
- Friction Points: ${assessment.friction_points}
- Differentiator: ${assessment.differentiator}
- Brand Perception: ${assessment.brand_perception}
- Priorities: ${assessment.business_priorities}
- Tech Stack: ${assessment.tech_stack}
- Process Discipline: ${assessment.process_discipline}
- Channels: ${assessment.acquisition_channels}
- Tech Maturity: ${assessment.tech_maturity}
- Retention Strategy: ${assessment.retention_strategy}
- Bottlenecks: ${assessment.decision_bottlenecks}
- Alignment: ${assessment.team_alignment}
- Vision: ${assessment.future_success}
- Benchmarking: ${assessment.benchmark_preferences}
- Funding: ${assessment.funding_status}
- Growth Pace: ${assessment.growth_pace}
- Internal Issues: ${assessment.unresolved_issue}
- Confirmation: ${assessment.final_confirmation}

Return JSON:
{
  "strategyScore": 1-5,
  "processScore": 1-5,
  "technologyScore": 1-5,
  "overallScore": 1-5
}
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Respond only with JSON" },
        { role: "user", content: aiPrompt },
      ],
      max_tokens: 500,
    });

    let raw = aiResponse.choices[0].message.content || "{}";
    if (raw.startsWith("```")) raw = raw.replace(/```(?:json)?/g, "").trim();

    const parsed = JSON.parse(raw);

    // ✅ Update tier2_profiles with scores
    const { error: profileError } = await supabase.from("tier2_profiles").upsert({
      u_id: u_id,
      strategy_score: parsed.strategyScore,
      process_score: parsed.processScore,
      technology_score: parsed.technologyScore,
      overall_score: parsed.overallScore,
      reassessment_score: parsed.overallScore,
      reassessment_last_taken: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "u_id" });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ...parsed });
  } catch (err: unknown) {
    console.error("❌ Profile update error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
