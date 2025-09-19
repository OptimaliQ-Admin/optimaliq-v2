# Stripe Rules — Webhooks & Security

## Core Principles
- Use Checkout + Billing Portal. Webhooks verified; idempotency keys on server. Never expose secret keys client-side.

## Webhook Handler Pattern
```typescript
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Handle event with idempotency
    await handleStripeEvent(event);
    
    return new Response('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
```

## Security Checklist
- [ ] Webhook signature verification
- [ ] Idempotency keys for mutations
- [ ] No secret keys in client code
- [ ] Test mode for development
