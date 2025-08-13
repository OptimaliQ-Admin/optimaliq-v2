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
  sources?: Array<{ title?: string; url?: string; source?: string; published_at?: string }>;
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

      const url = `/api/market-insights/enhanced?industry=${encodeURIComponent(industry)}&forceRefresh=true`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch market insight');
      }

      setInsightData({
        insight: result.insight,
        cached: result.cached || false,
        createdAt: result.createdAt || new Date().toISOString(),
        sources: result.sources || [],
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
            <span className="text-xs text-gray-500">Confidence {Math.round((insightData?.insight?.confidenceScore || 0) * 100)}%</span>
            <span className="text-xs text-gray-400">• Sources {(insightData as any)?.sources?.length ?? 0}</span>
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
            <button
              onClick={async () => {
                try {
                  const leverRes = await fetch('/api/market-insights/propose-lever', { method: 'POST', body: JSON.stringify({ card: 'market_signals', industry }) });
                  const lever = await leverRes.json();
                  if (lever?.applicable && lever?.lever) {
                    await fetch('/api/growth-plan/levers/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                      title: lever.lever.title,
                      description: lever.lever.reason,
                      success_metric: lever.lever.metric,
                      target_value: lever.lever.target,
                      due_date: lever.lever.due_date,
                      owner: lever.lever.ownerHint,
                    })});
                  }
                } catch {}
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Propose Lever
            </button>
          </div>
        </div>
      </div>

      {/* Market Radar Dials */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Growth Momentum', value: Math.round((insightData?.insight?.growthRate?.value || 0) * 10) },
          { label: 'Sentiment', value: Math.round(insightData?.insight?.sentiment?.score || 0) },
          { label: 'Competition', value: insightData?.insight?.competition?.level === 'High' ? 80 : insightData?.insight?.competition?.level === 'Medium' ? 50 : 20 },
          { label: 'Capital Flow', value: 60 },
        ].map((d, i) => (
          <div key={i} className="p-3 rounded-lg border bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">{d.label}</span>
              <span className="text-xs text-gray-400">{d.value}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${d.value >= 70 ? 'bg-green-500' : d.value >= 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${d.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      {/* Forecast Cone Placeholder */}
      <div className="mb-4 p-3 rounded-lg border bg-gray-50">
        <div className="text-xs text-gray-600 mb-1">30-day Outlook</div>
        <div className="h-8 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded" />
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