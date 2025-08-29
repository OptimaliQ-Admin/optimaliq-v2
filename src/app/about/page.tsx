/**
 * OptimaliQ About Page
 * Company story, mission, team, and values with professional presentation
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
  Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'

// Company data
const companyData = {
  founded: '2023',
  headquarters: 'San Francisco, CA',
  employees: '50+',
  organizations: '500+',
  assessments: '10,000+',
  countries: '25+',
  mission: 'To empower organizations with AI-driven insights that unlock their full potential and drive sustainable growth.',
  vision: 'A world where every organization has access to intelligent, data-driven guidance to achieve their goals and create positive impact.',
  values: [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Intelligence First',
      description: 'We believe in the power of AI and data to provide insights that humans alone cannot achieve.'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Purpose Driven',
      description: 'We are committed to helping organizations create positive impact in their communities and beyond.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Trust & Security',
      description: 'We maintain the highest standards of data security and privacy to protect our clients\' information.'
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: 'Innovation',
      description: 'We continuously push the boundaries of what\'s possible with AI and business intelligence.'
    }
  ],
  team: [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former McKinsey partner with 15+ years in strategy consulting. PhD in Business Analytics from Stanford.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google AI researcher with expertise in machine learning and natural language processing. MS in Computer Science from MIT.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Emily Johnson',
      role: 'Head of Product',
      bio: 'Product leader with 10+ years at Salesforce and Microsoft. Expert in enterprise SaaS and user experience design.',
      image: '/api/placeholder/150/150',
      linkedin: '#'
    },
    {
      name: 'David Kim',
      role: 'Head of AI',
      bio: 'AI researcher and engineer with experience at OpenAI and Anthropic. Specializes in large language models and reasoning systems.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      github: '#'
    }
  ],
  milestones: [
    {
      year: '2023',
      title: 'Company Founded',
      description: 'OptimaliQ was founded with the vision of democratizing business intelligence through AI.'
    },
    {
      year: '2023',
      title: 'First AI Models',
      description: 'Developed our proprietary assessment and analysis AI models with initial beta testing.'
    },
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'Launched the OptimaliQ platform with comprehensive assessment and growth planning capabilities.'
    },
    {
      year: '2024',
      title: 'Scale Achievement',
      description: 'Reached 500+ organizations served with 10,000+ assessments completed across 25+ countries.'
    }
  ],
  testimonials: [
    {
      quote: "OptimaliQ transformed how we approach strategic planning. The AI-powered insights are incredibly accurate and actionable.",
      author: "Jennifer Walsh",
      role: "CEO, HealthForward",
      company: "Healthcare Non-Profit"
    },
    {
      quote: "The assessment process is seamless and the recommendations have directly contributed to our 40% growth this year.",
      author: "Marcus Thompson",
      role: "Director of Operations",
      company: "EduTech Solutions"
    },
    {
      quote: "Finally, a platform that understands the unique challenges of non-profit organizations and provides relevant, practical guidance.",
      author: "Lisa Rodriguez",
      role: "Executive Director",
      company: "Community Impact Alliance"
    }
  ]
}

export default function AboutPage() {
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
            <Link href="/about" className="text-sm text-primary font-medium">About</Link>
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
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              About OptimaliQ
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Empowering Organizations with{' '}
              <span className="text-primary">AI-Driven Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We're on a mission to democratize business intelligence and strategic planning through advanced AI technology, 
              helping organizations of all sizes achieve their full potential.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Grid cols={4} gap={6} className="mb-20">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{companyData.organizations}</div>
                <div className="text-sm text-muted-foreground">Organizations Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{companyData.assessments}</div>
                <div className="text-sm text-muted-foreground">Assessments Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{companyData.countries}</div>
                <div className="text-sm text-muted-foreground">Countries Reached</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{companyData.employees}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={12} className="items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {companyData.mission}
              </p>
              
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                {companyData.vision}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="text-2xl font-bold">Founded</div>
                    <div className="text-muted-foreground">{companyData.founded}</div>
                  </div>
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="text-2xl font-bold">HQ</div>
                    <div className="text-muted-foreground">{companyData.headquarters}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Values */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do and shape our culture.
            </p>
          </motion.div>

          <Grid cols={2} gap={8}>
            {companyData.values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Team */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate experts from top companies and institutions, united by our mission to transform business intelligence.
            </p>
          </motion.div>

          <Grid cols={2} gap={8}>
            {companyData.team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                      <div className="flex space-x-3">
                        {member.linkedin && (
                          <Button variant="ghost" size="sm">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        )}
                        {member.twitter && (
                          <Button variant="ghost" size="sm">
                            <Twitter className="h-4 w-4" />
                          </Button>
                        )}
                        {member.github && (
                          <Button variant="ghost" size="sm">
                            <Github className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Timeline */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our mission to democratize business intelligence.
            </p>
          </motion.div>

          <div className="space-y-8">
            {companyData.milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <StatusBadge status="primary">{milestone.year}</StatusBadge>
                    <h3 className="text-xl font-semibold">{milestone.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">
              Hear from organizations that have transformed their operations with OptimaliQ.
            </p>
          </motion.div>

          <Grid cols={1} gap={8}>
            {companyData.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="p-8">
                  <div className="flex items-start space-x-4">
                    <Quote className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-lg mb-4">{testimonial.quote}</p>
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-semibold">{testimonial.author}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role}, {testimonial.company}
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
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Organization?</h2>
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
                  <Link href="/contact">Contact Us</Link>
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
