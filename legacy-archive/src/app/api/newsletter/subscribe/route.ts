import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidEmail, isDisposableEmail } from "@/lib/utils/validation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, first_name, last_name, company, title, industry, company_size, revenue_range, linkedin_url, source = 'blog_newsletter' } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check for disposable email
    if (await isDisposableEmail(email)) {
      return NextResponse.json(
        { error: "Please use a business email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from("email_subscriptions")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing subscription:", checkError);
      return NextResponse.json(
        { error: "Failed to check existing subscription" },
        { status: 500 }
      );
    }

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return NextResponse.json(
          { error: "You're already subscribed to our newsletter!" },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from("email_subscriptions")
          .update({
            status: 'active',
            unsubscribed_at: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingSubscription.id);

        if (updateError) {
          console.error("Error reactivating subscription:", updateError);
          return NextResponse.json(
            { error: "Failed to reactivate subscription" },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { message: "Welcome back! Your subscription has been reactivated." },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    const { error: insertError } = await supabase
      .from("email_subscriptions")
      .insert([{
        email,
        first_name: first_name || null,
        last_name: last_name || null,
        company: company || null,
        title: title || null,
        industry: industry || null,
        company_size: company_size || null,
        revenue_range: revenue_range || null,
        linkedin_url: linkedin_url || null,
        source,
        status: 'active'
      }]);

    if (insertError) {
      console.error("Error creating subscription:", insertError);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully subscribed to our newsletter!" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get subscription count for display
    const { data, error } = await supabase
      .rpc('get_email_subscription_count');

    if (error) {
      console.error("Error getting subscription count:", error);
      return NextResponse.json(
        { error: "Failed to get subscription count" },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: data || 0 });
  } catch (error) {
    console.error("Error getting subscription count:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 