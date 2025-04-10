// File: /src/app/api/growth/trends/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("growth_studio_trends")
      .select("*")
      .order("createdat", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.error("❌ Failed to fetch trend insight:", error?.message);
      return NextResponse.json({ error: "No trend insight available." }, { status: 404 });
    }

    return NextResponse.json({
      insight: data.insight,
      source: data.source,
      createdat: data.createdat,
    });
  } catch (err: any) {
    console.error("🔥 Unexpected error:", err.message);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
