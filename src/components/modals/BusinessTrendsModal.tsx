'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, X } from 'lucide-react';

interface BusinessTrend {
  title: string;
  direction: 'up' | 'down' | 'stable';
  percentageChange: number;
  description: string;
  industry: string;
  aiModelVersion: string;
}

interface BusinessTrendsModalProps {
  trends: BusinessTrend[];
  industry: string;
  title: string;
  subtitle: string;
  onClose: () => void;
}

export default function BusinessTrendsModal({
  trends,
  industry,
  title,
  subtitle,
  onClose
}: BusinessTrendsModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{subtitle}</p>
            <p className="text-sm text-gray-500 mt-1">Industry: {industry}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid gap-6">
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
                  <span>Generated for {trend.industry} industry</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
            <p className="text-blue-800 text-sm">
              These trends are AI-generated insights specific to the {industry} industry, 
              designed to help you understand current market dynamics and make informed strategic decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 