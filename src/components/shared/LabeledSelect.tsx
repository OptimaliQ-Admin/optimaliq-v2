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
    <label className="block">
      <span className="text-gray-700">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full mt-1 border border-gray-300 rounded p-2 text-black"
        required
      >
        <option value="">Select</option>
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
