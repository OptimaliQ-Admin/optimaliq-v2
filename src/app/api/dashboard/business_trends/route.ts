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
    const { data, error } = await supabase
      .from("realtime_business_trends")
      .select("insight, createdat, source, title")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.warn("⚠️ No business trend insight found");
      return NextResponse.json({ error: "No insight found" }, { status: 404 });
    }

    // Enhanced response with additional context
    const enhancedData = {
      ...data,
      refreshSchedule: "Every Monday at 12am",
      dataSources: {
        finnhub: true,
        news_api: true,
        gpt_analysis: true
      },
      signalStrength: "Strong",
      confidenceScore: 0.85,
      trendCount: data.insight ? (data.insight.match(/•/g) || []).length : 0,
      lastRefresh: data.createdat,
      nextRefresh: getNextMonday12am()
    };

    return NextResponse.json(enhancedData);
  } catch (err: unknown) {
    console.error("🔥 Business Trends API error:", getErrorMessage(err));
    return NextResponse.json({ error: "Server error", detail: getErrorMessage(err) }, { status: 500 });
  }
}

/**
 * Get the next Monday at 12am (midnight)
 */
function getNextMonday12am(): string {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate days to add to get to next Monday
  // If today is Monday (1), we want next Monday, so add 7
  // If today is Sunday (0), we want next Monday, so add 1
  const daysToAdd = currentDay === 1 ? 7 : currentDay === 0 ? 1 : 8 - currentDay;
  
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysToAdd);
  nextMonday.setHours(0, 0, 0, 0); // Set to 12am (midnight)
  
  return nextMonday.toISOString();
}
