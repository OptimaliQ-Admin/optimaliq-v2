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

export interface ProgressItem {
  id: string;
  name: string;
  description: string;
  type: 'goal' | 'milestone' | 'task' | 'kpi' | 'initiative' | 'project';
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation';
  status: 'not-started' | 'in-progress' | 'completed' | 'paused' | 'cancelled' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  target: number;
  current: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  completedDate?: Date;
  owner: string;
  team: string;
  dependencies: string[];
  blockers: string[];
  milestones: {
    id: string;
    name: string;
    description: string;
    targetDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
    progress: number;
  }[];
  metrics: {
    [key: string]: {
      target: number;
      current: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
      changePercentage: number;
    };
  };
  notes: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    industry?: string;
    region?: string;
    segment?: string;
    source?: string;
    version?: string;
    status?: 'draft' | 'published' | 'archived';
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface ProgressTrackingProps {
  items: ProgressItem[];
  onItemCreate?: (item: ProgressItem) => void;
  onItemUpdate?: (item: ProgressItem) => void;
  onItemDelete?: (itemId: string) => void;
  onItemDuplicate?: (item: ProgressItem) => void;
  onItemArchive?: (item: ProgressItem) => void;
  onItemStatusUpdate?: (item: ProgressItem, status: string) => void;
  onItemProgressUpdate?: (item: ProgressItem, progress: number) => void;
  onMilestoneAdd?: (item: ProgressItem, milestone: any) => void;
  onMilestoneUpdate?: (item: ProgressItem, milestoneId: string, updates: any) => void;
  onMilestoneDelete?: (item: ProgressItem, milestoneId: string) => void;
  onNoteAdd?: (item: ProgressItem, note: string) => void;
  onNoteUpdate?: (item: ProgressItem, noteId: string, note: string) => void;
  onNoteDelete?: (item: ProgressItem, noteId: string) => void;
  className?: string;
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  items,
  onItemCreate,
  onItemUpdate,
  onItemDelete,
  onItemDuplicate,
  onItemArchive,
  onItemStatusUpdate,
  onItemProgressUpdate,
  onMilestoneAdd,
  onMilestoneUpdate,
  onMilestoneDelete,
  onNoteAdd,
  onNoteUpdate,
  onNoteDelete,
  className
}) => {
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'priority' | 'status' | 'endDate' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline' | 'kanban'>('list');
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

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'not-started', label: 'Not Started', color: 'text-gray-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'paused', label: 'Paused', color: 'text-yellow-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
    { value: 'overdue', label: 'Overdue', color: 'text-red-600' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'text-gray-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'low', label: 'Low', color: 'text-green-600' }
  ];

  const types = [
    { value: 'all', label: 'All Types', icon: Grid },
    { value: 'goal', label: 'Goal', icon: Target },
    { value: 'milestone', label: 'Milestone', icon: Flag },
    { value: 'task', label: 'Task', icon: CheckCircle },
    { value: 'kpi', label: 'KPI', icon: BarChart3 },
    { value: 'initiative', label: 'Initiative', icon: Lightbulb },
    { value: 'project', label: 'Project', icon: Building2 }
  ];

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'status':
          const statusOrder = { 'in-progress': 4, 'not-started': 3, 'paused': 2, 'completed': 1, 'cancelled': 0, 'overdue': 5 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'endDate':
          aValue = a.endDate.getTime();
          bValue = b.endDate.getTime();
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

  const handleItemCreate = () => {
    const newItem: ProgressItem = {
      id: '',
      name: 'New Progress Item',
      description: 'A new progress tracking item',
      type: 'goal',
      category: 'acquisition',
      status: 'not-started',
      priority: 'medium',
      progress: 0,
      target: 100,
      current: 0,
      unit: 'units',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      owner: 'Current User',
      team: 'Growth Team',
      dependencies: [],
      blockers: [],
      milestones: [],
      metrics: {},
      notes: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onItemCreate?.(newItem);
  };

  const handleItemUpdate = (item: ProgressItem, updates: Partial<ProgressItem>) => {
    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: new Date()
    };
    setSelectedItem(updatedItem);
    onItemUpdate?.(updatedItem);
  };

  const handleItemDelete = (itemId: string) => {
    onItemDelete?.(itemId);
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
  };

  const handleItemDuplicate = (item: ProgressItem) => {
    const duplicatedItem = {
      ...item,
      id: '',
      name: `${item.name} (Copy)`,
      status: 'not-started',
      progress: 0,
      current: 0,
      completedDate: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onItemDuplicate?.(duplicatedItem);
  };

  const handleItemArchive = (item: ProgressItem) => {
    onItemArchive?.(item);
  };

  const handleItemStatusUpdate = (item: ProgressItem, status: string) => {
    onItemStatusUpdate?.(item, status);
  };

  const handleItemProgressUpdate = (item: ProgressItem, progress: number) => {
    onItemProgressUpdate?.(item, progress);
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

  const getTypeIcon = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.icon || Grid;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started':
        return <Circle className="h-4 w-4" />;
      case 'in-progress':
        return <CirclePlay className="h-4 w-4" />;
      case 'completed':
        return <CircleCheck className="h-4 w-4" />;
      case 'paused':
        return <CirclePause className="h-4 w-4" />;
      case 'cancelled':
        return <CircleX className="h-4 w-4" />;
      case 'overdue':
        return <CircleAlert className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderItemCard = (item: ProgressItem) => {
    const CategoryIcon = getCategoryIcon(item.category);
    const TypeIcon = getTypeIcon(item.type);
    const isSelected = selectedItem?.id === item.id;
    const daysRemaining = getDaysRemaining(item.endDate);
    
    return (
      <Card
        key={item.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedItem(item)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(item.category))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium truncate">
                    {item.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(item.status))}
              >
                {item.status.replace('-', ' ')}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getPriorityColor(item.priority))}
              >
                {item.priority}
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
                <span className="font-medium">{item.progress}%</span>
              </div>
              <Progress
                value={item.progress}
                className="h-2"
                style={{
                  '--progress-background': getProgressColor(item.progress)
                } as React.CSSProperties}
              />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Current:</span>
                <span className="ml-1 font-medium">{item.current} {item.unit}</span>
              </div>
              <div>
                <span className="text-gray-500">Target:</span>
                <span className="ml-1 font-medium">{item.target} {item.unit}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.endDate)}</span>
              </div>
              <div className={cn(
                'font-medium',
                daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-gray-600'
              )}>
                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
              </div>
            </div>

            {/* Milestones */}
            {item.milestones.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Milestones</div>
                <div className="space-y-1">
                  {item.milestones.slice(0, 3).map((milestone) => (
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
                      <span className="truncate">{milestone.name}</span>
                    </div>
                  ))}
                  {item.milestones.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{item.milestones.length - 3} more milestones
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{item.tags.length - 3}
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
                    handleItemDuplicate(item);
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
                    handleItemArchive(item);
                  }}
                >
                  <Archive className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemDelete(item.id);
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

  const renderItemList = () => (
    <div className="space-y-2">
      {filteredItems.map((item) => {
        const daysRemaining = getDaysRemaining(item.endDate);
        const isSelected = selectedItem?.id === item.id;
        
        return (
          <div
            key={item.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getCategoryIcon(item.category), {
                className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(item.category))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{item.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(item.status))}
                  >
                    {item.status.replace('-', ' ')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getPriorityColor(item.priority))}
                  >
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{item.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{item.progress}%</div>
                <div>Progress</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{item.current}/{item.target}</div>
                <div>{item.unit}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatDate(item.endDate)}</div>
                <div className={cn(
                  daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-gray-500'
                )}>
                  {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderKanbanBoard = () => {
    const statusColumns = statuses.filter(s => s.value !== 'all');
    
    return (
      <div className="grid grid-cols-7 gap-4">
        {statusColumns.map((status) => {
          const statusItems = filteredItems.filter(item => item.status === status.value);
          
          return (
            <div key={status.value} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">{status.label}</h3>
                <Badge variant="outline" className="text-xs">
                  {statusItems.length}
                </Badge>
              </div>
              <div className="space-y-2 min-h-[400px]">
                {statusItems.map(renderItemCard)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Progress Tracking</h2>
          <p className="text-sm text-gray-500">Track and manage your growth initiatives</p>
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
          <Button onClick={handleItemCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Item
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
                    placeholder="Search items..."
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
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
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
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
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
            {filteredItems.map(renderItemCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderItemList()}
        
        {viewMode === 'kanban' && renderKanbanBoard()}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No progress items found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first progress item'
            }
          </p>
          <Button onClick={handleItemCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Progress Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;
