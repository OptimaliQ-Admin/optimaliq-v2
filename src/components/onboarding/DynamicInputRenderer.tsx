"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionNode } from '@/lib/services/onboarding/ConversationManager';
import TextInput from './inputs/TextInput';
import MultiChoiceInput from './inputs/MultiChoiceInput';
import MultiSelectInput from './inputs/MultiSelectInput';
import TechStackSelector from './inputs/TechStackSelector';
import RankingInterface from './RankingInterface';

interface DynamicInputRendererProps {
  question: QuestionNode;
  onAnswer: (answer: string | string[] | number) => void;
  disabled?: boolean;
}

export default function DynamicInputRenderer({
  question,
  onAnswer,
  disabled = false
}: DynamicInputRendererProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'conversation':
      case 'text_input':
        return (
          <TextInput
            question={question.content}
            placeholder={question.type === 'conversation' ? "Share your thoughts..." : "Type your answer..."}
            maxLength={500}
            rows={3}
            onSend={(value) => onAnswer(value)}
            disabled={disabled}
            personality={question.personality}
          />
        );

      case 'multi_choice':
        return (
          <MultiChoiceInput
            question={question.content}
            options={question.options || []}
            onSelect={(value) => onAnswer(value)}
            disabled={disabled}
            personality={question.personality}
            layout="cards"
          />
        );

      case 'multi_select':
        // Special handling for tech stack question
        if (question.id === 'tech_stack_overview') {
          return (
            <TechStackSelector
              question={question.content}
              onSelect={(values) => onAnswer(values)}
              disabled={disabled}
              personality={question.personality}
            />
          );
        }
        
        return (
          <MultiSelectInput
            question={question.content}
            options={question.options || []}
            maxSelect={question.maxSelect || 5}
            onSelect={(values) => onAnswer(values)}
            disabled={disabled}
            personality={question.personality}
          />
        );

      case 'ranking':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Question Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium bg-gradient-to-r from-green-500 to-green-600">
                    🎯
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold text-lg">{question.content}</p>
                    <p className="text-gray-600 text-sm mt-1">Drag and drop to rank by importance</p>
                  </div>
                </div>
              </div>

              {/* Ranking Interface */}
              <div className="p-6">
                <RankingInterface
                  options={question.options || []}
                  onRankingComplete={(rankings) => onAnswer(rankings)}
                />
              </div>
            </div>
          </motion.div>
        );

      case 'slider':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Question Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium bg-gradient-to-r from-purple-500 to-purple-600">
                    📊
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold text-lg">{question.content}</p>
                    <p className="text-gray-600 text-sm mt-1">Slide to indicate your level</p>
                  </div>
                </div>
              </div>

              {/* Slider Input */}
              <div className="p-6">
                <div className="space-y-4">
                  <input
                    type="range"
                    min={question.minValue || 0}
                    max={question.maxValue || 100}
                    step={question.step || 1}
                    defaultValue={question.minValue || 0}
                    onChange={(e) => onAnswer(parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{question.minValue || 0}</span>
                    <span>{question.maxValue || 100}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'nps':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Question Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium bg-gradient-to-r from-orange-500 to-orange-600">
                    🧠
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold text-lg">{question.content}</p>
                    <p className="text-gray-600 text-sm mt-1">Rate from 0 to 10</p>
                  </div>
                </div>
              </div>

              {/* NPS Scale */}
              <div className="p-6">
                <div className="grid grid-cols-11 gap-2">
                  {Array.from({ length: 11 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => onAnswer(i)}
                      disabled={disabled}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors text-sm font-medium"
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Not at all likely</span>
                  <span>Extremely likely</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'likert':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Question Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600">
                    💼
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold text-lg">{question.content}</p>
                    <p className="text-gray-600 text-sm mt-1">Select your level of agreement</p>
                  </div>
                </div>
              </div>

              {/* Likert Scale */}
              <div className="p-6">
                <div className="grid grid-cols-5 gap-3">
                  {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((label, i) => (
                    <button
                      key={i}
                      onClick={() => onAnswer(i + 1)}
                      disabled={disabled}
                      className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-center"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            Unsupported question type: {question.type}
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        {renderInput()}
      </motion.div>
    </AnimatePresence>
  );
} 