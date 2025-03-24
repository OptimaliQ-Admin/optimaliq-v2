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
    <div>
      <h2 className="text-xl font-bold text-gray-800">{question}</h2>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
      <div className="mt-4 space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`block p-4 border rounded-lg cursor-pointer transition ${
              value === opt.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input
              type="radio"
              name="multiple-choice"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="hidden"
            />
            <span className="text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
