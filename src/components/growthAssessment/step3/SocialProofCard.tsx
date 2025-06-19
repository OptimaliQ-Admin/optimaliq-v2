"use client";

import { useState, useEffect } from "react";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

const testimonials = [
  {
    name: "Katie",
    quote: "OptimaliQ helped us identify 3 key bottlenecks we didn't know existed. Our growth rate increased 40% in 6 months.",
    role: "CTO, E-commerce Platform"
  },
  {
    name: "Marcus",
    quote: "The AI insights were spot-on. We implemented their recommendations and saw 25% revenue growth in just 3 months.",
    role: "Founder, Tech Startup"
  },
  {
    name: "Sarah",
    quote: "Finally, a tool that gives us actionable insights instead of just data. Our team is more focused and productive.",
    role: "CEO, SaaS Company"
  }
];

export default function SocialProofCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <SectionTitleBar title="💬 What Others Are Saying" />
        <div className="flex space-x-1">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 scale-125 shadow-md' 
                  : 'bg-blue-300 hover:bg-blue-400'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative">
        {/* Animated background element */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-indigo-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <div className="text-center">
            <p className="text-gray-800 italic mb-4 text-sm leading-relaxed font-medium">
              &ldquo;{testimonials[currentIndex].quote}&rdquo;
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {testimonials[currentIndex].name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-semibold">{testimonials[currentIndex].name}</p>
                <p className="text-gray-500 text-xs">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 