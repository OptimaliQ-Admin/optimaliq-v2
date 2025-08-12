import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateScore } from "@/lib/scoring/calculateScore";
import { scoreCustomAssessment } from "@/lib/ai/custom/scoreCustom";

export async function POST(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  try {
    const { token, answers } = await req.json();
    if (!token || !answers) return NextResponse.json({ error: "token and answers required" }, { status: 400 });
    // fetch invite, campaign config and assignment
    const { data: invite, error } = await supabase
      .from('assessment_invites')
      .select('id, token, campaign_id, assignment_id, invite_email, expires_at, status, assessment_campaign_configs!assessment_campaign_configs_campaign_id_fkey(config), assessment_assignments:assignment_id(due_at)')
      .eq('token', token)
      .single();
    if (error || !invite) return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    if (new Date(invite.expires_at) < new Date() || invite.status === 'revoked') return NextResponse.json({ error: "Expired or revoked" }, { status: 410 });

    const cfgJoin: any = (invite as any).assessment_campaign_configs;
    const config = Array.isArray(cfgJoin) ? cfgJoin[0]?.config : cfgJoin?.config;
    if (!config) return NextResponse.json({ error: "Missing campaign config" }, { status: 500 });

    // compute score using universal path
    // Decide path: if config has weights/known template => deterministic; else use AI custom scoring
    let score = 0;
    let short_insights: any = null;
    if (config?.weights || config?.type === 'template') {
      score = calculateScore(answers, 3.0, config);
    } else {
      const ai = await scoreCustomAssessment({ topic: config?.topic || 'Custom', questions: config?.questions || [], answers });
      if (ai) {
        score = ai.overall_score;
        short_insights = {
          summary: ai.summary,
          key_strengths: ai.key_strengths,
          areas_for_improvement: ai.areas_for_improvement,
          confidence: ai.confidence
        };
      } else {
        score = calculateScore(answers, 3.0, config);
      }
    }

    // submission record
    const { data: submission, error: subErr } = await supabase
      .from('assessment_submissions')
      .insert({ assignment_id: invite.assignment_id, submitted_by: null, status: 'submitted' })
      .select('*')
      .single();
    if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

    // responses
    const rows = (config.questions || []).map((q: any) => ({ submission_id: submission.id, question_key: q.key, value_json: answers[q.key] ?? null }));
    if (rows.length) await supabase.from('question_responses').insert(rows);

    // scoring results (assignment-linked)
    await supabase.from('assessment_scoring_results').insert({ assignment_id: invite.assignment_id, user_id: null, overall_score: score, short_insights });

    // update assignment/invite status
    await supabase.from('assessment_assignments').update({ status: 'completed' }).eq('id', invite.assignment_id);
    await supabase.from('assessment_invites').update({ status: 'completed' }).eq('id', invite.id);

    return NextResponse.json({ score });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


