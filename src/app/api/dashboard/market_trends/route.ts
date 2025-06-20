//src/app/api/dashboard/market_trends/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const industry = (searchParams.get("industry") ?? "other").trim().toLowerCase();

  console.log("🔎 Requested industry insight for:", industry);

  // Try exact match first
  let { data, error } = await supabase
    .from("realtime_market_trends")
    .select("insight, createdat")
    .eq("industry", industry)
    .order("createdat", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If no exact match, try case-insensitive match
  if (error || !data) {
    console.log("🔍 Trying case-insensitive match for:", industry);
    const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
      .from("realtime_market_trends")
      .select("insight, createdat")
      .ilike("industry", industry)
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (caseInsensitiveData) {
      data = caseInsensitiveData;
      error = null;
    }
  }

  // If still no match, try to get any recent insight as fallback
  if (error || !data) {
    console.log("🔍 Trying fallback to any recent insight");
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("realtime_market_trends")
      .select("insight, createdat")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (fallbackData) {
      data = fallbackData;
      error = null;
      console.log("✅ Using fallback insight");
    }
  }

  if (error || !data) {
    console.warn("⚠️ No insight found for:", industry);
    return NextResponse.json({ error: "No insight found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
