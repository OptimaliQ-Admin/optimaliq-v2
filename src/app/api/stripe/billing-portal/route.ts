/**
 * Create Stripe billing portal session
 * Allows customers to manage their subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBillingPortalSession } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';

// Request schema validation
const BillingPortalSchema = z.object({
  organizationId: z.string().uuid('Valid organization ID required'),
  returnUrl: z.string().url('Valid return URL required').optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = BillingPortalSchema.parse(body);

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

    // Get organization with Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select(`
        *,
        organizations (
          id,
          name,
          stripe_customer_id
        )
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

    // Check if organization has a Stripe customer
    const customerId = profile.organizations.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'No billing account found' },
        { status: 404 }
      );
    }

    // Create billing portal session
    try {
      const session = await createBillingPortalSession({
        customerId,
        returnUrl: validatedData.returnUrl || `${env.NEXT_PUBLIC_APP_URL}/premium/dashboard`
      });

      return NextResponse.json({
        success: true,
        url: session.url
      });

    } catch (error) {
      console.error('Failed to create billing portal session:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create billing portal session' },
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

    console.error('Billing portal error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
