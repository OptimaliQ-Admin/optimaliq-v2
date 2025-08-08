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
              <div className="relative">
                <select
                  multiple
                  value={selectedTechTools.filter(tool => 
                    ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Freshsales', 'Close', 'Microsoft Dynamics', 'SugarCRM', 'Insightly', 'Nimble', 'Agile CRM', 'Capsule CRM', 'Bitrix24', 'SuiteCRM', 'Vtiger', 'Odoo CRM', 'Zendesk Sell', 'Copper', 'SalesLoft', 'Outreach', 'Gong', 'Chorus.ai', 'Gong.io', 'Chorus'].includes(tool)
                  )}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    const currentCRM = selectedTechTools.filter(tool => 
                      ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Freshsales', 'Close', 'Microsoft Dynamics', 'SugarCRM', 'Insightly', 'Nimble', 'Agile CRM', 'Capsule CRM', 'Bitrix24', 'SuiteCRM', 'Vtiger', 'Odoo CRM', 'Zendesk Sell', 'Copper', 'Pipedrive', 'SalesLoft', 'Outreach', 'Gong', 'Chorus.ai', 'Gong.io', 'Chorus'].includes(tool)
                    );
                    const otherTools = selectedTechTools.filter(tool => 
                      !['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Freshsales', 'Close', 'Microsoft Dynamics', 'SugarCRM', 'Insightly', 'Nimble', 'Agile CRM', 'Capsule CRM', 'Bitrix24', 'SuiteCRM', 'Vtiger', 'Odoo CRM', 'Zendesk Sell', 'Copper', 'Pipedrive', 'SalesLoft', 'Outreach', 'Gong', 'Chorus.ai', 'Gong.io', 'Chorus'].includes(tool)
                    );
                    onAnswerChange([...otherTools, ...selectedOptions]);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={6}
                >
                  <option value="Salesforce">Salesforce</option>
                  <option value="HubSpot">HubSpot</option>
                  <option value="Pipedrive">Pipedrive</option>
                  <option value="Zoho CRM">Zoho CRM</option>
                  <option value="Freshsales">Freshsales</option>
                  <option value="Close">Close</option>
                  <option value="Microsoft Dynamics">Microsoft Dynamics</option>
                  <option value="SugarCRM">SugarCRM</option>
                  <option value="Insightly">Insightly</option>
                  <option value="Nimble">Nimble</option>
                  <option value="Agile CRM">Agile CRM</option>
                  <option value="Capsule CRM">Capsule CRM</option>
                  <option value="Bitrix24">Bitrix24</option>
                  <option value="SuiteCRM">SuiteCRM</option>
                  <option value="Vtiger">Vtiger</option>
                  <option value="Odoo CRM">Odoo CRM</option>
                  <option value="Zendesk Sell">Zendesk Sell</option>
                  <option value="Copper">Copper</option>
                  <option value="SalesLoft">SalesLoft</option>
                  <option value="Outreach">Outreach</option>
                  <option value="Gong">Gong</option>
                  <option value="Chorus.ai">Chorus.ai</option>
                  <option value="Gong.io">Gong.io</option>
                  <option value="Chorus">Chorus</option>
                </select>
              </div>
            </div>

            {/* Marketing */}
            <div className="space-y-3">
              <h4 className="text-gray-700 font-medium">Marketing</h4>
              <div className="relative">
                <select
                  multiple
                  value={selectedTechTools.filter(tool => 
                    ['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Klaviyo', 'Drip', 'GetResponse', 'Constant Contact', 'SendinBlue', 'AWeber', 'Campaign Monitor', 'Emma', 'VerticalResponse', 'iContact', 'Ontraport', 'Infusionsoft', 'Kajabi', 'ConvertKit', 'Substack', 'Buttondown', 'TinyLetter', 'MailerLite', 'SendGrid', 'Postmark', 'Customer.io', 'Intercom', 'Drift'].includes(tool)
                  )}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    const currentMarketing = selectedTechTools.filter(tool => 
                      ['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Klaviyo', 'Drip', 'GetResponse', 'Constant Contact', 'SendinBlue', 'AWeber', 'Campaign Monitor', 'Emma', 'VerticalResponse', 'iContact', 'Ontraport', 'Infusionsoft', 'Kajabi', 'ConvertKit', 'Substack', 'Buttondown', 'TinyLetter', 'MailerLite', 'SendGrid', 'Postmark', 'Customer.io', 'Intercom', 'Drift'].includes(tool)
                    );
                    const otherTools = selectedTechTools.filter(tool => 
                      !['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Klaviyo', 'Drip', 'GetResponse', 'Constant Contact', 'SendinBlue', 'AWeber', 'Campaign Monitor', 'Emma', 'VerticalResponse', 'iContact', 'Ontraport', 'Infusionsoft', 'Kajabi', 'ConvertKit', 'Substack', 'Buttondown', 'TinyLetter', 'MailerLite', 'SendGrid', 'Postmark', 'Customer.io', 'Intercom', 'Drift'].includes(tool)
                    );
                    onAnswerChange([...otherTools, ...selectedOptions]);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  size={6}
                >
                  <option value="Mailchimp">Mailchimp</option>
                  <option value="ConvertKit">ConvertKit</option>
                  <option value="ActiveCampaign">ActiveCampaign</option>
                  <option value="Klaviyo">Klaviyo</option>
                  <option value="Drip">Drip</option>
                  <option value="GetResponse">GetResponse</option>
                  <option value="Constant Contact">Constant Contact</option>
                  <option value="SendinBlue">SendinBlue</option>
                  <option value="AWeber">AWeber</option>
                  <option value="Campaign Monitor">Campaign Monitor</option>
                  <option value="Emma">Emma</option>
                  <option value="VerticalResponse">VerticalResponse</option>
                  <option value="iContact">iContact</option>
                  <option value="Ontraport">Ontraport</option>
                  <option value="Infusionsoft">Infusionsoft</option>
                  <option value="Kajabi">Kajabi</option>
                  <option value="Substack">Substack</option>
                  <option value="Buttondown">Buttondown</option>
                  <option value="TinyLetter">TinyLetter</option>
                  <option value="MailerLite">MailerLite</option>
                  <option value="SendGrid">SendGrid</option>
                  <option value="Postmark">Postmark</option>
                  <option value="Customer.io">Customer.io</option>
                  <option value="Intercom">Intercom</option>
                  <option value="Drift">Drift</option>
                </select>
              </div>
            </div>

            {/* Analytics */}
            <div className="space-y-3">
              <h4 className="text-gray-700 font-medium">Analytics</h4>
              <div className="relative">
                <select
                  multiple
                  value={selectedTechTools.filter(tool => 
                    ['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Pendo', 'Adobe Analytics', 'Segment', 'Kissmetrics', 'Heap', 'Crazy Egg', 'Optimizely', 'VWO', 'Google Tag Manager', 'Tealium', 'Adobe Launch', 'GTM', 'Facebook Pixel', 'LinkedIn Insight Tag', 'Twitter Pixel', 'Pinterest Tag', 'Snapchat Pixel', 'TikTok Pixel', 'Reddit Pixel', 'Quora Pixel', 'Bing Ads'].includes(tool)
                  )}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    const currentAnalytics = selectedTechTools.filter(tool => 
                      ['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Pendo', 'Adobe Analytics', 'Segment', 'Kissmetrics', 'Heap', 'Crazy Egg', 'Optimizely', 'VWO', 'Google Tag Manager', 'Tealium', 'Adobe Launch', 'GTM', 'Facebook Pixel', 'LinkedIn Insight Tag', 'Twitter Pixel', 'Pinterest Tag', 'Snapchat Pixel', 'TikTok Pixel', 'Reddit Pixel', 'Quora Pixel', 'Bing Ads'].includes(tool)
                    );
                    const otherTools = selectedTechTools.filter(tool => 
                      !['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Pendo', 'Adobe Analytics', 'Segment', 'Kissmetrics', 'Heap', 'Crazy Egg', 'Optimizely', 'VWO', 'Google Tag Manager', 'Tealium', 'Adobe Launch', 'GTM', 'Facebook Pixel', 'LinkedIn Insight Tag', 'Twitter Pixel', 'Pinterest Tag', 'Snapchat Pixel', 'TikTok Pixel', 'Reddit Pixel', 'Quora Pixel', 'Bing Ads'].includes(tool)
                    );
                    onAnswerChange([...otherTools, ...selectedOptions]);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  size={6}
                >
                  <option value="Google Analytics">Google Analytics</option>
                  <option value="Mixpanel">Mixpanel</option>
                  <option value="Amplitude">Amplitude</option>
                  <option value="Hotjar">Hotjar</option>
                  <option value="FullStory">FullStory</option>
                  <option value="Pendo">Pendo</option>
                  <option value="Adobe Analytics">Adobe Analytics</option>
                  <option value="Segment">Segment</option>
                  <option value="Kissmetrics">Kissmetrics</option>
                  <option value="Heap">Heap</option>
                  <option value="Crazy Egg">Crazy Egg</option>
                  <option value="Optimizely">Optimizely</option>
                  <option value="VWO">VWO</option>
                  <option value="Google Tag Manager">Google Tag Manager</option>
                  <option value="Tealium">Tealium</option>
                  <option value="Adobe Launch">Adobe Launch</option>
                  <option value="GTM">GTM</option>
                  <option value="Facebook Pixel">Facebook Pixel</option>
                  <option value="LinkedIn Insight Tag">LinkedIn Insight Tag</option>
                  <option value="Twitter Pixel">Twitter Pixel</option>
                  <option value="Pinterest Tag">Pinterest Tag</option>
                  <option value="Snapchat Pixel">Snapchat Pixel</option>
                  <option value="TikTok Pixel">TikTok Pixel</option>
                  <option value="Reddit Pixel">Reddit Pixel</option>
                  <option value="Quora Pixel">Quora Pixel</option>
                  <option value="Bing Ads">Bing Ads</option>
                </select>
              </div>
            </div>

            {/* Project Management */}
            <div className="space-y-3">
              <h4 className="text-gray-700 font-medium">Project Management</h4>
              <div className="relative">
                <select
                  multiple
                  value={selectedTechTools.filter(tool => 
                    ['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Notion', 'Basecamp', 'Jira', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom', 'Google Meet', 'Loom', 'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer', 'Webflow', 'Squarespace', 'Wix', 'Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Stripe'].includes(tool)
                  )}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    const currentPM = selectedTechTools.filter(tool => 
                      ['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Notion', 'Basecamp', 'Jira', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom', 'Google Meet', 'Loom', 'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer', 'Webflow', 'Squarespace', 'Wix', 'Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Stripe'].includes(tool)
                    );
                    const otherTools = selectedTechTools.filter(tool => 
                      !['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Notion', 'Basecamp', 'Jira', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom', 'Google Meet', 'Loom', 'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer', 'Webflow', 'Squarespace', 'Wix', 'Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Stripe'].includes(tool)
                    );
                    onAnswerChange([...otherTools, ...selectedOptions]);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  size={6}
                >
                  <option value="Asana">Asana</option>
                  <option value="Trello">Trello</option>
                  <option value="Monday.com">Monday.com</option>
                  <option value="ClickUp">ClickUp</option>
                  <option value="Notion">Notion</option>
                  <option value="Basecamp">Basecamp</option>
                  <option value="Jira">Jira</option>
                  <option value="Confluence">Confluence</option>
                  <option value="Slack">Slack</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Loom">Loom</option>
                  <option value="Figma">Figma</option>
                  <option value="Sketch">Sketch</option>
                  <option value="Adobe XD">Adobe XD</option>
                  <option value="InVision">InVision</option>
                  <option value="Framer">Framer</option>
                  <option value="Webflow">Webflow</option>
                  <option value="Squarespace">Squarespace</option>
                  <option value="Wix">Wix</option>
                  <option value="Shopify">Shopify</option>
                  <option value="WooCommerce">WooCommerce</option>
                  <option value="Magento">Magento</option>
                  <option value="BigCommerce">BigCommerce</option>
                  <option value="Stripe">Stripe</option>
                </select>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-sm mt-3"
            >
              Selected {selectedTechTools.length} tools (Hold Ctrl/Cmd to select multiple)
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