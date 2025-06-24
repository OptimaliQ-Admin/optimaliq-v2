//src/app/api/stripe/createCheckoutSession/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { PRICE_ID_MAP } from "@/lib/stripe/prices";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { email, plan, u_id, billingCycle } = await req.json();

    if (!email || !plan || !u_id || !billingCycle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate plan is supported
    if (plan !== "accelerator" && plan !== "strategic") {
      return NextResponse.json({ error: "Unsupported plan" }, { status: 400 });
    }

    // Get the correct price ID based on plan and billing cycle
    const priceIdKey = `${plan}_${billingCycle}` as keyof typeof PRICE_ID_MAP;
    const priceId = PRICE_ID_MAP[priceIdKey];

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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
      metadata: {
        u_id,
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
