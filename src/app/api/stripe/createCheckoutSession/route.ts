import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { email, plan, user_id, billingCycle } = await req.json();

    if (!email || !plan || !user_id || !billingCycle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Only Accelerator plan is supported for now
    if (plan !== "accelerator") {
      return NextResponse.json({ error: "Unsupported plan" }, { status: 400 });
    }

    const priceId =
      billingCycle === "monthly"
        ? process.env.STRIPE_PRICE_ACCELERATOR_MONTHLY
        : process.env.STRIPE_PRICE_ACCELERATOR_ANNUAL;

    if (!priceId) {
      return NextResponse.json({ error: "Stripe price ID not configured" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
      metadata: {
        user_id,
        plan,
        billingCycle,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe session creation error:", error);
    return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
  }
}
