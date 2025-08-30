/**
 * OptimaliQ Demo Request Page
 * Professional demo scheduling with comprehensive lead capture
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Calendar,
  Clock,
  Users,
  Video,
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  Shield,
  Award,
  Star,
  Building,
  Mail,
  User,
  Globe,
  Headphones,
  Play,
  BookOpen,
  FileText,
  Settings,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Select, Checkbox } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Demo data
const demoData = {
  demoTypes: [
    {
      id: 'live-demo',
      title: 'Live Personalized Demo',
      description: 'One-on-one demo tailored to your organization\'s needs',
      duration: '30 minutes',
      features: [
        'Personalized assessment walkthrough',
        'Custom scenarios for your industry',
        'Q&A with product experts',
        'Implementation guidance'
      ],
      popular: true
    },
    {
      id: 'team-demo',
      title: 'Team Demonstration',
      description: 'Group demo for your leadership team or stakeholders',
      duration: '45 minutes',
      features: [
        'Team collaboration features',
        'Multi-user assessment flows',
        'Dashboard and reporting overview',
        'Team management capabilities'
      ],
      popular: false
    },
    {
      id: 'technical-demo',
      title: 'Technical Deep Dive',
      description: 'In-depth technical demonstration for IT and development teams',
      duration: '60 minutes',
      features: [
        'API and integration capabilities',
        'Security and compliance overview',
        'Data architecture discussion',
        'Implementation planning'
      ],
      popular: false
    }
  ],
  timeSlots: [
    { value: '9:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' }
  ],
  organizationSizes: [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ],
  industries: [
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'nonprofit', label: 'Non-Profit' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'retail', label: 'Retail' },
    { value: 'other', label: 'Other' }
  ],
  benefits: [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Personalized Experience',
      description: 'See OptimaliQ configured for your specific industry and use case'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Expert Guidance',
      description: 'Get answers from our product experts and implementation specialists'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Live Data Examples',
      description: 'See real assessment results and insights relevant to your organization'
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: 'Implementation Planning',
      description: 'Discuss implementation strategy and timeline for your organization'
    }
  ]
}

export default function DemoPage() {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    organizationSize: '',
    industry: '',
    demoType: 'live-demo',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
    goals: '',
    currentChallenges: ''
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit demo request', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.company && formData.organizationSize && formData.industry &&
                     formData.preferredDate && formData.preferredTime

  const selectedDemoType = demoData.demoTypes.find(type => type.id === formData.demoType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">OptimaliQ</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
            <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Button asChild>
              <Link href="/assessment">Start Assessment</Link>
            </Button>
          </nav>
        </Container>
      </header>

      {/* Hero Section */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              <Video className="h-4 w-4 mr-2" />
              Schedule Your Demo
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              See OptimaliQ in{' '}
              <span className="text-primary">Action</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get a personalized demonstration of how OptimaliQ can transform your organization's 
              strategic planning and growth initiatives. See real insights tailored to your industry.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span>30-60 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure & confidential</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Demo Benefits */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={4} gap={6} className="mb-20">
            {demoData.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg inline-flex mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Demo Form */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={12} className="items-start">
            {/* Demo Request Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Schedule Your Demo</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Demo Scheduled!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your interest. We'll send you a calendar invitation and demo details shortly.
                    </p>
                    <div className="space-y-3">
                      <Button asChild>
                        <Link href="/assessment">
                          Start Free Assessment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                        Schedule Another Demo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <Grid cols={2} gap={4}>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            First Name *
                          </label>
                          <Input
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Last Name *
                          </label>
                          <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </Grid>

                      <Grid cols={2} gap={4} className="mt-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </Grid>
                    </div>

                    {/* Organization Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Organization Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Company/Organization *
                          </label>
                          <Input
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Enter your organization name"
                            required
                          />
                        </div>

                        <Grid cols={2} gap={4}>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Organization Size *
                            </label>
                            <Select
                              options={demoData.organizationSizes}
                              value={formData.organizationSize}
                              onValueChange={(value) => handleInputChange('organizationSize', value)}
                              placeholder="Select size"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Industry *
                            </label>
                            <Select
                              options={demoData.industries}
                              value={formData.industry}
                              onValueChange={(value) => handleInputChange('industry', value)}
                              placeholder="Select industry"
                              required
                            />
                          </div>
                        </Grid>
                      </div>
                    </div>

                    {/* Demo Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Demo Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Demo Type
                          </label>
                          <Select
                            options={demoData.demoTypes.map(type => ({
                              value: type.id,
                              label: `${type.title} (${type.duration})`
                            }))}
                            value={formData.demoType}
                            onValueChange={(value) => handleInputChange('demoType', value)}
                          />
                        </div>

                        <Grid cols={3} gap={4}>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Preferred Date *
                            </label>
                            <Input
                              type="date"
                              value={formData.preferredDate}
                              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Preferred Time *
                            </label>
                            <Select
                              options={demoData.timeSlots}
                              value={formData.preferredTime}
                              onValueChange={(value) => handleInputChange('preferredTime', value)}
                              placeholder="Select time"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Timezone
                            </label>
                            <Select
                              options={[
                                { value: 'PST', label: 'Pacific Time (PST)' },
                                { value: 'EST', label: 'Eastern Time (EST)' },
                                { value: 'CST', label: 'Central Time (CST)' },
                                { value: 'MST', label: 'Mountain Time (MST)' },
                                { value: 'UTC', label: 'UTC' }
                              ]}
                              value={formData.timezone}
                              onValueChange={(value) => handleInputChange('timezone', value)}
                              placeholder="Select timezone"
                            />
                          </div>
                        </Grid>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Tell Us More</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            What are your main goals with OptimaliQ?
                          </label>
                          <textarea
                            value={formData.goals}
                            onChange={(e) => handleInputChange('goals', e.target.value)}
                            placeholder="e.g., Improve strategic planning, enhance team collaboration, data-driven decision making..."
                            rows={3}
                            className="w-full p-3 border rounded-lg resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            What challenges are you currently facing?
                          </label>
                          <textarea
                            value={formData.currentChallenges}
                            onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                            placeholder="e.g., Lack of data insights, inefficient processes, limited growth visibility..."
                            rows={3}
                            className="w-full p-3 border rounded-lg resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!isFormValid}
                      loading={isSubmitting}
                      loadingText="Scheduling Demo..."
                    >
                      Schedule Demo
                      <Calendar className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Demo Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Selected Demo Type */}
              {selectedDemoType && (
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Video className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">{selectedDemoType.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedDemoType.duration}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{selectedDemoType.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">What's included:</h4>
                    <div className="space-y-2">
                      {selectedDemoType.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* What to Expect */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">What to Expect</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll receive a calendar invitation within 1 hour
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Preparation</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll prepare a customized demo based on your information
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Demo Session</h4>
                      <p className="text-sm text-muted-foreground">
                        Live demonstration with Q&A and implementation planning
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Follow-up</h4>
                      <p className="text-sm text-muted-foreground">
                        Resources and next steps for your organization
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Alternative Options */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Other Options</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/assessment">
                      <Play className="h-4 w-4 mr-3" />
                      Try Free Assessment First
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/contact">
                      <MessageSquare className="h-4 w-4 mr-3" />
                      Chat with Sales Team
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-3" />
                    View Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-3" />
                    Call: +1 (555) 123-4567
                  </Button>
                </div>
              </Card>

              {/* Testimonial */}
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm mb-3">
                      "The demo was incredibly insightful. OptimaliQ's AI-powered insights 
                      immediately showed us opportunities we hadn't considered."
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Sarah Johnson</strong>, CEO at HealthForward
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <Container className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </div>
            
            <nav className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            
            <div className="text-sm text-muted-foreground">
              © 2024 OptimaliQ. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
