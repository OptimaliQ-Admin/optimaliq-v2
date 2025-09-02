/**
 * OptimaliQ Landing Page
 * AI-powered growth strategy platform for businesses
 * Recreated from original GMF Plus v3.1 design
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Lightbulb,
  Shield,
  Zap,
  Globe,
  Award,
  Play,
  Quote,
  ArrowDown,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Tooltip } from '@/components/ui/feedback'
import { LineChart, MetricCard } from '@/components/ui/charts'

// Hero Section Data - Original GMF Plus v3.1 content
const heroData = {
  title: "Smarter Decisions.",
  subtitle: "Faster Growth.",
  description: "Unlock predictable growth with AI-driven strategy insights and real-time competitive benchmarking.",
  cta: "Start Free Growth Audit",
  trustIndicators: [
    "Free Assessment",
    "No Credit Card Required", 
    "Instant Results"
  ]
}

// Key Features Data - Original GMF Plus v3.1 content
const features = [
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "AI-Powered Business Assessments",
    description: "Instantly analyze your business health, identify strategy gaps, and uncover optimization potential.",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Real-Time Strategy Optimization",
    description: "Adapt dynamically with AI-driven insights, adjusting your business strategy as new data emerges.",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100"
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Competitive Benchmarking",
    description: "Compare your performance with industry leaders and uncover actionable areas for growth.",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100"
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Predictive Growth Insights",
    description: "Forecast market shifts and make proactive, data-driven decisions before your competition.",
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-50 to-orange-100"
  }
]

// How It Works Data - Original GMF Plus v3.1 content
const howItWorksSteps = [
  {
    id: 1,
    title: "Assess & Identify",
    description: "We analyze your strategy, operations, and market position to uncover high-impact growth opportunities. Our data-driven insights help you overcome obstacles, scale efficiently, and maximize ROI—tailored to your business challenges.",
    icon: <BarChart3 className="h-8 w-8" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100"
  },
  {
    id: 2,
    title: "Data-Driven Insights",
    description: "Harnessing machine learning across industries, we provide customized insights tailored to your business objectives. Our models analyze real-world trends, market shifts, and operational data to help you identify opportunities, mitigate risks, and drive scalable growth.",
    icon: <Target className="h-8 w-8" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100"
  },
  {
    id: 3,
    title: "Implement & Scale",
    description: "Transform strategic insights into measurable success with custom recommendations designed to enhance revenue, improve operational efficiency, and strengthen your competitive edge.",
    icon: <TrendingUp className="h-8 w-8" />,
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100"
  }
]

// Why OptimaliQ Data - Original GMF Plus v3.1 content
const whyOptimaliQComparison = [
  ["Cost", "Starts at $249/mo", "$10,000+ Retainers"],
  ["Speed", "Instant, AI-Powered Insights", "Weeks of Manual Reporting"],
  ["Actionability", "Real-Time Strategy Adjustments", "Static Reports & Decks"],
  ["Market Awareness", "Live Trend + Benchmark Data", "Limited to Analyst Opinion"],
  ["Scalability", "Continuously Learns & Improves", "Bound by Human Bandwidth"],
  ["Execution", "AI Task Recommendations & Playbooks", "Requires Internal Teams"]
]

// FAQ Data - Original GMF Plus v3.1 content
const faqs = [
  {
    question: "How does OptimaliQ compare to hiring a consultant?",
    answer: "OptimaliQ delivers continuous, AI-powered insights instantly, while consulting firms charge high retainers for one-time reports. Our platform provides real-time strategy optimization, competitive benchmarking, and predictive insights at a fraction of the cost."
  },
  {
    question: "Can this work for small businesses?",
    answer: "Absolutely! Whether you're a startup or enterprise, OptimaliQ adapts to your needs with AI-driven insights that scale as you grow. Our platform is designed to provide value for businesses of all sizes."
  },
  {
    question: "Can I talk to a real person?",
    answer: "Absolutely. Our team offers live onboarding and optional strategy sessions to help you succeed."
  },
  {
    question: "How does OptimaliQ predict growth?",
    answer: "We analyze real-time industry data, past performance, and competitive benchmarks using advanced machine learning algorithms to provide accurate business forecasts and strategic recommendations."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. OptimaliQ uses industry best practices to ensure your business data is protected. We follow strict data privacy protocols, implement enterprise-grade encryption, and never share your information with third parties. Your trust is our priority, and we continuously monitor and improve our security posture."
  },
  {
    question: "How often does OptimaliQ update insights?",
    answer: "Our AI continuously learns and updates insights in real-time, ensuring you always have the latest competitive intelligence and market trends to inform your strategic decisions."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We provide comprehensive support including onboarding, strategic consultation, and ongoing optimization. Our team of experts is available to help you maximize the value of your OptimaliQ investment."
  }
]

// Page sections for navigation
const pageSections = [
  { id: "hero", label: "Home", icon: "🏠" },
  { id: "trust-indicators", label: "Trust", icon: "🛡️" },
  { id: "how-it-works", label: "How It Works", icon: "⚙️" },
  { id: "key-features", label: "Features", icon: "✨" },
  { id: "why-optimaliq", label: "Why OptimaliQ", icon: "🎯" },
  { id: "newsletter", label: "Newsletter", icon: "📧" },
  { id: "faq", label: "FAQ", icon: "❓" }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#key-features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#why-optimaliq" className="text-sm font-medium hover:text-primary transition-colors">Why OptimaliQ</a>
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <Section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-blue-900/75 to-indigo-900/80" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Enhanced Content */}
        <div className="relative z-10 w-full">
          <Container className="max-w-7xl mx-auto px-6">
          <Grid cols={2} gap={8} className="items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Enhanced Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl lg:text-7xl font-bold text-white leading-tight"
                >
                {heroData.title}
                  <br />
                  <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {heroData.subtitle}
                  </span>
                </motion.h1>

                {/* Enhanced Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl"
                >
                  {heroData.description}
                </motion.p>

                {/* Enhanced CTA Button */}
                  <motion.div
                  initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                  >
                    {heroData.cta}
                  </Button>
                  </motion.div>

                {/* Enhanced Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex items-center gap-6 pt-4"
                >
                  {heroData.trustIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-sm">{indicator}</span>
                    </div>
                  ))}
                </motion.div>
            </motion.div>
            
              {/* Enhanced Visual Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
                {/* Dashboard Preview */}
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white font-medium">Live Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                  </div>
                  
                  {/* Mock Dashboard Content */}
                  <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">85.2</div>
                        <div className="text-xs text-gray-300">Performance</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">+12.5%</div>
                        <div className="text-xs text-gray-300">Growth</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">92%</div>
                        <div className="text-xs text-gray-300">Efficiency</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Market Position</span>
                        <span className="text-sm text-green-400">Top 10%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-white">+15% ROI</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-white">Goal Achieved</span>
                  </div>
                </motion.div>
            </motion.div>
          </Grid>
          </Container>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </Section>

      {/* Trust Indicators Section */}
      <Section id="trust-indicators" className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join hundreds of executives who trust OptimaliQ to drive their growth strategy
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Organizations Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">2.5x</div>
              <div className="text-sm text-gray-600">Average Growth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">AI Support</div>
            </div>
          </div>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              How It Works
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Three Steps to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Strategic Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our proven methodology combines AI-powered analysis with strategic execution to deliver measurable business impact.
            </p>
          </motion.div>
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 z-20">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} text-white flex items-center justify-center rounded-full text-xl font-bold shadow-lg`}>
                    {step.id}
                  </div>
                </div>
                
                <div className={`relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 h-full`}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} text-white flex items-center justify-center rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Key Features Section */}
      <Section id="key-features" className="py-24 bg-white">
        <Container>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Key Features
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Enterprise-Grade{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Strategic Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The essential tools designed to accelerate growth, optimize strategy, and maximize efficiency across your entire organization.
            </p>
          </motion.div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} text-white flex items-center justify-center rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
        </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why OptimaliQ Section */}
      <Section id="why-optimaliq" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Why Choose <span className="text-blue-200">OptimaliQ</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              The{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <span className="text-blue-600">OptimaliQ</span> Advantage
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your competitors are scaling faster by using AI to optimize strategy, streamline execution, and stay ahead of the market. <span className="text-blue-600 font-semibold">OptimaliQ</span> gives you that same edge — for less than the cost of one hour with a consultant.
            </p>
          </motion.div>
          
          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-12"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="p-6 text-left font-semibold text-lg">Feature</th>
                    <th className="p-6 text-center font-semibold text-lg"><span className="text-blue-200">OptimaliQ</span></th>
                    <th className="p-6 text-center font-semibold text-lg">Traditional Consulting</th>
                  </tr>
                </thead>
                <tbody>
                  {whyOptimaliQComparison.map(([label, optimaliq, consulting], i) => (
                    <motion.tr
                      key={label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className={`border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-200`}
                    >
                      <td className="p-6 font-semibold text-gray-900">{label}</td>
                      <td className="p-6 text-center">
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {optimaliq}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {consulting}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Newsletter Section */}
      <Section id="newsletter" className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Unlock Your Growth Potential?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get your comprehensive growth report and personalized strategic recommendations in minutes.
            </p>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                  Get My Free Report
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                Join 500+ executives. No spam, unsubscribe anytime.
              </p>
            </div>
            </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" className="py-24 bg-white">
        <Container>
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              FAQ
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about <span className="text-blue-600 font-semibold">OptimaliQ</span>&apos;s AI-powered strategic intelligence platform.
            </p>
          </motion.div>

          {/* FAQ Grid */}
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  )
}
