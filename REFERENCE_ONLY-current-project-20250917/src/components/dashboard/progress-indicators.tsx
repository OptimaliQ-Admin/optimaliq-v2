'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Timer,
  Zap,
  Award,
  Star,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Building2,
  Globe,
  Lightbulb,
  Brain,
  Eye,
  EyeOff,
  Play,
  Pause,
  Stop,
  RotateCcw,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Bookmark,
  Flag,
  Archive,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProgressData {
  id: string;
  title: string;
  description?: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
  status: 'completed' | 'in-progress' | 'paused' | 'overdue' | 'not-started' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  category: string;
  startDate: Date;
  endDate: Date;
  lastUpdated: Date;
  milestones?: ProgressMilestone[];
  metadata?: {
    industry?: string;
    region?: string;
    segment?: string;
    owner?: string;
    team?: string;
    dependencies?: string[];
    risks?: string[];
    resources?: string[];
  };
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description?: string;
  target: number;
  achieved: number;
  percentage: number;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  dueDate: Date;
  completedDate?: Date;
}

export interface ProgressIndicatorsProps {
  data: ProgressData[];
  variant?: 'default' | 'compact' | 'detailed' | 'minimal' | 'card' | 'list';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showMilestones?: boolean;
  showMetadata?: boolean;
  showActions?: boolean;
  interactive?: boolean;
  className?: string;
  onAction?: (action: string, data: ProgressData) => void;
  onViewDetails?: (data: ProgressData) => void;
  onEdit?: (data: ProgressData) => void;
  onShare?: (data: ProgressData) => void;
  onBookmark?: (data: ProgressData) => void;
  onArchive?: (data: ProgressData) => void;
  onDelete?: (data: ProgressData) => void;
}

const ProgressIndicators: React.FC<ProgressIndicatorsProps> = ({
  data,
  variant = 'default',
  size = 'md',
  showMilestones = true,
  showMetadata = true,
  showActions = true,
  interactive = true,
  className,
  onAction,
  onViewDetails,
  onEdit,
  onShare,
  onBookmark,
  onArchive,
  onDelete
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'not-started':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'cancelled':
        return <Stop className="h-4 w-4 text-gray-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'not-started':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'revenue':
        return <TrendingUp className="h-4 w-4" />;
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
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`;
    }
    return `${value.toFixed(0)} ${unit}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (percentage: number, status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'overdue') return 'bg-red-500';
    if (status === 'paused') return 'bg-yellow-500';
    if (status === 'cancelled') return 'bg-gray-500';
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
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

  return (
    <div className={cn('space-y-4', className)}>
      {data.map((item) => (
        <Card
          key={item.id}
          className={cn(
            'transition-all duration-200',
            variantClasses[variant],
            sizeClasses[size],
            interactive && 'cursor-pointer hover:shadow-md'
          )}
        >
          <CardHeader className={cn(
            'pb-2',
            variant === 'compact' && 'pb-1',
            variant === 'minimal' && 'pb-1'
          )}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getCategoryIcon(item.category)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <CardTitle className={cn(
                      'text-sm font-medium truncate',
                      variant === 'compact' && 'text-xs',
                      variant === 'minimal' && 'text-xs font-normal'
                    )}>
                      {item.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-medium',
                        getStatusColor(item.status)
                      )}
                    >
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {getPriorityIcon(item.priority)}
                    <span className="capitalize">{item.priority} Priority</span>
                    <span>•</span>
                    <span>{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                    <span>•</span>
                    <span>{getDaysRemaining(item.endDate)} days remaining</span>
                  </div>
                </div>
              </div>
              
              {showActions && (
                <div className="flex items-center space-x-1">
                  <button
                    className="h-6 w-6 p-0 hover:bg-gray-100 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(item);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    className="h-6 w-6 p-0 hover:bg-gray-100 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare?.(item);
                    }}
                  >
                    <Share2 className="h-3 w-3" />
                  </button>
                  <button
                    className="h-6 w-6 p-0 hover:bg-gray-100 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails?.(item);
                    }}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </button>
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
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {formatValue(item.current, item.unit)} / {formatValue(item.target, item.unit)}
                  </span>
                  <span className="text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={item.percentage}
                  className="h-2"
                  style={{
                    '--progress-background': getProgressColor(item.percentage, item.status)
                  } as React.CSSProperties}
                />
              </div>

              {/* Description */}
              {item.description && (
                <div className="text-sm text-gray-700">
                  {item.description}
                </div>
              )}

              {/* Milestones */}
              {showMilestones && item.milestones && item.milestones.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-600">Milestones</div>
                  <div className="space-y-1">
                    {item.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          {milestone.status === 'completed' ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : milestone.status === 'in-progress' ? (
                            <Activity className="h-3 w-3 text-blue-500" />
                          ) : milestone.status === 'overdue' ? (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          ) : (
                            <Clock className="h-3 w-3 text-gray-500" />
                          )}
                          <span className="truncate">{milestone.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <span>{milestone.percentage.toFixed(0)}%</span>
                          <span>•</span>
                          <span>{formatDate(milestone.dueDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {showMetadata && item.metadata && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    {item.metadata.industry && (
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{item.metadata.industry}</span>
                      </div>
                    )}
                    {item.metadata.region && (
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{item.metadata.region}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>Updated {formatDate(item.lastUpdated)}</span>
                    </div>
                    {item.metadata.owner && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{item.metadata.owner}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProgressIndicators;
