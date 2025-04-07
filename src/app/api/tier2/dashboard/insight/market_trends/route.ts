import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("realtime_market_trends")
    .select("insight, createdat")
    .order("createdat", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("❌ Supabase fetch error:", error);
    return NextResponse.json({ error: "Failed to load insight" }, { status: 500 });
  }

  return NextResponse.json(data);
}
