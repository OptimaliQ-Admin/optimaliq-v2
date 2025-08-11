import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const u_id = req.nextUrl.searchParams.get("u_id");
  if (!u_id) return NextResponse.json({ error: "u_id is required" }, { status: 400 });
  const { data, error } = await supabase
    .from("assessment_campaigns")
    .select("*")
    .eq("owner_u_id", u_id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  try {
    const { owner_u_id, type_slug, title, starts_at, due_at } = await req.json();
    if (!owner_u_id || !type_slug || !title) {
      return NextResponse.json({ error: "owner_u_id, type_slug, title required" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("assessment_campaigns")
      .insert({ owner_u_id, type_slug, title, starts_at, due_at, status: "active" })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ campaign: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


