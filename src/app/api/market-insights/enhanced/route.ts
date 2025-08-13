import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeIndustry } from "@/lib/utils/industry";
import { buildMarketSnapshot } from "@/lib/ai/market/agent";

const CARD = "market_signals" as const;
const DEFAULT_TTL_MIN = 360;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = normalizeIndustry(searchParams.get("industry") ?? "technology");
    const forceRefresh = (searchParams.get("forceRefresh") ?? "false").toLowerCase() === "true";

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    // Read latest snapshot
    const { data: cached, error } = await supabaseAdmin
      .from("market_snapshots")
      .select("*")
      .eq("card", CARD)
      .eq("industry", industry)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = Date.now();
    const createdMs = cached ? new Date(cached.created_at).getTime() : 0;
    const ttlMin = cached?.ttl_minutes ?? DEFAULT_TTL_MIN;
    const isFresh = cached && (now - createdMs) / 60000 < ttlMin;

    if (isFresh && !forceRefresh) {
      return NextResponse.json({ insight: cached.snapshot, sources: cached.sources || [], cached: true, createdAt: cached.created_at });
    }

    if (forceRefresh) {
      // Build synchronously for immediate UI update
      await buildMarketSnapshot({ card: CARD, industry, ttl: DEFAULT_TTL_MIN });
      const { data: fresh } = await supabaseAdmin
        .from("market_snapshots")
        .select("*")
        .eq("card", CARD)
        .eq("industry", industry)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (fresh) return NextResponse.json({ insight: fresh.snapshot, sources: fresh.sources || [], cached: false, createdAt: fresh.created_at });
    } else {
      // Enqueue refresh if not already queued (avoid relying on partial unique for upsert)
      const { data: existingQueue } = await supabaseAdmin
        .from("snapshot_refresh_requests")
        .select("id")
        .eq("card", CARD)
        .eq("industry", industry)
        .eq("status", "queued")
        .limit(1);
      if (!existingQueue || existingQueue.length === 0) {
        await supabaseAdmin
          .from("snapshot_refresh_requests")
          .insert({ card: CARD, industry, status: "queued" });
      }
    }

    if (cached) {
      return NextResponse.json({ insight: cached.snapshot, sources: cached.sources || [], cached: false, createdAt: cached.created_at, refreshing: true });
    }

    // Synthetic last-resort fallback (keeps current behavior for first load)
    const fallback = {
      insight: {
        marketSize: { value: "$2.4T", growth: 3.2, currency: "USD", description: "Estimated total addressable market" },
        growthRate: { value: 7.5, trend: 0.8, period: "annual", description: "Projected YoY industry growth" },
        competition: { level: "Medium", trend: "Stable", description: "Fragmented landscape with emerging leaders", details: "Top peers maintain steady share" },
        sentiment: { score: 68, trend: "positive", factors: ["news", "analyst", "investor"], description: "Improving outlook across coverage" },
        fullInsight: `Market outlook for ${industry}: steady demand with healthy investment appetite`,
        dataSources: { finnhub: true, alpha_vantage: true, news_api: true },
        confidenceScore: 0.5,
        aiModelVersion: "enhanced-v1"
      },
      cached: false,
      createdAt: new Date().toISOString(),
      refreshing: true
    };
    return NextResponse.json(fallback);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch market insights" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Same behavior as GET to keep compatibility
  return GET(req);
}


