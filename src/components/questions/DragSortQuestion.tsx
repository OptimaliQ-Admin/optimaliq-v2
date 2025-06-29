"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

type Props = {
  question: string;
  description?: string;
  items: string[];
  onChange: (newOrder: string[]) => void;
};

export default function DragSortQuestion({
  question,
  description,
  items,
  onChange,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-2xl font-bold text-gray-900 mb-2"
        variants={itemVariants}
      >
        {question}
      </motion.h2>
      {description && (
        <motion.p 
          className="text-gray-600 mb-6 text-lg"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      )}

      <motion.div
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Priority Ranking</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Most Important</span>
            <span className="mx-2">→</span>
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Least Important</span>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item, index) => (
                <SortableItem key={item} id={item} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </motion.div>
    </motion.div>
  );
}