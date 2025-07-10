import { createClient } from '@supabase/supabase-js'
import { EventEmitter } from 'events'

export interface RealtimeEvent {
  id: string
  event_type: string
  event_data: any
  timestamp: string
  instance_id: string
}

export interface AIStatusUpdate {
  provider: string
  status: 'healthy' | 'degraded' | 'down'
  latency: number
  errorRate: number
  lastCheck: string
}

export interface AIProgressUpdate {
  taskId: string
  progress: number
  status: 'queued' | 'processing' | 'completed' | 'failed'
  message?: string
}

export class RealtimeManager extends EventEmitter {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  private instanceId: string
  private subscriptions: Map<string, any> = new Map()
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor() {
    super()
    this.instanceId = crypto.randomUUID()
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // Handle process termination
    process.on('SIGINT', () => this.cleanup())
    process.on('SIGTERM', () => this.cleanup())
  }

  async connect(): Promise<void> {
    try {
      console.log(`🔌 Connecting to realtime infrastructure (Instance: ${this.instanceId})`)
      
      // Subscribe to event_broadcast table
      const subscription = this.supabase
        .channel('event_broadcast')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'event_broadcast'
          },
          (payload) => {
            this.handleEvent(payload.new as RealtimeEvent)
          }
        )
        .subscribe((status) => {
          console.log(`📡 Realtime subscription status: ${status}`)
          this.isConnected = status === 'SUBSCRIBED'
          
          if (this.isConnected) {
            this.reconnectAttempts = 0
            this.emit('connected')
          } else {
            this.emit('disconnected')
            this.scheduleReconnect()
          }
        })

      this.subscriptions.set('event_broadcast', subscription)
      
    } catch (error) {
      console.error('Failed to connect to realtime infrastructure:', error)
      this.scheduleReconnect()
    }
  }

  async broadcastEvent(eventType: string, eventData: any): Promise<void> {
    try {
      const event: Omit<RealtimeEvent, 'id' | 'timestamp'> = {
        event_type: eventType,
        event_data: eventData,
        instance_id: this.instanceId
      }

      const { error } = await this.supabase
        .from('event_broadcast')
        .insert(event)

      if (error) {
        console.error('Failed to broadcast event:', error)
        throw error
      }

      console.log(`📢 Broadcasted event: ${eventType}`)
    } catch (error) {
      console.error('Error broadcasting event:', error)
      throw error
    }
  }

  async broadcastAIStatusUpdate(update: AIStatusUpdate): Promise<void> {
    await this.broadcastEvent('ai_status_update', update)
  }

  async broadcastAIProgressUpdate(update: AIProgressUpdate): Promise<void> {
    await this.broadcastEvent('ai_progress_update', update)
  }

  async broadcastAITaskComplete(taskId: string, result: any): Promise<void> {
    await this.broadcastEvent('ai_task_complete', { taskId, result })
  }

  async broadcastAITaskFailed(taskId: string, error: string): Promise<void> {
    await this.broadcastEvent('ai_task_failed', { taskId, error })
  }

  async broadcastUserActivity(userId: string, activity: string): Promise<void> {
    await this.broadcastEvent('user_activity', { userId, activity })
  }

  async broadcastSystemAlert(alert: string, severity: 'info' | 'warning' | 'error'): Promise<void> {
    await this.broadcastEvent('system_alert', { alert, severity, timestamp: new Date().toISOString() })
  }

  private handleEvent(event: RealtimeEvent): void {
    // Ignore events from our own instance
    if (event.instance_id === this.instanceId) {
      return
    }

    console.log(`📨 Received event: ${event.event_type} from instance ${event.instance_id}`)

    // Emit the event for other parts of the application to handle
    this.emit(event.event_type, event.event_data)
    this.emit('event', event)
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      this.emit('max_reconnect_attempts_reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`🔄 Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`)
    
    setTimeout(() => {
      this.connect()
    }, delay)
  }

  async getRecentEvents(limit: number = 50): Promise<RealtimeEvent[]> {
    try {
      const { data, error } = await this.supabase
        .from('event_broadcast')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Failed to get recent events:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting recent events:', error)
      return []
    }
  }

  async getEventsByType(eventType: string, limit: number = 20): Promise<RealtimeEvent[]> {
    try {
      const { data, error } = await this.supabase
        .from('event_broadcast')
        .select('*')
        .eq('event_type', eventType)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Failed to get events by type:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting events by type:', error)
      return []
    }
  }

  async getInstanceEvents(instanceId: string, limit: number = 20): Promise<RealtimeEvent[]> {
    try {
      const { data, error } = await this.supabase
        .from('event_broadcast')
        .select('*')
        .eq('instance_id', instanceId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Failed to get instance events:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting instance events:', error)
      return []
    }
  }

  getInstanceId(): string {
    return this.instanceId
  }

  isRealtimeConnected(): boolean {
    return this.isConnected
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up realtime connections...')
    
    // Unsubscribe from all channels
    for (const [name, subscription] of this.subscriptions) {
      try {
        await this.supabase.removeChannel(subscription)
        console.log(`Unsubscribed from ${name}`)
      } catch (error) {
        console.error(`Error unsubscribing from ${name}:`, error)
      }
    }
    
    this.subscriptions.clear()
    this.isConnected = false
    
    console.log('✅ Realtime cleanup completed')
  }
}

// Export singleton instance
export const realtimeManager = new RealtimeManager()

// Auto-connect when module is imported
realtimeManager.connect().catch(console.error) 