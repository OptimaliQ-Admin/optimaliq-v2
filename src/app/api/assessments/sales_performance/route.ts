//src/app/api//premium/assessment/sales_performance/route.ts
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

    // Filter answers to only include keys from the scoring map
    const bracketScoringKeys = Object.keys(bracketScoring);
    const filteredAnswers = Object.fromEntries(
      Object.entries(answers).filter(([key]) => bracketScoringKeys.includes(key))
    );

    // Log filtered answers and missing keys
    logAssessmentDebug('sales_performance', {
      originalAnswers: answers,
      filteredAnswers,
      missingKeys: Object.keys(answers).filter(key => !bracketScoringKeys.includes(key))
    });

    let total = 0;
    let weightSum = 0;

    // Track scoring issues for debugging
    const scoringIssues = {
      unmatchedKeys: [] as string[],
      typeMismatches: [] as { key: string; expected: string; received: string }[],
      defaultedScores: [] as { key: string; answer: any; reason: string }[]
    };

    for (const key in filteredAnswers) {
      const q = bracketScoring[key];
      if (!q) {
        scoringIssues.unmatchedKeys.push(key);
        logAssessmentDebug('sales_performance', {
          message: `No scoring config found for key: ${key}`,
          answer: filteredAnswers[key]
        });
        continue;
      }

      const answer = filteredAnswers[key];
      let valScore = 0;

      // Log type mismatches
      if (q.type === "multiple_choice" && Array.isArray(answer)) {
        scoringIssues.typeMismatches.push({
          key,
          expected: "string",
          received: "array"
        });
      } else if (q.type === "multi_select" && !Array.isArray(answer) && typeof answer !== 'string') {
        scoringIssues.typeMismatches.push({
          key,
          expected: "array or string",
          received: typeof answer
        });
      }

      if (q.type === "multiple_choice") {
        valScore = q.values[answer as string] || 0;
        if (valScore === 0) {
          scoringIssues.defaultedScores.push({
            key,
            answer,
            reason: `No matching value in scoring map. Available values: ${Object.keys(q.values).join(', ')}`
          });
          logAssessmentDebug('sales_performance', {
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
            scoringIssues.defaultedScores.push({
              key,
              answer: selections,
              reason: `No matching values in scoring map. Available values: ${Object.keys(q.values).join(', ')}`
            });
            logAssessmentDebug('sales_performance', {
              message: `No scores found for multi-select answers`,
              key,
              selections,
              availableValues: Object.keys(q.values)
            });
          }
        } catch (e) {
          scoringIssues.defaultedScores.push({
            key,
            answer,
            reason: `Failed to parse multi-select answer: ${e}`
          });
          logAssessmentDebug('sales_performance', {
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

    // Log all scoring issues at once
    if (scoringIssues.unmatchedKeys.length > 0 || 
        scoringIssues.typeMismatches.length > 0 || 
        scoringIssues.defaultedScores.length > 0) {
      logAssessmentDebug('sales_performance', {
        message: 'Scoring issues detected',
        issues: scoringIssues
      });
    }

    const raw = weightSum ? total / weightSum : 0;
    const normalized = Math.round((raw + Number.EPSILON) * 2) / 2;

    // Log computed score with scoring issues
    logAssessmentScore('sales_performance', { 
      bracket,
      totalScore: total,
      totalWeight: weightSum,
      normalizedScore: normalized,
      scoringIssues
    });

    const supabase = createRouteHandlerClient({ cookies });

    // Ensure answers is a plain object before upserting
    const answersObject = typeof answers === 'string' ? JSON.parse(answers) : answers;

    // Upsert into sales_performance_assessment table using the full answers object
    const { error: assessmentError } = await supabase
      .from("sales_performance_assessment")
      .upsert({
        u_id: userId,
        answers: answersObject, // Properly insert as JSONB object
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
          answers: answersObject,
          score: normalized
        }
      });
      return NextResponse.json(
        { error: "Failed to save assessment", details: assessmentError },
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
