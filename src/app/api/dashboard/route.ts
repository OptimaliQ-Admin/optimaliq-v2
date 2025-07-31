//src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";
import { saveDashboardInsights } from "@/lib/sync/saveDashboard";
import { saveProfileScores } from "@/lib/sync/saveProfile";
import { getErrorMessage } from "@/utils/errorHandler";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json(
        { error: "Invalid or missing u_id" },
        { status: 400 }
      );
    }

    // Fetch user profile from new users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", u_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch latest onboarding session (replaces onboarding_sessions)
    const { data: onboardingSession, error: onboardingError } = await supabase
      .from("onboarding_sessions")
      .select("*")
      .eq("user_id", u_id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    if (onboardingError || !onboardingSession) {
      return NextResponse.json(
        { error: "No completed onboarding session found" },
        { status: 404 }
      );
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

    const updatedAt = insights?.updated_at ? new Date(insights.updated_at) : null;
    const needsRefresh = !updatedAt || updatedAt < thirtyDaysAgo;

    if (!needsRefresh) {
      return NextResponse.json({
        ...insights,
        industry: user.industry?.trim().toLowerCase(),
        promptRetake: false,
      });
    }

    // Generate AI scores using onboarding session data
    const aiScores = await generateDashboardScores(
      { 
        ...user, 
        business_overview: onboardingSession.metadata?.business_overview || ""
      }, 
      onboardingSession
    );

    console.log(
      "🧪 Final AI scores returned to dashboard route:",
      JSON.stringify(aiScores, null, 2)
    );
    if (aiScores) {
      console.log("🧪 Types:", {
        benchmarking: typeof aiScores.benchmarking,
        strengths: Array.isArray(aiScores.strengths),
        weaknesses: Array.isArray(aiScores.weaknesses),
        roadmap: Array.isArray(aiScores.roadmap),
      });
    }

    if (!aiScores) {
      return NextResponse.json({ error: "AI scoring failed" }, { status: 500 });
    }

    console.info("🧠 AI Scores Generated:", aiScores);

    const chartData = [
      {
        month: "Now",
        userScore: aiScores.score,
        industryScore: 3.2,
        topPerformerScore: 4.5,
      },
      {
        month: "3 Months",
        userScore: Math.min(4.6, aiScores.score + 0.3),
        industryScore: 3.2,
        topPerformerScore: 4.5,
      },
      {
        month: "6 Months",
        userScore: Math.min(4.6, aiScores.score + 0.6),
        industryScore: 3.2,
        topPerformerScore: 4.5,
      },
      {
        month: "9 Months",
        userScore: Math.min(4.6, aiScores.score + 0.9),
        industryScore: 3.2,
        topPerformerScore: 4.5,
      },
      {
        month: "12 Months",
        userScore: Math.min(4.6, aiScores.score + 1.2),
        industryScore: 3.2,
        topPerformerScore: 4.5,
      },
      {
        month: "15 Months",
        userScore: Math.min(4.6, aiScores.score + 1.5),
        industryScore: 3.2,
        topPerformerScore: 4.5,
      },
      {
        month: "18 Months",
        userScore: Math.min(4.6, aiScores.score + 1.8),
        industryScore: 3.2,
        topPerformerScore: 4.5,
      },
    ];

    const payload = {
      u_id,
      strategy_score: aiScores.strategy_score,
      process_score: aiScores.process_score,
      technology_score: aiScores.technology_score,
      overall_score: aiScores.score,
      industryAvgScore: aiScores.industryAvgScore,
      topPerformerScore: aiScores.topPerformerScore,
      benchmarking: aiScores.benchmarking,
      strengths: aiScores.strengths,
      weaknesses: aiScores.weaknesses,
      roadmap: aiScores.roadmap,
      chartData,
      updated_at: now.toISOString(),
      industry: user.industry?.trim().toLowerCase(),
    };

    // Save insights
    console.log("🧪 Payload Field Checks:");
    console.log("benchmarking:", payload.benchmarking);
    console.log("strengths:", payload.strengths);
    console.log("weaknesses:", payload.weaknesses);
    console.log("roadmap:", payload.roadmap);
    await saveDashboardInsights(supabase, payload);

    // Save summary to profile
    await saveProfileScores(supabase, u_id, {
      strategy_score: aiScores.strategy_score,
      process_score: aiScores.process_score,
      technology_score: aiScores.technology_score,
      base_score: aiScores.score,
    });

    console.info("📦 Dashboard & profile saved for:", u_id);

    return NextResponse.json({ ...payload, promptRetake: false });
  } catch (err: unknown) {
    console.error("🔥 Dashboard API error:", err);
    return NextResponse.json(
      { error: "Server error", detail: getErrorMessage(err) },
      { status: 500 }
    );
  }
}
