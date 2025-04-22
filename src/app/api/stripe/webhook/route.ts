import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const user_id = session.metadata?.user_id;
    const plan = session.metadata?.plan;
    const billingCycle = session.metadata?.billingCycle;

    if (user_id) {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          plan,
          billingCycle,
          nextbillingdate: new Date().toISOString(), // You can refine this
        })
        .eq("u_id", user_id);

      if (error) console.error("❌ Failed to update subscription:", error);
    }
  }

  return NextResponse.json({ received: true });
}
