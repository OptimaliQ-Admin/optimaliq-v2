'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus, AlertCircle, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { useModal } from '@/components/modals/ModalProvider';
import { BusinessTrend } from '@/lib/ai/businessTrendAnalysis';
import NewsTicker from '@/components/shared/NewsTicker';
import { motion, AnimatePresence } from 'framer-motion';

interface BusinessTrendCardProps {
  industry?: string;
  className?: string;
}

interface BusinessTrendData {
  data: {
    trends: BusinessTrend[];
    userTier: string;
    industry: string;
    generatedAt: string;
    signalStrength?: string;
    confidenceScore?: number;
    nextRefresh?: string;
    dataSources?: Record<string, boolean>;
  };
  cached: boolean;
  createdAt: string;
}

export default function BusinessTrendCard({ industry = 'technology', className = '' }: BusinessTrendCardProps) {
  const [trendData, setTrendData] = useState<BusinessTrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const { openModal } = useModal();

  const fetchBusinessTrends = async (forceRefresh = false) => {
    try {
      setError(null);
      if (forceRefresh) {
        setRefreshing(true);
      }

      const url = forceRefresh 
        ? `/api/business-trends/enhanced?industry=${encodeURIComponent(industry)}&forceRefresh=true`
        : `/api/business-trends/enhanced?industry=${encodeURIComponent(industry)}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch business trends');
      }

      setTrendData({
        data: result.data,
        cached: !forceRefresh,
        createdAt: result.data.generatedAt
      });

    } catch (err) {
      console.error('Error fetching business trends:', err);
      setError(err instanceof Error ? err.message : 'Failed to load business trends');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshDisabled) return;
    
    setRefreshDisabled(true);
    await fetchBusinessTrends(true);
    
    // Re-enable after 24 hours
    setTimeout(() => setRefreshDisabled(false), 24 * 60 * 60 * 1000);
  };

  const handleViewAllTrends = () => {
    if (!trendData?.data.trends) return;

    openModal({
      type: 'ai_insight',
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Business Trends Report`,
      content: (
        <div className="space-y-6">
          {/* Header with enhanced info */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {industry.charAt(0).toUpperCase() + industry.slice(1)} Business Trends Report
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {trendData.data.signalStrength || 'Strong'} Signal
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {Math.round((trendData.data.confidenceScore || 0.85) * 100)}% Confidence
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="font-medium">{new Date(trendData.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Next Refresh</p>
                <p className="font-medium">{trendData.data.nextRefresh ? new Date(trendData.data.nextRefresh).toLocaleDateString() : 'Monday 12am'}</p>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Data Sources
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {Object.entries(trendData.data.dataSources || {}).map(([source, active]) => (
                <div key={source} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="capitalize">{source.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Business Trend Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Business Trend Summary</h4>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 mb-4">
                The {industry} industry is experiencing significant transformation with {trendData.data.trends.filter(t => t.direction === 'up').length} positive trends 
                and {trendData.data.trends.filter(t => t.direction === 'down').length} declining areas. These insights are based on real-time market analysis 
                and AI-powered trend detection.
              </p>
            </div>
          </div>

          {/* Key Trends */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Key Trends</h4>
            <div className="space-y-3">
              {trendData.data.trends.map((trend, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className={`p-2 rounded-full ${
                    trend.direction === 'up' ? 'bg-green-100' : 
                    trend.direction === 'down' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-sm">
                      {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{trend.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-semibold ${
                        trend.direction === 'up' ? 'text-green-600' : 
                        trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}% change
                      </span>
                      {trend.signalScore && (
                        <span className="text-xs text-gray-500">
                          Signal: {trend.signalScore.toFixed(1)}/100
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refresh Schedule */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Schedule
            </h4>
            <p className="text-sm text-gray-700">
              This data refreshes automatically every Monday at 12am. Manual refresh is available once per day.
            </p>
          </div>
        </div>
      ),
      size: 'xl'
    });
  };

  const getDirectionIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDirectionColor = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    fetchBusinessTrends();
  }, [industry]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Business Trends</h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trendData) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <BarChart3 className="w-8 h-8 mx-auto mb-2" />
          <p>No business trends available</p>
        </div>
      </div>
    );
  }

  const { data } = trendData;

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Business Trends: {industry.charAt(0).toUpperCase() + industry.slice(1)}
          </h3>
          <p className="text-sm text-gray-500">
            Strategic business trend analysis and insights
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || refreshDisabled}
          className={`p-2 rounded-lg transition-colors ${
            refreshing || refreshDisabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title={refreshDisabled ? 'Refresh available in 24 hours' : 'Refresh data'}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Business Trends Grid */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Key Trends
        </h4>
        <AnimatePresence>
          {data.trends.slice(0, 5).map((trend, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getDirectionIcon(trend.direction)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                  <p className="text-xs text-gray-600">{trend.description}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${getDirectionColor(trend.direction)}`}>
                {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* News Ticker */}
      <div className="mb-6">
        <NewsTicker 
          className="mb-4"
          showRefreshButton={true}
          maxHeadlines={3}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Last updated: {new Date(data.generatedAt).toLocaleDateString()}
        </div>
        <button
          onClick={handleViewAllTrends}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View Full Report →
        </button>
      </div>
    </motion.div>
  );
}