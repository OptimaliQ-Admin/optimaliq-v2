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

  const { status, current_value } = await req.json();
  if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

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

  await supabase
    .from("growth_plan_levers")
    .update({ status, current_value: current_value ?? null })
    .eq("id", params.id);

  return NextResponse.json({ ok: true });
}


