'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
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
  Minimize
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GrowthLever {
  id: string;
  name: string;
  description: string;
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation';
  type: 'strategy' | 'tactic' | 'initiative' | 'experiment' | 'optimization';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed' | 'paused' | 'cancelled';
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  confidence: number; // 0-1 scale
  cost: number;
  expectedROI: number;
  timeline: {
    startDate: Date;
    endDate: Date;
    duration: number; // in days
  };
  progress: {
    current: number; // 0-100
    milestones: {
      id: string;
      name: string;
      date: Date;
      status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    }[];
  };
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
    status?: 'draft' | 'published' | 'archived';
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface GrowthLeversProps {
  levers: GrowthLever[];
  onLeverCreate?: (lever: GrowthLever) => void;
  onLeverUpdate?: (lever: GrowthLever) => void;
  onLeverDelete?: (leverId: string) => void;
  onLeverDuplicate?: (lever: GrowthLever) => void;
  onLeverArchive?: (lever: GrowthLever) => void;
  onLeverPrioritize?: (lever: GrowthLever, priority: string) => void;
  onLeverStatusUpdate?: (lever: GrowthLever, status: string) => void;
  onLeverProgressUpdate?: (lever: GrowthLever, progress: number) => void;
  onLeverMilestoneAdd?: (lever: GrowthLever, milestone: any) => void;
  onLeverMilestoneUpdate?: (lever: GrowthLever, milestoneId: string, updates: any) => void;
  onLeverMilestoneDelete?: (lever: GrowthLever, milestoneId: string) => void;
  className?: string;
}

const GrowthLevers: React.FC<GrowthLeversProps> = ({
  levers,
  onLeverCreate,
  onLeverUpdate,
  onLeverDelete,
  onLeverDuplicate,
  onLeverArchive,
  onLeverPrioritize,
  onLeverStatusUpdate,
  onLeverProgressUpdate,
  onLeverMilestoneAdd,
  onLeverMilestoneUpdate,
  onLeverMilestoneDelete,
  className
}) => {
  const [selectedLever, setSelectedLever] = useState<GrowthLever | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'impact' | 'effort' | 'priority' | 'status' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list');
  const [showFilters, setShowFilters] = useState(false);

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
    { value: 'planned', label: 'Planned', color: 'text-gray-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'paused', label: 'Paused', color: 'text-yellow-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'text-gray-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'low', label: 'Low', color: 'text-green-600' }
  ];

  const filteredLevers = levers
    .filter(lever => {
      const matchesSearch = lever.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lever.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lever.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || lever.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || lever.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || lever.priority === filterPriority;
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'impact':
          aValue = a.impact;
          bValue = b.impact;
          break;
        case 'effort':
          aValue = a.effort;
          bValue = b.effort;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'status':
          const statusOrder = { 'in-progress': 4, 'planned': 3, 'paused': 2, 'completed': 1, 'cancelled': 0 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
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

  const handleLeverCreate = () => {
    const newLever: GrowthLever = {
      id: '',
      name: 'New Growth Lever',
      description: 'A new growth lever to drive business growth',
      category: 'acquisition',
      type: 'strategy',
      priority: 'medium',
      status: 'planned',
      impact: 5,
      effort: 5,
      confidence: 0.5,
      cost: 0,
      expectedROI: 0,
      timeline: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        duration: 30
      },
      progress: {
        current: 0,
        milestones: []
      },
      metrics: {
        primary: 'Revenue',
        secondary: ['Users', 'Conversion'],
        targets: {},
        current: {}
      },
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
    onLeverCreate?.(newLever);
  };

  const handleLeverUpdate = (lever: GrowthLever, updates: Partial<GrowthLever>) => {
    const updatedLever = {
      ...lever,
      ...updates,
      updatedAt: new Date()
    };
    setSelectedLever(updatedLever);
    onLeverUpdate?.(updatedLever);
  };

  const handleLeverDelete = (leverId: string) => {
    onLeverDelete?.(leverId);
    if (selectedLever?.id === leverId) {
      setSelectedLever(null);
    }
  };

  const handleLeverDuplicate = (lever: GrowthLever) => {
    const duplicatedLever = {
      ...lever,
      id: '',
      name: `${lever.name} (Copy)`,
      status: 'planned',
      progress: {
        current: 0,
        milestones: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onLeverDuplicate?.(duplicatedLever);
  };

  const handleLeverArchive = (lever: GrowthLever) => {
    onLeverArchive?.(lever);
  };

  const handleLeverPrioritize = (lever: GrowthLever, priority: string) => {
    onLeverPrioritize?.(lever, priority);
  };

  const handleLeverStatusUpdate = (lever: GrowthLever, status: string) => {
    onLeverStatusUpdate?.(lever, status);
  };

  const handleLeverProgressUpdate = (lever: GrowthLever, progress: number) => {
    onLeverProgressUpdate?.(lever, progress);
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

  const getImpactEffortColor = (impact: number, effort: number) => {
    const ratio = impact / effort;
    if (ratio >= 1.5) return 'text-green-600';
    if (ratio >= 1) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderLeverCard = (lever: GrowthLever) => {
    const CategoryIcon = getCategoryIcon(lever.category);
    const isSelected = selectedLever?.id === lever.id;
    
    return (
      <Card
        key={lever.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedLever(lever)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(lever.category))} />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-medium truncate">
                  {lever.name}
                </CardTitle>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {lever.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(lever.status))}
              >
                {lever.status.replace('-', ' ')}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getPriorityColor(lever.priority))}
              >
                {lever.priority}
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
                <span className="font-medium">{lever.impact}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Effort:</span>
                <span className="font-medium">{lever.effort}/10</span>
              </div>
              <div className={cn('text-xs font-medium', getImpactEffortColor(lever.impact, lever.effort))}>
                {lever.impact / lever.effort >= 1.5 ? 'High ROI' : lever.impact / lever.effort >= 1 ? 'Medium ROI' : 'Low ROI'}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{lever.progress.current}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${lever.progress.current}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Cost:</span>
                <span className="ml-1 font-medium">${lever.cost.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">ROI:</span>
                <span className="ml-1 font-medium">{lever.expectedROI.toFixed(1)}x</span>
              </div>
            </div>

            {/* Tags */}
            {lever.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {lever.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {lever.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{lever.tags.length - 3}
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
                    handleLeverDuplicate(lever);
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
                    handleLeverArchive(lever);
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
                  handleLeverDelete(lever.id);
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

  const renderLeverList = () => (
    <div className="space-y-2">
      {filteredLevers.map((lever) => (
        <div
          key={lever.id}
          className={cn(
            'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
            selectedLever?.id === lever.id && 'bg-blue-50 border-blue-200'
          )}
          onClick={() => setSelectedLever(lever)}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {React.createElement(getCategoryIcon(lever.category), {
              className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(lever.category))
            })}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium truncate">{lever.name}</h3>
                <Badge
                  variant="outline"
                  className={cn('text-xs', getStatusColor(lever.status))}
                >
                  {lever.status.replace('-', ' ')}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn('text-xs', getPriorityColor(lever.priority))}
                >
                  {lever.priority}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 truncate">{lever.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="text-center">
              <div className="font-medium">{lever.impact}/10</div>
              <div>Impact</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{lever.effort}/10</div>
              <div>Effort</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{lever.progress.current}%</div>
              <div>Progress</div>
            </div>
            <div className="text-center">
              <div className="font-medium">${lever.cost.toLocaleString()}</div>
              <div>Cost</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderKanbanBoard = () => {
    const statusColumns = statuses.filter(s => s.value !== 'all');
    
    return (
      <div className="grid grid-cols-5 gap-4">
        {statusColumns.map((status) => {
          const statusLevers = filteredLevers.filter(lever => lever.status === status.value);
          
          return (
            <div key={status.value} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">{status.label}</h3>
                <Badge variant="outline" className="text-xs">
                  {statusLevers.length}
                </Badge>
              </div>
              <div className="space-y-2 min-h-[400px]">
                {statusLevers.map(renderLeverCard)}
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
          <h2 className="text-xl font-semibold">Growth Levers</h2>
          <p className="text-sm text-gray-500">Manage and prioritize your growth initiatives</p>
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
          <Button onClick={handleLeverCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Lever
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
                    placeholder="Search levers..."
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
              <SelectItem value="impact">Impact</SelectItem>
              <SelectItem value="effort">Effort</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
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
            {filteredLevers.map(renderLeverCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderLeverList()}
        
        {viewMode === 'kanban' && renderKanbanBoard()}
      </div>

      {/* Empty State */}
      {filteredLevers.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No growth levers found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first growth lever'
            }
          </p>
          <Button onClick={handleLeverCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Growth Lever
          </Button>
        </div>
      )}
    </div>
  );
};

export default GrowthLevers;
