"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface Props {
  question: string;
  description?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  variant?: "cards" | "list";
}

export default function MultipleChoiceQuestion({
  question,
  description,
  options,
  value,
  onChange,
  variant = "cards",
}: Props) {
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

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  if (variant === "cards") {
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
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <motion.label
                key={opt.value}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                  isSelected
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                    : "border-gray-200 hover:border-blue-300 bg-white"
                }`}
                onClick={() => onChange(opt.value)}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-6 h-6 mt-1 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        variants={checkmarkVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.2 }}
                      >
                        <CheckIcon className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-lg font-medium ${
                      isSelected ? "text-gray-900" : "text-gray-800"
                    }`}>
                      {opt.label}
                    </span>
                    {opt.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.label>
            );
          })}
        </motion.div>
      </motion.div>
    );
  }

  // List variant
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
        className="space-y-3"
        variants={containerVariants}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <motion.label
              key={opt.value}
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                  : "border-gray-200 hover:border-blue-300 bg-white"
              }`}
              onClick={() => onChange(opt.value)}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`w-6 h-6 mr-4 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {isSelected && (
                  <motion.div
                    variants={checkmarkVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.2 }}
                  >
                    <CheckIcon className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
              <div className="flex-1">
                <span className={`text-lg font-medium ${
                  isSelected ? "text-gray-900" : "text-gray-800"
                }`}>
                  {opt.label}
                </span>
                {opt.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {opt.description}
                  </p>
                )}
              </div>
            </motion.label>
          );
        })}
      </motion.div>
    </motion.div>
  );
}