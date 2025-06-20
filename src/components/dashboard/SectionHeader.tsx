///src/components/dashboard/SectionHeader.tsx
"use client";

import { motion } from "framer-motion";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
