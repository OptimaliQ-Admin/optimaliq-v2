/**
 * Stripe webhook handler
 * Processes Stripe events securely with signature verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature, handleStripeWebhook } from '@/lib/stripe';
import { env } from '@/lib/env';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text();
    
    // Get the Stripe signature from headers
    const headersList = headers();
    const signature = headersList.get('stripe-signature');
    
    if (!signature) {
      console.error('No Stripe signature found in headers');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event;
    try {
      event = verifyWebhookSignature(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Log the event for debugging
    console.log(`Received Stripe webhook: ${event.type}`);

    // Check for duplicate events using idempotency
    const { data: existingEvent } = await supabase
      .from('stripe_events')
      .select('id')
      .eq('stripe_event_id', event.id)
      .single();

    if (existingEvent) {
      console.log(`Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true });
    }

    // Store the event to prevent duplicate processing
    const { error: insertError } = await supabase
      .from('stripe_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        processed_at: new Date().toISOString(),
        data: event.data
      });

    if (insertError) {
      console.error('Failed to store Stripe event:', insertError);
      // Continue processing even if we can't store the event
    }

    // Handle the webhook event
    try {
      await handleStripeWebhook(event);
      
      // Update the stored event as successfully processed
      await supabase
        .from('stripe_events')
        .update({ 
          processed_at: new Date().toISOString(),
          status: 'processed'
        })
        .eq('stripe_event_id', event.id);

      console.log(`Successfully processed Stripe webhook: ${event.type}`);
      
    } catch (processingError) {
      console.error(`Error processing webhook ${event.type}:`, processingError);
      
      // Update the stored event as failed
      await supabase
        .from('stripe_events')
        .update({ 
          status: 'failed',
          error_message: processingError instanceof Error ? processingError.message : 'Unknown error'
        })
        .eq('stripe_event_id', event.id);

      // Return error to trigger Stripe retry
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
