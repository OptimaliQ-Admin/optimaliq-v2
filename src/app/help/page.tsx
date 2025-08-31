/**
 * OptimaliQ Help & Support Page
 * Comprehensive help documentation, FAQs, and support channels
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  HelpCircle, MessageSquare, Phone, Mail, Search, BookOpen,
  FileText, Video, Play, Download, ExternalLink, ArrowRight,
  Zap, Settings, Bell, Users, Target, BarChart3, TrendingUp,
  Calendar, Clock, Star, Award, Rocket, Lightbulb, CheckCircle,
  XCircle, AlertCircle, Info, Plus, Minus, ChevronDown,
  ChevronRight, Bookmark, Share2, ThumbsUp, ThumbsDown,
  MessageCircle, Headphones, LifeBuoy, Shield, Key, Lock,
  Unlock, Database, Cloud, Globe, Building, User, Star as StarIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { MetricCard } from '@/components/ui/charts'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'

// Help data
const helpData = {
  categories: [
    {
      id: 1,
      name: 'Getting Started',
      description: 'Learn the basics and set up your account',
      icon: <Rocket className="h-6 w-6" />,
      color: 'bg-blue-500',
      articles: 12,
      popular: true
    },
    {
      id: 2,
      name: 'Assessments',
      description: 'Create and manage organizational assessments',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-green-500',
      articles: 18,
      popular: true
    },
    {
      id: 3,
      name: 'Team Management',
      description: 'Manage team members and permissions',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-purple-500',
      articles: 15,
      popular: false
    },
    {
      id: 4,
      name: 'Analytics & Reports',
      description: 'Understand your data and generate reports',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-orange-500',
      articles: 22,
      popular: true
    },
    {
      id: 5,
      name: 'Integrations',
      description: 'Connect with third-party services',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-indigo-500',
      articles: 14,
      popular: false
    },
    {
      id: 6,
      name: 'Account & Billing',
      description: 'Manage your account and subscription',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-red-500',
      articles: 8,
      popular: false
    }
  ],
  faqs: [
    {
      id: 1,
      question: 'How do I create my first assessment?',
      answer: 'To create your first assessment, navigate to the Assessments page and click "Create Assessment". Choose from our pre-built templates or start with a blank assessment. Follow the step-by-step wizard to customize questions and settings.',
      category: 'Assessments',
      helpful: 45,
      notHelpful: 2
    },
    {
      id: 2,
      question: 'Can I invite team members to collaborate?',
      answer: 'Yes! You can invite team members from the Team Management page. Click "Invite Member" and enter their email address. They\'ll receive an invitation email with a secure link to join your organization.',
      category: 'Team Management',
      helpful: 38,
      notHelpful: 1
    },
    {
      id: 3,
      question: 'How do I export assessment results?',
      answer: 'Assessment results can be exported in multiple formats. Go to the Reports page, select your assessment, and choose from PDF, Excel, or CSV formats. You can also schedule automatic exports.',
      category: 'Analytics & Reports',
      helpful: 52,
      notHelpful: 3
    },
    {
      id: 4,
      question: 'What integrations are available?',
      answer: 'We offer integrations with popular tools like Slack, Google Analytics, HubSpot, and more. Visit the Integrations page to see all available options and connect your preferred services.',
      category: 'Integrations',
      helpful: 29,
      notHelpful: 1
    }
  ],
  supportChannels: [
    {
      id: 1,
      name: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: <MessageSquare className="h-5 w-5" />,
      availability: '24/7',
      responseTime: '< 2 min',
      color: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Mail className="h-5 w-5" />,
      availability: '24/7',
      responseTime: '< 4 hours',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Phone Support',
      description: 'Speak directly with our experts',
      icon: <Phone className="h-5 w-5" />,
      availability: 'Mon-Fri 9AM-6PM EST',
      responseTime: 'Immediate',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'Community Forum',
      description: 'Connect with other users',
      icon: <Users className="h-5 w-5" />,
      availability: '24/7',
      responseTime: 'Varies',
      color: 'bg-orange-500'
    }
  ],
  quickActions: [
    {
      id: 1,
      name: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: <Video className="h-6 w-6" />,
      color: 'bg-red-500'
    },
    {
      id: 2,
      name: 'API Documentation',
      description: 'Developer resources and guides',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Download Center',
      description: 'Templates and resources',
      icon: <Download className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 4,
      name: 'Feature Requests',
      description: 'Suggest new features',
      icon: <Lightbulb className="h-6 w-6" />,
      color: 'bg-yellow-500'
    }
  ]
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null)

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const filteredCategories = helpData.categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
      category.name.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Help & Support</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions, explore our documentation, and get support when you need it
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles, tutorials, or FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Support Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Get Support</h2>
              <div className="grid grid-cols-2 gap-4">
                {helpData.supportChannels.map((channel) => (
                  <div key={channel.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`h-10 w-10 rounded-lg ${channel.color} flex items-center justify-center`}>
                        {channel.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground">{channel.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>Available: {channel.availability}</span>
                      <span>Response: {channel.responseTime}</span>
                    </div>
                    
                    <Button className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Help Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Help Categories</h2>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    { value: 'getting-started', label: 'Getting Started' },
                    { value: 'assessments', label: 'Assessments' },
                    { value: 'team', label: 'Team Management' },
                    { value: 'analytics', label: 'Analytics & Reports' },
                    { value: 'integrations', label: 'Integrations' },
                    { value: 'account', label: 'Account & Billing' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`h-12 w-12 rounded-lg ${category.color} flex items-center justify-center`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      {category.popular && (
                        <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">
                          Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.articles} articles available
                      </span>
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Browse
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-4">
                {helpData.quickActions.map((action) => (
                  <Button key={action.id} variant="outline" className="h-20 flex-col space-y-2">
                    <div className={`h-6 w-6 ${action.color} rounded`}>
                      {action.icon}
                    </div>
                    <span className="text-sm">{action.name}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {helpData.faqs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg">
                    <button
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <HelpCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{faq.question}</h3>
                          <p className="text-sm text-muted-foreground">{faq.category}</p>
                        </div>
                      </div>
                      {expandedFaq === faq.id ? (
                        <Minus className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4">
                        <div className="pl-11">
                          <p className="text-muted-foreground mb-4">{faq.answer}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful ({faq.helpful})
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Not Helpful ({faq.notHelpful})
                              </Button>
                            </div>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <LifeBuoy className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
                <p className="text-muted-foreground mb-6">
                  Our support team is here to help you succeed
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
