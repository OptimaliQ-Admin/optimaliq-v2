import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminClientAvailable } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      }, { status: 503 });
    }

    const { email, timezone, linkedin_url, agreed_terms, agreed_marketing } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // ✅ 1. Check user in Supabase Auth
    const { data: usersData, error: listError } = await supabaseAdmin!.auth.admin.listUsers();
    if (listError || !usersData?.users) {
      console.error("❌ Error listing users:", listError);
      return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
    }

    const authUser = usersData.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (!authUser) {
      console.error("❌ User not found in Auth");
      return NextResponse.json({ error: "User not found in auth" }, { status: 404 });
    }

    // ✅ 2. Update users with new data
    const { error: updateError } = await supabaseAdmin!
      .from("users")
      .update({
        timezone,
        linkedin_url,
        agreed_terms,
        agreed_marketing,
      })
      .eq("email", email);

    if (updateError) {
      console.error("❌ Error updating users:", updateError);
      return NextResponse.json({ error: "Failed to update users" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
