'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Play,
  Pause,
  Stop,
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
  Move,
  Resize,
  Lock,
  Unlock,
  Maximize,
  Minimize
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuadrantData {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  size: number;
  color: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'inactive' | 'completed' | 'paused';
  progress: number;
  impact: number;
  effort: number;
  value: number;
  risk: number;
  confidence: number;
  tags: string[];
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

export interface QuadrantVisualizationProps {
  data: QuadrantData[];
  title?: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisMin?: number;
  xAxisMax?: number;
  yAxisMin?: number;
  yAxisMax?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  showTooltips?: boolean;
  interactive?: boolean;
  editable?: boolean;
  onDataUpdate?: (data: QuadrantData[]) => void;
  onDataSelect?: (data: QuadrantData) => void;
  onDataEdit?: (data: QuadrantData) => void;
  onDataDelete?: (dataId: string) => void;
  onDataAdd?: (data: QuadrantData) => void;
  className?: string;
}

const QuadrantVisualization: React.FC<QuadrantVisualizationProps> = ({
  data = [],
  title = 'Growth Quadrant',
  subtitle = 'Position your growth initiatives',
  xAxisLabel = 'Impact',
  yAxisLabel = 'Effort',
  xAxisMin = 0,
  xAxisMax = 10,
  yAxisMin = 0,
  yAxisMax = 10,
  showGrid = true,
  showAxes = true,
  showLabels = true,
  showValues = true,
  showTooltips = true,
  interactive = true,
  editable = false,
  onDataUpdate,
  onDataSelect,
  onDataEdit,
  onDataDelete,
  onDataAdd,
  className
}) => {
  const [selectedData, setSelectedData] = useState<QuadrantData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredData, setHoveredData] = useState<QuadrantData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const width = 800;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const xScale = (value: number) => {
    return ((value - xAxisMin) / (xAxisMax - xAxisMin)) * plotWidth;
  };

  const yScale = (value: number) => {
    return plotHeight - ((value - yAxisMin) / (yAxisMax - yAxisMin)) * plotHeight;
  };

  const getQuadrant = (x: number, y: number) => {
    const midX = (xAxisMin + xAxisMax) / 2;
    const midY = (yAxisMin + yAxisMax) / 2;
    
    if (x >= midX && y >= midY) return 'high-impact-high-effort';
    if (x >= midX && y < midY) return 'high-impact-low-effort';
    if (x < midX && y >= midY) return 'low-impact-high-effort';
    return 'low-impact-low-effort';
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'high-impact-high-effort':
        return 'bg-red-100 border-red-300';
      case 'high-impact-low-effort':
        return 'bg-green-100 border-green-300';
      case 'low-impact-high-effort':
        return 'bg-yellow-100 border-yellow-300';
      case 'low-impact-low-effort':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getQuadrantLabel = (quadrant: string) => {
    switch (quadrant) {
      case 'high-impact-high-effort':
        return 'High Impact, High Effort';
      case 'high-impact-low-effort':
        return 'High Impact, Low Effort';
      case 'low-impact-high-effort':
        return 'Low Impact, High Effort';
      case 'low-impact-low-effort':
        return 'Low Impact, Low Effort';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'inactive':
        return 'text-gray-600 bg-gray-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleDataClick = (data: QuadrantData) => {
    if (interactive) {
      setSelectedData(data);
      onDataSelect?.(data);
    }
  };

  const handleDataHover = (data: QuadrantData | null) => {
    if (showTooltips) {
      setHoveredData(data);
    }
  };

  const handleDataDragStart = (e: React.MouseEvent, data: QuadrantData) => {
    if (editable && interactive) {
      e.preventDefault();
      setIsDragging(true);
      setSelectedData(data);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDataDrag = (e: React.MouseEvent, data: QuadrantData) => {
    if (isDragging && editable && interactive) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newX = Math.max(xAxisMin, Math.min(xAxisMax, data.x + deltaX * 0.01));
      const newY = Math.max(yAxisMin, Math.min(yAxisMax, data.y + deltaY * 0.01));
      
      const updatedData = data.map(item => 
        item.id === data.id 
          ? { ...item, x: newX, y: newY }
          : item
      );
      
      onDataUpdate?.(updatedData);
    }
  };

  const handleDataDragEnd = () => {
    setIsDragging(false);
  };

  const renderQuadrant = (quadrant: string) => {
    const midX = (xAxisMin + xAxisMax) / 2;
    const midY = (yAxisMin + yAxisMax) / 2;
    
    let x, y, width, height;
    
    switch (quadrant) {
      case 'high-impact-high-effort':
        x = xScale(midX);
        y = yScale(midY);
        width = plotWidth - xScale(midX);
        height = yScale(midY);
        break;
      case 'high-impact-low-effort':
        x = xScale(midX);
        y = 0;
        width = plotWidth - xScale(midX);
        height = yScale(midY);
        break;
      case 'low-impact-high-effort':
        x = 0;
        y = yScale(midY);
        width = xScale(midX);
        height = yScale(midY);
        break;
      case 'low-impact-low-effort':
        x = 0;
        y = 0;
        width = xScale(midX);
        height = yScale(midY);
        break;
      default:
        return null;
    }
    
    return (
      <rect
        key={quadrant}
        x={x}
        y={y}
        width={width}
        height={height}
        className={cn(
          'fill-current opacity-20',
          getQuadrantColor(quadrant)
        )}
      />
    );
  };

  const renderDataPoint = (data: QuadrantData) => {
    const x = xScale(data.x);
    const y = yScale(data.y);
    const radius = Math.max(8, Math.min(24, data.size * 2));
    const isSelected = selectedData?.id === data.id;
    const isHovered = hoveredData?.id === data.id;
    
    return (
      <g key={data.id}>
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={data.color}
          stroke={isSelected ? '#3B82F6' : '#FFFFFF'}
          strokeWidth={isSelected ? 3 : 2}
          className={cn(
            'cursor-pointer transition-all duration-200',
            isHovered && 'opacity-80',
            isDragging && selectedData?.id === data.id && 'opacity-50'
          )}
          onClick={() => handleDataClick(data)}
          onMouseEnter={() => handleDataHover(data)}
          onMouseLeave={() => handleDataHover(null)}
          onMouseDown={(e) => handleDataDragStart(e, data)}
          onMouseMove={(e) => handleDataDrag(e, data)}
          onMouseUp={handleDataDragEnd}
        />
        
        {showLabels && (
          <text
            x={x}
            y={y - radius - 8}
            textAnchor="middle"
            className="text-xs font-medium fill-gray-700"
          >
            {data.name}
          </text>
        )}
        
        {showValues && (
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {data.value}
          </text>
        )}
      </g>
    );
  };

  const renderTooltip = () => {
    if (!hoveredData || !showTooltips) return null;
    
    const x = xScale(hoveredData.x);
    const y = yScale(hoveredData.y);
    
    return (
      <g>
        <rect
          x={x + 10}
          y={y - 60}
          width={200}
          height={50}
          fill="white"
          stroke="#E5E7EB"
          strokeWidth={1}
          rx={4}
          className="shadow-lg"
        />
        <text
          x={x + 15}
          y={y - 45}
          className="text-sm font-medium fill-gray-900"
        >
          {hoveredData.name}
        </text>
        <text
          x={x + 15}
          y={y - 30}
          className="text-xs fill-gray-600"
        >
          Impact: {hoveredData.impact} | Effort: {hoveredData.effort}
        </text>
        <text
          x={x + 15}
          y={y - 15}
          className="text-xs fill-gray-500"
        >
          {hoveredData.description}
        </text>
      </g>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDataAdd?.({
              id: '',
              name: 'New Initiative',
              description: 'A new growth initiative',
              x: 5,
              y: 5,
              size: 10,
              color: '#3B82F6',
              category: 'growth',
              priority: 'medium',
              status: 'active',
              progress: 0,
              impact: 5,
              effort: 5,
              value: 0,
              risk: 0,
              confidence: 0.5,
              tags: []
            })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Quadrant Visualization */}
      <Card>
        <CardContent className="p-4">
          <div ref={containerRef} className="relative">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              className="border border-gray-200 rounded-lg"
            >
              {/* Grid */}
              {showGrid && (
                <g>
                  {/* Vertical grid lines */}
                  {Array.from({ length: 11 }, (_, i) => {
                    const x = (i / 10) * plotWidth;
                    return (
                      <line
                        key={`v-${i}`}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={plotHeight}
                        stroke="#E5E7EB"
                        strokeWidth={1}
                      />
                    );
                  })}
                  
                  {/* Horizontal grid lines */}
                  {Array.from({ length: 11 }, (_, i) => {
                    const y = (i / 10) * plotHeight;
                    return (
                      <line
                        key={`h-${i}`}
                        x1={0}
                        y1={y}
                        x2={plotWidth}
                        y2={y}
                        stroke="#E5E7EB"
                        strokeWidth={1}
                      />
                    );
                  })}
                </g>
              )}
              
              {/* Quadrants */}
              {['high-impact-high-effort', 'high-impact-low-effort', 'low-impact-high-effort', 'low-impact-low-effort'].map(renderQuadrant)}
              
              {/* Data Points */}
              {data.map(renderDataPoint)}
              
              {/* Tooltip */}
              {renderTooltip()}
              
              {/* Axes */}
              {showAxes && (
                <g>
                  {/* X-axis */}
                  <line
                    x1={0}
                    y1={plotHeight}
                    x2={plotWidth}
                    y2={plotHeight}
                    stroke="#374151"
                    strokeWidth={2}
                  />
                  
                  {/* Y-axis */}
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={plotHeight}
                    stroke="#374151"
                    strokeWidth={2}
                  />
                  
                  {/* X-axis label */}
                  <text
                    x={plotWidth / 2}
                    y={plotHeight + 30}
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-700"
                  >
                    {xAxisLabel}
                  </text>
                  
                  {/* Y-axis label */}
                  <text
                    x={-30}
                    y={plotHeight / 2}
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-700"
                    transform={`rotate(-90, -30, ${plotHeight / 2})`}
                  >
                    {yAxisLabel}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {['high-impact-high-effort', 'high-impact-low-effort', 'low-impact-high-effort', 'low-impact-low-effort'].map((quadrant) => (
          <div key={quadrant} className="flex items-center space-x-2">
            <div className={cn('w-4 h-4 rounded', getQuadrantColor(quadrant))} />
            <span className="text-sm text-gray-600">{getQuadrantLabel(quadrant)}</span>
          </div>
        ))}
      </div>

      {/* Selected Data Details */}
      {selectedData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Initiative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{selectedData.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getStatusColor(selectedData.status))}
                  >
                    {selectedData.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getPriorityColor(selectedData.priority))}
                  >
                    {selectedData.priority} priority
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{selectedData.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Impact:</span>
                  <span className="ml-2 font-medium">{selectedData.impact}</span>
                </div>
                <div>
                  <span className="text-gray-500">Effort:</span>
                  <span className="ml-2 font-medium">{selectedData.effort}</span>
                </div>
                <div>
                  <span className="text-gray-500">Value:</span>
                  <span className="ml-2 font-medium">{selectedData.value}</span>
                </div>
                <div>
                  <span className="text-gray-500">Risk:</span>
                  <span className="ml-2 font-medium">{selectedData.risk}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDataEdit?.(selectedData)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDataDelete?.(selectedData.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuadrantVisualization;
