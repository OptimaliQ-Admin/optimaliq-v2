import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// GET /api/team/people?u_id=owner
export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const u_id = req.nextUrl.searchParams.get("u_id");
  if (!u_id) return NextResponse.json({ error: "u_id is required" }, { status: 400 });
  // Look up owner's org_id from profile if available; fallback to created_by filter
  const { data: profile } = await supabase.from("tier2_profiles").select("organization_id").eq("u_id", u_id).single();
  const org_id = (profile as any)?.organization_id ?? null;
  let query = supabase.from("team_people").select("*").order("created_at", { ascending: false });
  if (org_id) {
    query = query.eq("org_id", org_id);
  } else {
    query = query.eq("created_by", u_id);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ people: data ?? [] });
}

// POST { u_id, first_name, last_name, email, department, title }
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  try {
    const body = await req.json();
    const { u_id, first_name, last_name, email, department, title } = body;
    if (!u_id || !first_name || !last_name || !email) {
      return NextResponse.json({ error: "u_id, first_name, last_name, email required" }, { status: 400 });
    }
    const { data: profile } = await supabase.from("tier2_profiles").select("organization_id").eq("u_id", u_id).single();
    const org_id = (profile as any)?.organization_id ?? null;
    const insertRow: any = { created_by: u_id, first_name, last_name, email, department: department ?? null, title: title ?? null, status: 'active' };
    if (org_id) insertRow.org_id = org_id;
    const { data, error } = await supabase.from("team_people").insert(insertRow).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ person: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH { id, u_id, ...fields }
export async function PATCH(req: NextRequest) {
  const supabase = getSupabase();
  try {
    const body = await req.json();
    const { id, u_id, ...updates } = body;
    if (!id || !u_id) return NextResponse.json({ error: "id and u_id required" }, { status: 400 });
    const { data: profile } = await supabase.from("tier2_profiles").select("organization_id").eq("u_id", u_id).single();
    const org_id = (profile as any)?.organization_id ?? null;
    let query = supabase.from("team_people").update(updates).eq("id", id);
    if (org_id) query = query.eq("org_id", org_id); else query = query.eq("created_by", u_id);
    const { data, error } = await query.select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ person: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/team/people?id=...&u_id=...
export async function DELETE(req: NextRequest) {
  const supabase = getSupabase();
  const id = req.nextUrl.searchParams.get("id");
  const u_id = req.nextUrl.searchParams.get("u_id");
  if (!id || !u_id) return NextResponse.json({ error: "id and u_id required" }, { status: 400 });
  const { data: profile } = await supabase.from("tier2_profiles").select("organization_id").eq("u_id", u_id).single();
  const org_id = (profile as any)?.organization_id ?? null;
  // Soft delete
  let query = supabase.from("team_people").update({ status: 'inactive' }).eq("id", id);
  if (org_id) query = query.eq("org_id", org_id); else query = query.eq("created_by", u_id);
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}


