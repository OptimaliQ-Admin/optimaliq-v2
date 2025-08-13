import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateRequiredFields } from "@/lib/auth/apiAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const validation = validateRequiredFields(body, ['u_id']);
    if (!validation.valid) {
      return NextResponse.json({ 
        error: "Missing required fields", 
        missingFields: validation.missingFields 
      }, { status: 400 });
    }

    const { u_id } = body;

    // Use service role client because growth-assessment flow is unauthenticated
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch insights - RLS will ensure user can only access their own data
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