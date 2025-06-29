"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  ChevronUpDownIcon, 
  XMarkIcon,
  CheckIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Option = {
  value: string;
  label: string;
  icon?: string;
  category?: string;
};

type Props = {
  question: string;
  description?: string;
  options: Option[];
  maxSelect?: number;
  selected: string[];
  onChange: (values: string[]) => void;
  showCategories?: boolean;
  allowReorder?: boolean;
};

// Sortable Item Component
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'z-50' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

export default function MultiSelectQuestion({
  question,
  description,
  options,
  selected,
  onChange,
  maxSelect = 10,
  showCategories = false,
  allowReorder = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      if (selected.length >= maxSelect) return;
      onChange([...selected, val]);
    }
  };

  const removeOption = (val: string) => {
    onChange(selected.filter((v) => v !== val));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = selected.indexOf(active.id as string);
      const newIndex = selected.indexOf(over?.id as string);
      onChange(arrayMove(selected, oldIndex, newIndex));
    }
  };

  const getSelectedLabels = () => {
    const labels = options
      .filter((opt) => selected.includes(opt.value))
      .map((opt) => opt.label);
    return labels.length > 0 ? labels.join(", ") : "Select options";
  };

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(opt => selected.includes(opt.value));

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Question Header */}
      <div className="mb-6">
        <motion.h2 
          className="text-2xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {question}
        </motion.h2>
        {description && (
          <motion.p 
            className="text-gray-600 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Selected Items Display */}
      {selected.length > 0 && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Selected ({selected.length}/{maxSelect})
            </span>
          </div>

          {allowReorder ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={selected} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {selectedOptions.map((option, index) => (
                    <SortableItem key={option.value} id={option.value}>
                      <motion.div
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{option.label}</p>
                            {option.category && (
                              <p className="text-xs text-gray-500">{option.category}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeOption(option.value)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </motion.div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  <button
                    onClick={() => removeOption(option.value)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Selection Interface */}
      <div className="relative">
        <motion.button
          onClick={() => setOpen(!open)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-left bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 flex justify-between items-center hover:border-blue-300 transition-all duration-200"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-700 font-medium">
              {selected.length === 0 ? "Select options" : `Add more (${selected.length}/${maxSelect})`}
            </span>
          </div>
          <ChevronUpDownIcon className="w-5 h-5 text-gray-500" />
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-hidden"
            >
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Options List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.map((opt) => {
                  const isSelected = selected.includes(opt.value);
                  const disabled = !isSelected && selected.length >= maxSelect;

                  return (
                    <motion.label
                      key={opt.value}
                      className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        disabled ? "opacity-50 cursor-not-allowed" : ""
                      } ${isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
                      whileHover={!disabled ? { backgroundColor: "#f8fafc" } : {}}
                      whileTap={!disabled ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected 
                            ? "bg-blue-500 border-blue-500" 
                            : "border-gray-300 hover:border-blue-400"
                        }`}>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CheckIcon className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`font-medium ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                            {opt.label}
                          </span>
                          {opt.category && (
                            <span className="text-xs text-gray-500 ml-2">• {opt.category}</span>
                          )}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleOption(opt.value)}
                        disabled={disabled}
                      />
                    </motion.label>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  {selected.length >= maxSelect 
                    ? `Maximum ${maxSelect} selections reached`
                    : `${selected.length} of ${maxSelect} selected`
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      {selected.length >= maxSelect && (
        <motion.p 
          className="text-sm text-amber-600 mt-3 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          You can select up to {maxSelect} items. Remove some selections to add more.
        </motion.p>
      )}
    </motion.div>
  );
}