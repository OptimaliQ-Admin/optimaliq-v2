"use client";

import { motion } from "framer-motion";

interface EnterpriseChartProps {
  data: any[];
  type: 'line' | 'funnel' | 'bar';
  height: number;
}

export default function EnterpriseChart({
  data,
  type,
  height
}: EnterpriseChartProps) {
  const renderPlaceholderChart = () => {
    switch (type) {
      case 'line':
        return (
          <div className="relative w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M0,150 L50,120 L100,140 L150,100 L200,80 L250,90 L300,60 L350,40 L400,20"
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,150 L50,120 L100,140 L150,100 L200,80 L250,90 L300,60 L350,40 L400,20 L400,200 L0,200 Z"
                fill="url(#lineGradient)"
              />
            </svg>
          </div>
        );
      
      case 'funnel':
        return (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3/4 h-8 bg-blue-500 rounded-t-lg"></div>
            <div className="w-2/3 h-8 bg-blue-400 rounded"></div>
            <div className="w-1/2 h-8 bg-blue-300 rounded"></div>
            <div className="w-1/3 h-8 bg-blue-200 rounded-b-lg"></div>
          </div>
        );
      
      case 'bar':
        return (
          <div className="flex items-end justify-around h-full space-x-2">
            <div className="w-8 bg-blue-500 rounded-t" style={{ height: '60%' }}></div>
            <div className="w-8 bg-blue-400 rounded-t" style={{ height: '80%' }}></div>
            <div className="w-8 bg-blue-500 rounded-t" style={{ height: '40%' }}></div>
            <div className="w-8 bg-blue-400 rounded-t" style={{ height: '90%' }}></div>
            <div className="w-8 bg-blue-500 rounded-t" style={{ height: '70%' }}></div>
            <div className="w-8 bg-blue-400 rounded-t" style={{ height: '50%' }}></div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-2xl">📊</span>
              </div>
              <p className="text-gray-500 text-sm">Chart data loading...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ height: `${height}px` }}
    >
      {renderPlaceholderChart()}
    </motion.div>
  );
} 