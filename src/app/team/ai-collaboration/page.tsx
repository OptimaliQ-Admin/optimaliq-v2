/**
 * OptimaliQ Delegation & Collaboration AI
 * AI-powered team matching, workload optimization, and performance prediction
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, Target, BarChart3, TrendingUp, Sparkles, ArrowRight,
  CheckCircle, Clock, HelpCircle, Settings, Zap, Bell,
  ChevronDown, ChevronUp, Loader2, Smile, ThumbsUp,
  ThumbsDown, RefreshCw, Volume2, VolumeX, Mic, MicOff,
  Lightbulb, Award, Star, Rocket, Gauge, Activity, PieChart,
  LineChart, AreaChart, Target as TargetIcon, CheckSquare,
  Clock as ClockIcon, Calendar as CalendarIcon, User, Building,
  Users, UserPlus, UserCheck, UserX, MessageSquare, Mail,
  Phone, Video, Calendar, MapPin, Globe, TrendingDown, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/data-display'
import { Select } from '@/components/ui/form'

// Team collaboration data types
interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  skills: string[]
  availability: number
  performance: number
  workload: number
  aiMatchScore: number
  collaborationStyle: string
  strengths: string[]
  areas: string[]
}

interface TeamProject {
  id: string
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'planning' | 'active' | 'completed'
  deadline: string
  requiredSkills: string[]
  assignedMembers: string[]
  aiRecommendations: string[]
  progress: number
}

interface CollaborationInsight {
  id: string
  type: 'team_matching' | 'workload_optimization' | 'performance_prediction' | 'communication'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  recommendations: string[]
  metrics: { name: string; value: number; target: number }[]
}

// AI collaboration data
const aiCollaborationData = {
  teamMembers: [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Senior Developer',
      department: 'Engineering',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      availability: 85,
      performance: 92,
      workload: 78,
      aiMatchScore: 0.94,
      collaborationStyle: 'Collaborative',
      strengths: ['Technical leadership', 'Mentoring', 'Problem solving'],
      areas: ['Public speaking', 'Documentation']
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Product Manager',
      department: 'Product',
      skills: ['Product strategy', 'User research', 'Agile', 'Analytics'],
      availability: 90,
      performance: 88,
      workload: 65,
      aiMatchScore: 0.87,
      collaborationStyle: 'Strategic',
      strengths: ['Strategic thinking', 'Stakeholder management', 'Data analysis'],
      areas: ['Technical depth', 'Hands-on execution']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      department: 'Design',
      skills: ['Figma', 'User research', 'Prototyping', 'Design systems'],
      availability: 95,
      performance: 85,
      workload: 45,
      aiMatchScore: 0.91,
      collaborationStyle: 'Creative',
      strengths: ['User empathy', 'Visual design', 'Innovation'],
      areas: ['Technical implementation', 'Business metrics']
    }
  ],
  projects: [
    {
      id: '1',
      name: 'Mobile App Redesign',
      description: 'Complete redesign of the mobile application with new features',
      priority: 'high',
      status: 'active',
      deadline: '2024-12-15',
      requiredSkills: ['React Native', 'UI/UX Design', 'Product Management'],
      assignedMembers: ['1', '2', '3'],
      aiRecommendations: [
        'Add backend developer for API integration',
        'Include QA engineer for testing',
        'Consider user researcher for validation'
      ],
      progress: 65
    },
    {
      id: '2',
      name: 'Data Analytics Dashboard',
      description: 'Build comprehensive analytics dashboard for business insights',
      priority: 'medium',
      status: 'planning',
      deadline: '2025-02-01',
      requiredSkills: ['Data visualization', 'Backend development', 'Analytics'],
      assignedMembers: ['1'],
      aiRecommendations: [
        'Assign data scientist for analysis',
        'Include UX designer for dashboard design',
        'Add product manager for requirements'
      ],
      progress: 15
    }
  ],
  insights: [
    {
      id: '1',
      type: 'team_matching',
      title: 'Optimal Team Composition',
      description: 'AI analysis suggests optimal team combinations for current projects',
      confidence: 0.92,
      impact: 'high',
      recommendations: [
        'Pair Sarah with Emily for design-system integration',
        'Assign Michael to lead cross-functional initiatives',
        'Create mentorship program between senior and junior developers'
      ],
      metrics: [
        { name: 'Team Compatibility', value: 87, target: 90 },
        { name: 'Skill Coverage', value: 92, target: 95 },
        { name: 'Collaboration Efficiency', value: 78, target: 85 }
      ]
    },
    {
      id: '2',
      type: 'workload_optimization',
      title: 'Workload Distribution',
      description: 'AI recommendations for balanced workload across team members',
      confidence: 0.88,
      impact: 'medium',
      recommendations: [
        'Reduce Sarah\'s workload by 15% to prevent burnout',
        'Increase Emily\'s project involvement by 25%',
        'Reassign low-priority tasks to junior team members'
      ],
      metrics: [
        { name: 'Workload Balance', value: 72, target: 80 },
        { name: 'Resource Utilization', value: 85, target: 90 },
        { name: 'Burnout Risk', value: 23, target: 15 }
      ]
    },
    {
      id: '3',
      type: 'performance_prediction',
      title: 'Performance Forecasting',
      description: 'AI predictions for team performance and project outcomes',
      confidence: 0.85,
      impact: 'high',
      recommendations: [
        'Implement weekly check-ins for project tracking',
        'Add skill development sessions for identified gaps',
        'Create performance improvement plans for underperforming areas'
      ],
      metrics: [
        { name: 'Project Success Rate', value: 78, target: 85 },
        { name: 'Team Productivity', value: 82, target: 88 },
        { name: 'Quality Score', value: 89, target: 92 }
      ]
    }
  ],
  communicationAnalysis: {
    patterns: [
      { channel: 'Slack', frequency: 85, effectiveness: 78 },
      { channel: 'Email', frequency: 45, effectiveness: 65 },
      { channel: 'Video Calls', frequency: 30, effectiveness: 92 },
      { channel: 'In-Person', frequency: 15, effectiveness: 95 }
    ],
    recommendations: [
      'Increase video call frequency for complex discussions',
      'Reduce email usage for quick questions',
      'Implement structured meeting agendas'
    ]
  }
}

export default function AICollaborationPage() {
  const [selectedProject, setSelectedProject] = React.useState('all')
  const [showAIInsights, setShowAIInsights] = React.useState(true)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'planning': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCollaborationStyleColor = (style: string) => {
    switch (style) {
      case 'Collaborative': return 'text-blue-600 bg-blue-100'
      case 'Strategic': return 'text-purple-600 bg-purple-100'
      case 'Creative': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">AI Team Collaboration</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">AI Team Collaboration</h1>
                  <p className="text-muted-foreground">
                    AI-powered team matching, workload optimization, and performance prediction
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Analysis
                  </Button>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Run AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-8">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="col-span-2 space-y-8"
              >
                {/* Team Members */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">AI Team Analysis</h2>
                  
                  <div className="space-y-6">
                    {aiCollaborationData.teamMembers.map((member) => (
                      <div key={member.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium">{member.name}</h3>
                              <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                                {member.role}
                              </Badge>
                              <Badge variant="secondary" className={getCollaborationStyleColor(member.collaborationStyle)}>
                                {member.collaborationStyle}
                              </Badge>
                              <Badge variant="secondary" className="text-green-600 bg-green-100">
                                AI Match: {Math.round(member.aiMatchScore * 100)}%
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{member.department}</p>
                            
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-600">{member.availability}%</div>
                                <div className="text-xs text-muted-foreground">Availability</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-600">{member.performance}</div>
                                <div className="text-xs text-muted-foreground">Performance</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-600">{member.workload}%</div>
                                <div className="text-xs text-muted-foreground">Workload</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-orange-600">{member.skills.length}</div>
                                <div className="text-xs text-muted-foreground">Skills</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Strengths</h4>
                            <div className="space-y-1">
                              {member.strengths.map((strength, index) => (
                                <Badge key={index} variant="secondary" className="text-xs text-green-600 bg-green-100 mr-1 mb-1">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Areas for Growth</h4>
                            <div className="space-y-1">
                              {member.areas.map((area, index) => (
                                <Badge key={index} variant="secondary" className="text-xs text-yellow-600 bg-yellow-100 mr-1 mb-1">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Projects */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">AI Project Recommendations</h2>
                    <Select
                      value={selectedProject}
                      onValueChange={setSelectedProject}
                      options={[
                        { value: 'all', label: 'All Projects' },
                        { value: 'active', label: 'Active' },
                        { value: 'planning', label: 'Planning' },
                        { value: 'completed', label: 'Completed' }
                      ]}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    {aiCollaborationData.projects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium">{project.name}</h3>
                              <Badge variant="secondary" className={getPriorityColor(project.priority)}>
                                {project.priority}
                              </Badge>
                              <Badge variant="secondary" className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                              <span>Deadline: {project.deadline}</span>
                              <span>{project.assignedMembers.length} members assigned</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {project.requiredSkills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                            <ul className="space-y-1">
                              {project.aiRecommendations.map((rec, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* AI Insights Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* AI Insights */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">AI Collaboration Insights</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAIInsights(!showAIInsights)}
                    >
                      {showAIInsights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {showAIInsights && (
                    <div className="space-y-4">
                      {aiCollaborationData.insights.map((insight) => (
                        <div key={insight.id} className="p-3 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            <Badge variant="secondary" className={getImpactColor(insight.impact)}>
                              {insight.impact}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                          
                          <div className="space-y-2 mb-3">
                            {insight.metrics.map((metric, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>{metric.name}</span>
                                  <span>{metric.value}/{metric.target}</span>
                                </div>
                                <Progress value={(metric.value / metric.target) * 100} className="h-1" />
                              </div>
                            ))}
                          </div>

                          <div>
                            <h5 className="text-xs font-medium mb-1">Recommendations</h5>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Communication Analysis */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Communication Analysis</h3>
                  <div className="space-y-3">
                    {aiCollaborationData.communicationAnalysis.patterns.map((pattern, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{pattern.channel}</span>
                          <span className="text-sm text-muted-foreground">{pattern.frequency}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Effectiveness</span>
                            <span>{pattern.effectiveness}%</span>
                          </div>
                          <Progress value={pattern.effectiveness} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                    <ul className="space-y-1">
                      {aiCollaborationData.communicationAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                          <div className="h-1 w-1 rounded-full bg-green-500"></div>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Optimize Team
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
