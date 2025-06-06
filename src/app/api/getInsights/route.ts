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

    // Get user's assessments
    const { data: assessments, error: assessmentError } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError) {
      console.error("Error fetching assessment:", assessmentError);
      return NextResponse.json(
        { error: "Failed to fetch assessment" },
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
      console.error("Error fetching user details:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user details" },
        { status: 500 }
      );
    }

    if (!assessments || !userDetails) {
      return NextResponse.json(
        { error: "No assessment or user details found" },
        { status: 404 }
      );
    }

    // Generate AI prompt
    const aiPrompt = generatePrompt(assessments, userDetails);

    // Get insights from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: aiPrompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content in OpenAI response" },
        { status: 500 }
      );
    }

    const insights = JSON.parse(content);

    // Update insights table
    const { error: updateError } = await supabase
  .from("growth_insights")
      .upsert({
        user_id: userId,
        strategy_score: insights.strategy_score,
        strategy_insight: insights.strategyInsight,
        process_score: insights.process_score,
        process_insight: insights.processInsight,
        technology_score: insights.technology_score,
        technology_insight: insights.technologyInsight,
        overall_score: insights.overall_score,
        created_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error("Error updating insights:", updateError);
      return NextResponse.json(
        { error: "Failed to update insights" },
        { status: 500 }
      );
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error in getInsights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }  
}