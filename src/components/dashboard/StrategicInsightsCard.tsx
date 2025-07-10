"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StrategicInsight, CompetitiveAnalysis } from '@/lib/ai/services/dashboard';
import SectionHeader from './SectionHeader';

interface Props {
  userId: string;
  dashboardData: any;
  industry: string;
}

export default function StrategicInsightsCard({ userId, dashboardData, industry }: Props) {
  const [strategicInsights, setStrategicInsights] = useState<StrategicInsight[]>([]);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const generateInsights = async () => {
      if (!dashboardData) return;

      setLoading(true);
      setError(null);

      try {
        // Generate strategic insights
        const insightsResponse = await fetch('/api/ai/strategic-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            dashboardData,
            industry
          })
        });

        if (!insightsResponse.ok) {
          throw new Error('Failed to generate strategic insights');
        }

        const insightsData = await insightsResponse.json();
        setStrategicInsights(insightsData);

        // Generate competitive analysis
        const competitiveResponse = await fetch('/api/ai/competitive-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            dashboardData,
            industry
          })
        });

        if (!competitiveResponse.ok) {
          throw new Error('Failed to generate competitive analysis');
        }

        const competitiveData = await competitiveResponse.json();
        setCompetitiveAnalysis(competitiveData);
      } catch (err) {
        console.error('Error generating strategic insights:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate insights');
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [userId, dashboardData, industry]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'competitive': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'operational': return 'text-green-600 bg-green-50 border-green-200';
      case 'financial': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'technology': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'leader': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'challenger': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'follower': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'niche': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredInsights = selectedCategory === 'all' 
    ? strategicInsights 
    : strategicInsights.filter(insight => insight.category === selectedCategory);

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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <p className="font-semibold mb-2">⚠️ Error Loading Strategic Insights</p>
          <p className="text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader 
        title="🎯 Strategic Insights" 
        subtitle={`Strategic analysis and competitive intelligence for ${industry}`}
      />

      <div className="space-y-8">
        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insight Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {['market', 'competitive', 'operational', 'financial', 'technology'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === category 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Strategic Insights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Analysis</h3>
          <div className="space-y-4">
            {filteredInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg border ${getCategoryColor(insight.category)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(insight.category)}`}>
                      {insight.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                    <div className="text-xs text-gray-500">{insight.timeframe}</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {insight.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Evidence</h5>
                    <ul className="space-y-1">
                      {insight.evidence.dataPoints.slice(0, 3).map((point, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Short-term Impact</h5>
                    <ul className="space-y-1">
                      {insight.implications.shortTerm.slice(0, 2).map((impact, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                          {impact}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Strategic Impact</h5>
                    <ul className="space-y-1">
                      {insight.implications.strategic.slice(0, 2).map((impact, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>
                          {impact}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Competitive Analysis */}
        {competitiveAnalysis && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Landscape</h3>
            
            {/* Market Position */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Market Position Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Current Position:</span> {competitiveAnalysis.marketPosition.current}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Target Position:</span> {competitiveAnalysis.marketPosition.target}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Gap:</span> {competitiveAnalysis.marketPosition.gap}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Opportunities</h5>
                  <ul className="space-y-1">
                    {competitiveAnalysis.marketPosition.opportunities.map((opp, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></span>
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Competitors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {competitiveAnalysis.competitors.map((competitor, index) => (
                <motion.div
                  key={competitor.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${getPositionColor(competitor.position)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPositionColor(competitor.position)}`}>
                      {competitor.position}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Market Share: {Math.round(competitor.marketShare * 100)}%</p>
                    <p>Growth Rate: {competitor.growthRate}%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">Strengths</h5>
                      <ul className="space-y-1">
                        {competitor.strengths.slice(0, 2).map((strength, i) => (
                          <li key={i} className="text-xs text-emerald-600 flex items-center">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">Weaknesses</h5>
                      <ul className="space-y-1">
                        {competitor.weaknesses.slice(0, 2).map((weakness, i) => (
                          <li key={i} className="text-xs text-red-600 flex items-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Strategic Moves */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Strategic Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-900 mb-3">Offensive Moves</h5>
                  <ul className="space-y-2">
                    {competitiveAnalysis.strategicMoves.offensive.map((move, index) => (
                      <li key={index} className="text-sm text-red-800 flex items-start">
                        <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {move}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-900 mb-3">Defensive Moves</h5>
                  <ul className="space-y-2">
                    {competitiveAnalysis.strategicMoves.defensive.map((move, index) => (
                      <li key={index} className="text-sm text-amber-800 flex items-start">
                        <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {move}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-3">Neutral Moves</h5>
                  <ul className="space-y-2">
                    {competitiveAnalysis.strategicMoves.neutral.map((move, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start">
                        <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {move}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 