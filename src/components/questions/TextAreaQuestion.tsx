"use client";

import React from "react";

interface Props {
  question: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function TextAreaQuestion({
  question,
  description,
  value,
  onChange,
  placeholder = "Type your answer here...",
  maxLength = 300,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800">{question}</h2>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
      <textarea
        rows={4}
        className="mt-4 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <p className="text-sm text-gray-500 mt-1 text-right">
        {value.length} / {maxLength} characters
      </p>
    </div>
  );
}