// src/app/api/growthAssessment/getInsights/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generatePrompt } from "@/lib/ai/generatePrompt";
import { callOpenAI } from "@/lib/ai/callOpenAI";

export async function POST(req: Request) {
  let mlScore = 0;
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

    try {
      const mlResponse = await fetch('/api/ml_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategy_score: scores.strategy_score,
          process_score: scores.process_score,
          technology_score: scores.technology_score,
          industry: user.industry
        }),
      });

      if (!mlResponse.ok) {
        throw new Error(`ML API error: ${mlResponse.statusText}`);
      }

      const mlData = await mlResponse.json();
      mlScore = mlData.score;
      console.log("🎯 ML API Predicted Score:", mlScore);

    } catch (error) {
      console.error("❌ ML API Error:", error);
      await supabase
        .from("ai_log")
        .insert([
          {
            u_id,
            apirequest: `ML API Request: ${JSON.stringify({
              strategy_score: scores.strategy_score,
              process_score: scores.process_score,
              technology_score: scores.technology_score,
              industry: user.industry
            })}`,
            apiresponse: JSON.stringify(error),
            model: "ML API",
            createdat: new Date().toISOString(),
          },
        ]);
      return NextResponse.json({ error: "ML API prediction failed." }, { status: 500 });
    }

    const insertPayload = {
      u_id,
      strategyscore: scores.strategy_score,
      strategyinsight: insights.strategyInsight,
      processscore: scores.process_score,
      processinsight: insights.processInsight,
      technologyscore: scores.technology_score,
      technologyinsight: insights.technologyInsight,
      generatedat: new Date().toISOString(),
      overallscore: mlScore,
    };

    await supabase.from("insights").upsert([insertPayload], { onConflict: "u_id" });

    return NextResponse.json(insertPayload);
  } catch (err) {
    console.error("❌ Insight API Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}