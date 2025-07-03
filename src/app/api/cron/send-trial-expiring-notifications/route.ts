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

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    let processedCount = 0;
    let errorCount = 0;

    // Get all active trials that expire soon
    const { data: expiringTrials, error: fetchError } = await supabaseAdmin!
      .from("trial_users")
      .select(`
        *,
        tier2_users!inner(email, first_name)
      `)
      .eq("status", "active")
      .gte("trial_end_date", now.toISOString())
      .lte("trial_end_date", threeDaysFromNow.toISOString());

    if (fetchError) {
      console.error("Error fetching expiring trials:", fetchError);
      return NextResponse.json({ error: "Failed to fetch expiring trials" }, { status: 500 });
    }

    if (!expiringTrials || expiringTrials.length === 0) {
      return NextResponse.json({ 
        message: "No trials expiring soon found",
        processedCount: 0 
      });
    }

    console.log(`Found ${expiringTrials.length} trials expiring soon to process`);

    // Process each expiring trial
    for (const trial of expiringTrials) {
      try {
        const trialEndDate = new Date(trial.trial_end_date);
        const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Only send notifications for specific days (3 days, 1 day, and day of)
        if (![0, 1, 3].includes(daysRemaining)) {
          continue;
        }

        // Check if we've already sent a notification for this day
        const lastNotificationKey = `last_expiring_notification_${daysRemaining}`;
        const lastNotification = trial[lastNotificationKey];
        const today = now.toDateString();

        if (lastNotification === today) {
          console.log(`Already sent ${daysRemaining}-day notification for trial ${trial.id}`);
          continue;
        }

        // Send trial expiring soon email
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai';
        await emailService.sendTrialExpiringSoonEmail({
          to: trial.tier2_users.email,
          firstName: trial.tier2_users.first_name,
          daysRemaining,
          trialEndDate: trial.trial_end_date,
          upgradeUrl: `${baseUrl}/premium/account/billing`,
          dashboardUrl: `${baseUrl}/premium/dashboard`
        });

        // Update the last notification date
        const updateData: any = {};
        updateData[lastNotificationKey] = today;

        const { error: updateError } = await supabaseAdmin!
          .from("trial_users")
          .update(updateData)
          .eq("id", trial.id);

        if (updateError) {
          console.error(`Error updating notification date for trial ${trial.id}:`, updateError);
          // Don't fail the whole process, just log the error
        }

        processedCount++;
        console.log(`Sent ${daysRemaining}-day expiring notification for trial: ${trial.id} for user: ${trial.tier2_users.email}`);

      } catch (error) {
        console.error(`Error processing expiring trial ${trial.id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      message: "Trial expiring notifications completed",
      processedCount,
      errorCount,
      totalExpiring: expiringTrials.length
    });

  } catch (error) {
    console.error("Error in trial expiring notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 