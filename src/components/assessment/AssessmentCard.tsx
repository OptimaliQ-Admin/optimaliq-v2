import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";

type AssessmentCardProps = {
  slug: string;
  title: string;
  description: string;
  score?: number | null;
  lastTakenDate?: string | null;
  userId?: string;
};

export default function AssessmentCard({
  slug,
  title,
  description,
  score,
  lastTakenDate,
  userId
}: AssessmentCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/premium/assessment/${slug}`);
  };

  const hasTaken = score !== null && lastTakenDate !== null;
  const daysSinceLastTaken =
    lastTakenDate
      ? differenceInDays(new Date(), new Date(lastTakenDate))
      : null;
  const needsRetake = daysSinceLastTaken !== null && daysSinceLastTaken >= 30;
  const roundedScore = score ? Math.floor(score * 2) / 2 : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      {/* Never Taken */}
      {!hasTaken && (
        <>
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Start Assessment
          </button>
        </>
      )}

      {/* Taken within 30 days */}
      {hasTaken && !needsRetake && (
        <>
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Score:</span>
            <span className="ml-2 text-lg font-semibold text-blue-600">
              {roundedScore?.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
          </p>
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            View Results
          </button>
        </>
      )}

      {/* Taken over 30 days ago */}
      {hasTaken && needsRetake && (
        <>
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Score:</span>
            <span className="ml-2 text-lg font-semibold text-blue-600">
              {roundedScore?.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
          </p>
          <p className="text-yellow-700 mb-4">
            Your last assessment is over 30 days old. Retake it to reflect recent changes.
          </p>
          <button
            onClick={handleClick}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Retake Assessment
          </button>
        </>
      )}
    </div>
  );
}
