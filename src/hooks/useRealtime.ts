/**
 * React hooks for real-time functionality
 * Provides easy-to-use hooks for components to subscribe to real-time events
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { 
  realtimeManager, 
  RealtimeEvent, 
  RealtimeEventType,
  DashboardUpdateEvent,
  TeamActivityEvent,
  MarketIntelligenceEvent,
  AssessmentCompletedEvent,
  GrowthLeverEvent,
  NotificationEvent
} from '@/lib/realtime';

/**
 * Generic hook for subscribing to real-time events
 */
export function useRealtime<T extends RealtimeEvent>(
  organizationId: string | null,
  eventTypes: RealtimeEventType[],
  callback: (event: T) => void,
  dependencies: any[] = []
) {
  const callbackRef = useRef(callback);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Stable callback that uses the ref
  const stableCallback = useCallback((event: RealtimeEvent) => {
    callbackRef.current(event as T);
  }, []);

  useEffect(() => {
    if (!organizationId) return;

    // Subscribe to real-time events
    const unsubscribe = realtimeManager.subscribeToOrganization(
      organizationId,
      eventTypes,
      stableCallback
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount or dependency change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [organizationId, stableCallback, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);
}

/**
 * Hook for dashboard real-time updates
 */
export function useRealtimeDashboard(
  organizationId: string | null,
  onUpdate: (event: DashboardUpdateEvent) => void
) {
  useRealtime<DashboardUpdateEvent>(
    organizationId,
    ['dashboard_update'],
    onUpdate
  );
}

/**
 * Hook for team activity real-time updates
 */
export function useRealtimeTeamActivity(
  organizationId: string | null,
  onActivity: (event: TeamActivityEvent) => void
) {
  useRealtime<TeamActivityEvent>(
    organizationId,
    ['team_activity'],
    onActivity
  );
}

/**
 * Hook for market intelligence real-time updates
 */
export function useRealtimeMarketIntelligence(
  organizationId: string | null,
  onMarketUpdate: (event: MarketIntelligenceEvent) => void
) {
  useRealtime<MarketIntelligenceEvent>(
    organizationId,
    ['market_intelligence'],
    onMarketUpdate
  );
}

/**
 * Hook for assessment completion real-time updates
 */
export function useRealtimeAssessments(
  organizationId: string | null,
  onAssessmentCompleted: (event: AssessmentCompletedEvent) => void
) {
  useRealtime<AssessmentCompletedEvent>(
    organizationId,
    ['assessment_completed'],
    onAssessmentCompleted
  );
}

/**
 * Hook for growth lever real-time updates
 */
export function useRealtimeGrowthLevers(
  organizationId: string | null,
  onLeverUpdate: (event: GrowthLeverEvent) => void
) {
  useRealtime<GrowthLeverEvent>(
    organizationId,
    ['growth_lever_updated'],
    onLeverUpdate
  );
}

/**
 * Hook for notification real-time updates
 */
export function useRealtimeNotifications(
  organizationId: string | null,
  onNotification: (event: NotificationEvent) => void
) {
  useRealtime<NotificationEvent>(
    organizationId,
    ['notification'],
    onNotification
  );
}

/**
 * Hook for multiple event types
 */
export function useRealtimeMultiple(
  organizationId: string | null,
  eventTypes: RealtimeEventType[],
  onEvent: (event: RealtimeEvent) => void
) {
  useRealtime(
    organizationId,
    eventTypes,
    onEvent
  );
}

/**
 * Hook for user-specific real-time events
 */
export function useRealtimeUser(
  userId: string | null,
  onEvent: (event: RealtimeEvent) => void
) {
  const callbackRef = useRef(onEvent);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    callbackRef.current = onEvent;
  }, [onEvent]);

  const stableCallback = useCallback((event: RealtimeEvent) => {
    callbackRef.current(event);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = realtimeManager.subscribeToUser(
      userId,
      stableCallback
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId, stableCallback]);

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);
}

/**
 * Hook for connection status monitoring
 */
export function useRealtimeStatus(organizationId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEventTime, setLastEventTime] = useState<Date | null>(null);

  useRealtime(
    organizationId,
    ['dashboard_update', 'team_activity', 'market_intelligence', 'assessment_completed', 'growth_lever_updated', 'notification'],
    (event) => {
      setIsConnected(true);
      setLastEventTime(new Date());
    }
  );

  // Check connection status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastEventTime && Date.now() - lastEventTime.getTime() > 60000) {
        setIsConnected(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [lastEventTime]);

  return {
    isConnected,
    lastEventTime
  };
}
