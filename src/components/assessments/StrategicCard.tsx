import { useRouter } from "next/navigation";
import AssessmentCard from "./AssessmentCard";

type Props = {
  score: number | null;
  lastTakenDate: string | null;
  userId: string;
};

export default function StrategicCard({ score, lastTakenDate, userId }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/premium/assessment/strategic");
  };

  return (
    <AssessmentCard
      title="Strategic Planning"
      description="Assess your strategic planning capabilities and identify areas for growth."
      score={score}
      lastTakenDate={lastTakenDate}
      onClick={handleClick}
      assessmentType="strategic"
      userId={userId}
    />
  );
} 