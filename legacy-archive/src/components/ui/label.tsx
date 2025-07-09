// /components/ui/label.tsx
"use client";  
import { cn } from "@/lib/utils";

export function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium text-gray-700", className)} {...props} />
  );
}
