// File: /src/app/api/tier2/onboarding/submit/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";
import { saveProfileScores } from "@/lib/sync/saveProfile";
import { saveDashboardInsights } from "@/lib/sync/saveDashboard";

export async function POST(req: Request) {
  try {
    const { userEmail, formAnswers } = await req.json();
    if (!userEmail || !formAnswers) {
      return NextResponse.json({ error: "Missing userEmail or formAnswers" }, { status: 400 });
    }

    // ✅ Fetch user by email
    const { data: userData, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (userError || !userData) {
      console.error("❌ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userData.user_id;

    // ✅ Insert onboarding assessment
    const { error: insertError } = await supabase
      .from("onboarding_assessments")
      .insert([{ ...formAnswers, user_id: userId }]);

    if (insertError) {
      console.error("❌ Error inserting onboarding assessment:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // ✅ Generate AI scores
    const aiScores = await generateDashboardScores(userData, formAnswers);
    if (!aiScores) {
      return NextResponse.json({ error: "AI scoring failed" }, { status: 500 });
    }

    // ✅ Save profile
    await saveProfileScores(userId, {
      strategyScore: aiScores.strategyScore,
      processScore: aiScores.processScore,
      technologyScore: aiScores.technologyScore,
      overallScore: aiScores.score,
    });

    // ✅ Save dashboard
    await saveDashboardInsights({
      user_id: userId,
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
  } catch (err: any) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}