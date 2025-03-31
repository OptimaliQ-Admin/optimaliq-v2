"use client";

type InsightItem = {
  label: string;
  detail: string;
};

type InsightCardProps = {
  title: string;
  items: InsightItem[];
};

export default function InsightCard({ title, items }: InsightCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {items.length > 0 ? (
          items.map((item, i) => (
            <li key={i}>
              <strong>{item.label}:</strong> {item.detail}
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic">No data available.</li>
        )}
      </ul>
    </div>
  );
}
