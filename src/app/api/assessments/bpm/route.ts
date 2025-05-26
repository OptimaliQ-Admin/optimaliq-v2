import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import bpmScoringMap from "@/app/api/assessments/data/bpm_scoring_map.json";
import { bpmSemanticToScoringKeyMap } from "../data/bpm_key_map";
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

    // Map semantic keys to scoring map keys
    const mappedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
      const bracketMap = bpmSemanticToScoringKeyMap[bracket] || {};
      const scoringKey = bracketMap[key] || key;
      acc[scoringKey] = value;
      return acc;
    }, {} as Record<string, any>);

    // Filter answers to only include keys from the scoring map
    const bracketScoringKeys = Object.keys(bracketScoring);
    const filteredAnswers = Object.fromEntries(
      Object.entries(mappedAnswers).filter(([key]) => bracketScoringKeys.includes(key))
    );

    // Log filtered answers and missing keys
    logAssessmentDebug('bpm', {
      originalAnswers: answers,
      mappedAnswers,
      filteredAnswers,
      missingKeys: Object.keys(mappedAnswers).filter(key => !bracketScoringKeys.includes(key))
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
          logAssessmentDebug('bpm', {
            message: `No score found for multiple choice answer`,
            key,
            answer,
            availableValues: Object.keys(q.values)
          });
        }
      }

      if (q.type === "multi_select") {
        try {
          const selections: string[] = Array.isArray(answer) 
            ? answer 
            : JSON.parse(answer as string);
            
          const scores = selections.map((s) => q.values[s] || 0);
          valScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          
          if (valScore === 0) {
            scoringIssues.defaultedScores.push({
              key,
              answer: selections,
              reason: `No matching values in scoring map. Available values: ${Object.keys(q.values).join(', ')}`
            });
            logAssessmentDebug('bpm', {
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
          logAssessmentDebug('bpm', {
            message: `Error processing multi-select answer`,
            key,
            answer,
            error: e
          });
        }
      }

      // Handle text area questions with a default score of 0
      if (q.type === "text_area" as const) {
        valScore = 0; // Default score for text area questions
      }

      total += valScore * q.weight;
      weightSum += q.weight;
    }

    const finalScore = weightSum > 0 ? total / weightSum : 0;

    // Log final score and any scoring issues
    logAssessmentScore('bpm', {
      score: finalScore,
      bracket,
      totalWeight: weightSum,
      scoringIssues: scoringIssues.unmatchedKeys.length > 0 || 
                    scoringIssues.typeMismatches.length > 0 || 
                    scoringIssues.defaultedScores.length > 0 ? scoringIssues : undefined
    });

    return NextResponse.json({ bpmScore: finalScore });
  } catch (error) {
    logAssessmentError('bpm', error);
    return NextResponse.json(
      { error: "Failed to process assessment" },
      { status: 500 }
    );
  }
} 