/**
 * OptimaliQ Industry Solutions Page
 * Industry-specific solutions and use cases
 */

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Stethoscope,
  GraduationCap,
  Laptop,
  Factory,
  Heart,
  Building,
  Globe,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Clock,
  DollarSign,
  Lightbulb,
  Settings,
  Database,
  Lock,
  Workflow,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { MetricCard } from '@/components/ui/charts'

// Industry solutions data
const industryData = {
  industries: [
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: <Stethoscope className="h-8 w-8" />,
      description: 'Optimize patient care, operational efficiency, and regulatory compliance',
      color: 'bg-blue-500',
      stats: {
        organizations: 125,
        avgImprovement: '42%',
        costSavings: '$15M+',
        satisfaction: '94%'
      },
      challenges: [
        'Complex regulatory compliance requirements',
        'Patient care quality and safety standards',
        'Resource optimization and cost management',
        'Technology integration and interoperability',
        'Staff retention and satisfaction'
      ],
      solutions: [
        'Regulatory compliance assessment and monitoring',
        'Patient care quality optimization frameworks',
        'Resource allocation and efficiency analysis',
        'Technology integration roadmaps',
        'Staff engagement and retention strategies'
      ],
      outcomes: [
        'Improved patient satisfaction scores by 35%',
        'Reduced operational costs by 28%',
        'Enhanced regulatory compliance by 95%',
        'Increased staff retention by 40%'
      ],
      assessments: [
        'Healthcare Operations Excellence',
        'Patient Care Quality Assessment',
        'Regulatory Compliance Review',
        'Technology Integration Evaluation',
        'Staff Engagement Survey'
      ],
      caseStudy: {
        organization: 'HealthForward',
        result: '40% efficiency improvement, $2.3M cost savings'
      }
    },
    {
      id: 'education',
      name: 'Education',
      icon: <GraduationCap className="h-8 w-8" />,
      description: 'Enhance learning outcomes, operational efficiency, and student success',
      color: 'bg-green-500',
      stats: {
        organizations: 89,
        avgImprovement: '38%',
        costSavings: '$8M+',
        satisfaction: '91%'
      },
      challenges: [
        'Student engagement and learning outcomes',
        'Technology adoption and digital literacy',
        'Resource allocation and budget constraints',
        'Faculty development and retention',
        'Administrative efficiency and processes'
      ],
      solutions: [
        'Student success analytics and intervention systems',
        'Technology adoption and digital transformation plans',
        'Resource optimization and budget planning tools',
        'Faculty development and engagement programs',
        'Administrative process automation and efficiency'
      ],
      outcomes: [
        'Improved student success rates by 45%',
        'Enhanced technology adoption by 60%',
        'Reduced administrative costs by 32%',
        'Increased faculty satisfaction by 25%'
      ],
      assessments: [
        'Educational Excellence Assessment',
        'Technology Integration Evaluation',
        'Student Success Analytics',
        'Faculty Development Review',
        'Administrative Efficiency Audit'
      ],
      caseStudy: {
        organization: 'EduTech Solutions',
        result: '120% revenue growth, 35% efficiency improvement'
      }
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: <Laptop className="h-8 w-8" />,
      description: 'Scale innovation, optimize development processes, and accelerate growth',
      color: 'bg-purple-500',
      stats: {
        organizations: 76,
        avgImprovement: '52%',
        costSavings: '$12M+',
        satisfaction: '96%'
      },
      challenges: [
        'Rapid scaling and growth management',
        'Product development and innovation cycles',
        'Team collaboration and remote work',
        'Technology infrastructure and security',
        'Market positioning and competitive advantage'
      ],
      solutions: [
        'Agile scaling frameworks and growth strategies',
        'Product development optimization and innovation management',
        'Remote team collaboration and productivity tools',
        'Technology infrastructure assessment and security planning',
        'Market analysis and competitive positioning strategies'
      ],
      outcomes: [
        'Accelerated product development by 50%',
        'Improved team productivity by 45%',
        'Enhanced security posture by 80%',
        'Increased market share by 30%'
      ],
      assessments: [
        'Technology Scaling Assessment',
        'Product Development Optimization',
        'Team Collaboration Evaluation',
        'Security and Infrastructure Review',
        'Market Positioning Analysis'
      ],
      caseStudy: {
        organization: 'TechStart Innovations',
        result: '200% user growth, 60% faster development cycles'
      }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      icon: <Factory className="h-8 w-8" />,
      description: 'Optimize production, enhance quality, and streamline supply chains',
      color: 'bg-orange-500',
      stats: {
        organizations: 65,
        avgImprovement: '48%',
        costSavings: '$18M+',
        satisfaction: '93%'
      },
      challenges: [
        'Production efficiency and quality control',
        'Supply chain optimization and resilience',
        'Equipment maintenance and downtime reduction',
        'Workforce safety and training',
        'Sustainability and environmental compliance'
      ],
      solutions: [
        'Production optimization and quality management systems',
        'Supply chain analysis and risk mitigation strategies',
        'Predictive maintenance and equipment optimization',
        'Safety protocols and workforce development programs',
        'Sustainability initiatives and compliance frameworks'
      ],
      outcomes: [
        'Increased production efficiency by 55%',
        'Reduced supply chain disruptions by 70%',
        'Decreased equipment downtime by 45%',
        'Improved safety metrics by 60%'
      ],
      assessments: [
        'Manufacturing Excellence Assessment',
        'Supply Chain Optimization Review',
        'Quality Management Evaluation',
        'Safety and Compliance Audit',
        'Sustainability Impact Analysis'
      ],
      caseStudy: {
        organization: 'Precision Manufacturing Inc',
        result: '45% quality improvement, 50% waste reduction'
      }
    },
    {
      id: 'nonprofit',
      name: 'Non-Profit',
      icon: <Heart className="h-8 w-8" />,
      description: 'Maximize impact, optimize resources, and enhance community engagement',
      color: 'bg-red-500',
      stats: {
        organizations: 145,
        avgImprovement: '41%',
        costSavings: '$9M+',
        satisfaction: '97%'
      },
      challenges: [
        'Limited funding and resource constraints',
        'Impact measurement and reporting',
        'Volunteer management and engagement',
        'Donor relations and fundraising efficiency',
        'Program effectiveness and scalability'
      ],
      solutions: [
        'Resource optimization and efficiency frameworks',
        'Impact measurement and data analytics systems',
        'Volunteer engagement and management platforms',
        'Donor relationship management and fundraising strategies',
        'Program evaluation and scaling methodologies'
      ],
      outcomes: [
        'Increased program impact by 180%',
        'Improved resource efficiency by 55%',
        'Enhanced donor retention by 65%',
        'Boosted volunteer engagement by 75%'
      ],
      assessments: [
        'Non-Profit Impact Assessment',
        'Resource Optimization Review',
        'Fundraising Effectiveness Evaluation',
        'Volunteer Engagement Analysis',
        'Program Sustainability Audit'
      ],
      caseStudy: {
        organization: 'Community Impact Alliance',
        result: '180% impact reach, 90% funding increase'
      }
    }
  ],
  commonBenefits: [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Strategic Clarity',
      description: 'Clear strategic direction with data-driven insights and actionable recommendations'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Operational Excellence',
      description: 'Optimized processes, improved efficiency, and measurable performance gains'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Team Alignment',
      description: 'Enhanced collaboration, communication, and shared organizational goals'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Data-Driven Decisions',
      description: 'Evidence-based decision making with comprehensive analytics and insights'
    }
  ]
}

