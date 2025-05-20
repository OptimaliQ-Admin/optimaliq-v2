import { supabase } from '@/lib/supabase';
import { NotificationType, NotificationPriority } from '@/lib/types/Notification';

interface CreateNotificationParams {
  u_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  action_url?: string;
  expires_at?: Date;
  metadata?: Record<string, any>;
}

export async function createNotification({
  u_id,
  type,
  title,
  message,
  priority = 'medium',
  action_url,
  expires_at,
  metadata = {},
}: CreateNotificationParams) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: u_id,
          type,
          title,
          message,
          priority,
          action_url,
          expires_at: expires_at?.toISOString(),
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
  u_id: string,
  assessmentName: string,
  daysUntilDue: number
) {
  return createNotification({
    u_id,
    type: 'assessment_reminder',
    title: 'Assessment Reminder',
    message: `Your ${assessmentName} assessment is due in ${daysUntilDue} days.`,
    priority: 'high',
    action_url: `/premium/assessment/${assessmentName.toLowerCase().replace(/\s+/g, '-')}`,
    metadata: {
      assessmentName,
      daysUntilDue,
    },
  });
}

// Helper function to create system update notifications
export async function createSystemUpdate(
  u_id: string,
  title: string,
  message: string,
  priority: NotificationPriority = 'medium'
) {
  return createNotification({
    u_id,
    type: 'system_update',
    title,
    message,
    priority,
  });
}

// Helper function to create subscription notifications
export async function createSubscriptionNotification(
  u_id: string,
  title: string,
  message: string,
  action_url?: string
) {
  return createNotification({
    u_id,
    type: 'subscription',
    title,
    message,
    priority: 'high',
    action_url,
  });
}

// Helper function to create profile update notifications
export async function createProfileUpdateNotification(
  u_id: string,
  title: string,
  message: string
) {
  return createNotification({
    u_id,
    type: 'profile_update',
    title,
    message,
    priority: 'low',
  });
} 