'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Grid3X3,
  BarChart3,
  LineChart,
  PieChart,
  Users,
  Building2,
  Globe,
  Lightbulb,
  Star,
  Award,
  Target,
  Activity,
  Calendar,
  Clock,
  Filter,
  Search,
  Download,
  Share2,
  Bookmark,
  Eye,
  EyeOff,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Settings,
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
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Stop,
  Check,
  X,
  AlertTriangle,
  Info,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  widgets: any[];
  layout: {
    columns: number;
    rows: number;
    spacing: number;
    padding: number;
  };
  theme: 'light' | 'dark' | 'auto';
  isPublic: boolean;
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    industry?: string;
    region?: string;
    segment?: string;
    version?: string;
    status?: 'draft' | 'published' | 'archived';
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface DashboardTemplatesProps {
  templates: DashboardTemplate[];
  onTemplateSelect?: (template: DashboardTemplate) => void;
  onTemplateCreate?: (template: DashboardTemplate) => void;
  onTemplateEdit?: (template: DashboardTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  onTemplateShare?: (template: DashboardTemplate) => void;
  onTemplateDownload?: (template: DashboardTemplate) => void;
  onTemplateBookmark?: (template: DashboardTemplate) => void;
  onTemplateRate?: (template: DashboardTemplate, rating: number) => void;
  className?: string;
}

const DashboardTemplates: React.FC<DashboardTemplatesProps> = ({
  templates,
  onTemplateSelect,
  onTemplateCreate,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateShare,
  onTemplateDownload,
  onTemplateBookmark,
  onTemplateRate,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const categories = [
    { value: 'all', label: 'All Templates', icon: Grid3X3 },
    { value: 'analytics', label: 'Analytics', icon: BarChart3 },
    { value: 'marketing', label: 'Marketing', icon: Target },
    { value: 'sales', label: 'Sales', icon: TrendingUp },
    { value: 'finance', label: 'Finance', icon: DollarSign },
    { value: 'operations', label: 'Operations', icon: Activity },
    { value: 'hr', label: 'Human Resources', icon: Users },
    { value: 'product', label: 'Product', icon: Lightbulb },
    { value: 'customer', label: 'Customer', icon: Users },
    { value: 'executive', label: 'Executive', icon: Building2 }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'downloads', label: 'Downloads' },
    { value: 'createdAt', label: 'Date Created' }
  ];

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
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

  const handleTemplateSelect = (template: DashboardTemplate) => {
    onTemplateSelect?.(template);
  };

  const handleTemplateCreate = () => {
    const newTemplate: DashboardTemplate = {
      id: '',
      name: 'New Template',
      description: 'A new dashboard template',
      category: 'analytics',
      tags: [],
      thumbnail: '',
      widgets: [],
      layout: {
        columns: 12,
        rows: 8,
        spacing: 16,
        padding: 16
      },
      theme: 'light',
      isPublic: false,
      isPremium: false,
      downloads: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: '',
        name: 'Current User'
      }
    };
    onTemplateCreate?.(newTemplate);
  };

  const handleTemplateEdit = (template: DashboardTemplate) => {
    onTemplateEdit?.(template);
  };

  const handleTemplateDelete = (templateId: string) => {
    onTemplateDelete?.(templateId);
  };

  const handleTemplateShare = (template: DashboardTemplate) => {
    onTemplateShare?.(template);
  };

  const handleTemplateDownload = (template: DashboardTemplate) => {
    onTemplateDownload?.(template);
  };

  const handleTemplateBookmark = (template: DashboardTemplate) => {
    onTemplateBookmark?.(template);
  };

  const handleTemplateRate = (template: DashboardTemplate, rating: number) => {
    onTemplateRate?.(template, rating);
  };

  const renderTemplateCard = (template: DashboardTemplate) => (
    <Card
      key={template.id}
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => handleTemplateSelect(template)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium truncate">
              {template.name}
            </CardTitle>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {template.description}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {template.isPremium && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                Premium
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleTemplateBookmark(template);
              }}
            >
              <Bookmark className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Thumbnail */}
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            {template.thumbnail ? (
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-400">
                <Grid3X3 className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">No Preview</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Star className="h-3 w-3" />
              <span>{template.rating.toFixed(1)}</span>
              <span>•</span>
              <Download className="h-3 w-3" />
              <span>{template.downloads}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>{template.author.name}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateEdit(template);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateShare(template);
                }}
              >
                <Share2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateDownload(template);
                }}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleTemplateDelete(template.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard Templates</h2>
          <p className="text-sm text-gray-500">Choose from pre-built dashboard templates</p>
        </div>
        <Button onClick={handleTemplateCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Label htmlFor="search">Search Templates</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
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

            {/* Sort */}
            <div className="lg:w-48">
              <Label htmlFor="sort">Sort By</Label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div className="flex items-end space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className={cn(
        'grid gap-4',
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
      )}>
        {filteredTemplates.map(renderTemplateCard)}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Grid3X3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first template'
            }
          </p>
          <Button onClick={handleTemplateCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardTemplates;
