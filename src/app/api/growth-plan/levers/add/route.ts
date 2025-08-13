import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const userClient = createRouteHandlerClient({ cookies });
  const { data: auth } = await userClient.auth.getUser();
  const user = auth?.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();
  const { title, description, success_metric, target_value, due_date, owner } = body || {};
  if (!title || !success_metric) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // Get or create active plan
  let { data: plan } = await supabase
    .from('growth_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!plan) {
    const { data: created, error: planErr } = await supabase
      .from('growth_plans')
      .insert({ user_id: user.id })
      .select('*')
      .single();
    if (planErr) return NextResponse.json({ error: planErr.message }, { status: 500 });
    plan = created;
  }

  // Respect 5-lever cap
  const { count } = await supabase
    .from('growth_plan_levers')
    .select('*', { count: 'exact', head: true })
    .eq('plan_id', plan.id);
  if ((count ?? 0) >= 5) return NextResponse.json({ error: 'Lever cap reached' }, { status: 400 });

  const { data: inserted, error: leverErr } = await supabase
    .from('growth_plan_levers')
    .insert({
      plan_id: plan.id,
      title,
      description: description || null,
      priority: (count ?? 0) + 1,
      success_metric,
      target_value: target_value || null,
      due_date: due_date || null,
      owner: owner || 'Growth lead',
      ai_reasoning: null,
      tags: [],
    })
    .select('*')
    .single();

  if (leverErr) return NextResponse.json({ error: leverErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, lever: inserted });
}


