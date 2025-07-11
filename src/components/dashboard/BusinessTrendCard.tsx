'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, ArrowRight, RefreshCw } from 'lucide-react';
import { useModal } from '@/components/modals/ModalProvider';

interface BusinessTrend {
  title: string;
  direction: 'up' | 'down' | 'stable';
  percentageChange: number;
  description: string;
  industry: string;
  aiModelVersion: string;
}

interface BusinessTrendCardProps {
  industry?: string;
  className?: string;
}

export default function BusinessTrendCard({ industry = 'technology', className = '' }: BusinessTrendCardProps) {
  const [trends, setTrends] = useState<BusinessTrend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();

  const fetchBusinessTrends = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/business-trends/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch business trends');
      }

      const data = await response.json();
      setTrends(data.trends || []);
    } catch (err) {
      console.error('Error fetching business trends:', err);
      setError('Failed to load business trends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessTrends();
  }, [industry]);

  const getDirectionIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDirectionArrow = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      case 'stable':
        return '→';
      default:
        return '→';
    }
  };

  const getPercentageColor = (direction: 'up' | 'down' | 'stable', percentage: number) => {
    if (direction === 'up' || percentage > 0) return 'text-green-600';
    if (direction === 'down' || percentage < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleViewAllTrends = () => {
    openModal({
      type: 'business_trends',
      size: 'xl',
      title: 'Business Trends',
      content: (
        <div className="space-y-4">
          {trends.map((trend, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{trend.title}</h3>
                <span className={`font-bold ${getPercentageColor(trend.direction, trend.percentageChange)}`}>
                  {getDirectionArrow(trend.direction)} {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%
                </span>
              </div>
              <p className="text-gray-600 text-sm">{trend.description}</p>
            </div>
          ))}
        </div>
      ),
      showCloseButton: true,
      closeOnBackdropClick: true
    });
  };

  const handleRefresh = () => {
    fetchBusinessTrends();
  };

  return (
    <Card className={`bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              🔥 Business Trends
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Industry-wide insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 h-8 w-8"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button onClick={fetchBusinessTrends} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {trends.slice(0, 4).map((trend, index) => (
              <div key={index} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-150">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getDirectionIcon(trend.direction)}
                    <span className="font-medium text-gray-900 text-sm">
                      {trend.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">
                      {getDirectionArrow(trend.direction)}
                    </span>
                    <span className={`font-semibold text-sm ${getPercentageColor(trend.direction, trend.percentageChange)}`}>
                      {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {trend.description}
                </p>
              </div>
            ))}

            <div className="pt-2">
              <Button
                onClick={handleViewAllTrends}
                variant="ghost"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <span>View All Trends</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}