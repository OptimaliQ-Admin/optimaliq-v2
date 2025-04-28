import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // Admin client

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. List all users
    const { data: userData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Failed to list users:", listError);
      return NextResponse.json({ error: "User list failed" }, { status: 500 });
    }

    // 2. Find the user by email manually
    const user = userData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      console.error("❌ No user found with email:", email);
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    // 3. Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
    });

    if (updateError) {
      console.error("❌ Failed to update password:", updateError);
      return NextResponse.json({ error: "Failed to set password" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
