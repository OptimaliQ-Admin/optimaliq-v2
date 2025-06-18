//src/components/dashboard/InsightCard.tsx
"use client";

import { Card } from "@/components/ui/card";
import SectionTitleBar from "./SectionTitleBar";

interface InsightItem {
  label: string;
  detail: string;
}

interface InsightCardProps {
  title: string;
  items: InsightItem[];
}

export default function InsightCard({ title, items }: InsightCardProps) {
  return (
    <Card className="p-6 shadow-md bg-white rounded-lg">
      <SectionTitleBar title={title} />
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <h4 className="font-semibold text-gray-800">{item.label}</h4>
            <p className="text-gray-600 text-sm mt-1">{item.detail}</p>
          </div>
        ))}
    </div>
    </Card>
  );
}