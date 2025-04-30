// src/app/api/stripe/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";  // for DB inserts
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // for auth user creation
import { getErrorMessage } from "@/utils/errorHandler";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion omitted
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
    console.error("⚠️ Webhook signature verification failed:", getErrorMessage(err));
    return new Response(`Webhook Error: ${getErrorMessage(err)}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("📦 Stripe metadata received:", session.metadata);

    const user_id = session.metadata?.u_id;
    const plan = session.metadata?.plan;
    const billingCycle = session.metadata?.billingCycle;
    const customer_email = session.customer_email;

    if (!user_id || !customer_email) {
      console.error("❌ Missing user_id or customer_email in metadata.");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    // 2. If not exists, insert basic user record
    if (!existingUser) {
      const { error: insertUserError } = await supabase
        .from("tier2_users")
        .insert([{ 
          u_id: user_id,
          email: customer_email,
        }]);

      if (insertUserError) {
        console.error("❌ Failed to insert fallback user:", insertUserError);
        return NextResponse.json({ error: "Failed to create fallback user" }, { status: 500 });
      }

      console.log("✅ Fallback tier2_user created:", user_id);
    }

    // 3. Upsert into subscriptions
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

    // 4. Check if auth user exists
const { data: authListData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

if (listError) {
  console.error("❌ Failed to fetch auth users:", listError);
  return NextResponse.json({ error: "Failed to check auth users" }, { status: 500 });
}

const authUserExists = authListData?.users?.some((user) => user.email?.toLowerCase() === customer_email?.toLowerCase());

// 5. If no auth user, create one
if (!authUserExists) {
  const { error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
    email: customer_email,
    email_confirm: true,
  });

  if (createAuthError) {
    console.error("❌ Failed to create auth user:", createAuthError);
    return NextResponse.json({ error: "Failed to create auth user" }, { status: 500 });
  }

  console.log("✅ Auth user created for:", customer_email);
} else {
  console.log("✅ Auth user already exists for:", customer_email);
}
  }

  return NextResponse.json({ received: true });
}
