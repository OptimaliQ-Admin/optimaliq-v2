'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  UserPlus,
  UserMinus,
  UserEdit,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Star,
  Award,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Share2,
  Download,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  Info,
  HelpCircle,
  Zap,
  Brain,
  Lightbulb,
  Building2,
  Globe,
  Calendar,
  Code,
  Palette,
  Clock,
  Filter,
  Search,
  Bookmark,
  Flag,
  Archive,
  ExternalLink,
  Upload,
  FileText,
  Image,
  Table,
  Grid,
  List,
  Layout,
  Layers,
  Play,
  Pause,
  Stop,
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  RadarChart,
  DoughnutChart,
  PolarChart,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Move,
  Resize,
  Lock,
  Unlock,
  Maximize,
  Minimize,
  CheckCircle,
  Circle,
  CircleDot,
  CircleCheck,
  CircleX,
  CirclePause,
  CirclePlay,
  CircleStop,
  CircleAlert,
  CircleInfo,
  CircleQuestion,
  CircleHelp,
  CircleZap,
  CircleBrain,
  CircleLightbulb,
  CircleStar,
  CircleAward,
  CircleTarget,
  CircleActivity,
  CircleUsers,
  CircleBuilding2,
  CircleGlobe,
  CircleCalendar,
  CircleClock,
  CircleFilter,
  CircleSearch,
  CircleBookmark,
  CircleFlag,
  CircleArchive,
  CircleExternalLink,
  CircleUpload,
  CircleFileText,
  CircleImage,
  CircleTable,
  CircleGrid,
  CircleList,
  CircleLayout,
  CircleLayers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer' | 'guest';
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  avatar?: string;
  bio?: string;
  skills: string[];
  experience: {
    years: number;
    level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  };
  performance: {
    rating: number; // 1-5
    lastReview: Date;
    goals: {
      id: string;
      title: string;
      progress: number;
      deadline: Date;
    }[];
  };
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
    canManage: boolean;
    canView: boolean;
  };
  metadata: {
    joinedAt: Date;
    lastActive: Date;
    timezone: string;
    location: string;
    manager?: string;
    directReports: string[];
    tags: string[];
  };
}

export interface TeamOverviewProps {
  teamMembers: TeamMember[];
  onMemberAdd?: (member: TeamMember) => void;
  onMemberUpdate?: (member: TeamMember) => void;
  onMemberDelete?: (memberId: string) => void;
  onMemberInvite?: (email: string, role: string) => void;
  onMemberSuspend?: (memberId: string) => void;
  onMemberActivate?: (memberId: string) => void;
  onRoleUpdate?: (memberId: string, role: string) => void;
  onPermissionUpdate?: (memberId: string, permissions: any) => void;
  onGoalUpdate?: (memberId: string, goalId: string, progress: number) => void;
  onTeamExport?: (format: string) => void;
  onTeamShare?: () => void;
  className?: string;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({
  teamMembers = [],
  onMemberAdd,
  onMemberUpdate,
  onMemberDelete,
  onMemberInvite,
  onMemberSuspend,
  onMemberActivate,
  onRoleUpdate,
  onPermissionUpdate,
  onGoalUpdate,
  onTeamExport,
  onTeamShare,
  className
}) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'department' | 'status' | 'performance' | 'joinedAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'org-chart'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const roles = [
    { value: 'all', label: 'All Roles', icon: Users, color: 'text-gray-600' },
    { value: 'admin', label: 'Admin', icon: Crown, color: 'text-red-600' },
    { value: 'manager', label: 'Manager', icon: Shield, color: 'text-blue-600' },
    { value: 'member', label: 'Member', icon: UserCheck, color: 'text-green-600' },
    { value: 'viewer', label: 'Viewer', icon: Eye, color: 'text-yellow-600' },
    { value: 'guest', label: 'Guest', icon: UserX, color: 'text-gray-600' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments', icon: Building2 },
    { value: 'engineering', label: 'Engineering', icon: Code, color: 'text-blue-600' },
    { value: 'product', label: 'Product', icon: Target, color: 'text-green-600' },
    { value: 'marketing', label: 'Marketing', icon: TrendingUp, color: 'text-purple-600' },
    { value: 'sales', label: 'Sales', icon: DollarSign, color: 'text-orange-600' },
    { value: 'design', label: 'Design', icon: Palette, color: 'text-pink-600' },
    { value: 'operations', label: 'Operations', icon: Settings, color: 'text-gray-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'active', label: 'Active', color: 'text-green-600' },
    { value: 'inactive', label: 'Inactive', color: 'text-gray-600' },
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'suspended', label: 'Suspended', color: 'text-red-600' }
  ];

