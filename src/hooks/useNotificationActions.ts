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
    actionUrl,
    expiresAt,
    metadata = {},
  }: {
    type: NotificationType;
    title: string;
    message: string;
    priority?: NotificationPriority;
    actionUrl?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
  }) => {
    // Check user preferences before creating notification
    const preferenceKey = `${type.replace('_', '')}s` as keyof typeof state.preferences;
    if (state.preferences[preferenceKey] === false) {
      return null;
    }

    return createNotification({
      userId: state.userId,
      type,
      title,
      message,
      priority,
      actionUrl,
      expiresAt,
      metadata,
    });
  }, [state.preferences, state.userId]);

  const createAssessmentReminderWithPreferences = useCallback(async (
    assessmentName: string,
    daysUntilDue: number
  ) => {
    if (!state.preferences.assessmentReminders) {
      return null;
    }

    return createAssessmentReminder(
      state.userId,
      assessmentName,
      daysUntilDue
    );
  }, [state.preferences.assessmentReminders, state.userId]);

  const createSystemUpdateWithPreferences = useCallback(async (
    title: string,
    message: string,
    priority: NotificationPriority = 'medium'
  ) => {
    if (!state.preferences.systemUpdates) {
      return null;
    }

    return createSystemUpdate(
      state.userId,
      title,
      message,
      priority
    );
  }, [state.preferences.systemUpdates, state.userId]);

  const createSubscriptionNotificationWithPreferences = useCallback(async (
    title: string,
    message: string,
    actionUrl?: string
  ) => {
    if (!state.preferences.subscriptionUpdates) {
      return null;
    }

    return createSubscriptionNotification(
      state.userId,
      title,
      message,
      actionUrl
    );
  }, [state.preferences.subscriptionUpdates, state.userId]);

  const createProfileUpdateNotificationWithPreferences = useCallback(async (
    title: string,
    message: string
  ) => {
    if (!state.preferences.profileUpdates) {
      return null;
    }

    return createProfileUpdateNotification(
      state.userId,
      title,
      message
    );
  }, [state.preferences.profileUpdates, state.userId]);

  return {
    createNotification: createNotificationWithPreferences,
    createAssessmentReminder: createAssessmentReminderWithPreferences,
    createSystemUpdate: createSystemUpdateWithPreferences,
    createSubscriptionNotification: createSubscriptionNotificationWithPreferences,
    createProfileUpdateNotification: createProfileUpdateNotificationWithPreferences,
  };
} 