// File: /src/app/api/tier2/dashboard/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

    const { data: user, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("u_id", user_id)
      .single();

    if (userError || !user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { data: assessment, error: assessmentError } = await supabase
      .from("onboarding_assessments")
      .select("*")
      .eq("u_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError || !assessment)
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

    const { data: existingInsights } = await supabase
      .from("tier2_dashboard_insights")
      .select("*")
      .eq("u_id", user_id)
      .single();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const insightAge = existingInsights ? new Date(existingInsights.updated_at) : null;

    if (existingInsights && insightAge && insightAge > thirtyDaysAgo) {
      return NextResponse.json({
        ...existingInsights,
        industry: user.industry?.trim().toLowerCase(),
        promptRetake: false,
      });
    }

    // 🔍 Generate updated scores
    const aiScores = await generateDashboardScores(user, assessment);
    if (!aiScores) return NextResponse.json({ error: "AI scoring failed" }, { status: 500 });

    const chartData = [
      { month: "Now", userScore: aiScores.score, industryScore: 3.2, topPerformerScore: 4.5 },
      { month: "3 Months", userScore: Math.min(5, aiScores.score + 0.5), industryScore: 3.2, topPerformerScore: 4.5 },
      { month: "6 Months", userScore: Math.min(5, aiScores.score + 1), industryScore: 3.2, topPerformerScore: 4.5 },
      { month: "12 Months", userScore: Math.min(5, aiScores.score + 2), industryScore: 3.2, topPerformerScore: 4.5 },
    ];

    const dashboardPayload = {
      user_id,
      strategyScore: aiScores.strategyScore,
      processScore: aiScores.processScore,
      technologyScore: aiScores.technologyScore,
      score: aiScores.score,
      industryAvgScore: 3.2,
      topPerformerScore: 4.5,
      benchmarking: {},
      strengths: [],
      weaknesses: [],
      roadmap: [],
      chartData,
      updated_at: new Date().toISOString(),
      industry: user.industry?.trim().toLowerCase(),
    };

    const { error: upsertError } = await supabase
      .from("tier2_dashboard_insights")
      .upsert(dashboardPayload, { onConflict: "u_id" });

    if (upsertError) {
      console.error("❌ Failed to insert dashboard insights:", upsertError);
      return NextResponse.json({ error: "Failed to store dashboard" }, { status: 500 });
    }

    return NextResponse.json({ ...dashboardPayload, promptRetake: false });
  } catch (error) {
    console.error("❌ Dashboard API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}