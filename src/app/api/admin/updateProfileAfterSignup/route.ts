import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // use admin client here

export async function POST(req: Request) {
  try {
    const { email, timezone, linkedin_url, agreed_terms, agreed_marketing } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 1. List auth users
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error("❌ Failed to list users:", listError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const matchedUser = usersData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      console.error("❌ No auth user found with email:", email);
      return NextResponse.json({ error: "Auth user not found" }, { status: 404 });
    }

    // 2. Update tier2_users
    const { error: updateError } = await supabaseAdmin
      .from("tier2_users")
      .update({
        u_id: matchedUser.id,
        timezone,
        linkedin_url,
        agreed_terms,
        agreed_marketing,
      })
      .eq("email", email);

    if (updateError) {
      console.error("❌ Failed to update user:", updateError);
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
