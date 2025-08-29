/**
 * Real-time WebSocket integration for OptimaliQ
 * Provides live updates for dashboard metrics, team activity, and market intelligence
 */

import { supabase } from '@/lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Real-time event types
export type RealtimeEventType = 
  | 'dashboard_update'
  | 'team_activity'
  | 'market_intelligence'
  | 'assessment_completed'
  | 'growth_lever_updated'
  | 'notification';

// Event payload interfaces
export interface DashboardUpdateEvent {
  type: 'dashboard_update';
  userId: string;
  organizationId: string;
  metrics: {
    overallScore?: number;
    growthPotential?: number;
    efficiencyScore?: number;
    marketPosition?: number;
    teamPerformance?: number;
  };
  timestamp: string;
}

export interface TeamActivityEvent {
  type: 'team_activity';
  userId: string;
  organizationId: string;
  activity: {
    memberId: string;
    memberName: string;
    action: string;
    details?: string;
  };
  timestamp: string;
}

export interface MarketIntelligenceEvent {
  type: 'market_intelligence';
  organizationId: string;
  trend: {
    id: string;
    title: string;
    category: string;
    impact: 'High' | 'Medium' | 'Low';
    relevanceScore: number;
  };
  timestamp: string;
}

export interface AssessmentCompletedEvent {
  type: 'assessment_completed';
  userId: string;
  organizationId: string;
  assessment: {
    id: string;
    type: string;
    score: number;
    completedBy: string;
  };
  timestamp: string;
}

export interface GrowthLeverEvent {
  type: 'growth_lever_updated';
  organizationId: string;
  lever: {
    id: string;
    title: string;
    progress: number;
    status: 'active' | 'paused' | 'completed';
  };
  timestamp: string;
}

export interface NotificationEvent {
  type: 'notification';
  userId: string;
  organizationId: string;
  notification: {
    id: string;
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  };
  timestamp: string;
}

export type RealtimeEvent = 
  | DashboardUpdateEvent
  | TeamActivityEvent
  | MarketIntelligenceEvent
  | AssessmentCompletedEvent
  | GrowthLeverEvent
  | NotificationEvent;

// Real-time subscription manager
export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private listeners: Map<string, Set<(event: RealtimeEvent) => void>> = new Map();

  /**
   * Subscribe to real-time events for a specific organization
   */
  subscribeToOrganization(
    organizationId: string,
    eventTypes: RealtimeEventType[],
    callback: (event: RealtimeEvent) => void
  ): () => void {
    const channelName = `org:${organizationId}`;
    
    // Create channel if it doesn't exist
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'realtime_events',
            filter: `organization_id=eq.${organizationId}`
          },
          (payload: RealtimePostgresChangesPayload<any>) => {
            this.handleDatabaseEvent(payload);
          }
        )
        .subscribe();

      this.channels.set(channelName, channel);
      this.listeners.set(channelName, new Set());
    }

    // Add listener
    const listeners = this.listeners.get(channelName)!;
    listeners.add(callback);

    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
      
      // Clean up channel if no more listeners
      if (listeners.size === 0) {
        const channel = this.channels.get(channelName);
        if (channel) {
          supabase.removeChannel(channel);
          this.channels.delete(channelName);
          this.listeners.delete(channelName);
        }
      }
    };
  }

  /**
   * Subscribe to user-specific events
   */
  subscribeToUser(
    userId: string,
    callback: (event: RealtimeEvent) => void
  ): () => void {
    const channelName = `user:${userId}`;
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'realtime_events',
            filter: `user_id=eq.${userId}`
          },
          (payload: RealtimePostgresChangesPayload<any>) => {
            this.handleDatabaseEvent(payload);
          }
        )
        .subscribe();

      this.channels.set(channelName, channel);
      this.listeners.set(channelName, new Set());
    }

    const listeners = this.listeners.get(channelName)!;
    listeners.add(callback);

    return () => {
      listeners.delete(callback);
      
      if (listeners.size === 0) {
        const channel = this.channels.get(channelName);
        if (channel) {
          supabase.removeChannel(channel);
          this.channels.delete(channelName);
          this.listeners.delete(channelName);
        }
      }
    };
  }

  /**
   * Publish an event to the real-time system
   */
  async publishEvent(event: RealtimeEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('realtime_events')
        .insert({
          event_type: event.type,
          user_id: 'userId' in event ? event.userId : null,
          organization_id: 'organizationId' in event ? event.organizationId : null,
          payload: event,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to publish real-time event:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error publishing real-time event:', error);
      throw error;
    }
  }

  /**
   * Handle database events and distribute to listeners
   */
  private handleDatabaseEvent(payload: RealtimePostgresChangesPayload<any>): void {
    try {
      const event = payload.new?.payload as RealtimeEvent;
      if (!event) return;

      // Distribute to organization listeners
      if ('organizationId' in event) {
        const orgChannelName = `org:${event.organizationId}`;
        const orgListeners = this.listeners.get(orgChannelName);
        if (orgListeners) {
          orgListeners.forEach(listener => listener(event));
        }
      }

      // Distribute to user listeners
      if ('userId' in event) {
        const userChannelName = `user:${event.userId}`;
        const userListeners = this.listeners.get(userChannelName);
        if (userListeners) {
          userListeners.forEach(listener => listener(event));
        }
      }
    } catch (error) {
      console.error('Error handling real-time database event:', error);
    }
  }

  /**
   * Cleanup all subscriptions
   */
  cleanup(): void {
    this.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.listeners.clear();
  }
}

// Singleton instance
export const realtimeManager = new RealtimeManager();

// Convenience hooks for common use cases
export const useRealtimeDashboard = (
  organizationId: string,
  callback: (event: DashboardUpdateEvent) => void
) => {
  return realtimeManager.subscribeToOrganization(
    organizationId,
    ['dashboard_update'],
    (event) => {
      if (event.type === 'dashboard_update') {
        callback(event);
      }
    }
  );
};

export const useRealtimeTeamActivity = (
  organizationId: string,
  callback: (event: TeamActivityEvent) => void
) => {
  return realtimeManager.subscribeToOrganization(
    organizationId,
    ['team_activity'],
    (event) => {
      if (event.type === 'team_activity') {
        callback(event);
      }
    }
  );
};

export const useRealtimeMarketIntelligence = (
  organizationId: string,
  callback: (event: MarketIntelligenceEvent) => void
) => {
  return realtimeManager.subscribeToOrganization(
    organizationId,
    ['market_intelligence'],
    (event) => {
      if (event.type === 'market_intelligence') {
        callback(event);
      }
    }
  );
};

// Helper functions for publishing common events
export const publishDashboardUpdate = async (
  userId: string,
  organizationId: string,
  metrics: DashboardUpdateEvent['metrics']
): Promise<void> => {
  await realtimeManager.publishEvent({
    type: 'dashboard_update',
    userId,
    organizationId,
    metrics,
    timestamp: new Date().toISOString()
  });
};

export const publishTeamActivity = async (
  userId: string,
  organizationId: string,
  activity: TeamActivityEvent['activity']
): Promise<void> => {
  await realtimeManager.publishEvent({
    type: 'team_activity',
    userId,
    organizationId,
    activity,
    timestamp: new Date().toISOString()
  });
};

export const publishAssessmentCompleted = async (
  userId: string,
  organizationId: string,
  assessment: AssessmentCompletedEvent['assessment']
): Promise<void> => {
  await realtimeManager.publishEvent({
    type: 'assessment_completed',
    userId,
    organizationId,
    assessment,
    timestamp: new Date().toISOString()
  });
};
