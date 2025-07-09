"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  success,
  required = false,
  disabled = false,
  className = "",
  icon,
  helperText
}: FormSelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const hasSuccess = !!success;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label 
        htmlFor={name}
        className={`block text-sm font-semibold transition-colors duration-200 ${
          hasError 
            ? 'text-red-600' 
            : hasSuccess 
            ? 'text-green-600' 
            : isFocused 
            ? 'text-blue-600' 
            : 'text-gray-700'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Select Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}

        {/* Select Field */}
        <motion.select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none ${
            icon ? 'pl-10' : ''
          } ${
            hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
              : hasSuccess
              ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50'
              : isFocused
              ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-blue-50'
              : 'border-gray-300 focus:border-gray-400 focus:ring-gray-200 bg-white'
          } ${
            disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
          }`}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </motion.select>

        {/* Custom Chevron Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* Error Icon */}
        {hasError && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2"
          >
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          </motion.div>
        )}

        {/* Success Icon */}
        {hasSuccess && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !hasError && !hasSuccess && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {/* Error Message */}
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.p>
      )}

      {/* Success Message */}
      {hasSuccess && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-green-600 flex items-center gap-1"
        >
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          {success}
        </motion.p>
      )}
    </div>
  );
} 