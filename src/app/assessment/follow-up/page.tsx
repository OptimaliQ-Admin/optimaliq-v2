/**
 * OptimaliQ Assessment Follow-up Reminders Page
 * Automated follow-up system with scheduling, notifications, and progress tracking
 */

'use client'

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
  Headphones,
  Send,
  Phone,
  Smartphone,
  AtSign,
  Globe,
  Repeat,
  Timer,
  Archive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { LineChart, PieChart, BarChart as BarChartComponent, MetricCard } from '@/components/ui/charts'
import { Select, Checkbox, Input } from '@/components/ui/form'

// Sample Follow-up Data
const followUpData = {
  totalReminders: 12,
  activeReminders: 8,
  completedReminders: 4,
  overdueReminders: 2,
  upcomingReminders: 6,
  reminderTypes: [
    { type: 'Assessment Review', count: 4, color: '#3b82f6' },
    { type: 'Progress Check', count: 3, color: '#10b981' },
    { type: 'Action Plan Update', count: 3, color: '#f59e0b' },
    { type: 'Team Sync', count: 2, color: '#8b5cf6' }
  ],
  reminders: [
    {
      id: 1,
      title: '30-Day Assessment Follow-up',
      description: 'Review progress on technology modernization goals',
      type: 'Assessment Review',
      status: 'pending',
      dueDate: '2024-09-30',
      scheduledDate: '2024-09-30',
      frequency: 'Monthly',
      priority: 'High',
      recipient: 'john.smith@example.com',
      method: 'Email',
      template: 'Assessment Review Template',
      lastSent: null,
      nextSend: '2024-09-30',
      category: 'Assessment',
      tags: ['technology', 'modernization', 'high-priority']
    },
    {
      id: 2,
      title: 'Action Plan Progress Check',
      description: 'Check progress on process optimization initiatives',
      type: 'Progress Check',
      status: 'active',
      dueDate: '2024-09-25',
      scheduledDate: '2024-09-25',
      frequency: 'Weekly',
      priority: 'Medium',
      recipient: 'lisa.chen@example.com',
      method: 'Email + SMS',
      template: 'Progress Check Template',
      lastSent: '2024-09-18',
      nextSend: '2024-09-25',
      category: 'Action Plan',
      tags: ['process', 'optimization', 'weekly']
    },
    {
      id: 3,
      title: 'Team Performance Review',
      description: 'Quarterly team performance and culture assessment',
      type: 'Team Sync',
      status: 'completed',
      dueDate: '2024-09-15',
      scheduledDate: '2024-09-15',
      frequency: 'Quarterly',
      priority: 'High',
      recipient: 'team-leads@example.com',
      method: 'Email',
      template: 'Team Review Template',
      lastSent: '2024-09-15',
      nextSend: '2024-12-15',
      category: 'Team',
      tags: ['team', 'performance', 'quarterly']
    },
    {
      id: 4,
      title: 'Growth Strategy Update',
      description: 'Review and update growth objectives and KPIs',
      type: 'Action Plan Update',
      status: 'overdue',
      dueDate: '2024-09-20',
      scheduledDate: '2024-09-20',
      frequency: 'Bi-weekly',
      priority: 'High',
      recipient: 'sarah.johnson@example.com',
      method: 'Email',
      template: 'Strategy Update Template',
      lastSent: '2024-09-06',
      nextSend: '2024-09-20',
      category: 'Growth',
      tags: ['growth', 'strategy', 'overdue']
    }
  ],
  templates: [
    {
      id: 1,
      name: 'Assessment Review Template',
      description: 'Standard template for assessment follow-ups',
      type: 'Assessment Review',
      subject: 'Your Assessment Results - Time for Review',
      content: 'Hi {name}, it\'s time to review your assessment results and progress...',
      variables: ['name', 'assessment_type', 'score', 'recommendations']
    },
    {
      id: 2,
      name: 'Progress Check Template',
      description: 'Template for checking action plan progress',
      type: 'Progress Check',
      subject: 'Action Plan Progress Check - Week {week}',
      content: 'Hi {name}, how is your progress on the action plan items?...',
      variables: ['name', 'week', 'completed_actions', 'pending_actions']
    },
    {
      id: 3,
      name: 'Team Review Template',
      description: 'Template for team performance reviews',
      type: 'Team Sync',
      subject: 'Team Performance Review - Q{quarter}',
      content: 'Hi team, it\'s time for our quarterly performance review...',
      variables: ['quarter', 'team_name', 'performance_metrics', 'goals']
    }
  ],
  analytics: {
    openRate: 85,
    clickRate: 67,
    responseRate: 45,
    completionRate: 78,
    trendData: [
      { month: 'Jan', sent: 15, opened: 13, clicked: 10, responded: 7 },
      { month: 'Feb', sent: 18, opened: 16, clicked: 12, responded: 8 },
      { month: 'Mar', sent: 22, opened: 19, clicked: 15, responded: 10 },
      { month: 'Apr', sent: 20, opened: 17, clicked: 13, responded: 9 },
      { month: 'May', sent: 25, opened: 21, clicked: 16, responded: 11 },
      { month: 'Jun', sent: 28, opened: 24, clicked: 19, responded: 13 }
    ]
  }
}

