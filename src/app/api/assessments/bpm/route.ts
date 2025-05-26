import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import bpmScoringMap from "@/app/api/assessments/data/bpm_scoring_map.json";
import { logAssessmentInput, logAssessmentScore, logAssessmentError, logAssessmentDebug } from "@/lib/utils/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const scoringMap = bpmScoringMap as ScoringMap;

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
    logAssessmentInput('bpm', { userId, score, answers });

    if (!answers || !score || !userId) {
      const error = { error: "Missing required fields", details: { answers, score, userId } };
      logAssessmentError('bpm', error);
      return NextResponse.json(error, { status: 400 });
    }

    const bracket = getBracket(score);
    const bracketScoring = scoringMap[bracket];

    // Log selected bracket
    logAssessmentDebug('bpm', { bracket, bracketScoring });

    if (!bracketScoring) {
      const error = { error: "Invalid score bracket", details: { bracket, score } };
      logAssessmentError('bpm', error);
      return NextResponse.json(error, { status: 400 });
    }

    // Filter answers to only include keys from the scoring map
    const bracketScoringKeys = Object.keys(bracketScoring);
    const filteredAnswers = Object.fromEntries(
      Object.entries(answers).filter(([key]) => bracketScoringKeys.includes(key))
    );

    // Log filtered answers and missing keys
    logAssessmentDebug('bpm', {
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
      defaultedScores: [] as { 
        key: string; 
        answer: any; 
        reason: string;
        mappedValue?: string;
        mappedSelections?: string[];
      }[]
    };

    for (const key in filteredAnswers) {
      const q = bracketScoring[key];
      if (!q) {
        scoringIssues.unmatchedKeys.push(key);
        logAssessmentDebug('bpm', {
          message: `No scoring config found for key: ${key}`,
          answer: filteredAnswers[key]
        });
        continue;
      }

      const answer = filteredAnswers[key];
      let valScore = 0;

      // Log type mismatches
      if (q.type === "multiple_choice" && typeof answer !== "string") {
        scoringIssues.typeMismatches.push({
          key,
          expected: "string",
          received: typeof answer
        });
        continue;
      }

      if (q.type === "multi_select" && !Array.isArray(answer)) {
        scoringIssues.typeMismatches.push({
          key,
          expected: "array",
          received: typeof answer
        });
        continue;
      }

      if (q.type === "text_area" && typeof answer !== "string") {
        scoringIssues.typeMismatches.push({
          key,
          expected: "string",
          received: typeof answer
        });
        continue;
      }

      // Calculate score based on question type
      switch (q.type) {
        case "multiple_choice": {
          const value = q.values[answer as keyof typeof q.values];
          if (value !== undefined) {
            valScore = value;
          } else {
            scoringIssues.defaultedScores.push({
              key,
              answer,
              reason: "No matching value in scoring map"
            });
          }
          break;
        }
        case "multi_select": {
          const selections = answer as string[];
          const scores = selections.map(s => q.values[s as keyof typeof q.values]).filter(s => s !== undefined);
          if (scores.length > 0) {
            valScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          } else {
            scoringIssues.defaultedScores.push({
              key,
              answer,
              reason: "No matching values in scoring map",
              mappedSelections: selections
            });
          }
          break;
        }
        default: {
          // For any other question type, use a default score of 1
          valScore = 1;
          break;
        }
      }

      total += valScore * (q.weight || 1);
      weightSum += q.weight || 1;
    }

    // Calculate final score
    const finalScore = weightSum > 0 ? total / weightSum : 0;

    // Log scoring results
    logAssessmentScore('bpm', {
      finalScore,
      scoringIssues,
      bracket,
      weightSum,
      total
    });

    return NextResponse.json({ bpmScore: finalScore });
  } catch (error) {
    console.error("❌ BPM assessment scoring error:", error);
    logAssessmentError('bpm', error);
    return NextResponse.json(
      { error: "Failed to score BPM assessment" },
      { status: 500 }
    );
  }
} 