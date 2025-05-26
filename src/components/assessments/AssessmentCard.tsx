import { formatDistanceToNow } from "date-fns";

type Props = {
  title: string;
  description: string;
  score: number | null;
  lastTakenDate: string | null;
  onClick: () => void;
  assessmentType: string;
  userId: string;
};

export default function AssessmentCard({
  title,
  description,
  score,
  lastTakenDate,
  onClick,
  assessmentType,
  userId
}: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 4.0) return "text-green-500";
    if (score >= 3.5) return "text-yellow-500";
    if (score >= 3.0) return "text-yellow-600";
    if (score >= 2.5) return "text-orange-500";
    if (score >= 2.0) return "text-orange-600";
    return "text-red-500";
  };

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {score !== null && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">Score:</span>
          <span className={`font-semibold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
          </span>
        </div>
      )}
      
      {lastTakenDate && (
        <div className="text-sm text-gray-500">
          Last taken {formatDate(lastTakenDate)}
        </div>
      )}
    </div>
  );
} 