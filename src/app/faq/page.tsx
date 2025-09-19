/**
 * OptimaliQ FAQ Page
 * Comprehensive frequently asked questions with search and categories
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Target,
  CreditCard,
  Shield,
  Users,
  BarChart3,
  Settings,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Zap,
  Filter,
  Book,
  Video,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">OptimaliQ</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact Support
            </Link>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              <HelpCircle className="h-4 w-4 mr-2" />
              Frequently Asked Questions
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              How Can We{' '}
              <span className="text-primary">Help You?</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers to common questions about OptimaliQ's AI-powered growth assessment platform.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>
          </motion.div>

          {/* FAQ Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">What is OptimaliQ?</h3>
              <p className="text-muted-foreground">
                OptimaliQ is an AI-powered growth assessment platform that helps organizations identify growth opportunities, 
                optimize their strategies, and achieve sustainable business growth through data-driven insights.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">How does the assessment work?</h3>
              <p className="text-muted-foreground">
                Our assessment uses advanced AI algorithms to analyze your organization's current state, 
                identify growth opportunities, and provide personalized recommendations for improvement.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Yes, we take data security seriously. All data is encrypted in transit and at rest, 
                and we comply with industry-standard security practices and regulations.
              </p>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}