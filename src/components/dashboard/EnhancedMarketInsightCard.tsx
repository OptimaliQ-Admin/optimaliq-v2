'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, BarChart3, TrendingUp, AlertCircle, Globe } from 'lucide-react';
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
    console.log('🔍 Fetching market insight for industry:', industry, 'forceRefresh:', forceRefresh);
    setLoading(true);
    setError(null);

    try {
      const url = forceRefresh 
        ? '/api/market-insights/enhanced'
        : `/api/market-insights/enhanced?industry=${encodeURIComponent(industry)}`;

      const method = forceRefresh ? 'POST' : 'GET';
      const body = forceRefresh ? JSON.stringify({ industry }) : undefined;

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
        throw new Error(`Failed to fetch market insight: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Market insight data received:', data);
      setInsightData(data);
    } catch (err) {
      console.error('💥 Error fetching market insight:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return 'Positive';
    if (score >= 40) return 'Neutral';
    return 'Negative';
  };

  if (error) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Market Intelligence</h2>
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
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Market Intelligence</h3>
          <p className="text-sm text-gray-500 capitalize">{industry} industry</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
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

      {/* Loading State */}
      {loading && !insightData && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Analyzing market data...</span>
        </div>
      )}

      {/* Content */}
      {insightData?.insight && (
        <>
          {/* Market Metrics Grid */}
          <div className="space-y-4">
            {/* Market Size */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Market Size</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {insightData.insight.marketSize.growth > 0 ? '+' : ''}{insightData.insight.marketSize.growth}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">{insightData.insight.marketSize.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{insightData.insight.marketSize.value}</div>
              </div>
            </div>

            {/* Growth Rate */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Growth Rate</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {insightData.insight.growthRate.trend > 0 ? '+' : ''}{insightData.insight.growthRate.trend}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">{insightData.insight.growthRate.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{insightData.insight.growthRate.value}%</div>
              </div>
            </div>

            {/* Competition */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Competition</h4>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    {insightData.insight.competition.trend}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{insightData.insight.competition.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{insightData.insight.competition.level}</div>
              </div>
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900">Market Sentiment</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  insightData.insight.sentiment.score >= 70 ? 'bg-green-500' :
                  insightData.insight.sentiment.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-xs font-medium ${
                  getSentimentColor(insightData.insight.sentiment.score)
                }`}>
                  {getSentimentLabel(insightData.insight.sentiment.score)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  insightData.insight.sentiment.score >= 70 ? 'bg-green-500' :
                  insightData.insight.sentiment.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${insightData.insight.sentiment.score}%` }}
              />
            </div>
          </div>

          {/* TradingView Ticker */}
          <div className="mt-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Live Market Data</h3>
              <TradingViewTicker industry={industry} />
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <button
              onClick={handleViewReport}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm"
            >
              View Market Report
            </button>
          </div>

          {/* Last Updated */}
          {insightData && (
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Last updated {formatLastUpdated(insightData.createdAt)}
                {insightData.cached && ' (cached)'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EnhancedMarketInsightCard; 