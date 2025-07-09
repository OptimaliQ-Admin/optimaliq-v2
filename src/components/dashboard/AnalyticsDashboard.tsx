'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnalyticsDashboardProps {
  metrics?: any[];
  className?: string;
}

export default function AnalyticsDashboard({ metrics = [], className = '' }: AnalyticsDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-500">Analytics component loaded dynamically</p>
        </div>
      </div>
    </motion.div>
  );
} 