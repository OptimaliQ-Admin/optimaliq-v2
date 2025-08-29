/**
 * OptimaliQ Pricing Page
 * Comprehensive pricing plans with feature comparison and value proposition
 */

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Checkbox } from '@/components/ui/form'

// Pricing data
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
      description: 'For large organizations with advanced needs',
      price: 299,
      period: 'month',
      popular: false,
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Custom assessment creation',
        'Advanced analytics dashboard',
        'White-label reporting',
        'Dedicated success manager',
        'Phone and chat support',
        'API access',
        'Single Sign-On (SSO)',
        'Advanced security features',
        'Custom integrations',
        'Training and onboarding'
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaVariant: 'outline' as const
    }
  ],
  features: [
    {
      category: 'Assessments',
      items: [
        { name: 'Number of Assessments', free: '1', professional: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Assessment Types', free: '6 Standard', professional: '6 Standard + Custom', enterprise: '6 Standard + Unlimited Custom' },
        { name: 'AI-Powered Insights', free: 'Basic', professional: 'Advanced', enterprise: 'Advanced + Custom Models' },
        { name: 'Progress Tracking', free: false, professional: true, enterprise: true },
        { name: 'Historical Analysis', free: false, professional: true, enterprise: true }
      ]
    },
    {
      category: 'Collaboration',
      items: [
        { name: 'Team Members', free: '1', professional: '10', enterprise: 'Unlimited' },
        { name: 'Team Assessments', free: false, professional: true, enterprise: true },
        { name: 'Role-Based Access', free: false, professional: 'Basic', enterprise: 'Advanced' },
        { name: 'Collaboration Tools', free: false, professional: 'Basic', enterprise: 'Advanced' }
      ]
    },
    {
      category: 'Reporting',
      items: [
        { name: 'PDF Reports', free: 'Basic', professional: 'Advanced', enterprise: 'White-label' },
        { name: 'Dashboard Access', free: false, professional: true, enterprise: true },
        { name: 'Custom Reports', free: false, professional: 'Limited', enterprise: 'Unlimited' },
        { name: 'Data Export', free: false, professional: 'CSV', enterprise: 'CSV, API' }
      ]
    },
    {
      category: 'Support',
      items: [
        { name: 'Email Support', free: 'Basic', professional: 'Priority', enterprise: 'Dedicated' },
        { name: 'Phone Support', free: false, professional: false, enterprise: true },
        { name: 'Success Manager', free: false, professional: false, enterprise: true },
        { name: 'Training', free: false, professional: 'Self-service', enterprise: 'Dedicated' }
      ]
    }
  ],
  faqs: [
    {
      question: 'Can I upgrade or downgrade my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes, we offer a 14-day free trial for both Professional and Enterprise plans. No credit card required.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and can arrange invoicing for Enterprise customers.'
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your current billing period.'
    },
    {
      question: 'Do you offer discounts for non-profit organizations?',
      answer: 'Yes, we offer special pricing for qualified non-profit organizations. Contact our sales team for more information.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security measures including encryption, secure data centers, and regular security audits.'
    }
  ]
}

export default function PricingPage() {
  const [annualBilling, setAnnualBilling] = React.useState(false)

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return 0
    return annualBilling ? Math.round(basePrice * 0.8) : basePrice
  }

  const getSavings = (basePrice: number) => {
    if (basePrice === 0) return 0
    return Math.round(basePrice * 0.2 * 12)
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
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
            <Link href="/pricing" className="text-sm text-primary font-medium">Pricing</Link>
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
              Simple, Transparent Pricing
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Choose the Perfect Plan for{' '}
              <span className="text-primary">Your Organization</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Start with our free assessment and upgrade as you grow. All plans include our core AI-powered insights 
              and recommendations to help your organization thrive.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!annualBilling ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  annualBilling ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    annualBilling ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${annualBilling ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Annual
              </span>
              {annualBilling && (
                <StatusBadge status="success" size="sm">
                  Save 20%
                </StatusBadge>
              )}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Pricing Cards */}
      <Section className="pb-20">
        <Container className="max-w-7xl">
          <Grid cols={3} gap={8}>
            {pricingData.plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                <Card className={`p-8 h-full ${plan.popular ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <StatusBadge status="primary" className="px-4 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Most Popular
                      </StatusBadge>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold">
                          ${getPrice(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-muted-foreground ml-2">
                            /{annualBilling ? 'month' : plan.period}
                          </span>
                        )}
                      </div>
                      {annualBilling && plan.price > 0 && (
                        <div className="text-sm text-green-600 mt-2">
                          Save ${getSavings(plan.price)} per year
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full mb-6" 
                      variant={plan.ctaVariant}
                      size="lg"
                      asChild
                    >
                      <Link href={plan.id === 'free' ? '/assessment' : '/auth/register'}>
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">What's included:</h4>
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.limitations.length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-3">Limitations:</h4>
                        <div className="space-y-2">
                          {plan.limitations.map((limitation, limitationIndex) => (
                            <div key={limitationIndex} className="flex items-start space-x-3">
                              <X className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Feature Comparison */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Detailed Feature Comparison</h2>
            <p className="text-xl text-muted-foreground">
              Compare all features across our plans to find the perfect fit for your organization.
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
                    <th className="text-center p-6 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.features.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="border-t">
                        <td colSpan={4} className="p-6 font-semibold text-primary bg-primary/5">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-t">
                          <td className="p-6">{item.name}</td>
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
                              item.professional
                            )}
                          </td>
                          <td className="p-6 text-center">
                            {typeof item.enterprise === 'boolean' ? (
                              item.enterprise ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground mx-auto" />
                              )
                            ) : (
                              item.enterprise
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Got questions? We've got answers. If you can't find what you're looking for, contact our support team.
            </p>
          </motion.div>

          <div className="space-y-6">
            {pricingData.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust Indicators */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-12">Trusted by Organizations Worldwide</h2>
            
            <Grid cols={3} gap={8}>
              <div className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Bank-level encryption and security measures to protect your data
                </p>
              </div>
              <div className="text-center">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  PCI-compliant payment processing with multiple payment options
                </p>
              </div>
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Dedicated support team ready to help you succeed
                </p>
              </div>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join hundreds of organizations already using OptimaliQ to drive growth and achieve their goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/assessment">
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Talk to Sales</Link>
                </Button>
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
