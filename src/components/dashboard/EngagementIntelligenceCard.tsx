'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, Target, AlertCircle, Activity, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useModal } from '@/components/modals/ModalProvider';
import { EngagementInsight, EngagementTrend } from '@/lib/ai/engagementIntelligenceAnalysis';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitleBar from './SectionTitleBar';
import CardLoadingAnimation from './CardLoadingAnimation';

interface EngagementIntelligenceCardProps {
  industry: string;
  className?: string;
}

interface EngagementData {
  data: EngagementInsight;
  cached: boolean;
  createdAt: string;
}

const EngagementIntelligenceCard: React.FC<EngagementIntelligenceCardProps> = ({ 
  industry, 
  className = '' 
}) => {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();

  const fetchEngagementData = async () => {
    try {
      setError(null);

      const url = `/api/engagement-intelligence/enhanced?industry=${encodeURIComponent(industry)}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch engagement intelligence');
      }

      setEngagementData({
        data: result.data,
        cached: result.cached || false,
        createdAt: result.data.lastUpdated
      });

    } catch (err) {
      console.error('Error fetching engagement intelligence:', err);
      setError(err instanceof Error ? err.message : 'Failed to load engagement intelligence');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFullReport = async () => {
    if (!engagementData) return;

    // Fetch additional cron-generated marketing playbook information
    let cronPlaybook = null;
    try {
      const cronResponse = await fetch('/api/dashboard/marketing_playbook');
      if (cronResponse.ok) {
        const cronData = await cronResponse.json();
        cronPlaybook = cronData.cronPlaybook;
      }
    } catch (error) {
      console.error('Error fetching cron playbook:', error);
    }

    openModal({
      type: 'ai_insight',
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Engagement Intelligence Report`,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {industry.charAt(0).toUpperCase() + industry.slice(1)} Engagement Intelligence Report
            </h3>
            <p className="text-sm text-gray-600">
              Last updated: {new Date(engagementData.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Cron-generated Marketing Playbook Summary */}
          {cronPlaybook?.insight && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="text-xl mr-2">📢</span>
                Marketing Playbook Summary
              </h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {cronPlaybook.insight}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Signal Analysis</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Signal Score: {engagementData.data.signalScore}/100</span>
              <span className="text-sm font-semibold text-gray-900">{engagementData.data.signalSummary}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Key Trends</h4>
            <div className="space-y-2">
              {engagementData.data.trends.map((trend, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">
                    {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                    <p className="text-xs text-gray-600">{trend.description}</p>
                    <p className="text-xs text-gray-500">
                      {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange.toFixed(1)}% change
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Strategic Recommendations</h4>
            <div className="space-y-3">
              {engagementData.data.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      size: 'xl'
    });
  };

  useEffect(() => {
    fetchEngagementData();
  }, [industry]);

  const getSignalColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    if (score >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSignalBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'flat') => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      case 'flat':
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'flat') => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'flat':
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <CardLoadingAnimation 
        title="Engagement Intelligence Loading..." 
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
            <h3 className="font-semibold">Engagement Intelligence</h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!engagementData) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <p>No engagement data available</p>
        </div>
      </div>
    );
  }

  const { data: insight } = engagementData;

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
              Engagement Intelligence: {industry.charAt(0).toUpperCase() + industry.slice(1)}
            </h3>
            <p className="text-sm text-gray-500">
              Strategic engagement trends and recommendations • Refreshes every Monday
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {typeof (insight as any)?.confidenceScore === 'number' && (
              <span className="text-xs text-gray-500">Confidence {Math.round(((insight as any).confidenceScore || 0) * 100)}%</span>
            )}
            <button
              onClick={async () => {
                try {
                  const q = 'Why did engagement shift?';
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

      {/* Signal Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Engagement Signal</span>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getSignalColor(insight.signalScore)}`}>
            {Math.round(insight.signalScore)}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getSignalBarColor(insight.signalScore)}`}
            initial={{ width: 0 }}
            animate={{ width: `${insight.signalScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low Engagement</span>
          <span>High Engagement</span>
        </div>
      </div>

      {/* Mini Trends Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Key Trends
        </h4>
        <div className="space-y-3">
          <AnimatePresence>
            {insight.trends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getTrendIcon(trend.direction)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                    <p className="text-xs text-gray-600">{trend.description}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${getTrendColor(trend.direction)}`}>
                  {trend.percentageChange > 0 ? '+' : ''}{Math.round(trend.percentageChange)}%
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Strategic Recommendations
        </h4>
        <div className="space-y-2">
          <AnimatePresence>
            {insight.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-2"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Last updated: {new Date(insight.lastUpdated).toLocaleDateString()}
        </div>
        <button
          onClick={handleViewFullReport}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View Full Report →
        </button>
      </div>
    </motion.div>
  );
};

export default EngagementIntelligenceCard; 