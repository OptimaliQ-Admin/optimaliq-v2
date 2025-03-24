"use client";

import React from "react";

type Option = {
    value: string;
    label: string;
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
  const toggleSelect = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      if (selected.length >= maxSelect) return;
      onChange([...selected, val]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">{question}</h2>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`block p-3 border rounded-lg cursor-pointer transition ${
              selected.includes(opt.value)
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
            onClick={() => toggleSelect(opt.value)}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={selected.includes(opt.value)}
              readOnly
            />
            <span className="text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
      {selected.length >= maxSelect && (
        <p className="text-sm text-gray-500 mt-2 italic">
          You can select up to {maxSelect} items.
        </p>
      )}
    </div>
  );
}
