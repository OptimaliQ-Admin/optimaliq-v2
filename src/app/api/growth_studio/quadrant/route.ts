// src/app/api/growth_studio/quadrant/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getErrorMessage } from "@/utils/errorHandler";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json({ error: "u_id is required" }, { status: 400 });
    }

    // ✅ Fetch all dummy company quadrant data
const { data: companies, error: companiesError } = await supabase
.from("growth_quadrant_data")
.select("label, strategy_score, process_score, technology_score, overall_score");

if (companiesError) {
console.error("❌ Failed to fetch quadrant data:", companiesError);
return NextResponse.json({ error: "Failed to fetch quadrant data" }, { status: 500 });
}

// ✅ Fetch current user's insight scores
const { data: userData, error: userError } = await supabase
.from("tier2_dashboard_insights")
.select("strategy_score, process_score, technology_score, overall_score")
.eq("u_id", u_id)
.single();

if (userError || !userData) {
console.error("❌ Failed to fetch user data:", userError);
return NextResponse.json({ error: "User data not found" }, { status: 404 });
}

return NextResponse.json({
companies,
user: {
  strategy_score: userData.strategy_score,
  process_score: userData.process_score,
  technology_score: userData.technology_score,
  score: userData.overall_score,
},
});
  } catch (err: unknown) {
    console.error("🔥 Unexpected error in quadrant API:", err);
    return NextResponse.json({ error: getErrorMessage(err) || "Unknown error" }, { status: 500 });
  }
}
