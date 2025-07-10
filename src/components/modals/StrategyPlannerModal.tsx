"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAIModal } from './ModalProvider';

interface StrategyGoal {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'efficiency' | 'growth' | 'innovation' | 'market';
  priority: 'high' | 'medium' | 'low';
  timeframe: 'short' | 'medium' | 'long';
  status: 'planned' | 'in-progress' | 'completed' | 'paused';
  metrics: {
    target: number;
    current: number;
    unit: string;
  };
  dependencies: string[];
  resources: string[];
  risks: string[];
}

interface StrategyPlan {
  id: string;
  title: string;
  description: string;
  goals: StrategyGoal[];
  timeline: {
    startDate: string;
    endDate: string;
    milestones: {
      id: string;
      title: string;
      date: string;
      status: 'upcoming' | 'in-progress' | 'completed' | 'delayed';
    }[];
  };
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  team: {
    id: string;
    name: string;
    role: string;
    availability: number;
  }[];
  risks: {
    id: string;
    title: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
}

interface StrategyPlannerModalProps {
  strategy: StrategyPlan;
  onAction?: (action: string, goalId?: string) => void;
  onSave?: (strategy: StrategyPlan) => void;
}

export default function StrategyPlannerModal({ strategy, onAction, onSave }: StrategyPlannerModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'timeline' | 'team' | 'risks' | 'budget'>('overview');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: StrategyGoal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: StrategyGoal['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'planned': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'paused': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: StrategyGoal['category']) => {
    switch (category) {
      case 'revenue': return '💰';
      case 'efficiency': return '⚡';
      case 'growth': return '📈';
      case 'innovation': return '💡';
      case 'market': return '🎯';
      default: return '📋';
    }
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const selectedGoalData = selectedGoal 
    ? strategy.goals.find(g => g.id === selectedGoal)
    : null;

  const progressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{strategy.title}</h3>
          <p className="text-gray-600 mt-1">{strategy.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'View' : 'Edit'}
          </button>
          {onSave && (
            <button
              onClick={() => onSave(strategy)}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'goals', label: 'Goals' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'team', label: 'Team' },
            { id: 'risks', label: 'Risks' },
            { id: 'budget', label: 'Budget' }
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
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{strategy.goals.length}</div>
                <div className="text-sm text-gray-600">Total Goals</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {strategy.goals.filter(g => g.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-amber-600">
                  {strategy.goals.filter(g => g.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-red-600">
                  {strategy.risks.filter(r => r.probability === 'high' && r.impact === 'high').length}
                </div>
                <div className="text-sm text-gray-600">High Risks</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => onAction?.('add-goal')}
                  className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="text-blue-600 font-medium">Add Goal</div>
                  <div className="text-sm text-gray-600">Create a new strategic goal</div>
                </button>
                <button
                  onClick={() => onAction?.('schedule-review')}
                  className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="text-blue-600 font-medium">Schedule Review</div>
                  <div className="text-sm text-gray-600">Plan strategy review meeting</div>
                </button>
                <button
                  onClick={() => onAction?.('export-plan')}
                  className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="text-blue-600 font-medium">Export Plan</div>
                  <div className="text-sm text-gray-600">Download strategy document</div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'goals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Goals List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategy.goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedGoal === goal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage(goal.metrics.current, goal.metrics.target))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercentage(goal.metrics.current, goal.metrics.target)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {goal.metrics.current} / {goal.metrics.target} {goal.metrics.unit}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Goal Details */}
            {selectedGoalData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedGoalData.title}</h4>
                  <button
                    onClick={() => setSelectedGoal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Dependencies */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Dependencies</h5>
                    <ul className="space-y-2">
                      {selectedGoalData.dependencies.map((dep, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {dep}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Resources</h5>
                    <ul className="space-y-2">
                      {selectedGoalData.resources.map((resource, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Risks</h5>
                    <ul className="space-y-2">
                      {selectedGoalData.risks.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onAction?.('edit-goal', selectedGoalData.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit Goal
                  </button>
                  <button
                    onClick={() => onAction?.('update-progress', selectedGoalData.id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Update Progress
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Project Timeline</h4>
              <div className="space-y-4">
                {strategy.timeline.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{milestone.title}</span>
                        <span className="text-sm text-gray-500">{milestone.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          milestone.status === 'delayed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'team' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategy.team.map((member) => (
                <div key={member.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <span className="text-sm text-gray-500">{member.availability}% available</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${member.availability}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'risks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              {strategy.risks.map((risk) => (
                <div key={risk.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(risk.probability)}`}>
                        {risk.probability} probability
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(risk.impact)}`}>
                        {risk.impact} impact
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{risk.mitigation}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Budget Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {strategy.budget.currency} {strategy.budget.allocated.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Allocated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {strategy.budget.currency} {strategy.budget.spent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {strategy.budget.currency} {(strategy.budget.allocated - strategy.budget.spent).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
              </div>
              
              {/* Budget Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Budget Utilization</span>
                  <span>{Math.round((strategy.budget.spent / strategy.budget.allocated) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${(strategy.budget.spent / strategy.budget.allocated) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Hook to easily open strategy planner modals
export const useStrategyPlannerModal = () => {
  const { openStrategyPlanner } = useAIModal();
  
  return {
    showPlanner: (strategy: StrategyPlan, onAction?: (action: string, goalId?: string) => void, onSave?: (strategy: StrategyPlan) => void) => {
      openStrategyPlanner(
        <StrategyPlannerModal 
          strategy={strategy} 
          onAction={onAction}
          onSave={onSave}
        />,
        strategy.title
      );
    }
  };
}; 