//src/app/api/dashboard/marketing_playbook/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getErrorMessage } from "@/utils/errorHandler";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { data, error } = await supabase
      .from("realtime_marketing_playbook")
      .select("*")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error("❌ No marketing playbook found:", error);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Enhanced response with additional context
    const enhancedData = {
      ...data,
      refreshSchedule: "Every Monday at 12am",
      dataSources: {
        hubspot: true,
        adweek: true,
        marketing_dive: true,
        social_media_examiner: true,
        content_marketing_institute: true,
        linkedin: true,
        marketing_land: true,
        martech: true
      },
      signalStrength: "Strong",
      confidenceScore: 0.82,
      trendCount: data.insight ? (data.insight.match(/🔥|🎯/g) || []).length : 0,
      lastRefresh: data.createdat,
      nextRefresh: getNextMonday12am(),
      sourceUrls: [
        "https://www.hubspot.com/hubfs/2025%20State%20of%20Marketing%20from%20HubSpot.pdf",
        "https://www.adweek.com/category/marketing/",
        "https://www.marketingdive.com/",
        "https://www.socialmediaexaminer.com/",
        "https://www.contentmarketinginstitute.com/blog/"
      ]
    };

    return NextResponse.json(enhancedData);
  } catch (err: unknown) {
    console.error("🔥 Error fetching marketing playbook:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
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
