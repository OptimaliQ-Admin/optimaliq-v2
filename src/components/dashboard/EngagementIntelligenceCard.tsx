'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Users, MessageSquare, Target, AlertCircle, Activity, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useModal } from '@/components/modals/ModalProvider';
import { EngagementInsight, EngagementTrend } from '@/lib/ai/engagementIntelligenceAnalysis';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitleBar from './SectionTitleBar';

interface EngagementIntelligenceCardProps {
  industry: string;
  className?: string;
}

interface EngagementData {
  data: EngagementInsight;
  cached: boolean;
  createdAt: string;
}

const EngagementIntelligenceCard: React.FC<EngagementIntelligenceCardProps> = ({ 
  industry, 
  className = '' 
}) => {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const { openModal } = useModal();

  const fetchEngagementData = async (forceRefresh = false) => {
    try {
      setError(null);
      if (forceRefresh) {
        setRefreshing(true);
      }

      const url = forceRefresh 
        ? `/api/engagement-intelligence/enhanced?industry=${encodeURIComponent(industry)}&forceRefresh=true`
        : `/api/engagement-intelligence/enhanced?industry=${encodeURIComponent(industry)}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch engagement intelligence');
      }

      setEngagementData({
        data: result.data,
        cached: !forceRefresh,
        createdAt: result.data.lastUpdated
      });

    } catch (err) {
      console.error('Error fetching engagement intelligence:', err);
      setError(err instanceof Error ? err.message : 'Failed to load engagement intelligence');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshDisabled) return;
    
    setRefreshDisabled(true);
    await fetchEngagementData(true);
    
    // Re-enable after 24 hours
    setTimeout(() => setRefreshDisabled(false), 24 * 60 * 60 * 1000);
  };

  const handleViewFullReport = () => {
    if (!engagementData) return;

    openModal({
      type: 'ai_insight',
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Engagement Intelligence Report`,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {industry.charAt(0).toUpperCase() + industry.slice(1)} Engagement Intelligence Report
            </h3>
            <p className="text-sm text-gray-600">
              Last updated: {new Date(engagementData.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Signal Analysis</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Signal Score: {engagementData.data.signalScore}/100</span>
              <span className="text-sm font-semibold text-gray-900">{engagementData.data.signalSummary}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Key Trends</h4>
            <div className="space-y-2">
              {engagementData.data.trends.map((trend, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">
                    {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                    <p className="text-xs text-gray-600">{trend.description}</p>
                    <p className="text-xs text-gray-500">
                      {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange.toFixed(1)}% change
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Strategic Recommendations</h4>
            <div className="space-y-2">
              {engagementData.data.recommendations.map((recommendation, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-3">
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      size: 'xl'
    });
  };

  useEffect(() => {
    fetchEngagementData();
  }, [industry]);

  const getSignalColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    if (score >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSignalBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'flat') => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      case 'flat':
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'flat') => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'flat':
        return 'text-gray-600';
    }
  };

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
            <h3 className="font-semibold">Engagement Intelligence</h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!engagementData) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <p>No engagement data available</p>
        </div>
      </div>
    );
  }

  const { data: insight } = engagementData;

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
            Engagement Intelligence: {industry.charAt(0).toUpperCase() + industry.slice(1)}
          </h3>
          <p className="text-sm text-gray-500">
            Strategic engagement trends and recommendations
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

      {/* Signal Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Signal Strength</span>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getSignalColor(insight.signalScore)}`}>
            {insight.signalSummary}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getSignalBarColor(insight.signalScore)}`}
            initial={{ width: 0 }}
            animate={{ width: `${insight.signalScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Weak</span>
          <span>Strong</span>
        </div>
      </div>

      {/* Mini Trends Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Key Trends
        </h4>
        <div className="space-y-3">
          <AnimatePresence>
            {insight.trends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getTrendIcon(trend.direction)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                    <p className="text-xs text-gray-600">{trend.description}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${getTrendColor(trend.direction)}`}>
                  {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange.toFixed(1)}%
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Strategic Recommendations
        </h4>
        <div className="space-y-2">
          <AnimatePresence>
            {insight.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-2"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Last updated: {new Date(insight.lastUpdated).toLocaleDateString()}
        </div>
        <button
          onClick={handleViewFullReport}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View Full Report →
        </button>
      </div>
    </motion.div>
  );
};

export default EngagementIntelligenceCard; 