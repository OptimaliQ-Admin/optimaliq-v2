
import {  Suspense } from "react";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ThankYouContent from "./ThankYouContent";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const saveSubscriptionFromStripeSessionId = async (session_id: string) => {
    if (!session_id) {
      console.error("No session_id found in URL");
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription", "customer"],
    });
    const subscription: any = session?.subscription as any;
    const { data: validateSubscription, error: validateNotExistSubscriptionError } = await supabaseAdmin
          .from("subscriptions")
          .select("stripe_subscription_id")
          .eq("stripe_subscription_id", subscription?.id)
          .maybeSingle()

    // console.log("Stripe session retrieved:", session.subscription);
    // console.log("Exist Subscription :", !!validateSubscription);
    if (validateNotExistSubscriptionError) {
      console.error("Failed to validate subscription:", validateNotExistSubscriptionError);
    }
    if(validateSubscription == null) {
      const plan: any = (session?.subscription as any).plan || {}
      const { error: subscriptionError } = await supabaseAdmin
            .from("subscriptions")
            .insert({
              u_id:         session?.metadata?.u_id,
              stripe_subscription_id: typeof session?.subscription === "object" && session?.subscription !== null && "id" in session.subscription
                                        ? (session.subscription as Stripe.Subscription).id
                                        : undefined,
              stripe_customer_id:     typeof session?.subscription === "object" && session?.subscription !== null && "customer" in session.subscription
                                        ? (session.subscription as Stripe.Subscription).customer
                                        : undefined,
              stripe_data:     session?.subscription,
              status:       typeof session?.subscription === "object" && session?.subscription !== null && "status" in session.subscription
                                ? (session.subscription as Stripe.Subscription).status
                                : 'ready',
              plan:         plan?.nickname || "Unknown Plan",
              billingCycle: session?.metadata?.billingCycle,
              // TODO: Set next billing date based on the plan
              nextbillingdate: new Date().toISOString(),

            })

      if (subscriptionError) {
        console.error("❌ Failed to update subscription:", subscriptionError);
        return;
      }
    }
}


export default async function ThankYouPage({
  searchParams,
}: {
  searchParams?: Promise<{
    session_id: string
  }>;
}) {
  const params = await searchParams
  if(params?.session_id) {
    await saveSubscriptionFromStripeSessionId(params?.session_id)
  }
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
