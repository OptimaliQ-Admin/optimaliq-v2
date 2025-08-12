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

    // Cooldown/resend based on completion within last 30 days and active invites
    const nowIso = new Date().toISOString();
    const THIRTY_DAYS_AGO = new Date(Date.now() - 30*24*60*60*1000).toISOString();
    const { data: templateCampaigns } = await supabase
      .from('assessment_campaigns')
      .select('id')
      .eq('type_slug', type_slug)
      .eq(org_id ? 'org_id' : 'owner_u_id', org_id ?? owner_u_id);
    const campIds = (templateCampaigns || []).map((c: any) => c.id);
    const { data: prior } = campIds.length ? await supabase
      .from('assessment_invites')
      .select('invite_email, token, status, expires_at, assignment_id, assessment_assignments:assignment_id(status, updated_at)')
      .in('campaign_id', campIds)
      .in('invite_email', participant_emails) : { data: [] as any[] };
    const blocked = new Set<string>();
    const blockedInfo: Array<{ email: string; lastCompletedAt: string }> = [];
    const activeMap = new Map<string, string>();
    for (const row of (prior || [])) {
      const asg = (row as any).assessment_assignments;
      if (asg?.status === 'completed' && asg.updated_at && asg.updated_at > THIRTY_DAYS_AGO) {
        if (!blocked.has(row.invite_email)) {
          blocked.add(row.invite_email);
          blockedInfo.push({ email: row.invite_email, lastCompletedAt: asg.updated_at });
        }
        continue;
      }
      if ((row.status === 'sent' || row.status === 'opened') && row.expires_at > nowIso) {
        if (!activeMap.has(row.invite_email)) activeMap.set(row.invite_email, row.token);
      }
    }
    const toResend = participant_emails.filter(e => activeMap.has(e) && !blocked.has(e));
    const toCreate = participant_emails.filter(e => !activeMap.has(e) && !blocked.has(e));

    if (toResend.length === 0 && toCreate.length === 0) {
      return NextResponse.json({ campaignId: null, created: 0, resent: 0, blocked: Array.from(blocked), blockedInfo, inviteUrls: [] });
    }

    // Create campaign/config only for new assignments
    let campaign: any = null;
    if (toCreate.length > 0) {
      const { data: c, error: campErr } = await supabase
        .from('assessment_campaigns')
        .insert({ owner_u_id, type_slug, title: `${type_slug.toUpperCase()} Assessment`, due_at, status: 'active', org_id })
        .select('*')
        .single();
      if (campErr) return NextResponse.json({ error: campErr.message }, { status: 500 });
      campaign = c;
      const { error: cfgErr } = await supabase
        .from('assessment_campaign_configs')
        .insert({ campaign_id: campaign.id, config: { type: 'template', template_slug: type_slug } });
      if (cfgErr) return NextResponse.json({ error: cfgErr.message }, { status: 500 });
    }

    let resent = 0;
    let created = 0;
    const inviteUrls: Array<{ email: string; url: string }> = [];
    // Email template context
    const { data: ownerUser } = await supabase.from('users').select('email').eq('id', owner_u_id).single();
    const { data: org } = org_id ? await supabase.from('organizations').select('name').eq('id', org_id).single() : { data: null } as any;
    const inviterName = (ownerUser as any)?.email?.split('@')[0] || 'OptimaliQ';
    const inviterCompany = (org as any)?.name || 'OptimaliQ';
    const assessmentDescription = 'Please complete this assessment to help improve capabilities.';

    // Resend existing active
    for (const email of toResend) {
      const token = activeMap.get(email)!;
      if (resend) {
        const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXT_PUBLIC_APP_URL || 'https://optimaliq.ai');
        const invitationUrl = `${base}/delegate/a?token=${encodeURIComponent(token)}`;
        await emailService.sendAssessmentInvitationEmail({
          to: email,
          firstName: (email || '').split('@')[0] || 'there',
          inviterName,
          inviterCompany,
          assessmentTitle: `${type_slug.toUpperCase()} Assessment`,
          assessmentDescription,
          invitationUrl,
          expiresAt: new Date(Date.now() + 14*24*60*60*1000).toISOString(),
        });
      }
      inviteUrls.push({ email, url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXT_PUBLIC_APP_URL || 'https://optimaliq.ai')}/delegate/a?token=${encodeURIComponent(token)}` });
      resent++;
    }

    // Create new
    for (const email of toCreate) {
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
        const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXT_PUBLIC_APP_URL || 'https://optimaliq.ai');
        const invitationUrl = `${base}/delegate/a?token=${encodeURIComponent(token)}`;
        await emailService.sendAssessmentInvitationEmail({
          to: email,
          firstName: (email || '').split('@')[0] || 'there',
          inviterName,
          inviterCompany,
          assessmentTitle: campaign.title,
          assessmentDescription,
          invitationUrl,
          expiresAt: expiresAt.toISOString(),
        });
      }
      created++;
      const url = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXT_PUBLIC_APP_URL || "https://optimaliq.ai")}/delegate/a?token=${encodeURIComponent(token)}`;
      inviteUrls.push({ email, url });
    }

    return NextResponse.json({ campaignId: campaign?.id || null, created, resent, blocked: Array.from(blocked), blockedInfo, inviteUrls });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


