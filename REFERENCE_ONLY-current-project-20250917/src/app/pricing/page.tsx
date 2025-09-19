/**
 * OptimaliQ Pricing Page
 * Comprehensive pricing plans with enterprise AI platform positioning
 * Recreated from original GMF Plus v3.1 design with enterprise-grade feel
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap, 
  Award, 
  Lightbulb, 
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Heart,
  Brain,
  Rocket,
  Building,
  MapPin,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Calendar,
  Quote,
  X,
  Infinity,
  Clock,
  Phone,
  MessageSquare,
  HelpCircle,
  CreditCard,
  Lock,
  Sparkles,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'

// Pricing data optimized for enterprise AI platform
const pricingData = {
  plans: [
    {
      id: 'free',
      name: 'Free Assessment',
      description: 'Perfect for getting started with organizational insights',
      price: 0,
      period: 'forever',
      popular: false,
      features: [
        'One comprehensive assessment',
        'Basic insights and recommendations',
        'PDF report download',
        'Email support',
        '30-day action plan',
        'Industry benchmarking'
      ],
      limitations: [
        'Limited to 1 assessment per organization',
        'Basic reporting only',
        'No team collaboration',
        'No follow-up assessments'
      ],
      cta: 'Start Free Assessment',
      ctaVariant: 'outline' as const
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For growing organizations that need regular insights',
      price: 99,
      period: 'month',
      popular: true,
      features: [
        'Unlimited assessments',
        'Advanced AI-powered insights',
        'Custom action plans',
        'Progress tracking',
        'Team collaboration (up to 10 members)',
        'Priority email support',
        'Monthly progress reports',
        'Industry benchmarking',
        'Goal setting and tracking',
        'Integration with popular tools'
      ],
      limitations: [],
      cta: 'Start Professional Trial',
      ctaVariant: 'default' as const
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations requiring advanced AI capabilities',
      price: 299,
      period: 'month',
      popular: false,
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Advanced AI models & RAG capabilities',
        'Custom AI training',
        'White-label solutions',
        'Dedicated account manager',
        'Phone & video support',
        'Custom integrations',
        'Advanced analytics & reporting',
        'Multi-tenant architecture',
        'Enterprise security & compliance',
        'SLA guarantees'
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaVariant: 'default' as const
    }
  ],
  features: [
    {
      category: 'AI & Intelligence',
      items: [
        'Multi-provider AI orchestration',
        'Advanced RAG capabilities',
        'Real-time market insights',
        'Predictive analytics',
        'Natural language processing'
      ]
    },
    {
      category: 'Security & Compliance',
      items: [
        'Enterprise-grade security',
        'SOC 2 Type II compliance',
        'GDPR & CCPA ready',
        'Role-based access control',
        'Audit logging & monitoring'
      ]
    },
    {
      category: 'Integration & API',
      items: [
        'RESTful API access',
        'Webhook support',
        'Popular CRM integrations',
        'Custom webhook endpoints',
        'Real-time data sync'
      ]
    }
  ]
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  const getPrice = (plan: typeof pricingData.plans[0]) => {
    if (plan.price === 0) return 0
    return billingCycle === 'annual' ? Math.round(plan.price * 10) : plan.price
  }

  const getPeriod = (plan: typeof pricingData.plans[0]) => {
    if (plan.period === 'forever') return 'forever'
    return billingCycle === 'annual' ? 'year' : 'month'
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Compelling Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Pricing
          </div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6"
          >
            Unlock Your Growth Potential
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Join other companies using AI-powered insights to scale faster, optimize operations, and outperform competitors.
          </motion.p>

          {/* Value Propositions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3x Faster Growth</h3>
              <p className="text-gray-600">What if your strategy could evolve 3x faster than your competition?</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600">Users often see clearer priorities and faster execution within their first month</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accelerated ROI</h3>
              <p className="text-gray-600">Designed to deliver high ROI within the first 6 months — without long-term consulting fees</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-2xl p-1 flex items-center">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  billingCycle === 'annual'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {pricingData.plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className={`relative bg-white rounded-2xl border-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-blue-500 scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">${getPrice(plan)}</span>
                        {plan.price > 0 && (
                          <span className="text-gray-600 ml-2">/{getPeriod(plan)}</span>
                        )}
                      </div>
                      {plan.price === 0 && (
                        <p className="text-sm text-gray-500 mt-1">No credit card required</p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 mb-8">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-start">
                          <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Comparison */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Enterprise-Grade Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {pricingData.features.map((category, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Accelerate Your Growth?</h2>
            <p className="text-lg mb-6 opacity-90">Start your 14-day free trial today. No credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <Check className="w-5 h-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <Check className="w-5 h-5" />
                <span>No long-term contracts</span>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <Check className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
