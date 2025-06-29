"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface TechOption {
  value: string;
  label: string;
  description?: string;
  category: string;
}

interface Props {
  question: string;
  description?: string;
  selected: string[];
  onChange: (values: string[]) => void;
  maxSelect?: number;
}

const TECH_STACK_OPTIONS: TechOption[] = [
  // CRM & Sales
  { value: "salesforce", label: "Salesforce", description: "Enterprise CRM platform", category: "CRM & Sales" },
  { value: "hubspot", label: "HubSpot", description: "All-in-one marketing & sales platform", category: "CRM & Sales" },
  { value: "pipedrive", label: "Pipedrive", description: "Sales CRM focused on pipeline management", category: "CRM & Sales" },
  { value: "zoho", label: "Zoho CRM", description: "Comprehensive CRM solution", category: "CRM & Sales" },
  { value: "freshsales", label: "Freshsales", description: "AI-powered sales CRM", category: "CRM & Sales" },
  
  // Marketing & Email
  { value: "mailchimp", label: "Mailchimp", description: "Email marketing automation", category: "Marketing & Email" },
  { value: "klaviyo", label: "Klaviyo", description: "E-commerce marketing automation", category: "Marketing & Email" },
  { value: "convertkit", label: "ConvertKit", description: "Creator-focused email marketing", category: "Marketing & Email" },
  { value: "activecampaign", label: "ActiveCampaign", description: "Marketing automation & CRM", category: "Marketing & Email" },
  { value: "drip", label: "Drip", description: "E-commerce marketing automation", category: "Marketing & Email" },
  
  // Analytics & Data
  { value: "google_analytics", label: "Google Analytics", description: "Web analytics platform", category: "Analytics & Data" },
  { value: "mixpanel", label: "Mixpanel", description: "Product analytics for user behavior", category: "Analytics & Data" },
  { value: "amplitude", label: "Amplitude", description: "Product analytics & user insights", category: "Analytics & Data" },
  { value: "hotjar", label: "Hotjar", description: "User behavior analytics", category: "Analytics & Data" },
  { value: "segment", label: "Segment", description: "Customer data platform", category: "Analytics & Data" },
  
  // E-commerce & Payments
  { value: "shopify", label: "Shopify", description: "E-commerce platform", category: "E-commerce & Payments" },
  { value: "woocommerce", label: "WooCommerce", description: "WordPress e-commerce plugin", category: "E-commerce & Payments" },
  { value: "stripe", label: "Stripe", description: "Payment processing platform", category: "E-commerce & Payments" },
  { value: "paypal", label: "PayPal", description: "Digital payment platform", category: "E-commerce & Payments" },
  { value: "square", label: "Square", description: "Payment & business solutions", category: "E-commerce & Payments" },
  
  // Communication & Collaboration
  { value: "slack", label: "Slack", description: "Team communication platform", category: "Communication & Collaboration" },
  { value: "microsoft_teams", label: "Microsoft Teams", description: "Collaboration & communication", category: "Communication & Collaboration" },
  { value: "zoom", label: "Zoom", description: "Video conferencing platform", category: "Communication & Collaboration" },
  { value: "notion", label: "Notion", description: "All-in-one workspace", category: "Communication & Collaboration" },
  { value: "asana", label: "Asana", description: "Project management platform", category: "Communication & Collaboration" },
  
  // Development & Infrastructure
  { value: "github", label: "GitHub", description: "Code repository & collaboration", category: "Development & Infrastructure" },
  { value: "gitlab", label: "GitLab", description: "DevOps platform", category: "Development & Infrastructure" },
  { value: "aws", label: "AWS", description: "Cloud computing platform", category: "Development & Infrastructure" },
  { value: "google_cloud", label: "Google Cloud", description: "Cloud computing services", category: "Development & Infrastructure" },
  { value: "azure", label: "Azure", description: "Microsoft cloud platform", category: "Development & Infrastructure" },
  
  // Customer Support
  { value: "zendesk", label: "Zendesk", description: "Customer service platform", category: "Customer Support" },
  { value: "intercom", label: "Intercom", description: "Customer messaging platform", category: "Customer Support" },
  { value: "freshdesk", label: "Freshdesk", description: "Customer support software", category: "Customer Support" },
  { value: "help_scout", label: "Help Scout", description: "Customer support platform", category: "Customer Support" },
  { value: "zoho_desk", label: "Zoho Desk", description: "Customer service software", category: "Customer Support" },
  
  // Social Media & Advertising
  { value: "facebook_ads", label: "Facebook Ads", description: "Social media advertising", category: "Social Media & Advertising" },
  { value: "google_ads", label: "Google Ads", description: "Search & display advertising", category: "Social Media & Advertising" },
  { value: "linkedin_ads", label: "LinkedIn Ads", description: "B2B advertising platform", category: "Social Media & Advertising" },
  { value: "twitter_ads", label: "Twitter Ads", description: "Social media advertising", category: "Social Media & Advertising" },
  { value: "tiktok_ads", label: "TikTok Ads", description: "Short-form video advertising", category: "Social Media & Advertising" },
];

export default function EnhancedTechStackSelector({
  question,
  description,
  selected,
  onChange,
  maxSelect = 15,
}: Props) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      if (selected.length >= maxSelect) return;
      onChange([...selected, value]);
    }
  };

  const categories = Array.from(new Set(TECH_STACK_OPTIONS.map(opt => opt.category)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{question}</h2>
        {description && (
          <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
        )}
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryOptions = TECH_STACK_OPTIONS.filter(opt => opt.category === category);
          const isExpanded = expandedCategories.includes(category);
          const selectedInCategory = categoryOptions.filter(opt => selected.includes(opt.value));

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">{category}</span>
                  {selectedInCategory.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {selectedInCategory.length} selected
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryOptions.map((option) => {
                          const isSelected = selected.includes(option.value);
                          const disabled = !isSelected && selected.length >= maxSelect;

                          return (
                            <motion.div
                              key={option.value}
                              whileHover={{ scale: disabled ? 1 : 1.02 }}
                              whileTap={{ scale: disabled ? 1 : 0.98 }}
                              className={`relative group cursor-pointer ${
                                disabled ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => !disabled && toggleOption(option.value)}
                            >
                              <div
                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100"
                                    : "border-gray-200 bg-white hover:border-blue-300"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-900">{option.label}</span>
                                    {option.description && (
                                      <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                                    )}
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                      isSelected
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300 group-hover:border-blue-400"
                                    }`}
                                  >
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <CheckIcon className="w-3 h-3 text-white" />
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
        >
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-green-700">
              {selected.length} tools selected
            </span>
            {maxSelect && ` (max ${maxSelect})`}
          </p>
        </motion.div>
      )}

      {selected.length >= maxSelect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm text-amber-800">
            You can select up to {maxSelect} tools.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
} 