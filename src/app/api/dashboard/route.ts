import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";
import { saveDashboardInsights } from "@/lib/sync/saveDashboard";
import { saveProfileScores } from "@/lib/sync/saveProfile";

import { getErrorMessage } from "@/utils/errorHandler";
export async function POST(req: Request) {
  try {
    const { u_id } = await req.json();
    if (!u_id || typeof u_id !== "string") {
      return NextResponse.json({ error: "Invalid or missing u_id" }, { status: 400 });
    }

    // Fetch user profile
    const { data: user, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("u_id", u_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch latest assessment
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

    // Fetch existing dashboard insight
    const { data: insights } = await supabase
      .from("tier2_dashboard_insights")
      .select("*")
      .eq("u_id", u_id)
      .maybeSingle();

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const needsRefresh =
      !insights?.updated_at || new Date(insights.updated_at) < thirtyDaysAgo;

    if (!needsRefresh && insights) {
      return NextResponse.json({
        ...insights,
        industry: user.industry?.trim().toLowerCase(),
        promptRetake: false,
      });
    }

    // Generate AI scores
    const aiScores = await generateDashboardScores(user, assessment);
    if (!aiScores) {
      return NextResponse.json({ error: "AI scoring failed" }, { status: 500 });
    }

    console.info("🧠 AI Scores Generated:", aiScores);

    const chartData = [
      { month: "Now", userScore: aiScores.score, industryScore: 3.2, topPerformerScore: 4.5 },
      { month: "3 Months", userScore: Math.min(5, aiScores.score + 0.5), industryScore: 3.2, topPerformerScore: 4.5 },
      { month: "6 Months", userScore: Math.min(5, aiScores.score + 1), industryScore: 3.2, topPerformerScore: 4.5 },
      { month: "12 Months", userScore: Math.min(5, aiScores.score + 2), industryScore: 3.2, topPerformerScore: 4.5 },
    ];

    const payload = {
      u_id,
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
      updated_at: now.toISOString(),
      industry: user.industry?.trim().toLowerCase(),
    };

    // Save insights
    await saveDashboardInsights(supabase, payload);


    // Save summary to profile
    await saveProfileScores(u_id, {
      strategyScore: aiScores.strategyScore,
      processScore: aiScores.processScore,
      technologyScore: aiScores.technologyScore,
      overallScore: aiScores.score,
    });

    console.info("📦 Dashboard & profile saved for:", u_id);

    return NextResponse.json({ ...payload, promptRetake: false });
  } catch (err: unknown) {
    console.error("🔥 Dashboard API error:", err);
    return NextResponse.json({ error: "Server error", detail: getErrorMessage(err) }, { status: 500 });
  }
}
