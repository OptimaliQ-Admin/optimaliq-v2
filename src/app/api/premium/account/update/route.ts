import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { u_id, ...updates } = await req.json();
    if (!u_id) {
      return NextResponse.json({ error: "Missing u_id" }, { status: 400 });
    }

    // Log the updates for debugging
    console.log("📝 Updating user profile:", { u_id, updates });

    const { error } = await supabaseAdmin
      .from("tier2_users")
      .update(updates)
      .eq("u_id", u_id);

    if (error) {
      console.error("❌ Failed to update user:", error);
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }

    // Return the updated data
    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
} 