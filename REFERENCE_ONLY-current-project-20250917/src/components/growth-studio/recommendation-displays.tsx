'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb,
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

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation';
  type: 'strategy' | 'tactic' | 'optimization' | 'experiment' | 'insight' | 'warning';
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewed' | 'accepted' | 'rejected' | 'implemented' | 'archived';
  confidence: number; // 0-1
  impact: number; // 1-10
  effort: number; // 1-10
  cost: number;
  expectedROI: number;
  timeline: {
    estimated: number; // in days
    startDate?: Date;
    endDate?: Date;
  };
  metrics: {
    primary: string;
    secondary: string[];
    targets: {
      [key: string]: number;
    };
  };
  implementation: {
    steps: {
      id: string;
      title: string;
      description: string;
      status: 'pending' | 'in-progress' | 'completed';
      estimatedTime: number;
    }[];
    resources: {
      team: string[];
      budget: number;
      tools: string[];
    };
    dependencies: string[];
    blockers: string[];
  };
  evidence: {
    data: string;
    sources: string[];
    analysis: string;
    assumptions: string[];
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

export interface RecommendationDisplaysProps {
  recommendations: Recommendation[];
  onRecommendationCreate?: (recommendation: Recommendation) => void;
  onRecommendationUpdate?: (recommendation: Recommendation) => void;
  onRecommendationDelete?: (recommendationId: string) => void;
  onRecommendationDuplicate?: (recommendation: Recommendation) => void;
  onRecommendationArchive?: (recommendation: Recommendation) => void;
  onRecommendationAccept?: (recommendation: Recommendation) => void;
  onRecommendationReject?: (recommendation: Recommendation) => void;
  onRecommendationImplement?: (recommendation: Recommendation) => void;
  onRecommendationExport?: (recommendation: Recommendation, format: string) => void;
  onRecommendationShare?: (recommendation: Recommendation) => void;
  className?: string;
}

const RecommendationDisplays: React.FC<RecommendationDisplaysProps> = ({
  recommendations,
  onRecommendationCreate,
  onRecommendationUpdate,
  onRecommendationDelete,
  onRecommendationDuplicate,
  onRecommendationArchive,
  onRecommendationAccept,
  onRecommendationReject,
  onRecommendationImplement,
  onRecommendationExport,
  onRecommendationShare,
  className
}) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'priority' | 'impact' | 'effort' | 'confidence' | 'createdAt'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('list');
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
    { value: 'strategy', label: 'Strategy', icon: Target, color: 'text-blue-600' },
    { value: 'tactic', label: 'Tactic', icon: Zap, color: 'text-green-600' },
    { value: 'optimization', label: 'Optimization', icon: TrendingUp, color: 'text-purple-600' },
    { value: 'experiment', label: 'Experiment', icon: Lightbulb, color: 'text-orange-600' },
    { value: 'insight', label: 'Insight', icon: Brain, color: 'text-indigo-600' },
    { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-red-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'new', label: 'New', color: 'text-blue-600' },
    { value: 'reviewed', label: 'Reviewed', color: 'text-yellow-600' },
    { value: 'accepted', label: 'Accepted', color: 'text-green-600' },
    { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
    { value: 'implemented', label: 'Implemented', color: 'text-purple-600' },
    { value: 'archived', label: 'Archived', color: 'text-gray-600' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'text-gray-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'low', label: 'Low', color: 'text-green-600' }
  ];

  const filteredRecommendations = recommendations
    .filter(recommendation => {
      const matchesSearch = recommendation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recommendation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recommendation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || recommendation.category === filterCategory;
      const matchesType = filterType === 'all' || recommendation.type === filterType;
      const matchesStatus = filterStatus === 'all' || recommendation.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || recommendation.priority === filterPriority;
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
        case 'impact':
          aValue = a.impact;
          bValue = b.impact;
          break;
        case 'effort':
          aValue = a.effort;
          bValue = b.effort;
          break;
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
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

  const handleRecommendationCreate = () => {
    const newRecommendation: Recommendation = {
      id: '',
      title: 'New Recommendation',
      description: 'A new recommendation for growth',
      category: 'acquisition',
      type: 'strategy',
      priority: 'medium',
      status: 'new',
      confidence: 0.7,
      impact: 5,
      effort: 5,
      cost: 0,
      expectedROI: 0,
      timeline: {
        estimated: 30
      },
      metrics: {
        primary: 'Revenue',
        secondary: ['Users', 'Conversion'],
        targets: {}
      },
      implementation: {
        steps: [],
        resources: {
          team: [],
          budget: 0,
          tools: []
        },
        dependencies: [],
        blockers: []
      },
      evidence: {
        data: '',
        sources: [],
        analysis: '',
        assumptions: []
      },
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onRecommendationCreate?.(newRecommendation);
  };

  const handleRecommendationUpdate = (recommendation: Recommendation, updates: Partial<Recommendation>) => {
    const updatedRecommendation = {
      ...recommendation,
      ...updates,
      updatedAt: new Date()
    };
    setSelectedRecommendation(updatedRecommendation);
    onRecommendationUpdate?.(updatedRecommendation);
  };

  const handleRecommendationDelete = (recommendationId: string) => {
    onRecommendationDelete?.(recommendationId);
    if (selectedRecommendation?.id === recommendationId) {
      setSelectedRecommendation(null);
    }
  };

  const handleRecommendationDuplicate = (recommendation: Recommendation) => {
    const duplicatedRecommendation = {
      ...recommendation,
      id: '',
      title: `${recommendation.title} (Copy)`,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onRecommendationDuplicate?.(duplicatedRecommendation);
  };

  const handleRecommendationArchive = (recommendation: Recommendation) => {
    onRecommendationArchive?.(recommendation);
  };

  const handleRecommendationAccept = (recommendation: Recommendation) => {
    onRecommendationAccept?.(recommendation);
  };

  const handleRecommendationReject = (recommendation: Recommendation) => {
    onRecommendationReject?.(recommendation);
  };

  const handleRecommendationImplement = (recommendation: Recommendation) => {
    onRecommendationImplement?.(recommendation);
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

  const getImpactEffortColor = (impact: number, effort: number) => {
    const ratio = impact / effort;
    if (ratio >= 1.5) return 'text-green-600';
    if (ratio >= 1) return 'text-yellow-600';
    return 'text-red-600';
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
        return `${(value * 100).toFixed(1)}%`;
      case 'ratio':
        return `${value.toFixed(1)}x`;
      default:
        return value.toLocaleString();
    }
  };

  const renderRecommendationCard = (recommendation: Recommendation) => {
    const CategoryIcon = getCategoryIcon(recommendation.category);
    const TypeIcon = getTypeIcon(recommendation.type);
    const isSelected = selectedRecommendation?.id === recommendation.id;
    
    return (
      <Card
        key={recommendation.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedRecommendation(recommendation)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(recommendation.category))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium truncate">
                    {recommendation.title}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {recommendation.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(recommendation.status))}
              >
                {recommendation.status}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getPriorityColor(recommendation.priority))}
              >
                {recommendation.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Impact vs Effort */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Impact:</span>
                <span className="font-medium">{recommendation.impact}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Effort:</span>
                <span className="font-medium">{recommendation.effort}/10</span>
              </div>
              <div className={cn('text-xs font-medium', getImpactEffortColor(recommendation.impact, recommendation.effort))}>
                {recommendation.impact / recommendation.effort >= 1.5 ? 'High ROI' : recommendation.impact / recommendation.effort >= 1 ? 'Medium ROI' : 'Low ROI'}
              </div>
            </div>

            {/* Confidence */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Confidence</span>
                <span className="font-medium">{(recommendation.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${recommendation.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Cost:</span>
                <span className="ml-1 font-medium">${recommendation.cost.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">ROI:</span>
                <span className="ml-1 font-medium">{recommendation.expectedROI.toFixed(1)}x</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="text-xs text-gray-500">
              Estimated: {recommendation.timeline.estimated} days
            </div>

            {/* Tags */}
            {recommendation.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recommendation.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {recommendation.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{recommendation.tags.length - 3}
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
                    handleRecommendationAccept(recommendation);
                  }}
                >
                  <CheckCircle className="h-3 w-3 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecommendationReject(recommendation);
                  }}
                >
                  <CircleX className="h-3 w-3 text-red-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecommendationImplement(recommendation);
                  }}
                >
                  <Play className="h-3 w-3 text-blue-500" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecommendationDuplicate(recommendation);
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
                    onRecommendationShare?.(recommendation);
                  }}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRecommendationList = () => (
    <div className="space-y-2">
      {filteredRecommendations.map((recommendation) => {
        const isSelected = selectedRecommendation?.id === recommendation.id;
        
        return (
          <div
            key={recommendation.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedRecommendation(recommendation)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getCategoryIcon(recommendation.category), {
                className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(recommendation.category))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{recommendation.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(recommendation.status))}
                  >
                    {recommendation.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getPriorityColor(recommendation.priority))}
                  >
                    {recommendation.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{recommendation.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{recommendation.impact}/10</div>
                <div>Impact</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{recommendation.effort}/10</div>
                <div>Effort</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{(recommendation.confidence * 100).toFixed(0)}%</div>
                <div>Confidence</div>
              </div>
              <div className="text-center">
                <div className="font-medium">${recommendation.cost.toLocaleString()}</div>
                <div>Cost</div>
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
          const statusRecommendations = filteredRecommendations.filter(rec => rec.status === status.value);
          
          return (
            <div key={status.value} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">{status.label}</h3>
                <Badge variant="outline" className="text-xs">
                  {statusRecommendations.length}
                </Badge>
              </div>
              <div className="space-y-2 min-h-[400px]">
                {statusRecommendations.map(renderRecommendationCard)}
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
          <h2 className="text-xl font-semibold">Recommendation Displays</h2>
          <p className="text-sm text-gray-500">AI-powered recommendations for growth optimization</p>
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
          <Button onClick={handleRecommendationCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Recommendation
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
                    placeholder="Search recommendations..."
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
              <SelectItem value="impact">Impact</SelectItem>
              <SelectItem value="effort">Effort</SelectItem>
              <SelectItem value="confidence">Confidence</SelectItem>
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
            {filteredRecommendations.map(renderRecommendationCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderRecommendationList()}
        
        {viewMode === 'kanban' && renderKanbanBoard()}
      </div>

      {/* Empty State */}
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first recommendation'
            }
          </p>
          <Button onClick={handleRecommendationCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Recommendation
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationDisplays;
