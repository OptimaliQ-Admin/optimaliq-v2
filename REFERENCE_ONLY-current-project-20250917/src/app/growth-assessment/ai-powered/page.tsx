'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  LineChart,
  Clock,
  DollarSign,
  Building2,
  Globe,
  AlertCircle,
  CheckCircle2,
  XCircle
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
  data?: any
  questionId?: string
}

interface AssessmentData {
  currentQuestion: number
  totalQuestions: number
  responses: Record<string, any>
  insights: string[]
  score: number
  categoryScores: Record<string, number>
  recommendations: string[]
  actionPlan: string[]
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
}

interface Question {
  id: string
  question: string
  type: 'text' | 'textarea' | 'select'
  options?: { value: string; label: string }[]
  followUp?: string
  category: 'strategy' | 'operations' | 'team' | 'technology' | 'market'
  weight: number
  aiPrompt: string
  suggestedResponses?: string[]
}

const questions: Question[] = [
  {
    id: 'challenges',
    question: "What are your biggest growth challenges right now?",
    type: 'textarea',
    category: 'strategy',
    weight: 25,
    followUp: "Tell me more about how these challenges are impacting your business.",
    aiPrompt: "Analyze the user's growth challenges and provide specific, actionable insights. Consider their industry, company size, and role. Identify the root causes and suggest immediate and long-term solutions. Be specific and avoid generic advice.",
    suggestedResponses: [
      "We're struggling with customer acquisition and lead generation",
      "Our conversion rates are too low and we need to improve them",
      "We have trouble scaling our team and hiring the right people",
      "Our technology stack is holding us back from growing faster",
      "We need better data and metrics to make decisions",
      "Other"
    ]
  },
  {
    id: 'strategy',
    question: "How would you describe your current growth strategy?",
    type: 'textarea',
    category: 'strategy',
    weight: 20,
    followUp: "What specific tactics are you using to drive growth?",
    aiPrompt: "Evaluate their growth strategy based on best practices for their industry and company size. Identify gaps, strengths, and opportunities for improvement. Provide specific recommendations for strategy enhancement.",
    suggestedResponses: [
      "We focus on digital marketing and content creation",
      "We're using a product-led growth approach",
      "We rely on partnerships and referrals",
      "We're still figuring out our strategy",
      "We use a mix of sales and marketing tactics",
      "Other"
    ]
  },
  {
    id: 'team',
    question: "How is your team structured for growth?",
    type: 'textarea',
    category: 'team',
    weight: 20,
    followUp: "What roles are you missing or need to strengthen?",
    aiPrompt: "Analyze their team structure for growth readiness. Consider their company size, industry, and growth goals. Identify missing roles, skill gaps, and organizational improvements needed for scaling.",
    suggestedResponses: [
      "We're a small team wearing multiple hats",
      "We have dedicated sales and marketing roles",
      "We need to hire more people but don't know where to start",
      "We have the right people but need better processes",
      "We're struggling to find and retain talent",
      "Other"
    ]
  },
  {
    id: 'metrics',
    question: "What key metrics do you track for growth?",
    type: 'textarea',
    category: 'operations',
    weight: 15,
    followUp: "How often do you review these metrics and make decisions?",
    aiPrompt: "Evaluate their metrics framework for growth tracking. Identify missing KPIs, suggest improvements to their measurement approach, and recommend data-driven decision-making processes.",
    suggestedResponses: [
      "Revenue, customer count, and basic conversion rates",
      "We track detailed funnel metrics and customer lifetime value",
      "We mainly look at website traffic and social media metrics",
      "We don't really track metrics systematically",
      "We have too many metrics and don't know which ones matter",
      "Other"
    ]
  },
  {
    id: 'technology',
    question: "How is your technology stack supporting growth?",
    type: 'textarea',
    category: 'technology',
    weight: 20,
    followUp: "What tools and systems are you using?",
    aiPrompt: "Assess their technology stack for growth scalability. Identify bottlenecks, suggest tool improvements, and recommend technology investments that will support their growth goals.",
    suggestedResponses: [
      "We use basic tools like email and spreadsheets",
      "We have a CRM and some marketing automation",
      "Our tech stack is outdated and needs upgrading",
      "We have good tools but don't use them effectively",
      "We're overwhelmed by too many tools and systems",
      "Other"
    ]
  }
]

