import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";
import techStackScoringMap from "@/lib/scoring/tech_stack_scoring_map.json";

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

    if (!answers || !score || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bracket = getBracket(score);
    const bracketScoring = scoringMap[bracket];

    if (!bracketScoring) {
      return NextResponse.json(
        { error: "Invalid score bracket" },
        { status: 400 }
      );
    }

    let totalScore = 0;
    let totalWeight = 0;

    for (const [key, entry] of Object.entries(bracketScoring)) {
      const answer = answers[key];
      if (!answer) continue;

      const value = entry.values[answer as string];
      if (value) {
        totalScore += value * entry.weight;
        totalWeight += entry.weight;
      }
    }

    const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    const supabase = createRouteHandlerClient({ cookies });

    // Insert into tech_stack_assessment table
    const { error: insertError } = await supabase
      .from("tech_stack_assessment")
      .insert([{
        u_id: userId,
        basic_infrastructure: answers.basic_infrastructure,
        data_management: answers.data_management,
        security_measures: answers.security_measures,
        cloud_infrastructure: answers.cloud_infrastructure,
        data_warehouse: answers.data_warehouse,
        security_compliance: answers.security_compliance,
        integration_platform: answers.integration_platform,
        data_pipeline: answers.data_pipeline,
        security_automation: answers.security_automation,
        api_management: answers.api_management,
        data_governance: answers.data_governance,
        security_monitoring: answers.security_monitoring,
        microservices: answers.microservices,
        data_lake: answers.data_lake,
        security_architecture: answers.security_architecture,
        ai_infrastructure: answers.ai_infrastructure,
        ml_platform: answers.ml_platform,
        analytics_platform: answers.analytics_platform,
        innovation_platform: answers.innovation_platform,
        emerging_tech: answers.emerging_tech,
        research_dev: answers.research_dev,
        autonomous_infrastructure: answers.autonomous_infrastructure,
        self_learning_systems: answers.self_learning_systems,
        adaptive_architecture: answers.adaptive_architecture,
        score: normalizedScore,
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error("Error inserting assessment:", insertError);
      return NextResponse.json(
        { error: "Failed to save assessment" },
        { status: 500 }
      );
    }

    // Update tier2_profiles table
    const { error: updateError } = await supabase
      .from("tier2_profiles")
      .upsert({
        u_id: userId,
        tech_stack_score: normalizedScore,
        tech_stack_last_taken: new Date().toISOString(),
      }, {
        onConflict: "u_id"
      });

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ techStackScore: normalizedScore });
  } catch (error) {
    console.error("Error processing assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 