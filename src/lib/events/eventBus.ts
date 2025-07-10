import { createClient } from '@supabase/supabase-js'

export interface Event {
  id: string
  type: string
  data: any
  timestamp: Date
  userId?: string
  orgId?: string
  metadata?: {
    source?: string
    priority?: 'low' | 'medium' | 'high'
    tags?: string[]
    correlationId?: string
  }
}

export interface EventHandler {
  id: string
  eventType: string
  handler: Function
  priority: number
  enabled: boolean
}

export interface EventFilter {
  eventType?: string
  userId?: string
  orgId?: string
  tags?: string[]
  priority?: 'low' | 'medium' | 'high'
}

export class EventBus {
  private supabase: any = null

  constructor() {
    // Only create Supabase client if environment variables are available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    }
  }
  
  private listeners: Map<string, EventHandler[]> = new Map()
  private eventHistory: Event[] = []
  private maxHistorySize = 1000
  private isProcessing = false
  private processingQueue: Event[] = []

  /**
   * Emit an event to all registered listeners
   */
  async emit(event: Event): Promise<void> {
    // Add to history
    this.addToHistory(event)
    
    // Add to processing queue
    this.processingQueue.push(event)
    
    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue()
    }
    
    // Also emit to Supabase for real-time updates
    await this.emitToSupabase(event)
  }

  /**
   * Emit event with simplified parameters
   */
  async emitSimple(eventType: string, data: any, userId?: string, orgId?: string): Promise<void> {
    const event: Event = {
      id: this.generateEventId(),
      type: eventType,
      data,
      timestamp: new Date(),
      userId,
      orgId
    }
    
    await this.emit(event)
  }

  /**
   * Register an event listener
   */
  on(eventType: string, handler: Function, priority: number = 0): string {
    const handlerId = this.generateHandlerId()
    
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    
    const eventHandler: EventHandler = {
      id: handlerId,
      eventType,
      handler,
      priority,
      enabled: true
    }
    
    this.listeners.get(eventType)!.push(eventHandler)
    
    // Sort by priority (higher priority first)
    this.listeners.get(eventType)!.sort((a, b) => b.priority - a.priority)
    
    return handlerId
  }

  /**
   * Register a one-time event listener
   */
  once(eventType: string, handler: Function, priority: number = 0): string {
    const wrappedHandler = async (event: Event) => {
      await handler(event)
      this.off(eventType, wrappedHandler)
    }
    
    return this.on(eventType, wrappedHandler, priority)
  }

  /**
   * Remove an event listener
   */
  off(eventType: string, handler: Function): void {
    const listeners = this.listeners.get(eventType) || []
    const index = listeners.findIndex(l => l.handler === handler)
    
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * Remove event listener by ID
   */
  offById(handlerId: string): void {
    for (const [eventType, listeners] of this.listeners.entries()) {
      const index = listeners.findIndex(l => l.id === handlerId)
      if (index > -1) {
        listeners.splice(index, 1)
        break
      }
    }
  }

  /**
   * Get all registered listeners
   */
  getListeners(eventType?: string): EventHandler[] {
    if (eventType) {
      return this.listeners.get(eventType) || []
    }
    
    const allListeners: EventHandler[] = []
    for (const listeners of this.listeners.values()) {
      allListeners.push(...listeners)
    }
    
    return allListeners
  }

  /**
   * Get event history
   */
  getEventHistory(filter?: EventFilter): Event[] {
    let events = [...this.eventHistory]
    
    if (filter) {
      events = events.filter(event => {
        if (filter.eventType && event.type !== filter.eventType) return false
        if (filter.userId && event.userId !== filter.userId) return false
        if (filter.orgId && event.orgId !== filter.orgId) return false
        if (filter.priority && event.metadata?.priority !== filter.priority) return false
        if (filter.tags && filter.tags.length > 0) {
          const eventTags = event.metadata?.tags || []
          if (!filter.tags.some(tag => eventTags.includes(tag))) return false
        }
        return true
      })
    }
    
    return events
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = []
  }

  /**
   * Enable/disable event handler
   */
  setHandlerEnabled(handlerId: string, enabled: boolean): void {
    for (const listeners of this.listeners.values()) {
      const handler = listeners.find(l => l.id === handlerId)
      if (handler) {
        handler.enabled = enabled
        break
      }
    }
  }

  /**
   * Get event statistics
   */
  getStats(): {
    totalEvents: number
    totalListeners: number
    eventTypes: string[]
    recentEvents: number
  } {
    const eventTypes = new Set<string>()
    let totalListeners = 0
    
    for (const [eventType, listeners] of this.listeners.entries()) {
      eventTypes.add(eventType)
      totalListeners += listeners.length
    }
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentEvents = this.eventHistory.filter(event => event.timestamp > oneHourAgo).length
    
    return {
      totalEvents: this.eventHistory.length,
      totalListeners,
      eventTypes: Array.from(eventTypes),
      recentEvents
    }
  }

  /**
   * Process event queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return
    }
    
    this.isProcessing = true
    
    while (this.processingQueue.length > 0) {
      const event = this.processingQueue.shift()!
      await this.processEvent(event)
    }
    
    this.isProcessing = false
  }

  /**
   * Process a single event
   */
  private async processEvent(event: Event): Promise<void> {
    const listeners = this.listeners.get(event.type) || []
    const enabledListeners = listeners.filter(l => l.enabled)
    
    // Process listeners in parallel for better performance
    const promises = enabledListeners.map(async (listener) => {
      try {
        await listener.handler(event)
      } catch (error) {
        console.error(`Error in event handler ${listener.id} for event ${event.type}:`, error)
      }
    })
    
    await Promise.allSettled(promises)
  }

  /**
   * Add event to history
   */
  private addToHistory(event: Event): void {
    this.eventHistory.push(event)
    
    // Maintain history size limit
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }
  }

  /**
   * Emit event to Supabase for real-time updates
   */
  private async emitToSupabase(event: Event): Promise<void> {
    if (!this.supabase) {
      console.log('Supabase not available, skipping event emission to database')
      return
    }

    try {
      await this.supabase
        .from('events')
        .insert({
          event_type: event.type,
          event_data: event.data,
          user_id: event.userId,
          org_id: event.orgId,
          created_at: event.timestamp.toISOString(),
          metadata: event.metadata
        })
    } catch (error) {
      console.error('Failed to emit event to Supabase:', error)
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate unique handler ID
   */
  private generateHandlerId(): string {
    return `handler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Subscribe to events from Supabase
   */
  subscribeToEvents(userId?: string, orgId?: string): void {
    if (!this.supabase) return

    const channel = this.supabase
      .channel('events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'events',
        filter: userId ? `user_id=eq.${userId}` : orgId ? `org_id=eq.${orgId}` : undefined
      }, (payload: any) => {
        const event: Event = {
          id: payload.new.id,
          type: payload.new.event_type,
          data: payload.new.event_data,
          timestamp: new Date(payload.new.created_at),
          userId: payload.new.user_id,
          orgId: payload.new.org_id,
          metadata: payload.new.metadata
        }
        
        this.processEvent(event)
      })
      .subscribe()
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.listeners.clear()
    this.eventHistory = []
    this.processingQueue = []
  }
}

// Global event bus instance (lazy-loaded)
let _eventBus: EventBus | null = null

export function getEventBus(): EventBus {
  if (!_eventBus) {
    _eventBus = new EventBus()
  }
  return _eventBus
}

export const eventBus = getEventBus() 