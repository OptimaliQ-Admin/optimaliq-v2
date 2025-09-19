/**
 * OptimaliQ Demo Page
 * Enterprise AI platform demo scheduling and conversion optimization
 * Recreated with enterprise-grade feel and strong conversion focus
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
  Lightbulb,
  Check,
  Brain,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'
import { Select, Checkbox } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Enterprise AI platform demo data
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
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Financial Services' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
  ]
}

export default function DemoPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    organizationSize: '',
    industry: '',
    demoType: 'live-demo',
    preferredDate: '',
    preferredTime: '',
    phone: '',
    message: '',
    agreeToContact: false,
    agreeToTerms: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Demo request submitted:', formData)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
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
                Schedule a Demo
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                See{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  OptimaliQ
                </span>{" "}
                in Action
              </h1>
              <p className="text-2xl font-semibold text-blue-300 mb-8">
                Experience the power of enterprise AI-powered business intelligence
              </p>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Get a personalized demonstration of how OptimaliQ can transform your organization's strategic planning, operational efficiency, and growth trajectory. See real-time AI insights, advanced RAG capabilities, and enterprise-grade security in action.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Demo Types Section */}
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
              Choose Your Demo Experience
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Select the demo type that best fits your needs and schedule
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {demoData.demoTypes.map((demoType, index) => (
              <motion.div
                key={demoType.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl border-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  demoType.popular 
                    ? 'border-blue-500 scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {demoType.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                      demoType.id === 'live-demo' ? 'bg-blue-100' :
                      demoType.id === 'team-demo' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {demoType.id === 'live-demo' ? <Video className="h-8 w-8 text-blue-600" /> :
                       demoType.id === 'team-demo' ? <Users className="h-8 w-8 text-green-600" /> :
                       <Settings className="h-8 w-8 text-purple-600" />}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{demoType.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{demoType.description}</p>
                    <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      {demoType.duration}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {demoType.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${
                      demoType.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => handleInputChange('demoType', demoType.id)}
                  >
                    {formData.demoType === demoType.id ? 'Selected' : 'Select This Demo'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Demo Form Section */}
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
                Schedule Your Demo
              </h2>
              <p className="text-lg text-gray-700">
                Fill out the form below and we'll get back to you within 24 hours to confirm your demo
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
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
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
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <Input
                        id="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Enter your company name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="organizationSize" className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Size *
                      </label>
                      <Select
                        value={formData.organizationSize}
                        onValueChange={(value) => handleInputChange('organizationSize', value)}
                        options={demoData.organizationSizes}
                        placeholder="Select organization size"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleInputChange('industry', value)}
                      options={demoData.industries}
                      placeholder="Select your industry"
                    />
                  </div>

                  {/* Demo Preferences */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <Input
                        id="preferredDate"
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <Select
                        value={formData.preferredTime}
                        onValueChange={(value) => handleInputChange('preferredTime', value)}
                        options={demoData.timeSlots}
                        placeholder="Select preferred time"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your specific needs or questions..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Checkbox
                        id="agreeToContact"
                        checked={formData.agreeToContact}
                        onCheckedChange={(checked) => handleInputChange('agreeToContact', checked as boolean)}
                        className="mt-1 mr-3"
                      />
                      <label htmlFor="agreeToContact" className="text-sm text-gray-700">
                        I agree to be contacted by OptimaliQ regarding this demo request
                      </label>
                    </div>
                    <div className="flex items-start">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                        className="mt-1 mr-3"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                        I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={!formData.agreeToContact || !formData.agreeToTerms}
                    >
                      Schedule Demo
                      <Calendar className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Why Choose OptimaliQ Section */}
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
              Why Choose OptimaliQ?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              See how our enterprise AI platform delivers McKinsey-level strategic insights with Salesforce-like user experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-8 w-8" />,
                title: 'AI-Powered Intelligence',
                description: 'Advanced RAG capabilities and multi-provider AI orchestration for real-time strategic insights'
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Enterprise Security',
                description: 'SOC 2 Type II compliance, GDPR ready, and bulletproof security architecture'
              },
              {
                icon: <Rocket className="h-8 w-8" />,
                title: 'Rapid Implementation',
                description: 'Get up and running in days, not months, with our intuitive platform design'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-16">
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
                  Contact Sales
                  <Phone className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
