//src/app/api/dashboard/market_trends/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { searchParams } = new URL(req.url);
  const industry = (searchParams.get("industry") ?? "other").trim().toLowerCase();

  console.log("🔎 Requested industry insight for:", industry);

  // Try exact match first for AI-generated insights
  let { data: aiInsights, error: aiError } = await supabase
    .from("realtime_market_trends")
    .select("insight, createdat")
    .eq("industry", industry)
    .order("createdat", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If no exact match, try case-insensitive match
  if (aiError || !aiInsights) {
    console.log("🔍 Trying case-insensitive match for:", industry);
    const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
      .from("realtime_market_trends")
      .select("insight, createdat")
      .ilike("industry", industry)
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (caseInsensitiveData) {
      aiInsights = caseInsensitiveData;
      aiError = null;
    }
  }

  // If still no match, try to get any recent insight as fallback
  if (aiError || !aiInsights) {
    console.log("🔍 Trying fallback to any recent insight");
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("realtime_market_trends")
      .select("insight, createdat")
      .order("createdat", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (fallbackData) {
      aiInsights = fallbackData;
      aiError = null;
      console.log("✅ Using fallback insight");
    }
  }

  // Fetch cron-generated market trend summary
  const { data: cronTrends, error: cronError } = await supabase
    .from("realtime_market_trends")
    .select("insight, createdat")
    .order("createdat", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (aiError && cronError) {
    console.warn("⚠️ No market trend insights found for:", industry);
    return NextResponse.json({ error: "No insights found" }, { status: 404 });
  }

  // Combine the data
  const response = {
    aiInsights: aiInsights || null,
    cronTrends: cronTrends || null,
    industry: industry,
    lastUpdated: aiInsights?.createdat || cronTrends?.createdat
  };

  return NextResponse.json(response);
}

// ✅ NEW: POST method to handle cron refresh server-side
export async function POST(req: Request) {
  try {
    const { industry, forceRefresh } = await req.json();
    
    // Only trigger cron if forceRefresh is true
    if (forceRefresh) {
      console.log("🔄 Triggering market insight refresh for:", industry);
      
      // ✅ SECURITY FIX: Server-side cron call with proper secret
      const cronResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai'}/api/cron/generateMarketInsight`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`, // Server-side only
        },
      });
      
      if (!cronResponse.ok) {
        console.warn("⚠️ Failed to trigger market insight refresh");
      } else {
        console.log("✅ Market insight refresh triggered successfully");
      }
    }
    
    // Return success response
    return NextResponse.json({ success: true, refreshed: forceRefresh });
    
  } catch (error) {
    console.error("❌ Error in market trends POST:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
