/**
 * OptimaliQ Success Stories Page
 * Customer success stories and case studies with detailed results
 */

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Award,
  CheckCircle,
  ArrowRight,
  Zap,
  Star,
  Quote,
  Calendar,
  MapPin,
  Building,
  Heart,
  Stethoscope,
  GraduationCap,
  Factory,
  Laptop,
  Globe,
  DollarSign,
  Clock,
  Percent,
  Eye,
  Download,
  Share2,
  Play,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { MetricCard } from '@/components/ui/charts'

// Success stories data
const successData = {
  featured: {
    id: 'healthforward',
    organization: 'HealthForward',
    industry: 'Healthcare Non-Profit',
    size: '150 employees',
    location: 'Portland, OR',
    logo: '/api/placeholder/120/60',
    hero: '/api/placeholder/800/400',
    challenge: 'HealthForward was struggling with inefficient processes, unclear strategic direction, and limited data insights that were hindering their ability to serve more patients effectively.',
    solution: 'Implemented OptimaliQ\'s comprehensive assessment and growth planning platform to identify bottlenecks, optimize operations, and develop data-driven strategies.',
    results: {
      efficiency: '+40%',
      cost_savings: '$2.3M',
      patient_capacity: '+65%',
      staff_satisfaction: '+28%'
    },
    timeline: '6 months',
    testimonial: {
      quote: 'OptimaliQ transformed how we approach strategic planning and operations. The AI-powered insights identified opportunities we never would have found on our own, leading to our most successful year yet.',
      author: 'Jennifer Walsh',
      role: 'CEO & Executive Director',
      image: '/api/placeholder/80/80'
    },
    keyMetrics: [
      { label: 'Operational Efficiency', before: '62%', after: '87%', improvement: '+40%' },
      { label: 'Patient Capacity', before: '1,200/month', after: '1,980/month', improvement: '+65%' },
      { label: 'Cost per Patient', before: '$340', after: '$210', improvement: '-38%' },
      { label: 'Staff Satisfaction', before: '72%', after: '92%', improvement: '+28%' }
    ],
    implementation: [
      'Conducted comprehensive organizational assessment',
      'Identified 12 key improvement areas across operations and strategy',
      'Implemented AI-powered process optimization recommendations',
      'Established data-driven decision making framework',
      'Deployed team collaboration and performance tracking tools',
      'Ongoing quarterly assessments for continuous improvement'
    ]
  },
  stories: [
    {
      id: 'edutech-solutions',
      organization: 'EduTech Solutions',
      industry: 'Education Technology',
      size: '85 employees',
      location: 'Austin, TX',
      logo: '/api/placeholder/100/50',
      challenge: 'Rapid growth was straining resources and creating operational inefficiencies',
      solution: 'Used OptimaliQ to optimize team structure and implement scalable processes',
      results: {
        revenue_growth: '+120%',
        efficiency: '+35%',
        retention: '+45%',
        satisfaction: '+30%'
      },
      testimonial: {
        quote: 'OptimaliQ helped us scale efficiently without losing our culture or quality. The insights were game-changing.',
        author: 'Marcus Thompson',
        role: 'Director of Operations'
      },
      featured: false
    },
    {
      id: 'community-impact',
      organization: 'Community Impact Alliance',
      industry: 'Community Development',
      size: '45 employees',
      location: 'Denver, CO',
      logo: '/api/placeholder/100/50',
      challenge: 'Limited funding required maximum efficiency and impact measurement',
      solution: 'Leveraged OptimaliQ to optimize resource allocation and measure social impact',
      results: {
        impact_reach: '+180%',
        cost_efficiency: '+55%',
        funding: '+90%',
        programs: '+75%'
      },
      testimonial: {
        quote: 'The data-driven approach helped us demonstrate our impact to funders and optimize our programs for maximum community benefit.',
        author: 'Lisa Rodriguez',
        role: 'Executive Director'
      },
      featured: false
    },
    {
      id: 'green-innovations',
      organization: 'Green Innovations Corp',
      industry: 'Environmental Technology',
      size: '220 employees',
      location: 'Seattle, WA',
      logo: '/api/placeholder/100/50',
      challenge: 'Needed to balance rapid innovation with operational excellence and sustainability',
      solution: 'Implemented OptimaliQ for strategic planning and sustainable growth optimization',
      results: {
        innovation_speed: '+60%',
        sustainability: '+40%',
        market_share: '+25%',
        employee_engagement: '+35%'
      },
      testimonial: {
        quote: 'OptimaliQ aligned our innovation goals with operational reality, helping us grow sustainably while maintaining our environmental mission.',
        author: 'David Chen',
        role: 'Chief Innovation Officer'
      },
      featured: false
    },
    {
      id: 'manufacturing-excellence',
      organization: 'Precision Manufacturing Inc',
      industry: 'Advanced Manufacturing',
      size: '380 employees',
      location: 'Detroit, MI',
      logo: '/api/placeholder/100/50',
      challenge: 'Complex supply chain issues and quality control challenges affecting competitiveness',
      solution: 'Used OptimaliQ to optimize manufacturing processes and implement predictive quality systems',
      results: {
        quality_improvement: '+45%',
        waste_reduction: '-50%',
        productivity: '+30%',
        delivery_time: '-25%'
      },
      testimonial: {
        quote: 'The AI-powered insights revolutionized our approach to quality and efficiency. We\'re now industry leaders in operational excellence.',
        author: 'Sarah Kim',
        role: 'VP of Operations'
      },
      featured: false
    }
  ],
  stats: {
    totalOrganizations: '500+',
    averageImprovement: '45%',
    totalSavings: '$50M+',
    satisfaction: '96%'
  },
  industries: [
    { name: 'Healthcare', icon: <Stethoscope className="h-6 w-6" />, count: 125, improvement: '42%' },
    { name: 'Education', icon: <GraduationCap className="h-6 w-6" />, count: 89, improvement: '38%' },
    { name: 'Technology', icon: <Laptop className="h-6 w-6" />, count: 76, improvement: '52%' },
    { name: 'Manufacturing', icon: <Factory className="h-6 w-6" />, count: 65, improvement: '48%' },
    { name: 'Non-Profit', icon: <Heart className="h-6 w-6" />, count: 145, improvement: '41%' }
  ]
}

