// src/app/api/growth-plan/generate/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { generateGrowthPlan } from "@/lib/ai/growthPlan";

export async function POST() {
  // User-scoped client (for auth)
  const userClient = createRouteHandlerClient({ cookies });
  const { data: auth } = await userClient.auth.getUser();
  const user = auth?.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Admin client for inserts
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Reuse active plan
  const { data: existing } = await supabase
    .from("growth_plans")
    .select("id, period_end, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing) return NextResponse.json({ planId: existing.id, reused: true });

  // Pull latest dashboard insights as scores/context
  const { data: insights } = await supabase
    .from("tier2_dashboard_insights_v")
    .select("*")
    .eq("u_id", user.id)
    .maybeSingle();

  // Cohort snapshot from daily stats
  const industry = (insights?.industry || "general").toLowerCase();
  const { data: cohortStats } = await supabase
    .from("industry_stats_daily")
    .select("industry, industry_avg, top_performer")
    .eq("industry", industry)
    .maybeSingle();

  const scores = {
    strategy_score: Number(insights?.strategy_score ?? 0),
    process_score: Number(insights?.process_score ?? 0),
    technology_score: Number(insights?.technology_score ?? 0),
    overall_score: Number(insights?.overall_score ?? insights?.score ?? 0),
    industry,
  };
  const cohort = cohortStats || { industry, industry_avg: 3.2, top_performer: 4.5 };

  const { levers, cohort_snapshot } = await generateGrowthPlan(scores, cohort);

  // Insert plan
  const { data: plan, error: planErr } = await supabase
    .from("growth_plans")
    .insert({ user_id: user.id, cohort_snapshot })
    .select("id, period_start, period_end")
    .single();
  if (planErr) return NextResponse.json({ error: planErr.message }, { status: 500 });

  // Insert levers
  const leverRows = levers.map((lv, i) => ({
    plan_id: plan.id,
    title: lv.title,
    description: lv.description,
    priority: lv.priority ?? i + 1,
    success_metric: lv.success_metric,
    target_value: lv.target_value,
    due_date: lv.due_date,
    owner: lv.owner,
    tags: lv.tags ?? [],
    ai_reasoning: lv.ai_reasoning,
  }));
  await supabase.from("growth_plan_levers").insert(leverRows);

  // Nudges at day 7 and 21 from period_start
  const start = new Date(plan.period_start as any);
  const addDays = (n: number) => new Date(start.getTime() + n * 86400000).toISOString();
  await supabase.from("growth_plan_nudges").insert([
    { plan_id: plan.id, user_id: user.id, send_at: addDays(7), type: "day7", payload: { planId: plan.id } },
    { plan_id: plan.id, user_id: user.id, send_at: addDays(21), type: "day21", payload: { planId: plan.id } },
  ]);

  return NextResponse.json({ planId: plan.id });
}


