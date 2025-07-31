"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { usePremiumUser } from "@/context/PremiumUserContext";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Lever {
  text: string;
  isCompleted: boolean;
}

export default function GrowthLeversCard() {
  const { user } = usePremiumUser();
  const [levers, setLevers] = useState<Lever[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (user?.id) {
      fetchLevers();
    }
  }, [user?.id]);

  const fetchLevers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/growth_studio/levers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_id: user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch growth levers");
      }

      const data = await response.json();
      setLevers(data.levers);
    } catch (err) {
      console.error("Error fetching levers:", err);
      setError(err instanceof Error ? err.message : "Failed to load growth levers");
    } finally {
      setLoading(false);
    }
  };

  const handleLeverToggle = async (index: number) => {
    if (!user?.id) return;

    // Optimistically update the UI
    const updatedLevers = [...levers];
    const newStatus = !updatedLevers[index].isCompleted;
    updatedLevers[index].isCompleted = newStatus;
    setLevers(updatedLevers);

    try {
      // Use API endpoint to update lever progress
      const response = await fetch('/api/growth_studio/levers/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          u_id: user.id,
          lever_text: updatedLevers[index].text,
          is_completed: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lever progress');
      }
    } catch (err) {
      console.error("Error updating lever:", err);
      // Revert the change if the update failed
      const updatedLevers = [...levers];
      updatedLevers[index].isCompleted = !updatedLevers[index].isCompleted;
      setLevers(updatedLevers);
    }
  };

  const completedCount = levers.filter(lever => lever.isCompleted).length;
  const progressPercentage = levers.length > 0 ? (completedCount / levers.length) * 100 : 0;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🔍 Generating Your Growth Levers
            </h3>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed">
              Analyzing your business performance to identify the most impactful growth opportunities tailored to your industry and current position.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="text-center text-red-600">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <p className="font-semibold mb-2">Error Loading Growth Levers</p>
          <p className="text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader title="🚀 Growth Levers" subtitle="Key actions to accelerate your growth. Track your progress and celebrate wins." />

      {/* Progress Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{completedCount}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Progress Overview</h4>
              <p className="text-xs text-gray-600">{completedCount} of {levers.length} levers completed</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full shadow-sm"
          />
        </div>
      </div>

      {/* Growth Levers List */}
      <div className="space-y-3">
        {levers.map((lever, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`group relative p-4 rounded-lg border transition-all duration-200 ${
              lever.isCompleted
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Checkbox
                  id={`lever-${index}`}
                  checked={lever.isCompleted}
                  onCheckedChange={() => handleLeverToggle(index)}
                  className={`mt-1 transition-all duration-200 ${
                    lever.isCompleted 
                      ? "border-green-500 bg-green-500" 
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                />
                {lever.isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1">
                <label
                  htmlFor={`lever-${index}`}
                  className={`text-sm leading-relaxed cursor-pointer transition-all duration-200 ${
                    lever.isCompleted 
                      ? "text-green-700 line-through" 
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {lever.text}
                </label>
                
                {/* Lever Status Badge */}
                <div className="mt-2">
                  {lever.isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Celebration */}
      {completedCount === levers.length && levers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎉</span>
            </div>
            <div>
              <h4 className="font-semibold text-green-900">All Growth Levers Completed!</h4>
              <p className="text-sm text-green-700">Excellent work! You&apos;ve completed all your growth initiatives. Consider taking a reassessment to unlock new opportunities.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            AI-powered recommendations
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>

      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
    </motion.div>
  );
} 