/**
 * OptimaliQ Email Capture & Newsletter Signup Page
 * Professional email capture with lead magnets and nurturing sequence
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Mail,
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
  Download,
  BookOpen,
  FileText,
  Video,
  Headphones,
  Bell,
  Eye,
  Heart,
  Brain,
  Lightbulb,
  Globe,
  Building,
  Briefcase,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Select, Checkbox } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Email capture data
const emailCaptureData = {
  leadMagnets: [
    {
      id: 'assessment-guide',
      title: 'The Complete Organizational Assessment Guide',
      description: 'A comprehensive 50-page guide covering assessment best practices, templates, and implementation strategies.',
      type: 'PDF Guide',
      pages: 50,
      downloads: 12450,
      rating: 4.9,
      icon: <FileText className="h-8 w-8" />,
      preview: [
        'Assessment planning and design',
        'Question development best practices',
        'Data collection and analysis methods',
        'Implementation and follow-up strategies',
        'Templates and checklists'
      ]
    },
    {
      id: 'growth-playbook',
      title: 'AI-Powered Growth Playbook',
      description: 'Learn how to leverage AI for strategic planning and growth optimization with real-world examples and case studies.',
      type: 'Digital Playbook',
      pages: 35,
      downloads: 8760,
      rating: 4.8,
      icon: <Rocket className="h-8 w-8" />,
      preview: [
        'AI strategy fundamentals',
        'Growth lever identification',
        'Data-driven decision making',
        'Case studies and examples',
        'Implementation roadmap'
      ]
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration Excellence Framework',
      description: 'Proven strategies for enhancing team collaboration, communication, and performance in modern organizations.',
      type: 'Framework Guide',
      pages: 28,
      downloads: 6890,
      rating: 4.7,
      icon: <Users className="h-8 w-8" />,
      preview: [
        'Collaboration assessment tools',
        'Communication optimization',
        'Remote team management',
        'Performance tracking methods',
        'Culture building strategies'
      ]
    }
  ],
  newsletterBenefits: [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI Insights & Trends',
      description: 'Latest developments in AI-powered business intelligence and strategic planning'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Best Practices',
      description: 'Proven strategies and methodologies from successful organizational transformations'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Success Stories',
      description: 'Real case studies and results from organizations using OptimaliQ'
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: 'Expert Tips',
      description: 'Actionable advice from our team of business intelligence and strategy experts'
    }
  ],
  interests: [
    { value: 'strategy', label: 'Strategic Planning' },
    { value: 'operations', label: 'Operations Excellence' },
    { value: 'team', label: 'Team Development' },
    { value: 'growth', label: 'Growth & Innovation' },
    { value: 'technology', label: 'Technology & AI' },
    { value: 'leadership', label: 'Leadership Development' },
    { value: 'analytics', label: 'Data & Analytics' },
    { value: 'culture', label: 'Organizational Culture' }
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
  stats: {
    subscribers: '25,000+',
    openRate: '67%',
    satisfaction: '94%',
    frequency: 'Weekly'
  }
}

export default function SubscribePage() {
  const [selectedLeadMagnet, setSelectedLeadMagnet] = React.useState(emailCaptureData.leadMagnets[0])
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    industry: '',
    interests: [] as string[],
    agreeToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest]
    handleInputChange('interests', newInterests)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to subscribe', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.agreeToTerms

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
              Free Resources
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
              <Mail className="h-4 w-4 mr-2" />
              Free Resources & Insights
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Get Expert Insights{' '}
              <span className="text-primary">Delivered Weekly</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join 25,000+ leaders who receive our weekly newsletter with AI insights, 
              best practices, and strategies for organizational excellence.
            </p>

            {/* Newsletter Stats */}
            <Grid cols={4} gap={6} className="max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{emailCaptureData.stats.subscribers}</div>
                <div className="text-xs text-muted-foreground">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{emailCaptureData.stats.openRate}</div>
                <div className="text-xs text-muted-foreground">Open Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{emailCaptureData.stats.satisfaction}</div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{emailCaptureData.stats.frequency}</div>
                <div className="text-xs text-muted-foreground">Delivery</div>
              </div>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* Lead Magnets */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Choose Your Free Resource</h2>
            <p className="text-xl text-muted-foreground">
              Select a valuable resource to download instantly when you subscribe
            </p>
          </motion.div>

          <Grid cols={3} gap={6} className="mb-16">
            {emailCaptureData.leadMagnets.map((magnet, index) => (
              <motion.div
                key={magnet.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedLeadMagnet.id === magnet.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedLeadMagnet(magnet)}
                >
                  <div className="text-center">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg inline-flex mb-4">
                      {magnet.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{magnet.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{magnet.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{magnet.type}</span>
                      <span>{magnet.pages} pages</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{magnet.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{magnet.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Signup Form */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={12} className="items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Get Your Free Resource</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground mb-6">
                      Check your email for the download link and welcome to our community of 25,000+ leaders!
                    </p>
                    <div className="space-y-3">
                      <Button asChild>
                        <Link href="/assessment">
                          Start Free Assessment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                        Download Another Resource
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

                    <Grid cols={2} gap={4}>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company/Organization
                        </label>
                        <Input
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Enter your organization"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Industry
                        </label>
                        <Select
                          options={emailCaptureData.industries}
                          value={formData.industry}
                          onValueChange={(value) => handleInputChange('industry', value)}
                          placeholder="Select industry"
                        />
                      </div>
                    </Grid>

                    <div>
                      <label className="block text-sm font-medium mb-3">
                        What topics interest you most? (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {emailCaptureData.interests.map((interest) => (
                          <div key={interest.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={interest.value}
                              checked={formData.interests.includes(interest.value)}
                              onCheckedChange={() => handleInterestToggle(interest.value)}
                            />
                            <label htmlFor={interest.value} className="text-sm">
                              {interest.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                        required
                      />
                      <label htmlFor="terms" className="text-sm">
                        I agree to receive emails from OptimaliQ and accept the{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!isFormValid}
                      loading={isSubmitting}
                      loadingText="Processing..."
                    >
                      Get Free Resource & Subscribe
                      <Download className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      Instant download • Unsubscribe anytime • No spam, ever
                    </div>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Selected Resource Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Resource Preview */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    {selectedLeadMagnet.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedLeadMagnet.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{selectedLeadMagnet.type}</span>
                      <span>{selectedLeadMagnet.pages} pages</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{selectedLeadMagnet.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{selectedLeadMagnet.description}</p>
                
                <div>
                  <h4 className="font-medium mb-2">What's inside:</h4>
                  <div className="space-y-1">
                    {selectedLeadMagnet.preview.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  Downloaded by {selectedLeadMagnet.downloads.toLocaleString()}+ professionals
                </div>
              </Card>

              {/* Newsletter Benefits */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">What You'll Receive</h3>
                <div className="space-y-4">
                  {emailCaptureData.newsletterBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{benefit.title}</h4>
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Social Proof */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">What Subscribers Say</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-2">
                      "The weekly insights have transformed how we approach strategic planning. 
                      Every email contains actionable advice."
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Sarah J., Executive Director
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-2">
                      "The free resources alone have saved us thousands in consulting fees. 
                      Highly recommend subscribing."
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Michael R., Operations Director
                    </div>
                  </div>
                </div>
              </Card>

              {/* Privacy & Unsubscribe */}
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Privacy Guarantee</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>• We never share your email with third parties</p>
                      <p>• Unsubscribe with one click anytime</p>
                      <p>• GDPR and CCPA compliant</p>
                      <p>• No spam, only valuable content</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Newsletter Preview */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Recent Newsletter Highlights</h2>
            <p className="text-xl text-muted-foreground">
              See what our subscribers have been reading lately
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                title: 'How AI is Transforming Non-Profit Strategic Planning',
                excerpt: 'Discover 5 ways AI is helping non-profits maximize impact and efficiency...',
                date: 'August 25, 2024',
                readTime: '4 min read'
              },
              {
                title: 'The ROI of Organizational Assessments: Data from 500+ Organizations',
                excerpt: 'New research shows the quantifiable benefits of regular organizational assessments...',
                date: 'August 18, 2024',
                readTime: '6 min read'
              },
              {
                title: 'Team Collaboration Best Practices for Remote Organizations',
                excerpt: 'Proven strategies for maintaining culture and productivity in distributed teams...',
                date: 'August 11, 2024',
                readTime: '5 min read'
              }
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{article.date}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
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
