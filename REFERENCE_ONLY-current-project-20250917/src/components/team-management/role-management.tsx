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
  Shield,
  Crown,
  UserCheck,
  Eye,
  UserX,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Share2,
  Download,
  Settings,
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
  Star,
  Award,
  Target,
  Activity,
  Users,
  Building2,
  Globe,
  Calendar,
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

export interface Role {
  id: string;
  name: string;
  description: string;
  level: 'admin' | 'manager' | 'member' | 'viewer' | 'guest';
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
    canManage: boolean;
    canView: boolean;
    canExport: boolean;
    canShare: boolean;
    canArchive: boolean;
    canSuspend: boolean;
    canActivate: boolean;
    canAssignRoles: boolean;
    canManagePermissions: boolean;
    canViewAnalytics: boolean;
    canManageIntegrations: boolean;
    canAccessBilling: boolean;
    canManageSettings: boolean;
  };
  restrictions: {
    maxTeamSize?: number;
    allowedDepartments: string[];
    allowedFeatures: string[];
    timeRestrictions?: {
      start: string;
      end: string;
      timezone: string;
    };
    ipRestrictions?: string[];
    deviceRestrictions?: string[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    tags: string[];
    owner?: string;
    team?: string;
    industry?: string;
    region?: string;
    segment?: string;
    source?: string;
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface RoleManagementProps {
  roles: Role[];
  onRoleCreate?: (role: Role) => void;
  onRoleUpdate?: (role: Role) => void;
  onRoleDelete?: (roleId: string) => void;
  onRoleDuplicate?: (role: Role) => void;
  onRoleArchive?: (role: Role) => void;
  onPermissionUpdate?: (roleId: string, permissions: any) => void;
  onRestrictionUpdate?: (roleId: string, restrictions: any) => void;
  onRoleExport?: (role: Role, format: string) => void;
  onRoleShare?: (role: Role) => void;
  className?: string;
}

const RoleManagement: React.FC<RoleManagementProps> = ({
  roles = [],
  onRoleCreate,
  onRoleUpdate,
  onRoleDelete,
  onRoleDuplicate,
  onRoleArchive,
  onPermissionUpdate,
  onRestrictionUpdate,
  onRoleExport,
  onRoleShare,
  className
}) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'createdAt' | 'updatedAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'permissions'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const levels = [
    { value: 'all', label: 'All Levels', icon: Shield, color: 'text-gray-600' },
    { value: 'admin', label: 'Admin', icon: Crown, color: 'text-red-600' },
    { value: 'manager', label: 'Manager', icon: Shield, color: 'text-blue-600' },
    { value: 'member', label: 'Member', icon: UserCheck, color: 'text-green-600' },
    { value: 'viewer', label: 'Viewer', icon: Eye, color: 'text-yellow-600' },
    { value: 'guest', label: 'Guest', icon: UserX, color: 'text-gray-600' }
  ];

  const filteredRoles = roles
    .filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           role.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLevel = filterLevel === 'all' || role.level === filterLevel;
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'level':
          const levelOrder = { 'admin': 6, 'manager': 5, 'member': 4, 'viewer': 3, 'guest': 2 };
          aValue = levelOrder[a.level as keyof typeof levelOrder];
          bValue = levelOrder[b.level as keyof typeof levelOrder];
          break;
        case 'createdAt':
          aValue = a.metadata.createdAt.getTime();
          bValue = b.metadata.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.metadata.updatedAt.getTime();
          bValue = b.metadata.updatedAt.getTime();
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

  const handleRoleCreate = () => {
    const newRole: Role = {
      id: '',
      name: 'New Role',
      description: 'A new role with custom permissions',
      level: 'member',
      permissions: {
        canEdit: false,
        canDelete: false,
        canInvite: false,
        canManage: false,
        canView: true,
        canExport: false,
        canShare: false,
        canArchive: false,
        canSuspend: false,
        canActivate: false,
        canAssignRoles: false,
        canManagePermissions: false,
        canViewAnalytics: false,
        canManageIntegrations: false,
        canAccessBilling: false,
        canManageSettings: false
      },
      restrictions: {
        allowedDepartments: [],
        allowedFeatures: []
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0',
        tags: [],
        visibility: 'private'
      }
    };
    onRoleCreate?.(newRole);
  };

  const handleRoleUpdate = (role: Role, updates: Partial<Role>) => {
    const updatedRole = {
      ...role,
      ...updates,
      metadata: {
        ...role.metadata,
        ...updates.metadata,
        updatedAt: new Date()
      }
    };
    setSelectedRole(updatedRole);
    onRoleUpdate?.(updatedRole);
  };

  const handleRoleDelete = (roleId: string) => {
    onRoleDelete?.(roleId);
    if (selectedRole?.id === roleId) {
      setSelectedRole(null);
    }
  };

  const handleRoleDuplicate = (role: Role) => {
    const duplicatedRole = {
      ...role,
      id: '',
      name: `${role.name} (Copy)`,
      metadata: {
        ...role.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    onRoleDuplicate?.(duplicatedRole);
  };

  const handleRoleArchive = (role: Role) => {
    onRoleArchive?.(role);
  };

  const handlePermissionUpdate = (roleId: string, permissions: any) => {
    onPermissionUpdate?.(roleId, permissions);
  };

  const handleRestrictionUpdate = (roleId: string, restrictions: any) => {
    onRestrictionUpdate?.(roleId, restrictions);
  };

  const getLevelIcon = (level: string) => {
    const levelData = levels.find(l => l.value === level);
    return levelData?.icon || Shield;
  };

  const getLevelColor = (level: string) => {
    const levelData = levels.find(l => l.value === level);
    return levelData?.color || 'text-gray-600';
  };

  const getPermissionCount = (permissions: any) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  const getTotalPermissions = (permissions: any) => {
    return Object.keys(permissions).length;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderRoleCard = (role: Role) => {
    const LevelIcon = getLevelIcon(role.level);
    const isSelected = selectedRole?.id === role.id;
    const permissionCount = getPermissionCount(role.permissions);
    const totalPermissions = getTotalPermissions(role.permissions);
    
    return (
      <Card
        key={role.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedRole(role)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center shadow-lg',
                `bg-gradient-to-r ${getLevelColor(role.level).replace('text-', 'from-').replace('-600', '-500')} to-${getLevelColor(role.level).replace('text-', '').replace('-600', '-700')}`
              )}>
                <LevelIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <CardTitle className="text-sm font-medium truncate">
                    {role.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {role.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getLevelColor(role.level))}
              >
                {role.level}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Permissions Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Permissions</span>
                <span className="font-medium">{permissionCount}/{totalPermissions}</span>
              </div>
              <Progress
                value={(permissionCount / totalPermissions) * 100}
                className="h-2"
              />
            </div>

            {/* Key Permissions */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Key Permissions</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(role.permissions)
                  .filter(([_, value]) => value)
                  .slice(0, 3)
                  .map(([key, _]) => (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="text-xs px-2 py-1"
                    >
                      {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </Badge>
                  ))}
                {permissionCount > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{permissionCount - 3}
                  </Badge>
                )}
              </div>
            </div>

            {/* Restrictions */}
            {role.restrictions.allowedDepartments.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Allowed Departments</div>
                <div className="flex flex-wrap gap-1">
                  {role.restrictions.allowedDepartments.slice(0, 2).map((dept, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs px-2 py-1"
                    >
                      {dept}
                    </Badge>
                  ))}
                  {role.restrictions.allowedDepartments.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      +{role.restrictions.allowedDepartments.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {role.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {role.metadata.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {role.metadata.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{role.metadata.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Last Updated */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Updated</span>
              <span>{formatDate(role.metadata.updatedAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleDuplicate(role);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoleShare?.(role);
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
                  handleRoleDelete(role.id);
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

  const renderRoleList = () => (
    <div className="space-y-2">
      {filteredRoles.map((role) => {
        const isSelected = selectedRole?.id === role.id;
        const permissionCount = getPermissionCount(role.permissions);
        const totalPermissions = getTotalPermissions(role.permissions);
        
        return (
          <div
            key={role.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedRole(role)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getLevelIcon(role.level), {
                className: cn('h-4 w-4 flex-shrink-0', getLevelColor(role.level))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{role.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getLevelColor(role.level))}
                  >
                    {role.level}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{role.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{permissionCount}</div>
                <div>Permissions</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{role.restrictions.allowedDepartments.length}</div>
                <div>Departments</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatDate(role.metadata.updatedAt)}</div>
                <div>Updated</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPermissionsView = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Permission Matrix</h3>
        <p className="text-sm text-gray-500">Compare permissions across all roles</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-3 font-medium text-sm">Role</th>
              <th className="text-center p-3 font-medium text-sm">Edit</th>
              <th className="text-center p-3 font-medium text-sm">Delete</th>
              <th className="text-center p-3 font-medium text-sm">Invite</th>
              <th className="text-center p-3 font-medium text-sm">Manage</th>
              <th className="text-center p-3 font-medium text-sm">View</th>
              <th className="text-center p-3 font-medium text-sm">Export</th>
              <th className="text-center p-3 font-medium text-sm">Share</th>
              <th className="text-center p-3 font-medium text-sm">Archive</th>
              <th className="text-center p-3 font-medium text-sm">Suspend</th>
              <th className="text-center p-3 font-medium text-sm">Activate</th>
              <th className="text-center p-3 font-medium text-sm">Assign Roles</th>
              <th className="text-center p-3 font-medium text-sm">Manage Permissions</th>
              <th className="text-center p-3 font-medium text-sm">View Analytics</th>
              <th className="text-center p-3 font-medium text-sm">Manage Integrations</th>
              <th className="text-center p-3 font-medium text-sm">Access Billing</th>
              <th className="text-center p-3 font-medium text-sm">Manage Settings</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    {React.createElement(getLevelIcon(role.level), {
                      className: cn('h-4 w-4', getLevelColor(role.level))
                    })}
                    <span className="text-sm font-medium">{role.name}</span>
                  </div>
                </td>
                {Object.entries(role.permissions).map(([key, value]) => (
                  <td key={key} className="text-center p-3">
                    {value ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Role Management</h2>
          <p className="text-sm text-gray-500">Define and manage user roles and permissions</p>
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
          <Button onClick={handleRoleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="level">Level</Label>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center space-x-2">
                          <level.icon className="h-4 w-4" />
                          <span>{level.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sort">Sort by</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="level">Level</SelectItem>
                    <SelectItem value="createdAt">Created</SelectItem>
                    <SelectItem value="updatedAt">Updated</SelectItem>
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
            variant={viewMode === 'permissions' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('permissions')}
          >
            <Shield className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
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
            {filteredRoles.map(renderRoleCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderRoleList()}
        
        {viewMode === 'permissions' && renderPermissionsView()}
      </div>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterLevel !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first role'
            }
          </p>
          <Button onClick={handleRoleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
