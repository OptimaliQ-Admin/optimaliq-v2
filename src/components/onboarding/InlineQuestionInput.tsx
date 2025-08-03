import React, { useState, useEffect } from 'react';
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
  onAnswerChange: (answer: any) => void;
  currentAnswer?: any;
  questionNumber?: number;
}

export default function InlineQuestionInput({ 
  question, 
  onAnswerChange, 
  currentAnswer,
  questionNumber
}: InlineQuestionInputProps) {
  const [textInput, setTextInput] = useState(currentAnswer || '');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    currentAnswer ? (Array.isArray(currentAnswer) ? currentAnswer : [currentAnswer]) : []
  );
  const [rankedItems, setRankedItems] = useState<string[]>(
    currentAnswer || question.options || []
  );

  // Update local state when currentAnswer changes
  useEffect(() => {
    if (currentAnswer !== undefined) {
      if (question.type === 'text_area') {
        setTextInput(currentAnswer || '');
      } else if (question.type === 'multiple_choice') {
        setSelectedOptions(currentAnswer ? [currentAnswer] : []);
      } else if (question.type === 'multi_select') {
        setSelectedOptions(Array.isArray(currentAnswer) ? currentAnswer : []);
      } else if (question.type === 'rank_order') {
        setRankedItems(currentAnswer || question.options || []);
      }
    }
  }, [currentAnswer, question.type, question.options]);

  const handleTextChange = (value: string) => {
    setTextInput(value);
    onAnswerChange(value);
  };

  const handleOptionSelect = (option: string) => {
    if (question.type === 'multiple_choice') {
      setSelectedOptions([option]);
      onAnswerChange(option);
    } else if (question.type === 'multi_select') {
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter(item => item !== option)
        : [...selectedOptions, option];
      
      if (!question.maxSelect || newSelection.length <= question.maxSelect) {
        setSelectedOptions(newSelection);
        onAnswerChange(newSelection);
      }
    }
  };

  const handleRankChange = (fromIndex: number, toIndex: number) => {
    const newRankedItems = [...rankedItems];
    const [movedItem] = newRankedItems.splice(fromIndex, 1);
    newRankedItems.splice(toIndex, 0, movedItem);
    setRankedItems(newRankedItems);
    onAnswerChange(newRankedItems);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text_area':
        return (
          <div className="space-y-2">
            <textarea
              value={textInput}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows={3}
            />
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionSelect(option)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-700 leading-relaxed">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multi_select':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionSelect(option)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-700 leading-relaxed">{option}</span>
              </label>
            ))}
            {question.maxSelect && (
              <p className="text-xs text-gray-500 mt-2">
                Select up to {question.maxSelect} options ({selectedOptions.length}/{question.maxSelect})
              </p>
            )}
          </div>
        );

      case 'rank_order':
        return (
          <div className="space-y-3">
            {rankedItems.map((item, index) => (
              <div
                key={item}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 transition-colors"
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
                <div className="text-gray-400 text-lg">⋮⋮</div>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-start space-x-3">
        {questionNumber && (
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
            {questionNumber}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-3 leading-relaxed">
            {question.prompt}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          
          {renderInput()}
        </div>
      </div>
    </motion.div>
  );
} 