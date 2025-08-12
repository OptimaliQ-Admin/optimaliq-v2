import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(_req: Request, context: { params: { id: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const id = context.params.id;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data: assignments } = await supabase
    .from('assessment_assignments')
    .select('id, status')
    .eq('campaign_id', id);
  const assnIds = (assignments || []).map(a => a.id);
  if (assnIds.length === 0) return NextResponse.json({ insights: [], avg: null });

  const { data: scores } = await supabase
    .from('assessment_scoring_results')
    .select('assignment_id, overall_score, short_insights')
    .in('assignment_id', assnIds);

  const insights = (scores || []).map(s => ({
    assignment_id: s.assignment_id,
    overall_score: s.overall_score,
    summary: (s.short_insights as any)?.summary || null,
    key_strengths: (s.short_insights as any)?.key_strengths || [],
    areas_for_improvement: (s.short_insights as any)?.areas_for_improvement || []
  }));
  const avg = insights.length ? insights.reduce((a, b) => a + (b.overall_score || 0), 0) / insights.length : null;
  return NextResponse.json({ insights, avg });
}


