/**
 * OptimaliQ Subscribe Page
 * Premium strategic intelligence and growth platform access
 * Recreated from original GTM Plus v3.1 design with enterprise-grade feel
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Rocket,
  BarChart3,
  Crown,
  CheckCircle,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  Zap,
  Brain,
  Globe,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'

// Subscription plans data
const subscriptionPlans = [
  {
    id: 'accelerator',
    name: 'Accelerator',
    price: 99,
    period: 'month',
    description: 'Perfect for growing businesses ready to scale',
    features: [
      'AI-powered strategic insights',
      'Real-time market intelligence',
      'Competitive benchmarking',
      'Growth roadmap planning',
      'Email support',
      'Monthly strategy reports'
    ],
    popular: false,
    cta: 'Start Accelerator Plan'
  },
  {
    id: 'strategic',
    name: 'Strategic',
    price: 299,
    period: 'month',
    description: 'Advanced analytics for established organizations',
    features: [
      'Everything in Accelerator',
      'Advanced AI analytics',
      'Custom growth simulations',
      'Priority support',
      'Weekly strategy sessions',
      'Team collaboration tools',
      'API access',
      'Custom integrations'
    ],
    popular: true,
    cta: 'Start Strategic Plan'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'year',
    description: 'Full-scale AI platform for enterprise organizations',
    features: [
      'Everything in Strategic',
      'Dedicated success manager',
      'Custom AI model training',
      'White-label solutions',
      'Advanced security features',
      'SLA guarantees',
      'On-premise options',
      'Custom development'
    ],
    popular: false,
    cta: 'Contact Sales'
  }
]

// Trust indicators data
const trustIndicators = [
  {
    icon: Shield,
    title: 'SOC 2 Type II',
    description: 'Enterprise-grade security compliance'
  },
  {
    icon: Users,
    title: '500+ Organizations',
    description: 'Trusted by industry leaders worldwide'
  },
  {
    icon: TrendingUp,
    title: '2.5x Average Growth',
    description: 'Proven results across industries'
  },
  {
    icon: Zap,
    title: '99.9% Uptime',
    description: 'Reliable platform performance'
  }
]

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState('strategic')
  const [billingCycle, setBillingCycle] = useState('monthly')

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleBillingToggle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')
  }

  const getAnnualDiscount = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.2) // 20% discount
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-4 lg:py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start pt-4"
        >
          {/* Left Column - Header */}
          <div className="relative text-left flex flex-col justify-center h-full space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold w-fit"
            >
              <Rocket className="h-4 w-4" />
              <span>Premium Strategic Intelligence</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Unlock{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Premium Insights
              </span>{" "}
              & Strategic Growth
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-gray-600 leading-relaxed max-w-2xl"
            >
              Get <strong className="text-gray-900">unlimited access</strong> to AI-powered strategic insights,{" "}
              <strong className="text-gray-900">real-time market intelligence</strong>, and{" "}
              <strong className="text-gray-900">personalized growth roadmaps</strong> that scale with your business.
            </motion.p>

            {/* Feature Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-sm text-gray-600">Deep-dive insights with competitive benchmarking and trend analysis</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Growth Studio</h3>
                <p className="text-sm text-gray-600">Interactive simulations and strategic planning tools</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Crown className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Premium Support</h3>
                <p className="text-sm text-gray-600">Priority access to strategic consultation and expert guidance</p>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-8 pt-8 border-t border-gray-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">No long-term contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Instant access</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Pricing Plans */}
          <div className="space-y-6">
            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingCycle === 'annual'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Annual
                  {billingCycle === 'annual' && (
                    <span className="ml-2 inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Save 20%
                    </span>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 shadow-blue-500/25'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                      
                      {/* Pricing */}
                      <div className="mb-4">
                        {typeof plan.price === 'number' ? (
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-gray-900">
                              ${billingCycle === 'annual' ? Math.round(plan.price * 12 * 0.8) : plan.price}
                            </span>
                            <span className="text-gray-600 ml-1">
                              /{billingCycle === 'annual' ? 'year' : plan.period}
                            </span>
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                        )}
                        
                        {billingCycle === 'annual' && typeof plan.price === 'number' && (
                          <div className="text-sm text-green-600 font-medium">
                            Save ${getAnnualDiscount(plan.price)} annually
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full ${
                        selectedPlan === plan.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enterprise CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-6 text-white text-center"
            >
              <h3 className="text-xl font-bold mb-2">Need Enterprise Solutions?</h3>
              <p className="text-gray-300 mb-4">
                Get custom AI models, white-label solutions, and dedicated support for large organizations.
              </p>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Contact Enterprise Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Trust Section */}
      <div className="bg-white border-t border-gray-200 py-16 mt-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-12"
            >
              Trusted by Industry Leaders Worldwide
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <indicator.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{indicator.title}</h3>
                  <p className="text-sm text-gray-600">{indicator.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 text-center mb-12"
            >
              Frequently Asked Questions
            </motion.h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "Can I change my plan at any time?",
                  answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans. All payments are processed securely through Stripe."
                },
                {
                  question: "Is there a free trial available?",
                  answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start your trial."
                },
                {
                  question: "What kind of support do you provide?",
                  answer: "All plans include email support. Strategic and Enterprise plans include priority support, while Enterprise includes dedicated success management."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
