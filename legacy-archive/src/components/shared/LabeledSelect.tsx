// 📁 refactor/src/components/shared/LabeledSelect.tsx
import { ChangeEvent } from "react";

type Option = { label: string; value: string };

type Props = {
  label: string;
  name: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[] | string[];
};

export default function LabeledSelect({ label, name, value, onChange, options }: Props) {
  // Auto-wrap string[] into { label, value }[]
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <label className="block group">
      <span className="text-gray-700 font-medium text-sm mb-2 block">{label}</span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full px-4 py-4 border border-gray-200 rounded-xl text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg appearance-none cursor-pointer pr-10"
          required
        >
          <option value="">Select</option>
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </label>
  );
}
