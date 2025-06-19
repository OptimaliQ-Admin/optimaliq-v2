"use client";

import { useState, useEffect } from "react";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

const testimonials = [
  {
    quote: "OptimaliQ helped us identify 3 key bottlenecks we didn't know existed. Our growth rate increased 40% in 6 months.",
    role: "CEO, SaaS Company"
  },
  {
    quote: "The AI insights were spot-on. We implemented their recommendations and saw 25% revenue growth in just 3 months.",
    role: "Founder, Tech Startup"
  },
  {
    quote: "Finally, a tool that gives us actionable insights instead of just data. Our team is more focused and productive.",
    role: "CTO, E-commerce Platform"
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
    <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      <SectionTitleBar title="💬 What Others Are Saying" />
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center">
          <p className="text-gray-700 italic mb-4 text-sm leading-relaxed">
            &ldquo;{testimonials[currentIndex].quote}&rdquo;
          </p>
          <p className="text-gray-500 text-xs">- {testimonials[currentIndex].role}</p>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 