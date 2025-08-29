/**
 * OptimaliQ Assessment Action Planning Page
 * 30-day growth plans, strategic roadmaps, and implementation tracking
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
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
  ArrowLeft,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Star,
  Clock,
  Eye,
  Download as DownloadIcon,
  Mail,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  CalendarDays,
  Flag,
  CheckSquare,
  Square,
  Filter,
  Search,
  RefreshCw,
  Info,
  HelpCircle,
  Settings,
  Bell,
  BookOpen,
  FileText,
  Video,
  Headphones
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { LineChart, PieChart, BarChart as BarChartComponent, MetricCard } from '@/components/ui/charts'
import { Select, Checkbox, Input } from '@/components/ui/form'

// Sample Action Plan Data
const actionPlanData = {
  overallProgress: 35,
  totalActions: 24,
  completedActions: 8,
  inProgressActions: 6,
  pendingActions: 10,
  categories: [
    {
      name: 'Technology Modernization',
      priority: 'High',
      progress: 45,
      actions: [
        {
          id: 1,
          title: 'Conduct Technology Audit',
          description: 'Assess current technology infrastructure and identify gaps',
          status: 'completed',
          dueDate: '2024-09-15',
          assignee: 'John Smith',
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          dependencies: [],
          notes: 'Completed ahead of schedule. Found 3 critical gaps.'
        },
        {
          id: 2,
          title: 'Research Cloud Solutions',
          description: 'Evaluate cloud-based solutions for improved efficiency',
          status: 'in-progress',
          dueDate: '2024-09-22',
          assignee: 'Sarah Johnson',
          priority: 'High',
          effort: 'High',
          impact: 'High',
          dependencies: [1],
          notes: 'Evaluating AWS, Azure, and Google Cloud options.'
        },
        {
          id: 3,
          title: 'Develop Implementation Roadmap',
          description: 'Create detailed roadmap for technology implementation',
          status: 'pending',
          dueDate: '2024-09-30',
          assignee: 'Mike Davis',
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          dependencies: [2],
          notes: 'Will include timeline, resources, and risk mitigation.'
        }
      ]
    },
    {
      name: 'Process Optimization',
      priority: 'Medium',
      progress: 25,
      actions: [
        {
          id: 4,
          title: 'Map Current Processes',
          description: 'Document existing workflows and identify bottlenecks',
          status: 'in-progress',
          dueDate: '2024-09-20',
          assignee: 'Lisa Chen',
          priority: 'Medium',
          effort: 'Low',
          impact: 'Medium',
          dependencies: [],
          notes: 'Focusing on customer service and operations processes.'
        },
        {
          id: 5,
          title: 'Implement Process Automation',
          description: 'Automate repetitive tasks to improve efficiency',
          status: 'pending',
          dueDate: '2024-10-05',
          assignee: 'David Wilson',
          priority: 'Medium',
          effort: 'High',
          impact: 'Medium',
          dependencies: [4],
          notes: 'Will start with email automation and reporting.'
        }
      ]
    },
    {
      name: 'Data Analytics Enhancement',
      priority: 'High',
      progress: 15,
      actions: [
        {
          id: 6,
          title: 'Assess Data Infrastructure',
          description: 'Evaluate current data storage and analytics capabilities',
          status: 'pending',
          dueDate: '2024-09-25',
          assignee: 'Emily Brown',
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          dependencies: [],
          notes: 'Need to understand current data sources and quality.'
        },
        {
          id: 7,
          title: 'Implement Analytics Tools',
          description: 'Deploy modern analytics and reporting tools',
          status: 'pending',
          dueDate: '2024-10-15',
          assignee: 'Emily Brown',
          priority: 'High',
          effort: 'High',
          impact: 'High',
          dependencies: [6],
          notes: 'Considering Tableau, Power BI, and custom solutions.'
        }
      ]
    }
  ],
  milestones: [
    {
      id: 1,
      title: 'Technology Assessment Complete',
      date: '2024-09-15',
      status: 'completed',
      description: 'Technology audit and gap analysis completed'
    },
    {
      id: 2,
      title: 'Process Mapping Complete',
      date: '2024-09-20',
      status: 'in-progress',
      description: 'Current process documentation and analysis'
    },
    {
      id: 3,
      title: 'Cloud Solution Selection',
      date: '2024-09-22',
      status: 'pending',
      description: 'Finalize cloud platform selection'
    },
    {
      id: 4,
      title: 'Implementation Roadmap',
      date: '2024-09-30',
      status: 'pending',
      description: 'Complete implementation planning'
    }
  ],
  resources: [
    {
      type: 'Documentation',
      title: 'Technology Assessment Report',
      description: 'Detailed analysis of current technology infrastructure',
      url: '#',
      icon: <FileText className="h-4 w-4" />
    },
    {
      type: 'Video',
      title: 'Process Optimization Best Practices',
      description: 'Video guide on implementing process improvements',
      url: '#',
      icon: <Video className="h-4 w-4" />
    },
    {
      type: 'Training',
      title: 'Data Analytics Fundamentals',
      description: 'Training course for team members',
      url: '#',
      icon: <BookOpen className="h-4 w-4" />
    }
  ]
}

export default function ActionPlanningPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAddAction, setShowAddAction] = React.useState(false)

  // Get assessment parameters
  const assessmentType = searchParams.get('type') || 'strategic'
  const organizationSize = searchParams.get('size') || ''
  const industry = searchParams.get('industry') || ''

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'warning'
      case 'pending': return 'info'
      default: return 'error'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error'
      case 'Medium': return 'warning'
      case 'Low': return 'success'
      default: return 'info'
    }
  }

  const filteredCategories = selectedCategory === 'all' 
    ? actionPlanData.categories 
    : actionPlanData.categories.filter(cat => cat.name.toLowerCase() === selectedCategory.toLowerCase())

  const allActions = filteredCategories.flatMap(cat => cat.actions)
  const filteredActions = selectedStatus === 'all' 
    ? allActions 
    : allActions.filter(action => action.status === selectedStatus)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium">Action Planning</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAddAction(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-7xl">
          {/* Action Plan Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <StatusBadge status="primary" className="mb-4">
                  30-Day Action Plan
                </StatusBadge>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Your Growth Action Plan
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Personalized 30-day action plan based on your assessment results. Track progress, manage tasks, and achieve your growth goals.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Plan
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Plan
                </Button>
              </div>
            </div>

            {/* Progress Overview */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Overall Progress</h2>
                <StatusBadge status="warning">{actionPlanData.overallProgress}% Complete</StatusBadge>
              </div>
              
              <Progress 
                value={actionPlanData.overallProgress} 
                showLabel 
                labelPosition="top"
                className="mb-4"
              />
              
              <Grid cols={4} gap={4} className="text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{actionPlanData.totalActions}</div>
                  <div className="text-sm text-muted-foreground">Total Actions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{actionPlanData.completedActions}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{actionPlanData.inProgressActions}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{actionPlanData.pendingActions}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </Grid>
            </Card>
          </motion.div>

          <Grid cols={3} gap={8} className="items-start">
            {/* Main Action Plan Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-2 space-y-8"
            >
              {/* Filters */}
              <Card className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Category:</label>
                    <Select
                      options={[
                        { value: 'all', label: 'All Categories' },
                        ...actionPlanData.categories.map(cat => ({ value: cat.name.toLowerCase(), label: cat.name }))
                      ]}
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Status:</label>
                    <Select
                      options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'pending', label: 'Pending' }
                      ]}
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                      size="sm"
                    />
                  </div>
                </div>
              </Card>

              {/* Action Categories */}
              <div className="space-y-6">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold">{category.name}</h3>
                          <StatusBadge status={getPriorityColor(category.priority) as any} size="sm">
                            {category.priority} Priority
                          </StatusBadge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{category.progress}%</div>
                            <div className="text-sm text-muted-foreground">Complete</div>
                          </div>
                          <Progress value={category.progress} size="sm" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {category.actions.map((action) => (
                          <div key={action.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  checked={action.status === 'completed'}
                                  onCheckedChange={() => console.log('Toggle action status')}
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium">{action.title}</h4>
                                  <p className="text-sm text-muted-foreground">{action.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <StatusBadge status={getStatusColor(action.status) as any} size="sm">
                                  {action.status.replace('-', ' ')}
                                </StatusBadge>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Due: {action.dueDate}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{action.assignee}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Flag className="h-4 w-4 text-muted-foreground" />
                                <StatusBadge status={getPriorityColor(action.priority) as any} size="xs">
                                  {action.priority}
                                </StatusBadge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Effort: {action.effort}</span>
                              </div>
                            </div>
                            
                            {action.notes && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                <div className="text-sm font-medium mb-1">Notes:</div>
                                <div className="text-sm text-muted-foreground">{action.notes}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Milestones */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Key Milestones</h2>
                
                <div className="space-y-4">
                  {actionPlanData.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{milestone.date}</div>
                        <StatusBadge status={getStatusColor(milestone.status) as any} size="sm">
                          {milestone.status.replace('-', ' ')}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Action
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Review
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Assign Tasks
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Update Progress
                  </Button>
                </div>
              </Card>

              {/* Resources */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                
                <div className="space-y-3">
                  {actionPlanData.resources.map((resource, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {resource.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{resource.title}</div>
                        <div className="text-xs text-muted-foreground">{resource.description}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Notifications */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800">Action Due Soon</div>
                    <div className="text-yellow-600">Technology audit due in 2 days</div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-800">Progress Update</div>
                    <div className="text-blue-600">Process mapping 75% complete</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-800">Milestone Achieved</div>
                    <div className="text-green-600">Technology assessment completed</div>
                  </div>
                </div>
              </Card>

              {/* Help & Support */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Need Help?
                </h3>
                
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Need help implementing your action plan or tracking progress?
                  </p>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Headphones className="h-4 w-4 mr-2" />
                    Schedule Coaching
                  </Button>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
