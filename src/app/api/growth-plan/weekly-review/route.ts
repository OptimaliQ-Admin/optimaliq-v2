// src/app/api/growth-plan/weekly-review/route.ts
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { resend, EMAIL_SENDERS } from "@/lib/resend";

export async function POST() {
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get users with active plans
  const { data: plans } = await supabase
    .from("growth_plans")
    .select("id, user_id")
    .eq("status", "active");
  if (!plans?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;
  for (const p of plans) {
    const { data: user } = await supabase.from("users").select("email, first_name").eq("id", p.user_id).maybeSingle();
    if (!user?.email || !resend) continue;
    const link = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai'}/premium/dashboard?plan=${p.id}&review=1`;
    await resend.emails.send({
      from: EMAIL_SENDERS.SUPPORT,
      to: user.email,
      subject: "Weekly Review: Reflect and rescore your plan",
      html: `<p>Hi ${user.first_name || ''}, take 2 minutes to review your week and update outcomes.</p><p><a href="${link}">Open Weekly Review →</a></p>`
    });
    sent++;
  }
  return NextResponse.json({ sent });
}


