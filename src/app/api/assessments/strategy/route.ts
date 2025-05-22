import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import strategyScoringMap from "../data/strategy_scoring_map.json";
import { logAssessmentInput, logAssessmentScore, logAssessmentError, logAssessmentDebug } from "@/lib/utils/logger";

const scoringMap = strategyScoringMap as ScoringMap;

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
    logAssessmentInput('strategy', { userId, score, answers });

    if (!answers || !score || !userId) {
      const error = { error: "Missing required fields", details: { answers, score, userId } };
      logAssessmentError('strategy', error);
      return NextResponse.json(error, { status: 400 });
    }

    const bracket = getBracket(score);
    const bracketScoring = scoringMap[bracket];

    // Log selected bracket
    logAssessmentDebug('strategy', { bracket, bracketScoring });

    if (!bracketScoring) {
      const error = { error: "Invalid score bracket", details: { bracket, score } };
      logAssessmentError('strategy', error);
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
    logAssessmentScore('strategy', { 
      bracket,
      totalScore,
      totalWeight,
      normalizedScore
    });

    const supabase = createRouteHandlerClient({ cookies });

    // Upsert into strategy_assessment table
    const { error: assessmentError } = await supabase
      .from("strategy_assessment")
      .upsert({
        u_id: userId,
        ...answers,
        score: normalizedScore,
        created_at: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (assessmentError) {
      logAssessmentError('strategy', {
        error: "Failed to save assessment",
        details: assessmentError
      });
      return NextResponse.json(
        { error: "Failed to save assessment", details: assessmentError },
        { status: 500 }
      );
    }

    // Insert into score_strategy table
    const { error: scoreError } = await supabase
      .from("score_strategy")
      .insert({
        u_id: userId,
        gmf_score: score,
        bracket_key: bracket,
        score: normalizedScore,
        answers,
        version: "v1",
      });

    if (scoreError) {
      logAssessmentError('strategy', {
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
        strategic_maturity_score: normalizedScore,
        strategic_maturity_last_taken: new Date().toISOString(),
      }, {
        onConflict: "u_id"
      });

    if (profileError) {
      logAssessmentError('strategy', {
        error: "Failed to update profile",
        details: profileError
      });
      return NextResponse.json(
        { error: "Failed to update profile", details: profileError },
        { status: 500 }
      );
    }

    return NextResponse.json({ strategyScore: normalizedScore });
  } catch (error) {
    logAssessmentError('strategy', {
      error: "Internal server error",
      details: error
    });
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
} 