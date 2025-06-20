import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { customerId, returnUrl } = await req.json();

    console.log("Creating billing portal session for customer:", customerId);

    if (!customerId) {
      console.error("Missing customerId in request");
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not configured");
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/premium/account/billing`,
    });

    console.log("Billing portal session created successfully:", { 
      sessionId: session.id, 
      url: session.url 
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe billing portal session creation error:", error);
    
    // Log more specific error details
    if (error.type) {
      console.error("Stripe error type:", error.type);
    }
    if (error.message) {
      console.error("Stripe error message:", error.message);
    }
    
    return NextResponse.json({ 
      error: "Failed to create billing portal session",
      details: error.message || "Unknown error"
    }, { status: 500 });
  }
} 