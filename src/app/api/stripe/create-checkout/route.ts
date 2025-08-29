/**
 * Create Stripe checkout session
 * Handles subscription creation with proper error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckoutSession, createStripeCustomer, STRIPE_CONFIG } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';

// Request schema validation
const CreateCheckoutSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  organizationId: z.string().uuid('Valid organization ID required'),
  successUrl: z.string().url('Valid success URL required').optional(),
  cancelUrl: z.string().url('Valid cancel URL required').optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateCheckoutSchema.parse(body);

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get organization and user profile
    const { data: profile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select(`
        *,
        organizations (*)
      `)
      .eq('user_id', user.id)
      .eq('organization_id', validatedData.organizationId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, message: 'Organization not found or access denied' },
        { status: 404 }
      );
    }

    // Check if organization already has a Stripe customer
    let customerId = profile.organizations.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      try {
        const customer = await createStripeCustomer({
          email: user.email!,
          name: `${profile.first_name} ${profile.last_name}`,
          organizationId: validatedData.organizationId,
          metadata: {
            userId: user.id,
            organizationId: validatedData.organizationId,
            environment: env.NODE_ENV
          }
        });

        customerId = customer.id;

        // Update organization with Stripe customer ID
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ stripe_customer_id: customerId })
          .eq('id', validatedData.organizationId);

        if (updateError) {
          console.error('Failed to update organization with Stripe customer ID:', updateError);
          // Continue anyway, we have the customer created
        }

      } catch (error) {
        console.error('Failed to create Stripe customer:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to create customer' },
          { status: 500 }
        );
      }
    }

    // Validate price ID
    const plan = Object.values(STRIPE_CONFIG.plans).find(p => p.id === validatedData.priceId);
    if (!plan) {
      return NextResponse.json(
        { success: false, message: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Create checkout session
    try {
      const session = await createCheckoutSession({
        customerId,
        priceId: validatedData.priceId,
        successUrl: validatedData.successUrl || `${env.NEXT_PUBLIC_APP_URL}/premium/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: validatedData.cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/premium/dashboard`,
        metadata: {
          userId: user.id,
          organizationId: validatedData.organizationId,
          planName: plan.name
        }
      });

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        url: session.url
      });

    } catch (error) {
      console.error('Failed to create checkout session:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Create checkout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
