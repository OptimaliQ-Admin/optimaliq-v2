'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Globe } from 'lucide-react';
import { MarketSizeCard, GrowthRateCard, CompetitionCard, SentimentCard } from './MarketMetricCard';
import TradingViewTicker from '../shared/TradingViewTicker';
import { useModal } from '@/components/modals/ModalProvider';
import { EnhancedMarketInsight } from '@/lib/ai/enhancedMarketAnalysis';
import EnhancedAIInsightModal from '@/components/modals/EnhancedAIInsightModal';
import { motion, AnimatePresence } from 'framer-motion';
import CardLoadingAnimation from './CardLoadingAnimation';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();

  const fetchMarketInsight = async () => {
    try {
      setError(null);

      const url = `/api/market-insights/enhanced?industry=${encodeURIComponent(industry)}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch market insight');
      }

      setInsightData({
        insight: result.insight,
        cached: result.cached || false,
        createdAt: result.createdAt || new Date().toISOString()
      });

    } catch (err) {
      console.error('Error fetching market insight:', err);
      setError(err instanceof Error ? err.message : 'Failed to load market insight');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async () => {
    if (!insightData?.insight) return;

    // Fetch additional cron-generated market trend information
    let cronTrends = null;
    try {
      const cronResponse = await fetch(`/api/dashboard/market_trends?industry=${encodeURIComponent(industry)}`);
      if (cronResponse.ok) {
        const cronData = await cronResponse.json();
        cronTrends = cronData.cronTrends;
      }
    } catch (error) {
      console.error('Error fetching cron trends:', error);
    }

    openModal({
      type: 'ai_insight',
      size: 'xl',
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Market Intelligence Report`,
      content: (
        <div className="space-y-6">
          {/* Cron-generated Market Trend Summary */}
          {cronTrends?.insight && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="text-xl mr-2">📊</span>
                Market Trend Summary
              </h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {cronTrends.insight}
                </p>
              </div>
            </div>
          )}

          {/* Enhanced AI Insight Modal */}
          <EnhancedAIInsightModal
            data={{
              title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Market Intelligence Report`,
              insight: insightData.insight,
              industry,
              dataSources: {
                finnhub: true,
                alpha_vantage: true,
                news_api: true
              },
              confidenceScore: insightData.insight.confidenceScore || 85,
              lastUpdated: insightData.createdAt
            }}
          />
        </div>
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

  // Map SaaS to technology for ticker
  const tickerIndustry = industry.toLowerCase() === 'saas' ? 'technology' : industry;

  useEffect(() => {
    fetchMarketInsight();
  }, [industry]);

  if (loading) {
    return (
      <CardLoadingAnimation 
        title="Market Intelligence Loading..." 
        className={className}
      />
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Market Intelligence</h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!insightData) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Globe className="w-8 h-8 mx-auto mb-2" />
          <p>No market intelligence available</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Market Intelligence: {industry.charAt(0).toUpperCase() + industry.slice(1)}
            </h3>
            <p className="text-sm text-gray-500">
              Real-time market analysis and insights • Refreshes every Monday
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {typeof insightData?.insight?.confidenceScore === 'number' && (
              <span className="text-xs text-gray-500">Confidence {Math.round((insightData.insight.confidenceScore || 0) * 100)}%</span>
            )}
            <button
              onClick={async () => {
                try {
                  const q = 'Why is sentiment moving?';
                  const res = await fetch(`/api/market/why?industry=${encodeURIComponent(industry)}&q=${encodeURIComponent(q)}`);
                  const data = await res.json();
                  openModal({
                    type: 'ai_insight',
                    size: 'md',
                    title: 'Why?',
                    content: (
                      <div>
                        <div className="text-sm text-gray-700 mb-3">Top sources:</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {(data?.citations || []).map((c: any, i: number) => (
                            <li key={i}><a href={c.url} target="_blank" className="text-blue-600 hover:underline">{c.title}</a> <span className="text-xs text-gray-500">{new Date(c.published_at).toLocaleDateString()}</span></li>
                          ))}
                        </ul>
                      </div>
                    )
                  });
                } catch {}
              }}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Why?
            </button>
          </div>
        </div>
      </div>

      {/* Market Metrics Grid */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Market Metrics
        </h4>
        <AnimatePresence>
          {/* Market Size */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
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
          </motion.div>

          {/* Growth Rate */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
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
          </motion.div>

          {/* Competition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
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
          </motion.div>

          {/* Sentiment Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900">Market Sentiment</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insightData.insight.sentiment.score >= 70 ? 'bg-green-100 text-green-700' :
                  insightData.insight.sentiment.score >= 40 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  {getSentimentLabel(insightData.insight.sentiment.score)}
                </span>
              </div>
              <p className="text-xs text-gray-600">Overall market confidence and outlook</p>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${
                getSentimentColor(insightData.insight.sentiment.score)
              }`}>
                {Math.round(insightData.insight.sentiment.score)}%
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>



      {/* TradingView Ticker */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Live Market Data</h3>
          <TradingViewTicker industry={tickerIndustry} className="w-full h-12 mb-4" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Last updated: {formatLastUpdated(insightData.createdAt)}
          {insightData.cached && ' (cached)'}
        </div>
        <button
          onClick={handleViewReport}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View Full Report →
        </button>
      </div>
    </motion.div>
  );
};

export default EnhancedMarketInsightCard; 