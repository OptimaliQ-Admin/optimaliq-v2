// src/app/api/growthAssessment/getInsights/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generatePrompt } from "@/lib/ai/generatePrompt";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to clamp scores between 0 and 5
const clamp = (val: number) => Math.min(5, Math.max(0, parseFloat(String(val))));

// Required fields for validation
const requiredFields = ["strategy", "process", "technology", "obstacles", "customers"];

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      console.error("❌ Missing user ID in request");
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
      console.error("❌ Error fetching growth assessment:", assessmentError);
      return NextResponse.json(
        { error: "Failed to fetch growth assessment" },
        { status: 500 }
      );
    }

    // Validate required fields
    const missingFields = requiredFields.filter(field => !assessment?.[field]);
    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Get user details
    const { data: userDetails, error: userError } = await supabase
      .from("growth_users")
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
      console.error("❌ No assessment or user details found");
      return NextResponse.json(
        { error: "No assessment or user details found" },
        { status: 404 }
      );
    }

    // Generate AI prompt
    const aiPrompt = generatePrompt(assessment, userDetails);
    console.log("🤖 OpenAI Request Prompt:", aiPrompt);
    
    // Get insights from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: aiPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    console.log("🔍 Raw OpenAI Response:", content);

    if (!content) {
      console.error("❌ OpenAI returned empty response");
      return NextResponse.json(
        { error: "Failed to generate insights" },
        { status: 500 }
      );
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
      console.log("✅ Successfully parsed OpenAI response:", parsedContent);
    } catch (parseError) {
      console.error("❌ Failed to parse OpenAI response:", parseError);
      console.error("Raw content that failed to parse:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Prepare insights data with clamped scores and fallback messages
    const insightsData = {
      u_id: userId,
      strategy_score: clamp(parsedContent.strategy_score),
      strategy_insight: parsedContent.strategy_insight || "Strategy insight unavailable.",
      process_score: clamp(parsedContent.process_score),
      process_insight: parsedContent.process_insight || "Process insight unavailable.",
      technology_score: clamp(parsedContent.technology_score),
      technology_insight: parsedContent.technology_insight || "Technology insight unavailable.",
      overall_score: clamp(parsedContent.overall_score),
      generatedat: new Date().toISOString(),
    };

    // Update growth insights table with single retry
    try {
      const { data, error: upsertError } = await supabase
        .from("growth_insights")
        .upsert(insightsData)
        .select();

      if (upsertError) {
        console.error("❌ Initial upsert failed:", upsertError);
        
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Single retry attempt
        const { error: retryError } = await supabase
          .from("growth_insights")
          .upsert(insightsData)
          .select();

        if (retryError) {
          console.error("❌ Retry upsert failed:", retryError);
          return NextResponse.json(
            { error: "Failed to save insights after retry" },
            { status: 500 }
          );
        }
      }

      console.log("✅ Successfully saved insights:", data);
      return NextResponse.json({ success: true, data });
    } catch (dbError) {
      console.error("❌ Database operation failed:", dbError);
      return NextResponse.json(
        { error: "Database operation failed" },
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