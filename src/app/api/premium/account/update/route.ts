import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { u_id, ...updates } = await req.json();
    if (!u_id) {
      return NextResponse.json({ error: "Missing u_id" }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from("tier2_users")
      .update(updates)
      .eq("u_id", u_id);
    if (error) {
      console.error("❌ Failed to update user:", error);
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
} 