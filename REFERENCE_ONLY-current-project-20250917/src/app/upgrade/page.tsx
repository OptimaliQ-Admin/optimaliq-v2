/**
 * OptimaliQ Subscription Upsell Page
 * Professional upgrade page with feature comparison and value proposition
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
  Infinity,
  Lock,
  Unlock,
  Gift,
  Sparkles,
  Rocket,
  Brain,
  Eye,
  Download,
  Share2,
  Calendar,
  MessageSquare,
  Phone,
  Settings,
  Database,
  Globe,
  Headphones,
  CreditCard,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Checkbox } from '@/components/ui/form'

// Upgrade data
const upgradeData = {
  currentPlan: {
    name: 'Free Assessment',
    features: [
      'One comprehensive assessment',
      'Basic insights and recommendations',
      'PDF report download',
      'Email support'
    ],
    limitations: [
      'Limited to 1 assessment',
      'Basic reporting only',
      'No team collaboration',
      'No progress tracking'
    ]
  },
  recommendedPlan: {
    name: 'Professional',
    price: 99,
    period: 'month',
    originalPrice: 149,
    discount: 34,
    features: [
      'Unlimited assessments',
      'Advanced AI-powered insights',
      'Custom action plans with progress tracking',
      'Team collaboration (up to 10 members)',
      'Priority email support',
      'Monthly progress reports',
      'Industry benchmarking',
      'Goal setting and tracking',
      'Integration with popular tools',
      'Advanced analytics dashboard'
    ],
    bonuses: [
      'Free onboarding session ($200 value)',
      'Custom assessment templates',
      'Priority support queue',
      '30-day money-back guarantee'
    ]
  },
  comparison: [
    {
      feature: 'Number of Assessments',
      free: '1',
      professional: 'Unlimited',
      highlight: true
    },
    {
      feature: 'AI-Powered Insights',
      free: 'Basic',
      professional: 'Advanced + Custom',
      highlight: true
    },
    {
      feature: 'Team Members',
      free: '1',
      professional: '10',
      highlight: true
    },
    {
      feature: 'Progress Tracking',
      free: false,
      professional: true,
      highlight: false
    },
    {
      feature: 'Custom Action Plans',
      free: false,
      professional: true,
      highlight: false
    },
    {
      feature: 'Advanced Analytics',
      free: false,
      professional: true,
      highlight: false
    },
    {
      feature: 'Priority Support',
      free: false,
      professional: true,
      highlight: false
    },
    {
      feature: 'API Access',
      free: false,
      professional: false,
      highlight: false
    }
  ],
  urgency: {
    timeLeft: '2 days',
    discount: '34%',
    originalPrice: 149,
    salePrice: 99
  },
  testimonials: [
    {
      quote: 'Upgrading to Professional was the best decision we made. The advanced insights helped us identify $500K in cost savings.',
      author: 'Michael Chen',
      role: 'COO, TechForward',
      company: 'Technology Startup',
      result: '$500K savings identified'
    },
    {
      quote: 'The team collaboration features transformed how we approach strategic planning. Everyone is aligned now.',
      author: 'Sarah Williams',
      role: 'Executive Director',
      company: 'HealthCare Non-Profit',
      result: '85% team alignment improvement'
    }
  ],
  faqs: [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your current billing period.'
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment in full.'
    },
    {
      question: 'What happens to my free assessment data?',
      answer: 'All your data is preserved and enhanced with additional insights when you upgrade. Nothing is lost.'
    },
    {
      question: 'Can I upgrade later?',
      answer: 'Yes, but this special pricing is only available for a limited time. Regular pricing will apply after the promotion ends.'
    }
  ]
}

export default function UpgradePage() {
  const [isAnnual, setIsAnnual] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const getPrice = () => {
    const basePrice = upgradeData.recommendedPlan.price
    return isAnnual ? Math.round(basePrice * 0.8) : basePrice
  }

  const getSavings = () => {
    const basePrice = upgradeData.recommendedPlan.price
    return isAnnual ? Math.round(basePrice * 0.2 * 12) : upgradeData.recommendedPlan.originalPrice - basePrice
  }

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      window.location.href = '/auth/register?plan=professional'
    } catch (error) {
      console.error('Upgrade failed', error)
    } finally {
      setIsLoading(false)
    }
  }

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
            <StatusBadge status="error" size="sm">
              <Clock className="h-4 w-4 mr-1" />
              Limited Time: {upgradeData.urgency.discount} Off
            </StatusBadge>
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
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Crown className="h-8 w-8 text-yellow-500" />
              <StatusBadge status="primary" className="text-lg px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Professional
              </StatusBadge>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Unlock Your Organization's{' '}
              <span className="text-primary">Full Potential</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              You've seen the power of OptimaliQ's insights. Now get unlimited access to advanced features, 
              team collaboration, and comprehensive growth planning tools.
            </p>

            {/* Urgency Banner */}
            <Alert
              variant="warning"
              title="Limited Time Offer"
              description={`Save ${upgradeData.urgency.discount} on Professional plan - offer expires in ${upgradeData.urgency.timeLeft}!`}
              className="max-w-2xl mx-auto mb-8"
            />
          </motion.div>
        </Container>
      </Section>

      {/* Plan Comparison */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={8}>
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 relative">
                <div className="absolute top-4 right-4">
                  <StatusBadge status="info" size="sm">Current Plan</StatusBadge>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{upgradeData.currentPlan.name}</h3>
                <div className="text-3xl font-bold mb-6">
                  $0<span className="text-lg text-muted-foreground">/forever</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">What you have:</h4>
                    <div className="space-y-2">
                      {upgradeData.currentPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">Limitations:</h4>
                    <div className="space-y-2">
                      {upgradeData.currentPlan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recommended Plan */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 relative ring-2 ring-primary bg-primary/5">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <StatusBadge status="primary" className="px-4 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    Recommended
                  </StatusBadge>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{upgradeData.recommendedPlan.name}</h3>
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">${getPrice()}</span>
                    <span className="text-lg text-muted-foreground">/{isAnnual ? 'month' : 'month'}</span>
                    <span className="text-sm line-through text-muted-foreground">
                      ${upgradeData.recommendedPlan.originalPrice}
                    </span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    Save ${getSavings()} {isAnnual ? 'per year' : 'per month'}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Everything in Free, plus:</h4>
                    <div className="space-y-2">
                      {upgradeData.recommendedPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold mb-2 text-yellow-800">Special Launch Bonuses:</h4>
                    <div className="space-y-1">
                      {upgradeData.recommendedPlan.bonuses.map((bonus, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Gift className="h-3 w-3 text-yellow-600" />
                          <span className="text-sm text-yellow-700">{bonus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleUpgrade}
                    loading={isLoading}
                    loadingText="Processing..."
                  >
                    Upgrade to Professional
                    <Crown className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    30-day money-back guarantee • Cancel anytime
                  </div>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Feature Comparison */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Detailed Feature Comparison</h2>
            <p className="text-xl text-muted-foreground">
              See exactly what you get with Professional plan
            </p>
          </motion.div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-6 font-semibold">Features</th>
                    <th className="text-center p-6 font-semibold">Free</th>
                    <th className="text-center p-6 font-semibold">Professional</th>
                  </tr>
                </thead>
                <tbody>
                  {upgradeData.comparison.map((item, index) => (
                    <tr key={index} className={`border-t ${item.highlight ? 'bg-primary/5' : ''}`}>
                      <td className="p-6">
                        <div className="flex items-center space-x-2">
                          <span>{item.feature}</span>
                          {item.highlight && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        {typeof item.free === 'boolean' ? (
                          item.free ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          item.free
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof item.professional === 'boolean' ? (
                          item.professional ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="font-medium text-primary">{item.professional}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Container>
      </Section>

      {/* Customer Success */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Professional Plan Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              See how Professional plan customers achieve exceptional results
            </p>
          </motion.div>

          <Grid cols={1} gap={8}>
            {upgradeData.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <Star className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-lg mb-4">"{testimonial.quote}"</p>
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold">{testimonial.author}</div>
                              <div className="text-sm text-muted-foreground">
                                {testimonial.role}, {testimonial.company}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {testimonial.result}
                      </div>
                      <div className="text-sm text-muted-foreground">Achieved with Professional</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Common questions about upgrading to Professional
            </p>
          </motion.div>

          <div className="space-y-4">
            {upgradeData.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
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
              <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Don't Miss This Opportunity</h2>
              <p className="text-xl text-muted-foreground mb-8">
                This special pricing expires in {upgradeData.urgency.timeLeft}. 
                Upgrade now and start transforming your organization today.
              </p>
              
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold line-through text-muted-foreground">
                    ${upgradeData.urgency.originalPrice}
                  </div>
                  <div className="text-sm text-muted-foreground">Regular Price</div>
                </div>
                <ArrowRight className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    ${upgradeData.urgency.salePrice}
                  </div>
                  <div className="text-sm text-green-600">Limited Time</div>
                </div>
              </div>

              <Button
                size="lg"
                className="text-lg px-8 py-4"
                onClick={handleUpgrade}
                loading={isLoading}
              >
                Upgrade Now - Save {upgradeData.urgency.discount}
                <Rocket className="ml-2 h-5 w-5" />
              </Button>

              <div className="mt-6 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>30-day guarantee</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Settings className="h-4 w-4" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
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
