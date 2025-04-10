"use client";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onValueChange?: (val: number) => void;
}

export function Slider({ className = "", onValueChange, ...props }: SliderProps) {
  return (
    <input
      type="range"
      className={cn("w-full cursor-pointer accent-blue-600", className)}
      onChange={(e) => onValueChange && onValueChange(Number(e.target.value))}
      {...props}
    />
  );
}
