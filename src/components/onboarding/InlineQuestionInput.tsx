import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  type: 'text_area' | 'multi_select' | 'multiple_choice' | 'rank_order';
  prompt: string;
  options?: string[];
  maxSelect?: number;
  required?: boolean;
}

interface InlineQuestionInputProps {
  question: Question;
  onSubmit: (answers: Record<string, any>) => void;
  isSubmitting: boolean;
  currentAnswers?: Record<string, any>;
}

export default function InlineQuestionInput({ 
  question, 
  onSubmit, 
  isSubmitting,
  currentAnswers = {}
}: InlineQuestionInputProps) {
  const [textInput, setTextInput] = useState(currentAnswers[question.id] || '');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    currentAnswers[question.id] ? (Array.isArray(currentAnswers[question.id]) ? currentAnswers[question.id] : [currentAnswers[question.id]]) : []
  );
  const [rankedItems, setRankedItems] = useState<string[]>(
    currentAnswers[question.id] || question.options || []
  );

  const handleAnswerChange = () => {
    let answer: any;
    
    switch (question.type) {
      case 'text_area':
        answer = textInput;
        break;
      case 'multiple_choice':
        answer = selectedOptions[0];
        break;
      case 'multi_select':
        answer = selectedOptions;
        break;
      case 'rank_order':
        answer = rankedItems;
        break;
      default:
        answer = '';
    }

    if (answer && (typeof answer === 'string' ? answer.trim() : answer.length > 0)) {
      onSubmit({ [question.id]: answer });
    }
  };

  const handleOptionSelect = (option: string) => {
    if (question.type === 'multiple_choice') {
      setSelectedOptions([option]);
      setTimeout(() => handleAnswerChange(), 100);
    } else if (question.type === 'multi_select') {
      setSelectedOptions(prev => {
        if (prev.includes(option)) {
          return prev.filter(item => item !== option);
        } else {
          if (question.maxSelect && prev.length >= question.maxSelect) {
            return prev;
          }
          return [...prev, option];
        }
      });
      setTimeout(() => handleAnswerChange(), 100);
    }
  };

  const handleRankChange = (fromIndex: number, toIndex: number) => {
    const newRankedItems = [...rankedItems];
    const [movedItem] = newRankedItems.splice(fromIndex, 1);
    newRankedItems.splice(toIndex, 0, movedItem);
    setRankedItems(newRankedItems);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text_area':
        return (
          <div className="space-y-3">
                    <textarea
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            setTimeout(() => handleAnswerChange(), 100);
          }}
          placeholder="Type your answer here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
        />
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionSelect(option)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multi_select':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionSelect(option)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
            {question.maxSelect && (
              <p className="text-xs text-gray-500">
                Select up to {question.maxSelect} options
              </p>
            )}
          </div>
        );

      case 'rank_order':
        return (
          <div className="space-y-2">
            {rankedItems.map((item, index) => (
              <div
                key={item}
                className="flex items-center space-x-3 p-2 bg-gray-50 rounded border cursor-move"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  handleRankChange(fromIndex, index);
                }}
              >
                <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                <span className="text-sm text-gray-700 flex-1">{item}</span>
                <div className="text-gray-400">⋮⋮</div>
              </div>
            ))}
            <p className="text-xs text-gray-500">
              Drag to reorder items
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
    >
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        {question.prompt}
      </h3>
      
      {renderInput()}
      
      <div className="mt-4 flex justify-end">
        <div className="text-xs text-gray-500 mt-2">
          {question.required && (
            <span className="text-red-500">* Required</span>
          )}
        </div>
      </div>
    </motion.div>
  );
} 