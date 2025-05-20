export type NotificationType = 
  | 'assessment_reminder'
  | 'system_update'
  | 'subscription'
  | 'profile_update'
  | 'general';

export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  expires_at?: string;
  action_url?: string;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  assessment_reminders: boolean;
  system_updates: boolean;
  subscription_updates: boolean;
  profile_updates: boolean;
  email_notifications: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  loading: boolean;
  error: string | null;
  u_id: string;
} 