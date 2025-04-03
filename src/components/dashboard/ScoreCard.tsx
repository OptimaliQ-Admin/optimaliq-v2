"use client";

type ScoreCardProps = {
  title: string;
  score: number;
  industryAvg?: number;
  topPerformer?: number;
  description?: string;
  onLearnMore?: () => void;
};

export default function ScoreCard({
  title,
  score,
  industryAvg,
  topPerformer,
  description,
  onLearnMore,
}: ScoreCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-blue-600">{score?.toFixed(1)}</p>

        {industryAvg !== undefined && (
          <p className="text-sm text-gray-500 mt-1">
            Industry Avg: {industryAvg.toFixed(1)}{" "}
            {topPerformer !== undefined && (
              <span className="ml-2">| Top Performers: {topPerformer.toFixed(1)}</span>
            )}
          </p>
        )}

        {description && (
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        )}
      </div>

      {onLearnMore && (
        <button
        onClick={() => {
          console.log(`🚀 Learn More clicked for: ${title}`);
          onLearnMore?.();
        }}
        className="text-sm text-blue-600 mt-4 font-medium hover:underline self-start"
      >
        Learn more →
      </button>      
      )}
    </div>
  );
}
