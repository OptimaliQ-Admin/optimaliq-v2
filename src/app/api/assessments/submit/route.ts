import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { calculateScore } from "@/lib/scoring/calculateScore";
import { logAssessmentInput, logAssessmentScore, logAssessmentError } from "@/lib/utils/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type AssessmentMapping = {
  answerTable: string;
  scoreTable: string;
  profileField: string;
  lastTakenField: string;
};

type SlugMap = {
  [key: string]: AssessmentMapping;
};

const slugMap: SlugMap = {
  sales: {
    answerTable: "sales_performance_assessment",
    scoreTable: "score_sales_performance",
    profileField: "sales_score",
    lastTakenField: "sales_last_taken"
  },
  bpm: {
    answerTable: "bpm_assessment",
    scoreTable: "score_bpm",
    profileField: "bpm_score",
    lastTakenField: "bpm_last_taken"
  },
  tech_stack: {
    answerTable: "tech_stack_assessment",
    scoreTable: "score_tech_stack",
    profileField: "tech_stack_score",
    lastTakenField: "tech_stack_last_taken"
  }
};


function normalizeScore(score: number): string {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
}

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

    const mapping = slugMap[assessment];
    if (!mapping) {
      return NextResponse.json({ error: `Unknown assessment slug: ${assessment}` }, { status: 400 });
    }

    // Load the question config for this assessment
    const questionConfigModule = await import(`@/lib/config/${assessment}_question_config.json`);
    const questionConfig = questionConfigModule.default;

    // Calculate the final score
    const finalScore = calculateScore(answers, score, questionConfig);

    // Validate the final score
    if (typeof finalScore !== "number" || isNaN(finalScore)) {
      throw new Error("Final score calculation returned invalid value");
    }

    // Log the calculated score
    logAssessmentScore(assessment, { userId, score: finalScore });

    // Save answers to assessment table
    const { error: assessmentError } = await supabase
      .from(mapping.answerTable)
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

    // Save score to score summary table
    const { error: scoreError } = await supabase
      .from(mapping.scoreTable)
      .upsert({
        u_id: userId,
        score: finalScore,
        gmf_score: score,
        bracket_key: normalizeScore(finalScore),
        answers,
        created_at: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (scoreError) {
      console.error("❌ Failed to save score:", scoreError);
      throw new Error("Failed to save score summary");
    }

    // Update profile with latest score and timestamp
    const { error: profileError } = await supabase
      .from("tier2_profiles")
      .upsert({
        u_id: userId,
        [mapping.profileField]: finalScore,
        [mapping.lastTakenField]: new Date().toISOString()
      }, {
        onConflict: "u_id"
      });

    if (profileError) {
      console.error("❌ Failed to update profile:", profileError);
      throw new Error("Failed to update profile");
    }

    // For tech stack assessment, save the selected tools
    if (assessment === "tech_stack") {
      const selectedTools = answers["current_tech_stack"];
      if (selectedTools) {
        const { error: techStackError } = await supabase
          .from("user_tech_stack")
          .upsert({
            u_id: userId,
            selected_tools: selectedTools,
            created_at: new Date().toISOString()
          }, {
            onConflict: "u_id"
          });

        if (techStackError) {
          console.error("❌ Failed to save tech stack:", techStackError);
          throw new Error("Failed to save tech stack selections");
        }
      }
    }

    return NextResponse.json({ score: finalScore });
  } catch (err: unknown) {
    console.error("❌ Assessment submission failed:", err);
    const error = { error: "Failed to process assessment", details: err };
    logAssessmentError("unknown", error);
    return NextResponse.json(error, { status: 500 });
  }
} 