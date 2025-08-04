import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  type: 'text_area' | 'multi_select' | 'multiple_choice' | 'rank_order' | 'tech_stack_selector';
  prompt: string;
  description?: string;
  options?: string[];
  maxSelect?: number;
  required?: boolean;
  placeholder?: string;
  maxCharacters?: number;
  rows?: number;
  defaultItems?: string[];
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
    currentAnswer || question.defaultItems || []
  );
  const [selectedTechTools, setSelectedTechTools] = useState<string[]>(
    currentAnswer ? (Array.isArray(currentAnswer) ? currentAnswer : [currentAnswer]) : []
  );

  // Update local state when currentAnswer changes
  useEffect(() => {
    if (question.type === 'text_area') {
      setTextInput(currentAnswer || '');
    } else if (question.type === 'multiple_choice') {
      setSelectedOptions(currentAnswer ? [currentAnswer] : []);
    } else if (question.type === 'multi_select') {
      setSelectedOptions(Array.isArray(currentAnswer) ? currentAnswer : []);
    } else if (question.type === 'rank_order') {
      setRankedItems(currentAnswer || question.defaultItems || []);
    } else if (question.type === 'tech_stack_selector') {
      setSelectedTechTools(Array.isArray(currentAnswer) ? currentAnswer : []);
    }
  }, [currentAnswer, question.type, question.defaultItems]);

  const handleTextChange = (value: string) => {
    if (question.maxCharacters && value.length > question.maxCharacters) {
      return; // Don't update if exceeding max characters
    }
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

  const handleTechToolSelect = (tool: string) => {
    const newSelection = selectedTechTools.includes(tool)
      ? selectedTechTools.filter(item => item !== tool)
      : [...selectedTechTools, tool];
    
    setSelectedTechTools(newSelection);
    onAnswerChange(newSelection);
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
              placeholder={question.placeholder || "Share your thoughts..."}
                              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-300"
              rows={question.rows || 4}
            />
            {question.maxCharacters && (
              <div className="text-right text-gray-600 text-sm">
                {textInput.length}/{question.maxCharacters} characters
              </div>
            )}
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
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-lg'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
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
                <span className="text-gray-900 leading-relaxed">{option}</span>
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
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300 shadow-lg'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
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
                <span className="text-gray-900 leading-relaxed">{option}</span>
              </motion.label>
            ))}
            {question.maxSelect && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 text-sm mt-3"
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

      case 'tech_stack_selector':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* CRM & Sales */}
            <div className="space-y-3">
              <h4 className="text-white/80 font-medium">CRM & Sales</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Freshsales', 'Close'].map((tool) => (
                  <motion.label
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
                      selectedTechTools.includes(tool)
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTechTools.includes(tool)}
                      onChange={() => handleTechToolSelect(tool)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedTechTools.includes(tool) ? 'border-blue-400 bg-blue-400' : 'border-white/40'
                    }`}>
                      {selectedTechTools.includes(tool) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded"
                        />
                      )}
                    </div>
                    <span className="text-white/90 text-sm">{tool}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Marketing */}
            <div className="space-y-3">
              <h4 className="text-white/80 font-medium">Marketing</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Klaviyo', 'Drip', 'GetResponse'].map((tool) => (
                  <motion.label
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
                      selectedTechTools.includes(tool)
                        ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTechTools.includes(tool)}
                      onChange={() => handleTechToolSelect(tool)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedTechTools.includes(tool) ? 'border-green-400 bg-green-400' : 'border-white/40'
                    }`}>
                      {selectedTechTools.includes(tool) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded"
                        />
                      )}
                    </div>
                    <span className="text-white/90 text-sm">{tool}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Analytics */}
            <div className="space-y-3">
              <h4 className="text-white/80 font-medium">Analytics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Pendo'].map((tool) => (
                  <motion.label
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
                      selectedTechTools.includes(tool)
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTechTools.includes(tool)}
                      onChange={() => handleTechToolSelect(tool)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedTechTools.includes(tool) ? 'border-purple-400 bg-purple-400' : 'border-white/40'
                    }`}>
                      {selectedTechTools.includes(tool) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded"
                        />
                      )}
                    </div>
                    <span className="text-white/90 text-sm">{tool}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Project Management */}
            <div className="space-y-3">
              <h4 className="text-white/80 font-medium">Project Management</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Notion', 'Basecamp'].map((tool) => (
                  <motion.label
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
                      selectedTechTools.includes(tool)
                        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTechTools.includes(tool)}
                      onChange={() => handleTechToolSelect(tool)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedTechTools.includes(tool) ? 'border-orange-400 bg-orange-400' : 'border-white/40'
                    }`}>
                      {selectedTechTools.includes(tool) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded"
                        />
                      )}
                    </div>
                    <span className="text-white/90 text-sm">{tool}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/60 text-sm mt-3"
            >
              Selected {selectedTechTools.length} tools
            </motion.p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {question.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/70 text-sm leading-relaxed"
        >
          {question.description}
        </motion.p>
      )}
      {renderInput()}
    </div>
  );
} 