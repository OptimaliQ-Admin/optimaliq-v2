import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const campaign_id = req.nextUrl.searchParams.get("campaign_id");
  if (!campaign_id) return NextResponse.json({ error: "campaign_id is required" }, { status: 400 });
  const { data, error } = await supabase
    .from("assessment_assignments")
    .select("*")
    .eq("campaign_id", campaign_id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assignments: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  try {
    const { campaign_id, assignee_u_id, due_at } = await req.json();
    if (!campaign_id || !assignee_u_id) return NextResponse.json({ error: "campaign_id, assignee_u_id required" }, { status: 400 });
    // inherit org_id from campaign
    const { data: camp } = await supabase.from('assessment_campaigns').select('org_id').eq('id', campaign_id).single();
    const { data, error } = await supabase
      .from("assessment_assignments")
      .insert({ campaign_id, assignee_u_id, due_at, status: "pending", org_id: (camp as any)?.org_id ?? null })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ assignment: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE: unassign pending assignment
export async function DELETE(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  // Only allow delete when assignment is not completed/submitted
  const { data: asg } = await supabase.from('assessment_assignments').select('status').eq('id', id).single();
  if ((asg as any)?.status && (asg as any).status !== 'pending' && (asg as any).status !== 'in_progress') {
    return NextResponse.json({ error: 'Only pending/in_progress assignments can be unassigned' }, { status: 400 });
  }
  const { error } = await supabase.from('assessment_assignments').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}


