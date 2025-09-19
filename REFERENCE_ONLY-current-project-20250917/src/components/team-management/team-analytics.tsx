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
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  RadarChart,
  DoughnutChart,
  PolarChart,
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
  Heart,
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

export interface TeamAnalytics {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'report' | 'insight' | 'kpi' | 'metric' | 'trend' | 'comparison' | 'custom';
  category: 'performance' | 'productivity' | 'collaboration' | 'engagement' | 'growth' | 'efficiency' | 'custom';
  status: 'active' | 'paused' | 'draft' | 'archived';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }[];
  };
  metrics: {
    total: number;
    average: number;
    median: number;
    min: number;
    max: number;
    standardDeviation: number;
    variance: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  insights: {
    id: string;
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral' | 'warning' | 'info';
    impact: 'low' | 'medium' | 'high' | 'critical';
    confidence: number; // 0-100
    recommendations: string[];
  }[];
  filters: {
    dateRange: {
      start: Date;
      end: Date;
    };
    segments: string[];
    dimensions: string[];
    metrics: string[];
  };
  refresh: {
    interval: number; // in minutes
    lastUpdated: Date;
    autoRefresh: boolean;
  };
  sharing: {
    public: boolean;
    embeddable: boolean;
    downloadable: boolean;
    password?: string;
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

export interface TeamAnalyticsProps {
  analytics: TeamAnalytics[];
  onAnalyticsCreate?: (analytics: TeamAnalytics) => void;
  onAnalyticsUpdate?: (analytics: TeamAnalytics) => void;
  onAnalyticsDelete?: (analyticsId: string) => void;
  onAnalyticsDuplicate?: (analytics: TeamAnalytics) => void;
  onAnalyticsArchive?: (analytics: TeamAnalytics) => void;
  onAnalyticsPause?: (analytics: TeamAnalytics) => void;
  onAnalyticsResume?: (analytics: TeamAnalytics) => void;
  onDataUpdate?: (analytics: TeamAnalytics, data: any) => void;
  onInsightAdd?: (analytics: TeamAnalytics, insight: any) => void;
  onInsightUpdate?: (analytics: TeamAnalytics, insightId: string, updates: any) => void;
  onInsightDelete?: (analytics: TeamAnalytics, insightId: string) => void;
  onAnalyticsExport?: (analytics: TeamAnalytics, format: string) => void;
  onAnalyticsShare?: (analytics: TeamAnalytics) => void;
  className?: string;
}

const TeamAnalytics: React.FC<TeamAnalyticsProps> = ({
  analytics = [],
  onAnalyticsCreate,
  onAnalyticsUpdate,
  onAnalyticsDelete,
  onAnalyticsDuplicate,
  onAnalyticsArchive,
  onAnalyticsPause,
  onAnalyticsResume,
  onDataUpdate,
  onInsightAdd,
  onInsightUpdate,
  onInsightDelete,
  onAnalyticsExport,
  onAnalyticsShare,
  className
}) => {
  const [selectedAnalytics, setSelectedAnalytics] = useState<TeamAnalytics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'category' | 'status' | 'updatedAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'dashboard'>('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const types = [
    { value: 'all', label: 'All Types', icon: BarChart3, color: 'text-gray-600' },
    { value: 'dashboard', label: 'Dashboard', icon: Grid, color: 'text-blue-600' },
    { value: 'report', label: 'Report', icon: FileText, color: 'text-green-600' },
    { value: 'insight', label: 'Insight', icon: Lightbulb, color: 'text-purple-600' },
    { value: 'kpi', label: 'KPI', icon: Target, color: 'text-orange-600' },
    { value: 'metric', label: 'Metric', icon: TrendingUp, color: 'text-indigo-600' },
    { value: 'trend', label: 'Trend', icon: LineChart, color: 'text-pink-600' },
    { value: 'comparison', label: 'Comparison', icon: BarChart3, color: 'text-teal-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: Grid, color: 'text-gray-600' },
    { value: 'performance', label: 'Performance', icon: Target, color: 'text-blue-600' },
    { value: 'productivity', label: 'Productivity', icon: Zap, color: 'text-green-600' },
    { value: 'collaboration', label: 'Collaboration', icon: Users, color: 'text-purple-600' },
    { value: 'engagement', label: 'Engagement', icon: Heart, color: 'text-orange-600' },
    { value: 'growth', label: 'Growth', icon: TrendingUp, color: 'text-indigo-600' },
    { value: 'efficiency', label: 'Efficiency', icon: Activity, color: 'text-pink-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'active', label: 'Active', color: 'text-green-600' },
    { value: 'paused', label: 'Paused', color: 'text-yellow-600' },
    { value: 'draft', label: 'Draft', color: 'text-gray-600' },
    { value: 'archived', label: 'Archived', color: 'text-gray-600' }
  ];

  const filteredAnalytics = analytics
    .filter(analytics => {
      const matchesSearch = analytics.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           analytics.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           analytics.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' || analytics.type === filterType;
      const matchesCategory = filterCategory === 'all' || analytics.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || analytics.status === filterStatus;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
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
          const statusOrder = { 'active': 4, 'draft': 3, 'paused': 2, 'archived': 1 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
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

  const handleAnalyticsCreate = () => {
    const newAnalytics: TeamAnalytics = {
      id: '',
      name: 'New Team Analytics',
      description: 'A new team analytics dashboard',
      type: 'dashboard',
      category: 'performance',
      status: 'draft',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Team Performance',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        }]
      },
      metrics: {
        total: 44,
        average: 7.33,
        median: 4,
        min: 2,
        max: 19,
        standardDeviation: 6.8,
        variance: 46.2,
        growth: 15.2,
        trend: 'up'
      },
      insights: [],
      filters: {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        segments: [],
        dimensions: [],
        metrics: []
      },
      refresh: {
        interval: 60,
        lastUpdated: new Date(),
        autoRefresh: true
      },
      sharing: {
        public: false,
        embeddable: false,
        downloadable: true
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0',
        tags: [],
        visibility: 'private'
      }
    };
    onAnalyticsCreate?.(newAnalytics);
  };

  const handleAnalyticsUpdate = (analytics: TeamAnalytics, updates: Partial<TeamAnalytics>) => {
    const updatedAnalytics = {
      ...analytics,
      ...updates,
      metadata: {
        ...analytics.metadata,
        ...updates.metadata,
        updatedAt: new Date()
      }
    };
    setSelectedAnalytics(updatedAnalytics);
    onAnalyticsUpdate?.(updatedAnalytics);
  };

  const handleAnalyticsDelete = (analyticsId: string) => {
    onAnalyticsDelete?.(analyticsId);
    if (selectedAnalytics?.id === analyticsId) {
      setSelectedAnalytics(null);
    }
  };

  const handleAnalyticsDuplicate = (analytics: TeamAnalytics) => {
    const duplicatedAnalytics = {
      ...analytics,
      id: '',
      name: `${analytics.name} (Copy)`,
      status: 'draft',
      metadata: {
        ...analytics.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    onAnalyticsDuplicate?.(duplicatedAnalytics);
  };

  const handleAnalyticsArchive = (analytics: TeamAnalytics) => {
    onAnalyticsArchive?.(analytics);
  };

  const handleAnalyticsPause = (analytics: TeamAnalytics) => {
    onAnalyticsPause?.(analytics);
  };

  const handleAnalyticsResume = (analytics: TeamAnalytics) => {
    onAnalyticsResume?.(analytics);
  };

  const getTypeIcon = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.icon || BarChart3;
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatLastUpdated = (date: Date) => {
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

  const renderAnalyticsCard = (analytics: TeamAnalytics) => {
    const TypeIcon = getTypeIcon(analytics.type);
    const CategoryIcon = getCategoryIcon(analytics.category);
    const TrendIcon = getTrendIcon(analytics.metrics.trend);
    const isSelected = selectedAnalytics?.id === analytics.id;
    
    return (
      <Card
        key={analytics.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedAnalytics(analytics)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center shadow-lg',
                `bg-gradient-to-r ${getTypeColor(analytics.type).replace('text-', 'from-').replace('-600', '-500')} to-${getTypeColor(analytics.type).replace('text-', '').replace('-600', '-700')}`
              )}>
                <TypeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <CardTitle className="text-sm font-medium truncate">
                    {analytics.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {analytics.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(analytics.status))}
              >
                {analytics.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Chart Preview */}
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TypeIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">{analytics.type} Chart</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Total:</span>
                <span className="ml-1 font-medium">{analytics.metrics.total}</span>
              </div>
              <div>
                <span className="text-gray-500">Average:</span>
                <span className="ml-1 font-medium">{analytics.metrics.average.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-gray-500">Growth:</span>
                <span className={cn('ml-1 font-medium', getTrendColor(analytics.metrics.trend))}>
                  {analytics.metrics.growth > 0 ? '+' : ''}{analytics.metrics.growth.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendIcon className={cn('h-3 w-3', getTrendColor(analytics.metrics.trend))} />
                <span className={cn('text-xs', getTrendColor(analytics.metrics.trend))}>
                  {analytics.metrics.trend}
                </span>
              </div>
            </div>

            {/* Insights */}
            {analytics.insights.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Insights</div>
                <div className="space-y-1">
                  {analytics.insights.slice(0, 2).map((insight) => (
                    <div key={insight.id} className="flex items-center space-x-2 text-xs">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        getInsightTypeColor(insight.type).replace('text-', 'bg-')
                      )}></div>
                      <span className="text-gray-600 truncate">{insight.title}</span>
                    </div>
                  ))}
                  {analytics.insights.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{analytics.insights.length - 2} more insights
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Category */}
            <div className="flex items-center space-x-1">
              <CategoryIcon className={cn('h-3 w-3', getCategoryColor(analytics.category))} />
              <span className={cn('text-xs', getCategoryColor(analytics.category))}>
                {analytics.category}
              </span>
            </div>

            {/* Refresh Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Updated {formatLastUpdated(analytics.refresh.lastUpdated)}</span>
              </div>
              {analytics.refresh.autoRefresh && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {analytics.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {analytics.metadata.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {analytics.metadata.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{analytics.metadata.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                {analytics.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnalyticsPause(analytics);
                    }}
                  >
                    <Pause className="h-3 w-3 text-yellow-500" />
                  </Button>
                )}
                {analytics.status === 'paused' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnalyticsResume(analytics);
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
                    handleAnalyticsDuplicate(analytics);
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
                    onAnalyticsShare?.(analytics);
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
                  handleAnalyticsDelete(analytics.id);
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

  const renderAnalyticsList = () => (
    <div className="space-y-2">
      {filteredAnalytics.map((analytics) => {
        const isSelected = selectedAnalytics?.id === analytics.id;
        
        return (
          <div
            key={analytics.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedAnalytics(analytics)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getTypeIcon(analytics.type), {
                className: cn('h-4 w-4 flex-shrink-0', getTypeColor(analytics.type))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{analytics.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(analytics.status))}
                  >
                    {analytics.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getCategoryColor(analytics.category))}
                  >
                    {analytics.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{analytics.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{analytics.metrics.total}</div>
                <div>Total</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{analytics.metrics.average.toFixed(1)}</div>
                <div>Average</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{analytics.insights.length}</div>
                <div>Insights</div>
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
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Analytics</p>
                <p className="text-2xl font-bold">{analytics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">
                  {analytics.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Total Insights</p>
                <p className="text-2xl font-bold">
                  {analytics.reduce((sum, a) => sum + a.insights.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Avg Growth</p>
                <p className="text-2xl font-bold">
                  {analytics.length > 0 
                    ? (analytics.reduce((sum, a) => sum + a.metrics.growth, 0) / analytics.length).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAnalytics.map(renderAnalyticsCard)}
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Team Analytics</h2>
          <p className="text-sm text-gray-500">Analyze team performance and generate insights</p>
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
          <Button onClick={handleAnalyticsCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Analytics
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
                    placeholder="Search analytics..."
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
            {filteredAnalytics.map(renderAnalyticsCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderAnalyticsList()}
      </div>

      {/* Empty State */}
      {filteredAnalytics.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterType !== 'all' || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first team analytics dashboard'
            }
          </p>
          <Button onClick={handleAnalyticsCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Analytics
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamAnalytics;
