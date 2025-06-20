import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json({ error: "Missing u_id" }, { status: 400 });
    }

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch subscription data
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("u_id", u_id)
      .single();

    if (subscriptionError) {
      console.error("Error fetching subscription:", subscriptionError);
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Extract relevant data from Stripe subscription
    const stripeData = subscription.stripe_data as any;
    
    const subscriptionData = {
      status: subscription.status,
      plan: subscription.plan,
      billingCycle: subscription.billingCycle,
      nextBillingDate: subscription.nextbillingdate,
      stripeCustomerId: stripeData?.customer || null,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      amount: stripeData?.items?.data?.[0]?.price?.unit_amount || null,
      currency: stripeData?.items?.data?.[0]?.price?.currency?.toUpperCase() || 'USD',
      lastLogin: new Date().toISOString() // You might want to track this separately
    };

    return NextResponse.json(subscriptionData);
  } catch (error) {
    console.error("Error in subscription API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 