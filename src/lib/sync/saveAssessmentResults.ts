// I will add a helper to dual-write normalized results and legacy view/table payloads.

export interface SaveAssessmentInput {
  userId: string;
  sessionId: string;
  scores: {
    strategy_score: number;
    process_score: number;
    technology_score: number;
    score: number;
    confidence?: number;
    versions?: Record<string, any>;
    ai_details?: Record<string, any>;
  };
  insights: {
    benchmarking: any;
    strengths: any[];
    weaknesses: any[];
    roadmap: any[];
  };
  industry?: string | null;
}

import { createClient } from "@supabase/supabase-js";

export async function saveAssessmentResults(input: SaveAssessmentInput) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1) normalized writes
  await supabase.from("assessment_scoring_results").insert({
    session_id: input.sessionId,
    user_id: input.userId,
    strategy_score: input.scores.strategy_score,
    process_score: input.scores.process_score,
    technology_score: input.scores.technology_score,
    overall_score: input.scores.score,
    confidence: input.scores.confidence ?? 0.75,
    versions: input.scores.versions ?? {},
    ai_details: input.scores.ai_details ?? {},
  });

  await supabase.from("assessment_insights").insert({
    session_id: input.sessionId,
    user_id: input.userId,
    benchmarking: input.insights.benchmarking ?? {},
    strengths: input.insights.strengths ?? [],
    weaknesses: input.insights.weaknesses ?? [],
    roadmap: input.insights.roadmap ?? [],
    tone_version: "mckinsey-v1",
  });

  // 2) legacy bridge dual-write (optional, keep until cutover)
  await supabase.from("tier2_dashboard_insights").upsert({
    u_id: input.userId,
    strategy_score: input.scores.strategy_score,
    process_score: input.scores.process_score,
    technology_score: input.scores.technology_score,
    overall_score: input.scores.score,
    industry: input.industry?.toLowerCase?.() ?? null,
    industryAvgScore: 3.2,
    topPerformerScore: 4.5,
    benchmarking: input.insights.benchmarking ?? {},
    strengths: input.insights.strengths ?? [],
    weaknesses: input.insights.weaknesses ?? [],
    roadmap: input.insights.roadmap ?? [],
    updated_at: new Date().toISOString(),
  }, { onConflict: "u_id" });
}
