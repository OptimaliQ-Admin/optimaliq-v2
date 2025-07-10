'use client';

import React from 'react';
import { X, TrendingUp, TrendingDown, Minus, BarChart3, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { EnhancedMarketInsight } from '@/lib/ai/enhancedMarketAnalysis';

interface EnhancedAIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    insight: EnhancedMarketInsight;
    industry: string;
    dataSources: any;
    confidenceScore: number;
    lastUpdated: string;
  };
}

const EnhancedAIInsightModal: React.FC<EnhancedAIInsightModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) return null;

  const { title, insight, industry, dataSources, lastUpdated } = data;

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

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-orange-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatLastUpdated = (dateString: string) => {
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

  // Since this component is used as content inside the modal system,
  // we don't need the modal wrapper - just return the content
  return (
    <div className="space-y-6">
      {/* Market Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Size */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Size</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Value:</span>
              <span className="font-semibold text-green-600">{insight.marketSize.value}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Growth:</span>
              <div className="flex items-center gap-1">
                {insight.marketSize.growth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : insight.marketSize.growth < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : (
                  <Minus className="w-4 h-4 text-gray-500" />
                )}
                <span className={`font-semibold ${
                  insight.marketSize.growth > 0 ? 'text-green-600' :
                  insight.marketSize.growth < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {insight.marketSize.growth > 0 ? '+' : ''}{insight.marketSize.growth}%
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Currency:</span>
              <span className="font-medium">{insight.marketSize.currency}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{insight.marketSize.description}</p>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Growth Rate</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Rate:</span>
              <span className="font-semibold text-blue-600">{insight.growthRate.value}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trend:</span>
              <div className="flex items-center gap-1">
                {insight.growthRate.trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : insight.growthRate.trend < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : (
                  <Minus className="w-4 h-4 text-gray-500" />
                )}
                <span className={`font-semibold ${
                  insight.growthRate.trend > 0 ? 'text-green-600' :
                  insight.growthRate.trend < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {insight.growthRate.trend > 0 ? '+' : ''}{insight.growthRate.trend}%
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Period:</span>
              <span className="font-medium">{insight.growthRate.period}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{insight.growthRate.description}</p>
          </div>
        </div>

        {/* Competition */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Competition</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Level:</span>
              <span className={`font-semibold ${getCompetitionColor(insight.competition.level)}`}>
                {insight.competition.level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trend:</span>
              <span className="font-medium">{insight.competition.trend}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{insight.competition.description}</p>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{insight.competition.details}</p>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Sentiment</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Score:</span>
              <span className={`font-semibold ${getSentimentColor(insight.sentiment.score)}`}>
                {insight.sentiment.score}/100
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trend:</span>
              <span className="font-medium capitalize">{insight.sentiment.trend}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Factors:</span>
              <span className="font-medium">{insight.sentiment.factors.join(', ')}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{insight.sentiment.description}</p>
          </div>
        </div>
      </div>

      {/* Full AI Insight */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Market Analysis</h3>
        </div>
        <div className="prose prose-sm max-w-none">
          {insight.fullInsight.split('\n').map((line, index) => (
            <p key={index} className="text-gray-700 mb-2">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Strategic Recommendations</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <p className="text-gray-700">
              Monitor {insight.competition.level.toLowerCase()} competition levels and identify partnership opportunities
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <p className="text-gray-700">
              Leverage {insight.sentiment.trend} market sentiment for strategic investments and timing
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <p className="text-gray-700">
              Focus on {insight.growthRate.value}% annual growth opportunities in {industry} sector
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <p className="text-gray-700">
              Consider market size of {insight.marketSize.value} for expansion planning
            </p>
          </div>
        </div>
      </div>

      {/* Data Sources - Small and at bottom */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Data Sources</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(dataSources).map(([source, enabled]) => (
            <div key={source} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-600 capitalize">
                {source.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertTriangle className="w-4 h-4" />
          <span>Analysis based on AI models and market data. Not financial advice.</span>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {formatLastUpdated(lastUpdated)}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIInsightModal; 