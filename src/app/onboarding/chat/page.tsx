/**
 * OptimaliQ Conversational Onboarding
 * AI-powered chat interface for dynamic user onboarding
 */

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  MessageSquare, Send, Bot, User, Sparkles, ArrowRight,
  CheckCircle, Clock, HelpCircle, Settings, Zap, Bell,
  ChevronDown, ChevronUp, Loader2, Smile, ThumbsUp,
  ThumbsDown, RefreshCw, Volume2, VolumeX, Mic, MicOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/data-display'

// Chat message types
interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  intent?: string
  confidence?: number
  suggestions?: string[]
  actions?: ChatAction[]
}

interface ChatAction {
  id: string
  label: string
  action: string
  icon?: React.ReactNode
  primary?: boolean
}

// Onboarding flow data
const onboardingFlow = {
  currentStep: 1,
  totalSteps: 8,
  progress: 12.5,
  context: {
    organizationName: '',
    industry: '',
    teamSize: '',
    goals: [],
    challenges: [],
    timeline: ''
  }
}

// Sample conversation data
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'bot',
    content: "Hi! I'm your OptimaliQ AI assistant. I'm here to help you get started with organizational assessments and growth planning. Let's begin by understanding your organization better. What's your organization's name?",
    timestamp: new Date(),
    intent: 'greeting',
    confidence: 0.95,
    suggestions: ['HealthForward', 'TechCorp', 'Global Solutions', 'StartupXYZ']
  }
]

export default function OnboardingChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(true)
  const [context, setContext] = React.useState(onboardingFlow.context)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(content, context)
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
      updateContext(content, context)
    }, 1500)
  }

  const generateBotResponse = (userInput: string, currentContext: any): ChatMessage => {
    const responses = [
      {
        content: "Great! I can see you're in the healthcare industry. What's the size of your team?",
        intent: 'team_size',
        suggestions: ['1-10 employees', '11-50 employees', '51-200 employees', '200+ employees'],
        actions: [
          { id: '1', label: 'Continue', action: 'next', primary: true },
          { id: '2', label: 'Skip for now', action: 'skip' }
        ]
      },
      {
        content: "Perfect! With a team of that size, I can help you focus on key areas like team collaboration and process optimization. What are your main organizational goals?",
        intent: 'goals',
        suggestions: ['Improve team performance', 'Optimize processes', 'Increase efficiency', 'Enhance customer satisfaction'],
        actions: [
          { id: '1', label: 'Select Goals', action: 'select_goals', primary: true },
          { id: '2', label: 'Learn more', action: 'learn_more' }
        ]
      },
      {
        content: "Excellent! I understand your goals. Now, let's identify your biggest challenges. What's currently holding your organization back?",
        intent: 'challenges',
        suggestions: ['Communication issues', 'Process inefficiencies', 'Team alignment', 'Resource constraints'],
        actions: [
          { id: '1', label: 'Identify Challenges', action: 'identify_challenges', primary: true },
          { id: '2', label: 'Get recommendations', action: 'recommendations' }
        ]
      }
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: randomResponse.content,
      timestamp: new Date(),
      intent: randomResponse.intent,
      confidence: 0.92,
      suggestions: randomResponse.suggestions,
      actions: randomResponse.actions
    }
  }

  const updateContext = (userInput: string, currentContext: any) => {
    // Update context based on user input
    if (userInput.toLowerCase().includes('health')) {
      setContext(prev => ({ ...prev, industry: 'Healthcare' }))
    }
    // Add more context updates based on conversation flow
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleActionClick = (action: ChatAction) => {
    switch (action.action) {
      case 'next':
        // Handle next step
        break
      case 'skip':
        // Handle skip
        break
      case 'select_goals':
        // Handle goal selection
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">AI Onboarding</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Progress Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">AI-Powered Onboarding</h1>
                <p className="text-muted-foreground">
                  Let's get to know your organization and set up your optimal assessment experience
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    Step {onboardingFlow.currentStep} of {onboardingFlow.totalSteps}
                  </span>
                </div>
                <Progress value={onboardingFlow.progress} className="h-2" />
              </div>

              {/* Context Summary */}
              <div className="flex items-center justify-center space-x-4">
                {context.industry && (
                  <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                    Industry: {context.industry}
                  </Badge>
                )}
                {context.teamSize && (
                  <Badge variant="secondary" className="text-green-600 bg-green-100">
                    Team: {context.teamSize}
                  </Badge>
                )}
                {context.goals.length > 0 && (
                  <Badge variant="secondary" className="text-purple-600 bg-purple-100">
                    {context.goals.length} Goals Set
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <Card className="h-96 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">OptimaliQ AI Assistant</h3>
                      <p className="text-sm text-muted-foreground">Online • Ready to help</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-green-600 bg-green-100">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Powered
                    </Badge>
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
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            
                            {/* Suggestions */}
                            {message.type === 'bot' && message.suggestions && showSuggestions && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs text-muted-foreground">Quick suggestions:</p>
                                <div className="flex flex-wrap gap-2">
                                  {message.suggestions.map((suggestion, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleSuggestionClick(suggestion)}
                                      className="text-xs"
                                    >
                                      {suggestion}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            {message.type === 'bot' && message.actions && (
                              <div className="mt-3 space-y-2">
                                <div className="flex flex-wrap gap-2">
                                  {message.actions.map((action) => (
                                    <Button
                                      key={action.id}
                                      variant={action.primary ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => handleActionClick(action)}
                                      className="text-xs"
                                    >
                                      {action.icon}
                                      {action.label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground mt-2">
                              {message.timestamp.toLocaleTimeString()}
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
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center space-x-1">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
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
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        placeholder="Type your message..."
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsListening(!isListening)}
                          className="h-8 w-8 p-0"
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <HelpCircle className="h-6 w-6" />
                    <span>Get Help</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <RefreshCw className="h-6 w-6" />
                    <span>Restart</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <ArrowRight className="h-6 w-6" />
                    <span>Skip to End</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
