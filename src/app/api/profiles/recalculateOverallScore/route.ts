import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { recalculateOverallScore } from "@/lib/sync/recalculateOverallScore";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });
    const overallScore = await recalculateOverallScore(supabase, userId);

    return NextResponse.json({ overall_score: overallScore });
  } catch (error) {
    console.error("Error in recalculateOverallScore:", error);
    return NextResponse.json(
      { error: "Failed to recalculate overall score" },
      { status: 500 }
    );
  }
} 