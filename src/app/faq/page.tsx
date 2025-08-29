/**
 * OptimaliQ FAQ Page
 * Comprehensive frequently asked questions with search and categories
 */

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
import { StatusBadge } from '@/components/ui/data-display'
import { Input } from '@/components/ui/input'

const faqData = {
  categories: [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <Target className="h-4 w-4" /> },
    { id: 'assessments', name: 'Assessments', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'pricing', name: 'Pricing & Billing', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'security', name: 'Security & Privacy', icon: <Shield className="h-4 w-4" /> },
    { id: 'team', name: 'Team Features', icon: <Users className="h-4 w-4" /> },
    { id: 'technical', name: 'Technical', icon: <Settings className="h-4 w-4" /> }
  ],
  questions: [
    {
      id: 1,
      category: 'getting-started',
      question: 'What is OptimaliQ and how does it work?',
      answer: 'OptimaliQ is an AI-powered business intelligence platform that helps organizations assess their performance, identify growth opportunities, and develop strategic action plans. Our platform uses advanced AI algorithms to analyze your responses to comprehensive assessments and provide personalized insights, benchmarks, and recommendations tailored to your industry and organization size.',
      popular: true
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'How do I get started with OptimaliQ?',
      answer: 'Getting started is simple! You can begin with our free assessment that takes 15-20 minutes to complete. Just visit our homepage, click "Start Free Assessment," and follow the guided process. No credit card is required for the free assessment. After completing it, you\'ll receive immediate insights and can choose to upgrade for more advanced features.',
      popular: true
    },
    {
      id: 3,
      category: 'assessments',
      question: 'How long does an assessment take to complete?',
      answer: 'Assessment duration varies by type: Strategic assessments typically take 15-20 minutes, Operational assessments take 12-15 minutes, Team assessments take 10-12 minutes, Growth assessments take 15-18 minutes, and Technology assessments take 12-15 minutes. Our comprehensive assessment takes 25-30 minutes but covers all areas.',
      popular: true
    },
    {
      id: 4,
      category: 'assessments',
      question: 'How accurate are the AI-powered insights?',
      answer: 'Our AI models are trained on data from thousands of organizations and continuously refined based on outcomes. While we maintain high accuracy rates, our insights should be considered as one input in your decision-making process. We recommend combining our recommendations with your domain expertise and specific organizational context.',
      popular: false
    },
    {
      id: 5,
      category: 'assessments',
      question: 'Can I retake assessments or track progress over time?',
      answer: 'Yes! With paid plans, you can retake assessments as often as needed and track your progress over time. Our platform maintains a complete history of your assessments, allowing you to see trends, improvements, and areas that need continued attention. This is particularly valuable for measuring the impact of implemented recommendations.',
      popular: false
    },
    {
      id: 6,
      category: 'pricing',
      question: 'What\'s included in the free assessment?',
      answer: 'The free assessment includes one comprehensive evaluation, basic AI-powered insights, industry benchmarking, a downloadable PDF report, a 30-day action plan, and email support. While limited to one assessment per organization, it provides substantial value to help you understand your current state and identify key improvement areas.',
      popular: true
    },
    {
      id: 7,
      category: 'pricing',
      question: 'Can I upgrade or downgrade my plan at any time?',
      answer: 'Absolutely! You can upgrade or downgrade your subscription at any time through your account settings. Upgrades take effect immediately, while downgrades take effect at the start of your next billing cycle. We\'ll prorate any charges or credits as appropriate.',
      popular: true
    },
    {
      id: 8,
      category: 'pricing',
      question: 'Do you offer discounts for non-profit organizations?',
      answer: 'Yes, we offer special pricing for qualified non-profit organizations. Non-profits can receive up to 50% off our standard pricing. Please contact our sales team with your non-profit documentation to learn about available discounts and verify eligibility.',
      popular: false
    },
    {
      id: 9,
      category: 'security',
      question: 'How secure is my data on OptimaliQ?',
      answer: 'We take data security extremely seriously. Your data is protected with bank-level encryption (AES-256), stored in SOC 2 compliant data centers, and transmitted over secure connections (TLS 1.3). We implement strict access controls, regular security audits, and maintain comprehensive incident response procedures. We are also GDPR and CCPA compliant.',
      popular: true
    },
    {
      id: 10,
      category: 'security',
      question: 'Who has access to my assessment data?',
      answer: 'Your assessment data is private and secure. Only you and authorized team members (if you\'ve invited them) can access your specific assessment results. Our AI systems process data in aggregate and anonymized form for platform improvements. Our support team can only access your data with your explicit permission when providing technical support.',
      popular: false
    },
    {
      id: 11,
      category: 'team',
      question: 'How do team assessments work?',
      answer: 'Team assessments allow you to invite team members to complete assessments independently. Each member receives a unique link and completes the assessment privately. Results are then aggregated to provide team-level insights while maintaining individual privacy. You can compare team perspectives, identify alignment gaps, and develop collaborative action plans.',
      popular: true
    },
    {
      id: 12,
      category: 'team',
      question: 'Can team members see each other\'s individual responses?',
      answer: 'No, individual responses remain private by default. Team leaders can see aggregated results and trends but not individual answers unless a team member explicitly chooses to share their results. This privacy protection encourages honest responses while still providing valuable team-level insights.',
      popular: false
    },
    {
      id: 13,
      category: 'technical',
      question: 'Do you have an API for integrations?',
      answer: 'Yes, we offer a comprehensive REST API for Enterprise customers. Our API allows you to integrate OptimaliQ data with your existing systems, automate assessment distribution, and pull results into your business intelligence tools. API documentation and support are included with Enterprise plans.',
      popular: false
    },
    {
      id: 14,
      category: 'technical',
      question: 'What browsers and devices are supported?',
      answer: 'OptimaliQ works on all modern browsers including Chrome, Firefox, Safari, and Edge. Our platform is fully responsive and works on desktop, tablet, and mobile devices. For the best experience, we recommend using the latest version of your preferred browser with JavaScript enabled.',
      popular: false
    },
    {
      id: 15,
      category: 'getting-started',
      question: 'What happens after I complete an assessment?',
      answer: 'After completing an assessment, you\'ll immediately receive your results including your overall score, category breakdowns, key insights, and personalized recommendations. You\'ll also get a detailed PDF report and a 30-day action plan. Paid plan users receive additional features like progress tracking, team collaboration, and follow-up assessments.',
      popular: true
    },
    {
      id: 16,
      category: 'pricing',
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes! We offer a 14-day free trial for both Professional and Enterprise plans. The trial includes full access to all plan features with no credit card required. You can cancel anytime during the trial period without being charged.',
      popular: true
    },
    {
      id: 17,
      category: 'assessments',
      question: 'Can I customize assessments for my specific industry?',
      answer: 'Professional and Enterprise plans include industry-specific customizations and additional assessment templates. Enterprise customers can create fully custom assessments tailored to their specific needs, industry requirements, or organizational frameworks. Our team can help design custom assessments that align with your strategic objectives.',
      popular: false
    },
    {
      id: 18,
      category: 'technical',
      question: 'How do you ensure data privacy and GDPR compliance?',
      answer: 'We are fully GDPR compliant and implement privacy-by-design principles. You have complete control over your data including the right to access, correct, delete, and port your information. We use data minimization practices, obtain explicit consent for data processing, and provide clear privacy controls in your account settings.',
      popular: false
    }
  ],
  resources: [
    {
      title: 'Getting Started Guide',
      description: 'Step-by-step guide to using OptimaliQ',
      type: 'Guide',
      icon: <Book className="h-5 w-5" />,
      url: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch how to use key features',
      type: 'Video',
      icon: <Video className="h-5 w-5" />,
      url: '#'
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      type: 'Docs',
      icon: <ExternalLink className="h-5 w-5" />,
      url: '#'
    }
  ]
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedItems, setExpandedItems] = React.useState<number[]>([])

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredQuestions = faqData.questions.filter(question => {
    const categoryMatch = selectedCategory === 'all' || question.category === selectedCategory
    const searchMatch = searchQuery === '' || 
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && searchMatch
  })

  const popularQuestions = faqData.questions.filter(q => q.popular)

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
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              <HelpCircle className="h-4 w-4 mr-2" />
              Frequently Asked Questions
            </StatusBadge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              How Can We{' '}
              <span className="text-primary">Help You?</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find quick answers to common questions about OptimaliQ. If you can't find what you're looking for, 
              our support team is always ready to help.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Popular Questions */}
      {searchQuery === '' && selectedCategory === 'all' && (
        <Section className="pb-20">
          <Container className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-center mb-8">Popular Questions</h2>
              <div className="space-y-4">
                {popularQuestions.slice(0, 5).map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => toggleExpanded(question.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-left flex-1">{question.question}</h3>
                        {expandedItems.includes(question.id) ? (
                          <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      {expandedItems.includes(question.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <p className="text-muted-foreground leading-relaxed">{question.answer}</p>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </Section>
      )}

      {/* Categories & FAQ */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={4} gap={8} className="items-start">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {faqData.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors flex items-center space-x-3 ${
                        selectedCategory === category.id
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      {category.icon}
                      <span className="font-medium text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>

                {/* Help Resources */}
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Help Resources</h4>
                  <div className="space-y-3">
                    {faqData.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          {resource.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{resource.title}</div>
                          <div className="text-xs text-muted-foreground">{resource.type}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* FAQ Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-3"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedCategory === 'all' 
                    ? `All Questions (${filteredQuestions.length})`
                    : `${faqData.categories.find(c => c.id === selectedCategory)?.name} (${filteredQuestions.length})`
                  }
                </h2>
                {searchQuery && (
                  <p className="text-muted-foreground">
                    Showing results for "{searchQuery}"
                  </p>
                )}
              </div>

              {filteredQuestions.length === 0 ? (
                <Card className="p-12 text-center">
                  <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any questions matching your search. Try different keywords or browse all categories.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}>
                    Clear Search
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Card 
                        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => toggleExpanded(question.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <h3 className="font-semibold text-left">{question.question}</h3>
                            {question.popular && (
                              <StatusBadge status="primary" size="xs">Popular</StatusBadge>
                            )}
                          </div>
                          {expandedItems.includes(question.id) ? (
                            <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        {expandedItems.includes(question.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t"
                          >
                            <p className="text-muted-foreground leading-relaxed">{question.answer}</p>
                          </motion.div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Contact Support */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Can't find the answer you're looking for? Our support team is here to help you succeed.
            </p>
            
            <Grid cols={3} gap={6} className="mb-8">
              <Card className="p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-3">Get help within 24 hours</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">Send Email</Link>
                </Button>
              </Card>
              
              <Card className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-3">Chat with our team</p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </Card>
              
              <Card className="p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-3">Enterprise customers</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">Call Us</Link>
                </Button>
              </Card>
            </Grid>

            <Button size="lg" asChild>
              <Link href="/contact">
                Contact Support Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
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
