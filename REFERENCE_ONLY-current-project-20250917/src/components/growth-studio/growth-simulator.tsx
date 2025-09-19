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
  Play,
  Pause,
  Stop,
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
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GrowthScenario {
  id: string;
  name: string;
  description: string;
  type: 'optimistic' | 'realistic' | 'pessimistic' | 'custom';
  parameters: {
    revenue: number;
    growthRate: number;
    marketSize: number;
    marketShare: number;
    customerAcquisition: number;
    customerRetention: number;
    averageOrderValue: number;
    orderFrequency: number;
    churnRate: number;
    lifetimeValue: number;
    acquisitionCost: number;
    operationalCosts: number;
    marketingSpend: number;
    salesSpend: number;
    productSpend: number;
    teamSize: number;
    salaryPerEmployee: number;
    officeRent: number;
    technologyCosts: number;
    otherCosts: number;
  };
  assumptions: {
    marketGrowth: number;
    competition: number;
    technology: number;
    regulation: number;
    economic: number;
    seasonality: number;
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
  results: {
    revenue: number[];
    customers: number[];
    costs: number[];
    profit: number[];
    growth: number[];
    marketShare: number[];
    roi: number;
    paybackPeriod: number;
    npv: number;
    irr: number;
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

export interface GrowthSimulatorProps {
  scenarios: GrowthScenario[];
  onScenarioCreate?: (scenario: GrowthScenario) => void;
  onScenarioUpdate?: (scenario: GrowthScenario) => void;
  onScenarioDelete?: (scenarioId: string) => void;
  onScenarioRun?: (scenario: GrowthScenario) => void;
  onScenarioExport?: (scenario: GrowthScenario, format: string) => void;
  onScenarioShare?: (scenario: GrowthScenario) => void;
  className?: string;
}

const GrowthSimulator: React.FC<GrowthSimulatorProps> = ({
  scenarios,
  onScenarioCreate,
  onScenarioUpdate,
  onScenarioDelete,
  onScenarioRun,
  onScenarioExport,
  onScenarioShare,
  className
}) => {
  const [selectedScenario, setSelectedScenario] = useState<GrowthScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('parameters');

  const scenarioTypes = [
    { value: 'optimistic', label: 'Optimistic', icon: TrendingUp, color: 'text-green-600' },
    { value: 'realistic', label: 'Realistic', icon: Target, color: 'text-blue-600' },
    { value: 'pessimistic', label: 'Pessimistic', icon: TrendingDown, color: 'text-red-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-purple-600' }
  ];

  const parameterCategories = [
    {
      name: 'Revenue',
      parameters: ['revenue', 'growthRate', 'averageOrderValue', 'orderFrequency']
    },
    {
      name: 'Market',
      parameters: ['marketSize', 'marketShare', 'customerAcquisition', 'customerRetention']
    },
    {
      name: 'Costs',
      parameters: ['acquisitionCost', 'operationalCosts', 'marketingSpend', 'salesSpend', 'productSpend']
    },
    {
      name: 'Team',
      parameters: ['teamSize', 'salaryPerEmployee', 'officeRent', 'technologyCosts', 'otherCosts']
    }
  ];

  const handleScenarioCreate = () => {
    const newScenario: GrowthScenario = {
      id: '',
      name: 'New Scenario',
      description: 'A new growth scenario',
      type: 'realistic',
      parameters: {
        revenue: 1000000,
        growthRate: 0.2,
        marketSize: 10000000,
        marketShare: 0.1,
        customerAcquisition: 1000,
        customerRetention: 0.8,
        averageOrderValue: 100,
        orderFrequency: 12,
        churnRate: 0.2,
        lifetimeValue: 1200,
        acquisitionCost: 50,
        operationalCosts: 500000,
        marketingSpend: 200000,
        salesSpend: 150000,
        productSpend: 100000,
        teamSize: 10,
        salaryPerEmployee: 80000,
        officeRent: 5000,
        technologyCosts: 20000,
        otherCosts: 30000
      },
      assumptions: {
        marketGrowth: 0.1,
        competition: 0.5,
        technology: 0.3,
        regulation: 0.2,
        economic: 0.4,
        seasonality: 0.1
      },
      timeline: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        milestones: []
      },
      results: {
        revenue: [],
        customers: [],
        costs: [],
        profit: [],
        growth: [],
        marketShare: [],
        roi: 0,
        paybackPeriod: 0,
        npv: 0,
        irr: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onScenarioCreate?.(newScenario);
  };

  const handleScenarioRun = async (scenario: GrowthScenario) => {
    setIsRunning(true);
    setCurrentStep(0);
    
    // Simulate running the scenario
    for (let i = 0; i < 10; i++) {
      setCurrentStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Generate mock results
    const results = {
      revenue: Array.from({ length: 12 }, (_, i) => scenario.parameters.revenue * Math.pow(1 + scenario.parameters.growthRate, i)),
      customers: Array.from({ length: 12 }, (_, i) => scenario.parameters.customerAcquisition * (i + 1)),
      costs: Array.from({ length: 12 }, (_, i) => scenario.parameters.operationalCosts * (1 + i * 0.1)),
      profit: Array.from({ length: 12 }, (_, i) => scenario.parameters.revenue * Math.pow(1 + scenario.parameters.growthRate, i) - scenario.parameters.operationalCosts * (1 + i * 0.1)),
      growth: Array.from({ length: 12 }, (_, i) => scenario.parameters.growthRate * (1 + i * 0.05)),
      marketShare: Array.from({ length: 12 }, (_, i) => scenario.parameters.marketShare * (1 + i * 0.02)),
      roi: 2.5,
      paybackPeriod: 18,
      npv: 1500000,
      irr: 0.25
    };
    
    setSimulationResults(results);
    setIsRunning(false);
    onScenarioRun?.(scenario);
  };

  const handleParameterUpdate = (parameter: string, value: number) => {
    if (selectedScenario) {
      const updatedScenario = {
        ...selectedScenario,
        parameters: {
          ...selectedScenario.parameters,
          [parameter]: value
        },
        updatedAt: new Date()
      };
      setSelectedScenario(updatedScenario);
      onScenarioUpdate?.(updatedScenario);
    }
  };

  const handleAssumptionUpdate = (assumption: string, value: number) => {
    if (selectedScenario) {
      const updatedScenario = {
        ...selectedScenario,
        assumptions: {
          ...selectedScenario.assumptions,
          [assumption]: value
        },
        updatedAt: new Date()
      };
      setSelectedScenario(updatedScenario);
      onScenarioUpdate?.(updatedScenario);
    }
  };

  const renderParameterInput = (parameter: string, label: string, type: 'number' | 'percentage' = 'number') => {
    const value = selectedScenario?.parameters[parameter as keyof typeof selectedScenario.parameters] || 0;
    const displayValue = type === 'percentage' ? (value * 100).toFixed(1) : value.toFixed(0);
    
    return (
      <div key={parameter} className="space-y-1">
        <Label htmlFor={parameter} className="text-sm">
          {label}
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            id={parameter}
            type="number"
            value={displayValue}
            onChange={(e) => {
              const newValue = type === 'percentage' 
                ? parseFloat(e.target.value) / 100 
                : parseFloat(e.target.value);
              handleParameterUpdate(parameter, newValue);
            }}
            className="flex-1"
          />
          {type === 'percentage' && (
            <span className="text-sm text-gray-500">%</span>
          )}
        </div>
      </div>
    );
  };

  const renderAssumptionInput = (assumption: string, label: string) => {
    const value = selectedScenario?.assumptions[assumption as keyof typeof selectedScenario.assumptions] || 0;
    
    return (
      <div key={assumption} className="space-y-1">
        <Label htmlFor={assumption} className="text-sm">
          {label}
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            id={assumption}
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={value.toFixed(1)}
            onChange={(e) => handleAssumptionUpdate(assumption, parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-500">0-1</span>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!simulationResults) return null;
    
    return (
      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                ${(simulationResults.roi * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500">ROI</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {simulationResults.paybackPeriod}mo
              </div>
              <div className="text-sm text-gray-500">Payback Period</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                ${(simulationResults.npv / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-500">NPV</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {(simulationResults.irr * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">IRR</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Revenue Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <LineChart className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Revenue Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Customer Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Growth Simulator</h2>
          <p className="text-sm text-gray-500">Simulate different growth scenarios and outcomes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={handleScenarioCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenarios List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                      selectedScenario?.id === scenario.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const IconComponent = scenarioTypes.find(t => t.value === scenario.type)?.icon;
                          return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                        })()}
                        <span className="text-sm font-medium">{scenario.name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          scenarioTypes.find(t => t.value === scenario.type)?.color
                        )}
                      >
                        {scenario.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {scenario.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scenario Details */}
        <div className="lg:col-span-2">
          {selectedScenario ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{selectedScenario.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScenarioRun(selectedScenario)}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Running... {currentStep}/10
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
                      onClick={() => onScenarioShare?.(selectedScenario)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="parameters" className="mt-4">
                    <div className="space-y-4">
                      {parameterCategories.map((category) => (
                        <div key={category.name}>
                          <h3 className="text-sm font-medium mb-2">{category.name}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {category.parameters.map((parameter) => {
                              const label = parameter
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                              const isPercentage = ['growthRate', 'marketShare', 'customerRetention', 'churnRate'].includes(parameter);
                              return renderParameterInput(parameter, label, isPercentage ? 'percentage' : 'number');
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assumptions" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedScenario.assumptions).map(([key, value]) => {
                          const label = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase());
                          return renderAssumptionInput(key, label);
                        })}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input
                            id="start-date"
                            type="date"
                            value={selectedScenario.timeline.startDate.toISOString().split('T')[0]}
                            onChange={(e) => {
                              const updatedScenario = {
                                ...selectedScenario,
                                timeline: {
                                  ...selectedScenario.timeline,
                                  startDate: new Date(e.target.value)
                                },
                                updatedAt: new Date()
                              };
                              setSelectedScenario(updatedScenario);
                              onScenarioUpdate?.(updatedScenario);
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="end-date">End Date</Label>
                          <Input
                            id="end-date"
                            type="date"
                            value={selectedScenario.timeline.endDate.toISOString().split('T')[0]}
                            onChange={(e) => {
                              const updatedScenario = {
                                ...selectedScenario,
                                timeline: {
                                  ...selectedScenario.timeline,
                                  endDate: new Date(e.target.value)
                                },
                                updatedAt: new Date()
                              };
                              setSelectedScenario(updatedScenario);
                              onScenarioUpdate?.(updatedScenario);
                            }}
                          />
                        </div>
                      </div>
                    </div>
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
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Scenario Selected</h3>
                <p className="text-gray-500 mb-4">
                  Select a scenario from the list or create a new one to get started.
                </p>
                <Button onClick={handleScenarioCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scenario
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrowthSimulator;
