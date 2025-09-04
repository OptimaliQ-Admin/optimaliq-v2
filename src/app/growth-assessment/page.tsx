'use client'

import React, { useState, useEffect } from 'react'
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
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

// Enhanced lead capture with AI-powered insights
export default function GrowthAssessmentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    industry: '',
    role: '',
    companySize: '',
    revenueRange: '',
    privacyConsent: false,
    marketingConsent: false
  })

  const [insights, setInsights] = useState<string[]>([])
  const [showInsights, setShowInsights] = useState(false)

  // AI-powered insights based on form data
  useEffect(() => {
    if (formData.industry && formData.role && formData.companySize) {
      const aiInsights = generateAIInsights(formData)
      setInsights(aiInsights)
      setShowInsights(true)
    }
  }, [formData.industry, formData.role, formData.companySize])

  const generateAIInsights = (data: any) => {
    const insights = []
    
    if (data.industry === 'Technology') {
      insights.push('🚀 Tech companies typically see 40% faster growth with AI-driven strategies')
      insights.push('💡 Your role suggests you need real-time market intelligence for decision making')
    }
    
    if (data.companySize === '11-50') {
      insights.push('📈 Companies your size often struggle with scaling processes - we can help optimize')
      insights.push('🎯 Focus on operational efficiency and team alignment for maximum impact')
    }
    
    if (data.role === 'CEO' || data.role === 'Founder') {
      insights.push('👑 Leadership roles benefit most from strategic AI insights and market intelligence')
      insights.push('⚡ You need actionable data, not just reports - our AI delivers exactly that')
    }
    
    return insights
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/leads/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success && result.data) {
        localStorage.setItem('growth_assessment_user', JSON.stringify({ 
          ...formData, 
          userId: result.data.userId 
        }))
        toast.success(result.data.message)
        
        // Redirect to enhanced AI assessment
        setTimeout(() => {
          router.push('/growth-assessment/ai-powered')
        }, 1500)
      } else {
        throw new Error(result.message || 'Lead processing failed')
      }
    } catch (error) {
      console.error('Lead processing error:', error)
      toast.error('Failed to process your information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Basic Info', icon: User },
    { id: 2, title: 'Company Details', icon: Building },
    { id: 3, title: 'AI Insights', icon: Brain }
  ]

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
              <span className="text-xl font-bold text-gray-900">OptimaliQ</span>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Assessment
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  ${currentStep >= step.id 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8"
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Let's Get to Know You
                </h1>
                <p className="text-gray-600 text-lg">
                  Tell us about yourself so we can personalize your growth assessment
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="role">Your Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CEO">CEO</SelectItem>
                        <SelectItem value="Founder">Founder</SelectItem>
                        <SelectItem value="CTO">CTO</SelectItem>
                        <SelectItem value="CMO">CMO</SelectItem>
                        <SelectItem value="VP">VP</SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Company Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tell Us About Your Company
                </h1>
                <p className="text-gray-600 text-lg">
                  Help us understand your business context for better insights
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companySize">Company Size *</Label>
                    <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="revenueRange">Annual Revenue *</Label>
                    <Select value={formData.revenueRange} onValueChange={(value) => setFormData({ ...formData, revenueRange: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under $100K">Under $100K</SelectItem>
                        <SelectItem value="$100K-$500K">$100K-$500K</SelectItem>
                        <SelectItem value="$500K-$1M">$500K-$1M</SelectItem>
                        <SelectItem value="$1M-$5M">$1M-$5M</SelectItem>
                        <SelectItem value="$5M-$10M">$5M-$10M</SelectItem>
                        <SelectItem value="$10M-$50M">$10M-$50M</SelectItem>
                        <SelectItem value="$50M-$100M">$50M-$100M</SelectItem>
                        <SelectItem value="Over $100M">Over $100M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Privacy Consent */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacyConsent"
                      checked={formData.privacyConsent}
                      onCheckedChange={(checked) => setFormData({ ...formData, privacyConsent: !!checked })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="privacyConsent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I agree to the Privacy Policy and Terms of Service *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        We'll use your information to provide personalized insights and recommendations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketingConsent"
                      checked={formData.marketingConsent}
                      onCheckedChange={(checked) => setFormData({ ...formData, marketingConsent: !!checked })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="marketingConsent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Send me growth insights and updates (optional)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Get weekly insights, case studies, and growth strategies delivered to your inbox.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: AI Insights Preview */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  AI-Powered Insights Preview
                </h1>
                <p className="text-gray-600 text-lg">
                  Based on your information, here's what our AI has already discovered
                </p>
              </div>

              <div className="space-y-6">
                {showInsights && insights.length > 0 && (
                  <div className="grid gap-4">
                    {insights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Lightbulb className="text-white text-xs" />
                          </div>
                          <p className="text-gray-700 text-sm">{insight}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Rocket className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Ready for Your Full Assessment?</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Our AI will analyze your responses in real-time and provide personalized growth strategies, 
                    market insights, and actionable recommendations tailored to your specific situation.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Real-time AI analysis</span>
                    <CheckCircle className="w-4 h-4 ml-4" />
                    <span>Personalized recommendations</span>
                    <CheckCircle className="w-4 h-4 ml-4" />
                    <span>Market intelligence</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && (!formData.name || !formData.email || !formData.role || !formData.industry)) ||
                  (currentStep === 2 && (!formData.companySize || !formData.revenueRange || !formData.privacyConsent))
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !formData.privacyConsent}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start AI Assessment
                    <Brain className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by 10,000+ companies worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Industry Leader</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">40% Avg. Growth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const Building = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)