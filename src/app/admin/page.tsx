/**
 * OptimaliQ Admin Panel
 * System administration, user management, and system monitoring
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, Users, Settings, Database, Activity,
  AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp,
  TrendingDown, Eye, Edit, Trash, Plus, Search, Filter,
  Download, Upload, RefreshCw, Globe, Building, Star,
  Award, Rocket, Lightbulb, Gauge, Target, User, Lock,
  Unlock, Key, Database as DatabaseIcon, Cloud, Server,
  HardDrive, Cpu, Memory, Network, Zap, Bell, HelpCircle,
  MessageSquare, FileText, Calendar, Clock as ClockIcon,
  UserCheck, UserX, UserPlus, UserMinus, Settings as SettingsIcon,
  Cog, Wrench, Tool, Hammer, Wrench as WrenchIcon, Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { MetricCard } from '@/components/ui/charts'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'

// Admin data
const adminData = {
  systemStats: {
    totalUsers: 1247,
    activeUsers: 892,
    totalAssessments: 3456,
    systemUptime: 99.8,
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 45,
    networkTraffic: '2.3 GB'
  },
  recentActivity: [
    {
      id: 1,
      type: 'user_login',
      description: 'User login from 192.168.1.100',
      user: 'jennifer.walsh@healthforward.org',
      timestamp: '2024-08-25 15:30:22',
      severity: 'info',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0'
    },
    {
      id: 2,
      type: 'assessment_created',
      description: 'New assessment "Q4 Performance Review" created',
      user: 'michael.chen@healthforward.org',
      timestamp: '2024-08-25 15:25:18',
      severity: 'info',
      assessmentId: 'ASS-2024-001',
      assessmentName: 'Q4 Performance Review'
    },
    {
      id: 3,
      type: 'system_warning',
      description: 'High memory usage detected (85%)',
      user: 'system',
      timestamp: '2024-08-25 15:20:15',
      severity: 'warning',
      metric: 'memory',
      value: '85%'
    },
    {
      id: 4,
      type: 'user_registration',
      description: 'New user account created',
      user: 'sarah.johnson@healthforward.org',
      timestamp: '2024-08-25 15:15:42',
      severity: 'info',
      accountType: 'standard'
    }
  ],
  systemAlerts: [
    {
      id: 1,
      title: 'High CPU Usage',
      description: 'CPU usage has exceeded 80% for the last 5 minutes',
      severity: 'warning',
      timestamp: '2024-08-25 15:30:00',
      status: 'active',
      metric: 'cpu',
      value: '82%'
    },
    {
      id: 2,
      title: 'Database Connection Pool',
      description: 'Database connection pool is at 90% capacity',
      severity: 'warning',
      timestamp: '2024-08-25 15:25:00',
      status: 'active',
      metric: 'database',
      value: '90%'
    },
    {
      id: 3,
      title: 'Disk Space Low',
      description: 'Available disk space is below 10%',
      severity: 'critical',
      timestamp: '2024-08-25 15:20:00',
      status: 'resolved',
      metric: 'disk',
      value: '8%'
    }
  ],
  userManagement: {
    pendingApprovals: 12,
    suspendedUsers: 3,
    newRegistrations: 8,
    totalOrganizations: 45
  }
}

export default function AdminPage() {
  const [selectedSeverity, setSelectedSeverity] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'info': return 'text-blue-600 bg-blue-100'
      case 'success': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'info': return <Info className="h-4 w-4" />
      case 'success': return <CheckCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_login': return <UserCheck className="h-4 w-4" />
      case 'assessment_created': return <FileText className="h-4 w-4" />
      case 'system_warning': return <AlertTriangle className="h-4 w-4" />
      case 'user_registration': return <UserPlus className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const filteredActivity = adminData.recentActivity.filter(activity => {
    const matchesSeverity = selectedSeverity === 'all' || activity.severity === selectedSeverity
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeverity && matchesSearch
  })

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
            <span className="text-sm text-muted-foreground">Admin Panel</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                <p className="text-muted-foreground">
                  System administration and monitoring dashboard
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </div>
          </motion.div>

          {/* System Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Grid cols={4} gap={6}>
              <MetricCard
                title="Total Users"
                value={adminData.systemStats.totalUsers.toLocaleString()}
                subtitle="Registered accounts"
                icon={<Users className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="System Uptime"
                value={`${adminData.systemStats.systemUptime}%`}
                subtitle="Last 30 days"
                icon={<Activity className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="Active Users"
                value={adminData.systemStats.activeUsers.toLocaleString()}
                subtitle="Currently online"
                icon={<UserCheck className="h-5 w-5" />}
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
              <MetricCard
                title="Total Assessments"
                value={adminData.systemStats.totalAssessments.toLocaleString()}
                subtitle="Created"
                icon={<FileText className="h-5 w-5" />}
                className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
              />
            </Grid>
          </motion.div>

          {/* System Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">System Resources</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm text-muted-foreground">{adminData.systemStats.cpuUsage}%</span>
                    </div>
                    <Progress value={adminData.systemStats.cpuUsage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm text-muted-foreground">{adminData.systemStats.memoryUsage}%</span>
                    </div>
                    <Progress value={adminData.systemStats.memoryUsage} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Disk Usage</span>
                      <span className="text-sm text-muted-foreground">{adminData.systemStats.diskUsage}%</span>
                    </div>
                    <Progress value={adminData.systemStats.diskUsage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Network Traffic</span>
                      <span className="text-sm text-muted-foreground">{adminData.systemStats.networkTraffic}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* System Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">System Alerts</h2>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {adminData.systemAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 rounded-lg ${getSeverityColor(alert.severity)} flex items-center justify-center`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div>
                          <h3 className="font-medium">{alert.title}</h3>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="secondary" className={
                          alert.status === 'active' 
                            ? 'text-red-600 bg-red-100' 
                            : 'text-green-600 bg-green-100'
                        }>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Timestamp: {alert.timestamp}</span>
                      <span>{alert.metric}: {alert.value}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">User Management</h2>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-medium">Pending Approvals</h3>
                  <p className="text-2xl font-bold text-blue-600">{adminData.userManagement.pendingApprovals}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Review
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                    <UserX className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="font-medium">Suspended Users</h3>
                  <p className="text-2xl font-bold text-red-600">{adminData.userManagement.suspendedUsers}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-medium">New Registrations</h3>
                  <p className="text-2xl font-bold text-green-600">{adminData.userManagement.newRegistrations}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Review
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                    <Building className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-medium">Organizations</h3>
                  <p className="text-2xl font-bold text-purple-600">{adminData.userManagement.totalOrganizations}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <div className="flex items-center space-x-3">
                  <Input
                    placeholder="Search activity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Select
                    value={selectedSeverity}
                    onValueChange={setSelectedSeverity}
                    options={[
                      { value: 'all', label: 'All Severities' },
                      { value: 'critical', label: 'Critical' },
                      { value: 'warning', label: 'Warning' },
                      { value: 'info', label: 'Info' },
                      { value: 'success', label: 'Success' }
                    ]}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredActivity.map((activity) => (
                  <div key={activity.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{activity.description}</h3>
                          <p className="text-sm text-muted-foreground">User: {activity.user}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getSeverityColor(activity.severity)}>
                          {activity.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>IP: {activity.ipAddress}</span>
                      <span>Agent: {activity.userAgent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>User Management</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Database className="h-6 w-6" />
                  <span>Database</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Server className="h-6 w-6" />
                  <span>System Status</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Shield className="h-6 w-6" />
                  <span>Security</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
