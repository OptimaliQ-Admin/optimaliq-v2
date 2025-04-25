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
}: Props) {
  return (
    <label className="block">
      <span className="text-gray-700">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="block w-full mt-1 border border-gray-300 rounded p-2 text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </label>
  );
}
