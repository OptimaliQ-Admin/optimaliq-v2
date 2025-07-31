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

    // Fetch user profile from new users table
    const { data: profile, error: profileError } = await supabaseAdmin!
      .from("users")
      .select("*")
      .eq("id", u_id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch subscription from new subscriptions table
    const { data: subscription, error: subscriptionError } = await supabaseAdmin!
      .from("subscriptions")
      .select("status")
      .eq("user_id", u_id)
      .maybeSingle();

    const hasActiveSubscription = subscription?.status === "active" || subscription?.status === "trial";

    // Check for completed onboarding session (new World Class Onboarding)
    const { data: onboardingSession, error: onboardingError } = await supabaseAdmin!
      .from("onboarding_sessions")
      .select("id, status, completed_at")
      .eq("user_id", u_id)
      .eq("status", "completed")
      .limit(1);

    const hasCompletedOnboarding = Boolean(onboardingSession?.[0]);

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
