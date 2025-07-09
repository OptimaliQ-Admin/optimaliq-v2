"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

type Option = {
  value: string;
  label: string;
  icon?: string;
  description?: string;
};

type Props = {
  question: string;
  description?: string;
  options: Option[];
  maxSelect?: number;
  selected: string[];
  onChange: (values: string[]) => void;
  variant?: "cards" | "list" | "grid";
};

export default function EnhancedMultiSelectQuestion({
  question,
  description,
  options,
  selected,
  onChange,
  maxSelect = 3,
  variant = "cards",
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

  const getSelectedLabels = () => {
    const labels = options
      .filter((opt) => selected.includes(opt.value))
      .map((opt) => opt.label);
    return labels.length > 0 ? labels.join(", ") : "Select options";
  };

  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const disabled = !isSelected && selected.length >= maxSelect;

        return (
          <motion.div
            key={opt.value}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`relative group cursor-pointer ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !disabled && toggleOption(opt.value)}
          >
            <div
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{opt.label}</h3>
                  {opt.description && (
                    <p className="text-sm text-gray-600">{opt.description}</p>
                  )}
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 group-hover:border-blue-400"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckIcon className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderList = () => (
    <div className="mt-6 space-y-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const disabled = !isSelected && selected.length >= maxSelect;

        return (
          <motion.div
            key={opt.value}
            whileHover={{ x: 4 }}
            className={`relative group cursor-pointer ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !disabled && toggleOption(opt.value)}
          >
            <div
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{opt.label}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 group-hover:border-blue-400"
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
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{question}</h2>
        {description && (
          <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
        )}
      </div>

      {variant === "cards" ? renderCards() : renderList()}

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
        >
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-green-700">
              {selected.length} selected
            </span>
            {maxSelect && ` (max ${maxSelect})`}
          </p>
        </motion.div>
      )}

      {selected.length >= maxSelect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm text-amber-800">
            You can select up to {maxSelect} items.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
} 