import { useRouter } from "next/navigation";
import AssessmentCard from "./AssessmentCard";

type Props = {
  score: number | null;
  lastTakenDate: string | null;
  userId: string;
};

export default function BPMCard({ score, lastTakenDate, userId }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/premium/assessment/bpm");
  };

  return (
    <AssessmentCard
      title="Business Process Management"
      description="Evaluate and optimize your business processes for maximum efficiency and effectiveness."
      score={score}
      lastTakenDate={lastTakenDate}
      onClick={handleClick}
      assessmentType="bpm"
      userId={userId}
    />
  );
} 