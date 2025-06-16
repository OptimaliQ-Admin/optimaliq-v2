// src/app/api/growthAssessment/getInsights/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generatePrompt } from "@/lib/ai/generatePrompt";
import { callOpenAI } from "@/lib/ai/callOpenAI";

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

    await supabase.from("growth_insights").upsert([insertPayload], { onConflict: "u_id" });

    return NextResponse.json(insertPayload);
  } catch (err) {
    console.error("❌ Insight API Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}