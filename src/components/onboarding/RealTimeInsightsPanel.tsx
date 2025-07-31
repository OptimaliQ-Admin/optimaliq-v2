"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Zap, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'market' | 'competitive' | 'operational' | 'strategic';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  data?: any;
}

interface RealTimeInsightsPanelProps {
  sessionId: string;
  insights: Insight[];
  onInsightClick?: (insight: Insight) => void;
}

const getInsightIcon = (type: Insight['type']) => {
  switch (type) {
    case 'market':
      return <TrendingUp className="w-4 h-4" />;
    case 'competitive':
      return <Target className="w-4 h-4" />;
    case 'operational':
      return <Zap className="w-4 h-4" />;
    case 'strategic':
      return <Lightbulb className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

const getInsightColor = (type: Insight['type']) => {
  switch (type) {
    case 'market':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'competitive':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'operational':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'strategic':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: Insight['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function RealTimeInsightsPanel({
  sessionId,
  insights,
  onInsightClick
}: RealTimeInsightsPanelProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'market' | 'competitive' | 'operational' | 'strategic'>('all');

  const filteredInsights = insights.filter(insight => 
    filter === 'all' || insight.type === filter
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Insights</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {(['all', 'market', 'competitive', 'operational', 'strategic'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`
                px-2 py-1 text-xs rounded-md transition-colors
                ${filter === filterType 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {filteredInsights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {filter === 'all' 
                  ? 'No insights yet. Continue your consultation to receive personalized insights.'
                  : `No ${filter} insights yet.`
                }
              </p>
            </motion.div>
          ) : (
            filteredInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md
                  ${expandedInsight === insight.id ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => {
                  setExpandedInsight(expandedInsight === insight.id ? null : insight.id);
                  onInsightClick?.(insight);
                }}
              >
                {/* Insight Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {Math.round(insight.confidence * 100)}%
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                  </div>
                </div>

                {/* Insight Title */}
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {insight.title}
                </h4>

                {/* Insight Description */}
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {insight.description}
                </p>

                {/* Insight Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(insight.timestamp)}
                    </span>
                  </div>
                  {insight.actionable && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">Actionable</span>
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedInsight === insight.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-gray-100"
                    >
                      <div className="space-y-2">
                        <p className="text-gray-700 text-sm">
                          {insight.description}
                        </p>
                        
                        {insight.data && (
                          <div className="bg-gray-50 rounded p-2">
                            <h5 className="text-xs font-medium text-gray-700 mb-1">Additional Data:</h5>
                            <pre className="text-xs text-gray-600 overflow-x-auto">
                              {JSON.stringify(insight.data, null, 2)}
                            </pre>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                            Take Action
                          </button>
                          <button className="px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50 transition-colors">
                            Save for Later
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{filteredInsights.length} insights</span>
          <span>Powered by AI</span>
        </div>
      </div>
    </div>
  );
} 