"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  TrophyIcon,
  StarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";

interface PerformanceMetric {
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  description: string;
  color: string;
  icon?: React.ComponentType<any>;
}

interface EnterprisePerformanceSummaryProps {
  metrics: PerformanceMetric[];
  className?: string;
}

export default function EnterprisePerformanceSummary({
  metrics,
  className = ""
}: EnterprisePerformanceSummaryProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
    setSelectedMetric(null);
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend) return <MinusIcon className="w-4 h-4 text-gray-500" />;
    if (trend > 0) return <ArrowUpIcon className="w-4 h-4 text-green-600" />;
    return <ArrowDownIcon className="w-4 h-4 text-red-600" />;
  };

  const getTrendColor = (trend?: number) => {
    if (!trend) return "text-gray-500";
    if (trend > 0) return "text-green-600";
    return "text-red-600";
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
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
      {/* Glassmorphism Container */}
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

        {/* Header */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <ChartBarIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Performance Summary</h3>
              <p className="text-gray-600">Key metrics and performance indicators</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              onClick={() => setSelectedMetric(selectedMetric === index ? null : index)}
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedMetric === index 
                  ? 'bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg' 
                  : 'bg-gray-50/50 hover:bg-gray-100/50'
              }`}
            >
              {/* Metric Icon */}
              {metric.icon && (
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${metric.color}20` }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                </motion.div>
              )}

              {/* Metric Value */}
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {metric.value.toLocaleString()}
                  </span>
                  {metric.unit && (
                    <span className="text-lg text-gray-500">{metric.unit}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {getTrendIcon(metric.trend)}
                  {metric.trend && (
                    <span className={`text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                      {metric.trend > 0 ? '+' : ''}{metric.trend}%
                    </span>
                  )}
                </div>
              </div>

              {/* Metric Label */}
              <h4 className="font-semibold text-gray-900 mb-2">{metric.label}</h4>

              {/* Metric Description */}
              <motion.p 
                className="text-sm text-gray-600 leading-relaxed"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: selectedMetric === index ? "auto" : "1.5rem",
                  opacity: selectedMetric === index ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
              >
                {metric.description}
              </motion.p>

              {/* Expand/Collapse Indicator */}
              <motion.div
                animate={{ rotate: selectedMetric === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 text-gray-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>

              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent"
                style={{
                  background: `linear-gradient(45deg, ${metric.color}40, transparent, ${metric.color}40)`,
                  backgroundSize: '200% 200%'
                }}
                animate={{
                  backgroundPosition: isHovered ? ['0% 0%', '100% 100%', '0% 0%'] : '0% 0%'
                }}
                transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Summary Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mt-8 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                Performance Overview
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {metrics.length} key metrics tracked
              </span>
            </div>
          </div>
        </motion.div>
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