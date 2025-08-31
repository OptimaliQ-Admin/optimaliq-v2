/**
 * OptimaliQ Real-time Chat Component
 * Live chat functionality with WebSocket integration
 */

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, Send, Users, MoreVertical, Smile, Paperclip,
  Mic, MicOff, Video, Phone, Search, Settings, User, Bot,
  Check, CheckCheck, Clock, AlertCircle, Wifi, WifiOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ChatService, WebSocketMessage } from '@/lib/websocket'

interface ChatMessage {
  id: string
  content: string
  sender: string
  timestamp: Date
  type: 'text' | 'system' | 'notification'
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
}

interface ChatUser {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'away' | 'busy'
  lastSeen?: Date
}

interface ChatProps {
  room: string
  currentUser: ChatUser
  onMessage?: (message: ChatMessage) => void
  onUserJoin?: (user: ChatUser) => void
  onUserLeave?: (user: ChatUser) => void
}

export default function ChatComponent({ 
  room, 
  currentUser, 
  onMessage, 
  onUserJoin, 
  onUserLeave 
}: ChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(false)
  const [isConnected, setIsConnected] = React.useState(false)
  const [onlineUsers, setOnlineUsers] = React.useState<ChatUser[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const chatServiceRef = React.useRef<ChatService | null>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat service
  React.useEffect(() => {
    // Initialize WebSocket connection
    const initializeChat = async () => {
      try {
        // This would be initialized with your WebSocket service
        // const { chatService } = await initializeWebSocket('wss://your-websocket-url')
        // chatServiceRef.current = chatService
        
        // For demo purposes, we'll simulate the connection
        setIsConnected(true)
        
        // Join the chat room
        // chatServiceRef.current?.joinChatRoom(room)
        
        // Set up message handler
        // chatServiceRef.current?.onMessage(room, (wsMessages) => {
        //   const chatMessages = wsMessages.map(msg => ({
        //     id: msg.id,
        //     content: msg.data.content,
        //     sender: msg.sender || 'Unknown',
        //     timestamp: msg.timestamp,
        //     type: 'text' as const,
        //     status: 'delivered' as const
        //   }))
        //   setMessages(chatMessages)
        // })
        
        // Add some demo messages
        setMessages([
          {
            id: '1',
            content: 'Welcome to the OptimaliQ team chat!',
            sender: 'System',
            timestamp: new Date(),
            type: 'system',
            status: 'delivered'
          },
          {
            id: '2',
            content: 'Hi everyone! How are the assessments going?',
            sender: 'Sarah Johnson',
            timestamp: new Date(Date.now() - 300000),
            type: 'text',
            status: 'read'
          },
          {
            id: '3',
            content: 'Great! We just completed the team collaboration assessment.',
            sender: 'Michael Chen',
            timestamp: new Date(Date.now() - 180000),
            type: 'text',
            status: 'read'
          }
        ])
        
        setOnlineUsers([
          { id: '1', name: 'Sarah Johnson', status: 'online' },
          { id: '2', name: 'Michael Chen', status: 'online' },
          { id: '3', name: 'Emily Rodriguez', status: 'away' },
          { id: '4', name: 'David Kim', status: 'busy' }
        ])
        
      } catch (error) {
        console.error('Failed to initialize chat:', error)
        setIsConnected(false)
      }
    }

    initializeChat()

    return () => {
      // Cleanup
      // chatServiceRef.current?.leaveChatRoom(room)
    }
  }, [room])

  const handleSendMessage = () => {
    if (!inputValue.trim() || !isConnected) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: currentUser.name,
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(false)

    // Send via WebSocket
    // chatServiceRef.current?.sendMessage(room, newMessage.content, currentUser.name)
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      )
    }, 1000)

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      )
    }, 2000)

    onMessage?.(newMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (!isTyping) {
      setIsTyping(true)
      // Send typing indicator
      // chatServiceRef.current?.sendMessage(room, 'typing...', currentUser.name)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="h-3 w-3 text-muted-foreground" />
      case 'sent': return <Check className="h-3 w-3 text-muted-foreground" />
      case 'delivered': return <CheckCheck className="h-3 w-3 text-blue-500" />
      case 'read': return <CheckCheck className="h-3 w-3 text-green-500" />
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />
      default: return null
    }
  }

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-medium">Team Chat</h3>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-muted-foreground">
                {isConnected ? `${onlineUsers.length} online` : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Online Users */}
      <div className="p-3 border-b bg-muted/30">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {onlineUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-2 flex-shrink-0">
              <div className="relative">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${getUserStatusColor(user.status)}`} />
              </div>
              <span className="text-xs font-medium">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === currentUser.name ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === currentUser.name ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'system' 
                    ? 'bg-muted' 
                    : message.sender === currentUser.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  {message.type === 'system' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                
                <div className={`rounded-lg p-3 ${
                  message.type === 'system'
                    ? 'bg-muted text-muted-foreground'
                    : message.sender === currentUser.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  {message.type !== 'system' && (
                    <div className="text-xs opacity-70 mb-1">{message.sender}</div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.sender === currentUser.name && (
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(message.status)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-20"
              disabled={!isConnected}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-8 w-8 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRecording(!isRecording)}
            className={isRecording ? 'text-red-500' : ''}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isConnected}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {!isConnected && (
          <div className="mt-2 flex items-center space-x-2 text-xs text-red-500">
            <WifiOff className="h-3 w-3" />
            <span>Connection lost. Trying to reconnect...</span>
          </div>
        )}
      </div>
    </Card>
  )
}
