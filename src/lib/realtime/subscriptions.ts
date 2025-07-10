import { createClient } from '@supabase/supabase-js'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface RealtimeEvent {
  id: string
  type: string
  data: any
  timestamp: Date
  userId?: string
  orgId?: string
}

export interface DashboardUpdate {
  userId: string
  table: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  recordId: string
  data?: any
}

export interface TeamActivity {
  orgId: string
  memberId: string
  activity: string
  data?: any
  timestamp: Date
}

export class RealtimeManager {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  private subscriptions: Map<string, RealtimeChannel> = new Map()
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map()

  /**
   * Subscribe to dashboard updates for a specific user
   */
  subscribeToDashboard(userId: string): RealtimeChannel {
    const channelId = `dashboard:${userId}`
    
    if (this.subscriptions.has(channelId)) {
      return this.subscriptions.get(channelId)!
    }

    const channel = this.supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tier2_dashboard_insights',
        filter: `u_id=eq.${userId}`
      }, (payload) => {
        this.handleDashboardUpdate(payload)
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assessments',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.handleAssessmentUpdate(payload)
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assessment_responses',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.handleAssessmentResponseUpdate(payload)
      })
      .subscribe()

    this.subscriptions.set(channelId, channel)
    return channel
  }

  /**
   * Subscribe to team activity for a specific organization
   */
  subscribeToTeamActivity(orgId: string): RealtimeChannel {
    const channelId = `team:${orgId}`
    
    if (this.subscriptions.has(channelId)) {
      return this.subscriptions.get(channelId)!
    }

    const channel = this.supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assessment_delegations',
        filter: `org_id=eq.${orgId}`
      }, (payload) => {
        this.handleTeamUpdate(payload)
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_members',
        filter: `org_id=eq.${orgId}`
      }, (payload) => {
        this.handleTeamMemberUpdate(payload)
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_activities',
        filter: `org_id=eq.${orgId}`
      }, (payload) => {
        this.handleTeamActivityUpdate(payload)
      })
      .subscribe()

    this.subscriptions.set(channelId, channel)
    return channel
  }

  /**
   * Subscribe to AI service updates
   */
  subscribeToAIServiceUpdates(userId: string): RealtimeChannel {
    const channelId = `ai:${userId}`
    
    if (this.subscriptions.has(channelId)) {
      return this.subscriptions.get(channelId)!
    }

    const channel = this.supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_logs',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.handleAILogUpdate(payload)
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_tasks',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.handleAITaskUpdate(payload)
      })
      .subscribe()

    this.subscriptions.set(channelId, channel)
    return channel
  }

  /**
   * Subscribe to growth studio updates
   */
  subscribeToGrowthStudioUpdates(userId: string): RealtimeChannel {
    const channelId = `growth:${userId}`
    
    if (this.subscriptions.has(channelId)) {
      return this.subscriptions.get(channelId)!
    }

    const channel = this.supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'growth_simulations',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.handleGrowthSimulationUpdate(payload)
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'growth_levers',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.handleGrowthLeverUpdate(payload)
      })
      .subscribe()

    this.subscriptions.set(channelId, channel)
    return channel
  }

  /**
   * Subscribe to custom events
   */
  subscribeToCustomEvents(eventTypes: string[], userId?: string, orgId?: string): RealtimeChannel {
    const channelId = `custom:${userId || orgId || 'global'}`
    
    if (this.subscriptions.has(channelId)) {
      return this.subscriptions.get(channelId)!
    }

    const channel = this.supabase
      .channel(channelId)
      .on('broadcast', { event: 'custom_event' }, (payload) => {
        this.handleCustomEvent(payload)
      })
      .subscribe()

    this.subscriptions.set(channelId, channel)
    return channel
  }

  /**
   * Handle dashboard updates
   */
  private handleDashboardUpdate(payload: any) {
    const event: DashboardUpdate = {
      userId: payload.new?.u_id || payload.old?.u_id,
      table: payload.table,
      action: payload.eventType,
      recordId: payload.new?.insight_id || payload.old?.insight_id,
      data: payload.new || payload.old
    }

    this.emit('dashboard_update', event)
  }

  /**
   * Handle assessment updates
   */
  private handleAssessmentUpdate(payload: any) {
    const event = {
      userId: payload.new?.user_id || payload.old?.user_id,
      table: payload.table,
      action: payload.eventType,
      recordId: payload.new?.id || payload.old?.id,
      data: payload.new || payload.old
    }

    this.emit('assessment_update', event)
  }

  /**
   * Handle assessment response updates
   */
  private handleAssessmentResponseUpdate(payload: any) {
    const event = {
      userId: payload.new?.user_id || payload.old?.user_id,
      table: payload.table,
      action: payload.eventType,
      recordId: payload.new?.id || payload.old?.id,
      data: payload.new || payload.old
    }

    this.emit('assessment_response_update', event)
  }

  /**
   * Handle team updates
   */
  private handleTeamUpdate(payload: any) {
    const event: TeamActivity = {
      orgId: payload.new?.org_id || payload.old?.org_id,
      memberId: payload.new?.member_id || payload.old?.member_id,
      activity: `delegation_${payload.eventType.toLowerCase()}`,
      data: payload.new || payload.old,
      timestamp: new Date()
    }

    this.emit('team_update', event)
  }

  /**
   * Handle team member updates
   */
  private handleTeamMemberUpdate(payload: any) {
    const event: TeamActivity = {
      orgId: payload.new?.org_id || payload.old?.org_id,
      memberId: payload.new?.id || payload.old?.id,
      activity: `member_${payload.eventType.toLowerCase()}`,
      data: payload.new || payload.old,
      timestamp: new Date()
    }

    this.emit('team_member_update', event)
  }

  /**
   * Handle team activity updates
   */
  private handleTeamActivityUpdate(payload: any) {
    const event: TeamActivity = {
      orgId: payload.new?.org_id || payload.old?.org_id,
      memberId: payload.new?.member_id || payload.old?.member_id,
      activity: payload.new?.activity_type || payload.old?.activity_type,
      data: payload.new || payload.old,
      timestamp: new Date()
    }

    this.emit('team_activity_update', event)
  }

  /**
   * Handle AI log updates
   */
  private handleAILogUpdate(payload: any) {
    const event = {
      userId: payload.new?.user_id || payload.old?.user_id,
      table: payload.table,
      action: payload.eventType,
      recordId: payload.new?.id || payload.old?.id,
      data: payload.new || payload.old
    }

    this.emit('ai_log_update', event)
  }

  /**
   * Handle AI task updates
   */
  private handleAITaskUpdate(payload: any) {
    const event = {
      userId: payload.new?.user_id || payload.old?.user_id,
      table: payload.table,
      action: payload.eventType,
      recordId: payload.new?.id || payload.old?.id,
      data: payload.new || payload.old
    }

    this.emit('ai_task_update', event)
  }

  /**
   * Handle growth simulation updates
   */
  private handleGrowthSimulationUpdate(payload: any) {
    const event = {
      userId: payload.new?.user_id || payload.old?.user_id,
      table: payload.table,
      action: payload.eventType,
      recordId: payload.new?.id || payload.old?.id,
      data: payload.new || payload.old
    }

    this.emit('growth_simulation_update', event)
  }

  /**
   * Handle growth lever updates
   */
  private handleGrowthLeverUpdate(payload: any) {
    const event = {
      userId: payload.new?.user_id || payload.old?.user_id,
      table: payload.table,
      action: payload.eventType,
      recordId: payload.new?.id || payload.old?.id,
      data: payload.new || payload.old
    }

    this.emit('growth_lever_update', event)
  }

  /**
   * Handle custom events
   */
  private handleCustomEvent(payload: any) {
    this.emit('custom_event', payload)
  }

  /**
   * Emit events to listeners
   */
  private emit(eventType: string, data: any) {
    const listeners = this.eventListeners.get(eventType) || []
    listeners.forEach(listener => {
      try {
        listener(data)
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error)
      }
    })
  }

  /**
   * Add event listener
   */
  on(eventType: string, listener: (data: any) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType)!.push(listener)
  }

  /**
   * Remove event listener
   */
  off(eventType: string, listener: (data: any) => void) {
    const listeners = this.eventListeners.get(eventType) || []
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll() {
    this.subscriptions.forEach((channel, channelId) => {
      channel.unsubscribe()
      console.log(`Unsubscribed from channel: ${channelId}`)
    })
    this.subscriptions.clear()
    this.eventListeners.clear()
  }

  /**
   * Unsubscribe from specific channel
   */
  unsubscribe(channelId: string) {
    const channel = this.subscriptions.get(channelId)
    if (channel) {
      channel.unsubscribe()
      this.subscriptions.delete(channelId)
      console.log(`Unsubscribed from channel: ${channelId}`)
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; channels: string[] } {
    return {
      connected: this.subscriptions.size > 0,
      channels: Array.from(this.subscriptions.keys())
    }
  }

  /**
   * Broadcast custom event
   */
  async broadcastEvent(eventType: string, data: any, channelId?: string) {
    const channel = channelId ? this.subscriptions.get(channelId) : null
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'custom_event',
        payload: { type: eventType, data }
      })
    }
  }
} 