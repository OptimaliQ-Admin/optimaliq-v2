//refactor/src/components/shared/IconSelect.tsx
import { IconType } from "react-icons";

export function IconSelect({
  icon: Icon,
  name,
  value,
  onChange,
  options,
}: {
  icon: IconType;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <Icon className="absolute top-3 left-3 text-gray-400" />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 border border-gray-300 rounded p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select {name}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
