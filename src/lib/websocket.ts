/**
 * OptimaliQ WebSocket Service
 * Real-time communication and collaboration features
 */

export interface WebSocketMessage {
  id: string
  type: 'notification' | 'chat' | 'update' | 'presence' | 'activity' | 'collaboration'
  data: any
  timestamp: Date
  sender?: string
  room?: string
}

export interface WebSocketConnection {
  id: string
  userId: string
  status: 'connected' | 'disconnected' | 'connecting'
  lastSeen: Date
  room?: string
}

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: Map<string, (message: WebSocketMessage) => void> = new Map()
  private connectionHandlers: Map<string, (status: string) => void> = new Map()
  private isConnecting = false

  constructor(private url: string, private token?: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        reject(new Error('Connection already in progress'))
        return
      }

      this.isConnecting = true

      try {
        const wsUrl = this.token ? `${this.url}?token=${this.token}` : this.url
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.notifyConnectionHandlers('connected')
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason)
          this.isConnecting = false
          this.notifyConnectionHandlers('disconnected')
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.isConnecting = false
          this.notifyConnectionHandlers('error')
          reject(error)
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected')
      this.ws = null
    }
  }

  send(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected')
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date()
    }

    this.ws.send(JSON.stringify(fullMessage))
  }

  joinRoom(room: string): void {
    this.send({
      type: 'update',
      data: { action: 'join_room', room }
    })
  }

  leaveRoom(room: string): void {
    this.send({
      type: 'update',
      data: { action: 'leave_room', room }
    })
  }

  subscribeToMessageType(type: string, handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.set(type, handler)
  }

  unsubscribeFromMessageType(type: string): void {
    this.messageHandlers.delete(type)
  }

  onConnectionChange(handler: (status: string) => void): void {
    this.connectionHandlers.set('connection', handler)
  }

  private handleMessage(message: WebSocketMessage): void {
    const handler = this.messageHandlers.get(message.type)
    if (handler) {
      handler(message)
    }
  }

  private notifyConnectionHandlers(status: string): void {
    this.connectionHandlers.forEach(handler => handler(status))
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.connect().catch(error => {
        console.error('Reconnection failed:', error)
      })
    }, delay)
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  getConnectionStatus(): string {
    if (!this.ws) return 'disconnected'
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting'
      case WebSocket.OPEN: return 'connected'
      case WebSocket.CLOSING: return 'closing'
      case WebSocket.CLOSED: return 'disconnected'
      default: return 'unknown'
    }
  }
}

// Real-time notification service
export class NotificationService {
  private wsService: WebSocketService
  private notifications: WebSocketMessage[] = []

  constructor(wsService: WebSocketService) {
    this.wsService = wsService
    this.setupNotificationHandlers()
  }

  private setupNotificationHandlers(): void {
    this.wsService.subscribeToMessageType('notification', (message) => {
      this.notifications.push(message)
      this.showNotification(message)
    })
  }

  private showNotification(message: WebSocketMessage): void {
    // Browser notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message.data.title || 'OptimaliQ', {
        body: message.data.message,
        icon: '/favicon.ico',
        tag: message.id
      })
    }

    // Custom notification toast (implement with your UI library)
    this.dispatchCustomNotification(message)
  }

  private dispatchCustomNotification(message: WebSocketMessage): void {
    const event = new CustomEvent('optimaliq-notification', {
      detail: message
    })
    window.dispatchEvent(event)
  }

  getNotifications(): WebSocketMessage[] {
    return this.notifications
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.data.read = true
    }
  }

  clearNotifications(): void {
    this.notifications = []
  }
}

// Real-time chat service
export class ChatService {
  private wsService: WebSocketService
  private messages: Map<string, WebSocketMessage[]> = new Map()
  private messageHandlers: Map<string, (messages: WebSocketMessage[]) => void> = new Map()

  constructor(wsService: WebSocketService) {
    this.wsService = wsService
    this.setupChatHandlers()
  }

  private setupChatHandlers(): void {
    this.wsService.subscribeToMessageType('chat', (message) => {
      const room = message.room || 'general'
      if (!this.messages.has(room)) {
        this.messages.set(room, [])
      }
      this.messages.get(room)!.push(message)
      
      const handler = this.messageHandlers.get(room)
      if (handler) {
        handler(this.messages.get(room)!)
      }
    })
  }

  sendMessage(room: string, content: string, sender: string): void {
    this.wsService.send({
      type: 'chat',
      data: { content, sender },
      room
    })
  }

  joinChatRoom(room: string): void {
    this.wsService.joinRoom(room)
  }

  leaveChatRoom(room: string): void {
    this.wsService.leaveRoom(room)
  }

  onMessage(room: string, handler: (messages: WebSocketMessage[]) => void): void {
    this.messageHandlers.set(room, handler)
  }

  getMessages(room: string): WebSocketMessage[] {
    return this.messages.get(room) || []
  }
}

// Real-time collaboration service
export class CollaborationService {
  private wsService: WebSocketService
  private collaborators: Map<string, Set<string>> = new Map()
  private presenceHandlers: Map<string, (users: string[]) => void> = new Map()

  constructor(wsService: WebSocketService) {
    this.wsService = wsService
    this.setupCollaborationHandlers()
  }

  private setupCollaborationHandlers(): void {
    this.wsService.subscribeToMessageType('presence', (message) => {
      const room = message.room || 'general'
      const userId = message.sender || 'unknown'
      
      if (message.data.action === 'join') {
        if (!this.collaborators.has(room)) {
          this.collaborators.set(room, new Set())
        }
        this.collaborators.get(room)!.add(userId)
      } else if (message.data.action === 'leave') {
        this.collaborators.get(room)?.delete(userId)
      }

      const handler = this.presenceHandlers.get(room)
      if (handler) {
        handler(Array.from(this.collaborators.get(room) || []))
      }
    })

    this.wsService.subscribeToMessageType('collaboration', (message) => {
      // Handle real-time collaboration updates
      this.dispatchCollaborationUpdate(message)
    })
  }

  joinCollaboration(room: string, userId: string): void {
    this.wsService.send({
      type: 'presence',
      data: { action: 'join', userId },
      room
    })
  }

  leaveCollaboration(room: string, userId: string): void {
    this.wsService.send({
      type: 'presence',
      data: { action: 'leave', userId },
      room
    })
  }

  onPresenceChange(room: string, handler: (users: string[]) => void): void {
    this.presenceHandlers.set(room, handler)
  }

  getCollaborators(room: string): string[] {
    return Array.from(this.collaborators.get(room) || [])
  }

  private dispatchCollaborationUpdate(message: WebSocketMessage): void {
    const event = new CustomEvent('optimaliq-collaboration', {
      detail: message
    })
    window.dispatchEvent(event)
  }
}

// Export singleton instances
let wsService: WebSocketService | null = null
let notificationService: NotificationService | null = null
let chatService: ChatService | null = null
let collaborationService: CollaborationService | null = null

export const initializeWebSocket = (url: string, token?: string) => {
  wsService = new WebSocketService(url, token)
  notificationService = new NotificationService(wsService)
  chatService = new ChatService(wsService)
  collaborationService = new CollaborationService(wsService)
  
  return {
    wsService,
    notificationService,
    chatService,
    collaborationService
  }
}

export const getWebSocketServices = () => ({
  wsService,
  notificationService,
  chatService,
  collaborationService
})
