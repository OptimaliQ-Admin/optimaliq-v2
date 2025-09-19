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

export interface ProgressVisualization {
  id: string;
  name: string;
  description: string;
  type: 'line' | 'bar' | 'area' | 'pie' | 'doughnut' | 'radar' | 'scatter' | 'gauge' | 'funnel' | 'heatmap' | 'treemap' | 'sankey';
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation' | 'custom';
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
  options: {
    responsive: boolean;
    maintainAspectRatio: boolean;
    plugins: {
      title: {
        display: boolean;
        text: string;
      };
      legend: {
        display: boolean;
        position: 'top' | 'bottom' | 'left' | 'right';
      };
      tooltip: {
        enabled: boolean;
        mode: 'index' | 'point' | 'nearest' | 'single' | 'label' | 'x-axis' | 'dataset';
      };
    };
    scales?: {
      x?: {
        display: boolean;
        title: {
          display: boolean;
          text: string;
        };
      };
      y?: {
        display: boolean;
        title: {
          display: boolean;
          text: string;
        };
        beginAtZero?: boolean;
      };
    };
  };
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
  annotations: {
    id: string;
    type: 'line' | 'box' | 'point' | 'label';
    x: number | string;
    y?: number;
    label: string;
    color: string;
    description?: string;
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

export interface ProgressVisualizationProps {
  visualizations: ProgressVisualization[];
  onVisualizationCreate?: (visualization: ProgressVisualization) => void;
  onVisualizationUpdate?: (visualization: ProgressVisualization) => void;
  onVisualizationDelete?: (visualizationId: string) => void;
  onVisualizationDuplicate?: (visualization: ProgressVisualization) => void;
  onVisualizationArchive?: (visualization: ProgressVisualization) => void;
  onVisualizationPause?: (visualization: ProgressVisualization) => void;
  onVisualizationResume?: (visualization: ProgressVisualization) => void;
  onDataUpdate?: (visualization: ProgressVisualization, data: any) => void;
  onOptionsUpdate?: (visualization: ProgressVisualization, options: any) => void;
  onFilterUpdate?: (visualization: ProgressVisualization, filters: any) => void;
  onAnnotationAdd?: (visualization: ProgressVisualization, annotation: any) => void;
  onAnnotationUpdate?: (visualization: ProgressVisualization, annotationId: string, updates: any) => void;
  onAnnotationDelete?: (visualization: ProgressVisualization, annotationId: string) => void;
  onVisualizationExport?: (visualization: ProgressVisualization, format: string) => void;
  onVisualizationShare?: (visualization: ProgressVisualization) => void;
  className?: string;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  visualizations = [],
  onVisualizationCreate,
  onVisualizationUpdate,
  onVisualizationDelete,
  onVisualizationDuplicate,
  onVisualizationArchive,
  onVisualizationPause,
  onVisualizationResume,
  onDataUpdate,
  onOptionsUpdate,
  onFilterUpdate,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
  onVisualizationExport,
  onVisualizationShare,
  className
}) => {
  const [selectedVisualization, setSelectedVisualization] = useState<ProgressVisualization | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'category' | 'status' | 'updatedAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'dashboard'>('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');

  const categories = [
    { value: 'all', label: 'All Categories', icon: Grid },
    { value: 'acquisition', label: 'Acquisition', icon: Users, color: 'text-blue-600' },
    { value: 'retention', label: 'Retention', icon: Target, color: 'text-green-600' },
    { value: 'monetization', label: 'Monetization', icon: DollarSign, color: 'text-purple-600' },
    { value: 'efficiency', label: 'Efficiency', icon: Zap, color: 'text-orange-600' },
    { value: 'expansion', label: 'Expansion', icon: TrendingUp, color: 'text-indigo-600' },
    { value: 'innovation', label: 'Innovation', icon: Lightbulb, color: 'text-pink-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const types = [
    { value: 'all', label: 'All Types', icon: Grid },
    { value: 'line', label: 'Line Chart', icon: LineChart, color: 'text-blue-600' },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3, color: 'text-green-600' },
    { value: 'area', label: 'Area Chart', icon: AreaChart, color: 'text-purple-600' },
    { value: 'pie', label: 'Pie Chart', icon: PieChart, color: 'text-orange-600' },
    { value: 'doughnut', label: 'Doughnut Chart', icon: PieChart, color: 'text-indigo-600' },
    { value: 'radar', label: 'Radar Chart', icon: Target, color: 'text-pink-600' },
    { value: 'scatter', label: 'Scatter Plot', icon: ScatterChart, color: 'text-red-600' },
    { value: 'gauge', label: 'Gauge', icon: Target, color: 'text-yellow-600' },
    { value: 'funnel', label: 'Funnel', icon: TrendingDown, color: 'text-cyan-600' },
    { value: 'heatmap', label: 'Heatmap', icon: Grid, color: 'text-teal-600' },
    { value: 'treemap', label: 'Treemap', icon: Layers, color: 'text-lime-600' },
    { value: 'sankey', label: 'Sankey', icon: ArrowRight, color: 'text-amber-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'active', label: 'Active', color: 'text-blue-600' },
    { value: 'paused', label: 'Paused', color: 'text-yellow-600' },
    { value: 'draft', label: 'Draft', color: 'text-gray-600' },
    { value: 'archived', label: 'Archived', color: 'text-gray-600' }
  ];

  const filteredVisualizations = visualizations
    .filter(visualization => {
      const matchesSearch = visualization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           visualization.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           visualization.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || visualization.category === filterCategory;
      const matchesType = filterType === 'all' || visualization.type === filterType;
      const matchesStatus = filterStatus === 'all' || visualization.status === filterStatus;
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
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

  const handleVisualizationCreate = () => {
    const newVisualization: ProgressVisualization = {
      id: '',
      name: 'New Progress Visualization',
      description: 'A new progress visualization',
      type: 'line',
      category: 'acquisition',
      status: 'draft',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Progress',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Progress Over Time'
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true,
            mode: 'index'
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time Period'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            },
            beginAtZero: true
          }
        }
      },
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
      annotations: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0',
        tags: [],
        visibility: 'private'
      }
    };
    onVisualizationCreate?.(newVisualization);
  };