export default function IndustrySolutionsPage() {
  const [selectedIndustry, setSelectedIndustry] = React.useState(industryData.industries[0])

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
            <Link href="/industry-solutions" className="text-sm text-primary font-medium">Solutions</Link>
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
              <Building className="h-4 w-4 mr-2" />
              Industry Solutions
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Tailored Solutions for{' '}
              <span className="text-primary">Every Industry</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              OptimaliQ provides specialized assessments, insights, and growth strategies 
              designed for the unique challenges and opportunities in your industry.
            </p>

            {/* Industry Navigation */}
            <div className="flex flex-wrap justify-center gap-4">
              {industryData.industries.map((industry, index) => (
                <motion.button
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedIndustry.id === industry.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {industry.icon}
                  <span className="font-medium">{industry.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Selected Industry Detail */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <motion.div
            key={selectedIndustry.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-3 ${selectedIndustry.color} text-white rounded-lg`}>
                      {selectedIndustry.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{selectedIndustry.name}</h2>
                      <p className="text-muted-foreground">{selectedIndustry.description}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-red-600 mb-3">Common Challenges</h3>
                      <div className="space-y-2">
                        {selectedIndustry.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-blue-600 mb-3">Our Solutions</h3>
                      <div className="space-y-2">
                        {selectedIndustry.solutions.map((solution, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{solution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-green-600 mb-3">Typical Outcomes</h3>
                      <div className="space-y-2">
                        {selectedIndustry.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <Award className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <Button className="w-full" asChild>
                      <Link href={`/assessment?industry=${selectedIndustry.id}`}>
                        Start {selectedIndustry.name} Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/demo">
                        Schedule Industry Demo
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className={`${selectedIndustry.color}/20 p-8 lg:p-12 flex flex-col justify-center`}>
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-6">Industry Impact</h3>
                      <Grid cols={2} gap={4}>
                        <MetricCard
                          title="Organizations"
                          value={selectedIndustry.stats.organizations}
                          icon={<Building className="h-5 w-5" />}
                        />
                        <MetricCard
                          title="Avg Improvement"
                          value={selectedIndustry.stats.avgImprovement}
                          icon={<TrendingUp className="h-5 w-5" />}
                          trend="up"
                        />
                        <MetricCard
                          title="Cost Savings"
                          value={selectedIndustry.stats.costSavings}
                          icon={<DollarSign className="h-5 w-5" />}
                          trend="up"
                        />
                        <MetricCard
                          title="Satisfaction"
                          value={selectedIndustry.stats.satisfaction}
                          icon={<Star className="h-5 w-5" />}
                        />
                      </Grid>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-3">Case Study Highlight</h4>
                      <div className="p-4 bg-white/10 rounded-lg">
                        <div className="font-medium text-sm mb-1">{selectedIndustry.caseStudy.organization}</div>
                        <div className="text-sm text-muted-foreground">{selectedIndustry.caseStudy.result}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Industry Assessments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">
                Specialized Assessments for {selectedIndustry.name}
              </h3>
              <Grid cols={1} gap={4}>
                {selectedIndustry.assessments.map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{assessment}</h4>
                        <p className="text-sm text-muted-foreground">
                          Specialized for {selectedIndustry.name.toLowerCase()} organizations
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/assessment?type=${assessment.toLowerCase().replace(/\s+/g, '-')}&industry=${selectedIndustry.id}`}>
                        Start Assessment
                      </Link>
                    </Button>
                  </div>
                ))}
              </Grid>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Common Benefits */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Benefits Across All Industries</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              While each industry has unique challenges, OptimaliQ delivers consistent value 
              across all sectors through our comprehensive approach.
            </p>
          </motion.div>

          <Grid cols={2} gap={8}>
            {industryData.commonBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Industry Comparison */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Industry Performance Comparison</h2>
            <p className="text-xl text-muted-foreground">
              See how different industries perform with OptimaliQ implementations
            </p>
          </motion.div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-6 font-semibold">Industry</th>
                    <th className="text-center p-6 font-semibold">Organizations</th>
                    <th className="text-center p-6 font-semibold">Avg Improvement</th>
                    <th className="text-center p-6 font-semibold">Cost Savings</th>
                    <th className="text-center p-6 font-semibold">Satisfaction</th>
                    <th className="text-center p-6 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {industryData.industries.map((industry, index) => (
                    <tr key={industry.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${industry.color} text-white rounded-lg`}>
                            {industry.icon}
                          </div>
                          <div>
                            <div className="font-medium">{industry.name}</div>
                            <div className="text-sm text-muted-foreground">{industry.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center font-medium">{industry.stats.organizations}</td>
                      <td className="p-6 text-center">
                        <StatusBadge status="success">{industry.stats.avgImprovement}</StatusBadge>
                      </td>
                      <td className="p-6 text-center font-medium">{industry.stats.costSavings}</td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{industry.stats.satisfaction}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <Button size="sm" asChild>
                          <Link href={`/assessment?industry=${industry.id}`}>
                            Start Assessment
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
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
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Industry Impact?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join organizations in your industry that are already achieving remarkable results 
                with OptimaliQ's specialized solutions and AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/assessment">
                    Start Industry Assessment
                    <Target className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/success-stories">
                    View Success Stories
                    <Award className="ml-2 h-5 w-5" />
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
