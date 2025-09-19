'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  MinusCircle,
  PlusCircle,
  Settings,
  Palette,
  Download,
  Share2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Play,
  Pause,
  Stop,
  Target,
  Activity,
  Users,
  Building2,
  Globe,
  Lightbulb,
  Star,
  Award,
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
  Zap,
  Brain,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChartData {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar' | 'doughnut' | 'polar';
  data: any[];
  xAxis: string;
  yAxis: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fill: boolean;
  tension: number;
  pointRadius: number;
  pointHoverRadius: number;
  showLegend: boolean;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  showValues: boolean;
  animation: boolean;
  responsive: boolean;
  maintainAspectRatio: boolean;
  aspectRatio: number;
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    industry?: string;
    region?: string;
    segment?: string;
    owner?: string;
    team?: string;
    source?: string;
    version?: string;
    status?: 'draft' | 'published' | 'archived';
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface ChartBuilderProps {
  initialData?: ChartData;
  onSave?: (data: ChartData) => void;
  onPreview?: (data: ChartData) => void;
  onExport?: (data: ChartData, format: string) => void;
  onShare?: (data: ChartData) => void;
  onDelete?: (data: ChartData) => void;
  className?: string;
}

const CustomChartBuilder: React.FC<ChartBuilderProps> = ({
  initialData,
  onSave,
  onPreview,
  onExport,
  onShare,
  onDelete,
  className
}) => {
  const [chartData, setChartData] = useState<ChartData>(initialData || {
    id: '',
    name: '',
    type: 'line',
    data: [],
    xAxis: '',
    yAxis: '',
    color: '#3B82F6',
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6,
    showLegend: true,
    showGrid: true,
    showAxes: true,
    showLabels: true,
    showValues: true,
    animation: true,
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    width: 800,
    height: 400,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    padding: { top: 10, right: 10, bottom: 10, left: 10 },
    title: '',
    subtitle: '',
    description: '',
    tags: [],
    category: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      status: 'draft',
      visibility: 'private',
      version: '1.0.0'
    }
  });

  const [activeTab, setActiveTab] = useState('data');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'area', label: 'Area Chart', icon: AreaChart },
    { value: 'scatter', label: 'Scatter Chart', icon: ScatterChart },
    { value: 'radar', label: 'Radar Chart', icon: Target },
    { value: 'doughnut', label: 'Doughnut Chart', icon: PieChart },
    { value: 'polar', label: 'Polar Chart', icon: Target }
  ];

  const colorPalettes = [
    { name: 'Blue', colors: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A'] },
    { name: 'Green', colors: ['#10B981', '#059669', '#047857', '#065F46'] },
    { name: 'Purple', colors: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'] },
    { name: 'Red', colors: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'] },
    { name: 'Orange', colors: ['#F97316', '#EA580C', '#DC2626', '#C2410C'] },
    { name: 'Teal', colors: ['#14B8A6', '#0D9488', '#0F766E', '#115E59'] },
    { name: 'Pink', colors: ['#EC4899', '#DB2777', '#BE185D', '#9D174D'] },
    { name: 'Indigo', colors: ['#6366F1', '#4F46E5', '#4338CA', '#3730A3'] }
  ];

  const updateChartData = useCallback((updates: Partial<ChartData>) => {
    setChartData(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  }, []);

  const handleSave = () => {
    onSave?.(chartData);
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    onPreview?.(chartData);
  };

  const handleExport = (format: string) => {
    onExport?.(chartData, format);
  };

  const handleShare = () => {
    onShare?.(chartData);
  };

  const handleDelete = () => {
    onDelete?.(chartData);
  };

  const renderChartTypeSelector = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="chart-type">Chart Type</Label>
        <Select
          value={chartData.type}
          onValueChange={(value) => updateChartData({ type: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            {chartTypes.map((type) => (
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
  );

  const renderColorSelector = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="color">Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="color"
            value={chartData.color}
            onChange={(e) => updateChartData({ color: e.target.value })}
            className="w-12 h-8 p-1"
          />
          <Input
            value={chartData.color}
            onChange={(e) => updateChartData({ color: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Color Palettes</Label>
        <div className="grid grid-cols-2 gap-2">
          {colorPalettes.map((palette) => (
            <div key={palette.name} className="space-y-1">
              <div className="text-xs font-medium">{palette.name}</div>
              <div className="flex space-x-1">
                {palette.colors.map((color, index) => (
                  <button
                    key={index}
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                    onClick={() => updateChartData({ color })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDataEditor = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="x-axis">X Axis</Label>
          <Input
            id="x-axis"
            value={chartData.xAxis}
            onChange={(e) => updateChartData({ xAxis: e.target.value })}
            placeholder="X axis field"
          />
        </div>
        <div>
          <Label htmlFor="y-axis">Y Axis</Label>
          <Input
            id="y-axis"
            value={chartData.yAxis}
            onChange={(e) => updateChartData({ yAxis: e.target.value })}
            placeholder="Y axis field"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="data">Data (JSON)</Label>
        <textarea
          id="data"
          className="w-full h-32 p-2 border rounded-md font-mono text-sm"
          value={JSON.stringify(chartData.data, null, 2)}
          onChange={(e) => {
            try {
              const data = JSON.parse(e.target.value);
              updateChartData({ data });
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          placeholder="Enter data as JSON array"
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={chartData.width}
            onChange={(e) => updateChartData({ width: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={chartData.height}
            onChange={(e) => updateChartData({ height: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="border-width">Border Width</Label>
          <Input
            id="border-width"
            type="number"
            value={chartData.borderWidth}
            onChange={(e) => updateChartData({ borderWidth: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="point-radius">Point Radius</Label>
          <Input
            id="point-radius"
            type="number"
            value={chartData.pointRadius}
            onChange={(e) => updateChartData({ pointRadius: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chartData.showLegend}
              onChange={(e) => updateChartData({ showLegend: e.target.checked })}
            />
            <span className="text-sm">Show Legend</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chartData.showGrid}
              onChange={(e) => updateChartData({ showGrid: e.target.checked })}
            />
            <span className="text-sm">Show Grid</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chartData.showAxes}
              onChange={(e) => updateChartData({ showAxes: e.target.checked })}
            />
            <span className="text-sm">Show Axes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chartData.showLabels}
              onChange={(e) => updateChartData({ showLabels: e.target.checked })}
            />
            <span className="text-sm">Show Labels</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chartData.showValues}
              onChange={(e) => updateChartData({ showValues: e.target.checked })}
            />
            <span className="text-sm">Show Values</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chartData.animation}
              onChange={(e) => updateChartData({ animation: e.target.checked })}
            />
            <span className="text-sm">Animation</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chartData.responsive}
              onChange={(e) => updateChartData({ responsive: e.target.checked })}
            />
            <span className="text-sm">Responsive</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderChartPreview = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
          <p>Chart Preview</p>
          <p className="text-sm">Preview will be rendered here</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Chart Builder</h2>
          <p className="text-sm text-gray-500">Create and customize your charts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {isPreviewMode ? 'Hide Preview' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Chart Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="type">Type</TabsTrigger>
                  <TabsTrigger value="color">Color</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>
                
                <TabsContent value="data" className="mt-4">
                  {renderDataEditor()}
                </TabsContent>
                
                <TabsContent value="type" className="mt-4">
                  {renderChartTypeSelector()}
                </TabsContent>
                
                <TabsContent value="color" className="mt-4">
                  {renderColorSelector()}
                </TabsContent>
                
                <TabsContent value="style" className="mt-4">
                  {renderAppearanceSettings()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Chart Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Chart Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChartPreview()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomChartBuilder;
