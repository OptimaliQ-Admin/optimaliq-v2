'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TeamOverview from '@/components/team-management/team-overview';
import RoleManagement from '@/components/team-management/role-management';
import PerformanceTracking from '@/components/team-management/performance-tracking';
import TeamAnalytics from '@/components/team-management/team-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  BarChart3, 
  Activity,
  Plus,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Share2,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Clock,
  Calendar,
  Star,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Zap,
  Brain,
  Lightbulb,
  Shield,
  Crown,
  UserX,
  UserPlus,
  UserMinus,
  User,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  UserPlus as UserPlusIcon,
  UserMinus as UserMinusIcon,
  User as UserEditIcon,
  Users as UsersIcon,
  BarChart3 as BarChart3Icon,
  Activity as ActivityIcon,
  Plus as PlusIcon,
  Settings as SettingsIcon,
  Bell as BellIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Share2 as Share2Icon,
  MoreHorizontal as MoreHorizontalIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  MessageSquare as MessageSquareIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Globe as GlobeIcon,
  Building2 as Building2Icon,
  Zap as ZapIcon,
  Brain as BrainIcon,
  Lightbulb as LightbulbIcon,
  Shield as ShieldIcon,
  Crown as CrownIcon
} from 'lucide-react';

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const teamStats = {
    totalMembers: 24,
    activeMembers: 22,
    newMembers: 3,
    pendingInvites: 2,
    averagePerformance: 87,
    teamSatisfaction: 92,
    collaborationScore: 89,
    productivityIndex: 85
  };

  const recentActivity = [
    {
      id: 1,
      type: 'member_joined',
      user: 'Sarah Chen',
      role: 'Operations Manager',
      timestamp: '2 hours ago',
      icon: <UserPlus className="h-4 w-4 text-green-600" />
    },
    {
      id: 2,
      type: 'performance_review',
      user: 'Michael Rodriguez',
      role: 'Senior Developer',
      score: 94,
      timestamp: '4 hours ago',
      icon: <BarChart3 className="h-4 w-4 text-blue-600" />
    },
    {
      id: 3,
      type: 'role_updated',
      user: 'Emily Johnson',
      role: 'Team Lead',
      previousRole: 'Senior Analyst',
      timestamp: '1 day ago',
      icon: <UserEditIcon className="h-4 w-4 text-purple-600" />
    },
    {
      id: 4,
      type: 'goal_achieved',
      user: 'David Kim',
      role: 'Marketing Specialist',
      achievement: 'Q3 Target Met',
      timestamp: '2 days ago',
      icon: <Award className="h-4 w-4 text-yellow-600" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your team, track performance, and optimize collaboration
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Team Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{teamStats.newMembers} this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.activeMembers}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((teamStats.activeMembers / teamStats.totalMembers) * 100)}% active
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.averagePerformance}%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.teamSatisfaction}%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Heart className="h-3 w-3 mr-1" />
                    Excellent rating
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TeamOverview />
              </div>
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                              <Badge variant="outline" className="text-xs">
                                {activity.role}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {activity.type === 'member_joined' && 'Joined the team'}
                              {activity.type === 'performance_review' && `Performance review: ${activity.score}%`}
                              {activity.type === 'role_updated' && `Role updated from ${activity.previousRole}`}
                              {activity.type === 'goal_achieved' && `Achieved: ${activity.achievement}`}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Team Member
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <UserEditIcon className="h-4 w-4 mr-2" />
                        Update Roles
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Run Performance Review
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Team Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceTracking />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <TeamAnalytics />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}