"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAIModal } from './ModalProvider';

interface AssessmentSection {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  category: 'strategy' | 'process' | 'technology' | 'performance';
  insights: string[];
  recommendations: string[];
  benchmarks: {
    industry: number;
    topPerformers: number;
    average: number;
  };
}

interface AssessmentDeepDive {
  id: string;
  title: string;
  overallScore: number;
  sections: AssessmentSection[];
  trends: {
    period: string;
    scores: number[];
    labels: string[];
  };
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  nextSteps: string[];
}

interface AssessmentDeepDiveModalProps {
  assessment: AssessmentDeepDive;
  onAction?: (action: string, sectionId?: string) => void;
}

export default function AssessmentDeepDiveModal({ assessment, onAction }: AssessmentDeepDiveModalProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'trends' | 'actions'>('overview');

  const getCategoryColor = (category: AssessmentSection['category']) => {
    switch (category) {
      case 'strategy': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'process': return 'text-green-600 bg-green-50 border-green-200';
      case 'technology': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'performance': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const selectedSectionData = selectedSection 
    ? assessment.sections.find(s => s.id === selectedSection)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h3>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(assessment.overallScore, 100)}`}>
              {assessment.overallScore}/100
            </div>
            <div className="text-sm text-gray-600">
              {getScoreLabel(assessment.overallScore, 100)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sections', label: 'Sections' },
            { id: 'trends', label: 'Trends' },
            { id: 'actions', label: 'Actions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">💪 Strengths</h4>
                <ul className="space-y-2">
                  {assessment.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-3">⚠️ Areas for Improvement</h4>
                <ul className="space-y-2">
                  {assessment.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">💡 Opportunities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessment.opportunities.map((opportunity, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-blue-800">{opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sections' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Section List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessment.sections.map((section) => (
                <motion.div
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedSection === section.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{section.name}</h4>
                    <span className={`text-lg font-bold ${getScoreColor(section.score, section.maxScore)}`}>
                      {section.score}/{section.maxScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(section.category)}`}>
                      {section.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getScoreLabel(section.score, section.maxScore)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Section Details */}
            {selectedSectionData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedSectionData.name}</h4>
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Benchmarks */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Benchmarks</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Industry Average:</span>
                        <span className="font-medium">{selectedSectionData.benchmarks.average}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Top Performers:</span>
                        <span className="font-medium">{selectedSectionData.benchmarks.topPerformers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Your Score:</span>
                        <span className={`font-medium ${getScoreColor(selectedSectionData.score, selectedSectionData.maxScore)}`}>
                          {selectedSectionData.score}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Insights */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Key Insights</h5>
                    <ul className="space-y-2">
                      {selectedSectionData.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Recommendations</h5>
                    <ul className="space-y-2">
                      {selectedSectionData.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Performance Trends</h4>
              <div className="space-y-4">
                {assessment.trends.labels.map((label, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${assessment.trends.scores[index]}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {assessment.trends.scores[index]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'actions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-4">Next Steps</h4>
              <div className="space-y-3">
                {assessment.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 border border-blue-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-2">{step}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onAction?.('implement', step)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Implement
                          </button>
                          <button
                            onClick={() => onAction?.('schedule', step)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                          >
                            Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Hook to easily open assessment deep dive modals
export const useAssessmentDeepDiveModal = () => {
  const { openAssessmentDeepDive } = useAIModal();
  
  return {
    showDeepDive: (assessment: AssessmentDeepDive, onAction?: (action: string, sectionId?: string) => void) => {
      openAssessmentDeepDive(
        <AssessmentDeepDiveModal 
          assessment={assessment} 
          onAction={onAction}
        />,
        assessment.title
      );
    }
  };
}; 