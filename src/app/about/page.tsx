/**
 * OptimaliQ About Page
 * Company story, mission, team, and values with enterprise AI platform positioning
 * Recreated from original GMF Plus v3.1 design with enterprise-grade feel
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield,
  Heart,
  Brain,
  Rocket,
  Zap,
  Building,
  MapPin,
  Users,
  Linkedin,
  Twitter,
  Quote,
  Github,
  Calendar,
  ArrowRight,
  Target,
  BarChart3,
  Lightbulb,
  Award,
  Globe,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <Section className="py-20 bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-indigo-900/85 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/25 backdrop-blur-md rounded-xl border border-blue-400/40 shadow-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-500/25 backdrop-blur-md rounded-xl border border-indigo-400/40 shadow-lg animate-pulse delay-1000"></div>
        
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
                About OptimaliQ
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  OptimaliQ
                </span>
              </h1>
              <p className="text-2xl font-semibold text-blue-300 mb-8">
                Smarter decisions. Faster growth. Real-time insights.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                OptimaliQ is a next-generation, multi-tier agentic AI platform that revolutionizes how organizations assess and optimize their Strategy, Process, and Technology. We transform raw assessment data into strategic clarity—benchmarking your performance, identifying operational gaps, and delivering personalized roadmaps for growth.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Why We Exist Section */}
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
                Why We Exist
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Most businesses rely on spreadsheets, gut checks, and generic advice to make critical decisions. We believe in a smarter way—where leaders can access McKinsey-style strategic insights in minutes, not months, without needing a six-figure consulting engagement.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* What We Do Section */}
      <Section className="py-16">
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
                What We Do
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                OptimaliQ blends intelligent assessments, AI models, and real-time benchmarks to help organizations:
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  Diagnose Performance
                </h3>
                <p className="text-gray-700 text-center">
                  Comprehensive analysis across strategy, process, and technology to identify strengths and opportunities.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  Benchmark Against Peers
                </h3>
                <p className="text-gray-700 text-center">
                  Compare your performance against industry peers and top performers to understand your competitive position.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  Actionable Growth Plans
                </h3>
                <p className="text-gray-700 text-center">
                  Receive personalized 30-day and 90-day growth plans with specific, actionable recommendations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  Track Progress
                </h3>
                <p className="text-gray-700 text-center">
                  Monitor your growth journey and evolve strategies with each monthly assessment.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you&apos;re a startup scaling operations or an established firm seeking a competitive edge, OptimaliQ gives you the clarity and confidence to move forward with enterprise-grade AI capabilities.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Who We Serve Section */}
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
                Who We Serve
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                OptimaliQ is used by forward-thinking organizations across industries:
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-4 shadow-lg">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Founders & CEOs</h3>
                  <p className="text-blue-100">
                    Looking to scale with precision and data-driven insights
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl mb-4 shadow-lg">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Revenue & Operations Leaders</h3>
                  <p className="text-green-100">
                    Seeking clarity across teams and processes
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl mb-4 shadow-lg">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Consultants & Partners</h3>
                  <p className="text-purple-100">
                    Looking to add strategic value to their clients
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl mb-4 shadow-lg">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Enterprise Organizations</h3>
                  <p className="text-orange-100">
                    Driving transformation with multi-tenant AI architecture
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Our Vision Section */}
      <Section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Vision
              </h2>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-2xl shadow-2xl">
                <p className="text-2xl font-semibold leading-relaxed">
                  To make strategic clarity accessible—powered by AI, grounded in data, and designed for action. We envision a world where every organization has access to McKinsey-level strategic insights through cutting-edge AI technology.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Organization?
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Join hundreds of organizations already using OptimaliQ to accelerate their growth and optimize their operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule a Demo
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
