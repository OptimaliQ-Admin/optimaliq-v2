// SectionHeader.tsx
"use client";

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
};

export default function SectionHeader({ title, subtitle, className = "" }: Props) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}
