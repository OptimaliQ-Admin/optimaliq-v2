'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  Activity,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Building2,
  Globe,
  Lightbulb,
  Star,
  Award,
  Calendar,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Download,
  Share2,
  Bookmark,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TrendData {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  timeframe: string;
  confidence: number;
  source: string;
  lastUpdated: Date;
  metadata?: {
    industry?: string;
    region?: string;
    segment?: string;
    priority?: 'high' | 'medium' | 'low';
    impact?: 'positive' | 'negative' | 'neutral';
  };
}

export interface TrendCardProps {
  data: TrendData;
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showActions?: boolean;
  showMetadata?: boolean;
  interactive?: boolean;
  className?: string;
  onAction?: (action: string, data: TrendData) => void;
  onViewDetails?: (data: TrendData) => void;
  onShare?: (data: TrendData) => void;
  onBookmark?: (data: TrendData) => void;
}

const TrendCard: React.FC<TrendCardProps> = ({
  data,
  variant = 'default',
  size = 'md',
  showActions = true,
  showMetadata = true,
  interactive = true,
  className,
  onAction,
  onViewDetails,
  onShare,
  onBookmark
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: string) => {
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

  const getImpactIcon = (impact?: string) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'revenue':
        return <DollarSign className="h-4 w-4" />;
      case 'users':
        return <Users className="h-4 w-4" />;
      case 'growth':
        return <TrendingUp className="h-4 w-4" />;
      case 'performance':
        return <Activity className="h-4 w-4" />;
      case 'market':
        return <Building2 className="h-4 w-4" />;
      case 'global':
        return <Globe className="h-4 w-4" />;
      case 'innovation':
        return <Lightbulb className="h-4 w-4" />;
      case 'quality':
        return <Star className="h-4 w-4" />;
      case 'achievement':
        return <Award className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const formatValue = (value: number, category: string) => {
    if (category.toLowerCase().includes('percentage') || category.toLowerCase().includes('rate')) {
      return `${value.toFixed(1)}%`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatChange = (change: number, changePercentage: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${changePercentage.toFixed(1)}%`;
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
    minimal: 'border-0 shadow-none bg-transparent'
  };

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      variantClasses[variant],
      sizeClasses[size],
      interactive && 'cursor-pointer hover:scale-[1.02]',
      className
    )}>
      <CardHeader className={cn(
        'pb-2',
        variant === 'compact' && 'pb-1',
        variant === 'minimal' && 'pb-1'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(data.category)}
            <CardTitle className={cn(
              'text-sm font-medium',
              variant === 'compact' && 'text-xs',
              variant === 'minimal' && 'text-xs font-normal'
            )}>
              {data.title}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon(data.trend)}
            {showActions && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark?.(data);
                  }}
                >
                  <Bookmark className="h-3 w-3" />
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
        </div>
      </CardHeader>

      <CardContent className={cn(
        'pt-0',
        variant === 'compact' && 'pt-1',
        variant === 'minimal' && 'pt-1'
      )}>
        <div className="space-y-3">
          {/* Main Value and Change */}
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {formatValue(data.value, data.category)}
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-medium',
                getTrendColor(data.trend)
              )}
            >
              {formatChange(data.change, data.changePercentage)}
            </Badge>
          </div>

          {/* Previous Value */}
          <div className="text-sm text-gray-500">
            Previous: {formatValue(data.previousValue, data.category)}
          </div>

          {/* Confidence and Timeframe */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className={cn(
                'font-medium',
                getConfidenceColor(data.confidence)
              )}>
                {getConfidenceLabel(data.confidence)} Confidence
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{data.timeframe}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>{data.lastUpdated.toLocaleDateString()}</span>
            </div>
          </div>

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
              
              <div className="flex items-center justify-between">
                {data.metadata.priority && (
                  <div className="flex items-center space-x-1">
                    {getPriorityIcon(data.metadata.priority)}
                    <span className="text-xs text-gray-600 capitalize">
                      {data.metadata.priority} Priority
                    </span>
                  </div>
                )}
                {data.metadata.impact && (
                  <div className="flex items-center space-x-1">
                    {getImpactIcon(data.metadata.impact)}
                    <span className="text-xs text-gray-600 capitalize">
                      {data.metadata.impact} Impact
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Source */}
          <div className="text-xs text-gray-400">
            Source: {data.source}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendCard;
