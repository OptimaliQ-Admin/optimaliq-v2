import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

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

  const getButtonText = () => {
    if (!lastTakenDate) return "Start Assessment";
    
    const lastTaken = new Date(lastTakenDate);
    const daysSinceLastTaken = Math.floor(
      (Date.now() - lastTaken.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastTaken >= 30) return "Retake Assessment";
    return "View Results";
  };

  const handleClick = () => {
    router.push(`/premium/assessment/${slug}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {(score !== undefined && score !== null) && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-500">Score:</span>
          <span className="ml-2 text-lg font-semibold text-blue-600">
            {score.toFixed(1)}
          </span>
        </div>
      )}
      
      {lastTakenDate && (
        <div className="mb-4 text-sm text-gray-500">
          Last taken {formatDistanceToNow(new Date(lastTakenDate), { addSuffix: true })}
        </div>
      )}
      
      <button
        onClick={handleClick}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
      >
        {getButtonText()}
      </button>
    </div>
  );
} 