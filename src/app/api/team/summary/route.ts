import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const u_id = req.nextUrl.searchParams.get('u_id');
  if (!u_id) return NextResponse.json({ error: 'u_id is required' }, { status: 400 });
  const { data: profile } = await supabase.from('tier2_profiles').select('organization_id, role').eq('u_id', u_id).single();
  const org_id = (profile as any)?.organization_id ?? null;
  const role = (profile as any)?.role ?? 'owner';
  if (!org_id) return NextResponse.json({ error: 'organization not configured' }, { status: 400 });

  // Aggregate summary using base tables
  const { data: scores } = await supabase
    .from('assessment_scoring_results')
    .select('overall_score, assignment_id, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);
  const { data: assignments } = await supabase
    .from('assessment_assignments')
    .select('id, campaign_id, status')
    .eq('org_id', org_id);
  const { data: campaigns } = await supabase
    .from('assessment_campaigns')
    .select('id, type_slug, created_at')
    .eq('org_id', org_id);

  // Rollup
  const byType: Record<string, { avg: number; count: number }> = {};
  const assignmentMap = new Map((assignments||[]).map(a => [a.id, a]));
  const campaignMap = new Map((campaigns||[]).map(c => [c.id, c]));
  for (const s of scores || []) {
    const asg = assignmentMap.get(s.assignment_id);
    if (!asg) continue;
    const camp = campaignMap.get(asg.campaign_id);
    if (!camp) continue;
    const key = camp.type_slug || 'unknown';
    const bucket = byType[key] || { avg: 0, count: 0 };
    bucket.avg = (bucket.avg * bucket.count + (s.overall_score || 0)) / (bucket.count + 1);
    bucket.count += 1;
    byType[key] = bucket;
  }
  return NextResponse.json({ byType, role });
}


