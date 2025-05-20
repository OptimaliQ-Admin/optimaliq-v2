import { supabase } from '@/lib/supabase';
import { NotificationType, NotificationPriority } from '@/lib/types/Notification';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  actionUrl?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  priority = 'medium',
  actionUrl,
  expiresAt,
  metadata = {},
}: CreateNotificationParams) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type,
          title,
          message,
          priority,
          action_url: actionUrl,
          expires_at: expiresAt?.toISOString(),
          metadata,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Helper function to create assessment reminder notifications
export async function createAssessmentReminder(
  userId: string,
  assessmentName: string,
  daysUntilDue: number
) {
  return createNotification({
    userId,
    type: 'assessment_reminder',
    title: 'Assessment Reminder',
    message: `Your ${assessmentName} assessment is due in ${daysUntilDue} days.`,
    priority: 'high',
    actionUrl: `/premium/assessment/${assessmentName.toLowerCase().replace(/\s+/g, '-')}`,
    metadata: {
      assessmentName,
      daysUntilDue,
    },
  });
}

// Helper function to create system update notifications
export async function createSystemUpdate(
  userId: string,
  title: string,
  message: string,
  priority: NotificationPriority = 'medium'
) {
  return createNotification({
    userId,
    type: 'system_update',
    title,
    message,
    priority,
  });
}

// Helper function to create subscription notifications
export async function createSubscriptionNotification(
  userId: string,
  title: string,
  message: string,
  actionUrl?: string
) {
  return createNotification({
    userId,
    type: 'subscription',
    title,
    message,
    priority: 'high',
    actionUrl,
  });
}

// Helper function to create profile update notifications
export async function createProfileUpdateNotification(
  userId: string,
  title: string,
  message: string
) {
  return createNotification({
    userId,
    type: 'profile_update',
    title,
    message,
    priority: 'low',
  });
} 