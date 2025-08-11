import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const u_id = req.nextUrl.searchParams.get("u_id");
  if (!u_id) return NextResponse.json({ error: "u_id is required" }, { status: 400 });
  const { data, error } = await supabase
    .from("mv_team_assessment_progress")
    .select("*")
    .eq("owner_u_id", u_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ progress: data ?? [] });
}


