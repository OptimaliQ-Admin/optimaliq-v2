import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile from users table
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get subscription status
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .single();

    const hasActiveSubscription = subscription?.status === "active" || subscription?.status === "trial";

    // Check for completed onboarding
    const { data: onboardingSession, error: onboardingError } = await supabase
      .from("onboarding_sessions")
      .select("id, status, completed_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .limit(1);

    const hasCompletedOnboarding = Boolean(onboardingSession?.[0]);

    // Determine where user should be redirected
    let redirectTo = null;
    if (!hasActiveSubscription) {
      redirectTo = "/subscribe";
    } else if (!hasCompletedOnboarding) {
      redirectTo = "/premium/onboarding/world-class";
    } else {
      redirectTo = "/premium/dashboard";
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...userProfile
      },
      subscription: {
        status: subscription?.status || null,
        hasActiveSubscription
      },
      onboarding: {
        hasCompletedOnboarding,
        sessionId: onboardingSession?.[0]?.id || null
      },
      redirectTo
    });

  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 