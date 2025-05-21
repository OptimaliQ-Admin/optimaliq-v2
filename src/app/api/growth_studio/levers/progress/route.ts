import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { u_id, lever_text, is_completed } = await request.json();

    if (!u_id || !lever_text || typeof is_completed !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upsert the progress
    const { error } = await supabase
      .from("growth_lever_progress")
      .upsert({
        u_id,
        lever_text,
        is_completed,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating lever progress:", error);
    return NextResponse.json(
      { error: "Failed to update lever progress" },
      { status: 500 }
    );
  }
} 