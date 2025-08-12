import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generatePulseConfig } from "@/lib/ai/generatePulseConfig";
import { createInviteToken } from "@/lib/security/tokens";
import { randomUUID } from "node:crypto";
import { resend } from "@/lib/resend";
import { emailService } from "@/lib/emailService";

function getDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function POST(req: NextRequest) {
  const supabase = getDb();
  try {
    const { owner_u_id, type = 'pulse', topic, participant_emails = [], due_at = null } = await req.json();
    if (!owner_u_id || !topic || !Array.isArray(participant_emails) || participant_emails.length === 0) {
      return NextResponse.json({ error: "owner_u_id, topic, participant_emails[] required" }, { status: 400 });
    }

    // Build question set via AI
    const config = await generatePulseConfig({ topic });

    // Org scoping
    const { data: profile } = await supabase.from('tier2_profiles').select('organization_id').eq('u_id', owner_u_id).single();
    const org_id = (profile as any)?.organization_id ?? null;

    // Create campaign
    const { data: campaign, error: campErr } = await supabase
      .from('assessment_campaigns')
      .insert({ owner_u_id, type_slug: 'custom_'+type, title: `${topic} Pulse`, due_at, status: 'active', org_id })
      .select('*')
      .single();
    if (campErr) return NextResponse.json({ error: campErr.message }, { status: 500 });

    // Persist config
    const { error: cfgErr } = await supabase
      .from('assessment_campaign_configs')
      .insert({ campaign_id: campaign.id, config: { type, topic, questions: config.questions } });
    if (cfgErr) return NextResponse.json({ error: cfgErr.message }, { status: 500 });

    // Create assignments + invites
    const inviteUrls: Array<{ email: string; url: string }> = [];
    // Fetch inviter/org context for template email
    const { data: ownerUser } = await supabase.from('users').select('email').eq('id', owner_u_id).single();
    const { data: org } = org_id ? await supabase.from('organizations').select('name').eq('id', org_id).single() : { data: null } as any;
    const inviterName = (ownerUser as any)?.email?.split('@')[0] || 'OptimaliQ';
    const inviterCompany = (org as any)?.name || 'OptimaliQ';
    const assessmentDescription = `Custom ${type === 'pulse' ? 'Pulse' : 'Assessment'}: ${topic}`;

    for (const email of participant_emails) {
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
      const url = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXT_PUBLIC_APP_URL || "https://optimaliq.ai")}/delegate/a?token=${encodeURIComponent(token)}`;
      inviteUrls.push({ email, url });
    }

    return NextResponse.json({ campaignId: campaign.id, created: participant_emails.length, inviteUrls });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


