"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function DashboardExplanationModal({
  isOpen,
  onClose,
  userId
}: DashboardExplanationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLetsGo = async () => {
    setIsLoading(true);
    try {
      // Mark that user has seen the explanation
      const { error } = await supabase
        .from("tier2_profiles")
        .update({ 
          dashboard_explanation_seen_at: new Date().toISOString() 
        })
        .eq("u_id", userId);

      if (error) {
        console.error("Failed to update dashboard explanation seen:", error);
      }
    } catch (err) {
      console.error("Error updating dashboard explanation seen:", err);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📈</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Growth Command Center
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📊 Executive Radar</h3>
              <p className="text-sm">
                Real-time view of your business performance across all key dimensions. Track your progress and identify areas needing attention.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">🎯 Growth Projections</h3>
              <p className="text-sm">
                AI-powered forecasts showing your growth trajectory and potential outcomes based on current performance and market trends.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">📈 Business Trends</h3>
              <p className="text-sm">
                Industry insights and market intelligence to keep you ahead of the curve and identify emerging opportunities.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">📋 Marketing Playbook</h3>
              <p className="text-sm">
                Personalized marketing strategies and tactics tailored to your business stage and growth objectives.
              </p>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            This dashboard updates in real-time as you complete assessments and your business evolves. 
            The more data you provide, the more personalized and actionable your insights become.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLetsGo}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            {isLoading ? "Loading..." : "Let's GO"}
          </button>
        </div>
      </div>
    </div>
  );
} 