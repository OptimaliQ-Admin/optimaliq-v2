/**
 * OptimaliQ Landing Page
 * AI-powered business intelligence platform for non-profit organizations
 */

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Lightbulb,
  Shield,
  Zap,
  Globe,
  Award,
  Play,
  Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Tooltip } from '@/components/ui/feedback'
import { LineChart, MetricCard } from '@/components/ui/charts'

// Hero Section Data
const heroData = {
  title: "AI-Powered Business Intelligence for Non-Profits",
  subtitle: "Transform your organization with data-driven insights, strategic planning, and growth optimization powered by advanced AI technology.",
  cta: "Start Your Free Assessment",
  stats: [
    { value: "500+", label: "Organizations Served" },
    { value: "95%", label: "Success Rate" },
    { value: "2.5x", label: "Average Growth" },
  ]
}

// Features Data
const features = [
  {
    icon: <Target className="h-8 w-8" />,
    title: "Strategic Assessment",
    description: "Comprehensive evaluation of your organization's strategy, processes, and technology with AI-powered insights.",
    color: "primary"
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Data-Driven Analytics",
    description: "Advanced analytics and reporting with real-time dashboards and predictive insights.",
    color: "success"
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Growth Optimization",
    description: "AI-powered growth strategies and 30-day action plans tailored to your organization.",
    color: "warning"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team Collaboration",
    description: "Seamless team management with role-based access and collaborative assessment tools.",
    color: "info"
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Market Intelligence",
    description: "Real-time market insights and competitive analysis to stay ahead of industry trends.",
    color: "purple"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with SOC 2 compliance and data protection standards.",
    color: "error"
  }
]

// Testimonials Data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Executive Director",
    organization: "Community Health Initiative",
    content: "OptimaliQ transformed our strategic planning process. The AI insights helped us identify growth opportunities we never considered.",
    rating: 5,
    avatar: "/avatars/sarah.jpg"
  },
  {
    name: "Michael Chen",
    role: "Board President",
    organization: "Youth Development Foundation",
    content: "The data-driven approach and actionable recommendations have increased our impact by 300% in just 6 months.",
    rating: 5,
    avatar: "/avatars/michael.jpg"
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "CEO",
    organization: "Education First Alliance",
    content: "OptimaliQ's market intelligence and growth strategies have positioned us as a leader in our sector.",
    rating: 5,
    avatar: "/avatars/emily.jpg"
  }
]

// Sample Chart Data
const growthData = [
  { month: 'Jan', revenue: 12000, donors: 150, impact: 85 },
  { month: 'Feb', revenue: 15000, donors: 180, impact: 88 },
  { month: 'Mar', revenue: 18000, donors: 220, impact: 92 },
  { month: 'Apr', revenue: 22000, donors: 280, impact: 95 },
  { month: 'May', revenue: 28000, donors: 350, impact: 98 },
  { month: 'Jun', revenue: 35000, donors: 420, impact: 100 }
]

// Pricing Data
const pricingPlans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small non-profits getting started",
    features: [
      "Basic assessment tools",
      "5 team members",
      "Standard reports",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    description: "Ideal for growing organizations",
    features: [
      "Advanced AI insights",
      "Unlimited team members",
      "Custom dashboards",
      "Priority support",
      "Market intelligence",
      "Growth strategies"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex needs",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated success manager",
      "Advanced analytics",
      "White-label options",
      "API access"
    ],
    popular: false
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Success Stories</a>
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <Section className="py-20 lg:py-32">
        <Container>
          <Grid cols={2} gap={8} className="items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <StatusBadge status="success" dot className="mb-4">
                Trusted by 500+ Non-Profit Organizations
              </StatusBadge>
              
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                {heroData.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {heroData.subtitle}
              </p>
              
              <Flex gap={4} className="mb-8">
                <Button size="lg" className="group">
                  {heroData.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </Flex>
              
              <Flex gap={8}>
                {heroData.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </Flex>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Growth Analytics</h3>
                    <StatusBadge status="success" size="sm">+45%</StatusBadge>
                  </div>
                  <div className="h-48">
                    <LineChart
                      data={growthData}
                      lines={[
                        { key: 'revenue', color: '#3b82f6', strokeWidth: 3 },
                        { key: 'donors', color: '#10b981', strokeWidth: 2 },
                        { key: 'impact', color: '#f59e0b', strokeWidth: 2 }
                      ]}
                      showGrid={false}
                      showLegend={false}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <MetricCard
                      title="Revenue"
                      value="$35K"
                      change={{ value: 45, type: "increase", period: "last month" }}
                      trend="up"
                      size="sm"
                    />
                    <MetricCard
                      title="Donors"
                      value="420"
                      change={{ value: 28, type: "increase", period: "last month" }}
                      trend="up"
                      size="sm"
                    />
                    <MetricCard
                      title="Impact"
                      value="100%"
                      change={{ value: 12, type: "increase", period: "last month" }}
                      trend="up"
                      size="sm"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Features Section */}
      <Section id="features" className="py-20 bg-muted/30">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-4">
              Powerful Features
            </StatusBadge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Scale Your Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI-powered tools designed specifically for non-profit organizations to maximize their social impact.
            </p>
          </motion.div>
          
          <Grid cols={3} gap={8}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 group">
                  <div className={`inline-flex p-3 rounded-lg bg-${feature.color}/10 text-${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section id="testimonials" className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <StatusBadge status="warning" className="mb-4">
              Success Stories
            </StatusBadge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Leading Non-Profits
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how organizations are transforming their impact with OptimaliQ's AI-powered insights.
            </p>
          </motion.div>
          
          <Grid cols={3} gap={8}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.organization}
                      </div>
                    </div>
        </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Pricing Section */}
      <Section id="pricing" className="py-20 bg-muted/30">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <StatusBadge status="info" className="mb-4">
              Simple Pricing
            </StatusBadge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Choose the Perfect Plan for Your Organization
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Flexible pricing options designed to scale with your organization's growth and impact.
            </p>
          </motion.div>
          
          <Grid cols={3} gap={8}>
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                  {plan.popular && (
                    <StatusBadge status="primary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      Most Popular
                    </StatusBadge>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <Stack spacing={3} className="mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </Stack>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <Award className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Your Organization?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of non-profit organizations already using OptimaliQ to maximize their social impact and drive sustainable growth.
              </p>
              <Flex gap={4} className="justify-center">
                <Button size="lg" className="group">
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Demo
                </Button>
              </Flex>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <Container className="py-12">
          <Grid cols={4} gap={8}>
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">OptimaliQ</span>
              </div>
              <p className="text-muted-foreground mb-4">
                AI-powered business intelligence for non-profit organizations.
              </p>
              <div className="flex space-x-4">
                <Globe className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Award className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Shield className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <Stack spacing={2}>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Features</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Pricing</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">API</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Integrations</a>
              </Stack>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <Stack spacing={2}>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">About</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
              </Stack>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <Stack spacing={2}>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Help Center</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Documentation</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Community</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Status</a>
              </Stack>
            </div>
          </Grid>
          
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 OptimaliQ. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
