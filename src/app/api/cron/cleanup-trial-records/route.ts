import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminClientAvailable } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      }, { status: 503 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    let processedCount = 0;
    let errorCount = 0;
    let archivedCount = 0;

    // 1. Archive very old expired trials (older than 90 days)
    const { data: oldExpiredTrials, error: fetchOldError } = await supabaseAdmin!
      .from("trial_users")
      .select("*")
      .eq("status", "expired")
      .lt("trial_end_date", ninetyDaysAgo.toISOString());

    if (fetchOldError) {
      console.error("Error fetching old expired trials:", fetchOldError);
    } else if (oldExpiredTrials && oldExpiredTrials.length > 0) {
      console.log(`Found ${oldExpiredTrials.length} old expired trials to archive`);

      for (const trial of oldExpiredTrials) {
        try {
          // Update status to archived
          const { error: archiveError } = await supabaseAdmin!
            .from("trial_users")
            .update({ status: "archived" })
            .eq("id", trial.id);

          if (archiveError) {
            console.error(`Error archiving trial ${trial.id}:`, archiveError);
            errorCount++;
          } else {
            archivedCount++;
            console.log(`Archived old trial: ${trial.id}`);
          }
        } catch (error) {
          console.error(`Error processing old trial ${trial.id}:`, error);
          errorCount++;
        }
      }
    }

    // 2. Clean up orphaned trial records (trials without corresponding users)
    const { data: orphanedTrials, error: fetchOrphanedError } = await supabaseAdmin!
      .from("trial_users")
      .select("*")
      .is("u_id", null);

    if (fetchOrphanedError) {
      console.error("Error fetching orphaned trials:", fetchOrphanedError);
    } else if (orphanedTrials && orphanedTrials.length > 0) {
      console.log(`Found ${orphanedTrials.length} orphaned trials to clean up`);

      for (const trial of orphanedTrials) {
        try {
          // Delete orphaned trial records
          const { error: deleteError } = await supabaseAdmin!
            .from("trial_users")
            .delete()
            .eq("id", trial.id);

          if (deleteError) {
            console.error(`Error deleting orphaned trial ${trial.id}:`, deleteError);
            errorCount++;
          } else {
            processedCount++;
            console.log(`Deleted orphaned trial: ${trial.id}`);
          }
        } catch (error) {
          console.error(`Error processing orphaned trial ${trial.id}:`, error);
          errorCount++;
        }
      }
    }

    // 3. Sync trial statuses with subscription statuses
    const { data: activeTrials, error: fetchActiveError } = await supabaseAdmin!
      .from("trial_users")
      .select(`
        *,
        subscriptions!inner(status)
      `)
      .eq("status", "active");

    if (fetchActiveError) {
      console.error("Error fetching active trials for sync:", fetchActiveError);
    } else if (activeTrials && activeTrials.length > 0) {
      console.log(`Found ${activeTrials.length} active trials to sync`);

      for (const trial of activeTrials) {
        try {
          // Check if subscription status doesn't match trial status
          if (trial.subscriptions && trial.subscriptions.length > 0) {
            const subscription = trial.subscriptions[0];
            if (subscription.status !== "trial" && subscription.status !== "active") {
              // Update trial status to match subscription
              const { error: syncError } = await supabaseAdmin!
                .from("trial_users")
                .update({ status: subscription.status })
                .eq("id", trial.id);

              if (syncError) {
                console.error(`Error syncing trial ${trial.id}:`, syncError);
                errorCount++;
              } else {
                processedCount++;
                console.log(`Synced trial ${trial.id} status to: ${subscription.status}`);
              }
            }
          }
        } catch (error) {
          console.error(`Error syncing trial ${trial.id}:`, error);
          errorCount++;
        }
      }
    }

    // 4. Clean up notification tracking fields for trials older than 30 days
    const { data: oldTrials, error: fetchOldTrialsError } = await supabaseAdmin!
      .from("trial_users")
      .select("*")
      .lt("trial_end_date", thirtyDaysAgo.toISOString());

    if (fetchOldTrialsError) {
      console.error("Error fetching old trials for cleanup:", fetchOldTrialsError);
    } else if (oldTrials && oldTrials.length > 0) {
      console.log(`Found ${oldTrials.length} old trials to clean notification fields`);

      for (const trial of oldTrials) {
        try {
          // Remove notification tracking fields
          const updateData: any = {};
          ['last_expiring_notification_0', 'last_expiring_notification_1', 'last_expiring_notification_3'].forEach(field => {
            if (trial[field]) {
              updateData[field] = null;
            }
          });

          if (Object.keys(updateData).length > 0) {
            const { error: cleanupError } = await supabaseAdmin!
              .from("trial_users")
              .update(updateData)
              .eq("id", trial.id);

            if (cleanupError) {
              console.error(`Error cleaning notification fields for trial ${trial.id}:`, cleanupError);
              errorCount++;
            } else {
              processedCount++;
              console.log(`Cleaned notification fields for trial: ${trial.id}`);
            }
          }
        } catch (error) {
          console.error(`Error cleaning trial ${trial.id}:`, error);
          errorCount++;
        }
      }
    }

    return NextResponse.json({
      message: "Trial cleanup completed",
      processedCount,
      archivedCount,
      errorCount,
      summary: {
        oldExpiredArchived: archivedCount,
        orphanedDeleted: processedCount - archivedCount,
        statusesSynced: processedCount
      }
    });

  } catch (error) {
    console.error("Error in trial cleanup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 