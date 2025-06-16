import { SupabaseClient } from "@supabase/supabase-js";

interface InsightData {
  u_id: string;
  strategy_score: number;
  process_score: number;
  technology_score: number;
  overall_score: number;
  strategy_insight: string;
  process_insight: string;
  technology_insight: string;
  generatedat: string;
}

export async function syncDashboardInsights(
  supabase: SupabaseClient,
  u_id: string
): Promise<boolean> {
  try {
    // 1. Fetch latest insights
    const { data: insightData, error: insightError } = await supabase
      .from("growth_insights")
      .select("*")
      .eq("u_id", u_id)
      .order("generatedat", { ascending: false })
      .limit(1)
      .single();

    if (insightError || !insightData) {
      console.error("❌ Failed to fetch insights:", insightError);
      return false;
    }

    // 2. Fetch industry averages and top performer scores
    const { data: industryData, error: industryError } = await supabase
      .from("industry_benchmarks")
      .select("industry_avg, top_performer")
      .single();

    if (industryError) {
      console.error("❌ Failed to fetch industry data:", industryError);
      return false;
    }

    // 3. Prepare dashboard insights payload
    const dashboardPayload = {
      u_id,
      strategy_score: insightData.strategy_score,
      process_score: insightData.process_score,
      technology_score: insightData.technology_score,
      overall_score: insightData.overall_score,
      industryAvgScore: industryData?.industry_avg || 3.0,
      topPerformerScore: industryData?.top_performer || 4.5,
      benchmarking: {
        strategy: insightData.strategy_insight,
        process: insightData.process_insight,
        technology: insightData.technology_insight,
      },
      strengths: [], // These will be populated by AI analysis
      weaknesses: [], // These will be populated by AI analysis
      roadmap: [], // This will be populated by AI analysis
      chartData: [
        { month: "Now", userScore: insightData.overall_score, industryScore: industryData?.industry_avg || 3.0, topPerformerScore: industryData?.top_performer || 4.5 },
        { month: "3 Months", userScore: Math.min(5, insightData.overall_score + 0.5), industryScore: industryData?.industry_avg || 3.0, topPerformerScore: industryData?.top_performer || 4.5 },
        { month: "6 Months", userScore: Math.min(5, insightData.overall_score + 1), industryScore: industryData?.industry_avg || 3.0, topPerformerScore: industryData?.top_performer || 4.5 },
        { month: "12 Months", userScore: Math.min(5, insightData.overall_score + 2), industryScore: industryData?.industry_avg || 3.0, topPerformerScore: industryData?.top_performer || 4.5 },
      ],
      updated_at: new Date().toISOString(),
    };

    // 4. Upsert to tier2_dashboard_insights
    const { error: upsertError } = await supabase
      .from("tier2_dashboard_insights")
      .upsert([dashboardPayload], { onConflict: "u_id" });

    if (upsertError) {
      console.error("❌ Failed to sync dashboard insights:", upsertError);
      return false;
    }

    console.log("✅ Successfully synced dashboard insights");
    return true;
  } catch (err) {
    console.error("🔥 Unexpected error in syncDashboardInsights:", err);
    return false;
  }
} 