export default function SuccessStoriesPage() {
  const getIndustryIcon = (industry: string) => {
    if (industry.includes('Healthcare')) return <Stethoscope className="h-5 w-5" />
    if (industry.includes('Education')) return <GraduationCap className="h-5 w-5" />
    if (industry.includes('Technology')) return <Laptop className="h-5 w-5" />
    if (industry.includes('Manufacturing')) return <Factory className="h-5 w-5" />
    if (industry.includes('Community')) return <Heart className="h-5 w-5" />
    if (industry.includes('Environmental')) return <Globe className="h-5 w-5" />
    return <Building className="h-5 w-5" />
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
            <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link href="/success-stories" className="text-sm text-primary font-medium">Success Stories</Link>
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
              <Award className="h-4 w-4 mr-2" />
              Success Stories
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Real Organizations,{' '}
              <span className="text-primary">Real Results</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover how organizations across industries have transformed their operations, 
              strategy, and growth using OptimaliQ's AI-powered insights and recommendations.
            </p>

            {/* Success Stats */}
            <Grid cols={4} gap={6} className="max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{successData.stats.totalOrganizations}</div>
                <div className="text-sm text-muted-foreground">Organizations Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{successData.stats.averageImprovement}</div>
                <div className="text-sm text-muted-foreground">Average Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{successData.stats.totalSavings}</div>
                <div className="text-sm text-muted-foreground">Total Savings Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{successData.stats.satisfaction}</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </div>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* Featured Success Story */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <StatusBadge status="success" className="mb-4">Featured Success Story</StatusBadge>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-8 bg-gradient-to-r from-primary/20 to-primary/10 rounded flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{successData.featured.organization}</h2>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          {getIndustryIcon(successData.featured.industry)}
                          <span>{successData.featured.industry}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{successData.featured.size}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{successData.featured.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-red-600 mb-2">Challenge</h3>
                      <p className="text-muted-foreground">{successData.featured.challenge}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-blue-600 mb-2">Solution</h3>
                      <p className="text-muted-foreground">{successData.featured.solution}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-green-600 mb-3">Key Results</h3>
                      <Grid cols={2} gap={4}>
                        <MetricCard
                          title="Efficiency Gain"
                          value={successData.featured.results.efficiency}
                          icon={<TrendingUp className="h-5 w-5" />}
                          trend="up"
                        />
                        <MetricCard
                          title="Cost Savings"
                          value={successData.featured.results.cost_savings}
                          icon={<DollarSign className="h-5 w-5" />}
                          trend="up"
                        />
                        <MetricCard
                          title="Capacity Increase"
                          value={successData.featured.results.patient_capacity}
                          icon={<BarChart3 className="h-5 w-5" />}
                          trend="up"
                        />
                        <MetricCard
                          title="Staff Satisfaction"
                          value={successData.featured.results.staff_satisfaction}
                          icon={<Users className="h-5 w-5" />}
                          trend="up"
                        />
                      </Grid>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button asChild>
                      <Link href={`/case-study/${successData.featured.id}`}>
                        Read Full Case Study
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {successData.featured.results.efficiency}
                      </div>
                      <div className="text-lg font-medium">Efficiency Improvement</div>
                      <div className="text-sm text-muted-foreground">in {successData.featured.timeline}</div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <div className="flex items-start space-x-3">
                        <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm italic mb-3">"{successData.featured.testimonial.quote}"</p>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{successData.featured.testimonial.author}</div>
                              <div className="text-xs text-muted-foreground">{successData.featured.testimonial.role}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Key Metrics Deep Dive */}
      <Section className="pb-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Detailed Impact Analysis</h2>
            <p className="text-xl text-muted-foreground">
              See the specific metrics and improvements achieved by {successData.featured.organization}
            </p>
          </motion.div>

          <Grid cols={1} gap={6}>
            {successData.featured.keyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{metric.label}</h3>
                      <div className="flex items-center space-x-6">
                        <div>
                          <div className="text-sm text-muted-foreground">Before</div>
                          <div className="text-2xl font-bold">{metric.before}</div>
                        </div>
                        <div className="text-2xl text-muted-foreground">→</div>
                        <div>
                          <div className="text-sm text-muted-foreground">After</div>
                          <div className="text-2xl font-bold text-primary">{metric.after}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status="success" className="mb-2">
                        {metric.improvement}
                      </StatusBadge>
                      <div className="text-sm text-muted-foreground">Improvement</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Other Success Stories */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">More Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              Organizations across industries are achieving remarkable results with OptimaliQ
            </p>
          </motion.div>

          <Grid cols={1} gap={8}>
            {successData.stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-6 bg-gradient-to-r from-primary/20 to-primary/10 rounded flex items-center justify-center">
                          {getIndustryIcon(story.industry)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{story.organization}</h3>
                          <div className="text-sm text-muted-foreground">{story.industry}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{story.size}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{story.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Challenge & Solution</h4>
                      <p className="text-sm text-muted-foreground mb-3">{story.challenge}</p>
                      <p className="text-sm text-muted-foreground">{story.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Key Results</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(story.results).map(([key, value], resultIndex) => (
                          <div key={resultIndex} className="text-center">
                            <div className="text-lg font-bold text-primary">{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {key.replace('_', ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Quote className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs italic mb-2">"{story.testimonial.quote}"</p>
                            <div className="text-xs font-medium">{story.testimonial.author}</div>
                            <div className="text-xs text-muted-foreground">{story.testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Industry Breakdown */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Success Across Industries</h2>
            <p className="text-xl text-muted-foreground">
              OptimaliQ delivers results across diverse industries and organization types
            </p>
          </motion.div>

          <Grid cols={5} gap={6}>
            {successData.industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg inline-flex mb-4">
                    {industry.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{industry.name}</h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">{industry.count}</div>
                    <div className="text-xs text-muted-foreground">Organizations</div>
                    <StatusBadge status="success" size="sm">
                      {industry.improvement} avg improvement
                    </StatusBadge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Implementation Process */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">How We Achieve These Results</h2>
            <p className="text-xl text-muted-foreground">
              Our proven methodology that drives consistent success across organizations
            </p>
          </motion.div>

          <div className="space-y-6">
            {successData.featured.implementation.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <Card className="p-4">
                    <p className="text-muted-foreground">{step}</p>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-3xl font-bold mb-6">Ready to Write Your Success Story?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join hundreds of organizations that have transformed their operations and achieved 
                remarkable growth with OptimaliQ's AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/assessment">
                    Start Free Assessment
                    <Target className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/demo">
                    Schedule a Demo
                    <Calendar className="ml-2 h-5 w-5" />
                  </Link>
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
