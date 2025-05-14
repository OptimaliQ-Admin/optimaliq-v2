// src/app/api/growthAssessment/getInsights/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generatePrompt } from "@/lib/ai/generatePrompt";
import { callOpenAI } from "@/lib/ai/callOpenAI";
import { callSageMaker } from "@/lib/ai/callSageMaker";


export async function POST(req: Request) {
  let sageMakerScore = 0;
  try {
    const { u_id } = await req.json();
    if (!u_id) return NextResponse.json({ error: "Missing User ID" }, { status: 400 });

    const { data: assessment } = await supabase
      .from("assessment")
      .select("*")
      .eq("u_id", u_id)
      .order("submittedat", { ascending: false })
      .limit(1)
      .single();

    if (!assessment) return NextResponse.json({ error: "No assessment found" }, { status: 404 });

    const { data: user } = await supabase
      .from("users")
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
    };
    
    const insights = {
      strategyInsight: parsed.strategyInsight || "No insight available.",
      processInsight: parsed.processInsight || "No insight available.",
      technologyInsight: parsed.technologyInsight || "No insight available.",
    };    

    const sageInput = [
      scores.strategy_score,
      scores.process_score,
      scores.technology_score,
      ...["E-commerce", "Finance", "SaaS", "Education", "Technology", "Healthcare", "Retail",
        "Manufacturing", "Consulting", "Entertainment", "Real Estate", "Transportation",
        "Hospitality", "Energy", "Telecommunications", "Pharmaceuticals", "Automotive",
        "Construction", "Legal", "Nonprofit", "Other"
      ].map(ind => user.industry === ind ? 1 : 0),
    ];

    sageMakerScore = await callSageMaker(sageInput);

    const insertPayload = {
      u_id,
      strategyscore: scores.strategy_score,
      strategyinsight: insights.strategyInsight,
      processscore: scores.process_score,
      processinsight: insights.processInsight,
      technologyscore: scores.technology_score,
      technologyinsight: insights.technologyInsight,
      generatedat: new Date().toISOString(),
      overallscore: sageMakerScore,
    };

    await supabase.from("insights").upsert([insertPayload], { onConflict: "u_id" });

    return NextResponse.json(insertPayload);
  } catch (err) {
    console.error("❌ Insight API Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}