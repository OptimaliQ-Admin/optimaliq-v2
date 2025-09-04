'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
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
  LineChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  insights?: string[]
  data?: any
}

interface AssessmentData {
  currentQuestion: number
  totalQuestions: number
  responses: Record<string, any>
  insights: string[]
  score: number
  recommendations: string[]
}

export default function AIPoweredAssessment() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    currentQuestion: 0,
    totalQuestions: 5,
    responses: {},
    insights: [],
    score: 0,
    recommendations: []
  })
  const [showResults, setShowResults] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const questions = [
    {
      id: 'challenges',
      question: "What are your biggest growth challenges right now?",
      type: 'text',
      followUp: "Tell me more about how these challenges are impacting your business.",
      insights: ["Understanding pain points", "Identifying growth blockers", "Prioritizing solutions"]
    },
    {
      id: 'strategy',
      question: "How would you describe your current growth strategy?",
      type: 'text',
      followUp: "What specific tactics are you using to drive growth?",
      insights: ["Strategy assessment", "Tactical analysis", "Growth methodology"]
    },
    {
      id: 'team',
      question: "How is your team structured for growth?",
      type: 'text',
      followUp: "What roles are you missing or need to strengthen?",
      insights: ["Team optimization", "Role analysis", "Capacity planning"]
    },
    {
      id: 'metrics',
      question: "What key metrics do you track for growth?",
      type: 'text',
      followUp: "How often do you review these metrics and make decisions?",
      insights: ["KPI analysis", "Measurement framework", "Data-driven decisions"]
    },
    {
      id: 'goals',
      question: "What are your growth goals for the next 12 months?",
      type: 'text',
      followUp: "What would success look like for you?",
      insights: ["Goal setting", "Success metrics", "Timeline planning"]
    }
  ]

  useEffect(() => {
    // Load user info
    const storedUser = localStorage.getItem('growth_assessment_user')
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser))
    } else {
      router.push('/growth-assessment')
      return
    }

    // Start the assessment
    startAssessment()
  }, [router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startAssessment = () => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: `Hello ${userInfo?.name || 'there'}! 👋 I'm your AI Growth Strategist. I'll analyze your business and provide personalized insights to help you scale effectively.

I'll ask you 5 strategic questions about your growth challenges, strategy, team, metrics, and goals. As you answer, I'll provide real-time insights and recommendations.

Ready to begin? Let's start with your biggest growth challenges.`,
      timestamp: new Date(),
      insights: ['AI-powered analysis', 'Real-time insights', 'Personalized recommendations']
    }

    setMessages([welcomeMessage])
  }

  const generateAIResponse = async (userMessage: string, questionIndex: number) => {
    const question = questions[questionIndex]
    const insights = generateInsights(userMessage, question)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    let response = ''
    let followUp = ''
    
    if (questionIndex < questions.length - 1) {
      response = `Great insights! I can see ${insights[0].toLowerCase()}. This is valuable information for your growth strategy.

${insights[1]}

Now, let's move to the next question: **${questions[questionIndex + 1].question}**`
      
      if (questions[questionIndex + 1].followUp) {
        followUp = questions[questionIndex + 1].followUp
      }
    } else {
      // Final question - generate comprehensive analysis
      response = `Excellent! I now have a comprehensive understanding of your growth situation. Let me analyze everything and provide you with personalized insights and recommendations.

Based on your responses, I can see several key opportunities for growth optimization. Let me generate your personalized growth strategy...`
    }
    
    return { response, followUp, insights }
  }

  const generateInsights = (response: string, question: any) => {
    const insights = []
    
    if (question.id === 'challenges') {
      if (response.toLowerCase().includes('scaling') || response.toLowerCase().includes('growth')) {
        insights.push('Scaling challenges identified', 'Focus on operational efficiency and process optimization', 'Consider automation and team expansion strategies')
      } else if (response.toLowerCase().includes('marketing') || response.toLowerCase().includes('sales')) {
        insights.push('Marketing/sales challenges detected', 'Focus on lead generation and conversion optimization', 'Consider digital marketing and sales process improvements')
      } else {
        insights.push('Growth blockers identified', 'Focus on addressing core challenges', 'Consider strategic pivots or process improvements')
      }
    } else if (question.id === 'strategy') {
      insights.push('Strategy analysis complete', 'Growth methodology assessed', 'Tactical approach evaluated')
    } else if (question.id === 'team') {
      insights.push('Team structure analyzed', 'Capacity assessment complete', 'Role optimization identified')
    } else if (question.id === 'metrics') {
      insights.push('KPI framework evaluated', 'Measurement approach assessed', 'Data-driven decision making analyzed')
    } else if (question.id === 'goals') {
      insights.push('Goal setting analyzed', 'Success metrics defined', 'Timeline planning assessed')
    }
    
    return insights
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const { response, followUp, insights } = await generateAIResponse(inputValue, assessmentData.currentQuestion)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        insights,
        data: { followUp }
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Update assessment data
      setAssessmentData(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        responses: {
          ...prev.responses,
          [questions[prev.currentQuestion].id]: inputValue
        },
        insights: [...prev.insights, ...insights]
      }))

      // Check if assessment is complete
      if (assessmentData.currentQuestion >= questions.length - 1) {
        setTimeout(() => {
          setShowResults(true)
        }, 2000)
      }

    } catch (error) {
      console.error('Error generating AI response:', error)
      toast.error('Failed to generate AI response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your AI Growth Assessment is Complete!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on your responses, I've generated personalized insights and recommendations to accelerate your growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall Score */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth Score</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">87/100</div>
                <p className="text-gray-600 text-sm">Above Average</p>
                <Progress value={87} className="mt-4" />
              </div>
            </Card>

            {/* Key Insights */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Insights</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Strong strategic foundation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Team structure is well-defined</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Clear growth goals established</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Rocket className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Top Recommendations</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Implement data-driven decision making</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Optimize team processes</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Scale marketing efforts</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Card className="mt-8 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Growth Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Clear strategic vision and goals</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Well-structured team organization</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Strong understanding of market challenges</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Opportunities</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Implement advanced analytics and reporting</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Automate repetitive processes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Expand market reach and customer acquisition</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Plan */}
          <Card className="mt-8 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">30-Day Action Plan</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Week 1: Data Foundation</h3>
                  <p className="text-gray-600 text-sm">Set up advanced analytics and reporting systems</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Week 2: Process Optimization</h3>
                  <p className="text-gray-600 text-sm">Identify and automate key business processes</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Week 3: Team Enhancement</h3>
                  <p className="text-gray-600 text-sm">Optimize team structure and add key roles</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Week 4: Growth Acceleration</h3>
                  <p className="text-gray-600 text-sm">Launch new growth initiatives and measure impact</p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => router.push('/dashboard')}
            >
              Access Your Growth Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Get started with your personalized growth strategy today
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900">OptimaliQ AI Assessment</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <div className="text-sm text-gray-500">
                Question {assessmentData.currentQuestion + 1} of {assessmentData.totalQuestions}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Assessment Progress</span>
            <span>{Math.round(((assessmentData.currentQuestion + 1) / assessmentData.totalQuestions) * 100)}%</span>
          </div>
          <Progress value={((assessmentData.currentQuestion + 1) / assessmentData.totalQuestions) * 100} />
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600'
                    }`}>
                      {message.type === 'user' ? (
                        <UserIcon className="text-white text-sm" />
                      ) : (
                        <Bot className="text-white text-sm" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.insights && (
                        <div className="mt-3 space-y-1">
                          {message.insights.map((insight, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs opacity-75">
                              <Lightbulb className="w-3 h-3" />
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="text-white text-sm" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">AI is analyzing your response...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
