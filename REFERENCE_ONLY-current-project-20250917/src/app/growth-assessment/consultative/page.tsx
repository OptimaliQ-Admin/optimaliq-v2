'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Lightbulb, 
  Users, 
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  BarChart3,
  Rocket,
  Sparkles,
  MessageSquare,
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  Eye,
  BarChart,
  PieChart,
  LineChart,
  Clock,
  DollarSign,
  Building2,
  Globe,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  TargetIcon,
  TrendingUpIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  insights?: string[]
  maturityUpdate?: Record<string, number>
  industryInsight?: string
  confidence?: number
  rapportBuilding?: string
}

interface ConversationContext {
  userId?: string
  industry: string
  companySize: string
  role: string
  responses: Record<string, string>
  currentPhase: 'discovery' | 'diagnostic' | 'solution' | 'validation'
  rapportLevel: number
  emotionalState: 'curious' | 'engaged' | 'frustrated' | 'excited' | 'skeptical'
  maturityScores: {
    strategy: number
    operations: number
    team: number
    technology: number
    market: number
  }
}

interface MaturityLevel {
  level: number
  name: string
  description: string
  color: string
}

const maturityLevels: MaturityLevel[] = [
  { level: 1, name: 'Initial', description: 'Ad-hoc, chaotic processes', color: 'bg-red-500' },
  { level: 2, name: 'Repeatable', description: 'Basic processes established', color: 'bg-orange-500' },
  { level: 3, name: 'Defined', description: 'Standardized processes', color: 'bg-yellow-500' },
  { level: 4, name: 'Managed', description: 'Measured and controlled', color: 'bg-blue-500' },
  { level: 5, name: 'Optimizing', description: 'Continuous improvement', color: 'bg-green-500' }
]

function ConsultativeAssessmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    industry: searchParams.get('industry') || 'SaaS',
    companySize: searchParams.get('companySize') || '11-50',
    role: searchParams.get('role') || 'CEO',
    responses: {},
    currentPhase: 'discovery',
    rapportLevel: 0.5,
    emotionalState: 'curious',
    maturityScores: {
      strategy: 0,
      operations: 0,
      team: 0,
      technology: 0,
      market: 0
    }
  })
  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const [showTextInput, setShowTextInput] = useState(false)
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [overallMaturity, setOverallMaturity] = useState<number>(0)

  // Initialize conversation
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI Growth Strategist. I'd love to understand your business better and help you identify growth opportunities. 

I'll ask you some strategic questions about your business, and as we talk, I'll provide real-time insights and compare your capabilities to industry benchmarks.

What's keeping you up at night when it comes to growing your business?`,
      timestamp: new Date(),
      insights: ['Starting discovery phase', 'Building rapport and trust']
    }
    
    setMessages([initialMessage])
    setCurrentQuestion('What are your biggest growth challenges right now?')
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Update overall maturity score
  useEffect(() => {
    const scores = Object.values(conversationContext.maturityScores)
    const average = scores.reduce((a, b) => a + b, 0) / scores.length
    setOverallMaturity(average)
  }, [conversationContext.maturityScores])

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/ai/consultative-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userMessage.content,
          context: conversationContext
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response')
      }

      // Simulate typing delay
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.data.message,
          timestamp: new Date(),
          insights: data.data.insights,
          maturityUpdate: data.data.maturityUpdate,
          industryInsight: data.data.industryInsight,
          confidence: data.data.confidence,
          rapportBuilding: data.data.rapportBuilding
        }

        setMessages(prev => [...prev, aiMessage])
        
        // Update conversation context
        if (data.data.maturityUpdate) {
          setConversationContext(prev => ({
            ...prev,
            maturityScores: { ...prev.maturityScores, ...data.data.maturityUpdate },
            responses: { ...prev.responses, [currentQuestion]: userMessage.content }
          }))
        }

        // Update current question
        if (data.data.nextQuestion) {
          setCurrentQuestion(data.data.nextQuestion)
        }

        setIsTyping(false)
        setIsLoading(false)
      }, 1500)

    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
      setIsTyping(false)
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMaturityLevel = (score: number): MaturityLevel => {
    if (score >= 4) return maturityLevels[4]
    if (score >= 3) return maturityLevels[3]
    if (score >= 2) return maturityLevels[2]
    if (score >= 1) return maturityLevels[1]
    return maturityLevels[0]
  }

  const getMaturityColor = (score: number): string => {
    const level = getMaturityLevel(score)
    return level.color
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AI Growth Strategist</h1>
                <p className="text-sm text-slate-600">Consultative Assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{conversationContext.industry} • {conversationContext.companySize}</p>
                <p className="text-xs text-slate-600">{conversationContext.role}</p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Growth Assessment</h3>
                      <p className="text-sm text-slate-600">AI-powered strategic consultation</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Online</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-blue-600' 
                              : 'bg-gradient-to-r from-blue-600 to-purple-600'
                          }`}>
                            {message.type === 'user' ? (
                              <UserIcon className="w-5 h-5 text-white" />
                            ) : (
                              <Bot className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.insights && message.insights.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.insights.map((insight, index) => (
                                  <div key={index} className="text-xs opacity-75 flex items-center space-x-1">
                                    <Lightbulb className="w-3 h-3" />
                                    <span>{insight}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {message.industryInsight && (
                              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-800">{message.industryInsight}</p>
                              </div>
                            )}
                            <div className="text-xs opacity-50 mt-2">
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
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-slate-100 rounded-2xl px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-slate-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex space-x-3">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response here..."
                      className="flex-1 min-h-[60px] resize-none"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!userInput.trim() || isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Maturity Scores */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Overall Maturity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TargetIcon className="w-5 h-5" />
                    <span>Maturity Level</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl ${getMaturityColor(overallMaturity)}`}>
                      {Math.round(overallMaturity * 10) / 10}
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {getMaturityLevel(overallMaturity).name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {getMaturityLevel(overallMaturity).description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Category Scores */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Category Scores</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(conversationContext.maturityScores).map(([category, score]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700 capitalize">
                            {category}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {Math.round(score * 10) / 10}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getMaturityColor(score)}`}
                            style={{ width: `${(score / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Industry Comparison */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TrendingUpIcon className="w-5 h-5" />
                    <span>Industry Benchmark</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {Math.round((overallMaturity / 5) * 100)}%
                    </div>
                    <p className="text-sm text-slate-600">
                      vs Industry Average
                    </p>
                    <div className="mt-2 text-xs text-slate-500">
                      {conversationContext.industry} • {conversationContext.companySize}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Assessment Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Questions Answered</span>
                      <span>{Object.keys(conversationContext.responses).length}</span>
                    </div>
                    <Progress value={(Object.keys(conversationContext.responses).length / 8) * 100} className="h-2" />
                    <p className="text-xs text-slate-600">
                      {8 - Object.keys(conversationContext.responses).length} more questions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConsultativeAssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Assessment</h2>
          <p className="text-slate-600">Preparing your consultative experience...</p>
        </div>
      </div>
    }>
      <ConsultativeAssessmentContent />
    </Suspense>
  )
}
