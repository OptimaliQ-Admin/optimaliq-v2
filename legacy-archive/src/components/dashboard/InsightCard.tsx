//src/components/dashboard/InsightCard.tsx
"use client";

import { motion } from "framer-motion";
import SectionTitleBar from "./SectionTitleBar";

interface InsightItem {
  label: string;
  detail: string;
}

interface InsightCardProps {
  title: string;
  items: InsightItem[];
}

export default function InsightCard({ title, items }: InsightCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full"
    >
      <SectionTitleBar title={title} />
      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:bg-blue-600 transition-colors duration-200"></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm leading-relaxed group-hover:text-blue-600 transition-colors duration-200">
                  {item.label}
                </h4>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
            {index < items.length - 1 && (
              <div className="absolute left-1 top-6 w-px h-8 bg-gray-200 group-hover:bg-blue-200 transition-colors duration-200"></div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {items.length} actionable insights
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>
    </motion.div>
  );
}