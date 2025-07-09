import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminClientAvailable } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      }, { status: 503 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ 1. Check if user exists in tier2_users
    const { data: tier2User, error: tier2Error } = await supabaseAdmin!
      .from("tier2_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (tier2Error) {
      console.error("Error checking tier2_users:", tier2Error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // ✅ 2. Check if user has Auth account
    const { data: authUsers, error: authError } = await supabaseAdmin!.auth.admin.listUsers();

    if (authError) {
      console.error("Error checking auth users:", authError);
      return NextResponse.json({ error: "Authentication error" }, { status: 500 });
    }

    // Find user by email in the list
    const authUser = authUsers.users.find(user => user.email?.toLowerCase() === email.toLowerCase());

    // ✅ 3. Check subscription status if user exists
    let subscriptionStatus = null;
    if (tier2User) {
      const { data: subscription, error: subError } = await supabaseAdmin!
        .from("subscriptions")
        .select("status")
        .eq("u_id", tier2User.u_id)
        .maybeSingle();

      if (!subError && subscription) {
        subscriptionStatus = subscription.status;
      }
    }

    // ✅ 4. Determine user status and return appropriate response
    let status: 'paid_no_account' | 'paid_with_account' | 'not_paid' | 'not_found';
    let message = '';
    let userInfo = null;
    let account_created = false;

    if (!tier2User) {
      // User doesn't exist in our system
      status = 'not_found';
      message = 'Email not found. Please create a new account.';
      account_created = false;
    } else if (authUser) {
      // User has both tier2_users record and Auth account
      status = 'paid_with_account';
      message = 'Account exists. Please login with your password.';
      account_created = true;
      userInfo = {
        u_id: tier2User.u_id,
        email: tier2User.email,
        first_name: tier2User.first_name,
        last_name: tier2User.last_name,
        // Don't include sensitive info like phone, etc.
      };
    } else if (subscriptionStatus === 'active') {
      // User paid but doesn't have Auth account
      status = 'paid_no_account';
      message = 'We found your payment! Please complete your account setup.';
      account_created = false;
      userInfo = {
        u_id: tier2User.u_id,
        email: tier2User.email,
        first_name: tier2User.first_name,
        last_name: tier2User.last_name,
        company: tier2User.company,
        title: tier2User.title,
        // Include more info for account completion
      };
    } else {
      // User exists but no active subscription
      status = 'not_paid';
      message = 'Please subscribe to access OptimaliQ.';
      account_created = false;
      userInfo = {
        u_id: tier2User.u_id,
        email: tier2User.email,
        first_name: tier2User.first_name,
        last_name: tier2User.last_name,
        // Include info for subscription flow
      };
    }

    return NextResponse.json({
      status,
      message,
      userInfo,
      subscriptionStatus,
      email: email.toLowerCase(),
      account_created
    });

  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
} 