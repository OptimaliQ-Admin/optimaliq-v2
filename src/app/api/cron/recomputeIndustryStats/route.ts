import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Compute simple averages per industry from latest scores
  const { data: users } = await supabase.from("users").select("id, industry");
  if (!users) return NextResponse.json({ updated: 0 });

  const byIndustry: Record<string, { sum: number; count: number }> = {};
  for (const u of users) {
    const industry = (u.industry ?? "general").toLowerCase();
    const { data: lastScore } = await supabase
      .from("assessment_scoring_results")
      .select("overall_score, created_at")
      .eq("user_id", u.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!lastScore) continue;
    byIndustry[industry] = byIndustry[industry] || { sum: 0, count: 0 };
    byIndustry[industry].sum += Number(lastScore.overall_score || 0);
    byIndustry[industry].count += 1;
  }

  let updated = 0;
  for (const [industry, agg] of Object.entries(byIndustry)) {
    const industry_avg = agg.count ? Number((agg.sum / agg.count).toFixed(2)) : 3.2;
    const top_performer = Math.max(4.2, Number((industry_avg + 1.0).toFixed(2)));
    const { error } = await supabase.from("industry_stats_daily").upsert(
      {
        industry,
        industry_avg,
        top_performer,
        percentile_map: {},
        computed_at: new Date().toISOString(),
      },
      { onConflict: "industry" as any }
    );
    if (!error) updated++;
  }

  return NextResponse.json({ updated });
}
