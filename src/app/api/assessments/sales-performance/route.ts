import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import salesPerformanceScoringMap from "@/app/api/assessments/data/sales_scoring_map.json";
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
    logAssessmentInput('sales-performance', { userId, score, answers });

    if (!answers || !score || !userId) {
      const error = { error: "Missing required fields", details: { answers, score, userId } };
      logAssessmentError('sales-performance', error);
      return NextResponse.json(error, { status: 400 });
    }

    const bracket = getBracket(score);
    const bracketScoring = scoringMap[bracket];

    // Log selected bracket
    logAssessmentDebug('sales-performance', { bracket, bracketScoring });

    if (!bracketScoring) {
      const error = { error: "Invalid score bracket", details: { bracket, score } };
      logAssessmentError('sales-performance', error);
      return NextResponse.json(error, { status: 400 });
    }

    // Filter answers to only include keys from the scoring map
    const bracketScoringKeys = Object.keys(bracketScoring);
    const filteredAnswers = Object.fromEntries(
      Object.entries(answers).filter(([key]) => bracketScoringKeys.includes(key))
    );

    // Log filtered answers and missing keys
    logAssessmentDebug('sales-performance', {
      originalAnswers: answers,
      filteredAnswers,
      missingKeys: Object.keys(answers).filter(key => !bracketScoringKeys.includes(key))
    });

    let total = 0;
    let weightSum = 0;

    for (const key in filteredAnswers) {
      const q = bracketScoring[key];
      if (!q) {
        logAssessmentDebug('sales-performance', {
          message: `No scoring config found for key: ${key}`,
          answer: filteredAnswers[key]
        });
        continue;
      }

      const answer = filteredAnswers[key];
      let valScore = 0;

      if (q.type === "multiple_choice") {
        valScore = q.values[answer as string] || 0;
        if (valScore === 0) {
          logAssessmentDebug('sales-performance', {
            message: `No score found for multiple choice answer`,
            key,
            answer,
            availableValues: Object.keys(q.values)
          });
        }
      }

      if (q.type === "multi_select") {
        try {
          const selections: string[] = Array.isArray(answer) ? answer : JSON.parse(answer as string);
          const scores = selections.map((s) => q.values[s] || 0);
          valScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          if (valScore === 0) {
            logAssessmentDebug('sales-performance', {
              message: `No scores found for multi-select answers`,
              key,
              selections,
              availableValues: Object.keys(q.values)
            });
          }
        } catch (e) {
          logAssessmentDebug('sales-performance', {
            message: `Error processing multi-select answer`,
            key,
            answer,
            error: e
          });
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
    logAssessmentScore('sales-performance', { 
      bracket,
      totalScore: total,
      totalWeight: weightSum,
      normalizedScore: normalized
    });

    const supabase = createRouteHandlerClient({ cookies });

    // Upsert into sales_performance_assessment table
    const { error: assessmentError } = await supabase
      .from("sales_performance_assessment")
      .upsert({
        u_id: userId,
        answers: filteredAnswers,
        score: normalized,
        created_at: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (assessmentError) {
      logAssessmentError('sales-performance', {
        error: "Failed to save assessment",
        details: assessmentError
      });
      return NextResponse.json(
        { error: "Failed to save assessment", details: assessmentError },
        { status: 500 }
      );
    }

    return NextResponse.json({ salesPerformanceScore: normalized });
  } catch (error) {
    logAssessmentError('sales-performance', {
      error: "Internal server error",
      details: error
    });
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
} 