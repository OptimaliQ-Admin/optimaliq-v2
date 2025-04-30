// File: src/app/api/premium/onboarding/submit/route.ts

import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";
import { saveProfileScores } from "@/lib/sync/saveProfile";
import { saveDashboardInsights } from "@/lib/sync/saveDashboard";
import { getErrorMessage } from "@/utils/errorHandler";


export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  try {
    const { formAnswers } = await req.json();

    // ✅ Get the currently logged-in user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // ✅ Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("u_id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // ✅ Insert onboarding answers
    const { error: insertError } = await supabase
      .from("onboarding_assessments")
      .insert([{ ...formAnswers, u_id: userId }]);

    if (insertError) {
      console.error("❌ Insert Error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // ✅ Run scoring
    const aiScores = await generateDashboardScores(userData, formAnswers);
    if (!aiScores) {
      return NextResponse.json({ error: "AI scoring failed" }, { status: 500 });
    }

    // ✅ Update profile scores
    await saveProfileScores(supabase, userId, {
      strategy_score: aiScores.strategy_score,
      process_score: aiScores.process_score,
      technology_score: aiScores.technology_score,
      overall_score: aiScores.score,
    });

    // ✅ Update dashboard insights
    await saveDashboardInsights(supabase, {
      u_id: userId,
      strategy_score: aiScores.strategy_score,
      process_score: aiScores.process_score,
      technology_score: aiScores.technology_score,
      overall_score: aiScores.score,
      industryAvgScore: 3.2,
      topPerformerScore: 4.5,
      benchmarking: {},
      strengths: [],
      weaknesses: [],
      roadmap: [],
      chartData: [
        { month: "Now", userScore: aiScores.score, industryScore: 3.2, topPerformerScore: 4.5 },
        { month: "3 Months", userScore: Math.min(5, aiScores.score + 0.5), industryScore: 3.2, topPerformerScore: 4.5 },
        { month: "6 Months", userScore: Math.min(5, aiScores.score + 1), industryScore: 3.2, topPerformerScore: 4.5 },
        { month: "12 Months", userScore: Math.min(5, aiScores.score + 2), industryScore: 3.2, topPerformerScore: 4.5 },
      ],
      updated_at: new Date().toISOString(),
      industry: userData.industry?.trim().toLowerCase(),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: getErrorMessage(err) || "Server error" }, { status: 500 });
  }
}
