/**
 * Stripe integration for OptimaliQ
 * Handles payments, subscriptions, and billing management
 */

import Stripe from 'stripe';
import { env } from '@/lib/env';

// Initialize Stripe with secret key
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  plans: {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        'Basic Assessment',
        'Limited Insights',
        'Email Support',
        '1 Team Member'
      ]
    },
    accelerator: {
      id: 'price_accelerator_monthly',
      name: 'Accelerator',
      price: 97,
      interval: 'month',
      features: [
        'Unlimited Assessments',
        'AI Growth Studio',
        'Market Intelligence',
        'Team Collaboration',
        'Priority Support',
        'Up to 10 Team Members'
      ]
    },
    enterprise: {
      id: 'price_enterprise_monthly',
      name: 'Enterprise',
      price: 297,
      interval: 'month',
      features: [
        'Everything in Accelerator',
        'Custom Integrations',
        'White-label Options',
        'Dedicated Success Manager',
        'Unlimited Team Members',
        'Advanced Analytics',
        'Custom Reporting'
      ]
    }
  }
} as const;

// Stripe webhook event types we handle
export type StripeWebhookEvent = 
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'customer.created'
  | 'customer.updated';

/**
 * Create a Stripe customer
 */
export async function createStripeCustomer(params: {
  email: string;
  name: string;
  organizationId: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: {
        organizationId: params.organizationId,
        ...params.metadata
      }
    });

    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create customer');
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: params.customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
      subscription_data: {
        metadata: params.metadata,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw new Error('Failed to create billing portal session');
  }
}

/**
 * Get customer with subscriptions
 */
export async function getCustomerWithSubscriptions(
  customerId: string
): Promise<Stripe.Customer & { subscriptions: Stripe.Subscription[] }> {
  try {
    const customer = await stripe.customers.retrieve(customerId, {
      expand: ['subscriptions'],
    });

    if (customer.deleted) {
      throw new Error('Customer has been deleted');
    }

    return customer as Stripe.Customer & { subscriptions: Stripe.Subscription[] };
  } catch (error) {
    console.error('Error retrieving customer:', error);
    throw new Error('Failed to retrieve customer');
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice', 'customer'],
    });

    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw new Error('Failed to retrieve subscription');
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    });

    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

/**
 * Resume subscription
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    return subscription;
  } catch (error) {
    console.error('Error resuming subscription:', error);
    throw new Error('Failed to resume subscription');
  }
}

/**
 * Update subscription
 */
export async function updateSubscription(params: {
  subscriptionId: string;
  priceId: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.retrieve(params.subscriptionId);
    
    const updatedSubscription = await stripe.subscriptions.update(params.subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: params.priceId,
        },
      ],
      proration_behavior: params.prorationBehavior || 'create_prorations',
    });

    return updatedSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(
  event: Stripe.Event,
  organizationId?: string
): Promise<void> {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    throw error;
  }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  // Update database with subscription details
  console.log('Subscription created:', subscription.id);
  // Implementation would update the subscriptions table
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  // Update database with subscription changes
  console.log('Subscription updated:', subscription.id);
  // Implementation would update the subscriptions table
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  // Update database to reflect canceled subscription
  console.log('Subscription deleted:', subscription.id);
  // Implementation would update the subscriptions table
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  // Update database with successful payment
  console.log('Payment succeeded for invoice:', invoice.id);
  // Implementation would log the payment and update subscription status
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  // Handle failed payment - send notifications, update status
  console.log('Payment failed for invoice:', invoice.id);
  // Implementation would handle payment failure notifications
}

/**
 * Get plan details by price ID
 */
export function getPlanByPriceId(priceId: string) {
  return Object.values(STRIPE_CONFIG.plans).find(plan => plan.id === priceId);
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}
