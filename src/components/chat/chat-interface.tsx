/**
 * AI-Powered Chat Interface for Conversational Onboarding
 * Dynamic chat interface with AI responses and progress tracking
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  CheckCircle, 
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  SkipForward
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Container, Section, Flex, Stack } from '@/components/ui/layout'
import { Progress } from '@/components/ui/progress'
import { Alert } from '@/components/ui/feedback'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    suggestions?: string[]
    nextQuestion?: string
  }
}

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  progress: number
  currentStep: number
  totalSteps: number
  suggestions: string[]
  canSkip: boolean
}

export default function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    progress: 0,
    currentStep: 1,
    totalSteps: 8,
    suggestions: [],
    canSkip: false
  })

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatState.messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'ai',
      content: "Hi! I'm your AI onboarding assistant. I'm here to help you get started with OptimaliQ and understand your business needs. Let's begin with a few questions to personalize your experience. What's your primary business goal?",
      timestamp: new Date(),
      metadata: {
        suggestions: [
          'Increase revenue',
          'Improve efficiency',
          'Expand market',
          'Reduce costs',
          'Improve team performance'
        ],
        nextQuestion: 'business_goal'
      }
    }

    setChatState(prev => ({
      ...prev,
      messages: [welcomeMessage],
      suggestions: welcomeMessage.metadata?.suggestions || []
    }))
  }, [])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || chatState.isTyping) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      suggestions: []
    }))

    setInputValue('')

    // Simulate AI processing
    setTimeout(() => {
      handleAIResponse(content.trim())
    }, 1000)
  }

  const handleAIResponse = async (userInput: string) => {
    // Simulate AI processing and response generation
    const aiResponse = await generateAIResponse(userInput, chatState.currentStep)
    
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: aiResponse.metadata
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage],
      isTyping: false,
      progress: Math.min(100, (prev.currentStep / prev.totalSteps) * 100),
      currentStep: prev.currentStep + 1,
      suggestions: aiResponse.metadata?.suggestions || [],
      canSkip: aiResponse.metadata?.canSkip || false
    }))
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleSkip = () => {
    if (chatState.canSkip) {
      handleSendMessage('Skip this question')
    }
  }

  const generateAIResponse = async (userInput: string, step: number): Promise<{ content: string; metadata?: any }> => {
    // Simulate AI response generation based on step and user input
    const responses = {
      1: {
        content: "Great! Understanding your business goals helps us tailor the platform to your needs. Now, let's talk about your team size. How many people are in your organization?",
        metadata: {
          suggestions: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
          nextQuestion: 'team_size',
          canSkip: false
        }
      },
      2: {
        content: "Perfect! Team size helps us understand your collaboration needs. What industry are you in? This helps us provide relevant insights and benchmarks.",
        metadata: {
          suggestions: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Other'],
          nextQuestion: 'industry',
          canSkip: false
        }
      },
      3: {
        content: "Excellent! Industry context is crucial for relevant insights. How would you rate your current technology adoption level?",
        metadata: {
          suggestions: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          nextQuestion: 'tech_level',
          canSkip: true
        }
      },
      4: {
        content: "Thanks! Technology maturity helps us recommend the right features. What's your biggest challenge right now?",
        metadata: {
          suggestions: ['Scaling operations', 'Team collaboration', 'Data insights', 'Process efficiency', 'Market competition'],
          nextQuestion: 'challenge',
          canSkip: true
        }
      },
      5: {
        content: "I understand your challenges. Let's talk about your timeline. When do you hope to see results from implementing new tools?",
        metadata: {
          suggestions: ['Immediately', '1-3 months', '3-6 months', '6-12 months', 'Long-term'],
          nextQuestion: 'timeline',
          canSkip: true
        }
      },
      6: {
        content: "Timeline is important for setting expectations. What's your budget range for business improvement tools?",
        metadata: {
          suggestions: ['Under $1K/month', '$1K-$5K/month', '$5K-$10K/month', '$10K+/month', 'Not sure yet'],
          nextQuestion: 'budget',
          canSkip: true
        }
      },
      7: {
        content: "Budget helps us recommend the right plan. Finally, how do you prefer to learn and implement new tools?",
        metadata: {
          suggestions: ['Self-guided', 'Guided onboarding', 'Full implementation support', 'Training for team'],
          nextQuestion: 'learning_preference',
          canSkip: true
        }
      },
      8: {
        content: "Perfect! I have all the information I need to personalize your OptimaliQ experience. Based on your responses, I recommend starting with our Growth Assessment to get detailed insights tailored to your business. Would you like to begin the assessment now?",
        metadata: {
          suggestions: ['Start Assessment', 'View Dashboard', 'Schedule Demo', 'Learn More'],
          nextQuestion: 'next_action',
          canSkip: false
        }
      }
    }

    return responses[step as keyof typeof responses] || {
      content: "Thank you for sharing that information. Let me process your responses and provide personalized recommendations.",
      metadata: {
        suggestions: ['Continue', 'Start Over', 'Contact Support'],
        canSkip: false
      }
    }
  }

  return (
    <Container size="lg" className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Section className="mb-6">
          <Flex direction="col" gap="md" align="center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Bot className="w-12 h-12 text-primary" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                AI Onboarding Assistant
              </h1>
              <p className="text-gray-600">
                Let's personalize your OptimaliQ experience
              </p>
            </div>
          </Flex>
        </Section>

        {/* Progress Bar */}
        <Section className="mb-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20" className="p-4">
            <div className="space-y-2">
              <Flex justify="between" align="center">
                <span className="text-sm font-medium text-gray-700">
                  Progress: Step {chatState.currentStep} of {chatState.totalSteps}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(chatState.progress)}% Complete
                </span>
              </Flex>
              <Progress value={chatState.progress} variant="primary" className="h-2" />
            </div>
          </Card>
        </Section>

        {/* Chat Messages */}
        <Section className="mb-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20" className="p-6 h-96 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <AnimatePresence>
                  {chatState.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChatMessage message={message} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {chatState.isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-gray-500"
                    >
                      <Bot className="w-5 h-5" />
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              <AnimatePresence>
                {chatState.suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <p className="text-sm text-gray-600">Quick responses:</p>
                    <Flex gap="sm" wrap="wrap">
                      {chatState.suggestions.map((suggestion, index) => (
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
                    </Flex>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </Section>

        {/* Input Area */}
        <Section>
          <Card className="bg-white/10 backdrop-blur-md border-white/20" className="p-4">
            <Flex gap="md" align="center">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Type your message..."
                  disabled={chatState.isTyping}
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || chatState.isTyping}
                size="lg"
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </Button>
              {chatState.canSkip && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={chatState.isTyping}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </Button>
              )}
            </Flex>
          </Card>
        </Section>
      </motion.div>
    </Container>
  )
}

// Chat Message Component
function ChatMessage({ message }: { message: ChatMessage }) {
  const isAI = message.type === 'ai'

  return (
    <Flex gap="md" align="start" className={isAI ? '' : 'flex-row-reverse'}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isAI ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
      }`}>
        {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isAI ? '' : 'text-right'}`}>
        <Card className="bg-white/10 backdrop-blur-md border-white/20" className={`p-3 ${isAI ? 'bg-blue-50' : 'bg-gray-50'}`}>
          <p className="text-sm text-gray-900">{message.content}</p>
          {message.metadata?.confidence && (
            <div className="mt-2 text-xs text-gray-500">
              Confidence: {Math.round(message.metadata.confidence * 100)}%
            </div>
          )}
        </Card>
        <div className={`text-xs text-gray-500 mt-1 ${isAI ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </Flex>
  )
}
