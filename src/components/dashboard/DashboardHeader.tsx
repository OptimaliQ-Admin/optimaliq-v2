"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  ClockIcon, 
  ArrowPathIcon, 
  ChartBarIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  lastUpdated?: Date;
  refreshInterval?: number;
  onRefresh?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
  lastUpdated,
  refreshInterval,
  onRefresh,
  actions,
  className = ""
}: DashboardHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between">
        {/* Header Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {lastUpdated && (
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}
            
            {refreshInterval && (
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="w-4 h-4" />
                <span>Auto-refresh every {Math.floor(refreshInterval / 60000)} minutes</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {onRefresh && (
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 ${
                isRefreshing ? 'cursor-not-allowed opacity-50' : ''
              }`}
              whileHover={!isRefreshing ? { scale: 1.05 } : {}}
              whileTap={!isRefreshing ? { scale: 0.95 } : {}}
            >
              <ArrowPathIcon className={`w-5 h-5 text-gray-600 ${
                isRefreshing ? 'animate-spin' : ''
              }`} />
            </motion.button>
          )}
          
          {actions}
        </div>
      </div>

      {/* Progress Bar for Auto-refresh */}
      {refreshInterval && (
        <div className="mt-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ 
                duration: refreshInterval / 1000, 
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
} 