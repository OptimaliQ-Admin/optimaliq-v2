import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

import { getErrorMessage } from "@/utils/errorHandler";
export async function POST(req: NextRequest) {
  try {
    const { category, industry, score } = await req.json();

    // ✅ Validate required fields
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
      .gte('score_min', score)
      .lt('score_max', score + 0.5) // ⬅️ Handles brackets like [3.0, 3.5)

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
