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
}

export default function InlineQuestionInput({ 
  question, 
  onAnswerChange, 
  currentAnswer
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <textarea
              value={textInput}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-300"
              rows={4}
            />
          </motion.div>
        );

      case 'multiple_choice':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <motion.label
                key={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-4 cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                  selectedOptions.includes(option)
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                <div className="relative flex-shrink-0 mt-1">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionSelect(option)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedOptions.includes(option)
                      ? 'border-blue-400 bg-blue-400'
                      : 'border-white/40'
                  }`}>
                    {selectedOptions.includes(option) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                </div>
                <span className="text-white/90 leading-relaxed">{option}</span>
              </motion.label>
            ))}
          </motion.div>
        );

      case 'multi_select':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <motion.label
                key={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-4 cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                  selectedOptions.includes(option)
                    ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/50 shadow-lg'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                <div className="relative flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionSelect(option)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedOptions.includes(option)
                      ? 'border-green-400 bg-green-400'
                      : 'border-white/40'
                  }`}>
                    {selectedOptions.includes(option) && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                    )}
                  </div>
                </div>
                <span className="text-white/90 leading-relaxed">{option}</span>
              </motion.label>
            ))}
            {question.maxSelect && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/60 text-sm mt-3"
              >
                Select up to {question.maxSelect} options ({selectedOptions.length}/{question.maxSelect})
              </motion.p>
            )}
          </motion.div>
        );

      case 'rank_order':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {rankedItems.map((item, index) => (
              <div
                key={item}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/20 cursor-move hover:bg-white/10 transition-all duration-300"
                draggable
                onDragStart={(e: React.DragEvent) => e.dataTransfer.setData('text/plain', index.toString())}
                onDragOver={(e: React.DragEvent) => e.preventDefault()}
                onDrop={(e: React.DragEvent) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  handleRankChange(fromIndex, index);
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {index + 1}
                </div>
                <span className="text-white/90 flex-1">{item}</span>
                <div className="text-white/40 text-lg">⋮⋮</div>
              </div>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/60 text-sm mt-3"
            >
              Drag to reorder items by priority
            </motion.p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {renderInput()}
    </div>
  );
} 