  const filteredMembers = teamMembers
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRole = filterRole === 'all' || member.role === filterRole;
      const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'role':
          const roleOrder = { 'admin': 6, 'manager': 5, 'member': 4, 'viewer': 3, 'guest': 2 };
          aValue = roleOrder[a.role as keyof typeof roleOrder];
          bValue = roleOrder[b.role as keyof typeof roleOrder];
          break;
        case 'department':
          aValue = a.department;
          bValue = b.department;
          break;
        case 'status':
          const statusOrder = { 'active': 4, 'pending': 3, 'inactive': 2, 'suspended': 1 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'performance':
          aValue = a.performance.rating;
          bValue = b.performance.rating;
          break;
        case 'joinedAt':
          aValue = a.metadata.joinedAt.getTime();
          bValue = b.metadata.joinedAt.getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleMemberAdd = () => {
    const newMember: TeamMember = {
      id: '',
      name: 'New Member',
      email: 'newmember@example.com',
      role: 'member',
      department: 'engineering',
      position: 'Software Engineer',
      status: 'pending',
      skills: [],
      experience: {
        years: 0,
        level: 'junior'
      },
      performance: {
        rating: 3,
        lastReview: new Date(),
        goals: []
      },
      permissions: {
        canEdit: false,
        canDelete: false,
        canInvite: false,
        canManage: false,
        canView: true
      },
      metadata: {
        joinedAt: new Date(),
        lastActive: new Date(),
        timezone: 'UTC',
        location: '',
        directReports: [],
        tags: []
      }
    };
    onMemberAdd?.(newMember);
  };

  const handleMemberUpdate = (member: TeamMember, updates: Partial<TeamMember>) => {
    const updatedMember = {
      ...member,
      ...updates,
      metadata: {
        ...member.metadata,
        ...updates.metadata
      }
    };
    setSelectedMember(updatedMember);
    onMemberUpdate?.(updatedMember);
  };

  const handleMemberDelete = (memberId: string) => {
    onMemberDelete?.(memberId);
    if (selectedMember?.id === memberId) {
      setSelectedMember(null);
    }
  };

  const handleMemberInvite = (email: string, role: string) => {
    onMemberInvite?.(email, role);
  };

  const handleMemberSuspend = (memberId: string) => {
    onMemberSuspend?.(memberId);
  };

  const handleMemberActivate = (memberId: string) => {
    onMemberActivate?.(memberId);
  };

  const handleRoleUpdate = (memberId: string, role: string) => {
    onRoleUpdate?.(memberId, role);
  };

  const handlePermissionUpdate = (memberId: string, permissions: any) => {
    onPermissionUpdate?.(memberId, permissions);
  };

  const handleGoalUpdate = (memberId: string, goalId: string, progress: number) => {
    onGoalUpdate?.(memberId, goalId, progress);
  };

  const getRoleIcon = (role: string) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.icon || Users;
  };

