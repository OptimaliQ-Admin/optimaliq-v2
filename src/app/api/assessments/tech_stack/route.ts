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
    logAssessmentScore('tech_stack', { 
      bracket,
      totalScore,
      totalWeight,
      normalizedScore
    });

    const supabase = createRouteHandlerClient({ cookies });

    // Log the data we're about to upsert
    logAssessmentDebug('tech_stack', {
      type: 'upsert_data',
      table: 'tech_stack_assessment',
      data: {
        u_id: userId,
        ...answers,
        score: normalizedScore,
        created_at: new Date().toISOString()
      }
    });

    // Upsert into tech_stack_assessment table
    const { error: assessmentError } = await supabase
      .from("tech_stack_assessment")
      .upsert({
        u_id: userId,
        // Score 1.0 questions
        tech_infrastructure: answers.tech_infrastructure,
        data_management: answers.data_management,
        integration_status: answers.integration_status,
        automation_level: answers.automation_level,
        platform_adoption: answers.platform_adoption,
        workflow_efficiency: answers.workflow_efficiency,
        ai_adoption_score_1: answers.ai_adoption_score_1,
        tech_scalability_score_1: answers.tech_scalability_score_1,
        future_readiness_score_1: answers.future_readiness_score_1,
        // Score 1.5 questions
        tech_architecture: answers.tech_architecture,
        data_governance: answers.data_governance,
        system_reliability: answers.system_reliability,
        innovation_capability: answers.innovation_capability,
        scalability_planning: answers.scalability_planning,
        future_tech_strategy: answers.future_tech_strategy,
        // Score 2.0 questions
        enterprise_architecture: answers.enterprise_architecture,
        data_ecosystem: answers.data_ecosystem,
        system_resilience: answers.system_resilience,
        // Score 2.5 questions
        digital_transformation: answers.digital_transformation,
        cloud_maturity: answers.cloud_maturity,
        tech_modernization: answers.tech_modernization,
        // Score 3.0 questions
        microservices: answers.microservices,
        data_lake: answers.data_lake,
        security_architecture: answers.security_architecture,
        // Score 3.5 questions
        ai_infrastructure: answers.ai_infrastructure,
        ml_platform: answers.ml_platform,
        data_pipeline: answers.data_pipeline,
        ai_adoption_score_3_5: answers.ai_adoption_score_3_5,
        tech_scalability_score_3_5: answers.tech_scalability_score_3_5,
        future_readiness_score_3_5: answers.future_readiness_score_3_5,
        // Score 4.0 questions
        analytics_platform: answers.analytics_platform,
        data_warehouse: answers.data_warehouse,
        real_time_analytics: answers.real_time_analytics,
        // Score 4.5 questions
        innovation_platform: answers.innovation_platform,
        emerging_tech: answers.emerging_tech,
        research_dev: answers.research_dev,
        // Score 5.0 questions
        autonomous_infrastructure: answers.autonomous_infrastructure,
        self_learning_systems: answers.self_learning_systems,
        adaptive_architecture: answers.adaptive_architecture,
        // Tools questions
        crm_tools: answers.crm_tools,
        esp_tools: answers.esp_tools,
        analytics_tools: answers.analytics_tools,
        cms_tools: answers.cms_tools,
        // Metadata
        score: normalizedScore,
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
          ...answers,
          score: normalizedScore
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
        score: normalizedScore,
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
        tech_stack_score: normalizedScore,
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

    return NextResponse.json({ techStackScore: normalizedScore });
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