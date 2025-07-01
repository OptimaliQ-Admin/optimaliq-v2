import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userInfo } = await req.json();

    if (!userInfo || !userInfo.email) {
      return NextResponse.json({ error: "Missing user information" }, { status: 400 });
    }

    // Check for existing user by email
    const { data: existingUser, error: fetchError } = await supabase
      .from("growth_users")
      .select("u_id")
      .eq("email", userInfo.email)
      .maybeSingle();

    if (fetchError) {
      console.error("❌ Error checking user:", fetchError);
      return NextResponse.json({ error: "Unable to check user. Try again." }, { status: 500 });
    }

    let userId: string;

    if (existingUser?.u_id) {
      // Update existing user
      userId = existingUser.u_id;

      const { error: updateError } = await supabase
        .from("growth_users")
        .update(userInfo)
        .eq("u_id", userId);

      if (updateError) {
        console.error("❌ Error updating user:", updateError);
        return NextResponse.json({ error: "Failed to update user. Try again." }, { status: 500 });
      }
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from("growth_users")
        .insert([userInfo])
        .select("u_id")
        .single();

      if (insertError || !newUser?.u_id) {
        console.error("❌ Error creating user:", insertError);
        return NextResponse.json({ error: "Failed to create user. Try again." }, { status: 500 });
      }

      userId = newUser.u_id;
    }

    return NextResponse.json({ userId });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 