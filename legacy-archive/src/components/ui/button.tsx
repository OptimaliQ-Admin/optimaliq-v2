// /components/ui/button.tsx
"use client";  
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function Button({ 
  className = "", 
  variant = "default",
  size = "md",
  ...props 
}: ButtonProps) {
  const baseClasses = "rounded-md transition text-sm font-medium";
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
