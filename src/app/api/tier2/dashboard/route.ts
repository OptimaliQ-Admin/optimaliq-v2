import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  return NextResponse.json({ status: "API route is live ✅" });
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const { data: user, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = user.user_id;

    const { data: assessment, error: assessmentError } = await supabase
      .from("onboarding_assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError || !assessment)
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const assessmentDate = new Date(assessment.created_at);
    const promptRetake = assessmentDate < thirtyDaysAgo;

    const { data: existingInsights } = await supabase
      .from("tier2_dashboard_insights")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingInsights && !promptRetake) {
      return NextResponse.json({ ...existingInsights, promptRetake });
    }

    const aiPrompt = `...`; // (Use same prompt as before)

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Respond in valid JSON only." },
        { role: "user", content: aiPrompt },
      ],
      max_tokens: 900,
    });

    const parsed = JSON.parse(aiResponse.choices[0].message.content || "{}");

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

    await supabase
      .from("tier2_dashboard_insights")
      .upsert(finalPayload, { onConflict: "user_id" });

    return NextResponse.json({ ...finalPayload, promptRetake });
  } catch (error) {
    console.error("❌ Dashboard API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
