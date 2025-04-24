//src/app/api/tier2/dashboard/insight/market_trends/route.ts
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

  const { data, error } = await supabase
    .from("realtime_market_trends")
    .select("insight, createdat")
    .eq("industry", industry)
    .order("createdat", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.warn("⚠️ No insight found for:", industry);
    return NextResponse.json({ error: "No insight found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
