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
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Star,
  Activity,
  Users,
  Calendar,
  Clock,
  Plus,
  Minus,
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
  CircleLayers,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PerformanceMetric {
  id: string;
  name: string;
  description: string;
  type: 'kpi' | 'goal' | 'milestone' | 'task' | 'project' | 'skill' | 'behavior' | 'custom';
  category: 'productivity' | 'quality' | 'collaboration' | 'innovation' | 'leadership' | 'growth' | 'custom';
  value: number;
  target: number;
  unit: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed' | 'not-started';
  priority: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  team: string;
  department: string;
  period: {
    start: Date;
    end: Date;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  history: {
    date: Date;
    value: number;
    notes?: string;
  }[];
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

export interface PerformanceTrackingProps {
  metrics: PerformanceMetric[];
  onMetricCreate?: (metric: PerformanceMetric) => void;
  onMetricUpdate?: (metric: PerformanceMetric) => void;
  onMetricDelete?: (metricId: string) => void;
  onMetricDuplicate?: (metric: PerformanceMetric) => void;
  onMetricArchive?: (metric: PerformanceMetric) => void;
  onValueUpdate?: (metricId: string, value: number, notes?: string) => void;
  onTargetUpdate?: (metricId: string, target: number) => void;
  onStatusUpdate?: (metricId: string, status: string) => void;
  onPriorityUpdate?: (metricId: string, priority: string) => void;
  onMetricExport?: (metric: PerformanceMetric, format: string) => void;
  onMetricShare?: (metric: PerformanceMetric) => void;
  className?: string;
}

const PerformanceTracking: React.FC<PerformanceTrackingProps> = ({
  metrics = [],
  onMetricCreate,
  onMetricUpdate,
  onMetricDelete,
  onMetricDuplicate,
  onMetricArchive,
  onValueUpdate,
  onTargetUpdate,
  onStatusUpdate,
  onPriorityUpdate,
  onMetricExport,
  onMetricShare,
  className
}) => {
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'category' | 'status' | 'priority' | 'value' | 'target' | 'updatedAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'dashboard'>('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const types = [
    { value: 'all', label: 'All Types', icon: Target, color: 'text-gray-600' },
    { value: 'kpi', label: 'KPI', icon: TrendingUp, color: 'text-blue-600' },
    { value: 'goal', label: 'Goal', icon: Target, color: 'text-green-600' },
    { value: 'milestone', label: 'Milestone', icon: Flag, color: 'text-purple-600' },
    { value: 'task', label: 'Task', icon: CheckCircle, color: 'text-orange-600' },
    { value: 'project', label: 'Project', icon: Building2, color: 'text-indigo-600' },
    { value: 'skill', label: 'Skill', icon: Brain, color: 'text-pink-600' },
    { value: 'behavior', label: 'Behavior', icon: Users, color: 'text-teal-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: Grid, color: 'text-gray-600' },
    { value: 'productivity', label: 'Productivity', icon: Zap, color: 'text-blue-600' },
    { value: 'quality', label: 'Quality', icon: Award, color: 'text-green-600' },
    { value: 'collaboration', label: 'Collaboration', icon: Users, color: 'text-purple-600' },
    { value: 'innovation', label: 'Innovation', icon: Lightbulb, color: 'text-orange-600' },
    { value: 'leadership', label: 'Leadership', icon: Crown, color: 'text-indigo-600' },
    { value: 'growth', label: 'Growth', icon: TrendingUp, color: 'text-pink-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'on-track', label: 'On Track', color: 'text-green-600' },
    { value: 'at-risk', label: 'At Risk', color: 'text-yellow-600' },
    { value: 'behind', label: 'Behind', color: 'text-red-600' },
    { value: 'completed', label: 'Completed', color: 'text-blue-600' },
    { value: 'not-started', label: 'Not Started', color: 'text-gray-600' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'text-gray-600' },
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ];

  const filteredMetrics = metrics
    .filter(metric => {
      const matchesSearch = metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           metric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           metric.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' || metric.type === filterType;
      const matchesCategory = filterCategory === 'all' || metric.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || metric.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || metric.priority === filterPriority;
      return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'status':
          const statusOrder = { 'completed': 5, 'on-track': 4, 'at-risk': 3, 'behind': 2, 'not-started': 1 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'priority':
          const priorityOrder = { 'critical': 5, 'high': 4, 'medium': 3, 'low': 2 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'target':
          aValue = a.target;
          bValue = b.target;
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

  const handleMetricCreate = () => {
    const newMetric: PerformanceMetric = {
      id: '',
      name: 'New Performance Metric',
      description: 'A new performance metric to track',
      type: 'kpi',
      category: 'productivity',
      value: 0,
      target: 100,
      unit: 'units',
      status: 'not-started',
      priority: 'medium',
      owner: '',
      team: '',
      department: '',
      period: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        frequency: 'monthly'
      },
      history: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0',
        tags: [],
        visibility: 'private'
      }
    };
    onMetricCreate?.(newMetric);
  };

  const handleMetricUpdate = (metric: PerformanceMetric, updates: Partial<PerformanceMetric>) => {
    const updatedMetric = {
      ...metric,
      ...updates,
      metadata: {
        ...metric.metadata,
        ...updates.metadata,
        updatedAt: new Date()
      }
    };
    setSelectedMetric(updatedMetric);
    onMetricUpdate?.(updatedMetric);
  };

  const handleMetricDelete = (metricId: string) => {
    onMetricDelete?.(metricId);
    if (selectedMetric?.id === metricId) {
      setSelectedMetric(null);
    }
  };

  const handleMetricDuplicate = (metric: PerformanceMetric) => {
    const duplicatedMetric = {
      ...metric,
      id: '',
      name: `${metric.name} (Copy)`,
      status: 'not-started',
      value: 0,
      history: [],
      metadata: {
        ...metric.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    onMetricDuplicate?.(duplicatedMetric);
  };

  const handleMetricArchive = (metric: PerformanceMetric) => {
    onMetricArchive?.(metric);
  };

  const handleValueUpdate = (metricId: string, value: number, notes?: string) => {
    onValueUpdate?.(metricId, value, notes);
  };

  const handleTargetUpdate = (metricId: string, target: number) => {
    onTargetUpdate?.(metricId, target);
  };

  const handleStatusUpdate = (metricId: string, status: string) => {
    onStatusUpdate?.(metricId, status);
  };

  const handlePriorityUpdate = (metricId: string, priority: string) => {
    onPriorityUpdate?.(metricId, priority);
  };

  const getTypeIcon = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.icon || Target;
  };

  const getTypeColor = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.color || 'text-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.icon || Grid;
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.color || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const statusData = statuses.find(s => s.value === status);
    return statusData?.color || 'text-gray-600';
  };

  const getPriorityColor = (priority: string) => {
    const priorityData = priorities.find(p => p.value === priority);
    return priorityData?.color || 'text-gray-600';
  };

  const getProgressPercentage = (value: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((value / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderMetricCard = (metric: PerformanceMetric) => {
    const TypeIcon = getTypeIcon(metric.type);
    const CategoryIcon = getCategoryIcon(metric.category);
    const isSelected = selectedMetric?.id === metric.id;
    const progressPercentage = getProgressPercentage(metric.value, metric.target);
    
    return (
      <Card
        key={metric.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedMetric(metric)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center shadow-lg',
                `bg-gradient-to-r ${getTypeColor(metric.type).replace('text-', 'from-').replace('-600', '-500')} to-${getTypeColor(metric.type).replace('text-', '').replace('-600', '-700')}`
              )}>
                <TypeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <CardTitle className="text-sm font-medium truncate">
                    {metric.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {metric.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(metric.status))}
              >
                {metric.status}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getPriorityColor(metric.priority))}
              >
                {metric.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span className={cn('font-medium', getProgressColor(progressPercentage))}>
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2"
              />
            </div>

            {/* Value vs Target */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Current:</span>
                <span className="ml-1 font-medium">{metric.value} {metric.unit}</span>
              </div>
              <div>
                <span className="text-gray-500">Target:</span>
                <span className="ml-1 font-medium">{metric.target} {metric.unit}</span>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center space-x-1">
              <CategoryIcon className={cn('h-3 w-3', getCategoryColor(metric.category))} />
              <span className={cn('text-xs', getCategoryColor(metric.category))}>
                {metric.category}
              </span>
            </div>

            {/* Period */}
            <div className="text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(metric.period.start)} - {formatDate(metric.period.end)}</span>
              </div>
            </div>

            {/* Tags */}
            {metric.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {metric.metadata.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {metric.metadata.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{metric.metadata.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMetricDuplicate(metric);
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
                    onMetricShare?.(metric);
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
                  handleMetricDelete(metric.id);
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

  const renderMetricList = () => (
    <div className="space-y-2">
      {filteredMetrics.map((metric) => {
        const isSelected = selectedMetric?.id === metric.id;
        const progressPercentage = getProgressPercentage(metric.value, metric.target);
        
        return (
          <div
            key={metric.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedMetric(metric)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getTypeIcon(metric.type), {
                className: cn('h-4 w-4 flex-shrink-0', getTypeColor(metric.type))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{metric.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(metric.status))}
                  >
                    {metric.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getPriorityColor(metric.priority))}
                  >
                    {metric.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{metric.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{metric.value}</div>
                <div>Current</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{metric.target}</div>
                <div>Target</div>
              </div>
              <div className="text-center">
                <div className={cn('font-medium', getProgressColor(progressPercentage))}>
                  {progressPercentage.toFixed(1)}%
                </div>
                <div>Progress</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Metrics</p>
                <p className="text-2xl font-bold">{metrics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">
                  {metrics.filter(m => m.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium">On Track</p>
                <p className="text-2xl font-bold">
                  {metrics.filter(m => m.status === 'on-track').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium">At Risk</p>
                <p className="text-2xl font-bold">
                  {metrics.filter(m => m.status === 'at-risk' || m.status === 'behind').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMetrics.map(renderMetricCard)}
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Performance Tracking</h2>
          <p className="text-sm text-gray-500">Monitor and track team performance metrics</p>
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
          <Button onClick={handleMetricCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Metric
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search metrics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.label}</span>
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
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className={priority.color}>{priority.label}</span>
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
            variant={viewMode === 'dashboard' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('dashboard')}
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
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Layout className="h-4 w-4" />
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
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="value">Value</SelectItem>
              <SelectItem value="target">Target</SelectItem>
              <SelectItem value="updatedAt">Updated</SelectItem>
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
        {viewMode === 'dashboard' && renderDashboard()}
        
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMetrics.map(renderMetricCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderMetricList()}
      </div>

      {/* Empty State */}
      {filteredMetrics.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No performance metrics found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterType !== 'all' || filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first performance metric'
            }
          </p>
          <Button onClick={handleMetricCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Metric
          </Button>
        </div>
      )}
    </div>
  );
};

export default PerformanceTracking;
