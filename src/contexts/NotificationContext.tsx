"use client";

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { supabase } from '@/lib/supabase';
import { usePremiumUser } from '@/hooks/usePremiumUser';
import { Notification, NotificationPreferences, NotificationState } from '@/lib/types/Notification';
import toast from 'react-hot-toast';

type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'SET_PREFERENCES'; payload: NotificationPreferences }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_U_ID'; payload: string };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  preferences: {
    assessmentReminders: true,
    systemUpdates: true,
    subscriptionUpdates: true,
    profileUpdates: true,
    emailNotifications: true,
  },
  loading: false,
  error: null,
  u_id: '',
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + (action.payload.read ? 0 : 1),
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: state.notifications.filter(n => n.id !== action.payload && !n.read).length,
      };
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_U_ID':
      return {
        ...state,
        u_id: action.payload,
      };
    default:
      return state;
  }
}

const NotificationContext = createContext<{
  state: NotificationState;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
} | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = usePremiumUser();

  // Set user ID when user is available
  useEffect(() => {
    if (user?.u_id) {
      dispatch({ type: 'SET_U_ID', payload: user.u_id });
    }
  }, [user?.u_id]);

  // Fetch initial notifications and preferences
  useEffect(() => {
    if (!user?.u_id) return;

    const fetchNotifications = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const { data: notifications, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.u_id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notifications' });
        console.error('Error fetching notifications:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const fetchPreferences = async () => {
      try {
        const { data: preferences, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.u_id)
          .single();

        if (error) throw error;
        dispatch({ type: 'SET_PREFERENCES', payload: preferences });
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      }
    };

    fetchNotifications();
    fetchPreferences();
  }, [user?.u_id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.u_id) return;

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.u_id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
          
          // Show toast for high priority notifications
          if (newNotification.priority === 'high') {
            toast.custom((t) => (
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900">{newNotification.title}</h3>
                <p className="text-gray-600">{newNotification.message}</p>
              </div>
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.u_id]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'MARK_AS_READ', payload: id });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.u_id) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.u_id)
        .eq('read', false);

      if (error) throw error;
      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const updatePreferences = async (preferences: Partial<NotificationPreferences>) => {
    if (!user?.u_id) return;

    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.u_id,
          ...preferences,
        });

      if (error) throw error;
      dispatch({ type: 'SET_PREFERENCES', payload: { ...state.preferences, ...preferences } });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        state,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 