import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminClientAvailable } from "@/lib/supabaseAdmin";
import { emailService } from "@/lib/emailService";

export async function GET() {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      }, { status: 503 });
    }

    const now = new Date().toISOString();
    let processedCount = 0;
    let errorCount = 0;

    // Get all active trials that have expired
    const { data: expiredTrials, error: fetchError } = await supabaseAdmin!
      .from("trial_users")
      .select(`
        *,
        tier2_users!inner(email, first_name)
      `)
      .eq("status", "active")
      .lt("trial_end_date", now);

    if (fetchError) {
      console.error("Error fetching expired trials:", fetchError);
      return NextResponse.json({ error: "Failed to fetch expired trials" }, { status: 500 });
    }

    if (!expiredTrials || expiredTrials.length === 0) {
      return NextResponse.json({ 
        message: "No expired trials found",
        processedCount: 0 
      });
    }

    console.log(`Found ${expiredTrials.length} expired trials to process`);

    // Process each expired trial
    for (const trial of expiredTrials) {
      try {
        // Update trial_users status to expired
        const { error: trialUpdateError } = await supabaseAdmin!
          .from("trial_users")
          .update({ status: "expired" })
          .eq("id", trial.id);

        if (trialUpdateError) {
          console.error(`Error updating trial ${trial.id}:`, trialUpdateError);
          errorCount++;
          continue;
        }

        // Update subscription status to expired
        const { error: subscriptionUpdateError } = await supabaseAdmin!
          .from("subscriptions")
          .update({ status: "expired" })
          .eq("u_id", trial.u_id)
          .eq("plan", "trial");

        if (subscriptionUpdateError) {
          console.error(`Error updating subscription for trial ${trial.id}:`, subscriptionUpdateError);
          // Don't fail the whole process, just log the error
        }

        // Send trial expired email
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai';
          await emailService.sendTrialExpiredEmail({
            to: trial.tier2_users.email,
            firstName: trial.tier2_users.first_name,
            upgradeUrl: `${baseUrl}/premium/account/billing`,
            supportUrl: `${baseUrl}/support`
          });
        } catch (emailError) {
          console.error(`Error sending trial expired email for ${trial.id}:`, emailError);
          // Don't fail the whole process, just log the error
        }

        processedCount++;
        console.log(`Processed expired trial: ${trial.id} for user: ${trial.tier2_users.email}`);

      } catch (error) {
        console.error(`Error processing trial ${trial.id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      message: "Trial expiration check completed",
      processedCount,
      errorCount,
      totalExpired: expiredTrials.length
    });

  } catch (error) {
    console.error("Error in trial expiration check:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 