// /lib/sync/saveDashboard.ts

import { supabase } from "@/lib/supabase";

type DashboardInsightPayload = {
  user_id: string;
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

export async function saveDashboardInsights(payload: DashboardInsightPayload): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("tier2_dashboard_insights")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.error("❌ Failed to save dashboard insights:", error);
      return false;
    }

    console.log("✅ Dashboard insights updated successfully.");
    return true;
  } catch (err) {
    console.error("❌ Unexpected error saving dashboard:", err);
    return false;
  }
}
