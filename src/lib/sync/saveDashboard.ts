// File: /lib/sync/saveDashboard.ts

import { SupabaseClient } from "@supabase/supabase-js";

type DashboardInsightPayload = {
  u_id: string;
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
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
    const { error } = await supabase
      .from("tier2_dashboard_insights")
      .upsert([payload], { onConflict: "u_id" });

    if (error) {
      console.error("❌ Failed to save dashboard insights:", error);
      return false;
    }

    console.log("✅ Dashboard insights updated successfully.");
    return true;
  } catch (err: unknown) {
    console.error("❌ Unexpected error saving dashboard:", err);
    return false;
  }
}
