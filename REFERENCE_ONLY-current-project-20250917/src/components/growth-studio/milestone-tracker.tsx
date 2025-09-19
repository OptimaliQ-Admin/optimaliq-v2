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
  Flag,
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

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation';
  type: 'goal' | 'project' | 'feature' | 'campaign' | 'experiment' | 'custom';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled' | 'overdue' | 'paused';
  progress: number; // 0-100
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
  timeline: {
    startDate: Date;
    targetDate: Date;
    completedDate?: Date;
    estimatedDuration: number; // in days
    actualDuration?: number; // in days
  };
  dependencies: {
    id: string;
    title: string;
    status: 'pending' | 'completed' | 'blocked';
  }[];
  blockers: {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'resolved';
  }[];
  metrics: {
    primary: string;
    secondary: string[];
    targets: {
      [key: string]: number;
    };
    current: {
      [key: string]: number;
    };
  };
  resources: {
    team: string[];
    budget: number;
    tools: string[];
  };
  notes: {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
    type: 'note' | 'update' | 'issue' | 'celebration';
  }[];
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

export interface MilestoneTrackerProps {
  milestones: Milestone[];
  onMilestoneCreate?: (milestone: Milestone) => void;
  onMilestoneUpdate?: (milestone: Milestone) => void;
  onMilestoneDelete?: (milestoneId: string) => void;
  onMilestoneDuplicate?: (milestone: Milestone) => void;
  onMilestoneArchive?: (milestone: Milestone) => void;
  onMilestoneStart?: (milestone: Milestone) => void;
  onMilestonePause?: (milestone: Milestone) => void;
  onMilestoneComplete?: (milestone: Milestone) => void;
  onMilestoneCancel?: (milestone: Milestone) => void;
  onProgressUpdate?: (milestone: Milestone, progress: number) => void;
  onDependencyAdd?: (milestone: Milestone, dependency: any) => void;
  onDependencyUpdate?: (milestone: Milestone, dependencyId: string, updates: any) => void;
  onDependencyDelete?: (milestone: Milestone, dependencyId: string) => void;
  onBlockerAdd?: (milestone: Milestone, blocker: any) => void;
  onBlockerUpdate?: (milestone: Milestone, blockerId: string, updates: any) => void;
  onBlockerDelete?: (milestone: Milestone, blockerId: string) => void;
  onNoteAdd?: (milestone: Milestone, note: any) => void;
  onNoteUpdate?: (milestone: Milestone, noteId: string, updates: any) => void;
  onNoteDelete?: (milestone: Milestone, noteId: string) => void;
  onMilestoneExport?: (milestone: Milestone, format: string) => void;
  onMilestoneShare?: (milestone: Milestone) => void;
  className?: string;
}

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
  onMilestoneCreate,
  onMilestoneUpdate,
  onMilestoneDelete,
  onMilestoneDuplicate,
  onMilestoneArchive,
  onMilestoneStart,
  onMilestonePause,
  onMilestoneComplete,
  onMilestoneCancel,
  onProgressUpdate,
  onDependencyAdd,
  onDependencyUpdate,
  onDependencyDelete,
  onBlockerAdd,
  onBlockerUpdate,
  onBlockerDelete,
  onNoteAdd,
  onNoteUpdate,
  onNoteDelete,
  onMilestoneExport,
  onMilestoneShare,
  className
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'priority' | 'progress' | 'status' | 'targetDate' | 'createdAt'>('title');
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

  const types = [
    { value: 'all', label: 'All Types', icon: Grid },
    { value: 'goal', label: 'Goal', icon: Target, color: 'text-blue-600' },
    { value: 'project', label: 'Project', icon: Building2, color: 'text-green-600' },
    { value: 'feature', label: 'Feature', icon: Zap, color: 'text-purple-600' },
    { value: 'campaign', label: 'Campaign', icon: Activity, color: 'text-orange-600' },
    { value: 'experiment', label: 'Experiment', icon: Lightbulb, color: 'text-indigo-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'planned', label: 'Planned', color: 'text-gray-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
    { value: 'overdue', label: 'Overdue', color: 'text-red-600' },
    { value: 'paused', label: 'Paused', color: 'text-yellow-600' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'text-gray-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'low', label: 'Low', color: 'text-green-600' }
  ];

  const filteredMilestones = milestones
    .filter(milestone => {
      const matchesSearch = milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           milestone.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           milestone.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || milestone.category === filterCategory;
      const matchesType = filterType === 'all' || milestone.type === filterType;
      const matchesStatus = filterStatus === 'all' || milestone.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || milestone.priority === filterPriority;
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
          const statusOrder = { 'in-progress': 4, 'planned': 3, 'paused': 2, 'completed': 1, 'cancelled': 0, 'overdue': 5 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'targetDate':
          aValue = a.timeline.targetDate.getTime();
          bValue = b.timeline.targetDate.getTime();
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

  const handleMilestoneCreate = () => {
    const newMilestone: Milestone = {
      id: '',
      title: 'New Milestone',
      description: 'A new milestone to track',
      category: 'acquisition',
      type: 'goal',
      priority: 'medium',
      status: 'planned',
      progress: 0,
      target: {
        value: 100,
        unit: 'units',
        format: 'number'
      },
      current: {
        value: 0,
        unit: 'units',
        format: 'number'
      },
      timeline: {
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        estimatedDuration: 30
      },
      dependencies: [],
      blockers: [],
      metrics: {
        primary: 'Progress',
        secondary: ['Quality', 'Speed'],
        targets: {},
        current: {}
      },
      resources: {
        team: [],
        budget: 0,
        tools: []
      },
      notes: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onMilestoneCreate?.(newMilestone);
  };

  const handleMilestoneUpdate = (milestone: Milestone, updates: Partial<Milestone>) => {
    const updatedMilestone = {
      ...milestone,
      ...updates,
      updatedAt: new Date()
    };
    setSelectedMilestone(updatedMilestone);
    onMilestoneUpdate?.(updatedMilestone);
  };

  const handleMilestoneDelete = (milestoneId: string) => {
    onMilestoneDelete?.(milestoneId);
    if (selectedMilestone?.id === milestoneId) {
      setSelectedMilestone(null);
    }
  };

  const handleMilestoneDuplicate = (milestone: Milestone) => {
    const duplicatedMilestone = {
      ...milestone,
      id: '',
      title: `${milestone.title} (Copy)`,
      status: 'planned',
      progress: 0,
      current: {
        ...milestone.current,
        value: 0
      },
      timeline: {
        ...milestone.timeline,
        completedDate: undefined,
        actualDuration: undefined
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onMilestoneDuplicate?.(duplicatedMilestone);
  };

  const handleMilestoneArchive = (milestone: Milestone) => {
    onMilestoneArchive?.(milestone);
  };

  const handleMilestoneStart = (milestone: Milestone) => {
    onMilestoneStart?.(milestone);
  };

  const handleMilestonePause = (milestone: Milestone) => {
    onMilestonePause?.(milestone);
  };

  const handleMilestoneComplete = (milestone: Milestone) => {
    onMilestoneComplete?.(milestone);
  };

  const handleMilestoneCancel = (milestone: Milestone) => {
    onMilestoneCancel?.(milestone);
  };

  const handleProgressUpdate = (milestone: Milestone, progress: number) => {
    onProgressUpdate?.(milestone, progress);
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

  const getDaysRemaining = (targetDate: Date) => {
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <Circle className="h-4 w-4" />;
      case 'in-progress':
        return <CirclePlay className="h-4 w-4" />;
      case 'completed':
        return <CircleCheck className="h-4 w-4" />;
      case 'cancelled':
        return <CircleX className="h-4 w-4" />;
      case 'overdue':
        return <CircleAlert className="h-4 w-4" />;
      case 'paused':
        return <CirclePause className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const renderMilestoneCard = (milestone: Milestone) => {
    const CategoryIcon = getCategoryIcon(milestone.category);
    const TypeIcon = getTypeIcon(milestone.type);
    const isSelected = selectedMilestone?.id === milestone.id;
    const daysRemaining = getDaysRemaining(milestone.timeline.targetDate);
    
    return (
      <Card
        key={milestone.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedMilestone(milestone)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(milestone.category))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium truncate">
                    {milestone.title}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {milestone.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(milestone.status))}
              >
                {milestone.status.replace('-', ' ')}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getPriorityColor(milestone.priority))}
              >
                {milestone.priority}
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
                <span className="font-medium">{milestone.progress}%</span>
              </div>
              <Progress
                value={milestone.progress}
                className="h-2"
                style={{
                  '--progress-background': getProgressColor(milestone.progress)
                } as React.CSSProperties}
              />
            </div>

            {/* Target vs Current */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Current:</span>
                <span className="ml-1 font-medium">{formatValue(milestone.current.value, milestone.current.format)}</span>
              </div>
              <div>
                <span className="text-gray-500">Target:</span>
                <span className="ml-1 font-medium">{formatValue(milestone.target.value, milestone.target.format)}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{milestone.timeline.targetDate.toLocaleDateString()}</span>
              </div>
              <div className={cn(
                'font-medium',
                daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-gray-600'
              )}>
                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
              </div>
            </div>

            {/* Dependencies */}
            {milestone.dependencies.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Dependencies</div>
                <div className="space-y-1">
                  {milestone.dependencies.slice(0, 3).map((dependency) => (
                    <div key={dependency.id} className="flex items-center space-x-2 text-xs">
                      {dependency.status === 'completed' ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : dependency.status === 'blocked' ? (
                        <CircleX className="h-3 w-3 text-red-500" />
                      ) : (
                        <Circle className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="truncate">{dependency.title}</span>
                    </div>
                  ))}
                  {milestone.dependencies.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{milestone.dependencies.length - 3} more dependencies
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Blockers */}
            {milestone.blockers.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Blockers</div>
                <div className="space-y-1">
                  {milestone.blockers.slice(0, 2).map((blocker) => (
                    <div key={blocker.id} className="flex items-center space-x-2 text-xs">
                      <CircleAlert className={cn(
                        'h-3 w-3',
                        blocker.severity === 'critical' ? 'text-red-500' :
                        blocker.severity === 'high' ? 'text-orange-500' :
                        blocker.severity === 'medium' ? 'text-yellow-500' : 'text-gray-500'
                      )} />
                      <span className="truncate">{blocker.title}</span>
                    </div>
                  ))}
                  {milestone.blockers.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{milestone.blockers.length - 2} more blockers
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {milestone.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {milestone.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {milestone.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{milestone.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                {milestone.status === 'planned' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMilestoneStart(milestone);
                    }}
                  >
                    <Play className="h-3 w-3 text-green-500" />
                  </Button>
                )}
                {milestone.status === 'in-progress' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMilestonePause(milestone);
                    }}
                  >
                    <Pause className="h-3 w-3 text-yellow-500" />
                  </Button>
                )}
                {milestone.status === 'paused' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMilestoneStart(milestone);
                    }}
                  >
                    <Play className="h-3 w-3 text-green-500" />
                  </Button>
                )}
                {milestone.status === 'in-progress' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMilestoneComplete(milestone);
                    }}
                  >
                    <CheckCircle className="h-3 w-3 text-blue-500" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMilestoneDuplicate(milestone);
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
                    onMilestoneShare?.(milestone);
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
                  handleMilestoneDelete(milestone.id);
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

  const renderMilestoneList = () => (
    <div className="space-y-2">
      {filteredMilestones.map((milestone) => {
        const isSelected = selectedMilestone?.id === milestone.id;
        const daysRemaining = getDaysRemaining(milestone.timeline.targetDate);
        
        return (
          <div
            key={milestone.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedMilestone(milestone)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getCategoryIcon(milestone.category), {
                className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(milestone.category))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{milestone.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(milestone.status))}
                  >
                    {milestone.status.replace('-', ' ')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getPriorityColor(milestone.priority))}
                  >
                    {milestone.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{milestone.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{milestone.progress}%</div>
                <div>Progress</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatValue(milestone.current.value, milestone.current.format)}</div>
                <div>Current</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatValue(milestone.target.value, milestone.target.format)}</div>
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

  const renderKanbanBoard = () => {
    const statusColumns = statuses.filter(s => s.value !== 'all');
    
    return (
      <div className="grid grid-cols-7 gap-4">
        {statusColumns.map((status) => {
          const statusMilestones = filteredMilestones.filter(milestone => milestone.status === status.value);
          
          return (
            <div key={status.value} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">{status.label}</h3>
                <Badge variant="outline" className="text-xs">
                  {statusMilestones.length}
                </Badge>
              </div>
              <div className="space-y-2 min-h-[400px]">
                {statusMilestones.map(renderMilestoneCard)}
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
          <h2 className="text-xl font-semibold">Milestone Tracker</h2>
          <p className="text-sm text-gray-500">Track and manage your growth milestones</p>
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
          <Button onClick={handleMilestoneCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Milestone
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
                    placeholder="Search milestones..."
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
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="targetDate">Target Date</SelectItem>
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
            {filteredMilestones.map(renderMilestoneCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderMilestoneList()}
        
        {viewMode === 'kanban' && renderKanbanBoard()}
      </div>

      {/* Empty State */}
      {filteredMilestones.length === 0 && (
        <div className="text-center py-12">
          <Flag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first milestone'
            }
          </p>
          <Button onClick={handleMilestoneCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Milestone
          </Button>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;
