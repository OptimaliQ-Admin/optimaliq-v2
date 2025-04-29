import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // your Admin Supabase client

export async function POST(req: Request) {
  try {
    const { email, password, timezone, linkedin_url, agreed_terms, agreed_marketing } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ 1. List users and find user by email
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError || !userList?.users) {
      console.error("❌ Failed to list users:", listError);
      return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
    }

    const matchedUser = userList.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      console.error("❌ No user found with email:", email);
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    // ✅ 2. Update password using user ID
    const { error: updatePasswordError } = await supabaseAdmin.auth.admin.updateUserById(matchedUser.id, {
      password,
    });

    if (updatePasswordError) {
      console.error("❌ Failed to set password:", updatePasswordError);
      return NextResponse.json({ error: "Failed to set password" }, { status: 500 });
    }

    // ✅ 3. Update tier2_users record
    const { error: updateProfileError } = await supabaseAdmin
      .from("tier2_users")
      .update({
        u_id: matchedUser.id, // 🧠 Correct real user ID
        timezone,
        linkedin_url,
        agreed_terms,
        agreed_marketing,
      })
      .eq("email", email);

    if (updateProfileError) {
      console.error("❌ Failed to update user profile:", updateProfileError);
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
