// src/components/shared/IconInput.tsx
import { ChangeEvent } from "react";
import { IconType } from "react-icons";

type IconInputProps = {
  icon: IconType;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  maxLength?: number; // ✅ Add this
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function IconInput({
  icon: Icon,
  name,
  value,
  placeholder,
  type = "text",
  maxLength,
  onChange,
}: IconInputProps) {
  return (
    <div className="relative">
      <Icon className="absolute top-3 left-3 text-gray-400" />
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength} // ✅ Use it here
        type={type}
        className="block w-full pl-10 border border-gray-300 rounded p-2 text-black"
        required
      />
    </div>
  );
}
