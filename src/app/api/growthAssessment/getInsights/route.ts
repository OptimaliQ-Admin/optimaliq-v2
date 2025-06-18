// src/app/api/growthAssessment/getInsights/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { generatePrompt } from "@/lib/ai/generatePrompt";
import { callOpenAI } from "@/lib/ai/callOpenAI";
import { recalculateOverallScore } from "@/lib/sync/recalculateOverallScore";

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json();
    if (!u_id) return NextResponse.json({ error: "Missing User ID" }, { status: 400 });

    const { data: assessment } = await supabase
      .from("growth_assessment")
      .select("*")
      .eq("u_id", u_id)
      .order("submittedat", { ascending: false })
      .limit(1)
      .single();

    if (!assessment) return NextResponse.json({ error: "No assessment found" }, { status: 404 });

    const { data: user } = await supabase
      .from("growth_users")
      .select("*")
      .eq("u_id", u_id)
      .single();

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const aiPrompt = generatePrompt(assessment, user);
    const { parsed } = await callOpenAI(aiPrompt);    
    
    // ✅ Extract `scores` and `insights` from parsed
    const scores = {
      strategy_score: parsed.strategy_score || 0,
      process_score: parsed.process_score || 0,
      technology_score: parsed.technology_score || 0,
      fallback_overall_score: parsed.fallback_overall_score || 0,
    };
    
    const insights = {
      strategyInsight: parsed.strategyInsight || "No insight available.",
      processInsight: parsed.processInsight || "No insight available.",
      technologyInsight: parsed.technologyInsight || "No insight available.",
    };    

    // Calculate weighted overall score
    const weightedScore = 
      0.4 * scores.strategy_score + 
      0.3 * scores.process_score + 
      0.3 * scores.technology_score;
    
    const overall_score = Math.min(5, Math.max(0, parseFloat(weightedScore.toFixed(2))));

    const insertPayload = {
      u_id,
      strategy_score: scores.strategy_score,
      strategy_insight: insights.strategyInsight,
      process_score: scores.process_score,
      process_insight: insights.processInsight,
      technology_score: scores.technology_score,
      technology_insight: insights.technologyInsight,
      generatedat: new Date().toISOString(),
      overall_score,
      fallback_score_gpt: scores.fallback_overall_score,
    };

    const { error: profileError } = await supabase.from("tier2_profiles").upsert({
      u_id: u_id,
      strategy_score: parsed.strategy_score,
      process_score: parsed.process_score,
      technology_score: parsed.technology_score,
      base_score: parsed.overall_score,
      reassessment_score: parsed.overall_score,
      reassessment_last_taken: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "u_id" });

    await supabase.from("growth_insights").upsert([insertPayload], { onConflict: "u_id" });

    // Recalculate overall score
    await recalculateOverallScore(supabase, u_id);

    return NextResponse.json(insertPayload);
  } catch (err) {
    console.error("❌ Insight API Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}