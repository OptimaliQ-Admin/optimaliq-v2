"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface InsightItem {
  label: string;
  detail: string;
  type: 'strength' | 'improvement';
}

interface EnterpriseInsightCardProps {
  title: string;
  items: InsightItem[];
  icon: string;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

export default function EnterpriseInsightCard({
  title,
  items,
  icon,
  color
}: EnterpriseInsightCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          title: 'text-green-900'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          title: 'text-red-900'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-900'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          title: 'text-yellow-900'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-900'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-sm border ${colorClasses.border} p-6 hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 ${colorClasses.bg} rounded-xl flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{items.length} insights</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex-shrink-0 mt-1">
              {item.type === 'strength' ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{item.label}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-400 text-xl">📊</span>
          </div>
          <p className="text-gray-500 text-sm">No insights available</p>
        </div>
      )}
    </motion.div>
  );
} 