export default function FollowUpRemindersPage() {
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAddReminder, setShowAddReminder] = React.useState(false)

  // Get assessment parameters
  const assessmentType = searchParams.get('type') || 'strategic'
  const organizationSize = searchParams.get('size') || ''
  const industry = searchParams.get('industry') || ''

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'active': return 'info'
      case 'pending': return 'warning'
      case 'overdue': return 'error'
      default: return 'info'
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

  const getMethodIcon = (method: string) => {
    if (method.includes('Email')) return <Mail className="h-4 w-4" />
    if (method.includes('SMS')) return <Smartphone className="h-4 w-4" />
    if (method.includes('Phone')) return <Phone className="h-4 w-4" />
    return <Bell className="h-4 w-4" />
  }

  const filteredReminders = followUpData.reminders.filter(reminder => {
    const typeMatch = selectedType === 'all' || reminder.type.toLowerCase() === selectedType.toLowerCase()
    const statusMatch = selectedStatus === 'all' || reminder.status === selectedStatus
    return typeMatch && statusMatch
  })

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
            <span className="text-sm font-medium">Follow-up Reminders</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAddReminder(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-7xl">
          {/* Follow-up Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <StatusBadge status="primary" className="mb-4">
                  Automated Follow-up System
                </StatusBadge>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Follow-up Reminders
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Automated follow-up system to track progress, schedule reviews, and ensure continuous improvement of your action plans.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <Grid cols={4} gap={6} className="mb-8">
              <MetricCard
                title="Total Reminders"
                value={followUpData.totalReminders}
                change={{ value: 3, type: 'increase', period: 'vs last month' }}
                icon={<Bell className="h-6 w-6" />}
              />
              <MetricCard
                title="Active Reminders"
                value={followUpData.activeReminders}
                change={{ value: 2, type: 'increase', period: 'vs last month' }}
                icon={<Clock className="h-6 w-6" />}
              />
              <MetricCard
                title="Completed"
                value={followUpData.completedReminders}
                change={{ value: 1, type: 'increase', period: 'vs last month' }}
                icon={<CheckCircle className="h-6 w-6" />}
              />
              <MetricCard
                title="Overdue"
                value={followUpData.overdueReminders}
                change={{ value: -1, type: 'decrease', period: 'vs last month' }}
                icon={<AlertTriangle className="h-6 w-6" />}
                trend="down"
              />
            </Grid>
          </motion.div>

          <Grid cols={3} gap={8} className="items-start">
            {/* Main Follow-up Content */}
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
                    <label className="text-sm font-medium">Type:</label>
                    <Select
                      options={[
                        { value: 'all', label: 'All Types' },
                        ...followUpData.reminderTypes.map(type => ({ value: type.type.toLowerCase(), label: type.type }))
                      ]}
                      value={selectedType}
                      onValueChange={setSelectedType}
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Status:</label>
                    <Select
                      options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'active', label: 'Active' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'overdue', label: 'Overdue' }
                      ]}
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                      size="sm"
                    />
                  </div>
                </div>
              </Card>

              {/* Reminders List */}
              <div className="space-y-4">
                {filteredReminders.map((reminder, index) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{reminder.title}</h3>
                            <StatusBadge status={getStatusColor(reminder.status) as any} size="sm">
                              {reminder.status}
                            </StatusBadge>
                            <StatusBadge status={getPriorityColor(reminder.priority) as any} size="sm">
                              {reminder.priority}
                            </StatusBadge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{reminder.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Due: {reminder.dueDate}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Repeat className="h-4 w-4 text-muted-foreground" />
                              <span>{reminder.frequency}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getMethodIcon(reminder.method)}
                              <span>{reminder.method}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <AtSign className="h-4 w-4 text-muted-foreground" />
                              <span>{reminder.recipient}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {reminder.lastSent && (
                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                          <span>Last sent: {reminder.lastSent}</span>
                          <span>Next: {reminder.nextSend}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {reminder.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-muted rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Analytics Section */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Follow-up Analytics</h2>
                
                <Grid cols={4} gap={6} className="mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{followUpData.analytics.openRate}%</div>
                    <div className="text-sm text-muted-foreground">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{followUpData.analytics.clickRate}%</div>
                    <div className="text-sm text-muted-foreground">Click Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{followUpData.analytics.responseRate}%</div>
                    <div className="text-sm text-muted-foreground">Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{followUpData.analytics.completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                </Grid>

                <div className="h-80">
                  <LineChart
                    data={followUpData.analytics.trendData}
                    lines={[
                      { key: 'sent', color: '#3b82f6', strokeWidth: 2, name: 'Sent' },
                      { key: 'opened', color: '#10b981', strokeWidth: 2, name: 'Opened' },
                      { key: 'clicked', color: '#f59e0b', strokeWidth: 2, name: 'Clicked' },
                      { key: 'responded', color: '#8b5cf6', strokeWidth: 2, name: 'Responded' }
                    ]}
                    showGrid={true}
                    showTooltip={true}
                    showLegend={true}
                  />
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
              {/* Reminder Types */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Reminder Types</h3>
                
                <div className="space-y-3">
                  {followUpData.reminderTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                        <span className="text-sm font-medium">{type.type}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{type.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Reminder
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Batch
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Templates
                  </Button>
                </div>
              </Card>

              {/* Templates */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
                
                <div className="space-y-3">
                  {followUpData.templates.map((template, index) => (
                    <div key={template.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">{template.name}</h4>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                      <div className="text-xs text-muted-foreground">
                        Variables: {template.variables.length}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <Checkbox checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Notifications</span>
                    <Checkbox checked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-send Reminders</span>
                    <Checkbox checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Digest</span>
                    <Checkbox checked={true} />
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
                    Need help setting up automated follow-ups or creating custom templates?
                  </p>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Documentation
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
