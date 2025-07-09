// 📁 refactor/src/components/shared/LabeledInput.tsx
import { ChangeEvent } from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  type?: string;
  readOnly?: boolean;
};

export default function LabeledInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
  maxLength,
}: Props) {
  return (
    <label className="block group">
      <span className="text-gray-700 font-medium text-sm mb-2 block">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        maxLength={maxLength}
        className="block w-full px-4 py-4 border border-gray-200 rounded-xl text-gray-900 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
        required
      />
    </label>
  );
}
