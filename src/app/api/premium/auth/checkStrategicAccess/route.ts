import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  // Use service role key to bypass RLS policies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Checking strategic access for user:", u_id);

    // Query subscriptions using service role key (bypasses RLS)
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("plan, status, u_id")
      .eq("u_id", u_id)
      .eq("status", "active");

    console.log("📊 Service role query result:", { subscriptions, subscriptionError });

    if (subscriptionError) {
      console.error("❌ Service role query error:", subscriptionError);
      return NextResponse.json(
        { error: "Failed to check subscription" },
        { status: 500 }
      );
    }

    // Check if any of the user's active subscriptions are strategic
    const hasStrategicAccess = subscriptions?.some(sub => sub.plan === 'strategic') || false;
    
    console.log("✅ Strategic access result:", { 
      subscriptions: subscriptions,
      hasAccess: hasStrategicAccess 
    });

    return NextResponse.json({
      hasAccess: hasStrategicAccess,
      subscriptions: subscriptions || []
    });

  } catch (error: any) {
    console.error("Error in checkStrategicAccess:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 