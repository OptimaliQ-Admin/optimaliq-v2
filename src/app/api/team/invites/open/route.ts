import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });
    const { data: invite, error } = await supabase
      .from('assessment_invites')
      .select('*, assessment_assignments(*), assessment_campaigns:campaign_id(*), assessment_campaign_configs!assessment_campaign_configs_campaign_id_fkey(config)')
      .eq('token', token)
      .single();
    if (error || !invite) return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    const now = new Date();
    if (new Date(invite.expires_at) < now || invite.status === 'revoked') return NextResponse.json({ error: "Expired or revoked" }, { status: 410 });
    if (!invite.first_opened_at) {
      await supabase.from('assessment_invites').update({ first_opened_at: now.toISOString(), status: 'opened' }).eq('id', invite.id);
    } else {
      await supabase.from('assessment_invites').update({ last_opened_at: now.toISOString() }).eq('id', invite.id);
    }
    return NextResponse.json({
      campaignTitle: invite.assessment_campaigns.title,
      campaignId: invite.campaign_id,
      assignmentId: invite.assignment_id,
      config: invite.assessment_campaign_configs?.config,
      due_at: invite.assessment_assignments?.due_at || null
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


