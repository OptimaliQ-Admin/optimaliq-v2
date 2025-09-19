'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle,
  Sparkles,
  BarChart3 as ChartBarIcon,
  TrendingUp as ArrowTrendingUpIcon,
  DollarSign as CurrencyDollarIcon,
  Clock,
  Star,
  Target,
  Users,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Shield,
  Zap,
  Award,
  Rocket,
  Brain,
  Eye,
  Download,
  Share2,
  Plus,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'

// ScoreCardGrid component
function ScoreCardGrid({ score }: { score: number }) {
  const getScoreColor = (value: number) => {
    if (value >= 4.0) return "emerald"
    if (value >= 3.0) return "blue"
    if (value >= 2.0) return "amber"
    return "red"
  }

  const getScoreLabel = (value: number) => {
    if (value >= 4.0) return "Mature"
    if (value >= 3.0) return "Developing"
    if (value >= 2.0) return "Emerging"
    return "Foundation"
  }

  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)

  return (
    <>
      {/* GMF+ Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">GMF+ Score</h3>
            <p className="text-sm text-gray-500">Growth Maturity Framework</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-blue-600">{score.toFixed(1)}</span>
            <span className="text-lg text-gray-500">/ 5.0</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-${scoreColor}-100 text-${scoreColor}-700`}>
            <div className={`w-2 h-2 rounded-full bg-${scoreColor}-500`}></div>
            {scoreLabel}
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Your current growth maturity level based on strategy, process, and technology optimization.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Powered by <span className="text-blue-600 font-semibold">OptimaliQ.ai</span>
          </div>
        </div>
      </motion.div>

      {/* Industry Benchmark Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Industry Benchmark</h3>
            <p className="text-sm text-gray-500">Top performers average</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-emerald-600">4.2</span>
            <span className="text-lg text-gray-500">/ 5.0</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
            <Star className="w-3 h-3" />
            Top Tier
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Average score of top industry performers. Unlock detailed benchmarking with OptimaliQ Pro.
          </p>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-emerald-800 text-sm font-medium mb-1">Pro tip</p>
                <p className="text-emerald-700 text-xs">
                  Top performers focus on data-driven decision making and continuous optimization
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Optimization Potential Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Optimization Potential</h3>
            <p className="text-sm text-gray-500">Growth opportunity</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-purple-600">+{(5 - score).toFixed(1)}</span>
            <span className="text-lg text-gray-500">points</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
            <ArrowTrendingUpIcon className="w-3 h-3" />
            20% potential
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Potential to elevate your score and revenue over the next 12 months with strategic improvements.
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-purple-800 text-sm font-medium mb-1">Unlock advanced features</p>
                <p className="text-purple-700 text-xs">
                  Get predictive modeling and personalized roadmaps with OptimaliQ Pro
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Proof Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 text-white"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Trusted by Leaders</h3>
            <p className="text-sm text-gray-300">Join 2,000+ businesses</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
            <span>+1,995 more</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">Average 3x faster growth</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">40% efficiency improvements</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">Real-time benchmarking</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              &ldquo;OptimaliQ transformed our growth strategy from guesswork to data-driven decisions.&rdquo;
            </p>
            <p className="text-xs text-gray-500 mt-1">— Sarah Chen, CEO at TechFlow</p>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ScoreLineChart component
function ScoreLineChart({ data, score }: { data: Array<{ month: string; score: number }>, score: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Growth Projection</h3>
          <p className="text-sm text-gray-500">12-month roadmap</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="h-64 flex items-end justify-between gap-4">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-lg transition-all duration-1000 ease-out"
                style={{ 
                  height: `${(point.score / 5) * 200}px`,
                  animationDelay: `${index * 200}ms`
                }}
              />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{point.score.toFixed(1)}</p>
                <p className="text-xs text-gray-500">{point.month}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 text-sm font-medium mb-1">Growth Strategy</p>
              <p className="text-blue-700 text-xs">
                Based on your current score of {score.toFixed(1)}, we project steady improvement 
                through strategic optimizations and process enhancements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ScoreInsightGrid component
function ScoreInsightGrid({ loading, insights }: { loading: boolean, insights: Record<string, string> }) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(insights).map(([category, insight], index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 capitalize">
              {category} Insights
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{insight}</p>
        </motion.div>
      ))}
    </div>
  )
}

// SubscriptionPopup component
function SubscriptionPopup({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = () => {
    setIsLoading(true)
    router.push("/pricing")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Unlock Your Full Potential
          </h2>

          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Real-time market insights & trends</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">AI-powered growth strategies</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Ongoing assessment & tracking</p>
            </div>
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            {isLoading ? "Loading..." : "See Pricing Plans"}
          </Button>

          <p className="text-sm text-gray-500 mt-3">
            Join other businesses already growing with OptimaliQ
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// Main component
function Step3Component() {
  const router = useRouter()
  const hasFetched = useRef(false)
  const [score, setScore] = useState<number>(0)
  const [insights, setInsights] = useState<Record<string, string>>({
    strategy: "Complete the assessment to receive insights.",
    process: "Complete the assessment to receive insights.",
    technology: "Complete the assessment to receive insights.",
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [roadmapData, setRoadmapData] = useState<Array<{ month: string; score: number }>>([])
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const u_id = typeof window !== "undefined" ? localStorage.getItem("u_id") : null
    if (!u_id) {
      toast.error("User session expired. Please start again.")
      router.push("/growth-assessment")
      return
    }

    fetchInsights(u_id)
  }, [router])

  // Timer for subscription popup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubscriptionPopup(true)
    }, 15000) // 15 seconds

    return () => clearTimeout(timer)
  }, [])

  const fetchInsights = async (u_id: string) => {
    setLoading(true)
    try {
      // Use our Agentic AI endpoint
      const response = await fetch('/api/growth-assessment/getInsights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ u_id }),
      })

      if (!response.ok) {
        console.error('Failed to fetch insights:', response.status, response.statusText)
        return
      }

      const data = await response.json()
      
      if (!data) {
        console.error('No data returned from insights API')
        return
      }

      const clamp15 = (n: number) => Math.min(5, Math.max(1, n || 1))
      const roundToNearestHalf = (num: number) => Math.floor(clamp15(num) * 2) / 2
      const roundedScore = roundToNearestHalf(data.overall_score ?? 1)

      setScore(roundedScore)
      
      const newInsights = {
        strategy: data.strategy_insight?.trim() || "Focus on sharpening strategic priorities, aligning goals, and clarifying the roadmap.",
        process: data.process_insight?.trim() || "Tighten process ownership, cadence, and handoffs to reduce friction and improve throughput.",
        technology: data.technology_insight?.trim() || "Leverage automation and integrations to boost efficiency, insight quality, and scalability.",
      }
      
      setInsights(newInsights)

      setRoadmapData([
        { month: "Now", score: roundedScore },
        { month: "3 Months", score: Math.min(5, roundedScore + 0.5) },
        { month: "6 Months", score: Math.min(5, roundedScore + 1) },
        { month: "12 Months", score: Math.min(5, roundedScore + 2) },
      ])
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSubscriptionPopup = () => {
    setShowSubscriptionPopup(false)
  }

  const handleSubscribeClick = () => {
    router.push("/pricing")
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Floating Subscribe Button */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
        >
          <Button
            onClick={handleSubscribeClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 group"
          >
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold whitespace-nowrap">Unlock Pro</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">→</span>
            </div>
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Analysis Complete</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Your Growth Analysis is{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Ready
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              >
                Join 2,000+ businesses using OptimaliQ to get ongoing insights, 
                real-time benchmarks, and AI-powered growth strategies.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ChartBarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
                  <p className="text-gray-600">Track your progress with live benchmarks and industry comparisons</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                  <p className="text-gray-600">Get personalized recommendations that drive measurable results</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CurrencyDollarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven ROI</h3>
                  <p className="text-gray-600">Average 3x faster growth and 40% efficiency improvements</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20 space-y-10">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="gap-2 bg-white/70 backdrop-blur rounded-xl p-1 shadow-sm border border-gray-200">
                <TabsTrigger value="overview" className="text-base md:text-lg font-bold px-4 py-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-transparent data-[state=inactive]:hover:border-gray-300">Overview</TabsTrigger>
                <TabsTrigger value="cards" className="text-base md:text-lg font-bold px-4 py-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-transparent data-[state=inactive]:hover:border-gray-300">OptimaliQ Score Cards</TabsTrigger>
                <TabsTrigger value="growth" className="text-base md:text-lg font-bold px-4 py-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-transparent data-[state=inactive]:hover:border-gray-300">Growth Chart</TabsTrigger>
                <TabsTrigger value="insights" className="text-base md:text-lg font-bold px-4 py-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-transparent data-[state=inactive]:hover:border-gray-300">Strategic Insights</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div>
                  <ScoreCardGrid score={score} />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="cards">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ScoreCardGrid score={score} />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="growth">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ScoreLineChart data={roadmapData} score={score} />
              </motion.div>
            </TabsContent>

            <TabsContent value="insights">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ScoreInsightGrid loading={loading} insights={insights} />
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Conversion Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Accelerate Your Growth?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get unlimited access to AI-powered insights, real-time benchmarks, and personalized growth strategies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <div className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className="w-6 h-6" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className="w-6 h-6" />
                  <span>No long-term contracts</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className="w-6 h-6" />
                  <span>Cancel anytime</span>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowSubscriptionPopup(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                Unlock Your Full Potential
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subscription Popup */}
      <SubscriptionPopup
        isOpen={showSubscriptionPopup}
        onClose={handleCloseSubscriptionPopup}
      />
    </>
  )
}

// Main export with Suspense
export default function Step3Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading your insights...</p>
        </div>
      </div>
    }>
      <Step3Component />
    </Suspense>
  )
}