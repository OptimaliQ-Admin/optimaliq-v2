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
    // 🧼 Defensive JSON cleanup for all jsonb fields
    const safePayload = {
      ...payload,
      benchmarking: JSON.parse(JSON.stringify(payload.benchmarking || {})),
      strengths: JSON.parse(JSON.stringify(payload.strengths || [])),
      weaknesses: JSON.parse(JSON.stringify(payload.weaknesses || [])),
      roadmap: JSON.parse(JSON.stringify(payload.roadmap || [])),
      chartData: JSON.parse(JSON.stringify(payload.chartData || [])),
    };

    console.log("💾 About to save insights:", JSON.stringify(safePayload, null, 2));

    const { error } = await supabase
      .from("tier2_dashboard_insights")
      .upsert([safePayload], { onConflict: "u_id" });

    if (error) {
      console.error("❌ Failed to save dashboard insights:", error);
      return false;
    }

    console.log("✅ Dashboard insights updated successfully.");
    return true;
  } catch (err: unknown) {
    console.error("🔥 Unexpected error saving dashboard:", err);
    return false;
  }
}
