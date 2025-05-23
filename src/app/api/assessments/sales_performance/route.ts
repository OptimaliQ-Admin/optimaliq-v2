//src/app/api//premium/assessment/sales_performance/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import salesPerformanceScoringMap from "../data/sales_scoring_map.json";
import { logAssessmentInput, logAssessmentScore, logAssessmentError, logAssessmentDebug } from "@/lib/utils/logger";

const scoringMap = salesPerformanceScoringMap as ScoringMap;

function getBracket(score: number): keyof ScoringMap {
  if (score < 1.5) return "score_1_1_4";
  if (score < 2.0) return "score_1_5_1_9";
  if (score < 2.5) return "score_2_2_4";
  if (score < 3.0) return "score_2_5_2_9";
  if (score < 3.5) return "score_3_3_4";
  if (score < 4.0) return "score_3_5_3_9";
  if (score < 4.5) return "score_4_4_4";
  if (score < 5.0) return "score_4_5_4_9";
  return "score_5_0";
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

    let total = 0;
    let weightSum = 0;

    for (const key in answers) {
      const q = bracketScoring[key];
      if (!q) continue;

      const answer = answers[key];
      let valScore = 0;

      if (q.type === "multiple_choice") {
        valScore = q.values[answer] || 0;
      }

      if (q.type === "multi_select") {
        try {
          const selections: string[] = Array.isArray(answer) ? answer : JSON.parse(answer);
          const scores = selections.map((s) => q.values[s] || 0);
          valScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        } catch {
          valScore = 0;
        }
      }

      if (valScore > 0) {
        total += valScore * q.weight;
        weightSum += q.weight;
      } else {
        console.warn(`Unscored answer for '${key}':`, answer);
      }
    }

    const raw = weightSum ? total / weightSum : 0;
    const normalized = Math.round((raw + Number.EPSILON) * 2) / 2;

    // Log computed score
    logAssessmentScore('sales_performance', { 
      bracket,
      totalScore: total,
      totalWeight: weightSum,
      normalizedScore: normalized
    });

    const supabase = createRouteHandlerClient({ cookies });

    // Create a JSONB column for answers
    const { error: assessmentError } = await supabase
      .from("sales_performance_assessment")
      .upsert({
        u_id: userId,
        ...answers, // Spread individual answer fields instead of using a JSONB column
        score: normalized,
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
          answers,
          score: normalized
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
        score: normalized,
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
        sales_performance_score: normalized,
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

    return NextResponse.json({ salesPerformanceScore: normalized });
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
