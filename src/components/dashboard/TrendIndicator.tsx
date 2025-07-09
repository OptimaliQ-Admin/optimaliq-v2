"use client";

import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "@heroicons/react/24/solid";

interface TrendIndicatorProps {
  trend: "up" | "down" | "neutral";
  value: number;
  format?: "percentage" | "number" | "currency";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export default function TrendIndicator({
  trend,
  value,
  format = "percentage",
  size = "md",
  showValue = true,
  className = ""
}: TrendIndicatorProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const getTrendConfig = () => {
    switch (trend) {
      case "up":
        return {
          icon: ArrowUpIcon,
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-200"
        };
      case "down":
        return {
          icon: ArrowDownIcon,
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-200"
        };
      case "neutral":
        return {
          icon: MinusIcon,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200"
        };
    }
  };

  const formatValue = (val: number) => {
    switch (format) {
      case "percentage":
        return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
      case "currency":
        return `${val > 0 ? '+' : ''}$${Math.abs(val).toLocaleString()}`;
      case "number":
        return `${val > 0 ? '+' : ''}${val.toLocaleString()}`;
      default:
        return val.toString();
    }
  };

  const config = getTrendConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Trend Icon */}
      <div className={`${sizeClasses[size]} ${config.bgColor} ${config.borderColor} border rounded-full flex items-center justify-center`}>
        <IconComponent className={`${iconSizes[size]} ${config.color}`} />
      </div>

      {/* Value */}
      {showValue && (
        <motion.span
          className={`${textSizes[size]} font-semibold ${config.color}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {formatValue(value)}
        </motion.span>
      )}
    </motion.div>
  );
} 