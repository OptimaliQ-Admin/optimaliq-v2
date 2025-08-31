/**
 * OptimaliQ Growth Planning AI
 * AI-powered roadmap generation and action planning
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
  Map, Route, Flag, Milestone, TrendingDown, AlertTriangle,
  CheckSquare as CheckSquareIcon, Circle, Square
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/data-display'
import { Select } from '@/components/ui/form'

// Growth plan types
interface GrowthMilestone {
  id: string
  title: string
  description: string
  timeline: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  aiConfidence: number
  dependencies: string[]
  resources: string[]
  successMetrics: string[]
}

interface GrowthAction {
  id: string
  title: string
  description: string
  category: string
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  timeline: string
  assignedTo: string
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
}

// AI growth planning data
const growthPlanningData = {
  currentGoals: [
    {
      id: '1',
      title: 'Improve Team Collaboration',
      description: 'Enhance cross-functional communication and teamwork',
      priority: 'high',
      targetScore: 85,
      currentScore: 65,
      timeline: '3 months'
    },
    {
      id: '2',
      title: 'Optimize Process Efficiency',
      description: 'Streamline workflows and reduce operational bottlenecks',
      priority: 'medium',
      targetScore: 80,
      currentScore: 70,
      timeline: '6 months'
    },
    {
      id: '3',
      title: 'Enhance Customer Experience',
      description: 'Improve customer satisfaction and retention rates',
      priority: 'high',
      targetScore: 90,
      currentScore: 75,
      timeline: '4 months'
    }
  ],
  aiGeneratedRoadmap: {
    milestones: [
      {
        id: '1',
        title: 'Team Communication Assessment',
        description: 'Conduct comprehensive analysis of current communication patterns',
        timeline: 'Week 1-2',
        priority: 'high',
        status: 'in-progress',
        aiConfidence: 0.92,
        dependencies: [],
        resources: ['Communication tools', 'Team surveys', 'Analytics platform'],
        successMetrics: ['Response time', 'Collaboration frequency', 'Meeting effectiveness']
      },
      {
        id: '2',
        title: 'Process Mapping & Analysis',
        description: 'Document current processes and identify optimization opportunities',
        timeline: 'Week 3-4',
        priority: 'medium',
        status: 'pending',
        aiConfidence: 0.88,
        dependencies: ['Team Communication Assessment'],
        resources: ['Process mapping tools', 'Stakeholder interviews', 'Data analysis'],
        successMetrics: ['Process efficiency', 'Time savings', 'Error reduction']
      },
      {
        id: '3',
        title: 'Implementation Planning',
        description: 'Develop detailed implementation strategy for improvements',
        timeline: 'Week 5-6',
        priority: 'high',
        status: 'pending',
        aiConfidence: 0.85,
        dependencies: ['Process Mapping & Analysis'],
        resources: ['Project management tools', 'Team training', 'Change management'],
        successMetrics: ['Implementation success rate', 'Adoption rate', 'ROI']
      }
    ],
    actions: [
      {
        id: '1',
        title: 'Implement Slack Integration',
        description: 'Set up Slack channels for better team communication',
        category: 'Communication',
        effort: 'low',
        impact: 'high',
        timeline: '1 week',
        assignedTo: 'IT Team',
        status: 'in-progress',
        progress: 60
      },
      {
        id: '2',
        title: 'Conduct Team Workshops',
        description: 'Organize collaboration workshops for all departments',
        category: 'Training',
        effort: 'medium',
        impact: 'high',
        timeline: '2 weeks',
        assignedTo: 'HR Team',
        status: 'not-started',
        progress: 0
      },
      {
        id: '3',
        title: 'Optimize Meeting Structure',
        description: 'Redesign meeting formats for better efficiency',
        category: 'Process',
        effort: 'low',
        impact: 'medium',
        timeline: '1 week',
        assignedTo: 'Operations Team',
        status: 'not-started',
        progress: 0
      }
    ]
  },
  aiInsights: {
    recommendations: [
      {
        title: 'Focus on Communication First',
        description: 'Addressing communication gaps will have the highest impact on overall performance',
        confidence: 0.94,
        impact: 'high',
        effort: 'medium'
      },
      {
        title: 'Implement Agile Methodologies',
        description: 'Adopting agile practices will improve team collaboration and project delivery',
        confidence: 0.87,
        impact: 'high',
        effort: 'high'
      },
      {
        title: 'Invest in Training Programs',
        description: 'Regular training sessions will enhance team skills and collaboration',
        confidence: 0.82,
        impact: 'medium',
        effort: 'medium'
      }
    ],
    riskAssessment: [
      {
        risk: 'Resistance to Change',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Implement change management strategy'
      },
      {
        risk: 'Resource Constraints',
        probability: 'low',
        impact: 'medium',
        mitigation: 'Prioritize high-impact initiatives'
      },
      {
        risk: 'Timeline Delays',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Set realistic milestones and buffer time'
      }
    ]
  }
}

export default function GrowthPlanningAIPage() {
  const [selectedGoal, setSelectedGoal] = React.useState('1')
  const [showAIInsights, setShowAIInsights] = React.useState(true)
  const [isGenerating, setIsGenerating] = React.useState(false)

  const handleGeneratePlan = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending': return <Circle className="h-4 w-4 text-gray-400" />
      default: return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
      default: return 'text-gray-600'
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
            <span className="text-sm text-muted-foreground">AI Growth Planning</span>
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
                  <h1 className="text-3xl font-bold mb-2">AI Growth Planning</h1>
                  <p className="text-muted-foreground">
                    AI-powered roadmap generation and intelligent action planning
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Analysis
                  </Button>
                  <Button onClick={handleGeneratePlan} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Plan
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
                {/* Current Goals */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Current Goals</h2>
                    <Select
                      value={selectedGoal}
                      onValueChange={setSelectedGoal}
                      options={growthPlanningData.currentGoals.map(goal => ({
                        value: goal.id,
                        label: goal.title
                      }))}
                    />
                  </div>

                  <div className="space-y-4">
                    {growthPlanningData.currentGoals.map((goal) => (
                      <div key={goal.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{goal.title}</h3>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{goal.timeline}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Current Score: {goal.currentScore}</span>
                            <span>Target Score: {goal.targetScore}</span>
                          </div>
                          <Progress value={(goal.currentScore / goal.targetScore) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* AI Generated Roadmap */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">AI Generated Roadmap</h2>
                  
                  <div className="space-y-6">
                    {growthPlanningData.aiGeneratedRoadmap.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="relative">
                        {/* Timeline Connector */}
                        {index < growthPlanningData.aiGeneratedRoadmap.milestones.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {getStatusIcon(milestone.status)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{milestone.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className={getPriorityColor(milestone.priority)}>
                                  {milestone.priority}
                                </Badge>
                                <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                                  AI: {Math.round(milestone.aiConfidence * 100)}%
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Timeline:</span> {milestone.timeline}
                              </div>
                              <div>
                                <span className="font-medium">Dependencies:</span> {milestone.dependencies.length}
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-2">Success Metrics:</h4>
                              <div className="flex flex-wrap gap-1">
                                {milestone.successMetrics.map((metric, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {metric}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Action Items */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Action Items</h2>
                  
                  <div className="space-y-4">
                    {growthPlanningData.aiGeneratedRoadmap.actions.map((action) => (
                      <div key={action.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                              {action.category}
                            </Badge>
                            <Badge variant="secondary" className={getEffortColor(action.effort)}>
                              Effort: {action.effort}
                            </Badge>
                            <Badge variant="secondary" className={getImpactColor(action.impact)}>
                              Impact: {action.impact}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <span>Assigned to: {action.assignedTo}</span>
                          <span>Timeline: {action.timeline}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{action.progress}%</span>
                          </div>
                          <Progress value={action.progress} className="h-2" />
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
                {/* AI Recommendations */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">AI Recommendations</h3>
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
                      {growthPlanningData.aiInsights.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm mb-2">{rec.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span>Confidence: {Math.round(rec.confidence * 100)}%</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className={getImpactColor(rec.impact)}>
                                Impact: {rec.impact}
                              </Badge>
                              <Badge variant="secondary" className={getEffortColor(rec.effort)}>
                                Effort: {rec.effort}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Risk Assessment */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
                  <div className="space-y-3">
                    {growthPlanningData.aiInsights.riskAssessment.map((risk, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{risk.risk}</h4>
                          <div className="flex items-center space-x-1">
                            <Badge variant="secondary" className={
                              risk.probability === 'high' ? 'text-red-600 bg-red-100' :
                              risk.probability === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                              'text-green-600 bg-green-100'
                            }>
                              {risk.probability}
                            </Badge>
                            <Badge variant="secondary" className={
                              risk.impact === 'high' ? 'text-red-600 bg-red-100' :
                              risk.impact === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                              'text-green-600 bg-green-100'
                            }>
                              {risk.impact}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Get AI Insights
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Map className="h-4 w-4 mr-2" />
                      View Roadmap
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Set Goals
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Track Progress
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
