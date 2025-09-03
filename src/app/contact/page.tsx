/**
 * OptimaliQ Contact Page
 * Professional contact methods and support options for enterprise AI platform
 * Recreated with enterprise-grade feel and multi-tier support structure
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
  AtSign,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/form'

// Contact data optimized for enterprise AI platform
const contactData = {
  methods: [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@optimaliq.ai',
      availability: '24/7',
      tier: 'All Plans'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone Support',
      description: 'Talk to our team directly',
      contact: '+1 (555) 123-4567',
      availability: 'Mon-Fri 9AM-6PM PST',
      tier: 'Professional+'
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Available on platform',
      availability: 'Mon-Fri 9AM-6PM PST',
      tier: 'Professional+'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Schedule a Demo',
      description: 'Book a personalized demo',
      contact: 'Book online',
      availability: 'Flexible scheduling',
      tier: 'All Plans'
    }
  ],
  offices: [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 400\nSan Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@optimaliq.ai',
      timezone: 'PST'
    },
    {
      city: 'New York',
      address: '456 Broadway, Floor 20\nNew York, NY 10013',
      phone: '+1 (555) 987-6543',
      email: 'ny@optimaliq.ai',
      timezone: 'EST'
    }
  ],
  supportTiers: [
    {
      name: 'Free Plan',
      features: [
        'Email support (24-48 hour response)',
        'Help center access',
        'Community forum'
      ]
    },
    {
      name: 'Professional',
      features: [
        'Priority email support (24 hour response)',
        'Live chat support',
        'Phone support',
        'Dedicated support portal'
      ]
    },
    {
      name: 'Enterprise',
      features: [
        'Dedicated account manager',
        'Phone & video support',
        'Custom training sessions',
        'SLA guarantees',
        'White-glove onboarding'
      ]
    }
  ]
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    plan: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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
                Contact Us
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Get in{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>
              <p className="text-2xl font-semibold text-blue-300 mb-8">
                Ready to transform your organization with AI-powered insights?
              </p>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Our team of AI experts and business strategists is here to help you unlock your growth potential. Whether you need technical support, want to schedule a demo, or have questions about our enterprise AI platform, we're here to help.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Contact Methods Section */}
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
              Multiple Ways to Connect
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Choose the contact method that works best for you. Our support team is available across multiple channels to ensure you get the help you need.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactData.methods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <div className="text-blue-600 font-medium mb-2">{method.contact}</div>
                  <div className="text-gray-500 text-sm mb-3">{method.availability}</div>
                  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {method.tier}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
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
                Send Us a Message
              </h2>
              <p className="text-lg text-gray-700">
                Have a specific question or need personalized assistance? Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Enter your company name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                        Plan of Interest
                      </label>
                      <Select
                        value={formData.plan}
                        onValueChange={(value) => handleInputChange('plan', value)}
                        options={[
                          { value: 'free', label: 'Free Assessment' },
                          { value: 'professional', label: 'Professional' },
                          { value: 'enterprise', label: 'Enterprise' },
                          { value: 'custom', label: 'Custom Solution' }
                        ]}
                        placeholder="Select a plan"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Support Tiers Section */}
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
              Support Tiers
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our support structure is designed to scale with your needs. Choose the level of support that matches your organization's requirements.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactData.supportTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    index === 0 ? 'bg-gray-100' : 
                    index === 1 ? 'bg-blue-100' : 'bg-indigo-100'
                  }`}>
                    {index === 0 ? <HelpCircle className="h-8 w-8 text-gray-600" /> :
                     index === 1 ? <MessageSquare className="h-8 w-8 text-blue-600" /> :
                     <Phone className="h-8 w-8 text-indigo-600" />}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                </div>
                <div className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Office Locations Section */}
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
              Our Offices
            </h2>
            <p className="text-lg text-gray-700">
              Visit us in person or connect with our local teams for personalized support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {contactData.offices.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{office.city}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="whitespace-pre-line">{office.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{office.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{office.timezone} Timezone</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                Ready to Get Started?
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
