"use client";

import { useState } from "react";

interface GMFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GMFModal({ isOpen, onClose }: GMFModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🚀 Unlock Your Growth Potential
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Powered by the <span className="font-bold text-blue-600">GMF+ Model</span>, OptimaliQ gives you a clear snapshot of your business maturity—then delivers AI-driven insights, benchmarks, and a 30-day roadmap to help you scale smarter, faster.
          </p>

          <a
            href="/Pricing"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Build with OptimaliQ
          </a>
        </div>
      </div>
    </div>
  );
} 