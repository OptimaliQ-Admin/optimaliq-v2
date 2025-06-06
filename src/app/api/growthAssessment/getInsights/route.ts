// src/app/api/growthAssessment/getInsights/route.ts

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

    // Get user's growth assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("growth_assessment")
      .select("*")
      .eq("u_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError) {
      console.error("Error fetching growth assessment:", assessmentError);
      return NextResponse.json(
        { error: "Failed to fetch growth assessment" },
        { status: 500 }
      );
    }

    // Get user details
    const { data: userDetails, error: userError } = await supabase
      .from("growth_users")
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

    if (!assessment || !userDetails) {
      return NextResponse.json(
        { error: "No assessment or user details found" },
        { status: 404 }
      );
    }

    // Generate AI prompt
    const aiPrompt = generatePrompt(assessment, userDetails);
    
    // Log the prompt being sent to OpenAI
    console.log("🤖 OpenAI Request Prompt:", aiPrompt);
    
    // Get insights from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: aiPrompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const content = response.choices[0]?.message?.content;
    
    // Log the raw response from OpenAI
    console.log("🤖 OpenAI Raw Response:", content);

    if (!content) {
      console.error("❌ OpenAI returned empty response");
      return NextResponse.json(
        { error: "Failed to generate insights" },
        { status: 500 }
      );
    }

    try {
      // Parse the JSON response
      const parsedContent = JSON.parse(content);
      
      // Log the parsed response
      console.log("🤖 OpenAI Parsed Response:", JSON.stringify(parsedContent, null, 2));
      
      // Update growth insights table
      const { error: updateError } = await supabase
        .from("growth_insights")
        .upsert({
          u_id: userId,
          strategy_score: parsedContent.strategy_score,
          strategy_insight: parsedContent.strategyInsight,
          processscore: parsedContent.process_score,
          process_insight: parsedContent.processInsight,
          technology_score: parsedContent.technology_score,
          technology_insight: parsedContent.technologyInsight,
          overall_score: parsedContent.overall_score,
      generatedat: new Date().toISOString(),
        });

      if (updateError) {
        console.error("Error updating growth insights:", updateError);
        return NextResponse.json(
          { error: "Failed to update growth insights" },
          { status: 500 }
        );
      }

      return NextResponse.json(parsedContent);
    } catch (parseError) {
      console.error("❌ Failed to parse OpenAI response:", parseError);
      console.error("Raw content that failed to parse:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Unexpected error in getInsights:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}