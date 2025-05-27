"use client";

import React, { useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

type QuestionType = "select" | "multi_select" | "text_area";

type QuestionOption = {
  label: string;
  score: number;
};

type Props = {
  question: string;
  description?: string;
  type: QuestionType;
  options?: Record<string, QuestionOption>;
  selected: string | string[];
  onChange: (value: string | string[]) => void;
  maxSelect?: number;
};

export default function DynamicQuestion({
  question,
  description,
  type,
  options,
  selected,
  onChange,
  maxSelect = 3,
}: Props) {
  const [open, setOpen] = useState(false);

  if (type === "text_area") {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{question}</h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
        <div className="mt-4">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            rows={4}
            value={selected as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
          />
        </div>
      </div>
    );
  }

  const optionsArray = Object.entries(options || {}).map(([value, { label }]) => ({
    value,
    label,
  }));

  if (type === "select") {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{question}</h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}

        <div className="mt-4 space-y-2">
          {optionsArray.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-blue-400"
                }`}
                onClick={() => onChange(opt.value)}
              >
                <div
                  className={`w-5 h-5 mr-3 flex items-center justify-center border rounded ${
                    isSelected
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-gray-800">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // Multi-select implementation
  const selectedArray = Array.isArray(selected) ? selected : [];
  
  const toggleOption = (val: string) => {
    if (selectedArray.includes(val)) {
      onChange(selectedArray.filter((v) => v !== val));
    } else {
      if (selectedArray.length >= maxSelect) return;
      onChange([...selectedArray, val]);
    }
  };

  const getSelectedLabels = () => {
    const labels = optionsArray
      .filter((opt) => selectedArray.includes(opt.value))
      .map((opt) => opt.label);
    return labels.length > 0 ? labels.join(", ") : "Select options";
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800">{question}</h2>
      {description && <p className="text-gray-600 mt-1">{description}</p>}

      <div className="relative mt-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full p-3 border rounded-lg text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
        >
          <span className="truncate text-gray-800">{getSelectedLabels()}</span>
          <ChevronUpDownIcon className="w-5 h-5 text-gray-500" />
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {optionsArray.map((opt) => {
              const isSelected = selectedArray.includes(opt.value);
              const disabled = !isSelected && selectedArray.length >= maxSelect;

              return (
                <label
                  key={opt.value}
                  className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={isSelected}
                    onChange={() => toggleOption(opt.value)}
                    disabled={disabled}
                  />
                  <span className="text-gray-800">{opt.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {selectedArray.length >= maxSelect && (
        <p className="text-sm text-gray-500 mt-2 italic">
          You can select up to {maxSelect} items.
        </p>
      )}
    </div>
  );
} 