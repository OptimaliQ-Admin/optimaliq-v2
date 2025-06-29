"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  SparklesIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  RocketLaunchIcon 
} from "@heroicons/react/24/outline";
import React from "react";

const analyzingSteps = [
  {
    icon: ChartBarIcon,
    title: "Analyzing your metrics",
    description: "Processing your growth data and performance indicators"
  },
  {
    icon: LightBulbIcon,
    title: "Identifying opportunities",
    description: "Finding high-impact growth levers for your business"
  },
  {
    icon: RocketLaunchIcon,
    title: "Building your strategy",
    description: "Creating your personalized growth roadmap"
  }
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        progressRef.current = newProgress;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          // Redirect to dashboard after completion
          setTimeout(() => {
            router.push("/premium/dashboard");
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Update current step based on progress
    const stepInterval = setInterval(() => {
      const currentProgress = progressRef.current;
      if (currentProgress < 30) {
        setCurrentStep(0);
      } else if (currentProgress < 70) {
        setCurrentStep(1);
      } else {
        setCurrentStep(2);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Analyzing Your Business
          </h1>
          <p className="text-lg text-gray-600">
            We&apos;re building your personalized growth strategy
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-600">{Math.round(progress)}% Complete</p>
        </div>

        {/* Current Step */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
              {React.createElement(analyzingSteps[currentStep].icon, { className: "w-6 h-6 text-white" })}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {analyzingSteps[currentStep].title}
            </h2>
          </div>
          <p className="text-gray-600">{analyzingSteps[currentStep].description}</p>
        </motion.div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? "bg-blue-500" : "bg-gray-300"
              }`}
              animate={{
                scale: index === currentStep ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: index === currentStep ? Infinity : 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 