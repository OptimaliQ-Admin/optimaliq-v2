import { useState, ChangeEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  showRequirements?: boolean;
  showMatchError?: boolean;
  matchValue?: string;
}

const requirements = [
  { label: "At least 12 characters", test: (v: string) => v.length >= 12 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
  { label: "One symbol", test: (v: string) => /[\W_]/.test(v) },
];

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter password",
  required = true,
  autoComplete = "new-password",
  showRequirements = false,
  showMatchError = false,
  matchValue = "",
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const allValid = requirements.every((r) => r.test(value));
  const passwordsMatch = !showMatchError || value === matchValue;

  return (
    <label className="block w-full">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="block w-full mt-1 border border-gray-300 rounded p-2 pr-10 text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={() => setShow((s) => !s)}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {showRequirements && (
        <ul className="mt-2 mb-1 text-xs text-gray-600 space-y-1">
          {requirements.map((r) => (
            <li key={r.label} className={r.test(value) ? "text-green-600" : "text-gray-500"}>
              <span className="mr-1">{r.test(value) ? "✓" : "•"}</span>
              {r.label}
            </li>
          ))}
        </ul>
      )}
      {showMatchError && value && matchValue !== undefined && value !== matchValue && (
        <div className="text-xs text-red-600 mt-1">Passwords do not match</div>
      )}
    </label>
  );
} 