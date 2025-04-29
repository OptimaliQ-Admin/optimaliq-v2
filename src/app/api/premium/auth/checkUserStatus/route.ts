import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // Use admin client for speed

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("tier2_users")
      .select("*")
      .eq("u_id", user_id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch subscription
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from("subscriptions")
      .select("status")
      .eq("u_id", user_id)
      .maybeSingle();

    const hasActiveSubscription = subscription?.status === "active";

    // Fetch onboarding
    const { data: onboarding, error: onboardingError } = await supabaseAdmin
      .from("onboarding_assessments")
      .select("id")
      .eq("u_id", user_id)
      .maybeSingle();

    const hasCompletedOnboarding = Boolean(onboarding);

    return NextResponse.json({
      hasActiveSubscription,
      hasCompletedOnboarding,
      profile,
    });
  } catch (error) {
    console.error("❌ Server error in checkUserStatus:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
