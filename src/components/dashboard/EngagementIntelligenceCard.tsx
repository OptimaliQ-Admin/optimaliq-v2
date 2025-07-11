'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Users, MessageSquare, Target, AlertCircle, Activity } from 'lucide-react';
import { useModal } from '@/components/modals/ModalProvider';
import { EngagementIntelligenceInsight, SignalFactors } from '@/lib/ai/engagementIntelligenceAnalysis';
import { motion } from 'framer-motion';
import SectionTitleBar from './SectionTitleBar';

interface EngagementIntelligenceCardProps {
  industry: string;
  className?: string;
}

interface EngagementData {
  insight: EngagementIntelligenceInsight;
  cached: boolean;
  createdAt: string;
}

const EngagementIntelligenceCard: React.FC<EngagementIntelligenceCardProps> = ({
  industry,
  className = ''
}) => {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();

  const fetchEngagementInsight = async (forceRefresh = false) => {
    console.log('🎯 Fetching engagement insight for industry:', industry, 'forceRefresh:', forceRefresh);
    setLoading(true);
    setError(null);

    try {
      const url = forceRefresh 
        ? '/api/engagement-intelligence/enhanced'
        : `/api/engagement-intelligence/enhanced?industry=${encodeURIComponent(industry)}`;

      const method = forceRefresh ? 'POST' : 'GET';
      const body = forceRefresh ? JSON.stringify({ industry, forceRefresh: true }) : undefined;

      console.log('🌐 Making request to:', url, 'method:', method);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to fetch engagement insight: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Engagement insight data received:', data);
      setEngagementData(data);
    } catch (err) {
      console.error('💥 Error fetching engagement insight:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagementInsight();
  }, [industry]);

  const handleRefresh = () => {
    fetchEngagementInsight(true);
  };

  const handleViewReport = () => {
    if (!engagementData?.insight) return;

    openModal({
      type: 'ai_insight',
      size: 'xl',
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Engagement Intelligence Report`,
      content: (
        <EngagementIntelligenceModal
          data={{
            title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Engagement Intelligence Report`,
            insight: engagementData.insight,
            industry,
            dataSources: {
              social_media: true,
              email_analytics: true,
              web_analytics: true,
              customer_feedback: true
            },
            confidenceScore: engagementData.insight.confidenceScore || 85,
            lastUpdated: engagementData.createdAt
          }}
        />
      ),
      showCloseButton: true,
      closeOnEscape: true,
      closeOnBackdropClick: true
    });
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getSignalColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-orange-600';
    if (score >= 10) return 'text-yellow-600';
    if (score >= -10) return 'text-gray-600';
    if (score >= -40) return 'text-red-500';
    return 'text-red-600';
  };

  const getSignalLabel = (score: number) => {
    if (score >= 70) return 'Strong Positive';
    if (score >= 40) return 'Moderate Positive';
    if (score >= 10) return 'Weak Positive';
    if (score >= -10) return 'Neutral';
    if (score >= -40) return 'Weak Negative';
    return 'Strong Negative';
  };

  const getSignalIcon = (score: number) => {
    if (score >= 40) return <TrendingUp className="w-4 h-4" />;
    if (score >= -10) return <Activity className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  if (error) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Engagement Intelligence</h2>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full ${className}`}
    >
      <SectionTitleBar
        title="🎯 Engagement Intelligence Brief"
        tooltip="Real-time engagement insights and customer behavior analysis powered by AI."
      />

      {loading ? (
        <div className="mt-6 space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : engagementData?.insight ? (
        <div className="mt-6 space-y-4">
          {/* Signal Score Indicator */}
          {engagementData.insight.signalScore !== undefined && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSignalIcon(engagementData.insight.signalScore)}
                  <span className="text-sm font-medium text-gray-700">Engagement Signal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getSignalColor(engagementData.insight.signalScore)}`}>
                    {engagementData.insight.signalScore.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {getSignalLabel(engagementData.insight.signalScore)} engagement signals
              </p>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">Engagement</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {engagementData.insight.keyMetrics.overallEngagement.toFixed(1)}%
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-700">Sentiment</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {engagementData.insight.keyMetrics.sentimentScore.toFixed(0)}%
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-gray-700">Conversion</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {engagementData.insight.keyMetrics.conversionRate.toFixed(1)}%
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-gray-700">Growth</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {engagementData.insight.keyMetrics.audienceGrowth.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Preview Content */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <p className="text-gray-700 text-sm leading-relaxed">
              {engagementData.insight.trends.slice(0, 2).map(trend => 
                `${trend.title}: ${trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} ${trend.percentageChange.toFixed(1)}%`
              ).join(' • ')}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleViewReport}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
            >
              <span>View full report</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              {engagementData.createdAt && (
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  {formatLastUpdated(engagementData.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700 text-sm font-medium">No engagement insight available</span>
          </div>
        </div>
      )}

      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Engagement intelligence
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>
    </motion.div>
  );
};

// Simple modal component for engagement intelligence
const EngagementIntelligenceModal: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{data.title}</h3>
          <p className="text-sm text-gray-600">Last updated: {new Date(data.lastUpdated).toLocaleDateString()}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Key Trends</h4>
          <div className="space-y-2">
            {data.insight.trends.map((trend: any, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-sm text-gray-600">
                  {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                  <p className="text-xs text-gray-600">{trend.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Strategic Recommendations</h4>
          <div className="space-y-2">
            {data.insight.strategies.map((strategy: any, index: number) => (
              <div key={index} className="border-l-2 border-blue-500 pl-3">
                <p className="text-sm font-medium text-gray-900">{strategy.title}</p>
                <p className="text-xs text-gray-600">{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Full Analysis</h4>
          <p className="text-sm text-gray-700 whitespace-pre-line">{data.insight.fullInsight}</p>
        </div>
      </div>
    </div>
  );
};

export default EngagementIntelligenceCard; 