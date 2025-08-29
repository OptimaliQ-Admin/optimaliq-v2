'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  UserPlus, 
  Mail, 
  MoreHorizontal,
  Search,
  Filter,
  Crown,
  Shield,
  User,
  Eye,
  Settings,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

// Mock team data
const mockTeamData = {
  members: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Owner',
      department: 'Leadership',
      status: 'active',
      lastActive: '2 hours ago',
      assessmentsCompleted: 12,
      averageScore: 8.7,
      joinedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Manager',
      department: 'Operations',
      status: 'active',
      lastActive: '1 day ago',
      assessmentsCompleted: 8,
      averageScore: 7.9,
      joinedDate: '2024-02-01'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      role: 'Member',
      department: 'Marketing',
      status: 'pending',
      lastActive: 'Never',
      assessmentsCompleted: 0,
      averageScore: 0,
      joinedDate: '2024-03-10'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@company.com',
      role: 'Member',
      department: 'Technology',
      status: 'active',
      lastActive: '3 hours ago',
      assessmentsCompleted: 15,
      averageScore: 9.1,
      joinedDate: '2024-01-20'
    }
  ],
  pendingInvitations: [
    {
      id: '1',
      email: 'alex.thompson@company.com',
      role: 'Member',
      department: 'Sales',
      sentDate: '2024-03-12',
      status: 'pending'
    },
    {
      id: '2',
      email: 'lisa.wang@company.com',
      role: 'Manager',
      department: 'HR',
      sentDate: '2024-03-11',
      status: 'pending'
    }
  ],
  teamStats: {
    totalMembers: 4,
    activeMembers: 3,
    pendingInvites: 2,
    averageEngagement: 87
  }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

function getRoleIcon(role: string) {
  switch (role) {
    case 'Owner': return <Crown className="h-4 w-4 text-yellow-600" />;
    case 'Manager': return <Shield className="h-4 w-4 text-blue-600" />;
    default: return <User className="h-4 w-4 text-gray-600" />;
  }
}

function getStatusBadge(status: string) {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return (
    <Badge variant="secondary" className={`${variants[status as keyof typeof variants]} border text-xs`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

export default function TeamPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [teamData, setTeamData] = useState(mockTeamData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    // Simulate loading team data
    const loadTeamData = async () => {
      try {
        setTimeout(() => {
          setTeamData(mockTeamData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to load team data');
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, []);

  const handleInviteMember = () => {
    setShowInviteModal(true);
    toast.success('Invitation sent successfully!');
  };

  const handleResendInvite = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Team Management
            </h1>
            <p className="text-muted-foreground">
              Manage team members, roles, and collaborative assessments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Team Analytics
            </Button>
            <Button className="bg-gradient-primary" onClick={handleInviteMember}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Team Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {teamData.teamStats.totalMembers}
            </div>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {teamData.teamStats.activeMembers}
            </div>
            <p className="text-sm text-green-600 dark:text-green-500">Active Members</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {teamData.teamStats.pendingInvites}
            </div>
            <p className="text-sm text-muted-foreground">Pending Invites</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {teamData.teamStats.averageEngagement}%
            </div>
            <p className="text-sm text-muted-foreground">Engagement Rate</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <select className="px-3 py-2 border border-border rounded-md bg-background text-sm">
                  <option value="all">All Roles</option>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamData.members.map((member) => (
                <motion.div
                  key={member.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{member.name}</h4>
                          {getRoleIcon(member.role)}
                          {getStatusBadge(member.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{member.department}</span>
                          <span>•</span>
                          <span>Last active: {member.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium">
                        {member.assessmentsCompleted} assessments
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {member.averageScore > 0 ? `${member.averageScore}/10` : 'N/A'}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="h-3 w-3 mr-1" />
                      Send Assessment
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Pending Invitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                Pending Invitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamData.pendingInvitations.map((invite) => (
                <div key={invite.id} className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-sm">{invite.email}</h5>
                      <p className="text-xs text-muted-foreground">
                        {invite.role} • {invite.department}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sent: {invite.sentDate}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleResendInvite(invite.email)}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Resend
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="h-4 w-4 mr-2" />
                Bulk Invite Members
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Send Team Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Team Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Team Review
              </Button>
            </CardContent>
          </Card>

          {/* Team Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Team Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">High Engagement</span>
                </div>
                <p className="text-xs text-green-800 dark:text-green-200">
                  Team engagement is 23% above industry average
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Assessment Progress</span>
                </div>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  75% of team members completed this month's assessments
                </p>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-sm">Action Needed</span>
                </div>
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  2 team members haven't logged in this week
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
