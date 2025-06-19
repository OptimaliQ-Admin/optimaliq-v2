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
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200 col-span-1 lg:col-span-2">
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
          <div className="text-center mb-6">
            <div className="inline-block mb-4">
              <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            <p className="text-gray-800 italic mb-4 text-base leading-relaxed font-medium">
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
          
          {/* Trust indicators */}
          <div className="flex justify-center items-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Verified User</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Real Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 