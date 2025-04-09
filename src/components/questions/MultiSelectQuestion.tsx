"use client";

import React from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  question: string;
  description?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function MultipleChoiceQuestion({
  question,
  description,
  options,
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800">{question}</h2>
      {description && <p className="text-gray-600 mt-1">{description}</p>}

      <div className="mt-4 space-y-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
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