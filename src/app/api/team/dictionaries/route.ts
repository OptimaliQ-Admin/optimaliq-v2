import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const u_id = req.nextUrl.searchParams.get('u_id');
  if (!u_id) return NextResponse.json({ error: 'u_id is required' }, { status: 400 });

  // Placeholder for future org-specific dictionaries
  const departments = ["Operations","Sales","Marketing","Engineering","Finance","HR","Customer Success","Product"];
  const titles = ["Associate","Manager","Director","VP","C-Level","Analyst","Specialist","Lead"];

  return NextResponse.json({ departments, titles });
}


