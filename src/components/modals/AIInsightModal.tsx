"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAIModal } from './ModalProvider';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'strategy' | 'performance' | 'opportunity' | 'risk' | 'trend';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  dataPoints: string[];
  recommendations: string[];
  timeframe: string;
  source: string;
}

interface AIInsightModalProps {
  insight: AIInsight;
  onAction?: (action: string) => void;
  onDismiss?: () => void;
}

export default function AIInsightModal({ insight, onAction, onDismiss }: AIInsightModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const getCategoryColor = (category: AIInsight['category']) => {
    switch (category) {
      case 'strategy': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'performance': return 'text-green-600 bg-green-50 border-green-200';
      case 'opportunity': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'risk': return 'text-red-600 bg-red-50 border-red-200';
      case 'trend': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'strategy': return '🎯';
      case 'performance': return '📊';
      case 'opportunity': return '💡';
      case 'risk': return '⚠️';
      case 'trend': return '📈';
      default: return 'ℹ️';
    }
  };

  const handleAction = (action: string) => {
    setSelectedAction(action);
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getCategoryIcon(insight.category)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(insight.category)}`}>
                {insight.category}
              </span>
              <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>
                {insight.impact} impact
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-700 leading-relaxed">{insight.description}</p>
      </div>

      {/* Data Points */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Supporting Data</h4>
        <div className="space-y-2">
          {insight.dataPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
        <div className="space-y-3">
          {insight.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Timeframe */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-1">Timeframe</h4>
            <p className="text-sm text-blue-700">{insight.timeframe}</p>
          </div>

          {/* Source */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-1">Data Source</h4>
            <p className="text-sm text-gray-600">{insight.source}</p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('dismiss')}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => handleAction('implement')}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Implement
          </button>
        </div>
      </div>

      {/* Loading State for Actions */}
      {selectedAction && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Hook to easily open AI insight modals
export const useAIInsightModal = () => {
  const { openAIInsight } = useAIModal();
  
  return {
    showInsight: (insight: AIInsight, onAction?: (action: string) => void) => {
      openAIInsight(
        <AIInsightModal 
          insight={insight} 
          onAction={onAction}
        />,
        insight.title
      );
    }
  };
}; 