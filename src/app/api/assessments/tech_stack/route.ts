import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import techStackScoringMap from "../data/tech_stack_scoring_map.json";
import { logAssessmentInput, logAssessmentScore, logAssessmentError, logAssessmentDebug } from "@/lib/utils/logger";

const scoringMap = techStackScoringMap as ScoringMap;

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
    logAssessmentInput('tech_stack', { userId, score, answers });

    if (!answers || !score || !userId) {
      const error = { error: "Missing required fields", details: { answers, score, userId } };
      logAssessmentError('tech_stack', error);
      return NextResponse.json(error, { status: 400 });
    }

    const bracket = getBracket(score);
    const bracketScoring = scoringMap[bracket];

    // Log selected bracket
    logAssessmentDebug('tech_stack', { bracket, bracketScoring });

    if (!bracketScoring) {
      const error = { error: "Invalid score bracket", details: { bracket, score } };
      logAssessmentError('tech_stack', error);
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
    logAssessmentScore('tech_stack', { 
      bracket,
      totalScore: total,
      totalWeight: weightSum,
      normalizedScore: normalized
    });

    const supabase = createRouteHandlerClient({ cookies });

    // Create a JSONB column for answers
    const { error: assessmentError } = await supabase
      .from("tech_stack_assessment")
      .upsert({
        u_id: userId,
        answers: answers, // Store all answers in a single JSONB column
        score: normalized,
        created_at: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (assessmentError) {
      logAssessmentError('tech_stack', {
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

    // Insert into score_tech_stack table
    const { error: scoreError } = await supabase
      .from("score_tech_stack")
      .insert({
        u_id: userId,
        gmf_score: score,
        bracket_key: bracket,
        score: normalized,
        answers,
        version: "v1",
      });

    if (scoreError) {
      logAssessmentError('tech_stack', {
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
        tech_stack_score: normalized,
        tech_stack_last_taken: new Date().toISOString(),
      }, {
        onConflict: "u_id"
      });

    if (profileError) {
      logAssessmentError('tech_stack', {
        error: "Failed to update profile",
        details: profileError
      });
      return NextResponse.json(
        { error: "Failed to update profile", details: profileError },
        { status: 500 }
      );
    }

    return NextResponse.json({ techStackScore: normalized });
  } catch (error) {
    logAssessmentError('tech_stack', {
      error: "Internal server error",
      details: error
    });
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
} 