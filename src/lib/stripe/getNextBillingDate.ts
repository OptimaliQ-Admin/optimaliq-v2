import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface NextBillingDateResult {
  success: boolean;
  nextBillingDate?: string;
  formattedDate?: string;
  error?: string;
}

export async function getNextBillingDate(customerId: string): Promise<NextBillingDateResult> {
  try {
    if (!customerId) {
      return {
        success: false,
        error: "Customer ID is required"
      };
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        success: false,
        error: "Stripe is not configured"
      };
    }

    // Fetch active subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
      expand: ["data.default_payment_method"]
    });

    if (!subscriptions.data || subscriptions.data.length === 0) {
      return {
        success: false,
        error: "No active subscription found"
      };
    }

    const subscription = subscriptions.data[0] as any;
    
    if (!subscription.current_period_end) {
      return {
        success: false,
        error: "Subscription does not have a next billing date"
      };
    }

    // Convert Unix timestamp to ISO string
    const nextBillingDate = new Date(subscription.current_period_end * 1000).toISOString();
    
    // Format as MM/DD/YYYY
    const formattedDate = new Date(subscription.current_period_end * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    return {
      success: true,
      nextBillingDate,
      formattedDate
    };

  } catch (error: any) {
    console.error("Error fetching next billing date from Stripe:", error);
    
    return {
      success: false,
      error: error.message || "Failed to fetch next billing date"
    };
  }
} 