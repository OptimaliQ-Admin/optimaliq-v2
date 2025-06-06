import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generatePrompt } from "@/lib/ai/generatePrompt";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching growth assessment for user:", userId);

    // Get user's growth assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("growth_assessment")
      .select("*")
      .eq("u_id", userId)
      .order("generatedat", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError) {
      console.error("❌ Error fetching growth assessment:", assessmentError);
      return NextResponse.json(
        { error: "Failed to fetch growth assessment" },
        { status: 500 }
      );
    }

    // Get user details
    const { data: userDetails, error: userError } = await supabase
      .from("users")
      .select("industry, companysize, revenuerange")
      .eq("u_id", userId)
      .single();

    if (userError) {
      console.error("❌ Error fetching user details:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user details" },
        { status: 500 }
      );
    }

    if (!assessment || !userDetails) {
      console.error("❌ No assessment or user details found for user:", userId);
      return NextResponse.json(
        { error: "No assessment or user details found" },
        { status: 404 }
      );
    }

    console.log("🤖 Generating AI prompt for user:", userId);
    // Generate AI prompt
    const aiPrompt = generatePrompt(assessment, userDetails);

    // Get insights from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: aiPrompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("❌ No content in OpenAI response for user:", userId);
      return NextResponse.json(
        { error: "No content in OpenAI response" },
        { status: 500 }
      );
    }

    console.log("📝 Parsing OpenAI response for user:", userId);
    const insights = JSON.parse(content);

    // Update insights table
    const { error: updateError } = await supabase
      .from("growth_insights")
      .upsert({
        u_id: userId,
        strategyscore: insights.strategy_score,
        strategyinsight: insights.strategyInsight,
        processscore: insights.process_score,
        processinsight: insights.processInsight,
        technologyscore: insights.technology_score,
        technologyinsight: insights.technologyInsight,
        overallscore: insights.overall_score,
        generatedat: new Date().toISOString(),
      });

    if (updateError) {
      console.error("❌ Error updating insights:", updateError);
      return NextResponse.json(
        { error: "Failed to update insights" },
        { status: 500 }
      );
    }

    console.log("✅ Successfully generated and saved insights for user:", userId);
    return NextResponse.json(insights);
  } catch (error) {
    console.error("❌ Error in getInsights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }  
}