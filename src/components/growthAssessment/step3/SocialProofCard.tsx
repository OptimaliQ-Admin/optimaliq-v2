"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-blue-200 p-8 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">What Others Are Saying</h3>
            <p className="text-sm text-gray-500">Join 2,000+ satisfied customers</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
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
        {/* Background decorative elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="text-center space-y-6">
            {/* Quote */}
            <div className="relative">
              <svg className="absolute -top-2 -left-2 w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-gray-800 text-lg leading-relaxed font-medium px-8">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>
            </div>
            
            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-bold">
                  {testimonials[currentIndex].name.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <p className="text-gray-900 font-semibold">{testimonials[currentIndex].name}</p>
                <p className="text-gray-600 text-sm">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Trust indicators */}
      <div className="mt-8 pt-6 border-t border-blue-200">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified customer
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Real results
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Recent success
          </span>
        </div>
      </div>
    </motion.div>
  );
} 