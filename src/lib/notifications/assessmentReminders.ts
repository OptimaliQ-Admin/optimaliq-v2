import { supabase } from '@/lib/supabase';
import { createAssessmentReminder } from './createNotification';

export async function checkAndCreateAssessmentReminders() {
  try {
    // Get all users with active subscriptions
    const { data: users, error: usersError } = await supabase
      .from('tier2_users')
      .select('u_id, email')
      .eq('subscription_status', 'active');

    if (usersError) throw usersError;

    // Get the latest assessment dates for each user
    const { data: assessments, error: assessmentsError } = await supabase
      .from('onboarding_assessments')
      .select('u_id, created_at')
      .order('created_at', { ascending: false });

    if (assessmentsError) throw assessmentsError;

    // Process each user
    for (const user of users) {
      const userAssessments = assessments.filter(a => a.u_id === user.u_id);
      if (!userAssessments.length) continue;

      const latestAssessment = userAssessments[0];
      const assessmentDate = new Date(latestAssessment.created_at);
      const now = new Date();
      const daysSinceAssessment = Math.floor((now.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24));

      // Check if assessment is due (30 days)
      if (daysSinceAssessment >= 30) {
        // Check if user has notification preferences
        const { data: preferences } = await supabase
          .from('notification_preferences')
          .select('assessment_reminders')
          .eq('user_id', user.u_id)
          .single();

        // Only create reminder if user has enabled assessment reminders
        if (preferences?.assessment_reminders !== false) {
          await createAssessmentReminder(
            user.u_id,
            'Initial Assessment',
            0 // Due now
          );
        }
      }
      // Create reminder 7 days before due date
      else if (daysSinceAssessment === 23) {
        const { data: preferences } = await supabase
          .from('notification_preferences')
          .select('assessment_reminders')
          .eq('user_id', user.u_id)
          .single();

        if (preferences?.assessment_reminders !== false) {
          await createAssessmentReminder(
            user.u_id,
            'Initial Assessment',
            7
          );
        }
      }
    }
  } catch (error) {
    console.error('Error checking assessment reminders:', error);
    throw error;
  }
}

// Function to check if a user needs an assessment reminder
export async function checkUserAssessmentReminder(userId: string) {
  try {
    // Get user's latest assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('onboarding_assessments')
      .select('created_at')
      .eq('u_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (assessmentError) throw assessmentError;

    const assessmentDate = new Date(assessment.created_at);
    const now = new Date();
    const daysSinceAssessment = Math.floor((now.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24));

    // Check if assessment is due (30 days)
    if (daysSinceAssessment >= 30) {
      // Check user preferences
      const { data: preferences } = await supabase
        .from('notification_preferences')
        .select('assessment_reminders')
        .eq('user_id', userId)
        .single();

      if (preferences?.assessment_reminders !== false) {
        await createAssessmentReminder(
          userId,
          'Initial Assessment',
          0
        );
        return true;
      }
    }
    // Create reminder 7 days before due date
    else if (daysSinceAssessment === 23) {
      const { data: preferences } = await supabase
        .from('notification_preferences')
        .select('assessment_reminders')
        .eq('user_id', userId)
        .single();

      if (preferences?.assessment_reminders !== false) {
        await createAssessmentReminder(
          userId,
          'Initial Assessment',
          7
        );
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking user assessment reminder:', error);
    throw error;
  }
} 