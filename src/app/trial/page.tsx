/**
 * OptimaliQ Trial Signup Page
 * Professional trial signup flow with feature highlights and onboarding
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Crown,
  Zap,
  Target,
  Users,
  BarChart3,
  TrendingUp,
  Shield,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Gift,
  Sparkles,
  Rocket,
  Calendar,
  Mail,
  Phone,
  Building,
  User,
  CreditCard,
  Lock,
  Play,
  Eye,
  Download,
  Settings,
  Bell,
  Globe,
  Headphones
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { Select, Checkbox } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Trial signup data
const trialData = {
  trialLength: 14,
  originalPrice: 99,
  features: [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Unlimited Assessments',
      description: 'Complete as many assessments as you need during your trial',
      highlight: true
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Team Collaboration',
      description: 'Invite up to 10 team members and collaborate on assessments',
      highlight: true
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Advanced Analytics',
      description: 'Access comprehensive dashboards and progress tracking',
      highlight: true
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: 'Custom Action Plans',
      description: 'Get personalized 30-day action plans with task management',
      highlight: false
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Industry Benchmarks',
      description: 'Compare your performance against industry standards',
      highlight: false
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Priority Support',
      description: 'Get priority email support and expert guidance',
      highlight: false
    }
  ],
  timeline: [
    {
      day: 'Day 1',
      title: 'Complete Your First Assessment',
      description: 'Get comprehensive insights into your organization\'s current state',
      icon: <Target className="h-5 w-5" />
    },
    {
      day: 'Day 3',
      title: 'Invite Your Team',
      description: 'Add team members and start collaborative assessments',
      icon: <Users className="h-5 w-5" />
    },
    {
      day: 'Day 7',
      title: 'Implement Action Plan',
      description: 'Begin executing your personalized 30-day growth plan',
      icon: <Rocket className="h-5 w-5" />
    },
    {
      day: 'Day 14',
      title: 'Track Progress',
      description: 'Review progress and decide if OptimaliQ is right for you',
      icon: <BarChart3 className="h-5 w-5" />
    }
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
  testimonials: [
    {
      quote: 'The 14-day trial gave us enough time to see real results. We upgraded immediately after seeing the impact.',
      author: 'Jennifer Walsh',
      role: 'CEO, HealthForward',
      result: '40% efficiency gain in trial period'
    },
    {
      quote: 'Within a week of the trial, we had identified $200K in potential savings. The ROI was immediate.',
      author: 'Marcus Thompson',
      role: 'Director, EduTech Solutions',
      result: '$200K savings identified'
    }
  ]
}

export default function TrialPage() {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    organizationSize: '',
    industry: '',
    phone: '',
    agreeToTerms: false,
    agreeToMarketing: false
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to start trial', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.company && formData.organizationSize && formData.industry &&
                     formData.agreeToTerms

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
          
          <div className="flex items-center space-x-4">
            <StatusBadge status="success" size="sm">
              <Gift className="h-4 w-4 mr-1" />
              {trialData.trialLength}-Day Free Trial
            </StatusBadge>
          </div>
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
              <Crown className="h-4 w-4 mr-2" />
              Professional Trial
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Start Your{' '}
              <span className="text-primary">{trialData.trialLength}-Day Free Trial</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Experience the full power of OptimaliQ Professional with unlimited assessments, 
              team collaboration, and advanced analytics. No credit card required.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span>Full {trialData.trialLength} days</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Trial Features */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">What's Included in Your Trial</h2>
            <p className="text-xl text-muted-foreground">
              Get full access to all Professional features for {trialData.trialLength} days
            </p>
          </motion.div>

          <Grid cols={3} gap={6} className="mb-16">
            {trialData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full ${feature.highlight ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                  <div className="text-center">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg inline-flex mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    {feature.highlight && (
                      <StatusBadge status="primary" size="sm" className="mt-3">
                        Most Popular
                      </StatusBadge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Trial Signup Form */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={12} className="items-start">
            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Start Your Free Trial</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Trial Started!</h3>
                    <p className="text-muted-foreground mb-6">
                      Welcome to OptimaliQ Professional! Check your email for login instructions 
                      and getting started guide.
                    </p>
                    <div className="space-y-3">
                      <Button asChild>
                        <Link href="/auth/login">
                          Sign In to Your Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/assessment">
                          Start First Assessment
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Work Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your work email"
                        required
                      />
                    </div>

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
                          options={trialData.organizationSizes}
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
                          options={trialData.industries}
                          value={formData.industry}
                          onValueChange={(value) => handleInputChange('industry', value)}
                          placeholder="Select industry"
                          required
                        />
                      </div>
                    </Grid>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number (Optional)
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                          required
                        />
                        <label htmlFor="terms" className="text-sm">
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="marketing"
                          checked={formData.agreeToMarketing}
                          onCheckedChange={(checked) => handleInputChange('agreeToMarketing', checked as boolean)}
                        />
                        <label htmlFor="marketing" className="text-sm">
                          I'd like to receive updates about OptimaliQ features and best practices (optional)
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!isFormValid}
                      loading={isSubmitting}
                      loadingText="Starting your trial..."
                    >
                      Start {trialData.trialLength}-Day Free Trial
                      <Rocket className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      No credit card required • Full access • Cancel anytime
                    </div>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Trial Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Trial Value */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Trial Value</h3>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${trialData.originalPrice * (trialData.trialLength / 30)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Worth of Professional features
                  </div>
                  <StatusBadge status="success">100% Free</StatusBadge>
                </div>
              </Card>

              {/* Trial Timeline */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your {trialData.trialLength}-Day Journey</h3>
                <div className="space-y-4">
                  {trialData.timeline.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{step.day}</span>
                          <span className="text-sm font-semibold">{step.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Success Stories */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trial Success Stories</h3>
                <div className="space-y-4">
                  {trialData.testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <p className="text-sm italic mb-3">"{testimonial.quote}"</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{testimonial.author}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                        <StatusBadge status="success" size="xs">
                          {testimonial.result}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Support */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trial Support</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Headphones className="h-4 w-4 text-primary" />
                    <span>Dedicated trial support team</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Free onboarding session</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>Priority email support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Comprehensive documentation</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Social Proof */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-12">Join 500+ Organizations Already Succeeding</h2>
            
            <Grid cols={4} gap={6} className="mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">96%</div>
                <div className="text-sm text-muted-foreground">Trial Conversion</div>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">45%</div>
              <div className="text-sm text-muted-foreground">Avg Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">$2.5M</div>
                <div className="text-sm text-muted-foreground">Value Generated</div>
              </div>
            </Grid>

            <Card className="p-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
                <span className="font-semibold ml-2">4.9/5 Trial Satisfaction</span>
              </div>
              <blockquote className="text-lg italic">
                "The trial period was perfect to understand the value. We saw immediate insights 
                that helped us make better decisions from day one."
              </blockquote>
              <div className="text-sm text-muted-foreground mt-4">
                - Average trial user feedback
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Organization?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start your {trialData.trialLength}-day free trial today and experience the full power of 
                AI-driven business intelligence and strategic planning.
              </p>
              
              <Button size="lg" className="text-lg px-8 py-4 mb-6" onClick={handleSubmit}>
                Start Free Trial Now
                <Rocket className="ml-2 h-5 w-5" />
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>No commitment • No credit card • Cancel anytime</p>
              </div>
            </Card>
          </motion.div>
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
