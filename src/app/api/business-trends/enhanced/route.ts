import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeIndustry } from "@/lib/utils/industry";

const CARD = "business_trends" as const;
const DEFAULT_TTL_MIN = 360;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = normalizeIndustry(searchParams.get("industry") ?? "technology");

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const { data: cached } = await supabaseAdmin
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

    if (isFresh) {
      return NextResponse.json({ data: cached.snapshot, cached: true, createdAt: cached.created_at });
    }

    await supabaseAdmin
      .from("snapshot_refresh_requests")
      .upsert({ card: CARD, industry, status: "queued" }, { onConflict: "card,industry" })
      .select();

    if (cached) {
      return NextResponse.json({ data: cached.snapshot, cached: false, createdAt: cached.created_at, refreshing: true });
    }

    // Lightweight fallback resembling old payload
    const nowIso = new Date().toISOString();
    return NextResponse.json({
      data: {
        trends: [
          { title: "AI-driven automation adoption", direction: "up", percentageChange: 8.5, description: "Increased automation across GTM and operations", industry, aiModelVersion: "v1" },
          { title: "Customer acquisition costs", direction: "stable", percentageChange: 0.7, description: "CAC stabilizing after previous quarter volatility", industry, aiModelVersion: "v1" },
          { title: "Churn risk in SMB segment", direction: "down", percentageChange: -3.2, description: "Improved retention programs reduce churn risk", industry, aiModelVersion: "v1" },
          { title: "PLG feature adoption", direction: "up", percentageChange: 5.1, description: "Higher engagement with self-serve experiences", industry, aiModelVersion: "v1" },
          { title: "Sales cycle length", direction: "stable", percentageChange: 0.0, description: "Cycle length remains unchanged QoQ", industry, aiModelVersion: "v1" },
        ],
        userTier: "premium",
        industry,
        generatedAt: nowIso,
      },
      cached: false,
      createdAt: nowIso,
      refreshing: true,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load business trends" }, { status: 500 });
  }
}


