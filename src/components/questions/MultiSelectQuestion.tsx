"use client";

import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

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
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              const disabled = !isSelected && selected.length >= maxSelect;

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

      {selected.length >= maxSelect && (
        <p className="text-sm text-gray-500 mt-2 italic">
          You can select up to {maxSelect} items.
        </p>
      )}
    </div>
  );
}