// src/app/growth-assessment/step2/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "src/lib/supabase";
import LabeledInput from "../../../components/shared/LabeledInput";
import LabeledSelect from "../../../components/shared/LabeledSelect";
import SubmitButton from "../../../components/shared/SubmitButton";

import { FaChartLine, FaShieldAlt, FaCheckCircle, FaLightbulb } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function GrowthAssessmentStep2() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [businessResponses, setBusinessResponses] = useState({
    obstacles: "",
    strategy: "",
    process: "",
    customers: "",
    technology: "",
  });

  useEffect(() => {
    const u_id = localStorage.getItem("u_id");
    if (!u_id) {
      setError("User session expired. Please start again.");
      router.push("/growth-assessment");
      return;
    }
    setUserId(u_id);
  }, [router]);

  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBusinessResponses({ ...businessResponses, [e.target.name]: e.target.value });
    setError(null); // Clear any previous errors when user makes changes
  };

  const validateForm = () => {
    const requiredFields = ["obstacles", "strategy", "process", "customers", "technology"];
    const missingFields = requiredFields.filter(field => !businessResponses[field as keyof typeof businessResponses]);
    
    if (missingFields.length > 0) {
      const errorMessage = `Please fill in all required fields: ${missingFields.join(", ")}`;
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!userId) {
      const errorMessage = "User ID is missing. Please start again.";
      toast.error(errorMessage);
      setError(errorMessage);
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Use API endpoint to save assessment data
      const response = await fetch('/api/growth-assessment/save-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          u_id: userId,
          ...businessResponses,
          submittedat: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = `Failed to save responses: ${errorData.error}`;
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.success("Assessment submitted!");
        router.push("/growth-assessment/analyzing");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setCooldown(10);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 p-8 lg:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FaChartLine className="text-sm" />
            <span>Step 2 of 2 – Business Profile</span>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Growth Roadmap</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-4">
            Answer a few quick questions to receive custom insights on how to scale your business effectively.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" />
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Personalized recommendations</span>
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-600 text-sm flex items-center gap-2">
              <FaCheckCircle className="text-red-500" />
              {error}
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LabeledInput 
              label="What are your biggest obstacles to scaling?" 
              name="obstacles" 
              maxLength={250} 
              value={businessResponses.obstacles} 
              onChange={handleChange}
            />
            <LabeledInput 
              label="How does your strategy differentiate you?" 
              name="strategy" 
              maxLength={250} 
              value={businessResponses.strategy} 
              onChange={handleChange}
            />
            <LabeledSelect 
              label="Are your processes optimized for efficiency?" 
              name="process" 
              value={businessResponses.process} 
              onChange={handleChange} 
              options={["Yes", "No"]}
            />
            <LabeledInput 
              label="How well do you understand your customers' needs?" 
              name="customers" 
              maxLength={250} 
              value={businessResponses.customers} 
              onChange={handleChange}
            />
            <div className="lg:col-span-2">
              <LabeledSelect 
                label="Is your technology stack supporting your growth?" 
                name="technology" 
                value={businessResponses.technology} 
                onChange={handleChange} 
                options={["Outdated", "Needs Work", "Optimized", "Cutting Edge"]}
              />
            </div>
          </div>
          
          <SubmitButton isSubmitting={isSubmitting} cooldown={cooldown} type="submit" />
        </form>

        {/* Progress Indicator */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Step 2 of 2</span>
            </span>
            <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
