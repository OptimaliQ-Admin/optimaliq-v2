'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeavyChartProps {
  data?: any[];
  title?: string;
  className?: string;
}

export default function HeavyChart({ data = [], title = 'Chart', className = '' }: HeavyChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Chart component loaded dynamically</p>
      </div>
    </motion.div>
  );
} 