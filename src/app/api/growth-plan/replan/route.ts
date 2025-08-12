// src/app/api/growth-plan/replan/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST() {
  const userClient = createRouteHandlerClient({ cookies });
  const { data: auth } = await userClient.auth.getUser();
  const user = auth?.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: plan } = await supabase
    .from('growth_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('status','active')
    .order('created_at',{ ascending: false })
    .limit(1)
    .maybeSingle();
  if (!plan) return NextResponse.json({ error: 'No active plan' }, { status: 404 });

  // Re-rank: sort levers by (blocked longest desc) then impact/effort
  const { data: levers } = await supabase
    .from('growth_plan_levers')
    .select('*')
    .eq('plan_id', plan.id);

  if (!levers?.length) return NextResponse.json({ ok: true });

  const now = Date.now();
  const sevenDaysMs = 7*24*60*60*1000;
  const sorted = levers.slice().sort((a: any, b: any) => {
    const aBlockedMs = a.blocked_at ? now - new Date(a.blocked_at).getTime() : 0;
    const bBlockedMs = b.blocked_at ? now - new Date(b.blocked_at).getTime() : 0;
    if (aBlockedMs !== bBlockedMs) return bBlockedMs - aBlockedMs;
    const aScore = (Number(a.impact||3)) / Math.max(1, Number(a.effort||3));
    const bScore = (Number(b.impact||3)) / Math.max(1, Number(b.effort||3));
    return bScore - aScore;
  });

  // Push/pull due dates within window if blocked >7 days
  const start = new Date(plan.period_start);
  const end = new Date(plan.period_end);
  const clamp = (d: Date) => {
    if (d < start) return start; if (d > end) return end; return d;
  };

  for (let i=0;i<sorted.length;i++) {
    const l:any = sorted[i];
    let newDue = l.due_date ? new Date(l.due_date) : end;
    if (l.blocked_at && (now - new Date(l.blocked_at).getTime()) > sevenDaysMs) {
      // push a bit to the right
      newDue = new Date(newDue.getTime() + 3*24*60*60*1000);
    }
    const clamped = clamp(newDue);
    await supabase
      .from('growth_plan_levers')
      .update({ priority: i+1, due_date: clamped.toISOString().slice(0,10) })
      .eq('id', l.id);
  }

  // Optional: propose one replacement if a lever blocked >7 days
  // (Placeholder: mark the most blocked with risk_reason tail)
  const worst = levers
    .filter((l:any)=> l.blocked_at && (now - new Date(l.blocked_at).getTime()) > sevenDaysMs)
    .sort((a:any,b:any)=> new Date(a.blocked_at).getTime() - new Date(b.blocked_at).getTime())[0];
  if (worst) {
    await supabase.from('growth_plan_levers').update({ risk_reason: (worst.risk_reason||'') + ' | consider replacement' }).eq('id', worst.id);
  }

  return NextResponse.json({ ok: true });
}


