// File: /src/app/api/tier2/growth_studio/quadrant/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    // ✅ Fetch all dummy company quadrant data
const { data: companies, error: companiesError } = await supabase
.from("growth_quadrant_data")
.select("label, strategyScore, processScore, technologyScore, score");

if (companiesError) {
console.error("❌ Failed to fetch quadrant data:", companiesError);
return NextResponse.json({ error: "Failed to fetch quadrant data" }, { status: 500 });
}

// ✅ Fetch current user's insight scores
const { data: userData, error: userError } = await supabase
.from("tier2_dashboard_insights")
.select("strategyScore, processScore, technologyScore, score")
.eq("u_id", user_id)
.single();

if (userError || !userData) {
console.error("❌ Failed to fetch user data:", userError);
return NextResponse.json({ error: "User data not found" }, { status: 404 });
}

return NextResponse.json({
companies,
user: {
  strategyScore: userData.strategyScore,
  processScore: userData.processScore,
  technologyScore: userData.technologyScore,
  score: userData.score,
},
});
  } catch (err: any) {
    console.error("🔥 Unexpected error in quadrant API:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
