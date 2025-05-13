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
    // 🧪 Log if any fields are unexpectedly empty before cleaning
    if (!payload.strengths?.length) console.warn("⚠️ strengths array is empty or missing");
    if (!payload.weaknesses?.length) console.warn("⚠️ weaknesses array is empty or missing");
    if (!payload.roadmap?.length) console.warn("⚠️ roadmap array is empty or missing");
    if (!payload.benchmarking || !payload.benchmarking.strategy) console.warn("⚠️ benchmarking object is empty or incomplete");

    const safePayload = {
      ...payload,
      benchmarking: payload.benchmarking || {},
      strengths: payload.strengths || [],
      weaknesses: payload.weaknesses || [],
      roadmap: payload.roadmap || [],
      chartData: payload.chartData || [],
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

