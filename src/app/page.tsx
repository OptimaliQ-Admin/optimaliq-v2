/**
 * OptimaliQ Homepage
 * AI-powered growth strategy platform for businesses
 * Recreated from original GMF Plus v3.1 design with enterprise-grade feel
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowDown,
  Check,
  ArrowUp,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'

// Hero data
const heroData = {
  title: "AI-Powered Growth Strategy Platform",
  subtitle: "Transform your business with McKinsey-level strategic insights powered by cutting-edge AI",
  description: "OptimaliQ revolutionizes how organizations assess and optimize their Strategy, Process, and Technology. Get real-time AI insights, competitive benchmarking, and actionable growth strategies.",
  cta: "Start Free Assessment",
  ctaSecondary: "Schedule Demo"
}

// Features data
const features = [
  {
    title: "AI-Powered Strategic Insights",
    description: "Get McKinsey-level strategic analysis powered by advanced AI models and real-time market intelligence",
    icon: "🧠"
  },
  {
    title: "Real-Time Competitive Intelligence",
    description: "Stay ahead with live market data, industry trends, and competitive benchmarking",
    icon: "📊"
  },
  {
    title: "Enterprise-Grade Security",
    description: "SOC 2 Type II compliant with bulletproof security architecture for enterprise organizations",
    icon: "🛡️"
  },
  {
    title: "Multi-Tenant Architecture",
    description: "Scalable platform designed for enterprise growth with complete data isolation",
    icon: "🏢"
  }
]

// How it works steps
const howItWorksSteps = [
  {
    step: "01",
    title: "Complete Assessment",
    description: "Answer strategic questions about your organization's current state and goals",
    icon: "📝"
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "Our advanced AI analyzes your responses using RAG capabilities and real-time data",
    icon: "🤖"
  },
  {
    step: "03",
    title: "Strategic Insights",
    description: "Receive comprehensive insights, benchmarks, and actionable recommendations",
    icon: "💡"
  },
  {
    step: "04",
    title: "Implementation",
    description: "Track progress and optimize with ongoing AI-powered guidance",
    icon: "🚀"
  }
]

// Why OptimaliQ comparison
const whyOptimaliQComparison = [
  {
    feature: "Strategic Insights",
    traditional: "Generic advice",
    optimaliq: "AI-powered, industry-specific recommendations",
    icon: "🎯"
  },
  {
    feature: "Data Sources",
    traditional: "Static reports",
    optimaliq: "Real-time market intelligence & RAG capabilities",
    icon: "📡"
  },
  {
    feature: "Implementation",
    traditional: "One-time consultation",
    optimaliq: "Ongoing AI guidance & progress tracking",
    icon: "🔄"
  },
  {
    feature: "Scalability",
    traditional: "Limited by consultant capacity",
    optimaliq: "Unlimited AI-powered insights & analysis",
    icon: "📈"
  }
]

// FAQ data
const faqs = [
  {
    question: "How accurate are the AI-powered insights?",
    answer: "Our AI models are trained on thousands of organizational assessments and continuously refined. We maintain high accuracy rates through our multi-tier AI architecture and RAG capabilities, providing McKinsey-level strategic analysis."
  },
  {
    question: "What makes OptimaliQ different from traditional consulting?",
    answer: "Unlike traditional consulting, OptimaliQ provides real-time AI insights, continuous optimization, and scalable solutions. Our platform combines cutting-edge AI technology with enterprise-grade security and multi-tenant architecture."
  },
  {
    question: "How secure is my organization's data?",
    answer: "We maintain SOC 2 Type II compliance with enterprise-grade security measures including end-to-end encryption, secure data centers, and strict access controls. Your data is completely isolated and protected."
  },
  {
    question: "Can OptimaliQ scale with my organization?",
    answer: "Absolutely. Our multi-tenant architecture is designed for enterprise growth. Whether you're a startup or Fortune 500 company, our platform scales seamlessly while maintaining performance and security."
  }
]

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="py-20 bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-indigo-900/85 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/25 backdrop-blur-md rounded-xl border border-blue-400/40 shadow-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-500/25 backdrop-blur-md rounded-xl border border-indigo-400/40 shadow-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-blue-400/20 backdrop-blur-md rounded-xl border border-blue-300/30 shadow-lg animate-pulse delay-500"></div>
        
        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Section Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Next-Generation AI Platform
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {heroData.title}
              </h1>
              <p className="text-2xl font-semibold text-blue-300 mb-8">
                {heroData.subtitle}
              </p>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto mb-8">
                {heroData.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {heroData.cta}
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  {heroData.ctaSecondary}
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose OptimaliQ?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with enterprise-grade security and scalability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Get from assessment to implementation in four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600 text-xl">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why OptimaliQ Section */}
      <Section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why OptimaliQ vs Traditional Methods?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              See how our AI-powered platform transforms strategic planning and execution
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature</h3>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Traditional Methods</h3>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">OptimaliQ</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                {whyOptimaliQComparison.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 bg-white rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-medium text-gray-900">{item.feature}</span>
                    </div>
                    <div className="text-center text-gray-600">
                      {item.traditional}
                    </div>
                    <div className="text-center text-blue-600 font-medium">
                      {item.optimaliq}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Newsletter Section */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Stay Ahead with Strategic Intelligence
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Get the latest insights on AI-powered business intelligence and enterprise transformation delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Subscribe
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No spam, unsubscribe anytime. Read our privacy policy.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-700">
                Get answers to common questions about our AI-powered platform
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-6 text-left hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowDown className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: openFaqIndex === index ? 'auto' : 0, opacity: openFaqIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="h-5 w-5 mx-auto" />
      </motion.button>
    </div>
  )
}
