'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  EyeOff,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RealTimeUpdate {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'update';
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  data?: any;
  metadata?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    duration?: number;
    retryCount?: number;
  };
}

export interface RealTimeUpdatesProps {
  updates: RealTimeUpdate[];
  isConnected: boolean;
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
  onRefresh?: () => void;
  onClear?: () => void;
  onUpdateClick?: (update: RealTimeUpdate) => void;
  className?: string;
}

const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({
  updates,
  isConnected,
  isEnabled,
  onToggle,
  onRefresh,
  onClear,
  onUpdateClick,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'warning' | 'info'>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'update':
        return <Activity className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'update':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredUpdates = updates.filter(update => 
    filter === 'all' || update.type === filter
  );

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <CardTitle className="text-sm">Real-time Updates</CardTitle>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                isConnected ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              )}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onToggle?.(!isEnabled)}
            >
              {isEnabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onRefresh}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isExpanded && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Filter:</span>
              <div className="flex space-x-1">
                {['all', 'success', 'error', 'warning', 'info'].map((type) => (
                  <Button
                    key={type}
                    variant={filter === type ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setFilter(type as any)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Updates List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredUpdates.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No updates available</p>
                </div>
              ) : (
                filteredUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-start space-x-2 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer"
                    onClick={() => onUpdateClick?.(update)}
                  >
                    {getTypeIcon(update.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium truncate">
                          {update.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            getTypeColor(update.type)
                          )}
                        >
                          {update.type}
                        </Badge>
                        <span className={cn(
                          'text-xs font-medium',
                          getPriorityColor(update.priority)
                        )}>
                          {update.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {update.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(update.timestamp)}</span>
                        <span>•</span>
                        <span>{update.source}</span>
                        <span>•</span>
                        <span>{update.category}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {filteredUpdates.length} updates
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={onClear}
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={onRefresh}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeUpdates;
