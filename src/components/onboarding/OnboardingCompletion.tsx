"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BusinessMetrics, StrategicInsight } from '@/lib/services/onboarding/BusinessIntelligenceEngine';

interface OnboardingCompletionProps {
  metrics: BusinessMetrics;
  insights: StrategicInsight[];
  onContinue: () => void;
}

export default function OnboardingCompletion({ metrics, insights, onContinue }: OnboardingCompletionProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return '🚀';
      case 'risk': return '⚠️';
      case 'optimization': return '⚡';
      case 'benchmark': return '📊';
      case 'trend': return '📈';
      default: return '💡';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200 text-green-800';
      case 'risk': return 'bg-red-50 border-red-200 text-red-800';
      case 'optimization': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'benchmark': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'trend': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Business Discovery Complete!
        </h1>
        <p className="text-lg text-gray-600">
          I&apos;ve analyzed your business and prepared personalized insights and recommendations.
        </p>
      </motion.div>

      {/* Business Metrics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border p-6 mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Your Business Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.retentionRate && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.retentionRate}%</div>
              <div className="text-sm text-blue-700">Retention Rate</div>
            </div>
          )}
          {metrics.acquisitionCost && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${metrics.acquisitionCost}</div>
              <div className="text-sm text-green-700">Customer Acquisition Cost</div>
            </div>
          )}
          {metrics.growthRate && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{metrics.growthRate}%</div>
              <div className="text-sm text-purple-700">Monthly Growth Rate</div>
            </div>
          )}
          {metrics.marketPosition && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-lg font-bold text-orange-600 capitalize">{metrics.marketPosition}</div>
              <div className="text-sm text-orange-700">Market Position</div>
            </div>
          )}
          {metrics.maturityLevel && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-lg font-bold text-indigo-600 capitalize">{metrics.maturityLevel}</div>
              <div className="text-sm text-indigo-700">Business Maturity</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Strategic Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border p-6 mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Strategic Insights</h2>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{insight.title}</h3>
                  <p className="text-sm mb-3">{insight.description}</p>
                  <div className="flex items-center text-xs mb-3">
                    <span className="mr-4">Confidence: {Math.round(insight.confidence * 100)}%</span>
                    <span className="mr-4">Impact: {insight.impact}</span>
                    <span>Timeframe: {insight.timeframe}</span>
                  </div>
                  {insight.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="text-sm space-y-1">
                        {insight.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Competitive Advantages */}
      {metrics.competitiveAdvantage && metrics.competitiveAdvantage.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🏆 Your Competitive Advantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.competitiveAdvantage.map((advantage, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 mr-3">✓</span>
                <span className="text-green-800">{advantage}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Immediate Actions</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Review your personalized dashboard</li>
              <li>• Explore growth opportunities</li>
              <li>• Set up tracking for key metrics</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Strategic Focus</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Leverage your competitive advantages</li>
              <li>• Address identified risk factors</li>
              <li>• Implement recommended strategies</li>
            </ul>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
        >
          Continue to Dashboard →
        </motion.button>
      </motion.div>
    </div>
  );
} 