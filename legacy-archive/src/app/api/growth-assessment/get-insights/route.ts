import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json({ error: "Missing User ID in request" }, { status: 400 });
    }

    // Fetch insights using service role client
    const { data, error } = await supabase
      .from("growth_insights")
      .select("strategy_score, strategy_insight, process_score, process_insight, technology_score, technology_insight, overall_score")
      .eq("u_id", u_id)
      .order("generatedat", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("❌ Error fetching insights:", error);
      return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "No insights found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 