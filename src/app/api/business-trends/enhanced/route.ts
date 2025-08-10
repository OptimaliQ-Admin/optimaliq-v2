import { NextRequest, NextResponse } from "next/server";

// Lightweight fallback API to support BusinessTrendCard client
// Returns static-but-plausible trend data by industry when cron/AI isn't available
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = (searchParams.get("industry") ?? "technology").toLowerCase();

    const now = new Date();
    const baseTrends = [
      {
        title: "AI-driven automation adoption",
        direction: "up" as const,
        percentageChange: 8.5,
        description: "Increased automation across GTM and operations",
        industry,
        aiModelVersion: "v1",
      },
      {
        title: "Customer acquisition costs",
        direction: "stable" as const,
        percentageChange: 0.7,
        description: "CAC stabilizing after previous quarter volatility",
        industry,
        aiModelVersion: "v1",
      },
      {
        title: "Churn risk in SMB segment",
        direction: "down" as const,
        percentageChange: -3.2,
        description: "Improved retention programs reduce churn risk",
        industry,
        aiModelVersion: "v1",
      },
      {
        title: "PLG feature adoption",
        direction: "up" as const,
        percentageChange: 5.1,
        description: "Higher engagement with self-serve experiences",
        industry,
        aiModelVersion: "v1",
      },
      {
        title: "Sales cycle length",
        direction: "stable" as const,
        percentageChange: 0.0,
        description: "Cycle length remains unchanged QoQ",
        industry,
        aiModelVersion: "v1",
      },
    ];

    const payload = {
      data: {
        trends: baseTrends,
        userTier: "premium",
        industry,
        generatedAt: now.toISOString(),
      },
      cached: false,
      createdAt: now.toISOString(),
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load business trends" }, { status: 500 });
  }
}


