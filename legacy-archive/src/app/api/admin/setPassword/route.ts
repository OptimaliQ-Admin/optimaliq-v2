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

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // ✅ 1. Check user in Supabase Auth
    const { data: listData, error: listError } = await supabaseAdmin!.auth.admin.listUsers();
    if (listError || !listData?.users) {
      console.error("❌ Error listing users:", listError);
      return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
    }

    const authUser = listData.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (!authUser) {
      console.error("❌ User not found in Auth");
      return NextResponse.json({ error: "User not found in auth" }, { status: 404 });
    }

    // ✅ 2. Update password
    const { error: updateError } = await supabaseAdmin!.auth.admin.updateUserById(authUser.id, {
      password,
    });

    if (updateError) {
      console.error("❌ Error updating password:", updateError);
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
