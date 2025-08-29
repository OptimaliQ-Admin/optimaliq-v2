/**
 * OptimaliQ Contact Page
 * Contact form with multiple contact methods and support options
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
  Sparkles,
  Send,
  User,
  Building2,
  AtSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Input, Select } from '@/components/ui/form'

// Contact data
const contactData = {
  methods: [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@optimaliq.ai',
      availability: '24/7'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone Support',
      description: 'Talk to our team directly',
      contact: '+1 (555) 123-4567',
      availability: 'Mon-Fri 9AM-6PM PST'
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Available on platform',
      availability: 'Mon-Fri 9AM-6PM PST'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Schedule a Demo',
      description: 'Book a personalized demo',
      contact: 'Book online',
      availability: 'Flexible scheduling'
    }
  ],
  offices: [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 400\nSan Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@optimaliq.ai'
    },
    {
      city: 'New York',
      address: '456 Broadway, Floor 20\nNew York, NY 10013',
      phone: '+1 (555) 987-6543',
      email: 'ny@optimaliq.ai'
    },
    {
      city: 'London',
      address: '789 Oxford Street\nLondon W1C 1JN, UK',
      phone: '+44 20 1234 5678',
      email: 'london@optimaliq.ai'
    }
  ],
  inquiryTypes: [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Pricing' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'press', label: 'Press & Media' },
    { value: 'careers', label: 'Careers' }
  ],
  organizationSizes: [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ]
}

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    organizationSize: '',
    inquiryType: '',
    message: ''
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
      console.error('Failed to submit form', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.inquiryType && formData.message

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
            <Link href="/contact" className="text-sm text-primary font-medium">Contact</Link>
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
              Get in Touch
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              We're Here to{' '}
              <span className="text-primary">Help You Succeed</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about OptimaliQ? Want to see a demo? Our team is ready to help you discover 
              how AI-powered insights can transform your organization.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Contact Methods */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={4} gap={6} className="mb-20">
            {contactData.methods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg inline-flex mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <div className="text-sm font-medium mb-2">{method.contact}</div>
                  <div className="text-xs text-muted-foreground">{method.availability}</div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Contact Form & Info */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={12} className="items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
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

                    <Grid cols={2} gap={4}>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company/Organization
                        </label>
                        <Input
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Enter your organization name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Organization Size
                        </label>
                        <Select
                          options={contactData.organizationSizes}
                          value={formData.organizationSize}
                          onValueChange={(value) => handleInputChange('organizationSize', value)}
                          placeholder="Select size"
                        />
                      </div>
                    </Grid>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Inquiry Type *
                      </label>
                      <Select
                        options={contactData.inquiryTypes}
                        value={formData.inquiryType}
                        onValueChange={(value) => handleInputChange('inquiryType', value)}
                        placeholder="Select inquiry type"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="w-full p-3 border rounded-lg resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!isFormValid}
                      loading={isSubmitting}
                      loadingText="Sending..."
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Office Locations */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Our Offices</h3>
                <div className="space-y-6">
                  {contactData.offices.map((office, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{office.city}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="whitespace-pre-line">{office.address}</div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{office.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span>{office.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/assessment">
                      <Target className="h-4 w-4 mr-3" />
                      Start Free Assessment
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/pricing">
                      <CreditCard className="h-4 w-4 mr-3" />
                      View Pricing Plans
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/about">
                      <Users className="h-4 w-4 mr-3" />
                      Learn About Us
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-3" />
                    Schedule a Demo
                  </Button>
                </div>
              </Card>

              {/* Support Hours */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Support Hours</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Email Support</span>
                    <span className="text-primary font-medium">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone & Chat</span>
                    <span className="text-primary font-medium">Mon-Fri 9AM-6PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Support</span>
                    <span className="text-primary font-medium">Enterprise only</span>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Connect With Us</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Follow us for updates, tips, and insights on organizational excellence and AI-powered business intelligence.
                </p>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Common Questions</h2>
            <p className="text-xl text-muted-foreground">
              Can't find what you're looking for? Contact us directly and we'll be happy to help.
            </p>
          </motion.div>

          <Grid cols={1} gap={6}>
            {[
              {
                question: 'How quickly will I receive a response?',
                answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.'
              },
              {
                question: 'Can I schedule a demo before purchasing?',
                answer: 'Absolutely! We offer personalized demos for all potential customers. You can book a demo through our contact form or by calling us directly.'
              },
              {
                question: 'Do you offer support for implementation?',
                answer: 'Yes, we provide comprehensive onboarding and implementation support for all paid plans. Enterprise customers receive dedicated success managers.'
              },
              {
                question: 'What if I need help outside business hours?',
                answer: 'Email support is available 24/7. For Enterprise customers, we offer emergency support contact options for critical issues.'
              }
            ].map((faq, index) => (
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
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
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
