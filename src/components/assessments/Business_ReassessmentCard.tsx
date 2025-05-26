import { useRouter } from "next/navigation";
import AssessmentCard from "./AssessmentCard";

type Props = {
  score: number | null;
  lastTakenDate: string | null;
  userId: string;
};

export default function Business_ReassessmentCard({ score, lastTakenDate, userId }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/premium/assessment/business_reassessment");
  };

  return (
    <AssessmentCard
      title="Business Reassessment"
      description="Reassess your business performance and track progress over time."
      score={score}
      lastTakenDate={lastTakenDate}
      onClick={handleClick}
      assessmentType="business_reassessment"
      userId={userId}
    />
  );
} 