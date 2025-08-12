// src/app/api/growth-plan/levers/[id]/progress/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: Request, context: any) {
  const { params } = context;
  const userClient = createRouteHandlerClient({ cookies });
  const { data: auth } = await userClient.auth.getUser();
  const user = auth?.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { status, current_value, effort, impact, risk_status, risk_reason, due_date } = body || {};
  if (!status && effort === undefined && impact === undefined && current_value === undefined && due_date === undefined && risk_status === undefined && risk_reason === undefined) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: lever } = await supabase
    .from("growth_plan_levers")
    .select("id, plan_id")
    .eq("id", params.id)
    .single();
  if (!lever) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: plan } = await supabase
    .from("growth_plans")
    .select("user_id")
    .eq("id", lever.plan_id)
    .single();
  if (!plan || plan.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const update: any = {};
  if (status) update.status = status;
  if (current_value !== undefined) update.current_value = current_value;
  if (effort !== undefined) update.effort = effort;
  if (impact !== undefined) update.impact = impact;
  if (risk_status !== undefined) update.risk_status = risk_status;
  if (risk_reason !== undefined) update.risk_reason = risk_reason;
  if (due_date !== undefined) update.due_date = due_date;

  await supabase
    .from("growth_plan_levers")
    .update(update)
    .eq("id", params.id);

  return NextResponse.json({ ok: true });
}


