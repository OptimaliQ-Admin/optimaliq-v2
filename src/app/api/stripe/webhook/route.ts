// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("Processing webhook event:", event.type);

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as any);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as any);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as any);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as any);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as any);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log("Handling subscription created successfully");
  
  const updateData = {
    status: subscription.status,
    stripe_subscription_id: subscription.id,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    stripe_data: subscription,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("stripe_customer_id", subscription.customer as string);

  if (error) {
    console.error("Error updating subscription on created:", error);
    throw error;
  }

  // Update user's premium status
  await updateUserPremiumStatus(subscription.customer as string, subscription.status === 'active');
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log("Handling subscription updated successfully");
  
  const updateData = {
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    stripe_data: subscription,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Error updating subscription on updated:", error);
    throw error;
  }

  // Update user's premium status
  await updateUserPremiumStatus(subscription.customer as string, subscription.status === 'active');
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log("Handling subscription deleted successfully");
  
  const updateData = {
    status: 'canceled',
    canceled_at: new Date().toISOString(),
    stripe_data: subscription,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Error updating subscription on deleted:", error);
    throw error;
  }

  // Update user's premium status to false
  await updateUserPremiumStatus(subscription.customer as string, false);
}

async function handlePaymentFailed(invoice: any) {
  console.log("Handling payment failed successfully");
  
  if (!invoice.subscription) return;

  const updateData = {
    status: 'past_due',
    stripe_data: invoice,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("stripe_subscription_id", invoice.subscription as string);

  if (error) {
    console.error("Error updating subscription on payment failed:", error);
    throw error;
  }

  // Update user's premium status to false for past_due
  await updateUserPremiumStatus(invoice.customer as string, false);
}

async function handlePaymentSucceeded(invoice: any) {
  console.log("Handling payment succeeded successfully");
  
  if (!invoice.subscription) return;

  const updateData = {
    status: 'active',
    stripe_data: invoice,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("stripe_subscription_id", invoice.subscription as string);

  if (error) {
    console.error("Error updating subscription on payment succeeded:", error);
    throw error;
  }

  // Update user's premium status to true
  await updateUserPremiumStatus(invoice.customer as string, true);
}

async function updateUserPremiumStatus(stripeCustomerId: string, isPremium: boolean) {
  console.log(`Updating premium status to ${isPremium}`);
  
  // First, get the user ID from the subscriptions table
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("u_id")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (subError || !subscription) {
    console.error("Error finding subscription for customer:", stripeCustomerId, subError);
    return;
  }

  // Update the user's premium status in profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ 
      is_premium: isPremium,
      updated_at: new Date().toISOString()
    })
    .eq("id", subscription.u_id);

  if (profileError) {
    console.error("Error updating user premium status:", profileError);
    throw profileError;
  }

  console.log(`Successfully updated premium status to ${isPremium}`);
}
