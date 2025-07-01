import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const assessmentData = await req.json();

    if (!assessmentData.u_id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // Save assessment data using service role client
    const { error: upsertError } = await supabase
      .from("growth_assessment")
      .upsert([assessmentData], { onConflict: "u_id" });

    if (upsertError) {
      console.error("❌ Error saving assessment:", upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 