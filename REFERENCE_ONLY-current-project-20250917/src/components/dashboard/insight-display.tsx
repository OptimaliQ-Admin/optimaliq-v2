'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Award,
  Target,
  Zap,
  Brain,
  Eye,
  EyeOff,
  Bookmark,
  Share2,
  Download,
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  User,
  Building2,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  Filter,
  Search,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Flag,
  Archive,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InsightData {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation' | 'alert' | 'achievement' | 'prediction' | 'analysis';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  category: string;
  tags: string[];
  source: string;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
  metadata?: {
    industry?: string;
    region?: string;
    segment?: string;
    timeframe?: string;
    dataPoints?: number;
    accuracy?: number;
    relatedInsights?: string[];
    actions?: InsightAction[];
  };
}

export interface InsightAction {
  id: string;
  title: string;
  description: string;
  type: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  onClick: () => void;
}

export interface InsightDisplayProps {
  data: InsightData;
  variant?: 'default' | 'compact' | 'detailed' | 'minimal' | 'card' | 'list';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showActions?: boolean;
  showMetadata?: boolean;
  showTags?: boolean;
  showAuthor?: boolean;
  interactive?: boolean;
  expandable?: boolean;
  className?: string;
  onAction?: (action: string, data: InsightData) => void;
  onViewDetails?: (data: InsightData) => void;
  onShare?: (data: InsightData) => void;
  onBookmark?: (data: InsightData) => void;
  onLike?: (data: InsightData) => void;
  onDislike?: (data: InsightData) => void;
  onComment?: (data: InsightData) => void;
  onFlag?: (data: InsightData) => void;
  onArchive?: (data: InsightData) => void;
  onDelete?: (data: InsightData) => void;
}

const InsightDisplay: React.FC<InsightDisplayProps> = ({
  data,
  variant = 'default',
  size = 'md',
  showActions = true,
  showMetadata = true,
  showTags = true,
  showAuthor = true,
  interactive = true,
  expandable = false,
  className,
  onAction,
  onViewDetails,
  onShare,
  onBookmark,
  onLike,
  onDislike,
  onComment,
  onFlag,
  onArchive,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'trend':
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-purple-500" />;
      case 'prediction':
        return <Brain className="h-4 w-4 text-indigo-500" />;
      case 'analysis':
        return <PieChart className="h-4 w-4 text-cyan-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'risk':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'trend':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'recommendation':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'alert':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'achievement':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'prediction':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'analysis':
        return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'medium':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <ArrowUpRight className="h-3 w-3 text-green-500" />;
      case 'negative':
        return <ArrowDownRight className="h-3 w-3 text-red-500" />;
      case 'neutral':
        return <Minus className="h-3 w-3 text-gray-500" />;
      default:
        return null;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const variantClasses = {
    default: 'border shadow-sm',
    compact: 'border-0 shadow-none',
    detailed: 'border-2 shadow-lg',
    minimal: 'border-0 shadow-none bg-transparent',
    card: 'border shadow-md rounded-lg',
    list: 'border-0 shadow-none rounded-none border-b'
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(data);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(data);
  };

  const handleExpand = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card className={cn(
      'transition-all duration-200',
      variantClasses[variant],
      sizeClasses[size],
      interactive && 'cursor-pointer hover:shadow-md',
      className
    )}>
      <CardHeader className={cn(
        'pb-2',
        variant === 'compact' && 'pb-1',
        variant === 'minimal' && 'pb-1'
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getTypeIcon(data.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className={cn(
                  'text-sm font-medium truncate',
                  variant === 'compact' && 'text-xs',
                  variant === 'minimal' && 'text-xs font-normal'
                )}>
                  {data.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs font-medium',
                    getTypeColor(data.type)
                  )}
                >
                  {data.type}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {getPriorityIcon(data.priority)}
                <span className="capitalize">{data.priority} Priority</span>
                <span>•</span>
                {getImpactIcon(data.impact)}
                <span className="capitalize">{data.impact} Impact</span>
                <span>•</span>
                <span className={cn(
                  'font-medium',
                  getConfidenceColor(data.confidence)
                )}>
                  {getConfidenceLabel(data.confidence)} Confidence
                </span>
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <ThumbsUp className={cn(
                  'h-3 w-3',
                  isLiked && 'text-blue-500 fill-current'
                )} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmark();
                }}
              >
                <Bookmark className={cn(
                  'h-3 w-3',
                  isBookmarked && 'text-yellow-500 fill-current'
                )} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(data);
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
                  onViewDetails?.(data);
                }}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn(
        'pt-0',
        variant === 'compact' && 'pt-1',
        variant === 'minimal' && 'pt-1'
      )}>
        <div className="space-y-3">
          {/* Description */}
          <div className="text-sm text-gray-700">
            {expandable && !isExpanded ? (
              <div className="line-clamp-2">
                {data.description}
              </div>
            ) : (
              <div>
                {data.description}
              </div>
            )}
          </div>

          {/* Tags */}
          {showTags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Metadata */}
          {showMetadata && data.metadata && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                {data.metadata.industry && (
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{data.metadata.industry}</span>
                  </div>
                )}
                {data.metadata.region && (
                  <div className="flex items-center space-x-1">
                    <Globe className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{data.metadata.region}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDate(data.createdAt)}</span>
                  {data.updatedAt.getTime() !== data.createdAt.getTime() && (
                    <>
                      <span>•</span>
                      <span>Updated {formatDate(data.updatedAt)}</span>
                    </>
                  )}
                </div>
                {data.author && showAuthor && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{data.author}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {data.metadata?.actions && data.metadata.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {data.metadata.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.type === 'primary' ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                >
                  {action.icon}
                  {action.title}
                </Button>
              ))}
            </div>
          )}

          {/* Expand/Collapse */}
          {expandable && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                className="text-xs"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show More
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightDisplay;
