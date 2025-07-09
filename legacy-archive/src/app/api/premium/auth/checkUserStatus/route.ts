//src/app/api/premium/auth/checkUserStatus/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminClientAvailable } from "@/lib/supabaseAdmin"; // Use admin client for speed

export async function POST(req: Request) {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      }, { status: 503 });
    }

    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json({ error: "Missing u_id" }, { status: 400 });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseAdmin!
      .from("tier2_users")
      .select("*")
      .eq("u_id", u_id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch subscription
    const { data: subscription, error: subscriptionError } = await supabaseAdmin!
      .from("subscriptions")
      .select("status")
      .eq("u_id", u_id)
      .maybeSingle();

    const hasActiveSubscription = subscription?.status === "active" || subscription?.status === "trial";

    // Fetch onboarding
    const { data, error } = await supabaseAdmin!
      .from("onboarding_assessments")
      .select("o_id")
      .eq("u_id", u_id)
      .limit(1);

    const onboarding = data?.[0];

    const hasCompletedOnboarding = Boolean(onboarding);

    return NextResponse.json({
      hasActiveSubscription,
      hasCompletedOnboarding,
      profile,
    });
  } catch (error) {
    console.error("❌ Server error in checkUserStatus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
