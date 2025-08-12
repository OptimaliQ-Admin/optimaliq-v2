// src/app/api/growth-plan/current/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function GET() {
  const userClient = createRouteHandlerClient({ cookies });
  const { data: auth } = await userClient.auth.getUser();
  const user = auth?.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: plan } = await supabase
    .from("growth_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!plan) return NextResponse.json({ plan: null });

  const [{ data: levers }, { data: nudges }] = await Promise.all([
    supabase
      .from("growth_plan_levers")
      .select("*, subtasks:growth_plan_subtasks(id, title, status, due_date, created_at)")
      .eq("plan_id", plan.id)
      .order("priority"),
    supabase.from("growth_plan_nudges").select("*").eq("plan_id", plan.id).order("send_at"),
  ]);

  return NextResponse.json({ plan, levers: levers ?? [], nudges: nudges ?? [] });
}


