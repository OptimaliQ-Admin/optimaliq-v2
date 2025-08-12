import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const u_id = req.nextUrl.searchParams.get('u_id');
  if (!u_id) return NextResponse.json({ error: 'u_id is required' }, { status: 400 });
  const { data: profile } = await supabase.from('tier2_profiles').select('organization_id').eq('u_id', u_id).single();
  const org_id = (profile as any)?.organization_id ?? null;

  // Fetch campaigns for org/owner (exclude custom/pulse type_slugs)
  const { data: campaigns } = await supabase
    .from('assessment_campaigns')
    .select('id, title, type_slug, created_at')
    .eq(org_id ? 'org_id' : 'owner_u_id', org_id ?? u_id)
    .order('created_at', { ascending: false });

  const ids = (campaigns || [])
    .filter(c => !String(c.type_slug || '').startsWith('custom_'))
    .map(c => c.id);
  if (ids.length === 0) return NextResponse.json({ invitations: [] });

  // Join invites + assignments; include status and updated_at for completion date
  const { data: invites } = await supabase
    .from('assessment_invites')
    .select('id, invite_email, invite_name, status, created_at, campaign_id, assignment_id, assessment_assignments:assignment_id(status, updated_at)')
    .in('campaign_id', ids)
    .order('created_at', { ascending: false });

  // Map campaign info
  const byId = new Map((campaigns||[]).map(c => [c.id, c]));
  const rows = (invites || []).map((inv: any) => {
    const camp = byId.get(inv.campaign_id);
    const asg = inv.assessment_assignments;
    const completedAt = asg?.status === 'completed' ? asg.updated_at : null;
    return {
      id: inv.id,
      campaignId: inv.campaign_id,
      assessment: camp?.title || 'Assessment',
      type_slug: camp?.type_slug || null,
      assignment_id: inv.assignment_id,
      assignedTo: inv.invite_email,
      status: asg?.status || inv.status,
      created_at: inv.created_at,
      completed_at: completedAt,
    };
  });

  return NextResponse.json({ invitations: rows });
}


