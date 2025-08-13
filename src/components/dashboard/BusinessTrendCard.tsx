'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { useModal } from '@/components/modals/ModalProvider';
import { BusinessTrend } from '@/lib/ai/businessTrendAnalysis';
import NewsTicker from '@/components/shared/NewsTicker';
import { motion, AnimatePresence } from 'framer-motion';
import CardLoadingAnimation from './CardLoadingAnimation';

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
  };
  cached: boolean;
  createdAt: string;
}

export default function BusinessTrendCard({ industry = 'technology', className = '' }: BusinessTrendCardProps) {
  const [trendData, setTrendData] = useState<BusinessTrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();

  const fetchBusinessTrends = async () => {
    try {
      setError(null);

      const url = `/api/business-trends/enhanced?industry=${encodeURIComponent(industry)}&forceRefresh=true`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch business trends');
      }

      setTrendData({
        data: result.data,
        cached: result.cached || false,
        createdAt: result.data.generatedAt
      });

    } catch (err) {
      console.error('Error fetching business trends:', err);
      setError(err instanceof Error ? err.message : 'Failed to load business trends');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllTrends = async () => {
    if (!trendData?.data.trends) return;

    // Fetch additional cron-generated business trend information
    let cronTrends = null;
    try {
      const cronResponse = await fetch('/api/dashboard/business_trends');
      if (cronResponse.ok) {
        const cronData = await cronResponse.json();
        cronTrends = cronData.cronTrends;
      }
    } catch (error) {
      console.error('Error fetching cron trends:', error);
    }

    openModal({
      type: 'ai_insight',
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Business Trends Report`,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {industry.charAt(0).toUpperCase() + industry.slice(1)} Business Trends Report
            </h3>
            <p className="text-sm text-gray-600">
              Last updated: {new Date(trendData.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Cron-generated Business Trend Summary */}
          {cronTrends?.insight && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="text-xl mr-2">🔥</span>
                Business Trend Summary
              </h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {cronTrends.insight}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Strategic Business Trends</h4>
            <div className="space-y-3">
              {trendData.data.trends.map((trend, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex-shrink-0">
                    {trend.direction === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : trend.direction === 'down' ? (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                      <span className={`text-sm font-semibold ${
                        trend.direction === 'up' ? 'text-green-600' : 
                        trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{trend.description}</p>
                  </div>
                </div>
              ))}
            </div>
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
      <CardLoadingAnimation 
        title="Business Trends Loading..." 
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
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Business Trends: {industry.charAt(0).toUpperCase() + industry.slice(1)}
        </h3>
        <p className="text-sm text-gray-500">
          Strategic business trend analysis and insights • Refreshes every Monday
        </p>
      </div>
      {/* Controls under header */}
      <div className="mb-4 flex items-center flex-wrap gap-2">
        <button
              onClick={async () => {
                try {
                  const q = 'Why is this trend moving?';
                  const res = await fetch(`/api/market/why?industry=${encodeURIComponent(industry)}&q=${encodeURIComponent(q)}`);
                  const data = await res.json();
                  const citations = Array.isArray(data?.citations) ? data.citations : [];
                  openModal({
                    type: 'ai_insight',
                    size: 'md',
                    title: 'Why?',
                    content: (
                      <div>
                        {citations.length > 0 ? (
                          <>
                            <div className="text-sm text-gray-700 mb-3">Top sources:</div>
                            <ul className="list-disc pl-5 space-y-1">
                              {citations.map((c: any, i: number) => (
                                <li key={i}><a href={c.url} target="_blank" className="text-blue-600 hover:underline">{c.title}</a> <span className="text-xs text-gray-500">{new Date(c.published_at).toLocaleDateString()}</span></li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <div className="text-sm text-gray-600">No citations available yet. Data is refreshing—check back shortly.</div>
                        )}
                      </div>
                    )
                  });
                } catch {}
              }}
              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Why?
            </button>
        <button
              onClick={async () => {
                try {
                  const leverRes = await fetch('/api/market-insights/propose-lever', { method: 'POST', body: JSON.stringify({ card: 'business_trends', industry }) });
                  const lever = await leverRes.json();
                  if (lever?.applicable && lever?.lever) {
                    const addRes = await fetch('/api/growth-plan/levers/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                      title: lever.lever.title,
                      description: lever.lever.reason,
                      success_metric: lever.lever.metric,
                      target_value: lever.lever.target,
                      due_date: lever.lever.due_date,
                      owner: lever.lever.ownerHint,
                    })});
                    if (!addRes.ok) {
                      console.warn('Failed to add lever');
                    }
                  }
                } catch {}
              }}
              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              Propose Lever
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