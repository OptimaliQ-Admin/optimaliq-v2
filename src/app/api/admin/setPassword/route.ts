import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // Admin client

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ List all users (no filters)
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Failed to list users:", listError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // ✅ Find user manually by email
    const user = listData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      console.error("❌ No user found with email:", email);
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    // Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: password }
    );

    if (updateError) {
      console.error("❌ Error updating password:", updateError);
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    console.log("✅ Password successfully set");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
