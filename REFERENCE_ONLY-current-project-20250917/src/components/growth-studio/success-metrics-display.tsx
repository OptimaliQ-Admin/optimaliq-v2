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
  BarChart3,
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

export interface SuccessMetric {
  id: string;
  name: string;
  description: string;
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation';
  type: 'revenue' | 'users' | 'conversion' | 'engagement' | 'efficiency' | 'custom';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
  target: {
    value: number;
    unit: string;
    format: 'number' | 'percentage' | 'currency' | 'ratio';
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  current: {
    value: number;
    unit: string;
    format: 'number' | 'percentage' | 'currency' | 'ratio';
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  progress: number; // 0-100
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  history: {
    date: Date;
    value: number;
    target: number;
  }[];
  benchmarks: {
    industry: number;
    competitor: number;
    previous: number;
  };
  alerts: {
    id: string;
    type: 'warning' | 'error' | 'success' | 'info';
    message: string;
    threshold: number;
    current: number;
    status: 'active' | 'resolved';
    createdAt: Date;
  }[];
  visualization: {
    type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar' | 'doughnut' | 'polar';
    config: {
      [key: string]: any;
    };
  };
  filters: {
    dateRange: {
      start: Date;
      end: Date;
    };
    segments: string[];
    dimensions: string[];
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

export interface SuccessMetricsDisplayProps {
  metrics: SuccessMetric[];
  onMetricCreate?: (metric: SuccessMetric) => void;
  onMetricUpdate?: (metric: SuccessMetric) => void;
  onMetricDelete?: (metricId: string) => void;
  onMetricDuplicate?: (metric: SuccessMetric) => void;
  onMetricArchive?: (metric: SuccessMetric) => void;
  onMetricPause?: (metric: SuccessMetric) => void;
  onMetricResume?: (metric: SuccessMetric) => void;
  onMetricComplete?: (metric: SuccessMetric) => void;
  onMetricCancel?: (metric: SuccessMetric) => void;
  onProgressUpdate?: (metric: SuccessMetric, progress: number) => void;
  onAlertAdd?: (metric: SuccessMetric, alert: any) => void;
  onAlertUpdate?: (metric: SuccessMetric, alertId: string, updates: any) => void;
  onAlertDelete?: (metric: SuccessMetric, alertId: string) => void;
  onVisualizationUpdate?: (metric: SuccessMetric, visualization: any) => void;
  onFilterUpdate?: (metric: SuccessMetric, filters: any) => void;
  onMetricExport?: (metric: SuccessMetric, format: string) => void;
  onMetricShare?: (metric: SuccessMetric) => void;
  className?: string;
}

const SuccessMetricsDisplay: React.FC<SuccessMetricsDisplayProps> = ({
  metrics,
  onMetricCreate,
  onMetricUpdate,
  onMetricDelete,
  onMetricDuplicate,
  onMetricArchive,
  onMetricPause,
  onMetricResume,
  onMetricComplete,
  onMetricCancel,
  onProgressUpdate,
  onAlertAdd,
  onAlertUpdate,
  onAlertDelete,
  onVisualizationUpdate,
  onFilterUpdate,
  onMetricExport,
  onMetricShare,
  className
}) => {
  const [selectedMetric, setSelectedMetric] = useState<SuccessMetric | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'progress' | 'status' | 'trend' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'dashboard'>('dashboard');
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
    { value: 'active', label: 'Active', color: 'text-blue-600' },
    { value: 'paused', label: 'Paused', color: 'text-yellow-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
    { value: 'archived', label: 'Archived', color: 'text-gray-600' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'text-gray-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'low', label: 'Low', color: 'text-green-600' }
  ];

  const filteredMetrics = metrics
    .filter(metric => {
      const matchesSearch = metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           metric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           metric.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || metric.category === filterCategory;
      const matchesType = filterType === 'all' || metric.type === filterType;
      const matchesStatus = filterStatus === 'all' || metric.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || metric.priority === filterPriority;
      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
          const statusOrder = { 'active': 4, 'paused': 3, 'completed': 2, 'cancelled': 1, 'archived': 0 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'trend':
          aValue = a.trend.percentage;
          bValue = b.trend.percentage;
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

  const handleMetricCreate = () => {
    const newMetric: SuccessMetric = {
      id: '',
      name: 'New Success Metric',
      description: 'A new success metric to track',
      category: 'acquisition',
      type: 'revenue',
      priority: 'medium',
      status: 'active',
      target: {
        value: 1000000,
        unit: 'USD',
        format: 'currency',
        period: 'monthly'
      },
      current: {
        value: 0,
        unit: 'USD',
        format: 'currency',
        period: 'monthly'
      },
      progress: 0,
      trend: {
        direction: 'stable',
        percentage: 0,
        period: '30 days'
      },
      history: [],
      benchmarks: {
        industry: 0,
        competitor: 0,
        previous: 0
      },
      alerts: [],
      visualization: {
        type: 'line',
        config: {}
      },
      filters: {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        segments: [],
        dimensions: []
      },
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onMetricCreate?.(newMetric);
  };

  const handleMetricUpdate = (metric: SuccessMetric, updates: Partial<SuccessMetric>) => {
    const updatedMetric = {
      ...metric,
      ...updates,
      updatedAt: new Date()
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

  const handleMetricDuplicate = (metric: SuccessMetric) => {
    const duplicatedMetric = {
      ...metric,
      id: '',
      name: `${metric.name} (Copy)`,
      status: 'active',
      progress: 0,
      current: {
        ...metric.current,
        value: 0
      },
      history: [],
      alerts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onMetricDuplicate?.(duplicatedMetric);
  };

  const handleMetricArchive = (metric: SuccessMetric) => {
    onMetricArchive?.(metric);
  };

  const handleMetricPause = (metric: SuccessMetric) => {
    onMetricPause?.(metric);
  };

  const handleMetricResume = (metric: SuccessMetric) => {
    onMetricResume?.(metric);
  };

  const handleMetricComplete = (metric: SuccessMetric) => {
    onMetricComplete?.(metric);
  };

  const handleMetricCancel = (metric: SuccessMetric) => {
    onMetricCancel?.(metric);
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

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      case 'stable':
        return <Minus className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const renderMetricCard = (metric: SuccessMetric) => {
    const CategoryIcon = getCategoryIcon(metric.category);
    const TypeIcon = getTypeIcon(metric.type);
    const isSelected = selectedMetric?.id === metric.id;
    
    return (
      <Card
        key={metric.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedMetric(metric)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(metric.category))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium truncate">
                    {metric.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {metric.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
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
            {/* Current Value */}
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatValue(metric.current.value, metric.current.format)}
              </div>
              <div className="text-xs text-gray-500">
                {metric.current.unit} • {metric.current.period}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{metric.progress}%</span>
              </div>
              <Progress
                value={metric.progress}
                className="h-2"
                style={{
                  '--progress-background': getProgressColor(metric.progress)
                } as React.CSSProperties}
              />
            </div>

            {/* Trend */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">Trend</span>
                <div className={cn('flex items-center space-x-1', getTrendColor(metric.trend.direction))}>
                  {getTrendIcon(metric.trend.direction)}
                  <span className="font-medium">{Math.abs(metric.trend.percentage).toFixed(1)}%</span>
                </div>
              </div>
              <span className="text-gray-500">{metric.trend.period}</span>
            </div>

            {/* Target */}
            <div className="text-center text-xs text-gray-500">
              Target: {formatValue(metric.target.value, metric.target.format)} {metric.target.unit}
            </div>

            {/* Alerts */}
            {metric.alerts.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Alerts</div>
                <div className="space-y-1">
                  {metric.alerts.slice(0, 2).map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-2 text-xs">
                      <CircleAlert className={cn(
                        'h-3 w-3',
                        alert.type === 'error' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' :
                        alert.type === 'success' ? 'text-green-500' : 'text-blue-500'
                      )} />
                      <span className="truncate">{alert.message}</span>
                    </div>
                  ))}
                  {metric.alerts.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{metric.alerts.length - 2} more alerts
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {metric.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {metric.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {metric.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{metric.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                {metric.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMetricPause(metric);
                    }}
                  >
                    <Pause className="h-3 w-3 text-yellow-500" />
                  </Button>
                )}
                {metric.status === 'paused' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMetricResume(metric);
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
              {React.createElement(getCategoryIcon(metric.category), {
                className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(metric.category))
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
                <div className="font-medium">{formatValue(metric.current.value, metric.current.format)}</div>
                <div>Current</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{metric.progress}%</div>
                <div>Progress</div>
              </div>
              <div className="text-center">
                <div className={cn('font-medium', getTrendColor(metric.trend.direction))}>
                  {getTrendIcon(metric.trend.direction)}
                  <span className="ml-1">{Math.abs(metric.trend.percentage).toFixed(1)}%</span>
                </div>
                <div>Trend</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatValue(metric.target.value, metric.target.format)}</div>
                <div>Target</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredMetrics.map(renderMetricCard)}
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Success Metrics Display</h2>
          <p className="text-sm text-gray-500">Track and visualize your key performance indicators</p>
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
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="trend">Trend</SelectItem>
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
        {viewMode === 'dashboard' && renderDashboard()}
        
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMetrics.map(renderMetricCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderMetricList()}
      </div>

      {/* Empty State */}
      {filteredMetrics.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No metrics found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first success metric'
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

export default SuccessMetricsDisplay;
