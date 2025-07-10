"use client";

import { motion } from "framer-motion";
import { GlobeAltIcon, ChartBarIcon } from "@heroicons/react/24/outline";

interface EnterpriseMarketCardProps {
  industry: string;
}

export default function EnterpriseMarketCard({ industry }: EnterpriseMarketCardProps) {
  const marketInsights = [
    {
      title: "Market Size",
      value: "$2.4T",
      change: "+12%",
      description: "Global market opportunity"
    },
    {
      title: "Growth Rate",
      value: "8.2%",
      change: "+0.5%",
      description: "Annual growth projection"
    },
    {
      title: "Competition",
      value: "High",
      change: "Stable",
      description: "Competitive landscape"
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
          <h3 className="text-lg font-semibold text-gray-900">Market Intelligence</h3>
          <p className="text-sm text-gray-500 capitalize">{industry} industry</p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <GlobeAltIcon className="w-5 h-5 text-green-600" />
        </div>
      </div>

      <div className="space-y-4">
        {marketInsights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {insight.change}
                </span>
              </div>
              <p className="text-xs text-gray-600">{insight.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{insight.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-900">Market Sentiment</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">Positive</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-2 bg-green-500 rounded-full"
          />
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm">
          View Market Report
        </button>
      </div>
    </motion.div>
  );
} 