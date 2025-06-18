import { SupabaseClient } from "@supabase/supabase-js";

type DashboardInsightPayload = {
  u_id: string;
  strategy_score: number;
  process_score: number;
  technology_score: number;
  overall_score: number;
  industryAvgScore: number;
  topPerformerScore: number;
  benchmarking: Record<string, string>;
  strengths: { title: string; impact: string }[];
  weaknesses: { title: string; impact: string }[];
  roadmap: { task: string; expectedImpact: string }[];
  chartData: { month: string; userScore: number; industryScore: number; topPerformerScore: number }[];
  updated_at: string;
  industry?: string;
};

export async function saveDashboardInsights(
  supabase: SupabaseClient,
  payload: DashboardInsightPayload
): Promise<boolean> {
  try {
    // Ensure the JSON fields are properly handled
    const safePayload = {
      ...payload,
      benchmarking: payload.benchmarking || {},
      strengths: payload.strengths || [],
      weaknesses: payload.weaknesses || [],
      roadmap: payload.roadmap || []
    };

    const { error } = await supabase
      .from("tier2_dashboard_insights")
      .upsert([safePayload], { onConflict: "u_id" });

    if (error) {
      console.error("❌ Failed to save dashboard insights:", error);
      return false;
    }

    return true;
  } catch (err: unknown) {
    console.error("🔥 Unexpected error saving dashboard:", err);
    return false;
  }
}

