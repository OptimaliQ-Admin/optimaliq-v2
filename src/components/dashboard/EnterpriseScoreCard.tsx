"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  MinusIcon,
  ChartBarIcon,
  StarIcon,
  TrophyIcon,
  BoltIcon,
  TagIcon
} from "@heroicons/react/24/outline";

interface EnterpriseScoreCardProps {
  title: string;
  icon?: string;
  score: number;
  industryAvg?: number;
  topPerformer?: number;
  description?: string;
  onLearnMore?: () => void;
  trend?: number;
  category: 'overall' | 'strategy' | 'process' | 'technology';
}

const categoryConfig = {
  overall: {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    icon: TrophyIcon,
    color: "amber",
    bgGradient: "from-amber-50 to-orange-50"
  },
  strategy: {
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    icon: TagIcon,
    color: "blue",
    bgGradient: "from-blue-50 to-indigo-50"
  },
  process: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    icon: ChartBarIcon,
    color: "emerald",
    bgGradient: "from-emerald-50 to-teal-50"
  },
  technology: {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    icon: BoltIcon,
    color: "violet",
    bgGradient: "from-violet-50 to-purple-50"
  }
};

export default function EnterpriseScoreCard({
  title,
  icon,
  score,
  industryAvg,
  topPerformer,
  description,
  onLearnMore,
  trend = 0,
  category
}: EnterpriseScoreCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const config = categoryConfig[category];
  const IconComponent = config.icon;

  const getPerformanceZone = (value: number, topPerformer: number) => {
    const percentage = (value / topPerformer) * 100;
    if (percentage >= 90) return { 
      zone: "Excellence", 
      color: "#059669", 
      bg: "#d1fae5",
      icon: StarIcon,
      description: "Elite performance level"
    };
    if (percentage >= 75) return { 
      zone: "Competitive", 
      color: "#d97706", 
      bg: "#fef3c7",
      icon: ArrowTrendingUpIcon,
      description: "Strong market position"
    };
    if (percentage >= 60) return { 
      zone: "Developing", 
      color: "#dc2626", 
      bg: "#fee2e2",
      icon: MinusIcon,
      description: "Growth opportunity"
    };
    return { 
      zone: "Needs Focus", 
      color: "#991b1b", 
      bg: "#fecaca",
      icon: ArrowTrendingDownIcon,
      description: "Critical improvement needed"
    };
  };

  const getTrendDirection = (value: number, industryAvg: number) => {
    const diff = value - industryAvg;
    if (diff > 0.5) return { 
      direction: "up", 
      color: "#059669", 
      percentage: Math.round((diff / industryAvg) * 100),
      icon: ArrowTrendingUpIcon
    };
    if (diff < -0.5) return { 
      direction: "down", 
      color: "#dc2626", 
      percentage: Math.round((Math.abs(diff) / industryAvg) * 100),
      icon: ArrowTrendingDownIcon
    };
    return { 
      direction: "stable", 
      color: "#6b7280", 
      percentage: 0,
      icon: MinusIcon
    };
  };

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
  };

  const performanceZone = topPerformer ? getPerformanceZone(score, topPerformer) : null;
  const trend = industryAvg ? getTrendDirection(score, industryAvg) : null;
  const vsTopPerformer = topPerformer ? Math.round((score / topPerformer) * 100) : 0;

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
      className="relative group cursor-pointer"
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
            
            {/* Trend Indicator */}
            {trend && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  trend.direction === "up" ? "bg-green-100 text-green-700" :
                  trend.direction === "down" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}
              >
                <trend.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                  {trend.percentage}%
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Score Display */}
        <div className="relative z-10 text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative"
          >
            <div className={`text-6xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-2`}>
              {score?.toFixed(1)}
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Score</div>
            
            {/* Animated Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, ${config.color === 'amber' ? '#f59e0b' : config.color === 'blue' ? '#3b82f6' : config.color === 'emerald' ? '#10b981' : '#8b5cf6'} ${(score / (topPerformer || 100)) * 360}deg, transparent ${(score / (topPerformer || 100)) * 360}deg)`,
                mask: 'radial-gradient(circle at center, transparent 60%, black 61%)'
              }}
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Performance Metrics */}
        {industryAvg !== undefined && topPerformer !== undefined && (
          <div className="relative z-10 space-y-4 mb-6">
            {/* Performance Zone */}
            {performanceZone && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <performanceZone.icon className="w-4 h-4" style={{ color: performanceZone.color }} />
                  <span className="text-sm font-medium text-gray-700">Performance Zone</span>
                </div>
                <span 
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: performanceZone.bg,
                    color: performanceZone.color
                  }}
                >
                  {performanceZone.zone}
                </span>
              </motion.div>
            )}

            {/* vs Top Performer */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-gray-700">vs Top Performer</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${vsTopPerformer}%` }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">{vsTopPerformer}%</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Action Button */}
        {onLearnMore && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLearnMore}
            className={`relative z-10 w-full py-3 px-6 rounded-2xl bg-gradient-to-r ${config.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
          >
            <span className="flex items-center justify-center gap-2">
              Learn More
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        )}
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