// 📁 refactor/src/components/shared/LabeledSelect.tsx
import { ChangeEvent } from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
};

export default function LabeledSelect({ label, name, value, onChange, options }: Props) {
  return (
    <label className="block">
      <span className="text-gray-700">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full mt-1 border border-gray-300 rounded p-2"
        required
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
