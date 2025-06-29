"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

type Option = {
  value: string;
  label: string;
  description?: string;
};

type Props = {
  question: string;
  description?: string;
  options: Option[];
  maxSelect?: number;
  selected: string[];
  onChange: (values: string[]) => void;
};

export default function MultiSelectQuestion({
  question,
  description,
  options,
  selected,
  onChange,
  maxSelect = 3,
}: Props) {
  const [open, setOpen] = useState(false);

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

  const getSelectedLabels = () => {
    const labels = options
      .filter((opt) => selected.includes(opt.value))
      .map((opt) => opt.label);
    return labels.length > 0 ? labels.join(", ") : "Select options";
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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
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
          className="text-gray-600 mb-4 text-lg"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      )}

      {/* Selection Counter */}
      {selected.length > 0 && (
        <motion.div
          className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-green-800 font-medium">
              {selected.length} selected {maxSelect > 0 && `(max ${maxSelect})`}
            </span>
            <button
              onClick={() => onChange([])}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              Clear all
            </button>
          </div>
        </motion.div>
      )}

      {/* Selected Items Display */}
      {selected.length > 0 && (
        <motion.div
          className="mb-4 flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {selected.map((value) => {
            const option = options.find(opt => opt.value === value);
            return (
              <motion.div
                key={value}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <span>{option?.label}</span>
                <button
                  onClick={() => removeOption(value)}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <motion.div 
        className="relative"
        variants={itemVariants}
      >
        <button
          onClick={() => setOpen(!open)}
          className={`w-full p-4 border-2 rounded-xl text-left bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 flex justify-between items-center ${
            open
              ? "border-blue-500 shadow-lg"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <span className={`truncate ${
            selected.length > 0 ? "text-gray-900" : "text-gray-500"
          }`}>
            {getSelectedLabels()}
          </span>
          <ChevronUpDownIcon 
            className={`w-5 h-5 transition-transform duration-200 ${
              open ? "rotate-180 text-blue-500" : "text-gray-400"
            }`} 
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute z-10 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {options.map((opt) => {
                const isSelected = selected.includes(opt.value);
                const disabled = !isSelected && selected.length >= maxSelect;

                return (
                  <motion.label
                    key={opt.value}
                    className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    } ${isSelected ? "bg-blue-50" : ""}`}
                    whileHover={!disabled ? { backgroundColor: "#f8fafc" } : {}}
                  >
                    <div
                      className={`w-5 h-5 mr-3 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                    >
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
                      <span className={`font-medium ${
                        isSelected ? "text-blue-900" : "text-gray-800"
                      }`}>
                        {opt.label}
                      </span>
                      {opt.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {opt.description}
                        </p>
                      )}
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Selection Limit Warning */}
      {selected.length >= maxSelect && (
        <motion.p
          className="text-sm text-amber-600 mt-3 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ⚠️ You can select up to {maxSelect} items.
        </motion.p>
      )}
    </motion.div>
  );
}