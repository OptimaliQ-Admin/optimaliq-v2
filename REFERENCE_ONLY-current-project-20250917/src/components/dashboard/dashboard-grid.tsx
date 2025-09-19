'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3,
  Grid2X2,
  Grid4X4,
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
  EyeOff,
  Move,
  Resize,
  Lock,
  Unlock,
  Maximize,
  Minimize,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  locked: boolean;
  visible: boolean;
  data: any;
  config: any;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    category?: string;
    tags?: string[];
    owner?: string;
    team?: string;
    source?: string;
    version?: string;
    status?: 'draft' | 'published' | 'archived';
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  gridSize: {
    columns: number;
    rows: number;
    cellSize: number;
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  spacing: number;
  padding: number;
  backgroundColor: string;
  backgroundImage?: string;
  theme: 'light' | 'dark' | 'auto';
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    category?: string;
    tags?: string[];
    owner?: string;
    team?: string;
    source?: string;
    version?: string;
    status?: 'draft' | 'published' | 'archived';
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface DashboardGridProps {
  layout: DashboardLayout;
  onLayoutChange?: (layout: DashboardLayout) => void;
  onWidgetAdd?: (widget: DashboardWidget) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onWidgetUpdate?: (widget: DashboardWidget) => void;
  onWidgetMove?: (widgetId: string, x: number, y: number) => void;
  onWidgetResize?: (widgetId: string, width: number, height: number) => void;
  onLayoutSave?: (layout: DashboardLayout) => void;
  onLayoutShare?: (layout: DashboardLayout) => void;
  onLayoutExport?: (layout: DashboardLayout, format: string) => void;
  onLayoutImport?: (file: File) => void;
  editable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  className?: string;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  layout,
  onLayoutChange,
  onWidgetAdd,
  onWidgetRemove,
  onWidgetUpdate,
  onWidgetMove,
  onWidgetResize,
  onLayoutSave,
  onLayoutShare,
  onLayoutExport,
  onLayoutImport,
  editable = true,
  resizable = true,
  draggable = true,
  className
}) => {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(layout.gridSize);
  const [spacing, setSpacing] = useState(layout.spacing);
  const [padding, setPadding] = useState(layout.padding);
  const [backgroundColor, setBackgroundColor] = useState(layout.backgroundColor);
  const [theme, setTheme] = useState(layout.theme);

  const gridRef = useRef<HTMLDivElement>(null);
  const widgetRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  const gridSizes = [
    { value: 12, label: '12 Columns', icon: Grid4X4 },
    { value: 8, label: '8 Columns', icon: Grid3X3 },
    { value: 4, label: '4 Columns', icon: Grid2X2 }
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Monitor }
  ];

  const handleWidgetSelect = (widgetId: string) => {
    setSelectedWidget(widgetId);
  };

  const handleWidgetDeselect = () => {
    setSelectedWidget(null);
  };

  const handleWidgetDragStart = (e: React.MouseEvent, widgetId: string) => {
    if (!draggable) return;
    
    e.preventDefault();
    setIsDragging(true);
    setSelectedWidget(widgetId);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleWidgetDrag = (e: React.MouseEvent, widgetId: string) => {
    if (!isDragging || !draggable) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const widget = layout.widgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    const newX = Math.max(0, Math.min(
      gridSize.columns - widget.width,
      widget.x + Math.round(deltaX / (gridSize.cellSize + spacing))
    ));
    const newY = Math.max(0, Math.min(
      gridSize.rows - widget.height,
      widget.y + Math.round(deltaY / (gridSize.cellSize + spacing))
    ));
    
    if (newX !== widget.x || newY !== widget.y) {
      onWidgetMove?.(widgetId, newX, newY);
    }
  };

  const handleWidgetDragEnd = () => {
    setIsDragging(false);
  };

  const handleWidgetResizeStart = (e: React.MouseEvent, widgetId: string) => {
    if (!resizable) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setSelectedWidget(widgetId);
    
    const widget = layout.widgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: widget.width,
      height: widget.height
    });
  };

  const handleWidgetResize = (e: React.MouseEvent, widgetId: string) => {
    if (!isResizing || !resizable) return;
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    const widget = layout.widgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    const newWidth = Math.max(
      widget.minWidth,
      Math.min(
        widget.maxWidth || gridSize.columns - widget.x,
        widget.width + Math.round(deltaX / (gridSize.cellSize + spacing))
      )
    );
    const newHeight = Math.max(
      widget.minHeight,
      Math.min(
        widget.maxHeight || gridSize.rows - widget.y,
        widget.height + Math.round(deltaY / (gridSize.cellSize + spacing))
      )
    );
    
    if (newWidth !== widget.width || newHeight !== widget.height) {
      onWidgetResize?.(widgetId, newWidth, newHeight);
    }
  };

  const handleWidgetResizeEnd = () => {
    setIsResizing(false);
  };

  const handleWidgetUpdate = (widgetId: string, updates: Partial<DashboardWidget>) => {
    const widget = layout.widgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    const updatedWidget = { ...widget, ...updates, updatedAt: new Date() };
    onWidgetUpdate?.(updatedWidget);
  };

  const handleWidgetRemove = (widgetId: string) => {
    onWidgetRemove?.(widgetId);
    if (selectedWidget === widgetId) {
      setSelectedWidget(null);
    }
  };

  const handleLayoutSave = () => {
    const updatedLayout = {
      ...layout,
      gridSize,
      spacing,
      padding,
      backgroundColor,
      theme,
      updatedAt: new Date()
    };
    onLayoutSave?.(updatedLayout);
  };

  const handleLayoutShare = () => {
    onLayoutShare?.(layout);
  };

  const handleLayoutExport = (format: string) => {
    onLayoutExport?.(layout, format);
  };

  const handleLayoutImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLayoutImport?.(file);
    }
  };

  const renderWidget = (widget: DashboardWidget) => {
    const isSelected = selectedWidget === widget.id;
    const isDragging = isDragging && selectedWidget === widget.id;
    const isResizing = isResizing && selectedWidget === widget.id;
    
    return (
      <div
        key={widget.id}
        ref={(el) => {
          if (el) widgetRefs.current[widget.id] = el;
        }}
        className={cn(
          'absolute border-2 rounded-lg transition-all duration-200',
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300',
          isDragging && 'opacity-50',
          isResizing && 'opacity-50',
          !widget.visible && 'opacity-50',
          widget.locked && 'cursor-not-allowed'
        )}
        style={{
          left: widget.x * (gridSize.cellSize + spacing) + padding,
          top: widget.y * (gridSize.cellSize + spacing) + padding,
          width: widget.width * (gridSize.cellSize + spacing) - spacing,
          height: widget.height * (gridSize.cellSize + spacing) - spacing,
          backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
          color: theme === 'dark' ? '#F9FAFB' : '#111827'
        }}
        onMouseDown={(e) => handleWidgetDragStart(e, widget.id)}
        onMouseMove={(e) => handleWidgetDrag(e, widget.id)}
        onMouseUp={handleWidgetDragEnd}
        onMouseLeave={handleWidgetDragEnd}
        onClick={() => handleWidgetSelect(widget.id)}
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium truncate">{widget.title}</h3>
            {widget.locked && <Lock className="h-3 w-3 text-gray-400" />}
            {!widget.visible && <EyeOff className="h-3 w-3 text-gray-400" />}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleWidgetUpdate(widget.id, { visible: !widget.visible });
              }}
            >
              {widget.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleWidgetUpdate(widget.id, { locked: !widget.locked });
              }}
            >
              {widget.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleWidgetRemove(widget.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Widget Content */}
        <div className="p-2 flex-1 overflow-hidden">
          <div className="text-xs text-gray-500 mb-2">
            {widget.description || 'No description'}
          </div>
          <div className="text-2xl font-bold">
            {widget.data?.value || '0'}
          </div>
          <div className="text-xs text-gray-500">
            {widget.data?.label || 'No data'}
          </div>
        </div>

        {/* Resize Handle */}
        {resizable && !widget.locked && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => handleWidgetResizeStart(e, widget.id)}
            onMouseMove={(e) => handleWidgetResize(e, widget.id)}
            onMouseUp={handleWidgetResizeEnd}
            onMouseLeave={handleWidgetResizeEnd}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400 rounded-sm" />
          </div>
        )}
      </div>
    );
  };

  const renderGrid = () => {
    const gridLines = [];
    
    if (showGrid) {
      // Vertical lines
      for (let i = 0; i <= gridSize.columns; i++) {
        gridLines.push(
          <div
            key={`v-${i}`}
            className="absolute border-l border-gray-200 opacity-30"
            style={{
              left: i * (gridSize.cellSize + spacing) + padding,
              top: padding,
              height: gridSize.rows * (gridSize.cellSize + spacing) - spacing
            }}
          />
        );
      }
      
      // Horizontal lines
      for (let i = 0; i <= gridSize.rows; i++) {
        gridLines.push(
          <div
            key={`h-${i}`}
            className="absolute border-t border-gray-200 opacity-30"
            style={{
              top: i * (gridSize.cellSize + spacing) + padding,
              left: padding,
              width: gridSize.columns * (gridSize.cellSize + spacing) - spacing
            }}
          />
        );
      }
    }
    
    return gridLines;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard Grid</h2>
          <p className="text-sm text-gray-500">Arrange and customize your dashboard widgets</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLayoutSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLayoutShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Grid Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="grid-size">Grid Size</Label>
              <Select
                value={gridSize.columns.toString()}
                onValueChange={(value) => setGridSize(prev => ({ ...prev, columns: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gridSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value.toString()}>
                      <div className="flex items-center space-x-2">
                        <size.icon className="h-4 w-4" />
                        <span>{size.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="spacing">Spacing</Label>
              <Input
                id="spacing"
                type="number"
                value={spacing}
                onChange={(e) => setSpacing(parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="padding">Padding</Label>
              <Input
                id="padding"
                type="number"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="background-color">Background</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Container */}
      <div
        ref={gridRef}
        className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
        style={{
          width: gridSize.columns * (gridSize.cellSize + spacing) + padding * 2,
          height: gridSize.rows * (gridSize.cellSize + spacing) + padding * 2,
          backgroundColor
        }}
        onMouseLeave={handleWidgetDragEnd}
      >
        {/* Grid Lines */}
        {renderGrid()}
        
        {/* Widgets */}
        {layout.widgets.map(renderWidget)}
      </div>
    </div>
  );
};

export default DashboardGrid;
