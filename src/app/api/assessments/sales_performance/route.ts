//src/app/api//premium/assessment/sales_performance/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import salesPerformanceScoringMap from "../data/sales_performance_scoring_map.json";
import { logAssessmentInput, logAssessmentScore, logAssessmentError, logAssessmentDebug } from "@/lib/utils/logger";

const scoringMap = salesPerformanceScoringMap as ScoringMap;

function getBracket(score: number): keyof ScoringMap {
  if (score >= 1 && score <= 1.4) return "score_1";
  if (score >= 1.5 && score <= 1.9) return "score_1_5";
  if (score >= 2 && score <= 2.4) return "score_2";
  if (score >= 2.5 && score <= 2.9) return "score_2_5";
  if (score >= 3 && score <= 3.4) return "score_3";
  if (score >= 3.5 && score <= 3.9) return "score_3_5";
  if (score >= 4 && score <= 4.4) return "score_4";
  if (score >= 4.5 && score <= 4.9) return "score_4_5";
  return "score_5";
}

export async function POST(request: Request) {
  try {
    const { answers, score, userId } = await request.json();

    // Log incoming request data
    logAssessmentInput('sales_performance', { userId, score, answers });

    if (!answers || !score || !userId) {
      const error = { error: "Missing required fields", details: { answers, score, userId } };
      logAssessmentError('sales_performance', error);
      return NextResponse.json(error, { status: 400 });
    }

    const bracket = getBracket(score);
    const bracketScoring = scoringMap[bracket];

    // Log selected bracket
    logAssessmentDebug('sales_performance', { bracket, bracketScoring });

    if (!bracketScoring) {
      const error = { error: "Invalid score bracket", details: { bracket, score } };
      logAssessmentError('sales_performance', error);
      return NextResponse.json(error, { status: 400 });
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

    // Log computed score
    logAssessmentScore('sales_performance', { 
      bracket,
      totalScore,
      totalWeight,
      normalizedScore
    });

    const supabase = createRouteHandlerClient({ cookies });

    // Log the data we're about to upsert
    logAssessmentDebug('sales_performance', {
      type: 'upsert_data',
      table: 'sales_performance_assessment',
      data: {
        u_id: userId,
        ...answers,
        score: normalizedScore,
        created_at: new Date().toISOString()
      }
    });

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
      logAssessmentError('sales_performance', {
        error: "Failed to save assessment",
        details: assessmentError,
        attemptedData: {
          u_id: userId,
          ...answers,
          score: normalizedScore
        }
      });
      return NextResponse.json(
        { error: "Failed to save assessment", details: assessmentError },
        { status: 500 }
      );
    }

    // Insert into score_sales_performance table
    const { error: scoreError } = await supabase
      .from("score_sales_performance")
      .insert({
        u_id: userId,
        gmf_score: score,
        bracket_key: bracket,
        score: normalizedScore,
        answers,
        version: "v1",
      });

    if (scoreError) {
      logAssessmentError('sales_performance', {
        error: "Failed to save score",
        details: scoreError
      });
      return NextResponse.json(
        { error: "Failed to save score", details: scoreError },
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
      logAssessmentError('sales_performance', {
        error: "Failed to update profile",
        details: profileError
      });
      return NextResponse.json(
        { error: "Failed to update profile", details: profileError },
        { status: 500 }
      );
    }

    return NextResponse.json({ salesPerformanceScore: normalizedScore });
  } catch (error) {
    logAssessmentError('sales_performance', {
      error: "Internal server error",
      details: error
    });
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
