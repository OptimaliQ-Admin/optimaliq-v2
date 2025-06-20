import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getNextBillingDate } from "@/lib/stripe/getNextBillingDate";

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get next billing date from Stripe
    const result = await getNextBillingDate(customerId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      nextBillingDate: result.nextBillingDate,
      formattedDate: result.formattedDate
    });

  } catch (error) {
    console.error("Error in next billing date API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 