  const handleVisualizationUpdate = (visualization: ProgressVisualization, updates: Partial<ProgressVisualization>) => {
    const updatedVisualization = {
      ...visualization,
      ...updates,
      metadata: {
        ...visualization.metadata,
        ...updates.metadata,
        updatedAt: new Date()
      }
    };
    setSelectedVisualization(updatedVisualization);
    onVisualizationUpdate?.(updatedVisualization);
  };

  const handleVisualizationDelete = (visualizationId: string) => {
    onVisualizationDelete?.(visualizationId);
    if (selectedVisualization?.id === visualizationId) {
      setSelectedVisualization(null);
    }
  };

  const handleVisualizationDuplicate = (visualization: ProgressVisualization) => {
    const duplicatedVisualization = {
      ...visualization,
      id: '',
      name: `${visualization.name} (Copy)`,
      status: 'draft',
      metadata: {
        ...visualization.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    onVisualizationDuplicate?.(duplicatedVisualization);
  };

  const handleVisualizationArchive = (visualization: ProgressVisualization) => {
    onVisualizationArchive?.(visualization);
  };

  const handleVisualizationPause = (visualization: ProgressVisualization) => {
    onVisualizationPause?.(visualization);
  };

  const handleVisualizationResume = (visualization: ProgressVisualization) => {
    onVisualizationResume?.(visualization);
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
    return typeData?.icon || BarChart3;
  };

  const getTypeColor = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.color || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const statusData = statuses.find(s => s.value === status);
    return statusData?.color || 'text-gray-600';
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

  const renderVisualizationCard = (visualization: ProgressVisualization) => {
    const CategoryIcon = getCategoryIcon(visualization.category);
    const TypeIcon = getTypeIcon(visualization.type);
    const isSelected = selectedVisualization?.id === visualization.id;
    
    return (
      <Card
        key={visualization.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedVisualization(visualization)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(visualization.category))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium truncate">
                    {visualization.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {visualization.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(visualization.status))}
              >
                {visualization.status}
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
                <p className="text-xs">{visualization.type} Chart</p>
              </div>
            </div>

            {/* Data Info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Datasets:</span>
                <span className="ml-1 font-medium">{visualization.data.datasets.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Data Points:</span>
                <span className="ml-1 font-medium">{visualization.data.labels.length}</span>
              </div>
            </div>

            {/* Refresh Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Updated {formatLastUpdated(visualization.refresh.lastUpdated)}</span>
              </div>
              {visualization.refresh.autoRefresh && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto</span>
                </div>
              )}
            </div>

            {/* Annotations */}
            {visualization.annotations.length > 0 && (
              <div className="text-xs text-gray-500">
                {visualization.annotations.length} annotation{visualization.annotations.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* Tags */}
            {visualization.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {visualization.metadata.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {visualization.metadata.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{visualization.metadata.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                {visualization.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVisualizationPause(visualization);
                    }}
                  >
                    <Pause className="h-3 w-3 text-yellow-500" />
                  </Button>
                )}
                {visualization.status === 'paused' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVisualizationResume(visualization);
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
                    handleVisualizationDuplicate(visualization);
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
                    onVisualizationShare?.(visualization);
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
                  handleVisualizationDelete(visualization.id);
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

  const renderVisualizationList = () => (
    <div className="space-y-2">
      {filteredVisualizations.map((visualization) => {
        const isSelected = selectedVisualization?.id === visualization.id;
        
        return (
          <div
            key={visualization.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedVisualization(visualization)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getCategoryIcon(visualization.category), {
                className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(visualization.category))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{visualization.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(visualization.status))}
                  >
                    {visualization.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getTypeColor(visualization.type))}
                  >
                    {visualization.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{visualization.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{visualization.data.datasets.length}</div>
                <div>Datasets</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{visualization.data.labels.length}</div>
                <div>Points</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{formatLastUpdated(visualization.refresh.lastUpdated)}</div>
                <div>Updated</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVisualizations.map(renderVisualizationCard)}
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Progress Visualization</h2>
          <p className="text-sm text-gray-500">Create and manage progress visualizations</p>
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
          <Button onClick={handleVisualizationCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Visualization
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
                    placeholder="Search visualizations..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVisualizations.map(renderVisualizationCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderVisualizationList()}
      </div>

      {/* Empty State */}
      {filteredVisualizations.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No visualizations found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first progress visualization'
            }
          </p>
          <Button onClick={handleVisualizationCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Visualization
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProgressVisualization;
