import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { calculateScore } from "@/lib/scoring/calculateScore";
import { logAssessmentInput, logAssessmentScore, logAssessmentError } from "@/lib/utils/logger";
import { recalculateOverallScore } from "@/lib/sync/recalculateOverallScore";
import { sanitizeAssessmentAnswers } from "@/lib/utils/sanitization";

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
  },
  strategic_maturity: {
    answerTable: "strategic_maturity_assessment",
    scoreTable: "score_strategic_maturity",
    profileField: "strategic_maturity_score",
    lastTakenField: "strategic_maturity_last_taken"
  },
  marketing_effectiveness: {
    answerTable: "marketing_effectiveness_assessment",
    scoreTable: "score_marketing_effectiveness",
    profileField: "marketing_score",
    lastTakenField: "marketing_last_taken"
  },
  ai_readiness: {
    answerTable: "ai_readiness_assessment",
    scoreTable: "score_ai_readiness",
    profileField: "ai_score",
    lastTakenField: "ai_last_taken"
  },
  competitive_benchmarking: {
    answerTable: "competitive_benchmarking_assessment",
    scoreTable: "score_competitive_benchmarking",
    profileField: "benchmarking_score",
    lastTakenField: "benchmarking_last_taken"
  },
  customer_experience: {
    answerTable: "customer_experience_assessment",
    scoreTable: "score_customer_experience",
    profileField: "cx_score",
    lastTakenField: "cx_last_taken"
  },
  digital_transformation: {
    answerTable: "digital_transformation_assessment",
    scoreTable: "score_digital_transformation",
    profileField: "digital_score",
    lastTakenField: "digital_last_taken"
  },
  leadership: {
    answerTable: "leadership_assessment",
    scoreTable: "score_leadership",
    profileField: "leadership_score",
    lastTakenField: "leadership_last_taken"
  },
  reassessment: {
    answerTable: "reassessment_assessment",
    scoreTable: "score_reassessment",
    profileField: "reassessment_score",
    lastTakenField: "reassessment_last_taken"
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
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    : null;

  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { assessment, answers, score, userId, invitationToken, inviteeName, inviteeEmail, inviterUserId } = await request.json();

    // Sanitize all assessment answers before processing
    const sanitizedAnswers = sanitizeAssessmentAnswers(answers);

    // Log incoming request data (use sanitized answers)
    logAssessmentInput(assessment, { userId, score, answers: sanitizedAnswers });

    if (!sanitizedAnswers || !score || !userId || !assessment) {
      const error = { error: "Missing required fields", details: { assessment, answers: sanitizedAnswers, score, userId } };
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

    // Calculate the final score using sanitized answers
    const finalScore = calculateScore(sanitizedAnswers, score, questionConfig);

    // Validate the final score
    if (typeof finalScore !== "number" || isNaN(finalScore)) {
      throw new Error("Final score calculation returned invalid value");
    }

    // Log the calculated score
    logAssessmentScore(assessment, { userId, score: finalScore });

    // Save score to score summary table (use sanitized answers)
    const { error: scoreError } = await supabase
      .from(mapping.scoreTable)
      .upsert({
        u_id: userId,
        score: finalScore,
        gmf_score: score,
        bracket_key: normalizeScore(finalScore),
        answers: sanitizedAnswers,
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

    // If this is an invited assessment, update the invitation record
    if (invitationToken && inviteeName && inviteeEmail && inviterUserId) {
      const { error: invitationError } = await supabase
        .from('assessment_invitations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          answers: sanitizedAnswers,
          score: finalScore,
          invitee_name: inviteeName,
          invitee_email: inviteeEmail
        })
        .eq('invitation_token', invitationToken);

      if (invitationError) {
        console.error("❌ Failed to update invitation:", invitationError);
        // Don't throw error here as the main assessment was successful
      }
    }

    // Recalculate overall score
    await recalculateOverallScore(supabase, userId);

    // For tech stack assessment, save the selected tools (use sanitized answers)
    if (assessment === "tech_stack") {
      const selectedTools = sanitizedAnswers["current_tech_stack"];
      if (selectedTools) {
        // Parse the selected tools and save to appropriate array fields
        const techStackData: any = {
          u_id: userId,
          updated_at: new Date().toISOString()
        };

        // Assuming selectedTools is an array of tool names, categorize them
        // This is a simplified approach - you may need to adjust based on your actual data structure
        if (Array.isArray(selectedTools)) {
          // For now, just save all tools to crm_tools as a placeholder
          // You'll need to implement proper categorization based on your assessment structure
          techStackData.crm_tools = selectedTools;
        }

        const { error: techStackError } = await supabase
          .from("user_tech_stack")
          .upsert(techStackData, {
            onConflict: "u_id"
          });

        if (techStackError) {
          console.error("❌ Failed to save tech stack:", techStackError);
          // Don't throw error here as it's not critical for the assessment submission
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