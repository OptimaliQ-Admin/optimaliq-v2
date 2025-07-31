"use client";

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { QuestionOption } from '@/lib/services/onboarding/ConversationManager';

interface RankingInterfaceProps {
  options: QuestionOption[];
  onRankingComplete: (rankings: string[]) => void;
}

export default function RankingInterface({ options, onRankingComplete }: RankingInterfaceProps) {
  const [rankedItems, setRankedItems] = useState<QuestionOption[]>(options);
  const [isComplete, setIsComplete] = useState(false);

  const handleReorder = (newOrder: QuestionOption[]) => {
    setRankedItems(newOrder);
  };

  const handleComplete = () => {
    const rankings = rankedItems.map(item => item.value);
    setIsComplete(true);
    onRankingComplete(rankings);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Drag and drop to rank these items by importance (most important at the top):
      </div>
      
      <Reorder.Group axis="y" values={rankedItems} onReorder={handleReorder}>
        {rankedItems.map((item, index) => (
          <Reorder.Item key={item.value} value={item}>
            <motion.div
              layout
              className="flex items-center p-3 bg-white border border-gray-200 rounded-lg mb-2 cursor-move hover:bg-gray-50"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.label}</div>
                {item.description && (
                  <div className="text-sm text-gray-500">{item.description}</div>
                )}
              </div>
              <div className="flex-shrink-0 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleComplete}
        disabled={isComplete}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isComplete ? 'Ranking Submitted' : 'Submit Ranking'}
      </motion.button>
    </div>
  );
} 