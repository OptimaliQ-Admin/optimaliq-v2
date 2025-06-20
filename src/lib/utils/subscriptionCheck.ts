import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface SubscriptionCheckResult {
  hasActiveSubscription: boolean;
  subscriptionStatus?: string;
  redirectUrl?: string;
}

/**
 * Check if a user has an active subscription
 * @param userId - The user's ID
 * @returns Promise<SubscriptionCheckResult>
 */
export async function checkSubscriptionStatus(userId: string): Promise<SubscriptionCheckResult> {
  try {
    // Get user's subscription status
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('u_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription status:', error);
      return {
        hasActiveSubscription: false,
        redirectUrl: '/subscribe'
      };
    }

    // Check if subscription is active
    const hasActiveSubscription = subscription && subscription.status === 'active';

    if (!hasActiveSubscription) {
      let redirectUrl = '/subscribe';
      
      // Add specific redirects based on subscription status
      if (subscription?.status === 'past_due') {
        redirectUrl = '/premium/account/billing';
      } else if (subscription?.status === 'canceled') {
        redirectUrl = '/subscribe?message=subscription_canceled';
      }

      return {
        hasActiveSubscription: false,
        subscriptionStatus: subscription?.status,
        redirectUrl
      };
    }

    return {
      hasActiveSubscription: true,
      subscriptionStatus: subscription.status
    };

  } catch (error) {
    console.error('Error in subscription check:', error);
    return {
      hasActiveSubscription: false,
      redirectUrl: '/subscribe'
    };
  }
}

/**
 * Check if a user has premium access (either active subscription or fallback)
 * @param userId - The user's ID
 * @returns Promise<boolean>
 */
export async function hasPremiumAccess(userId: string): Promise<boolean> {
  try {
    // First check subscription status
    const subscriptionCheck = await checkSubscriptionStatus(userId);
    
    if (subscriptionCheck.hasActiveSubscription) {
      return true;
    }

    // Fallback: check if user has premium flag in profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking premium status:', error);
      return false;
    }

    return profile?.is_premium || false;

  } catch (error) {
    console.error('Error in premium access check:', error);
    return false;
  }
}

/**
 * Get subscription status message for display
 * @param status - Subscription status
 * @returns string
 */
export function getSubscriptionStatusMessage(status?: string): string {
  switch (status) {
    case 'active':
      return 'Your subscription is active';
    case 'canceled':
      return 'Your subscription has been canceled';
    case 'past_due':
      return 'Your payment is past due';
    case 'incomplete':
      return 'Your payment setup is incomplete';
    case 'incomplete_expired':
      return 'Your payment setup has expired';
    case 'trialing':
      return 'Your subscription is in trial period';
    case 'unpaid':
      return 'Your payment is unpaid';
    default:
      return 'No active subscription found';
  }
} 