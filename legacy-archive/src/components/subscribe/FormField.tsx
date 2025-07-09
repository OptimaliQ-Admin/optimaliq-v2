import { ChangeEvent } from "react";

export function Input({
  label,
  name,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block w-full">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full p-3 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </label>
  );
}

export function Select({
  label,
  name,
  value,
  onChange,
  options = [],
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <label className="block w-full">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full p-3 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
