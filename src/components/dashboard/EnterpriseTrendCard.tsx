"use client";

import { motion } from "framer-motion";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

export default function EnterpriseTrendCard() {
  const trends = [
    {
      title: "Digital Transformation",
      value: "+23%",
      trend: "up",
      description: "Accelerating adoption across industries"
    },
    {
      title: "AI Integration",
      value: "+18%",
      trend: "up",
      description: "Growing investment in AI solutions"
    },
    {
      title: "Remote Work",
      value: "-5%",
      trend: "down",
      description: "Stabilizing after pandemic surge"
    },
    {
      title: "Sustainability",
      value: "+31%",
      trend: "up",
      description: "Increasing focus on ESG initiatives"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Business Trends</h3>
          <p className="text-sm text-gray-500">Industry-wide insights</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-blue-600 text-lg">📈</span>
        </div>
      </div>

      <div className="space-y-4">
        {trends.map((trend, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900">{trend.title}</h4>
                <div className="flex items-center space-x-1">
                  {trend.trend === "up" ? (
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${
                    trend.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {trend.value}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600">{trend.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm">
          View All Trends
        </button>
      </div>
    </motion.div>
  );
} 