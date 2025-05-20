import { useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { createNotification, createAssessmentReminder, createSystemUpdate, createSubscriptionNotification, createProfileUpdateNotification } from '@/lib/notifications/createNotification';
import { NotificationType, NotificationPriority } from '@/lib/types/Notification';

export function useNotificationActions() {
  const { state } = useNotifications();

  const createNotificationWithPreferences = useCallback(async ({
    type,
    title,
    message,
    priority = 'medium',
    action_url,
    expires_at,
    metadata = {},
  }: {
    type: NotificationType;
    title: string;
    message: string;
    priority?: NotificationPriority;
    action_url?: string;
    expires_at?: Date;
    metadata?: Record<string, any>;
  }) => {
    // Check user preferences before creating notification
    const preferenceKey = `${type.replace('_', '')}s` as keyof typeof state.preferences;
    if (state.preferences[preferenceKey] === false) {
      return null;
    }

    return createNotification({
      user_id: state.u_id,
      type,
      title,
      message,
      priority,
      action_url,
      expires_at,
      metadata,
    });
  }, [state.preferences, state.u_id]);

  const createAssessmentReminderWithPreferences = useCallback(async (
    assessmentName: string,
    daysUntilDue: number
  ) => {
    if (!state.preferences.assessmentReminders) {
      return null;
    }

    return createAssessmentReminder(
      state.u_id,
      assessmentName,
      daysUntilDue
    );
  }, [state.preferences.assessmentReminders, state.u_id]);

  const createSystemUpdateWithPreferences = useCallback(async (
    title: string,
    message: string,
    priority: NotificationPriority = 'medium'
  ) => {
    if (!state.preferences.systemUpdates) {
      return null;
    }

    return createSystemUpdate(
      state.u_id,
      title,
      message,
      priority
    );
  }, [state.preferences.systemUpdates, state.u_id]);

  const createSubscriptionNotificationWithPreferences = useCallback(async (
    title: string,
    message: string,
    action_url?: string
  ) => {
    if (!state.preferences.subscriptionUpdates) {
      return null;
    }

    return createSubscriptionNotification(
      state.u_id,
      title,
      message,
      action_url
    );
  }, [state.preferences.subscriptionUpdates, state.u_id]);

  const createProfileUpdateNotificationWithPreferences = useCallback(async (
    title: string,
    message: string
  ) => {
    if (!state.preferences.profileUpdates) {
      return null;
    }

    return createProfileUpdateNotification(
      state.u_id,
      title,
      message
    );
  }, [state.preferences.profileUpdates, state.u_id]);

  return {
    createNotification: createNotificationWithPreferences,
    createAssessmentReminder: createAssessmentReminderWithPreferences,
    createSystemUpdate: createSystemUpdateWithPreferences,
    createSubscriptionNotification: createSubscriptionNotificationWithPreferences,
    createProfileUpdateNotification: createProfileUpdateNotificationWithPreferences,
  };
} 