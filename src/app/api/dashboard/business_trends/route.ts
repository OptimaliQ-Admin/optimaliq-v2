//src/app/api/dashboard/business_trends/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { getErrorMessage } from "@/utils/errorHandler";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    // Fetch AI-generated business trends
    const { data: aiTrends, error: aiError } = await supabase
      .from("realtime_business_trends")
      .select("insight, createdat")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fetch cron-generated business trend summary
    const { data: cronTrends, error: cronError } = await supabase
      .from("realtime_business_trends")
      .select("insight, createdat")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (aiError && cronError) {
      console.warn("⚠️ No business trend insights found");
      return NextResponse.json({ error: "No insights found" }, { status: 404 });
    }

    // Combine the data
    const response = {
      aiTrends: aiTrends || null,
      cronTrends: cronTrends || null,
      lastUpdated: aiTrends?.createdat || cronTrends?.createdat
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    console.error("🔥 Business Trends API error:", getErrorMessage(err));
    return NextResponse.json({ error: "Server error", detail: getErrorMessage(err) }, { status: 500 });
  }
}
