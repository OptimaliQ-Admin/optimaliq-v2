'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DataTableProps {
  data?: any[];
  columns?: Array<{ key: string; header: string }>;
  className?: string;
}

export default function DataTable({ data = [], columns = [], className = '' }: DataTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Data Table</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-500">Data table component loaded dynamically</p>
      </div>
    </motion.div>
  );
} 