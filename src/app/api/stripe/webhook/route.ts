import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getErrorMessage } from "@/utils/errorHandler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion omitted as discussed
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    console.error("⚠️ Webhook signature verification failed.", getErrorMessage(err));
    return new Response(`Webhook Error: ${getErrorMessage(err)}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("📦 Stripe metadata received:", session.metadata);

    const user_id = session.metadata?.user_id;
    const plan = session.metadata?.plan;
    const billingCycle = session.metadata?.billingCycle;

    if (!user_id) {
      console.error("❌ Missing user_id in metadata.");
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // 1. Check if user exists in tier2_users
    const { data: existingUser, error: userCheckError } = await supabase
      .from("tier2_users")
      .select("u_id")
      .eq("u_id", user_id)
      .maybeSingle();

    if (userCheckError) {
      console.error("❌ Error checking user existence:", userCheckError);
      return NextResponse.json({ error: "Failed to check user existence" }, { status: 500 });
    }

    // 2. If not exists, insert user record with just the u_id and email if available
    if (!existingUser) {
      const fallbackEmail = session.customer_email || null;
      if (!fallbackEmail) {
        console.error("❌ No email found to create fallback user.");
        return NextResponse.json({ error: "Missing fallback email" }, { status: 400 });
      }

      const { error: insertUserError } = await supabase.from("tier2_users").insert([
        {
          u_id: user_id,
          email: fallbackEmail,
        }
      ]);

      if (insertUserError) {
        console.error("❌ Failed to insert fallback user:", insertUserError);
        return NextResponse.json({ error: "Failed to create fallback user" }, { status: 500 });
      }

      console.log("✅ Fallback user created:", user_id);
    }

    // 3. Now safe to upsert into subscriptions
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .upsert([
        {
          u_id: user_id,
          status: "active",
          plan,
          billingCycle,
          nextbillingdate: new Date().toISOString(),
        }
      ], { onConflict: "u_id" });

    if (subscriptionError) {
      console.error("❌ Failed to update subscription:", subscriptionError);
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }

    console.log("✅ Subscription updated for user:", user_id);
  }

  return NextResponse.json({ received: true });
}
