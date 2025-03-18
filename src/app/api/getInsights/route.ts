import path from "path";
import { spawnSync } from "child_process";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase"; // ✅ Supabase client imported

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Define OpenAI Response Type
interface AIResponse {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  strategyInsight: string;
  processInsight: string;
  technologyInsight: string;
}

// ✅ Main API Route
export async function POST(req: Request) {
  try {
    const { U_id } = await req.json(); // Get user ID instead of raw answers
    console.log("🔍 Fetching stored answers for User ID:", U_id);

    if (!U_id) {
      return NextResponse.json({ error: "Missing User ID in request" }, { status: 400 });
    }

    // ✅ Step 1: Retrieve Stored Responses from Supabase
    const { data: assessment, error: assessmentError } = await supabase
      .from("Assessment")
      .select("*")
      .eq("U_id", U_id)
      .maybeSingle();

    if (assessmentError || !assessment) {
      console.error("❌ Supabase Fetch Error:", assessmentError);
      return NextResponse.json({ error: "Failed to retrieve business responses" }, { status: 500 });
    }

    console.log("✅ Retrieved Business Responses:", assessment);

    // ✅ Step 2: Retrieve User Details from Supabase
    const { data: user, error: userError } = await supabase
      .from("Users")
      .select("*")
      .eq("U_id", U_id)
      .maybeSingle();

    if (userError || !user) {
      console.error("❌ Supabase User Fetch Error:", userError);
      return NextResponse.json({ error: "Failed to retrieve user info" }, { status: 500 });
    }

    console.log("✅ Retrieved User Info:", user);

    // ✅ Step 3: Structure Data for OpenAI Prompt
    const aiPrompt = `
      You are a world-class business strategist. Your job is to analyze the user's business assessment and provide high-impact insights.

      **Business Inputs:**
      - **Biggest obstacles:** ${assessment.Obstacles}
      - **Strategy differentiation:** ${assessment.Strategy}
      - **Process optimization:** ${assessment.Process}
      - **Customer understanding:** ${assessment.Customers}
      - **Technology level:** ${assessment.Technology}

      **Company Details:**
      - **Industry:** ${user.Industry}
      - **Company Size:** ${user.CompanySize}
      - **Revenue Range:** ${user.RevenueRange}

      **Your Task:**
      - Provide **custom insights** based on the user's inputs.
      - Offer specific recommendations (not generic advice).
      - Ensure insights align with business size & industry.

      **Example JSON Output:**
      {
        "strategyScore": 4,
        "strategyInsight": "Your differentiation is strong, but market positioning needs refinement. Focus on targeted partnerships and market penetration strategies.",
        "processScore": 3,
        "processInsight": "Your processes are stable but lack scalability. Automate workflows to handle growth.",
        "technologyScore": 5,
        "technologyInsight": "You have a cutting-edge stack but need better integration. Implement predictive analytics for enhanced decision-making."
      }
    `;

    console.log("🔹 Sending request to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: aiPrompt }],
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    console.log("✅ OpenAI Response Received");

    if (!response.choices?.[0]?.message?.content) {
      console.error("🚨 OpenAI returned an empty or invalid response.");
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    let parsedResponse: AIResponse;
    try {
      parsedResponse = JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("🚨 JSON Parsing Error:", error);
      console.log("📜 Raw OpenAI Response:", response.choices[0].message.content);
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }

    // ✅ Extract AI-generated insights safely
    const strategyScore = parsedResponse.strategyScore ?? 1;
    const processScore = parsedResponse.processScore ?? 1;
    const technologyScore = parsedResponse.technologyScore ?? 1;
    const strategyInsight = parsedResponse.strategyInsight || "No strategy insight available.";
    const processInsight = parsedResponse.processInsight || "No process insight available.";
    const technologyInsight = parsedResponse.technologyInsight || "No technology insight available.";

    console.log("🔢 AI-Generated Scores:", { strategyScore, processScore, technologyScore });

    // ✅ Step 4: Store Insights in Supabase
    const { error: storeError } = await supabase
  .from("Insights")
  .insert([
    {
      U_id,
      strategyScore,
      processScore,
      technologyScore,
      strategyInsight,
      processInsight,
      technologyInsight,
    },
  ], { onConflict: "U_id" }); // ✅ FIX: Make this a string, not an array
  

    if (storeError) {
      console.error("❌ Supabase Insert Error:", storeError);
      return NextResponse.json({ error: "Failed to store AI insights" }, { status: 500 });
    }

    console.log("✅ AI Insights Stored in Supabase:", storedInsights);

    return NextResponse.json({
      score: (strategyScore + processScore + technologyScore) / 3, // ✅ Calculate avg score
      strategyScore,
      strategyInsight,
      processScore,
      processInsight,
      technologyScore,
      technologyInsight
    });

  } catch (error) {
    console.error("🚨 AI API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI-driven insights" }, { status: 500 });
  }
}