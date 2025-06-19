"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Current Technology Stack</h3>
          <p className="text-sm text-gray-500 mt-1">Last updated: {getLastUpdated()}</p>
        </div>
        <button
          onClick={() => router.push("/premium/assessment/tech-tools")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {techStack ? "Update Stack" : "Add Stack"}
        </button>
      </div>

      {techStack ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded p-3">
            <h4 className="font-medium text-gray-700">CRM</h4>
            <p className="text-sm text-gray-600">{getCategoryCount(techStack.crm_tools)} tools</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <h4 className="font-medium text-gray-700">Email Service</h4>
            <p className="text-sm text-gray-600">{getCategoryCount(techStack.esp_tools)} tools</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <h4 className="font-medium text-gray-700">Analytics</h4>
            <p className="text-sm text-gray-600">{getCategoryCount(techStack.analytics_tools)} tools</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <h4 className="font-medium text-gray-700">CDP</h4>
            <p className="text-sm text-gray-600">{getCategoryCount(techStack.cdp_tools)} tools</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <h4 className="font-medium text-gray-700">ERP</h4>
            <p className="text-sm text-gray-600">{getCategoryCount(techStack.erp_tools)} tools</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <h4 className="font-medium text-gray-700">Commerce</h4>
            <p className="text-sm text-gray-600">{getCategoryCount(techStack.commerce_tools)} tools</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No technology stack recorded yet</p>
          <p className="text-sm text-gray-400 mt-2">Click the button above to add your tech stack</p>
        </div>
      )}
    </div>
  );
} 