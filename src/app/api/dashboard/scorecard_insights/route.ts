import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { getErrorMessage } from "@/utils/errorHandler";
export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  try {
    const body = await req.json();
    console.log("📨 Incoming POST payload:", body);

    const { category, industry, score } = body;

    if (!category || !industry || typeof score !== "number") {
      console.warn("⚠️ Invalid input:", { category, industry, score });
      return NextResponse.json({ error: 'Missing or invalid parameters.' }, { status: 400 });
    }

    // 🧾 Debug logging
    console.log("📦 Scorecard Insight Request:", { category, industry, score });

    // 🔍 Query scorecard insights table
    const { data, error } = await supabase
    .from('scorecard_insights')
    .select('title, description, benchmark, focus_areas')
    .eq('category', category)
    .eq('industry', industry)
    .filter('score_min', 'lte', score)
    .filter('score_max', 'gt', score) // exclusive upper bound
    .single();
    
    if (error || !data) {
      console.warn("⚠️ No insight found for score:", score, "in category:", category);
      return NextResponse.json({ error: 'Insight not found.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("❌ Scorecard Insights API Error:", err);
    return NextResponse.json({ error: "Server error", detail: getErrorMessage(err) }, { status: 500 });
  }
}
