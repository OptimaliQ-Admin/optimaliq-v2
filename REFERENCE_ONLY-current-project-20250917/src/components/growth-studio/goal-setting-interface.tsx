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
  Target,
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
  Star,
  Award,
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation';
  type: 'revenue' | 'users' | 'conversion' | 'engagement' | 'efficiency' | 'custom';
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'overdue';
  target: {
    value: number;
    unit: string;
    format: 'number' | 'percentage' | 'currency' | 'ratio';
  };
  current: {
    value: number;
    unit: string;
    format: 'number' | 'percentage' | 'currency' | 'ratio';
  };
  progress: number; // 0-100
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: {
      id: string;
      title: string;
      targetValue: number;
      currentValue: number;
      targetDate: Date;
      completedDate?: Date;
      status: 'pending' | 'in-progress' | 'completed' | 'overdue';
    }[];
  };
  metrics: {
    primary: string;
    secondary: string[];
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  };
  strategies: {
    id: string;
    title: string;
    description: string;
    status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
    impact: number; // 1-10
    effort: number; // 1-10
    owner: string;
    dueDate: Date;
  }[];
  dependencies: string[];
  blockers: string[];
  resources: {
    team: string[];
    budget: number;
    tools: string[];
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    owner?: string;
    team?: string;
    industry?: string;
    region?: string;
    segment?: string;
    source?: string;
    version?: string;
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface GoalSettingInterfaceProps {
  goals: Goal[];
  onGoalCreate?: (goal: Goal) => void;
  onGoalUpdate?: (goal: Goal) => void;
  onGoalDelete?: (goalId: string) => void;
  onGoalDuplicate?: (goal: Goal) => void;
  onGoalArchive?: (goal: Goal) => void;
  onGoalActivate?: (goal: Goal) => void;
  onGoalPause?: (goal: Goal) => void;
  onGoalComplete?: (goal: Goal) => void;
  onGoalCancel?: (goal: Goal) => void;
  onMilestoneAdd?: (goal: Goal, milestone: any) => void;
  onMilestoneUpdate?: (goal: Goal, milestoneId: string, updates: any) => void;
  onMilestoneDelete?: (goal: Goal, milestoneId: string) => void;
  onStrategyAdd?: (goal: Goal, strategy: any) => void;
  onStrategyUpdate?: (goal: Goal, strategyId: string, updates: any) => void;
  onStrategyDelete?: (goal: Goal, strategyId: string) => void;
  onGoalExport?: (goal: Goal, format: string) => void;
  onGoalShare?: (goal: Goal) => void;
  className?: string;
}

const GoalSettingInterface: React.FC<GoalSettingInterfaceProps> = ({
  goals,
  onGoalCreate,
  onGoalUpdate,
  onGoalDelete,
  onGoalDuplicate,
  onGoalArchive,
  onGoalActivate,
  onGoalPause,
  onGoalComplete,
  onGoalCancel,
  onMilestoneAdd,
  onMilestoneUpdate,
  onMilestoneDelete,
  onStrategyAdd,
  onStrategyUpdate,
  onStrategyDelete,
  onGoalExport,
  onGoalShare,
  className
}) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'priority' | 'progress' | 'status' | 'endDate' | 'createdAt'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const categories = [
    { value: 'all', label: 'All Categories', icon: Grid },
    { value: 'acquisition', label: 'Acquisition', icon: Users, color: 'text-blue-600' },
    { value: 'retention', label: 'Retention', icon: Target, color: 'text-green-600' },
    { value: 'monetization', label: 'Monetization', icon: DollarSign, color: 'text-purple-600' },
    { value: 'efficiency', label: 'Efficiency', icon: Zap, color: 'text-orange-600' },
    { value: 'expansion', label: 'Expansion', icon: TrendingUp, color: 'text-indigo-600' },
    { value: 'innovation', label: 'Innovation', icon: Lightbulb, color: 'text-pink-600' }
  ];

  const types = [
    { value: 'all', label: 'All Types', icon: Grid },
    { value: 'revenue', label: 'Revenue', icon: DollarSign, color: 'text-green-600' },
    { value: 'users', label: 'Users', icon: Users, color: 'text-blue-600' },
    { value: 'conversion', label: 'Conversion', icon: Target, color: 'text-purple-600' },
    { value: 'engagement', label: 'Engagement', icon: Activity, color: 'text-orange-600' },
    { value: 'efficiency', label: 'Efficiency', icon: Zap, color: 'text-yellow-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'draft', label: 'Draft', color: 'text-gray-600' },
    { value: 'active', label: 'Active', color: 'text-blue-600' },
    { value: 'paused', label: 'Paused', color: 'text-yellow-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
    { value: 'overdue', label: 'Overdue', color: 'text-red-600' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'text-gray-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'low', label: 'Low', color: 'text-green-600' }
  ];

  const filteredGoals = goals
    .filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           goal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
      const matchesType = filterType === 'all' || goal.type === filterType;
      const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority;
      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'status':
          const statusOrder = { 'active': 4, 'draft': 3, 'paused': 2, 'completed': 1, 'cancelled': 0, 'overdue': 5 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'endDate':
          aValue = a.timeline.endDate.getTime();
          bValue = b.timeline.endDate.getTime();
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
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

  const handleGoalCreate = () => {
    const newGoal: Goal = {
      id: '',
      title: 'New Goal',
      description: 'A new goal for growth',
      category: 'acquisition',
      type: 'revenue',
      priority: 'medium',
      status: 'draft',
      target: {
        value: 1000000,
        unit: 'USD',
        format: 'currency'
      },
      current: {
        value: 0,
        unit: 'USD',
        format: 'currency'
      },
      progress: 0,
      timeline: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        milestones: []
      },
      metrics: {
        primary: 'Revenue',
        secondary: ['Users', 'Conversion'],
        frequency: 'monthly'
      },
      strategies: [],
      dependencies: [],
      blockers: [],
      resources: {
        team: [],
        budget: 0,
        tools: []
      },
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onGoalCreate?.(newGoal);
  };

  const handleGoalUpdate = (goal: Goal, updates: Partial<Goal>) => {
    const updatedGoal = {
      ...goal,
      ...updates,
      updatedAt: new Date()
    };
    setSelectedGoal(updatedGoal);
    onGoalUpdate?.(updatedGoal);
  };

  const handleGoalDelete = (goalId: string) => {
    onGoalDelete?.(goalId);
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null);
    }
  };

  const handleGoalDuplicate = (goal: Goal) => {
    const duplicatedGoal = {
      ...goal,
      id: '',
      title: `${goal.title} (Copy)`,
      status: 'draft',
      progress: 0,
      current: {
        ...goal.current,
        value: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onGoalDuplicate?.(duplicatedGoal);
  };

  const handleGoalArchive = (goal: Goal) => {
    onGoalArchive?.(goal);
  };

  const handleGoalActivate = (goal: Goal) => {
    onGoalActivate?.(goal);
  };

  const handleGoalPause = (goal: Goal) => {
    onGoalPause?.(goal);
  };

  const handleGoalComplete = (goal: Goal) => {
    onGoalComplete?.(goal);
  };

  const handleGoalCancel = (goal: Goal) => {
    onGoalCancel?.(goal);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.icon || Grid;
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.color || 'text-gray-600';
  };

  const getTypeIcon = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.icon || Grid;
  };

  const getTypeColor = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.color || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const statusData = statuses.find(s => s.value === status);
    return statusData?.color || 'text-gray-600';
  };

  const getPriorityColor = (priority: string) => {
    const priorityData = priorities.find(p => p.value === priority);
    return priorityData?.color || 'text-gray-600';
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'ratio':
        return `${value.toFixed(1)}x`;
      default:
        return value.toLocaleString();
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderGoalCard = (goal: Goal) => {
    const CategoryIcon = getCategoryIcon(goal.category);
    const TypeIcon = getTypeIcon(goal.type);
    const isSelected = selectedGoal?.id === goal.id;
    const daysRemaining = getDaysRemaining(goal.timeline.endDate);
    
    return (
      <Card
        key={goal.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedGoal(goal)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(goal.category))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium truncate">
                    {goal.title}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {goal.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(goal.status))}
              >
                {goal.status}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getPriorityColor(goal.priority))}
              >
                {goal.priority}
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
                <span className="font-medium">{goal.progress}%</span>
              </div>
              <Progress
                value={goal.progress}
                className="h-2"
                style={{
                  '--progress-background': getProgressColor(goal.progress)
                } as React.CSSProperties}
              />
            </div>

            {/* Target vs Current */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Current:</span>
                <span className="ml-1 font-medium">{formatValue(goal.current.value, goal.current.format)}</span>
              </div>
              <div>
                <span className="text-gray-500">Target:</span>
                <span className="ml-1 font-medium">{formatValue(goal.target.value, goal.target.format)}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{goal.timeline.endDate.toLocaleDateString()}</span>
              </div>
              <div className={cn(
                'font-medium',
                daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-gray-600'
              )}>
                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
              </div>
            </div>

            {/* Milestones */}
            {goal.timeline.milestones.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Milestones</div>
                <div className="space-y-1">
                  {goal.timeline.milestones.slice(0, 3).map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-2 text-xs">
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : milestone.status === 'in-progress' ? (
                        <CirclePlay className="h-3 w-3 text-blue-500" />
                      ) : milestone.status === 'overdue' ? (
                        <CircleAlert className="h-3 w-3 text-red-500" />
                      ) : (
                        <Circle className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="truncate">{milestone.title}</span>
                    </div>
                  ))}
                  {goal.timeline.milestones.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{goal.timeline.milestones.length - 3} more milestones
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {goal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {goal.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {goal.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{goal.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                {goal.status === 'draft' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoalActivate(goal);
                    }}
                  >
                    <Play className="h-3 w-3 text-green-500" />
                  </Button>
                )}
                {goal.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoalPause(goal);
                    }}
                  >
                    <Pause className="h-3 w-3 text-yellow-500" />
                  </Button>
                )}
                {goal.status === 'paused' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoalActivate(goal);
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
                    handleGoalDuplicate(goal);
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
                    onGoalShare?.(goal);
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
                  handleGoalDelete(goal.id);
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

  const renderGoalList = () => (
    <div className="space-y-2">
      {filteredGoals.map((goal) => {
        const isSelected = selectedGoal?.id === goal.id;
        const daysRemaining = getDaysRemaining(goal.timeline.endDate);
        
        return (
          <div
            key={goal.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedGoal(goal)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getCategoryIcon(goal.category), {
                className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(goal.category))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{goal.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(goal.status))}
                  >
                    {goal.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getPriorityColor(goal.priority))}
                  >
                    {goal.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{goal.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{goal.progress}%</div>
                <div>Progress</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatValue(goal.current.value, goal.current.format)}</div>
                <div>Current</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatValue(goal.target.value, goal.target.format)}</div>
                <div>Target</div>
              </div>
              <div className="text-center">
                <div className={cn(
                  'font-medium',
                  daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-gray-600'
                )}>
                  {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
                </div>
                <div>Timeline</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Goal Setting Interface</h2>
          <p className="text-sm text-gray-500">Set and track your growth goals</p>
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
          <Button onClick={handleGoalCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
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
                    placeholder="Search goals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
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
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="endDate">End Date</SelectItem>
              <SelectItem value="createdAt">Date</SelectItem>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map(renderGoalCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderGoalList()}
        
        {viewMode === 'timeline' && (
          <div className="text-center py-12">
            <Layout className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline View</h3>
            <p className="text-gray-500">
              Timeline view coming soon
            </p>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first goal'
            }
          </p>
          <Button onClick={handleGoalCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalSettingInterface;
