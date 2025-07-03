import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { customerId, returnUrl } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    // Create setup session for payment method updates
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "setup",
      payment_method_types: ["card"],
      success_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai'}/premium/account/billing?success=true`,
      cancel_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai'}/premium/account/billing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe setup session creation error:", error);
    return NextResponse.json({ error: "Failed to create setup session" }, { status: 500 });
  }
} 