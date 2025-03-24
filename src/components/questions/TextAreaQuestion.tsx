"use client";

import React from "react";

interface Props {
  question: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string; // ✅ Add this
}

export default function TextAreaQuestion({
  question,
  description,
  value,
  onChange,
  placeholder = "Type your answer here...", // ✅ Default fallback
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">{question}</h2>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
      <textarea
        rows={5}
        className="mt-4 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
