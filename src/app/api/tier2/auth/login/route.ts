// File: src/app/api/tier2/auth/login/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Step 1: Lookup user first by email
    const { data: user, error: userError } = await supabase
      .from("tier2_users")
      .select("user_id, email, first_name, last_name, company")
      .eq("email", email)
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Step 2: Check if they have an active subscription
    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .select("u_id")
      .eq("status", "active")
      .eq("u_id", user.user_id)
      .maybeSingle();

    if (subError || !sub) {
      return NextResponse.json({ error: "No active subscription found." }, { status: 403 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    console.error("/auth/login error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
