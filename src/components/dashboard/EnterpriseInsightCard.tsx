"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import { 
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";

interface InsightItem {
  label: string;
  detail: string;
  priority?: 'high' | 'medium' | 'low';
  impact?: 'positive' | 'negative' | 'neutral';
}

interface EnterpriseInsightCardProps {
  title: string;
  items: InsightItem[];
  type?: 'strengths' | 'weaknesses' | 'opportunities' | 'threats' | 'roadmap';
  onItemClick?: (item: InsightItem) => void;
}

const typeConfig = {
  strengths: {
    gradient: "from-emerald-500 to-green-600",
    bgGradient: "from-emerald-50 to-green-50",
    icon: CheckCircleIcon,
    color: "emerald",
    accent: "#10b981"
  },
  weaknesses: {
    gradient: "from-red-500 to-pink-600",
    bgGradient: "from-red-50 to-pink-50",
    icon: ExclamationTriangleIcon,
    color: "red",
    accent: "#ef4444"
  },
  opportunities: {
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    icon: LightBulbIcon,
    color: "blue",
    accent: "#3b82f6"
  },
  threats: {
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-50 to-red-50",
    icon: ExclamationTriangleIcon,
    color: "orange",
    accent: "#f97316"
  },
  roadmap: {
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-50 to-violet-50",
    icon: RocketLaunchIcon,
    color: "purple",
    accent: "#8b5cf6"
  }
};

export default function EnterpriseInsightCard({
  title,
  items,
  type = 'strengths',
  onItemClick
}: EnterpriseInsightCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
    setSelectedItem(null);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getImpactIcon = (impact?: string) => {
    switch (impact) {
      case 'positive': return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
      case 'negative': return <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />;
      default: return <SparklesIcon className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
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
      className="relative group h-full"
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden h-full">
        {/* Animated Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
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
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{items.length} insights available</p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="relative z-10 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ 
                scale: 1.02,
                x: 5,
                transition: { duration: 0.2 }
              }}
              onClick={() => {
                setSelectedItem(selectedItem === index ? null : index);
                onItemClick?.(item);
              }}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedItem === index 
                  ? 'bg-gradient-to-r from-gray-100 to-gray-200 shadow-md' 
                  : 'bg-gray-50/50 hover:bg-gray-100/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                      {item.label}
                    </h4>
                    {item.priority && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                      />
                    )}
                    {item.impact && getImpactIcon(item.impact)}
                  </div>
                  
                  <motion.p 
                    className="text-sm text-gray-600 leading-relaxed"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: selectedItem === index ? "auto" : "1.5rem",
                      opacity: selectedItem === index ? 1 : 0.7
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.detail}
                  </motion.p>
                </div>
                
                {/* Expand/Collapse Indicator */}
                <motion.div
                  animate={{ rotate: selectedItem === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mt-6"
        >
          <button
            onClick={() => onItemClick?.(items[0])}
            className={`w-full py-3 px-6 rounded-2xl bg-gradient-to-r ${config.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
          >
            <span className="flex items-center justify-center gap-2">
              View Details
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </button>
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
    </motion.div>
  );
} 