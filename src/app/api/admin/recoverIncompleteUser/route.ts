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

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // ✅ 1. Check if user exists in tier2_users
    const { data: tier2User, error: tier2Error } = await supabaseAdmin!
      .from("tier2_users")
      .select("*")
      .eq("email", email)
      .single();

    if (tier2Error || !tier2User) {
      // User doesn't exist in tier2_users - normal case
      return NextResponse.json({ 
        needsAccountCompletion: false 
      });
    }

    // ✅ 2. Check if user exists in Supabase Auth
    const { data: userList, error: listError } = await supabaseAdmin!.auth.admin.listUsers();
    if (listError || !userList?.users) {
      console.error("❌ Error listing users:", listError);
      return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
    }

    const authUser = userList.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    // ✅ 3. If user exists in tier2_users but not in Auth, they need to complete account creation
    if (!authUser) {
      console.log("👤 Found incomplete user:", email);
      return NextResponse.json({
        needsAccountCompletion: true,
        userInfo: tier2User
      });
    }

    // User exists in both places - normal case
    return NextResponse.json({ 
      needsAccountCompletion: false 
    });

  } catch (error) {
    console.error("❌ Unexpected error in recoverIncompleteUser:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
} 