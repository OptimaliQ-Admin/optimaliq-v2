"use client";

type ScoreCardProps = {
  title: string;
  score: number;
  benchmark?: number;
  description?: string;
  onLearnMore?: () => void;
};

export default function ScoreCard({
  title,
  score,
  benchmark,
  description,
  onLearnMore,
}: ScoreCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-blue-600">{score?.toFixed(1)}</p>
        {benchmark !== undefined && (
          <p className="text-sm text-gray-500 mt-1">Benchmark: {benchmark.toFixed(1)}</p>
        )}
        {description && (
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        )}
      </div>
      {onLearnMore && (
        <button
          onClick={onLearnMore}
          className="text-sm text-blue-600 mt-4 font-medium hover:underline self-start"
        >
          Learn more →
        </button>
      )}
    </div>
  );
}
