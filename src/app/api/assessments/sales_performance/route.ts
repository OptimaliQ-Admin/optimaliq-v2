//src/app/api//premium/assessment/sales_performance/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import salesScoringMap from "../data/sales_scoring_map.json";

const scoringMap = salesScoringMap as ScoringMap;

function getBracket(score: number): keyof ScoringMap {
  if (score >= 1 && score <= 1.4) return "score_1_1_4";
  if (score >= 1.5 && score <= 1.9) return "score_1_5_1_9";
  if (score >= 2 && score <= 2.4) return "score_2_0_2_4";
  if (score >= 2.5 && score <= 2.9) return "score_2_5_2_9";
  if (score >= 3 && score <= 3.4) return "score_3_3_4";
  if (score >= 3.5 && score <= 3.9) return "score_3_5_3_9";
  if (score >= 4 && score <= 4.4) return "score_4_4_4";
  if (score >= 4.5 && score <= 4.9) return "score_4_5_4_9";
  return "score_5_0";
}

export async function POST(request: Request) {
  try {
    const { answers, score, userId } = await request.json();

    if (!answers || !score || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bracket = getBracket(score);
    const bracketScoring = scoringMap[bracket];

    if (!bracketScoring) {
      return NextResponse.json(
        { error: "Invalid score bracket" },
        { status: 400 }
      );
    }

    let totalScore = 0;
    let totalWeight = 0;

    // Calculate score based on answers
    for (const [key, entry] of Object.entries(bracketScoring)) {
      // Skip if not a multiple choice question
      if (entry.type !== "multiple_choice") continue;

      const answer = answers[key];
      if (!answer) continue;

      // Skip array answers
      if (Array.isArray(answer)) continue;

      const value = entry.values[answer];
      if (value) {
        totalScore += value * entry.weight;
        totalWeight += entry.weight;
      }
    }

    const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    const supabase = createRouteHandlerClient({ cookies });

    // Upsert into sales_performance_assessment table
    const { error: assessmentError } = await supabase
      .from("sales_performance_assessment")
      .upsert({
        u_id: userId,
        ...answers,
        score: normalizedScore,
        created_at: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (assessmentError) {
      console.error("Error upserting assessment:", assessmentError);
      return NextResponse.json(
        { error: "Failed to save assessment" },
        { status: 500 }
      );
    }

    // Insert into score_salesperformance table
    const { error: scoreError } = await supabase
      .from("score_salesperformance")
      .insert({
        u_id: userId,
        gmf_score: score,
        bracket_key: bracket,
        score: normalizedScore,
        answers,
        version: "v1",
      });

    if (scoreError) {
      console.error("Error inserting score:", scoreError);
      return NextResponse.json(
        { error: "Failed to save score" },
        { status: 500 }
      );
    }

    // Update tier2_profiles table
    const { error: profileError } = await supabase
      .from("tier2_profiles")
      .upsert({
        u_id: userId,
        sales_performance_score: normalizedScore,
        sales_performance_last_taken: new Date().toISOString(),
      }, {
        onConflict: "u_id"
      });

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ salesScore: normalizedScore });
  } catch (error) {
    console.error("Error processing assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
