"use client";

type ScoreCardProps = {
  title: string;
  score: number;
  benchmark?: number;
};

export default function ScoreCard({ title, score, benchmark }: ScoreCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <h3 className="text-md font-semibold text-gray-700">{title}</h3>
      <p className="text-4xl font-bold text-blue-600 mt-2">{score.toFixed(1)} / 5</p>
      {benchmark !== undefined && (
        <p className="text-sm text-gray-500 mt-1">
          Industry Avg: {benchmark.toFixed(1)} / 5
        </p>
      )}
    </div>
  );
}
