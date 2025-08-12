// src/app/api/growth-plan/levers/[id]/subtasks/route.ts
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

  const { title, due_date } = await req.json();
  if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // verify lever belongs to user
  const { data: lever } = await supabase
    .from("growth_plan_levers")
    .select("id, plan_id")
    .eq("id", params.id)
    .single();
  if (!lever) return NextResponse.json({ error: "Lever not found" }, { status: 404 });
  const { data: plan } = await supabase
    .from("growth_plans")
    .select("user_id")
    .eq("id", lever.plan_id)
    .single();
  if (!plan || plan.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("growth_plan_subtasks")
    .insert({ lever_id: params.id, title, due_date: due_date ?? null })
    .select("id, title, status, due_date, created_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subtask: data });
}


