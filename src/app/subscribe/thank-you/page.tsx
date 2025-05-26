
import {  Suspense } from "react";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ThankYouContent from "./ThankYouContent";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const saveSubscriptionFromStripeSessionId = async (session_id: string) => {
    // const session_id = new URLSearchParams(window.location.search).get("session_id");
    // Ensure you have the Stripe session ID
    if (!session_id) {
      console.error("No session_id found in URL");
        // router.push("/subscribe");
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription", "customer"],
    });

    const { data: validateSubscription, error: validateNotExistSubscriptionError } = await supabaseAdmin
          .from("subscriptions")
          .select("stripe_subscription_id")
          .eq("stripe_subscription_id", session.subscription?.id)
          .maybeSingle()

    // console.log("Stripe session retrieved:", session.subscription);
    // console.log("Exist Subscription :", !!validateSubscription);

    if(validateSubscription == null) {
      const { error: subscriptionError } = await supabaseAdmin
            .from("subscriptions")
            .insert({
              u_id:         session.metadata?.u_id!,
              stripe_subscription_id: session.subscription?.id!,
              stripe_customer_id:     session.subscription?.customer,
              stripe_data:     session.subscription,
              status:       session.subscription?.status,
              plan:         session.subscription?.plan?.nickname,
              billingCycle: session.metadata?.billingCycle,
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
  searchParams: { session_id?: string };
}) {
  const session_id = await searchParams.session_id;
  await saveSubscriptionFromStripeSessionId(session_id!)
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
