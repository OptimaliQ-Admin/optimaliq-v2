import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("realtime_business_trends")
      .select("insight, createdat")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.warn("⚠️ No business trend insight found");
      return NextResponse.json({ error: "No insight found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("🔥 Business Trends API error:", err.message);
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}
