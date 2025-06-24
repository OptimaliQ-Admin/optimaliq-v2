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

    const { email, password, timezone, linkedin_url, agreed_terms, agreed_marketing } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Handles both new and recovered account creation
    // If UUID exists in tier2_users, it will be updated with Auth user ID
    // ✅ 1. Check user in tier2_users
    const { data: tier2User, error: tier2Error } = await supabaseAdmin!
      .from("tier2_users")
      .select("*")
      .eq("email", email)
      .single();

    if (tier2Error || !tier2User) {
      console.error("❌ User not found in tier2_users:", tier2Error);
      return NextResponse.json({ error: "User not found in tier2_users" }, { status: 404 });
    }

    // ✅ 2. Check user in Supabase Auth
    const { data: userList, error: listError } = await supabaseAdmin!.auth.admin.listUsers();
    if (listError || !userList?.users) {
      console.error("❌ Error listing users:", listError);
      return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
    }

    let authUser = userList.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (!authUser) {
      console.log("👤 User does not exist in Auth. Creating new user...");

      const { data: createdUser, error: createError } = await supabaseAdmin!.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError || !createdUser?.user) {
        console.error("❌ Error creating user in Auth:", createError);
        return NextResponse.json({ error: "Failed to create user in auth" }, { status: 500 });
      }

      authUser = createdUser.user;
    }

    // ✅ 3. Update password
    const { error: updatePasswordError } = await supabaseAdmin!.auth.admin.updateUserById(authUser.id, {
      password,
    });

    if (updatePasswordError) {
      console.error("❌ Error updating password:", updatePasswordError);
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    // ✅ 4. Update tier2_users with user ID and new data
    const { error: updateTier2Error } = await supabaseAdmin!
      .from("tier2_users")
      .update({
        u_id: authUser.id,
        timezone,
        linkedin_url,
        agreed_terms,
        agreed_marketing,
      })
      .eq("email", email);

    if (updateTier2Error) {
      console.error("❌ Error updating tier2_users:", updateTier2Error);
      return NextResponse.json({ error: "Failed to update tier2_users" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
