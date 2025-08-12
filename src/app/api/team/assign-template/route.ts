import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createInviteToken } from "@/lib/security/tokens";
import { resend } from "@/lib/resend";
import { emailService } from "@/lib/emailService";
import { randomUUID } from "node:crypto";

export async function POST(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  try {
    const { owner_u_id, type_slug, participant_emails = [], due_at = null } = await req.json();
    if (!owner_u_id || !type_slug || !Array.isArray(participant_emails) || participant_emails.length === 0) {
      return NextResponse.json({ error: "owner_u_id, type_slug, participant_emails[] required" }, { status: 400 });
    }

    // org
    const { data: profile } = await supabase.from('tier2_profiles').select('organization_id').eq('u_id', owner_u_id).single();
    const org_id = (profile as any)?.organization_id ?? null;

    // Cooldown check: recent invites for same type within 30 days
    const THIRTY_DAYS_AGO = new Date(Date.now() - 30*24*60*60*1000).toISOString();
    const { data: recentInvites } = await supabase
      .from('assessment_invites')
      .select('invite_email, created_at, assessment_campaigns:campaign_id(type_slug)')
      .in('invite_email', participant_emails)
      .gt('created_at', THIRTY_DAYS_AGO);
    const blocked = new Set<string>();
    (recentInvites || []).forEach((inv: any) => {
      if (inv.assessment_campaigns?.type_slug === type_slug) blocked.add(inv.invite_email);
    });
    const toAssign = participant_emails.filter(e => !blocked.has(e));

    // Create campaign
    const { data: campaign, error: campErr } = await supabase
      .from('assessment_campaigns')
      .insert({ owner_u_id, type_slug, title: `${type_slug.toUpperCase()} Assessment`, due_at, status: 'active', org_id })
      .select('*')
      .single();
    if (campErr) return NextResponse.json({ error: campErr.message }, { status: 500 });

    // Config (template tag)
    const { error: cfgErr } = await supabase
      .from('assessment_campaign_configs')
      .insert({ campaign_id: campaign.id, config: { type: 'template', template_slug: type_slug } });
    if (cfgErr) return NextResponse.json({ error: cfgErr.message }, { status: 500 });

    // Assign + invite
    let created = 0;
    const inviteUrls: Array<{ email: string; url: string }> = [];
    // Email template context
    const { data: ownerUser } = await supabase.from('users').select('email').eq('id', owner_u_id).single();
    const { data: org } = org_id ? await supabase.from('organizations').select('name').eq('id', org_id).single() : { data: null } as any;
    const inviterName = (ownerUser as any)?.email?.split('@')[0] || 'OptimaliQ';
    const inviterCompany = (org as any)?.name || 'OptimaliQ';
    const assessmentDescription = 'Please complete this assessment to help improve capabilities.';

    for (const email of toAssign) {
      const { data: assignment, error: asgErr } = await supabase
        .from('assessment_assignments')
        .insert({ campaign_id: campaign.id, assignee_u_id: randomUUID(), due_at, status: 'pending', org_id })
        .select('*')
        .single();
      if (asgErr) return NextResponse.json({ error: asgErr.message }, { status: 500 });
      const { token, expiresAt } = createInviteToken({ campaignId: campaign.id, assignmentId: assignment.id, email });
      const { error: invErr } = await supabase
        .from('assessment_invites')
        .insert({ campaign_id: campaign.id, assignment_id: assignment.id, invite_email: email, invite_name: null, token, expires_at: expiresAt.toISOString(), status: 'sent' });
      if (invErr) return NextResponse.json({ error: invErr.message }, { status: 500 });
      if (resend) {
        const base = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://optimaliq.ai');
        const invitationUrl = `${base}/delegate/a/${token}`;
        await emailService.sendAssessmentInvitationEmail({
          to: email,
          inviterName,
          inviterCompany,
          assessmentTitle: campaign.title,
          assessmentDescription,
          invitationUrl,
          expiresAt: expiresAt.toISOString(),
        });
      }
      created++;
      const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://optimaliq.ai"}/delegate/a/${token}`;
      inviteUrls.push({ email, url });
    }

    return NextResponse.json({ campaignId: campaign.id, created, blocked: Array.from(blocked), inviteUrls });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