  const getRoleColor = (role: string) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.color || 'text-gray-600';
  };

  const getDepartmentIcon = (department: string) => {
    const deptData = departments.find(d => d.value === department);
    return deptData?.icon || Building2;
  };

  const getDepartmentColor = (department: string) => {
    const deptData = departments.find(d => d.value === department);
    return deptData?.color || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const statusData = statuses.find(s => s.value === status);
    return statusData?.color || 'text-gray-600';
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'junior':
        return 'text-green-600';
      case 'mid':
        return 'text-blue-600';
      case 'senior':
        return 'text-purple-600';
      case 'lead':
        return 'text-orange-600';
      case 'principal':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const renderMemberCard = (member: TeamMember) => {
    const RoleIcon = getRoleIcon(member.role);
    const DepartmentIcon = getDepartmentIcon(member.department);
    const isSelected = selectedMember?.id === member.id;
    
    return (
      <Card
        key={member.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedMember(member)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-lg">
                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <CardTitle className="text-sm font-medium truncate">
                    {member.name}
                  </CardTitle>
                  {member.status === 'active' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{member.position}</p>
                <p className="text-xs text-gray-400 truncate">{member.email}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getRoleColor(member.role))}
              >
                <RoleIcon className="h-3 w-3 mr-1" />
                {member.role}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getDepartmentColor(member.department))}
              >
                <DepartmentIcon className="h-3 w-3 mr-1" />
                {member.department}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Performance Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Performance</span>
              <div className="flex items-center space-x-1">
                <Star className={cn('h-3 w-3', getPerformanceColor(member.performance.rating))} />
                <span className={cn('text-xs font-medium', getPerformanceColor(member.performance.rating))}>
                  {member.performance.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Experience</span>
              <div className="flex items-center space-x-1">
                <span className={cn('text-xs font-medium', getExperienceColor(member.experience.level))}>
                  {member.experience.level}
                </span>
                <span className="text-xs text-gray-400">
                  ({member.experience.years}y)
                </span>
              </div>
            </div>

            {/* Skills */}
            {member.skills.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs px-2 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {member.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      +{member.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Goals Progress */}
            {member.performance.goals.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Goals Progress</div>
                <div className="space-y-1">
                  {member.performance.goals.slice(0, 2).map((goal) => (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate">{goal.title}</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-1" />
                    </div>
                  ))}
                  {member.performance.goals.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{member.performance.goals.length - 2} more goals
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Last Active */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last active</span>
              <span>{formatLastActive(member.metadata.lastActive)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                {member.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMemberSuspend(member.id);
                    }}
                  >
                    <Pause className="h-3 w-3 text-yellow-500" />
                  </Button>
                )}
                {member.status === 'suspended' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMemberActivate(member.id);
                    }}
                  >
                    <Play className="h-3 w-3 text-green-500" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTeamShare?.();
                  }}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMemberDelete(member.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMemberList = () => (
    <div className="space-y-2">
      {filteredMembers.map((member) => {
        const isSelected = selectedMember?.id === member.id;
        
        return (
          <div
            key={member.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedMember(member)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{member.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getRoleColor(member.role))}
                  >
                    {member.role}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getDepartmentColor(member.department))}
                  >
                    {member.department}
                  </Badge>
                  {member.status === 'active' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{member.position}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{member.performance.rating.toFixed(1)}</div>
                <div>Rating</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{member.experience.years}</div>
                <div>Years</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{member.performance.goals.length}</div>
                <div>Goals</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderOrgChart = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Organizational Chart</h3>
        <p className="text-sm text-gray-500">Team hierarchy and reporting structure</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers
          .filter(member => member.role === 'admin' || member.role === 'manager')
          .map((manager) => (
            <Card key={manager.id} className="p-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mx-auto mb-3">
                  <span className="text-white font-semibold text-xl">
                    {manager.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <h4 className="font-medium">{manager.name}</h4>
                <p className="text-sm text-gray-500">{manager.position}</p>
                <Badge
                  variant="outline"
                  className={cn('text-xs mt-2', getRoleColor(manager.role))}
                >
                  {manager.role}
                </Badge>
              </div>
              
              {manager.metadata.directReports.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Direct Reports</div>
                  <div className="space-y-2">
                    {teamMembers
                      .filter(member => manager.metadata.directReports.includes(member.id))
                      .map((report) => (
                        <div key={report.id} className="flex items-center space-x-2 text-xs">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {report.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <span className="truncate">{report.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Team Overview</h2>
          <p className="text-sm text-gray-500">Manage your team members and organizational structure</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={handleMemberAdd}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center space-x-2">
                          <role.icon className="h-4 w-4" />
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        <div className="flex items-center space-x-2">
                          <dept.icon className="h-4 w-4" />
                          <span>{dept.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <span className={status.color}>{status.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'org-chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('org-chart')}
          >
            <Building2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="sort">Sort by</Label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="joinedAt">Joined</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map(renderMemberCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderMemberList()}
        
        {viewMode === 'org-chart' && renderOrgChart()}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterRole !== 'all' || filterDepartment !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first team member'
            }
          </p>
          <Button onClick={handleMemberAdd}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamOverview;
