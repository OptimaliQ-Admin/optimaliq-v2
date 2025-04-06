import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;

  try {
    const res = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: {
        "X-Finnhub-Token": FINNHUB_API_KEY,
      },
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("❌ Debugging Finnhub fetch:", err);
    return NextResponse.json({ error: "Failed to fetch from Finnhub" }, { status: 500 });
  }
}
