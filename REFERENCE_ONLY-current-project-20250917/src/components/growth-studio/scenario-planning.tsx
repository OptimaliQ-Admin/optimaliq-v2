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

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: 'optimistic' | 'realistic' | 'pessimistic' | 'custom';
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation';
  status: 'draft' | 'active' | 'completed' | 'archived';
  priority: 'high' | 'medium' | 'low';
  parameters: {
    [key: string]: {
      label: string;
      value: number;
      unit: string;
      description: string;
      min?: number;
      max?: number;
      step?: number;
    };
  };
  assumptions: {
    [key: string]: {
      value: number;
      description: string;
      confidence: number;
      source: string;
    };
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: {
      id: string;
      name: string;
      date: Date;
      description: string;
      status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    }[];
  };
  outcomes: {
    [key: string]: {
      value: number;
      unit: string;
      format: 'number' | 'percentage' | 'currency' | 'ratio';
      confidence: number;
      sensitivity: number;
    };
  };
  risks: {
    [key: string]: {
      probability: number;
      impact: number;
      description: string;
      mitigation: string;
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
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface ScenarioPlanningProps {
  scenarios: Scenario[];
  onScenarioCreate?: (scenario: Scenario) => void;
  onScenarioUpdate?: (scenario: Scenario) => void;
  onScenarioDelete?: (scenarioId: string) => void;
  onScenarioDuplicate?: (scenario: Scenario) => void;
  onScenarioArchive?: (scenario: Scenario) => void;
  onScenarioRun?: (scenario: Scenario) => void;
  onScenarioCompare?: (scenarios: Scenario[]) => void;
  onScenarioExport?: (scenario: Scenario, format: string) => void;
  onScenarioShare?: (scenario: Scenario) => void;
  className?: string;
}

const ScenarioPlanning: React.FC<ScenarioPlanningProps> = ({
  scenarios,
  onScenarioCreate,
  onScenarioUpdate,
  onScenarioDelete,
  onScenarioDuplicate,
  onScenarioArchive,
  onScenarioRun,
  onScenarioCompare,
  onScenarioExport,
  onScenarioShare,
  className
}) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'category' | 'status' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(false);

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
    { value: 'optimistic', label: 'Optimistic', icon: TrendingUp, color: 'text-green-600' },
    { value: 'realistic', label: 'Realistic', icon: Target, color: 'text-blue-600' },
    { value: 'pessimistic', label: 'Pessimistic', icon: TrendingDown, color: 'text-red-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-purple-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'draft', label: 'Draft', color: 'text-gray-600' },
    { value: 'active', label: 'Active', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'archived', label: 'Archived', color: 'text-gray-600' }
  ];

  const filteredScenarios = scenarios
    .filter(scenario => {
      const matchesSearch = scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || scenario.category === filterCategory;
      const matchesType = filterType === 'all' || scenario.type === filterType;
      const matchesStatus = filterStatus === 'all' || scenario.status === filterStatus;
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
          const statusOrder = { 'active': 4, 'draft': 3, 'completed': 2, 'archived': 1 };
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

  const handleScenarioCreate = () => {
    const newScenario: Scenario = {
      id: '',
      name: 'New Scenario',
      description: 'A new scenario for planning',
      type: 'realistic',
      category: 'acquisition',
      status: 'draft',
      priority: 'medium',
      parameters: {
        revenue: {
          label: 'Revenue',
          value: 1000000,
          unit: 'USD',
          description: 'Current annual revenue',
          min: 0
        },
        growthRate: {
          label: 'Growth Rate',
          value: 0.2,
          unit: '%',
          description: 'Expected annual growth rate',
          min: 0,
          max: 1,
          step: 0.01
        },
        marketSize: {
          label: 'Market Size',
          value: 10000000,
          unit: 'USD',
          description: 'Total addressable market',
          min: 0
        }
      },
      assumptions: {
        marketGrowth: {
          value: 0.1,
          description: 'Market growth rate',
          confidence: 0.8,
          source: 'Industry reports'
        },
        competition: {
          value: 0.5,
          description: 'Competitive intensity',
          confidence: 0.7,
          source: 'Market analysis'
        }
      },
      timeline: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        milestones: []
      },
      outcomes: {},
      risks: {},
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
    onScenarioCreate?.(newScenario);
  };

  const handleScenarioUpdate = (scenario: Scenario, updates: Partial<Scenario>) => {
    const updatedScenario = {
      ...scenario,
      ...updates,
      updatedAt: new Date()
    };
    setSelectedScenario(updatedScenario);
    onScenarioUpdate?.(updatedScenario);
  };

  const handleScenarioDelete = (scenarioId: string) => {
    onScenarioDelete?.(scenarioId);
    if (selectedScenario?.id === scenarioId) {
      setSelectedScenario(null);
    }
  };

  const handleScenarioDuplicate = (scenario: Scenario) => {
    const duplicatedScenario = {
      ...scenario,
      id: '',
      name: `${scenario.name} (Copy)`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onScenarioDuplicate?.(duplicatedScenario);
  };

  const handleScenarioArchive = (scenario: Scenario) => {
    onScenarioArchive?.(scenario);
  };

  const handleScenarioRun = async (scenario: Scenario) => {
    setIsRunning(true);
    
    try {
      // Simulate running the scenario
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock outcomes
      const outcomes: { [key: string]: { value: number; unit: string; format: string; confidence: number; sensitivity: number } } = {
        projectedRevenue: {
          value: scenario.parameters.revenue.value * Math.pow(1 + scenario.parameters.growthRate.value, 1),
          unit: 'USD',
          format: 'currency',
          confidence: 0.8,
          sensitivity: 0.6
        },
        marketShare: {
          value: (scenario.parameters.revenue.value / scenario.parameters.marketSize.value) * 100,
          unit: '%',
          format: 'percentage',
          confidence: 0.7,
          sensitivity: 0.5
        },
        roi: {
          value: 2.5,
          unit: 'x',
          format: 'ratio',
          confidence: 0.6,
          sensitivity: 0.8
        }
      };
      
      const updatedScenario = {
        ...scenario,
        outcomes,
        updatedAt: new Date()
      };
      
      setSelectedScenario(updatedScenario);
      onScenarioUpdate?.(updatedScenario);
      onScenarioRun?.(updatedScenario);
    } finally {
      setIsRunning(false);
    }
  };

  const handleScenarioCompare = () => {
    const selectedScenariosData = scenarios.filter(s => selectedScenarios.includes(s.id));
    onScenarioCompare?.(selectedScenariosData);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    if (selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
    } else {
      setSelectedScenarios([...selectedScenarios, scenarioId]);
    }
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

  const renderScenarioCard = (scenario: Scenario) => {
    const CategoryIcon = getCategoryIcon(scenario.category);
    const TypeIcon = getTypeIcon(scenario.type);
    const isSelected = selectedScenario?.id === scenario.id;
    const isMultiSelected = selectedScenarios.includes(scenario.id);
    
    return (
      <Card
        key={scenario.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500',
          isMultiSelected && 'ring-2 ring-green-500'
        )}
        onClick={() => setSelectedScenario(scenario)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(scenario.category))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium truncate">
                    {scenario.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {scenario.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getTypeColor(scenario.type))}
              >
                {scenario.type}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getStatusColor(scenario.status))}
              >
                {scenario.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Parameters Count */}
            <div className="text-xs text-gray-500">
              {Object.keys(scenario.parameters).length} parameters • {Object.keys(scenario.assumptions).length} assumptions
            </div>

            {/* Outcomes Preview */}
            {Object.keys(scenario.outcomes).length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Outcomes</div>
                <div className="space-y-1">
                  {Object.entries(scenario.outcomes).slice(0, 2).map(([key, outcome]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <span className="font-medium">{formatValue(outcome.value, outcome.format)}</span>
                    </div>
                  ))}
                  {Object.keys(scenario.outcomes).length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{Object.keys(scenario.outcomes).length - 2} more outcomes
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="text-xs text-gray-500">
              {scenario.timeline.milestones.length} milestones • {scenario.timeline.startDate.toLocaleDateString()} - {scenario.timeline.endDate.toLocaleDateString()}
            </div>

            {/* Tags */}
            {scenario.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {scenario.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {scenario.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{scenario.tags.length - 3}
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
                    handleScenarioSelect(scenario.id);
                  }}
                >
                  {isMultiSelected ? <CheckCircle className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScenarioDuplicate(scenario);
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
                    onScenarioShare?.(scenario);
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
                  handleScenarioDelete(scenario.id);
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

  const renderScenarioList = () => (
    <div className="space-y-2">
      {filteredScenarios.map((scenario) => {
        const isSelected = selectedScenario?.id === scenario.id;
        const isMultiSelected = selectedScenarios.includes(scenario.id);
        
        return (
          <div
            key={scenario.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200',
              isMultiSelected && 'bg-green-50 border-green-200'
            )}
            onClick={() => setSelectedScenario(scenario)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getCategoryIcon(scenario.category), {
                className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(scenario.category))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{scenario.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getTypeColor(scenario.type))}
                  >
                    {scenario.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(scenario.status))}
                  >
                    {scenario.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{scenario.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{Object.keys(scenario.parameters).length}</div>
                <div>Parameters</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{Object.keys(scenario.outcomes).length}</div>
                <div>Outcomes</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{scenario.timeline.milestones.length}</div>
                <div>Milestones</div>
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
          <h2 className="text-xl font-semibold">Scenario Planning</h2>
          <p className="text-sm text-gray-500">Plan and compare different growth scenarios</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedScenarios.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleScenarioCompare}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare ({selectedScenarios.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={handleScenarioCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
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
                    placeholder="Search scenarios..."
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
                <Label htmlFor="sort">Sort by</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="createdAt">Date</SelectItem>
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
            {filteredScenarios.map(renderScenarioCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderScenarioList()}
        
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
      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No scenarios found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first scenario'
            }
          </p>
          <Button onClick={handleScenarioCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Scenario
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScenarioPlanning;
