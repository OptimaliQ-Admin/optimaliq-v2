"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg" | "xl";
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
}

interface DashboardCardProps {
  children: ReactNode;
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function DashboardGrid({ 
  children, 
  className = "", 
  gap = "lg",
  columns = 12 
}: DashboardGridProps) {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-6", 
    lg: "gap-8",
    xl: "gap-10"
  };

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    12: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function DashboardCard({ 
  children, 
  span = 1, 
  className = "",
  onClick,
  interactive = false
}: DashboardCardProps) {
  const spanClasses = {
    1: "col-span-1",
    2: "col-span-1 md:col-span-2",
    3: "col-span-1 md:col-span-2 lg:col-span-3",
    4: "col-span-1 md:col-span-2 lg:col-span-4",
    6: "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-6",
    12: "col-span-full"
  };

  return (
    <motion.div
      className={`${spanClasses[span]} ${className}`}
      whileHover={interactive ? { scale: 1.02, y: -2 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
} 