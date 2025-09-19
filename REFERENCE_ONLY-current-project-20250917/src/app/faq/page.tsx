/**
 * OptimaliQ FAQ Page
 * Enterprise AI platform support and frequently asked questions
 * Recreated with enterprise-grade feel and comprehensive support structure
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
  ExternalLink,
  Brain,
  Rocket,
  Globe,
  Lock,
  Database,
  Cpu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'

// Enterprise AI platform FAQ data
const faqData = {
  categories: [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <Target className="h-4 w-4" /> },
    { id: 'ai-platform', name: 'AI Platform', icon: <Brain className="h-4 w-4" /> },
    { id: 'assessments', name: 'Assessments', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'pricing', name: 'Pricing & Billing', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'security', name: 'Security & Compliance', icon: <Shield className="h-4 w-4" /> },
    { id: 'enterprise', name: 'Enterprise Features', icon: <Users className="h-4 w-4" /> },
    { id: 'technical', name: 'Technical', icon: <Settings className="h-4 w-4" /> }
  ],
  questions: [
    {
      id: 1,
      category: 'getting-started',
      question: 'What is OptimaliQ and how does it work?',
      answer: 'OptimaliQ is a next-generation, multi-tier agentic AI platform that revolutionizes how organizations assess and optimize their Strategy, Process, and Technology. Our platform uses advanced AI algorithms, including cutting-edge RAG (Retrieval-Augmented Generation) capabilities, to analyze your responses to comprehensive assessments and provide McKinsey-level strategic insights, industry benchmarks, and actionable recommendations tailored to your organization size and industry.',
      popular: true
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'How do I get started with OptimaliQ?',
      answer: 'Getting started is simple and requires no commitment! Begin with our free assessment that takes 15-20 minutes to complete. Visit our homepage, click "Start Free Assessment," and follow the guided process. No credit card is required. After completion, you\'ll receive immediate AI-powered insights and can choose to upgrade for advanced enterprise features, team collaboration, and ongoing optimization tracking.',
      popular: true
    },
    {
      id: 3,
      category: 'ai-platform',
      question: 'What makes OptimaliQ\'s AI different from other platforms?',
      answer: 'OptimaliQ leverages a unique multi-provider AI orchestration system that combines the best of OpenAI, Anthropic, Google, and Mistral models. Our cutting-edge RAG capabilities provide real-time market intelligence and strategic insights. Unlike traditional platforms, we offer McKinsey-level strategic analysis with Salesforce-like user experience, all powered by enterprise-grade AI that continuously learns and improves from thousands of organizational assessments.',
      popular: true
    },
    {
      id: 4,
      category: 'ai-platform',
      question: 'How accurate are the AI-powered insights?',
      answer: 'Our AI models are trained on data from thousands of organizations across industries and continuously refined based on real-world outcomes. We maintain high accuracy rates through our multi-tier AI architecture and RAG capabilities. While our insights are highly reliable, they should be considered as strategic inputs in your decision-making process. We recommend combining our AI recommendations with your domain expertise and organizational context for optimal results.',
      popular: false
    },
    {
      id: 5,
      category: 'assessments',
      question: 'Can I retake assessments or track progress over time?',
      answer: 'Absolutely! With our Professional and Enterprise plans, you can retake assessments as often as needed and track your progress over time. Our platform maintains a complete history of your assessments, allowing you to see trends, improvements, and areas that need continued attention. This is particularly valuable for measuring the impact of implemented recommendations and demonstrating ROI to stakeholders.',
      popular: false
    },
    {
      id: 6,
      category: 'pricing',
      question: 'What\'s included in the free assessment?',
      answer: 'The free assessment includes one comprehensive evaluation, basic AI-powered insights, industry benchmarking, a downloadable PDF report, a 30-day action plan, and email support. While limited to one assessment per organization, it provides substantial value to help you understand your current state and identify key improvement areas. It\'s designed to showcase our platform\'s capabilities and help you make an informed decision about upgrading.',
      popular: true
    },
    {
      id: 7,
      category: 'pricing',
      question: 'Can I upgrade or downgrade my plan at any time?',
      answer: 'Yes! You can upgrade or downgrade your subscription at any time through your account settings. Upgrades take effect immediately, while downgrades take effect at the start of your next billing cycle. We\'ll prorate any charges or credits as appropriate. Our flexible pricing model ensures you only pay for what you need, and you can scale up or down based on your organization\'s growth and requirements.',
      popular: true
    },
    {
      id: 8,
      category: 'security',
      question: 'How does OptimaliQ ensure data security and compliance?',
      answer: 'OptimaliQ maintains the highest security standards with SOC 2 Type II compliance, GDPR readiness, and enterprise-grade security architecture. We use end-to-end encryption, secure data centers, and implement strict access controls. Our multi-tenant architecture ensures complete data isolation between organizations. We regularly undergo security audits and maintain compliance with industry standards to protect your sensitive organizational data.',
      popular: true
    },
    {
      id: 9,
      category: 'enterprise',
      question: 'What enterprise features are available for larger organizations?',
      answer: 'Our Enterprise plan includes advanced team collaboration, multi-user assessment flows, comprehensive reporting and analytics, API access for custom integrations, dedicated customer success manager, priority support, custom assessment templates, advanced AI model training, and white-labeling options. We also offer custom implementation services and dedicated infrastructure for organizations with specific compliance or security requirements.',
      popular: false
    },
    {
      id: 10,
      category: 'technical',
      question: 'Can OptimaliQ integrate with our existing systems?',
      answer: 'Yes! OptimaliQ offers comprehensive API access and integration capabilities. We can integrate with popular CRM systems, project management tools, analytics platforms, and custom enterprise systems. Our API documentation is comprehensive, and our technical team can assist with custom integrations. We also offer webhook support for real-time data synchronization and can work with your IT team to ensure seamless integration with your existing technology stack.',
      popular: false
    },
    {
      id: 11,
      category: 'ai-platform',
      question: 'What is RAG and how does it benefit our organization?',
      answer: 'RAG (Retrieval-Augmented Generation) is a cutting-edge AI technology that combines real-time data retrieval with AI generation capabilities. This means OptimaliQ can access current market data, industry trends, and competitive intelligence to provide you with the most up-to-date strategic insights. Unlike static AI models, our RAG system ensures your recommendations are based on current market conditions and emerging trends, giving you a competitive advantage in strategic decision-making.',
      popular: true
    },
    {
      id: 12,
      category: 'enterprise',
      question: 'Do you offer custom AI model training for specific industries?',
      answer: 'Yes! Our Enterprise customers can access custom AI model training tailored to their specific industry, regulatory environment, or organizational needs. This includes industry-specific assessment frameworks, custom scoring algorithms, and specialized AI models trained on your industry\'s unique challenges and opportunities. We work closely with your team to understand your domain expertise and incorporate it into our AI models for maximum relevance and accuracy.',
      popular: false
    }
  ]
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const filteredQuestions = faqData.questions.filter(question => {
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const selectedCategoryData = faqData.categories.find(cat => cat.id === selectedCategory)

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
                Support & FAQ
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                How Can We{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Help You?
                </span>
              </h1>
              <p className="text-2xl font-semibold text-blue-300 mb-8">
                Get answers to your questions about our enterprise AI platform
              </p>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Find comprehensive answers about OptimaliQ's AI-powered business intelligence platform, from getting started to advanced enterprise features. Our support team is here to help you maximize the value of our cutting-edge technology.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Search and Filter Section */}
      <Section className="py-16 bg-white">
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
                Find Your Answers
              </h2>
              <p className="text-lg text-gray-700">
                Search our knowledge base or browse by category to find the information you need
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for questions, features, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </motion.div>

            {/* Category Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 mb-8 justify-center"
            >
              {faqData.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </motion.div>

            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
                {selectedCategory !== 'all' && ` in ${selectedCategoryData?.name}`}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Questions Section */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {filteredQuestions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or category filter
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-6 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            {faqData.categories.find(cat => cat.id === faq.category)?.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {faq.question}
                            </h3>
                            {faq.popular && (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                <CheckCircle className="h-3 w-3" />
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 capitalize">
                            {faq.category.replace('-', ' ')}
                          </span>
                          <motion.div
                            animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          </motion.div>
                        </div>
                      </div>
                    </button>
                    
                    <motion.div
                      initial={false}
                      animate={{ height: openFaqIndex === index ? 'auto' : 0, opacity: openFaqIndex === index ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Still Need Help Section */}
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
                Still Need Help?
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Our enterprise support team is here to help you get the most out of OptimaliQ
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    icon: <Mail className="h-8 w-8" />,
                    title: 'Email Support',
                    description: 'Get detailed responses within 24 hours',
                    action: 'support@optimaliq.ai'
                  },
                  {
                    icon: <Phone className="h-8 w-8" />,
                    title: 'Phone Support',
                    description: 'Speak directly with our experts',
                    action: '+1 (555) 123-4567'
                  },
                  {
                    icon: <MessageSquare className="h-8 w-8" />,
                    title: 'Live Chat',
                    description: 'Instant help during business hours',
                    action: 'Start Chat'
                  }
                ].map((support, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                      {support.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{support.title}</h3>
                    <p className="text-gray-600 mb-3">{support.description}</p>
                    <p className="text-blue-600 font-medium">{support.action}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Schedule a Demo
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
