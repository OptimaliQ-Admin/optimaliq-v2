"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
import { FaCog, FaTools, FaDatabase, FaChartBar, FaShoppingCart, FaEnvelope } from "react-icons/fa";

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
  const router = useRouter();
  const [techStack, setTechStack] = useState<TechStack | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getCategoryCount = (tools: string[] | null) => {
    return tools?.length || 0;
  };

  const getLastUpdated = () => {
    if (!techStack?.updated_at) return "Never";
    return new Date(techStack.updated_at).toLocaleDateString();
  };

  const techCategories = [
    { key: 'crm_tools', label: 'CRM', icon: FaDatabase, color: 'from-blue-500 to-blue-600' },
    { key: 'esp_tools', label: 'Email Service', icon: FaEnvelope, color: 'from-green-500 to-green-600' },
    { key: 'analytics_tools', label: 'Analytics', icon: FaChartBar, color: 'from-purple-500 to-purple-600' },
    { key: 'cdp_tools', label: 'CDP', icon: FaCog, color: 'from-indigo-500 to-indigo-600' },
    { key: 'erp_tools', label: 'ERP', icon: FaTools, color: 'from-orange-500 to-orange-600' },
    { key: 'commerce_tools', label: 'Commerce', icon: FaShoppingCart, color: 'from-red-500 to-red-600' },
  ];

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 animate-pulse"
      >
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="mb-4">
        <SectionTitleBar title="⚙️ Current Technology Stack" />
        <p className="text-gray-500 text-sm leading-relaxed mt-2">
          Manage and track your technology infrastructure across all business areas.
        </p>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-sm text-gray-500">Last updated: {getLastUpdated()}</p>
        </div>
        <motion.button
          onClick={() => router.push("/premium/assessment/tech-tools")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
        >
          <FaTools className="text-sm" />
          <span>{techStack ? "Update Stack" : "Add Stack"}</span>
        </motion.button>
      </div>

      {techStack ? (
        <div className="grid grid-cols-2 gap-4">
          {techCategories.map((category) => {
            const Icon = category.icon;
            const count = getCategoryCount(techStack[category.key as keyof TechStack] as string[]);
            
            return (
              <motion.div 
                key={category.key}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white text-sm" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{category.label}</h4>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{count}</span> tools configured
                </p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaCog className="text-white text-2xl" />
          </div>
          <p className="text-gray-500 font-medium mb-2">No technology stack recorded yet</p>
          <p className="text-sm text-gray-400">Click the button above to add your tech stack</p>
        </div>
      )}
    </motion.div>
  );
} 