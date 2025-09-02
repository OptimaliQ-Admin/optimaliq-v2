/**
 * OptimaliQ Team Management Page
 * Comprehensive team management with member roles, permissions, and analytics
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Calendar,
  Target,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Award,
  Zap,
  Lightbulb,
  Rocket,
  Activity,
  PieChart,
  LineChart,
  AreaChart,
  Gauge,
  Target as TargetIcon,
  CheckSquare,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  User,
  Building,
  Globe,
  Settings,
  Bell,
  HelpCircle,
  MessageSquare,
  FileText,
  Database,
  Cloud,
  Shield,
  Key,
  Lock,
  Unlock,
  ArrowRight,
  ArrowUpRight,
  Clock as ClockIcon2,
  Users as UsersIcon,
  Target as TargetIcon2,
  CheckCircle as CheckCircleIcon,
  AlertCircle,
  Info,
  ExternalLink,
  Crown,
  Shield as ShieldIcon,
  Key as KeyIcon,
  Database as DatabaseIcon,
  Server,
  Cloud as CloudIcon,
  Network,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Camera,
  Video,
  Music,
  Headphones,
  Speaker,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Mail,
  Send,
  Inbox,
  Archive,
  Trash,
  Folder,
  FolderOpen,
  File,
  FileText as FileTextIcon,
  Image,
  Video as VideoIcon,
  Audio,
  CreditCard,
  Code,
  Terminal,
  Command,
  Power,
  PowerOff,
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Bluetooth,
  BluetoothOff,
  Radio,
  RadioOff,
  Satellite,
  SatelliteOff,
  Navigation,
  NavigationOff,
  Compass,
  Map,
  MapPin,
  MapPinOff,
  Navigation2,
  Navigation2Off,
  Compass as CompassIcon,
  Map as MapIcon,
  MapPin as MapPinIcon,
  MapPinOff as MapPinOffIcon,
  Navigation as NavigationIcon,
  NavigationOff as NavigationOffIcon,
  Navigation2 as Navigation2Icon,
  Navigation2Off as Navigation2OffIcon,
  Compass as CompassIcon2,
  Map as MapIcon2,
  MapPin as MapPinIcon2,
  MapPinOff as MapPinOffIcon2,
  Navigation as NavigationIcon2,
  NavigationOff as NavigationOffIcon2,
  Navigation2 as Navigation2Icon2,
  Navigation2Off as Navigation2OffIcon2,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users as UsersIcon2,
  User as UserIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  UserPlus as UserPlusIcon,
  UserMinus as UserMinusIcon,
  Mail as MailIcon,
  MessageCircle,
  Phone as PhoneIcon,
  Video as VideoIcon2,
  Calendar as CalendarIcon2,
  Clock as ClockIcon3,
  Globe as GlobeIcon,
  Building as BuildingIcon,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  Star as StarIcon,
  Award as AwardIcon,
  Trophy,
  Medal,
  Ribbon,
  Certificate,
  Diploma,
  Scroll,
  Book,
  BookOpen,
  Library,
  School,
  University,
  College,
  Academy,
  Institute,
  Organization,
  Company,
  Corporation,
  Partnership
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

// Team data
const teamData = {
  stats: {
    totalMembers: 24,
    activeMembers: 22,
    pendingInvites: 3,
    averageScore: 78,
    improvement: '+12%',
    teamGrowth: '+8%'
  },
  members: [
    {
      id: 1,
      name: 'Jennifer Walsh',
      email: 'jennifer.walsh@healthforward.org',
      role: 'CEO & Executive Director',
      department: 'Leadership',
      status: 'active',
      avatar: '/avatars/jennifer.jpg',
      lastActive: '2 hours ago',
      assessmentScore: 82,
      completedAssessments: 8,
      pendingTasks: 3,
      joinDate: '2020-03-15',
      permissions: ['admin', 'assessments', 'reports', 'team_management'],
      icon: <Crown className="h-5 w-5" />
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah.chen@healthforward.org',
      role: 'Operations Manager',
      department: 'Operations',
      status: 'active',
      avatar: '/avatars/sarah.jpg',
      lastActive: '4 hours ago',
      assessmentScore: 76,
      completedAssessments: 6,
      pendingTasks: 5,
      joinDate: '2021-06-20',
      permissions: ['assessments', 'reports', 'team_management'],
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@healthforward.org',
      role: 'Team Lead',
      department: 'Team Management',
      status: 'active',
      avatar: '/avatars/michael.jpg',
      lastActive: '1 day ago',
      assessmentScore: 79,
      completedAssessments: 7,
      pendingTasks: 2,
      joinDate: '2021-09-10',
      permissions: ['assessments', 'reports'],
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 4,
      name: 'Emily Johnson',
      email: 'emily.johnson@healthforward.org',
      role: 'Customer Success Manager',
      department: 'Customer Success',
      status: 'active',
      avatar: '/avatars/emily.jpg',
      lastActive: '6 hours ago',
      assessmentScore: 81,
      completedAssessments: 5,
      pendingTasks: 4,
      joinDate: '2022-01-15',
      permissions: ['assessments'],
      icon: <Star className="h-5 w-5" />
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@healthforward.org',
      role: 'Financial Analyst',
      department: 'Finance',
      status: 'pending',
      avatar: '/avatars/david.jpg',
      lastActive: 'Never',
      assessmentScore: null,
      completedAssessments: 0,
      pendingTasks: 0,
      joinDate: '2024-09-01',
      permissions: ['assessments'],
      icon: <Building className="h-5 w-5" />
    }
  ],
  roles: [
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access and control',
      permissions: ['admin', 'assessments', 'reports', 'team_management', 'billing'],
      memberCount: 2,
      color: 'bg-red-500'
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Team and assessment management',
      permissions: ['assessments', 'reports', 'team_management'],
      memberCount: 3,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Analyst',
      description: 'Assessment and reporting access',
      permissions: ['assessments', 'reports'],
      memberCount: 8,
      color: 'bg-green-500'
    },
    {
      id: 4,
      name: 'Member',
      description: 'Basic assessment access',
      permissions: ['assessments'],
      memberCount: 11,
      color: 'bg-gray-500'
    }
  ],
  departments: [
    'All',
    'Leadership',
    'Operations',
    'Team Management',
    'Customer Success',
    'Finance',
    'Marketing',
    'Technology',
    'Human Resources',
    'Compliance'
  ],
  pendingInvites: [
    {
      id: 1,
      email: 'david.kim@healthforward.org',
      role: 'Financial Analyst',
      department: 'Finance',
      invitedBy: 'Jennifer Walsh',
      invitedDate: '2024-09-01',
      expiresDate: '2024-09-08'
    },
    {
      id: 2,
      email: 'lisa.wang@healthforward.org',
      role: 'Marketing Specialist',
      department: 'Marketing',
      invitedBy: 'Sarah Chen',
      invitedDate: '2024-09-02',
      expiresDate: '2024-09-09'
    },
    {
      id: 3,
      email: 'james.brown@healthforward.org',
      role: 'IT Support',
      department: 'Technology',
      invitedBy: 'Michael Rodriguez',
      invitedDate: '2024-09-03',
      expiresDate: '2024-09-10'
    }
  ]
}

export default function TeamManagementPage() {
  const [selectedDepartment, setSelectedDepartment] = React.useState('All')
  const [selectedRole, setSelectedRole] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState('grid')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'suspended': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CEO & Executive Director': return 'text-red-600 bg-red-100'
      case 'Operations Manager': return 'text-blue-600 bg-blue-100'
      case 'Team Lead': return 'text-green-600 bg-green-100'
      case 'Customer Success Manager': return 'text-purple-600 bg-purple-100'
      case 'Financial Analyst': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'admin': return <Crown className="h-4 w-4" />
      case 'assessments': return <Target className="h-4 w-4" />
      case 'reports': return <BarChart3 className="h-4 w-4" />
      case 'team_management': return <Users className="h-4 w-4" />
      case 'billing': return <CreditCard className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const filteredMembers = teamData.members.filter(member => 
    (selectedDepartment === 'All' || member.department === selectedDepartment) &&
    (selectedRole === 'All' || member.role === selectedRole)
  )

  const filteredRoles = teamData.roles.filter(role => 
    selectedRole === 'All' || role.name === selectedRole
  )

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
            <span className="text-sm text-muted-foreground">Team Management</span>
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
                <h1 className="text-3xl font-bold mb-2">Team Management</h1>
                <p className="text-muted-foreground">
                  Manage team members, roles, and permissions
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Team
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Grid cols={4} gap={6}>
              <MetricCard
                title="Total Members"
                value={teamData.stats.totalMembers}
                subtitle="Team size"
                icon={<Users className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Active Members"
                value={teamData.stats.activeMembers}
                subtitle={`${Math.round((teamData.stats.activeMembers / teamData.stats.totalMembers) * 100)}%`}
                icon={<UserCheck className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="Pending Invites"
                value={teamData.stats.pendingInvites}
                subtitle="Awaiting response"
                icon={<Clock className="h-5 w-5" />}
                className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20"
              />
              <MetricCard
                title="Average Score"
                value={`${teamData.stats.averageScore}`}
                subtitle={teamData.stats.improvement}
                icon={<BarChart3 className="h-5 w-5" />}
                trend="up"
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
            </Grid>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Team Members</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Department and Role Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Department:</span>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                    options={teamData.departments.map(dept => ({ value: dept, label: dept }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Role:</span>
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                    options={[
                      { value: 'All', label: 'All Roles' },
                      ...teamData.roles.map(role => ({ value: role.name, label: role.name }))
                    ]}
                  />
                </div>
              </div>

              {/* Members Grid */}
              <Grid cols={3} gap={6}>
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <Badge variant="secondary" className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                          <div className="text-sm text-muted-foreground">{member.department}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Assessment Score:</span>
                            <span className="font-medium">{member.assessmentScore || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Completed:</span>
                            <span className="font-medium">{member.completedAssessments}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Pending Tasks:</span>
                            <span className="font-medium">{member.pendingTasks}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </Grid>
            </Card>
          </motion.div>

          {/* Roles and Permissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Roles & Permissions</h2>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Role
                </Button>
              </div>

              <Grid cols={2} gap={6}>
                {teamData.roles.map((role) => (
                  <Card key={role.id} className="p-6 border-2 border-muted hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 ${role.color} text-white rounded-lg`}>
                        <Shield className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{role.memberCount} members</div>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{role.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{role.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium">Permissions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-1 px-2 py-1 bg-muted rounded text-xs">
                            {getPermissionIcon(permission)}
                            <span>{permission.replace('_', ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Role
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-1" />
                        Manage Members
                      </Button>
                    </div>
                  </Card>
                ))}
              </Grid>
            </Card>
          </motion.div>

          {/* Pending Invites */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Pending Invites</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {teamData.pendingInvites.map((invite) => (
                  <div key={invite.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{invite.email}</h3>
                        <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">
                          Pending
                        </Badge>
                        <span className="text-sm text-muted-foreground">{invite.role}</span>
                        <span className="text-sm text-muted-foreground">{invite.department}</span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Invited by {invite.invitedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Invited {invite.invitedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>Expires {invite.expiresDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Resend
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <Grid cols={4} gap={4}>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <UserPlus className="h-6 w-6" />
                  <span>Invite Member</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Shield className="h-6 w-6" />
                  <span>Create Role</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Team Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Download className="h-6 w-6" />
                  <span>Export Data</span>
                </Button>
              </Grid>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
