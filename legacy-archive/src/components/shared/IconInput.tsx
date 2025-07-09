// src/components/shared/IconInput.tsx
import { ChangeEvent } from "react";
import { IconType } from "react-icons";

type IconInputProps = {
  icon: IconType;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  maxLength?: number;
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
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
      </div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        type={type}
        className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg"
        required
      />
    </div>
  );
}
