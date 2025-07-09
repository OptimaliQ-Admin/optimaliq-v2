"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface GrowthStudioExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function GrowthStudioExplanationModal({
  isOpen,
  onClose,
  userId
}: GrowthStudioExplanationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLetsGo = async () => {
    setIsLoading(true);
    try {
      // Mark that user has seen the explanation
      const { error } = await supabase
        .from("tier2_profiles")
        .update({ 
          growth_studio_explanation_seen_at: new Date().toISOString() 
        })
        .eq("u_id", userId);

      if (error) {
        console.error("Failed to update growth studio explanation seen:", error);
      }
    } catch (err) {
      console.error("Error updating growth studio explanation seen:", err);
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
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Growth Strategy Lab
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🎯 Growth Levers</h3>
              <p className="text-sm">
                Identify and prioritize the most impactful growth opportunities for your business. See which levers will drive the biggest results.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📊 Quadrant Analysis</h3>
              <p className="text-sm">
                Visualize your business positioning across key dimensions. Understand where you excel and where you need to focus your efforts.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">📈 Trend Analysis</h3>
              <p className="text-sm">
                Track your performance trends over time and identify patterns that can inform your strategic decisions and growth planning.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">🎮 Growth Simulations</h3>
              <p className="text-sm">
                Test different growth scenarios and strategies. See the potential impact of various decisions before implementing them.
              </p>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            This is your strategic playground where you can experiment with different growth approaches, 
            analyze your positioning, and develop data-driven strategies to accelerate your business growth.
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