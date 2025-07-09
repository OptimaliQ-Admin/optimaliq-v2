"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { showToast } from "@/lib/utils/toast";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  footerText?: string;
  className?: string;
  variant?: "default" | "minimal" | "hero";
  source?: string;
}

export default function NewsletterSignup({
  title = "Ready to Unlock Your Growth Potential?",
  description = "Get your comprehensive growth report and personalized strategic recommendations in minutes.",
  placeholder = "Enter your email",
  buttonText = "Get My Free Report",
  footerText = "Join 500+ executives. No spam, unsubscribe anytime.",
  className = "",
  variant = "default",
  source = "blog_newsletter"
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success(data.message);
        setEmail("");
      } else {
        showToast.error(data.error || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      showToast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (variant) {
      case "minimal":
        return (
          <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Inter']">
              {title}
            </h3>
            <p className="text-gray-600 mb-4 text-sm font-['Inter']">
              {description}
            </p>
            
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Inter']"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-['Inter']"
              >
                {loading ? "Subscribing..." : buttonText}
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-3 font-['Inter']">
              {footerText}
            </p>
          </div>
        );

      case "hero":
        return (
          <div className={`bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center relative overflow-hidden ${className}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Stay Updated
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-['Inter'] text-gray-900">
                {title}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-['Inter']">
                {description}
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 border border-gray-300 font-['Inter']"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-['Inter']"
                >
                  {loading ? "Subscribing..." : buttonText}
                </button>
              </form>
              
              <p className="text-sm text-gray-500 mt-4 font-['Inter']">
                {footerText}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 ${className}`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 font-['Inter']">
                {title}
              </h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto font-['Inter']">
                {description}
              </p>
              
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3 mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Inter']"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-['Inter']"
                  >
                    {loading ? "Subscribing..." : buttonText}
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 font-['Inter']">
                  {footerText}
                </p>
              </form>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {renderContent()}
    </motion.div>
  );
} 