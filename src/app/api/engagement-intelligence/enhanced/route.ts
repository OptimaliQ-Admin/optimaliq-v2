import { NextRequest, NextResponse } from "next/server";

// Lightweight fallback API to support EngagementIntelligenceCard client
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = (searchParams.get("industry") ?? "general").toLowerCase();
    const now = new Date();

    const data = {
      industry,
      lastUpdated: now.toISOString(),
      signalScore: 72,
      signalSummary: "Healthy engagement momentum with room to grow",
      trends: [
        { title: "Email engagement", description: "Open and CTR trending upward", direction: "up", percentageChange: 6.4 },
        { title: "Organic traffic", description: "Sustained growth from content", direction: "up", percentageChange: 4.1 },
        { title: "Social reach", description: "Flat growth across major channels", direction: "flat", percentageChange: 0.2 },
      ],
      recommendations: [
        "Double down on best-performing content formats",
        "Scale nurture sequences for mid-funnel cohorts",
        "Pilot community-led programs to boost advocacy",
      ],
    };

    return NextResponse.json({ data, cached: false, createdAt: now.toISOString() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load engagement intelligence" }, { status: 500 });
  }
}


