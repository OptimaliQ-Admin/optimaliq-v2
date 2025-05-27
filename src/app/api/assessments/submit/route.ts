import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { calculateScore } from "@/lib/scoring/calculateScore";
import { logAssessmentInput, logAssessmentScore, logAssessmentError } from "@/lib/utils/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { assessment, answers, score, userId } = await request.json();

    // Log incoming request data
    logAssessmentInput(assessment, { userId, score, answers });

    if (!answers || !score || !userId || !assessment) {
      const error = { error: "Missing required fields", details: { assessment, answers, score, userId } };
      logAssessmentError(assessment, error);
      return NextResponse.json(error, { status: 400 });
    }

    // Load the question config for this assessment
    const questionConfig = await import(`@/lib/config/${assessment}_question_config.json`);

    // Calculate the final score
    const finalScore = calculateScore(answers, score, questionConfig.default);

    // Log the calculated score
    logAssessmentScore(assessment, { userId, score: finalScore });

    // Store the full assessment in Supabase
    const { error: assessmentError } = await supabase
      .from(`${assessment}_assessment`)
      .upsert({
        u_id: userId,
        answers: answers,
        score: finalScore,
        created_at: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (assessmentError) {
      console.error("❌ Failed to save assessment:", assessmentError);
      throw new Error("Failed to save assessment");
    }

    // Update tier2_profiles with latest score and timestamp
    const { error: profileError } = await supabase
      .from("tier2_profiles")
      .upsert({
        u_id: userId,
        [`${assessment}_score`]: finalScore,
        [`${assessment}_last_taken`]: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (profileError) {
      console.error("❌ Failed to update profile:", profileError);
      throw new Error("Failed to update profile");
    }

    return NextResponse.json({ score: finalScore });
  } catch (err: unknown) {
    console.error("❌ Assessment submission failed:", err);
    const error = { error: "Failed to process assessment", details: err };
    logAssessmentError("unknown", error);
    return NextResponse.json(error, { status: 500 });
  }
} 