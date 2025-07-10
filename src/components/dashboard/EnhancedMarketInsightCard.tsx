'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { MarketSizeCard, GrowthRateCard, CompetitionCard, SentimentCard } from './MarketMetricCard';
import TradingViewTicker from '../shared/TradingViewTicker';
import { useModal } from '@/components/modals/ModalProvider';
import { EnhancedMarketInsight } from '@/lib/ai/enhancedMarketAnalysis';
import EnhancedAIInsightModal from '@/components/modals/EnhancedAIInsightModal';

interface EnhancedMarketInsightCardProps {
  industry: string;
  className?: string;
}

interface MarketInsightData {
  insight: EnhancedMarketInsight;
  cached: boolean;
  createdAt: string;
}

const EnhancedMarketInsightCard: React.FC<EnhancedMarketInsightCardProps> = ({
  industry,
  className = ''
}) => {
  const [insightData, setInsightData] = useState<MarketInsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();

  const fetchMarketInsight = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const url = forceRefresh 
        ? '/api/market-insights/enhanced'
        : `/api/market-insights/enhanced?industry=${encodeURIComponent(industry)}`;

      const method = forceRefresh ? 'POST' : 'GET';
      const body = forceRefresh ? JSON.stringify({ industry }) : undefined;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market insight');
      }

      const data = await response.json();
      setInsightData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching market insight:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketInsight();
  }, [industry]);

  const handleRefresh = () => {
    fetchMarketInsight(true);
  };

  const handleViewReport = () => {
    if (!insightData?.insight) return;

    openModal({
      type: 'ai_insight',
      size: 'xl',
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Market Intelligence Report`,
      content: (
        <EnhancedAIInsightModal
          isOpen={true}
          onClose={() => {}} // Will be handled by the modal system
          data={{
            title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Market Intelligence Report`,
            insight: insightData.insight,
            industry,
            dataSources: insightData.insight.dataSources,
            confidenceScore: insightData.insight.confidenceScore,
            lastUpdated: insightData.createdAt
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

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Market Intelligence</h2>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {industry.charAt(0).toUpperCase() + industry.slice(1)} Market Intelligence
              </h2>
              {insightData && (
                <p className="text-sm text-gray-500">
                  Last updated {formatLastUpdated(insightData.createdAt)}
                  {insightData.cached && ' (cached)'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && !insightData && (
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Analyzing market data...</span>
          </div>
        </div>
      )}

      {/* Content */}
      {insightData?.insight && (
        <>
          {/* Market Metrics Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MarketSizeCard
              value={insightData.insight.marketSize.value}
              growth={insightData.insight.marketSize.growth}
              currency={insightData.insight.marketSize.currency}
              description={insightData.insight.marketSize.description}
            />
            <GrowthRateCard
              value={insightData.insight.growthRate.value}
              trend={insightData.insight.growthRate.trend}
              period={insightData.insight.growthRate.period}
              description={insightData.insight.growthRate.description}
            />
            <CompetitionCard
              level={insightData.insight.competition.level}
              trend={insightData.insight.competition.trend}
              description={insightData.insight.competition.description}
            />
            <SentimentCard
              score={insightData.insight.sentiment.score}
              trend={insightData.insight.sentiment.trend}
              description={insightData.insight.sentiment.description}
            />
          </div>

          {/* TradingView Ticker */}
          <div className="px-6 pb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Live Market Data</h3>
              <TradingViewTicker industry={industry} />
            </div>
          </div>

          {/* Action Button */}
          <div className="px-6 pb-6">
            <button
              onClick={handleViewReport}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <TrendingUp className="w-5 h-5" />
              View Market Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedMarketInsightCard; 