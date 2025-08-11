import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAssessmentInviteEmail } from "@/lib/email/sendInvite";

export async function POST(_req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  try {
    const { data: invites, error } = await supabase
      .from('assessment_invites')
      .select('id, token, invite_email, invite_name, campaign_id, expires_at, status')
      .eq('status', 'sent')
      .gt('expires_at', new Date().toISOString())
      .limit(200);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    let sent = 0;
    for (const inv of invites || []) {
      await sendAssessmentInviteEmail({ to: inv.invite_email, name: inv.invite_name, title: 'Reminder: Assessment pending', token: inv.token });
      sent++;
    }
    return NextResponse.json({ sent });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


