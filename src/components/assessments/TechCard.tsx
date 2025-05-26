import { useRouter } from "next/navigation";
import AssessmentCard from "./AssessmentCard";

type Props = {
  score: number | null;
  lastTakenDate: string | null;
  userId: string;
};

export default function TechCard({ score, lastTakenDate, userId }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/premium/assessment/tech");
  };

  return (
    <AssessmentCard
      title="Technology Stack"
      description="Evaluate your technology infrastructure and identify opportunities for improvement."
      score={score}
      lastTakenDate={lastTakenDate}
      onClick={handleClick}
      assessmentType="tech"
      userId={userId}
    />
  );
} 