'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus, AlertCircle, BarChart3 } from 'lucide-react';
import { useModal } from '@/components/modals/ModalProvider';
import { BusinessTrend } from '@/lib/ai/businessTrendAnalysis';

interface BusinessTrendCardProps {
  industry?: string;
  className?: string;
}

interface BusinessTrendData {
  trends: BusinessTrend[];
  userTier: string;
  industry: string;
  generatedAt: string;
}

export default function BusinessTrendCard({ industry = 'technology', className = '' }: BusinessTrendCardProps) {
  const [trendData, setTrendData] = useState<BusinessTrendData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();

  const fetchBusinessTrends = async (forceRefresh = false) => {
    console.log('🔥 Fetching business trends for industry:', industry, 'forceRefresh:', forceRefresh);
    setLoading(true);
    setError(null);
    
    try {
      const url = forceRefresh 
        ? '/api/business-trends/enhanced'
        : `/api/business-trends/enhanced?industry=${encodeURIComponent(industry)}`;

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
        throw new Error(`Failed to fetch business trends: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Business trends data received:', data);
      setTrendData(data);
    } catch (err) {
      console.error('💥 Error fetching business trends:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessTrends();
  }, [industry]);

  const handleRefresh = () => {
    fetchBusinessTrends(true);
  };

  const handleViewAllTrends = () => {
    if (!trendData?.trends) return;

    openModal({
      type: 'business_trends',
      size: 'xl',
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Business Trends Report`,
      content: (
        <BusinessTrendsDetailedModal
          trends={trendData.trends}
          industry={industry}
          userTier={trendData.userTier}
          generatedAt={trendData.generatedAt}
        />
      ),
      showCloseButton: true,
      closeOnEscape: true,
      closeOnBackdropClick: true
    });
  };

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
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Business Trends</h2>
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
          <h3 className="text-lg font-semibold text-gray-900">Business Trends</h3>
          <p className="text-sm text-gray-500 capitalize">{industry} industry</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-green-600" />
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
      {loading && !trendData && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Analyzing business trends...</span>
        </div>
      )}

      {/* Content */}
      {trendData?.trends && (
        <>
          {/* Business Trends Grid */}
          <div className="space-y-4">
            {trendData.trends.slice(0, 7).map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getDirectionIcon(trend.direction)}
                    <h4 className="text-sm font-medium text-gray-900">{trend.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      trend.direction === 'up' ? 'bg-green-100 text-green-700' :
                      trend.direction === 'down' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getDirectionArrow(trend.direction)} {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{trend.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={handleViewAllTrends}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm"
            >
              View Business Trends Report
            </button>
          </div>

          {/* Last Updated */}
          {trendData && (
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Last updated {formatLastUpdated(trendData.generatedAt)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Detailed Business Trends Modal Component
interface BusinessTrendsDetailedModalProps {
  trends: BusinessTrend[];
  industry: string;
  userTier: string;
  generatedAt: string;
}

function BusinessTrendsDetailedModal({ trends, industry, userTier, generatedAt }: BusinessTrendsDetailedModalProps) {
  const getDirectionIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'stable':
        return <Minus className="w-5 h-5 text-gray-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
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

  const getTrendCardStyle = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'down':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'stable':
        return 'border-l-4 border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-4 border-l-gray-500 bg-gray-50';
    }
  };

  const formatGeneratedAt = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Business Trends Analysis</h3>
            <p className="text-sm text-gray-600 capitalize">{industry} Industry</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">User Tier: <span className="font-medium capitalize">{userTier}</span></p>
            <p className="text-xs text-gray-500">Generated: {formatGeneratedAt(generatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Business Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map((trend, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg ${getTrendCardStyle(trend.direction)} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getDirectionIcon(trend.direction)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {trend.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {getDirectionArrow(trend.direction)}
                    </span>
                    <span className={`text-lg font-bold ${getPercentageColor(trend.direction, trend.percentageChange)}`}>
                      {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              {trend.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>AI Model: {trend.aiModelVersion}</span>
              <span>Trend #{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Business Trend Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Business Trend Summary</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 mb-4">
            The {industry} industry is experiencing significant transformation with {trends.filter(t => t.direction === 'up').length} positive trends 
            and {trends.filter(t => t.direction === 'down').length} declining areas. These insights are based on real-time market analysis 
            and AI-powered trend detection, drawing from current news headlines and market signals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📈 Key Opportunities</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {trends.filter(t => t.direction === 'up').map((trend, i) => (
                  <li key={i}>• {trend.title}: {trend.description}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">⚠️ Areas to Monitor</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                {trends.filter(t => t.direction === 'down' || t.direction === 'stable').map((trend, i) => (
                  <li key={i}>• {trend.title}: {trend.description}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Actionable Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              <strong>Focus on Growth Areas:</strong> Prioritize investments in {trends.filter(t => t.direction === 'up').map(t => t.title).join(', ')} 
              as these show positive momentum in the {industry} sector.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              <strong>Monitor Declining Trends:</strong> Keep a close eye on {trends.filter(t => t.direction === 'down').map(t => t.title).join(', ')} 
              and develop contingency plans if these trends continue.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              <strong>Stay Agile:</strong> The {industry} industry is evolving rapidly. Maintain flexibility in your strategic planning 
              to adapt to changing market conditions.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              <strong>Leverage Technology:</strong> Invest in digital transformation initiatives that align with current market trends 
              and customer expectations.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              <strong>Build Resilience:</strong> Develop robust systems and processes that can withstand market volatility 
              and capitalize on emerging opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}