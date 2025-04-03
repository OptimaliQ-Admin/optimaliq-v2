"use client";

type ScoreCardProps = {
  title: string;
  score: number;
  benchmark?: number;
  onClick?: () => void;
};

export default function ScoreCard({ title, score, benchmark, onClick }: ScoreCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-${onClick ? "pointer" : "default"} p-4 bg-white rounded-lg shadow transition hover:shadow-md`}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{score}</p>
      {benchmark !== undefined && (
        <p className="text-sm text-gray-500 mt-1">Benchmark: {benchmark}</p>
      )}
    </div>
  );
}

