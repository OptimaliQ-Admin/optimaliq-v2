import React, { useState, useEffect, useRef } from 'react';
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
  const [openDropdowns, setOpenDropdowns] = useState({
    crm: false,
    marketing: false,
    analytics: false,
    pm: false
  });
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      let shouldClose = true;
      
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && ref.contains(target)) {
          shouldClose = false;
        }
      });
      
      if (shouldClose) {
        setOpenDropdowns({
          crm: false,
          marketing: false,
          analytics: false,
          pm: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-move hover:bg-gray-100 transition-all duration-300"
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
                <span className="text-gray-900 flex-1">{item}</span>
                <div className="text-gray-400 text-lg">⋮⋮</div>
              </div>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-sm mt-3"
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
            className="space-y-6"
          >
            {/* CRM & Sales */}
            <div className="space-y-3">
              <h4 className="text-gray-700 font-medium">CRM & Sales</h4>
              <div className="relative" ref={el => { dropdownRefs.current.crm = el; }}>
                <button
                  type="button"
                  onClick={() => setOpenDropdowns(prev => ({ ...prev, crm: !prev.crm }))}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className="text-left">
                    {selectedTechTools.filter(tool => 
                      ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Freshsales', 'Close', 'Microsoft Dynamics', 'SugarCRM', 'Insightly', 'Nimble', 'Agile CRM', 'Capsule CRM', 'Bitrix24', 'SuiteCRM', 'Vtiger', 'Odoo CRM', 'Zendesk Sell', 'Copper', 'SalesLoft', 'Outreach', 'Gong', 'Chorus.ai', 'Gong.io', 'Chorus'].includes(tool)
                    ).length > 0 
                      ? `${selectedTechTools.filter(tool => 
                          ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Freshsales', 'Close', 'Microsoft Dynamics', 'SugarCRM', 'Insightly', 'Nimble', 'Agile CRM', 'Capsule CRM', 'Bitrix24', 'SuiteCRM', 'Vtiger', 'Odoo CRM', 'Zendesk Sell', 'Copper', 'SalesLoft', 'Outreach', 'Gong', 'Chorus.ai', 'Gong.io', 'Chorus'].includes(tool)
                        ).length} selected`
                      : 'Select CRM & Sales tools'
                    }
                  </span>
                  <svg className={`w-5 h-5 transition-transform ${openDropdowns.crm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdowns.crm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Freshsales', 'Close', 'Microsoft Dynamics', 'SugarCRM', 'Insightly', 'Nimble', 'Agile CRM', 'Capsule CRM', 'Bitrix24', 'SuiteCRM', 'Vtiger', 'Odoo CRM', 'Zendesk Sell', 'Copper', 'SalesLoft', 'Outreach', 'Gong', 'Chorus.ai', 'Gong.io', 'Chorus'].map((tool) => (
                      <label key={tool} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTechTools.includes(tool)}
                          onChange={() => handleTechToolSelect(tool)}
                          className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-900 text-sm">{tool}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Marketing */}
            <div className="space-y-3">
              <h4 className="text-gray-700 font-medium">Marketing</h4>
              <div className="relative" ref={el => { dropdownRefs.current.marketing = el; }}>
                <button
                  type="button"
                  onClick={() => setOpenDropdowns(prev => ({ ...prev, marketing: !prev.marketing }))}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className="text-left">
                    {selectedTechTools.filter(tool => 
                      ['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Klaviyo', 'Drip', 'GetResponse', 'Constant Contact', 'SendinBlue', 'AWeber', 'Campaign Monitor', 'Emma', 'VerticalResponse', 'iContact', 'Ontraport', 'Infusionsoft', 'Kajabi', 'Substack', 'Buttondown', 'TinyLetter', 'MailerLite', 'SendGrid', 'Postmark', 'Customer.io', 'Intercom', 'Drift'].includes(tool)
                    ).length > 0 
                      ? `${selectedTechTools.filter(tool => 
                          ['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Klaviyo', 'Drip', 'GetResponse', 'Constant Contact', 'SendinBlue', 'AWeber', 'Campaign Monitor', 'Emma', 'VerticalResponse', 'iContact', 'Ontraport', 'Infusionsoft', 'Kajabi', 'Substack', 'Buttondown', 'TinyLetter', 'MailerLite', 'SendGrid', 'Postmark', 'Customer.io', 'Intercom', 'Drift'].includes(tool)
                        ).length} selected`
                      : 'Select Marketing tools'
                    }
                  </span>
                  <svg className={`w-5 h-5 transition-transform ${openDropdowns.marketing ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdowns.marketing && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Klaviyo', 'Drip', 'GetResponse', 'Constant Contact', 'SendinBlue', 'AWeber', 'Campaign Monitor', 'Emma', 'VerticalResponse', 'iContact', 'Ontraport', 'Infusionsoft', 'Kajabi', 'Substack', 'Buttondown', 'TinyLetter', 'MailerLite', 'SendGrid', 'Postmark', 'Customer.io', 'Intercom', 'Drift'].map((tool) => (
                      <label key={tool} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTechTools.includes(tool)}
                          onChange={() => handleTechToolSelect(tool)}
                          className="mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-gray-900 text-sm">{tool}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Analytics */}
            <div className="space-y-3">
              <h4 className="text-gray-700 font-medium">Analytics</h4>
              <div className="relative" ref={el => { dropdownRefs.current.analytics = el; }}>
                <button
                  type="button"
                  onClick={() => setOpenDropdowns(prev => ({ ...prev, analytics: !prev.analytics }))}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className="text-left">
                    {selectedTechTools.filter(tool => 
                      ['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Pendo', 'Adobe Analytics', 'Segment', 'Kissmetrics', 'Heap', 'Crazy Egg', 'Optimizely', 'VWO', 'Google Tag Manager', 'Tealium', 'Adobe Launch', 'GTM', 'Facebook Pixel', 'LinkedIn Insight Tag', 'Twitter Pixel', 'Pinterest Tag', 'Snapchat Pixel', 'TikTok Pixel', 'Reddit Pixel', 'Quora Pixel', 'Bing Ads'].includes(tool)
                    ).length > 0 
                      ? `${selectedTechTools.filter(tool => 
                          ['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Pendo', 'Adobe Analytics', 'Segment', 'Kissmetrics', 'Heap', 'Crazy Egg', 'Optimizely', 'VWO', 'Google Tag Manager', 'Tealium', 'Adobe Launch', 'GTM', 'Facebook Pixel', 'LinkedIn Insight Tag', 'Twitter Pixel', 'Pinterest Tag', 'Snapchat Pixel', 'TikTok Pixel', 'Reddit Pixel', 'Quora Pixel', 'Bing Ads'].includes(tool)
                        ).length} selected`
                      : 'Select Analytics tools'
                    }
                  </span>
                  <svg className={`w-5 h-5 transition-transform ${openDropdowns.analytics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdowns.analytics && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Pendo', 'Adobe Analytics', 'Segment', 'Kissmetrics', 'Heap', 'Crazy Egg', 'Optimizely', 'VWO', 'Google Tag Manager', 'Tealium', 'Adobe Launch', 'GTM', 'Facebook Pixel', 'LinkedIn Insight Tag', 'Twitter Pixel', 'Pinterest Tag', 'Snapchat Pixel', 'TikTok Pixel', 'Reddit Pixel', 'Quora Pixel', 'Bing Ads'].map((tool) => (
                      <label key={tool} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTechTools.includes(tool)}
                          onChange={() => handleTechToolSelect(tool)}
                          className="mr-3 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-900 text-sm">{tool}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Project Management */}
            <div className="space-y-3">
              <h4 className="text-gray-700 font-medium">Project Management</h4>
              <div className="relative" ref={el => { dropdownRefs.current.pm = el; }}>
                <button
                  type="button"
                  onClick={() => setOpenDropdowns(prev => ({ ...prev, pm: !prev.pm }))}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className="text-left">
                    {selectedTechTools.filter(tool => 
                      ['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Notion', 'Basecamp', 'Jira', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom', 'Google Meet', 'Loom', 'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer', 'Webflow', 'Squarespace', 'Wix', 'Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Stripe'].includes(tool)
                    ).length > 0 
                      ? `${selectedTechTools.filter(tool => 
                          ['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Notion', 'Basecamp', 'Jira', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom', 'Google Meet', 'Loom', 'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer', 'Webflow', 'Squarespace', 'Wix', 'Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Stripe'].includes(tool)
                        ).length} selected`
                      : 'Select Project Management tools'
                    }
                  </span>
                  <svg className={`w-5 h-5 transition-transform ${openDropdowns.pm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdowns.pm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Notion', 'Basecamp', 'Jira', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom', 'Google Meet', 'Loom', 'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer', 'Webflow', 'Squarespace', 'Wix', 'Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Stripe'].map((tool) => (
                      <label key={tool} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTechTools.includes(tool)}
                          onChange={() => handleTechToolSelect(tool)}
                          className="mr-3 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-900 text-sm">{tool}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-sm mt-3"
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
          className="text-gray-600 text-sm leading-relaxed"
        >
          {question.description}
        </motion.p>
      )}
      {renderInput()}
    </div>
  );
} 