"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Bars3Icon } from "@heroicons/react/24/outline";

export function SortableItem({ id, index }: { id: string; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (index === 1) return "bg-gradient-to-r from-blue-500 to-indigo-600";
    if (index === 2) return "bg-gradient-to-r from-purple-500 to-pink-600";
    if (index === 3) return "bg-gradient-to-r from-orange-500 to-red-600";
    return "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-white border-2 rounded-xl shadow-lg cursor-move transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
        isDragging ? "opacity-50 shadow-2xl scale-105" : ""
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full ${getPriorityColor(index)} flex items-center justify-center text-white font-bold text-sm`}>
          {index + 1}
        </div>
        <span className="flex-1 text-lg font-medium text-gray-900">{id}</span>
        <div className="text-gray-400 hover:text-gray-600 transition-colors">
          <Bars3Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.li>
  );
}