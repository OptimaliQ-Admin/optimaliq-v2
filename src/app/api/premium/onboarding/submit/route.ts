// File: src/app/api/premium/onboarding/submit/route.ts

import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";
import { saveProfileScores } from "@/lib/sync/saveProfile";
import { saveDashboardInsights } from "@/lib/sync/saveDashboard";
import { getErrorMessage } from "@/utils/errorHandler";
import { recalculateOverallScore } from "@/lib/sync/recalculateOverallScore";


export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  try {
    const { formAnswers } = await req.json();

    console.log("🚀 Starting onboarding assessment processing...");

    // ✅ Get the currently logged-in user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ Authentication error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    console.log("👤 Processing assessment for user:", userId);

    // ✅ Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("u_id", userId)
      .single();

    if (userError || !userData) {
      console.error("❌ User profile not found:", userError);
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    console.log("📝 Saving assessment answers...");
    // ✅ Insert onboarding answers
    const { error: insertError } = await supabase
      .from("onboarding_assessments")
      .insert([{ ...formAnswers, u_id: userId }]);

    if (insertError) {
      console.error("❌ Insert Error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    console.log("🧠 Generating AI scores...");
    // ✅ Run scoring
    const aiScores = await generateDashboardScores(userData, formAnswers);
    if (!aiScores) {
      console.error("❌ AI scoring failed");
      return NextResponse.json({ error: "AI scoring failed" }, { status: 500 });
    }

    console.log("✅ AI scores generated successfully");

    console.log("💾 Updating profile scores...");
    // ✅ Update profile scores
    await saveProfileScores(supabase, userId, {
      strategy_score: aiScores.strategy_score,
      process_score: aiScores.process_score,
      technology_score: aiScores.technology_score,
      base_score: aiScores.score,
    });

    // Recalculate overall score
    await recalculateOverallScore(supabase, userId);

    console.log("📊 Saving dashboard insights...");
    // ✅ Update dashboard insights
    await saveDashboardInsights(supabase, {
      u_id: userId,
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
      chartData: [
        { month: "Now", userScore: aiScores.score, industryScore: aiScores.industryAvgScore, topPerformerScore: aiScores.topPerformerScore },
        { month: "3 Months", userScore: Math.min(5, aiScores.score + 0.5), industryScore: aiScores.industryAvgScore, topPerformerScore: aiScores.topPerformerScore },
        { month: "6 Months", userScore: Math.min(5, aiScores.score + 1), industryScore: aiScores.industryAvgScore, topPerformerScore: aiScores.topPerformerScore },
        { month: "12 Months", userScore: Math.min(5, aiScores.score + 2), industryScore: aiScores.industryAvgScore, topPerformerScore: aiScores.topPerformerScore },
      ],
      updated_at: new Date().toISOString(),
      industry: userData.industry?.trim().toLowerCase(),
    });

    console.log("🎉 Onboarding assessment completed successfully for user:", userId);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: getErrorMessage(err) || "Server error" }, { status: 500 });
  }
}
