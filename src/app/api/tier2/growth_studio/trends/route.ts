// File: src/app/api/tier2/growth_studio/trends/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("realtime_strategic_trends")
      .select("gpt_summary, created_at")
      .eq("archived", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("❌ Failed to fetch strategic trend:", error);
      return NextResponse.json({ error: "No insights found" }, { status: 404 });
    }

    return NextResponse.json({
      insight: data.gpt_summary,
      createdat: data.created_at,
    });
  } catch (err: any) {
    console.error("🚨 Error in trends endpoint:", err);
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
