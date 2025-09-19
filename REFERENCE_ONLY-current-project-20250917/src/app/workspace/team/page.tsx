/**
 * OptimaliQ Team Workspace
 * Team management, assessment delegation, and collaboration workspace
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, UserPlus, Settings, Bell, Zap, Sparkles, Eye, Edit, Save, Share2,
  Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, BarChart3, Target,
  ChevronDown, ChevronUp, Loader2, Smile, ThumbsUp, ThumbsDown, RefreshCw,
  Volume2, VolumeX, Mic, MicOff, Video, Phone, MoreVertical, Search, Filter,
  Download, ExternalLink, MapPin, User, UserCheck, UserX, MessageSquare,
  Mail, Phone as PhoneIcon, Calendar as CalendarIcon, Building, Award,
  Star, Rocket, Gauge, Activity, PieChart, LineChart, AreaChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/data-display'
import { Select } from '@/components/ui/form'
import { TeamMember, TeamRole, Department, DEFAULT_ROLES } from '@/lib/team-management'
import { AssessmentAssignment, AssessmentTemplate, DEFAULT_TEMPLATES } from '@/lib/assessment-delegation'

// Team workspace data
const teamWorkspaceData = {
  organization: {
    id: 'org-001',
    name: 'OptimaliQ Solutions',
    totalMembers: 24,
    activeMembers: 22,
    departments: 5
  },
  members: [
    {
      id: '1',
      userId: 'user-1',
      email: 'sarah.johnson@optimaliq.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: DEFAULT_ROLES[1], // Admin
      department: 'Engineering',
      managerId: undefined,
      status: 'active',
      joinedAt: new Date('2024-01-15'),
      lastActiveAt: new Date(),
      permissions: DEFAULT_ROLES[1].permissions
    },
    {
      id: '2',
      userId: 'user-2',
      email: 'michael.chen@optimaliq.com',
      firstName: 'Michael',
      lastName: 'Chen',
      role: DEFAULT_ROLES[2], // Manager
      department: 'Product',
      managerId: '1',
      status: 'active',
      joinedAt: new Date('2024-02-01'),
      lastActiveAt: new Date(),
      permissions: DEFAULT_ROLES[2].permissions
    },
    {
      id: '3',
      userId: 'user-3',
      email: 'emily.rodriguez@optimaliq.com',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      role: DEFAULT_ROLES[3], // Member
      department: 'Design',
      managerId: '2',
      status: 'active',
      joinedAt: new Date('2024-02-15'),
      lastActiveAt: new Date(Date.now() - 3600000), // 1 hour ago
      permissions: DEFAULT_ROLES[3].permissions
    }
  ],
  departments: [
    {
      id: 'dept-1',
      name: 'Engineering',
      description: 'Software development and technical operations',
      managerId: '1',
      parentDepartmentId: undefined,
      members: ['1', '4', '5', '6'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'dept-2',
      name: 'Product',
      description: 'Product management and strategy',
      managerId: '2',
      parentDepartmentId: undefined,
      members: ['2', '7', '8'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'dept-3',
      name: 'Design',
      description: 'User experience and visual design',
      managerId: '3',
      parentDepartmentId: undefined,
      members: ['3', '9', '10'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    }
  ],
  assignments: [
    {
      id: 'assign-1',
      assessmentId: 'assess-1',
      assigneeId: '3',
      assignedBy: '2',
      assignedAt: new Date(Date.now() - 86400000), // 1 day ago
      dueDate: new Date(Date.now() + 86400000), // 1 day from now
      status: 'in-progress',
      priority: 'high',
      instructions: 'Please complete the team collaboration assessment to help us improve our processes.',
      estimatedDuration: 15,
      actualDuration: 8,
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      score: undefined,
      feedback: undefined
    },
    {
      id: 'assign-2',
      assessmentId: 'assess-2',
      assigneeId: '2',
      assignedBy: '1',
      assignedAt: new Date(Date.now() - 172800000), // 2 days ago
      dueDate: new Date(Date.now() + 172800000), // 2 days from now
      status: 'assigned',
      priority: 'medium',
      instructions: 'Leadership effectiveness assessment for Q4 review.',
      estimatedDuration: 20,
      actualDuration: undefined,
      startedAt: undefined,
      score: undefined,
      feedback: undefined
    }
  ],
  templates: DEFAULT_TEMPLATES,
  analytics: {
    teamPerformance: {
      averageScore: 78,
      completionRate: 85,
      averageCompletionTime: 12, // minutes
      improvementTrend: 12
    },
    departmentStats: [
      { name: 'Engineering', members: 4, avgScore: 82, completionRate: 90 },
      { name: 'Product', members: 3, avgScore: 75, completionRate: 85 },
      { name: 'Design', members: 3, avgScore: 79, completionRate: 80 }
    ],
    recentActivity: [
      { type: 'assessment_completed', user: 'Emily Rodriguez', assessment: 'Team Collaboration', time: '1 hour ago' },
      { type: 'assessment_assigned', user: 'Michael Chen', assessment: 'Leadership Effectiveness', time: '2 hours ago' },
      { type: 'member_joined', user: 'David Kim', department: 'Engineering', time: '1 day ago' }
    ]
  }
}

export default function TeamWorkspacePage() {
  const [selectedDepartment, setSelectedDepartment] = React.useState('all')
  const [selectedStatus, setSelectedStatus] = React.useState('all')
  const [showInviteModal, setShowInviteModal] = React.useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = React.useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'suspended': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'assigned': return 'text-yellow-600 bg-yellow-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'owner': return 'text-purple-600 bg-purple-100'
      case 'admin': return 'text-red-600 bg-red-100'
      case 'manager': return 'text-blue-600 bg-blue-100'
      case 'member': return 'text-green-600 bg-green-100'
      case 'viewer': return 'text-gray-600 bg-gray-100'
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
            <span className="text-sm text-muted-foreground">Team Workspace</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              <Sparkles className="h-3 w-3 mr-1" />
              {teamWorkspaceData.organization.activeMembers} Active
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
                  <h1 className="text-3xl font-bold mb-2">{teamWorkspaceData.organization.name} Workspace</h1>
                  <p className="text-muted-foreground">
                    Team management, assessment delegation, and collaboration hub
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={() => setShowAssignmentModal(true)}>
                    <Target className="h-4 w-4 mr-2" />
                    Assign Assessment
                  </Button>
                  <Button onClick={() => setShowInviteModal(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-4 gap-8">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="col-span-3 space-y-8"
              >
                {/* Team Overview */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Team Overview</h2>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                        options={[
                          { value: 'all', label: 'All Departments' },
                          ...teamWorkspaceData.departments.map(dept => ({
                            value: dept.id,
                            label: dept.name
                          }))
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{teamWorkspaceData.organization.totalMembers}</div>
                      <div className="text-sm text-muted-foreground">Total Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{teamWorkspaceData.organization.activeMembers}</div>
                      <div className="text-sm text-muted-foreground">Active Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{teamWorkspaceData.organization.departments}</div>
                      <div className="text-sm text-muted-foreground">Departments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{teamWorkspaceData.assignments.length}</div>
                      <div className="text-sm text-muted-foreground">Active Assignments</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {teamWorkspaceData.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{member.firstName} {member.lastName}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className={getRoleColor(member.role.id)}>
                                {member.role.name}
                              </Badge>
                              <Badge variant="secondary" className={getStatusColor(member.status)}>
                                {member.status}
                              </Badge>
                              {member.department && (
                                <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                                  {member.department}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Last active: {member.lastActiveAt?.toLocaleTimeString()}
                          </span>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Assessment Assignments */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Assessment Assignments</h2>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                        options={[
                          { value: 'all', label: 'All Status' },
                          { value: 'assigned', label: 'Assigned' },
                          { value: 'in-progress', label: 'In Progress' },
                          { value: 'completed', label: 'Completed' },
                          { value: 'overdue', label: 'Overdue' }
                        ]}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {teamWorkspaceData.assignments.map((assignment) => {
                      const assignee = teamWorkspaceData.members.find(m => m.id === assignment.assigneeId)
                      const template = teamWorkspaceData.templates.find(t => t.id === assignment.assessmentId)
                      
                      return (
                        <div key={assignment.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-medium">{template?.name || 'Assessment'}</h3>
                                <Badge variant="secondary" className={getAssignmentStatusColor(assignment.status)}>
                                  {assignment.status}
                                </Badge>
                                <Badge variant="secondary" className={getPriorityColor(assignment.priority)}>
                                  {assignment.priority}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                                <div>
                                  <span className="font-medium">Assignee:</span> {assignee?.firstName} {assignee?.lastName}
                                </div>
                                <div>
                                  <span className="font-medium">Due:</span> {assignment.dueDate.toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span> {assignment.estimatedDuration} min
                                </div>
                              </div>

                              {assignment.instructions && (
                                <p className="text-sm text-muted-foreground mb-3">{assignment.instructions}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {assignment.startedAt && (
                                <span className="text-sm text-muted-foreground">
                                  Started: {assignment.startedAt.toLocaleTimeString()}
                                </span>
                              )}
                              {assignment.actualDuration && (
                                <span className="text-sm text-muted-foreground">
                                  Time spent: {assignment.actualDuration} min
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Team Analytics */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Team Performance Analytics</h2>
                  
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{teamWorkspaceData.analytics.teamPerformance.averageScore}%</div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{teamWorkspaceData.analytics.teamPerformance.completionRate}%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{teamWorkspaceData.analytics.teamPerformance.averageCompletionTime}m</div>
                      <div className="text-sm text-muted-foreground">Avg. Completion Time</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Department Performance</h3>
                    {teamWorkspaceData.analytics.departmentStats.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{dept.name}</h4>
                            <p className="text-sm text-muted-foreground">{dept.members} members</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">{dept.avgScore}%</div>
                            <div className="text-xs text-muted-foreground">Avg Score</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{dept.completionRate}%</div>
                            <div className="text-xs text-muted-foreground">Completion</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Create Assessment
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Workspace Settings
                    </Button>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {teamWorkspaceData.analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2 border rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Activity className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.type === 'assessment_completed' && `Completed ${activity.assessment}`}
                            {activity.type === 'assessment_assigned' && `Assigned ${activity.assessment}`}
                            {activity.type === 'member_joined' && `Joined ${activity.department}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Department Structure */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Departments</h3>
                  <div className="space-y-3">
                    {teamWorkspaceData.departments.map((dept) => (
                      <div key={dept.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{dept.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {dept.members.length} members
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{dept.description}</p>
                      </div>
                    ))}
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
