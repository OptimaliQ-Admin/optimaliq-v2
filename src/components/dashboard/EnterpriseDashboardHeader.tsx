"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import { 
  ChartBarIcon,
  ClockIcon,
  InformationCircleIcon,
  BellIcon,
  CogIcon,
  UserCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface EnterpriseDashboardHeaderProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  refreshInterval?: number;
  onRefresh?: () => void;
  actions?: React.ReactNode;
  className?: string;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  notifications?: number;
}

export default function EnterpriseDashboardHeader({
  title,
  subtitle,
  lastUpdated,
  refreshInterval,
  onRefresh,
  actions,
  className = "",
  user,
  notifications = 0
}: EnterpriseDashboardHeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!headerRef.current) return;
    
    const rect = headerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      ref={headerRef}
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className={`relative group ${className}`}
    >
      {/* Glassmorphism Header */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
        />
        
        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          animate={{
            x: isHovered ? "200%" : "-100%"
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Header Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            {/* Left Side - Title and Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {/* Icon */}
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <ChartBarIcon className="w-8 h-8 text-white" />
                </motion.div>
                
                {/* Title Section */}
                <div className="flex-1">
                  <motion.h1 
                    className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {title}
                  </motion.h1>
                  {subtitle && (
                    <motion.p 
                      className="text-lg text-gray-600 mt-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {subtitle}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <motion.div 
                className="flex items-center gap-6 text-sm text-gray-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
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
              </motion.div>
            </div>

            {/* Right Side - Actions and User */}
            <div className="flex items-center gap-4">
              {/* Refresh Button */}
              {onRefresh && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  <motion.div
                    animate={{ rotate: isRefreshing ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              )}

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-300"
              >
                <BellIcon className="w-5 h-5" />
                {notifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {notifications > 9 ? '9+' : notifications}
                  </motion.div>
                )}
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-300"
              >
                <CogIcon className="w-5 h-5" />
              </motion.button>

              {/* User Profile */}
              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl cursor-pointer"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name || 'User'} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-600" />
                  )}
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </motion.div>
              )}

              {/* Custom Actions */}
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100"
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          rotate: isHovered ? 360 : 0
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />
      
      <motion.div
        className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100"
        animate={{
          scale: isHovered ? [1, 1.3, 1] : 1,
          rotate: isHovered ? -360 : 0
        }}
        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
      />
    </motion.div>
  );
} 