export default function AIPoweredAssessment() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    currentQuestion: 0,
    totalQuestions: questions.length,
    responses: {},
    insights: [],
    score: 0,
    categoryScores: {
      strategy: 0,
      operations: 0,
      team: 0,
      technology: 0,
      market: 0
    },
    recommendations: [],
    actionPlan: [],
    strengths: [],
    weaknesses: [],
    opportunities: []
  })
  const [showResults, setShowResults] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    // Only auto-scroll if user is near the bottom or it's a new message
    const messagesContainer = messagesEndRef.current?.parentElement
    if (messagesContainer) {
      const isNearBottom = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 100
      if (isNearBottom || messages.length <= 2) {
        scrollToBottom()
      }
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startAssessment = () => {
    // Show typing indicator first
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: `Hello ${userInfo?.name || 'there'}! 👋 I'm your AI Growth Strategist. I'll analyze your business and provide personalized insights to help you scale effectively.

I'll ask you 5 strategic questions about your growth challenges, strategy, team, metrics, and technology. As you answer, I'll provide real-time insights and recommendations.

Ready to begin? Let's start with your biggest growth challenges.`,
        timestamp: new Date(),
        insights: ['AI-powered analysis', 'Real-time insights', 'Personalized recommendations']
      }

      setMessages([welcomeMessage])
    }, 1500)
  }

  const generateAIResponse = async (userMessage: string, questionIndex: number) => {
    const question = questions[questionIndex]
    
    try {
      setIsLoading(true)
      
      // Call the AI API for intelligent response
      const response = await fetch('/api/ai/strategic-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          userResponse: userMessage,
          userContext: userInfo,
          aiPrompt: question.aiPrompt,
          category: question.category
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const aiData = await response.json()
      
      // Store the response
      const newResponses = {
        ...assessmentData.responses,
        [question.id]: {
          answer: userMessage,
          insights: aiData.insights || [],
          recommendations: aiData.recommendations || [],
          score: aiData.score || 0
        }
      }

      setAssessmentData(prev => ({
        ...prev,
        responses: newResponses,
        categoryScores: {
          ...prev.categoryScores,
          [question.category]: aiData.score || 0
        }
      }))

      // Generate AI response message with natural transition to next question
      let aiResponseContent = aiData.response || generateFallbackResponse(userMessage, question)
      
      // If this is not the last question, add a natural transition to the next question
      if (questionIndex < questions.length - 1) {
        const nextQuestion = questions[questionIndex + 1]
        const contextualTransition = generateContextualTransition(question, userMessage, nextQuestion)
        aiResponseContent += `\n\n${contextualTransition}`
      }

      const aiResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: aiResponseContent,
        timestamp: new Date(),
        insights: aiData.insights || [],
        questionId: question.id
      }

      setMessages(prev => [...prev, aiResponse])

      // Move to next question or complete assessment
      if (questionIndex < questions.length - 1) {
        // Update current question after a short delay
        setTimeout(() => {
          setAssessmentData(prev => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1
          }))
        }, 2000)
      } else {
        // Complete assessment
        setTimeout(() => {
          completeAssessment()
        }, 3000)
      }

    } catch (error) {
      console.error('Error generating AI response:', error)
      toast.error('Failed to get AI response. Please try again.')
      
      // Fallback response
      const fallbackResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: generateFallbackResponse(userMessage, question),
        timestamp: new Date(),
        questionId: question.id
      }
      setMessages(prev => [...prev, fallbackResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackResponse = (userMessage: string, question: Question): string => {
    const responses = {
      challenges: "I can see you're facing some significant growth challenges. Let me help you identify the root causes and develop a strategic approach to overcome them.",
      strategy: "Your growth strategy shows potential, but there are opportunities to optimize and scale more effectively. Let's explore some enhancements.",
      team: "Team structure is crucial for growth. I can see areas where we can strengthen your organization for better scalability.",
      metrics: "Data-driven growth requires the right metrics. Let's ensure you're tracking the KPIs that matter most for your business.",
      technology: "Technology can be a growth accelerator or a bottleneck. Let's evaluate your current stack and identify optimization opportunities."
    }
    
    return responses[question.id as keyof typeof responses] || "Thank you for that insight. Let me analyze this and provide you with specific recommendations."
  }

  const generateContextualTransition = (currentQuestion: Question, userResponse: string, nextQuestion: Question): string => {
    // Create natural transitions based on the current question and user response
    const transitions = {
      challenges: {
        strategy: "Now that I understand your challenges, let's talk about your approach to solving them. ",
        team: "Given those challenges, your team structure will be crucial. ",
        metrics: "To tackle those challenges effectively, we need to measure what matters. ",
        technology: "Those challenges often have technology solutions. "
      },
      strategy: {
        team: "Your strategy is solid, but execution depends on having the right people. ",
        metrics: "Great strategy! Now let's make sure you're tracking the right metrics to measure success. ",
        technology: "Strategy without the right tools is just a plan. ",
        challenges: "Let me understand what's holding back your strategy. "
      },
      team: {
        metrics: "With the right team in place, you'll need to track their impact. ",
        technology: "Your team will need the right tools to execute effectively. ",
        strategy: "Team structure should align with your growth strategy. ",
        challenges: "Team issues often create operational challenges. "
      },
      metrics: {
        technology: "Good metrics require good systems to track them. ",
        strategy: "Metrics should drive your strategic decisions. ",
        team: "The right metrics help you hire and manage your team better. ",
        challenges: "Metrics often reveal the root causes of challenges. "
      },
      technology: {
        strategy: "Technology should enable your strategy, not limit it. ",
        team: "The right tech stack helps your team work more efficiently. ",
        metrics: "Technology should make it easier to track and analyze your metrics. ",
        challenges: "Technology problems often create operational challenges. "
      }
    }

    const currentCategory = currentQuestion.category
    const nextCategory = nextQuestion.category
    
    // Get the contextual transition
    const transition = transitions[currentCategory]?.[nextCategory] || ""
    
    // Create a natural flow that references the user's response
    const userResponseLower = userResponse.toLowerCase()
    let contextualReference = ""
    
    if (userResponseLower.includes('struggling') || userResponseLower.includes('challenge')) {
      contextualReference = "I can see you're dealing with some real challenges. "
    } else if (userResponseLower.includes('not sure') || userResponseLower.includes('don\'t know')) {
      contextualReference = "That's totally normal - many founders feel that way. "
    } else if (userResponseLower.includes('good') || userResponseLower.includes('working')) {
      contextualReference = "That's a great foundation to build on. "
    } else if (userResponseLower.includes('need') || userResponseLower.includes('want')) {
      contextualReference = "I can help you figure that out. "
    }
    
    return `${contextualReference}${transition}${nextQuestion.question}

${nextQuestion.followUp ? nextQuestion.followUp : ''}`
  }

  const completeAssessment = async () => {
    setIsAnalyzing(true)
    
    try {
      // Calculate overall score
      const totalScore = Object.values(assessmentData.categoryScores).reduce((sum, score) => sum + score, 0)
      const averageScore = totalScore / Object.keys(assessmentData.categoryScores).length
      
      // Generate final insights
      const finalInsights = await generateFinalInsights()
      
      setAssessmentData(prev => ({
        ...prev,
        score: Math.round(averageScore),
        insights: finalInsights.insights,
        recommendations: finalInsights.recommendations,
        actionPlan: finalInsights.actionPlan,
        strengths: finalInsights.strengths,
        weaknesses: finalInsights.weaknesses,
        opportunities: finalInsights.opportunities
      }))

      // Show completion message
      const completionMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `🎉 **Assessment Complete!**

I've analyzed your responses and generated a comprehensive growth strategy report. Your overall growth readiness score is **${Math.round(averageScore)}/100**.

Here's what I found:
• **Strengths**: ${finalInsights.strengths.slice(0, 2).join(', ')}
• **Key Opportunities**: ${finalInsights.opportunities.slice(0, 2).join(', ')}
• **Priority Actions**: ${finalInsights.actionPlan.slice(0, 2).join(', ')}

Let me show you your detailed results...`,
        timestamp: new Date(),
        insights: ['Assessment Complete', 'Score Calculated', 'Insights Generated']
      }

      setMessages(prev => [...prev, completionMessage])
      
      setTimeout(() => {
        setShowResults(true)
        setIsAnalyzing(false)
      }, 3000)

    } catch (error) {
      console.error('Error completing assessment:', error)
      toast.error('Failed to complete assessment. Please try again.')
      setIsAnalyzing(false)
    }
  }

  const generateFinalInsights = async () => {
    try {
      const response = await fetch('/api/ai/strategic-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'final_analysis',
          responses: assessmentData.responses,
          userContext: userInfo,
          categoryScores: assessmentData.categoryScores
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.error('Error generating final insights:', error)
    }

    // Fallback insights
    return {
      insights: [
        "Your business shows strong potential for growth with the right strategic adjustments.",
        "Focus on optimizing your current processes before scaling operations.",
        "Consider investing in technology that can automate routine tasks."
      ],
      recommendations: [
        "Develop a comprehensive growth strategy with clear milestones",
        "Strengthen your team with key hires in growth-critical roles",
        "Implement better metrics tracking and reporting systems"
      ],
      actionPlan: [
        "Week 1-2: Audit current processes and identify bottlenecks",
        "Week 3-4: Develop detailed growth strategy with KPIs",
        "Month 2: Begin implementing technology improvements",
        "Month 3: Start hiring for key growth roles"
      ],
      strengths: ["Clear vision", "Strong team foundation"],
      weaknesses: ["Process optimization", "Technology stack"],
      opportunities: ["Market expansion", "Product development"]
    }
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

    // Generate AI response
    await generateAIResponse(inputValue, assessmentData.currentQuestion)
    
    setAssessmentData(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedResponse = async (response: string) => {
    if (response === 'Other') {
      setShowTextInput(true)
    } else {
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])

      // Generate AI response
      await generateAIResponse(response, assessmentData.currentQuestion)
      
      setAssessmentData(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }))
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6">
              <Award className="w-6 h-6" />
              <span>Your Growth Assessment Results</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Growth Readiness Score: <span className={getScoreColor(assessmentData.score)}>{assessmentData.score}/100</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your responses, here's your comprehensive growth strategy report
            </p>
          </motion.div>

          {/* Score Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            {Object.entries(assessmentData.categoryScores).map(([category, score]) => (
              <Card key={category} className="text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    {getScoreIcon(score)}
                  </div>
                  <h3 className="font-semibold text-lg capitalize mb-2">{category}</h3>
                  <div className="text-3xl font-bold mb-2">
                    <span className={getScoreColor(score)}>{score}</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths & Opportunities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Strengths & Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {assessmentData.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Growth Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {assessmentData.opportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Strategic Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {assessmentData.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Action Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-orange-500" />
                  30-Day Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {assessmentData.actionPlan.map((action, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="font-semibold text-orange-800">Week {index + 1}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-8"
          >
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Accelerate Your Growth?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Get personalized coaching, advanced analytics, and strategic guidance to implement these recommendations and achieve your growth goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Building2 className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Book Strategy Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 100
        }}
        className="max-w-4xl w-full mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl border border-white/30 p-0 flex flex-col overflow-hidden flex-1 max-h-[calc(100vh-4rem)]"
      >
        {/* Chat Interface */}
        <div className="flex-1 p-8 flex flex-col min-h-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">AI Growth Strategist</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-500">Online • Question {assessmentData.currentQuestion + 1} of {assessmentData.totalQuestions}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                {userInfo?.name || 'Guest'}
              </div>
              <div className="text-xs text-gray-500">
                {userInfo?.industry} • {userInfo?.companySize}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Assessment Progress</span>
              <span className="text-sm text-gray-500">
                {Math.round((assessmentData.currentQuestion / assessmentData.totalQuestions) * 100)}%
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={(assessmentData.currentQuestion / assessmentData.totalQuestions) * 100} 
                className="h-3 bg-gray-200"
              />
              <div className="absolute inset-0 flex items-center justify-between px-1">
                {Array.from({ length: assessmentData.totalQuestions }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < assessmentData.currentQuestion
                        ? 'bg-green-500'
                        : i === assessmentData.currentQuestion
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Started</span>
              <span>Complete</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 min-h-0">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-end gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'
                    }`}>
                      {message.type === 'user' ? (
                        <UserIcon className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`relative max-w-full ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-800 shadow-md border border-gray-100'
                    } rounded-2xl px-5 py-4`}>
                      {/* Message Content */}
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed m-0">{message.content}</p>
                      </div>
                      
                      {/* Insights Badges */}
                      {message.insights && message.insights.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.insights.map((insight, insightIndex) => (
                            <Badge 
                              key={insightIndex} 
                              variant={message.type === 'user' ? 'secondary' : 'default'}
                              className={`text-xs px-2 py-1 ${
                                message.type === 'user' 
                                  ? 'bg-white/20 text-white border-white/30' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {insight}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {(isLoading || isTyping) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-end gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-gray-500 text-sm ml-2">
                        {isLoading ? 'Analyzing your response...' : 'AI is typing...'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!showResults && !isAnalyzing && (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
              {!showTextInput && assessmentData.currentQuestion < questions.length && questions[assessmentData.currentQuestion]?.suggestedResponses ? (
                <div>
                  <div className="text-sm text-gray-600 mb-3">Choose a response or select "Other" to write your own:</div>
                  <div className="grid grid-cols-1 gap-2">
                    {questions[assessmentData.currentQuestion].suggestedResponses?.map((response, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedResponse(response)}
                        disabled={isLoading || isTyping}
                        className={`p-3 text-left rounded-lg border transition-all duration-200 ${
                          response === 'Other'
                            ? 'border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600'
                            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-800'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {response}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your response here..."
                        className="min-h-[60px] max-h-[120px] resize-none border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-500 pr-12"
                        disabled={isLoading || isTyping}
                        rows={2}
                        autoFocus
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {inputValue.length > 0 && `${inputValue.length} chars`}
                      </div>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading || isTyping}
                      className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="icon"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Press Enter to send • Shift+Enter for new line
                    </div>
                    {showTextInput && (
                      <button
                        onClick={() => setShowTextInput(false)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        ← Back to suggestions
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}