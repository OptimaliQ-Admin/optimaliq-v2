// src/app/api/growth-plan/nudges/dispatch/route.ts
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

export async function POST() {
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: due } = await supabase
    .from("growth_plan_nudges")
    .select("id, plan_id, user_id, type, payload, send_at")
    .eq("sent", false)
    .lte("send_at", new Date().toISOString());

  if (!due?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;
  for (const n of due) {
    const { data: user } = await supabase
      .from("users")
      .select("email, first_name")
      .eq("id", n.user_id)
      .maybeSingle();

    if (!user?.email) continue;

    const subject = n.type === "day7" ? "Quick nudge on your 30‑day plan" : "Two‑thirds check‑in on your 30‑day plan";
    const link = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai'}/premium/dashboard?plan=${n.plan_id}`;
    await resend?.emails.send({
      to: user.email,
      subject,
      html: `<p>Hi ${user.first_name || ''}, quick nudge on your 30‑day plan.</p><p><a href="${link}">Open my plan →</a></p>`
    });

    await supabase.from("growth_plan_nudges").update({ sent: true }).eq("id", n.id);
    sent++;
  }
  return NextResponse.json({ sent });
}


