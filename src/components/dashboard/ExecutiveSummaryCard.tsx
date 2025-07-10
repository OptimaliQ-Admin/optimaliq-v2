"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExecutiveSummary } from '@/lib/ai/services/dashboard';
import SectionHeader from './SectionHeader';

interface Props {
  userId: string;
  dashboardData: any;
  period?: string;
}

export default function ExecutiveSummaryCard({ userId, dashboardData, period = 'Q4 2024' }: Props) {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    const generateSummary = async () => {
      if (!dashboardData) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/executive-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            dashboardData,
            period
          })
        });

        if (!response.ok) {
          throw new Error('Failed to generate executive summary');
        }

        const data = await response.json();
        setSummary(data);
      } catch (err) {
        console.error('Error generating executive summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate summary');
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [userId, dashboardData, period]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-emerald-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">⚠️ Error Loading Executive Summary</p>
          <p className="text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader 
        title="📊 Executive Summary" 
        subtitle={`Strategic overview and key insights for ${summary.period}`}
      />

      <div className="space-y-8">
        {/* Key Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.keyMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getStatusColor(metric.status)} cursor-pointer hover:shadow-md transition-all duration-200`}
                onClick={() => setSelectedMetric(selectedMetric === metric.metric ? null : metric.metric)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </div>
                <div className="flex items-center text-sm">
                  <span className={metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {metric.change >= 0 ? '↗' : '↘'} {Math.abs(metric.change)}%
                  </span>
                  <span className="text-gray-500 ml-2">vs previous period</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Business Narrative */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Narrative</h3>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <p className="text-gray-700 leading-relaxed text-sm">
              {summary.businessNarrative}
            </p>
          </div>
        </div>

        {/* Strategic Highlights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Highlights</h3>
          <div className="space-y-3">
            {summary.strategicHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  highlight.impact === 'positive' ? 'bg-emerald-500' : 
                  highlight.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{highlight.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(highlight.priority)}`}>
                      {highlight.priority} priority
                    </span>
                  </div>
                  <p className={`text-sm ${getImpactColor(highlight.impact)}`}>
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Quarter Outlook */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Quarter Outlook</h3>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 capitalize">
                {summary.nextQuarterOutlook.scenario} Scenario
              </h4>
              <span className="text-sm text-gray-600">
                {Math.round(summary.nextQuarterOutlook.probability * 100)}% probability
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Key Drivers</h5>
                <ul className="space-y-1">
                  {summary.nextQuarterOutlook.keyDrivers.map((driver, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></span>
                      {driver}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Risks</h5>
                <ul className="space-y-1">
                  {summary.nextQuarterOutlook.risks.map((risk, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-3">Immediate Actions</h4>
              <ul className="space-y-2">
                {summary.executiveRecommendations.immediate.map((rec, index) => (
                  <li key={index} className="text-sm text-red-800 flex items-start">
                    <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-3">Strategic Initiatives</h4>
              <ul className="space-y-2">
                {summary.executiveRecommendations.strategic.map((rec, index) => (
                  <li key={index} className="text-sm text-amber-800 flex items-start">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-3">Long-term Vision</h4>
              <ul className="space-y-2">
                {summary.executiveRecommendations.longTerm.map((rec, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 