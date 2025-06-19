"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AssessmentExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function AssessmentExplanationModal({
  isOpen,
  onClose,
  userId
}: AssessmentExplanationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLetsGo = async () => {
    setIsLoading(true);
    try {
      // Mark that user has seen the explanation
      const { error } = await supabase
        .from("tier2_profiles")
        .update({ 
          assessment_explanation_seen_at: new Date().toISOString() 
        })
        .eq("u_id", userId);

      if (error) {
        console.error("Failed to update assessment explanation seen:", error);
      }
    } catch (err) {
      console.error("Error updating assessment explanation seen:", err);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            How Your Score Works
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 mb-6">
          <p>
            Your OptimaliQ score is designed to evolve as your business grows.
          </p>
          
          <p>
            Each assessment you take—whether it's Strategy, Sales, Tech, or others—adds new insights that refine your overall score. The more you complete, the more personalized and accurate your benchmarks and recommendations become.
          </p>
          
          <p>
            We adjust your score dynamically to reflect your progress across different areas. That means your score isn't fixed—it improves as you build strength across key business dimensions.
          </p>
          
          <p>
            Every assessment is tailored to where you are today. As your score improves, future questions will adapt to challenge and guide your growth more strategically.
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