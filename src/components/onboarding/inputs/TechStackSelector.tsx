"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  tools: TechTool[];
}

interface TechTool {
  value: string;
  label: string;
  description: string;
}

interface TechStackSelectorProps {
  question: string;
  onSelect: (values: string[]) => void;
  disabled?: boolean;
  personality?: string;
}

const techCategories: TechCategory[] = [
  {
    id: 'crm',
    name: 'Customer Relationship Management',
    icon: '👥',
    color: 'blue',
    tools: [
      { value: 'salesforce', label: 'Salesforce', description: 'Enterprise CRM platform' },
      { value: 'hubspot', label: 'HubSpot', description: 'Marketing and sales CRM' },
      { value: 'pipedrive', label: 'Pipedrive', description: 'Sales-focused CRM' },
      { value: 'zoho', label: 'Zoho CRM', description: 'Business CRM suite' },
      { value: 'freshworks', label: 'Freshworks CRM', description: 'Customer engagement platform' }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing & Automation',
    icon: '📢',
    color: 'purple',
    tools: [
      { value: 'mailchimp', label: 'Mailchimp', description: 'Email marketing platform' },
      { value: 'klaviyo', label: 'Klaviyo', description: 'E-commerce marketing automation' },
      { value: 'convertkit', label: 'ConvertKit', description: 'Creator-focused email marketing' },
      { value: 'activecampaign', label: 'ActiveCampaign', description: 'Marketing automation' },
      { value: 'drip', label: 'Drip', description: 'E-commerce marketing automation' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Business Intelligence',
    icon: '📊',
    color: 'green',
    tools: [
      { value: 'google_analytics', label: 'Google Analytics', description: 'Web analytics platform' },
      { value: 'mixpanel', label: 'Mixpanel', description: 'Product analytics' },
      { value: 'amplitude', label: 'Amplitude', description: 'Product analytics platform' },
      { value: 'tableau', label: 'Tableau', description: 'Business intelligence' },
      { value: 'looker', label: 'Looker', description: 'Data platform' }
    ]
  },
  {
    id: 'project_management',
    name: 'Project Management',
    icon: '📋',
    color: 'orange',
    tools: [
      { value: 'asana', label: 'Asana', description: 'Project management platform' },
      { value: 'trello', label: 'Trello', description: 'Visual project management' },
      { value: 'monday', label: 'Monday.com', description: 'Work management platform' },
      { value: 'clickup', label: 'ClickUp', description: 'All-in-one productivity platform' },
      { value: 'notion', label: 'Notion', description: 'Workspace and documentation' }
    ]
  },
  {
    id: 'finance',
    name: 'Accounting & Finance',
    icon: '💰',
    color: 'emerald',
    tools: [
      { value: 'quickbooks', label: 'QuickBooks', description: 'Accounting software' },
      { value: 'xero', label: 'Xero', description: 'Cloud accounting platform' },
      { value: 'freshbooks', label: 'FreshBooks', description: 'Accounting for small business' },
      { value: 'wave', label: 'Wave', description: 'Free accounting software' },
      { value: 'sage', label: 'Sage', description: 'Business management software' }
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Collaboration',
    icon: '💬',
    color: 'indigo',
    tools: [
      { value: 'slack', label: 'Slack', description: 'Team communication platform' },
      { value: 'microsoft_teams', label: 'Microsoft Teams', description: 'Collaboration platform' },
      { value: 'zoom', label: 'Zoom', description: 'Video conferencing' },
      { value: 'discord', label: 'Discord', description: 'Community platform' },
      { value: 'google_meet', label: 'Google Meet', description: 'Video meetings' }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Payments',
    icon: '🛒',
    color: 'pink',
    tools: [
      { value: 'shopify', label: 'Shopify', description: 'E-commerce platform' },
      { value: 'woocommerce', label: 'WooCommerce', description: 'WordPress e-commerce' },
      { value: 'stripe', label: 'Stripe', description: 'Payment processing' },
      { value: 'paypal', label: 'PayPal', description: 'Online payments' },
      { value: 'square', label: 'Square', description: 'Payment and POS system' }
    ]
  },
  {
    id: 'development',
    name: 'Development & Technical',
    icon: '⚙️',
    color: 'gray',
    tools: [
      { value: 'github', label: 'GitHub', description: 'Code repository platform' },
      { value: 'gitlab', label: 'GitLab', description: 'DevOps platform' },
      { value: 'jira', label: 'Jira', description: 'Project management for teams' },
      { value: 'confluence', label: 'Confluence', description: 'Team workspace' },
      { value: 'figma', label: 'Figma', description: 'Design and prototyping' }
    ]
  }
];

export default function TechStackSelector({
  question,
  onSelect,
  disabled = false,
  personality = 'analyst'
}: TechStackSelectorProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleToolToggle = (toolValue: string) => {
    if (disabled) return;

    setSelectedTools(prev => {
      const isSelected = prev.includes(toolValue);
      const newSelection = isSelected 
        ? prev.filter(v => v !== toolValue)
        : [...prev, toolValue];
      
      // Don't call onSelect here - wait for Continue button
      return newSelection;
    });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getPersonalityConfig = () => {
    switch (personality) {
      case 'analyst':
        return {
          icon: '📊',
          color: 'purple',
          gradient: 'from-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-pink-50'
        };
      default:
        return {
          icon: '💼',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-indigo-50'
        };
    }
  };

  const config = getPersonalityConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Question Header */}
        <div className={`px-6 py-4 bg-gradient-to-r ${config.bgGradient} border-b border-gray-100`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium bg-gradient-to-r ${config.gradient}`}>
              {config.icon}
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-semibold text-lg">{question}</p>
              <p className="text-gray-600 text-sm mt-1">
                Select the tools you actively use across different categories
              </p>
            </div>
          </div>
        </div>

        {/* Selected Tools */}
        <AnimatePresence>
          {selectedTools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-3 bg-gray-50 border-b border-gray-100"
            >
              <div className="flex flex-wrap gap-2">
                {selectedTools.map((toolValue, index) => {
                  const tool = techCategories
                    .flatMap(cat => cat.tools)
                    .find(t => t.value === toolValue);
                  
                  return (
                    <motion.div
                      key={toolValue}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-200 flex items-center space-x-2"
                    >
                      <span className="text-purple-800 text-sm font-medium">
                        {tool?.label || toolValue}
                      </span>
                      <button
                        onClick={() => handleToolToggle(toolValue)}
                        className="w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-colors"
                      >
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tech Categories */}
        <div className="p-6">
          <div className="space-y-4">
            {techCategories.map((category, index) => {
              const isExpanded = expandedCategories.includes(category.id);
              const categorySelectedTools = selectedTools.filter(tool => 
                category.tools.some(t => t.value === tool)
              );

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    disabled={disabled}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 flex items-center justify-center text-white text-sm`}>
                        {category.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-800">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          {categorySelectedTools.length} selected
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>

                  {/* Category Tools */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 bg-gray-50"
                      >
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.tools.map((tool) => {
                            const isSelected = selectedTools.includes(tool.value);
                            
                            return (
                              <button
                                key={tool.value}
                                onClick={() => handleToolToggle(tool.value)}
                                disabled={disabled}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                                  isSelected
                                    ? `border-${category.color}-500 bg-${category.color}-50`
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                                    isSelected
                                      ? `border-${category.color}-500 bg-${category.color}-500`
                                      : 'border-gray-300'
                                  }`}>
                                    {isSelected && (
                                      <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-2 h-2 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </motion.svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`font-medium ${
                                      isSelected 
                                        ? `text-${category.color}-800` 
                                        : 'text-gray-800'
                                    }`}>
                                      {tool.label}
                                    </h4>
                                    <p className={`text-sm mt-1 ${
                                      isSelected 
                                        ? `text-${category.color}-600` 
                                        : 'text-gray-500'
                                    }`}>
                                      {tool.description}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Continue Button */}
          {selectedTools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(selectedTools)}
                disabled={disabled}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  disabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${config.gradient} text-white shadow-lg hover:shadow-xl`
                }`}
              >
                Continue with {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 