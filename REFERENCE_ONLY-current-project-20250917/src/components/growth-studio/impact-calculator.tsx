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
  Calculator,
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
  Minimize,
  CheckCircle,
  Circle,
  CircleDot,
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImpactCalculation {
  id: string;
  name: string;
  description: string;
  type: 'revenue' | 'cost' | 'efficiency' | 'growth' | 'risk' | 'custom';
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation';
  inputs: {
    [key: string]: {
      label: string;
      value: number;
      unit: string;
      description: string;
      required: boolean;
      min?: number;
      max?: number;
      step?: number;
    };
  };
  formulas: {
    [key: string]: {
      expression: string;
      description: string;
      unit: string;
      format: 'number' | 'percentage' | 'currency' | 'ratio';
    };
  };
  results: {
    [key: string]: {
      value: number;
      unit: string;
      format: 'number' | 'percentage' | 'currency' | 'ratio';
      confidence: number;
      sensitivity: number;
    };
  };
  scenarios: {
    optimistic: { [key: string]: number };
    realistic: { [key: string]: number };
    pessimistic: { [key: string]: number };
  };
  assumptions: {
    [key: string]: {
      value: number;
      description: string;
      source: string;
      confidence: number;
    };
  };
  sensitivity: {
    [key: string]: {
      low: number;
      high: number;
      impact: number;
    };
  };
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

export interface ImpactCalculatorProps {
  calculations: ImpactCalculation[];
  onCalculationCreate?: (calculation: ImpactCalculation) => void;
  onCalculationUpdate?: (calculation: ImpactCalculation) => void;
  onCalculationDelete?: (calculationId: string) => void;
  onCalculationDuplicate?: (calculation: ImpactCalculation) => void;
  onCalculationExport?: (calculation: ImpactCalculation, format: string) => void;
  onCalculationShare?: (calculation: ImpactCalculation) => void;
  onCalculationRun?: (calculation: ImpactCalculation) => void;
  className?: string;
}

const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({
  calculations,
  onCalculationCreate,
  onCalculationUpdate,
  onCalculationDelete,
  onCalculationDuplicate,
  onCalculationExport,
  onCalculationShare,
  onCalculationRun,
  className
}) => {
  const [selectedCalculation, setSelectedCalculation] = useState<ImpactCalculation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'category' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('inputs');
  const [isCalculating, setIsCalculating] = useState(false);

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
    { value: 'cost', label: 'Cost', icon: TrendingDown, color: 'text-red-600' },
    { value: 'efficiency', label: 'Efficiency', icon: Zap, color: 'text-orange-600' },
    { value: 'growth', label: 'Growth', icon: TrendingUp, color: 'text-blue-600' },
    { value: 'risk', label: 'Risk', icon: AlertTriangle, color: 'text-yellow-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-purple-600' }
  ];

  const filteredCalculations = calculations
    .filter(calculation => {
      const matchesSearch = calculation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           calculation.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || calculation.category === filterCategory;
      const matchesType = filterType === 'all' || calculation.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
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

  const handleCalculationCreate = () => {
    const newCalculation: ImpactCalculation = {
      id: '',
      name: 'New Impact Calculation',
      description: 'A new impact calculation',
      type: 'revenue',
      category: 'acquisition',
      inputs: {
        currentRevenue: {
          label: 'Current Revenue',
          value: 1000000,
          unit: 'USD',
          description: 'Current annual revenue',
          required: true,
          min: 0
        },
        growthRate: {
          label: 'Growth Rate',
          value: 0.2,
          unit: '%',
          description: 'Expected annual growth rate',
          required: true,
          min: 0,
          max: 1,
          step: 0.01
        },
        timeHorizon: {
          label: 'Time Horizon',
          value: 12,
          unit: 'months',
          description: 'Time period for calculation',
          required: true,
          min: 1,
          max: 60
        }
      },
      formulas: {
        projectedRevenue: {
          expression: 'currentRevenue * (1 + growthRate) ^ (timeHorizon / 12)',
          description: 'Projected revenue after time horizon',
          unit: 'USD',
          format: 'currency'
        },
        revenueIncrease: {
          expression: 'projectedRevenue - currentRevenue',
          description: 'Increase in revenue',
          unit: 'USD',
          format: 'currency'
        },
        revenueGrowthPercentage: {
          expression: '(projectedRevenue - currentRevenue) / currentRevenue * 100',
          description: 'Percentage increase in revenue',
          unit: '%',
          format: 'percentage'
        }
      },
      results: {},
      scenarios: {
        optimistic: {},
        realistic: {},
        pessimistic: {}
      },
      assumptions: {},
      sensitivity: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onCalculationCreate?.(newCalculation);
  };

  const handleCalculationUpdate = (calculation: ImpactCalculation, updates: Partial<ImpactCalculation>) => {
    const updatedCalculation = {
      ...calculation,
      ...updates,
      updatedAt: new Date()
    };
    setSelectedCalculation(updatedCalculation);
    onCalculationUpdate?.(updatedCalculation);
  };

  const handleCalculationDelete = (calculationId: string) => {
    onCalculationDelete?.(calculationId);
    if (selectedCalculation?.id === calculationId) {
      setSelectedCalculation(null);
    }
  };

  const handleCalculationDuplicate = (calculation: ImpactCalculation) => {
    const duplicatedCalculation = {
      ...calculation,
      id: '',
      name: `${calculation.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onCalculationDuplicate?.(duplicatedCalculation);
  };

  const handleCalculationRun = async (calculation: ImpactCalculation) => {
    setIsCalculating(true);
    
    try {
      // Simulate calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate results based on formulas
      const results: { [key: string]: { value: number; unit: string; format: string; confidence: number; sensitivity: number } } = {};
      
      Object.entries(calculation.formulas).forEach(([key, formula]) => {
        try {
          // Simple evaluation (in real implementation, use a proper math parser)
          let expression = formula.expression;
          Object.entries(calculation.inputs).forEach(([inputKey, input]) => {
            expression = expression.replace(new RegExp(inputKey, 'g'), input.value.toString());
          });
          
          // Replace operators
          expression = expression.replace(/\^/g, '**');
          
          const value = eval(expression);
          results[key] = {
            value: value,
            unit: formula.unit,
            format: formula.format,
            confidence: 0.8,
            sensitivity: 0.5
          };
        } catch (error) {
          results[key] = {
            value: 0,
            unit: formula.unit,
            format: formula.format,
            confidence: 0,
            sensitivity: 0
          };
        }
      });
      
      const updatedCalculation = {
        ...calculation,
        results,
        updatedAt: new Date()
      };
      
      setSelectedCalculation(updatedCalculation);
      onCalculationUpdate?.(updatedCalculation);
      onCalculationRun?.(updatedCalculation);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (inputKey: string, value: number) => {
    if (selectedCalculation) {
      const updatedCalculation = {
        ...selectedCalculation,
        inputs: {
          ...selectedCalculation.inputs,
          [inputKey]: {
            ...selectedCalculation.inputs[inputKey],
            value
          }
        },
        updatedAt: new Date()
      };
      setSelectedCalculation(updatedCalculation);
      onCalculationUpdate?.(updatedCalculation);
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
        return value.toFixed(2);
      default:
        return value.toLocaleString();
    }
  };

  const renderCalculationCard = (calculation: ImpactCalculation) => {
    const CategoryIcon = getCategoryIcon(calculation.category);
    const TypeIcon = getTypeIcon(calculation.type);
    const isSelected = selectedCalculation?.id === calculation.id;
    
    return (
      <Card
        key={calculation.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedCalculation(calculation)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={cn('h-5 w-5 mt-0.5', getCategoryColor(calculation.category))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium truncate">
                    {calculation.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {calculation.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getTypeColor(calculation.type))}
              >
                {calculation.type}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Inputs Count */}
            <div className="text-xs text-gray-500">
              {Object.keys(calculation.inputs).length} inputs • {Object.keys(calculation.formulas).length} formulas
            </div>

            {/* Results Preview */}
            {Object.keys(calculation.results).length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Results</div>
                <div className="space-y-1">
                  {Object.entries(calculation.results).slice(0, 2).map(([key, result]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <span className="font-medium">{formatValue(result.value, result.format)}</span>
                    </div>
                  ))}
                  {Object.keys(calculation.results).length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{Object.keys(calculation.results).length - 2} more results
                    </div>
                  )}
                </div>
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
                    handleCalculationDuplicate(calculation);
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
                    onCalculationShare?.(calculation);
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
                  handleCalculationDelete(calculation.id);
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

  const renderCalculationList = () => (
    <div className="space-y-2">
      {filteredCalculations.map((calculation) => {
        const isSelected = selectedCalculation?.id === calculation.id;
        
        return (
          <div
            key={calculation.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200'
            )}
            onClick={() => setSelectedCalculation(calculation)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {React.createElement(getCategoryIcon(calculation.category), {
                className: cn('h-4 w-4 flex-shrink-0', getCategoryColor(calculation.category))
              })}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{calculation.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getTypeColor(calculation.type))}
                  >
                    {calculation.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{calculation.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{Object.keys(calculation.inputs).length}</div>
                <div>Inputs</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{Object.keys(calculation.formulas).length}</div>
                <div>Formulas</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{Object.keys(calculation.results).length}</div>
                <div>Results</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderInputs = () => {
    if (!selectedCalculation) return null;
    
    return (
      <div className="space-y-4">
        {Object.entries(selectedCalculation.inputs).map(([key, input]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={key} className="text-sm font-medium">
                {input.label}
              </Label>
              <span className="text-xs text-gray-500">{input.unit}</span>
            </div>
            <Input
              id={key}
              type="number"
              value={input.value}
              onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
              min={input.min}
              max={input.max}
              step={input.step}
              className="w-full"
            />
            <p className="text-xs text-gray-500">{input.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderFormulas = () => {
    if (!selectedCalculation) return null;
    
    return (
      <div className="space-y-4">
        {Object.entries(selectedCalculation.formulas).map(([key, formula]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Label>
              <span className="text-xs text-gray-500">{formula.unit}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <code className="text-sm font-mono">{formula.expression}</code>
            </div>
            <p className="text-xs text-gray-500">{formula.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderResults = () => {
    if (!selectedCalculation || Object.keys(selectedCalculation.results).length === 0) {
      return (
        <div className="text-center py-8">
          <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-500 mb-4">
            Run the calculation to see results
          </p>
          <Button
            onClick={() => handleCalculationRun(selectedCalculation!)}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Calculation
              </>
            )}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {Object.entries(selectedCalculation.results).map(([key, result]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h3>
                  <p className="text-xs text-gray-500">{result.unit}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatValue(result.value, result.format)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Confidence: {(result.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Impact Calculator</h2>
          <p className="text-sm text-gray-500">Calculate the impact of your growth initiatives</p>
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
          <Button onClick={handleCalculationCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Calculation
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
                    placeholder="Search calculations..."
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
                <Label htmlFor="sort">Sort by</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="createdAt">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === 'grid' ? (
                <div className="space-y-2">
                  {filteredCalculations.map(renderCalculationCard)}
                </div>
              ) : (
                renderCalculationList()
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calculation Details */}
        <div className="lg:col-span-2">
          {selectedCalculation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{selectedCalculation.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCalculationRun(selectedCalculation)}
                      disabled={isCalculating}
                    >
                      {isCalculating ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCalculationShare?.(selectedCalculation)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="inputs">Inputs</TabsTrigger>
                    <TabsTrigger value="formulas">Formulas</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="inputs" className="mt-4">
                    {renderInputs()}
                  </TabsContent>
                  
                  <TabsContent value="formulas" className="mt-4">
                    {renderFormulas()}
                  </TabsContent>
                  
                  <TabsContent value="results" className="mt-4">
                    {renderResults()}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Calculation Selected</h3>
                <p className="text-gray-500 mb-4">
                  Select a calculation from the list or create a new one to get started.
                </p>
                <Button onClick={handleCalculationCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Calculation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredCalculations.length === 0 && (
        <div className="text-center py-12">
          <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No calculations found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first calculation'
            }
          </p>
          <Button onClick={handleCalculationCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Calculation
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImpactCalculator;
