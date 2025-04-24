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

  // Handle event
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
  
    const { error } = await supabase
  .from("subscriptions")
  .upsert([
    {
      u_id: user_id,
      status: "active",
      plan,
      billingCycle,
      nextbillingdate: new Date().toISOString(),
    },
  ], { onConflict: "u_id" }); // this ensures we update if it exists, insert if not
  
    if (error) {
      console.error("❌ Failed to update subscription:", error);
    } else {
      console.log("✅ Subscription updated for user:", user_id);
    }
  }  
  return NextResponse.json({ received: true });
}
