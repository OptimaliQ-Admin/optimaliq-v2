import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { customerId, returnUrl, configurationId } = await req.json();

    console.log("Creating billing portal session");

    if (!customerId) {
      console.error("Missing customerId in request");
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not configured");
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    // Create billing portal session with optional configuration
    const sessionParams: Stripe.BillingPortal.SessionCreateParams = {
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/premium/account/billing`,
    };

    // Add configuration if provided
    if (configurationId) {
      sessionParams.configuration = configurationId;
    }

    const session = await stripe.billingPortal.sessions.create(sessionParams);

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
    
    // Provide more helpful error message for configuration issues
    let errorMessage = "Failed to create billing portal session";
    if (error.message && error.message.includes("configuration")) {
      errorMessage = "Stripe billing portal not configured. Please configure the customer portal in your Stripe dashboard at https://dashboard.stripe.com/settings/billing/portal";
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error.message || "Unknown error"
    }, { status: 500 });
  }
} 