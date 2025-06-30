"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import EnhancedTechStackSelector from "@/components/questions/EnhancedTechStackSelector";
import { FaCog, FaTools, FaDatabase, FaChartBar, FaShoppingCart, FaEnvelope, FaArrowRight, FaPlus, FaSearch } from "react-icons/fa";

type TechToolsCardProps = {
  userId: string;
};

type TechStack = {
  crm_tools: string[];
  esp_tools: string[];
  analytics_tools: string[];
  cdp_tools: string[];
  erp_tools: string[];
  commerce_tools: string[];
  updated_at: string;
};

export default function TechToolsCard({ userId }: TechToolsCardProps) {
  const [techStack, setTechStack] = useState<TechStack | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedTools, setSelectedTools] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchTechStack = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("user_tech_stack")
          .select("*")
          .eq("u_id", userId)
          .single();

        if (error) {
          // Don't show error for PGRST116 (no rows returned) - this is expected when user hasn't taken the assessment
          if (error.code === 'PGRST116') {
            setTechStack(null);
          } else {
            console.error("Failed to fetch tech stack:", error);
            showToast.error("Failed to load tech stack");
          }
        } else {
          setTechStack(data);
          // Convert the tech stack data to the format expected by the selector
          const convertedData = {
            "CRM & Sales": data.crm_tools || [],
            "Marketing & Email": data.esp_tools || [],
            "Analytics & BI": data.analytics_tools || [],
            "Customer Data Platforms": data.cdp_tools || [],
            "Finance & Accounting": data.erp_tools || [],
            "Ecommerce & POS": data.commerce_tools || [],
          };
          setSelectedTools(convertedData);
        }
      } catch (err) {
        console.error("Failed to fetch tech stack:", err);
        showToast.error("Failed to load tech stack");
      } finally {
        setLoading(false);
      }
    };

    fetchTechStack();
  }, [userId]);

  const handleSaveTechStack = async (selectedTools: Record<string, string[]>) => {
    if (!userId) return;

    try {
      // Convert the selector format back to the database format
      const techStackData = {
        u_id: userId,
        crm_tools: selectedTools["CRM & Sales"] || [],
        esp_tools: selectedTools["Marketing & Email"] || [],
        analytics_tools: selectedTools["Analytics & BI"] || [],
        cdp_tools: selectedTools["Customer Data Platforms"] || [],
        erp_tools: selectedTools["Finance & Accounting"] || [],
        commerce_tools: selectedTools["Ecommerce & POS"] || [],
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("user_tech_stack")
        .upsert(techStackData, { onConflict: 'u_id' });

      if (error) {
        console.error("Failed to save tech stack:", error);
        showToast.error("Failed to save tech stack");
        return;
      }

      setTechStack(techStackData);
      setShowSelector(false);
      showToast.success("Technology stack updated successfully!");
    } catch (err) {
      console.error("Failed to save tech stack:", err);
      showToast.error("Failed to save tech stack");
    }
  };

  const getCategoryCount = (tools: string[] | null) => {
    return tools?.length || 0;
  };

  const getLastUpdated = () => {
    if (!techStack?.updated_at) return "Never";
    return new Date(techStack.updated_at).toLocaleDateString();
  };

  const techCategories = [
    { key: 'crm_tools', label: 'CRM', icon: FaDatabase, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { key: 'esp_tools', label: 'Email Service', icon: FaEnvelope, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { key: 'analytics_tools', label: 'Analytics', icon: FaChartBar, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
    { key: 'cdp_tools', label: 'CDP', icon: FaCog, color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50' },
    { key: 'erp_tools', label: 'ERP', icon: FaTools, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
    { key: 'commerce_tools', label: 'Commerce', icon: FaShoppingCart, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50' },
  ];

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse"
      >
        <div className="p-8">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </motion.div>
    );
  }

  if (showSelector) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaSearch className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Select Your Technology Stack
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                    🔍 Search & Select
                  </span>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={() => setShowSelector(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          <EnhancedTechStackSelector
            question="What platforms or tools are central to your operations?"
            description="Select all the technology tools your business currently uses across different categories."
            selected={Object.values(selectedTools).flat()}
            onChange={(values) => {
              // Convert flat array back to categorized format
              const categorized: Record<string, string[]> = {
                "CRM & Sales": [],
                "Marketing & Email": [],
                "Analytics & BI": [],
                "Customer Data Platforms": [],
                "Finance & Accounting": [],
                "Ecommerce & POS": [],
              };
              
              values.forEach(value => {
                // Find which category this value belongs to
                if (value.includes('crm') || value.includes('sales')) {
                  categorized["CRM & Sales"].push(value);
                } else if (value.includes('marketing') || value.includes('email') || value.includes('esp')) {
                  categorized["Marketing & Email"].push(value);
                } else if (value.includes('analytics') || value.includes('bi')) {
                  categorized["Analytics & BI"].push(value);
                } else if (value.includes('cdp')) {
                  categorized["Customer Data Platforms"].push(value);
                } else if (value.includes('finance') || value.includes('accounting') || value.includes('erp')) {
                  categorized["Finance & Accounting"].push(value);
                } else if (value.includes('commerce') || value.includes('pos') || value.includes('ecommerce')) {
                  categorized["Ecommerce & POS"].push(value);
                }
              });
              
              setSelectedTools(categorized);
            }}
            maxSelect={50}
          />
          
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
            <motion.button
              onClick={() => setShowSelector(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 text-gray-600 font-medium hover:text-gray-700 transition-colors duration-200 border border-gray-300 rounded-xl hover:border-gray-400"
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={() => handleSaveTechStack(selectedTools)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group overflow-hidden relative"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 mb-1">
                Current Technology Stack
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                  ⚙️ Tech Management
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border shadow-sm bg-blue-50 border-blue-200 text-blue-700">
            <FaCog className="text-sm" />
            {techStack ? "Configured" : "Not Set"}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-base leading-relaxed mb-8">
          Manage and track your technology infrastructure across all business areas.
        </p>

        {/* Action Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-500 font-medium">Last updated: {getLastUpdated()}</p>
          </div>
          <motion.button
            onClick={() => setShowSelector(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
          >
            {techStack ? <FaTools className="text-sm" /> : <FaPlus className="text-sm" />}
            <span>{techStack ? "Update Stack" : "Add Stack"}</span>
            <FaArrowRight className="text-sm" />
          </motion.button>
        </div>

        {/* Tech Stack Content */}
        {techStack ? (
          <div className="grid grid-cols-2 gap-4 flex-1">
            {techCategories.map((category) => {
              const Icon = category.icon;
              const count = getCategoryCount(techStack[category.key as keyof TechStack] as string[]);
              
              return (
                <motion.div 
                  key={category.key}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group/category"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-sm group-hover/category:shadow-md transition-all duration-300`}>
                      <Icon className="text-white text-base" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">{category.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    <span className="font-bold text-gray-900 text-lg">{count}</span> tools configured
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 flex-1 flex flex-col justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FaCog className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-600 font-semibold mb-3 text-lg">No technology stack recorded yet</p>
            <p className="text-sm text-gray-400">Click the button above to add your tech stack</p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 